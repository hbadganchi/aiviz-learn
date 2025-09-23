import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { NotesSection } from "@/components/NotesSection";
import { PeriodicTable } from "@/components/PeriodicTable";
import { ScientificCalculator } from "@/components/ScientificCalculator";
import { AIImageGenerator } from "@/components/AIImageGenerator";
import { 
  StickyNote,
  Atom,
  Calculator, 
  Wand2, 
} from "lucide-react";

interface UnifiedToolsPanelProps {
  className?: string;
  transcribedText: string;
  generatedImages: string[];
  onImageGenerated: (imageUrl: string) => void;
}

export const UnifiedToolsPanel = ({ 
  className,
  transcribedText,
  generatedImages,
  onImageGenerated
}: UnifiedToolsPanelProps) => {
  return (
    <Card className={`shadow-medium h-full ${className}`}>
      <Tabs defaultValue="books" className="h-full flex flex-col">
        <div className="p-4 pb-0">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="notes" className="flex items-center gap-2">
              <StickyNote className="w-4 h-4" />
              <span className="hidden sm:inline">Notes</span>
            </TabsTrigger>
            <TabsTrigger value="periodic" className="flex items-center gap-2">
              <Atom className="w-4 h-4" />
              <span className="hidden sm:inline">Elements</span>
            </TabsTrigger>
            <TabsTrigger value="calculator" className="flex items-center gap-2">
              <Calculator className="w-4 h-4" />
              <span className="hidden sm:inline">Calc</span>
            </TabsTrigger>
            <TabsTrigger value="ai" className="flex items-center gap-2">
              <Wand2 className="w-4 h-4" />
              <span className="hidden sm:inline">AI</span>
            </TabsTrigger>
          </TabsList>
        </div>
        
        <div className="flex-1 overflow-hidden">
          <TabsContent value="notes" className="h-full m-0 p-4 pt-0">
            <div className="h-full">
              <NotesSection className="h-full border-0 shadow-none" />
            </div>
          </TabsContent>
          
          <TabsContent value="periodic" className="h-full m-0 p-4 pt-0">
            <div className="h-full">
              <PeriodicTable className="h-full border-0 shadow-none" />
            </div>
          </TabsContent>
          
          <TabsContent value="calculator" className="h-full m-0 p-4 pt-0">
            <div className="h-full">
              <ScientificCalculator className="h-full border-0 shadow-none" />
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
        </div>
      </Tabs>
    </Card>
  );
};