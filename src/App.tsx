import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import AuthPage from "./components/auth/AuthPage";
import StudentDashboard from "./pages/StudentDashboard";
import TeacherDashboard from "./pages/TeacherDashboard";
import QRScannerPage from "./pages/QRScannerPage";
import StudentFeesPage from "./pages/student/StudentFeesPage";
import StudentAssignmentsPage from "./pages/student/StudentAssignmentsPage";
import StudentGradesPage from "./pages/student/StudentGradesPage";
import StudentLibraryPage from "./pages/student/StudentLibraryPage";
import StudentTimetablePage from "./pages/student/StudentTimetablePage";
import TeacherAttendancePage from "./pages/teacher/TeacherAttendancePage";
import TeacherSubjectsPage from "./pages/teacher/TeacherSubjectsPage";
import TeacherLecturesPage from "./pages/teacher/TeacherLecturesPage";
import AdminDashboardPage from "./pages/admin/AdminDashboardPage";
import TimetablePage from "./pages/TimetablePage";
import ReportsPage from "./pages/ReportsPage";
import MessagesPage from "./pages/MessagesPage";
import LibraryPage from "./pages/LibraryPage";
import QRSessionPage from "./pages/QRSessionPage";
import AssignmentsPage from "./pages/AssignmentsPage";
import DashboardLayout from "./components/layout/DashboardLayout";
import { useAuth } from "./hooks/useAuth";

const queryClient = new QueryClient();

function AppContent() {
  const { user, profile, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-accent/10 to-primary/5">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Show landing page if no user and not on auth route
  if (!user) {
    return (
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="*" element={<Index />} />
      </Routes>
    );
  }

  return (
    <DashboardLayout>
      <Routes>
        <Route path="/" element={
          profile?.role === 'student' ? <StudentDashboard /> :
          profile?.role === 'teacher' ? <TeacherDashboard /> :
          profile?.role === 'admin' ? <AdminDashboardPage /> :
          <StudentDashboard />
        } />
        
        {/* Student Routes */}
        <Route path="/student" element={<StudentDashboard />} />
        <Route path="/student/fees" element={<StudentFeesPage />} />
        <Route path="/student/assignments" element={<AssignmentsPage />} />
        <Route path="/student/grades" element={<StudentGradesPage />} />
        <Route path="/student/timetable" element={<TimetablePage />} />
        <Route path="/student/library" element={<LibraryPage />} />
        <Route path="/student/messages" element={<MessagesPage />} />
        <Route path="/student/scanner" element={<QRScannerPage />} />
        
        {/* Teacher Routes */}
        <Route path="/teacher" element={<TeacherDashboard />} />
        <Route path="/teacher/attendance" element={<TeacherAttendancePage />} />
        <Route path="/teacher/subjects" element={<TeacherSubjectsPage />} />
        <Route path="/teacher/lectures" element={<TeacherLecturesPage />} />
        <Route path="/teacher/assignments" element={<AssignmentsPage />} />
        <Route path="/teacher/timetable" element={<TimetablePage />} />
        <Route path="/teacher/library" element={<LibraryPage />} />
        <Route path="/teacher/messages" element={<MessagesPage />} />
        <Route path="/teacher/reports" element={<ReportsPage />} />
        <Route path="/teacher/qr-session" element={<QRSessionPage />} />
        
        {/* Admin Routes */}
        <Route path="/admin" element={<AdminDashboardPage />} />
        <Route path="/admin/library" element={<LibraryPage />} />
        <Route path="/admin/reports" element={<ReportsPage />} />
        <Route path="/admin/messages" element={<MessagesPage />} />
        
        {/* Shared Routes */}
        <Route path="/assignments" element={<AssignmentsPage />} />
        <Route path="/timetable" element={<TimetablePage />} />
        <Route path="/library" element={<LibraryPage />} />
        <Route path="/messages" element={<MessagesPage />} />
        <Route path="/reports" element={<ReportsPage />} />
        <Route path="/qr-session" element={<QRSessionPage />} />
        
        {/* Catch-all */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </DashboardLayout>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
