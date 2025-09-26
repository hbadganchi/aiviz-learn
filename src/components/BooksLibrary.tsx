import { useState, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { 
  BookOpen, 
  Upload, 
  Search, 
  Download,
  Trash2,
  Eye,
  Plus,
  File,
  FileText
} from "lucide-react";
import { toast } from "sonner";

interface Book {
  id: string;
  title: string;
  author: string;
  subject: string;
  pages: number;
  uploadDate: Date;
  fileSize: string;
  content?: string;
  type: 'pdf' | 'txt' | 'epub';
}

interface BooksLibraryProps {
  className?: string;
}

export const BooksLibrary = ({ className }: BooksLibraryProps) => {
  const [books, setBooks] = useState<Book[]>([
    {
      id: '1',
      title: 'Introduction to Chemistry',
      author: 'Dr. Sarah Johnson',
      subject: 'Chemistry',
      pages: 245,
      uploadDate: new Date('2024-01-15'),
      fileSize: '12.5 MB',
      type: 'pdf'
    },
    {
      id: '2',
      title: 'Advanced Mathematics',
      author: 'Prof. Michael Chen',
      subject: 'Mathematics',
      pages: 320,
      uploadDate: new Date('2024-01-20'),
      fileSize: '8.2 MB',
      type: 'pdf'
    },
    {
      id: '3',
      title: 'World History Timeline',
      author: 'Emma Rodriguez',
      subject: 'History',
      pages: 180,
      uploadDate: new Date('2024-01-25'),
      fileSize: '15.1 MB',
      type: 'epub'
    }
  ]);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('All');
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [isReaderOpen, setIsReaderOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const subjects = ['All', 'Mathematics', 'Chemistry', 'Physics', 'History', 'Literature', 'Biology'];

  const filteredBooks = books.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         book.subject.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSubject = selectedSubject === 'All' || book.subject === selectedSubject;
    return matchesSearch && matchesSubject;
  });

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const newBook: Book = {
          id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
          title: file.name.replace(/\.[^/.]+$/, ""),
          author: 'Unknown Author',
          subject: 'General',
          pages: Math.floor(Math.random() * 300) + 50,
          uploadDate: new Date(),
          fileSize: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
          content: e.target?.result as string,
          type: file.type.includes('pdf') ? 'pdf' : file.type.includes('epub') ? 'epub' : 'txt'
        };
        
        setBooks(prev => [newBook, ...prev]);
        toast.success(`"${newBook.title}" uploaded successfully!`);
      };
      
      if (file.type === 'text/plain') {
        reader.readAsText(file);
      } else {
        reader.readAsDataURL(file);
      }
    });
  };

  const deleteBook = (bookId: string) => {
    setBooks(prev => prev.filter(book => book.id !== bookId));
    toast.success("Book deleted successfully!");
  };

  const openBook = (book: Book) => {
    setSelectedBook(book);
    setIsReaderOpen(true);
    toast.info(`Opening "${book.title}"`);
  };

  const downloadBook = (book: Book) => {
    // Simulate download
    toast.success(`"${book.title}" download started!`);
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'pdf':
        return <File className="w-4 h-4 text-red-500" />;
      case 'epub':
        return <BookOpen className="w-4 h-4 text-blue-500" />;
      default:
        return <FileText className="w-4 h-4 text-green-500" />;
    }
  };

  return (
    <>
      <Card className={`shadow-medium h-full flex flex-col ${className}`}>
        <div className="p-4 space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-highlight rounded-lg flex items-center justify-center">
                <BookOpen className="w-4 h-4 text-highlight-foreground" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Books Library</h3>
                <p className="text-xs text-muted-foreground">Digital book collection</p>
              </div>
            </div>
            <Button
              onClick={() => fileInputRef.current?.click()}
              size="sm"
              className="bg-gradient-highlight interactive"
            >
              <Upload className="w-4 h-4 mr-2" />
              Upload
            </Button>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search books..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Subject Filter */}
          <div className="flex flex-wrap gap-1">
            {subjects.slice(0, 4).map((subject) => (
              <Button
                key={subject}
                onClick={() => setSelectedSubject(subject)}
                variant={selectedSubject === subject ? "default" : "outline"}
                size="sm"
                className={`interactive text-xs h-7 px-2 ${selectedSubject === subject ? 'bg-gradient-highlight' : ''}`}
              >
                {subject}
              </Button>
            ))}
          </div>

          <Separator />
        </div>

        {/* Books List */}
        <div className="flex-1 overflow-hidden">
          <ScrollArea className="h-full px-4">
            {filteredBooks.length === 0 ? (
              <div className="text-center py-8">
                <BookOpen className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">No books found</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Upload books or adjust your search
                </p>
              </div>
            ) : (
              <div className="space-y-3 pb-4">
                {filteredBooks.map((book) => (
                  <Card key={book.id} className="p-3 bg-card hover:bg-muted/30 transition-colors">
                    <div className="space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            {getFileIcon(book.type)}
                            <h4 className="font-medium text-sm text-foreground truncate">
                              {book.title}
                            </h4>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            by {book.author}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="secondary" className="text-xs">
                              {book.subject}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {book.pages} pages
                            </span>
                          </div>
                        </div>
                        <div className="flex gap-1">
                          <Button
                            onClick={() => openBook(book)}
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0"
                            title="Read book"
                          >
                            <Eye className="w-3 h-3" />
                          </Button>
                          <Button
                            onClick={() => downloadBook(book)}
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0"
                            title="Download book"
                          >
                            <Download className="w-3 h-3" />
                          </Button>
                          <Button
                            onClick={() => deleteBook(book.id)}
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0 hover:text-destructive"
                            title="Delete book"
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                      <div className="flex justify-between items-center text-xs text-muted-foreground">
                        <span>{book.uploadDate.toLocaleDateString()}</span>
                        <span>{book.fileSize}</span>
                      </div>
                    </div>
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
          accept=".pdf,.txt,.epub,.mobi"
          multiple
          onChange={handleFileUpload}
          className="hidden"
        />
      </Card>

      {/* Book Reader Dialog */}
      <Dialog open={isReaderOpen} onOpenChange={setIsReaderOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              {selectedBook && getFileIcon(selectedBook.type)}
              <div>
                <h3 className="text-xl font-bold">{selectedBook?.title}</h3>
                <p className="text-sm text-muted-foreground">by {selectedBook?.author}</p>
              </div>
            </DialogTitle>
          </DialogHeader>
          
          {selectedBook && (
            <div className="space-y-4">
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <Badge variant="secondary">{selectedBook.subject}</Badge>
                <span>{selectedBook.pages} pages</span>
                <span>{selectedBook.fileSize}</span>
              </div>
              
              <Separator />
              
              <ScrollArea className="h-96">
                <div className="p-4 bg-muted/20 rounded-lg">
                  {selectedBook.content ? (
                    <div className="whitespace-pre-wrap text-sm leading-relaxed">
                      {selectedBook.content.substring(0, 2000)}
                      {selectedBook.content.length > 2000 && '...'}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">
                        Book reader preview - Full content would be displayed here
                      </p>
                      <p className="text-sm text-muted-foreground mt-2">
                        This is a demo of the book reading interface
                      </p>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};