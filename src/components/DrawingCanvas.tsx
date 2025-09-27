import { useRef, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { RotateCcw, Download } from "lucide-react";
import { toast } from "sonner";

interface DrawingCanvasProps {
  currentTool: 'pen' | 'eraser' | 'mic';
  className?: string;
}

export const DrawingCanvas = ({ currentTool, className }: DrawingCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [strokeColor, setStrokeColor] = useState('#3b82f6');
  const [strokeWidth, setStrokeWidth] = useState(3);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext('2d');
    if (!context) return;

    // Set up canvas
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * 2;
    canvas.height = rect.height * 2;
    context.scale(2, 2);

    // Set up drawing context
    context.lineCap = 'round';
    context.strokeStyle = strokeColor;
    context.lineWidth = strokeWidth;
    contextRef.current = context;

    // Fill with white background
    context.fillStyle = '#ffffff';
    context.fillRect(0, 0, canvas.width, canvas.height);
  }, []);

  useEffect(() => {
    if (contextRef.current) {
      contextRef.current.strokeStyle = currentTool === 'eraser' ? '#ffffff' : strokeColor;
      contextRef.current.lineWidth = currentTool === 'eraser' ? strokeWidth * 3 : strokeWidth;
      contextRef.current.globalCompositeOperation = currentTool === 'eraser' ? 'destination-out' : 'source-over';
    }
  }, [currentTool, strokeColor, strokeWidth]);

  const startDrawing = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (currentTool === 'mic') return;
    
    if (!contextRef.current) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    contextRef.current.beginPath();
    contextRef.current.moveTo(x, y);
    setIsDrawing(true);
  };

  const draw = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (currentTool === 'mic') return;
    
    if (!isDrawing || !contextRef.current) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    contextRef.current.lineTo(x, y);
    contextRef.current.stroke();
  };

  const stopDrawing = () => {
    if (currentTool === 'mic') return;
    
    if (!contextRef.current) return;
    contextRef.current.closePath();
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    if (!contextRef.current || !canvasRef.current) return;
    
    contextRef.current.fillStyle = '#ffffff';
    contextRef.current.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    toast.success("Canvas cleared!");
  };

  const downloadCanvas = () => {
    if (!canvasRef.current) return;
    
    const link = document.createElement('a');
    link.download = `smartboard-${new Date().toISOString().slice(0, 19)}.png`;
    link.href = canvasRef.current.toDataURL();
    link.click();
    toast.success("Canvas downloaded!");
  };

  return (
    <div className={`relative ${className}`}>
      {/* Canvas Controls */}
      {currentTool !== 'mic' && (
        <div className="absolute top-4 right-4 z-10 flex gap-2">
          <div className="flex items-center gap-2 bg-card/90 backdrop-blur-sm rounded-lg p-2 shadow-soft">
            <input
              type="color"
              value={strokeColor}
              onChange={(e) => setStrokeColor(e.target.value)}
              className="w-8 h-8 rounded border-0 cursor-pointer"
              disabled={currentTool === 'eraser'}
            />
            <input
              type="range"
              min="1"
              max="20"
              value={strokeWidth}
              onChange={(e) => setStrokeWidth(Number(e.target.value))}
              className="w-20"
            />
          </div>
        
          <Button
            onClick={clearCanvas}
            variant="outline"
            size="icon"
            className="interactive"
          >
            <RotateCcw className="w-4 h-4" />
          </Button>
        
          <Button
            onClick={downloadCanvas}
            variant="outline"
            size="icon"
            className="interactive"
          >
            <Download className="w-4 h-4" />
          </Button>
        </div>
      )}

      {/* Drawing Canvas */}
      <canvas
        ref={canvasRef}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
        className={`w-full h-full bg-canvas rounded-lg ${
          currentTool === 'mic' ? 'cursor-default' : 'cursor-crosshair'
        }`}
        style={{
          cursor: currentTool === 'mic' ? 'default' : currentTool === 'eraser' ? 'grab' : 'crosshair'
        }}
      />

      {/* Tool Indicator */}
      {currentTool !== 'mic' && (
        <div className="absolute bottom-4 left-4 bg-card/90 backdrop-blur-sm rounded-lg p-3 shadow-soft">
          <p className="text-sm font-medium text-foreground">
            Current Tool: <span className="text-primary capitalize">{currentTool}</span>
          </p>
          {currentTool === 'pen' && (
            <div className="flex items-center gap-2 mt-1">
              <div 
                className="w-4 h-4 rounded-full" 
                style={{ backgroundColor: strokeColor }}
              />
              <span className="text-xs text-muted-foreground">{strokeWidth}px</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};