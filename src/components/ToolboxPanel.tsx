import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { 
  Pen, 
  Eraser, 
  Square, 
  Circle, 
  Triangle,
  Type,
  Highlighter,
  Ruler,
  Move,
  Mic
} from "lucide-react";

interface ToolboxPanelProps {
  currentTool: 'pen' | 'eraser' | 'shapes' | 'mic';
  onToolChange: (tool: 'pen' | 'eraser' | 'shapes' | 'mic') => void;
}

export const ToolboxPanel = ({ currentTool, onToolChange }: ToolboxPanelProps) => {
  const tools = [
    {
      id: 'pen' as const,
      name: 'Pen',
      icon: Pen,
      description: 'Draw freehand'
    },
    {
      id: 'eraser' as const,
      name: 'Eraser', 
      icon: Eraser,
      description: 'Remove drawings'
    },
    {
      id: 'shapes' as const,
      name: 'Shapes',
      icon: Square,
      description: 'Draw shapes'
    },
    {
      id: 'mic' as const,
      name: 'Voice Tool',
      icon: Mic,
      description: 'Audio recording & speech'
    }
  ];

  const shapes = [
    { name: 'Rectangle', icon: Square },
    { name: 'Circle', icon: Circle },
    { name: 'Triangle', icon: Triangle }
  ];

  const utilities = [
    { name: 'Text', icon: Type },
    { name: 'Highlighter', icon: Highlighter },
    { name: 'Ruler', icon: Ruler },
    { name: 'Move', icon: Move }
  ];

  return (
    <Card className="p-4 h-full shadow-medium">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h3 className="font-semibold text-foreground mb-1">Drawing Tools</h3>
          <p className="text-xs text-muted-foreground">Select a tool to start drawing</p>
        </div>

        <Separator />

        {/* Main Tools */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-foreground">Main Tools</h4>
          <div className="grid gap-2">
            {tools.map((tool) => {
              const Icon = tool.icon;
              const isActive = currentTool === tool.id;
              
              return (
                <Button
                  key={tool.id}
                  onClick={() => onToolChange(tool.id)}
                  variant={isActive ? "default" : "outline"}
                  className={`
                    justify-start h-12 interactive
                    ${isActive 
                      ? 'bg-gradient-primary text-primary-foreground tool-active' 
                      : 'hover:bg-secondary'
                    }
                  `}
                >
                  <Icon className="w-4 h-4 mr-3" />
                  <div className="text-left">
                    <div className="font-medium">{tool.name}</div>
                    <div className="text-xs opacity-70">{tool.description}</div>
                  </div>
                </Button>
              );
            })}
          </div>
        </div>

        <Separator />

        {/* Utilities */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-foreground">Utilities</h4>
          <div className="grid grid-cols-2 gap-2">
            {utilities.map((utility) => {
              const Icon = utility.icon;
              return (
                <Button
                  key={utility.name}
                  variant="outline"
                  size="sm"
                  className="interactive hover:bg-secondary"
                  title={utility.name}
                >
                  <Icon className="w-4 h-4" />
                </Button>
              );
            })}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-auto pt-4">
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full interactive hover:bg-highlight hover:text-highlight-foreground"
          >
            Save Drawing
          </Button>
        </div>
      </div>
    </Card>
  );
};