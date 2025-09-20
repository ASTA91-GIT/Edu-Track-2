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

  if (!user) {
    return <AuthPage />;
  }

  // Role-based routing
  const getDefaultRoute = () => {
    switch (profile?.role) {
      case 'teacher': return '/teacher';
      case 'admin': return '/admin';
      default: return '/student';
    }
  };

  return (
    <DashboardLayout>
      <Routes>
        <Route path="/" element={
          profile?.role === 'student' ? <StudentDashboard /> :
          profile?.role === 'teacher' ? <TeacherDashboard /> :
          <StudentDashboard />
        } />
        
        {/* Student Routes */}
        <Route path="/student" element={<StudentDashboard />} />
        <Route path="/student/scanner" element={<QRScannerPage />} />
        <Route path="/student/attendance" element={<StudentDashboard />} />
        
        {/* Teacher Routes */}
        <Route path="/teacher" element={<TeacherDashboard />} />
        <Route path="/teacher/create-session" element={<TeacherDashboard />} />
        <Route path="/teacher/classes" element={<TeacherDashboard />} />
        <Route path="/teacher/attendance" element={<TeacherDashboard />} />
        
        {/* Admin Routes */}
        <Route path="/admin" element={<TeacherDashboard />} />
        <Route path="/admin/users" element={<TeacherDashboard />} />
        <Route path="/admin/classes" element={<TeacherDashboard />} />
        <Route path="/admin/reports" element={<TeacherDashboard />} />
        <Route path="/admin/settings" element={<TeacherDashboard />} />
        
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
