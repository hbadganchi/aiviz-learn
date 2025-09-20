import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { 
  Search, 
  Filter, 
  X, 
  Calendar,
  Tag,
  Star,
  FileText,
  Image,
  FileIcon,
  SortAsc,
  SortDesc
} from "lucide-react";

interface SearchFilters {
  query: string;
  subjects: string[];
  tags: string[];
  fileTypes: string[];
  dateRange: 'all' | 'today' | 'week' | 'month';
  favorites: boolean;
  sortBy: 'date' | 'title' | 'progress';
  sortOrder: 'asc' | 'desc';
}

interface SearchAndFilterProps {
  filters: SearchFilters;
  onFiltersChange: (filters: SearchFilters) => void;
  availableSubjects: Array<{ id: string; name: string; color: string }>;
  availableTags: string[];
  className?: string;
}

export const SearchAndFilter = ({
  filters,
  onFiltersChange,
  availableSubjects,
  availableTags,
  className
}: SearchAndFilterProps) => {
  const [showFilters, setShowFilters] = useState(false);

  const updateFilters = (updates: Partial<SearchFilters>) => {
    onFiltersChange({ ...filters, ...updates });
  };

  const toggleSubject = (subjectId: string) => {
    const newSubjects = filters.subjects.includes(subjectId)
      ? filters.subjects.filter(s => s !== subjectId)
      : [...filters.subjects, subjectId];
    updateFilters({ subjects: newSubjects });
  };

  const toggleTag = (tag: string) => {
    const newTags = filters.tags.includes(tag)
      ? filters.tags.filter(t => t !== tag)
      : [...filters.tags, tag];
    updateFilters({ tags: newTags });
  };

  const toggleFileType = (fileType: string) => {
    const newTypes = filters.fileTypes.includes(fileType)
      ? filters.fileTypes.filter(t => t !== fileType)
      : [...filters.fileTypes, fileType];
    updateFilters({ fileTypes: newTypes });
  };

  const clearAllFilters = () => {
    updateFilters({
      query: '',
      subjects: [],
      tags: [],
      fileTypes: [],
      dateRange: 'all',
      favorites: false,
      sortBy: 'date',
      sortOrder: 'desc'
    });
  };

  const getActiveFilterCount = () => {
    return filters.subjects.length + 
           filters.tags.length + 
           filters.fileTypes.length + 
           (filters.dateRange !== 'all' ? 1 : 0) +
           (filters.favorites ? 1 : 0);
  };

  const fileTypeOptions = [
    { id: 'pdf', label: 'PDF', icon: FileText },
    { id: 'image', label: 'Images', icon: Image },
    { id: 'text', label: 'Text', icon: FileIcon },
    { id: 'epub', label: 'EPUB', icon: FileText }
  ];

  const dateRangeOptions = [
    { id: 'all', label: 'All Time' },
    { id: 'today', label: 'Today' },
    { id: 'week', label: 'This Week' },
    { id: 'month', label: 'This Month' }
  ];

  return (
    <Card className={`shadow-medium ${className}`}>
      <div className="p-4 space-y-4">
        {/* Search Bar */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search notes, descriptions, and content..."
              value={filters.query}
              onChange={(e) => updateFilters({ query: e.target.value })}
              className="pl-10"
            />
          </div>
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="relative"
          >
            <Filter className="w-4 h-4" />
            {getActiveFilterCount() > 0 && (
              <Badge 
                variant="destructive" 
                className="absolute -top-2 -right-2 w-5 h-5 p-0 flex items-center justify-center text-xs"
              >
                {getActiveFilterCount()}
              </Badge>
            )}
          </Button>
        </div>

        {/* Active Filters */}
        {getActiveFilterCount() > 0 && (
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-xs text-muted-foreground">Filters:</span>
            {filters.subjects.map(subjectId => {
              const subject = availableSubjects.find(s => s.id === subjectId);
              return subject ? (
                <Badge key={subjectId} variant="secondary" className="text-xs">
                  {subject.name}
                  <X 
                    className="w-3 h-3 ml-1 cursor-pointer" 
                    onClick={() => toggleSubject(subjectId)}
                  />
                </Badge>
              ) : null;
            })}
            {filters.tags.map(tag => (
              <Badge key={tag} variant="outline" className="text-xs">
                <Tag className="w-3 h-3 mr-1" />
                {tag}
                <X 
                  className="w-3 h-3 ml-1 cursor-pointer" 
                  onClick={() => toggleTag(tag)}
                />
              </Badge>
            ))}
            {filters.favorites && (
              <Badge variant="secondary" className="text-xs">
                <Star className="w-3 h-3 mr-1 fill-current" />
                Favorites
                <X 
                  className="w-3 h-3 ml-1 cursor-pointer" 
                  onClick={() => updateFilters({ favorites: false })}
                />
              </Badge>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAllFilters}
              className="text-xs h-6 px-2"
            >
              Clear All
            </Button>
          </div>
        )}

        {/* Extended Filters */}
        {showFilters && (
          <>
            <Separator />
            <div className="space-y-4">
              {/* Subjects */}
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Subjects</h4>
                <div className="flex flex-wrap gap-2">
                  {availableSubjects.map(subject => (
                    <Button
                      key={subject.id}
                      variant={filters.subjects.includes(subject.id) ? "default" : "outline"}
                      size="sm"
                      onClick={() => toggleSubject(subject.id)}
                      className="text-xs"
                    >
                      <div className={`w-3 h-3 ${subject.color} rounded-sm mr-2`} />
                      {subject.name}
                    </Button>
                  ))}
                </div>
              </div>

              {/* File Types */}
              <div className="space-y-2">
                <h4 className="text-sm font-medium">File Types</h4>
                <div className="flex flex-wrap gap-2">
                  {fileTypeOptions.map(fileType => {
                    const Icon = fileType.icon;
                    return (
                      <Button
                        key={fileType.id}
                        variant={filters.fileTypes.includes(fileType.id) ? "default" : "outline"}
                        size="sm"
                        onClick={() => toggleFileType(fileType.id)}
                        className="text-xs"
                      >
                        <Icon className="w-3 h-3 mr-2" />
                        {fileType.label}
                      </Button>
                    );
                  })}
                </div>
              </div>

              {/* Tags */}
              {availableTags.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Tags</h4>
                  <div className="flex flex-wrap gap-2">
                    {availableTags.slice(0, 10).map(tag => (
                      <Button
                        key={tag}
                        variant={filters.tags.includes(tag) ? "default" : "outline"}
                        size="sm"
                        onClick={() => toggleTag(tag)}
                        className="text-xs"
                      >
                        <Tag className="w-3 h-3 mr-1" />
                        {tag}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {/* Date Range & Special Filters */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Date Range</h4>
                  <div className="flex flex-wrap gap-2">
                    {dateRangeOptions.map(option => (
                      <Button
                        key={option.id}
                        variant={filters.dateRange === option.id ? "default" : "outline"}
                        size="sm"
                        onClick={() => updateFilters({ dateRange: option.id as any })}
                        className="text-xs"
                      >
                        <Calendar className="w-3 h-3 mr-1" />
                        {option.label}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Sort & Filter</h4>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant={filters.favorites ? "default" : "outline"}
                      size="sm"
                      onClick={() => updateFilters({ favorites: !filters.favorites })}
                      className="text-xs"
                    >
                      <Star className="w-3 h-3 mr-1" />
                      Favorites
                    </Button>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateFilters({ 
                        sortOrder: filters.sortOrder === 'asc' ? 'desc' : 'asc' 
                      })}
                      className="text-xs"
                    >
                      {filters.sortOrder === 'asc' ? <SortAsc className="w-3 h-3" /> : <SortDesc className="w-3 h-3" />}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </Card>
  );
};