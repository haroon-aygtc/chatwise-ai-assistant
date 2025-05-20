import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, Search, Plus, PenLine, Trash2, Settings, AlertCircle } from "lucide-react";
import { ContextScope } from "@/types/knowledge-base";
import { format } from "date-fns";
import { useKnowledgeBase } from "@/hooks/knowledge-base/useKnowledgeBase";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { ContextScopeDialog } from "./dialogs/ContextScopeDialog";

interface ContextScopesSectionProps {
    contextScopes: ContextScope[];
    isLoading: boolean;
}

export function ContextScopesSection({
    contextScopes,
    isLoading,
}: ContextScopesSectionProps) {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedScopeId, setSelectedScopeId] = useState<string | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    const {
        handleAddContextScope,
        handleUpdateContextScope,
        handleDeleteContextScope
    } = useKnowledgeBase();

    // Filter context scopes based on search query
    const filteredScopes = searchQuery
        ? contextScopes.filter((scope) =>
            scope.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            scope.description.toLowerCase().includes(searchQuery.toLowerCase())
        )
        : contextScopes;

    const selectedScope = contextScopes.find(
        (scope) => scope.id === selectedScopeId
    );

    const handleOpenDialogForEdit = () => {
        setIsEditing(true);
        setIsDialogOpen(true);
    };

    const handleOpenDialogForAdd = () => {
        setIsEditing(false);
        setSelectedScopeId(null);
        setIsDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setIsDialogOpen(false);
        setIsEditing(false);
    };

    const handleDelete = (id: string) => {
        if (confirm("Are you sure you want to delete this context scope?")) {
            handleDeleteContextScope(id);
            if (selectedScopeId === id) {
                setSelectedScopeId(null);
            }
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-40">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <span className="ml-2 text-muted-foreground font-medium">Loading context scopes...</span>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <div className="flex-1 max-w-md">
                    <div className="relative">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            type="search"
                            placeholder="Search context scopes..."
                            className="pl-8"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>
                <Button onClick={handleOpenDialogForAdd}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Context Scope
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1">
                    <ScrollArea className="h-[calc(100vh-250px)]">
                        {filteredScopes.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-40 text-center">
                                <p className="text-muted-foreground">No context scopes found</p>
                                <p className="text-sm text-muted-foreground">
                                    Create your first context scope to apply conditional knowledge access
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                {filteredScopes.map((scope) => (
                                    <Card
                                        key={scope.id}
                                        className={`cursor-pointer hover:border-primary/50 transition-colors ${selectedScopeId === scope.id ? "border-primary" : ""
                                            }`}
                                        onClick={() => setSelectedScopeId(scope.id)}
                                    >
                                        <CardHeader className="p-4 pb-2">
                                            <CardTitle className="text-base truncate flex items-center">
                                                <Settings className="h-4 w-4 mr-2 text-muted-foreground" />
                                                {scope.name}
                                                {!scope.isActive && (
                                                    <Badge variant="outline" className="ml-2 bg-yellow-50 text-yellow-600 border-yellow-200">
                                                        Inactive
                                                    </Badge>
                                                )}
                                            </CardTitle>
                                            <CardDescription className="text-xs truncate">
                                                {scope.description || "No description"}
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent className="p-4 pt-0 pb-2">
                                            <div className="flex flex-wrap gap-1 mt-1">
                                                <Badge variant="outline" className="text-xs">
                                                    {scope.scopeType}
                                                </Badge>
                                            </div>
                                        </CardContent>
                                        <CardFooter className="p-4 pt-0 flex justify-between items-center">
                                            <span className="text-xs text-muted-foreground">
                                                {format(new Date(scope.updatedAt), "MMM d, yyyy")}
                                            </span>
                                        </CardFooter>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </ScrollArea>
                </div>

                <div className="lg:col-span-2">
                    {selectedScopeId && selectedScope ? (
                        <div className="space-y-4 border rounded-lg p-6">
                            <div className="flex justify-between items-center">
                                <h2 className="text-xl font-semibold">{selectedScope.name}</h2>
                                <div className="flex gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={handleOpenDialogForEdit}
                                    >
                                        <PenLine className="h-4 w-4 mr-1" />
                                        Edit
                                    </Button>
                                    <Button
                                        variant="destructive"
                                        size="sm"
                                        onClick={() => handleDelete(selectedScope.id)}
                                    >
                                        <Trash2 className="h-4 w-4 mr-1" />
                                        Delete
                                    </Button>
                                </div>
                            </div>

                            <Separator />

                            <div className="space-y-4">
                                <div>
                                    <h3 className="text-sm font-medium text-muted-foreground mb-1">Description</h3>
                                    <p className="text-sm">
                                        {selectedScope.description || "No description provided"}
                                    </p>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <h3 className="text-sm font-medium text-muted-foreground mb-1">Created</h3>
                                        <p className="text-sm">
                                            {format(new Date(selectedScope.createdAt), "MMM d, yyyy HH:mm")}
                                        </p>
                                    </div>

                                    <div>
                                        <h3 className="text-sm font-medium text-muted-foreground mb-1">Updated</h3>
                                        <p className="text-sm">
                                            {format(new Date(selectedScope.updatedAt), "MMM d, yyyy HH:mm")}
                                        </p>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-sm font-medium text-muted-foreground mb-1">Status</h3>
                                    <div className="flex items-center">
                                        <div
                                            className={`h-2.5 w-2.5 rounded-full mr-2 ${selectedScope.isActive ? "bg-green-500" : "bg-yellow-500"
                                                }`}
                                        />
                                        <span className="text-sm">
                                            {selectedScope.isActive ? "Active" : "Inactive"}
                                        </span>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-sm font-medium text-muted-foreground mb-1">Scope Type</h3>
                                    <Badge variant="outline" className="mt-1">
                                        {selectedScope.scopeType}
                                    </Badge>
                                </div>

                                <div>
                                    <h3 className="text-sm font-medium text-muted-foreground mb-1">Conditions</h3>
                                    <div className="bg-muted/50 rounded-md p-4 mt-1">
                                        <pre className="text-xs whitespace-pre-wrap">
                                            {JSON.stringify(selectedScope.conditions, null, 2)}
                                        </pre>
                                    </div>
                                </div>

                                {!selectedScope.isActive && (
                                    <Alert className="mt-4 bg-yellow-50 text-yellow-800 border-yellow-200">
                                        <AlertCircle className="h-4 w-4" />
                                        <AlertTitle>Inactive Scope</AlertTitle>
                                        <AlertDescription>
                                            This context scope is currently inactive. Conditions in this scope won't be applied.
                                        </AlertDescription>
                                    </Alert>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full text-center border rounded-lg p-8">
                            <h3 className="text-lg font-medium mb-2">No context scope selected</h3>
                            <p className="text-muted-foreground mb-4">
                                Select a context scope from the list or create a new one
                            </p>
                            <Button onClick={handleOpenDialogForAdd}>
                                <Plus className="mr-2 h-4 w-4" />
                                Add Context Scope
                            </Button>
                        </div>
                    )}
                </div>
            </div>

            <ContextScopeDialog
                open={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                isEditing={isEditing}
                contextScope={isEditing ? selectedScope : undefined}
                onSave={(data) => {
                    if (isEditing && selectedScope) {
                        handleUpdateContextScope(selectedScope.id, data);
                    } else {
                        handleAddContextScope(data);
                    }
                    handleCloseDialog();
                }}
            />
        </div>
    );
} 