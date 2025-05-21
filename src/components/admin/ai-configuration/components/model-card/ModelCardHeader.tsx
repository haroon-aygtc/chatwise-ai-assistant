import { CardHeader, CardTitle } from "@/components/ui/card";
import { AIModel } from "@/types/ai-configuration";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@/components/ui/tooltip";
import {
  Brain,
  MessageSquare,
  Zap,
  Camera,
  Crown,
  InfoIcon,
  CheckCircle2,
  XCircle,
  Clock
} from "lucide-react";

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
          <div className="h-11 w-11 rounded-full bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center text-white font-bold shadow-lg hover:shadow-xl transition-all">
            AI
          </div>
        );
      case "Google":
        return (
          <div className="h-11 w-11 rounded-full bg-gradient-to-br from-blue-500 to-green-400 to-red-500 to-yellow-500 flex items-center justify-center text-white font-bold shadow-lg hover:shadow-xl transition-all">
            G
          </div>
        );
      case "Anthropic":
        return (
          <div className="h-11 w-11 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold shadow-lg hover:shadow-xl transition-all">
            A
          </div>
        );
      case "HuggingFace":
        return (
          <div className="h-11 w-11 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center text-white font-bold shadow-lg hover:shadow-xl transition-all">
            HF
          </div>
        );
      case "Mistral":
        return (
          <div className="h-11 w-11 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold shadow-lg hover:shadow-xl transition-all">
            M
          </div>
        );
      case "Groq":
        return (
          <div className="h-11 w-11 rounded-full bg-gradient-to-br from-green-500 to-teal-500 flex items-center justify-center text-white font-bold shadow-lg hover:shadow-xl transition-all">
            G
          </div>
        );
      case "TogetherAI":
        return (
          <div className="h-11 w-11 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold shadow-lg hover:shadow-xl transition-all">
            T
          </div>
        );
      case "OpenRouter":
        return (
          <div className="h-11 w-11 rounded-full bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center text-white font-bold shadow-lg hover:shadow-xl transition-all">
            OR
          </div>
        );
      case "Gemini":
        return (
          <div className="h-11 w-11 rounded-full bg-gradient-to-br from-blue-400 to-teal-500 flex items-center justify-center text-white font-bold shadow-lg hover:shadow-xl transition-all">
            GM
          </div>
        );
      default:
        return (
          <div className="h-11 w-11 rounded-full bg-gradient-to-br from-gray-500 to-gray-700 flex items-center justify-center text-white font-bold shadow-lg hover:shadow-xl transition-all">
            {model.provider.charAt(0)}
          </div>
        );
    }
  };

  // Generate capability badges with tooltips
  const renderCapabilityBadges = () => {
    const capabilities = model.capabilities || {
      chat: false,
      completion: false,
      embeddings: false,
      vision: false
    };

    return (
      <div className="flex flex-wrap gap-1.5 mt-2">
        {capabilities.chat && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Badge variant="outline" className="bg-blue-50 border-blue-200 text-blue-600 hover:bg-blue-100 transition-colors">
                  <MessageSquare className="h-3 w-3 mr-1" />
                  <span className="text-xs">Chat</span>
                </Badge>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="max-w-xs">
                <p>Supports chat completions for conversational AI</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}

        {capabilities.completion && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Badge variant="outline" className="bg-green-50 border-green-200 text-green-600 hover:bg-green-100 transition-colors">
                  <Brain className="h-3 w-3 mr-1" />
                  <span className="text-xs">Completions</span>
                </Badge>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="max-w-xs">
                <p>Supports text completions for content generation</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}

        {capabilities.embeddings && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Badge variant="outline" className="bg-purple-50 border-purple-200 text-purple-600 hover:bg-purple-100 transition-colors">
                  <Zap className="h-3 w-3 mr-1" />
                  <span className="text-xs">Embeddings</span>
                </Badge>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="max-w-xs">
                <p>Supports vector embeddings for semantic search and RAG applications</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}

        {capabilities.vision && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Badge variant="outline" className="bg-amber-50 border-amber-200 text-amber-600 hover:bg-amber-100 transition-colors">
                  <Camera className="h-3 w-3 mr-1" />
                  <span className="text-xs">Vision</span>
                </Badge>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="max-w-xs">
                <p>Supports multimodal image understanding and analysis</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
    );
  };

  return (
    <CardHeader className="flex flex-row items-start justify-between pb-2 space-y-0 gap-4 border-b border-muted/30">
      <div className="flex items-start gap-3">
        <div className="relative group">
          {getProviderIcon()}
          {model.isDefault && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="absolute -top-1.5 -right-1.5 bg-primary text-primary-foreground rounded-full p-1 shadow-md animate-pulse">
                    <Crown className="h-4 w-4" />
                  </div>
                </TooltipTrigger>
                <TooltipContent side="top">
                  <p>Default model - Used when no specific model is selected</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>

        <div>
          <div className="flex items-center gap-2">
            <CardTitle className="text-lg">{model.name}</CardTitle>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="cursor-help hover:opacity-80 transition-opacity">
                    <InfoIcon className="h-4 w-4 text-muted-foreground" />
                  </div>
                </TooltipTrigger>
                <TooltipContent side="top" className="space-y-1 max-w-xs">
                  <p className="font-medium">{model.modelId || model.name}</p>
                  <div className="text-xs text-muted-foreground mt-1 space-y-1">
                    {model.contextSize && (
                      <div className="flex items-center">
                        <span className="font-medium w-24">Context:</span>
                        <span>{model.contextSize?.toLocaleString()} tokens</span>
                      </div>
                    )}
                    {model.pricePerToken && (
                      <div className="flex items-center">
                        <span className="font-medium w-24">Cost:</span>
                        <span>${model.pricePerToken?.toFixed(8)}/token</span>
                      </div>
                    )}
                    {model.createdAt && (
                      <div className="flex items-center">
                        <span className="font-medium w-24">Added:</span>
                        <span>{new Date(model.createdAt).toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          <div className="flex items-center gap-2 mt-1.5">
            <Badge variant="outline" className="text-xs font-normal">
              {model.provider}
            </Badge>
            {model.version && (
              <Badge variant="outline" className="text-xs font-normal bg-slate-50">
                v{model.version}
              </Badge>
            )}
          </div>

          {renderCapabilityBadges()}
        </div>
      </div>

      <div className="flex flex-col items-end gap-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center gap-2">
                {isActive ? (
                  <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200 px-2 py-0">
                    <CheckCircle2 className="h-3 w-3 mr-1" />
                    <span className="text-xs font-medium">Active</span>
                  </Badge>
                ) : (
                  <Badge variant="outline" className="bg-red-50 text-red-600 border-red-200 px-2 py-0">
                    <XCircle className="h-3 w-3 mr-1" />
                    <span className="text-xs font-medium">Inactive</span>
                  </Badge>
                )}
                <Switch
                  checked={isActive}
                  onCheckedChange={onActiveChange}
                  aria-label="Toggle active state"
                  className={`${isActive ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600'} transition-colors`}
                />
              </div>
            </TooltipTrigger>
            <TooltipContent side="left">
              <p>{isActive
                ? "Deactivate model - It won't be available for use"
                : "Activate model - Make it available for use"}
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        {model.updatedAt && (
          <div className="flex items-center text-xs text-muted-foreground">
            <Clock className="h-3 w-3 mr-1" />
            <span>Updated: {new Date(model.updatedAt).toLocaleDateString()}</span>
          </div>
        )}
      </div>
    </CardHeader>
  );
};
