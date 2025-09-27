import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Pen, Eraser, Mic, Lock, Clock as Unlock, Grid3x3 as Grid3X3 } from "lucide-react";

interface QuickToolsPanelProps {
  currentTool: 'pen' | 'eraser' | 'mic';
  onToolChange: (tool: 'pen' | 'eraser' | 'mic') => void;
  isLocked: boolean;
  onToggleLock: () => void;
  showGrid: boolean;
  onToggleGrid: () => void;
}

export const QuickToolsPanel = ({ 
  currentTool, 
  onToolChange, 
  isLocked, 
  onToggleLock,
  showGrid,
  onToggleGrid 
}: QuickToolsPanelProps) => {
  const [startTime] = useState(Date.now());

  const quickTools = [
    { id: 'pen', icon: Pen, label: 'Pen Tool', shortcut: 'P' },
    { id: 'eraser', icon: Eraser, label: 'Eraser', shortcut: 'E' },
    { id: 'mic', icon: Mic, label: 'Voice Tool', shortcut: 'M' }
  ];

  const handleToolClick = (toolId: string) => {
    const responseTime = Date.now() - startTime;
    console.log(`Tool response time: ${responseTime}ms`); // Performance monitoring
    
    if (responseTime > 100) {
      console.warn('Tool response exceeded 100ms threshold');
    }
    
    onToolChange(toolId as 'pen' | 'eraser' | 'mic');
  };

  return (
    <div className="bg-card border rounded-2xl shadow-medium p-3">
      <div className="flex flex-wrap gap-2">
        {quickTools.map((tool) => {
          const Icon = tool.icon;
          const isActive = currentTool === tool.id;
          
          return (
            <Tooltip key={tool.id}>
              <TooltipTrigger asChild>
                <Button
                  variant={isActive ? "default" : "outline"}
                  size="icon"
                  className={`
                    w-10 h-10 rounded-xl transition-all duration-75
                    ${isActive 
                      ? 'bg-gradient-primary text-primary-foreground shadow-soft scale-105' 
                      : 'hover:bg-accent hover:text-accent-foreground hover:scale-105'
                    }
                    active:scale-95
                  `}
                  onClick={() => handleToolClick(tool.id)}
                  aria-label={tool.label}
                >
                  <Icon className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="bg-popover text-popover-foreground">
                <div className="text-center">
                  <p className="font-medium">{tool.label}</p>
                  <p className="text-xs text-muted-foreground">Press {tool.shortcut}</p>
                </div>
              </TooltipContent>
            </Tooltip>
          );
        })}
        
        {/* Special Tools */}
        <div className="w-px h-8 bg-border mx-1" />
        
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="w-10 h-10 rounded-xl transition-all duration-75 hover:scale-105 active:scale-95"
              onClick={onToggleLock}
              aria-label={isLocked ? "Unlock Layer" : "Lock Layer"}
            >
              {isLocked ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom">
            <p>{isLocked ? "Unlock Layer" : "Lock Layer"} (L)</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant={showGrid ? "default" : "outline"}
              size="icon"
              className={`
                w-10 h-10 rounded-xl transition-all duration-75 hover:scale-105 active:scale-95
                ${showGrid ? 'bg-gradient-accent text-accent-foreground' : ''}
              `}
              onClick={onToggleGrid}
              aria-label="Toggle Grid"
            >
              <Grid3X3 className="w-4 h-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom">
            <p>Toggle Grid (Ctrl+G)</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </div>
  );
};