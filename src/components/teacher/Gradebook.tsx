import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Download, 
  Filter, 
  Search, 
  TrendingUp, 
  TrendingDown,
  Award,
  AlertTriangle
} from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Grade {
  studentId: string;
  studentName: string;
  studentEmail: string;
  assignments: {
    [assignmentId: string]: {
      score: number;
      maxPoints: number;
      submittedAt: string;
      status: 'graded' | 'pending' | 'late';
    };
  };
  overallGrade: number;
  trend: 'up' | 'down' | 'stable';
}

interface Assignment {
  id: string;
  title: string;
  maxPoints: number;
  dueDate: string;
}

export const Gradebook = () => {
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data
  const assignments: Assignment[] = [
    { id: '1', title: 'Chapter 5 Review', maxPoints: 100, dueDate: '2024-01-20' },
    { id: '2', title: 'Science Project', maxPoints: 50, dueDate: '2024-01-25' },
    { id: '3', title: 'History Essay', maxPoints: 75, dueDate: '2024-02-01' }
  ];

  const grades: Grade[] = [
    {
      studentId: '1',
      studentName: 'Alice Johnson',
      studentEmail: 'alice@school.edu',
      assignments: {
        '1': { score: 95, maxPoints: 100, submittedAt: '2024-01-19', status: 'graded' },
        '2': { score: 42, maxPoints: 50, submittedAt: '2024-01-24', status: 'graded' },
        '3': { score: 0, maxPoints: 75, submittedAt: '', status: 'pending' }
      },
      overallGrade: 89,
      trend: 'up'
    },
    {
      studentId: '2',
      studentName: 'Bob Smith',
      studentEmail: 'bob@school.edu',
      assignments: {
        '1': { score: 78, maxPoints: 100, submittedAt: '2024-01-21', status: 'late' },
        '2': { score: 35, maxPoints: 50, submittedAt: '2024-01-25', status: 'graded' },
        '3': { score: 0, maxPoints: 75, submittedAt: '', status: 'pending' }
      },
      overallGrade: 72,
      trend: 'down'
    },
    {
      studentId: '3',
      studentName: 'Carol Davis',
      studentEmail: 'carol@school.edu',
      assignments: {
        '1': { score: 88, maxPoints: 100, submittedAt: '2024-01-20', status: 'graded' },
        '2': { score: 48, maxPoints: 50, submittedAt: '2024-01-23', status: 'graded' },
        '3': { score: 65, maxPoints: 75, submittedAt: '2024-01-30', status: 'graded' }
      },
      overallGrade: 85,
      trend: 'stable'
    }
  ];

  const filteredGrades = grades.filter(grade =>
    grade.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    grade.studentEmail.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getGradeColor = (grade: number) => {
    if (grade >= 90) return 'text-green-600 bg-green-50 border-green-200';
    if (grade >= 80) return 'text-blue-600 bg-blue-50 border-blue-200';
    if (grade >= 70) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'graded': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'late': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'down': return <TrendingDown className="h-4 w-4 text-red-600" />;
      default: return <div className="h-4 w-4" />;
    }
  };

  const classAverage = Math.round(grades.reduce((acc, grade) => acc + grade.overallGrade, 0) / grades.length);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Gradebook</h2>
          <p className="text-muted-foreground">Track student grades and performance across all assignments</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Class Average</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{classAverage}%</div>
            <p className="text-xs text-muted-foreground">Overall performance</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Top Performers</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {grades.filter(g => g.overallGrade >= 90).length}
            </div>
            <p className="text-xs text-muted-foreground">Students with A grades</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">At Risk</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {grades.filter(g => g.overallGrade < 70).length}
            </div>
            <p className="text-xs text-muted-foreground">Students below 70%</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Grades</CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {grades.reduce((acc, grade) => 
                acc + Object.values(grade.assignments).filter(a => a.status === 'pending').length, 0
              )}
            </div>
            <p className="text-xs text-muted-foreground">Assignments to grade</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex items-center space-x-2 flex-1">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search students..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />
            </div>
            <Select value={selectedSubject} onValueChange={setSelectedSubject}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by subject" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Subjects</SelectItem>
                <SelectItem value="mathematics">Mathematics</SelectItem>
                <SelectItem value="science">Science</SelectItem>
                <SelectItem value="history">History</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
      </Card>

      {/* Gradebook Table */}
      <Card>
        <CardHeader>
          <CardTitle>Student Grades</CardTitle>
          <CardDescription>
            Individual student performance across all assignments
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <div className="min-w-full">
              {/* Header */}
              <div className="grid grid-cols-12 gap-4 p-4 bg-gray-50 rounded-t-lg font-medium text-sm">
                <div className="col-span-3">Student</div>
                {assignments.map(assignment => (
                  <div key={assignment.id} className="col-span-2 text-center">
                    {assignment.title}
                    <div className="text-xs text-muted-foreground">/{assignment.maxPoints} pts</div>
                  </div>
                ))}
                <div className="col-span-3 text-center">Overall Grade</div>
              </div>

              {/* Student Rows */}
              <div className="space-y-2">
                {filteredGrades.map((grade) => (
                  <div
                    key={grade.studentId}
                    className="grid grid-cols-12 gap-4 p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="col-span-3">
                      <div className="font-medium">{grade.studentName}</div>
                      <div className="text-sm text-muted-foreground">{grade.studentEmail}</div>
                    </div>
                    
                    {assignments.map(assignment => {
                      const studentAssignment = grade.assignments[assignment.id];
                      return (
                        <div key={assignment.id} className="col-span-2 text-center">
                          {studentAssignment ? (
                            <div className="space-y-1">
                              <div className="font-medium">
                                {studentAssignment.score}/{assignment.maxPoints}
                              </div>
                              <Badge className={`text-xs ${getStatusColor(studentAssignment.status)}`}>
                                {studentAssignment.status}
                              </Badge>
                            </div>
                          ) : (
                            <div className="text-muted-foreground">-</div>
                          )}
                        </div>
                      );
                    })}
                    
                    <div className="col-span-3 text-center">
                      <div className="flex items-center justify-center space-x-2">
                        <Badge className={`font-medium ${getGradeColor(grade.overallGrade)}`}>
                          {grade.overallGrade}%
                        </Badge>
                        {getTrendIcon(grade.trend)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {filteredGrades.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  No students found matching your search criteria.
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};