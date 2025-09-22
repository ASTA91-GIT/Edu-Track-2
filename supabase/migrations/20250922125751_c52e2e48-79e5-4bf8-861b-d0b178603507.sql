-- Fix security issue: Create profiles table and add RLS policies for Teachers Table

-- First, create the profiles table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID NOT NULL PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('student', 'teacher', 'admin')),
  class TEXT,
  photo_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on profiles table
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create profiles RLS policies
CREATE POLICY "Users can view own profile" 
ON public.profiles
FOR SELECT 
TO authenticated
USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" 
ON public.profiles
FOR UPDATE 
TO authenticated
USING (auth.uid() = id);

-- Create trigger for profiles updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Now enable RLS on the Teachers Table
ALTER TABLE public."Teachers Table" ENABLE ROW LEVEL SECURITY;

-- Create security definer function to get current user's role safely
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS TEXT AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid();
$$ LANGUAGE SQL SECURITY DEFINER STABLE SET search_path = public;

-- Create function to check if current user is a specific teacher
CREATE OR REPLACE FUNCTION public.is_current_user_teacher(teacher_email TEXT)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() 
    AND email = teacher_email 
    AND role = 'teacher'
  );
$$ LANGUAGE SQL SECURITY DEFINER STABLE SET search_path = public;

-- RLS Policies for Teachers Table

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

-- Policy 3: Students can view basic teacher info but application must filter out emails
CREATE POLICY "Students can view basic teacher info" 
ON public."Teachers Table"
FOR SELECT 
TO authenticated
USING (
  public.get_current_user_role() = 'student' 
  AND auth.uid() IS NOT NULL
);

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