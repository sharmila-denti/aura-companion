
CREATE TABLE public.diary_entries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT,
  content TEXT NOT NULL,
  mood TEXT NOT NULL DEFAULT 'neutral',
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.diary_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own diary entries"
  ON public.diary_entries FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own diary entries"
  ON public.diary_entries FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own diary entries"
  ON public.diary_entries FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own diary entries"
  ON public.diary_entries FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE TRIGGER update_diary_entries_updated_at
  BEFORE UPDATE ON public.diary_entries
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
