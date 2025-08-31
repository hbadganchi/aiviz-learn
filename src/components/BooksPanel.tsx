import { useState, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
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
  Download
} from "lucide-react";

interface Subject {
  id: string;
  name: string;
  icon: any;
  color: string;
  count: number;
}

interface BooksPanelProps {
  className?: string;
}

export const BooksPanel = ({ className }: BooksPanelProps) => {
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  
  const subjects: Subject[] = [
    { id: 'math', name: 'Mathematics', icon: Calculator, color: 'bg-blue-500', count: 12 },
    { id: 'science', name: 'Science', icon: Atom, color: 'bg-green-500', count: 8 },
    { id: 'geography', name: 'Geography', icon: Globe, color: 'bg-yellow-500', count: 6 },
    { id: 'history', name: 'History', icon: Users, color: 'bg-red-500', count: 10 },
    { id: 'art', name: 'Art', icon: Palette, color: 'bg-purple-500', count: 4 },
    { id: 'music', name: 'Music', icon: Music, color: 'bg-pink-500', count: 3 },
    { id: 'health', name: 'Health', icon: Heart, color: 'bg-orange-500', count: 5 }
  ];

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check file type
    const allowedTypes = ['application/pdf', 'application/epub+zip', 'text/plain'];
    if (!allowedTypes.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Please upload PDF, EPUB, or TXT files only.",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);
    try {
      const fileName = `${selectedSubject}/${Date.now()}_${file.name}`;
      const { data, error } = await supabase.storage
        .from('books')
        .upload(fileName, file);

      if (error) throw error;

      toast({
        title: "Book uploaded successfully",
        description: `${file.name} has been added to your library.`,
      });
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Upload failed",
        description: "There was an error uploading your book.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDownload = async (bookTitle: string) => {
    try {
      // This is a mock implementation - in real app, you'd have actual file paths
      toast({
        title: "Download started",
        description: `Downloading ${bookTitle}...`,
      });
    } catch (error) {
      console.error('Download error:', error);
      toast({
        title: "Download failed",
        description: "There was an error downloading the book.",
        variant: "destructive",
      });
    }
  };

  const books = {
    math: [
      { title: 'Algebra Basics', pages: 120, progress: 45 },
      { title: 'Geometry Fundamentals', pages: 95, progress: 78 },
      { title: 'Calculus Introduction', pages: 180, progress: 23 }
    ],
    science: [
      { title: 'Chemistry Lab', pages: 150, progress: 67 },
      { title: 'Physics Concepts', pages: 200, progress: 34 },
      { title: 'Biology Study Guide', pages: 175, progress: 89 }
    ],
    // ... other subjects would have their books
  };

  return (
    <Card className={`shadow-medium ${className}`}>
      <div className="p-4 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <BookOpen className="w-4 h-4 text-primary-foreground" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Digital Library</h3>
              <p className="text-xs text-muted-foreground">Organize by subjects</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="interactive"
              onClick={() => fileInputRef.current?.click()}
              disabled={!selectedSubject || uploading}
            >
              <Upload className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm" className="interactive">
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <Separator />

        {!selectedSubject ? (
          /* Subject Selection */
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-foreground">Subjects</h4>
            <div className="grid grid-cols-1 gap-2">
              {subjects.map((subject) => {
                const Icon = subject.icon;
                return (
                  <Button
                    key={subject.id}
                    variant="outline"
                    className="interactive justify-between h-auto p-3"
                    onClick={() => setSelectedSubject(subject.id)}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-6 h-6 ${subject.color} rounded-md flex items-center justify-center`}>
                        <Icon className="w-3 h-3 text-white" />
                      </div>
                      <div className="text-left">
                        <p className="text-sm font-medium">{subject.name}</p>
                        <p className="text-xs text-muted-foreground">{subject.count} books</p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
                  </Button>
                );
              })}
            </div>
          </div>
        ) : (
          /* Books in Selected Subject */
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setSelectedSubject(null)}
                className="text-muted-foreground hover:text-foreground"
              >
                ← Back to Subjects
              </Button>
            </div>
            
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-foreground">
                {subjects.find(s => s.id === selectedSubject)?.name} Books
              </h4>
              
              {books[selectedSubject as keyof typeof books]?.map((book, index) => (
                <Card key={index} className="p-3 bg-muted/50 hover:bg-muted/70 transition-colors">
                  <div className="space-y-2">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="text-sm font-medium">{book.title}</p>
                        <p className="text-xs text-muted-foreground">{book.pages} pages</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleDownload(book.title)}
                          className="h-8 w-8 p-0"
                        >
                          <Download className="w-3 h-3" />
                        </Button>
                        <Badge variant="secondary" className="text-xs">
                          {book.progress}%
                        </Badge>
                      </div>
                    </div>
                    <div className="w-full bg-muted rounded-full h-1.5">
                      <div 
                        className="bg-gradient-primary h-1.5 rounded-full transition-all duration-300" 
                        style={{ width: `${book.progress}%` }}
                      ></div>
                    </div>
                  </div>
                </Card>
              )) || (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No books available for this subject
                </p>
              )}
            </div>
          </div>
        )}
        
        <Input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.epub,.txt"
          onChange={handleFileUpload}
          className="hidden"
        />
      </div>
    </Card>
  );
};
