import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  QrCode, 
  Users,
  CheckCircle,
  Clock,
  AlertTriangle,
  Shield,
  Camera,
  BarChart3,
  RefreshCw,
  Eye,
  User,
  Calendar
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

export default function QRSessionPage() {
  const { profile } = useAuth();
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [sessionActive, setSessionActive] = useState(false);
  const [qrRefreshTime, setQrRefreshTime] = useState(15);
  const [scanResult, setScanResult] = useState('');

  // Mock data for attendance session
  const sessionData = {
    sessionId: 'ATT-2024-02-19-001',
    startTime: '10:00 AM',
    duration: '2 hours',
    totalStudents: 45,
    presentStudents: 38,
    absentStudents: 7,
    scanCount: 42
  };

  const studentsList = [
    { id: '1', name: 'John Doe', rollNo: 'CS001', status: 'present', scanTime: '10:02 AM', avatar: null },
    { id: '2', name: 'Jane Smith', rollNo: 'CS002', status: 'present', scanTime: '10:01 AM', avatar: null },
    { id: '3', name: 'Mike Johnson', rollNo: 'CS003', status: 'absent', scanTime: null, avatar: null },
    { id: '4', name: 'Sarah Wilson', rollNo: 'CS004', status: 'present', scanTime: '10:03 AM', avatar: null },
    { id: '5', name: 'David Brown', rollNo: 'CS005', status: 'present', scanTime: '10:05 AM', avatar: null },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'present': return 'bg-green-100 text-green-800 border-green-200';
      case 'absent': return 'bg-red-100 text-red-800 border-red-200';
      case 'late': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'present': return <CheckCircle className="h-4 w-4" />;
      case 'absent': return <AlertTriangle className="h-4 w-4" />;
      case 'late': return <Clock className="h-4 w-4" />;
      default: return <User className="h-4 w-4" />;
    }
  };

  const handleStartSession = () => {
    setSessionActive(true);
    // Generate new QR code
    setQrRefreshTime(15);
  };

  const handleEndSession = () => {
    setSessionActive(false);
    setScanResult('');
  };

  const handleQRScan = (data: string) => {
    setScanResult(data);
    // Process attendance marking logic here
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5">
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Hero Section */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary via-primary to-accent bg-clip-text text-transparent">
            QR Attendance Session
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Simple, secure, real-time attendance
          </p>
        </div>

        {/* Security Notice */}
        <Alert className="border-primary/20 bg-primary/5">
          <Shield className="h-4 w-4" />
          <AlertDescription className="flex items-center gap-2">
            <strong>Security Note:</strong> Dynamic QR codes expire every {qrRefreshTime} seconds for enhanced security
          </AlertDescription>
        </Alert>

        {/* Session Controls */}
        <Card className="border-0 shadow-lg bg-card/50 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex flex-wrap gap-4 items-center justify-between">
              <div className="flex flex-wrap gap-4">
                <Select value={selectedClass} onValueChange={setSelectedClass}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Select Class" />
                  </SelectTrigger>
                  <SelectContent>
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
                    <SelectItem value="ds">Data Structures</SelectItem>
                    <SelectItem value="dbms">Database Systems</SelectItem>
                    <SelectItem value="os">Operating Systems</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-2">
                {!sessionActive ? (
                  <Button 
                    onClick={handleStartSession}
                    className="bg-gradient-to-r from-primary to-accent"
                    disabled={!selectedClass || !selectedSubject}
                  >
                    <QrCode className="h-4 w-4 mr-2" />
                    Start Session
                  </Button>
                ) : (
                  <Button 
                    onClick={handleEndSession}
                    variant="destructive"
                  >
                    End Session
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content Tabs */}
        <Tabs defaultValue={profile?.role === 'student' ? 'student' : 'teacher'} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="teacher">Teacher View</TabsTrigger>
            <TabsTrigger value="student">Student View</TabsTrigger>
          </TabsList>

          {/* Teacher View */}
          <TabsContent value="teacher" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* QR Code Generation */}
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <QrCode className="h-5 w-5 text-primary" />
                    <CardTitle>Dynamic QR Code</CardTitle>
                  </div>
                  <CardDescription>
                    Students scan this code to mark attendance
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center space-y-4">
                  {sessionActive ? (
                    <>
                      <div className="w-48 h-48 mx-auto bg-gradient-to-br from-primary/20 to-accent/20 rounded-xl flex items-center justify-center border-2 border-primary/20">
                        <div className="w-40 h-40 bg-white rounded-lg flex items-center justify-center">
                          <QrCode className="h-32 w-32 text-primary" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-center gap-2">
                          <RefreshCw className="h-4 w-4 text-primary animate-spin" />
                          <span className="text-sm font-medium">Refreshes in {qrRefreshTime}s</span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Session ID: {sessionData.sessionId}
                        </p>
                      </div>
                    </>
                  ) : (
                    <div className="w-48 h-48 mx-auto bg-muted/30 rounded-xl flex items-center justify-center">
                      <div className="text-center space-y-2">
                        <QrCode className="h-16 w-16 mx-auto text-muted-foreground opacity-50" />
                        <p className="text-sm text-muted-foreground">
                          Select class and subject to start session
                        </p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Session Statistics */}
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-primary" />
                    <CardTitle>Session Statistics</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  {sessionActive ? (
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 rounded-lg bg-green-50 border border-green-200">
                        <div className="text-center">
                          <CheckCircle className="h-8 w-8 mx-auto mb-2 text-green-600" />
                          <div className="text-2xl font-bold text-green-800">
                            {sessionData.presentStudents}
                          </div>
                          <p className="text-sm text-green-600">Present</p>
                        </div>
                      </div>
                      <div className="p-4 rounded-lg bg-red-50 border border-red-200">
                        <div className="text-center">
                          <AlertTriangle className="h-8 w-8 mx-auto mb-2 text-red-600" />
                          <div className="text-2xl font-bold text-red-800">
                            {sessionData.absentStudents}
                          </div>
                          <p className="text-sm text-red-600">Absent</p>
                        </div>
                      </div>
                      <div className="p-4 rounded-lg bg-blue-50 border border-blue-200">
                        <div className="text-center">
                          <Users className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                          <div className="text-2xl font-bold text-blue-800">
                            {sessionData.totalStudents}
                          </div>
                          <p className="text-sm text-blue-600">Total</p>
                        </div>
                      </div>
                      <div className="p-4 rounded-lg bg-purple-50 border border-purple-200">
                        <div className="text-center">
                          <QrCode className="h-8 w-8 mx-auto mb-2 text-purple-600" />
                          <div className="text-2xl font-bold text-purple-800">
                            {sessionData.scanCount}
                          </div>
                          <p className="text-sm text-purple-600">Scans</p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>Session statistics will appear here</p>
                      <p className="text-sm">Start a session to view real-time data</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Student Status List */}
            {sessionActive && (
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Users className="h-5 w-5 text-primary" />
                      <CardTitle>Student Status</CardTitle>
                    </div>
                    <Badge variant="outline">
                      {sessionData.presentStudents}/{sessionData.totalStudents} Present
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {studentsList.map((student) => (
                      <div key={student.id} className="flex items-center justify-between p-3 rounded-lg bg-accent/5 border border-accent/10">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={student.avatar} />
                            <AvatarFallback className="bg-gradient-to-br from-primary/20 to-accent/20">
                              {student.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h4 className="font-semibold">{student.name}</h4>
                            <p className="text-sm text-muted-foreground">Roll No: {student.rollNo}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          {student.scanTime && (
                            <span className="text-sm text-muted-foreground">
                              Scanned: {student.scanTime}
                            </span>
                          )}
                          <Badge className={getStatusColor(student.status)} variant="outline">
                            {getStatusIcon(student.status)}
                            <span className="ml-1 capitalize">{student.status}</span>
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Student View */}
          <TabsContent value="student" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* QR Scanner */}
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Camera className="h-5 w-5 text-primary" />
                    <CardTitle>QR Scanner</CardTitle>
                  </div>
                  <CardDescription>
                    Point your camera at the QR code to mark attendance
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center space-y-4">
                  <div className="w-64 h-64 mx-auto bg-gradient-to-br from-primary/10 to-accent/10 rounded-xl flex items-center justify-center border-2 border-dashed border-primary/30">
                    <div className="text-center space-y-3">
                      <Camera className="h-16 w-16 mx-auto text-primary opacity-60" />
                      <p className="text-sm font-medium">Camera Placeholder</p>
                      <p className="text-xs text-muted-foreground">
                        QR scanner will be activated here
                      </p>
                    </div>
                  </div>
                  
                  {scanResult ? (
                    <Alert className="border-green-200 bg-green-50">
                      <CheckCircle className="h-4 w-4" />
                      <AlertDescription>
                        <strong>Success!</strong> Attendance marked successfully at {new Date().toLocaleTimeString()}
                      </AlertDescription>
                    </Alert>
                  ) : (
                    <Button className="bg-gradient-to-r from-primary to-accent" disabled>
                      <Camera className="h-4 w-4 mr-2" />
                      Start Scanner
                    </Button>
                  )}
                </CardContent>
              </Card>

              {/* Scan Confirmation */}
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-primary" />
                    <CardTitle>Attendance Status</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  {scanResult ? (
                    <div className="space-y-4">
                      <div className="p-4 rounded-lg bg-green-50 border border-green-200">
                        <div className="flex items-center gap-3">
                          <CheckCircle className="h-8 w-8 text-green-600" />
                          <div>
                            <h4 className="font-semibold text-green-800">Attendance Confirmed</h4>
                            <p className="text-sm text-green-600">
                              Marked present for today's session
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span>Date: {new Date().toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span>Time: {new Date().toLocaleTimeString()}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <span>Subject: Data Structures</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <QrCode className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>Scan the QR code to mark attendance</p>
                      <p className="text-sm">Your attendance status will appear here</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* CTA Section */}
        <Card className="border-0 shadow-lg bg-gradient-to-r from-primary/10 to-accent/10">
          <CardContent className="p-8 text-center">
            <h3 className="text-2xl font-bold mb-2">Seamless Attendance Tracking</h3>
            <p className="text-muted-foreground mb-6">
              Experience the future of attendance management with secure QR technology
            </p>
            <Button size="lg" className="bg-gradient-to-r from-primary to-accent">
              <Eye className="h-5 w-5 mr-2" />
              View Attendance Report
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}