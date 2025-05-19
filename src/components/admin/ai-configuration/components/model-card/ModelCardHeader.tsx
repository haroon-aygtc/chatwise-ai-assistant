import { CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { AIModel } from "@/types/ai-configuration";
  import { getProviderColor } from "@/utils/helpers";

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
  const providerColor = getProviderColor(model.provider);

  return (
    <CardHeader className="pb-2">
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold">{model.name}</h3>
            {model.isDefault && (
              <Badge variant="outline" className="text-xs bg-primary/10">
                Default
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2 mt-1">
            <Badge
              variant="outline"
              className={`text-xs ${providerColor}`}
            >
              {model.provider}
            </Badge>
            <span className="text-xs text-muted-foreground">
              v{model.version}
            </span>
          </div>
          {model.description && (
            <p className="text-sm text-muted-foreground mt-2">
              {model.description}
            </p>
          )}
        </div>
        <Switch
          checked={isActive}
          onCheckedChange={onActiveChange}
          aria-label="Toggle model active state"
        />
      </div>
    </CardHeader>
  );
};

