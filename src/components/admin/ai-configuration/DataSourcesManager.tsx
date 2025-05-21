import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Search } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { DataSource } from "@/services/ai-configuration/dataSourceService";
import { useDataSources } from "@/hooks/ai-configuration/useDataSources";
import { useDataSourceSettings } from "@/hooks/ai-configuration/useDataSourceSettings";
import { toast } from "sonner";

export interface DataSourcesManagerProps {
  standalone?: boolean;
}

export const DataSourcesManager = ({
  standalone = false,
}: DataSourcesManagerProps) => {
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
    const matchesSearch =
      !searchQuery ||
      ds.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (ds.description &&
        ds.description.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesType && matchesSearch;
  });

  const hasFilters = searchQuery !== "" || selectedType !== "all";

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Data Sources</h2>
          <p className="text-muted-foreground">
            Manage external data sources for your AI assistant
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={refreshDataSources}
            disabled={isLoading}
          >
            {isLoading ? "Refreshing..." : "Refresh"}
          </Button>
          <Button onClick={handleAddDataSource}>Add New Source</Button>
        </div>
      </div>

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
        <Select value={selectedType} onValueChange={setSelectedType}>
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

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="h-[200px] animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-muted rounded w-3/4 mb-4"></div>
                <div className="h-3 bg-muted rounded w-1/2 mb-2"></div>
                <div className="h-3 bg-muted rounded w-2/3 mb-2"></div>
                <div className="h-3 bg-muted rounded w-1/3"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredDataSources.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDataSources.map((dataSource) => (
            <Card key={dataSource.id} className="overflow-hidden">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{dataSource.name}</CardTitle>
                  <Switch checked={dataSource.isActive} disabled />
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                  {dataSource.description || "No description provided"}
                </p>
                <div className="flex gap-2 mb-2">
                  <span className="text-xs bg-muted px-2 py-1 rounded-md capitalize">
                    {dataSource.type.replace("-", " ")}
                  </span>
                  <span className="text-xs bg-muted px-2 py-1 rounded-md">
                    Priority: {dataSource.priority}
                  </span>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end gap-2 pt-0">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEditDataSource(dataSource)}
                >
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-destructive"
                  onClick={() => handleDeleteDataSource(dataSource.id)}
                >
                  Delete
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : hasFilters ? (
        <Card className="p-6">
          <div className="text-center p-8">
            <h3 className="text-xl font-medium mb-2">
              No matching data sources
            </h3>
            <p className="text-muted-foreground">
              Try adjusting your search or filter criteria
            </p>
            <Button
              className="mt-4"
              variant="outline"
              onClick={() => {
                setSearchQuery("");
                setSelectedType("all");
              }}
            >
              Clear Filters
            </Button>
          </div>
        </Card>
      ) : (
        <Card className="p-6">
          <div className="text-center p-8">
            <h3 className="text-xl font-medium mb-2">No data sources found</h3>
            <p className="text-muted-foreground">
              Add your first data source to enhance your AI assistant
            </p>
            <Button className="mt-4" onClick={handleAddDataSource}>
              Add Data Source
            </Button>
          </div>
        </Card>
      )}

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
                  handleSaveSettings({ ...settings, enabled: checked })
                }
              />
            </div>

            <div className="flex flex-col space-y-2">
              <h3 className="text-base font-medium">Data Priority</h3>
              <p className="text-sm text-muted-foreground">
                How strongly should AI prefer data sources over its own
                knowledge
              </p>
              <Select
                value={settings.priority}
                onValueChange={(value) =>
                  handleSaveSettings({
                    ...settings,
                    priority: value as "low" | "medium" | "high" | "exclusive",
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
                  handleSaveSettings({ ...settings, includeCitation: checked })
                }
                disabled={!settings.enabled}
              />
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button
            onClick={() => handleSaveSettings(settings)}
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

          <div className="py-4">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const dataSource = {
                  name: formData.get("name") as string,
                  description: formData.get("description") as string,
                  type: formData.get("type") as any,
                  isActive: formData.get("isActive") === "on",
                  priority: parseInt(formData.get("priority") as string) || 5,
                  configuration: {},
                };
                handleSaveNewDataSource(dataSource as any);
              }}
              className="space-y-4"
            >
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">
                  Name
                </label>
                <Input
                  id="name"
                  name="name"
                  required
                  placeholder="Enter data source name"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="description" className="text-sm font-medium">
                  Description
                </label>
                <Input
                  id="description"
                  name="description"
                  placeholder="Enter a brief description"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="type" className="text-sm font-medium">
                  Type
                </label>
                <Select name="type" defaultValue="knowledge-base">
                  <SelectTrigger>
                    <SelectValue placeholder="Select data source type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="database">Database</SelectItem>
                    <SelectItem value="storage">
                      Storage / Project Files
                    </SelectItem>
                    <SelectItem value="knowledge-base">
                      Knowledge Base
                    </SelectItem>
                    <SelectItem value="website">Website / URL</SelectItem>
                    <SelectItem value="file">Uploaded Files</SelectItem>
                    <SelectItem value="context">Contextual Input</SelectItem>
                    <SelectItem value="rule">Rule-based Data</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2">
                <Switch id="isActive" name="isActive" defaultChecked />
                <label htmlFor="isActive" className="text-sm font-medium">
                  Active
                </label>
              </div>

              <div className="space-y-2">
                <label htmlFor="priority" className="text-sm font-medium">
                  Priority (1-10)
                </label>
                <Input
                  id="priority"
                  name="priority"
                  type="number"
                  min="1"
                  max="10"
                  defaultValue="5"
                />
              </div>
            </form>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSaving}
              onClick={() => {
                document
                  .querySelector("form")
                  ?.dispatchEvent(
                    new Event("submit", { bubbles: true, cancelable: true }),
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
            <div className="py-4">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.currentTarget);
                  const updatedDataSource = {
                    ...currentDataSource,
                    name: formData.get("name") as string,
                    description: formData.get("description") as string,
                    type: formData.get("type") as any,
                    isActive: formData.get("isActive") === "on",
                    priority:
                      parseInt(formData.get("priority") as string) ||
                      currentDataSource.priority,
                  };
                  handleSaveEditedDataSource(updatedDataSource);
                }}
                className="space-y-4"
              >
                <div className="space-y-2">
                  <label htmlFor="edit-name" className="text-sm font-medium">
                    Name
                  </label>
                  <Input
                    id="edit-name"
                    name="name"
                    defaultValue={currentDataSource.name}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="edit-description"
                    className="text-sm font-medium"
                  >
                    Description
                  </label>
                  <Input
                    id="edit-description"
                    name="description"
                    defaultValue={currentDataSource.description || ""}
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="edit-type" className="text-sm font-medium">
                    Type
                  </label>
                  <Select name="type" defaultValue={currentDataSource.type}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select data source type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="database">Database</SelectItem>
                      <SelectItem value="storage">
                        Storage / Project Files
                      </SelectItem>
                      <SelectItem value="knowledge-base">
                        Knowledge Base
                      </SelectItem>
                      <SelectItem value="website">Website / URL</SelectItem>
                      <SelectItem value="file">Uploaded Files</SelectItem>
                      <SelectItem value="context">Contextual Input</SelectItem>
                      <SelectItem value="rule">Rule-based Data</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="edit-isActive"
                    name="isActive"
                    defaultChecked={currentDataSource.isActive}
                  />
                  <label
                    htmlFor="edit-isActive"
                    className="text-sm font-medium"
                  >
                    Active
                  </label>
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="edit-priority"
                    className="text-sm font-medium"
                  >
                    Priority (1-10)
                  </label>
                  <Input
                    id="edit-priority"
                    name="priority"
                    type="number"
                    min="1"
                    max="10"
                    defaultValue={currentDataSource.priority.toString()}
                  />
                </div>
              </form>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSaving}
              onClick={() => {
                document
                  .querySelector("form")
                  ?.dispatchEvent(
                    new Event("submit", { bubbles: true, cancelable: true }),
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
};
