import { useState } from 'react'
import { supabase } from '../lib/supabase'

// Stripe Price IDs
export const STRIPE_PRICES = {
  pro: 'price_1Sow53K7Yon7d585HdHNbLgS',
  business: 'price_1Sow6DK7Yon7d585RsV1cflP',
}

export function useStripe() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const createCheckoutSession = async (plan: 'pro' | 'business') => {
    setLoading(true)
    setError(null)

    try {
      const { data: { session } } = await supabase.auth.getSession()

      if (!session) {
        throw new Error('Vous devez etre connecte pour souscrire')
      }

      const priceId = STRIPE_PRICES[plan]

      const response = await supabase.functions.invoke('create-checkout-session', {
        body: { priceId, plan },
      })

      if (response.error) {
        throw new Error(response.error.message)
      }

      const { url } = response.data

      if (url) {
        window.location.href = url
      } else {
        throw new Error('Impossible de creer la session de paiement')
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erreur lors du paiement'
      setError(message)
      console.error('Checkout error:', err)
    } finally {
      setLoading(false)
    }
  }

  const openCustomerPortal = async () => {
    setLoading(true)
    setError(null)

    try {
      const { data: { session } } = await supabase.auth.getSession()

      if (!session) {
        throw new Error('Vous devez etre connecte')
      }

      const response = await supabase.functions.invoke('customer-portal', {})

      if (response.error) {
        throw new Error(response.error.message)
      }

      const { url } = response.data

      if (url) {
        window.location.href = url
      } else {
        throw new Error('Impossible d\'ouvrir le portail client')
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erreur lors de l\'ouverture du portail'
      setError(message)
      console.error('Portal error:', err)
    } finally {
      setLoading(false)
    }
  }

  return {
    loading,
    error,
    createCheckoutSession,
    openCustomerPortal,
  }
}
