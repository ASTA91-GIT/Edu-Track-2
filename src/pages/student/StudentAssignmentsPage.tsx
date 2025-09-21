import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { 
  FileText, 
  Clock, 
  CheckCircle,
  AlertTriangle,
  Upload,
  Download,
  Calendar,
  BookOpen
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

export default function StudentAssignmentsPage() {
  const { profile } = useAuth();
  const [submissionText, setSubmissionText] = useState('');

  // Mock data - will be replaced with Supabase queries
  const assignments = [
    {
      id: '1',
      title: 'Data Structures Implementation',
      subject: 'Computer Science',
      description: 'Implement basic data structures using C++',
      dueDate: '2024-02-20',
      maxMarks: 100,
      status: 'pending',
      assignedDate: '2024-02-05',
      instructions: 'Create linked list, stack, and queue implementations'
    },
    {
      id: '2',
      title: 'Mathematical Analysis Report',
      subject: 'Mathematics',
      description: 'Analyze the convergence of infinite series',
      dueDate: '2024-02-15',
      maxMarks: 50,
      status: 'submitted',
      assignedDate: '2024-02-01',
      submittedAt: '2024-02-12',
      marksObtained: 42
    },
    {
      id: '3',
      title: 'Physics Lab Report',
      subject: 'Physics',
      description: 'Write a detailed report on wave interference experiment',
      dueDate: '2024-01-30',
      maxMarks: 75,
      status: 'graded',
      assignedDate: '2024-01-15',
      submittedAt: '2024-01-28',
      marksObtained: 68,
      feedback: 'Good analysis but needs better conclusion'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'submitted': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'graded': return 'bg-green-100 text-green-800 border-green-200';
      case 'overdue': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'submitted': return <Upload className="h-4 w-4" />;
      case 'graded': return <CheckCircle className="h-4 w-4" />;
      case 'overdue': return <AlertTriangle className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const pendingAssignments = assignments.filter(a => a.status === 'pending');
  const submittedAssignments = assignments.filter(a => a.status === 'submitted');
  const gradedAssignments = assignments.filter(a => a.status === 'graded');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Assignments
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage your assignments and submissions
          </p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-0 shadow-lg bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-950 dark:to-yellow-900">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-yellow-700 dark:text-yellow-300">
              Pending
            </CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-800 dark:text-yellow-200">
              {pendingAssignments.length}
            </div>
            <p className="text-xs text-yellow-600 dark:text-yellow-400">
              Need to submit
            </p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-700 dark:text-blue-300">
              Submitted
            </CardTitle>
            <Upload className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-800 dark:text-blue-200">
              {submittedAssignments.length}
            </div>
            <p className="text-xs text-blue-600 dark:text-blue-400">
              Under review
            </p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-700 dark:text-green-300">
              Graded
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-800 dark:text-green-200">
              {gradedAssignments.length}
            </div>
            <p className="text-xs text-green-600 dark:text-green-400">
              Completed
            </p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-primary/10 to-accent/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Average Score
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              {gradedAssignments.length > 0 
                ? Math.round(gradedAssignments.reduce((acc, a) => acc + (a.marksObtained! / a.maxMarks * 100), 0) / gradedAssignments.length)
                : 0}%
            </div>
            <p className="text-xs text-muted-foreground">
              Overall performance
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="pending" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="pending">Pending ({pendingAssignments.length})</TabsTrigger>
          <TabsTrigger value="submitted">Submitted ({submittedAssignments.length})</TabsTrigger>
          <TabsTrigger value="graded">Graded ({gradedAssignments.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-6">
          {pendingAssignments.map((assignment) => (
            <Card key={assignment.id} className="border-0 shadow-lg">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-primary" />
                    <CardTitle>{assignment.title}</CardTitle>
                  </div>
                  <Badge className={getStatusColor(assignment.status)}>
                    {getStatusIcon(assignment.status)}
                    <span className="ml-1">{assignment.status}</span>
                  </Badge>
                </div>
                <CardDescription>
                  {assignment.subject} • Due: {assignment.dueDate} • Max Marks: {assignment.maxMarks}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Description</h4>
                  <p className="text-muted-foreground">{assignment.description}</p>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">Instructions</h4>
                  <p className="text-muted-foreground">{assignment.instructions}</p>
                </div>

                <div className="space-y-3">
                  <h4 className="font-semibold">Submit Assignment</h4>
                  <Textarea
                    placeholder="Enter your submission text here..."
                    value={submissionText}
                    onChange={(e) => setSubmissionText(e.target.value)}
                    rows={4}
                  />
                  <div className="flex gap-2">
                    <Button className="bg-gradient-to-r from-primary to-accent">
                      <Upload className="h-4 w-4 mr-2" />
                      Submit Text
                    </Button>
                    <Button variant="outline">
                      <Upload className="h-4 w-4 mr-2" />
                      Upload File
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="submitted" className="space-y-6">
          {submittedAssignments.map((assignment) => (
            <Card key={assignment.id} className="border-0 shadow-lg">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-primary" />
                    <CardTitle>{assignment.title}</CardTitle>
                  </div>
                  <Badge className={getStatusColor(assignment.status)}>
                    {getStatusIcon(assignment.status)}
                    <span className="ml-1">{assignment.status}</span>
                  </Badge>
                </div>
                <CardDescription>
                  {assignment.subject} • Submitted: {assignment.submittedAt} • Max Marks: {assignment.maxMarks}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">{assignment.description}</p>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  Submitted successfully. Awaiting grades.
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="graded" className="space-y-6">
          {gradedAssignments.map((assignment) => (
            <Card key={assignment.id} className="border-0 shadow-lg">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-primary" />
                    <CardTitle>{assignment.title}</CardTitle>
                  </div>
                  <Badge className={getStatusColor(assignment.status)}>
                    {getStatusIcon(assignment.status)}
                    <span className="ml-1">{assignment.status}</span>
                  </Badge>
                </div>
                <CardDescription>
                  {assignment.subject} • Submitted: {assignment.submittedAt}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">{assignment.description}</p>
                
                <div className="flex items-center justify-between p-4 rounded-lg bg-green-50 border border-green-200">
                  <div>
                    <div className="font-semibold text-green-800">
                      Score: {assignment.marksObtained}/{assignment.maxMarks}
                    </div>
                    <div className="text-sm text-green-600">
                      {Math.round((assignment.marksObtained! / assignment.maxMarks) * 100)}%
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-1" />
                    Download
                  </Button>
                </div>

                {assignment.feedback && (
                  <div>
                    <h4 className="font-semibold mb-2">Feedback</h4>
                    <p className="text-muted-foreground bg-accent/10 p-3 rounded-lg">
                      {assignment.feedback}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}