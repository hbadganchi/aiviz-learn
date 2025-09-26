import { useState } from "react";
import { SpeechToText } from "@/components/SpeechToText";
import { DrawingCanvas } from "@/components/DrawingCanvas";
import { QuickToolsPanel } from "@/components/QuickToolsPanel";
import { ExpandedToolsBox } from "@/components/ExpandedToolsBox";
import { MicrophoneTool } from "@/components/MicrophoneTool";
import { FullPeriodicTable } from "@/components/FullPeriodicTable";
import { LogTable } from "@/components/LogTable";
import { EnhancedEraserTool } from "@/components/EnhancedEraserTool";
import { SmartNotesLibrarySync } from "@/components/SmartNotesLibrarySync";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Moon, Sun, Settings, Menu } from "lucide-react";
import { useTheme } from "next-themes";

const Index = () => {
  const [currentTool, setCurrentTool] = useState<'pen' | 'eraser' | 'shapes' | 'mic'>('pen');
  const [transcribedText, setTranscribedText] = useState<string>('');
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const [isLocked, setIsLocked] = useState(false);
  const [showGrid, setShowGrid] = useState(false);
  const [eraserMode, setEraserMode] = useState<'stroke' | 'shape' | 'pixel'>('stroke');
  const [eraserSize, setEraserSize] = useState(20);
  const [activeTab, setActiveTab] = useState('tools');
  const [isLogDocked, setIsLogDocked] = useState(false);
  const { theme, setTheme } = useTheme();

  // Mock layers data for eraser tool
  const mockLayers = [
    { id: 'bg', name: 'Background', isLocked: true, isVisible: true, objects: [] },
    { id: 'main', name: 'Main Layer', isLocked: false, isVisible: true, objects: [] },
    { id: 'overlay', name: 'Overlay', isLocked: false, isVisible: true, objects: [] }
  ];

  const handleSpeechResult = (text: string) => {
    setTranscribedText(text);
  };

  const handleImageGenerated = (imageUrl: string) => {
    setGeneratedImages(prev => [...prev, imageUrl]);
  };

  const handleElementSelect = (element: any) => {
    console.log('Element selected:', element);
    // Add element to canvas logic here
  };

  const handleObjectErase = (objectId: string) => {
    console.log('Erasing object:', objectId);
    // Erase object logic here
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
          
          {/* Top Navigation */}
          <nav className="hidden md:flex items-center gap-1 bg-muted rounded-xl p-1">
            <Button
              variant={activeTab === 'tools' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActiveTab('tools')}
              className="rounded-lg"
            >
              Tools
            </Button>
            <Button
              variant={activeTab === 'notes' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActiveTab('notes')}
              className="rounded-lg"
            >
              Notes
            </Button>
            <Button
              variant={activeTab === 'library' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActiveTab('library')}
              className="rounded-lg"
            >
              Library
            </Button>
            <Button
              variant={activeTab === 'logs' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActiveTab('logs')}
              className="rounded-lg"
            >
              Logs
            </Button>
          </nav>
          
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" className="md:hidden">
              <Menu className="h-[1.2rem] w-[1.2rem]" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="relative"
            >
              <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>
            <Button variant="outline" size="icon">
              <Settings className="h-[1.2rem] w-[1.2rem]" />
            </Button>
            <SpeechToText onSpeechResult={handleSpeechResult} />
          </div>
        </div>
      </header>

      {/* Quick Tools Panel */}
      <div className="max-w-7xl mx-auto px-4 py-4">
        <QuickToolsPanel
          currentTool={currentTool}
          onToolChange={setCurrentTool}
          isLocked={isLocked}
          onToggleLock={() => setIsLocked(!isLocked)}
          showGrid={showGrid}
          onToggleGrid={() => setShowGrid(!showGrid)}
        />
      </div>

      <div className="max-w-7xl mx-auto p-4">
        <div className="grid grid-cols-12 gap-6 h-[calc(100vh-200px)]">
          {/* Left Sidebar - Tools */}
          <div className="col-span-2">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="tools">Tools</TabsTrigger>
                <TabsTrigger value="eraser">Eraser</TabsTrigger>
              </TabsList>
              
              <TabsContent value="tools" className="h-full mt-0">
                <ExpandedToolsBox
                  currentTool={currentTool}
                  onToolChange={setCurrentTool}
                  className="h-full"
                />
              </TabsContent>
              
              <TabsContent value="eraser" className="h-full mt-0">
                <EnhancedEraserTool
                  currentMode={eraserMode}
                  onModeChange={setEraserMode}
                  eraserSize={eraserSize}
                  onSizeChange={setEraserSize}
                  layers={mockLayers}
                  onObjectErase={handleObjectErase}
                  className="h-full"
                />
              </TabsContent>
            </Tabs>
          </div>

          {/* Main Canvas Area */}
          <div className="col-span-7">
            <Card className={`h-full shadow-medium overflow-hidden relative ${showGrid ? 'canvas-grid' : ''}`}>
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
              
              {/* Speech-to-Text Direct Display */}
              {transcribedText && currentTool !== 'mic' && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="text-center max-w-4xl px-8">
                    <p className="text-4xl font-bold text-foreground leading-relaxed">
                      {transcribedText}
                    </p>
                    <p className="text-muted-foreground text-lg mt-4">
                      {new Date().toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              )}
            </Card>
          </div>

          {/* Right Sidebar - Contextual Panels */}
          <div className="col-span-3">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
              <TabsList className="grid w-full grid-cols-4 mb-4">
                <TabsTrigger value="tools">Tools</TabsTrigger>
                <TabsTrigger value="notes">Notes</TabsTrigger>
                <TabsTrigger value="library">Library</TabsTrigger>
                <TabsTrigger value="logs">Logs</TabsTrigger>
              </TabsList>
              
              <TabsContent value="tools" className="h-full mt-0">
                <FullPeriodicTable
                  onElementSelect={handleElementSelect}
                  className="h-full"
                />
              </TabsContent>
              
              <TabsContent value="notes" className="h-full mt-0">
                <SmartNotesLibrarySync className="h-full" />
              </TabsContent>
              
              <TabsContent value="library" className="h-full mt-0">
                <SmartNotesLibrarySync className="h-full" />
              </TabsContent>
              
              <TabsContent value="logs" className="h-full mt-0">
                <LogTable
                  className="h-full"
                  isDocked={isLogDocked}
                  onToggleDock={() => setIsLogDocked(!isLogDocked)}
                />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
      
      {/* Docked Log Table */}
      {isLogDocked && (
        <LogTable
          isDocked={true}
          onToggleDock={() => setIsLogDocked(false)}
        />
      )}
    </div>
  );
};

export default Index;