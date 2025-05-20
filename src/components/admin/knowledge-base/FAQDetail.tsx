import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MultiSelect } from "@/components/ui/multi-select";
import { Label } from "@/components/ui/label";
import { Loader2, Save, Calendar, Tag, Clock, HelpCircle, MessageSquare } from "lucide-react";
import { FAQResource, UpdateFAQRequest } from "@/types/knowledge-base";
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

interface FAQDetailProps {
    faq: FAQResource;
    isEditing: boolean;
    onSave: () => void;
}

// Form schema for FAQ editing
const faqFormSchema = z.object({
    title: z.string().min(3, "Title must be at least 3 characters"),
    description: z.string().min(10, "Description must be at least 10 characters"),
    question: z.string().min(10, "Question must be at least 10 characters"),
    answer: z.string().min(20, "Answer must be at least 20 characters"),
    category: z.string().min(1, "Category is required"),
    collectionId: z.string().min(1, "Collection is required"),
    tags: z.array(z.string()).default([]),
    isActive: z.boolean().default(true),
});

export function FAQDetail({ faq, isEditing, onSave }: FAQDetailProps) {
    const { collections, categories, handleUpdateResource, updateResourceMutation } = useKnowledgeBase();
    const { toast } = useToast();

    // Set up form
    const form = useForm<z.infer<typeof faqFormSchema>>({
        resolver: zodResolver(faqFormSchema),
        defaultValues: {
            title: faq.title,
            description: faq.description,
            question: faq.question,
            answer: faq.answer,
            category: faq.category,
            collectionId: faq.collectionId,
            tags: faq.tags,
            isActive: faq.isActive,
        },
    });

    // Update form values when FAQ changes
    useEffect(() => {
        if (faq) {
            form.reset({
                title: faq.title,
                description: faq.description,
                question: faq.question,
                answer: faq.answer,
                category: faq.category,
                collectionId: faq.collectionId,
                tags: faq.tags,
                isActive: faq.isActive,
            });
        }
    }, [faq, form]);

    const onSubmit = async (data: z.infer<typeof faqFormSchema>) => {
        try {
            const updateData: UpdateFAQRequest = {
                id: faq.id,
                title: data.title,
                description: data.description,
                question: data.question,
                answer: data.answer,
                category: data.category,
                collectionId: data.collectionId,
                tags: data.tags,
                isActive: data.isActive,
            };

            await handleUpdateResource(faq.id, updateData);
            toast({
                title: "FAQ updated",
                description: "The FAQ has been successfully updated.",
            });
            onSave();
        } catch (error) {
            console.error("Error updating FAQ:", error);
            toast({
                title: "Error",
                description: "Failed to update the FAQ. Please try again.",
                variant: "destructive",
            });
        }
    };

    // Create a list of categories for the dropdown
    const categoryOptions = categories.map(category => ({
        id: category.id,
        name: category.name,
    }));

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
                                            <Input placeholder="FAQ title" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="grid grid-cols-2 gap-4">
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
                                                    {categoryOptions.map((category) => (
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
                                                placeholder="Enter a description for this FAQ"
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
                                        <FormLabel>Question</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Enter the question"
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
                                name="answer"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Answer</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Enter the answer"
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
                                            <MultiSelect
                                                placeholder="Add tags"
                                                selected={field.value || []}
                                                options={[]}
                                                onChange={field.onChange}
                                                creatable
                                            />
                                        </FormControl>
                                        <FormDescription>
                                            Enter tags to categorize this FAQ
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
                            {format(new Date(faq.createdAt), "MMM d, yyyy HH:mm")}
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
                            {format(new Date(faq.updatedAt), "MMM d, yyyy HH:mm")}
                        </p>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardContent className="p-4">
                    <div className="flex items-center mb-2">
                        <HelpCircle className="h-4 w-4 mr-2 text-muted-foreground" />
                        <Label className="text-sm font-medium">Question</Label>
                    </div>
                    <p className="text-sm font-medium">{faq.question}</p>
                </CardContent>
            </Card>

            <Card>
                <CardContent className="p-4">
                    <div className="flex items-center mb-2">
                        <MessageSquare className="h-4 w-4 mr-2 text-muted-foreground" />
                        <Label className="text-sm font-medium">Answer</Label>
                    </div>
                    <p className="text-sm whitespace-pre-wrap">{faq.answer}</p>
                </CardContent>
            </Card>

            <div className="flex items-center mb-4 mt-6">
                <Tag className="h-4 w-4 mr-2 text-muted-foreground" />
                <Label className="text-sm font-medium">Tags</Label>
            </div>

            <div className="flex flex-wrap gap-2 mb-6">
                {faq.tags.length > 0 ? (
                    faq.tags.map((tag) => (
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
                    <div className={`h-2.5 w-2.5 rounded-full mr-2 ${faq.isActive ? "bg-green-500" : "bg-yellow-500"}`} />
                    <span className="text-sm">{faq.isActive ? "Active" : "Inactive"}</span>
                </div>
            </div>
        </div>
    );
} 