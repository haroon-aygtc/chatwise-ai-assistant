
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Database, FileText, Globe, File, MessageSquare, Folder } from "lucide-react";
import { DataSourceCard } from "./DataSourceCard";
import { DataSource } from "@/services/ai-configuration/dataSourceService";

interface DataSourcesContentProps {
  dataSources: DataSource[];
  isLoading: boolean;
  hasFilters: boolean;
  onAddDataSource: () => void;
  onEditDataSource: (dataSource: DataSource) => void;
  onDeleteDataSource: (id: string) => void;
  onTestDataSource: (id: string, query: string) => Promise<any>;
}

export function DataSourcesContent({
  dataSources,
  isLoading,
  hasFilters,
  onAddDataSource,
  onEditDataSource,
  onDeleteDataSource,
  onTestDataSource,
}: DataSourcesContentProps) {
  const getSourceIcon = (type: string) => {
    switch (type) {
      case 'database':
        return <Database className="h-10 w-10 text-primary" />;
      case 'storage':
        return <Folder className="h-10 w-10 text-amber-500" />;
      case 'knowledge-base':
        return <FileText className="h-10 w-10 text-blue-500" />;
      case 'website':
        return <Globe className="h-10 w-10 text-green-500" />;
      case 'file':
        return <File className="h-10 w-10 text-purple-500" />;
      case 'context':
        return <MessageSquare className="h-10 w-10 text-pink-500" />;
      default:
        return <Database className="h-10 w-10 text-gray-500" />;
    }
  };

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-40 bg-muted rounded-md"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (dataSources.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center p-6 min-h-[300px]">
          {hasFilters ? (
            <>
              <div className="text-center mb-4">
                <Database className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-medium">No data sources found</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  No data sources match your search criteria.
                </p>
              </div>
              <Button variant="outline" onClick={() => {
                window.location.reload();
              }}>
                Clear filters
              </Button>
            </>
          ) : (
            <>
              <div className="text-center mb-4">
                <Database className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-medium">No data sources yet</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Get started by adding your first data source.
                </p>
              </div>
              <Button onClick={onAddDataSource}>
                <Plus className="mr-2 h-4 w-4" /> Add Data Source
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {dataSources.map((dataSource) => (
        <DataSourceCard
          key={dataSource.id}
          dataSource={dataSource}
          icon={getSourceIcon(dataSource.type)}
          onEdit={() => onEditDataSource(dataSource)}
          onDelete={() => onDeleteDataSource(dataSource.id)}
          onTest={onTestDataSource}
        />
      ))}
      <Card className="border-dashed cursor-pointer hover:bg-accent/50 transition-colors h-full flex items-center justify-center" onClick={onAddDataSource}>
        <CardContent className="flex flex-col items-center justify-center p-6">
          <div className="rounded-full bg-muted p-3 mb-3">
            <Plus className="h-6 w-6" />
          </div>
          <h3 className="text-lg font-medium mb-1">Add Data Source</h3>
          <p className="text-sm text-muted-foreground text-center">
            Connect a new data source to your AI assistant
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
