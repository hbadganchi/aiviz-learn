import { useRef, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { RotateCcw, Download } from "lucide-react";
import { toast } from "sonner";

interface DrawingCanvasProps {
  currentTool: 'pen' | 'eraser' | 'shapes' | 'mic';
  className?: string;
  transcribedText?: string;
}

export const DrawingCanvas = ({ currentTool, className, transcribedText }: DrawingCanvasProps) => {
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

  useEffect(() => {
    if (transcribedText && transcribedText.trim()) {
      drawTextOnCanvas(transcribedText);
    }
  }, [transcribedText]);

  const startDrawing = (event: React.MouseEvent<HTMLCanvasElement>) => {
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

  const drawTextOnCanvas = (text: string) => {
    if (!contextRef.current || !canvasRef.current) return;
    
    const context = contextRef.current;
    const canvas = canvasRef.current;
    
    // Clear the canvas first
    context.fillStyle = '#ffffff';
    context.fillRect(0, 0, canvas.width, canvas.height);
    
    // Set text properties
    context.fillStyle = '#1f2937';
    context.font = 'bold 32px system-ui, -apple-system, sans-serif';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    
    // Calculate canvas center
    const rect = canvas.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    // Draw the text
    context.fillText(text, centerX, centerY);
    
    // Draw timestamp
    context.font = '16px system-ui, -apple-system, sans-serif';
    context.fillStyle = '#6b7280';
    context.fillText(new Date().toLocaleTimeString(), centerX, centerY + 50);
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

      {/* Drawing Canvas */}
      <canvas
        ref={canvasRef}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
        className="w-full h-full cursor-crosshair canvas-grid bg-canvas rounded-lg"
        style={{
          cursor: currentTool === 'eraser' ? 'grab' : 'crosshair'
        }}
      />

      {/* Tool Indicator */}
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
    </div>
  );
};