
import React from "react";
import { Sparkles } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import {
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { AIModel } from "@/types/ai-configuration";

interface ModelCardHeaderProps {
  model: AIModel;
  isActive: boolean;
  onActiveChange: (checked: boolean) => void;
}

export const ModelCardHeader: React.FC<ModelCardHeaderProps> = ({
  model,
  isActive,
  onActiveChange,
}) => {
  // Determine icon color based on provider
  const getIconColor = () => {
    switch (model.provider.toLowerCase()) {
      case "google":
        return "text-blue-500";
      case "hugging face":
        return "text-yellow-500";
      case "openai":
        return "text-green-500";
      case "anthropic":
        return "text-purple-500";
      default:
        return "text-gray-500";
    }
  };

  return (
    <CardHeader>
      <div className="flex items-center justify-between">
        <CardTitle className="flex items-center">
          <Sparkles className={`mr-2 h-5 w-5 ${getIconColor()}`} />
          {model.name}
        </CardTitle>
        <Switch checked={isActive} onCheckedChange={onActiveChange} />
      </div>
      <CardDescription>{model.description}</CardDescription>
    </CardHeader>
  );
};
