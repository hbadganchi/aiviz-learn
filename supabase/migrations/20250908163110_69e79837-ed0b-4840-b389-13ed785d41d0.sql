-- Fix security vulnerability: Remove overly permissive policy that allows students to access all teacher notes
-- This removes the policy that grants access to all notes for any authenticated user with a profile
DROP POLICY IF EXISTS "All users can view notes" ON public.notes;

-- Keep only the secure policy that allows users to view their own notes
-- The "Users can view their own notes" policy remains and ensures proper access control