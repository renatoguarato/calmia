-- Add DELETE policy for feelings_log
DROP POLICY IF EXISTS "Users can delete own feelings" ON public.feelings_log;
CREATE POLICY "Users can delete own feelings" ON public.feelings_log
    FOR DELETE USING (auth.uid() = user_id);

-- Add DELETE policy for suggested_actions
DROP POLICY IF EXISTS "Users can delete own actions" ON public.suggested_actions;
CREATE POLICY "Users can delete own actions" ON public.suggested_actions
    FOR DELETE USING (auth.uid() = user_id);

-- Add DELETE policy for action_feedback
DROP POLICY IF EXISTS "Users can delete own feedback" ON public.action_feedback;
CREATE POLICY "Users can delete own feedback" ON public.action_feedback
    FOR DELETE USING (auth.uid() = user_id);
