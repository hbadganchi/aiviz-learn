import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { Brush, Grid3x3 as Grid3X3, RotateCcw, Palette } from "lucide-react";
import { toast } from "sonner";

interface SimplifiedToolbarProps {
  strokeColor: string;
  onStrokeColorChange: (color: string) => void;
  strokeWidth: number;
  onStrokeWidthChange: (width: number) => void;
  showGrid: boolean;
  onToggleGrid: () => void;
}

export const SimplifiedToolbar = ({
  strokeColor,
  onStrokeColorChange,
  strokeWidth,
  onStrokeWidthChange,
  showGrid,
  onToggleGrid
}: SimplifiedToolbarProps) => {
  const predefinedColors = [
    '#000000', '#3b82f6', '#ef4444', '#22c55e',
    '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4',
    '#84cc16', '#f97316', '#6366f1', '#14b8a6'
  ];

  const handleClear = () => {
    toast.success("Canvas cleared!");
  };

  return (
    <Card className="shadow-medium h-full flex flex-col p-4">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
          <Brush className="w-4 h-4 text-primary-foreground" />
        </div>
        <div>
          <h3 className="font-semibold text-foreground">Drawing</h3>
          <p className="text-xs text-muted-foreground">Brush tool</p>
        </div>
      </div>

      <Separator className="mb-4" />

      {/* Brush Settings */}
      <div className="space-y-4 mb-6">
        <div>
          <h4 className="text-sm font-medium text-foreground mb-3">Brush Size</h4>
          <div className="space-y-2">
            <Slider
              value={[strokeWidth]}
              onValueChange={(value) => onStrokeWidthChange(value[0])}
              min={1}
              max={20}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>1px</span>
              <span className="font-medium">{strokeWidth}px</span>
              <span>20px</span>
            </div>
          </div>
        </div>

        {/* Color Picker */}
        <div>
          <h4 className="text-sm font-medium text-foreground mb-3">Color</h4>
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={strokeColor}
                onChange={(e) => onStrokeColorChange(e.target.value)}
                className="w-12 h-8 rounded border cursor-pointer"
              />
              <span className="text-sm text-muted-foreground font-mono">
                {strokeColor.toUpperCase()}
              </span>
            </div>
            
            <div className="grid grid-cols-4 gap-2">
              {predefinedColors.map((color) => (
                <button
                  key={color}
                  onClick={() => onStrokeColorChange(color)}
                  className={`w-8 h-8 rounded-lg border-2 transition-all hover:scale-110 ${
                    strokeColor === color ? 'border-primary' : 'border-border'
                  }`}
                  style={{ backgroundColor: color }}
                  title={color}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      <Separator className="mb-4" />

      {/* Canvas Controls */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium text-foreground">Canvas</h4>
        
        <Button
          onClick={onToggleGrid}
          variant={showGrid ? "default" : "outline"}
          className="w-full justify-start"
        >
          <Grid3X3 className="w-4 h-4 mr-2" />
          {showGrid ? 'Hide Grid' : 'Show Grid'}
        </Button>
        
        <Button
          onClick={handleClear}
          variant="outline"
          className="w-full justify-start hover:bg-destructive hover:text-destructive-foreground"
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          Clear Canvas
        </Button>
      </div>

      {/* Preview */}
      <div className="mt-auto pt-4">
        <Separator className="mb-4" />
        <div className="text-center">
          <p className="text-xs text-muted-foreground mb-2">Preview</p>
          <div className="bg-canvas border rounded-lg p-4 flex items-center justify-center">
            <div
              className="rounded-full"
              style={{
                backgroundColor: strokeColor,
                width: `${Math.max(strokeWidth, 4)}px`,
                height: `${Math.max(strokeWidth, 4)}px`
              }}
            />
          </div>
        </div>
      </div>
    </Card>
  );
};