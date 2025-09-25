import { useState, useRef, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { NotePreview } from "./books/NotePreview";
import { SearchAndFilter } from "./books/SearchAndFilter";
import { TagManager } from "./books/TagManager";
import { AIAssistant } from "./books/AIAssistant";
import { 
  BookOpen, 
  Calculator, 
  Atom, 
  Globe, 
  Users, 
  Palette,
  Music,
  Heart,
  Plus,
  ChevronRight,
  Upload,
  Download,
  Grid,
  List,
  Image,
  FileText,
  Languages,
  Computer,
  Eye,
  Star,
  Calendar,
  Move
} from "lucide-react";

interface Note {
  id: string;
  title: string;
  description?: string;
  subject_id: string;
  file_path?: string;
  file_type?: string;
  file_size?: number;
  tags: string[];
  content_preview?: string;
  ai_summary?: string;
  upload_date: string;
  last_accessed?: string;
  progress: number;
  is_favorite: boolean;
}

interface Subject {
  id: string;
  name: string;
  icon: string;
  color: string;
  description?: string;
}

interface SearchFilters {
  query: string;
  subjects: string[];
  tags: string[];
  fileTypes: string[];
  dateRange: 'all' | 'today' | 'week' | 'month';
  favorites: boolean;
  sortBy: 'date' | 'title' | 'progress';
  sortOrder: 'asc' | 'desc';
}

interface BooksPanelProps {
  className?: string;
  readOnly?: boolean;
}

export const BooksPanel = ({ className, readOnly = false }: BooksPanelProps) => {
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [notes, setNotes] = useState<Note[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [uploading, setUploading] = useState(false);
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [uploadingNote, setUploadingNote] = useState<Partial<Note>>({
    title: '',
    description: '',
    tags: []
  });
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [viewMode, setViewMode] = useState<'subjects' | 'notes' | 'preview'>('subjects');
  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    subjects: [],
    tags: [],
    fileTypes: [],
    dateRange: 'all',
    favorites: false,
    sortBy: 'date',
    sortOrder: 'desc'
  });
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const iconMap: { [key: string]: any } = {
    Calculator,
    Atom,
    Globe,
    Users,
    Palette,
    Music,
    Heart,
    BookOpen,
    Languages,
    Computer
  };

  // Load subjects and notes on mount
  useEffect(() => {
    loadSubjects();
    loadNotes();
  }, []);

  const loadSubjects = async () => {
    try {
      const { data, error } = await supabase
        .from('subjects')
        .select('*')
        .order('name');

      if (error) throw error;
      setSubjects(data || []);
    } catch (error) {
      console.error('Error loading subjects:', error);
    }
  };

  const loadNotes = async () => {
    try {
      const { data, error } = await supabase
        .from('notes')
        .select('*')
        .order('upload_date', { ascending: false });

      if (error) throw error;
      setNotes(data || []);
    } catch (error) {
      console.error('Error loading notes:', error);
    }
  };

  const handleFileUpload = async (files: FileList) => {
    const file = files[0];
    if (!file) return;

    // Enhanced file type support
    const allowedTypes = [
      'application/pdf', 
      'application/epub+zip', 
      'text/plain',
      'image/jpeg',
      'image/png',
      'image/gif',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    
    if (!allowedTypes.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Please upload PDF, EPUB, TXT, images, or Word documents.",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);
    try {
      const fileName = `${selectedSubject || 'general'}/${Date.now()}_${file.name}`;
      const { data, error } = await supabase.storage
        .from('books')
        .upload(fileName, file);

      if (error) throw error;

      // Read content preview for text files
      let contentPreview = '';
      if (file.type === 'text/plain' && file.size < 50000) {
        const text = await file.text();
        contentPreview = text.substring(0, 500);
      }

      // Save note metadata to database
      const { data: noteData, error: noteError } = await supabase
        .from('notes')
        .insert({
          title: uploadingNote.title || file.name.replace(/\.[^/.]+$/, ""),
          description: uploadingNote.description,
          subject_id: selectedSubject || 'general',
          file_path: data.path,
          file_type: file.type,
          file_size: file.size,
          tags: uploadingNote.tags || [],
          content_preview: contentPreview,
          user_id: (await supabase.auth.getUser()).data.user?.id
        })
        .select()
        .single();

      if (noteError) throw noteError;

      setNotes(prev => [noteData, ...prev]);
      setShowUploadDialog(false);
      setUploadingNote({ title: '', description: '', tags: [] });

      toast({
        title: "Note uploaded successfully",
        description: `${file.name} has been added to your library.`,
      });
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Upload failed",
        description: "There was an error uploading your note.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDownload = async (note: Note) => {
    if (!note.file_path) {
      toast({
        title: "No file available",
        description: "This note doesn't have an associated file.",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data, error } = await supabase.storage
        .from('books')
        .download(note.file_path);

      if (error) throw error;

      // Create download link
      const url = URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = note.title;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      // Update last accessed
      await supabase
        .from('notes')
        .update({ last_accessed: new Date().toISOString() })
        .eq('id', note.id);

      toast({
        title: "Download started",
        description: `Downloading ${note.title}...`,
      });
    } catch (error) {
      console.error('Download error:', error);
      toast({
        title: "Download failed",
        description: "There was an error downloading the file.",
        variant: "destructive",
      });
    }
  };

  const handleToggleFavorite = async (noteId: string) => {
    const note = notes.find(n => n.id === noteId);
    if (!note) return;

    try {
      const { error } = await supabase
        .from('notes')
        .update({ is_favorite: !note.is_favorite })
        .eq('id', noteId);

      if (error) throw error;

      setNotes(prev => prev.map(n => 
        n.id === noteId ? { ...n, is_favorite: !n.is_favorite } : n
      ));

      toast({
        title: note.is_favorite ? "Removed from favorites" : "Added to favorites",
        description: `${note.title} has been ${note.is_favorite ? 'removed from' : 'added to'} favorites.`,
      });
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  const handleUpdateProgress = async (noteId: string, progress: number) => {
    try {
      const { error } = await supabase
        .from('notes')
        .update({ progress })
        .eq('id', noteId);

      if (error) throw error;

      setNotes(prev => prev.map(n => 
        n.id === noteId ? { ...n, progress } : n
      ));
    } catch (error) {
      console.error('Error updating progress:', error);
    }
  };

  const handleSummaryGenerated = async (noteId: string, summary: string) => {
    try {
      const { error } = await supabase
        .from('notes')
        .update({ ai_summary: summary })
        .eq('id', noteId);

      if (error) throw error;

      setNotes(prev => prev.map(n => 
        n.id === noteId ? { ...n, ai_summary: summary } : n
      ));
    } catch (error) {
      console.error('Error saving summary:', error);
    }
  };

  const getFilteredNotes = () => {
    let filtered = notes;

    // Text search
    if (filters.query) {
      filtered = filtered.filter(note =>
        note.title.toLowerCase().includes(filters.query.toLowerCase()) ||
        note.description?.toLowerCase().includes(filters.query.toLowerCase()) ||
        note.content_preview?.toLowerCase().includes(filters.query.toLowerCase()) ||
        note.tags.some(tag => tag.toLowerCase().includes(filters.query.toLowerCase()))
      );
    }

    // Subject filter
    if (filters.subjects.length > 0) {
      filtered = filtered.filter(note => filters.subjects.includes(note.subject_id));
    }

    // Tags filter
    if (filters.tags.length > 0) {
      filtered = filtered.filter(note => 
        filters.tags.some(tag => note.tags.includes(tag))
      );
    }

    // Favorites filter
    if (filters.favorites) {
      filtered = filtered.filter(note => note.is_favorite);
    }

    // Date range filter
    if (filters.dateRange !== 'all') {
      const now = new Date();
      const threshold = new Date();
      
      switch (filters.dateRange) {
        case 'today':
          threshold.setHours(0, 0, 0, 0);
          break;
        case 'week':
          threshold.setDate(now.getDate() - 7);
          break;
        case 'month':
          threshold.setMonth(now.getMonth() - 1);
          break;
      }
      
      filtered = filtered.filter(note => 
        new Date(note.upload_date) >= threshold
      );
    }

    // Sort
    filtered.sort((a, b) => {
      let comparison = 0;
      
      switch (filters.sortBy) {
        case 'title':
          comparison = a.title.localeCompare(b.title);
          break;
        case 'progress':
          comparison = a.progress - b.progress;
          break;
        case 'date':
        default:
          comparison = new Date(a.upload_date).getTime() - new Date(b.upload_date).getTime();
          break;
      }
      
      return filters.sortOrder === 'asc' ? comparison : -comparison;
    });

    return filtered;
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      setShowUploadDialog(true);
      // We'll handle the file after the dialog is filled
    }
  };

  const renderSubjectView = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
        {subjects.map((subject) => {
          const Icon = iconMap[subject.icon] || BookOpen;
          const subjectNotes = notes.filter(n => n.subject_id === subject.id);
          return (
            <Button
              key={subject.id}
              variant="outline"
              className="h-auto p-4 flex flex-col items-center gap-3 hover:bg-muted/50"
              onClick={() => {
                setSelectedSubject(subject.id);
                setViewMode('notes');
              }}
            >
              <div className={`w-8 h-8 ${subject.color} rounded-lg flex items-center justify-center`}>
                <Icon className="w-4 h-4 text-white" />
              </div>
              <div className="text-center">
                <p className="text-sm font-medium">{subject.name}</p>
                <p className="text-xs text-muted-foreground">{subjectNotes.length} notes</p>
              </div>
            </Button>
          );
        })}
      </div>
    </div>
  );

  const renderNotesView = () => {
    const filteredNotes = getFilteredNotes();
    const displayNotes = selectedSubject 
      ? filteredNotes.filter(n => n.subject_id === selectedSubject)
      : filteredNotes;

    return (
      <div className="space-y-4">
        <SearchAndFilter
          filters={filters}
          onFiltersChange={setFilters}
          availableSubjects={subjects}
          availableTags={[...new Set(notes.flatMap(n => n.tags))]}
        />
        
        <div className="grid gap-3">
          {displayNotes.map((note) => (
            <Card key={note.id} className="p-4 hover:bg-muted/30 transition-colors cursor-pointer"
                  onClick={() => {
                    setSelectedNote(note);
                    setViewMode('preview');
                  }}>
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-medium truncate">{note.title}</h4>
                      {note.is_favorite && <Star className="w-4 h-4 text-yellow-500 fill-current" />}
                    </div>
                    {note.description && (
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{note.description}</p>
                    )}
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="outline" className="text-xs">
                        {subjects.find(s => s.id === note.subject_id)?.name}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {new Date(note.upload_date).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" onClick={(e) => {
                      e.stopPropagation();
                      handleDownload(note);
                    }}>
                      <Download className="w-4 h-4" />
                    </Button>
                    <Badge variant="secondary" className="text-xs">
                      {note.progress}%
                    </Badge>
                  </div>
                </div>
                
                {note.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {note.tags.slice(0, 3).map((tag, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {note.tags.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{note.tags.length - 3}
                      </Badge>
                    )}
                  </div>
                )}
                
                <div className="w-full bg-muted rounded-full h-1.5">
                  <div 
                    className="bg-gradient-primary h-1.5 rounded-full transition-all duration-300" 
                    style={{ width: `${note.progress}%` }}
                  />
                </div>
              </div>
            </Card>
          ))}
          
          {displayNotes.length === 0 && (
            <div className="text-center py-12 space-y-4">
              <BookOpen className="w-16 h-16 mx-auto text-muted-foreground/50" />
              <div>
                <p className="text-sm text-muted-foreground">No notes found</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Try adjusting your filters or upload your first note
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Main Panel */}
      <Card className={`shadow-elegant transition-all duration-300 ${dragActive && !readOnly ? 'border-primary bg-primary/5' : ''}`}
            onDragOver={!readOnly ? handleDragOver : undefined}
            onDragLeave={!readOnly ? handleDragLeave : undefined}
            onDrop={!readOnly ? handleDrop : undefined}>
        <div className="p-4 space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                <BookOpen className="w-4 h-4 text-primary-foreground" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Books Lab</h3>
                <p className="text-xs text-muted-foreground">
                  {notes.length} notes{!readOnly ? ' • Drag & drop to upload' : ' • Read-only access'}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              {viewMode === 'notes' && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setViewMode('subjects')}
                >
                  <Grid className="w-4 h-4" />
                </Button>
              )}
              {!readOnly && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setShowUploadDialog(true)}
                  disabled={uploading}
                >
                  <Upload className="w-4 h-4" />
                </Button>
              )}
              {viewMode !== 'subjects' && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    setViewMode('subjects');
                    setSelectedSubject(null);
                  }}
                >
                  <ChevronRight className="w-4 h-4 rotate-180" />
                </Button>
              )}
            </div>
          </div>

          <Separator />

          {/* Content */}
          {viewMode === 'subjects' && renderSubjectView()}
          {viewMode === 'notes' && renderNotesView()}
          {viewMode === 'preview' && selectedNote && (
            <NotePreview
              note={selectedNote}
              onClose={() => {
                setSelectedNote(null);
                setViewMode('notes');
              }}
              onDownload={handleDownload}
              onToggleFavorite={handleToggleFavorite}
              onUpdateProgress={handleUpdateProgress}
            />
          )}

          {dragActive && !readOnly && (
            <div className="absolute inset-0 bg-primary/10 rounded-lg flex items-center justify-center pointer-events-none">
              <div className="text-center space-y-2">
                <Move className="w-12 h-12 mx-auto text-primary" />
                <p className="text-sm font-medium text-primary">Drop files here to upload</p>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* AI Assistant Panel */}
      {viewMode === 'preview' && (
        <AIAssistant
          selectedNote={selectedNote}
          onSummaryGenerated={handleSummaryGenerated}
        />
      )}

      {/* Upload Dialog */}
      {!readOnly && (
        <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Upload Note</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Title *</label>
                <Input
                  value={uploadingNote.title}
                  onChange={(e) => setUploadingNote(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Enter note title..."
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Description</label>
                <Textarea
                  value={uploadingNote.description}
                  onChange={(e) => setUploadingNote(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Brief description..."
                  className="min-h-[80px]"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Subject</label>
                <select 
                  className="w-full px-3 py-2 rounded-md border border-input bg-background"
                  value={selectedSubject || ''}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                >
                  <option value="">Select subject...</option>
                  {subjects.map(subject => (
                    <option key={subject.id} value={subject.id}>{subject.name}</option>
                  ))}
                </select>
              </div>

              <TagManager
                tags={uploadingNote.tags || []}
                onTagsChange={(tags) => setUploadingNote(prev => ({ ...prev, tags }))}
                placeholder="Add tags..."
              />

              <div className="space-y-2">
                <Button
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full"
                  disabled={uploading}
                >
                  <Upload className="w-4 h-4 mr-2" />
                  {uploading ? 'Uploading...' : 'Choose File'}
                </Button>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setShowUploadDialog(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={!uploadingNote.title || !selectedSubject || uploading}
                  className="flex-1"
                >
                  Upload
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {!readOnly && (
        <Input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.epub,.txt,.jpg,.jpeg,.png,.gif,.doc,.docx"
          onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
          className="hidden"
        />
      )}
    </div>
  );
};
