import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Users, 
  QrCode, 
  Calendar, 
  Clock,
  BookOpen,
  TrendingUp,
  UserCheck,
  UserX,
  Plus
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { QRCodeCanvas } from 'qrcode.react';
import { useToast } from '@/hooks/use-toast';

export default function TeacherDashboard() {
  const { profile } = useAuth();
  const { toast } = useToast();
  const [activeSession, setActiveSession] = useState<string | null>(null);
  const [sessionName, setSessionName] = useState('');
  const [selectedClass, setSelectedClass] = useState('');

  // Mock data - in real app, this would come from Supabase
  const teacherStats = {
    totalStudents: 120,
    classesToday: 4,
    averageAttendance: 87.5,
    activeSessions: 1
  };

  const upcomingClasses = [
    { name: 'Mathematics 101', time: '09:00 AM', students: 30, room: 'Room A-101' },
    { name: 'Advanced Calculus', time: '11:00 AM', students: 25, room: 'Room A-102' },
    { name: 'Statistics', time: '02:00 PM', students: 35, room: 'Room B-201' },
    { name: 'Linear Algebra', time: '04:00 PM', students: 30, room: 'Room A-103' },
  ];

  const recentAttendance = [
    { class: 'Mathematics 101', date: '2024-01-15', present: 28, total: 30, percentage: 93.3 },
    { class: 'Advanced Calculus', date: '2024-01-15', present: 22, total: 25, percentage: 88.0 },
    { class: 'Statistics', date: '2024-01-14', present: 30, total: 35, percentage: 85.7 },
    { class: 'Linear Algebra', date: '2024-01-14', present: 26, total: 30, percentage: 86.7 },
  ];

  const createAttendanceSession = () => {
    if (!sessionName.trim()) {
      toast({
        title: "Session Name Required",
        description: "Please enter a name for the attendance session.",
        variant: "destructive"
      });
      return;
    }

    // Generate unique session ID
    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    setActiveSession(sessionId);
    
    toast({
      title: "Session Created!",
      description: `Attendance session "${sessionName}" is now active.`,
    });
  };

  const endSession = () => {
    setActiveSession(null);
    setSessionName('');
    toast({
      title: "Session Ended",
      description: "The attendance session has been closed.",
    });
  };

  const getAttendanceColor = (percentage: number) => {
    if (percentage >= 90) return 'text-green-600 bg-green-50 border-green-200';
    if (percentage >= 80) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Teacher Dashboard
          </h1>
          <p className="text-muted-foreground mt-1">
            Welcome back, {profile?.name}! Manage your classes and track attendance.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="border-primary/20 text-primary">
            <BookOpen className="h-3 w-3 mr-1" />
            {profile?.class || 'Mathematics Department'}
          </Badge>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-700 dark:text-blue-300">
              Total Students
            </CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-800 dark:text-blue-200">
              {teacherStats.totalStudents}
            </div>
            <p className="text-xs text-blue-600 dark:text-blue-400">
              Across all classes
            </p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-700 dark:text-green-300">
              Classes Today
            </CardTitle>
            <Calendar className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-800 dark:text-green-200">
              {teacherStats.classesToday}
            </div>
            <p className="text-xs text-green-600 dark:text-green-400">
              Scheduled for today
            </p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-primary/10 to-accent/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Avg. Attendance
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              {teacherStats.averageAttendance}%
            </div>
            <p className="text-xs text-muted-foreground">
              This semester
            </p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-accent/10 to-primary/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Sessions
            </CardTitle>
            <QrCode className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-accent">
              {activeSession ? 1 : 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Currently running
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="qr-session">QR Session</TabsTrigger>
          <TabsTrigger value="attendance">Attendance</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Upcoming Classes */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                <CardTitle>Today's Schedule</CardTitle>
              </div>
              <CardDescription>
                Your upcoming classes for today
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingClasses.map((classItem, index) => (
                  <div key={index} className="flex items-center justify-between p-4 rounded-lg bg-accent/5 border border-accent/10">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-accent/20 rounded-lg flex items-center justify-center">
                        <BookOpen className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{classItem.name}</h3>
                        <p className="text-sm text-muted-foreground">{classItem.room}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">{classItem.time}</div>
                      <div className="text-sm text-muted-foreground">
                        {classItem.students} students
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="qr-session" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Create Session */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="h-5 w-5 text-primary" />
                  Create Attendance Session
                </CardTitle>
                <CardDescription>
                  Generate a QR code for students to mark their attendance
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="session-name">Session Name</Label>
                  <Input
                    id="session-name"
                    placeholder="e.g., Mathematics 101 - Morning Session"
                    value={sessionName}
                    onChange={(e) => setSessionName(e.target.value)}
                    disabled={!!activeSession}
                  />
                </div>
                
                {!activeSession ? (
                  <Button 
                    onClick={createAttendanceSession}
                    className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
                  >
                    <QrCode className="h-4 w-4 mr-2" />
                    Create QR Session
                  </Button>
                ) : (
                  <Button 
                    onClick={endSession}
                    variant="destructive"
                    className="w-full"
                  >
                    End Session
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Active QR Code */}
            {activeSession && (
              <Card className="border-0 shadow-lg bg-gradient-to-br from-primary/5 to-accent/5">
                <CardHeader className="text-center">
                  <CardTitle className="text-primary">Active QR Session</CardTitle>
                  <CardDescription>
                    Students can scan this QR code to mark attendance
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center space-y-4">
                  <div className="bg-white p-6 rounded-2xl shadow-lg inline-block">
                    <QRCodeCanvas
                      value={activeSession}
                      size={200}
                      level="H"
                      includeMargin={true}
                    />
                  </div>
                  <div>
                    <p className="font-semibold">{sessionName}</p>
                    <p className="text-sm text-muted-foreground">
                      Session ID: {activeSession.split('_').pop()}
                    </p>
                  </div>
                  <Badge className="bg-green-100 text-green-800 border-green-200">
                    ● Active
                  </Badge>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="attendance" className="space-y-6">
          {/* Recent Attendance Records */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <div className="flex items-center gap-2">
                <UserCheck className="h-5 w-5 text-primary" />
                <CardTitle>Recent Attendance Records</CardTitle>
              </div>
              <CardDescription>
                Attendance statistics for your recent classes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentAttendance.map((record, index) => (
                  <div key={index} className="flex items-center justify-between p-4 rounded-lg bg-accent/5 border border-accent/10">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-accent/20 rounded-lg flex items-center justify-center">
                        <Calendar className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{record.class}</h3>
                        <p className="text-sm text-muted-foreground">{record.date}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-2 mb-1">
                        <UserCheck className="h-4 w-4 text-green-600" />
                        <span className="font-semibold">{record.present}</span>
                        <UserX className="h-4 w-4 text-red-600" />
                        <span className="font-semibold">{record.total - record.present}</span>
                      </div>
                      <Badge className={getAttendanceColor(record.percentage)}>
                        {record.percentage.toFixed(1)}%
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}