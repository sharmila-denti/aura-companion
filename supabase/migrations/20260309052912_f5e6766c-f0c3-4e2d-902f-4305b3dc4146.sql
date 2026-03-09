
-- Add screenshot_url column to subscriptions
ALTER TABLE public.subscriptions ADD COLUMN IF NOT EXISTS screenshot_url text;

-- Create storage bucket for payment screenshots
INSERT INTO storage.buckets (id, name, public)
VALUES ('payment-screenshots', 'payment-screenshots', true)
ON CONFLICT (id) DO NOTHING;

-- RLS: authenticated users can upload their own screenshots
CREATE POLICY "Users can upload payment screenshots"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'payment-screenshots' AND (storage.foldername(name))[1] = auth.uid()::text);

-- RLS: anyone can view screenshots (for admin verification)
CREATE POLICY "Public read access for payment screenshots"
ON storage.objects FOR SELECT TO public
USING (bucket_id = 'payment-screenshots');
