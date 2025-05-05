
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { DocumentCategory } from "@/types/knowledge-base";
import { Upload, File, X } from "lucide-react";

interface UploadDocumentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpload: (data: any) => void;
  categories: DocumentCategory[];
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
  const [content, setContent] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadType, setUploadType] = useState<'file' | 'text'>('file');

  // Reset form
  const resetForm = () => {
    setTitle("");
    setDescription("");
    setCategoryId("");
    setTags("");
    setFile(null);
    setContent("");
    setUploadProgress(0);
  };

  // Handle file change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      alert("Title is required");
      return;
    }
    
    if (uploadType === 'file' && !file) {
      alert("Please select a file to upload");
      return;
    }
    
    if (uploadType === 'text' && !content.trim()) {
      alert("Content is required for text upload");
      return;
    }
    
    if (!categoryId) {
      alert("Please select a category");
      return;
    }
    
    // Parse tags from comma-separated string
    const parsedTags = tags
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag);
    
    // Prepare upload data
    const uploadData = {
      title,
      description,
      categoryId,
      tags: parsedTags,
      content: uploadType === 'text' ? content : '',
      file: uploadType === 'file' ? file : undefined
    };
    
    // Simulate upload progress
    if (uploadType === 'file' && file) {
      const interval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + 10;
        });
      }, 300);
    }
    
    onUpload(uploadData);
  };

  // Clear selected file
  const clearFile = () => {
    setFile(null);
  };

  return (
    <Dialog open={open} onOpenChange={(newOpen) => {
      if (!newOpen) resetForm();
      onOpenChange(newOpen);
    }}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Upload Document</DialogTitle>
          <DialogDescription>
            Add a new document to your knowledge base
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="title">Document Title *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter document title"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter document description"
              rows={2}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="category">Category *</Label>
            <Select value={categoryId} onValueChange={setCategoryId} required>
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
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
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="Enter tags separated by commas"
            />
            <p className="text-xs text-muted-foreground">
              Separate tags with commas (e.g., product, feature, guide)
            </p>
          </div>
          
          <div className="space-y-2">
            <Label>Upload Type</Label>
            <div className="flex space-x-4">
              <Button
                type="button"
                variant={uploadType === 'file' ? 'default' : 'outline'}
                onClick={() => setUploadType('file')}
                className="flex-1"
              >
                <Upload className="mr-2 h-4 w-4" /> File Upload
              </Button>
              <Button
                type="button"
                variant={uploadType === 'text' ? 'default' : 'outline'}
                onClick={() => setUploadType('text')}
                className="flex-1"
              >
                <File className="mr-2 h-4 w-4" /> Text Entry
              </Button>
            </div>
          </div>
          
          {uploadType === 'file' ? (
            <div className="space-y-2">
              <Label htmlFor="file">Document File *</Label>
              {file ? (
                <div className="flex items-center justify-between border rounded-md p-2">
                  <div className="flex items-center">
                    <File className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="text-sm truncate max-w-[250px]">
                      {file.name}
                    </span>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={clearFile}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="flex items-center justify-center border border-dashed rounded-md p-6">
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <div className="flex flex-col items-center">
                      <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                      <span className="text-sm font-medium">
                        Click to upload or drag and drop
                      </span>
                      <span className="text-xs text-muted-foreground mt-1">
                        PDF, DOCX, TXT, MD (max 10MB)
                      </span>
                    </div>
                    <Input
                      id="file-upload"
                      type="file"
                      className="hidden"
                      onChange={handleFileChange}
                      accept=".pdf,.docx,.txt,.md"
                    />
                  </label>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-2">
              <Label htmlFor="content">Document Content *</Label>
              <Textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Enter document content"
                rows={6}
                required
              />
            </div>
          )}
          
          {isUploading && (
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
          )}
          
          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              disabled={isUploading}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isUploading || 
                !title.trim() || 
                !categoryId || 
                (uploadType === 'file' && !file) || 
                (uploadType === 'text' && !content.trim())}
            >
              {isUploading ? "Uploading..." : "Upload Document"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
