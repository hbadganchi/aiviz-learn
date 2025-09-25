import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { StickyNote, BookOpen, FolderSync as Sync, Plus, Edit3, Trash2, Save, X, AlertTriangle, Check, Clock, Tag } from "lucide-react";
import { toast } from "sonner";

interface Note {
  id: string;
  title: string;
  content: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  isAutoSync: boolean;
  libraryEntryId?: string;
}

interface LibraryEntry {
  id: string;
  title: string;
  snippet: string;
  fullContent: string;
  tags: string[];
  lastModified: Date;
  noteId?: string;
  wordCount: number;
}

interface ConflictResolution {
  noteId: string;
  libraryId: string;
  noteContent: string;
  libraryContent: string;
  conflictType: 'content' | 'title' | 'tags';
}

interface SmartNotesLibrarySyncProps {
  className?: string;
}

export const SmartNotesLibrarySync = ({ className }: SmartNotesLibrarySyncProps) => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [libraryEntries, setLibraryEntries] = useState<LibraryEntry[]>([]);
  const [conflicts, setConflicts] = useState<ConflictResolution[]>([]);
  const [activeConflict, setActiveConflict] = useState<ConflictResolution | null>(null);
  const [isCreatingNote, setIsCreatingNote] = useState(false);
  const [newNote, setNewNote] = useState({ title: '', content: '', tags: '' });
  const [globalAutoSync, setGlobalAutoSync] = useState(true);

  // Initialize with sample data
  useEffect(() => {
    const sampleNotes: Note[] = [
      {
        id: 'note-1',
        title: 'Chemistry Lab Notes',
        content: 'Today we studied the properties of acids and bases. Key observations: pH indicators change color based on acidity levels.',
        tags: ['chemistry', 'lab', 'acids', 'bases'],
        createdAt: new Date(Date.now() - 1000 * 60 * 30),
        updatedAt: new Date(Date.now() - 1000 * 60 * 15),
        isAutoSync: true,
        libraryEntryId: 'lib-1'
      },
      {
        id: 'note-2',
        title: 'Math Problem Solving',
        content: 'Quadratic equations can be solved using the quadratic formula: x = (-b ± √(b²-4ac)) / 2a',
        tags: ['math', 'algebra', 'quadratic'],
        createdAt: new Date(Date.now() - 1000 * 60 * 60),
        updatedAt: new Date(Date.now() - 1000 * 60 * 5),
        isAutoSync: true
      }
    ];

    const sampleLibrary: LibraryEntry[] = [
      {
        id: 'lib-1',
        title: 'Chemistry Lab Notes',
        snippet: 'Today we studied the properties of acids and bases...',
        fullContent: 'Today we studied the properties of acids and bases. Key observations: pH indicators change color based on acidity levels. Additional notes from library.',
        tags: ['chemistry', 'lab', 'acids', 'bases', 'indicators'],
        lastModified: new Date(Date.now() - 1000 * 60 * 10),
        noteId: 'note-1',
        wordCount: 25
      }
    ];

    setNotes(sampleNotes);
    setLibraryEntries(sampleLibrary);

    // Simulate a conflict
    setTimeout(() => {
      setConflicts([{
        noteId: 'note-1',
        libraryId: 'lib-1',
        noteContent: sampleNotes[0].content,
        libraryContent: sampleLibrary[0].fullContent,
        conflictType: 'content'
      }]);
    }, 2000);
  }, []);

  // Auto-sync function
  const syncNoteToLibrary = (note: Note) => {
    if (!note.isAutoSync || !globalAutoSync) return;

    const existingEntry = libraryEntries.find(entry => entry.noteId === note.id);
    const snippet = note.content.substring(0, 100) + (note.content.length > 100 ? '...' : '');
    
    if (existingEntry) {
      // Update existing library entry
      setLibraryEntries(prev => prev.map(entry => 
        entry.id === existingEntry.id 
          ? {
              ...entry,
              title: note.title,
              snippet,
              fullContent: note.content,
              tags: note.tags,
              lastModified: new Date(),
              wordCount: note.content.split(' ').length
            }
          : entry
      ));
    } else {
      // Create new library entry
      const newEntry: LibraryEntry = {
        id: `lib-${Date.now()}`,
        title: note.title,
        snippet,
        fullContent: note.content,
        tags: note.tags,
        lastModified: new Date(),
        noteId: note.id,
        wordCount: note.content.split(' ').length
      };
      setLibraryEntries(prev => [...prev, newEntry]);
      
      // Update note with library reference
      setNotes(prev => prev.map(n => 
        n.id === note.id ? { ...n, libraryEntryId: newEntry.id } : n
      ));
    }

    toast.success(`"${note.title}" synced to library`);
    
    // Log the sync action
    if ((window as any).addLogEntry) {
      (window as any).addLogEntry({
        actionType: 'save',
        objectId: note.id,
        description: `Auto-synced note "${note.title}" to library`,
        metadata: { syncType: 'auto', noteId: note.id, libraryId: existingEntry?.id }
      });
    }
  };

  // Create new note
  const createNote = () => {
    if (!newNote.title.trim() || !newNote.content.trim()) {
      toast.error("Please enter both title and content");
      return;
    }

    const note: Note = {
      id: `note-${Date.now()}`,
      title: newNote.title.trim(),
      content: newNote.content.trim(),
      tags: newNote.tags.split(',').map(tag => tag.trim()).filter(Boolean),
      createdAt: new Date(),
      updatedAt: new Date(),
      isAutoSync: globalAutoSync
    };

    setNotes(prev => [note, ...prev]);
    setNewNote({ title: '', content: '', tags: '' });
    setIsCreatingNote(false);

    // Auto-sync if enabled
    if (note.isAutoSync && globalAutoSync) {
      setTimeout(() => syncNoteToLibrary(note), 500);
    }

    toast.success("Note created successfully!");
  };

  // Update note
  const updateNote = (noteId: string, updates: Partial<Note>) => {
    setNotes(prev => prev.map(note => {
      if (note.id === noteId) {
        const updatedNote = { ...note, ...updates, updatedAt: new Date() };
        
        // Auto-sync if enabled
        if (updatedNote.isAutoSync && globalAutoSync) {
          setTimeout(() => syncNoteToLibrary(updatedNote), 500);
        }
        
        return updatedNote;
      }
      return note;
    }));
  };

  // Toggle auto-sync for individual note
  const toggleNoteAutoSync = (noteId: string) => {
    updateNote(noteId, { 
      isAutoSync: !notes.find(n => n.id === noteId)?.isAutoSync 
    });
  };

  // Resolve conflict
  const resolveConflict = (resolution: 'keepNote' | 'keepLibrary' | 'merge') => {
    if (!activeConflict) return;

    const { noteId, libraryId, noteContent, libraryContent } = activeConflict;

    switch (resolution) {
      case 'keepNote':
        // Update library with note content
        setLibraryEntries(prev => prev.map(entry => 
          entry.id === libraryId 
            ? { ...entry, fullContent: noteContent, lastModified: new Date() }
            : entry
        ));
        toast.success("Kept note version, updated library");
        break;
        
      case 'keepLibrary':
        // Update note with library content
        setNotes(prev => prev.map(note => 
          note.id === noteId 
            ? { ...note, content: libraryContent, updatedAt: new Date() }
            : note
        ));
        toast.success("Kept library version, updated note");
        break;
        
      case 'merge':
        // Merge both contents
        const mergedContent = `${noteContent}\n\n--- Merged from Library ---\n${libraryContent}`;
        setNotes(prev => prev.map(note => 
          note.id === noteId 
            ? { ...note, content: mergedContent, updatedAt: new Date() }
            : note
        ));
        setLibraryEntries(prev => prev.map(entry => 
          entry.id === libraryId 
            ? { ...entry, fullContent: mergedContent, lastModified: new Date() }
            : entry
        ));
        toast.success("Merged both versions");
        break;
    }

    // Remove resolved conflict
    setConflicts(prev => prev.filter(c => c.noteId !== noteId || c.libraryId !== libraryId));
    setActiveConflict(null);
  };

  return (
    <div className={`grid grid-cols-1 lg:grid-cols-2 gap-6 ${className}`}>
      {/* Smart Notes Panel */}
      <Card className="shadow-medium h-full flex flex-col">
        <div className="p-4 border-b">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <StickyNote className="w-5 h-5 text-primary" />
              <div>
                <h3 className="font-semibold text-foreground">Smart Notes</h3>
                <p className="text-xs text-muted-foreground">{notes.length} notes</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button onClick={() => setIsCreatingNote(true)} size="sm">
                <Plus className="w-4 h-4 mr-2" />
                New Note
              </Button>
            </div>
          </div>

          {/* Global Auto-sync Toggle */}
          <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-2">
              <Sync className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">Auto-sync to Library</span>
            </div>
            <Switch
              checked={globalAutoSync}
              onCheckedChange={setGlobalAutoSync}
            />
          </div>

          {/* Conflict Alert */}
          {conflicts.length > 0 && (
            <div className="mt-3 p-3 bg-orange-50 border border-orange-200 rounded-lg">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-orange-600" />
                <span className="text-sm font-medium text-orange-800">
                  {conflicts.length} sync conflict(s) detected
                </span>
                <Button 
                  onClick={() => setActiveConflict(conflicts[0])}
                  size="sm" 
                  variant="outline"
                  className="ml-auto"
                >
                  Resolve
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Notes List */}
        <div className="flex-1 overflow-hidden">
          <ScrollArea className="h-full">
            <div className="p-4 space-y-3">
              {notes.map((note) => (
                <Card key={note.id} className="p-3 bg-card hover:bg-muted/30 transition-colors">
                  <div className="space-y-2">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium text-sm text-foreground">{note.title}</h4>
                        <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                          {note.content}
                        </p>
                      </div>
                      <div className="flex items-center gap-1 ml-2">
                        <Switch
                          checked={note.isAutoSync}
                          onCheckedChange={() => toggleNoteAutoSync(note.id)}
                          size="sm"
                        />
                        <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                          <Edit3 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex flex-wrap gap-1">
                        {note.tags.slice(0, 3).map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                        {note.tags.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{note.tags.length - 3}
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Clock className="w-3 h-3" />
                        {note.updatedAt.toLocaleTimeString()}
                        {note.libraryEntryId && (
                          <Badge variant="outline" className="text-xs">
                            <Sync className="w-2 h-2 mr-1" />
                            Synced
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </div>
      </Card>

      {/* Digital Library Panel */}
      <Card className="shadow-medium h-full flex flex-col">
        <div className="p-4 border-b">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-highlight" />
            <div>
              <h3 className="font-semibold text-foreground">Digital Library</h3>
              <p className="text-xs text-muted-foreground">{libraryEntries.length} entries</p>
            </div>
          </div>
        </div>

        {/* Library Entries */}
        <div className="flex-1 overflow-hidden">
          <ScrollArea className="h-full">
            <div className="p-4 space-y-3">
              {libraryEntries.map((entry) => (
                <Card key={entry.id} className="p-3 bg-card hover:bg-muted/30 transition-colors">
                  <div className="space-y-2">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium text-sm text-foreground">{entry.title}</h4>
                        <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                          {entry.snippet}
                        </p>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {entry.wordCount} words
                      </Badge>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex flex-wrap gap-1">
                        {entry.tags.slice(0, 3).map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            <Tag className="w-2 h-2 mr-1" />
                            {tag}
                          </Badge>
                        ))}
                        {entry.tags.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{entry.tags.length - 3}
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Clock className="w-3 h-3" />
                        {entry.lastModified.toLocaleTimeString()}
                        {entry.noteId && (
                          <Badge variant="outline" className="text-xs">
                            <Sync className="w-2 h-2 mr-1" />
                            Linked
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
              
              {libraryEntries.length === 0 && (
                <div className="text-center py-8">
                  <BookOpen className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">No library entries yet</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Create notes with auto-sync enabled to populate the library
                  </p>
                </div>
              )}
            </div>
          </ScrollArea>
        </div>
      </Card>

      {/* Create Note Dialog */}
      <Dialog open={isCreatingNote} onOpenChange={setIsCreatingNote}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Create New Note</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="Note title..."
              value={newNote.title}
              onChange={(e) => setNewNote(prev => ({ ...prev, title: e.target.value }))}
            />
            <Textarea
              placeholder="Write your note here..."
              value={newNote.content}
              onChange={(e) => setNewNote(prev => ({ ...prev, content: e.target.value }))}
              className="min-h-[120px]"
            />
            <Input
              placeholder="Tags (comma-separated)..."
              value={newNote.tags}
              onChange={(e) => setNewNote(prev => ({ ...prev, tags: e.target.value }))}
            />
            <div className="flex gap-2">
              <Button onClick={createNote} className="flex-1">
                <Save className="w-4 h-4 mr-2" />
                Create Note
              </Button>
              <Button onClick={() => setIsCreatingNote(false)} variant="outline">
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Conflict Resolution Dialog */}
      <Dialog open={!!activeConflict} onOpenChange={() => setActiveConflict(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-orange-600" />
              Sync Conflict Detected
            </DialogTitle>
          </DialogHeader>
          
          {activeConflict && (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                The note and library entry have different content. Choose how to resolve:
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="p-3">
                  <h4 className="font-medium text-sm mb-2">Note Version</h4>
                  <p className="text-xs text-muted-foreground bg-muted p-2 rounded max-h-32 overflow-y-auto">
                    {activeConflict.noteContent}
                  </p>
                </Card>
                
                <Card className="p-3">
                  <h4 className="font-medium text-sm mb-2">Library Version</h4>
                  <p className="text-xs text-muted-foreground bg-muted p-2 rounded max-h-32 overflow-y-auto">
                    {activeConflict.libraryContent}
                  </p>
                </Card>
              </div>
              
              <div className="flex gap-2">
                <Button 
                  onClick={() => resolveConflict('keepNote')}
                  variant="outline"
                  className="flex-1"
                >
                  <Check className="w-4 h-4 mr-2" />
                  Keep Note
                </Button>
                <Button 
                  onClick={() => resolveConflict('keepLibrary')}
                  variant="outline"
                  className="flex-1"
                >
                  <Check className="w-4 h-4 mr-2" />
                  Keep Library
                </Button>
                <Button 
                  onClick={() => resolveConflict('merge')}
                  className="flex-1 bg-gradient-primary"
                >
                  <Sync className="w-4 h-4 mr-2" />
                  Merge Both
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};