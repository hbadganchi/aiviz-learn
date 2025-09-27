import { Navigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  BookOpen, 
  MessageSquare, 
  Calculator, 
  Box, 
  LogOut, 
  GraduationCap,
  Users,
  Hash
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { BooksPanel } from '@/components/BooksPanel';
import { AIWordHelper } from '@/components/AIWordHelper';
import { ScientificCalculator } from '@/components/ScientificCalculator';
import { QuadraticSolver } from '@/components/QuadraticSolver';
import { GeometryViewer } from '@/components/GeometryViewer';
import { LogTable } from '@/components/LogTable';
import { RoleSwitcher } from '@/components/RoleSwitcher';

const Dashboard = () => {
  const { user, profile, loading, signOut } = useAuth();

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

  // If user exists but no profile, assume student role for now
  const currentRole = profile?.active_role || 'student';
  const isTeacher = currentRole === 'teacher';

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-gray-50">
      {/* Header */}
      <header className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <GraduationCap className="h-8 w-8 text-primary" />
              <h1 className="text-xl font-bold">EduPortal</h1>
              <Badge variant={isTeacher ? 'default' : 'secondary'}>
                {isTeacher ? (
                  <>
                    <Users className="h-3 w-3 mr-1" />
                    Teacher View
                  </>
                ) : (
                  <>
                    <GraduationCap className="h-3 w-3 mr-1" />
                    Student View
                  </>
                )}
              </Badge>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-muted-foreground">
                {profile?.full_name || user.email}
              </span>
              <Button variant="outline" size="sm" onClick={signOut}>
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Role Switcher - Prominent Center Position */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex justify-center">
          <RoleSwitcher />
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Books Lab */}
          <Card className="h-fit">
            <CardHeader>
              <CardTitle className="flex items-center">
                <BookOpen className="h-5 w-5 mr-2" />
                Books Lab
              </CardTitle>
              <CardDescription>
                {isTeacher 
                  ? 'Upload and manage educational materials' 
                  : 'Access educational materials uploaded by teachers'
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              <BooksPanel 
                className="border-0 shadow-none p-0"
                readOnly={!isTeacher}
              />
            </CardContent>
          </Card>

          {/* AI Word Helper */}
          <Card className="h-fit">
            <CardHeader>
              <CardTitle className="flex items-center">
                <MessageSquare className="h-5 w-5 mr-2" />
                AI Word Helper
              </CardTitle>
              <CardDescription>
                Get definitions, explanations, and help with vocabulary
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AIWordHelper />
            </CardContent>
          </Card>
        </div>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {/* Log Table */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-sm">
                <Hash className="h-4 w-4 mr-2" />
                Log Table
              </CardTitle>
            </CardHeader>
            <CardContent>
              <LogTable />
            </CardContent>
          </Card>

          {/* Quadratic Solver */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-sm">
                <Hash className="h-4 w-4 mr-2" />
                Quadratic Solver
              </CardTitle>
            </CardHeader>
            <CardContent>
              <QuadraticSolver />
            </CardContent>
          </Card>

          {/* Scientific Calculator */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-sm">
                <Calculator className="h-4 w-4 mr-2" />
                Calculator
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScientificCalculator />
            </CardContent>
          </Card>

          {/* 3D Geometry Viewer */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-sm">
                <Box className="h-4 w-4 mr-2" />
                3D Geometry
              </CardTitle>
            </CardHeader>
            <CardContent>
              <GeometryViewer />
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;