import { useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Permission } from "@/types";
import { title } from "process";

export interface PermissionGroupProps {
  categoryId: string;
  categoryName: string;
  permissions: Permission[];
  selectedPermissions: string[];
  onChange: (selectedPermissions: string[]) => void;
  searchQuery?: string;
}

export function PermissionGroup({
  categoryName,
  permissions,
  searchQuery = "",
  selectedPermissions,
  onChange,
  categoryId,
}: PermissionGroupProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [localSearchQuery, setLocalSearchQuery] = useState("");

  // Use the combined search terms
  const effectiveSearchQuery = (searchQuery || localSearchQuery).toLowerCase();

  // Filter permissions based on search query
  const filteredPermissions = effectiveSearchQuery
    ? permissions.filter(
        (permission) =>
          permission.name.toLowerCase().includes(effectiveSearchQuery) ||
          permission.displayName.toLowerCase().includes(effectiveSearchQuery) ||
          (permission.description &&
            permission.description.toLowerCase().includes(effectiveSearchQuery))
      )
    : permissions;

  // Get count of filtered permissions
  const filteredCount = filteredPermissions.length;
  const totalCount = permissions.length;

  // Format title for display
  const formatTitle = (name: string) => {
    return name.charAt(0).toUpperCase() + name.slice(1).replace(/-/g, " ");
  };

  return (
    <Card className="overflow-hidden">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-2">
            <h3 className="text-lg font-semibold">{formatTitle(categoryName)}</h3>
            <Badge variant="outline">
              {effectiveSearchQuery ? `${filteredCount}/${totalCount}` : totalCount}
            </Badge>
          </div>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm">
              <ChevronsUpDown className="h-4 w-4" />
              <span className="sr-only">Toggle</span>
            </Button>
          </CollapsibleTrigger>
        </div>
        
        <CollapsibleContent>
          <Separator />
          {!searchQuery && (
            <div className="p-4 pb-2">
              <Input
                placeholder="Search permissions in this group..."
                value={localSearchQuery}
                onChange={(e) => setLocalSearchQuery(e.target.value)}
              />
            </div>
          )}
          
          <div className="p-4 space-y-4">
            {filteredPermissions.length > 0 ? (
              filteredPermissions.map((permission) => (
                <div key={permission.id} className="space-y-1">
                  <TooltipProvider delayDuration={300}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="flex justify-between items-center">
                          <h4 className="font-medium">
                            {permission.displayName || permission.name}
                          </h4>
                          <Badge variant="secondary">{permission.name}</Badge>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent side="bottom" align="start" className="max-w-md">
                        <p>{permission.description || "No description available"}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              ))
            ) : (
              <div className="text-center py-4 text-muted-foreground">
                No permissions match your search
              </div>
            )}
          </div>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}
