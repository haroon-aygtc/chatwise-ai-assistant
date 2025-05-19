import { CardHeader, CardTitle } from "@/components/ui/card";
import { AIModel } from "@/types/ai-configuration";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";

interface ModelCardHeaderProps {
  model: AIModel;
  isActive: boolean;
  onActiveChange: (value: boolean) => void;
}

export const ModelCardHeader = ({
  model,
  isActive,
  onActiveChange,
}: ModelCardHeaderProps) => {
  // Get provider-specific icon or use default
  const getProviderIcon = () => {
    switch (model.provider) {
      case "OpenAI":
        return (
          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center text-white font-bold">
            AI
          </div>
        );
      case "Google":
        return (
          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-green-400 to-red-500 to-yellow-500 flex items-center justify-center text-white font-bold">
            G
          </div>
        );
      case "Anthropic":
        return (
          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold">
            A
          </div>
        );
      case "HuggingFace":
        return (
          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center text-white font-bold">
            HF
          </div>
        );
      case "Mistral":
        return (
          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold">
            M
          </div>
        );
      case "Groq":
        return (
          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-green-500 to-teal-500 flex items-center justify-center text-white font-bold">
            G
          </div>
        );
      case "TogetherAI":
        return (
          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold">
            T
          </div>
        );
      case "OpenRouter":
        return (
          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center text-white font-bold">
            OR
          </div>
        );
      default:
        return (
          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-gray-500 to-gray-700 flex items-center justify-center text-white font-bold">
            {model.provider.charAt(0)}
          </div>
        );
    }
  };

  return (
    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 gap-4">
      <div className="flex items-center gap-3">
        {getProviderIcon()}
        <div>
          <CardTitle className="text-lg">{model.name}</CardTitle>
          <div className="flex items-center gap-2 mt-1">
            <Badge variant="outline" className="text-xs font-normal">
              {model.provider}
            </Badge>
            <Badge variant="outline" className="text-xs font-normal">
              v{model.version}
            </Badge>
            {model.isDefault && (
              <Badge variant="secondary" className="text-xs font-normal">
                Default
              </Badge>
            )}
          </div>
        </div>
      </div>
      <div className="flex items-center">
        <Switch
          checked={isActive}
          onCheckedChange={onActiveChange}
          aria-label="Toggle active state"
        />
      </div>
    </CardHeader>
  );
};
