import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface FilterBarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

const FilterBar = ({ searchQuery, onSearchChange }: FilterBarProps) => {
  return (
    <div className="w-full max-w-2xl mx-auto mb-8">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search cat breeds..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 h-12 text-base shadow-sm"
        />
      </div>
    </div>
  );
};

export default FilterBar;
