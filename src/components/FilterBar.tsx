import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export type SortOption = 
  | "none"
  | "affection-high"
  | "affection-low"
  | "energy-high"
  | "energy-low"
  | "intelligence-high"
  | "intelligence-low"
  | "social-high"
  | "social-low";

interface FilterBarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  sortBy: SortOption;
  onSortChange: (value: SortOption) => void;
}

const FilterBar = ({ searchQuery, onSearchChange, sortBy, onSortChange }: FilterBarProps) => {
  return (
    <div className="w-full max-w-4xl mx-auto mb-8">
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search cat breeds..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 h-12 text-base shadow-sm"
          />
        </div>
        <Select value={sortBy} onValueChange={onSortChange}>
          <SelectTrigger className="w-[200px] h-12">
            <SelectValue placeholder="Sort by..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">No sorting</SelectItem>
            <SelectItem value="affection-high">Affection (High-Low)</SelectItem>
            <SelectItem value="affection-low">Affection (Low-High)</SelectItem>
            <SelectItem value="energy-high">Energy (High-Low)</SelectItem>
            <SelectItem value="energy-low">Energy (Low-High)</SelectItem>
            <SelectItem value="intelligence-high">Intelligence (High-Low)</SelectItem>
            <SelectItem value="intelligence-low">Intelligence (Low-High)</SelectItem>
            <SelectItem value="social-high">Social Needs (High-Low)</SelectItem>
            <SelectItem value="social-low">Social Needs (Low-High)</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default FilterBar;
