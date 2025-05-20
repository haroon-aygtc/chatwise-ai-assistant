import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MultiSelect } from "@/components/ui/multi-select";
import { Label } from "@/components/ui/label";
import {
    Loader2, Save, Calendar, Tag, Clock, User, FileText,
    Download, ExternalLink, AlertTriangle, CheckCircle, Clock4
} from "lucide-react";
import { FileResource, UpdateFileRequest } from "@/types/knowledge-base";
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
import { getFileTypeIcon } from "@/utils/file-icons";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

interface FileDetailProps {
    file: FileResource;
    isEditing: boolean;
    onSave: () => void;
}

// Form schema for file editing
const fileFormSchema = z.object({
    title: z.string().min(3, "Title must be at least 3 characters"),
    description: z.string().min(10, "Description must be at least 10 characters"),
    collectionId: z.string().min(1, "Collection is required"),
    tags: z.array(z.string()).default([]),
    isActive: z.boolean().default(true),
});

export function FileDetail({ file, isEditing, onSave }: FileDetailProps) {
    const { collections, handleUpdateResource, updateResourceMutation } = useKnowledgeBase();
    const { toast } = useToast();

    // Set up form
    const form = useForm<z.infer<typeof fileFormSchema>>({
        resolver: zodResolver(fileFormSchema),
        defaultValues: {
            title: file.title,
            description: file.description,
            collectionId: file.collectionId,
            tags: file.tags,
            isActive: file.isActive,
        },
    });

    // Update form values when file changes
    useEffect(() => {
        if (file) {
            form.reset({
                title: file.title,
                description: file.description,
                collectionId: file.collectionId,
                tags: file.tags,
                isActive: file.isActive,
            });
        }
    }, [file, form]);

    const onSubmit = async (data: z.infer<typeof fileFormSchema>) => {
        try {
            const updateData: UpdateFileRequest = {
                id: file.id,
                title: data.title,
                description: data.description,
                collectionId: data.collectionId,
                tags: data.tags,
                isActive: data.isActive,
            };

            await handleUpdateResource(file.id, updateData);
            toast({
                title: "File updated",
                description: "The file has been successfully updated.",
            });
            onSave();
        } catch (error) {
            console.error("Error updating file:", error);
            toast({
                title: "Error",
                description: "Failed to update the file. Please try again.",
                variant: "destructive",
            });
        }
    };

    const formatFileSize = (bytes: number): string => {
        if (bytes < 1024) return bytes + ' bytes';
        else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
        else return (bytes / 1048576).toFixed(1) + ' MB';
    };

    const getProcessingStatusBadge = () => {
        switch (file.processingStatus) {
            case "PROCESSING":
                return (
                    <div className="flex items-center">
                        <Clock4 className="h-4 w-4 mr-2 text-blue-500 animate-pulse" />
                        <span className="text-sm">Processing</span>
                    </div>
                );
            case "COMPLETE":
                return (
                    <div className="flex items-center">
                        <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                        <span className="text-sm">Complete</span>
                    </div>
                );
            case "FAILED":
                return (
                    <div className="flex items-center">
                        <AlertTriangle className="h-4 w-4 mr-2 text-red-500" />
                        <span className="text-sm">Failed</span>
                    </div>
                );
            case "QUEUED":
                return (
                    <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-2 text-yellow-500" />
                        <span className="text-sm">Queued</span>
                    </div>
                );
            default:
                return null;
        }
    };

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
                                            <Input placeholder="File title" {...field} />
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
                                name="description"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Description</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Enter a description for this file"
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
                                            <MultiSelect
                                                placeholder="Add tags"
                                                selected={field.value || []}
                                                options={[]}
                                                onChange={field.onChange}
                                                creatable
                                            />
                                        </FormControl>
                                        <FormDescription>
                                            Enter tags to categorize this file
                                        </FormDescription>
                                        <FormMessage />
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

    // View mode
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="md:col-span-2">
                    <CardContent className="p-4">
                        <div className="flex items-center mb-2">
                            <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
                            <Label className="text-sm font-medium">File Details</Label>
                        </div>
                        <div className="grid grid-cols-2 gap-4 mt-4">
                            <div>
                                <span className="text-xs text-muted-foreground">File Name</span>
                                <p className="text-sm font-medium truncate">
                                    {file.filePath.split('/').pop()}
                                </p>
                            </div>
                            <div>
                                <span className="text-xs text-muted-foreground">File Type</span>
                                <p className="text-sm font-medium">
                                    {file.fileType}
                                </p>
                            </div>
                            <div>
                                <span className="text-xs text-muted-foreground">File Size</span>
                                <p className="text-sm font-medium">
                                    {formatFileSize(file.fileSize)}
                                </p>
                            </div>
                            <div>
                                <span className="text-xs text-muted-foreground">Vectorized</span>
                                <p className="text-sm font-medium">
                                    {file.vectorized ? "Yes" : "No"}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center mb-2">
                            <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                            <Label className="text-sm font-medium">Processing Status</Label>
                        </div>
                        <div className="mt-2">
                            {getProcessingStatusBadge()}
                        </div>
                        {file.processingStatus === "PROCESSING" && (
                            <div className="mt-4">
                                <Progress value={65} className="h-2" />
                                <p className="text-xs text-muted-foreground mt-1">Processing file...</p>
                            </div>
                        )}
                        {file.processingStatus === "FAILED" && file.processingError && (
                            <Alert variant="destructive" className="mt-4">
                                <AlertTitle>Processing Error</AlertTitle>
                                <AlertDescription className="text-xs">
                                    {file.processingError}
                                </AlertDescription>
                            </Alert>
                        )}
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center mb-2">
                            <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                            <Label className="text-sm font-medium">Created</Label>
                        </div>
                        <p className="text-sm">
                            {format(new Date(file.createdAt), "MMM d, yyyy HH:mm")}
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
                            {format(new Date(file.updatedAt), "MMM d, yyyy HH:mm")}
                        </p>
                    </CardContent>
                </Card>
            </div>

            {file.description && (
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center mb-2">
                            <Label className="text-sm font-medium">Description</Label>
                        </div>
                        <p className="text-sm whitespace-pre-wrap">{file.description}</p>
                    </CardContent>
                </Card>
            )}

            {file.extractedText && (
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center mb-2">
                            <Label className="text-sm font-medium">Document Preview</Label>
                        </div>
                        <div className="max-h-48 overflow-y-auto border rounded p-2 mt-2 bg-muted/50">
                            <p className="text-sm whitespace-pre-wrap line-clamp-6">
                                {file.extractedText.slice(0, 500)}
                                {file.extractedText.length > 500 && "..."}
                            </p>
                        </div>
                    </CardContent>
                </Card>
            )}

            <div className="flex items-center mb-4 mt-6">
                <Tag className="h-4 w-4 mr-2 text-muted-foreground" />
                <Label className="text-sm font-medium">Tags</Label>
            </div>

            <div className="flex flex-wrap gap-2 mb-6">
                {file.tags.length > 0 ? (
                    file.tags.map((tag) => (
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
                    <div className={`h-2.5 w-2.5 rounded-full mr-2 ${file.isActive ? "bg-green-500" : "bg-yellow-500"}`} />
                    <span className="text-sm">{file.isActive ? "Active" : "Inactive"}</span>
                </div>
            </div>
        </div>
    );
} 