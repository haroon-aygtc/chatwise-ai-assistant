import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, Search, Plus, PenLine, Trash2, HelpCircle, AlertCircle } from "lucide-react";
import { KnowledgeResource, ResourceType } from "@/types/knowledge-base";
import { format } from "date-fns";
import { useKnowledgeBase } from "@/hooks/knowledge-base/useKnowledgeBase";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { ResourceDialog } from "./dialogs/ResourceDialog";

interface FAQsSectionProps {
    resources: KnowledgeResource[];
    isLoading: boolean;
    searchQuery: string;
    onSearchChange: (query: string) => void;
    selectedResourceId: string | null;
    onSelectResource: (id: string) => void;
    onDeleteResource: (id: string) => void;
    isError: boolean;
}

export function FAQsSection({
    resources,
    isLoading,
    searchQuery,
    onSearchChange,
    selectedResourceId,
    onSelectResource,
    onDeleteResource,
    isError,
}: FAQsSectionProps) {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery);

    const { handleAddResource, handleUpdateResource, handleDeleteResource, } = useKnowledgeBase() as any; // Type assertion to resolve linter errors

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
        if (confirm("Are you sure you want to delete this FAQ?")) {
            handleDeleteResource(id);
            if (selectedResourceId === id) {
                onSelectResource("");
            }
        }
    };

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setLocalSearchQuery(e.target.value);
        onSearchChange(e.target.value);
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-40">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <span className="ml-2 text-muted-foreground font-medium">Loading FAQs...</span>
            </div>
        );
    }

    if (isError) {
        return (
            <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>
                    Failed to load FAQs. Please try refreshing the page.
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
                            placeholder="Search FAQs..."
                            className="pl-8"
                            value={localSearchQuery}
                            onChange={handleSearch}
                        />
                    </div>
                </div>
                <Button onClick={handleOpenDialogForAdd}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add FAQ
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1">
                    <ScrollArea className="h-[calc(100vh-250px)]">
                        {filteredResources.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-40 text-center">
                                <p className="text-muted-foreground">No FAQs found</p>
                                <p className="text-sm text-muted-foreground">
                                    Create your first FAQ to provide answers to common questions
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
                                                <HelpCircle className="h-4 w-4 mr-2 text-muted-foreground" />
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
                                    <h3 className="text-sm font-medium text-muted-foreground mb-1">Question</h3>
                                    <p className="text-base font-medium">
                                        {selectedResource.title}
                                    </p>
                                </div>

                                <div>
                                    <h3 className="text-sm font-medium text-muted-foreground mb-1">Answer</h3>
                                    <div className="border rounded-md p-4 bg-muted/50">
                                        <div className="prose prose-sm max-w-none">
                                            {selectedResource.content ? (
                                                <div dangerouslySetInnerHTML={{ __html: selectedResource.content }} />
                                            ) : (
                                                <p className="text-muted-foreground">No answer available</p>
                                            )}
                                        </div>
                                    </div>
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
                                        <AlertTitle>Inactive FAQ</AlertTitle>
                                        <AlertDescription>
                                            This FAQ is currently inactive. It won't be used for AI responses.
                                        </AlertDescription>
                                    </Alert>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full text-center border rounded-lg p-8">
                            <h3 className="text-lg font-medium mb-2">No FAQ selected</h3>
                            <p className="text-muted-foreground mb-4">
                                Select a FAQ from the list or create a new one
                            </p>
                            <Button onClick={handleOpenDialogForAdd}>
                                <Plus className="mr-2 h-4 w-4" />
                                Add FAQ
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
                resourceType="FAQ"
                onSave={(data) => {
                    if (isEditing && selectedResource) {
                        handleUpdateResource(selectedResource.id, data);
                    } else {
                        handleAddResource({
                            ...data,
                            resourceType: "FAQ"
                        });
                    }
                    handleCloseDialog();
                }}
            />
        </div>
    );
} 