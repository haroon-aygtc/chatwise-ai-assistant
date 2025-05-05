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
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  MessageSquare,
  Plus,
  Trash2,
  RefreshCw,
  Search,
  Edit,
  Copy,
  Tag,
  AlertCircle,
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PromptTemplate } from "@/types/ai-configuration";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

export interface PromptTemplateManagerProps {
  standalone?: boolean;
}

export const PromptTemplateManager = ({
  standalone = false,
}: PromptTemplateManagerProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [currentTemplate, setCurrentTemplate] = useState<PromptTemplate | null>(
    null,
  );
  const [newTemplate, setNewTemplate] = useState<Partial<PromptTemplate>>({
    name: "",
    description: "",
    content: "",
    category: "general",
    variables: [],
  });

  const [templates, setTemplates] = useState<PromptTemplate[]>([
    {
      id: "template1",
      name: "Welcome Message",
      description: "Initial greeting for new users",
      content:
        "Hello {user_name}, welcome to {company_name}! I'm your AI assistant and I'm here to help you with any questions about our products and services.",
      variables: ["user_name", "company_name"],
      category: "general",
      isDefault: true,
    },
    {
      id: "template2",
      name: "Product Information",
      description: "Details about products and services",
      content:
        "Our {product_name} offers the following features: {features}. The pricing starts at {price}. Would you like more specific information about any of these features?",
      variables: ["product_name", "features", "price"],
      category: "products",
      isDefault: false,
    },
    {
      id: "template3",
      name: "Technical Support",
      description: "Handling technical questions",
      content:
        "I understand you're having an issue with {issue_description}. Let me help you troubleshoot this. First, could you tell me if you've tried {troubleshooting_step}?",
      variables: ["issue_description", "troubleshooting_step"],
      category: "support",
      isDefault: false,
    },
  ]);

  const categories = [
    { id: "general", name: "General" },
    { id: "products", name: "Products" },
    { id: "support", name: "Support" },
    { id: "sales", name: "Sales" },
  ];

  const handleRefresh = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  const handleAddTemplate = () => {
    setNewTemplate({
      name: "",
      description: "",
      content: "",
      category: "general",
      variables: [],
    });
    setShowAddDialog(true);
  };

  const handleEditTemplate = (template: PromptTemplate) => {
    setCurrentTemplate(template);
    setShowEditDialog(true);
  };

  const handleDeleteTemplate = (id: string) => {
    setTemplates(templates.filter((template) => template.id !== id));
  };

  const handleSaveNewTemplate = () => {
    if (newTemplate.name && newTemplate.content) {
      const variableMatches = newTemplate.content.match(/\{([^}]+)\}/g) || [];
      const extractedVariables = variableMatches.map((v) =>
        v.replace(/[{}]/g, ""),
      );

      const template: PromptTemplate = {
        id: `template${templates.length + 1}`,
        name: newTemplate.name,
        description: newTemplate.description || "",
        content: newTemplate.content,
        variables: extractedVariables,
        category: newTemplate.category || "general",
        isDefault: false,
      };

      setTemplates([...templates, template]);
      setShowAddDialog(false);
    }
  };

  const handleSaveEditedTemplate = () => {
    if (currentTemplate) {
      const updatedTemplates = templates.map((template) =>
        template.id === currentTemplate.id ? currentTemplate : template,
      );
      setTemplates(updatedTemplates);
      setShowEditDialog(false);
      setCurrentTemplate(null);
    }
  };

  const handleVariableChange = (value: string) => {
    if (currentTemplate) {
      const variableMatches = value.match(/\{([^}]+)\}/g) || [];
      const extractedVariables = variableMatches.map((v) =>
        v.replace(/[{}]/g, ""),
      );
      setCurrentTemplate({
        ...currentTemplate,
        content: value,
        variables: extractedVariables,
      });
    }
  };

  const filteredTemplates = templates.filter((template) => {
    const matchesCategory =
      selectedCategory === "all" || template.category === selectedCategory;
    const matchesSearch =
      searchQuery === "" ||
      template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {standalone && (
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Prompt Templates</h1>
            <p className="text-muted-foreground">
              Create and manage reusable prompt templates for your AI
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
            <Button onClick={handleAddTemplate}>
              <Plus className="mr-2 h-4 w-4" /> Add Template
            </Button>
          </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-4 justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search templates..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
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
          <Button onClick={handleAddTemplate}>
            <Plus className="mr-2 h-4 w-4" /> Add Template
          </Button>
        </div>
      </div>

      {filteredTemplates.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <MessageSquare className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No Templates Found</h3>
            <p className="text-muted-foreground text-center mb-6">
              {searchQuery || selectedCategory !== "all"
                ? "No templates match your search criteria. Try adjusting your filters."
                : "You haven't created any prompt templates yet. Add your first template to get started."}
            </p>
            <Button onClick={handleAddTemplate}>
              <Plus className="mr-2 h-4 w-4" /> Add Template
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {filteredTemplates.map((template) => (
            <Card key={template.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center">
                      {template.name}
                      {template.isDefault && (
                        <Badge className="ml-2" variant="secondary">
                          Default
                        </Badge>
                      )}
                    </CardTitle>
                    <CardDescription>{template.description}</CardDescription>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditTemplate(template)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        // Clone template logic
                        const clonedTemplate = {
                          ...template,
                          id: `template${templates.length + 1}`,
                          name: `${template.name} (Copy)`,
                          isDefault: false,
                        };
                        setTemplates([...templates, clonedTemplate]);
                      }}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-destructive"
                      onClick={() => handleDeleteTemplate(template.id)}
                      disabled={template.isDefault}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-muted rounded-md">
                    <pre className="whitespace-pre-wrap text-sm">
                      {template.content}
                    </pre>
                  </div>
                  <div>
                    <Label>Variables</Label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {template.variables.map((variable) => (
                        <Badge key={variable} variant="outline">
                          {variable}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Tag className="mr-2 h-4 w-4" />
                  {categories.find((c) => c.id === template.category)?.name ||
                    "General"}
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>System Prompt</CardTitle>
          <CardDescription>
            Define the base behavior of your AI assistant
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Textarea
              rows={6}
              defaultValue="You are a helpful AI assistant for our company. Your goal is to provide accurate, helpful information to users in a friendly and professional tone."
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>
                Use variables like {"{company_name}"} or {"{user_name}"}
              </span>
              <span>Characters: 142</span>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button className="ml-auto">Save System Prompt</Button>
        </CardFooter>
      </Card>

      {/* Add Template Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Add New Template</DialogTitle>
            <DialogDescription>
              Create a new prompt template for your AI assistant
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                value={newTemplate.name}
                onChange={(e) =>
                  setNewTemplate({ ...newTemplate, name: e.target.value })
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Input
                id="description"
                value={newTemplate.description}
                onChange={(e) =>
                  setNewTemplate({
                    ...newTemplate,
                    description: e.target.value,
                  })
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="category" className="text-right">
                Category
              </Label>
              <Select
                value={newTemplate.category}
                onValueChange={(value) =>
                  setNewTemplate({ ...newTemplate, category: value })
                }
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="content" className="text-right pt-2">
                Content
              </Label>
              <div className="col-span-3 space-y-2">
                <Textarea
                  id="content"
                  rows={6}
                  value={newTemplate.content}
                  onChange={(e) =>
                    setNewTemplate({ ...newTemplate, content: e.target.value })
                  }
                  placeholder="Enter your prompt template here. Use {variable_name} for variables."
                />
                <p className="text-sm text-muted-foreground">
                  Use curly braces for variables, e.g., {"{user_name}"}
                </p>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowAddDialog(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleSaveNewTemplate}
              disabled={!newTemplate.name || !newTemplate.content}
            >
              Save Template
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Template Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Template</DialogTitle>
            <DialogDescription>Modify your prompt template</DialogDescription>
          </DialogHeader>
          {currentTemplate && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-name" className="text-right">
                  Name
                </Label>
                <Input
                  id="edit-name"
                  value={currentTemplate.name}
                  onChange={(e) =>
                    setCurrentTemplate({
                      ...currentTemplate,
                      name: e.target.value,
                    })
                  }
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-description" className="text-right">
                  Description
                </Label>
                <Input
                  id="edit-description"
                  value={currentTemplate.description}
                  onChange={(e) =>
                    setCurrentTemplate({
                      ...currentTemplate,
                      description: e.target.value,
                    })
                  }
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-category" className="text-right">
                  Category
                </Label>
                <Select
                  value={currentTemplate.category}
                  onValueChange={(value) =>
                    setCurrentTemplate({
                      ...currentTemplate,
                      category: value,
                    })
                  }
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-start gap-4">
                <Label htmlFor="edit-content" className="text-right pt-2">
                  Content
                </Label>
                <div className="col-span-3 space-y-2">
                  <Textarea
                    id="edit-content"
                    rows={6}
                    value={currentTemplate.content}
                    onChange={(e) => handleVariableChange(e.target.value)}
                  />
                  <div>
                    <Label>Variables (automatically detected)</Label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {currentTemplate.variables.map((variable) => (
                        <Badge key={variable} variant="outline">
                          {variable}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowEditDialog(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleSaveEditedTemplate}
              disabled={
                !currentTemplate ||
                !currentTemplate.name ||
                !currentTemplate.content
              }
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PromptTemplateManager;
