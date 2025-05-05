import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Database,
  FileText,
  FolderPlus,
  Search,
  Upload,
  Plus,
  Trash2,
  Edit,
  Eye,
  FileUp,
  Save,
} from "lucide-react";
import { Switch } from "@/components/ui/switch";

const KnowledgeBase = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDocument, setSelectedDocument] = useState<string | null>(null);
  const [documentContent, setDocumentContent] = useState("");

  const documents = [
    {
      id: "1",
      title: "Product Information",
      category: "Products",
      tags: ["features", "pricing"],
      updatedAt: "2023-06-15",
    },
    {
      id: "2",
      title: "Frequently Asked Questions",
      category: "Support",
      tags: ["faq", "help"],
      updatedAt: "2023-06-10",
    },
    {
      id: "3",
      title: "Return Policy",
      category: "Policies",
      tags: ["returns", "refunds"],
      updatedAt: "2023-05-28",
    },
    {
      id: "4",
      title: "User Guide",
      category: "Documentation",
      tags: ["guide", "tutorial"],
      updatedAt: "2023-05-20",
    },
    {
      id: "5",
      title: "API Documentation",
      category: "Technical",
      tags: ["api", "developer"],
      updatedAt: "2023-05-15",
    },
  ];

  const handleDocumentSelect = (id: string) => {
    setSelectedDocument(id);
    // In a real app, this would fetch the document content
    setDocumentContent(
      "This is the content of the selected document. It would contain detailed information that the AI can use to provide accurate responses to user queries. The content would be formatted with headings, paragraphs, lists, and other elements to make it easy for the AI to parse and understand.",
    );
  };

  const filteredDocuments = documents.filter(
    (doc) =>
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.tags.some((tag) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase()),
      ),
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Knowledge Base</h1>
          <p className="text-muted-foreground">
            Manage the information your AI can access
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <FolderPlus className="mr-2 h-4 w-4" /> New Category
          </Button>
          <Button>
            <Upload className="mr-2 h-4 w-4" /> Upload Document
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-5">
        <div className="md:col-span-2 space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Documents</CardTitle>
                <Badge variant="outline" className="ml-2">
                  {documents.length}
                </Badge>
              </div>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search documents..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[500px]">
                <div className="divide-y">
                  {filteredDocuments.map((doc) => (
                    <div
                      key={doc.id}
                      className={`p-4 cursor-pointer hover:bg-muted/50 ${selectedDocument === doc.id ? "bg-muted" : ""}`}
                      onClick={() => handleDocumentSelect(doc.id)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          <FileText className="h-5 w-5 text-muted-foreground mt-0.5" />
                          <div>
                            <p className="font-medium">{doc.title}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="secondary" className="text-xs">
                                {doc.category}
                              </Badge>
                              <p className="text-xs text-muted-foreground">
                                Updated: {doc.updatedAt}
                              </p>
                            </div>
                            <div className="flex flex-wrap gap-1 mt-2">
                              {doc.tags.map((tag, i) => (
                                <Badge
                                  key={i}
                                  variant="outline"
                                  className="text-xs"
                                >
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  {filteredDocuments.length === 0 && (
                    <div className="p-8 text-center">
                      <p className="text-muted-foreground">
                        No documents found
                      </p>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Categories</CardTitle>
              <CardDescription>Organize your knowledge base</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Database className="h-4 w-4 text-muted-foreground" />
                    <span>Products</span>
                  </div>
                  <Badge>1</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Database className="h-4 w-4 text-muted-foreground" />
                    <span>Support</span>
                  </div>
                  <Badge>1</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Database className="h-4 w-4 text-muted-foreground" />
                    <span>Policies</span>
                  </div>
                  <Badge>1</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Database className="h-4 w-4 text-muted-foreground" />
                    <span>Documentation</span>
                  </div>
                  <Badge>1</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Database className="h-4 w-4 text-muted-foreground" />
                    <span>Technical</span>
                  </div>
                  <Badge>1</Badge>
                </div>
              </div>
              <div className="mt-4">
                <Button variant="outline" size="sm" className="w-full">
                  <Plus className="mr-2 h-4 w-4" /> Add Category
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-3">
          {selectedDocument ? (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>
                    {documents.find((d) => d.id === selectedDocument)?.title}
                  </CardTitle>
                  <CardDescription>
                    Category:{" "}
                    {documents.find((d) => d.id === selectedDocument)?.category}
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="icon">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="content">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="content">Content</TabsTrigger>
                    <TabsTrigger value="metadata">Metadata</TabsTrigger>
                    <TabsTrigger value="settings">Settings</TabsTrigger>
                  </TabsList>
                  <TabsContent value="content" className="space-y-4 pt-4">
                    <Textarea
                      rows={15}
                      value={documentContent}
                      onChange={(e) => setDocumentContent(e.target.value)}
                    />
                    <div className="flex justify-end">
                      <Button>
                        <Save className="mr-2 h-4 w-4" /> Save Changes
                      </Button>
                    </div>
                  </TabsContent>
                  <TabsContent value="metadata" className="space-y-4 pt-4">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Title</Label>
                        <Input
                          value={
                            documents.find((d) => d.id === selectedDocument)
                              ?.title
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Category</Label>
                        <Select
                          defaultValue={
                            documents.find((d) => d.id === selectedDocument)
                              ?.category
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Products">Products</SelectItem>
                            <SelectItem value="Support">Support</SelectItem>
                            <SelectItem value="Policies">Policies</SelectItem>
                            <SelectItem value="Documentation">
                              Documentation
                            </SelectItem>
                            <SelectItem value="Technical">Technical</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Tags</Label>
                        <Input
                          value={documents
                            .find((d) => d.id === selectedDocument)
                            ?.tags.join(", ")}
                        />
                        <p className="text-xs text-muted-foreground">
                          Separate tags with commas
                        </p>
                      </div>
                      <div className="flex justify-end">
                        <Button>
                          <Save className="mr-2 h-4 w-4" /> Save Metadata
                        </Button>
                      </div>
                    </div>
                  </TabsContent>
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
                          <p className="font-medium">Version History</p>
                          <p className="text-sm text-muted-foreground">
                            Track changes to this document
                          </p>
                        </div>
                        <Button variant="outline" size="sm">
                          <FileUp className="mr-2 h-4 w-4" /> View All Versions
                        </Button>
                        <div className="mt-4 space-y-3">
                          <div className="rounded-md border p-3">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <Badge variant="outline">v1.2</Badge>
                                <p className="text-sm font-medium">
                                  Updated content section
                                </p>
                              </div>
                              <p className="text-xs text-muted-foreground">
                                Today at 2:30 PM
                              </p>
                            </div>
                            <p className="mt-1 text-xs text-muted-foreground">
                              Modified by Admin User
                            </p>
                          </div>
                          <div className="rounded-md border p-3">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <Badge variant="outline">v1.1</Badge>
                                <p className="text-sm font-medium">
                                  Updated metadata
                                </p>
                              </div>
                              <p className="text-xs text-muted-foreground">
                                Yesterday at 10:15 AM
                              </p>
                            </div>
                            <p className="mt-1 text-xs text-muted-foreground">
                              Modified by Admin User
                            </p>
                          </div>
                          <div className="rounded-md border p-3">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <Badge variant="outline">v1.0</Badge>
                                <p className="text-sm font-medium">
                                  Initial document creation
                                </p>
                              </div>
                              <p className="text-xs text-muted-foreground">
                                June 12, 2023
                              </p>
                            </div>
                            <p className="mt-1 text-xs text-muted-foreground">
                              Created by Admin User
                            </p>
                          </div>
                        </div>
                      </div>
                      <Separator />
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Document Access</p>
                          <p className="text-sm text-muted-foreground">
                            Control who can view this document
                          </p>
                        </div>
                        <Select defaultValue="public">
                          <SelectTrigger className="w-32">
                            <SelectValue placeholder="Select access" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="public">Public</SelectItem>
                            <SelectItem value="restricted">
                              Restricted
                            </SelectItem>
                            <SelectItem value="private">Private</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <Separator />
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-destructive">
                            Danger Zone
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Irreversible actions
                          </p>
                        </div>
                        <Button variant="destructive" size="sm">
                          <Trash2 className="mr-2 h-4 w-4" /> Delete Document
                        </Button>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-muted">
                  <FileText className="h-10 w-10 text-muted-foreground" />
                </div>
                <h3 className="mt-4 text-lg font-medium">
                  No Document Selected
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Select a document from the list to view or edit its content.
                </p>
                <Button className="mt-4" variant="outline">
                  <Plus className="mr-2 h-4 w-4" /> Create New Document
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default KnowledgeBase;
