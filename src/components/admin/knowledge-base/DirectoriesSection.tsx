import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, Search, Plus, PenLine, Trash2, FolderIcon, RefreshCw, AlertCircle } from "lucide-react";
import { KnowledgeResource, ResourceType, CreateResourceRequest, CreateDirectoryRequest, ResourceCollection } from "@/types/knowledge-base";
import { format } from "date-fns";
import { useKnowledgeBase } from "@/hooks/knowledge-base/useKnowledgeBase";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { ResourceDialog } from "./dialogs/ResourceDialog";

interface DirectoriesSectionProps {
    resources: KnowledgeResource[];
    isLoading: boolean;
    searchQuery: string;
    onSearchChange: (query: string) => void;
    selectedResourceId: string | null;
    onSelectResource: (id: string) => void;
    onDeleteResource: (id: string) => void;
    isError: boolean;
    currentPage?: number;
    onPageChange?: (page: number) => void;
}

export function DirectoriesSection({
    resources,
    isLoading,
    searchQuery,
    onSearchChange,
    selectedResourceId,
    onSelectResource,
    onDeleteResource,
    isError,
    currentPage = 1,
    onPageChange,
}: DirectoriesSectionProps) {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery);

    const { handleAddResource, handleUpdateResource, handleDeleteResource, handleSyncDirectory, collections } = useKnowledgeBase();

    // Filter resources based on search query
    const filteredResources = localSearchQuery
        ? resources.filter((resource) =>
            resource.title.toLowerCase().includes(localSearchQuery.toLowerCase()) ||
            resource.description.toLowerCase().includes(localSearchQuery.toLowerCase()) ||
            resource.tags.some(tag => tag.toLowerCase().includes(localSearchQuery.toLowerCase()))
        )
        : resources;

    const selectedResource = resources.find(
        (resource) => resource.id === selectedResourceId
    );

    const handleOpenDialogForEdit = () => {
        setIsEditing(true);
        setIsDialogOpen(true);
    };

    const handleOpenDialogForAdd = () => {
        setIsEditing(false);
        setIsDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setIsDialogOpen(false);
        setIsEditing(false);
    };

    const handleDelete = (id: string) => {
        if (confirm("Are you sure you want to delete this directory? This will remove access to all files in this directory.")) {
            handleDeleteResource(id);
            if (selectedResourceId === id) {
                onSelectResource("");
            }
        }
    };

    const handleSync = (id: string) => {
        handleSyncDirectory(id);
    };

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setLocalSearchQuery(e.target.value);
        onSearchChange(e.target.value);
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-40">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <span className="ml-2 text-muted-foreground font-medium">Loading directories...</span>
            </div>
        );
    }

    if (isError) {
        return (
            <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>
                    Failed to load directories. Please try refreshing the page.
                </AlertDescription>
            </Alert>
        );
    }

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <div className="flex-1 max-w-md">
                    <div className="relative">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            type="search"
                            placeholder="Search directories..."
                            className="pl-8"
                            value={localSearchQuery}
                            onChange={handleSearch}
                        />
                    </div>
                </div>
                <Button onClick={handleOpenDialogForAdd}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Directory
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1">
                    <ScrollArea className="h-[calc(100vh-250px)]">
                        {filteredResources.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-40 text-center">
                                <p className="text-muted-foreground">No directories found</p>
                                <p className="text-sm text-muted-foreground">
                                    Add a directory to include files from your filesystem
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                {filteredResources.map((resource) => (
                                    <Card
                                        key={resource.id}
                                        className={`cursor-pointer hover:border-primary/50 transition-colors ${selectedResourceId === resource.id ? "border-primary" : ""
                                            }`}
                                        onClick={() => onSelectResource(resource.id)}
                                    >
                                        <CardHeader className="p-4 pb-2">
                                            <CardTitle className="text-base truncate flex items-center">
                                                <FolderIcon className="h-4 w-4 mr-2 text-muted-foreground" />
                                                {resource.title}
                                                {!resource.isActive && (
                                                    <Badge variant="outline" className="ml-2 bg-yellow-50 text-yellow-600 border-yellow-200">
                                                        Inactive
                                                    </Badge>
                                                )}
                                            </CardTitle>
                                            <CardDescription className="text-xs truncate">
                                                {resource.description || "No description"}
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent className="p-4 pt-0 pb-2">
                                            <div className="flex flex-wrap gap-1 mt-1">
                                                {resource.tags.map((tag) => (
                                                    <Badge key={tag} variant="secondary" className="text-xs">
                                                        {tag}
                                                    </Badge>
                                                ))}
                                                <Badge variant="outline" className="text-xs">
                                                    {resource.fileCount || 0} files
                                                </Badge>
                                            </div>
                                        </CardContent>
                                        <CardFooter className="p-4 pt-0 flex justify-between items-center">
                                            <span className="text-xs text-muted-foreground">
                                                {format(new Date(resource.updatedAt), "MMM d, yyyy")}
                                            </span>
                                        </CardFooter>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </ScrollArea>

                    {/* Pagination */}
                    {filteredResources.length > 0 && (
                        <div className="flex justify-between items-center mt-4">
                            <div className="text-sm text-muted-foreground">
                                Showing {filteredResources.length} directories
                            </div>
                            <div className="flex items-center space-x-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    disabled={currentPage <= 1}
                                    onClick={() => {
                                        if (currentPage > 1 && onPageChange) {
                                            onPageChange(currentPage - 1);
                                        }
                                    }}
                                >
                                    Previous
                                </Button>
                                <span className="mx-2 text-sm">
                                    Page {currentPage}
                                </span>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    disabled={resources.length < 10}
                                    onClick={() => {
                                        if (onPageChange) {
                                            onPageChange(currentPage + 1);
                                        }
                                    }}
                                >
                                    Next
                                </Button>
                            </div>
                        </div>
                    )}
                </div>

                <div className="lg:col-span-2">
                    {selectedResourceId && selectedResource ? (
                        <div className="space-y-4 border rounded-lg p-6">
                            <div className="flex justify-between items-center">
                                <h2 className="text-xl font-semibold">{selectedResource.title}</h2>
                                <div className="flex gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleSync(selectedResource.id)}
                                    >
                                        <RefreshCw className="h-4 w-4 mr-1" />
                                        Sync
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={handleOpenDialogForEdit}
                                    >
                                        <PenLine className="h-4 w-4 mr-1" />
                                        Edit
                                    </Button>
                                    <Button
                                        variant="destructive"
                                        size="sm"
                                        onClick={() => handleDelete(selectedResource.id)}
                                    >
                                        <Trash2 className="h-4 w-4 mr-1" />
                                        Delete
                                    </Button>
                                </div>
                            </div>

                            <Separator />

                            <div className="space-y-4">
                                <div>
                                    <h3 className="text-sm font-medium text-muted-foreground mb-1">Description</h3>
                                    <p className="text-sm">
                                        {selectedResource.description || "No description provided"}
                                    </p>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <h3 className="text-sm font-medium text-muted-foreground mb-1">Created</h3>
                                        <p className="text-sm">
                                            {format(new Date(selectedResource.createdAt), "MMM d, yyyy HH:mm")}
                                        </p>
                                    </div>

                                    <div>
                                        <h3 className="text-sm font-medium text-muted-foreground mb-1">Updated</h3>
                                        <p className="text-sm">
                                            {format(new Date(selectedResource.updatedAt), "MMM d, yyyy HH:mm")}
                                        </p>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-sm font-medium text-muted-foreground mb-1">Status</h3>
                                    <div className="flex items-center">
                                        <div
                                            className={`h-2.5 w-2.5 rounded-full mr-2 ${selectedResource.isActive ? "bg-green-500" : "bg-yellow-500"
                                                }`}
                                        />
                                        <span className="text-sm">
                                            {selectedResource.isActive ? "Active" : "Inactive"}
                                        </span>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-sm font-medium text-muted-foreground mb-1">Path</h3>
                                    <div className="border rounded-md p-3 bg-muted/50">
                                        <p className="text-sm font-mono break-all">
                                            {selectedResource.path || "No path specified"}
                                        </p>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-sm font-medium text-muted-foreground mb-2">Tags</h3>
                                    {selectedResource.tags.length > 0 ? (
                                        <div className="flex flex-wrap gap-2">
                                            {selectedResource.tags.map((tag) => (
                                                <Badge key={tag} variant="secondary">
                                                    {tag}
                                                </Badge>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-sm text-muted-foreground">No tags</p>
                                    )}
                                </div>

                                <div>
                                    <h3 className="text-sm font-medium text-muted-foreground mb-1">Statistics</h3>
                                    <div className="grid grid-cols-2 gap-4 border rounded-md p-4 bg-muted/30">
                                        <div>
                                            <p className="text-xs text-muted-foreground">Files processed</p>
                                            <p className="text-lg font-semibold">{selectedResource.fileCount || 0}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-muted-foreground">Last sync</p>
                                            <p className="text-sm">
                                                {selectedResource.lastSyncedAt
                                                    ? format(new Date(selectedResource.lastSyncedAt), "MMM d, yyyy HH:mm")
                                                    : "Never"}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {selectedResource.collectionId && (
                                    <div>
                                        <h3 className="text-sm font-medium text-muted-foreground mb-1">Collection</h3>
                                        <Badge variant="outline" className="mt-1">
                                            {selectedResource.collectionName || selectedResource.collectionId}
                                        </Badge>
                                    </div>
                                )}

                                {!selectedResource.isActive && (
                                    <Alert className="mt-4 bg-yellow-50 text-yellow-800 border-yellow-200">
                                        <AlertCircle className="h-4 w-4" />
                                        <AlertTitle>Inactive Directory</AlertTitle>
                                        <AlertDescription>
                                            This directory is currently inactive. Files in this directory won't be used for AI responses.
                                        </AlertDescription>
                                    </Alert>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full text-center border rounded-lg p-8">
                            <h3 className="text-lg font-medium mb-2">No directory selected</h3>
                            <p className="text-muted-foreground mb-4">
                                Select a directory from the list or add a new one
                            </p>
                            <Button onClick={handleOpenDialogForAdd}>
                                <Plus className="mr-2 h-4 w-4" />
                                Add Directory
                            </Button>
                        </div>
                    )}
                </div>
            </div>

            <ResourceDialog
                open={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                isEditing={isEditing}
                resource={isEditing ? selectedResource : undefined}
                resourceType="DIRECTORY"
                onSave={(data) => {
                    if (isEditing && selectedResource) {
                        // For updates, we need to pass the id separately
                        handleUpdateResource(selectedResource.id, data);
                    } else {
                        // For new resources, ensure we have a collectionId
                        const firstCollectionId = collections && Array.isArray(collections) && collections.length > 0 ? (collections[0] as ResourceCollection).id : "";

                        // Create a properly typed object for the new resource
                        const newResource: CreateDirectoryRequest = {
                            title: typeof data.title === 'string' ? data.title : "",
                            description: typeof data.description === 'string' ? data.description : "",
                            resourceType: "DIRECTORY",
                            collectionId: typeof data.collectionId === 'string' ? data.collectionId : firstCollectionId,
                            tags: Array.isArray(data.tags) ? data.tags : [],
                            path: typeof data.path === 'string' ? data.path : "",
                            recursive: typeof data.recursive === 'boolean' ? data.recursive : true,
                            fileTypes: Array.isArray(data.fileTypes) ? data.fileTypes : ["PDF", "DOCX", "TXT"],
                            includePatterns: Array.isArray(data.includePatterns) ? data.includePatterns : [],
                            excludePatterns: Array.isArray(data.excludePatterns) ? data.excludePatterns : []
                        };

                        handleAddResource(newResource as unknown as CreateResourceRequest);
                    }
                    handleCloseDialog();
                }}
            />
        </div>
    );
}