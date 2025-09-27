import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { 
  FileText, 
  Image, 
  FileIcon, 
  X, 
  Download, 
  Heart, 
  Star,
  Eye,
  Clock,
  Tag
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

interface NotePreviewProps {
  note: Note | null;
  onClose: () => void;
  onDownload: (note: Note) => void;
  onToggleFavorite: (noteId: string) => void;
  onUpdateProgress: (noteId: string, progress: number) => void;
}

export const NotePreview = ({ 
  note, 
  onClose, 
  onDownload, 
  onToggleFavorite,
  onUpdateProgress 
}: NotePreviewProps) => {
  const [currentProgress, setCurrentProgress] = useState(note?.progress || 0);

  if (!note) return null;

  const getFileIcon = (fileType?: string) => {
    if (!fileType) return FileIcon;
    
    if (fileType.startsWith('image/')) return Image;
    if (fileType === 'application/pdf') return FileText;
    if (fileType === 'text/plain') return FileText;
    return FileIcon;
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return 'Unknown size';
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleProgressUpdate = (newProgress: number) => {
    setCurrentProgress(newProgress);
    onUpdateProgress(note.id, newProgress);
  };

  const FileIcon = getFileIcon(note.file_type);

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-elegant">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4 flex-1">
            <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center flex-shrink-0">
              <FileIcon className="w-6 h-6 text-primary-foreground" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold text-foreground truncate">{note.title}</h3>
              {note.description && (
                <p className="text-sm text-muted-foreground mt-1">{note.description}</p>
              )}
              <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  Uploaded {formatDate(note.upload_date)}
                </span>
                {note.file_size && (
                  <span>{formatFileSize(note.file_size)}</span>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onToggleFavorite(note.id)}
              className={note.is_favorite ? "text-yellow-500" : "text-muted-foreground"}
            >
              {note.is_favorite ? <Star className="w-4 h-4 fill-current" /> : <Heart className="w-4 h-4" />}
            </Button>
            <Button variant="ghost" size="sm" onClick={() => onDownload(note)}>
              <Download className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <Separator />

        {/* Tags */}
        {note.tags && note.tags.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Tag className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium">Tags</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {note.tags.map((tag, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Progress */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Reading Progress</span>
            <span className="text-sm text-muted-foreground">{currentProgress}%</span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div 
              className="bg-gradient-primary h-2 rounded-full transition-all duration-300" 
              style={{ width: `${currentProgress}%` }}
            />
          </div>
          <div className="flex gap-2">
            {[0, 25, 50, 75, 100].map((progress) => (
              <Button
                key={progress}
                variant={currentProgress === progress ? "default" : "outline"}
                size="sm"
                onClick={() => handleProgressUpdate(progress)}
                className="text-xs"
              >
                {progress}%
              </Button>
            ))}
          </div>
        </div>

        <Separator />

        {/* AI Summary */}
        {note.ai_summary && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 bg-gradient-primary rounded-md flex items-center justify-center">
                <Star className="w-3 h-3 text-primary-foreground" />
              </div>
              <span className="text-sm font-medium">AI Summary</span>
            </div>
            <Card className="p-4 bg-muted/50">
              <p className="text-sm text-foreground leading-relaxed">{note.ai_summary}</p>
            </Card>
          </div>
        )}

        {/* Content Preview */}
        {note.content_preview && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium">Content Preview</span>
            </div>
            <ScrollArea className="h-48">
              <Card className="p-4 bg-muted/30">
                <pre className="text-sm text-foreground whitespace-pre-wrap font-mono leading-relaxed">
                  {note.content_preview}
                </pre>
              </Card>
            </ScrollArea>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3 pt-4">
          <Button 
            className="flex-1" 
            onClick={() => onDownload(note)}
          >
            <Download className="w-4 h-4 mr-2" />
            Download
          </Button>
          <Button 
            variant="outline" 
            className="px-6"
            onClick={() => handleProgressUpdate(100)}
          >
            Mark as Complete
          </Button>
        </div>
      </div>
    </Card>
  );
};