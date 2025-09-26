import { useState } from "react";
import { DrawingCanvas } from "@/components/DrawingCanvas";
import { SimplifiedToolbar } from "@/components/SimplifiedToolbar";
import { FullPeriodicTable } from "@/components/FullPeriodicTable";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Moon, Sun, Download, Save, Share2 } from "lucide-react";
import { useTheme } from "next-themes";
import { toast } from "sonner";

const Index = () => {
  const [strokeColor, setStrokeColor] = useState('#3b82f6');
  const [strokeWidth, setStrokeWidth] = useState(3);
  const [showGrid, setShowGrid] = useState(false);
  const { theme, setTheme } = useTheme();

  const handleElementSelect = (element: any) => {
    toast.success(`${element.name} added to canvas!`);
  };

  const handleSave = () => {
    toast.success("Whiteboard saved!");
  };

  const handleDownload = () => {
    toast.success("Whiteboard downloaded!");
  };

  const handleShare = () => {
    toast.success("Share link copied to clipboard!");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b shadow-soft p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-xl">W</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Whiteboard</h1>
              <p className="text-muted-foreground text-sm">Simple & Clean Drawing</p>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-muted rounded-xl p-1">
              <Button onClick={handleSave} variant="ghost" size="sm" className="rounded-lg">
                <Save className="w-4 h-4 mr-2" />
                Save
              </Button>
              <Button onClick={handleDownload} variant="ghost" size="sm" className="rounded-lg">
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
              <Button onClick={handleShare} variant="ghost" size="sm" className="rounded-lg">
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
            </div>
            
            <Button
              variant="outline"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="relative"
            >
              <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-4">
        <div className="grid grid-cols-12 gap-6 h-[calc(100vh-140px)]">
          {/* Left Sidebar - Drawing Tools */}
          <div className="col-span-2">
            <SimplifiedToolbar
              strokeColor={strokeColor}
              onStrokeColorChange={setStrokeColor}
              strokeWidth={strokeWidth}
              onStrokeWidthChange={setStrokeWidth}
              showGrid={showGrid}
              onToggleGrid={() => setShowGrid(!showGrid)}
            />
          </div>

          {/* Main Canvas Area */}
          <div className="col-span-7">
            <Card className={`h-full shadow-medium overflow-hidden relative ${showGrid ? 'canvas-grid' : ''}`}>
              <DrawingCanvas 
                currentTool="pen"
                className="w-full h-full"
              />
            </Card>
          </div>

          {/* Right Sidebar - Periodic Table */}
          <div className="col-span-3">
            <FullPeriodicTable
              onElementSelect={handleElementSelect}
              className="h-full"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;