import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import Stripe from 'https://esm.sh/stripe@14.21.0?target=deno'

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') as string, {
  apiVersion: '2023-10-16',
  httpClient: Stripe.createFetchHttpClient(),
})

const cryptoProvider = Stripe.createSubtleCryptoProvider()

// Plan configuration
const PLAN_CONFIG: Record<string, {
  videosLimit: number
  maxArticles: number
  storageDays: number
  planType: 'free' | 'one_time' | 'subscription'
}> = {
  'pro': { videosLimit: 5, maxArticles: 10, storageDays: 7, planType: 'one_time' },
  'business': { videosLimit: 15, maxArticles: 20, storageDays: 30, planType: 'subscription' },
  'free': { videosLimit: 1, maxArticles: 5, storageDays: 1, planType: 'free' },
}

serve(async (req) => {
  const signature = req.headers.get('Stripe-Signature')
  if (!signature) {
    return new Response('No signature', { status: 400 })
  }

  const body = await req.text()
  let event: Stripe.Event

  try {
    event = await stripe.webhooks.constructEventAsync(
      body,
      signature,
      Deno.env.get('STRIPE_WEBHOOK_SECRET') as string,
      undefined,
      cryptoProvider
    )
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message)
    return new Response(`Webhook Error: ${err.message}`, { status: 400 })
  }

  // Create Supabase admin client
  const supabaseAdmin = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  )

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        const userId = session.metadata?.supabase_user_id
        const plan = session.metadata?.plan || 'pro'
        const isOneTime = session.metadata?.is_one_time === 'true'

        if (!userId) {
          console.error('No user ID in session metadata')
          break
        }

        const planConfig = PLAN_CONFIG[plan] || PLAN_CONFIG['pro']

        if (isOneTime || session.mode === 'payment') {
          // One-time payment (Pack Pro)
          // Get current subscription to preserve any existing credits
          const { data: existingSub } = await supabaseAdmin
            .from('subscriptions')
            .select('videos_used, videos_limit')
            .eq('user_id', userId)
            .single()

          // Add videos to the user's account (doesn't expire like subscription)
          const currentVideosLimit = existingSub?.videos_limit || 0
          const currentVideosUsed = existingSub?.videos_used || 0

          await supabaseAdmin
            .from('subscriptions')
            .upsert({
              user_id: userId,
              stripe_customer_id: session.customer as string,
              plan: plan,
              plan_type: planConfig.planType,
              status: 'active',
              videos_limit: currentVideosLimit + planConfig.videosLimit,
              videos_used: currentVideosUsed,
              max_articles: planConfig.maxArticles,
              storage_days: planConfig.storageDays,
            }, {
              onConflict: 'user_id',
            })

          console.log(`One-time pack ${plan} activated for user ${userId}: +${planConfig.videosLimit} videos`)
        } else if (session.subscription) {
          // Subscription payment (Business)
          const subscription = await stripe.subscriptions.retrieve(
            session.subscription as string
          )

          await supabaseAdmin
            .from('subscriptions')
            .upsert({
              user_id: userId,
              stripe_subscription_id: subscription.id,
              stripe_customer_id: session.customer as string,
              plan: plan,
              plan_type: planConfig.planType,
              status: subscription.status,
              current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
              current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
              videos_limit: planConfig.videosLimit,
              videos_used: 0,
              max_articles: planConfig.maxArticles,
              storage_days: planConfig.storageDays,
            }, {
              onConflict: 'user_id',
            })

          console.log(`Subscription ${plan} created for user ${userId}`)
        }
        break
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription
        const userId = subscription.metadata?.supabase_user_id
        const plan = subscription.metadata?.plan || 'business'

        if (userId) {
          const planConfig = PLAN_CONFIG[plan] || PLAN_CONFIG['business']

          await supabaseAdmin
            .from('subscriptions')
            .update({
              status: subscription.status,
              plan: plan,
              plan_type: planConfig.planType,
              current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
              current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
              videos_limit: planConfig.videosLimit,
              max_articles: planConfig.maxArticles,
              storage_days: planConfig.storageDays,
              cancel_at_period_end: subscription.cancel_at_period_end,
            })
            .eq('stripe_subscription_id', subscription.id)

          console.log(`Subscription updated for user ${userId}`)
        }
        break
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription
        const freeConfig = PLAN_CONFIG['free']

        // Reset to free plan
        await supabaseAdmin
          .from('subscriptions')
          .update({
            status: 'canceled',
            plan: 'free',
            plan_type: freeConfig.planType,
            videos_limit: freeConfig.videosLimit,
            max_articles: freeConfig.maxArticles,
            storage_days: freeConfig.storageDays,
            cancel_at_period_end: false,
            stripe_subscription_id: null,
          })
          .eq('stripe_subscription_id', subscription.id)

        console.log(`Subscription canceled: ${subscription.id}`)
        break
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice

        if (invoice.subscription && invoice.billing_reason === 'subscription_cycle') {
          // Reset videos_used at the start of new billing period
          await supabaseAdmin
            .from('subscriptions')
            .update({ videos_used: 0 })
            .eq('stripe_subscription_id', invoice.subscription as string)

          console.log(`Reset videos_used for subscription: ${invoice.subscription}`)
        }
        break
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice

        if (invoice.subscription) {
          await supabaseAdmin
            .from('subscriptions')
            .update({ status: 'past_due' })
            .eq('stripe_subscription_id', invoice.subscription as string)

          console.log(`Payment failed for subscription: ${invoice.subscription}`)
        }
        break
      }

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    console.error('Error processing webhook:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500 }
    )
  }
})
