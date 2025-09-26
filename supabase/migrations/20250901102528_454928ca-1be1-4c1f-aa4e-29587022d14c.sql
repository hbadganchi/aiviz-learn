-- Fix security issues from previous migration

-- 1. Fix function search path by recreating with proper security settings
DROP FUNCTION IF EXISTS public.update_updated_at_column();

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public;

-- 2. Enable RLS on subjects table
ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;

-- Create policy to allow everyone to read subjects (they are public reference data)
CREATE POLICY "Anyone can view subjects" 
ON public.subjects 
FOR SELECT 
USING (true);

-- Only allow system/admin to modify subjects (no user modification needed for this use case)
-- Users don't need to create/update/delete subjects, they are predefined