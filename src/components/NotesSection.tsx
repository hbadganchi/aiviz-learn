import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { StickyNote, Plus, Trash2, Download, Upload, Edit3, Pin, PinOff, Save, X, FileText, File as FilePdf } from "lucide-react";
import { toast } from "sonner";

interface Note {
  id: string;
  title: string;
  content: string;
  isPinned: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface NotesSectionProps {
  className?: string;
}

export const NotesSection = ({ className }: NotesSectionProps) => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [editingNote, setEditingNote] = useState<string | null>(null);
  const [newNoteTitle, setNewNoteTitle] = useState('');
  const [newNoteContent, setNewNoteContent] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const createNote = () => {
    if (!newNoteTitle.trim() || !newNoteContent.trim()) {
      toast.error("Please enter both title and content");
      return;
    }

    const newNote: Note = {
      id: Date.now().toString(),
      title: newNoteTitle.trim(),
      content: newNoteContent.trim(),
      isPinned: false,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    setNotes(prev => [newNote, ...prev]);
    setNewNoteTitle('');
    setNewNoteContent('');
    setIsCreating(false);
    toast.success("Note created successfully!");
  };

  const updateNote = (id: string, updates: Partial<Note>) => {
    setNotes(prev => prev.map(note => 
      note.id === id 
        ? { ...note, ...updates, updatedAt: new Date() }
        : note
    ));
    setEditingNote(null);
    toast.success("Note updated!");
  };

  const deleteNote = (id: string) => {
    setNotes(prev => prev.filter(note => note.id !== id));
    toast.success("Note deleted!");
  };

  const togglePin = (id: string) => {
    setNotes(prev => prev.map(note => 
      note.id === id 
        ? { ...note, isPinned: !note.isPinned, updatedAt: new Date() }
        : note
    ));
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      const newNote: Note = {
        id: Date.now().toString(),
        title: file.name.replace(/\.[^/.]+$/, ""),
        content: content,
        isPinned: false,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      setNotes(prev => [newNote, ...prev]);
      toast.success("File uploaded successfully!");
    };
    
    if (file.type === 'text/plain') {
      reader.readAsText(file);
    } else {
      toast.error("Only text files are supported for upload");
    }
  };

  const downloadAllNotes = (format: 'txt' | 'pdf') => {
    if (notes.length === 0) {
      toast.error("No notes to download");
      return;
    }

    const content = notes.map(note => 
      `${note.title}\n${'='.repeat(note.title.length)}\n${note.content}\n\n`
    ).join('');

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `smart-board-notes.${format}`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success(`Notes downloaded as ${format.toUpperCase()}!`);
  };

  const sortedNotes = [...notes].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return b.updatedAt.getTime() - a.updatedAt.getTime();
  });

  return (
    <Card className={`shadow-medium h-full flex flex-col ${className}`}>
      <div className="p-4 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <StickyNote className="w-4 h-4 text-primary-foreground" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Smart Notes</h3>
              <p className="text-xs text-muted-foreground">Create and manage notes</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={() => fileInputRef.current?.click()}
              variant="outline"
              size="sm"
              className="interactive"
            >
              <Upload className="w-4 h-4" />
            </Button>
            <Button
              onClick={() => setIsCreating(true)}
              variant="outline"
              size="sm"
              className="interactive"
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <Separator />

        {/* Download Options */}
        <div className="flex gap-2">
          <Button
            onClick={() => downloadAllNotes('txt')}
            variant="outline"
            size="sm"
            className="flex-1 interactive"
            disabled={notes.length === 0}
          >
            <FileText className="w-4 h-4 mr-2" />
            Export TXT
          </Button>
          <Button
            onClick={() => downloadAllNotes('pdf')}
            variant="outline"
            size="sm"
            className="flex-1 interactive"
            disabled={notes.length === 0}
          >
            <FilePdf className="w-4 h-4 mr-2" />
            Export PDF
          </Button>
        </div>

        {/* Create New Note */}
        {isCreating && (
          <Card className="p-3 bg-muted/50">
            <div className="space-y-3">
              <Input
                placeholder="Note title..."
                value={newNoteTitle}
                onChange={(e) => setNewNoteTitle(e.target.value)}
                className="text-sm"
              />
              <Textarea
                placeholder="Write your note here..."
                value={newNoteContent}
                onChange={(e) => setNewNoteContent(e.target.value)}
                className="min-h-[100px] text-sm resize-none"
              />
              <div className="flex gap-2">
                <Button
                  onClick={createNote}
                  size="sm"
                  className="bg-gradient-accent interactive"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save
                </Button>
                <Button
                  onClick={() => {
                    setIsCreating(false);
                    setNewNoteTitle('');
                    setNewNoteContent('');
                  }}
                  variant="outline"
                  size="sm"
                  className="interactive"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>
        )}
      </div>

      {/* Notes List */}
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full px-4">
          {sortedNotes.length === 0 ? (
            <div className="text-center py-8">
              <StickyNote className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">No notes yet</p>
              <p className="text-xs text-muted-foreground mt-1">
                Create your first note or upload a file
              </p>
            </div>
          ) : (
            <div className="space-y-3 pb-4">
              {sortedNotes.map((note) => (
                <Card key={note.id} className="p-3 bg-card hover:bg-muted/30 transition-colors">
                  {editingNote === note.id ? (
                    <EditNoteForm
                      note={note}
                      onSave={(updates) => updateNote(note.id, updates)}
                      onCancel={() => setEditingNote(null)}
                    />
                  ) : (
                    <div className="space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium text-sm text-foreground truncate">
                              {note.title}
                            </h4>
                            {note.isPinned && (
                              <Badge variant="secondary" className="text-xs">
                                <Pin className="w-3 h-3" />
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {note.updatedAt.toLocaleDateString()} • {note.updatedAt.toLocaleTimeString()}
                          </p>
                        </div>
                        <div className="flex gap-1">
                          <Button
                            onClick={() => togglePin(note.id)}
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0"
                          >
                            {note.isPinned ? (
                              <PinOff className="w-3 h-3" />
                            ) : (
                              <Pin className="w-3 h-3" />
                            )}
                          </Button>
                          <Button
                            onClick={() => setEditingNote(note.id)}
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0"
                          >
                            <Edit3 className="w-3 h-3" />
                          </Button>
                          <Button
                            onClick={() => deleteNote(note.id)}
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0 hover:text-destructive"
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                      <p className="text-sm text-foreground line-clamp-3">
                        {note.content}
                      </p>
                    </div>
                  )}
                </Card>
              ))}
            </div>
          )}
        </ScrollArea>
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".txt,.md"
        onChange={handleFileUpload}
        className="hidden"
      />
    </Card>
  );
};

interface EditNoteFormProps {
  note: Note;
  onSave: (updates: Partial<Note>) => void;
  onCancel: () => void;
}

const EditNoteForm = ({ note, onSave, onCancel }: EditNoteFormProps) => {
  const [title, setTitle] = useState(note.title);
  const [content, setContent] = useState(note.content);

  const handleSave = () => {
    if (!title.trim() || !content.trim()) {
      toast.error("Please enter both title and content");
      return;
    }
    onSave({ title: title.trim(), content: content.trim() });
  };

  return (
    <div className="space-y-3">
      <Input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="text-sm"
      />
      <Textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="min-h-[100px] text-sm resize-none"
      />
      <div className="flex gap-2">
        <Button
          onClick={handleSave}
          size="sm"
          className="bg-gradient-accent interactive"
        >
          <Save className="w-4 h-4 mr-2" />
          Save
        </Button>
        <Button
          onClick={onCancel}
          variant="outline"
          size="sm"
          className="interactive"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};