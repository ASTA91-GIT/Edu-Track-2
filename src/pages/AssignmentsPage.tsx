import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { 
  FileText, 
  Upload,
  Download,
  Calendar as CalendarIcon,
  Clock,
  CheckCircle,
  AlertTriangle,
  Plus,
  Filter,
  Eye,
  User,
  BookOpen,
  Target,
  Users
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { format } from 'date-fns';

export default function AssignmentsPage() {
  const { profile } = useAuth();
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedDeadline, setSelectedDeadline] = useState('all');
  const [createOpen, setCreateOpen] = useState(false);
  const [dueDate, setDueDate] = useState<Date>();

  // Mock data for assignments
  const assignments = [
    {
      id: '1',
      title: 'Data Structures Implementation',
      subject: 'Computer Science',
      description: 'Implement basic data structures using C++: LinkedList, Stack, Queue, and Binary Tree',
      dueDate: '2024-02-25',
      maxMarks: 100,
      assignedDate: '2024-02-10',
      status: 'active',
      submissionsCount: 28,
      totalStudents: 45,
      createdBy: 'Dr. Smith',
      instructions: 'Submit source code files with proper documentation and test cases',
      attachmentUrl: '/assignments/ds-assignment.pdf',
      class: 'CS-3A'
    },
    {
      id: '2',
      title: 'Database Design Project',
      subject: 'Computer Science',
      description: 'Design and implement a complete database system for a library management system',
      dueDate: '2024-03-05',
      maxMarks: 150,
      assignedDate: '2024-02-15',
      status: 'active',
      submissionsCount: 12,
      totalStudents: 40,
      createdBy: 'Prof. Johnson',
      instructions: 'Include ER diagram, normalized tables, and sample queries',
      attachmentUrl: '/assignments/db-project.pdf',
      class: 'CS-3B'
    },
    {
      id: '3',
      title: 'Mathematical Analysis',
      subject: 'Mathematics',
      description: 'Solve complex analysis problems and provide detailed solutions',
      dueDate: '2024-02-20',
      maxMarks: 75,
      assignedDate: '2024-02-05',
      status: 'completed',
      submissionsCount: 35,
      totalStudents: 35,
      createdBy: 'Dr. Wilson',
      instructions: 'Show all steps and provide graphical representations where applicable',
      attachmentUrl: '/assignments/math-analysis.pdf',
      class: 'ME-3A'
    }
  ];

  const submissions = [
    {
      id: '1',
      assignmentId: '1',
      studentName: 'John Doe',
      rollNo: 'CS001',
      submittedAt: '2024-02-20 10:30 AM',
      status: 'submitted',
      fileUrl: '/submissions/john-ds-assignment.zip',
      grade: null,
      feedback: null,
      isLate: false
    },
    {
      id: '2',
      assignmentId: '1',
      studentName: 'Jane Smith',
      rollNo: 'CS002',
      submittedAt: '2024-02-22 14:15 PM',
      status: 'graded',
      fileUrl: '/submissions/jane-ds-assignment.zip',
      grade: 85,
      feedback: 'Good implementation but needs better documentation',
      isLate: false
    },
    {
      id: '3',
      assignmentId: '1',
      studentName: 'Mike Johnson',
      rollNo: 'CS003',
      submittedAt: null,
      status: 'pending',
      fileUrl: null,
      grade: null,
      feedback: null,
      isLate: true
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'overdue': return 'bg-red-100 text-red-800 border-red-200';
      case 'draft': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'submitted': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'graded': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <Clock className="h-4 w-4" />;
      case 'completed': return <CheckCircle className="h-4 w-4" />;
      case 'overdue': return <AlertTriangle className="h-4 w-4" />;
      case 'submitted': return <Upload className="h-4 w-4" />;
      case 'graded': return <CheckCircle className="h-4 w-4" />;
      case 'pending': return <Clock className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const filteredAssignments = assignments.filter(assignment => {
    const matchesSubject = selectedSubject === 'all' || assignment.subject.toLowerCase().includes(selectedSubject.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || assignment.status === selectedStatus;
    const matchesDeadline = selectedDeadline === 'all' || true; // Add deadline filtering logic
    
    return matchesSubject && matchesStatus && matchesDeadline;
  });

  const getSubmissionsForAssignment = (assignmentId: string) => {
    return submissions.filter(sub => sub.assignmentId === assignmentId);
  };

  const getDaysUntilDue = (dueDate: string) => {
    const due = new Date(dueDate);
    const now = new Date();
    const diffTime = due.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5">
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Hero Section */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary via-primary to-accent bg-clip-text text-transparent">
            Assignments Made Simple
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Students submit, teachers evaluate
          </p>
        </div>

        {/* Filters and Controls */}
        <Card className="border-0 shadow-lg bg-card/50 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex flex-wrap gap-4 items-center justify-between">
              <div className="flex flex-wrap gap-4">
                <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                  <SelectTrigger className="w-[160px]">
                    <SelectValue placeholder="Subject" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Subjects</SelectItem>
                    <SelectItem value="computer">Computer Science</SelectItem>
                    <SelectItem value="mathematics">Mathematics</SelectItem>
                    <SelectItem value="physics">Physics</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="overdue">Overdue</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={selectedDeadline} onValueChange={setSelectedDeadline}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Deadline" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="week">This Week</SelectItem>
                    <SelectItem value="month">This Month</SelectItem>
                    <SelectItem value="overdue">Overdue</SelectItem>
                  </SelectContent>
                </Select>

                <Button variant="outline">
                  <Filter className="h-4 w-4 mr-2" />
                  More Filters
                </Button>
              </div>

              <div className="flex gap-2">
                {profile?.role === 'teacher' && (
                  <Dialog open={createOpen} onOpenChange={setCreateOpen}>
                    <DialogTrigger asChild>
                      <Button className="bg-gradient-to-r from-primary to-accent">
                        <Plus className="h-4 w-4 mr-2" />
                        Create Assignment
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Create New Assignment</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4 max-h-[400px] overflow-y-auto">
                        <div>
                          <Label htmlFor="title">Assignment Title</Label>
                          <Input placeholder="Enter assignment title" />
                        </div>
                        <div>
                          <Label htmlFor="subject">Subject</Label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Select subject" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="computer-science">Computer Science</SelectItem>
                              <SelectItem value="mathematics">Mathematics</SelectItem>
                              <SelectItem value="physics">Physics</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="class">Class</Label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Select class" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="cs-3a">CS-3A</SelectItem>
                              <SelectItem value="cs-3b">CS-3B</SelectItem>
                              <SelectItem value="me-3a">ME-3A</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="description">Description</Label>
                          <Textarea placeholder="Assignment description" rows={3} />
                        </div>
                        <div>
                          <Label htmlFor="instructions">Instructions</Label>
                          <Textarea placeholder="Detailed instructions for students" rows={3} />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="maxMarks">Maximum Marks</Label>
                            <Input type="number" placeholder="100" />
                          </div>
                          <div>
                            <Label>Due Date</Label>
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button variant="outline" className="w-full justify-start text-left font-normal">
                                  <CalendarIcon className="mr-2 h-4 w-4" />
                                  {dueDate ? format(dueDate, "PPP") : <span>Pick a date</span>}
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0">
                                <Calendar
                                  mode="single"
                                  selected={dueDate}
                                  onSelect={setDueDate}
                                  initialFocus
                                />
                              </PopoverContent>
                            </Popover>
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="resources">Upload Resources</Label>
                          <Input type="file" multiple accept=".pdf,.doc,.docx,.ppt,.pptx,.zip" />
                        </div>
                        <div className="flex justify-end gap-2 pt-4">
                          <Button variant="outline" onClick={() => setCreateOpen(false)}>
                            Cancel
                          </Button>
                          <Button className="bg-gradient-to-r from-primary to-accent">
                            Create Assignment
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                )}
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Download All Submissions
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Assignment Tabs */}
        <Tabs defaultValue={profile?.role === 'student' ? 'student' : 'teacher'} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="student">Student View</TabsTrigger>
            <TabsTrigger value="teacher">Teacher View</TabsTrigger>
          </TabsList>

          {/* Student View */}
          <TabsContent value="student" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredAssignments.map((assignment) => {
                const daysUntilDue = getDaysUntilDue(assignment.dueDate);
                return (
                  <Card key={assignment.id} className="border-0 shadow-lg hover:shadow-xl transition-all duration-200 hover:-translate-y-1">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge className={getStatusColor(assignment.status)} variant="outline">
                              {getStatusIcon(assignment.status)}
                              <span className="ml-1 capitalize">{assignment.status}</span>
                            </Badge>
                            {daysUntilDue <= 3 && daysUntilDue > 0 && (
                              <Badge variant="destructive">Due in {daysUntilDue}d</Badge>
                            )}
                            {daysUntilDue < 0 && (
                              <Badge variant="destructive">Overdue</Badge>
                            )}
                          </div>
                          <CardTitle className="text-lg leading-tight">{assignment.title}</CardTitle>
                          <CardDescription>
                            {assignment.subject} • Max: {assignment.maxMarks} marks
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {assignment.description}
                      </p>
                      
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <CalendarIcon className="h-4 w-4" />
                          <span>Due: {assignment.dueDate}</span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <User className="h-4 w-4" />
                          <span>By {assignment.createdBy}</span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <BookOpen className="h-4 w-4" />
                          <span>Class: {assignment.class}</span>
                        </div>
                      </div>

                      <div className="flex gap-2 pt-2">
                        <Button className="flex-1 bg-gradient-to-r from-primary to-accent">
                          <Upload className="h-4 w-4 mr-2" />
                          Submit
                        </Button>
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          {/* Teacher View */}
          <TabsContent value="teacher" className="space-y-6">
            {filteredAssignments.map((assignment) => {
              const assignmentSubmissions = getSubmissionsForAssignment(assignment.id);
              const gradedCount = assignmentSubmissions.filter(s => s.status === 'graded').length;
              
              return (
                <Card key={assignment.id} className="border-0 shadow-lg">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <FileText className="h-6 w-6 text-primary" />
                        <div>
                          <CardTitle className="text-xl">{assignment.title}</CardTitle>
                          <CardDescription>
                            {assignment.subject} • {assignment.class} • Max: {assignment.maxMarks} marks
                          </CardDescription>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getStatusColor(assignment.status)} variant="outline">
                          {getStatusIcon(assignment.status)}
                          <span className="ml-1 capitalize">{assignment.status}</span>
                        </Badge>
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <p className="text-muted-foreground">{assignment.description}</p>
                    
                    {/* Assignment Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div className="p-3 rounded-lg bg-blue-50 border border-blue-200">
                        <div className="text-center">
                          <div className="text-xl font-bold text-blue-800">
                            {assignment.submissionsCount}
                          </div>
                          <p className="text-xs text-blue-600">Submissions</p>
                        </div>
                      </div>
                      <div className="p-3 rounded-lg bg-green-50 border border-green-200">
                        <div className="text-center">
                          <div className="text-xl font-bold text-green-800">
                            {gradedCount}
                          </div>
                          <p className="text-xs text-green-600">Graded</p>
                        </div>
                      </div>
                      <div className="p-3 rounded-lg bg-yellow-50 border border-yellow-200">
                        <div className="text-center">
                          <div className="text-xl font-bold text-yellow-800">
                            {assignment.totalStudents - assignment.submissionsCount}
                          </div>
                          <p className="text-xs text-yellow-600">Pending</p>
                        </div>
                      </div>
                      <div className="p-3 rounded-lg bg-purple-50 border border-purple-200">
                        <div className="text-center">
                          <div className="text-xl font-bold text-purple-800">
                            {Math.round((assignment.submissionsCount / assignment.totalStudents) * 100)}%
                          </div>
                          <p className="text-xs text-purple-600">Completion</p>
                        </div>
                      </div>
                    </div>

                    {/* Recent Submissions */}
                    <div>
                      <h4 className="font-semibold mb-3 flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        Recent Submissions
                      </h4>
                      <div className="space-y-2">
                        {assignmentSubmissions.slice(0, 3).map((submission) => (
                          <div key={submission.id} className="flex items-center justify-between p-3 rounded-lg bg-accent/5 border border-accent/10">
                            <div className="flex items-center gap-3">
                              <div>
                                <h5 className="font-medium">{submission.studentName}</h5>
                                <p className="text-sm text-muted-foreground">
                                  {submission.rollNo} • {submission.submittedAt || 'Not submitted'}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              {submission.grade && (
                                <span className="text-sm font-medium">
                                  {submission.grade}/{assignment.maxMarks}
                                </span>
                              )}
                              <Badge className={getStatusColor(submission.status)} variant="outline">
                                {getStatusIcon(submission.status)}
                                <span className="ml-1 capitalize">{submission.status}</span>
                              </Badge>
                              <Button variant="outline" size="sm">
                                <Eye className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                      {assignmentSubmissions.length > 3 && (
                        <Button variant="outline" className="w-full mt-3">
                          View All Submissions ({assignmentSubmissions.length})
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </TabsContent>
        </Tabs>

        {/* CTA Section */}
        <Card className="border-0 shadow-lg bg-gradient-to-r from-primary/10 to-accent/10">
          <CardContent className="p-8 text-center">
            <h3 className="text-2xl font-bold mb-2">Streamlined Assignment Management</h3>
            <p className="text-muted-foreground mb-6">
              From creation to evaluation, manage assignments efficiently with real-time tracking
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button size="lg" className="bg-gradient-to-r from-primary to-accent">
                <Target className="h-5 w-5 mr-2" />
                View All Assignments
              </Button>
              <Button size="lg" variant="outline">
                <Download className="h-5 w-5 mr-2" />
                Download All Submissions
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}