-- Migration: Add Stripe fields for payment integration
-- Description: Adds stripe_customer_id to profiles and stripe fields to subscriptions

-- Add stripe_customer_id to profiles
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT UNIQUE;

-- Add Stripe fields to subscriptions
ALTER TABLE public.subscriptions
ADD COLUMN IF NOT EXISTS stripe_subscription_id TEXT UNIQUE,
ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT,
ADD COLUMN IF NOT EXISTS current_period_start TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS current_period_end TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS cancel_at_period_end BOOLEAN DEFAULT FALSE;

-- Update status constraint to include Stripe statuses
ALTER TABLE public.subscriptions
DROP CONSTRAINT IF EXISTS subscriptions_status_check;

ALTER TABLE public.subscriptions
ADD CONSTRAINT subscriptions_status_check
CHECK (status IN ('active', 'cancelled', 'canceled', 'expired', 'past_due', 'trialing', 'incomplete'));

-- Index for Stripe lookups
CREATE INDEX IF NOT EXISTS idx_subscriptions_stripe_subscription_id
ON public.subscriptions(stripe_subscription_id);

CREATE INDEX IF NOT EXISTS idx_profiles_stripe_customer_id
ON public.profiles(stripe_customer_id);

-- Comment
COMMENT ON COLUMN public.profiles.stripe_customer_id IS 'Stripe customer ID for payment processing';
COMMENT ON COLUMN public.subscriptions.stripe_subscription_id IS 'Stripe subscription ID';
COMMENT ON COLUMN public.subscriptions.cancel_at_period_end IS 'Whether subscription will cancel at end of current period';
