import { useState, useEffect } from "react";
import { BookOpen, Plus, Calendar, Clock, MapPin, Edit, Trash2, CheckCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import DashboardLayout from "@/components/layout/DashboardLayout";

interface Lecture {
  id: string;
  title: string;
  description?: string;
  lecture_date: string;
  start_time: string;
  end_time: string;
  room?: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  notes?: string;
  subject_id: string;
  class_id: string;
  created_at: string;
  subject?: {
    name: string;
    code: string;
  };
  class?: {
    name: string;
    grade_level: string;
  };
}

interface LectureFormData {
  title: string;
  description: string;
  lecture_date: string;
  start_time: string;
  end_time: string;
  room: string;
  subject_id: string;
  class_id: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  notes: string;
}

interface Subject {
  id: string;
  name: string;
  code: string;
}

interface Class {
  id: string;
  name: string;
  grade_level: string;
}

export default function TeacherLecturesPage() {
  const [lectures, setLectures] = useState<Lecture[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingLecture, setEditingLecture] = useState<Lecture | null>(null);
  const [formData, setFormData] = useState<LectureFormData>({
    title: '',
    description: '',
    lecture_date: new Date().toISOString().split('T')[0],
    start_time: '09:00',
    end_time: '10:00',
    room: '',
    subject_id: '',
    class_id: '',
    status: 'scheduled',
    notes: ''
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchLectures();
    fetchSubjects();
    fetchClasses();
  }, []);

  const fetchLectures = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('lectures')
        .select(`
          *,
          subject:subjects(name, code),
          class:classes(name, grade_level)
        `)
        .order('lecture_date', { ascending: false })
        .order('start_time');
      
      if (error) throw error;
      setLectures((data as Lecture[]) || []);
    } catch (error) {
      console.error('Error fetching lectures:', error);
      toast({
        title: "Error",
        description: "Failed to fetch lectures",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchSubjects = async () => {
    try {
      const { data, error } = await supabase
        .from('subjects')
        .select('id, name, code')
        .order('name');
      
      if (error) throw error;
      setSubjects(data || []);
    } catch (error) {
      console.error('Error fetching subjects:', error);
    }
  };

  const fetchClasses = async () => {
    try {
      const { data, error } = await supabase
        .from('classes')
        .select('id, name, grade_level')
        .order('name');
      
      if (error) throw error;
      setClasses(data || []);
    } catch (error) {
      console.error('Error fetching classes:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      lecture_date: new Date().toISOString().split('T')[0],
      start_time: '09:00',
      end_time: '10:00',
      room: '',
      subject_id: '',
      class_id: '',
      status: 'scheduled',
      notes: ''
    });
    setEditingLecture(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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

      if (editingLecture) {
        // Update existing lecture
        const { error } = await supabase
          .from('lectures')
          .update({
            ...formData,
            teacher_id: teacher.id
          })
          .eq('id', editingLecture.id);

        if (error) throw error;
        
        toast({
          title: "Success",
          description: "Lecture updated successfully",
        });
      } else {
        // Create new lecture
        const { error } = await supabase
          .from('lectures')
          .insert({
            ...formData,
            teacher_id: teacher.id
          });

        if (error) throw error;
        
        toast({
          title: "Success",
          description: "Lecture created successfully",
        });
      }

      setDialogOpen(false);
      resetForm();
      fetchLectures();
    } catch (error) {
      console.error('Error saving lecture:', error);
      toast({
        title: "Error",
        description: "Failed to save lecture",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (lecture: Lecture) => {
    setEditingLecture(lecture);
    setFormData({
      title: lecture.title,
      description: lecture.description || '',
      lecture_date: lecture.lecture_date,
      start_time: lecture.start_time,
      end_time: lecture.end_time,
      room: lecture.room || '',
      subject_id: lecture.subject_id,
      class_id: lecture.class_id,
      status: lecture.status,
      notes: lecture.notes || ''
    });
    setDialogOpen(true);
  };

  const handleDelete = async (lectureId: string) => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('lectures')
        .delete()
        .eq('id', lectureId);

      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Lecture deleted successfully",
      });
      
      fetchLectures();
    } catch (error) {
      console.error('Error deleting lecture:', error);
      toast({
        title: "Error",
        description: "Failed to delete lecture",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const markAsCompleted = async (lectureId: string) => {
    try {
      const { error } = await supabase
        .from('lectures')
        .update({ status: 'completed' })
        .eq('id', lectureId);

      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Lecture marked as completed",
      });
      
      fetchLectures();
    } catch (error) {
      console.error('Error updating lecture status:', error);
      toast({
        title: "Error",
        description: "Failed to update lecture status",
        variant: "destructive",
      });
    }
  };

  const handleInputChange = (field: keyof LectureFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-success text-success-foreground';
      case 'cancelled':
        return 'bg-destructive text-destructive-foreground';
      default:
        return 'bg-secondary text-secondary-foreground';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timeString: string) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">My Lectures</h1>
            <p className="text-muted-foreground">Schedule and manage your lectures</p>
          </div>
          
          <Dialog open={dialogOpen} onOpenChange={(open) => {
            setDialogOpen(open);
            if (!open) resetForm();
          }}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Schedule Lecture
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingLecture ? 'Edit Lecture' : 'Schedule New Lecture'}
                </DialogTitle>
                <DialogDescription>
                  {editingLecture ? 'Update the lecture details' : 'Create a new lecture for your class'}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="title">Lecture Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder="Introduction to Algebra"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Brief description of the lecture content..."
                    rows={3}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="subject_id">Subject</Label>
                    <Select value={formData.subject_id} onValueChange={(value) => handleInputChange('subject_id', value)}>
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
                    <Label htmlFor="class_id">Class</Label>
                    <Select value={formData.class_id} onValueChange={(value) => handleInputChange('class_id', value)}>
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
                </div>
                
                <div>
                  <Label htmlFor="lecture_date">Date</Label>
                  <Input
                    id="lecture_date"
                    type="date"
                    value={formData.lecture_date}
                    onChange={(e) => handleInputChange('lecture_date', e.target.value)}
                    required
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="start_time">Start Time</Label>
                    <Input
                      id="start_time"
                      type="time"
                      value={formData.start_time}
                      onChange={(e) => handleInputChange('start_time', e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="end_time">End Time</Label>
                    <Input
                      id="end_time"
                      type="time"
                      value={formData.end_time}
                      onChange={(e) => handleInputChange('end_time', e.target.value)}
                      required
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="room">Room</Label>
                    <Input
                      id="room"
                      value={formData.room}
                      onChange={(e) => handleInputChange('room', e.target.value)}
                      placeholder="Room 101"
                    />
                  </div>
                  <div>
                    <Label htmlFor="status">Status</Label>
                    <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="scheduled">Scheduled</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => handleInputChange('notes', e.target.value)}
                    placeholder="Additional notes or reminders..."
                    rows={2}
                  />
                </div>
                
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={loading}>
                    {loading ? "Saving..." : editingLecture ? "Update Lecture" : "Schedule Lecture"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Lectures List */}
        <div className="space-y-4">
          {lectures.map((lecture) => (
            <Card key={lecture.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <CardTitle className="text-lg">{lecture.title}</CardTitle>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <BookOpen className="h-4 w-4" />
                        <span>{lecture.subject?.name} ({lecture.subject?.code})</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>{formatDate(lecture.lecture_date)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>{formatTime(lecture.start_time)} - {formatTime(lecture.end_time)}</span>
                      </div>
                      {lecture.room && (
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          <span>{lecture.room}</span>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className={getStatusColor(lecture.status)}>
                        {lecture.status.charAt(0).toUpperCase() + lecture.status.slice(1)}
                      </Badge>
                      <Badge variant="outline">{lecture.class?.name} - {lecture.class?.grade_level}</Badge>
                    </div>
                  </div>
                  
                  <div className="flex gap-1">
                    {lecture.status === 'scheduled' && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => markAsCompleted(lecture.id)}
                        className="text-success hover:text-success"
                      >
                        <CheckCircle className="h-4 w-4" />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(lecture)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Lecture</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete "{lecture.title}"? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(lecture.id)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </CardHeader>
              {lecture.description && (
                <CardContent>
                  <p className="text-sm text-muted-foreground">{lecture.description}</p>
                  {lecture.notes && (
                    <div className="mt-2 p-2 bg-muted rounded-md">
                      <p className="text-sm"><strong>Notes:</strong> {lecture.notes}</p>
                    </div>
                  )}
                </CardContent>
              )}
            </Card>
          ))}
          
          {lectures.length === 0 && !loading && (
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No lectures scheduled</h3>
                <p className="text-muted-foreground text-center mb-4">
                  Start by scheduling your first lecture
                </p>
                <Button onClick={() => setDialogOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Schedule Your First Lecture
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
        
        {loading && lectures.length === 0 && (
          <div className="flex justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading lectures...</p>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}