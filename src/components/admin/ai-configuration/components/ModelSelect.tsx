import React, { useState, useRef, useEffect } from "react";
import { Check, ChevronsUpDown, Search, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { AIModel } from "@/types/ai-configuration";

interface ModelSelectProps {
  models: AIModel[];
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  isLoading?: boolean;
  disabled?: boolean;
  width?: string;
  highlightFetched?: boolean;
}

export function ModelSelect({
  models,
  value,
  onChange,
  placeholder = "Select a model",
  className,
  isLoading = false,
  disabled = false,
  width = "w-[280px]",
  highlightFetched = false,
}: ModelSelectProps) {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [highlightedModels, setHighlightedModels] = useState<string[]>([]);
  const popoverRef = useRef<HTMLDivElement>(null);

  // Handle highlighting of newly fetched models
  useEffect(() => {
    if (highlightFetched && models.length > 0) {
      // Assume the last 5 models are newly fetched
      const newModelIds = models.slice(-5).map(model => model.id);
      setHighlightedModels(newModelIds);
      
      // Clear highlights after 3 seconds
      const timer = setTimeout(() => {
        setHighlightedModels([]);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [models, highlightFetched]);

  // Filter models based on search term
  const filteredModels = models.filter(model => 
    model.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    model.provider.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (model.description && model.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Get the selected model
  const selectedModel = models.find(model => model.id === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "justify-between",
            width,
            className,
            isLoading && "animate-pulse"
          )}
          disabled={disabled || isLoading}
        >
          {selectedModel ? (
            <div className="flex items-center gap-2 truncate">
              <span className="truncate">{selectedModel.name}</span>
              <Badge variant="outline" className="ml-2 truncate max-w-[100px]">
                {selectedModel.provider}
              </Badge>
            </div>
          ) : (
            <span className="text-muted-foreground">{placeholder}</span>
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className={cn("p-0", width)}
        align="start"
        ref={popoverRef}
      >
        <Command>
          <div className="flex items-center border-b px-3">
            <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
            <CommandInput
              placeholder="Search models..."
              className="h-9 border-0 outline-none focus:ring-0"
              value={searchTerm}
              onValueChange={setSearchTerm}
            />
            {searchTerm && (
              <Button
                variant="ghost"
                size="sm"
                className="h-5 w-5 p-0 rounded-full"
                onClick={() => setSearchTerm("")}
              >
                <X className="h-3 w-3" />
              </Button>
            )}
          </div>
          <CommandList>
            <CommandEmpty>No models found.</CommandEmpty>
            <CommandGroup>
              {filteredModels.map((model) => (
                <CommandItem
                  key={model.id}
                  value={model.id}
                  onSelect={() => {
                    onChange(model.id);
                    setOpen(false);
                  }}
                  className={cn(
                    "flex items-center justify-between py-2",
                    highlightedModels.includes(model.id) && "bg-primary/5 animate-pulse"
                  )}
                >
                  <div className="flex flex-col">
                    <span className="font-medium">{model.name}</span>
                    <span className="text-xs text-muted-foreground truncate max-w-[200px]">
                      {model.description || "No description"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="truncate max-w-[80px]">
                      {model.provider}
                    </Badge>
                    {model.id === value && (
                      <Check className="h-4 w-4 text-primary" />
                    )}
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
