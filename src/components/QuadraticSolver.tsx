import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';

interface QuadraticResult {
  x1: number | string;
  x2: number | string;
  discriminant: number;
  hasRealSolutions: boolean;
}

export const QuadraticSolver = () => {
  const [a, setA] = useState('');
  const [b, setB] = useState('');
  const [c, setC] = useState('');
  const [result, setResult] = useState<QuadraticResult | null>(null);

  const solveQuadratic = () => {
    const numA = parseFloat(a);
    const numB = parseFloat(b);
    const numC = parseFloat(c);

    if (isNaN(numA) || isNaN(numB) || isNaN(numC)) {
      return;
    }

    if (numA === 0) {
      // Linear equation
      if (numB === 0) {
        setResult({
          x1: numC === 0 ? 'Infinite solutions' : 'No solution',
          x2: '',
          discriminant: 0,
          hasRealSolutions: false
        });
      } else {
        const x = -numC / numB;
        setResult({
          x1: parseFloat(x.toFixed(4)),
          x2: '',
          discriminant: 0,
          hasRealSolutions: true
        });
      }
      return;
    }

    const discriminant = numB * numB - 4 * numA * numC;

    if (discriminant > 0) {
      const x1 = (-numB + Math.sqrt(discriminant)) / (2 * numA);
      const x2 = (-numB - Math.sqrt(discriminant)) / (2 * numA);
      setResult({
        x1: parseFloat(x1.toFixed(4)),
        x2: parseFloat(x2.toFixed(4)),
        discriminant,
        hasRealSolutions: true
      });
    } else if (discriminant === 0) {
      const x = -numB / (2 * numA);
      setResult({
        x1: parseFloat(x.toFixed(4)),
        x2: 'Same root',
        discriminant,
        hasRealSolutions: true
      });
    } else {
      const realPart = -numB / (2 * numA);
      const imaginaryPart = Math.sqrt(Math.abs(discriminant)) / (2 * numA);
      setResult({
        x1: `${realPart.toFixed(4)} + ${imaginaryPart.toFixed(4)}i`,
        x2: `${realPart.toFixed(4)} - ${imaginaryPart.toFixed(4)}i`,
        discriminant,
        hasRealSolutions: false
      });
    }
  };

  const clearAll = () => {
    setA('');
    setB('');
    setC('');
    setResult(null);
  };

  return (
    <div className="space-y-4">
      <div className="text-center text-sm font-mono">
        ax² + bx + c = 0
      </div>
      
      <div className="grid grid-cols-3 gap-2">
        <div>
          <Label htmlFor="a" className="text-xs">a</Label>
          <Input
            id="a"
            value={a}
            onChange={(e) => setA(e.target.value)}
            placeholder="2"
            className="text-center text-sm"
          />
        </div>
        <div>
          <Label htmlFor="b" className="text-xs">b</Label>
          <Input
            id="b"
            value={b}
            onChange={(e) => setB(e.target.value)}
            placeholder="5"
            className="text-center text-sm"
          />
        </div>
        <div>
          <Label htmlFor="c" className="text-xs">c</Label>
          <Input
            id="c"
            value={c}
            onChange={(e) => setC(e.target.value)}
            placeholder="3"
            className="text-center text-sm"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <Button onClick={solveQuadratic} size="sm">
          Solve
        </Button>
        <Button onClick={clearAll} variant="outline" size="sm">
          Clear
        </Button>
      </div>

      {result && (
        <Card>
          <CardContent className="p-3 space-y-2">
            <div className="text-xs space-y-1">
              <div>
                <strong>x₁:</strong> {result.x1}
              </div>
              {result.x2 && (
                <div>
                  <strong>x₂:</strong> {result.x2}
                </div>
              )}
              <div className="text-muted-foreground">
                Discriminant: {result.discriminant.toFixed(2)}
              </div>
              <div className={`text-xs ${result.hasRealSolutions ? 'text-green-600' : 'text-blue-600'}`}>
                {result.hasRealSolutions ? 'Real solutions' : 'Complex solutions'}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};