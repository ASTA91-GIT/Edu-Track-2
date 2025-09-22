-- Complete the database structure for educational management system

-- First, let's create a classes table to organize students and link with other tables
CREATE TABLE IF NOT EXISTS public.classes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  grade_level TEXT NOT NULL,
  academic_year TEXT NOT NULL DEFAULT '2024-2025',
  class_teacher_id UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on classes
ALTER TABLE public.classes ENABLE ROW LEVEL SECURITY;

-- Update the attendance table structure and add proper foreign keys
ALTER TABLE public."Attendance Table" 
DROP COLUMN IF EXISTS method CASCADE,
DROP COLUMN IF EXISTS status CASCADE,
DROP COLUMN IF EXISTS date CASCADE;

-- Add proper columns to attendance table
ALTER TABLE public."Attendance Table" 
ADD COLUMN IF NOT EXISTS class_id UUID,
ADD COLUMN IF NOT EXISTS subject_id UUID,
ADD COLUMN IF NOT EXISTS teacher_id UUID NOT NULL,
ADD COLUMN IF NOT EXISTS attendance_date DATE NOT NULL DEFAULT CURRENT_DATE,
ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'absent' CHECK (status IN ('present', 'absent', 'late', 'excused')),
ADD COLUMN IF NOT EXISTS marked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
ADD COLUMN IF NOT EXISTS notes TEXT;

-- Update students table to have proper structure
ALTER TABLE public."students (or teachers, attendance)" 
DROP COLUMN IF EXISTS "photo url" CASCADE;

ALTER TABLE public."students (or teachers, attendance)" 
ADD COLUMN IF NOT EXISTS photo_url TEXT,
ADD COLUMN IF NOT EXISTS student_id TEXT UNIQUE,
ADD COLUMN IF NOT EXISTS class_id UUID,
ADD COLUMN IF NOT EXISTS date_of_birth DATE,
ADD COLUMN IF NOT EXISTS phone TEXT,
ADD COLUMN IF NOT EXISTS address TEXT,
ADD COLUMN IF NOT EXISTS guardian_name TEXT,
ADD COLUMN IF NOT EXISTS guardian_phone TEXT,
ADD COLUMN IF NOT EXISTS admission_date DATE DEFAULT CURRENT_DATE,
ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Update teachers table structure
ALTER TABLE public."Teachers Table" 
ADD COLUMN IF NOT EXISTS teacher_id TEXT UNIQUE,
ADD COLUMN IF NOT EXISTS phone TEXT,
ADD COLUMN IF NOT EXISTS department TEXT,
ADD COLUMN IF NOT EXISTS qualification TEXT,
ADD COLUMN IF NOT EXISTS date_of_joining DATE DEFAULT CURRENT_DATE,
ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Create subject_teachers junction table for many-to-many relationship
CREATE TABLE IF NOT EXISTS public.subject_teachers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  teacher_id UUID NOT NULL,
  subject_id UUID NOT NULL,
  class_id UUID NOT NULL,
  academic_year TEXT NOT NULL DEFAULT '2024-2025',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(teacher_id, subject_id, class_id, academic_year)
);

-- Create lectures table for teachers to add lectures
CREATE TABLE IF NOT EXISTS public.lectures (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  subject_id UUID NOT NULL,
  class_id UUID NOT NULL,
  teacher_id UUID NOT NULL,
  lecture_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  room TEXT,
  status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'completed', 'cancelled')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on all new tables
ALTER TABLE public.subject_teachers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lectures ENABLE ROW LEVEL SECURITY;

-- Add foreign key constraints (with proper error handling)
DO $$ 
BEGIN
  -- Add foreign keys for classes table
  IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'classes_class_teacher_fkey') THEN
    ALTER TABLE public.classes ADD CONSTRAINT classes_class_teacher_fkey 
    FOREIGN KEY (class_teacher_id) REFERENCES public."Teachers Table"(id) ON DELETE SET NULL;
  END IF;

  -- Add foreign keys for attendance table
  IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'attendance_class_fkey') THEN
    ALTER TABLE public."Attendance Table" ADD CONSTRAINT attendance_class_fkey 
    FOREIGN KEY (class_id) REFERENCES public.classes(id) ON DELETE CASCADE;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'attendance_subject_fkey') THEN
    ALTER TABLE public."Attendance Table" ADD CONSTRAINT attendance_subject_fkey 
    FOREIGN KEY (subject_id) REFERENCES public.subjects(id) ON DELETE CASCADE;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'attendance_teacher_fkey') THEN
    ALTER TABLE public."Attendance Table" ADD CONSTRAINT attendance_teacher_fkey 
    FOREIGN KEY (teacher_id) REFERENCES public."Teachers Table"(id) ON DELETE CASCADE;
  END IF;

  -- Add foreign keys for students table
  IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'students_class_fkey') THEN
    ALTER TABLE public."students (or teachers, attendance)" ADD CONSTRAINT students_class_fkey 
    FOREIGN KEY (class_id) REFERENCES public.classes(id) ON DELETE SET NULL;
  END IF;

  -- Add foreign keys for subject_teachers table
  IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'subject_teachers_teacher_fkey') THEN
    ALTER TABLE public.subject_teachers ADD CONSTRAINT subject_teachers_teacher_fkey 
    FOREIGN KEY (teacher_id) REFERENCES public."Teachers Table"(id) ON DELETE CASCADE;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'subject_teachers_subject_fkey') THEN
    ALTER TABLE public.subject_teachers ADD CONSTRAINT subject_teachers_subject_fkey 
    FOREIGN KEY (subject_id) REFERENCES public.subjects(id) ON DELETE CASCADE;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'subject_teachers_class_fkey') THEN
    ALTER TABLE public.subject_teachers ADD CONSTRAINT subject_teachers_class_fkey 
    FOREIGN KEY (class_id) REFERENCES public.classes(id) ON DELETE CASCADE;
  END IF;

  -- Add foreign keys for lectures table
  IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'lectures_subject_fkey') THEN
    ALTER TABLE public.lectures ADD CONSTRAINT lectures_subject_fkey 
    FOREIGN KEY (subject_id) REFERENCES public.subjects(id) ON DELETE CASCADE;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'lectures_class_fkey') THEN
    ALTER TABLE public.lectures ADD CONSTRAINT lectures_class_fkey 
    FOREIGN KEY (class_id) REFERENCES public.classes(id) ON DELETE CASCADE;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'lectures_teacher_fkey') THEN
    ALTER TABLE public.lectures ADD CONSTRAINT lectures_teacher_fkey 
    FOREIGN KEY (teacher_id) REFERENCES public."Teachers Table"(id) ON DELETE CASCADE;
  END IF;
END $$;

-- Create triggers for updated_at columns
CREATE TRIGGER update_classes_updated_at
  BEFORE UPDATE ON public.classes
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_students_updated_at
  BEFORE UPDATE ON public."students (or teachers, attendance)"
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_teachers_updated_at
  BEFORE UPDATE ON public."Teachers Table"
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_lectures_updated_at
  BEFORE UPDATE ON public.lectures
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();