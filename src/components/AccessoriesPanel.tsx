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
  Delete,
  ArrowLeftRight
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
  const [conversionValue, setConversionValue] = useState('');
  const [conversionFrom, setConversionFrom] = useState('m');
  const [conversionTo, setConversionTo] = useState('cm');
  const [conversionResult, setConversionResult] = useState('');

  const tools = [
    { id: 'calculator', name: 'Calculator', icon: CalculatorIcon, description: 'Scientific calculator' },
    { id: 'converter', name: 'Unit Converter', icon: ArrowLeftRight, description: 'Convert units' },
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

  // Unit conversion functions
  const conversions = {
    // Length
    m: { name: 'Meter', factor: 1 },
    cm: { name: 'Centimeter', factor: 0.01 },
    mm: { name: 'Millimeter', factor: 0.001 },
    km: { name: 'Kilometer', factor: 1000 },
    in: { name: 'Inch', factor: 0.0254 },
    ft: { name: 'Foot', factor: 0.3048 },
    
    // Mass
    kg: { name: 'Kilogram', factor: 1 },
    g: { name: 'Gram', factor: 0.001 },
    mg: { name: 'Milligram', factor: 0.000001 },
    lb: { name: 'Pound', factor: 0.453592 },
    oz: { name: 'Ounce', factor: 0.0283495 },
    
    // Volume
    L: { name: 'Liter', factor: 1 },
    mL: { name: 'Milliliter', factor: 0.001 },
    gal: { name: 'Gallon (US)', factor: 3.78541 },
    qt: { name: 'Quart (US)', factor: 0.946353 },
    
    // Time
    s: { name: 'Second', factor: 1 },
    min: { name: 'Minute', factor: 60 },
    hr: { name: 'Hour', factor: 3600 },
    day: { name: 'Day', factor: 86400 }
  };

  const convertUnits = () => {
    const value = parseFloat(conversionValue);
    if (isNaN(value)) {
      setConversionResult('Invalid input');
      return;
    }
    
    const fromFactor = conversions[conversionFrom as keyof typeof conversions]?.factor || 1;
    const toFactor = conversions[conversionTo as keyof typeof conversions]?.factor || 1;
    
    const result = (value * fromFactor) / toFactor;
    setConversionResult(`${result.toFixed(6)} ${conversions[conversionTo as keyof typeof conversions]?.name || conversionTo}`);
  };

  // Complete periodic table elements
  const periodicElements = [
    { symbol: 'H', name: 'Hydrogen', number: 1, mass: '1.008' },
    { symbol: 'He', name: 'Helium', number: 2, mass: '4.003' },
    { symbol: 'Li', name: 'Lithium', number: 3, mass: '6.941' },
    { symbol: 'Be', name: 'Beryllium', number: 4, mass: '9.012' },
    { symbol: 'B', name: 'Boron', number: 5, mass: '10.811' },
    { symbol: 'C', name: 'Carbon', number: 6, mass: '12.011' },
    { symbol: 'N', name: 'Nitrogen', number: 7, mass: '14.007' },
    { symbol: 'O', name: 'Oxygen', number: 8, mass: '15.999' },
    { symbol: 'F', name: 'Fluorine', number: 9, mass: '18.998' },
    { symbol: 'Ne', name: 'Neon', number: 10, mass: '20.180' },
    { symbol: 'Na', name: 'Sodium', number: 11, mass: '22.990' },
    { symbol: 'Mg', name: 'Magnesium', number: 12, mass: '24.305' },
    { symbol: 'Al', name: 'Aluminium', number: 13, mass: '26.982' },
    { symbol: 'Si', name: 'Silicon', number: 14, mass: '28.085' },
    { symbol: 'P', name: 'Phosphorus', number: 15, mass: '30.974' },
    { symbol: 'S', name: 'Sulfur', number: 16, mass: '32.066' },
    { symbol: 'Cl', name: 'Chlorine', number: 17, mass: '35.453' },
    { symbol: 'Ar', name: 'Argon', number: 18, mass: '39.948' },
    { symbol: 'K', name: 'Potassium', number: 19, mass: '39.098' },
    { symbol: 'Ca', name: 'Calcium', number: 20, mass: '40.078' },
    { symbol: 'Sc', name: 'Scandium', number: 21, mass: '44.956' },
    { symbol: 'Ti', name: 'Titanium', number: 22, mass: '47.867' },
    { symbol: 'V', name: 'Vanadium', number: 23, mass: '50.942' },
    { symbol: 'Cr', name: 'Chromium', number: 24, mass: '51.996' },
    { symbol: 'Mn', name: 'Manganese', number: 25, mass: '54.938' },
    { symbol: 'Fe', name: 'Iron', number: 26, mass: '55.845' },
    { symbol: 'Co', name: 'Cobalt', number: 27, mass: '58.933' },
    { symbol: 'Ni', name: 'Nickel', number: 28, mass: '58.693' },
    { symbol: 'Cu', name: 'Copper', number: 29, mass: '63.546' },
    { symbol: 'Zn', name: 'Zinc', number: 30, mass: '65.380' },
    { symbol: 'Ga', name: 'Gallium', number: 31, mass: '69.723' },
    { symbol: 'Ge', name: 'Germanium', number: 32, mass: '72.630' },
    { symbol: 'As', name: 'Arsenic', number: 33, mass: '74.922' },
    { symbol: 'Se', name: 'Selenium', number: 34, mass: '78.971' },
    { symbol: 'Br', name: 'Bromine', number: 35, mass: '79.904' },
    { symbol: 'Kr', name: 'Krypton', number: 36, mass: '83.798' },
    { symbol: 'Rb', name: 'Rubidium', number: 37, mass: '85.468' },
    { symbol: 'Sr', name: 'Strontium', number: 38, mass: '87.620' },
    { symbol: 'Y', name: 'Yttrium', number: 39, mass: '88.906' },
    { symbol: 'Zr', name: 'Zirconium', number: 40, mass: '91.224' },
    { symbol: 'Nb', name: 'Niobium', number: 41, mass: '92.906' },
    { symbol: 'Mo', name: 'Molybdenum', number: 42, mass: '95.950' },
    { symbol: 'Tc', name: 'Technetium', number: 43, mass: '98.000' },
    { symbol: 'Ru', name: 'Ruthenium', number: 44, mass: '101.07' },
    { symbol: 'Rh', name: 'Rhodium', number: 45, mass: '102.91' },
    { symbol: 'Pd', name: 'Palladium', number: 46, mass: '106.42' },
    { symbol: 'Ag', name: 'Silver', number: 47, mass: '107.87' },
    { symbol: 'Cd', name: 'Cadmium', number: 48, mass: '112.41' },
    { symbol: 'In', name: 'Indium', number: 49, mass: '114.82' },
    { symbol: 'Sn', name: 'Tin', number: 50, mass: '118.71' },
    { symbol: 'Sb', name: 'Antimony', number: 51, mass: '121.76' },
    { symbol: 'Te', name: 'Tellurium', number: 52, mass: '127.60' },
    { symbol: 'I', name: 'Iodine', number: 53, mass: '126.90' },
    { symbol: 'Xe', name: 'Xenon', number: 54, mass: '131.29' },
    { symbol: 'Cs', name: 'Cesium', number: 55, mass: '132.91' },
    { symbol: 'Ba', name: 'Barium', number: 56, mass: '137.33' },
    { symbol: 'La', name: 'Lanthanum', number: 57, mass: '138.91' },
    { symbol: 'Ce', name: 'Cerium', number: 58, mass: '140.12' },
    { symbol: 'Pr', name: 'Praseodymium', number: 59, mass: '140.91' },
    { symbol: 'Nd', name: 'Neodymium', number: 60, mass: '144.24' },
    { symbol: 'Pm', name: 'Promethium', number: 61, mass: '145.00' },
    { symbol: 'Sm', name: 'Samarium', number: 62, mass: '150.36' },
    { symbol: 'Eu', name: 'Europium', number: 63, mass: '151.96' },
    { symbol: 'Gd', name: 'Gadolinium', number: 64, mass: '157.25' },
    { symbol: 'Tb', name: 'Terbium', number: 65, mass: '158.93' },
    { symbol: 'Dy', name: 'Dysprosium', number: 66, mass: '162.50' },
    { symbol: 'Ho', name: 'Holmium', number: 67, mass: '164.93' },
    { symbol: 'Er', name: 'Erbium', number: 68, mass: '167.26' },
    { symbol: 'Tm', name: 'Thulium', number: 69, mass: '168.93' },
    { symbol: 'Yb', name: 'Ytterbium', number: 70, mass: '173.05' },
    { symbol: 'Lu', name: 'Lutetium', number: 71, mass: '174.97' },
    { symbol: 'Hf', name: 'Hafnium', number: 72, mass: '178.49' },
    { symbol: 'Ta', name: 'Tantalum', number: 73, mass: '180.95' },
    { symbol: 'W', name: 'Tungsten', number: 74, mass: '183.84' },
    { symbol: 'Re', name: 'Rhenium', number: 75, mass: '186.21' },
    { symbol: 'Os', name: 'Osmium', number: 76, mass: '190.23' },
    { symbol: 'Ir', name: 'Iridium', number: 77, mass: '192.22' },
    { symbol: 'Pt', name: 'Platinum', number: 78, mass: '195.08' },
    { symbol: 'Au', name: 'Gold', number: 79, mass: '196.97' },
    { symbol: 'Hg', name: 'Mercury', number: 80, mass: '200.59' },
    { symbol: 'Tl', name: 'Thallium', number: 81, mass: '204.38' },
    { symbol: 'Pb', name: 'Lead', number: 82, mass: '207.20' },
    { symbol: 'Bi', name: 'Bismuth', number: 83, mass: '208.98' },
    { symbol: 'Po', name: 'Polonium', number: 84, mass: '209.00' },
    { symbol: 'At', name: 'Astatine', number: 85, mass: '210.00' },
    { symbol: 'Rn', name: 'Radon', number: 86, mass: '222.00' },
    { symbol: 'Fr', name: 'Francium', number: 87, mass: '223.00' },
    { symbol: 'Ra', name: 'Radium', number: 88, mass: '226.00' },
    { symbol: 'Ac', name: 'Actinium', number: 89, mass: '227.00' },
    { symbol: 'Th', name: 'Thorium', number: 90, mass: '232.04' },
    { symbol: 'Pa', name: 'Protactinium', number: 91, mass: '231.04' },
    { symbol: 'U', name: 'Uranium', number: 92, mass: '238.03' },
    { symbol: 'Np', name: 'Neptunium', number: 93, mass: '237.00' },
    { symbol: 'Pu', name: 'Plutonium', number: 94, mass: '244.00' },
    { symbol: 'Am', name: 'Americium', number: 95, mass: '243.00' },
    { symbol: 'Cm', name: 'Curium', number: 96, mass: '247.00' },
    { symbol: 'Bk', name: 'Berkelium', number: 97, mass: '247.00' },
    { symbol: 'Cf', name: 'Californium', number: 98, mass: '251.00' },
    { symbol: 'Es', name: 'Einsteinium', number: 99, mass: '252.00' },
    { symbol: 'Fm', name: 'Fermium', number: 100, mass: '257.00' },
    { symbol: 'Md', name: 'Mendelevium', number: 101, mass: '258.00' },
    { symbol: 'No', name: 'Nobelium', number: 102, mass: '259.00' },
    { symbol: 'Lr', name: 'Lawrencium', number: 103, mass: '262.00' },
    { symbol: 'Rf', name: 'Rutherfordium', number: 104, mass: '267.00' },
    { symbol: 'Db', name: 'Dubnium', number: 105, mass: '270.00' },
    { symbol: 'Sg', name: 'Seaborgium', number: 106, mass: '271.00' },
    { symbol: 'Bh', name: 'Bohrium', number: 107, mass: '274.00' },
    { symbol: 'Hs', name: 'Hassium', number: 108, mass: '277.00' },
    { symbol: 'Mt', name: 'Meitnerium', number: 109, mass: '278.00' },
    { symbol: 'Ds', name: 'Darmstadtium', number: 110, mass: '281.00' },
    { symbol: 'Rg', name: 'Roentgenium', number: 111, mass: '282.00' },
    { symbol: 'Cn', name: 'Copernicium', number: 112, mass: '285.00' },
    { symbol: 'Nh', name: 'Nihonium', number: 113, mass: '286.00' },
    { symbol: 'Fl', name: 'Flerovium', number: 114, mass: '289.00' },
    { symbol: 'Mc', name: 'Moscovium', number: 115, mass: '290.00' },
    { symbol: 'Lv', name: 'Livermorium', number: 116, mass: '293.00' },
    { symbol: 'Ts', name: 'Tennessine', number: 117, mass: '294.00' },
    { symbol: 'Og', name: 'Oganesson', number: 118, mass: '294.00' }
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
      
      case 'converter':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Value to Convert</label>
              <Input 
                type="number" 
                placeholder="Enter value" 
                value={conversionValue}
                onChange={(e) => setConversionValue(e.target.value)}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-2">
                <label className="text-sm font-medium">From</label>
                <select 
                  className="w-full p-2 border rounded-md bg-background"
                  value={conversionFrom}
                  onChange={(e) => setConversionFrom(e.target.value)}
                >
                  {Object.entries(conversions).map(([key, value]) => (
                    <option key={key} value={key}>{value.name}</option>
                  ))}
                </select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">To</label>
                <select 
                  className="w-full p-2 border rounded-md bg-background"
                  value={conversionTo}
                  onChange={(e) => setConversionTo(e.target.value)}
                >
                  {Object.entries(conversions).map(([key, value]) => (
                    <option key={key} value={key}>{value.name}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <Button onClick={convertUnits} className="w-full bg-gradient-primary">
              Convert
            </Button>
            
            {conversionResult && (
              <div className="bg-muted p-3 rounded-lg">
                <div className="text-sm text-muted-foreground">Result:</div>
                <div className="text-lg font-mono">{conversionResult}</div>
              </div>
            )}
            
            <div className="text-xs text-muted-foreground space-y-1">
              <p><strong>Common formulas:</strong></p>
              <p>• °C = (°F - 32) × 5/9</p>
              <p>• K = °C + 273.15</p>
              <p>• 1 cal = 4.184 J</p>
              <p>• 1 atm = 101325 Pa</p>
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
            <div className="text-center text-sm text-muted-foreground mb-2">
              Complete Periodic Table of Elements (1-118)
            </div>
            <div className="grid grid-cols-6 gap-1 max-h-80 overflow-y-auto">
              {periodicElements.map(element => (
                <Card key={element.symbol} className="p-1 hover:bg-accent cursor-pointer text-center">
                  <div className="text-xs text-muted-foreground">{element.number}</div>
                  <div className="font-bold text-sm">{element.symbol}</div>
                  <div className="text-xs text-muted-foreground truncate" title={element.name}>
                    {element.name}
                  </div>
                  <div className="text-xs text-muted-foreground">{element.mass}</div>
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