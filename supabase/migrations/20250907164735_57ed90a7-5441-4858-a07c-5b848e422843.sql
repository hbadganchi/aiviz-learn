-- Remove role requirement and add active_role system for dual-role switching
ALTER TABLE public.profiles ALTER COLUMN role DROP NOT NULL;

ALTER TABLE public.profiles ADD COLUMN active_role text DEFAULT 'student';

ALTER TABLE public.profiles ADD COLUMN available_roles text[] DEFAULT ARRAY['student', 'teacher'];

-- Update existing profiles to have both roles available
UPDATE public.profiles 
SET available_roles = ARRAY['student', 'teacher'],
    active_role = COALESCE(role, 'student');