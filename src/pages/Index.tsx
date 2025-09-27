import { useState } from "react";
import { SpeechToText } from "@/components/SpeechToText";
import { DrawingCanvas } from "@/components/DrawingCanvas";
import { QuickToolsPanel } from "@/components/QuickToolsPanel";
import { MicrophoneTool } from "@/components/MicrophoneTool";
import { NotesSection } from "@/components/NotesSection";
import { ScientificCalculator } from "@/components/ScientificCalculator";
import { StopwatchWidget } from "@/components/StopwatchWidget";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Moon, Sun, Settings, Menu } from "lucide-react";
import { useTheme } from "next-themes";

const Index = () => {
  const [currentTool, setCurrentTool] = useState<'pen' | 'eraser' | 'mic'>('pen');
  const [transcribedText, setTranscribedText] = useState<string>('');
  const [isLocked, setIsLocked] = useState(false);
  const [showGrid, setShowGrid] = useState(false);
  const [activeTab, setActiveTab] = useState('notes');
  const { theme, setTheme } = useTheme();

  const handleSpeechResult = (text: string) => {
    setTranscribedText(text);
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
              variant={activeTab === 'notes' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActiveTab('notes')}
              className="rounded-lg"
            >
              Notes
            </Button>
            <Button
              variant={activeTab === 'calculator' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActiveTab('calculator')}
              className="rounded-lg"
            >
              Calculator
            </Button>
            <Button
              variant={activeTab === 'timer' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActiveTab('timer')}
              className="rounded-lg"
            >
              Timer
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
          {/* Main Canvas Area */}
          <div className="col-span-8">
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

          {/* Right Sidebar - Tools Panel */}
          <div className="col-span-4">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
              <TabsList className="grid w-full grid-cols-3 mb-4">
                <TabsTrigger value="notes">Notes</TabsTrigger>
                <TabsTrigger value="calculator">Calculator</TabsTrigger>
                <TabsTrigger value="timer">Timer</TabsTrigger>
              </TabsList>
              
              <TabsContent value="notes" className="h-full mt-0">
                <NotesSection className="h-full" />
              </TabsContent>
              
              <TabsContent value="calculator" className="h-full mt-0">
                <ScientificCalculator className="h-full" />
              </TabsContent>
              
              <TabsContent value="timer" className="h-full mt-0">
                <StopwatchWidget className="h-full" />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;