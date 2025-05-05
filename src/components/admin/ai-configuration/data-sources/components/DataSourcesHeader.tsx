
import { Button } from "@/components/ui/button";
import { RefreshCw, Plus } from "lucide-react";

interface DataSourcesHeaderProps {
  onRefresh: () => void;
  onAddDataSource: () => void;
  isLoading: boolean;
  standalone?: boolean;
}

export function DataSourcesHeader({
  onRefresh,
  onAddDataSource,
  isLoading,
  standalone = false,
}: DataSourcesHeaderProps) {
  if (!standalone) return null;
  
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold">Data Sources</h1>
        <p className="text-muted-foreground">
          Configure and manage data sources for your AI assistant
        </p>
      </div>
      <div className="flex gap-2">
        <Button
          variant="outline"
          onClick={onRefresh}
          disabled={isLoading}
        >
          <RefreshCw
            className={`mr-2 h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
          />
          Refresh
        </Button>
        <Button onClick={onAddDataSource}>
          <Plus className="mr-2 h-4 w-4" /> Add Data Source
        </Button>
      </div>
    </div>
  );
}
