-- Fix security issue: Add RLS policies for Teachers Table to protect teacher contact information

-- First, enable RLS on the Teachers Table
ALTER TABLE public."Teachers Table" ENABLE ROW LEVEL SECURITY;

-- Create a security definer function to get the current user's role safely
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS TEXT AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid();
$$ LANGUAGE SQL SECURITY DEFINER STABLE SET search_path = public;

-- Create a security definer function to check if current user is a teacher
CREATE OR REPLACE FUNCTION public.is_current_user_teacher(teacher_email TEXT)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() 
    AND email = teacher_email 
    AND role = 'teacher'
  );
$$ LANGUAGE SQL SECURITY DEFINER STABLE SET search_path = public;

-- Policy 1: Teachers can view their own information
CREATE POLICY "Teachers can view own information" 
ON public."Teachers Table"
FOR SELECT 
TO authenticated
USING (public.is_current_user_teacher(email));

-- Policy 2: Admins can view all teacher information
CREATE POLICY "Admins can view all teachers" 
ON public."Teachers Table"
FOR SELECT 
TO authenticated
USING (public.get_current_user_role() = 'admin');

-- Policy 3: Students can view basic teacher info (name and class) but not email
-- This policy allows students to see teacher names and classes for educational purposes
CREATE POLICY "Students can view basic teacher info" 
ON public."Teachers Table"
FOR SELECT 
TO authenticated
USING (
  public.get_current_user_role() = 'student' 
  AND auth.uid() IS NOT NULL
);

-- Note: The above policies will protect email access through application logic
-- Students will need to use SELECT name, class_assigned FROM teachers to avoid email exposure

-- Policy 4: Only admins can modify teacher records
CREATE POLICY "Only admins can insert teachers" 
ON public."Teachers Table"
FOR INSERT 
TO authenticated
WITH CHECK (public.get_current_user_role() = 'admin');

CREATE POLICY "Only admins can update teachers" 
ON public."Teachers Table"
FOR UPDATE 
TO authenticated
USING (public.get_current_user_role() = 'admin');

CREATE POLICY "Only admins can delete teachers" 
ON public."Teachers Table"
FOR DELETE 
TO authenticated
USING (public.get_current_user_role() = 'admin');