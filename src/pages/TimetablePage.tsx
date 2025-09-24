import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Calendar, 
  Clock, 
  MapPin,
  User,
  BookOpen,
  Plus,
  Filter,
  Download,
  ChevronLeft,
  ChevronRight,
  Edit,
  Eye
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

export default function TimetablePage() {
  const { profile } = useAuth();
  const [selectedClass, setSelectedClass] = useState('all');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [selectedDate, setSelectedDate] = useState('current');

  // Mock data for timetable
  const timetableData = [
    {
      day: 'Monday',
      date: '2024-02-19',
      classes: [
        {
          id: '1',
          subject: 'Data Structures',
          code: 'CS201',
          teacher: 'Dr. Smith',
          class: 'CS-3A',
          room: 'Lab-A101',
          startTime: '09:00',
          endTime: '10:30',
          type: 'Lab',
          status: 'scheduled'
        },
        {
          id: '2',
          subject: 'Database Systems',
          code: 'CS301',
          teacher: 'Prof. Johnson',
          class: 'CS-3B',
          room: 'Room-B205',
          startTime: '11:00',
          endTime: '12:30',
          type: 'Lecture',
          status: 'ongoing'
        }
      ]
    },
    {
      day: 'Tuesday',
      date: '2024-02-20',
      classes: [
        {
          id: '3',
          subject: 'Software Engineering',
          code: 'CS302',
          teacher: 'Prof. Davis',
          class: 'CS-3A',
          room: 'Room-A301',
          startTime: '10:00',
          endTime: '11:30',
          type: 'Lecture',
          status: 'scheduled'
        }
      ]
    }
  ];

  const getTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'lecture': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'lab': return 'bg-green-100 text-green-800 border-green-200';
      case 'tutorial': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'project': return 'bg-orange-100 text-orange-800 border-orange-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ongoing': return 'bg-green-100 text-green-800 border-green-200';
      case 'scheduled': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'completed': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getCurrentTime = () => {
    const now = new Date();
    return now.getHours().toString().padStart(2, '0') + ':' + now.getMinutes().toString().padStart(2, '0');
  };

  const isCurrentClass = (startTime: string, endTime: string) => {
    const current = getCurrentTime();
    return current >= startTime && current <= endTime;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5">
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Hero Section */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary via-primary to-accent bg-clip-text text-transparent">
            Smart Timetable
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Students and teachers stay organized with real-time schedules
          </p>
        </div>

        {/* Filters */}
        <Card className="border-0 shadow-lg bg-card/50 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex flex-wrap gap-4 items-center justify-between">
              <div className="flex flex-wrap gap-4">
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

                <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                  <SelectTrigger className="w-[160px]">
                    <SelectValue placeholder="Select Subject" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Subjects</SelectItem>
                    <SelectItem value="cs">Computer Science</SelectItem>
                    <SelectItem value="math">Mathematics</SelectItem>
                    <SelectItem value="physics">Physics</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={selectedDate} onValueChange={setSelectedDate}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Select Date" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="current">Current Week</SelectItem>
                    <SelectItem value="next">Next Week</SelectItem>
                    <SelectItem value="previous">Previous Week</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-2">
                {profile?.role === 'teacher' && (
                  <Button className="bg-gradient-to-r from-primary to-accent">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Lecture
                  </Button>
                )}
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Sync with Calendar
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Timetable Tabs */}
        <Tabs defaultValue={profile?.role === 'student' ? 'student' : 'teacher'} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="student">Student View</TabsTrigger>
            <TabsTrigger value="teacher">Teacher View</TabsTrigger>
          </TabsList>

          {/* Student View */}
          <TabsContent value="student" className="space-y-6">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-primary" />
                    <CardTitle>Weekly Schedule</CardTitle>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <span className="text-sm font-medium">Feb 19 - Feb 23, 2024</span>
                    <Button variant="outline" size="sm">
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {timetableData.map((day) => (
                    <div key={day.day}>
                      <div className="flex items-center gap-2 mb-4">
                        <h3 className="font-semibold text-lg">{day.day}</h3>
                        <span className="text-sm text-muted-foreground">{day.date}</span>
                        {day.classes.length === 0 && (
                          <Badge variant="secondary">No Classes</Badge>
                        )}
                      </div>
                      
                      {day.classes.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {day.classes.map((cls) => (
                            <div 
                              key={cls.id} 
                              className={`p-4 rounded-lg border transition-all duration-200 hover:shadow-md ${
                                isCurrentClass(cls.startTime, cls.endTime) 
                                  ? 'bg-gradient-to-br from-primary/10 to-accent/10 border-primary/30 ring-2 ring-primary/20' 
                                  : 'bg-accent/5 border-accent/10 hover:border-accent/20'
                              }`}
                            >
                              <div className="flex items-center justify-between mb-3">
                                <h4 className="font-semibold">{cls.subject}</h4>
                                <div className="flex gap-1">
                                  <Badge className={getTypeColor(cls.type)} variant="outline">
                                    {cls.type}
                                  </Badge>
                                  {isCurrentClass(cls.startTime, cls.endTime) && (
                                    <Badge className={getStatusColor('ongoing')} variant="outline">
                                      Live
                                    </Badge>
                                  )}
                                </div>
                              </div>
                              
                              <div className="space-y-2 text-sm text-muted-foreground">
                                <div className="flex items-center gap-2">
                                  <Clock className="h-4 w-4" />
                                  <span>{cls.startTime} - {cls.endTime}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <MapPin className="h-4 w-4" />
                                  <span>{cls.room}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <User className="h-4 w-4" />
                                  <span>{cls.teacher}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <BookOpen className="h-4 w-4" />
                                  <span>{cls.code}</span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8 text-muted-foreground bg-accent/5 rounded-lg">
                          <Calendar className="h-8 w-8 mx-auto mb-2 opacity-50" />
                          <p className="text-sm">No classes scheduled</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Teacher View */}
          <TabsContent value="teacher" className="space-y-6">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <User className="h-5 w-5 text-primary" />
                    <CardTitle>Manage Schedule</CardTitle>
                  </div>
                  <Button className="bg-gradient-to-r from-primary to-accent">
                    <Plus className="h-4 w-4 mr-2" />
                    Add New Lecture
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {timetableData.map((day) => (
                    <div key={day.day}>
                      <div className="flex items-center gap-2 mb-4">
                        <h3 className="font-semibold text-lg">{day.day}</h3>
                        <span className="text-sm text-muted-foreground">{day.date}</span>
                      </div>
                      
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        {day.classes.map((cls) => (
                          <div key={cls.id} className="p-4 rounded-lg bg-accent/5 border border-accent/10 hover:shadow-md transition-all">
                            <div className="flex items-center justify-between mb-3">
                              <div>
                                <h4 className="font-semibold">{cls.subject}</h4>
                                <p className="text-sm text-muted-foreground">Class: {cls.class}</p>
                              </div>
                              <div className="flex gap-2">
                                <Button variant="outline" size="sm">
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button variant="outline" size="sm">
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                            
                            <div className="space-y-2 text-sm">
                              <div className="flex items-center gap-2 text-muted-foreground">
                                <Clock className="h-4 w-4" />
                                <span>{cls.startTime} - {cls.endTime}</span>
                              </div>
                              <div className="flex items-center gap-2 text-muted-foreground">
                                <MapPin className="h-4 w-4" />
                                <span>{cls.room}</span>
                              </div>
                            </div>

                            <div className="flex items-center justify-between mt-3 pt-3 border-t border-accent/10">
                              <div className="flex gap-2">
                                <Badge className={getTypeColor(cls.type)} variant="outline">
                                  {cls.type}
                                </Badge>
                                <Badge className={getStatusColor(cls.status)} variant="outline">
                                  {cls.status}
                                </Badge>
                              </div>
                              <Button variant="outline" size="sm">
                                Update Status
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* CTA Section */}
        <Card className="border-0 shadow-lg bg-gradient-to-r from-primary/10 to-accent/10">
          <CardContent className="p-8 text-center">
            <h3 className="text-2xl font-bold mb-2">Stay Synchronized</h3>
            <p className="text-muted-foreground mb-6">
              Never miss a class with smart calendar integration and real-time updates
            </p>
            <Button size="lg" className="bg-gradient-to-r from-primary to-accent">
              <Download className="h-5 w-5 mr-2" />
              Sync with Calendar
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}