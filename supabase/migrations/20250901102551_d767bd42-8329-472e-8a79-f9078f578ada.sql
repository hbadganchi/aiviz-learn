-- Fix security issues by properly dropping and recreating function with dependencies

-- 1. Drop the trigger first
DROP TRIGGER IF EXISTS update_notes_updated_at ON public.notes;

-- 2. Drop the function
DROP FUNCTION IF EXISTS public.update_updated_at_column();

-- 3. Recreate function with proper security settings
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public;

-- 4. Recreate the trigger
CREATE TRIGGER update_notes_updated_at
BEFORE UPDATE ON public.notes
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- 5. Enable RLS on subjects table
ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;

-- 6. Create policy to allow everyone to read subjects (they are public reference data)
CREATE POLICY "Anyone can view subjects" 
ON public.subjects 
FOR SELECT 
USING (true);