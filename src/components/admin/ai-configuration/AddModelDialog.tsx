import { useState } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AIModel } from "@/types/ai-configuration";
import { aiModelService } from "@/services/ai-configuration/aiModelService";

interface AddModelDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: (model: AIModel) => void;
}

export const AddModelDialog = ({
  open,
  onOpenChange,
  onSuccess,
}: AddModelDialogProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    provider: "",
    version: "",
    description: "",
    apiKey: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Create model with default configuration
      const modelData: Partial<AIModel> = {
        ...formData,
        isActive: false,
        configuration: {
          temperature: 0.7,
          maxTokens: 1024,
          topP: 0.9,
          frequencyPenalty: 0,
          presencePenalty: 0,
        },
      };

      const response = await aiModelService.createModel(modelData);

      if (onSuccess) {
        onSuccess(response.data);
      }

      onOpenChange(false);
      // Reset form
      setFormData({
        name: "",
        provider: "",
        version: "",
        description: "",
        apiKey: "",
      });
    } catch (error) {
      console.error("Error creating model:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add New AI Model</DialogTitle>
            <DialogDescription>
              Configure a new AI model for your chat system.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="provider" className="text-right">
                Provider
              </Label>
              <div className="col-span-3">
                <Select
                  value={formData.provider}
                  onValueChange={(value) =>
                    handleSelectChange("provider", value)
                  }
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select provider" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Google">Google</SelectItem>
                    <SelectItem value="OpenAI">OpenAI</SelectItem>
                    <SelectItem value="Anthropic">Anthropic</SelectItem>
                    <SelectItem value="Hugging Face">Hugging Face</SelectItem>
                    <SelectItem value="Custom">Custom</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="version" className="text-right">
                Version
              </Label>
              <Input
                id="version"
                name="version"
                value={formData.version}
                onChange={handleChange}
                className="col-span-3"
                placeholder="e.g., Pro, GPT-4, Claude 2"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="apiKey" className="text-right">
                API Key
              </Label>
              <Input
                id="apiKey"
                name="apiKey"
                type="password"
                value={formData.apiKey}
                onChange={handleChange}
                className="col-span-3"
                placeholder="Enter API key"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="col-span-3"
                placeholder="Brief description of this model"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                  Adding...
                </>
              ) : (
                "Add Model"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
