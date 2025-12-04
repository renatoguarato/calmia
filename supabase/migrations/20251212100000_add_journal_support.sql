ALTER TABLE public.feelings_log ADD COLUMN log_type TEXT NOT NULL DEFAULT 'check_in';

-- Create an index on log_type for faster filtering
CREATE INDEX idx_feelings_log_type ON public.feelings_log(log_type);
