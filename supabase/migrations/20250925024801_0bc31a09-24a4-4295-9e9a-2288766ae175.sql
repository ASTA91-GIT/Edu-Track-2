-- Create library_access_logs table for tracking downloads
CREATE TABLE IF NOT EXISTS public.library_access_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  book_id UUID NOT NULL REFERENCES public.library_books(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  action TEXT NOT NULL CHECK (action IN ('download', 'view', 'search')),
  accessed_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  ip_address TEXT,
  user_agent TEXT
);

-- Create qr_attendance_sessions table for secure QR attendance
CREATE TABLE IF NOT EXISTS public.qr_attendance_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id TEXT NOT NULL UNIQUE,
  subject_id UUID NOT NULL REFERENCES public.subjects(id),
  class_id UUID NOT NULL REFERENCES public.classes(id),
  teacher_id UUID NOT NULL REFERENCES public."Teachers Table"(id),
  start_time TIMESTAMP WITH TIME ZONE DEFAULT now(),
  end_time TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT true,
  qr_refresh_interval INTEGER DEFAULT 15,
  location TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create qr_scans table for tracking individual scans
CREATE TABLE IF NOT EXISTS public.qr_scans (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID NOT NULL REFERENCES public.qr_attendance_sessions(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES auth.users(id),
  scan_timestamp TIMESTAMP WITH TIME ZONE DEFAULT now(),
  qr_code_data TEXT NOT NULL,
  is_valid BOOLEAN DEFAULT true,
  validation_errors TEXT[],
  ip_address TEXT,
  user_agent TEXT,
  UNIQUE(session_id, student_id)
);

-- Enable RLS on new tables
ALTER TABLE public.library_access_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.qr_attendance_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.qr_scans ENABLE ROW LEVEL SECURITY;

-- RLS Policies for library_access_logs  
CREATE POLICY "Users can view own access logs"
ON public.library_access_logs FOR SELECT
USING (user_id = auth.uid() OR get_current_user_role() = 'admin');

CREATE POLICY "Anyone can insert access logs"
ON public.library_access_logs FOR INSERT
WITH CHECK (user_id = auth.uid());

-- RLS Policies for qr_attendance_sessions
CREATE POLICY "Teachers can manage own QR sessions"
ON public.qr_attendance_sessions FOR ALL
USING (
  teacher_id IN (
    SELECT t.id FROM public."Teachers Table" t
    JOIN public.profiles p ON t.email = p.email
    WHERE p.id = auth.uid() AND p.role = 'teacher'
  ) OR get_current_user_role() = 'admin'
)
WITH CHECK (
  teacher_id IN (
    SELECT t.id FROM public."Teachers Table" t
    JOIN public.profiles p ON t.email = p.email
    WHERE p.id = auth.uid() AND p.role = 'teacher'
  ) OR get_current_user_role() = 'admin'
);

CREATE POLICY "Students can view active sessions for their classes"
ON public.qr_attendance_sessions FOR SELECT
USING (
  is_active = true AND 
  class_id IN (
    SELECT s.class_id FROM public."students (or teachers, attendance)" s
    WHERE s.id = auth.uid()
  )
);

-- RLS Policies for qr_scans
CREATE POLICY "Students can manage own scans"
ON public.qr_scans FOR ALL
USING (student_id = auth.uid())
WITH CHECK (student_id = auth.uid());

CREATE POLICY "Teachers can view scans for their sessions"
ON public.qr_scans FOR SELECT
USING (
  session_id IN (
    SELECT qs.id FROM public.qr_attendance_sessions qs
    JOIN public."Teachers Table" t ON qs.teacher_id = t.id
    JOIN public.profiles p ON t.email = p.email
    WHERE p.id = auth.uid() AND p.role = 'teacher'
  ) OR get_current_user_role() = 'admin'
);

-- Create indexes for better performance
CREATE INDEX idx_library_access_logs_user_book ON public.library_access_logs(user_id, book_id);
CREATE INDEX idx_qr_sessions_active ON public.qr_attendance_sessions(is_active) WHERE is_active = true;
CREATE INDEX idx_qr_scans_session_student ON public.qr_scans(session_id, student_id);