
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Edit, Trash2, Database, Check, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { DocumentCategory } from "@/types/knowledge-base";

interface CategoryListProps {
  categories: DocumentCategory[];
  isLoading: boolean;
}

export const CategoryList: React.FC<CategoryListProps> = ({ categories, isLoading }) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const handleEditStart = (category: DocumentCategory) => {
    setEditingId(category.id);
    setName(category.name);
    setDescription(category.description || "");
  };

  const handleEditCancel = () => {
    setEditingId(null);
    setName("");
    setDescription("");
  };

  const handleAddNew = () => {
    setIsAddingNew(true);
    setName("");
    setDescription("");
  };

  const handleAddCancel = () => {
    setIsAddingNew(false);
    setName("");
    setDescription("");
  };

  if (isLoading) {
    return (
      <div className="space-y-2">
        <Skeleton className="h-12 w-full mb-4" />
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-20 w-full" />
      </div>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Categories</CardTitle>
        <Button onClick={handleAddNew} disabled={isAddingNew}>
          <Plus className="h-4 w-4 mr-2" /> Add Category
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {isAddingNew && (
          <Card className="border-2 border-primary mb-4">
            <CardContent className="pt-4">
              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className="text-sm font-medium mb-1 block">Name</label>
                  <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Category name" />
                </div>
                <div>
                  <label htmlFor="description" className="text-sm font-medium mb-1 block">Description</label>
                  <Textarea 
                    id="description" 
                    value={description} 
                    onChange={(e) => setDescription(e.target.value)} 
                    placeholder="Category description (optional)"
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" size="sm" onClick={handleAddCancel}>
                    <X className="h-4 w-4 mr-1" /> Cancel
                  </Button>
                  <Button size="sm">
                    <Check className="h-4 w-4 mr-1" /> Save
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {categories.length === 0 ? (
          <div className="text-center py-8">
            <Database className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No categories found</p>
            {!isAddingNew && (
              <Button variant="outline" className="mt-4" onClick={handleAddNew}>
                <Plus className="h-4 w-4 mr-2" /> Add Your First Category
              </Button>
            )}
          </div>
        ) : (
          <div className="divide-y">
            {categories.map((category) => (
              <div key={category.id} className="py-4 first:pt-0 last:pb-0">
                {editingId === category.id ? (
                  <div className="space-y-4">
                    <div>
                      <Input value={name} onChange={(e) => setName(e.target.value)} />
                    </div>
                    <div>
                      <Textarea 
                        value={description} 
                        onChange={(e) => setDescription(e.target.value)} 
                        rows={2}
                      />
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="sm" onClick={handleEditCancel}>
                        <X className="h-4 w-4 mr-1" /> Cancel
                      </Button>
                      <Button size="sm">
                        <Check className="h-4 w-4 mr-1" /> Save
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium flex items-center">
                        <Database className="h-4 w-4 mr-2 text-muted-foreground" /> 
                        {category.name}
                        <Badge className="ml-2">{category.documentCount}</Badge>
                      </h3>
                      {category.description && (
                        <p className="text-sm text-muted-foreground mt-1">{category.description}</p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="icon" onClick={() => handleEditStart(category)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
