import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, Search, Plus, PenLine, Trash2, FolderIcon, BookOpen, FileText, HelpCircle, AlertCircle } from "lucide-react";
import { ResourceCollection, KnowledgeResource } from "@/types/knowledge-base";
import { format } from "date-fns";
import { useKnowledgeBase } from "@/hooks/knowledge-base/useKnowledgeBase";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { CollectionDialog } from "./dialogs/CollectionDialog";

interface CollectionsSectionProps {
    collections: ResourceCollection[];
    resources: KnowledgeResource[];
    isLoading: boolean;
}

export function CollectionsSection({
    collections,
    resources,
    isLoading,
}: CollectionsSectionProps) {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCollectionId, setSelectedCollectionId] = useState<string | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    const { handleCreateCollection, handleUpdateCollection, handleDeleteCollection } = useKnowledgeBase() as any; // Type assertion to resolve linter errors

    // Filter collections based on search query
    const filteredCollections = searchQuery
        ? collections.filter((collection) =>
            collection.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            collection.description.toLowerCase().includes(searchQuery.toLowerCase())
        )
        : collections;

    const selectedCollection = collections.find(
        (collection) => collection.id === selectedCollectionId
    );

    // Find resources in the selected collection
    const collectionResources = selectedCollectionId
        ? resources.filter((resource) => resource.collectionId === selectedCollectionId)
        : [];

    const handleOpenDialogForEdit = () => {
        setIsEditing(true);
        setIsDialogOpen(true);
    };

    const handleOpenDialogForAdd = () => {
        setIsEditing(false);
        setSelectedCollectionId(null);
        setIsDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setIsDialogOpen(false);
        setIsEditing(false);
    };

    const handleDelete = (id: string) => {
        if (confirm("Are you sure you want to delete this collection? Resources will not be deleted, but they will be removed from this collection.")) {
            handleDeleteCollection(id);
            if (selectedCollectionId === id) {
                setSelectedCollectionId(null);
            }
        }
    };

    const getResourceTypeIcon = (type: string) => {
        switch (type) {
            case "ARTICLE":
                return <BookOpen className="h-4 w-4 text-muted-foreground" />;
            case "FILE_UPLOAD":
                return <FileText className="h-4 w-4 text-muted-foreground" />;
            case "FAQ":
                return <HelpCircle className="h-4 w-4 text-muted-foreground" />;
            case "DIRECTORY":
                return <FolderIcon className="h-4 w-4 text-muted-foreground" />;
            default:
                return <FileText className="h-4 w-4 text-muted-foreground" />;
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-40">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <span className="ml-2 text-muted-foreground font-medium">Loading collections...</span>
            </div>
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
                            placeholder="Search collections..."
                            className="pl-8"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>
                <Button onClick={handleOpenDialogForAdd}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Collection
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1">
                    <ScrollArea className="h-[calc(100vh-250px)]">
                        {filteredCollections.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-40 text-center">
                                <p className="text-muted-foreground">No collections found</p>
                                <p className="text-sm text-muted-foreground">
                                    Create your first collection to organize your knowledge resources
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                {filteredCollections.map((collection) => (
                                    <Card
                                        key={collection.id}
                                        className={`cursor-pointer hover:border-primary/50 transition-colors ${selectedCollectionId === collection.id ? "border-primary" : ""
                                            }`}
                                        onClick={() => setSelectedCollectionId(collection.id)}
                                    >
                                        <CardHeader className="p-4 pb-2">
                                            <CardTitle className="text-base truncate flex items-center">
                                                <FolderIcon className="h-4 w-4 mr-2 text-muted-foreground" />
                                                {collection.name}
                                                {!collection.isActive && (
                                                    <Badge variant="outline" className="ml-2 bg-yellow-50 text-yellow-600 border-yellow-200">
                                                        Inactive
                                                    </Badge>
                                                )}
                                            </CardTitle>
                                            <CardDescription className="text-xs truncate">
                                                {collection.description || "No description"}
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent className="p-4 pt-0 pb-2">
                                            <div className="flex flex-wrap gap-1 mt-1">
                                                <Badge variant="outline" className="text-xs">
                                                    {resources.filter(r => r.collectionId === collection.id).length} resources
                                                </Badge>
                                            </div>
                                        </CardContent>
                                        <CardFooter className="p-4 pt-0 flex justify-between items-center">
                                            <span className="text-xs text-muted-foreground">
                                                {format(new Date(collection.updatedAt), "MMM d, yyyy")}
                                            </span>
                                        </CardFooter>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </ScrollArea>
                </div>

                <div className="lg:col-span-2">
                    {selectedCollectionId && selectedCollection ? (
                        <div className="space-y-4 border rounded-lg p-6">
                            <div className="flex justify-between items-center">
                                <h2 className="text-xl font-semibold">{selectedCollection.name}</h2>
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
                                        onClick={() => handleDelete(selectedCollection.id)}
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
                                        {selectedCollection.description || "No description provided"}
                                    </p>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <h3 className="text-sm font-medium text-muted-foreground mb-1">Created</h3>
                                        <p className="text-sm">
                                            {format(new Date(selectedCollection.createdAt), "MMM d, yyyy HH:mm")}
                                        </p>
                                    </div>

                                    <div>
                                        <h3 className="text-sm font-medium text-muted-foreground mb-1">Updated</h3>
                                        <p className="text-sm">
                                            {format(new Date(selectedCollection.updatedAt), "MMM d, yyyy HH:mm")}
                                        </p>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-sm font-medium text-muted-foreground mb-1">Status</h3>
                                    <div className="flex items-center">
                                        <div className={`h-2.5 w-2.5 rounded-full mr-2 ${selectedCollection.isActive ? "bg-green-500" : "bg-yellow-500"
                                            }`} />
                                        <span className="text-sm">
                                            {selectedCollection.isActive ? "Active" : "Inactive"}
                                        </span>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-sm font-medium text-muted-foreground mb-2">Resources in this collection</h3>
                                    {collectionResources.length > 0 ? (
                                        <ScrollArea className="h-[300px] border rounded-md p-2">
                                            <div className="space-y-2">
                                                {collectionResources.map((resource) => (
                                                    <div
                                                        key={resource.id}
                                                        className="flex items-center justify-between p-2 hover:bg-muted/50 rounded-md"
                                                    >
                                                        <div className="flex items-center gap-2">
                                                            {getResourceTypeIcon(resource.resourceType)}
                                                            <div>
                                                                <p className="text-sm font-medium">{resource.title}</p>
                                                                <p className="text-xs text-muted-foreground">{resource.resourceType}</p>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center">
                                                            <Badge
                                                                variant={resource.isActive ? "outline" : "secondary"}
                                                                className="text-xs"
                                                            >
                                                                {resource.isActive ? "Active" : "Inactive"}
                                                            </Badge>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </ScrollArea>
                                    ) : (
                                        <div className="border rounded-md p-4 text-center">
                                            <p className="text-sm text-muted-foreground">No resources in this collection</p>
                                            <p className="text-xs text-muted-foreground mt-1">
                                                Add resources to this collection by editing resources
                                            </p>
                                        </div>
                                    )}
                                </div>

                                {!selectedCollection.isActive && (
                                    <Alert className="mt-4 bg-yellow-50 text-yellow-800 border-yellow-200">
                                        <AlertCircle className="h-4 w-4" />
                                        <AlertTitle>Inactive Collection</AlertTitle>
                                        <AlertDescription>
                                            This collection is currently inactive. Resources in this collection won't be used for AI responses.
                                        </AlertDescription>
                                    </Alert>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full text-center border rounded-lg p-8">
                            <h3 className="text-lg font-medium mb-2">No collection selected</h3>
                            <p className="text-muted-foreground mb-4">
                                Select a collection from the list or create a new one
                            </p>
                            <Button onClick={handleOpenDialogForAdd}>
                                <Plus className="mr-2 h-4 w-4" />
                                Add Collection
                            </Button>
                        </div>
                    )}
                </div>
            </div>

            <CollectionDialog
                open={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                isEditing={isEditing}
                collection={isEditing ? selectedCollection : undefined}
                onSave={(data) => {
                    if (isEditing && selectedCollection) {
                        handleUpdateCollection(selectedCollection.id, data);
                    } else {
                        handleCreateCollection(data);
                    }
                    handleCloseDialog();
                }}
            />
        </div>
    );
} 