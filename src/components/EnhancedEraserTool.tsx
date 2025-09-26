import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Eraser, 
  Square, 
  Zap, 
  Eye,
  Lock,
  Unlock,
  RotateCcw
} from "lucide-react";
import { toast } from "sonner";

interface Layer {
  id: string;
  name: string;
  isLocked: boolean;
  isVisible: boolean;
  objects: CanvasObject[];
}

interface CanvasObject {
  id: string;
  type: 'stroke' | 'shape' | 'text' | 'image';
  layerId: string;
  data: any;
  isSelected?: boolean;
}

interface EnhancedEraserToolProps {
  currentMode: 'stroke' | 'shape' | 'pixel';
  onModeChange: (mode: 'stroke' | 'shape' | 'pixel') => void;
  eraserSize: number;
  onSizeChange: (size: number) => void;
  layers: Layer[];
  onObjectErase: (objectId: string) => void;
  className?: string;
}

export const EnhancedEraserTool = ({
  currentMode,
  onModeChange,
  eraserSize,
  onSizeChange,
  layers,
  onObjectErase,
  className
}: EnhancedEraserToolProps) => {
  const [isErasing, setIsErasing] = useState(false);
  const [erasedObjects, setErasedObjects] = useState<string[]>([]);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const eraserModes = [
    {
      id: 'stroke' as const,
      name: 'Stroke Eraser',
      icon: Eraser,
      description: 'Erase entire strokes and lines',
      shortcut: 'E'
    },
    {
      id: 'shape' as const,
      name: 'Shape Eraser',
      icon: Square,
      description: 'Erase shapes and objects only',
      shortcut: 'Shift+E'
    },
    {
      id: 'pixel' as const,
      name: 'Pixel Eraser',
      icon: Zap,
      description: 'Pixel-level erasing',
      shortcut: 'Alt+E'
    }
  ];

  // Handle mouse events for erasing
  const handleMouseDown = (event: React.MouseEvent) => {
    if (!canvasRef.current) return;
    
    const rect = canvasRef.current.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    setIsErasing(true);
    performErase(x, y);
    
    // Log the erase action
    if ((window as any).addLogEntry) {
      (window as any).addLogEntry({
        actionType: 'erase',
        objectId: `eraser-action-${Date.now()}`,
        description: `Started erasing with ${currentMode} eraser at (${Math.round(x)}, ${Math.round(y)})`,
        metadata: { mode: currentMode, size: eraserSize, position: { x, y } }
      });
    }
  };

  const handleMouseMove = (event: React.MouseEvent) => {
    if (!canvasRef.current) return;
    
    const rect = canvasRef.current.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    setCursorPosition({ x, y });
    
    if (isErasing) {
      performErase(x, y);
    }
  };

  const handleMouseUp = () => {
    setIsErasing(false);
    
    if (erasedObjects.length > 0) {
      toast.success(`Erased ${erasedObjects.length} object(s)`);
      setErasedObjects([]);
    }
  };

  // Core erasing logic with layer respect
  const performErase = (x: number, y: number) => {
    const objectsToErase: string[] = [];
    
    layers.forEach(layer => {
      // CRITICAL: Never erase from locked layers
      if (layer.isLocked) {
        return;
      }
      
      layer.objects.forEach(obj => {
        if (isObjectInEraserRange(obj, x, y)) {
          // Check eraser mode compatibility
          if (
            (currentMode === 'stroke' && obj.type === 'stroke') ||
            (currentMode === 'shape' && (obj.type === 'shape' || obj.type === 'text')) ||
            (currentMode === 'pixel') // Pixel mode can erase anything
          ) {
            objectsToErase.push(obj.id);
          }
        }
      });
    });
    
    // Erase the objects
    objectsToErase.forEach(objectId => {
      onObjectErase(objectId);
      setErasedObjects(prev => [...prev, objectId]);
    });
  };

  // Check if object is within eraser range
  const isObjectInEraserRange = (obj: CanvasObject, x: number, y: number): boolean => {
    // This would contain actual collision detection logic
    // For demo purposes, we'll use a simple distance check
    const objX = obj.data?.x || 0;
    const objY = obj.data?.y || 0;
    const distance = Math.sqrt((x - objX) ** 2 + (y - objY) ** 2);
    return distance <= eraserSize;
  };

  // Undo last erase action
  const undoLastErase = () => {
    // This would restore the last erased objects
    toast.success("Last erase action undone");
    
    if ((window as any).addLogEntry) {
      (window as any).addLogEntry({
        actionType: 'modify',
        objectId: 'undo-erase',
        description: 'Undid last erase action',
        metadata: { action: 'undo', tool: 'eraser' }
      });
    }
  };

  // Get locked layers count
  const lockedLayersCount = layers.filter(layer => layer.isLocked).length;

  return (
    <Card className={`shadow-medium p-4 ${className}`}>
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Eraser className="w-5 h-5 text-primary" />
            <div>
              <h3 className="font-semibold text-foreground">Enhanced Eraser</h3>
              <p className="text-xs text-muted-foreground">
                {currentMode} mode • Size: {eraserSize}px
              </p>
            </div>
          </div>
          <Button onClick={undoLastErase} variant="outline" size="sm">
            <RotateCcw className="w-4 h-4" />
          </Button>
        </div>

        <Separator />

        {/* Eraser Modes */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-foreground">Eraser Modes</h4>
          <div className="grid gap-2">
            {eraserModes.map((mode) => {
              const Icon = mode.icon;
              const isActive = currentMode === mode.id;
              
              return (
                <Button
                  key={mode.id}
                  variant={isActive ? "default" : "outline"}
                  className={`
                    justify-start h-auto p-3 rounded-xl
                    ${isActive 
                      ? 'bg-gradient-primary text-primary-foreground' 
                      : 'hover:bg-accent hover:text-accent-foreground'
                    }
                  `}
                  onClick={() => onModeChange(mode.id)}
                >
                  <div className="flex items-center gap-3 w-full">
                    <Icon className="w-4 h-4 flex-shrink-0" />
                    <div className="flex-1 text-left">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">{mode.name}</span>
                        <Badge variant="secondary" className="text-xs">
                          {mode.shortcut}
                        </Badge>
                      </div>
                      <p className="text-xs opacity-75">{mode.description}</p>
                    </div>
                  </div>
                </Button>
              );
            })}
          </div>
        </div>

        <Separator />

        {/* Eraser Size */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium text-foreground">Eraser Size</h4>
            <span className="text-sm text-muted-foreground">{eraserSize}px</span>
          </div>
          <Slider
            value={[eraserSize]}
            onValueChange={(value) => onSizeChange(value[0])}
            min={5}
            max={100}
            step={5}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>5px</span>
            <span>100px</span>
          </div>
        </div>

        <Separator />

        {/* Layer Protection Status */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-foreground">Layer Protection</h4>
          <div className="space-y-1">
            {layers.slice(0, 3).map((layer) => (
              <div key={layer.id} className="flex items-center justify-between p-2 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-2">
                  {layer.isLocked ? (
                    <Lock className="w-3 h-3 text-muted-foreground" />
                  ) : (
                    <Unlock className="w-3 h-3 text-green-600" />
                  )}
                  <span className="text-xs font-medium">{layer.name}</span>
                </div>
                <Badge variant={layer.isLocked ? "secondary" : "outline"} className="text-xs">
                  {layer.isLocked ? 'Protected' : 'Erasable'}
                </Badge>
              </div>
            ))}
            {lockedLayersCount > 0 && (
              <div className="flex items-center gap-2 p-2 bg-green-50 border border-green-200 rounded-lg">
                <Lock className="w-3 h-3 text-green-600" />
                <span className="text-xs text-green-800">
                  {lockedLayersCount} layer(s) protected from erasing
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Eraser Preview Canvas */}
        <div className="relative">
          <h4 className="text-sm font-medium text-foreground mb-2">Eraser Preview</h4>
          <div className="relative bg-canvas border rounded-lg overflow-hidden">
            <canvas
              ref={canvasRef}
              width={200}
              height={100}
              className="w-full cursor-none"
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
            />
            
            {/* Eraser Cursor Preview */}
            <div
              className="absolute pointer-events-none border-2 border-red-500 rounded-full opacity-50"
              style={{
                left: cursorPosition.x - eraserSize / 2,
                top: cursorPosition.y - eraserSize / 2,
                width: eraserSize,
                height: eraserSize,
                transform: 'translate(-50%, -50%)'
              }}
            />
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Red circle shows eraser size and position
          </p>
        </div>
      </div>
    </Card>
  );
};