export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      announcements: {
        Row: {
          announcement_type: string
          attachment_url: string | null
          class_specific: string[] | null
          content: string
          created_at: string | null
          created_by: string
          expiry_date: string | null
          id: string
          is_pinned: boolean | null
          priority: number | null
          target_audience: string[]
          title: string
          updated_at: string | null
        }
        Insert: {
          announcement_type: string
          attachment_url?: string | null
          class_specific?: string[] | null
          content: string
          created_at?: string | null
          created_by: string
          expiry_date?: string | null
          id?: string
          is_pinned?: boolean | null
          priority?: number | null
          target_audience: string[]
          title: string
          updated_at?: string | null
        }
        Update: {
          announcement_type?: string
          attachment_url?: string | null
          class_specific?: string[] | null
          content?: string
          created_at?: string | null
          created_by?: string
          expiry_date?: string | null
          id?: string
          is_pinned?: boolean | null
          priority?: number | null
          target_audience?: string[]
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      assignment_submissions: {
        Row: {
          assignment_id: string
          attachment_url: string | null
          feedback: string | null
          graded_at: string | null
          graded_by: string | null
          id: string
          is_late: boolean | null
          late_penalty: number | null
          marks_obtained: number | null
          status: Database["public"]["Enums"]["assignment_status"] | null
          student_id: string
          submission_text: string | null
          submitted_at: string | null
        }
        Insert: {
          assignment_id: string
          attachment_url?: string | null
          feedback?: string | null
          graded_at?: string | null
          graded_by?: string | null
          id?: string
          is_late?: boolean | null
          late_penalty?: number | null
          marks_obtained?: number | null
          status?: Database["public"]["Enums"]["assignment_status"] | null
          student_id: string
          submission_text?: string | null
          submitted_at?: string | null
        }
        Update: {
          assignment_id?: string
          attachment_url?: string | null
          feedback?: string | null
          graded_at?: string | null
          graded_by?: string | null
          id?: string
          is_late?: boolean | null
          late_penalty?: number | null
          marks_obtained?: number | null
          status?: Database["public"]["Enums"]["assignment_status"] | null
          student_id?: string
          submission_text?: string | null
          submitted_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "assignment_submissions_assignment_id_fkey"
            columns: ["assignment_id"]
            isOneToOne: false
            referencedRelation: "assignments"
            referencedColumns: ["id"]
          },
        ]
      }
      assignments: {
        Row: {
          assigned_date: string | null
          attachment_url: string | null
          class_id: string
          created_at: string | null
          created_by: string
          description: string | null
          due_date: string
          id: string
          instructions: string | null
          max_marks: number
          subject_id: string
          title: string
          updated_at: string | null
        }
        Insert: {
          assigned_date?: string | null
          attachment_url?: string | null
          class_id: string
          created_at?: string | null
          created_by: string
          description?: string | null
          due_date: string
          id?: string
          instructions?: string | null
          max_marks: number
          subject_id: string
          title: string
          updated_at?: string | null
        }
        Update: {
          assigned_date?: string | null
          attachment_url?: string | null
          class_id?: string
          created_at?: string | null
          created_by?: string
          description?: string | null
          due_date?: string
          id?: string
          instructions?: string | null
          max_marks?: number
          subject_id?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "assignments_subject_id_fkey"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "subjects"
            referencedColumns: ["id"]
          },
        ]
      }
      "Attendance Table": {
        Row: {
          date: string | null
          id: string
          method: string | null
          status: string | null
          student_id: string
        }
        Insert: {
          date?: string | null
          id?: string
          method?: string | null
          status?: string | null
          student_id: string
        }
        Update: {
          date?: string | null
          id?: string
          method?: string | null
          status?: string | null
          student_id?: string
        }
        Relationships: []
      }
      certificates: {
        Row: {
          certificate_number: string
          certificate_type: Database["public"]["Enums"]["certificate_type"]
          content: string
          created_at: string | null
          id: string
          is_verified: boolean | null
          issued_by: string
          issued_date: string | null
          qr_verification_code: string | null
          student_id: string
          template_used: string | null
          title: string
          valid_until: string | null
        }
        Insert: {
          certificate_number: string
          certificate_type: Database["public"]["Enums"]["certificate_type"]
          content: string
          created_at?: string | null
          id?: string
          is_verified?: boolean | null
          issued_by: string
          issued_date?: string | null
          qr_verification_code?: string | null
          student_id: string
          template_used?: string | null
          title: string
          valid_until?: string | null
        }
        Update: {
          certificate_number?: string
          certificate_type?: Database["public"]["Enums"]["certificate_type"]
          content?: string
          created_at?: string | null
          id?: string
          is_verified?: boolean | null
          issued_by?: string
          issued_date?: string | null
          qr_verification_code?: string | null
          student_id?: string
          template_used?: string | null
          title?: string
          valid_until?: string | null
        }
        Relationships: []
      }
      club_memberships: {
        Row: {
          club_id: string
          created_at: string | null
          id: string
          is_active: boolean | null
          joined_date: string | null
          role: string | null
          student_id: string
        }
        Insert: {
          club_id: string
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          joined_date?: string | null
          role?: string | null
          student_id: string
        }
        Update: {
          club_id?: string
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          joined_date?: string | null
          role?: string | null
          student_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "club_memberships_club_id_fkey"
            columns: ["club_id"]
            isOneToOne: false
            referencedRelation: "clubs"
            referencedColumns: ["id"]
          },
        ]
      }
      clubs: {
        Row: {
          club_type: string
          created_at: string | null
          description: string | null
          faculty_coordinator: string
          id: string
          is_active: boolean | null
          max_members: number | null
          meeting_schedule: string | null
          name: string
          room: string | null
          student_coordinator: string | null
          updated_at: string | null
        }
        Insert: {
          club_type: string
          created_at?: string | null
          description?: string | null
          faculty_coordinator: string
          id?: string
          is_active?: boolean | null
          max_members?: number | null
          meeting_schedule?: string | null
          name: string
          room?: string | null
          student_coordinator?: string | null
          updated_at?: string | null
        }
        Update: {
          club_type?: string
          created_at?: string | null
          description?: string | null
          faculty_coordinator?: string
          id?: string
          is_active?: boolean | null
          max_members?: number | null
          meeting_schedule?: string | null
          name?: string
          room?: string | null
          student_coordinator?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      events: {
        Row: {
          attachment_url: string | null
          created_at: string | null
          description: string | null
          end_time: string | null
          event_date: string
          event_type: string
          id: string
          is_mandatory: boolean | null
          location: string | null
          max_participants: number | null
          organizer_id: string | null
          registration_deadline: string | null
          registration_required: boolean | null
          start_time: string | null
          target_audience: string[] | null
          title: string
          updated_at: string | null
        }
        Insert: {
          attachment_url?: string | null
          created_at?: string | null
          description?: string | null
          end_time?: string | null
          event_date: string
          event_type: string
          id?: string
          is_mandatory?: boolean | null
          location?: string | null
          max_participants?: number | null
          organizer_id?: string | null
          registration_deadline?: string | null
          registration_required?: boolean | null
          start_time?: string | null
          target_audience?: string[] | null
          title: string
          updated_at?: string | null
        }
        Update: {
          attachment_url?: string | null
          created_at?: string | null
          description?: string | null
          end_time?: string | null
          event_date?: string
          event_type?: string
          id?: string
          is_mandatory?: boolean | null
          location?: string | null
          max_participants?: number | null
          organizer_id?: string | null
          registration_deadline?: string | null
          registration_required?: boolean | null
          start_time?: string | null
          target_audience?: string[] | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      fees: {
        Row: {
          academic_year: string
          amount: number
          created_at: string | null
          discount: number | null
          due_date: string
          fee_type: string
          id: string
          late_fee: number | null
          paid_date: string | null
          payment_method: string | null
          remarks: string | null
          semester: string
          status: Database["public"]["Enums"]["fee_status"] | null
          student_id: string
          transaction_id: string | null
          updated_at: string | null
        }
        Insert: {
          academic_year: string
          amount: number
          created_at?: string | null
          discount?: number | null
          due_date: string
          fee_type: string
          id?: string
          late_fee?: number | null
          paid_date?: string | null
          payment_method?: string | null
          remarks?: string | null
          semester: string
          status?: Database["public"]["Enums"]["fee_status"] | null
          student_id: string
          transaction_id?: string | null
          updated_at?: string | null
        }
        Update: {
          academic_year?: string
          amount?: number
          created_at?: string | null
          discount?: number | null
          due_date?: string
          fee_type?: string
          id?: string
          late_fee?: number | null
          paid_date?: string | null
          payment_method?: string | null
          remarks?: string | null
          semester?: string
          status?: Database["public"]["Enums"]["fee_status"] | null
          student_id?: string
          transaction_id?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      grades: {
        Row: {
          assessment_date: string | null
          assessment_name: string
          class_id: string
          created_at: string | null
          entered_by: string
          grade_letter: string | null
          grade_type: Database["public"]["Enums"]["grade_type"]
          id: string
          marks_obtained: number
          percentage: number | null
          remarks: string | null
          student_id: string
          subject_id: string
          total_marks: number
          updated_at: string | null
        }
        Insert: {
          assessment_date?: string | null
          assessment_name: string
          class_id: string
          created_at?: string | null
          entered_by: string
          grade_letter?: string | null
          grade_type: Database["public"]["Enums"]["grade_type"]
          id?: string
          marks_obtained: number
          percentage?: number | null
          remarks?: string | null
          student_id: string
          subject_id: string
          total_marks: number
          updated_at?: string | null
        }
        Update: {
          assessment_date?: string | null
          assessment_name?: string
          class_id?: string
          created_at?: string | null
          entered_by?: string
          grade_letter?: string | null
          grade_type?: Database["public"]["Enums"]["grade_type"]
          id?: string
          marks_obtained?: number
          percentage?: number | null
          remarks?: string | null
          student_id?: string
          subject_id?: string
          total_marks?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "grades_subject_id_fkey"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "subjects"
            referencedColumns: ["id"]
          },
        ]
      }
      library_books: {
        Row: {
          author: string
          available_copies: number
          category: string
          created_at: string | null
          description: string | null
          id: string
          isbn: string | null
          location_shelf: string | null
          publication_year: number | null
          publisher: string | null
          title: string
          total_copies: number
          updated_at: string | null
        }
        Insert: {
          author: string
          available_copies?: number
          category: string
          created_at?: string | null
          description?: string | null
          id?: string
          isbn?: string | null
          location_shelf?: string | null
          publication_year?: number | null
          publisher?: string | null
          title: string
          total_copies?: number
          updated_at?: string | null
        }
        Update: {
          author?: string
          available_copies?: number
          category?: string
          created_at?: string | null
          description?: string | null
          id?: string
          isbn?: string | null
          location_shelf?: string | null
          publication_year?: number | null
          publisher?: string | null
          title?: string
          total_copies?: number
          updated_at?: string | null
        }
        Relationships: []
      }
      library_transactions: {
        Row: {
          book_id: string
          created_at: string | null
          due_date: string
          fine_amount: number | null
          id: string
          issue_date: string | null
          issued_by: string
          return_date: string | null
          returned_to: string | null
          status: string | null
          student_id: string
          updated_at: string | null
        }
        Insert: {
          book_id: string
          created_at?: string | null
          due_date: string
          fine_amount?: number | null
          id?: string
          issue_date?: string | null
          issued_by: string
          return_date?: string | null
          returned_to?: string | null
          status?: string | null
          student_id: string
          updated_at?: string | null
        }
        Update: {
          book_id?: string
          created_at?: string | null
          due_date?: string
          fine_amount?: number | null
          id?: string
          issue_date?: string | null
          issued_by?: string
          return_date?: string | null
          returned_to?: string | null
          status?: string | null
          student_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "library_transactions_book_id_fkey"
            columns: ["book_id"]
            isOneToOne: false
            referencedRelation: "library_books"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          attachment_url: string | null
          content: string
          created_at: string | null
          id: string
          is_read: boolean | null
          message_type: string | null
          parent_message_id: string | null
          read_at: string | null
          recipient_id: string
          sender_id: string
          subject: string | null
        }
        Insert: {
          attachment_url?: string | null
          content: string
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message_type?: string | null
          parent_message_id?: string | null
          read_at?: string | null
          recipient_id: string
          sender_id: string
          subject?: string | null
        }
        Update: {
          attachment_url?: string | null
          content?: string
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message_type?: string | null
          parent_message_id?: string | null
          read_at?: string | null
          recipient_id?: string
          sender_id?: string
          subject?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "messages_parent_message_id_fkey"
            columns: ["parent_message_id"]
            isOneToOne: false
            referencedRelation: "messages"
            referencedColumns: ["id"]
          },
        ]
      }
      student_transport: {
        Row: {
          academic_year: string
          created_at: string | null
          id: string
          is_active: boolean | null
          pickup_point: string
          route_id: string
          student_id: string
        }
        Insert: {
          academic_year: string
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          pickup_point: string
          route_id: string
          student_id: string
        }
        Update: {
          academic_year?: string
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          pickup_point?: string
          route_id?: string
          student_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "student_transport_route_id_fkey"
            columns: ["route_id"]
            isOneToOne: false
            referencedRelation: "transport_routes"
            referencedColumns: ["id"]
          },
        ]
      }
      "students (or teachers, attendance)": {
        Row: {
          class: string | null
          email: string | null
          id: string
          name: string
          "photo url": string | null
        }
        Insert: {
          class?: string | null
          email?: string | null
          id?: string
          name: string
          "photo url"?: string | null
        }
        Update: {
          class?: string | null
          email?: string | null
          id?: string
          name?: string
          "photo url"?: string | null
        }
        Relationships: []
      }
      subjects: {
        Row: {
          code: string
          created_at: string | null
          credits: number | null
          department: string | null
          description: string | null
          id: string
          name: string
        }
        Insert: {
          code: string
          created_at?: string | null
          credits?: number | null
          department?: string | null
          description?: string | null
          id?: string
          name: string
        }
        Update: {
          code?: string
          created_at?: string | null
          credits?: number | null
          department?: string | null
          description?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      support_tickets: {
        Row: {
          assigned_to: string | null
          attachment_url: string | null
          category: string
          created_at: string | null
          created_by: string
          description: string
          id: string
          priority: Database["public"]["Enums"]["ticket_priority"] | null
          resolution: string | null
          resolved_at: string | null
          status: Database["public"]["Enums"]["ticket_status"] | null
          ticket_number: string
          title: string
          updated_at: string | null
        }
        Insert: {
          assigned_to?: string | null
          attachment_url?: string | null
          category: string
          created_at?: string | null
          created_by: string
          description: string
          id?: string
          priority?: Database["public"]["Enums"]["ticket_priority"] | null
          resolution?: string | null
          resolved_at?: string | null
          status?: Database["public"]["Enums"]["ticket_status"] | null
          ticket_number: string
          title: string
          updated_at?: string | null
        }
        Update: {
          assigned_to?: string | null
          attachment_url?: string | null
          category?: string
          created_at?: string | null
          created_by?: string
          description?: string
          id?: string
          priority?: Database["public"]["Enums"]["ticket_priority"] | null
          resolution?: string | null
          resolved_at?: string | null
          status?: Database["public"]["Enums"]["ticket_status"] | null
          ticket_number?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      "Teachers Table": {
        Row: {
          class_assigned: string | null
          email: string | null
          id: string
          name: string
        }
        Insert: {
          class_assigned?: string | null
          email?: string | null
          id?: string
          name: string
        }
        Update: {
          class_assigned?: string | null
          email?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      tests: {
        Row: {
          class_id: string
          created_at: string | null
          created_by: string
          description: string | null
          duration_minutes: number
          id: string
          instructions: string | null
          invigilator_id: string | null
          room: string | null
          start_time: string
          subject_id: string
          syllabus: string | null
          test_date: string
          test_type: Database["public"]["Enums"]["grade_type"]
          title: string
          total_marks: number
          updated_at: string | null
        }
        Insert: {
          class_id: string
          created_at?: string | null
          created_by: string
          description?: string | null
          duration_minutes: number
          id?: string
          instructions?: string | null
          invigilator_id?: string | null
          room?: string | null
          start_time: string
          subject_id: string
          syllabus?: string | null
          test_date: string
          test_type: Database["public"]["Enums"]["grade_type"]
          title: string
          total_marks: number
          updated_at?: string | null
        }
        Update: {
          class_id?: string
          created_at?: string | null
          created_by?: string
          description?: string | null
          duration_minutes?: number
          id?: string
          instructions?: string | null
          invigilator_id?: string | null
          room?: string | null
          start_time?: string
          subject_id?: string
          syllabus?: string | null
          test_date?: string
          test_type?: Database["public"]["Enums"]["grade_type"]
          title?: string
          total_marks?: number
          updated_at?: string | null
        }
        Relationships: []
      }
      timetable: {
        Row: {
          academic_year: string
          class_id: string
          created_at: string | null
          day_of_week: number
          end_time: string
          id: string
          is_active: boolean | null
          room: string
          semester: string
          start_time: string
          subject_id: string
          teacher_id: string
          updated_at: string | null
        }
        Insert: {
          academic_year: string
          class_id: string
          created_at?: string | null
          day_of_week: number
          end_time: string
          id?: string
          is_active?: boolean | null
          room: string
          semester: string
          start_time: string
          subject_id: string
          teacher_id: string
          updated_at?: string | null
        }
        Update: {
          academic_year?: string
          class_id?: string
          created_at?: string | null
          day_of_week?: number
          end_time?: string
          id?: string
          is_active?: boolean | null
          room?: string
          semester?: string
          start_time?: string
          subject_id?: string
          teacher_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "timetable_subject_id_fkey"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "subjects"
            referencedColumns: ["id"]
          },
        ]
      }
      transport_routes: {
        Row: {
          capacity: number
          created_at: string | null
          driver_name: string
          driver_phone: string
          fare_amount: number
          id: string
          pickup_points: string[]
          route_name: string
          route_number: string
          status: Database["public"]["Enums"]["transport_status"] | null
          updated_at: string | null
          vehicle_number: string
        }
        Insert: {
          capacity: number
          created_at?: string | null
          driver_name: string
          driver_phone: string
          fare_amount: number
          id?: string
          pickup_points: string[]
          route_name: string
          route_number: string
          status?: Database["public"]["Enums"]["transport_status"] | null
          updated_at?: string | null
          vehicle_number: string
        }
        Update: {
          capacity?: number
          created_at?: string | null
          driver_name?: string
          driver_phone?: string
          fare_amount?: number
          id?: string
          pickup_points?: string[]
          route_name?: string
          route_number?: string
          status?: Database["public"]["Enums"]["transport_status"] | null
          updated_at?: string | null
          vehicle_number?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      assignment_status: "pending" | "submitted" | "graded" | "returned"
      certificate_type: "attendance" | "bonafide" | "academic" | "conduct"
      fee_status: "paid" | "pending" | "overdue" | "partial"
      grade_type: "assignment" | "quiz" | "midterm" | "final" | "project"
      ticket_priority: "low" | "medium" | "high" | "urgent"
      ticket_status: "open" | "in_progress" | "resolved" | "closed"
      transport_status: "active" | "inactive" | "maintenance"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      assignment_status: ["pending", "submitted", "graded", "returned"],
      certificate_type: ["attendance", "bonafide", "academic", "conduct"],
      fee_status: ["paid", "pending", "overdue", "partial"],
      grade_type: ["assignment", "quiz", "midterm", "final", "project"],
      ticket_priority: ["low", "medium", "high", "urgent"],
      ticket_status: ["open", "in_progress", "resolved", "closed"],
      transport_status: ["active", "inactive", "maintenance"],
    },
  },
} as const
