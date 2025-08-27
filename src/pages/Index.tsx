import { useState } from "react";
import { SpeechToText } from "@/components/SpeechToText";
import { DrawingCanvas } from "@/components/DrawingCanvas";
import { ToolboxPanel } from "@/components/ToolboxPanel";
import { NotesPanel } from "@/components/NotesPanel";
import { AIImageGenerator } from "@/components/AIImageGenerator";
import { MicrophoneTool } from "@/components/MicrophoneTool";
import { Card } from "@/components/ui/card";

const Index = () => {
  const [currentTool, setCurrentTool] = useState<'pen' | 'eraser' | 'shapes' | 'mic'>('pen');
  const [transcribedText, setTranscribedText] = useState<string>('');
  const [notes, setNotes] = useState<string[]>([]);
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);

  const handleSpeechResult = (text: string) => {
    setTranscribedText(text);
    // Auto-generate notes from speech
    if (text.length > 20) {
      const newNote = `📝 ${new Date().toLocaleTimeString()}: ${text}`;
      setNotes(prev => [...prev, newNote]);
    }
  };

  const handleImageGenerated = (imageUrl: string) => {
    setGeneratedImages(prev => [...prev, imageUrl]);
  };

  return (
    <div className="min-h-screen bg-gradient-canvas">
      {/* Header */}
      <header className="bg-card border-b shadow-soft p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-xl">AI</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Smart Board</h1>
              <p className="text-muted-foreground text-sm">Interactive AI-Powered Classroom</p>
            </div>
          </div>
          
          <SpeechToText onSpeechResult={handleSpeechResult} />
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-4">
        <div className="grid grid-cols-12 gap-6 h-[calc(100vh-120px)]">
          {/* Left Sidebar - Tools */}
          <div className="col-span-2">
            <ToolboxPanel 
              currentTool={currentTool} 
              onToolChange={setCurrentTool}
            />
          </div>

          {/* Main Canvas Area */}
          <div className="col-span-7">
            <Card className="h-full shadow-medium overflow-hidden">
              {currentTool === 'mic' ? (
                <MicrophoneTool 
                  onTranscriptChange={handleSpeechResult}
                  className="w-full h-full"
                />
              ) : (
                <DrawingCanvas 
                  currentTool={currentTool}
                  className="w-full h-full"
                />
              )}
            </Card>
          </div>

          {/* Right Sidebar - AI & Notes */}
          <div className="col-span-3 space-y-4">
            <AIImageGenerator 
              speechText={transcribedText}
              onImageGenerated={handleImageGenerated}
              generatedImages={generatedImages}
            />
            
            <NotesPanel 
              notes={notes}
              onNotesChange={setNotes}
              transcribedText={transcribedText}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;