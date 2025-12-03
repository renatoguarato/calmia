create extension if not exists pg_cron;
create extension if not exists pg_net;

select
  cron.schedule(
    'daily-notification-job',
    '0 13 * * *',
    $$
    select
      net.http_post(
          url:='https://aqfvkjhqhxafztsytwcn.supabase.co/functions/v1/daily-notification-job',
          headers:='{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFxZnZramhxaHhhZnp0c3l0d2NuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQzMjQwNDEsImV4cCI6MjA3OTkwMDA0MX0.II2GlMioT9tLm4c3H6HOPp9_6KZL6KiA6zYMegKvTgE"}'::jsonb,
          body:='{}'::jsonb
      ) as request_id;
    $$
  );
