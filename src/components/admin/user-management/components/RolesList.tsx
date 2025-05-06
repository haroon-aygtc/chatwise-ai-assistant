import { Role } from '@/types/domain';
  import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import RoleCard from "./RoleCard";
import { CardContent, CardFooter } from "@/components/ui/card";

interface RolesListProps {
  roles: Role[];
  isLoading: boolean;
  error: Error | null;
  onEdit: (role: Role) => void;
  onDelete: (role: Role) => void;
  onRefresh: () => void;
  canEdit: boolean;
  canDelete: boolean;
}

export const RolesList = ({
  roles,
  isLoading,
  error,
  onEdit,
  onDelete,
  onRefresh,
  canEdit,
  canDelete,
}: RolesListProps) => {
  return (
    <>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4 mr-2" />
            <AlertDescription>
              {error.message || "Failed to load roles"}
            </AlertDescription>
          </Alert>
        )}

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
            <p className="text-sm text-muted-foreground">Loading roles...</p>
          </div>
        ) : roles.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {roles.map((role) => (
              <RoleCard
                key={role.id}
                role={role}
                onEdit={onEdit}
                onDelete={onDelete}
                canEdit={canEdit}
                canDelete={canDelete}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground border rounded-md">
            <p>No roles found. Create your first role to get started.</p>
          </div>
        )}
      </CardContent>
      <CardFooter className="border-t pt-4 flex justify-end">
        <Button
          variant="outline"
          size="sm"
          onClick={onRefresh}
          disabled={isLoading}
        >
          <RefreshCw
            className={`mr-2 h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
          />
          Refresh
        </Button>
      </CardFooter>
    </>
  );
};

export default RolesList;
