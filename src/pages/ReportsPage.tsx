import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { LineChart, Line, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import { 
  BarChart3, 
  TrendingUp, 
  Users,
  AlertTriangle,
  Download,
  Calendar,
  BookOpen,
  Target,
  FileText,
  Eye
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

const chartConfig = {
  attendance: {
    label: 'Attendance',
    color: 'hsl(var(--primary))',
  },
  performance: {
    label: 'Performance',
    color: 'hsl(var(--accent))',
  },
  present: {
    label: 'Present',
    color: 'hsl(var(--primary))',
  },
  absent: {
    label: 'Absent',
    color: 'hsl(var(--destructive))',
  },
};

export default function ReportsPage() {
  const { profile } = useAuth();
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [selectedClass, setSelectedClass] = useState('all');

  // Mock data for reports
  const attendanceData = [
    { month: 'Jan', attendance: 85 },
    { month: 'Feb', attendance: 92 },
    { month: 'Mar', attendance: 78 },
    { month: 'Apr', attendance: 95 },
    { month: 'May', attendance: 88 },
    { month: 'Jun', attendance: 91 },
  ];

  const subjectDistribution = [
    { name: 'Computer Science', value: 35, color: 'hsl(var(--primary))' },
    { name: 'Mathematics', value: 25, color: 'hsl(var(--accent))' },
    { name: 'Physics', value: 20, color: 'hsl(142, 76%, 36%)' },
    { name: 'Chemistry', value: 15, color: 'hsl(346, 87%, 43%)' },
    { name: 'English', value: 5, color: 'hsl(47, 96%, 53%)' },
  ];

  const classPerformance = [
    { class: 'CS-3A', attendance: 92, performance: 85 },
    { class: 'CS-3B', attendance: 88, performance: 82 },
    { class: 'ME-3A', attendance: 85, performance: 87 },
    { class: 'EE-3A', attendance: 90, performance: 84 },
  ];

  const defaulterList = [
    { name: 'John Doe', class: 'CS-3A', attendance: 65, subject: 'Data Structures' },
    { name: 'Jane Smith', class: 'CS-3B', attendance: 55, subject: 'Database Systems' },
    { name: 'Mike Johnson', class: 'ME-3A', attendance: 68, subject: 'Thermodynamics' },
    { name: 'Sarah Wilson', class: 'EE-3A', attendance: 62, subject: 'Circuit Analysis' },
  ];

  const reportStats = {
    totalStudents: 245,
    averageAttendance: 88.5,
    totalClasses: 12,
    activeSubjects: 25
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5">
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Hero Section */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary via-primary to-accent bg-clip-text text-transparent">
            Reports & Analytics
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Data-driven insights for better decisions
          </p>
        </div>

        {/* Filter Controls */}
        <Card className="border-0 shadow-lg bg-card/50 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex flex-wrap gap-4 items-center justify-between">
              <div className="flex flex-wrap gap-4">
                <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Time Period" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="week">This Week</SelectItem>
                    <SelectItem value="month">This Month</SelectItem>
                    <SelectItem value="semester">This Semester</SelectItem>
                    <SelectItem value="year">This Year</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={selectedClass} onValueChange={setSelectedClass}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Select Class" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Classes</SelectItem>
                    <SelectItem value="cs-3a">CS-3A</SelectItem>
                    <SelectItem value="cs-3b">CS-3B</SelectItem>
                    <SelectItem value="me-3a">ME-3A</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-2">
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Download PDF
                </Button>
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Export CSV
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Dashboard Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-primary/10 to-primary/5">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Students</CardTitle>
              <Users className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{reportStats.totalStudents}</div>
              <p className="text-xs text-muted-foreground">Across all classes</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-green-100 to-green-50 dark:from-green-950 dark:to-green-900">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-green-700 dark:text-green-300">
                Average Attendance
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-800 dark:text-green-200">
                {reportStats.averageAttendance}%
              </div>
              <p className="text-xs text-green-600 dark:text-green-400">+2.5% from last month</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-100 to-blue-50 dark:from-blue-950 dark:to-blue-900">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-700 dark:text-blue-300">
                Total Classes
              </CardTitle>
              <BookOpen className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-800 dark:text-blue-200">
                {reportStats.totalClasses}
              </div>
              <p className="text-xs text-blue-600 dark:text-blue-400">Active classes</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-100 to-purple-50 dark:from-purple-950 dark:to-purple-900">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-purple-700 dark:text-purple-300">
                Active Subjects
              </CardTitle>
              <Target className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-800 dark:text-purple-200">
                {reportStats.activeSubjects}
              </div>
              <p className="text-xs text-purple-600 dark:text-purple-400">Across all departments</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts and Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Attendance Trends */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                <CardTitle>Attendance Trends</CardTitle>
              </div>
              <CardDescription>Monthly attendance percentage over time</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={attendanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Line 
                      type="monotone" 
                      dataKey="attendance" 
                      stroke="var(--color-attendance)" 
                      strokeWidth={3}
                      dot={{ fill: "var(--color-attendance)", strokeWidth: 2, r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Subject Distribution */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <div className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-primary" />
                <CardTitle>Subject-wise Overview</CardTitle>
              </div>
              <CardDescription>Distribution of students across subjects</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={subjectDistribution}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {subjectDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <ChartTooltip content={<ChartTooltipContent />} />
                  </PieChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>

        {/* Class Performance and Defaulters */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Class Performance */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <div className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-primary" />
                <CardTitle>Class Performance</CardTitle>
              </div>
              <CardDescription>Attendance vs Performance by class</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={classPerformance}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="class" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="attendance" fill="var(--color-attendance)" name="Attendance %" />
                    <Bar dataKey="performance" fill="var(--color-performance)" name="Performance %" />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Defaulter List */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-destructive" />
                <CardTitle>Attendance Defaulters</CardTitle>
              </div>
              <CardDescription>Students with attendance below 75%</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {defaulterList.map((student, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-red-50 border border-red-200 dark:bg-red-950 dark:border-red-800">
                    <div>
                      <h4 className="font-semibold text-red-800 dark:text-red-200">{student.name}</h4>
                      <p className="text-sm text-red-600 dark:text-red-400">
                        {student.class} • {student.subject}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-red-800 dark:text-red-200">{student.attendance}%</div>
                      <Button variant="outline" size="sm" className="mt-1">
                        <Eye className="h-3 w-3 mr-1" />
                        View
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* CTA Section */}
        <Card className="border-0 shadow-lg bg-gradient-to-r from-primary/10 to-accent/10">
          <CardContent className="p-8 text-center">
            <h3 className="text-2xl font-bold mb-2">Need Detailed Analytics?</h3>
            <p className="text-muted-foreground mb-6">
              Get comprehensive reports with advanced insights and custom filters
            </p>
            <Button size="lg" className="bg-gradient-to-r from-primary to-accent">
              <BarChart3 className="h-5 w-5 mr-2" />
              View Detailed Analytics
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}