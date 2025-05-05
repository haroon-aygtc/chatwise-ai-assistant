
import { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Textarea } from "@/components/ui/textarea";
import { Edit, Trash2, Play, AlertCircle } from "lucide-react";
import { DataSource } from "@/services/ai-configuration/dataSourceService";

interface DataSourceCardProps {
  dataSource: DataSource;
  icon: React.ReactNode;
  onEdit: () => void;
  onDelete: () => void;
  onTest: (id: string, query: string) => Promise<{
    result: string;
    sources: Array<{ title: string; url?: string }>;
  }>;
}

export function DataSourceCard({
  dataSource,
  icon,
  onEdit,
  onDelete,
  onTest,
}: DataSourceCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [testQuery, setTestQuery] = useState("");
  const [testResult, setTestResult] = useState<{
    result: string;
    sources: Array<{ title: string; url?: string }>;
  } | null>(null);
  const [isTesting, setIsTesting] = useState(false);
  const [testError, setTestError] = useState<string | null>(null);

  const handleTest = async () => {
    if (!testQuery.trim()) return;
    
    setIsTesting(true);
    setTestError(null);
    
    try {
      const result = await onTest(dataSource.id, testQuery);
      setTestResult(result);
    } catch (error) {
      setTestError(error instanceof Error ? error.message : "Failed to test data source");
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-0">
        <div className="flex justify-between items-start mb-2">
          <div className="flex items-center space-x-2">
            {icon}
            <Badge variant={dataSource.isActive ? "default" : "outline"}>
              {dataSource.isActive ? "Active" : "Inactive"}
            </Badge>
          </div>
          <Switch 
            checked={dataSource.isActive} 
            disabled 
            aria-label="Toggle data source"
          />
        </div>
        <CardTitle className="text-xl truncate">{dataSource.name}</CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
          {dataSource.description || "No description provided"}
        </p>
        
        <div className="flex flex-wrap gap-1 mb-4">
          <Badge variant="outline" className="capitalize">
            {dataSource.type.replace('-', ' ')}
          </Badge>
          {dataSource.priority > 0 && (
            <Badge variant="secondary">
              Priority: {dataSource.priority}
            </Badge>
          )}
        </div>

        {isExpanded && (
          <div className="mt-4 space-y-4 border-t pt-4">
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Test this data source</h4>
              <Textarea
                placeholder="Enter a query to test this data source..."
                value={testQuery}
                onChange={(e) => setTestQuery(e.target.value)}
                rows={2}
              />
              <Button 
                size="sm" 
                onClick={handleTest} 
                disabled={isTesting || !testQuery.trim()}
                className="w-full"
              >
                {isTesting ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                    Testing...
                  </>
                ) : (
                  <>
                    <Play className="mr-2 h-4 w-4" /> Test Query
                  </>
                )}
              </Button>
              
              {testError && (
                <Alert variant="destructive" className="mt-2">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{testError}</AlertDescription>
                </Alert>
              )}
              
              {testResult && (
                <div className="mt-4 space-y-2 bg-muted/30 p-2 rounded-md">
                  <div>
                    <h5 className="text-xs font-medium">Result:</h5>
                    <p className="text-sm mt-1">{testResult.result}</p>
                  </div>
                  
                  {testResult.sources.length > 0 && (
                    <div>
                      <h5 className="text-xs font-medium">Sources:</h5>
                      <ul className="text-xs mt-1 space-y-1">
                        {testResult.sources.map((source, index) => (
                          <li key={index} className="truncate">
                            {source.url ? (
                              <a href={source.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                                {source.title}
                              </a>
                            ) : (
                              source.title
                            )}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between pt-2 pb-4">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? "Show Less" : "Show More"}
        </Button>
        <div className="flex space-x-2">
          <Button variant="outline" size="icon" onClick={onEdit}>
            <Edit className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" className="text-destructive" onClick={onDelete}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
