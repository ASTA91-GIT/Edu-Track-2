import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  GraduationCap, 
  BarChart3, 
  QrCode, 
  Users, 
  Calendar,
  Settings,
  LogOut,
  Shield,
  BookOpen,
  CreditCard,
  FileText,
  Award,
  Bus,
  MessageSquare,
  HelpCircle,
  ClipboardList,
  UserCheck,
  FileBarChart,
  Megaphone,
  Library
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

const studentItems = [
  { title: 'Dashboard', url: '/student', icon: BarChart3 },
  { title: 'Fees', url: '/student/fees', icon: CreditCard },
  { title: 'Assignments', url: '/student/assignments', icon: FileText },
  { title: 'Grades', url: '/student/grades', icon: Award },
  { title: 'Timetable', url: '/student/timetable', icon: Calendar },
  { title: 'Library', url: '/student/library', icon: BookOpen },
  { title: 'Transport', url: '/student/transport', icon: Bus },
  { title: 'Clubs', url: '/student/clubs', icon: Users },
  { title: 'Messages', url: '/student/messages', icon: MessageSquare },
  { title: 'Support', url: '/student/support', icon: HelpCircle },
  { title: 'QR Scanner', url: '/student/scanner', icon: QrCode },
];

const teacherItems = [
  { title: 'Dashboard', url: '/teacher', icon: BarChart3 },
  { title: 'Classes', url: '/teacher/classes', icon: BookOpen },
  { title: 'Assignments', url: '/teacher/assignments', icon: FileText },
  { title: 'Grades', url: '/teacher/grades', icon: Award },
  { title: 'Tests', url: '/teacher/tests', icon: ClipboardList },
  { title: 'Attendance', url: '/teacher/attendance', icon: UserCheck },
  { title: 'Timetable', url: '/teacher/timetable', icon: Calendar },
  { title: 'Messages', url: '/teacher/messages', icon: MessageSquare },
  { title: 'Reports', url: '/teacher/reports', icon: FileBarChart },
  { title: 'QR Session', url: '/teacher/qr-session', icon: QrCode },
];

const adminItems = [
  { title: 'Dashboard', url: '/admin', icon: BarChart3 },
  { title: 'User Management', url: '/admin/users', icon: Users },
  { title: 'Classes', url: '/admin/classes', icon: BookOpen },
  { title: 'Subjects', url: '/admin/subjects', icon: GraduationCap },
  { title: 'Fees', url: '/admin/fees', icon: CreditCard },
  { title: 'Events', url: '/admin/events', icon: Calendar },
  { title: 'Announcements', url: '/admin/announcements', icon: Megaphone },
  { title: 'Library', url: '/admin/library', icon: Library },
  { title: 'Transport', url: '/admin/transport', icon: Bus },
  { title: 'Clubs', url: '/admin/clubs', icon: Users },
  { title: 'Support', url: '/admin/support', icon: HelpCircle },
  { title: 'Reports', url: '/admin/reports', icon: FileBarChart },
  { title: 'Settings', url: '/admin/settings', icon: Settings },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const { profile, signOut } = useAuth();
  const collapsed = state === 'collapsed';
  
  const currentPath = location.pathname;
  
  const getMenuItems = () => {
    switch (profile?.role) {
      case 'student': return studentItems;
      case 'teacher': return teacherItems;
      case 'admin': return adminItems;
      default: return studentItems;
    }
  };
  
  const menuItems = getMenuItems();
  const isActive = (path: string) => currentPath === path;
  const isExpanded = menuItems.some((item) => isActive(item.url));
  
  const getRoleColor = () => {
    switch (profile?.role) {
      case 'student': return 'from-blue-500 to-purple-600';
      case 'teacher': return 'from-green-500 to-blue-600';
      case 'admin': return 'from-red-500 to-purple-600';
      default: return 'from-primary to-accent';
    }
  };

  const getRoleIcon = () => {
    switch (profile?.role) {
      case 'student': return <GraduationCap className="h-4 w-4" />;
      case 'teacher': return <Users className="h-4 w-4" />;
      case 'admin': return <Shield className="h-4 w-4" />;
      default: return <GraduationCap className="h-4 w-4" />;
    }
  };

  return (
    <Sidebar className={`${collapsed ? 'w-16' : 'w-64'} border-r border-border/50 bg-card/50 backdrop-blur-sm`}>
      <SidebarHeader className="border-b border-border/50 p-4">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 bg-gradient-to-br ${getRoleColor()} rounded-xl flex items-center justify-center shadow-lg`}>
            <GraduationCap className="h-6 w-6 text-white" />
          </div>
          {!collapsed && (
            <div>
              <h2 className="font-bold text-lg bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                EduTrack
              </h2>
              <p className="text-xs text-muted-foreground capitalize">
                {profile?.role} Portal
              </p>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="p-2">
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            {!collapsed && 'Main Menu'}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 ${
                          isActive
                            ? 'bg-gradient-to-r from-primary/20 to-accent/20 text-primary border border-primary/20 shadow-lg'
                            : 'hover:bg-accent/10 text-muted-foreground hover:text-foreground'
                        }`
                      }
                    >
                      <item.icon className="h-5 w-5 flex-shrink-0" />
                      {!collapsed && (
                        <span className="font-medium">{item.title}</span>
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-border/50 p-4">
        {!collapsed ? (
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-2 rounded-lg bg-accent/10">
              <Avatar className="h-8 w-8 border-2 border-primary/20">
                <AvatarImage src={profile?.photo_url} />
                <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-primary-foreground text-xs">
                  {profile?.name?.split(' ').map(n => n[0]).join('').toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{profile?.name}</p>
                <div className="flex items-center gap-1">
                  {getRoleIcon()}
                  <p className="text-xs text-muted-foreground capitalize">{profile?.role}</p>
                </div>
              </div>
            </div>
            <Button
              onClick={signOut}
              variant="outline"
              size="sm"
              className="w-full justify-start gap-2 text-muted-foreground hover:text-destructive hover:border-destructive/30"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </Button>
          </div>
        ) : (
          <div className="space-y-2">
            <Button
              onClick={signOut}
              variant="outline"
              size="sm"
              className="w-full p-2 text-muted-foreground hover:text-destructive hover:border-destructive/30"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}