import { useState, useEffect } from "react";
import { Users, GraduationCap, BookOpen, Building, Plus, TrendingUp } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { AdminStudentsTab } from "@/components/admin/AdminStudentsTab";
import { AdminTeachersTab } from "@/components/admin/AdminTeachersTab";
import { AdminClassesTab } from "@/components/admin/AdminClassesTab";
import { AdminSubjectsTab } from "@/components/admin/AdminSubjectsTab";

interface DashboardStats {
  totalStudents: number;
  totalTeachers: number;
  totalSubjects: number;
  totalClasses: number;
  activeStudents: number;
  activeTeachers: number;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    totalStudents: 0,
    totalTeachers: 0,
    totalSubjects: 0,
    totalClasses: 0,
    activeStudents: 0,
    activeTeachers: 0
  });
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      // Fetch students stats
      const { count: totalStudents } = await supabase
        .from('students (or teachers, attendance)')
        .select('*', { count: 'exact', head: true });

      const { count: activeStudents } = await supabase
        .from('students (or teachers, attendance)')
        .select('*', { count: 'exact', head: true })
        .eq('is_active', true);

      // Fetch teachers stats
      const { count: totalTeachers } = await supabase
        .from('Teachers Table')
        .select('*', { count: 'exact', head: true });

      const { count: activeTeachers } = await supabase
        .from('Teachers Table')
        .select('*', { count: 'exact', head: true })
        .eq('is_active', true);

      // Fetch subjects stats
      const { count: totalSubjects } = await supabase
        .from('subjects')
        .select('*', { count: 'exact', head: true });

      // Fetch classes stats
      const { count: totalClasses } = await supabase
        .from('classes')
        .select('*', { count: 'exact', head: true });

      setStats({
        totalStudents: totalStudents || 0,
        totalTeachers: totalTeachers || 0,
        totalSubjects: totalSubjects || 0,
        totalClasses: totalClasses || 0,
        activeStudents: activeStudents || 0,
        activeTeachers: activeTeachers || 0
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
      toast({
        title: "Error",
        description: "Failed to fetch dashboard statistics",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const refreshStats = () => {
    fetchStats();
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage your educational institution</p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Students</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{loading ? "..." : stats.totalStudents}</div>
              <p className="text-xs text-muted-foreground">
                <Badge variant="secondary" className="mr-1">
                  {loading ? "..." : stats.activeStudents}
                </Badge>
                active students
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Teachers</CardTitle>
              <GraduationCap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{loading ? "..." : stats.totalTeachers}</div>
              <p className="text-xs text-muted-foreground">
                <Badge variant="secondary" className="mr-1">
                  {loading ? "..." : stats.activeTeachers}
                </Badge>
                active teachers
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Subjects</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{loading ? "..." : stats.totalSubjects}</div>
              <p className="text-xs text-muted-foreground">
                Available subjects
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Classes</CardTitle>
              <Building className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{loading ? "..." : stats.totalClasses}</div>
              <p className="text-xs text-muted-foreground">
                Active classes
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Management Tabs */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Management Console
            </CardTitle>
            <CardDescription>Manage students, teachers, classes, and subjects</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="students" className="space-y-4">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="students">Students</TabsTrigger>
                <TabsTrigger value="teachers">Teachers</TabsTrigger>
                <TabsTrigger value="classes">Classes</TabsTrigger>
                <TabsTrigger value="subjects">Subjects</TabsTrigger>
              </TabsList>
              
              <TabsContent value="students" className="space-y-4">
                <AdminStudentsTab onRefresh={refreshStats} />
              </TabsContent>
              
              <TabsContent value="teachers" className="space-y-4">
                <AdminTeachersTab onRefresh={refreshStats} />
              </TabsContent>
              
              <TabsContent value="classes" className="space-y-4">
                <AdminClassesTab onRefresh={refreshStats} />
              </TabsContent>
              
              <TabsContent value="subjects" className="space-y-4">
                <AdminSubjectsTab onRefresh={refreshStats} />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}