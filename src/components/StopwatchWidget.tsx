import { useState, useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { 
  Play, 
  Pause, 
  Square, 
  RotateCcw,
  Timer,
  Clock
} from "lucide-react";
import { toast } from "sonner";

interface StopwatchWidgetProps {
  className?: string;
}

export const StopwatchWidget = ({ className }: StopwatchWidgetProps) => {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [laps, setLaps] = useState<number[]>([]);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTime(prevTime => prevTime + 10);
      }, 10);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning]);

  const formatTime = (milliseconds: number) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const ms = Math.floor((milliseconds % 1000) / 10);
    
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${ms.toString().padStart(2, '0')}`;
  };

  const handleStart = () => {
    setIsRunning(true);
    toast.success("Stopwatch started!");
  };

  const handlePause = () => {
    setIsRunning(false);
    toast.info("Stopwatch paused");
  };

  const handleReset = () => {
    setIsRunning(false);
    setTime(0);
    setLaps([]);
    toast.success("Stopwatch reset!");
  };

  const handleLap = () => {
    if (isRunning) {
      setLaps(prev => [...prev, time]);
      toast.success(`Lap ${laps.length + 1} recorded!`);
    }
  };

  return (
    <Card className={`shadow-medium h-full flex flex-col ${className}`}>
      <div className="p-4 space-y-4">
        {/* Header */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-accent rounded-lg flex items-center justify-center">
            <Timer className="w-4 h-4 text-accent-foreground" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Stopwatch</h3>
            <p className="text-xs text-muted-foreground">Precision timing tool</p>
          </div>
        </div>

        <Separator />

        {/* Time Display */}
        <div className="text-center py-6">
          <div className="text-4xl font-mono font-bold text-foreground mb-2">
            {formatTime(time)}
          </div>
          <div className="flex items-center justify-center gap-1 text-muted-foreground">
            <Clock className="w-4 h-4" />
            <span className="text-sm">
              {isRunning ? 'Running' : time > 0 ? 'Paused' : 'Ready'}
            </span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex gap-2">
          {!isRunning ? (
            <Button
              onClick={handleStart}
              className="flex-1 bg-gradient-accent interactive"
            >
              <Play className="w-4 h-4 mr-2" />
              Start
            </Button>
          ) : (
            <Button
              onClick={handlePause}
              variant="outline"
              className="flex-1 interactive"
            >
              <Pause className="w-4 h-4 mr-2" />
              Pause
            </Button>
          )}
          
          <Button
            onClick={handleReset}
            variant="outline"
            className="interactive"
            disabled={time === 0}
          >
            <RotateCcw className="w-4 h-4" />
          </Button>
        </div>

        {/* Lap Button */}
        {time > 0 && (
          <Button
            onClick={handleLap}
            variant="outline"
            className="w-full interactive"
            disabled={!isRunning}
          >
            <Square className="w-4 h-4 mr-2" />
            Lap ({laps.length + 1})
          </Button>
        )}

        <Separator />

        {/* Lap Times */}
        <div className="flex-1">
          <h4 className="text-sm font-medium text-foreground mb-2">
            Lap Times ({laps.length})
          </h4>
          
          {laps.length === 0 ? (
            <div className="text-center py-4">
              <Timer className="w-6 h-6 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">No laps recorded</p>
            </div>
          ) : (
            <div className="space-y-1 max-h-32 overflow-y-auto">
              {laps.map((lapTime, index) => (
                <div key={index} className="flex justify-between items-center p-2 bg-muted/50 rounded">
                  <span className="text-sm font-medium">Lap {index + 1}</span>
                  <span className="text-sm font-mono">{formatTime(lapTime)}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};