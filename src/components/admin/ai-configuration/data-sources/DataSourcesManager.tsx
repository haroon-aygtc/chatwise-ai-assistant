import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Search } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DataSource } from "@/services/ai-configuration/dataSourceService";
import { DataSourcesHeader } from "./components/DataSourcesHeader";
import { DataSourcesContent } from "./components/DataSourcesContent";
import { DataSourceForm } from "./components/DataSourceForm";
import { useDataSources } from "@/hooks/ai-configuration/useDataSources";
import { useDataSourceSettings } from "@/hooks/ai-configuration/useDataSourceSettings";

interface DataSourcesManagerProps {
  standalone?: boolean;
}

export function DataSourcesManager({ standalone = false }: DataSourcesManagerProps) {
  const {
    dataSources,
    isLoading,
    isSaving,
    currentDataSource,
    showAddDialog,
    showEditDialog,
    searchQuery,
    selectedType,
    setSearchQuery,
    setSelectedType,
    setShowAddDialog,
    setShowEditDialog,
    handleAddDataSource,
    handleEditDataSource,
    handleDeleteDataSource,
    handleSaveNewDataSource,
    handleSaveEditedDataSource,
    handleTestDataSource,
    refreshDataSources,
  } = useDataSources();

  const {
    settings,
    isSaving: isSettingsSaving,
    handleSaveSettings,
  } = useDataSourceSettings();

  // Filter data sources
  const filteredDataSources = dataSources.filter((ds) => {
    const matchesType = selectedType === "all" || ds.type === selectedType;
    const matchesSearch = !searchQuery || 
      ds.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      (ds.description && ds.description.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return matchesType && matchesSearch;
  });

  const hasFilters = searchQuery !== "" || selectedType !== "all";

  return (
    <div className="space-y-6">
      <DataSourcesHeader
        standalone={standalone}
        onRefresh={refreshDataSources}
        onAddDataSource={handleAddDataSource}
        isLoading={isLoading}
      />

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search data sources..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select
          value={selectedType}
          onValueChange={setSelectedType}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="database">Database</SelectItem>
            <SelectItem value="storage">Storage Files</SelectItem>
            <SelectItem value="knowledge-base">Knowledge Base</SelectItem>
            <SelectItem value="website">Website / URL</SelectItem>
            <SelectItem value="file">Uploaded Files</SelectItem>
            <SelectItem value="context">Contextual Input</SelectItem>
            <SelectItem value="rule">Rule-based Data</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <DataSourcesContent
        dataSources={filteredDataSources}
        isLoading={isLoading}
        hasFilters={hasFilters}
        onAddDataSource={handleAddDataSource}
        onEditDataSource={handleEditDataSource}
        onDeleteDataSource={handleDeleteDataSource}
        onTestDataSource={handleTestDataSource}
      />

      <Card>
        <CardHeader>
          <CardTitle>Data Source Settings</CardTitle>
          <CardDescription>
            Configure how your AI uses external data sources
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <h3 className="text-base font-medium">Enable Data Sources</h3>
                <p className="text-sm text-muted-foreground">
                  Allow AI to use external data sources for responses
                </p>
              </div>
              <Switch 
                checked={settings.enabled} 
                onCheckedChange={(checked) => 
                  handleSaveSettings({...settings, enabled: checked})
                }
              />
            </div>

            <div className="flex flex-col space-y-2">
              <h3 className="text-base font-medium">Data Priority</h3>
              <p className="text-sm text-muted-foreground">
                How strongly should AI prefer data sources over its own knowledge
              </p>
              <Select 
                value={settings.priority} 
                onValueChange={(value) => 
                  handleSaveSettings({
                    ...settings, 
                    priority: value as 'low' | 'medium' | 'high' | 'exclusive'
                  })
                }
                disabled={!settings.enabled}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="exclusive">Exclusive</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <h3 className="text-base font-medium">Include Citations</h3>
                <p className="text-sm text-muted-foreground">
                  Add source references to AI responses
                </p>
              </div>
              <Switch 
                checked={settings.includeCitation} 
                onCheckedChange={(checked) => 
                  handleSaveSettings({...settings, includeCitation: checked})
                }
                disabled={!settings.enabled}
              />
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button 
            onClick={() => 
              handleSaveSettings(settings)
            } 
            disabled={isSettingsSaving}
          >
            {isSettingsSaving ? "Saving..." : "Save Settings"}
          </Button>
        </CardFooter>
      </Card>

      {/* Add Data Source Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Add Data Source</DialogTitle>
            <DialogDescription>
              Connect a new data source to your AI assistant
            </DialogDescription>
          </DialogHeader>
          
          <DataSourceForm 
            onSubmit={handleSaveNewDataSource}
            isSubmitting={isSaving}
          />
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setShowAddDialog(false)}
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              disabled={isSaving}
              onClick={() => {
                document.querySelector('form')?.dispatchEvent(
                  new Event('submit', { bubbles: true, cancelable: true })
                );
              }}
            >
              {isSaving ? "Adding..." : "Add Data Source"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Data Source Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Data Source</DialogTitle>
            <DialogDescription>
              Modify this data source configuration
            </DialogDescription>
          </DialogHeader>
          
          {currentDataSource && (
            <DataSourceForm 
              initialData={currentDataSource}
              onSubmit={handleSaveEditedDataSource}
              isSubmitting={isSaving}
            />
          )}
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setShowEditDialog(false)}
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              disabled={isSaving}
              onClick={() => {
                document.querySelector('form')?.dispatchEvent(
                  new Event('submit', { bubbles: true, cancelable: true })
                );
              }}
            >
              {isSaving ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default DataSourcesManager;
