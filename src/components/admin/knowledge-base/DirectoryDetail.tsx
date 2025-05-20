import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MultiSelect } from "@/components/ui/multi-select";
import { Label } from "@/components/ui/label";
import { Loader2, Save, Calendar, FolderTree, Clock, User, Tag, Filter } from "lucide-react";
import { DirectoryResource, UpdateDirectoryRequest } from "@/types/knowledge-base";
import { Card, CardContent } from "@/components/ui/card";
import { format } from "date-fns";
import { useKnowledgeBase } from "@/hooks/knowledge-base/useKnowledgeBase";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface DirectoryDetailProps {
    directory: DirectoryResource;
    isEditing: boolean;
    onSave: () => void;
}

// Form schema for directory editing
const directoryFormSchema = z.object({
    title: z.string().min(3, "Title must be at least 3 characters"),
    description: z.string().min(10, "Description must be at least 10 characters"),
    path: z.string().min(1, "Path is required"),
    collectionId: z.string().min(1, "Collection is required"),
    fileTypes: z.array(z.string()).min(1, "At least one file type is required"),
    includePatterns: z.array(z.string()).default([]),
    excludePatterns: z.array(z.string()).default([]),
    recursive: z.boolean().default(true),
    tags: z.array(z.string()).default([]),
    isActive: z.boolean().default(true),
});

export function DirectoryDetail({ directory, isEditing, onSave }: DirectoryDetailProps) {
    const { collections, handleUpdateResource, updateResourceMutation } = useKnowledgeBase() as any; // Type assertion to resolve linter errors
    const { toast } = useToast();

    // Set up form
    const form = useForm<z.infer<typeof directoryFormSchema>>({
        resolver: zodResolver(directoryFormSchema),
        defaultValues: {
            title: directory.title,
            description: directory.description,
            path: directory.path,
            collectionId: directory.collectionId,
            fileTypes: directory.fileTypes,
            includePatterns: directory.includePatterns,
            excludePatterns: directory.excludePatterns,
            recursive: directory.recursive,
            tags: directory.tags,
            isActive: directory.isActive,
        },
    });

    // Update form values when directory changes
    useEffect(() => {
        if (directory) {
            form.reset({
                title: directory.title,
                description: directory.description,
                path: directory.path,
                collectionId: directory.collectionId,
                fileTypes: directory.fileTypes,
                includePatterns: directory.includePatterns,
                excludePatterns: directory.excludePatterns,
                recursive: directory.recursive,
                tags: directory.tags,
                isActive: directory.isActive,
            });
        }
    }, [directory, form]);

    const onSubmit = async (data: z.infer<typeof directoryFormSchema>) => {
        try {
            const updateData: UpdateDirectoryRequest = {
                id: directory.id,
                title: data.title,
                description: data.description,
                path: data.path,
                collectionId: data.collectionId,
                fileTypes: data.fileTypes,
                includePatterns: data.includePatterns,
                excludePatterns: data.excludePatterns,
                recursive: data.recursive,
                tags: data.tags,
                isActive: data.isActive,
            };

            await handleUpdateResource(directory.id, updateData);
            toast({
                title: "Directory updated",
                description: "The directory has been successfully updated.",
            });
            onSave();
        } catch (error) {
            console.error("Error updating directory:", error);
            toast({
                title: "Error",
                description: "Failed to update the directory. Please try again.",
                variant: "destructive",
            });
        }
    };

    const fileTypeOptions = [
        { label: "PDF", value: "PDF" },
        { label: "DOCX", value: "DOCX" },
        { label: "XLSX", value: "XLSX" },
        { label: "TXT", value: "TXT" },
        { label: "CSV", value: "CSV" },
        { label: "JSON", value: "JSON" },
        { label: "HTML", value: "HTML" },
        { label: "MD", value: "MD" },
        { label: "OTHER", value: "OTHER" },
    ];

    // Render either edit form or view details
    if (isEditing) {
        return (
            <div className="space-y-6">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <div className="space-y-4">
                            <FormField
                                control={form.control}
                                name="title"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Title</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Directory title" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Description</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Enter a description for this directory"
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
                                            <Input placeholder="Enter the directory path" {...field} />
                                        </FormControl>
                                        <FormDescription>
                                            The absolute or relative path to the directory
                                        </FormDescription>
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
                                        <Select onValueChange={field.onChange} value={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select a collection" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {collections.map((collection) => (
                                                    <SelectItem key={collection.id} value={collection.id}>
                                                        {collection.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
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
                                            <MultiSelect
                                                placeholder="Select file types to include"
                                                selected={field.value || []}
                                                options={fileTypeOptions}
                                                onChange={field.onChange}
                                            />
                                        </FormControl>
                                        <FormDescription>
                                            Select the file types to include from this directory
                                        </FormDescription>
                                        <FormMessage />
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
                                                <MultiSelect
                                                    placeholder="Add include patterns (e.g., *.txt)"
                                                    selected={field.value || []}
                                                    options={[]}
                                                    onChange={field.onChange}
                                                    creatable
                                                />
                                            </FormControl>
                                            <FormDescription>
                                                Glob patterns to include specific files
                                            </FormDescription>
                                            <FormMessage />
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
                                                <MultiSelect
                                                    placeholder="Add exclude patterns (e.g., node_modules/**)"
                                                    selected={field.value || []}
                                                    options={[]}
                                                    onChange={field.onChange}
                                                    creatable
                                                />
                                            </FormControl>
                                            <FormDescription>
                                                Glob patterns to exclude specific files or directories
                                            </FormDescription>
                                            <FormMessage />
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
                                            <MultiSelect
                                                placeholder="Add tags"
                                                selected={field.value || []}
                                                options={[]}
                                                onChange={field.onChange}
                                                creatable
                                            />
                                        </FormControl>
                                        <FormDescription>
                                            Enter tags to categorize this directory
                                        </FormDescription>
                                        <FormMessage />
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

                            <div className="flex justify-end mt-6">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={onSave}
                                    className="mr-2"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={updateResourceMutation.isPending}
                                >
                                    {updateResourceMutation.isPending && (
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    )}
                                    <Save className="mr-2 h-4 w-4" />
                                    Save Changes
                                </Button>
                            </div>
                        </div>
                    </form>
                </Form>
            </div>
        );
    }

    // Calculate sync progress if processing
    const syncProgressValue = directory.syncProgress || 0;
    const filesIndexed = directory.filesIndexed || 0;
    const totalFiles = directory.totalFiles || 0;

    // View mode
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center mb-2">
                            <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                            <Label className="text-sm font-medium">Created</Label>
                        </div>
                        <p className="text-sm">
                            {format(new Date(directory.createdAt), "MMM d, yyyy HH:mm")}
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center mb-2">
                            <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                            <Label className="text-sm font-medium">Updated</Label>
                        </div>
                        <p className="text-sm">
                            {format(new Date(directory.updatedAt), "MMM d, yyyy HH:mm")}
                        </p>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardContent className="p-4">
                    <div className="flex items-center mb-2">
                        <FolderTree className="h-4 w-4 mr-2 text-muted-foreground" />
                        <Label className="text-sm font-medium">Directory Path</Label>
                    </div>
                    <p className="text-sm font-mono">{directory.path}</p>
                </CardContent>
            </Card>

            <div className="grid grid-cols-2 gap-4">
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center mb-2">
                            <User className="h-4 w-4 mr-2 text-muted-foreground" />
                            <Label className="text-sm font-medium">Files Indexed</Label>
                        </div>
                        <p className="text-sm">{filesIndexed} / {totalFiles || "Unknown"}</p>
                        {directory.status === "PROCESSING" && (
                            <>
                                <Progress value={syncProgressValue * 100} className="h-2 mt-2" />
                                <p className="text-xs text-muted-foreground mt-1">
                                    {(syncProgressValue * 100).toFixed(0)}% complete
                                </p>
                            </>
                        )}
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center mb-2">
                            <Filter className="h-4 w-4 mr-2 text-muted-foreground" />
                            <Label className="text-sm font-medium">Recursive</Label>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className={`h-2.5 w-2.5 rounded-full ${directory.recursive ? "bg-green-500" : "bg-red-500"}`} />
                            <span className="text-sm">{directory.recursive ? "Yes" : "No"}</span>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="flex flex-col gap-2">
                <div className="flex items-center mb-2">
                    <Tag className="h-4 w-4 mr-2 text-muted-foreground" />
                    <Label className="text-sm font-medium">File Types</Label>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                    {directory.fileTypes.length > 0 ? (
                        directory.fileTypes.map((type) => (
                            <Badge key={type} variant="outline">
                                {type}
                            </Badge>
                        ))
                    ) : (
                        <p className="text-sm text-muted-foreground">No file types specified</p>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                    <div className="flex items-center mb-2">
                        <Filter className="h-4 w-4 mr-2 text-muted-foreground" />
                        <Label className="text-sm font-medium">Include Patterns</Label>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        {directory.includePatterns && directory.includePatterns.length > 0 ? (
                            directory.includePatterns.map((pattern) => (
                                <Badge key={pattern} variant="outline">
                                    {pattern}
                                </Badge>
                            ))
                        ) : (
                            <p className="text-sm text-muted-foreground">No include patterns</p>
                        )}
                    </div>
                </div>

                <div className="flex flex-col gap-2">
                    <div className="flex items-center mb-2">
                        <Filter className="h-4 w-4 mr-2 text-muted-foreground" />
                        <Label className="text-sm font-medium">Exclude Patterns</Label>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        {directory.excludePatterns && directory.excludePatterns.length > 0 ? (
                            directory.excludePatterns.map((pattern) => (
                                <Badge key={pattern} variant="outline">
                                    {pattern}
                                </Badge>
                            ))
                        ) : (
                            <p className="text-sm text-muted-foreground">No exclude patterns</p>
                        )}
                    </div>
                </div>
            </div>

            <div className="flex items-center mb-2">
                <Tag className="h-4 w-4 mr-2 text-muted-foreground" />
                <Label className="text-sm font-medium">Tags</Label>
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
                {directory.tags.length > 0 ? (
                    directory.tags.map((tag) => (
                        <Badge key={tag} variant="secondary">
                            {tag}
                        </Badge>
                    ))
                ) : (
                    <p className="text-sm text-muted-foreground">No tags</p>
                )}
            </div>

            <div className="flex items-center justify-end gap-4 mt-6">
                <div className="flex items-center">
                    <div className={`h-2.5 w-2.5 rounded-full mr-2 ${directory.isActive ? "bg-green-500" : "bg-yellow-500"}`} />
                    <span className="text-sm">{directory.isActive ? "Active" : "Inactive"}</span>
                </div>

                {directory.status === "PROCESSING" && (
                    <div className="flex items-center">
                        <div className="h-2.5 w-2.5 rounded-full mr-2 bg-blue-500 animate-pulse" />
                        <span className="text-sm">Processing</span>
                    </div>
                )}

                {directory.status === "ERROR" && (
                    <div className="flex items-center">
                        <div className="h-2.5 w-2.5 rounded-full mr-2 bg-red-500" />
                        <span className="text-sm">Error</span>
                    </div>
                )}
            </div>
        </div>
    );
} 