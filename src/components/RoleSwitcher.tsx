import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { GraduationCap, Users, ArrowRightLeft } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

export const RoleSwitcher = () => {
  const { profile, switchRole } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  if (!profile) return null;

  const currentRole = profile.active_role;
  const otherRole = currentRole === 'student' ? 'teacher' : 'student';

  const handleRoleSwitch = async (newRole: 'student' | 'teacher') => {
    if (newRole === currentRole) return;
    
    setIsLoading(true);
    await switchRole(newRole);
    setIsLoading(false);
  };

  const getRoleIcon = (role: string) => {
    return role === 'student' ? <GraduationCap className="h-4 w-4" /> : <Users className="h-4 w-4" />;
  };

  const getRoleLabel = (role: string) => {
    return role === 'student' ? 'Student' : 'Teacher';
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          className="flex items-center gap-2"
          disabled={isLoading}
        >
          {getRoleIcon(currentRole)}
          {getRoleLabel(currentRole)}
          <ArrowRightLeft className="h-3 w-3" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onClick={() => handleRoleSwitch('student')}
          className={`flex items-center gap-2 ${currentRole === 'student' ? 'bg-primary/10' : ''}`}
        >
          <GraduationCap className="h-4 w-4" />
          Student View
          {currentRole === 'student' && (
            <span className="ml-auto text-xs text-primary">Active</span>
          )}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => handleRoleSwitch('teacher')}
          className={`flex items-center gap-2 ${currentRole === 'teacher' ? 'bg-primary/10' : ''}`}
        >
          <Users className="h-4 w-4" />
          Teacher View
          {currentRole === 'teacher' && (
            <span className="ml-auto text-xs text-primary">Active</span>
          )}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};