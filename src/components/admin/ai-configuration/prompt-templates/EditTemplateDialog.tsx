import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { PromptTemplate } from "@/types/ai-configuration";
import { TemplateEditor } from "./components/TemplateEditor";
import { usePromptTemplates } from "@/hooks/ai-configuration/usePromptTemplates";

interface EditTemplateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  template: PromptTemplate;
  onSubmit: (template: Partial<PromptTemplate>) => Promise<void>;
}

/**
 * EditTemplateDialog - A dialog for editing existing templates
 * 
 * Features:
 * - Form pre-filled with template details
 * - Template editor with variable management
 * - Category selection (existing or new)
 * - Toggle for active/inactive status
 * - Form validation
 */
export function EditTemplateDialog({
  open,
  onOpenChange,
  template,
  onSubmit,
}: EditTemplateDialogProps) {
  const { categories } = usePromptTemplates();

  // Initialize form state from template
  const [formData, setFormData] = useState<Partial<PromptTemplate>>({
    name: "",
    description: "",
    template: "",
    category: "",
    variables: [],
    isActive: true,
  });

  // Update form data when template changes
  useEffect(() => {
    if (template) {
      setFormData({
        name: template.name || "",
        description: template.description || "",
        template: template.template || "",
        category: template.category || "",
        variables: template.variables || [],
        isActive: template.isActive !== false, // Default to true if undefined
        isDefault: template.isDefault,
      });
    }
  }, [template]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const [showNewCategoryInput, setShowNewCategoryInput] = useState(false);

  // Get unique category names for the dropdown
  const categoryOptions =
    categories?.map(cat => cat.name || "") ||
    [...new Set(formData.category ? [formData.category] : [])];

  // Reset form when dialog closes
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setShowNewCategoryInput(false);
      setNewCategory("");
    }
    onOpenChange(open);
  };

  // Update form field value
  const handleChange = (
    field: keyof PromptTemplate,
    value: string | boolean | any[]
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields
    if (!formData.name || !formData.template) {
      alert("Name and template content are required");
      return;
    }

    setIsSubmitting(true);

    try {
      // If using a new category, use that value
      const finalFormData = {
        ...formData,
        category: showNewCategoryInput && newCategory ? newCategory : formData.category,
      };

      await onSubmit(finalFormData);
    } catch (error) {
      console.error("Error updating template:", error);
      // Error handling is done in the parent component
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle category selection
  const handleCategoryChange = (value: string) => {
    if (value === "new") {
      setShowNewCategoryInput(true);
    } else {
      setShowNewCategoryInput(false);
      handleChange("category", value);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Edit Template</DialogTitle>
            <DialogDescription>
              Modify this prompt template details and content.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-6 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name" className="mb-2 block">
                  Template Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="name"
                  value={formData.name || ""}
                  onChange={(e) => handleChange("name", e.target.value)}
                  placeholder="E.g., Customer Support Response"
                  required
                />
              </div>

              <div>
                <Label htmlFor="category" className="mb-2 block">
                  Category
                </Label>
                {showNewCategoryInput ? (
                  <div className="flex gap-2">
                    <Input
                      id="newCategory"
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                      placeholder="New category name"
                      className="flex-grow"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setShowNewCategoryInput(false);
                        handleChange("category", categoryOptions[0] || "");
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                ) : (
                  <Select
                    value={formData.category || ""}
                    onValueChange={handleCategoryChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categoryOptions.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                      <SelectItem value="new">+ Add New Category</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="description" className="mb-2 block">
                Description
              </Label>
              <Input
                id="description"
                value={formData.description || ""}
                onChange={(e) => handleChange("description", e.target.value)}
                placeholder="Brief description of what this template does"
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Switch
                  id="isActive"
                  checked={formData.isActive}
                  onCheckedChange={(checked) =>
                    handleChange("isActive", checked)
                  }
                />
                <Label htmlFor="isActive">Active</Label>
              </div>

              {formData.isDefault && (
                <div className="text-sm text-muted-foreground">
                  This is the default template
                </div>
              )}
            </div>

            <div>
              <Label htmlFor="template" className="mb-2 block">
                Template Content <span className="text-destructive">*</span>
              </Label>
              <div className="border rounded-md">
                <TemplateEditor
                  value={formData.template || ""}
                  onChange={(value) => handleChange("template", value)}
                  variables={formData.variables || []}
                  onVariablesChange={(variables) => handleChange("variables", variables)}
                  height="400px"
                />
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Use {{ variable_name }} syntax to define variables in your template.
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
