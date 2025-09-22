import { useState, useEffect } from "react";
import { Calendar, Users, CheckCircle, XCircle, Clock, Search, Filter } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import DashboardLayout from "@/components/layout/DashboardLayout";

interface Student {
  id: string;
  name: string;
  student_id: string;
  email: string;
  class: string;
  photo_url?: string;
}

interface Class {
  id: string;
  name: string;
  grade_level: string;
}

interface Subject {
  id: string;
  name: string;
  code: string;
}

interface AttendanceRecord {
  student_id: string;
  status: 'present' | 'absent' | 'late' | 'excused';
  notes?: string;
}

export default function TeacherAttendancePage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [selectedClass, setSelectedClass] = useState<string>("");
  const [selectedSubject, setSelectedSubject] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [attendance, setAttendance] = useState<Record<string, AttendanceRecord>>({});
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchClasses();
    fetchSubjects();
  }, []);

  useEffect(() => {
    if (selectedClass) {
      fetchStudents();
      fetchExistingAttendance();
    }
  }, [selectedClass, selectedDate]);

  const fetchClasses = async () => {
    const { data, error } = await supabase
      .from('classes')
      .select('*')
      .order('name');
    
    if (error) {
      toast({
        title: "Error",
        description: "Failed to fetch classes",
        variant: "destructive",
      });
      return;
    }
    
    setClasses(data || []);
  };

  const fetchSubjects = async () => {
    const { data, error } = await supabase
      .from('subjects')
      .select('*')
      .order('name');
    
    if (error) {
      toast({
        title: "Error",
        description: "Failed to fetch subjects",
        variant: "destructive",
      });
      return;
    }
    
    setSubjects(data || []);
  };

  const fetchStudents = async () => {
    if (!selectedClass) return;
    
    const { data, error } = await supabase
      .from('students (or teachers, attendance)')
      .select('*')
      .eq('class_id', selectedClass)
      .eq('is_active', true)
      .order('name');
    
    if (error) {
      toast({
        title: "Error",
        description: "Failed to fetch students",
        variant: "destructive",
      });
      return;
    }
    
    setStudents(data || []);
    
    // Initialize attendance records
    const initialAttendance: Record<string, AttendanceRecord> = {};
    data?.forEach(student => {
      initialAttendance[student.id] = {
        student_id: student.id,
        status: 'absent',
        notes: ''
      };
    });
    setAttendance(initialAttendance);
  };

  const fetchExistingAttendance = async () => {
    if (!selectedClass || !selectedDate) return;
    
    const { data, error } = await supabase
      .from('Attendance Table')
      .select('*')
      .eq('class_id', selectedClass)
      .eq('attendance_date', selectedDate);
    
    if (error) {
      console.error('Error fetching attendance:', error);
      return;
    }
    
    // Update attendance state with existing records
    const existingAttendance: Record<string, AttendanceRecord> = {};
    data?.forEach(record => {
      existingAttendance[record.student_id] = {
        student_id: record.student_id,
        status: record.status as 'present' | 'absent' | 'late' | 'excused',
        notes: record.notes || ''
      };
    });
    
    setAttendance(prev => ({
      ...prev,
      ...existingAttendance
    }));
  };

  const updateAttendance = (studentId: string, status: 'present' | 'absent' | 'late' | 'excused') => {
    setAttendance(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        status
      }
    }));
  };

  const updateNotes = (studentId: string, notes: string) => {
    setAttendance(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        notes
      }
    }));
  };

  const saveAttendance = async () => {
    if (!selectedClass || !selectedSubject) {
      toast({
        title: "Error",
        description: "Please select a class and subject",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      // Get current teacher ID
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data: teacher, error: teacherError } = await supabase
        .from('Teachers Table')
        .select('id')
        .eq('email', user.email)
        .single();

      if (teacherError) throw teacherError;

      // Delete existing attendance for this date/class/subject
      await supabase
        .from('Attendance Table')
        .delete()
        .eq('class_id', selectedClass)
        .eq('subject_id', selectedSubject)
        .eq('attendance_date', selectedDate);

      // Insert new attendance records
      const attendanceRecords = Object.values(attendance).map(record => ({
        student_id: record.student_id,
        class_id: selectedClass,
        subject_id: selectedSubject,
        teacher_id: teacher.id,
        attendance_date: selectedDate,
        status: record.status,
        notes: record.notes,
        marked_at: new Date().toISOString()
      }));

      const { error } = await supabase
        .from('Attendance Table')
        .insert(attendanceRecords);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Attendance saved successfully",
      });
    } catch (error) {
      console.error('Error saving attendance:', error);
      toast({
        title: "Error",
        description: "Failed to save attendance",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const markAllPresent = () => {
    const updatedAttendance = { ...attendance };
    Object.keys(updatedAttendance).forEach(studentId => {
      updatedAttendance[studentId].status = 'present';
    });
    setAttendance(updatedAttendance);
  };

  const markAllAbsent = () => {
    const updatedAttendance = { ...attendance };
    Object.keys(updatedAttendance).forEach(studentId => {
      updatedAttendance[studentId].status = 'absent';
    });
    setAttendance(updatedAttendance);
  };

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.student_id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'present':
        return 'bg-success text-success-foreground';
      case 'late':
        return 'bg-warning text-warning-foreground';
      case 'excused':
        return 'bg-info text-info-foreground';
      default:
        return 'bg-destructive text-destructive-foreground';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'present':
        return <CheckCircle className="h-4 w-4" />;
      case 'late':
        return <Clock className="h-4 w-4" />;
      case 'excused':
        return <Clock className="h-4 w-4" />;
      default:
        return <XCircle className="h-4 w-4" />;
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Attendance Management</h1>
          <p className="text-muted-foreground">Mark and manage student attendance</p>
        </div>

        {/* Controls */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Attendance Settings
            </CardTitle>
            <CardDescription>Select class, subject, and date to manage attendance</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="text-sm font-medium">Class</label>
                <Select value={selectedClass} onValueChange={setSelectedClass}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select class" />
                  </SelectTrigger>
                  <SelectContent>
                    {classes.map(cls => (
                      <SelectItem key={cls.id} value={cls.id}>
                        {cls.name} - {cls.grade_level}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm font-medium">Subject</label>
                <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select subject" />
                  </SelectTrigger>
                  <SelectContent>
                    {subjects.map(subject => (
                      <SelectItem key={subject.id} value={subject.id}>
                        {subject.name} ({subject.code})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm font-medium">Date</label>
                <Input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                />
              </div>
              
              <div className="flex items-end">
                <Button onClick={saveAttendance} disabled={loading || !selectedClass || !selectedSubject}>
                  {loading ? "Saving..." : "Save Attendance"}
                </Button>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={markAllPresent}>
                <CheckCircle className="h-4 w-4 mr-2" />
                Mark All Present
              </Button>
              <Button variant="outline" size="sm" onClick={markAllAbsent}>
                <XCircle className="h-4 w-4 mr-2" />
                Mark All Absent
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Student List */}
        {selectedClass && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Students ({filteredStudents.length})
              </CardTitle>
              <div className="flex items-center gap-2">
                <div className="relative flex-1 max-w-sm">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search students..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredStudents.map(student => (
                  <div key={student.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={student.photo_url} />
                        <AvatarFallback>{student.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{student.name}</p>
                        <p className="text-sm text-muted-foreground">ID: {student.student_id}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {(['present', 'absent', 'late', 'excused'] as const).map(status => (
                        <Button
                          key={status}
                          variant={attendance[student.id]?.status === status ? "default" : "outline"}
                          size="sm"
                          onClick={() => updateAttendance(student.id, status)}
                          className={attendance[student.id]?.status === status ? getStatusColor(status) : ''}
                        >
                          {getStatusIcon(status)}
                          {status.charAt(0).toUpperCase() + status.slice(1)}
                        </Button>
                      ))}
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className={getStatusColor(attendance[student.id]?.status || 'absent')}>
                        {attendance[student.id]?.status || 'absent'}
                      </Badge>
                      <Input
                        placeholder="Notes..."
                        value={attendance[student.id]?.notes || ''}
                        onChange={(e) => updateNotes(student.id, e.target.value)}
                        className="w-32"
                      />
                    </div>
                  </div>
                ))}
                
                {filteredStudents.length === 0 && selectedClass && (
                  <div className="text-center py-8 text-muted-foreground">
                    No students found in selected class
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}