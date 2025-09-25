import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  GraduationCap, 
  QrCode, 
  Calendar,
  Library,
  BarChart3,
  Shield,
  Users,
  Smartphone,
  Clock,
  CheckCircle,
  ArrowRight,
  BookOpen,
  FileText,
  MessageSquare
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Index() {
  const features = [
    {
      icon: QrCode,
      title: 'QR Attendance',
      description: 'Secure, real-time attendance tracking with dynamic QR codes that refresh every 15 seconds.',
      color: 'from-purple-500 to-blue-500'
    },
    {
      icon: Calendar,
      title: 'Smart Timetable',
      description: 'Digital timetables for students and teachers with real-time updates and notifications.',
      color: 'from-green-500 to-teal-500'
    },
    {
      icon: Library,
      title: 'Digital Library',
      description: 'Access study materials, books, and resources with role-based permissions.',
      color: 'from-orange-500 to-red-500'
    },
    {
      icon: BarChart3,
      title: 'Analytics & Reports',
      description: 'Comprehensive reports and analytics for tracking student progress and attendance.',
      color: 'from-indigo-500 to-purple-500'
    },
    {
      icon: MessageSquare,
      title: 'Communication Hub',
      description: 'Seamless communication between students, teachers, and administrators.',
      color: 'from-pink-500 to-rose-500'
    },
    {
      icon: FileText,
      title: 'Assignment Management',
      description: 'Digital assignment submission, grading, and feedback system.',
      color: 'from-cyan-500 to-blue-500'
    }
  ];

  const roles = [
    {
      title: 'Student',
      icon: GraduationCap,
      description: 'Access assignments, grades, timetable, library, and scan QR codes for attendance.',
      features: ['QR Scanner', 'View Grades', 'Library Access', 'Timetable', 'Assignments'],
      color: 'from-blue-500 to-purple-600'
    },
    {
      title: 'Teacher',
      icon: Users,
      description: 'Manage classes, create assignments, track attendance, and generate reports.',
      features: ['Create QR Sessions', 'Grade Assignments', 'Manage Subjects', 'View Reports'],
      color: 'from-green-500 to-blue-600'
    },
    {
      title: 'Admin',
      icon: Shield,
      description: 'Full system access to manage users, classes, subjects, and system settings.',
      features: ['User Management', 'System Settings', 'Full Reports', 'Content Management'],
      color: 'from-red-500 to-purple-600'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/5 to-primary/5">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center shadow-lg">
                <GraduationCap className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="font-bold text-xl bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  EduTrack
                </h1>
                <p className="text-xs text-muted-foreground">Smart Education Management</p>
              </div>
            </div>
            
            <Link to="/auth">
              <Button className="bg-gradient-to-r from-primary to-accent hover:shadow-lg hover:shadow-primary/25 transition-all duration-300">
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 lg:px-6 py-16">
        <div className="text-center space-y-6 max-w-4xl mx-auto">
          <Badge className="bg-gradient-to-r from-primary/20 to-accent/20 text-primary border-primary/30">
            <Smartphone className="w-3 h-3 mr-1" />
            Mobile-First Design
          </Badge>
          
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary via-primary to-accent bg-clip-text text-transparent">
            Smart Education Management System
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Streamline attendance, timetables, assignments, and communication with our comprehensive educational platform designed for students, teachers, and administrators.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link to="/auth">
              <Button size="lg" className="bg-gradient-to-r from-primary to-accent hover:shadow-lg hover:shadow-primary/25 transition-all duration-300">
                Start Your Journey
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Button variant="outline" size="lg" className="border-primary/30 hover:bg-primary/5">
              <BookOpen className="mr-2 h-5 w-5" />
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 lg:px-6 py-16">
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-3xl md:text-4xl font-bold">
            Powerful Features for Modern Education
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Everything you need to manage your educational institution efficiently
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="border-0 shadow-lg bg-card/50 backdrop-blur-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <CardHeader>
                <div className={`w-12 h-12 bg-gradient-to-r ${feature.color} rounded-xl flex items-center justify-center mb-4 shadow-lg`}>
                  <feature.icon className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Roles Section */}
      <section className="container mx-auto px-4 lg:px-6 py-16">
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-3xl md:text-4xl font-bold">
            Choose Your Role
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Different interfaces designed for different needs
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {roles.map((role, index) => (
            <Card key={index} className="border-0 shadow-lg bg-card/50 backdrop-blur-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 relative overflow-hidden">
              <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${role.color}`}></div>
              
              <CardHeader className="text-center">
                <div className={`w-16 h-16 bg-gradient-to-r ${role.color} rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg`}>
                  <role.icon className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-2xl">{role.title}</CardTitle>
                <CardDescription className="text-base">
                  {role.description}
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-2">
                  {role.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* QR Security Section */}
      <section className="container mx-auto px-4 lg:px-6 py-16">
        <Card className="border-0 shadow-lg bg-gradient-to-r from-primary/10 to-accent/10 max-w-4xl mx-auto">
          <CardContent className="p-8 md:p-12">
            <div className="text-center space-y-6">
              <div className="w-20 h-20 bg-gradient-to-r from-primary to-accent rounded-2xl flex items-center justify-center mx-auto shadow-lg">
                <QrCode className="h-10 w-10 text-white" />
              </div>
              
              <h3 className="text-3xl font-bold">
                Secure QR Attendance System
              </h3>
              
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Our advanced QR system prevents misuse with dynamic codes that refresh every 15 seconds, timestamp validation, and replay attack protection.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                <div className="text-center">
                  <Clock className="h-8 w-8 text-primary mx-auto mb-2" />
                  <p className="font-semibold">15-Second Refresh</p>
                  <p className="text-sm text-muted-foreground">Dynamic security</p>
                </div>
                <div className="text-center">
                  <Shield className="h-8 w-8 text-primary mx-auto mb-2" />
                  <p className="font-semibold">Replay Protection</p>
                  <p className="text-sm text-muted-foreground">No screenshot sharing</p>
                </div>
                <div className="text-center">
                  <CheckCircle className="h-8 w-8 text-primary mx-auto mb-2" />
                  <p className="font-semibold">Validation</p>
                  <p className="text-sm text-muted-foreground">Subject + timestamp</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 lg:px-6 py-16">
        <Card className="border-0 shadow-lg bg-gradient-to-r from-primary to-accent text-white">
          <CardContent className="p-8 md:p-12 text-center">
            <h3 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Transform Your Institution?
            </h3>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Join thousands of educational institutions already using EduTrack to streamline their operations.
            </p>
            <Link to="/auth">
              <Button size="lg" variant="secondary" className="bg-white text-primary hover:bg-white/90 shadow-lg">
                Get Started Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/40 bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 lg:px-6 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center gap-3 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
                <GraduationCap className="h-5 w-5 text-white" />
              </div>
              <span className="font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                EduTrack
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2024 Team Quantum Coders. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}