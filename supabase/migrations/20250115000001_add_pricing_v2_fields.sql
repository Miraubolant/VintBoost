-- Migration: Add pricing v2 fields
-- Description: Support for Pack Pro (one-time) vs Business (subscription) and video expiration

-- Add new columns to subscriptions table
ALTER TABLE public.subscriptions
  ADD COLUMN IF NOT EXISTS plan_type TEXT DEFAULT 'free' CHECK (plan_type IN ('free', 'one_time', 'subscription')),
  ADD COLUMN IF NOT EXISTS max_articles INTEGER DEFAULT 5,
  ADD COLUMN IF NOT EXISTS storage_days INTEGER DEFAULT 1;

-- Add expires_at to user_videos table
ALTER TABLE public.user_videos
  ADD COLUMN IF NOT EXISTS expires_at TIMESTAMPTZ;

-- Create index for efficient expired video cleanup
CREATE INDEX IF NOT EXISTS idx_user_videos_expires_at ON public.user_videos(expires_at);

-- Update existing subscriptions with correct values based on plan
UPDATE public.subscriptions
SET
  plan_type = CASE
    WHEN plan = 'free' THEN 'free'
    WHEN plan = 'pro' THEN 'one_time'
    WHEN plan = 'business' THEN 'subscription'
  END,
  max_articles = CASE
    WHEN plan = 'free' THEN 5
    WHEN plan = 'pro' THEN 10
    WHEN plan = 'business' THEN 20
  END,
  storage_days = CASE
    WHEN plan = 'free' THEN 1
    WHEN plan = 'pro' THEN 7
    WHEN plan = 'business' THEN 30
  END
WHERE plan_type IS NULL OR plan_type = 'free';

-- Update existing videos to have expires_at based on user's current plan storage_days
UPDATE public.user_videos v
SET expires_at = v.created_at + (s.storage_days || ' days')::INTERVAL
FROM public.subscriptions s
WHERE v.user_id = s.user_id AND v.expires_at IS NULL;

-- For videos without subscription (shouldn't happen, but safety), set 1 day expiration
UPDATE public.user_videos
SET expires_at = created_at + INTERVAL '1 day'
WHERE expires_at IS NULL;

-- Comment updates
COMMENT ON COLUMN public.subscriptions.plan_type IS 'Type of plan: free, one_time (Pack Pro), subscription (Business)';
COMMENT ON COLUMN public.subscriptions.max_articles IS 'Maximum articles per video (5, 10, or 20)';
COMMENT ON COLUMN public.subscriptions.storage_days IS 'Video retention days (1, 7, or 30)';
COMMENT ON COLUMN public.user_videos.expires_at IS 'Auto-deletion timestamp based on plan storage_days';
