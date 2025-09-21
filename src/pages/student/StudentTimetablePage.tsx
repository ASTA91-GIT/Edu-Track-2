import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Calendar, 
  Clock, 
  MapPin,
  User,
  BookOpen,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

export default function StudentTimetablePage() {
  const { profile } = useAuth();
  const [selectedWeek, setSelectedWeek] = useState('current');
  const [selectedView, setSelectedView] = useState('week');

  // Mock data - will be replaced with Supabase queries
  const timetableData = [
    {
      day: 'Monday',
      date: '2024-02-19',
      classes: [
        {
          id: '1',
          subject: 'Data Structures',
          code: 'CS201',
          instructor: 'Dr. Smith',
          room: 'Lab-A101',
          startTime: '09:00',
          endTime: '10:30',
          type: 'Lab'
        },
        {
          id: '2',
          subject: 'Database Systems',
          code: 'CS301',
          instructor: 'Prof. Johnson',
          room: 'Room-B205',
          startTime: '11:00',
          endTime: '12:30',
          type: 'Lecture'
        },
        {
          id: '3',
          subject: 'Calculus II',
          code: 'MATH201',
          instructor: 'Dr. Wilson',
          room: 'Room-C301',
          startTime: '14:00',
          endTime: '15:30',
          type: 'Lecture'
        }
      ]
    },
    {
      day: 'Tuesday',
      date: '2024-02-20',
      classes: [
        {
          id: '4',
          subject: 'Software Engineering',
          code: 'CS302',
          instructor: 'Prof. Davis',
          room: 'Room-A301',
          startTime: '10:00',
          endTime: '11:30',
          type: 'Lecture'
        },
        {
          id: '5',
          subject: 'Physics Lab',
          code: 'PHY201L',
          instructor: 'Dr. Brown',
          room: 'Physics Lab',
          startTime: '13:00',
          endTime: '16:00',
          type: 'Lab'
        }
      ]
    },
    {
      day: 'Wednesday',
      date: '2024-02-21',
      classes: [
        {
          id: '6',
          subject: 'Data Structures',
          code: 'CS201',
          instructor: 'Dr. Smith',
          room: 'Room-B101',
          startTime: '09:00',
          endTime: '10:30',
          type: 'Lecture'
        },
        {
          id: '7',
          subject: 'Database Systems',
          code: 'CS301',
          instructor: 'Prof. Johnson',
          room: 'Lab-B205',
          startTime: '11:00',
          endTime: '13:00',
          type: 'Lab'
        }
      ]
    },
    {
      day: 'Thursday',
      date: '2024-02-22',
      classes: [
        {
          id: '8',
          subject: 'Calculus II',
          code: 'MATH201',
          instructor: 'Dr. Wilson',
          room: 'Room-C301',
          startTime: '09:00',
          endTime: '10:30',
          type: 'Tutorial'
        },
        {
          id: '9',
          subject: 'Software Engineering',
          code: 'CS302',
          instructor: 'Prof. Davis',
          room: 'Lab-A301',
          startTime: '14:00',
          endTime: '17:00',
          type: 'Project'
        }
      ]
    },
    {
      day: 'Friday',
      date: '2024-02-23',
      classes: [
        {
          id: '10',
          subject: 'English Communication',
          code: 'ENG101',
          instructor: 'Prof. Taylor',
          room: 'Room-D101',
          startTime: '10:00',
          endTime: '11:30',
          type: 'Lecture'
        }
      ]
    }
  ];

  const getClassTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'lecture': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'lab': return 'bg-green-100 text-green-800 border-green-200';
      case 'tutorial': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'project': return 'bg-orange-100 text-orange-800 border-orange-200';
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

  const getTodayClasses = () => {
    const today = new Date().toLocaleDateString('en-CA'); // YYYY-MM-DD format
    const todayData = timetableData.find(day => day.date === today);
    return todayData ? todayData.classes : [];
  };

  const todayClasses = getTodayClasses();
  const nextClass = todayClasses.find(cls => getCurrentTime() < cls.startTime);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Class Timetable
          </h1>
          <p className="text-muted-foreground mt-1">
            Your weekly class schedule and upcoming sessions
          </p>
        </div>
        <div className="flex gap-2">
          <Select value={selectedView} onValueChange={setSelectedView}>
            <SelectTrigger className="w-[120px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">Week View</SelectItem>
              <SelectItem value="day">Day View</SelectItem>
            </SelectContent>
          </Select>
          <Select value={selectedWeek} onValueChange={setSelectedWeek}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Select week" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="current">Current Week</SelectItem>
              <SelectItem value="next">Next Week</SelectItem>
              <SelectItem value="previous">Previous Week</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Today's Summary */}
      <Card className="border-0 shadow-lg bg-gradient-to-r from-primary/10 to-accent/10">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              <CardTitle>Today's Schedule</CardTitle>
            </div>
            <Badge variant="outline" className="border-primary/20 text-primary">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          {todayClasses.length > 0 ? (
            <div className="space-y-3">
              {nextClass && (
                <div className="p-3 rounded-lg bg-accent/20 border border-accent/30">
                  <div className="flex items-center gap-2 text-sm font-medium text-accent-foreground">
                    <Clock className="h-4 w-4" />
                    Next Class: {nextClass.subject} at {nextClass.startTime}
                  </div>
                </div>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {todayClasses.map((cls) => (
                  <div 
                    key={cls.id} 
                    className={`p-3 rounded-lg border ${
                      isCurrentClass(cls.startTime, cls.endTime) 
                        ? 'bg-primary/10 border-primary/30 ring-2 ring-primary/20' 
                        : 'bg-accent/5 border-accent/10'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-sm">{cls.subject}</h4>
                      <Badge className={getClassTypeColor(cls.type)} variant="outline">
                        {cls.type}
                      </Badge>
                    </div>
                    <div className="space-y-1 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {cls.startTime} - {cls.endTime}
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {cls.room}
                      </div>
                      <div className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        {cls.instructor}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No classes scheduled for today</p>
              <p className="text-sm">Enjoy your free day!</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Weekly Timetable */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" />
              <CardTitle>Weekly Timetable</CardTitle>
            </div>
            <div className="flex items-center gap-2">
              <button className="p-1 hover:bg-accent rounded">
                <ChevronLeft className="h-4 w-4" />
              </button>
              <span className="text-sm font-medium">Feb 19 - Feb 23, 2024</span>
              <button className="p-1 hover:bg-accent rounded">
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {timetableData.map((day) => (
              <div key={day.day}>
                <div className="flex items-center gap-2 mb-3">
                  <h3 className="font-semibold text-lg">{day.day}</h3>
                  <span className="text-sm text-muted-foreground">{day.date}</span>
                  {day.classes.length === 0 && (
                    <Badge variant="secondary" className="ml-2">No Classes</Badge>
                  )}
                </div>
                
                {day.classes.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {day.classes.map((cls) => (
                      <div key={cls.id} className="p-4 rounded-lg bg-accent/5 border border-accent/10 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-semibold">{cls.subject}</h4>
                          <Badge className={getClassTypeColor(cls.type)}>
                            {cls.type}
                          </Badge>
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
                            <span>{cls.instructor}</span>
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
    </div>
  );
}