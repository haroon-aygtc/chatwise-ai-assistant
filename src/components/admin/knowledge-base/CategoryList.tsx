
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { FolderIcon, Plus, Tag, Trash2 } from "lucide-react";
import KnowledgeBaseService from "@/services/knowledge-base/knowledgeBaseService";
import { DocumentCategory } from "@/types/knowledge-base";

interface CategoryListProps {
  categories: DocumentCategory[];
  isLoading: boolean;
}

export const CategoryList = ({ categories, isLoading }: CategoryListProps) => {
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryDescription, setNewCategoryDescription] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<DocumentCategory | null>(null);
  const queryClient = useQueryClient();

  // Add category mutation
  const addCategoryMutation = useMutation({
    mutationFn: (data: { name: string; description: string }) => 
      KnowledgeBaseService.createCategory(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['knowledgeBase', 'categories'] });
      resetForm();
      toast.success("Category added successfully");
    },
    onError: (error: any) => {
      toast.error(`Failed to add category: ${error.message || "Unknown error"}`);
    }
  });

  // Update category mutation
  const updateCategoryMutation = useMutation({
    mutationFn: (data: { id: string; name: string; description: string }) => 
      KnowledgeBaseService.updateCategory(data.id, { name: data.name, description: data.description }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['knowledgeBase', 'categories'] });
      resetForm();
      toast.success("Category updated successfully");
    },
    onError: (error: any) => {
      toast.error(`Failed to update category: ${error.message || "Unknown error"}`);
    }
  });

  // Delete category mutation
  const deleteCategoryMutation = useMutation({
    mutationFn: (id: string) => KnowledgeBaseService.deleteCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['knowledgeBase', 'categories'] });
      toast.success("Category deleted successfully");
    },
    onError: (error: any) => {
      toast.error(`Failed to delete category: ${error.message || "Unknown error"}`);
    }
  });

  // Reset form
  const resetForm = () => {
    setNewCategoryName("");
    setNewCategoryDescription("");
    setEditingCategory(null);
    setIsDialogOpen(false);
  };

  // Handle category submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newCategoryName.trim()) {
      toast.error("Category name is required");
      return;
    }
    
    if (editingCategory) {
      updateCategoryMutation.mutate({
        id: editingCategory.id,
        name: newCategoryName,
        description: newCategoryDescription
      });
    } else {
      addCategoryMutation.mutate({
        name: newCategoryName,
        description: newCategoryDescription
      });
    }
  };

  // Handle edit category
  const handleEditCategory = (category: DocumentCategory) => {
    setEditingCategory(category);
    setNewCategoryName(category.name);
    setNewCategoryDescription(category.description || "");
    setIsDialogOpen(true);
  };

  // Handle delete category
  const handleDeleteCategory = (id: string) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      deleteCategoryMutation.mutate(id);
    }
  };

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }

  return (
    <>
      <div className="flex justify-end mb-4">
        <Button onClick={() => setIsDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Add Category
        </Button>
      </div>

      {categories.length === 0 ? (
        <Card className="py-8">
          <CardContent className="flex flex-col items-center justify-center text-center">
            <FolderIcon className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No Categories Found</h3>
            <p className="text-muted-foreground mb-6">
              Create your first category to organize your knowledge base documents
            </p>
            <Button onClick={() => setIsDialogOpen(true)}>
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
                  <FolderIcon className="mr-2 h-5 w-5" />
                  {category.name}
                </CardTitle>
                <CardDescription>
                  {category.documentCount} document{category.documentCount !== 1 ? "s" : ""}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {category.description || "No description provided"}
                </p>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleEditCategory(category)}
                >
                  <Tag className="mr-2 h-4 w-4" /> Rename
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-destructive"
                  onClick={() => handleDeleteCategory(category.id)}
                  disabled={category.documentCount > 0}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingCategory ? "Edit Category" : "Add New Category"}</DialogTitle>
            <DialogDescription>
              {editingCategory 
                ? "Update the category details below"
                : "Create a new category to organize your knowledge base documents"}
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSubmit}>
            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <Label htmlFor="name">Category Name</Label>
                <Input
                  id="name"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  placeholder="Enter category name"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description (Optional)</Label>
                <Textarea
                  id="description"
                  value={newCategoryDescription}
                  onChange={(e) => setNewCategoryDescription(e.target.value)}
                  placeholder="Enter category description"
                  rows={3}
                />
              </div>
            </div>
            
            <DialogFooter className="mt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={resetForm}
              >
                Cancel
              </Button>
              <Button 
                type="submit"
                disabled={!newCategoryName.trim() || 
                  addCategoryMutation.isPending || 
                  updateCategoryMutation.isPending}
              >
                {editingCategory ? "Update Category" : "Add Category"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};
