import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { GraduationCap, Users, RefreshCw } from 'lucide-react';
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
          size="lg"
          className="flex items-center gap-3 px-6 py-3 text-base font-semibold bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary text-white shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
          disabled={isLoading}
        >
          {getRoleIcon(currentRole)}
          <span className="font-bold">Switch to {getRoleLabel(otherRole)}</span>
          {isLoading ? (
            <RefreshCw className="h-4 w-4 animate-spin" />
          ) : (
            <RefreshCw className="h-4 w-4" />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        className="z-50 bg-white border shadow-2xl rounded-lg p-2 min-w-[200px]"
        sideOffset={8}
      >
        <DropdownMenuItem
          onClick={() => handleRoleSwitch('student')}
          className={`flex items-center gap-3 p-3 rounded-md transition-colors cursor-pointer ${
            currentRole === 'student' 
              ? 'bg-primary text-white' 
              : 'hover:bg-gray-100'
          }`}
        >
          <GraduationCap className="h-5 w-5" />
          <div className="flex flex-col">
            <span className="font-semibold">Student View</span>
            <span className="text-xs opacity-75">Access learning materials</span>
          </div>
          {currentRole === 'student' && (
            <span className="ml-auto text-xs font-bold">✓ Active</span>
          )}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => handleRoleSwitch('teacher')}
          className={`flex items-center gap-3 p-3 rounded-md transition-colors cursor-pointer ${
            currentRole === 'teacher' 
              ? 'bg-primary text-white' 
              : 'hover:bg-gray-100'
          }`}
        >
          <Users className="h-5 w-5" />
          <div className="flex flex-col">
            <span className="font-semibold">Teacher View</span>
            <span className="text-xs opacity-75">Manage content & students</span>
          </div>
          {currentRole === 'teacher' && (
            <span className="ml-auto text-xs font-bold">✓ Active</span>
          )}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};