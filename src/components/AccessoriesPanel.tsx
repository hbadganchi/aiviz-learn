import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { 
  Calculator as CalculatorIcon, 
  Ruler, 
  Clock, 
  Book,
  Compass,
  Palette,
  ChevronDown,
  X,
  Plus,
  Minus,
  Equal,
  Delete
} from "lucide-react";

interface AccessoriesPanelProps {
  className?: string;
}

export const AccessoriesPanel = ({ className }: AccessoriesPanelProps) => {
  const [openTool, setOpenTool] = useState<string | null>(null);
  const [calcDisplay, setCalcDisplay] = useState("0");
  const [calcOperation, setCalcOperation] = useState<string | null>(null);
  const [calcPrevValue, setCalcPrevValue] = useState<number | null>(null);
  const [timerMinutes, setTimerMinutes] = useState(5);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  const tools = [
    { id: 'calculator', name: 'Calculator', icon: CalculatorIcon, description: 'Scientific calculator' },
    { id: 'ruler', name: 'Digital Ruler', icon: Ruler, description: 'Measure on screen' },
    { id: 'timer', name: 'Timer', icon: Clock, description: 'Study timer' },
    { id: 'periodic', name: 'Periodic Table', icon: Book, description: 'Chemical elements' },
    { id: 'protractor', name: 'Protractor', icon: Compass, description: 'Angle measurement' },
    { id: 'color', name: 'Color Picker', icon: Palette, description: 'Color tools' }
  ];

  // Calculator functions
  const inputNumber = (num: string) => {
    setCalcDisplay(prev => prev === "0" ? num : prev + num);
  };

  const inputOperation = (op: string) => {
    if (calcPrevValue !== null && calcOperation) {
      calculate();
    }
    setCalcPrevValue(parseFloat(calcDisplay));
    setCalcOperation(op);
    setCalcDisplay("0");
  };

  const calculate = () => {
    if (calcPrevValue === null || !calcOperation) return;
    
    const current = parseFloat(calcDisplay);
    let result = 0;
    
    switch (calcOperation) {
      case '+': result = calcPrevValue + current; break;
      case '-': result = calcPrevValue - current; break;
      case '*': result = calcPrevValue * current; break;
      case '/': result = calcPrevValue / current; break;
    }
    
    setCalcDisplay(result.toString());
    setCalcPrevValue(null);
    setCalcOperation(null);
  };

  const clearCalculator = () => {
    setCalcDisplay("0");
    setCalcPrevValue(null);
    setCalcOperation(null);
  };

  // Periodic table elements (simplified)
  const periodicElements = [
    { symbol: 'H', name: 'Hydrogen', number: 1, mass: '1.008' },
    { symbol: 'He', name: 'Helium', number: 2, mass: '4.003' },
    { symbol: 'Li', name: 'Lithium', number: 3, mass: '6.941' },
    { symbol: 'Be', name: 'Beryllium', number: 4, mass: '9.012' },
    { symbol: 'B', name: 'Boron', number: 5, mass: '10.811' },
    { symbol: 'C', name: 'Carbon', number: 6, mass: '12.011' },
    { symbol: 'N', name: 'Nitrogen', number: 7, mass: '14.007' },
    { symbol: 'O', name: 'Oxygen', number: 8, mass: '15.999' }
  ];

  const renderToolContent = () => {
    switch (openTool) {
      case 'calculator':
        return (
          <div className="space-y-4">
            <div className="bg-muted p-4 rounded-lg text-right">
              <div className="text-2xl font-mono">{calcDisplay}</div>
              {calcOperation && <div className="text-sm text-muted-foreground">{calcOperation}</div>}
            </div>
            <div className="grid grid-cols-4 gap-2">
              <Button variant="outline" onClick={clearCalculator} className="col-span-2">Clear</Button>
              <Button variant="outline" onClick={() => inputOperation('/')}>/</Button>
              <Button variant="outline" onClick={() => inputOperation('*')}>×</Button>
              
              {[7, 8, 9].map(num => (
                <Button key={num} variant="outline" onClick={() => inputNumber(num.toString())}>{num}</Button>
              ))}
              <Button variant="outline" onClick={() => inputOperation('-')}>-</Button>
              
              {[4, 5, 6].map(num => (
                <Button key={num} variant="outline" onClick={() => inputNumber(num.toString())}>{num}</Button>
              ))}
              <Button variant="outline" onClick={() => inputOperation('+')}>+</Button>
              
              {[1, 2, 3].map(num => (
                <Button key={num} variant="outline" onClick={() => inputNumber(num.toString())}>{num}</Button>
              ))}
              <Button variant="default" onClick={calculate} className="row-span-2 bg-gradient-primary">=</Button>
              
              <Button variant="outline" onClick={() => inputNumber("0")} className="col-span-2">0</Button>
              <Button variant="outline" onClick={() => inputNumber(".")}>.</Button>
            </div>
          </div>
        );
      
      case 'timer':
        return (
          <div className="space-y-4">
            <div className="text-center">
              <div className="text-4xl font-mono">
                {String(timerMinutes).padStart(2, '0')}:{String(timerSeconds).padStart(2, '0')}
              </div>
            </div>
            <div className="flex gap-2">
              <Input 
                type="number" 
                placeholder="Minutes" 
                value={timerMinutes}
                onChange={(e) => setTimerMinutes(parseInt(e.target.value) || 0)}
                className="w-full"
              />
              <Input 
                type="number" 
                placeholder="Seconds" 
                value={timerSeconds}
                onChange={(e) => setTimerSeconds(parseInt(e.target.value) || 0)}
                className="w-full"
              />
            </div>
            <div className="flex gap-2">
              <Button 
                variant={isTimerRunning ? "destructive" : "default"}
                onClick={() => setIsTimerRunning(!isTimerRunning)}
                className="flex-1"
              >
                {isTimerRunning ? 'Stop' : 'Start'}
              </Button>
              <Button variant="outline" onClick={() => { setTimerMinutes(5); setTimerSeconds(0); }}>Reset</Button>
            </div>
          </div>
        );
      
      case 'periodic':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-4 gap-2 max-h-64 overflow-y-auto">
              {periodicElements.map(element => (
                <Card key={element.symbol} className="p-2 hover:bg-accent cursor-pointer">
                  <div className="text-center">
                    <div className="text-xs text-muted-foreground">{element.number}</div>
                    <div className="font-bold text-lg">{element.symbol}</div>
                    <div className="text-xs text-muted-foreground">{element.mass}</div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        );
      
      case 'ruler':
        return (
          <div className="space-y-4">
            <div className="bg-muted p-4 rounded-lg">
              <div className="border-l-2 border-foreground h-48 relative">
                {Array.from({ length: 10 }, (_, i) => (
                  <div key={i} className="absolute border-t border-foreground w-6" style={{ top: `${i * 10}%` }}>
                    <span className="text-xs ml-8">{i}cm</span>
                  </div>
                ))}
              </div>
            </div>
            <p className="text-sm text-muted-foreground text-center">
              Use this ruler to measure objects on screen
            </p>
          </div>
        );
      
      default:
        return <div className="p-4">Tool not implemented yet</div>;
    }
  };

  return (
    <>
      <Card className={`shadow-medium ${className}`}>
        <div className="p-4 space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                <CalculatorIcon className="w-4 h-4 text-primary-foreground" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Accessories</h3>
                <p className="text-xs text-muted-foreground">Educational tools</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Tools Grid */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-foreground">Available Tools</h4>
            <div className="grid grid-cols-1 gap-2">
              {tools.map((tool) => {
                const Icon = tool.icon;
                return (
                  <Button
                    key={tool.id}
                    variant="outline"
                    className="interactive justify-between h-auto p-3"
                    onClick={() => setOpenTool(tool.id)}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="w-4 h-4 text-primary" />
                      <div className="text-left">
                        <p className="text-sm font-medium">{tool.name}</p>
                        <p className="text-xs text-muted-foreground">{tool.description}</p>
                      </div>
                    </div>
                    <ChevronDown className="w-4 h-4 text-muted-foreground" />
                  </Button>
                );
              })}
            </div>
          </div>
        </div>
      </Card>

      {/* Tool Dialog */}
      <Dialog open={!!openTool} onOpenChange={() => setOpenTool(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {openTool && tools.find(t => t.id === openTool)?.icon && 
                (() => {
                  const Icon = tools.find(t => t.id === openTool)!.icon;
                  return <Icon className="w-5 h-5" />;
                })()
              }
              {tools.find(t => t.id === openTool)?.name}
            </DialogTitle>
          </DialogHeader>
          {renderToolContent()}
        </DialogContent>
      </Dialog>
    </>
  );
};