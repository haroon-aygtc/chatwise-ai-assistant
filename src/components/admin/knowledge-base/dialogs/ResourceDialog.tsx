import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { MultiSelect } from "@/components/ui/multi-select";
import {
    ResourceType,
    CreateResourceRequest,
    KnowledgeResource,
    UpdateResourceRequest
} from "@/types/knowledge-base";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { FileUploader } from "../FileUploader";
import { Loader2 } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { useKnowledgeBase } from "@/hooks/knowledge-base/useKnowledgeBase";

interface ResourceDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    isEditing: boolean;
    resource?: KnowledgeResource;
    resourceType: ResourceType;
    onSave: (data: CreateResourceRequest | UpdateResourceRequest) => void;
}

// Base schema for all resource types
const baseResourceSchema = z.object({
    title: z.string().min(3, "Title must be at least 3 characters"),
    description: z.string().min(10, "Description must be at least 10 characters"),
    resourceType: z.enum(["ARTICLE", "FAQ", "FILE_UPLOAD", "DIRECTORY"]),
    collectionId: z.string().min(1, "Collection is required"),
    tags: z.array(z.string()).optional().default([]),
    isActive: z.boolean().default(true),
    contextScope: z.array(z.string()).optional().default([]),
});

// Article schema
const articleSchema = baseResourceSchema.extend({
    content: z.string().min(20, "Content must be at least 20 characters"),
    categoryId: z.string().min(1, "Category is required"),
    isDraft: z.boolean().default(false),
});

// FAQ schema
const faqSchema = baseResourceSchema.extend({
    question: z.string().min(10, "Question must be at least 10 characters"),
    answer: z.string().min(20, "Answer must be at least 20 characters"),
    category: z.string().min(1, "Category is required"),
});

// File upload schema
const fileSchema = baseResourceSchema.extend({
    file: z.any().refine((file) => file, "File is required"),
});

// Directory schema
const directorySchema = baseResourceSchema.extend({
    path: z.string().min(1, "Path is required"),
    recursive: z.boolean().default(true),
    fileTypes: z.array(z.string()).min(1, "At least one file type is required"),
    includePatterns: z.array(z.string()).optional().default([]),
    excludePatterns: z.array(z.string()).optional().default([]),
});

export function ResourceDialog({
    open,
    onOpenChange,
    isEditing,
    resource,
    resourceType,
    onSave,
}: ResourceDialogProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [selectedSchema, setSelectedSchema] = useState<"article" | "faq" | "file" | "directory">("article");
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [content, setContent] = useState("");
    const [isActive, setIsActive] = useState(true);
    const [collectionId, setCollectionId] = useState<string>("");
    const [tags, setTags] = useState<string[]>([]);
    const [currentTag, setCurrentTag] = useState("");
    const [titleError, setTitleError] = useState("");

    const { collections } = useKnowledgeBase();

    useEffect(() => {
        if (resource) {
            setTitle(resource.title);
            setDescription(resource.description || "");
            setContent(resource.content || "");
            setIsActive(resource.isActive);
            setCollectionId(resource.collectionId || "");
            setTags(resource.tags || []);
        } else {
            setTitle("");
            setDescription("");
            setContent("");
            setIsActive(true);
            setCollectionId("");
            setTags([]);
        }
        setCurrentTag("");
        setTitleError("");
    }, [resource, open]);

    // Set the form schema based on resource type
    useEffect(() => {
        switch (resourceType) {
            case "ARTICLE":
                setSelectedSchema("article");
                break;
            case "FAQ":
                setSelectedSchema("faq");
                break;
            case "FILE_UPLOAD":
                setSelectedSchema("file");
                break;
            case "DIRECTORY":
                setSelectedSchema("directory");
                break;
            default:
                setSelectedSchema("article");
        }
    }, [resourceType]);

    // Setup form with dynamic schema
    const getFormSchema = () => {
        switch (selectedSchema) {
            case "article":
                return articleSchema;
            case "faq":
                return faqSchema;
            case "file":
                return fileSchema;
            case "directory":
                return directorySchema;
            default:
                return articleSchema;
        }
    };

    const form = useForm<z.infer<ReturnType<typeof getFormSchema>>>({
        resolver: zodResolver(getFormSchema()),
        defaultValues: {
            title: "",
            description: "",
            resourceType,
            collectionId: "",
            tags: [],
            isActive: true,
            contextScope: [],
            // Article specific
            content: "",
            categoryId: "",
            isDraft: false,
            // FAQ specific
            question: "",
            answer: "",
            category: "",
            // Directory specific
            path: "",
            recursive: true,
            fileTypes: [],
            includePatterns: [],
            excludePatterns: [],
        }
    });

    // Reset form when dialog closes
    useEffect(() => {
        if (!open) {
            form.reset();
            setSelectedFile(null);
        }
    }, [open, form]);

    // Update form values when resource type changes
    useEffect(() => {
        form.setValue("resourceType", resourceType);
    }, [resourceType, form]);

    const handleAddTag = () => {
        if (currentTag.trim() && !tags.includes(currentTag.trim())) {
            setTags([...tags, currentTag.trim()]);
            setCurrentTag("");
        }
    };

    const handleRemoveTag = (tag: string) => {
        setTags(tags.filter((t) => t !== tag));
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && currentTag.trim()) {
            e.preventDefault();
            handleAddTag();
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Validate
        if (!title.trim()) {
            setTitleError("Title is required");
            return;
        }

        if (isEditing && resource) {
            // Update existing resource
            const updateData: UpdateResourceRequest = {
                id: resource.id,
                title: title.trim(),
                description: description.trim(),
                content,
                isActive,
                tags,
                collectionId: collectionId || undefined
            };
            onSave(updateData);
        } else {
            // Create new resource
            const createData: CreateResourceRequest = {
                title: title.trim(),
                description: description.trim(),
                content,
                isActive,
                collectionId: collectionId || "",
                tags,
                resourceType
            };
            onSave(createData);
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

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>
                        {isEditing
                            ? `Edit ${resourceType.charAt(0) + resourceType.slice(1).toLowerCase().replace('_', ' ')}`
                            : `Add ${resourceType.charAt(0) + resourceType.slice(1).toLowerCase().replace('_', ' ')}`}
                    </DialogTitle>
                    <DialogDescription>
                        {isEditing
                            ? "Update the details and content of this resource"
                            : "Create a new knowledge resource for the AI assistant"}
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <Tabs defaultValue={selectedSchema} onValueChange={(value) => setSelectedSchema(value as any)}>
                            <TabsList className="grid w-full grid-cols-4">
                                <TabsTrigger value="article" onClick={() => form.setValue("resourceType", "ARTICLE")}>Article</TabsTrigger>
                                <TabsTrigger value="faq" onClick={() => form.setValue("resourceType", "FAQ")}>FAQ</TabsTrigger>
                                <TabsTrigger value="file" onClick={() => form.setValue("resourceType", "FILE_UPLOAD")}>File Upload</TabsTrigger>
                                <TabsTrigger value="directory" onClick={() => form.setValue("resourceType", "DIRECTORY")}>Directory</TabsTrigger>
                            </TabsList>

                            {/* Common fields for all resource types */}
                            <div className="py-4 space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="title"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Title</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="Enter resource title"
                                                        {...field}
                                                        value={title}
                                                        onChange={(e) => {
                                                            field.onChange(e.target.value);
                                                            setTitle(e.target.value);
                                                            setTitleError("");
                                                        }}
                                                    />
                                                </FormControl>
                                                {titleError && <FormMessage />}
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
                                                        {Array.isArray(collections) ? collections.map((collection) => (
                                                            <SelectItem key={collection.id} value={collection.id}>
                                                                {collection.name}
                                                            </SelectItem>
                                                        )) : null}
                                                    </SelectContent>
                                                </Select>
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
                                                    placeholder="Enter a detailed description"
                                                    className="min-h-[80px]"
                                                    {...field}
                                                    value={description}
                                                    onChange={(e) => {
                                                        field.onChange(e.target.value);
                                                        setDescription(e.target.value);
                                                    }}
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
                                                        id="tags"
                                                        value={currentTag}
                                                        onChange={(e) => {
                                                            field.onChange(e.target.value);
                                                            setCurrentTag(e.target.value);
                                                        }}
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
                                                Enter tags to categorize this resource
                                            </FormDescription>
                                            <FormMessage />
                                            {tags.length > 0 && (
                                                <ScrollArea className="h-16 w-full border rounded-md p-2 mt-2">
                                                    <div className="flex flex-wrap gap-2">
                                                        {tags.map((tag) => (
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
                                                    Make this resource available for AI queries
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

                            {/* Article specific fields */}
                            <TabsContent value="article" className="space-y-4">
                                <FormField
                                    control={form.control}
                                    name="categoryId"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Category</FormLabel>
                                            <Select onValueChange={field.onChange} value={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select a category" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {/* Add category options here */}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="content"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Content</FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    placeholder="Enter the article content"
                                                    className="min-h-[250px]"
                                                    {...field}
                                                    value={content}
                                                    onChange={(e) => {
                                                        field.onChange(e.target.value);
                                                        setContent(e.target.value);
                                                    }}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="isDraft"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                                            <div className="space-y-0.5">
                                                <FormLabel>Draft Status</FormLabel>
                                                <FormDescription>
                                                    Save as draft (not visible to AI)
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
                            </TabsContent>

                            {/* FAQ specific fields */}
                            <TabsContent value="faq" className="space-y-4">
                                <FormField
                                    control={form.control}
                                    name="category"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Category</FormLabel>
                                            <Select onValueChange={field.onChange} value={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select a category" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {/* Add category options here */}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="question"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Question</FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    placeholder="Enter the frequently asked question"
                                                    className="min-h-[100px]"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="answer"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Answer</FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    placeholder="Enter the answer to the question"
                                                    className="min-h-[150px]"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </TabsContent>

                            {/* File upload specific fields */}
                            <TabsContent value="file" className="space-y-4">
                                <FormField
                                    control={form.control}
                                    name="file"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>File</FormLabel>
                                            <FormControl>
                                                <FileUploader
                                                    onFileSelected={(file) => {
                                                        setSelectedFile(file);
                                                        field.onChange(file);
                                                    }}
                                                    selectedFile={selectedFile}
                                                />
                                            </FormControl>
                                            <FormDescription>
                                                Upload a PDF, DOCX, XLSX, TXT, CSV, JSON, HTML, or MD file
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </TabsContent>

                            {/* Directory specific fields */}
                            <TabsContent value="directory" className="space-y-4">
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
                            </TabsContent>
                        </Tabs>

                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => onOpenChange(false)}
                                disabled={isSubmitting}
                            >
                                Cancel
                            </Button>
                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                {isEditing ? "Update" : "Create"}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}