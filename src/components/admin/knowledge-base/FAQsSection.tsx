import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, Search, Plus, PenLine, Trash2, HelpCircle, AlertCircle, X, Save } from "lucide-react";
import { KnowledgeResource, ResourceType, CreateResourceRequest, UpdateResourceRequest } from "@/types/knowledge-base";
import { format } from "date-fns";
import { useKnowledgeBase } from "@/hooks/knowledge-base/useKnowledgeBase";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { MultiSelect } from "@/components/ui/multi-select";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

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

// FAQ form schema
const faqFormSchema = z.object({
    title: z.string().min(3, "Title must be at least 3 characters"),
    description: z.string().min(10, "Description must be at least 10 characters"),
    question: z.string().min(10, "Question must be at least 10 characters"),
    answer: z.string().min(20, "Answer must be at least 20 characters"),
    category: z.string().optional(),
    collectionId: z.string().min(1, "Collection is required"),
    tags: z.array(z.string()).optional().default([]),
    isActive: z.boolean().default(true),
});

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
    const [isEditing, setIsEditing] = useState(false);
    const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery);
    const [currentTag, setCurrentTag] = useState("");

    const {
        handleAddResource,
        handleUpdateResource,
        handleDeleteResource,
        collections
    } = useKnowledgeBase() as any; // Type assertion to resolve linter errors

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
    const form = useForm<z.infer<typeof faqFormSchema>>({
        resolver: zodResolver(faqFormSchema),
        defaultValues: {
            title: selectedResource?.title || "",
            description: selectedResource?.description || "",
            question: selectedResource?.title || "",
            answer: selectedResource?.content || "",
            category: selectedResource?.category || "",
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
                question: selectedResource.title,
                answer: selectedResource.content || "",
                category: selectedResource.category || "",
                collectionId: selectedResource.collectionId || "",
                tags: selectedResource.tags || [],
                isActive: selectedResource.isActive,
            });
            setIsEditing(true);
        } else {
            form.reset({
                title: "",
                description: "",
                question: "",
                answer: "",
                category: "",
                collectionId: collections && collections.length > 0 ? collections[0].id : "",
                tags: [],
                isActive: true,
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

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && currentTag.trim()) {
            e.preventDefault();
            handleAddTag();
        }
    };

    const handleCreateNew = () => {
        form.reset({
            title: "",
            description: "",
            question: "",
            answer: "",
            category: "",
            collectionId: collections && collections.length > 0 ? collections[0].id : "",
            tags: [],
            isActive: true,
        });
        setIsEditing(false);
        onSelectResource("");
    };

    const handleDelete = (id: string) => {
        if (confirm("Are you sure you want to delete this FAQ?")) {
            handleDeleteResource(id);
            if (selectedResourceId === id) {
                onSelectResource("");
                handleCreateNew();
            }
        }
    };

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setLocalSearchQuery(e.target.value);
        onSearchChange(e.target.value);
    };

    const onSubmit = (data: z.infer<typeof faqFormSchema>) => {
        if (isEditing && selectedResource) {
            // Update existing resource
            const updateData: UpdateResourceRequest = {
                id: selectedResource.id,
                title: data.title.trim(),
                description: data.description.trim(),
                content: data.answer,
                isActive: data.isActive,
                tags: data.tags,
                collectionId: data.collectionId
            };
            handleUpdateResource(selectedResource.id, updateData);
        } else {
            // Create new resource
            const createData: CreateResourceRequest = {
                title: data.title.trim(),
                description: data.description.trim(),
                content: data.answer,
                isActive: data.isActive,
                collectionId: data.collectionId,
                tags: data.tags,
                resourceType: "FAQ"
            };
            handleAddResource(createData);
        }
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
                <Button onClick={handleCreateNew}>
                    <Plus className="mr-2 h-4 w-4" />
                    New FAQ
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
                    <div className="border rounded-lg p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold">
                                {isEditing ? "Edit FAQ" : "Create New FAQ"}
                            </h2>
                            {isEditing && selectedResource && (
                                <div className="flex gap-2">
                                    <Button
                                        variant="destructive"
                                        size="sm"
                                        onClick={() => handleDelete(selectedResource.id)}
                                    >
                                        <Trash2 className="h-4 w-4 mr-1" />
                                        Delete
                                    </Button>
                                </div>
                            )}
                        </div>

                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="title"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Question Title</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Enter a concise title for this FAQ" {...field} />
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
                                                    placeholder="Enter a brief description of this FAQ"
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
                                    name="question"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Full Question</FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    placeholder="Enter the complete question"
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
                                                Enter tags to categorize this FAQ
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
                                                    Make this FAQ available for AI queries
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
                                        {isEditing ? "Update FAQ" : "Create FAQ"}
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