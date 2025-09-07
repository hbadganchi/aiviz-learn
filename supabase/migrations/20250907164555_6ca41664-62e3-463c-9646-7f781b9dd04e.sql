-- Remove role requirement and add current_role system for dual-role switching
ALTER TABLE public.profiles 
ALTER COLUMN role DROP NOT NULL,
ADD COLUMN current_role text DEFAULT 'student',
ADD COLUMN available_roles text[] DEFAULT ARRAY['student', 'teacher'];

-- Update existing profiles to have both roles available
UPDATE public.profiles 
SET available_roles = ARRAY['student', 'teacher'],
    current_role = COALESCE(role, 'student');