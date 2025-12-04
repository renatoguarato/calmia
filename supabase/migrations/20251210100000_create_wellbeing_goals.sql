CREATE TABLE IF NOT EXISTS public.wellbeing_goals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    goal_type TEXT NOT NULL CHECK (goal_type IN ('feelings', 'actions_completed')),
    target_value INTEGER NOT NULL CHECK (target_value > 0),
    time_period TEXT NOT NULL CHECK (time_period IN ('daily', 'weekly', 'monthly', 'custom')),
    feeling_category_target TEXT,
    start_date DATE NOT NULL DEFAULT CURRENT_DATE,
    end_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- RLS
ALTER TABLE public.wellbeing_goals ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own goals" ON public.wellbeing_goals;
CREATE POLICY "Users can view own goals" ON public.wellbeing_goals
    FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own goals" ON public.wellbeing_goals;
CREATE POLICY "Users can insert own goals" ON public.wellbeing_goals
    FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own goals" ON public.wellbeing_goals;
CREATE POLICY "Users can update own goals" ON public.wellbeing_goals
    FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own goals" ON public.wellbeing_goals;
CREATE POLICY "Users can delete own goals" ON public.wellbeing_goals
    FOR DELETE USING (auth.uid() = user_id);

-- Trigger for updated_at
CREATE OR REPLACE FUNCTION update_wellbeing_goals_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_wellbeing_goals_updated_at ON public.wellbeing_goals;
CREATE TRIGGER update_wellbeing_goals_updated_at
    BEFORE UPDATE ON public.wellbeing_goals
    FOR EACH ROW
    EXECUTE PROCEDURE update_wellbeing_goals_updated_at();
