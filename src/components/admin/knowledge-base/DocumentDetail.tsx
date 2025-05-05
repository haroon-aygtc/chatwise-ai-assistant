
import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Trash2, Save, Eye, FileUp, Edit, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { DocumentCategory, KnowledgeDocument, UpdateDocumentRequest } from "@/types/knowledge-base";
import KnowledgeBaseService from "@/services/knowledge-base/knowledgeBaseService";
import { formatDistanceToNow } from "date-fns";

interface DocumentDetailProps {
  documentId: string;
  categories: DocumentCategory[];
  onDelete: (id: string) => void;
}

export const DocumentDetail = ({ documentId, categories, onDelete }: DocumentDetailProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<UpdateDocumentRequest>({
    id: documentId,
    title: "",
    description: "",
    content: "",
    categoryId: "",
    tags: []
  });

  const queryClient = useQueryClient();

  // Fetch document details
  const { 
    data: document, 
    isLoading,
    isError
  } = useQuery({
    queryKey: ['knowledgeBase', 'document', documentId],
    queryFn: () => KnowledgeBaseService.getDocumentById(documentId)
  });

  // Update form data when document changes
  useEffect(() => {
    if (document) {
      setFormData({
        id: document.id,
        title: document.title,
        description: document.description,
        content: document.content,
        categoryId: document.categoryId,
        tags: document.tags
      });
    }
  }, [document]);

  // Update document mutation
  const updateDocumentMutation = useMutation({
    mutationFn: (data: UpdateDocumentRequest) => 
      KnowledgeBaseService.updateDocument(data.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['knowledgeBase', 'document', documentId] });
      queryClient.invalidateQueries({ queryKey: ['knowledgeBase', 'documents'] });
      toast.success("Document updated successfully");
      setIsEditing(false);
    },
    onError: (error: any) => {
      toast.error(`Failed to update document: ${error.message || "Unknown error"}`);
    }
  });

  const handleSave = () => {
    updateDocumentMutation.mutate(formData);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (value: string) => {
    setFormData((prev) => ({ ...prev, categoryId: value }));
  };

  const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const tagsString = e.target.value;
    const tagsArray = tagsString.split(',').map(tag => tag.trim()).filter(Boolean);
    setFormData((prev) => ({ ...prev, tags: tagsArray }));
  };

  const formatDate = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch (e) {
      return dateString;
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-4 w-1/2 mt-2" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-40 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (isError || !document) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <AlertCircle className="h-6 w-6 text-destructive mr-2" />
            <p className="text-destructive">Error loading document details</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>{document.title}</CardTitle>
          <CardDescription>
            {categories.find(c => c.id === document.categoryId)?.name || "Uncategorized"} • 
            {formatDate(document.lastUpdated || document.uploadedAt)}
          </CardDescription>
        </div>
        <div className="flex gap-2">
          {!isEditing ? (
            <>
              <Button variant="outline" size="icon" onClick={() => setIsEditing(true)}>
                <Edit className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" className="text-destructive" onClick={() => onDelete(document.id)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </>
          ) : (
            <Button variant="outline" size="icon" onClick={() => setIsEditing(false)}>
              <Eye className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent>
        <Tabs defaultValue={isEditing ? "metadata" : "content"}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="metadata">Metadata</TabsTrigger>
            <TabsTrigger value="info">Info</TabsTrigger>
          </TabsList>

          <TabsContent value="content" className="space-y-4 pt-4">
            {isEditing ? (
              <>
                <Textarea
                  name="content"
                  rows={15}
                  value={formData.content}
                  onChange={handleInputChange}
                  className="font-mono"
                />
                <div className="flex justify-end">
                  <Button onClick={handleSave} disabled={updateDocumentMutation.isPending}>
                    <Save className="mr-2 h-4 w-4" /> 
                    {updateDocumentMutation.isPending ? "Saving..." : "Save Content"}
                  </Button>
                </div>
              </>
            ) : (
              <div className="prose max-w-none">
                <pre className="whitespace-pre-wrap">{document.content}</pre>
              </div>
            )}
          </TabsContent>

          <TabsContent value="metadata" className="space-y-4 pt-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select 
                  value={formData.categoryId} 
                  onValueChange={handleSelectChange}
                  disabled={!isEditing}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Uncategorized</SelectItem>
                    {categories.map((category) => (
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
                  value={formData.tags?.join(', ') || ''}
                  onChange={handleTagsChange}
                  disabled={!isEditing}
                />
                <p className="text-xs text-muted-foreground">
                  Separate tags with commas
                </p>
              </div>

              {isEditing && (
                <div className="flex justify-end">
                  <Button 
                    onClick={handleSave}
                    disabled={updateDocumentMutation.isPending}
                  >
                    <Save className="mr-2 h-4 w-4" /> 
                    {updateDocumentMutation.isPending ? "Saving..." : "Save Metadata"}
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="info" className="space-y-4 pt-4">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium">File Type</p>
                  <p className="text-sm text-muted-foreground">
                    {document.fileType?.toUpperCase() || "Text Document"}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">File Size</p>
                  <p className="text-sm text-muted-foreground">
                    {document.fileSize ? (
                      document.fileSize < 1024 * 1024
                        ? `${Math.round(document.fileSize / 1024)} KB`
                        : `${Math.round(document.fileSize / (1024 * 1024))} MB`
                    ) : "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">Uploaded</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(document.uploadedAt).toLocaleDateString()} 
                    ({formatDate(document.uploadedAt)})
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">Last Updated</p>
                  <p className="text-sm text-muted-foreground">
                    {document.lastUpdated ? (
                      <>
                        {new Date(document.lastUpdated).toLocaleDateString()} 
                        ({formatDate(document.lastUpdated)})
                      </>
                    ) : "Never"}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">Status</p>
                  <Badge 
                    variant={document.status === 'indexed' ? 'default' : 
                      document.status === 'processing' ? 'secondary' : 'destructive'}
                  >
                    {document.status?.charAt(0).toUpperCase() + document.status?.slice(1) || "Unknown"}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm font-medium">ID</p>
                  <p className="text-sm text-muted-foreground truncate">
                    {document.id}
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
