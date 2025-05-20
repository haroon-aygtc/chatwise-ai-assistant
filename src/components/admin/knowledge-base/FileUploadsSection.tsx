import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, Search, Plus, Trash2, FileText, DownloadCloud, AlertCircle, X, Save, Upload } from "lucide-react";
import { KnowledgeResource, ResourceType, CreateResourceRequest, UpdateResourceRequest } from "@/types/knowledge-base";
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
import { getFileIcon } from "@/utils/file-icons";
import { formatBytes } from "@/utils/format-bytes";

interface FileUploadsSectionProps {
    resources: KnowledgeResource[];
    isLoading: boolean;
    searchQuery: string;
    onSearchChange: (query: string) => void;
    selectedResourceId: string | null;
    onSelectResource: (id: string) => void;
    onDeleteResource: (id: string) => void;
    isError: boolean;
}

// File upload form schema
const fileUploadFormSchema = z.object({
    title: z.string().min(3, "Title must be at least 3 characters"),
    description: z.string().min(10, "Description must be at least 10 characters").optional(),
    collectionId: z.string().min(1, "Collection is required"),
    tags: z.array(z.string()).optional().default([]),
    isActive: z.boolean().default(true),
    file: z.any().optional(), // For file uploads
});

export function FileUploadsSection({
    resources,
    isLoading,
    searchQuery,
    onSearchChange,
    selectedResourceId,
    onSelectResource,
    // onDeleteResource, // Not used with inline form
    isError,
}: FileUploadsSectionProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery);
    const [currentTag, setCurrentTag] = useState("");
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const { handleAddResource, handleUpdateResource, handleDeleteResource, handleDownloadFile, collections } = useKnowledgeBase() as any; // Type assertion to resolve linter errors

    // Filter resources based on search query
    const filteredResources = localSearchQuery
        ? resources.filter((resource) =>
            resource.title.toLowerCase().includes(localSearchQuery.toLowerCase()) ||
            resource.description.toLowerCase().includes(localSearchQuery.toLowerCase()) ||
            resource.tags.some(tag => tag.toLowerCase().includes(localSearchQuery.toLowerCase())) ||
            resource.fileType?.toLowerCase().includes(localSearchQuery.toLowerCase())
        )
        : resources;

    const selectedResource = resources.find(
        (resource) => resource.id === selectedResourceId
    );

    // Set up form with dynamic defaultValues
    const form = useForm<z.infer<typeof fileUploadFormSchema>>({
        resolver: zodResolver(fileUploadFormSchema),
        defaultValues: {
            title: selectedResource?.title || "",
            description: selectedResource?.description || "",
            collectionId: selectedResource?.collectionId || "",
            tags: selectedResource?.tags || [],
            isActive: selectedResource?.isActive ?? true,
        },
    });

    // Update form values when selected resource changes
    useEffect(() => {
        if (selectedResource) {
            form.reset({
                title: selectedResource.title,
                description: selectedResource.description || "",
                collectionId: selectedResource.collectionId || "",
                tags: selectedResource.tags || [],
                isActive: selectedResource.isActive,
            });
            setIsEditing(true);
            setSelectedFile(null);
        } else {
            const collectionsList = Array.isArray(collections) ? collections : [];
            form.reset({
                title: "",
                description: "",
                collectionId: collectionsList.length > 0 ? collectionsList[0].id : "",
                tags: [],
                isActive: true,
            });
            setIsEditing(false);
            setSelectedFile(null);
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

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && currentTag.trim()) {
            e.preventDefault();
            handleAddTag();
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            setSelectedFile(file);

            // Auto-fill title if it's empty
            if (!form.getValues().title) {
                form.setValue("title", file.name);
            }
        }
    };

    const handleCreateNew = () => {
        const collectionsList = Array.isArray(collections) ? collections : [];
        form.reset({
            title: "",
            description: "",
            collectionId: collectionsList.length > 0 ? collectionsList[0].id : "",
            tags: [],
            isActive: true,
        });
        setIsEditing(false);
        setSelectedFile(null);
        onSelectResource("");

        // Reset file input
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const handleDelete = (id: string) => {
        if (confirm("Are you sure you want to delete this file?")) {
            handleDeleteResource(id);
            if (selectedResourceId === id) {
                onSelectResource("");
                handleCreateNew();
            }
        }
    };

    const handleDownload = (id: string) => {
        handleDownloadFile(id);
    };

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setLocalSearchQuery(e.target.value);
        onSearchChange(e.target.value);
    };

    const onSubmit = async (data: z.infer<typeof fileUploadFormSchema>) => {
        if (isEditing && selectedResource) {
            // Update existing resource
            const updateData: UpdateResourceRequest = {
                id: selectedResource.id,
                title: data.title.trim(),
                description: data.description?.trim() || "",
                isActive: data.isActive,
                tags: data.tags,
                collectionId: data.collectionId
            };
            handleUpdateResource(selectedResource.id, updateData);
        } else {
            // Create new resource - requires a file
            if (!selectedFile) {
                alert("Please select a file to upload");
                return;
            }

            // Create FormData for file upload
            const formData = new FormData();
            formData.append("file", selectedFile);
            formData.append("title", data.title.trim());
            formData.append("description", data.description?.trim() || "");
            formData.append("isActive", data.isActive.toString());
            formData.append("collectionId", data.collectionId);
            formData.append("resourceType", "FILE_UPLOAD");

            if (data.tags && data.tags.length > 0) {
                data.tags.forEach(tag => {
                    formData.append("tags", tag);
                });
            }

            handleAddResource(formData);
            setSelectedFile(null);

            // Reset file input
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-40">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <span className="ml-2 text-muted-foreground font-medium">Loading files...</span>
            </div>
        );
    }

    if (isError) {
        return (
            <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>
                    Failed to load files. Please try refreshing the page.
                </AlertDescription>
            </Alert>
        );
    }

    const FileIcon = selectedResource?.fileType
        ? getFileIcon(selectedResource.fileType)
        : FileText;

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <div className="flex-1 max-w-md">
                    <div className="relative">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            type="search"
                            placeholder="Search files..."
                            className="pl-8"
                            value={localSearchQuery}
                            onChange={handleSearch}
                        />
                    </div>
                </div>
                <Button onClick={handleCreateNew}>
                    <Plus className="mr-2 h-4 w-4" />
                    New Upload
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1">
                    <ScrollArea className="h-[calc(100vh-250px)]">
                        {filteredResources.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-40 text-center">
                                <p className="text-muted-foreground">No files found</p>
                                <p className="text-sm text-muted-foreground">
                                    Upload files to add to your knowledge base
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                {filteredResources.map((resource) => {
                                    const ResourceIcon = resource.fileType
                                        ? getFileIcon(resource.fileType)
                                        : FileText;

                                    return (
                                        <Card
                                            key={resource.id}
                                            className={`cursor-pointer hover:border-primary/50 transition-colors ${selectedResourceId === resource.id ? "border-primary" : ""
                                                }`}
                                            onClick={() => onSelectResource(resource.id)}
                                        >
                                            <CardHeader className="p-4 pb-2">
                                                <CardTitle className="text-base truncate flex items-center">
                                                    <ResourceIcon className="h-4 w-4 mr-2 text-muted-foreground" />
                                                    {resource.title}
                                                    {!resource.isActive && (
                                                        <Badge variant="outline" className="ml-2 bg-yellow-50 text-yellow-600 border-yellow-200">
                                                            Inactive
                                                        </Badge>
                                                    )}
                                                </CardTitle>
                                                <CardDescription className="text-xs truncate">
                                                    {resource.description || (resource.fileType && `${resource.fileType.toUpperCase()} file`)}
                                                </CardDescription>
                                            </CardHeader>
                                            <CardContent className="p-4 pt-0 pb-2">
                                                <div className="flex flex-wrap gap-1 mt-1">
                                                    {resource.fileType && (
                                                        <Badge variant="outline" className="text-xs">
                                                            {resource.fileType.toUpperCase()}
                                                        </Badge>
                                                    )}
                                                    {resource.fileSize && (
                                                        <Badge variant="outline" className="text-xs">
                                                            {formatBytes(resource.fileSize)}
                                                        </Badge>
                                                    )}
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
                                    );
                                })}
                            </div>
                        )}
                    </ScrollArea>
                </div>

                <div className="lg:col-span-2">
                    <div className="border rounded-lg p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold">
                                {isEditing ? (
                                    <div className="flex items-center">
                                        <FileIcon className="h-5 w-5 mr-2 text-muted-foreground" />
                                        {selectedResource?.title}
                                    </div>
                                ) : (
                                    "Upload New File"
                                )}
                            </h2>
                            <div className="flex gap-2">
                                {isEditing && selectedResource && (
                                    <>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleDownload(selectedResource.id)}
                                        >
                                            <DownloadCloud className="h-4 w-4 mr-1" />
                                            Download
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
                                {!isEditing && (
                                    <div className="border-2 border-dashed rounded-lg p-6 text-center mb-4">
                                        <input
                                            type="file"
                                            id="file-upload"
                                            className="hidden"
                                            onChange={handleFileChange}
                                            ref={fileInputRef}
                                        />
                                        <label
                                            htmlFor="file-upload"
                                            className="cursor-pointer flex flex-col items-center justify-center"
                                        >
                                            <Upload className="h-10 w-10 text-muted-foreground mb-2" />
                                            <p className="text-lg font-medium mb-1">
                                                {selectedFile ? selectedFile.name : "Click to select a file"}
                                            </p>
                                            <p className="text-sm text-muted-foreground mb-2">
                                                {selectedFile
                                                    ? `${formatBytes(selectedFile.size)} - ${selectedFile.type || "Unknown type"}`
                                                    : "PDF, DOCX, TXT, CSV, JSON, etc."}
                                            </p>
                                            <Button type="button" variant="outline" size="sm">
                                                Browse Files
                                            </Button>
                                        </label>
                                    </div>
                                )}

                                {isEditing && selectedResource && (
                                    <div className="grid grid-cols-2 gap-4 mb-4">
                                        <div>
                                            <h3 className="text-sm font-medium text-muted-foreground mb-1">File Type</h3>
                                            <p className="text-sm">
                                                {selectedResource.fileType
                                                    ? selectedResource.fileType.toUpperCase()
                                                    : "Unknown"}
                                            </p>
                                        </div>

                                        <div>
                                            <h3 className="text-sm font-medium text-muted-foreground mb-1">File Size</h3>
                                            <p className="text-sm">
                                                {selectedResource.fileSize
                                                    ? formatBytes(selectedResource.fileSize)
                                                    : "Unknown"}
                                            </p>
                                        </div>
                                    </div>
                                )}

                                <div className="grid grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="title"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Title</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Enter a title for this file" {...field} />
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
                                                    placeholder="Enter a brief description of this file"
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
                                    name="tags"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Tags</FormLabel>
                                            <FormControl>
                                                <div className="flex space-x-2">
                                                    <Input
                                                        value={currentTag}
                                                        onChange={(e) => setCurrentTag(e.target.value)}
                                                        onKeyDown={handleKeyDown}
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
                                                Enter tags to categorize this file
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

                                <FormField
                                    control={form.control}
                                    name="isActive"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                                            <div className="space-y-0.5">
                                                <FormLabel>Active Status</FormLabel>
                                                <FormDescription>
                                                    Make this file available for AI queries
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

                                {isEditing && selectedResource && (
                                    <div className="grid grid-cols-2 gap-4 mt-4">
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
                                        {isEditing ? "Update File" : "Upload File"}
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