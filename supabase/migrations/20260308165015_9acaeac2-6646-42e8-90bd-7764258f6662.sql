
-- Drop all RESTRICTIVE policies and recreate as PERMISSIVE for subscriptions
DROP POLICY IF EXISTS "Users can insert their own subscription" ON public.subscriptions;
DROP POLICY IF EXISTS "Users can update their own subscription" ON public.subscriptions;
DROP POLICY IF EXISTS "Users can view their own subscription" ON public.subscriptions;

CREATE POLICY "Users can insert their own subscription" ON public.subscriptions
FOR INSERT TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own subscription" ON public.subscriptions
FOR UPDATE TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own subscription" ON public.subscriptions
FOR SELECT TO authenticated
USING (auth.uid() = user_id);

-- Fix profiles policies too
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;

CREATE POLICY "Users can insert their own profile" ON public.profiles
FOR INSERT TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" ON public.profiles
FOR UPDATE TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own profile" ON public.profiles
FOR SELECT TO authenticated
USING (auth.uid() = user_id);

-- Fix diary_entries policies too
DROP POLICY IF EXISTS "Users can insert their own diary entries" ON public.diary_entries;
DROP POLICY IF EXISTS "Users can update their own diary entries" ON public.diary_entries;
DROP POLICY IF EXISTS "Users can view their own diary entries" ON public.diary_entries;
DROP POLICY IF EXISTS "Users can delete their own diary entries" ON public.diary_entries;

CREATE POLICY "Users can insert their own diary entries" ON public.diary_entries
FOR INSERT TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own diary entries" ON public.diary_entries
FOR UPDATE TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own diary entries" ON public.diary_entries
FOR SELECT TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own diary entries" ON public.diary_entries
FOR DELETE TO authenticated
USING (auth.uid() = user_id);
