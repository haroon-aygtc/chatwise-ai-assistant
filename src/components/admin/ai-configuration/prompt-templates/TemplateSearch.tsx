
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface CategoryOption {
  id: string;
  name: string;
}

interface TemplateSearchProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  categoryOptions: CategoryOption[];
  onAddTemplate: () => void;
}

export const TemplateSearch = ({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  categoryOptions,
  onAddTemplate,
}: TemplateSearchProps) => {
  return (
    <div className="flex flex-col md:flex-row gap-4 justify-between">
      <div className="relative flex-1">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search templates..."
          className="pl-8"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      <div className="flex gap-2">
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categoryOptions.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button onClick={onAddTemplate}>
          <Plus className="mr-2 h-4 w-4" /> Add Template
        </Button>
      </div>
    </div>
  );
};
