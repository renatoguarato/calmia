-- Add ai_response column to feelings_log to store the full JSON output
ALTER TABLE public.feelings_log ADD COLUMN IF NOT EXISTS ai_response JSONB;

-- Add columns to suggested_actions for detailed actionable items
ALTER TABLE public.suggested_actions ADD COLUMN IF NOT EXISTS title TEXT;
ALTER TABLE public.suggested_actions ADD COLUMN IF NOT EXISTS estimated_time TEXT;
ALTER TABLE public.suggested_actions ADD COLUMN IF NOT EXISTS steps JSONB; -- Stores array of steps
ALTER TABLE public.suggested_actions ADD COLUMN IF NOT EXISTS why_it_helps TEXT;
ALTER TABLE public.suggested_actions ADD COLUMN IF NOT EXISTS action_type TEXT DEFAULT 'immediate'; -- 'immediate' or 'routine'
