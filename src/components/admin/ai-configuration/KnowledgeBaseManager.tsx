
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  FileText,
  FolderOpen,
  Upload,
  Trash2,
  RefreshCw,
  Search,
  Plus,
  AlertCircle,
  Tag,
  FileUp,
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { DocumentCategory, KnowledgeDocument } from "@/types/ai-configuration";

export interface KnowledgeBaseManagerProps {
  standalone?: boolean;
}

export const KnowledgeBaseManager = ({
  standalone = false,
}: KnowledgeBaseManagerProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [documents, setDocuments] = useState<KnowledgeDocument[]>([
    {
      id: "doc1",
      title: "Product Features Overview",
      description: "Comprehensive guide to all product features",
      categoryId: "cat1",
      fileType: "pdf",
      fileSize: 1240000,
      uploadedAt: new Date().toISOString(),
      status: "indexed",
      content: "", // Added to fix type error
      tags: [], // Added to fix type error
      lastUpdated: new Date().toISOString(), // Added to fix type error
    },
    {
      id: "doc2",
      title: "Troubleshooting Guide",
      description: "Common issues and their solutions",
      categoryId: "cat2",
      fileType: "docx",
      fileSize: 890000,
      uploadedAt: new Date().toISOString(),
      status: "indexed",
      content: "", // Added to fix type error
      tags: [], // Added to fix type error
      lastUpdated: new Date().toISOString(), // Added to fix type error
    },
    {
      id: "doc3",
      title: "API Documentation",
      description: "Technical documentation for developers",
      categoryId: "cat3",
      fileType: "md",
      fileSize: 450000,
      uploadedAt: new Date().toISOString(),
      status: "processing",
      content: "", // Added to fix type error
      tags: [], // Added to fix type error
      lastUpdated: new Date().toISOString(), // Added to fix type error
    },
  ]);

  const [categories, setCategories] = useState<DocumentCategory[]>([
    { id: "cat1", name: "Product Information", documentCount: 1 },
    { id: "cat2", name: "Support", documentCount: 1 },
    { id: "cat3", name: "Technical", documentCount: 1 },
  ]);

  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleRefresh = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  const handleUpload = () => {
    setIsUploading(true);
    setUploadProgress(0);

    // Simulate file upload with progress
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        const newProgress = prev + 10;
        if (newProgress >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsUploading(false);
            // Add a new document
            const newDoc: KnowledgeDocument = {
              id: `doc${documents.length + 1}`,
              title: "New Uploaded Document",
              description: "Recently uploaded document",
              categoryId: "cat1",
              fileType: "pdf",
              fileSize: 1500000,
              uploadedAt: new Date().toISOString(),
              status: "processing",
              content: "", // Added to fix type error
              tags: [], // Added to fix type error
              lastUpdated: new Date().toISOString(), // Added to fix type error
            };
            setDocuments([...documents, newDoc]);
          }, 500);
          return 100;
        }
        return newProgress;
      });
    }, 300);
  };

  const handleDeleteDocument = (id: string) => {
    setDocuments(documents.filter((doc) => doc.id !== id));
  };

  const handleAddCategory = () => {
    const newCategory: DocumentCategory = {
      id: `cat${categories.length + 1}`,
      name: `New Category ${categories.length + 1}`,
      documentCount: 0,
    };
    setCategories([...categories, newCategory]);
  };

  const filteredDocuments = documents.filter((doc) => {
    const matchesCategory =
      selectedCategory === "all" || doc.categoryId === selectedCategory;
    const matchesSearch =
      searchQuery === "" ||
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getFileIcon = (fileType: string) => {
    switch (fileType) {
      case "pdf":
        return <FileText className="h-4 w-4 text-red-500" />;
      case "docx":
        return <FileText className="h-4 w-4 text-blue-500" />;
      case "md":
        return <FileText className="h-4 w-4 text-green-500" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "indexed":
        return <Badge variant="default">Indexed</Badge>;
      case "processing":
        return <Badge variant="default">Processing</Badge>;
      case "failed":
        return <Badge variant="destructive">Failed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="space-y-6">
      {standalone && (
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Knowledge Base</h1>
            <p className="text-muted-foreground">
              Manage documents that power your AI's knowledge
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={handleRefresh}
              disabled={isLoading}
            >
              <RefreshCw
                className={`mr-2 h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
              />
              Refresh
            </Button>
            <Button onClick={handleUpload} disabled={isUploading}>
              <Upload className="mr-2 h-4 w-4" /> Upload Document
            </Button>
          </div>
        </div>
      )}

      <Tabs defaultValue="documents">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="documents">
            <FileText className="mr-2 h-4 w-4" /> Documents
          </TabsTrigger>
          <TabsTrigger value="categories">
            <FolderOpen className="mr-2 h-4 w-4" /> Categories
          </TabsTrigger>
        </TabsList>

        <TabsContent value="documents" className="space-y-4 pt-4">
          <div className="flex flex-col md:flex-row gap-4 justify-between">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search documents..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Select
                value={selectedCategory}
                onValueChange={setSelectedCategory}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {isUploading && (
            <Card className="mb-4">
              <CardContent className="pt-6">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">
                      Uploading document...
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {uploadProgress}%
                    </span>
                  </div>
                  <Progress value={uploadProgress} className="h-2" />
                </div>
              </CardContent>
            </Card>
          )}

          {filteredDocuments.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No Documents Found</h3>
                <p className="text-muted-foreground text-center mb-6">
                  {searchQuery || selectedCategory !== "all"
                    ? "No documents match your search criteria. Try adjusting your filters."
                    : "You haven't added any documents yet. Upload your first document to get started."}
                </p>
                <Button onClick={handleUpload} disabled={isUploading}>
                  <Upload className="mr-2 h-4 w-4" /> Upload Document
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {filteredDocuments.map((doc) => (
                <Card key={doc.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4">
                        <div className="p-2 border rounded-md">
                          {getFileIcon(doc.fileType)}
                        </div>
                        <div>
                          <h3 className="font-medium">{doc.title}</h3>
                          <p className="text-sm text-muted-foreground">
                            {doc.description}
                          </p>
                          <div className="flex items-center mt-2 space-x-2">
                            <Badge variant="outline">
                              {doc.fileType.toUpperCase()}
                            </Badge>
                            <Badge variant="outline">
                              {formatFileSize(doc.fileSize)}
                            </Badge>
                            {getStatusBadge(doc.status)}
                            <span className="text-xs text-muted-foreground">
                              {new Date(doc.uploadedAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          View
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-destructive"
                          onClick={() => handleDeleteDocument(doc.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="categories" className="space-y-4 pt-4">
          <div className="flex justify-end">
            <Button onClick={handleAddCategory}>
              <Plus className="mr-2 h-4 w-4" /> Add Category
            </Button>
          </div>

          {categories.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <FolderOpen className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">
                  No Categories Found
                </h3>
                <p className="text-muted-foreground text-center mb-6">
                  You haven't created any categories yet. Create your first
                  category to organize your documents.
                </p>
                <Button onClick={handleAddCategory}>
                  <Plus className="mr-2 h-4 w-4" /> Add Category
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {categories.map((category) => (
                <Card key={category.id}>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <FolderOpen className="mr-2 h-5 w-5" />
                      {category.name}
                    </CardTitle>
                    <CardDescription>
                      {category.documentCount} document
                      {category.documentCount !== 1 ? "s" : ""}
                    </CardDescription>
                  </CardHeader>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline" size="sm">
                      <Tag className="mr-2 h-4 w-4" /> Rename
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle>Knowledge Base Settings</CardTitle>
          <CardDescription>
            Configure how your knowledge base integrates with AI responses
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="kb-integration">
                  Knowledge Base Integration
                </Label>
                <p className="text-sm text-muted-foreground">
                  Enable AI to use your knowledge base for responses
                </p>
              </div>
              <Switch id="kb-integration" checked={true} />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="kb-priority">Knowledge Priority</Label>
                <p className="text-sm text-muted-foreground">
                  How strongly should AI prefer knowledge base over general
                  knowledge
                </p>
              </div>
              <Select defaultValue="high">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="exclusive">Exclusive</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="kb-citation">Include Citations</Label>
                <p className="text-sm text-muted-foreground">
                  Add source references to AI responses
                </p>
              </div>
              <Switch id="kb-citation" checked={true} />
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button className="ml-auto">Save Settings</Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default KnowledgeBaseManager;
