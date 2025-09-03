import { Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  BookOpen, 
  ClipboardList, 
  BarChart3, 
  ArrowLeft,
  GraduationCap,
  Calendar,
  MessageSquare,
  Settings
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { StudentManagement } from '@/components/teacher/StudentManagement';
import { AssignmentManager } from '@/components/teacher/AssignmentManager';
import { Gradebook } from '@/components/teacher/Gradebook';
import { ClassAnalytics } from '@/components/teacher/ClassAnalytics';
import { useState } from 'react';

const TeacherInterface = () => {
  const { user, profile, loading, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState('students');

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  const userRole = profile?.role || 'student';

  // Redirect non-teachers
  if (userRole !== 'teacher') {
    return <Navigate to="/dashboard" replace />;
  }

  const tabs = [
    { id: 'students', label: 'Students', icon: Users, description: 'Manage student roster and profiles' },
    { id: 'assignments', label: 'Assignments', icon: ClipboardList, description: 'Create and manage assignments' },
    { id: 'gradebook', label: 'Gradebook', icon: BookOpen, description: 'Track grades and performance' },
    { id: 'analytics', label: 'Analytics', icon: BarChart3, description: 'Class performance insights' },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'students':
        return <StudentManagement />;
      case 'assignments':
        return <AssignmentManager />;
      case 'gradebook':
        return <Gradebook />;
      case 'analytics':
        return <ClassAnalytics />;
      default:
        return <StudentManagement />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => window.history.back()}
                className="mr-2"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <GraduationCap className="h-8 w-8 text-primary" />
              <h1 className="text-xl font-bold">Teacher Interface</h1>
              <Badge variant="default">
                <Users className="h-3 w-3 mr-1" />
                Teacher Portal
              </Badge>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  {new Date().toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </span>
              </div>
              <span className="text-sm text-muted-foreground">
                {profile?.full_name || user.email}
              </span>
              <Button variant="outline" size="sm" onClick={signOut}>
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {tabs.map((tab) => (
              <Card 
                key={tab.id}
                className={`cursor-pointer transition-all hover:shadow-lg ${
                  activeTab === tab.id 
                    ? 'border-primary bg-primary/5 shadow-md' 
                    : 'hover:border-primary/50'
                }`}
                onClick={() => setActiveTab(tab.id)}
              >
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center text-lg">
                    <tab.icon className={`h-5 w-5 mr-2 ${
                      activeTab === tab.id ? 'text-primary' : 'text-muted-foreground'
                    }`} />
                    {tab.label}
                  </CardTitle>
                  <CardDescription className="text-sm">
                    {tab.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div className="space-y-6">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default TeacherInterface;