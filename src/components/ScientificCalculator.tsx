import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Calculator, RotateCcw, Save } from "lucide-react";
import { toast } from "sonner";

interface CalculatorProps {
  className?: string;
}

export const ScientificCalculator = ({ className }: CalculatorProps) => {
  const [display, setDisplay] = useState('0');
  const [previousValue, setPreviousValue] = useState<number | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);
  const [memory, setMemory] = useState(0);
  const [isRadians, setIsRadians] = useState(true);

  const inputNumber = (num: string) => {
    if (waitingForOperand) {
      setDisplay(num);
      setWaitingForOperand(false);
    } else {
      setDisplay(display === '0' ? num : display + num);
    }
  };

  const inputDecimal = () => {
    if (waitingForOperand) {
      setDisplay('0.');
      setWaitingForOperand(false);
    } else if (display.indexOf('.') === -1) {
      setDisplay(display + '.');
    }
  };

  const clear = () => {
    setDisplay('0');
    setPreviousValue(null);
    setOperation(null);
    setWaitingForOperand(false);
  };

  const performOperation = (nextOperation: string) => {
    const inputValue = parseFloat(display);

    if (previousValue === null) {
      setPreviousValue(inputValue);
    } else if (operation) {
      const currentValue = previousValue || 0;
      const newValue = calculate(currentValue, inputValue, operation);

      setDisplay(String(newValue));
      setPreviousValue(newValue);
    }

    setWaitingForOperand(true);
    setOperation(nextOperation);
  };

  const calculate = (firstValue: number, secondValue: number, operation: string): number => {
    switch (operation) {
      case '+':
        return firstValue + secondValue;
      case '-':
        return firstValue - secondValue;
      case '×':
        return firstValue * secondValue;
      case '÷':
        return secondValue !== 0 ? firstValue / secondValue : 0;
      case '^':
        return Math.pow(firstValue, secondValue);
      case '%':
        return firstValue % secondValue;
      default:
        return secondValue;
    }
  };

  const performScientificOperation = (func: string) => {
    const inputValue = parseFloat(display);
    let result: number;

    switch (func) {
      case 'sin':
        result = Math.sin(isRadians ? inputValue : inputValue * Math.PI / 180);
        break;
      case 'cos':
        result = Math.cos(isRadians ? inputValue : inputValue * Math.PI / 180);
        break;
      case 'tan':
        result = Math.tan(isRadians ? inputValue : inputValue * Math.PI / 180);
        break;
      case 'log':
        result = Math.log10(inputValue);
        break;
      case 'ln':
        result = Math.log(inputValue);
        break;
      case '√':
        result = Math.sqrt(inputValue);
        break;
      case 'x²':
        result = inputValue * inputValue;
        break;
      case '1/x':
        result = inputValue !== 0 ? 1 / inputValue : 0;
        break;
      case '±':
        result = -inputValue;
        break;
      default:
        result = inputValue;
    }

    setDisplay(String(result));
    setWaitingForOperand(true);
  };

  const performEquals = () => {
    const inputValue = parseFloat(display);

    if (previousValue !== null && operation) {
      const newValue = calculate(previousValue, inputValue, operation);
      setDisplay(String(newValue));
      setPreviousValue(null);
      setOperation(null);
      setWaitingForOperand(true);
    }
  };

  const insertConstant = (constant: string) => {
    let value: number;
    switch (constant) {
      case 'π':
        value = Math.PI;
        break;
      case 'e':
        value = Math.E;
        break;
      default:
        return;
    }
    setDisplay(String(value));
    setWaitingForOperand(true);
  };

  const memoryOperation = (op: string) => {
    const currentValue = parseFloat(display);
    
    switch (op) {
      case 'MC':
        setMemory(0);
        toast.success("Memory cleared");
        break;
      case 'MR':
        setDisplay(String(memory));
        setWaitingForOperand(true);
        break;
      case 'M+':
        setMemory(memory + currentValue);
        toast.success("Added to memory");
        break;
      case 'M-':
        setMemory(memory - currentValue);
        toast.success("Subtracted from memory");
        break;
    }
  };

  const saveToNotes = () => {
    toast.success("Calculation saved to notes!");
  };

  return (
    <Card className={`shadow-medium h-full flex flex-col ${className}`}>
      <div className="p-4 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <Calculator className="w-4 h-4 text-primary-foreground" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Scientific Calculator</h3>
              <p className="text-xs text-muted-foreground">Advanced calculations</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={() => setIsRadians(!isRadians)}
              variant="outline"
              size="sm"
              className="interactive"
            >
              {isRadians ? 'RAD' : 'DEG'}
            </Button>
            <Button
              onClick={saveToNotes}
              variant="outline"
              size="sm"
              className="interactive"
            >
              <Save className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Display */}
        <div className="bg-muted p-4 rounded-lg">
          <div className="text-right">
            <div className="text-3xl font-mono font-bold text-foreground break-all">
              {display}
            </div>
            {memory !== 0 && (
              <div className="text-sm text-muted-foreground">M: {memory}</div>
            )}
          </div>
        </div>

        <Separator />

        {/* Scientific Functions */}
        <div className="grid grid-cols-5 gap-2">
          <Button
            onClick={() => performScientificOperation('sin')}
            variant="outline"
            className="interactive text-xs"
          >
            sin
          </Button>
          <Button
            onClick={() => performScientificOperation('cos')}
            variant="outline"
            className="interactive text-xs"
          >
            cos
          </Button>
          <Button
            onClick={() => performScientificOperation('tan')}
            variant="outline"
            className="interactive text-xs"
          >
            tan
          </Button>
          <Button
            onClick={() => performScientificOperation('log')}
            variant="outline"
            className="interactive text-xs"
          >
            log
          </Button>
          <Button
            onClick={() => performScientificOperation('ln')}
            variant="outline"
            className="interactive text-xs"
          >
            ln
          </Button>
        </div>

        {/* Memory and Constants */}
        <div className="grid grid-cols-6 gap-2">
          <Button
            onClick={() => memoryOperation('MC')}
            variant="outline"
            size="sm"
            className="interactive text-xs"
          >
            MC
          </Button>
          <Button
            onClick={() => memoryOperation('MR')}
            variant="outline"
            size="sm"
            className="interactive text-xs"
          >
            MR
          </Button>
          <Button
            onClick={() => memoryOperation('M+')}
            variant="outline"
            size="sm"
            className="interactive text-xs"
          >
            M+
          </Button>
          <Button
            onClick={() => memoryOperation('M-')}
            variant="outline"
            size="sm"
            className="interactive text-xs"
          >
            M-
          </Button>
          <Button
            onClick={() => insertConstant('π')}
            variant="outline"
            size="sm"
            className="interactive text-xs"
          >
            π
          </Button>
          <Button
            onClick={() => insertConstant('e')}
            variant="outline"
            size="sm"
            className="interactive text-xs"
          >
            e
          </Button>
        </div>

        {/* Advanced Operations */}
        <div className="grid grid-cols-4 gap-2">
          <Button
            onClick={() => performScientificOperation('√')}
            variant="outline"
            className="interactive"
          >
            √
          </Button>
          <Button
            onClick={() => performScientificOperation('x²')}
            variant="outline"
            className="interactive"
          >
            x²
          </Button>
          <Button
            onClick={() => performOperation('^')}
            variant="outline"
            className="interactive"
          >
            x^y
          </Button>
          <Button
            onClick={() => performScientificOperation('1/x')}
            variant="outline"
            className="interactive"
          >
            1/x
          </Button>
        </div>

        {/* Main Calculator */}
        <div className="grid grid-cols-4 gap-2">
          <Button
            onClick={clear}
            variant="destructive"
            className="interactive"
          >
            <RotateCcw className="w-4 h-4 mr-1" />
            C
          </Button>
          <Button
            onClick={() => performScientificOperation('±')}
            variant="outline"
            className="interactive"
          >
            ±
          </Button>
          <Button
            onClick={() => performOperation('%')}
            variant="outline"
            className="interactive"
          >
            %
          </Button>
          <Button
            onClick={() => performOperation('÷')}
            variant="outline"
            className="interactive bg-gradient-accent text-accent-foreground"
          >
            ÷
          </Button>

          {/* Numbers and operations */}
          {[7, 8, 9].map(num => (
            <Button
              key={num}
              onClick={() => inputNumber(num.toString())}
              variant="outline"
              className="interactive text-lg font-semibold"
            >
              {num}
            </Button>
          ))}
          <Button
            onClick={() => performOperation('×')}
            variant="outline"
            className="interactive bg-gradient-accent text-accent-foreground"
          >
            ×
          </Button>

          {[4, 5, 6].map(num => (
            <Button
              key={num}
              onClick={() => inputNumber(num.toString())}
              variant="outline"
              className="interactive text-lg font-semibold"
            >
              {num}
            </Button>
          ))}
          <Button
            onClick={() => performOperation('-')}
            variant="outline"
            className="interactive bg-gradient-accent text-accent-foreground"
          >
            -
          </Button>

          {[1, 2, 3].map(num => (
            <Button
              key={num}
              onClick={() => inputNumber(num.toString())}
              variant="outline"
              className="interactive text-lg font-semibold"
            >
              {num}
            </Button>
          ))}
          <Button
            onClick={() => performOperation('+')}
            variant="outline"
            className="interactive bg-gradient-accent text-accent-foreground row-span-2"
          >
            +
          </Button>

          <Button
            onClick={() => inputNumber('0')}
            variant="outline"
            className="interactive text-lg font-semibold col-span-2"
          >
            0
          </Button>
          <Button
            onClick={inputDecimal}
            variant="outline"
            className="interactive text-lg font-semibold"
          >
            .
          </Button>
        </div>

        <Button
          onClick={performEquals}
          className="w-full bg-gradient-primary interactive text-lg font-semibold"
        >
          =
        </Button>
      </div>
    </Card>
  );
};