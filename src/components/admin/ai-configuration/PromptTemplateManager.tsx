
import { useState, useEffect } from "react";
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
import { PromptTemplate, PromptVariable } from "@/types/ai-configuration";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { useQueryClient, useQuery, useMutation } from "@tanstack/react-query";
import promptTemplateService from "@/services/prompt-template/promptTemplateService";

export interface PromptTemplateManagerProps {
  standalone?: boolean;
}

export const PromptTemplateManager = ({
  standalone = false,
}: PromptTemplateManagerProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
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
    template: "",
    category: "general",
    variables: [],
    isActive: true,
  });
  const [systemPrompt, setSystemPrompt] = useState(
    "You are a helpful AI assistant for our company. Your goal is to provide accurate, helpful information to users in a friendly and professional tone."
  );

  // Fetch templates
  const { 
    data: templatesData, 
    isLoading, 
    refetch 
  } = useQuery({
    queryKey: ['promptTemplates', { search: searchQuery, category: selectedCategory }],
    queryFn: () => promptTemplateService.getAllTemplates({
      search: searchQuery || undefined,
      category: selectedCategory !== 'all' ? selectedCategory : undefined,
    }),
  });

  // Fetch categories
  const { data: categoriesData } = useQuery({
    queryKey: ['promptTemplateCategories'],
    queryFn: () => promptTemplateService.getCategories(),
  });

  // Create template mutation
  const createTemplateMutation = useMutation({
    mutationFn: (template: any) => promptTemplateService.createTemplate(template),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['promptTemplates'] });
      queryClient.invalidateQueries({ queryKey: ['promptTemplateCategories'] });
      setShowAddDialog(false);
      toast({
        title: "Success",
        description: "Template created successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create template",
        variant: "destructive",
      });
    },
  });

  // Update template mutation
  const updateTemplateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => 
      promptTemplateService.updateTemplate(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['promptTemplates'] });
      setShowEditDialog(false);
      setCurrentTemplate(null);
      toast({
        title: "Success",
        description: "Template updated successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update template",
        variant: "destructive",
      });
    },
  });

  // Delete template mutation
  const deleteTemplateMutation = useMutation({
    mutationFn: (id: string) => promptTemplateService.deleteTemplate(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['promptTemplates'] });
      toast({
        title: "Success",
        description: "Template deleted successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete template",
        variant: "destructive",
      });
    },
  });

  // Save system prompt mutation (this would be in a separate service in a real app)
  const saveSystemPromptMutation = useMutation({
    mutationFn: (prompt: string) => {
      // This would call an API endpoint in a real app
      return new Promise<void>((resolve) => {
        setTimeout(() => resolve(), 500);
      });
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "System prompt saved successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to save system prompt",
        variant: "destructive",
      });
    },
  });

  const templates = templatesData?.data || [];
  const categories = categoriesData || [];

  // Map categories to format expected by component
  const categoryOptions = [
    { id: "general", name: "General" },
    { id: "products", name: "Products" },
    { id: "support", name: "Support" },
    { id: "sales", name: "Sales" },
    ...categories
      .filter((cat) => !["general", "products", "support", "sales"].includes(cat))
      .map((cat) => ({ id: cat, name: cat.charAt(0).toUpperCase() + cat.slice(1) })),
  ];

  const handleRefresh = () => {
    refetch();
  };

  const handleAddTemplate = () => {
    setNewTemplate({
      name: "",
      description: "",
      template: "",
      category: "general",
      variables: [],
      isActive: true,
    });
    setShowAddDialog(true);
  };

  const handleEditTemplate = (template: PromptTemplate) => {
    setCurrentTemplate(template);
    setShowEditDialog(true);
  };

  const handleDeleteTemplate = (id: string) => {
    deleteTemplateMutation.mutate(id);
  };

  const handleSaveNewTemplate = () => {
    if (newTemplate.name && newTemplate.template) {
      const variableMatches = newTemplate.template.match(/\{([^}]+)\}/g) || [];
      const extractedVariables: PromptVariable[] = variableMatches.map((v) => ({
        name: v.replace(/[{}]/g, ""),
        description: "",
        required: true,
        defaultValue: "",
      }));

      const templateData = {
        name: newTemplate.name,
        description: newTemplate.description || "",
        template: newTemplate.template,
        variables: extractedVariables,
        category: newTemplate.category || "general",
        is_active: true,
        is_default: false,
      };

      createTemplateMutation.mutate(templateData);
    }
  };

  const handleSaveEditedTemplate = () => {
    if (currentTemplate) {
      const templateData = {
        name: currentTemplate.name,
        description: currentTemplate.description,
        template: currentTemplate.template,
        variables: currentTemplate.variables,
        category: currentTemplate.category,
        is_active: currentTemplate.isActive,
        is_default: currentTemplate.isDefault,
      };

      updateTemplateMutation.mutate({
        id: currentTemplate.id,
        data: templateData,
      });
    }
  };

  const handleVariableChange = (value: string) => {
    if (currentTemplate) {
      const variableMatches = value.match(/\{([^}]+)\}/g) || [];
      const extractedVariables: PromptVariable[] = variableMatches.map((v) => ({
        name: v.replace(/[{}]/g, ""),
        description: "",
        required: true,
        defaultValue: "",
      }));
      
      setCurrentTemplate({
        ...currentTemplate,
        template: value,
        variables: extractedVariables,
      });
    }
  };

  const handleSaveSystemPrompt = () => {
    saveSystemPromptMutation.mutate(systemPrompt);
  };

  const filteredTemplates = templates;

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
              {categoryOptions.map((category) => (
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

      {isLoading ? (
        <div className="flex justify-center py-8">
          <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : filteredTemplates.length === 0 ? (
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
                          name: `${template.name} (Copy)`,
                          isDefault: false,
                        };
                        delete clonedTemplate.id;
                        createTemplateMutation.mutate(clonedTemplate);
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
                      {template.template}
                    </pre>
                  </div>
                  <div>
                    <Label>Variables</Label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {template.variables && template.variables.map((variable) => (
                        <Badge key={variable.name} variant="outline">
                          {variable.name}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Tag className="mr-2 h-4 w-4" />
                  {categoryOptions.find((c) => c.id === template.category)?.name ||
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
              value={systemPrompt}
              onChange={(e) => setSystemPrompt(e.target.value)}
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>
                Use variables like {"{company_name}"} or {"{user_name}"}
              </span>
              <span>Characters: {systemPrompt.length}</span>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            className="ml-auto" 
            onClick={handleSaveSystemPrompt}
            disabled={saveSystemPromptMutation.isPending}
          >
            {saveSystemPromptMutation.isPending ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              'Save System Prompt'
            )}
          </Button>
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
                  {categoryOptions.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="template" className="text-right pt-2">
                Content
              </Label>
              <div className="col-span-3 space-y-2">
                <Textarea
                  id="template"
                  rows={6}
                  value={newTemplate.template}
                  onChange={(e) =>
                    setNewTemplate({ ...newTemplate, template: e.target.value })
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
              disabled={!newTemplate.name || !newTemplate.template || createTemplateMutation.isPending}
            >
              {createTemplateMutation.isPending ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Template'
              )}
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
                    {categoryOptions.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-start gap-4">
                <Label htmlFor="edit-template" className="text-right pt-2">
                  Content
                </Label>
                <div className="col-span-3 space-y-2">
                  <Textarea
                    id="edit-template"
                    rows={6}
                    value={currentTemplate.template}
                    onChange={(e) => handleVariableChange(e.target.value)}
                  />
                  <div>
                    <Label>Variables (automatically detected)</Label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {currentTemplate.variables && currentTemplate.variables.map((variable) => (
                        <Badge key={variable.name} variant="outline">
                          {variable.name}
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
                !currentTemplate.template ||
                updateTemplateMutation.isPending
              }
            >
              {updateTemplateMutation.isPending ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PromptTemplateManager;
