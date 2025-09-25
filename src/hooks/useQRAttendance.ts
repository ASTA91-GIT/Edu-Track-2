import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';

interface QRAttendanceSession {
  id: string;
  session_id: string;
  subject_id: string;
  class_id: string;
  teacher_id: string;
  start_time: string;
  end_time?: string;
  is_active: boolean;
  qr_refresh_interval: number;
  location?: string;
  created_at: string;
}

interface QRScan {
  id: string;
  session_id: string;
  student_id: string;
  scan_timestamp: string;
  qr_code_data: string;
  is_valid: boolean;
  validation_errors?: string[];
}

export const useQRAttendance = () => {
  const [sessions, setSessions] = useState<QRAttendanceSession[]>([]);
  const [currentSession, setCurrentSession] = useState<QRAttendanceSession | null>(null);
  const [scans, setScans] = useState<QRScan[]>([]);
  const [loading, setLoading] = useState(false);
  const { profile } = useAuth();
  const { toast } = useToast();

  // Generate unique session ID
  const generateSessionId = () => {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8);
    return `ATT-${timestamp}-${random}`.toUpperCase();
  };

  // Create QR attendance session (teachers only)
  const createSession = async (subjectId: string, classId: string, location?: string) => {
    if (profile?.role !== 'teacher' && profile?.role !== 'admin') {
      toast({
        title: "Access Denied",
        description: "Only teachers can create attendance sessions",
        variant: "destructive"
      });
      return null;
    }

    try {
      setLoading(true);
      
      // First get teacher ID from profile
      const { data: teachers, error: teacherError } = await supabase
        .from('Teachers Table')
        .select('id')
        .eq('email', profile?.email)
        .single();

      if (teacherError || !teachers) {
        toast({
          title: "Error",
          description: "Teacher profile not found",
          variant: "destructive"
        });
        return null;
      }

      const sessionId = generateSessionId();
      const { data, error } = await supabase
        .from('qr_attendance_sessions')
        .insert({
          session_id: sessionId,
          subject_id: subjectId,
          class_id: classId,
          teacher_id: teachers.id,
          location,
          is_active: true
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating session:', error);
        toast({
          title: "Error",
          description: "Failed to create attendance session",
          variant: "destructive"
        });
        return null;
      }

      setCurrentSession(data as QRAttendanceSession);
      toast({
        title: "Session Created",
        description: `Attendance session started successfully`,
      });

      return data as QRAttendanceSession;

    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive"
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  // End QR attendance session
  const endSession = async (sessionId: string) => {
    try {
      const { error } = await supabase
        .from('qr_attendance_sessions')
        .update({
          is_active: false,
          end_time: new Date().toISOString()
        })
        .eq('id', sessionId);

      if (error) {
        console.error('Error ending session:', error);
        toast({
          title: "Error",
          description: "Failed to end session",
          variant: "destructive"
        });
        return false;
      }

      setCurrentSession(null);
      toast({
        title: "Session Ended",
        description: "Attendance session has been ended successfully"
      });

      return true;

    } catch (error) {
      console.error('Error:', error);
      return false;
    }
  };

  // Generate QR code data with security
  const generateQRData = (session: QRAttendanceSession) => {
    const timestamp = Date.now();
    const qrData = {
      sessionId: session.session_id,
      subjectId: session.subject_id,
      classId: session.class_id,
      teacherId: session.teacher_id,
      timestamp,
      validUntil: timestamp + (session.qr_refresh_interval * 1000),
      // Simple hash for validation (in production, use proper signing)
      hash: btoa(`${session.session_id}-${timestamp}-${session.subject_id}`).slice(0, 12)
    };
    return JSON.stringify(qrData);
  };

  // Validate and process QR scan (students only)
  const processQRScan = async (qrCodeData: string) => {
    if (profile?.role !== 'student') {
      toast({
        title: "Access Denied",
        description: "Only students can scan QR codes",
        variant: "destructive"
      });
      return false;
    }

    try {
      setLoading(true);
      
      // Parse QR data
      const qrData = JSON.parse(qrCodeData);
      const currentTime = Date.now();
      
      // Validate QR code
      const validationErrors: string[] = [];
      
      if (currentTime > qrData.validUntil) {
        validationErrors.push('QR code has expired');
      }
      
      if (currentTime < (qrData.timestamp - 30000)) {
        validationErrors.push('QR code timestamp is invalid');
      }

      // Get session to validate
      const { data: session, error: sessionError } = await supabase
        .from('qr_attendance_sessions')
        .select('*')
        .eq('session_id', qrData.sessionId)
        .eq('is_active', true)
        .single();

      if (sessionError || !session) {
        validationErrors.push('Session not found or inactive');
      }

      // Check for duplicate scan
      if (session) {
        const { data: existingScan } = await supabase
          .from('qr_scans')
          .select('id')
          .eq('session_id', session.id)
          .eq('student_id', profile?.id)
          .single();

        if (existingScan) {
          validationErrors.push('Already scanned for this session');
        }
      }

      const isValid = validationErrors.length === 0;

      // Record the scan attempt
      if (session && profile?.id) {
        const { error: scanError } = await supabase
          .from('qr_scans')
          .insert({
            session_id: session.id,
            student_id: profile.id,
            qr_code_data: qrCodeData,
            is_valid: isValid,
            validation_errors: validationErrors,
            ip_address: 'client',
            user_agent: navigator.userAgent
          });

        if (scanError) {
          console.error('Error recording scan:', scanError);
        }
      }

      if (isValid) {
        toast({
          title: "Attendance Marked",
          description: `Successfully marked present for the session`,
        });
        return true;
      } else {
        toast({
          title: "Scan Failed",
          description: validationErrors.join(', '),
          variant: "destructive"
        });
        return false;
      }

    } catch (error) {
      console.error('Error processing QR scan:', error);
      toast({
        title: "Scan Error",
        description: "Invalid QR code format",
        variant: "destructive"
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Fetch session scans (teachers only)
  const fetchSessionScans = async (sessionId: string) => {
    try {
      const { data, error } = await supabase
        .from('qr_scans')
        .select('*')
        .eq('session_id', sessionId)
        .order('scan_timestamp', { ascending: false });

      if (error) {
        console.error('Error fetching scans:', error);
        return;
      }

      setScans((data as QRScan[]) || []);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  // Fetch active sessions for students
  const fetchActiveSessions = async () => {
    if (profile?.role !== 'student') return;

    try {
      const { data, error } = await supabase
        .from('qr_attendance_sessions')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching active sessions:', error);
        return;
      }

      setSessions((data as QRAttendanceSession[]) || []);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  useEffect(() => {
    if (profile?.role === 'student') {
      fetchActiveSessions();
    }
  }, [profile]);

  return {
    sessions,
    currentSession,
    scans,
    loading,
    createSession,
    endSession,
    generateQRData,
    processQRScan,
    fetchSessionScans,
    fetchActiveSessions
  };
};