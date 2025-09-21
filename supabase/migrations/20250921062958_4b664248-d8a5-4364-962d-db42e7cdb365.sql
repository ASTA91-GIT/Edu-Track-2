-- Create comprehensive EduTrack database schema

-- Create enum types for better data integrity
CREATE TYPE public.fee_status AS ENUM ('paid', 'pending', 'overdue', 'partial');
CREATE TYPE public.assignment_status AS ENUM ('pending', 'submitted', 'graded', 'returned');
CREATE TYPE public.grade_type AS ENUM ('assignment', 'quiz', 'midterm', 'final', 'project');
CREATE TYPE public.transport_status AS ENUM ('active', 'inactive', 'maintenance');
CREATE TYPE public.ticket_status AS ENUM ('open', 'in_progress', 'resolved', 'closed');
CREATE TYPE public.ticket_priority AS ENUM ('low', 'medium', 'high', 'urgent');
CREATE TYPE public.certificate_type AS ENUM ('attendance', 'bonafide', 'academic', 'conduct');

-- Fees Management
CREATE TABLE public.fees (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL,
  academic_year TEXT NOT NULL,
  semester TEXT NOT NULL,
  fee_type TEXT NOT NULL, -- tuition, library, lab, transport, etc.
  amount DECIMAL(10,2) NOT NULL,
  due_date DATE NOT NULL,
  paid_date DATE,
  status fee_status DEFAULT 'pending',
  payment_method TEXT,
  transaction_id TEXT,
  late_fee DECIMAL(10,2) DEFAULT 0,
  discount DECIMAL(10,2) DEFAULT 0,
  remarks TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Events Management
CREATE TABLE public.events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  event_date DATE NOT NULL,
  start_time TIME,
  end_time TIME,
  location TEXT,
  event_type TEXT NOT NULL, -- academic, cultural, sports, etc.
  target_audience TEXT[], -- students, teachers, parents, all
  organizer_id UUID,
  max_participants INTEGER,
  registration_required BOOLEAN DEFAULT false,
  registration_deadline DATE,
  is_mandatory BOOLEAN DEFAULT false,
  attachment_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Test Schedules
CREATE TABLE public.tests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subject_id UUID NOT NULL,
  class_id UUID NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  test_date DATE NOT NULL,
  start_time TIME NOT NULL,
  duration_minutes INTEGER NOT NULL,
  test_type grade_type NOT NULL,
  total_marks INTEGER NOT NULL,
  syllabus TEXT,
  instructions TEXT,
  room TEXT,
  invigilator_id UUID,
  created_by UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Subjects Management
CREATE TABLE public.subjects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  code TEXT UNIQUE NOT NULL,
  description TEXT,
  credits INTEGER DEFAULT 1,
  department TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Assignments Management
CREATE TABLE public.assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subject_id UUID NOT NULL REFERENCES public.subjects(id),
  class_id UUID NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  instructions TEXT,
  assigned_date DATE DEFAULT CURRENT_DATE,
  due_date DATE NOT NULL,
  max_marks INTEGER NOT NULL,
  attachment_url TEXT,
  created_by UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Assignment Submissions
CREATE TABLE public.assignment_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assignment_id UUID NOT NULL REFERENCES public.assignments(id) ON DELETE CASCADE,
  student_id UUID NOT NULL,
  submission_text TEXT,
  attachment_url TEXT,
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  status assignment_status DEFAULT 'submitted',
  marks_obtained INTEGER,
  feedback TEXT,
  graded_by UUID,
  graded_at TIMESTAMP WITH TIME ZONE,
  is_late BOOLEAN DEFAULT false,
  late_penalty INTEGER DEFAULT 0
);

-- Grades Management
CREATE TABLE public.grades (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL,
  subject_id UUID NOT NULL REFERENCES public.subjects(id),
  class_id UUID NOT NULL,
  grade_type grade_type NOT NULL,
  assessment_name TEXT NOT NULL,
  marks_obtained INTEGER NOT NULL,
  total_marks INTEGER NOT NULL,
  percentage DECIMAL(5,2) GENERATED ALWAYS AS ((marks_obtained::DECIMAL / total_marks::DECIMAL) * 100) STORED,
  grade_letter TEXT,
  remarks TEXT,
  assessment_date DATE DEFAULT CURRENT_DATE,
  entered_by UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Library Management
CREATE TABLE public.library_books (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  isbn TEXT,
  title TEXT NOT NULL,
  author TEXT NOT NULL,
  publisher TEXT,
  publication_year INTEGER,
  category TEXT NOT NULL,
  total_copies INTEGER NOT NULL DEFAULT 1,
  available_copies INTEGER NOT NULL DEFAULT 1,
  location_shelf TEXT,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE public.library_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  book_id UUID NOT NULL REFERENCES public.library_books(id),
  student_id UUID NOT NULL,
  issue_date DATE DEFAULT CURRENT_DATE,
  due_date DATE NOT NULL,
  return_date DATE,
  fine_amount DECIMAL(10,2) DEFAULT 0,
  status TEXT DEFAULT 'issued', -- issued, returned, overdue
  issued_by UUID NOT NULL,
  returned_to UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Announcements/Notice Board
CREATE TABLE public.announcements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  announcement_type TEXT NOT NULL, -- general, urgent, academic, administrative
  target_audience TEXT[] NOT NULL, -- students, teachers, parents, all
  class_specific TEXT[], -- specific classes if applicable
  priority INTEGER DEFAULT 1, -- 1=low, 2=medium, 3=high
  is_pinned BOOLEAN DEFAULT false,
  expiry_date DATE,
  attachment_url TEXT,
  created_by UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Timetable Management
CREATE TABLE public.timetable (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  class_id UUID NOT NULL,
  subject_id UUID NOT NULL REFERENCES public.subjects(id),
  teacher_id UUID NOT NULL,
  day_of_week INTEGER NOT NULL, -- 1=Monday, 7=Sunday
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  room TEXT NOT NULL,
  academic_year TEXT NOT NULL,
  semester TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Transport Management
CREATE TABLE public.transport_routes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  route_name TEXT NOT NULL,
  route_number TEXT UNIQUE NOT NULL,
  driver_name TEXT NOT NULL,
  driver_phone TEXT NOT NULL,
  vehicle_number TEXT NOT NULL,
  capacity INTEGER NOT NULL,
  status transport_status DEFAULT 'active',
  fare_amount DECIMAL(10,2) NOT NULL,
  pickup_points TEXT[] NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE public.student_transport (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL,
  route_id UUID NOT NULL REFERENCES public.transport_routes(id),
  pickup_point TEXT NOT NULL,
  academic_year TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Clubs & Activities
CREATE TABLE public.clubs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  club_type TEXT NOT NULL, -- academic, sports, cultural, technical, etc.
  faculty_coordinator UUID NOT NULL,
  student_coordinator UUID,
  max_members INTEGER,
  meeting_schedule TEXT,
  room TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE public.club_memberships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  club_id UUID NOT NULL REFERENCES public.clubs(id) ON DELETE CASCADE,
  student_id UUID NOT NULL,
  role TEXT DEFAULT 'member', -- member, secretary, president, etc.
  joined_date DATE DEFAULT CURRENT_DATE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Support/Complaint System
CREATE TABLE public.support_tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_number TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL, -- academic, technical, administrative, transport, etc.
  priority ticket_priority DEFAULT 'medium',
  status ticket_status DEFAULT 'open',
  created_by UUID NOT NULL,
  assigned_to UUID,
  resolution TEXT,
  attachment_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  resolved_at TIMESTAMP WITH TIME ZONE
);

-- Messages System
CREATE TABLE public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID NOT NULL,
  recipient_id UUID NOT NULL,
  subject TEXT,
  content TEXT NOT NULL,
  message_type TEXT DEFAULT 'general', -- general, academic, administrative
  is_read BOOLEAN DEFAULT false,
  parent_message_id UUID REFERENCES public.messages(id),
  attachment_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  read_at TIMESTAMP WITH TIME ZONE
);

-- Certificates Management
CREATE TABLE public.certificates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL,
  certificate_type certificate_type NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  issued_date DATE DEFAULT CURRENT_DATE,
  valid_until DATE,
  certificate_number TEXT UNIQUE NOT NULL,
  issued_by UUID NOT NULL,
  is_verified BOOLEAN DEFAULT true,
  qr_verification_code TEXT,
  template_used TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Update existing tables to add foreign key relationships where appropriate
ALTER TABLE public.fees ADD CONSTRAINT fk_fees_student FOREIGN KEY (student_id) REFERENCES auth.users(id);
ALTER TABLE public.events ADD CONSTRAINT fk_events_organizer FOREIGN KEY (organizer_id) REFERENCES auth.users(id);
ALTER TABLE public.tests ADD CONSTRAINT fk_tests_creator FOREIGN KEY (created_by) REFERENCES auth.users(id);
ALTER TABLE public.tests ADD CONSTRAINT fk_tests_invigilator FOREIGN KEY (invigilator_id) REFERENCES auth.users(id);
ALTER TABLE public.assignment_submissions ADD CONSTRAINT fk_submissions_student FOREIGN KEY (student_id) REFERENCES auth.users(id);
ALTER TABLE public.assignment_submissions ADD CONSTRAINT fk_submissions_grader FOREIGN KEY (graded_by) REFERENCES auth.users(id);
ALTER TABLE public.grades ADD CONSTRAINT fk_grades_student FOREIGN KEY (student_id) REFERENCES auth.users(id);
ALTER TABLE public.grades ADD CONSTRAINT fk_grades_entered_by FOREIGN KEY (entered_by) REFERENCES auth.users(id);
ALTER TABLE public.library_transactions ADD CONSTRAINT fk_library_student FOREIGN KEY (student_id) REFERENCES auth.users(id);
ALTER TABLE public.library_transactions ADD CONSTRAINT fk_library_issued_by FOREIGN KEY (issued_by) REFERENCES auth.users(id);
ALTER TABLE public.library_transactions ADD CONSTRAINT fk_library_returned_to FOREIGN KEY (returned_to) REFERENCES auth.users(id);
ALTER TABLE public.announcements ADD CONSTRAINT fk_announcements_creator FOREIGN KEY (created_by) REFERENCES auth.users(id);
ALTER TABLE public.timetable ADD CONSTRAINT fk_timetable_teacher FOREIGN KEY (teacher_id) REFERENCES auth.users(id);
ALTER TABLE public.student_transport ADD CONSTRAINT fk_transport_student FOREIGN KEY (student_id) REFERENCES auth.users(id);
ALTER TABLE public.club_memberships ADD CONSTRAINT fk_club_membership_student FOREIGN KEY (student_id) REFERENCES auth.users(id);
ALTER TABLE public.clubs ADD CONSTRAINT fk_clubs_coordinator FOREIGN KEY (faculty_coordinator) REFERENCES auth.users(id);
ALTER TABLE public.clubs ADD CONSTRAINT fk_clubs_student_coordinator FOREIGN KEY (student_coordinator) REFERENCES auth.users(id);
ALTER TABLE public.support_tickets ADD CONSTRAINT fk_tickets_creator FOREIGN KEY (created_by) REFERENCES auth.users(id);
ALTER TABLE public.support_tickets ADD CONSTRAINT fk_tickets_assigned FOREIGN KEY (assigned_to) REFERENCES auth.users(id);
ALTER TABLE public.messages ADD CONSTRAINT fk_messages_sender FOREIGN KEY (sender_id) REFERENCES auth.users(id);
ALTER TABLE public.messages ADD CONSTRAINT fk_messages_recipient FOREIGN KEY (recipient_id) REFERENCES auth.users(id);
ALTER TABLE public.certificates ADD CONSTRAINT fk_certificates_student FOREIGN KEY (student_id) REFERENCES auth.users(id);
ALTER TABLE public.certificates ADD CONSTRAINT fk_certificates_issuer FOREIGN KEY (issued_by) REFERENCES auth.users(id);

-- Enable Row Level Security on all tables
ALTER TABLE public.fees ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assignment_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.grades ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.library_books ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.library_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.timetable ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transport_routes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_transport ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clubs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.club_memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.support_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;

-- Create basic RLS policies (can be refined later based on specific requirements)

-- Students can view their own fees
CREATE POLICY "Students can view own fees" ON public.fees FOR SELECT USING (student_id = auth.uid());

-- Everyone can view public events
CREATE POLICY "Everyone can view events" ON public.events FOR SELECT USING (true);

-- Students can view tests for their class
CREATE POLICY "Students can view class tests" ON public.tests FOR SELECT USING (true);

-- Everyone can view subjects
CREATE POLICY "Everyone can view subjects" ON public.subjects FOR SELECT USING (true);

-- Students can view assignments for their class
CREATE POLICY "Students can view class assignments" ON public.assignments FOR SELECT USING (true);

-- Students can manage their own submissions
CREATE POLICY "Students can manage own submissions" ON public.assignment_submissions 
FOR ALL USING (student_id = auth.uid());

-- Students can view their own grades
CREATE POLICY "Students can view own grades" ON public.grades FOR SELECT USING (student_id = auth.uid());

-- Everyone can view library books
CREATE POLICY "Everyone can view library books" ON public.library_books FOR SELECT USING (true);

-- Students can view their own library transactions
CREATE POLICY "Students can view own library transactions" ON public.library_transactions 
FOR SELECT USING (student_id = auth.uid());

-- Everyone can view public announcements
CREATE POLICY "Everyone can view announcements" ON public.announcements FOR SELECT USING (true);

-- Everyone can view timetable
CREATE POLICY "Everyone can view timetable" ON public.timetable FOR SELECT USING (true);

-- Everyone can view transport routes
CREATE POLICY "Everyone can view transport routes" ON public.transport_routes FOR SELECT USING (true);

-- Students can view their own transport details
CREATE POLICY "Students can view own transport" ON public.student_transport 
FOR SELECT USING (student_id = auth.uid());

-- Everyone can view clubs
CREATE POLICY "Everyone can view clubs" ON public.clubs FOR SELECT USING (true);

-- Students can view their own club memberships
CREATE POLICY "Students can view own club memberships" ON public.club_memberships 
FOR SELECT USING (student_id = auth.uid());

-- Users can manage their own support tickets
CREATE POLICY "Users can manage own tickets" ON public.support_tickets 
FOR ALL USING (created_by = auth.uid());

-- Users can view messages sent to them or by them
CREATE POLICY "Users can view own messages" ON public.messages 
FOR SELECT USING (sender_id = auth.uid() OR recipient_id = auth.uid());

-- Students can view their own certificates
CREATE POLICY "Students can view own certificates" ON public.certificates 
FOR SELECT USING (student_id = auth.uid());

-- Create updated_at triggers for all tables
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply triggers to all tables with updated_at column
CREATE TRIGGER update_fees_updated_at BEFORE UPDATE ON public.fees FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON public.events FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_tests_updated_at BEFORE UPDATE ON public.tests FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_assignments_updated_at BEFORE UPDATE ON public.assignments FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_grades_updated_at BEFORE UPDATE ON public.grades FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_library_books_updated_at BEFORE UPDATE ON public.library_books FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_library_transactions_updated_at BEFORE UPDATE ON public.library_transactions FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_announcements_updated_at BEFORE UPDATE ON public.announcements FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_timetable_updated_at BEFORE UPDATE ON public.timetable FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_transport_routes_updated_at BEFORE UPDATE ON public.transport_routes FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_clubs_updated_at BEFORE UPDATE ON public.clubs FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_support_tickets_updated_at BEFORE UPDATE ON public.support_tickets FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX idx_fees_student_id ON public.fees(student_id);
CREATE INDEX idx_fees_status ON public.fees(status);
CREATE INDEX idx_events_date ON public.events(event_date);
CREATE INDEX idx_tests_date ON public.tests(test_date);
CREATE INDEX idx_assignments_due_date ON public.assignments(due_date);
CREATE INDEX idx_grades_student_subject ON public.grades(student_id, subject_id);
CREATE INDEX idx_library_transactions_student ON public.library_transactions(student_id);
CREATE INDEX idx_library_transactions_status ON public.library_transactions(status);
CREATE INDEX idx_announcements_target ON public.announcements USING GIN(target_audience);
CREATE INDEX idx_timetable_class_day ON public.timetable(class_id, day_of_week);
CREATE INDEX idx_messages_recipient ON public.messages(recipient_id);
CREATE INDEX idx_messages_sender ON public.messages(sender_id);
CREATE INDEX idx_support_tickets_status ON public.support_tickets(status);
CREATE INDEX idx_certificates_student ON public.certificates(student_id);