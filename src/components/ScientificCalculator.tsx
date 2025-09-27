import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export const ScientificCalculator = () => {
  const [display, setDisplay] = useState('0');
  const [previousValue, setPreviousValue] = useState<number | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [waitingForNewValue, setWaitingForNewValue] = useState(false);

  const inputNumber = (num: string) => {
    if (waitingForNewValue) {
      setDisplay(num);
      setWaitingForNewValue(false);
    } else {
      setDisplay(display === '0' ? num : display + num);
    }
  };

  const inputOperation = (nextOperation: string) => {
    const inputValue = parseFloat(display);

    if (previousValue === null) {
      setPreviousValue(inputValue);
    } else if (operation) {
      const currentValue = previousValue || 0;
      const newValue = calculate(currentValue, inputValue, operation);

      setDisplay(String(newValue));
      setPreviousValue(newValue);
    }

    setWaitingForNewValue(true);
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
        return firstValue / secondValue;
      case '=':
        return secondValue;
      default:
        return secondValue;
    }
  };

  const performCalculation = () => {
    const inputValue = parseFloat(display);

    if (previousValue !== null && operation) {
      const newValue = calculate(previousValue, inputValue, operation);
      setDisplay(String(newValue));
      setPreviousValue(null);
      setOperation(null);
      setWaitingForNewValue(true);
    }
  };

  const performScientificOperation = (func: string) => {
    const inputValue = parseFloat(display);
    let result: number;

    switch (func) {
      case 'sin':
        result = Math.sin(inputValue * Math.PI / 180);
        break;
      case 'cos':
        result = Math.cos(inputValue * Math.PI / 180);
        break;
      case 'tan':
        result = Math.tan(inputValue * Math.PI / 180);
        break;
      case 'log':
        result = Math.log10(inputValue);
        break;
      case 'ln':
        result = Math.log(inputValue);
        break;
      case 'sqrt':
        result = Math.sqrt(inputValue);
        break;
      case 'x²':
        result = Math.pow(inputValue, 2);
        break;
      case '1/x':
        result = 1 / inputValue;
        break;
      default:
        return;
    }

    setDisplay(String(result));
    setWaitingForNewValue(true);
  };

  const clear = () => {
    setDisplay('0');
    setPreviousValue(null);
    setOperation(null);
    setWaitingForNewValue(false);
  };

  const clearEntry = () => {
    setDisplay('0');
    setWaitingForNewValue(false);
  };

  return (
    <div className="space-y-3">
      <Input 
        value={display} 
        readOnly 
        className="text-right text-lg font-mono bg-muted"
      />
      
      <div className="grid grid-cols-4 gap-1 text-xs">
        {/* Row 1 - Scientific functions */}
        <Button variant="outline" size="sm" onClick={() => performScientificOperation('sin')}>
          sin
        </Button>
        <Button variant="outline" size="sm" onClick={() => performScientificOperation('cos')}>
          cos
        </Button>
        <Button variant="outline" size="sm" onClick={() => performScientificOperation('tan')}>
          tan
        </Button>
        <Button variant="outline" size="sm" onClick={() => performScientificOperation('log')}>
          log
        </Button>

        {/* Row 2 - More scientific functions */}
        <Button variant="outline" size="sm" onClick={() => performScientificOperation('ln')}>
          ln
        </Button>
        <Button variant="outline" size="sm" onClick={() => performScientificOperation('sqrt')}>
          √
        </Button>
        <Button variant="outline" size="sm" onClick={() => performScientificOperation('x²')}>
          x²
        </Button>
        <Button variant="outline" size="sm" onClick={() => performScientificOperation('1/x')}>
          1/x
        </Button>

        {/* Row 3 - Clear and basic operations */}
        <Button variant="destructive" size="sm" onClick={clear}>
          C
        </Button>
        <Button variant="outline" size="sm" onClick={clearEntry}>
          CE
        </Button>
        <Button variant="outline" size="sm" onClick={() => inputOperation('÷')}>
          ÷
        </Button>
        <Button variant="outline" size="sm" onClick={() => inputOperation('×')}>
          ×
        </Button>

        {/* Row 4 - Numbers */}
        <Button variant="outline" size="sm" onClick={() => inputNumber('7')}>
          7
        </Button>
        <Button variant="outline" size="sm" onClick={() => inputNumber('8')}>
          8
        </Button>
        <Button variant="outline" size="sm" onClick={() => inputNumber('9')}>
          9
        </Button>
        <Button variant="outline" size="sm" onClick={() => inputOperation('-')}>
          -
        </Button>

        {/* Row 5 */}
        <Button variant="outline" size="sm" onClick={() => inputNumber('4')}>
          4
        </Button>
        <Button variant="outline" size="sm" onClick={() => inputNumber('5')}>
          5
        </Button>
        <Button variant="outline" size="sm" onClick={() => inputNumber('6')}>
          6
        </Button>
        <Button variant="outline" size="sm" onClick={() => inputOperation('+')}>
          +
        </Button>

        {/* Row 6 */}
        <Button variant="outline" size="sm" onClick={() => inputNumber('1')}>
          1
        </Button>
        <Button variant="outline" size="sm" onClick={() => inputNumber('2')}>
          2
        </Button>
        <Button variant="outline" size="sm" onClick={() => inputNumber('3')}>
          3
        </Button>
        <Button variant="default" size="sm" onClick={performCalculation} className="row-span-2">
          =
        </Button>

        {/* Row 7 */}
        <Button variant="outline" size="sm" onClick={() => inputNumber('0')} className="col-span-2">
          0
        </Button>
        <Button variant="outline" size="sm" onClick={() => inputNumber('.')}>
          .
        </Button>
      </div>
    </div>
  );
};