import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Download, 
  Search, 
  Filter, 
  Clock, 
  Trash2,
  Eye,
  EyeOff,
  RefreshCw
} from "lucide-react";
import { toast } from "sonner";

interface LogEntry {
  id: string;
  timestamp: Date;
  actionType: 'draw' | 'erase' | 'select' | 'move' | 'create' | 'delete' | 'modify' | 'save' | 'load' | 'export';
  objectId: string;
  description: string;
  userId?: string;
  metadata?: Record<string, any>;
}

interface LogTableProps {
  className?: string;
  isDocked?: boolean;
  onToggleDock?: () => void;
}

export const LogTable = ({ className, isDocked = false, onToggleDock }: LogTableProps) => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedActionType, setSelectedActionType] = useState('All');
  const [isVisible, setIsVisible] = useState(true);

  // Mock log data - in real app, this would come from a logging service
  useEffect(() => {
    const mockLogs: LogEntry[] = [
      {
        id: '1',
        timestamp: new Date(Date.now() - 1000 * 60 * 5),
        actionType: 'create',
        objectId: 'sticky-note-001',
        description: 'Created sticky note with text "Remember to review chapter 5"',
        userId: 'user-123',
        metadata: { color: 'yellow', position: { x: 100, y: 200 } }
      },
      {
        id: '2',
        timestamp: new Date(Date.now() - 1000 * 60 * 3),
        actionType: 'draw',
        objectId: 'stroke-002',
        description: 'Drew freehand stroke with pen tool',
        userId: 'user-123',
        metadata: { tool: 'pen', color: '#3b82f6', strokeWidth: 3 }
      },
      {
        id: '3',
        timestamp: new Date(Date.now() - 1000 * 60 * 2),
        actionType: 'erase',
        objectId: 'stroke-001',
        description: 'Erased stroke using stroke eraser',
        userId: 'user-123',
        metadata: { eraserMode: 'stroke', affectedObjects: 1 }
      },
      {
        id: '4',
        timestamp: new Date(Date.now() - 1000 * 60 * 1),
        actionType: 'modify',
        objectId: 'text-003',
        description: 'Modified text content from "Hello" to "Hello World"',
        userId: 'user-123',
        metadata: { oldValue: 'Hello', newValue: 'Hello World' }
      },
      {
        id: '5',
        timestamp: new Date(),
        actionType: 'save',
        objectId: 'board-001',
        description: 'Saved board state to cloud storage',
        userId: 'user-123',
        metadata: { fileSize: '2.3MB', objectCount: 15 }
      }
    ];
    setLogs(mockLogs);
  }, []);

  // Add new log entry (called by other components)
  const addLogEntry = (entry: Omit<LogEntry, 'id' | 'timestamp'>) => {
    const newEntry: LogEntry = {
      ...entry,
      id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date()
    };
    setLogs(prev => [newEntry, ...prev]);
  };

  // Expose addLogEntry globally for other components to use
  useEffect(() => {
    (window as any).addLogEntry = addLogEntry;
    return () => {
      delete (window as any).addLogEntry;
    };
  }, []);

  const actionTypes = ['All', 'draw', 'erase', 'select', 'move', 'create', 'delete', 'modify', 'save', 'load', 'export'];

  const filteredLogs = logs.filter(log => {
    const matchesSearch = log.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.objectId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.actionType.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesActionType = selectedActionType === 'All' || log.actionType === selectedActionType;
    return matchesSearch && matchesActionType;
  });

  const exportToCSV = () => {
    const headers = ['Timestamp', 'Action Type', 'Object ID', 'Description', 'User ID'];
    const csvContent = [
      headers.join(','),
      ...filteredLogs.map(log => [
        log.timestamp.toISOString(),
        log.actionType,
        log.objectId,
        `"${log.description.replace(/"/g, '""')}"`,
        log.userId || ''
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `smartboard-logs-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success("Logs exported to CSV!");
  };

  const exportToJSON = () => {
    const jsonContent = JSON.stringify(filteredLogs, null, 2);
    const blob = new Blob([jsonContent], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `smartboard-logs-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success("Logs exported to JSON!");
  };

  const clearLogs = () => {
    setLogs([]);
    toast.success("All logs cleared!");
  };

  const getActionTypeColor = (actionType: string) => {
    const colors = {
      draw: 'bg-blue-100 text-blue-800',
      erase: 'bg-red-100 text-red-800',
      select: 'bg-green-100 text-green-800',
      move: 'bg-yellow-100 text-yellow-800',
      create: 'bg-purple-100 text-purple-800',
      delete: 'bg-red-100 text-red-800',
      modify: 'bg-orange-100 text-orange-800',
      save: 'bg-emerald-100 text-emerald-800',
      load: 'bg-cyan-100 text-cyan-800',
      export: 'bg-indigo-100 text-indigo-800'
    };
    return colors[actionType as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  if (!isVisible) {
    return (
      <Button
        onClick={() => setIsVisible(true)}
        variant="outline"
        size="sm"
        className="fixed bottom-4 right-4 z-50"
      >
        <Eye className="w-4 h-4 mr-2" />
        Show Logs
      </Button>
    );
  }

  return (
    <Card className={`shadow-medium h-full flex flex-col ${className} ${isDocked ? 'fixed bottom-0 right-0 w-96 h-80 z-40' : ''}`}>
      <div className="p-4 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-primary" />
            <div>
              <h3 className="font-semibold text-foreground">Activity Log</h3>
              <p className="text-xs text-muted-foreground">{logs.length} total entries</p>
            </div>
          </div>
          <div className="flex gap-2">
            {onToggleDock && (
              <Button onClick={onToggleDock} variant="outline" size="sm">
                {isDocked ? 'Undock' : 'Dock'}
              </Button>
            )}
            <Button onClick={() => setIsVisible(false)} variant="outline" size="sm">
              <EyeOff className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="space-y-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search logs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-muted-foreground" />
            <select 
              value={selectedActionType} 
              onChange={(e) => setSelectedActionType(e.target.value)}
              className="text-sm px-2 py-1 rounded border bg-background flex-1"
            >
              {actionTypes.map(type => (
                <option key={type} value={type}>
                  {type === 'All' ? 'All Actions' : type}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button onClick={exportToCSV} variant="outline" size="sm" className="flex-1">
            <Download className="w-4 h-4 mr-2" />
            CSV
          </Button>
          <Button onClick={exportToJSON} variant="outline" size="sm" className="flex-1">
            <Download className="w-4 h-4 mr-2" />
            JSON
          </Button>
          <Button onClick={clearLogs} variant="outline" size="sm">
            <Trash2 className="w-4 h-4" />
          </Button>
          <Button onClick={() => window.location.reload()} variant="outline" size="sm">
            <RefreshCw className="w-4 h-4" />
          </Button>
        </div>

        <Separator />
      </div>

      {/* Logs Table */}
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[120px]">Time</TableHead>
                <TableHead className="w-[100px]">Action</TableHead>
                <TableHead className="w-[120px]">Object ID</TableHead>
                <TableHead>Description</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLogs.map((log) => (
                <TableRow key={log.id} className="hover:bg-muted/50">
                  <TableCell className="text-xs">
                    {log.timestamp.toLocaleTimeString()}
                  </TableCell>
                  <TableCell>
                    <Badge className={`text-xs ${getActionTypeColor(log.actionType)}`}>
                      {log.actionType}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs font-mono">
                    {log.objectId}
                  </TableCell>
                  <TableCell className="text-xs">
                    {log.description}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          {filteredLogs.length === 0 && (
            <div className="text-center py-8">
              <Clock className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">No log entries found</p>
              <p className="text-xs text-muted-foreground mt-1">
                Actions will appear here as you use the board
              </p>
            </div>
          )}
        </ScrollArea>
      </div>
    </Card>
  );
};