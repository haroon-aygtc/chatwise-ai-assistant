import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MultiSelect } from "@/components/ui/multi-select";
import { Label } from "@/components/ui/label";
import { Loader2, Save, Calendar, Tag, Clock, User } from "lucide-react";
import { ArticleResource, UpdateArticleRequest } from "@/types/knowledge-base";
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
import ReactMarkdown from "react-markdown";

interface ArticleDetailProps {
    article: ArticleResource;
    isEditing: boolean;
    onSave: () => void;
}

// Form schema for article editing
const articleFormSchema = z.object({
    title: z.string().min(3, "Title must be at least 3 characters"),
    description: z.string().min(10, "Description must be at least 10 characters"),
    content: z.string().min(20, "Content must be at least 20 characters"),
    categoryId: z.string().min(1, "Category is required"),
    collectionId: z.string().min(1, "Collection is required"),
    tags: z.array(z.string()).default([]),
    isActive: z.boolean().default(true),
    isDraft: z.boolean().default(false),
});

export function ArticleDetail({ article, isEditing, onSave }: ArticleDetailProps) {
    const { categories, collections, handleUpdateResource, updateResourceMutation } = useKnowledgeBase();
    const { toast } = useToast();
    const [viewTab, setViewTab] = useState<"preview" | "markdown">("preview");

    // Set up form
    const form = useForm<z.infer<typeof articleFormSchema>>({
        resolver: zodResolver(articleFormSchema),
        defaultValues: {
            title: article.title,
            description: article.description,
            content: article.content,
            categoryId: article.categoryId,
            collectionId: article.collectionId,
            tags: article.tags,
            isActive: article.isActive,
            isDraft: article.isDraft,
        },
    });

    // Update form values when article changes
    useEffect(() => {
        if (article) {
            form.reset({
                title: article.title,
                description: article.description,
                content: article.content,
                categoryId: article.categoryId,
                collectionId: article.collectionId,
                tags: article.tags,
                isActive: article.isActive,
                isDraft: article.isDraft,
            });
        }
    }, [article, form]);

    const onSubmit = async (data: z.infer<typeof articleFormSchema>) => {
        try {
            const updateData: UpdateArticleRequest = {
                id: article.id,
                title: data.title,
                description: data.description,
                content: data.content,
                categoryId: data.categoryId,
                collectionId: data.collectionId,
                tags: data.tags,
                isActive: data.isActive,
                isDraft: data.isDraft,
            };

            await handleUpdateResource(article.id, updateData);
            toast({
                title: "Article updated",
                description: "The article has been successfully updated.",
            });
            onSave();
        } catch (error) {
            console.error("Error updating article:", error);
            toast({
                title: "Error",
                description: "Failed to update the article. Please try again.",
                variant: "destructive",
            });
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
                                            <Input placeholder="Article title" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="grid grid-cols-2 gap-4">
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
                                                    {categories.map((category) => (
                                                        <SelectItem key={category.id} value={category.id}>
                                                            {category.name}
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
                            </div>

                            <FormField
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Description</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Enter a description for this article"
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
                                            Enter tags to categorize this article
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="grid grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="isActive"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                                            <div className="space-y-0.5">
                                                <FormLabel>Active Status</FormLabel>
                                                <FormDescription>
                                                    Make this article available for AI queries
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
                            </div>

                            <FormField
                                control={form.control}
                                name="content"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Content</FormLabel>
                                        <Tabs defaultValue="write" className="w-full">
                                            <TabsList className="mb-2">
                                                <TabsTrigger value="write">Write</TabsTrigger>
                                                <TabsTrigger value="preview">Preview</TabsTrigger>
                                            </TabsList>
                                            <TabsContent value="write">
                                                <FormControl>
                                                    <Textarea
                                                        placeholder="Enter the article content (Markdown supported)"
                                                        className="min-h-[300px] font-mono"
                                                        {...field}
                                                    />
                                                </FormControl>
                                            </TabsContent>
                                            <TabsContent value="preview">
                                                <Card>
                                                    <CardContent className="prose prose-sm mt-4 max-w-none">
                                                        <ReactMarkdown>{field.value}</ReactMarkdown>
                                                    </CardContent>
                                                </Card>
                                            </TabsContent>
                                        </Tabs>
                                        <FormMessage />
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
            <div className="grid grid-cols-2 gap-4">
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center mb-2">
                            <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                            <Label className="text-sm font-medium">Created</Label>
                        </div>
                        <p className="text-sm">
                            {format(new Date(article.createdAt), "MMM d, yyyy HH:mm")}
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
                            {format(new Date(article.updatedAt), "MMM d, yyyy HH:mm")}
                        </p>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardContent className="p-4">
                    <div className="flex items-center mb-2">
                        <User className="h-4 w-4 mr-2 text-muted-foreground" />
                        <Label className="text-sm font-medium">Author</Label>
                    </div>
                    <p className="text-sm">{article.authorId || "Unknown"}</p>
                </CardContent>
            </Card>

            <div className="flex items-center mb-4 mt-6">
                <Tag className="h-4 w-4 mr-2 text-muted-foreground" />
                <Label className="text-sm font-medium">Tags</Label>
            </div>

            <div className="flex flex-wrap gap-2 mb-6">
                {article.tags.length > 0 ? (
                    article.tags.map((tag) => (
                        <Badge key={tag} variant="secondary">
                            {tag}
                        </Badge>
                    ))
                ) : (
                    <p className="text-sm text-muted-foreground">No tags</p>
                )}
            </div>

            <div className="flex items-center justify-between mb-2">
                <Label className="text-lg font-medium">Content</Label>
                <Tabs value={viewTab} onValueChange={(value) => setViewTab(value as "preview" | "markdown")}>
                    <TabsList>
                        <TabsTrigger value="preview">Preview</TabsTrigger>
                        <TabsTrigger value="markdown">Markdown</TabsTrigger>
                    </TabsList>
                </Tabs>
            </div>

            {viewTab === "preview" ? (
                <div className="prose prose-sm max-w-none border rounded-lg p-6 bg-card">
                    <ReactMarkdown>{article.content}</ReactMarkdown>
                </div>
            ) : (
                <pre className="border rounded-lg p-6 bg-muted overflow-auto text-sm font-mono whitespace-pre-wrap">
                    {article.content}
                </pre>
            )}

            <div className="flex items-center justify-end gap-4 mt-6">
                <div className="flex items-center">
                    <div className={`h-2.5 w-2.5 rounded-full mr-2 ${article.isActive ? "bg-green-500" : "bg-yellow-500"}`} />
                    <span className="text-sm">{article.isActive ? "Active" : "Inactive"}</span>
                </div>

                {article.isDraft && (
                    <div className="flex items-center">
                        <div className="h-2.5 w-2.5 rounded-full mr-2 bg-blue-500" />
                        <span className="text-sm">Draft</span>
                    </div>
                )}
            </div>
        </div>
    );
} 