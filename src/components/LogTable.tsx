import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Label } from '@/components/ui/label';

export const LogTable = () => {
  const [searchValue, setSearchValue] = useState('');

  const generateLogData = () => {
    const data = [];
    for (let i = 1; i <= 100; i++) {
      data.push({
        number: i,
        log10: Math.log10(i).toFixed(4),
        ln: Math.log(i).toFixed(4),
      });
    }
    return data;
  };

  const logData = generateLogData();
  const filteredData = searchValue
    ? logData.filter(item => 
        item.number.toString().includes(searchValue) ||
        item.log10.includes(searchValue) ||
        item.ln.includes(searchValue)
      )
    : logData;

  return (
    <div className="space-y-3">
      <div>
        <Label htmlFor="search" className="text-xs">Search</Label>
        <Input
          id="search"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          placeholder="Search..."
          className="text-sm"
        />
      </div>

      <ScrollArea className="h-48">
        <div className="space-y-1">
          <div className="grid grid-cols-3 gap-2 p-2 bg-muted rounded text-xs font-semibold">
            <div>n</div>
            <div>log₁₀(n)</div>
            <div>ln(n)</div>
          </div>
          
          {filteredData.map((item) => (
            <div
              key={item.number}
              className="grid grid-cols-3 gap-2 p-2 text-xs border-b hover:bg-muted/50"
            >
              <div className="font-mono">{item.number}</div>
              <div className="font-mono text-muted-foreground">{item.log10}</div>
              <div className="font-mono text-muted-foreground">{item.ln}</div>
            </div>
          ))}
        </div>
      </ScrollArea>

      {filteredData.length === 0 && (
        <div className="text-center text-xs text-muted-foreground py-4">
          No results found
        </div>
      )}
    </div>
  );
};