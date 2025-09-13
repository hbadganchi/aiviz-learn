import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Plus, X, Tag, Hash } from "lucide-react";

interface TagManagerProps {
  tags: string[];
  onTagsChange: (tags: string[]) => void;
  availableTags?: string[];
  placeholder?: string;
  maxTags?: number;
  className?: string;
}

export const TagManager = ({
  tags,
  onTagsChange,
  availableTags = [],
  placeholder = "Add tags...",
  maxTags = 10,
  className
}: TagManagerProps) => {
  const [inputValue, setInputValue] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const { toast } = useToast();

  const addTag = (tagName: string) => {
    const cleanTag = tagName.trim().toLowerCase();
    
    if (!cleanTag) return;
    
    if (tags.length >= maxTags) {
      toast({
        title: "Maximum tags reached",
        description: `You can only add up to ${maxTags} tags.`,
        variant: "destructive",
      });
      return;
    }
    
    if (tags.includes(cleanTag)) {
      toast({
        title: "Tag already exists",
        description: "This tag has already been added.",
        variant: "destructive",
      });
      return;
    }
    
    onTagsChange([...tags, cleanTag]);
    setInputValue("");
    setShowSuggestions(false);
  };

  const removeTag = (tagToRemove: string) => {
    onTagsChange(tags.filter(tag => tag !== tagToRemove));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag(inputValue);
    } else if (e.key === 'Backspace' && !inputValue && tags.length > 0) {
      removeTag(tags[tags.length - 1]);
    }
  };

  const getSuggestions = () => {
    if (!inputValue) return availableTags.slice(0, 8);
    
    return availableTags
      .filter(tag => 
        tag.toLowerCase().includes(inputValue.toLowerCase()) && 
        !tags.includes(tag)
      )
      .slice(0, 8);
  };

  const commonTags = [
    "formulas", "diagrams", "definitions", "examples", "theory", 
    "practice", "equations", "concepts", "notes", "summary",
    "important", "review", "quiz", "homework", "exam-prep"
  ];

  return (
    <Card className={`p-4 space-y-3 ${className}`}>
      <div className="flex items-center gap-2">
        <Tag className="w-4 h-4 text-muted-foreground" />
        <span className="text-sm font-medium">Tags</span>
        <Badge variant="outline" className="text-xs">
          {tags.length}/{maxTags}
        </Badge>
      </div>

      {/* Current Tags */}
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {tags.map((tag, index) => (
            <Badge key={index} variant="secondary" className="text-xs group">
              <Hash className="w-3 h-3 mr-1" />
              {tag}
              <X 
                className="w-3 h-3 ml-1 cursor-pointer opacity-60 group-hover:opacity-100" 
                onClick={() => removeTag(tag)}
              />
            </Badge>
          ))}
        </div>
      )}

      {/* Tag Input */}
      <div className="relative">
        <div className="flex gap-2">
          <Input
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value);
              setShowSuggestions(true);
            }}
            onKeyDown={handleKeyPress}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            placeholder={placeholder}
            className="text-sm"
            disabled={tags.length >= maxTags}
          />
          <Button
            size="sm"
            onClick={() => addTag(inputValue)}
            disabled={!inputValue.trim() || tags.length >= maxTags}
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>

        {/* Suggestions Dropdown */}
        {showSuggestions && (getSuggestions().length > 0 || commonTags.length > 0) && (
          <Card className="absolute top-full left-0 right-0 mt-1 z-50 max-h-48 overflow-y-auto shadow-elegant">
            <div className="p-2 space-y-2">
              {inputValue && getSuggestions().length > 0 && (
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground px-2">Matching tags</p>
                  {getSuggestions().map((tag, index) => (
                    <Button
                      key={index}
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start text-xs h-8"
                      onClick={() => addTag(tag)}
                    >
                      <Hash className="w-3 h-3 mr-2" />
                      {tag}
                    </Button>
                  ))}
                </div>
              )}
              
              {!inputValue && (
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground px-2">Common tags</p>
                  {commonTags
                    .filter(tag => !tags.includes(tag))
                    .slice(0, 6)
                    .map((tag, index) => (
                      <Button
                        key={index}
                        variant="ghost"
                        size="sm"
                        className="w-full justify-start text-xs h-8"
                        onClick={() => addTag(tag)}
                      >
                        <Hash className="w-3 h-3 mr-2" />
                        {tag}
                      </Button>
                    ))
                  }
                </div>
              )}
            </div>
          </Card>
        )}
      </div>

      {/* Quick Add Common Tags */}
      {tags.length === 0 && (
        <div className="space-y-2">
          <p className="text-xs text-muted-foreground">Quick add:</p>
          <div className="flex flex-wrap gap-2">
            {commonTags.slice(0, 5).map((tag, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                onClick={() => addTag(tag)}
                className="text-xs h-7"
              >
                <Plus className="w-3 h-3 mr-1" />
                {tag}
              </Button>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
};