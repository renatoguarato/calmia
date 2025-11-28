-- Create profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    name TEXT NOT NULL,
    profession TEXT,
    time_in_company TEXT,
    date_of_birth DATE,
    gender TEXT,
    existing_diseases TEXT,
    medications TEXT,
    emergency_contact_name TEXT,
    emergency_contact_phone TEXT,
    ai_data_consent BOOLEAN DEFAULT true NOT NULL
);

-- Create feelings_log table
CREATE TABLE IF NOT EXISTS public.feelings_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    feeling_description TEXT NOT NULL,
    feeling_category TEXT
);

-- Create suggested_actions table
CREATE TABLE IF NOT EXISTS public.suggested_actions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    feeling_log_id UUID REFERENCES public.feelings_log(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    action_description TEXT NOT NULL,
    action_category TEXT,
    is_completed BOOLEAN DEFAULT false NOT NULL,
    completed_at TIMESTAMP WITH TIME ZONE
);

-- Create action_feedback table
CREATE TABLE IF NOT EXISTS public.action_feedback (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    suggested_action_id UUID NOT NULL REFERENCES public.suggested_actions(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    feedback_type TEXT NOT NULL,
    feedback_details TEXT
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feelings_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.suggested_actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.action_feedback ENABLE ROW LEVEL SECURITY;

-- Policies for profiles
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
CREATE POLICY "Users can view own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
CREATE POLICY "Users can insert own profile" ON public.profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Policies for feelings_log
DROP POLICY IF EXISTS "Users can view own feelings" ON public.feelings_log;
CREATE POLICY "Users can view own feelings" ON public.feelings_log
    FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own feelings" ON public.feelings_log;
CREATE POLICY "Users can insert own feelings" ON public.feelings_log
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Policies for suggested_actions
DROP POLICY IF EXISTS "Users can view own actions" ON public.suggested_actions;
CREATE POLICY "Users can view own actions" ON public.suggested_actions
    FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own actions" ON public.suggested_actions;
CREATE POLICY "Users can update own actions" ON public.suggested_actions
    FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own actions" ON public.suggested_actions;
CREATE POLICY "Users can insert own actions" ON public.suggested_actions
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Policies for action_feedback
DROP POLICY IF EXISTS "Users can view own feedback" ON public.action_feedback;
CREATE POLICY "Users can view own feedback" ON public.action_feedback
    FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own feedback" ON public.action_feedback;
CREATE POLICY "Users can insert own feedback" ON public.action_feedback
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Trigger to create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, name)
  VALUES (new.id, COALESCE(new.raw_user_meta_data->>'name', new.email));
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
