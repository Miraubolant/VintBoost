-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Schedule cleanup job to run daily at 3:00 AM UTC
-- Note: This migration has been applied. The service_role key is configured in production.
SELECT cron.schedule(
  'cleanup-expired-videos',
  '0 3 * * *',
  $$
  SELECT net.http_post(
    url := 'https://mkzhgzvtvsezqlpesdgc.supabase.co/functions/v1/cleanup-expired-videos',
    headers := '{"Authorization": "Bearer <SERVICE_ROLE_KEY>"}'::jsonb
  );
  $$
);
