import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Search, Atom, Zap, Flame, Droplets, Wind } from "lucide-react";

interface Element {
  symbol: string;
  name: string;
  atomicNumber: number;
  atomicMass: number;
  group: number;
  period: number;
  category: string;
  electronConfiguration: string;
  description: string;
  color: string;
}

const elements: Element[] = [
  { symbol: 'H', name: 'Hydrogen', atomicNumber: 1, atomicMass: 1.008, group: 1, period: 1, category: 'Nonmetal', electronConfiguration: '1s¹', description: 'The lightest and most abundant element in the universe.', color: 'bg-red-100 hover:bg-red-200 border-red-300' },
  { symbol: 'He', name: 'Helium', atomicNumber: 2, atomicMass: 4.003, group: 18, period: 1, category: 'Noble Gas', electronConfiguration: '1s²', description: 'Second lightest element, chemically inert noble gas.', color: 'bg-purple-100 hover:bg-purple-200 border-purple-300' },
  { symbol: 'Li', name: 'Lithium', atomicNumber: 3, atomicMass: 6.941, group: 1, period: 2, category: 'Alkali Metal', electronConfiguration: '[He] 2s¹', description: 'Lightest metal, used in batteries and mood stabilizers.', color: 'bg-blue-100 hover:bg-blue-200 border-blue-300' },
  { symbol: 'Be', name: 'Beryllium', atomicNumber: 4, atomicMass: 9.012, group: 2, period: 2, category: 'Alkaline Earth Metal', electronConfiguration: '[He] 2s²', description: 'Light, strong metal used in aerospace applications.', color: 'bg-green-100 hover:bg-green-200 border-green-300' },
  { symbol: 'B', name: 'Boron', atomicNumber: 5, atomicMass: 10.811, group: 13, period: 2, category: 'Metalloid', electronConfiguration: '[He] 2s² 2p¹', description: 'Metalloid essential for plant growth.', color: 'bg-yellow-100 hover:bg-yellow-200 border-yellow-300' },
  { symbol: 'C', name: 'Carbon', atomicNumber: 6, atomicMass: 12.011, group: 14, period: 2, category: 'Nonmetal', electronConfiguration: '[He] 2s² 2p²', description: 'Basis of all organic compounds and life.', color: 'bg-red-100 hover:bg-red-200 border-red-300' },
  { symbol: 'N', name: 'Nitrogen', atomicNumber: 7, atomicMass: 14.007, group: 15, period: 2, category: 'Nonmetal', electronConfiguration: '[He] 2s² 2p³', description: 'Makes up 78% of Earth\'s atmosphere.', color: 'bg-red-100 hover:bg-red-200 border-red-300' },
  { symbol: 'O', name: 'Oxygen', atomicNumber: 8, atomicMass: 15.999, group: 16, period: 2, category: 'Nonmetal', electronConfiguration: '[He] 2s² 2p⁴', description: 'Essential for respiration and combustion.', color: 'bg-red-100 hover:bg-red-200 border-red-300' },
  { symbol: 'F', name: 'Fluorine', atomicNumber: 9, atomicMass: 18.998, group: 17, period: 2, category: 'Halogen', electronConfiguration: '[He] 2s² 2p⁵', description: 'Most electronegative element, used in toothpaste.', color: 'bg-orange-100 hover:bg-orange-200 border-orange-300' },
  { symbol: 'Ne', name: 'Neon', atomicNumber: 10, atomicMass: 20.180, group: 18, period: 2, category: 'Noble Gas', electronConfiguration: '[He] 2s² 2p⁶', description: 'Noble gas used in neon signs and lighting.', color: 'bg-purple-100 hover:bg-purple-200 border-purple-300' },
  { symbol: 'Na', name: 'Sodium', atomicNumber: 11, atomicMass: 22.990, group: 1, period: 3, category: 'Alkali Metal', electronConfiguration: '[Ne] 3s¹', description: 'Essential electrolyte, component of table salt.', color: 'bg-blue-100 hover:bg-blue-200 border-blue-300' },
  { symbol: 'Mg', name: 'Magnesium', atomicNumber: 12, atomicMass: 24.305, group: 2, period: 3, category: 'Alkaline Earth Metal', electronConfiguration: '[Ne] 3s²', description: 'Light metal used in alloys and supplements.', color: 'bg-green-100 hover:bg-green-200 border-green-300' },
  { symbol: 'Al', name: 'Aluminum', atomicNumber: 13, atomicMass: 26.982, group: 13, period: 3, category: 'Post-transition Metal', electronConfiguration: '[Ne] 3s² 3p¹', description: 'Lightweight, corrosion-resistant metal.', color: 'bg-gray-100 hover:bg-gray-200 border-gray-300' },
  { symbol: 'Si', name: 'Silicon', atomicNumber: 14, atomicMass: 28.085, group: 14, period: 3, category: 'Metalloid', electronConfiguration: '[Ne] 3s² 3p²', description: 'Semiconductor material, basis of computer chips.', color: 'bg-yellow-100 hover:bg-yellow-200 border-yellow-300' },
  { symbol: 'P', name: 'Phosphorus', atomicNumber: 15, atomicMass: 30.974, group: 15, period: 3, category: 'Nonmetal', electronConfiguration: '[Ne] 3s² 3p³', description: 'Essential for DNA, RNA, and energy storage.', color: 'bg-red-100 hover:bg-red-200 border-red-300' },
  { symbol: 'S', name: 'Sulfur', atomicNumber: 16, atomicMass: 32.065, group: 16, period: 3, category: 'Nonmetal', electronConfiguration: '[Ne] 3s² 3p⁴', description: 'Component of proteins and many minerals.', color: 'bg-red-100 hover:bg-red-200 border-red-300' },
  { symbol: 'Cl', name: 'Chlorine', atomicNumber: 17, atomicMass: 35.453, group: 17, period: 3, category: 'Halogen', electronConfiguration: '[Ne] 3s² 3p⁵', description: 'Disinfectant and component of table salt.', color: 'bg-orange-100 hover:bg-orange-200 border-orange-300' },
  { symbol: 'Ar', name: 'Argon', atomicNumber: 18, atomicMass: 39.948, group: 18, period: 3, category: 'Noble Gas', electronConfiguration: '[Ne] 3s² 3p⁶', description: 'Inert gas used in welding and light bulbs.', color: 'bg-purple-100 hover:bg-purple-200 border-purple-300' },
  { symbol: 'K', name: 'Potassium', atomicNumber: 19, atomicMass: 39.098, group: 1, period: 4, category: 'Alkali Metal', electronConfiguration: '[Ar] 4s¹', description: 'Essential electrolyte for nerve and muscle function.', color: 'bg-blue-100 hover:bg-blue-200 border-blue-300' },
  { symbol: 'Ca', name: 'Calcium', atomicNumber: 20, atomicMass: 40.078, group: 2, period: 4, category: 'Alkaline Earth Metal', electronConfiguration: '[Ar] 4s²', description: 'Essential for bones, teeth, and muscle function.', color: 'bg-green-100 hover:bg-green-200 border-green-300' },
];

const categories = [
  { name: 'All', icon: Atom, color: 'bg-gray-100' },
  { name: 'Alkali Metal', icon: Zap, color: 'bg-blue-100' },
  { name: 'Alkaline Earth Metal', icon: Flame, color: 'bg-green-100' },
  { name: 'Nonmetal', icon: Wind, color: 'bg-red-100' },
  { name: 'Noble Gas', icon: Droplets, color: 'bg-purple-100' },
  { name: 'Halogen', icon: Flame, color: 'bg-orange-100' },
  { name: 'Metalloid', icon: Atom, color: 'bg-yellow-100' },
];

interface PeriodicTableProps {
  className?: string;
}

export const PeriodicTable = ({ className }: PeriodicTableProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedElement, setSelectedElement] = useState<Element | null>(null);

  const filteredElements = elements.filter(element => {
    const matchesSearch = element.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         element.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         element.atomicNumber.toString().includes(searchTerm);
    const matchesCategory = selectedCategory === 'All' || element.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getElementPosition = (element: Element) => {
    // Simplified positioning for demonstration
    const row = element.period;
    let col = element.group;
    
    // Adjust for special cases
    if (element.period === 1) {
      col = element.atomicNumber === 1 ? 1 : 18;
    }
    
    return { row, col };
  };

  return (
    <Card className={`shadow-medium h-full flex flex-col ${className}`}>
      <div className="p-4 space-y-4">
        {/* Header */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
            <Atom className="w-4 h-4 text-primary-foreground" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Periodic Table</h3>
            <p className="text-xs text-muted-foreground">Interactive element explorer</p>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search elements..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <Button
                key={category.name}
                onClick={() => setSelectedCategory(category.name)}
                variant={selectedCategory === category.name ? "default" : "outline"}
                size="sm"
                className={`interactive ${selectedCategory === category.name ? 'bg-gradient-primary' : ''}`}
              >
                <Icon className="w-3 h-3 mr-1" />
                {category.name}
              </Button>
            );
          })}
        </div>

        <Separator />
      </div>

      {/* Elements Grid */}
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full px-4">
          <div className="grid grid-cols-6 gap-2 pb-4">
            {filteredElements.map((element) => (
              <Card
                key={element.symbol}
                className={`p-2 cursor-pointer transition-all duration-200 ${element.color} border-2 interactive`}
                onClick={() => setSelectedElement(element)}
              >
                <div className="text-center">
                  <div className="text-xs text-muted-foreground">{element.atomicNumber}</div>
                  <div className="text-lg font-bold text-foreground">{element.symbol}</div>
                  <div className="text-xs text-foreground truncate">{element.name}</div>
                  <div className="text-xs text-muted-foreground">{element.atomicMass}</div>
                </div>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Element Details Dialog */}
      <Dialog open={!!selectedElement} onOpenChange={() => setSelectedElement(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${selectedElement?.color}`}>
                <span className="text-xl font-bold">{selectedElement?.symbol}</span>
              </div>
              <div>
                <h3 className="text-xl font-bold">{selectedElement?.name}</h3>
                <p className="text-sm text-muted-foreground">Atomic Number {selectedElement?.atomicNumber}</p>
              </div>
            </DialogTitle>
          </DialogHeader>
          
          {selectedElement && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Atomic Mass</p>
                  <p className="text-lg font-semibold">{selectedElement.atomicMass}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Category</p>
                  <Badge variant="secondary">{selectedElement.category}</Badge>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Group</p>
                  <p className="text-lg font-semibold">{selectedElement.group}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Period</p>
                  <p className="text-lg font-semibold">{selectedElement.period}</p>
                </div>
              </div>
              
              <Separator />
              
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">Electron Configuration</p>
                <p className="text-sm font-mono bg-muted p-2 rounded">{selectedElement.electronConfiguration}</p>
              </div>
              
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">Description</p>
                <p className="text-sm text-foreground">{selectedElement.description}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </Card>
  );
};