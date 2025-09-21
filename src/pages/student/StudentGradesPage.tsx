import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Award, 
  TrendingUp, 
  BookOpen,
  BarChart3,
  Target,
  Calendar
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

export default function StudentGradesPage() {
  const { profile } = useAuth();
  const [selectedSemester, setSelectedSemester] = useState('spring-2024');

  // Mock data - will be replaced with Supabase queries
  const gradeData = {
    currentGPA: 8.5,
    overallGPA: 8.2,
    totalCredits: 24,
    completedCredits: 18
  };

  const subjects = [
    {
      id: '1',
      name: 'Data Structures',
      code: 'CS201',
      credits: 4,
      instructor: 'Dr. Smith',
      grades: [
        { type: 'assignment', name: 'Assignment 1', marks: 85, total: 100, weight: 10 },
        { type: 'quiz', name: 'Quiz 1', marks: 92, total: 100, weight: 15 },
        { type: 'midterm', name: 'Midterm', marks: 78, total: 100, weight: 30 },
        { type: 'final', name: 'Final Exam', marks: 0, total: 100, weight: 45 }
      ],
      currentGrade: 'A-',
      percentage: 87.5
    },
    {
      id: '2',
      name: 'Database Systems',
      code: 'CS301',
      credits: 3,
      instructor: 'Prof. Johnson',
      grades: [
        { type: 'assignment', name: 'Assignment 1', marks: 90, total: 100, weight: 20 },
        { type: 'project', name: 'Project', marks: 88, total: 100, weight: 40 },
        { type: 'midterm', name: 'Midterm', marks: 82, total: 100, weight: 40 }
      ],
      currentGrade: 'A',
      percentage: 86.8
    },
    {
      id: '3',
      name: 'Calculus II',
      code: 'MATH201',
      credits: 4,
      instructor: 'Dr. Wilson',
      grades: [
        { type: 'quiz', name: 'Quiz 1', marks: 75, total: 100, weight: 10 },
        { type: 'quiz', name: 'Quiz 2', marks: 88, total: 100, weight: 10 },
        { type: 'midterm', name: 'Midterm', marks: 72, total: 100, weight: 35 },
        { type: 'final', name: 'Final Exam', marks: 80, total: 100, weight: 45 }
      ],
      currentGrade: 'B+',
      percentage: 78.5
    }
  ];

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case 'A+':
      case 'A': return 'bg-green-100 text-green-800 border-green-200';
      case 'A-':
      case 'B+': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'B':
      case 'B-': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'C+':
      case 'C': return 'bg-orange-100 text-orange-800 border-orange-200';
      default: return 'bg-red-100 text-red-800 border-red-200';
    }
  };

  const getAssessmentIcon = (type: string) => {
    switch (type) {
      case 'assignment': return '📝';
      case 'quiz': return '❓';
      case 'midterm': return '📊';
      case 'final': return '🎯';
      case 'project': return '🔬';
      default: return '📋';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Grades & Performance
          </h1>
          <p className="text-muted-foreground mt-1">
            Track your academic performance and grades
          </p>
        </div>
        <Select value={selectedSemester} onValueChange={setSelectedSemester}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Select semester" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="spring-2024">Spring 2024</SelectItem>
            <SelectItem value="fall-2023">Fall 2023</SelectItem>
            <SelectItem value="spring-2023">Spring 2023</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-0 shadow-lg bg-gradient-to-br from-primary/10 to-accent/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Current GPA
            </CardTitle>
            <Award className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              {gradeData.currentGPA}
            </div>
            <Progress value={(gradeData.currentGPA / 10) * 100} className="mt-2 h-2" />
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-700 dark:text-green-300">
              Overall GPA
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-800 dark:text-green-200">
              {gradeData.overallGPA}
            </div>
            <p className="text-xs text-green-600 dark:text-green-400">
              All semesters
            </p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-700 dark:text-blue-300">
              Credits
            </CardTitle>
            <BookOpen className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-800 dark:text-blue-200">
              {gradeData.completedCredits}/{gradeData.totalCredits}
            </div>
            <Progress value={(gradeData.completedCredits / gradeData.totalCredits) * 100} className="mt-2 h-2" />
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-700 dark:text-purple-300">
              Subjects
            </CardTitle>
            <Target className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-800 dark:text-purple-200">
              {subjects.length}
            </div>
            <p className="text-xs text-purple-600 dark:text-purple-400">
              This semester
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="subjects">Subject Details</TabsTrigger>
          <TabsTrigger value="analytics">Performance Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Subject Overview */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <div className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-primary" />
                <CardTitle>Subject Performance</CardTitle>
              </div>
              <CardDescription>
                Your current grades across all subjects
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {subjects.map((subject) => (
                  <div key={subject.id} className="flex items-center justify-between p-4 rounded-lg bg-accent/5 border border-accent/10">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-accent/20 rounded-lg flex items-center justify-center">
                        <BookOpen className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{subject.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {subject.code} • {subject.credits} Credits • {subject.instructor}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge className={getGradeColor(subject.currentGrade)}>
                        {subject.currentGrade}
                      </Badge>
                      <div className="text-sm text-muted-foreground mt-1">
                        {subject.percentage}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="subjects" className="space-y-6">
          {subjects.map((subject) => (
            <Card key={subject.id} className="border-0 shadow-lg">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>{subject.name}</CardTitle>
                    <CardDescription>
                      {subject.code} • {subject.instructor} • {subject.credits} Credits
                    </CardDescription>
                  </div>
                  <Badge className={getGradeColor(subject.currentGrade)}>
                    {subject.currentGrade} ({subject.percentage}%)
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <h4 className="font-semibold">Assessment Breakdown</h4>
                  {subject.grades.map((grade, index) => (
                    <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-accent/5 border border-accent/10">
                      <div className="flex items-center gap-3">
                        <span className="text-lg">{getAssessmentIcon(grade.type)}</span>
                        <div>
                          <div className="font-medium">{grade.name}</div>
                          <div className="text-sm text-muted-foreground">
                            Weight: {grade.weight}%
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        {grade.marks > 0 ? (
                          <div>
                            <div className="font-semibold">
                              {grade.marks}/{grade.total}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {Math.round((grade.marks / grade.total) * 100)}%
                            </div>
                          </div>
                        ) : (
                          <Badge variant="secondary">Pending</Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <div className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-primary" />
                <CardTitle>Performance Trends</CardTitle>
              </div>
              <CardDescription>
                Your academic progress over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-muted-foreground">
                <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Performance analytics will be displayed here</p>
                <p className="text-sm">Charts and trends coming soon</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}