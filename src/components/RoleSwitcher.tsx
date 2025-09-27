import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { GraduationCap, Users, BookOpen, Settings, Presentation } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

const roles = [
  {
    id: 'student',
    name: 'Student',
    description: 'Access learning materials and tools',
    icon: GraduationCap,
    color: 'from-blue-500 to-blue-600',
    hoverColor: 'hover:from-blue-600 hover:to-blue-700'
  },
  {
    id: 'teacher',
    name: 'Teacher',
    description: 'Manage content, students and assignments',
    icon: Users,
    color: 'from-green-500 to-green-600',
    hoverColor: 'hover:from-green-600 hover:to-green-700'
  },
  {
    id: 'admin',
    name: 'Administrator',
    description: 'Full system access and management',
    icon: Settings,
    color: 'from-purple-500 to-purple-600',
    hoverColor: 'hover:from-purple-600 hover:to-purple-700'
  },
  {
    id: 'instructor',
    name: 'Instructor',
    description: 'Create and deliver presentations',
    icon: Presentation,
    color: 'from-orange-500 to-orange-600',
    hoverColor: 'hover:from-orange-600 hover:to-orange-700'
  }
] as const;

export const RoleSwitcher = () => {
  const { profile, switchRole } = useAuth();
  const [isLoading, setIsLoading] = useState<string | null>(null);

  if (!profile) return null;

  const currentRole = profile.active_role;
  const availableRoles = profile.available_roles || ['student', 'teacher'];

  const handleRoleSwitch = async (newRole: 'student' | 'teacher') => {
    if (newRole === currentRole) return;
    
    setIsLoading(newRole);
    await switchRole(newRole);
    setIsLoading(null);
  };

  const filteredRoles = roles.filter(role => 
    availableRoles.includes(role.id as 'student' | 'teacher')
  );

  return (
    <Card className="w-full max-w-4xl mx-auto shadow-xl border-0 bg-gradient-to-br from-white to-gray-50">
      <CardHeader className="text-center pb-4">
        <CardTitle className="text-2xl font-bold text-gray-800 flex items-center justify-center gap-2">
          <BookOpen className="h-6 w-6 text-primary" />
          Switch Your Role
        </CardTitle>
        <p className="text-gray-600 mt-2">Choose how you want to interact with the platform</p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {filteredRoles.map((role) => {
            const Icon = role.icon;
            const isActive = currentRole === role.id;
            const isLoadingThis = isLoading === role.id;
            
            return (
              <Button
                key={role.id}
                onClick={() => handleRoleSwitch(role.id as 'student' | 'teacher')}
                disabled={isActive || isLoadingThis}
                className={`
                  relative h-auto p-6 flex flex-col items-center gap-3 text-white font-semibold
                  transition-all duration-300 transform hover:scale-105 hover:shadow-xl
                  ${isActive 
                    ? `bg-gradient-to-br ${role.color} ring-4 ring-primary/20 scale-105 shadow-xl` 
                    : `bg-gradient-to-br ${role.color} ${role.hoverColor} shadow-lg`
                  }
                `}
              >
                {isActive && (
                  <div className="absolute -top-2 -right-2 bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                    ✓
                  </div>
                )}
                
                {isLoadingThis ? (
                  <div className="animate-spin rounded-full h-8 w-8 border-2 border-white border-t-transparent" />
                ) : (
                  <Icon className="h-8 w-8" />
                )}
                
                <div className="text-center">
                  <h3 className="font-bold text-lg">{role.name}</h3>
                  <p className="text-sm opacity-90 mt-1">{role.description}</p>
                  {isActive && (
                    <span className="inline-block mt-2 px-2 py-1 bg-white/20 rounded-full text-xs font-bold">
                      Currently Active
                    </span>
                  )}
                </div>
              </Button>
            );
          })}
        </div>
        
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            Current Role: <span className="font-semibold text-primary capitalize">{currentRole}</span>
          </p>
        </div>
      </CardContent>
    </Card>
  );
};