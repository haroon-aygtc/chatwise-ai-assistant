
import { useState, ChangeEvent } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { FileUp, X } from "lucide-react";
import { DocumentCategory as KnowledgeBaseDocumentCategory, CreateDocumentRequest } from "@/types/knowledge-base";

interface UploadDocumentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpload: (data: CreateDocumentRequest) => void;
  categories: KnowledgeBaseDocumentCategory[];
  isUploading: boolean;
}

export const UploadDocumentDialog = ({
  open,
  onOpenChange,
  onUpload,
  categories,
  isUploading
}: UploadDocumentDialogProps) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [tags, setTags] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [fileContent, setFileContent] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);

  // Reset form when dialog opens/closes
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      // Reset form if closing
      resetForm();
    }
    onOpenChange(open);
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setCategoryId("");
    setTags("");
    setFile(null);
    setFileContent("");
    setUploadProgress(0);
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;
    
    setFile(selectedFile);
    
    // If it's a text file, try to read its contents
    if (selectedFile.type === 'text/plain' || selectedFile.name.endsWith('.txt')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setFileContent(event.target.result as string);
        }
      };
      reader.readAsText(selectedFile);
    } else {
      setFileContent("");
    }
  };

  const handleUpload = () => {
    // Split comma-separated tags into an array
    const tagsArray = tags
      ? tags.split(',').map((tag) => tag.trim()).filter(Boolean)
      : [];

    const documentData: CreateDocumentRequest = {
      title,
      description,
      content: fileContent,
      categoryId: categoryId || undefined,
      tags: tagsArray,
      file
    };

    // Simulate upload progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setUploadProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
        // Call the actual upload function
        onUpload(documentData);
      }
    }, 100);
  };

  const isFormValid = title.trim() !== "" && (file !== null || fileContent.trim() !== "");

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Upload Document</DialogTitle>
          <DialogDescription>
            Add a new document to your knowledge base
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              placeholder="Document title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Brief description of the document"
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="category">Category</Label>
            <Select value={categoryId} onValueChange={setCategoryId}>
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">None</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="tags">Tags</Label>
            <Input
              id="tags"
              placeholder="Enter tags separated by commas"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Example: product, documentation, guide
            </p>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="file">Upload File</Label>
            <div className="flex items-center gap-2">
              <Input
                id="file"
                type="file"
                onChange={handleFileChange}
                className="flex-1"
                accept=".txt,.md,.pdf,.docx,.doc"
              />
              {file && (
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setFile(null)}
                  type="button"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
            {file && (
              <p className="text-xs text-muted-foreground">
                {file.name} ({Math.round(file.size / 1024)} KB)
              </p>
            )}
          </div>

          {fileContent && (
            <div className="grid gap-2">
              <Label htmlFor="content">Content Preview</Label>
              <Textarea
                id="content"
                value={fileContent}
                onChange={(e) => setFileContent(e.target.value)}
                rows={5}
                className="font-mono text-xs"
              />
            </div>
          )}

          {isUploading && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">Uploading...</span>
                <span className="text-sm text-muted-foreground">
                  {uploadProgress}%
                </span>
              </div>
              <Progress value={uploadProgress} className="h-2" />
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => handleOpenChange(false)}
            disabled={isUploading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleUpload}
            disabled={!isFormValid || isUploading}
          >
            <FileUp className="h-4 w-4 mr-2" />
            Upload
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
