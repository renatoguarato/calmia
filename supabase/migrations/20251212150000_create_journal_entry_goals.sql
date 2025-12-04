CREATE TABLE IF NOT EXISTS public.journal_entry_goals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    feeling_log_id UUID NOT NULL REFERENCES public.feelings_log(id) ON DELETE CASCADE,
    wellbeing_goal_id UUID NOT NULL REFERENCES public.wellbeing_goals(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE(feeling_log_id, wellbeing_goal_id)
);

-- RLS
ALTER TABLE public.journal_entry_goals ENABLE ROW LEVEL SECURITY;

-- Policies
-- Users can view links if they own the journal entry
CREATE POLICY "Users can view own journal goals" ON public.journal_entry_goals
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.feelings_log
            WHERE feelings_log.id = journal_entry_goals.feeling_log_id
            AND feelings_log.user_id = auth.uid()
        )
    );

-- Users can insert links if they own the journal entry (and implicitly the goal due to application logic, but could enforce both)
CREATE POLICY "Users can insert own journal goals" ON public.journal_entry_goals
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.feelings_log
            WHERE feelings_log.id = journal_entry_goals.feeling_log_id
            AND feelings_log.user_id = auth.uid()
        )
    );

-- Users can delete links if they own the journal entry
CREATE POLICY "Users can delete own journal goals" ON public.journal_entry_goals
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM public.feelings_log
            WHERE feelings_log.id = journal_entry_goals.feeling_log_id
            AND feelings_log.user_id = auth.uid()
        )
    );
