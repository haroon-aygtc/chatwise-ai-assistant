
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { Eye, Edit, Trash2, Save, FileUp } from "lucide-react";
import KnowledgeBaseService from "@/services/knowledge-base/knowledgeBaseService";
import { DocumentCategory } from "@/types/knowledge-base";
import { format } from "date-fns";

interface DocumentDetailProps {
  documentId: string;
  categories: DocumentCategory[];
  onDelete: (id: string) => void;
}

export const DocumentDetail = ({ documentId, categories, onDelete }: DocumentDetailProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const queryClient = useQueryClient();

  // Fetch document details
  const { 
    data: document,
    isLoading,
    isError
  } = useQuery({
    queryKey: ['knowledgeBase', 'document', documentId],
    queryFn: () => KnowledgeBaseService.getDocumentById(documentId),
    enabled: !!documentId
  });

  // Update document mutation
  const updateDocumentMutation = useMutation({
    mutationFn: (data: any) => KnowledgeBaseService.updateDocument(documentId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['knowledgeBase', 'document', documentId] });
      queryClient.invalidateQueries({ queryKey: ['knowledgeBase', 'documents'] });
      setIsEditing(false);
      toast.success("Document updated successfully");
    },
    onError: (error: any) => {
      toast.error(`Failed to update document: ${error.message || "Unknown error"}`);
    }
  });

  // Form state
  const [formState, setFormState] = useState({
    title: '',
    description: '',
    content: '',
    categoryId: '',
    tags: '',
    priority: 'medium'
  });

  // Update form state when document data is loaded
  useState(() => {
    if (document) {
      setFormState({
        title: document.title,
        description: document.description,
        content: document.content,
        categoryId: document.categoryId,
        tags: document.tags.join(', '),
        priority: 'medium' // Default value
      });
    }
  });

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormState(prev => ({ ...prev, [name]: value }));
  };

  // Handle select changes
  const handleSelectChange = (name: string, value: string) => {
    setFormState(prev => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const updateData = {
      title: formState.title,
      description: formState.description,
      content: formState.content,
      categoryId: formState.categoryId,
      tags: formState.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
    };
    
    updateDocumentMutation.mutate(updateData);
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="pt-6 space-y-4">
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-40 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (isError || !document) {
    return (
      <Card>
        <CardContent className="pt-6 text-center">
          <p className="text-destructive">Error loading document</p>
          <Button 
            variant="outline" 
            onClick={() => queryClient.invalidateQueries({ queryKey: ['knowledgeBase', 'document', documentId] })}
            className="mt-2"
          >
            Try Again
          </Button>
        </CardContent>
      </Card>
    );
  }

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'PPP p');
    } catch (e) {
      return dateString;
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>{document.title}</CardTitle>
          <CardDescription>
            Category: {categories.find(c => c.id === document.categoryId)?.name || 'Unknown'}
          </CardDescription>
        </div>
        <div className="flex gap-2">
          {!isEditing ? (
            <>
              <Button variant="outline" size="icon">
                <Eye className="h-4 w-4" />
              </Button>
              <Button 
                variant="outline" 
                size="icon"
                onClick={() => setIsEditing(true)}
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="text-destructive"
                onClick={() => onDelete(document.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditing(false)}
            >
              Cancel
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent>
        <Tabs defaultValue="content">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="metadata">Metadata</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          {isEditing ? (
            <form onSubmit={handleSubmit}>
              <TabsContent value="content" className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="content">Document Content</Label>
                  <Textarea
                    id="content"
                    name="content"
                    value={formState.content}
                    onChange={handleInputChange}
                    rows={15}
                    className="font-mono"
                  />
                  <p className="text-xs text-muted-foreground">
                    This content will be processed for AI knowledge retrieval
                  </p>
                </div>
                <div className="flex justify-end">
                  <Button type="submit" disabled={updateDocumentMutation.isPending}>
                    <Save className="mr-2 h-4 w-4" /> 
                    {updateDocumentMutation.isPending ? "Saving..." : "Save Content"}
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="metadata" className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    name="title"
                    value={formState.title}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formState.description}
                    onChange={handleInputChange}
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="categoryId">Category</Label>
                  <Select 
                    value={formState.categoryId} 
                    onValueChange={(value) => handleSelectChange("categoryId", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(category => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tags">Tags</Label>
                  <Input
                    id="tags"
                    name="tags"
                    value={formState.tags}
                    onChange={handleInputChange}
                    placeholder="Enter tags separated by commas"
                  />
                  <p className="text-xs text-muted-foreground">
                    Separate tags with commas (e.g., product, feature, guide)
                  </p>
                </div>
                <div className="flex justify-end">
                  <Button type="submit" disabled={updateDocumentMutation.isPending}>
                    <Save className="mr-2 h-4 w-4" /> 
                    {updateDocumentMutation.isPending ? "Saving..." : "Save Metadata"}
                  </Button>
                </div>
              </TabsContent>
            </form>
          ) : (
            <>
              <TabsContent value="content" className="pt-4">
                <div className="border rounded-md p-4 whitespace-pre-wrap min-h-[300px] font-mono text-sm">
                  {document.content || "No content available"}
                </div>
              </TabsContent>

              <TabsContent value="metadata" className="space-y-4 pt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium">Title</p>
                    <p className="text-sm text-muted-foreground">{document.title}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Category</p>
                    <p className="text-sm text-muted-foreground">
                      {categories.find(c => c.id === document.categoryId)?.name || 'Unknown'}
                    </p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-sm font-medium">Description</p>
                    <p className="text-sm text-muted-foreground">{document.description}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">File Type</p>
                    <p className="text-sm text-muted-foreground">{document.fileType.toUpperCase()}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">File Size</p>
                    <p className="text-sm text-muted-foreground">
                      {document.fileSize < 1024
                        ? `${document.fileSize} B`
                        : document.fileSize < 1048576
                        ? `${(document.fileSize / 1024).toFixed(1)} KB`
                        : `${(document.fileSize / 1048576).toFixed(1)} MB`}
                    </p>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium mb-2">Tags</p>
                  <div className="flex flex-wrap gap-2">
                    {document.tags.length > 0 ? (
                      document.tags.map((tag, index) => (
                        <Badge key={index} variant="secondary">
                          {tag}
                        </Badge>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground">No tags</p>
                    )}
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium mb-2">History</p>
                  <div className="text-sm text-muted-foreground">
                    <div className="flex justify-between">
                      <span>Created:</span>
                      <span>{formatDate(document.uploadedAt)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Last Updated:</span>
                      <span>{formatDate(document.lastUpdated || document.uploadedAt)}</span>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </>
          )}

          <TabsContent value="settings" className="space-y-4 pt-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Include in AI Responses</p>
                  <p className="text-sm text-muted-foreground">
                    Make this document available to the AI
                  </p>
                </div>
                <div>
                  <Switch checked={true} />
                </div>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Priority Level</p>
                  <p className="text-sm text-muted-foreground">
                    Set the importance of this document
                  </p>
                </div>
                <Select defaultValue="medium">
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Document Status</p>
                  <p className="text-sm text-muted-foreground">
                    Current processing status
                  </p>
                </div>
                <Badge variant={document.status === "indexed" ? "default" : document.status === "processing" ? "secondary" : "destructive"}>
                  {document.status.charAt(0).toUpperCase() + document.status.slice(1)}
                </Badge>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
