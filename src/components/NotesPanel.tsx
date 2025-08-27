import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  StickyNote, 
  Plus, 
  Trash2, 
  Download,
  Sparkles,
  Clock
} from "lucide-react";
import { toast } from "sonner";

interface NotesPanelProps {
  notes: string[];
  onNotesChange: (notes: string[]) => void;
  transcribedText: string;
}

export const NotesPanel = ({ notes, onNotesChange, transcribedText }: NotesPanelProps) => {
  const [newNote, setNewNote] = useState('');
  const [isGeneratingNotes, setIsGeneratingNotes] = useState(false);

  const addNote = () => {
    if (newNote.trim()) {
      const timestampedNote = `📝 ${new Date().toLocaleTimeString()}: ${newNote.trim()}`;
      onNotesChange([...notes, timestampedNote]);
      setNewNote('');
      toast.success("Note added!");
    }
  };

  const removeNote = (index: number) => {
    const updatedNotes = notes.filter((_, i) => i !== index);
    onNotesChange(updatedNotes);
    toast.success("Note removed!");
  };

  const generateSmartNotes = async () => {
    if (!transcribedText.trim()) {
      toast.error("No speech text to generate notes from");
      return;
    }

    setIsGeneratingNotes(true);
    
    // Simulate AI note generation
    setTimeout(() => {
      const smartNotes = [
        `🤖 ${new Date().toLocaleTimeString()}: Key Topic - ${transcribedText.substring(0, 30)}...`,
        `💡 ${new Date().toLocaleTimeString()}: Main Points from discussion`,
        `📊 ${new Date().toLocaleTimeString()}: Action Items identified`
      ];
      
      onNotesChange([...notes, ...smartNotes]);
      setIsGeneratingNotes(false);
      toast.success("Smart notes generated!");
    }, 2000);
  };

  const downloadNotes = () => {
    const notesContent = notes.join('\n\n');
    const blob = new Blob([notesContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `smartboard-notes-${new Date().toISOString().slice(0, 10)}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Notes downloaded!");
  };

  return (
    <Card className="p-4 h-96 shadow-medium flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <StickyNote className="w-5 h-5 text-primary" />
          <h3 className="font-semibold text-foreground">Smart Notes</h3>
        </div>
        <div className="flex gap-1">
          <Button
            onClick={generateSmartNotes}
            variant="outline"
            size="sm"
            disabled={isGeneratingNotes || !transcribedText}
            className="interactive"
          >
            {isGeneratingNotes ? (
              <div className="w-4 h-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            ) : (
              <Sparkles className="w-4 h-4" />
            )}
          </Button>
          <Button
            onClick={downloadNotes}
            variant="outline"
            size="sm"
            disabled={notes.length === 0}
            className="interactive"
          >
            <Download className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <Separator className="mb-4" />

      {/* Add Note */}
      <div className="space-y-2 mb-4">
        <Textarea
          placeholder="Add a note or observation..."
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          className="min-h-[60px] resize-none"
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              addNote();
            }
          }}
        />
        <Button
          onClick={addNote}
          disabled={!newNote.trim()}
          size="sm"
          className="w-full bg-gradient-accent interactive"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Note
        </Button>
      </div>

      <Separator className="mb-4" />

      {/* Notes List */}
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-2">
          <Clock className="w-4 h-4 text-muted-foreground" />
          <h4 className="text-sm font-medium text-foreground">Recent Notes ({notes.length})</h4>
        </div>
        
        <ScrollArea className="h-full">
          {notes.length === 0 ? (
            <div className="text-center py-8">
              <StickyNote className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">No notes yet</p>
              <p className="text-xs text-muted-foreground mt-1">
                Start speaking or add manual notes
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {notes.map((note, index) => (
                <Card key={index} className="p-3 bg-muted/50 hover:bg-muted transition-colors">
                  <div className="flex justify-between items-start gap-2">
                    <p className="text-sm text-foreground flex-1">{note}</p>
                    <Button
                      onClick={() => removeNote(index)}
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0 hover:bg-destructive/10 hover:text-destructive"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </ScrollArea>
      </div>
    </Card>
  );
};