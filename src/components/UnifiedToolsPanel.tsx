import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BooksPanel } from "@/components/BooksPanel";
import { AccessoriesPanel } from "@/components/AccessoriesPanel";
import { AIImageGenerator } from "@/components/AIImageGenerator";
import { NotesPanel } from "@/components/NotesPanel";
import { 
  BookOpen, 
  Calculator, 
  Wand2, 
  StickyNote 
} from "lucide-react";

interface UnifiedToolsPanelProps {
  className?: string;
  transcribedText: string;
  notes: string[];
  onNotesChange: (notes: string[]) => void;
  generatedImages: string[];
  onImageGenerated: (imageUrl: string) => void;
}

export const UnifiedToolsPanel = ({ 
  className,
  transcribedText,
  notes,
  onNotesChange,
  generatedImages,
  onImageGenerated
}: UnifiedToolsPanelProps) => {
  return (
    <Card className={`shadow-medium h-full ${className}`}>
      <Tabs defaultValue="books" className="h-full flex flex-col">
        <div className="p-4 pb-0">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="books" className="flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              <span className="hidden sm:inline">Books</span>
            </TabsTrigger>
            <TabsTrigger value="tools" className="flex items-center gap-2">
              <Calculator className="w-4 h-4" />
              <span className="hidden sm:inline">Tools</span>
            </TabsTrigger>
            <TabsTrigger value="ai" className="flex items-center gap-2">
              <Wand2 className="w-4 h-4" />
              <span className="hidden sm:inline">AI</span>
            </TabsTrigger>
            <TabsTrigger value="notes" className="flex items-center gap-2">
              <StickyNote className="w-4 h-4" />
              <span className="hidden sm:inline">Notes</span>
            </TabsTrigger>
          </TabsList>
        </div>
        
        <div className="flex-1 overflow-hidden">
          <TabsContent value="books" className="h-full m-0 p-4 pt-0">
            <div className="h-full">
              <BooksPanel className="h-full border-0 shadow-none" />
            </div>
          </TabsContent>
          
          <TabsContent value="tools" className="h-full m-0 p-4 pt-0">
            <div className="h-full">
              <AccessoriesPanel className="h-full border-0 shadow-none" />
            </div>
          </TabsContent>
          
          <TabsContent value="ai" className="h-full m-0 p-4 pt-0">
            <div className="h-full">
              <AIImageGenerator
                speechText={transcribedText}
                onImageGenerated={onImageGenerated}
                generatedImages={generatedImages}
              />
            </div>
          </TabsContent>
          
          <TabsContent value="notes" className="h-full m-0 p-4 pt-0">
            <div className="h-full">
              <NotesPanel
                notes={notes}
                onNotesChange={onNotesChange}
                transcribedText={transcribedText}
              />
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </Card>
  );
};