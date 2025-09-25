import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { GraduationCap, Users, Shield, CheckCircle } from 'lucide-react';

interface RoleSelectorProps {
  selectedRole: 'student' | 'teacher' | 'admin';
  onRoleChange: (role: 'student' | 'teacher' | 'admin') => void;
}

export default function RoleSelector({ selectedRole, onRoleChange }: RoleSelectorProps) {
  const roles = [
    {
      id: 'student' as const,
      title: 'Student',
      icon: GraduationCap,
      description: 'Access assignments, grades, timetable, and scan QR codes',
      features: ['QR Scanner', 'View Grades', 'Library Access', 'Assignments'],
      color: 'from-blue-500 to-purple-600',
      bgColor: 'bg-blue-50 hover:bg-blue-100 border-blue-200',
      selectedBg: 'bg-blue-100 border-blue-400'
    },
    {
      id: 'teacher' as const,
      title: 'Teacher',
      icon: Users,
      description: 'Manage classes, create assignments, and track attendance',
      features: ['Create QR Sessions', 'Grade Assignments', 'Manage Subjects'],
      color: 'from-green-500 to-blue-600',
      bgColor: 'bg-green-50 hover:bg-green-100 border-green-200',
      selectedBg: 'bg-green-100 border-green-400'
    },
    {
      id: 'admin' as const,
      title: 'Administrator',
      icon: Shield,
      description: 'Full system access and user management',
      features: ['User Management', 'System Settings', 'Full Reports'],
      color: 'from-red-500 to-purple-600',
      bgColor: 'bg-red-50 hover:bg-red-100 border-red-200',
      selectedBg: 'bg-red-100 border-red-400'
    }
  ];

  return (
    <div className="space-y-4">
      <div className="text-center space-y-2">
        <h3 className="text-lg font-semibold">Choose Your Role</h3>
        <p className="text-sm text-muted-foreground">
          Select how you'll be using EduTrack
        </p>
      </div>
      
      <div className="grid grid-cols-1 gap-3">
        {roles.map((role) => (
          <Card
            key={role.id}
            className={`cursor-pointer transition-all duration-200 border-2 ${
              selectedRole === role.id 
                ? `${role.selectedBg} border-current shadow-md` 
                : `${role.bgColor} border-current hover:shadow-sm`
            }`}
            onClick={() => onRoleChange(role.id)}
          >
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className={`w-12 h-12 bg-gradient-to-r ${role.color} rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg`}>
                  <role.icon className="h-6 w-6 text-white" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold text-sm">{role.title}</h4>
                    {selectedRole === role.id && (
                      <CheckCircle className="h-4 w-4 text-primary" />
                    )}
                  </div>
                  
                  <p className="text-xs text-muted-foreground mb-2 leading-relaxed">
                    {role.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-1">
                    {role.features.map((feature, idx) => (
                      <Badge
                        key={idx}
                        variant="secondary"
                        className="text-xs px-2 py-0.5"
                      >
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}