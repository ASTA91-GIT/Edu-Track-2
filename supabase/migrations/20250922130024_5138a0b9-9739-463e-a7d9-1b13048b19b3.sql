-- Add RLS policies for newly created tables

-- RLS policies for classes table
CREATE POLICY "Everyone can view classes" 
ON public.classes
FOR SELECT 
TO authenticated
USING (true);

CREATE POLICY "Only admins can modify classes" 
ON public.classes
FOR INSERT 
TO authenticated
WITH CHECK (public.get_current_user_role() = 'admin');

CREATE POLICY "Only admins can update classes" 
ON public.classes
FOR UPDATE 
TO authenticated
USING (public.get_current_user_role() = 'admin');

CREATE POLICY "Only admins can delete classes" 
ON public.classes
FOR DELETE 
TO authenticated
USING (public.get_current_user_role() = 'admin');

-- RLS policies for subject_teachers table
CREATE POLICY "Teachers can view own subject assignments" 
ON public.subject_teachers
FOR SELECT 
TO authenticated
USING (
  teacher_id IN (
    SELECT id FROM public."Teachers Table" 
    WHERE email IN (
      SELECT email FROM public.profiles 
      WHERE id = auth.uid() AND role = 'teacher'
    )
  ) OR public.get_current_user_role() = 'admin'
);

CREATE POLICY "Only admins can manage subject assignments" 
ON public.subject_teachers
FOR ALL 
TO authenticated
USING (public.get_current_user_role() = 'admin')
WITH CHECK (public.get_current_user_role() = 'admin');

-- RLS policies for lectures table
CREATE POLICY "Teachers can manage own lectures" 
ON public.lectures
FOR ALL 
TO authenticated
USING (
  teacher_id IN (
    SELECT id FROM public."Teachers Table" 
    WHERE email IN (
      SELECT email FROM public.profiles 
      WHERE id = auth.uid() AND role = 'teacher'
    )
  ) OR public.get_current_user_role() = 'admin'
)
WITH CHECK (
  teacher_id IN (
    SELECT id FROM public."Teachers Table" 
    WHERE email IN (
      SELECT email FROM public.profiles 
      WHERE id = auth.uid() AND role = 'teacher'
    )
  ) OR public.get_current_user_role() = 'admin'
);

CREATE POLICY "Students can view lectures of their classes" 
ON public.lectures
FOR SELECT 
TO authenticated
USING (
  class_id IN (
    SELECT class_id FROM public."students (or teachers, attendance)" 
    WHERE id = auth.uid()
  ) OR public.get_current_user_role() IN ('teacher', 'admin')
);

-- Add RLS policies for students table
CREATE POLICY "Students can view own profile" 
ON public."students (or teachers, attendance)"
FOR SELECT 
TO authenticated
USING (id = auth.uid() OR public.get_current_user_role() IN ('teacher', 'admin'));

CREATE POLICY "Only admins can modify students" 
ON public."students (or teachers, attendance)"
FOR INSERT 
TO authenticated
WITH CHECK (public.get_current_user_role() = 'admin');

CREATE POLICY "Only admins can update students" 
ON public."students (or teachers, attendance)"
FOR UPDATE 
TO authenticated
USING (public.get_current_user_role() = 'admin');

CREATE POLICY "Only admins can delete students" 
ON public."students (or teachers, attendance)"
FOR DELETE 
TO authenticated
USING (public.get_current_user_role() = 'admin');

-- Add policies for attendance table
CREATE POLICY "Teachers can manage attendance for their classes" 
ON public."Attendance Table"
FOR ALL 
TO authenticated
USING (
  teacher_id IN (
    SELECT id FROM public."Teachers Table" 
    WHERE email IN (
      SELECT email FROM public.profiles 
      WHERE id = auth.uid() AND role = 'teacher'
    )
  ) OR public.get_current_user_role() = 'admin'
)
WITH CHECK (
  teacher_id IN (
    SELECT id FROM public."Teachers Table" 
    WHERE email IN (
      SELECT email FROM public.profiles 
      WHERE id = auth.uid() AND role = 'teacher'
    )
  ) OR public.get_current_user_role() = 'admin'
);

-- Allow teachers to insert/update subjects they are assigned to
CREATE POLICY "Teachers can manage assigned subjects" 
ON public.subjects
FOR UPDATE 
TO authenticated
USING (
  id IN (
    SELECT subject_id FROM public.subject_teachers 
    WHERE teacher_id IN (
      SELECT id FROM public."Teachers Table" 
      WHERE email IN (
        SELECT email FROM public.profiles 
        WHERE id = auth.uid() AND role = 'teacher'
      )
    )
  ) OR public.get_current_user_role() = 'admin'
);

CREATE POLICY "Teachers can add new subjects" 
ON public.subjects
FOR INSERT 
TO authenticated
WITH CHECK (public.get_current_user_role() IN ('teacher', 'admin'));