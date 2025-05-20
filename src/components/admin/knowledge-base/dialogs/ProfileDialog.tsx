import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { CheckboxGroup } from "@/components/ui/checkbox-group";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ResourceCollection, KnowledgeProfile, ContextScope, CreateKnowledgeProfileRequest, UpdateKnowledgeProfileRequest } from "@/types/knowledge-base";

interface ProfileDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    isEditing: boolean;
    profile?: KnowledgeProfile;
    collections: ResourceCollection[];
    contextScopes: ContextScope[];
    onSave: (data: CreateKnowledgeProfileRequest | UpdateKnowledgeProfileRequest) => void;
}

export function ProfileDialog({
    open,
    onOpenChange,
    isEditing,
    profile,
    collections,
    contextScopes,
    onSave,
}: ProfileDialogProps) {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [isActive, setIsActive] = useState(true);
    const [isDefault, setIsDefault] = useState(false);
    const [selectedCollections, setSelectedCollections] = useState<string[]>([]);
    const [selectedScopes, setSelectedScopes] = useState<string[]>([]);
    const [nameError, setNameError] = useState("");

    useEffect(() => {
        if (profile) {
            setName(profile.name);
            setDescription(profile.description || "");
            setIsActive(profile.isActive);
            setIsDefault(profile.isDefault || false);
            setSelectedCollections(profile.collectionIds || []);
            setSelectedScopes(profile.contextScopes || []);
        } else {
            setName("");
            setDescription("");
            setIsActive(true);
            setIsDefault(false);
            setSelectedCollections([]);
            setSelectedScopes([]);
        }
        setNameError("");
    }, [profile, open]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Validate
        if (!name.trim()) {
            setNameError("Profile name is required");
            return;
        }

        if (selectedCollections.length === 0) {
            setNameError("At least one collection must be selected");
            return;
        }

        const data: CreateKnowledgeProfileRequest | UpdateKnowledgeProfileRequest = {
            name: name.trim(),
            description: description.trim(),
            isActive,
            isDefault,
            collectionIds: selectedCollections,
            contextScopes: selectedScopes
        };

        onSave(data);
    };

    const handleCollectionChange = (collectionId: string, checked: boolean) => {
        if (checked) {
            setSelectedCollections([...selectedCollections, collectionId]);
        } else {
            setSelectedCollections(selectedCollections.filter(id => id !== collectionId));
        }
    };

    const handleScopeChange = (scopeId: string, checked: boolean) => {
        if (checked) {
            setSelectedScopes([...selectedScopes, scopeId]);
        } else {
            setSelectedScopes(selectedScopes.filter(id => id !== scopeId));
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>{isEditing ? "Edit Knowledge Profile" : "Add Knowledge Profile"}</DialogTitle>
                    <DialogDescription>
                        {isEditing
                            ? "Update which knowledge collections this profile can access"
                            : "Create a new profile to define what knowledge is available to the AI"}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Profile Name</Label>
                            <Input
                                id="name"
                                value={name}
                                onChange={(e) => {
                                    setName(e.target.value);
                                    setNameError("");
                                }}
                                placeholder="e.g., Customer Support Knowledge"
                            />
                            {nameError && <p className="text-sm text-destructive">{nameError}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Add a short description of this knowledge profile..."
                                rows={2}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex items-center space-x-2">
                                <Switch
                                    id="active"
                                    checked={isActive}
                                    onCheckedChange={setIsActive}
                                />
                                <Label htmlFor="active">Profile is active</Label>
                            </div>

                            <div className="flex items-center space-x-2">
                                <Switch
                                    id="default"
                                    checked={isDefault}
                                    onCheckedChange={setIsDefault}
                                />
                                <Label htmlFor="default">Set as default profile</Label>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>Collections</Label>
                            <ScrollArea className="h-[150px] border rounded-md p-2">
                                <CheckboxGroup>
                                    {collections.map((collection) => (
                                        <div key={collection.id} className="flex items-start space-x-2 py-1">
                                            <Checkbox
                                                id={`collection-${collection.id}`}
                                                checked={selectedCollections.includes(collection.id)}
                                                onCheckedChange={(checked) =>
                                                    handleCollectionChange(collection.id, checked === true)
                                                }
                                            />
                                            <div className="grid gap-1 leading-none">
                                                <Label
                                                    htmlFor={`collection-${collection.id}`}
                                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                                >
                                                    {collection.name}
                                                    {!collection.isActive && (
                                                        <span className="ml-2 text-xs text-yellow-600">(inactive)</span>
                                                    )}
                                                </Label>
                                                {collection.description && (
                                                    <p className="text-xs text-muted-foreground">{collection.description}</p>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </CheckboxGroup>
                            </ScrollArea>
                        </div>

                        {contextScopes.length > 0 && (
                            <div className="space-y-2">
                                <Label>Context Scopes (Optional)</Label>
                                <ScrollArea className="h-[150px] border rounded-md p-2">
                                    <CheckboxGroup>
                                        {contextScopes.map((scope) => (
                                            <div key={scope.id} className="flex items-start space-x-2 py-1">
                                                <Checkbox
                                                    id={`scope-${scope.id}`}
                                                    checked={selectedScopes.includes(scope.id)}
                                                    onCheckedChange={(checked) =>
                                                        handleScopeChange(scope.id, checked === true)
                                                    }
                                                />
                                                <div className="grid gap-1 leading-none">
                                                    <Label
                                                        htmlFor={`scope-${scope.id}`}
                                                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                                    >
                                                        {scope.name}
                                                        {!scope.isActive && (
                                                            <span className="ml-2 text-xs text-yellow-600">(inactive)</span>
                                                        )}
                                                    </Label>
                                                    {scope.description && (
                                                        <p className="text-xs text-muted-foreground">{scope.description}</p>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </CheckboxGroup>
                                </ScrollArea>
                            </div>
                        )}
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            Cancel
                        </Button>
                        <Button type="submit">
                            {isEditing ? "Update Profile" : "Create Profile"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
} 