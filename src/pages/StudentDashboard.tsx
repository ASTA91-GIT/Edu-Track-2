import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar, 
  Clock, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle,
  QrCode
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

export default function StudentDashboard() {
  const { profile } = useAuth();

  // Mock data - in real app, this would come from Supabase
  const attendanceStats = {
    totalClasses: 45,
    present: 38,
    absent: 7,
    percentage: 84.4
  };

  const recentClasses = [
    { name: 'Mathematics', date: '2024-01-15', status: 'Present', time: '09:00 AM' },
    { name: 'Physics', date: '2024-01-15', status: 'Present', time: '11:00 AM' },
    { name: 'Chemistry', date: '2024-01-14', status: 'Absent', time: '02:00 PM' },
    { name: 'Biology', date: '2024-01-14', status: 'Present', time: '03:30 PM' },
  ];

  const getStatusColor = (status: string) => {
    return status === 'Present' ? 'bg-green-500/20 text-green-700 border-green-200' : 'bg-red-500/20 text-red-700 border-red-200';
  };

  const getAttendanceColor = (percentage: number) => {
    if (percentage >= 85) return 'text-green-600';
    if (percentage >= 75) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Welcome back, {profile?.name}!
          </h1>
          <p className="text-muted-foreground mt-1">
            Track your attendance and stay updated with your academic progress
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="border-primary/20 text-primary">
            {profile?.class || 'No Class Assigned'}
          </Badge>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-700 dark:text-green-300">
              Present Days
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-800 dark:text-green-200">
              {attendanceStats.present}
            </div>
            <p className="text-xs text-green-600 dark:text-green-400">
              Out of {attendanceStats.totalClasses} classes
            </p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-red-50 to-red-100 dark:from-red-950 dark:to-red-900">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-red-700 dark:text-red-300">
              Absent Days
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-800 dark:text-red-200">
              {attendanceStats.absent}
            </div>
            <p className="text-xs text-red-600 dark:text-red-400">
              Need to improve
            </p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-primary/10 to-accent/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Attendance Rate
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getAttendanceColor(attendanceStats.percentage)}`}>
              {attendanceStats.percentage}%
            </div>
            <Progress 
              value={attendanceStats.percentage} 
              className="mt-2 h-2"
            />
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-accent/10 to-primary/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Quick Actions
            </CardTitle>
            <QrCode className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <button className="w-full bg-gradient-to-r from-primary to-accent text-primary-foreground rounded-lg py-2 px-4 text-sm font-medium hover:shadow-lg transition-all duration-200">
              Scan QR Code
            </button>
          </CardContent>
        </Card>
      </div>

      {/* Recent Attendance */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            <CardTitle>Recent Attendance</CardTitle>
          </div>
          <CardDescription>
            Your attendance record for the past few classes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentClasses.map((classItem, index) => (
              <div key={index} className="flex items-center justify-between p-4 rounded-lg bg-accent/5 border border-accent/10">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-accent/20 rounded-lg flex items-center justify-center">
                    <span className="text-primary font-bold text-lg">
                      {classItem.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-semibold">{classItem.name}</h3>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {classItem.time} • {classItem.date}
                    </div>
                  </div>
                </div>
                <Badge className={getStatusColor(classItem.status)}>
                  {classItem.status}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Attendance Alert */}
      {attendanceStats.percentage < 75 && (
        <Card className="border-0 shadow-lg bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-950 dark:to-orange-950 border-yellow-200 dark:border-yellow-800">
          <CardHeader>
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-600" />
              <CardTitle className="text-yellow-800 dark:text-yellow-200">
                Attendance Warning
              </CardTitle>
            </div>
            <CardDescription className="text-yellow-700 dark:text-yellow-300">
              Your attendance is below the required 75% minimum. Please ensure regular attendance to avoid academic consequences.
            </CardDescription>
          </CardHeader>
        </Card>
      )}
    </div>
  );
}