import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, Search, Plus, Trash2, FolderIcon, RefreshCw, AlertCircle, X, Save } from "lucide-react";
import { KnowledgeResource, CreateResourceRequest, CreateDirectoryRequest } from "@/types/knowledge-base";
import { format } from "date-fns";
import { useKnowledgeBase } from "@/hooks/knowledge-base/useKnowledgeBase";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

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

// Directory form schema
const directoryFormSchema = z.object({
    title: z.string().min(3, "Title must be at least 3 characters"),
    description: z.string().min(10, "Description must be at least 10 characters"),
    path: z.string().min(1, "Path is required"),
    collectionId: z.string().min(1, "Collection is required"),
    tags: z.array(z.string()).optional().default([]),
    isActive: z.boolean().default(true),
    recursive: z.boolean().default(true),
    fileTypes: z.array(z.string()).min(1, "At least one file type is required"),
    includePatterns: z.array(z.string()).optional().default([]),
    excludePatterns: z.array(z.string()).optional().default([]),
});

export function DirectoriesSection({
    resources,
    isLoading,
    searchQuery,
    onSearchChange,
    selectedResourceId,
    onSelectResource,
    // onDeleteResource, // Not used with inline form
    isError,
    currentPage = 1,
    onPageChange,
}: DirectoriesSectionProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery);
    const [currentTag, setCurrentTag] = useState("");
    const [currentIncludePattern, setCurrentIncludePattern] = useState("");
    const [currentExcludePattern, setCurrentExcludePattern] = useState("");

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

    // Set up form with dynamic defaultValues
    const form = useForm<z.infer<typeof directoryFormSchema>>({
        resolver: zodResolver(directoryFormSchema),
        defaultValues: {
            title: selectedResource?.title || "",
            description: selectedResource?.description || "",
            path: selectedResource?.path || "",
            collectionId: selectedResource?.collectionId || "",
            tags: selectedResource?.tags || [],
            isActive: selectedResource?.isActive ?? true,
            recursive: selectedResource?.recursive ?? true,
            fileTypes: selectedResource?.fileTypes || ["PDF", "DOCX", "TXT"],
            includePatterns: selectedResource?.includePatterns || [],
            excludePatterns: selectedResource?.excludePatterns || [],
        },
    });

    // Update form values when selected resource changes
    useEffect(() => {
        if (selectedResource) {
            form.reset({
                title: selectedResource.title,
                description: selectedResource.description || "",
                path: selectedResource.path || "",
                collectionId: selectedResource.collectionId || "",
                tags: selectedResource.tags || [],
                isActive: selectedResource.isActive,
                recursive: selectedResource.recursive ?? true,
                fileTypes: selectedResource.fileTypes || ["PDF", "DOCX", "TXT"],
                includePatterns: selectedResource.includePatterns || [],
                excludePatterns: selectedResource.excludePatterns || [],
            });
        setIsEditing(true);
        } else {
            const collectionsList = Array.isArray(collections) ? collections : [];
            form.reset({
                title: "",
                description: "",
                path: "",
                collectionId: collectionsList.length > 0 ? collectionsList[0].id : "",
                tags: [],
                isActive: true,
                recursive: true,
                fileTypes: ["PDF", "DOCX", "TXT"],
                includePatterns: [],
                excludePatterns: [],
            });
            setIsEditing(false);
        }
    }, [selectedResource, form, collections]);

    const handleAddTag = () => {
        if (currentTag.trim() && !form.getValues().tags.includes(currentTag.trim())) {
            const currentTags = form.getValues().tags || [];
            form.setValue("tags", [...currentTags, currentTag.trim()]);
            setCurrentTag("");
        }
    };

    const handleRemoveTag = (tag: string) => {
        const currentTags = form.getValues().tags || [];
        form.setValue("tags", currentTags.filter((t) => t !== tag));
    };

    const handleAddIncludePattern = () => {
        if (currentIncludePattern.trim() && !form.getValues().includePatterns.includes(currentIncludePattern.trim())) {
            const patterns = form.getValues().includePatterns || [];
            form.setValue("includePatterns", [...patterns, currentIncludePattern.trim()]);
            setCurrentIncludePattern("");
        }
    };

    const handleRemoveIncludePattern = (pattern: string) => {
        const patterns = form.getValues().includePatterns || [];
        form.setValue("includePatterns", patterns.filter((p) => p !== pattern));
    };

    const handleAddExcludePattern = () => {
        if (currentExcludePattern.trim() && !form.getValues().excludePatterns.includes(currentExcludePattern.trim())) {
            const patterns = form.getValues().excludePatterns || [];
            form.setValue("excludePatterns", [...patterns, currentExcludePattern.trim()]);
            setCurrentExcludePattern("");
        }
    };

    const handleRemoveExcludePattern = (pattern: string) => {
        const patterns = form.getValues().excludePatterns || [];
        form.setValue("excludePatterns", patterns.filter((p) => p !== pattern));
    };

    const handleKeyDown = (e: React.KeyboardEvent, type: 'tag' | 'include' | 'exclude') => {
        if (e.key === "Enter") {
            e.preventDefault();
            if (type === 'tag') handleAddTag();
            else if (type === 'include') handleAddIncludePattern();
            else if (type === 'exclude') handleAddExcludePattern();
        }
    };

    const handleCreateNew = () => {
        const collectionsList = Array.isArray(collections) ? collections : [];
        form.reset({
            title: "",
            description: "",
            path: "",
            collectionId: collectionsList.length > 0 ? collectionsList[0].id : "",
            tags: [],
            isActive: true,
            recursive: true,
            fileTypes: ["PDF", "DOCX", "TXT"],
            includePatterns: [],
            excludePatterns: [],
        });
        setIsEditing(false);
        onSelectResource("");
    };

    const handleDelete = (id: string) => {
        if (confirm("Are you sure you want to delete this directory? This will remove access to all files in this directory.")) {
            handleDeleteResource(id);
            if (selectedResourceId === id) {
                onSelectResource("");
                handleCreateNew();
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

    const onSubmit = (data: z.infer<typeof directoryFormSchema>) => {
        if (isEditing && selectedResource) {
            // Update existing resource
            const updateData = {
                id: selectedResource.id,
                title: data.title.trim(),
                description: data.description.trim(),
                path: data.path.trim(),
                isActive: data.isActive,
                tags: data.tags,
                collectionId: data.collectionId,
                recursive: data.recursive,
                fileTypes: data.fileTypes,
                includePatterns: data.includePatterns,
                excludePatterns: data.excludePatterns
            };
            handleUpdateResource(selectedResource.id, updateData);
        } else {
            // Create new resource
            const createData: CreateDirectoryRequest = {
                title: data.title.trim(),
                description: data.description.trim(),
                path: data.path.trim(),
                isActive: data.isActive,
                collectionId: data.collectionId,
                tags: data.tags,
                resourceType: "DIRECTORY",
                recursive: data.recursive,
                fileTypes: data.fileTypes,
                includePatterns: data.includePatterns,
                excludePatterns: data.excludePatterns
            };
            handleAddResource(createData as unknown as CreateResourceRequest);
        }
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
                <Button onClick={handleCreateNew}>
                    <Plus className="mr-2 h-4 w-4" />
                    New Directory
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
                    <div className="border rounded-lg p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold">
                                {isEditing ? "Edit Directory" : "Create New Directory"}
                            </h2>
                                <div className="flex gap-2">
                                {isEditing && selectedResource && (
                                    <>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleSync(selectedResource.id)}
                                    >
                                        <RefreshCw className="h-4 w-4 mr-1" />
                                        Sync
                                    </Button>
                                    <Button
                                        variant="destructive"
                                        size="sm"
                                        onClick={() => handleDelete(selectedResource.id)}
                                    >
                                        <Trash2 className="h-4 w-4 mr-1" />
                                        Delete
                                    </Button>
                                    </>
                                )}
                            </div>
                                </div>

                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="title"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Title</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Enter a title for this directory" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="collectionId"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Collection</FormLabel>
                                    <div>
                                                    <Select onValueChange={field.onChange} value={field.value}>
                                                        <FormControl>
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="Select a collection" />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            {Array.isArray(collections) ? collections.map((collection) => (
                                                                <SelectItem key={collection.id} value={collection.id}>
                                                                    {collection.name}
                                                                </SelectItem>
                                                            )) : null}
                                                        </SelectContent>
                                                    </Select>
                                    </div>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <FormField
                                    control={form.control}
                                    name="description"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Description</FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    placeholder="Enter a brief description of this directory"
                                                    className="min-h-[80px]"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="path"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Directory Path</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Enter the full path to the directory (e.g., /path/to/files)"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormDescription>
                                                Specify the absolute path to the directory containing your files
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="fileTypes"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>File Types</FormLabel>
                                            <FormControl>
                                <div>
                                                    <Select
                                                        onValueChange={(value) => {
                                                            const currentTypes = field.value || [];
                                                            if (!currentTypes.includes(value)) {
                                                                field.onChange([...currentTypes, value]);
                                                            }
                                                        }}
                                                    >
                                                        <FormControl>
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="Select file types to include" />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            <SelectItem value="PDF">PDF</SelectItem>
                                                            <SelectItem value="DOCX">DOCX</SelectItem>
                                                            <SelectItem value="TXT">TXT</SelectItem>
                                                            <SelectItem value="CSV">CSV</SelectItem>
                                                            <SelectItem value="JSON">JSON</SelectItem>
                                                            <SelectItem value="HTML">HTML</SelectItem>
                                                            <SelectItem value="MD">MD</SelectItem>
                                                            <SelectItem value="OTHER">OTHER</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                            </FormControl>
                                            <FormDescription>
                                                Select file types to include in this directory
                                            </FormDescription>
                                            <FormMessage />
                                            {field.value && field.value.length > 0 && (
                                                <div className="flex flex-wrap gap-2 mt-2">
                                                    {field.value.map((type) => (
                                                        <Badge
                                                            key={type}
                                                            variant="secondary"
                                                            className="flex items-center gap-1 px-2 py-1"
                                                        >
                                                            {type}
                                                            <X
                                                                className="h-3 w-3 cursor-pointer"
                                                                onClick={() => {
                                                                    field.onChange(field.value.filter((t) => t !== type));
                                                                }}
                                                            />
                                                        </Badge>
                                                    ))}
                                                </div>
                                            )}
                                        </FormItem>
                                    )}
                                />

                                <div className="grid grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="includePatterns"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Include Patterns</FormLabel>
                                                <FormControl>
                                                    <div className="flex space-x-2">
                                                        <Input
                                                            value={currentIncludePattern}
                                                            onChange={(e) => setCurrentIncludePattern(e.target.value)}
                                                            onKeyDown={(e) => handleKeyDown(e, 'include')}
                                                            placeholder="e.g., *.pdf"
                                                        />
                                                        <Button
                                                            type="button"
                                                            variant="outline"
                                                            onClick={handleAddIncludePattern}
                                                        >
                                                            Add
                                                        </Button>
                                    </div>
                                                </FormControl>
                                                <FormDescription>
                                                    Patterns to include (glob format)
                                                </FormDescription>
                                                {field.value && field.value.length > 0 && (
                                                    <ScrollArea className="h-16 w-full border rounded-md p-2 mt-2">
                                                        <div className="flex flex-wrap gap-2">
                                                            {field.value.map((pattern) => (
                                                                <Badge
                                                                    key={pattern}
                                                                    variant="secondary"
                                                                    className="flex items-center gap-1 px-2 py-1"
                                                                >
                                                                    {pattern}
                                                                    <X
                                                                        className="h-3 w-3 cursor-pointer"
                                                                        onClick={() => handleRemoveIncludePattern(pattern)}
                                                                    />
                                                                </Badge>
                                                            ))}
                                </div>
                                                    </ScrollArea>
                                                )}
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="excludePatterns"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Exclude Patterns</FormLabel>
                                                <FormControl>
                                                    <div className="flex space-x-2">
                                                        <Input
                                                            value={currentExcludePattern}
                                                            onChange={(e) => setCurrentExcludePattern(e.target.value)}
                                                            onKeyDown={(e) => handleKeyDown(e, 'exclude')}
                                                            placeholder="e.g., **/temp/**"
                                                        />
                                                        <Button
                                                            type="button"
                                                            variant="outline"
                                                            onClick={handleAddExcludePattern}
                                                        >
                                                            Add
                                                        </Button>
                                                    </div>
                                                </FormControl>
                                                <FormDescription>
                                                    Patterns to exclude (glob format)
                                                </FormDescription>
                                                {field.value && field.value.length > 0 && (
                                                    <ScrollArea className="h-16 w-full border rounded-md p-2 mt-2">
                                                        <div className="flex flex-wrap gap-2">
                                                            {field.value.map((pattern) => (
                                                                <Badge
                                                                    key={pattern}
                                                                    variant="secondary"
                                                                    className="flex items-center gap-1 px-2 py-1"
                                                                >
                                                                    {pattern}
                                                                    <X
                                                                        className="h-3 w-3 cursor-pointer"
                                                                        onClick={() => handleRemoveExcludePattern(pattern)}
                                                                    />
                                                                </Badge>
                                                            ))}
                                    </div>
                                                    </ScrollArea>
                                                )}
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <FormField
                                    control={form.control}
                                    name="tags"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Tags</FormLabel>
                                            <FormControl>
                                                <div className="flex space-x-2">
                                                    <Input
                                                        value={currentTag}
                                                        onChange={(e) => setCurrentTag(e.target.value)}
                                                        onKeyDown={(e) => handleKeyDown(e, 'tag')}
                                                        placeholder="Add tags for better searchability"
                                                    />
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        onClick={handleAddTag}
                                                    >
                                                        Add
                                                    </Button>
                                                </div>
                                            </FormControl>
                                            <FormDescription>
                                                Enter tags to categorize this directory
                                            </FormDescription>
                                            <FormMessage />
                                            {field.value && field.value.length > 0 && (
                                                <ScrollArea className="h-16 w-full border rounded-md p-2 mt-2">
                                        <div className="flex flex-wrap gap-2">
                                                        {field.value.map((tag) => (
                                                            <Badge
                                                                key={tag}
                                                                variant="secondary"
                                                                className="flex items-center gap-1 px-2 py-1"
                                                            >
                                                    {tag}
                                                                <X
                                                                    className="h-3 w-3 cursor-pointer"
                                                                    onClick={() => handleRemoveTag(tag)}
                                                                />
                                                </Badge>
                                            ))}
                                        </div>
                                                </ScrollArea>
                                            )}
                                        </FormItem>
                                    )}
                                />

                                <div className="grid grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="recursive"
                                        render={({ field }) => (
                                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                                                <div className="space-y-0.5">
                                                    <FormLabel>Recursive</FormLabel>
                                                    <FormDescription>
                                                        Include files in subdirectories
                                                    </FormDescription>
                                                </div>
                                                <FormControl>
                                                    <Switch
                                                        checked={field.value}
                                                        onCheckedChange={field.onChange}
                                                    />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="isActive"
                                        render={({ field }) => (
                                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                                                <div className="space-y-0.5">
                                                    <FormLabel>Active Status</FormLabel>
                                                    <FormDescription>
                                                        Make this directory available for AI queries
                                                    </FormDescription>
                                                </div>
                                                <FormControl>
                                                    <Switch
                                                        checked={field.value}
                                                        onCheckedChange={field.onChange}
                                                    />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                {isEditing && selectedResource && (
                                    <div className="border rounded-md p-4 bg-muted/30 mt-4">
                                        <h3 className="text-sm font-medium mb-2">Statistics</h3>
                                        <div className="grid grid-cols-2 gap-4">
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
                                )}

                                <div className="flex justify-end space-x-2 pt-4">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={handleCreateNew}
                                    >
                                        {isEditing ? "Cancel" : "Reset"}
                                    </Button>
                                    <Button type="submit">
                                        <Save className="mr-2 h-4 w-4" />
                                        {isEditing ? "Update Directory" : "Create Directory"}
                            </Button>
                        </div>
                            </form>
                        </Form>
                    </div>
                </div>
            </div>
        </div>
    );
}