import { useState, useEffect } from "react";
import { GraduationCap, Plus, Edit, Trash2, Search, Mail, Phone } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Teacher {
  id: string;
  name: string;
  email?: string;
  teacher_id?: string;
  class_assigned?: string;
  phone?: string;
  department?: string;
  qualification?: string;
  is_active: boolean;
}

interface TeacherFormData {
  name: string;
  email: string;
  teacher_id: string;
  class_assigned: string;
  phone: string;
  department: string;
  qualification: string;
  is_active: boolean;
}

interface AdminTeachersTabProps {
  onRefresh: () => void;
}

export function AdminTeachersTab({ onRefresh }: AdminTeachersTabProps) {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);
  const [formData, setFormData] = useState<TeacherFormData>({
    name: '',
    email: '',
    teacher_id: '',
    class_assigned: '',
    phone: '',
    department: '',
    qualification: '',
    is_active: true
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchTeachers();
  }, []);

  const fetchTeachers = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('Teachers Table')
        .select('*')
        .order('name');
      
      if (error) throw error;
      setTeachers(data || []);
    } catch (error) {
      console.error('Error fetching teachers:', error);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      teacher_id: '',
      class_assigned: '',
      phone: '',
      department: '',
      qualification: '',
      is_active: true
    });
    setEditingTeacher(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editingTeacher) {
        const { error } = await supabase
          .from('Teachers Table')
          .update(formData)
          .eq('id', editingTeacher.id);

        if (error) throw error;
        toast({ title: "Success", description: "Teacher updated successfully" });
      } else {
        const { error } = await supabase
          .from('Teachers Table')
          .insert(formData);

        if (error) throw error;
        toast({ title: "Success", description: "Teacher created successfully" });
      }

      setDialogOpen(false);
      resetForm();
      fetchTeachers();
      onRefresh();
    } catch (error) {
      console.error('Error saving teacher:', error);
      toast({
        title: "Error",
        description: "Failed to save teacher",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (teacher: Teacher) => {
    setEditingTeacher(teacher);
    setFormData({
      name: teacher.name,
      email: teacher.email || '',
      teacher_id: teacher.teacher_id || '',
      class_assigned: teacher.class_assigned || '',
      phone: teacher.phone || '',
      department: teacher.department || '',
      qualification: teacher.qualification || '',
      is_active: teacher.is_active
    });
    setDialogOpen(true);
  };

  const handleDelete = async (teacherId: string) => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('Teachers Table')
        .delete()
        .eq('id', teacherId);

      if (error) throw error;
      toast({ title: "Success", description: "Teacher deleted successfully" });
      fetchTeachers();
      onRefresh();
    } catch (error) {
      console.error('Error deleting teacher:', error);
      toast({
        title: "Error",
        description: "Failed to delete teacher",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredTeachers = teachers.filter(teacher =>
    teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (teacher.email && teacher.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search teachers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
        
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="h-4 w-4 mr-2" />Add Teacher</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>{editingTeacher ? 'Edit Teacher' : 'Add New Teacher'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="teacher_id">Teacher ID</Label>
                  <Input
                    id="teacher_id"
                    value={formData.teacher_id}
                    onChange={(e) => setFormData(prev => ({ ...prev, teacher_id: e.target.value }))}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="department">Department</Label>
                  <Input
                    id="department"
                    value={formData.department}
                    onChange={(e) => setFormData(prev => ({ ...prev, department: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="class_assigned">Class Assigned</Label>
                  <Input
                    id="class_assigned"
                    value={formData.class_assigned}
                    onChange={(e) => setFormData(prev => ({ ...prev, class_assigned: e.target.value }))}
                  />
                </div>
              </div>
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
                <Button type="submit" disabled={loading}>
                  {loading ? "Saving..." : editingTeacher ? "Update" : "Add Teacher"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-4">
        {filteredTeachers.map((teacher) => (
          <Card key={teacher.id}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarFallback>{teacher.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-medium">{teacher.name}</h3>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      {teacher.email && (
                        <div className="flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          <span>{teacher.email}</span>
                        </div>
                      )}
                      {teacher.department && <span>{teacher.department}</span>}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  {teacher.class_assigned && <Badge variant="outline">{teacher.class_assigned}</Badge>}
                  <Badge variant={teacher.is_active ? "default" : "secondary"}>
                    {teacher.is_active ? "Active" : "Inactive"}
                  </Badge>
                  <Button variant="ghost" size="sm" onClick={() => handleEdit(teacher)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="sm" className="text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Teacher</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete "{teacher.name}"?
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDelete(teacher.id)}>Delete</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}