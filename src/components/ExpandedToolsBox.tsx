import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Badge } from "@/components/ui/badge";
import { 
  ChevronDown,
  ChevronRight,
  Pen,
  Highlighter,
  Eraser,
  Square,
  Circle,
  Triangle,
  Type,
  StickyNote,
  Timer,
  Atom,
  Upload,
  Download,
  Lock,
  Unlock,
  Group,
  Ungroup,
  Wand2,
  Grid3X3,
  MessageSquare,
  Palette,
  Move,
  RotateCcw,
  Copy
} from "lucide-react";

interface ToolCategory {
  id: string;
  name: string;
  icon: any;
  tools: Tool[];
  isOpen: boolean;
}

interface Tool {
  id: string;
  name: string;
  icon: any;
  shortcut?: string;
  description: string;
  isNew?: boolean;
}

interface ExpandedToolsBoxProps {
  currentTool: string;
  onToolChange: (tool: string) => void;
  className?: string;
}

export const ExpandedToolsBox = ({ currentTool, onToolChange, className }: ExpandedToolsBoxProps) => {
  const [categories, setCategories] = useState<ToolCategory[]>([
    {
      id: 'drawing',
      name: 'Drawing Tools',
      icon: Pen,
      isOpen: true,
      tools: [
        { id: 'pen', name: 'Pen', icon: Pen, shortcut: 'P', description: 'Freehand drawing' },
        { id: 'highlighter', name: 'Highlighter', icon: Highlighter, shortcut: 'H', description: 'Highlight text and objects' },
        { id: 'eraser-stroke', name: 'Stroke Eraser', icon: Eraser, shortcut: 'E', description: 'Erase entire strokes' },
        { id: 'eraser-shape', name: 'Shape Eraser', icon: Eraser, shortcut: 'Shift+E', description: 'Erase shapes only' },
        { id: 'eraser-pixel', name: 'Pixel Eraser', icon: Eraser, shortcut: 'Alt+E', description: 'Pixel-level erasing' },
        { id: 'palette', name: 'Color Palette', icon: Palette, shortcut: 'K', description: 'Choose colors' }
      ]
    },
    {
      id: 'shapes',
      name: 'Shapes & Objects',
      icon: Square,
      isOpen: false,
      tools: [
        { id: 'rectangle', name: 'Rectangle', icon: Square, shortcut: 'R', description: 'Draw rectangles' },
        { id: 'circle', name: 'Circle', icon: Circle, shortcut: 'O', description: 'Draw circles' },
        { id: 'triangle', name: 'Triangle', icon: Triangle, shortcut: 'Y', description: 'Draw triangles' },
        { id: 'text', name: 'Text', icon: Type, shortcut: 'T', description: 'Add text boxes' },
        { id: 'sticky', name: 'Sticky Notes', icon: StickyNote, shortcut: 'N', description: 'Create sticky notes' }
      ]
    },
    {
      id: 'educational',
      name: 'Educational Tools',
      icon: Atom,
      isOpen: false,
      tools: [
        { id: 'periodic', name: 'Periodic Table', icon: Atom, shortcut: 'A', description: 'Interactive periodic table' },
        { id: 'timer', name: 'Stopwatch', icon: Timer, shortcut: 'W', description: 'Time activities' },
        { id: 'ai-chat', name: 'AI Assistant', icon: MessageSquare, shortcut: 'C', description: 'Get AI help', isNew: true }
      ]
    },
    {
      id: 'organization',
      name: 'Organization',
      icon: Group,
      isOpen: false,
      tools: [
        { id: 'group', name: 'Group', icon: Group, shortcut: 'Ctrl+G', description: 'Group objects' },
        { id: 'ungroup', name: 'Ungroup', icon: Ungroup, shortcut: 'Ctrl+Shift+G', description: 'Ungroup objects' },
        { id: 'move', name: 'Move', icon: Move, shortcut: 'V', description: 'Move objects' },
        { id: 'copy', name: 'Duplicate', icon: Copy, shortcut: 'Ctrl+D', description: 'Duplicate objects' },
        { id: 'lock', name: 'Lock/Unlock', icon: Lock, shortcut: 'L', description: 'Lock layers' }
      ]
    },
    {
      id: 'advanced',
      name: 'Advanced Tools',
      icon: Wand2,
      isOpen: false,
      tools: [
        { id: 'magic', name: 'Magic Select', icon: Wand2, shortcut: 'M', description: 'AI-powered selection' },
        { id: 'grid', name: 'Grid Toggle', icon: Grid3X3, shortcut: 'Ctrl+G', description: 'Show/hide grid' },
        { id: 'upload', name: 'Upload', icon: Upload, shortcut: 'Ctrl+O', description: 'Upload files' },
        { id: 'download', name: 'Download', icon: Download, shortcut: 'Ctrl+S', description: 'Save/export' },
        { id: 'undo', name: 'Undo', icon: RotateCcw, shortcut: 'Ctrl+Z', description: 'Undo last action' }
      ]
    }
  ]);

  const toggleCategory = (categoryId: string) => {
    setCategories(prev => prev.map(cat => 
      cat.id === categoryId ? { ...cat, isOpen: !cat.isOpen } : cat
    ));
  };

  return (
    <Card className={`shadow-medium h-full flex flex-col ${className}`}>
      <div className="p-4 border-b">
        <h3 className="font-semibold text-foreground">Tools</h3>
        <p className="text-xs text-muted-foreground">Expanded toolbox</p>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        {categories.map((category) => {
          const CategoryIcon = category.icon;
          
          return (
            <Collapsible key={category.id} open={category.isOpen}>
              <CollapsibleTrigger 
                className="w-full"
                onClick={() => toggleCategory(category.id)}
              >
                <div className="flex items-center justify-between p-3 hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-2">
                    <CategoryIcon className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium">{category.name}</span>
                  </div>
                  {category.isOpen ? (
                    <ChevronDown className="w-4 h-4 text-muted-foreground" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
                  )}
                </div>
              </CollapsibleTrigger>
              
              <CollapsibleContent>
                <div className="px-3 pb-2">
                  {category.tools.map((tool) => {
                    const ToolIcon = tool.icon;
                    const isActive = currentTool === tool.id;
                    
                    return (
                      <Button
                        key={tool.id}
                        variant={isActive ? "default" : "ghost"}
                        className={`
                          w-full justify-start h-auto p-2 mb-1 rounded-xl
                          ${isActive 
                            ? 'bg-gradient-primary text-primary-foreground' 
                            : 'hover:bg-accent hover:text-accent-foreground'
                          }
                        `}
                        onClick={() => onToolChange(tool.id)}
                        aria-label={tool.description}
                      >
                        <div className="flex items-center gap-3 w-full">
                          <ToolIcon className="w-4 h-4 flex-shrink-0" />
                          <div className="flex-1 text-left">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium">{tool.name}</span>
                              {tool.isNew && (
                                <Badge variant="secondary" className="text-xs px-1 py-0">
                                  New
                                </Badge>
                              )}
                            </div>
                            <p className="text-xs opacity-75">{tool.description}</p>
                          </div>
                          {tool.shortcut && (
                            <span className="text-xs opacity-60 font-mono">
                              {tool.shortcut}
                            </span>
                          )}
                        </div>
                      </Button>
                    );
                  })}
                </div>
                {category.id !== 'advanced' && <Separator className="mx-3" />}
              </CollapsibleContent>
            </Collapsible>
          );
        })}
      </div>
    </Card>
  );
};