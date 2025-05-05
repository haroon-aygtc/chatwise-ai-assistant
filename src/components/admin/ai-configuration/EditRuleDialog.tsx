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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Trash2 } from "lucide-react";
import { AIModel, RoutingRule, RuleCondition } from "@/types/ai-configuration";

interface EditRuleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  rule: RoutingRule;
  models: AIModel[];
  onSave: (rule: RoutingRule) => void;
}

export const EditRuleDialog = ({
  open,
  onOpenChange,
  rule,
  models,
  onSave,
}: EditRuleDialogProps) => {
  const [formData, setFormData] = useState<RoutingRule>({ ...rule });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleModelChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      modelId: value,
      description: `Route to ${models.find((m) => m.id === value)?.name || value}`,
    }));
  };

  const handleConditionChange = (
    index: number,
    field: keyof RuleCondition,
    value: string,
  ) => {
    const updatedConditions = [...formData.conditions];
    updatedConditions[index] = {
      ...updatedConditions[index],
      [field]: value,
    };
    setFormData((prev) => ({ ...prev, conditions: updatedConditions }));
  };

  const addCondition = () => {
    setFormData((prev) => ({
      ...prev,
      conditions: [
        ...prev.conditions,
        { field: "message", operator: "contains", value: "" },
      ],
    }));
  };

  const removeCondition = (index: number) => {
    const updatedConditions = [...formData.conditions];
    updatedConditions.splice(index, 1);
    setFormData((prev) => ({ ...prev, conditions: updatedConditions }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Edit Routing Rule</DialogTitle>
            <DialogDescription>
              Configure when to route messages to specific AI models.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Rule Name
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
              <Label htmlFor="model" className="text-right">
                Route To
              </Label>
              <div className="col-span-3">
                <Select
                  value={formData.modelId}
                  onValueChange={handleModelChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select model" />
                  </SelectTrigger>
                  <SelectContent>
                    {models.map((model) => (
                      <SelectItem key={model.id} value={model.id}>
                        {model.name} {model.version ? `(${model.version})` : ""}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Priority</Label>
              <Input
                type="number"
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className="col-span-3"
                min="1"
              />
            </div>

            <div className="grid grid-cols-4 gap-4">
              <Label className="text-right pt-2">Conditions</Label>
              <div className="col-span-3 space-y-3">
                {formData.conditions.map((condition, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Select
                      value={condition.field}
                      onValueChange={(value) =>
                        handleConditionChange(index, "field", value)
                      }
                    >
                      <SelectTrigger className="w-[120px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="message">Message</SelectItem>
                        <SelectItem value="user">User</SelectItem>
                        <SelectItem value="context">Context</SelectItem>
                      </SelectContent>
                    </Select>

                    <Select
                      value={condition.operator}
                      onValueChange={(value) =>
                        handleConditionChange(index, "operator", value)
                      }
                    >
                      <SelectTrigger className="w-[120px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="contains">Contains</SelectItem>
                        <SelectItem value="equals">Equals</SelectItem>
                        <SelectItem value="startsWith">Starts with</SelectItem>
                        <SelectItem value="endsWith">Ends with</SelectItem>
                        <SelectItem value="regex">Regex</SelectItem>
                      </SelectContent>
                    </Select>

                    <Input
                      value={condition.value}
                      onChange={(e) =>
                        handleConditionChange(index, "value", e.target.value)
                      }
                      placeholder="Value"
                      className="flex-1"
                    />

                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeCondition(index)}
                      disabled={formData.conditions.length <= 1}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="mt-2"
                  onClick={addCondition}
                >
                  <Plus className="h-4 w-4 mr-2" /> Add Condition
                </Button>
              </div>
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
            <Button type="submit">Save Changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
