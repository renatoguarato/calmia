-- Migration to enable cascading deletes for feelings_log and its related data

-- 1. Update suggested_actions to cascade delete when feelings_log is deleted
-- First, drop the existing constraint. We try to use the likely name, but also generic naming just in case.
ALTER TABLE public.suggested_actions
DROP CONSTRAINT IF EXISTS suggested_actions_feeling_log_id_fkey;

-- Add the new constraint with ON DELETE CASCADE
ALTER TABLE public.suggested_actions
ADD CONSTRAINT suggested_actions_feeling_log_id_fkey
FOREIGN KEY (feeling_log_id)
REFERENCES public.feelings_log(id)
ON DELETE CASCADE;

-- 2. Ensure action_feedback cascade delete when suggested_actions is deleted
-- (This updates/recreates the constraint to ensure it has ON DELETE CASCADE)
ALTER TABLE public.action_feedback
DROP CONSTRAINT IF EXISTS action_feedback_suggested_action_id_fkey;

ALTER TABLE public.action_feedback
ADD CONSTRAINT action_feedback_suggested_action_id_fkey
FOREIGN KEY (suggested_action_id)
REFERENCES public.suggested_actions(id)
ON DELETE CASCADE;
