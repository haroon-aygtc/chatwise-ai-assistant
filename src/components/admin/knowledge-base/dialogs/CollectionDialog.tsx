import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { ResourceCollection, CreateCollectionRequest, UpdateCollectionRequest } from "@/types/knowledge-base";

interface CollectionDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    isEditing: boolean;
    collection?: ResourceCollection;
    onSave: (data: CreateCollectionRequest | UpdateCollectionRequest) => void;
}

export function CollectionDialog({
    open,
    onOpenChange,
    isEditing,
    collection,
    onSave,
}: CollectionDialogProps) {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [isActive, setIsActive] = useState(true);
    const [nameError, setNameError] = useState("");

    useEffect(() => {
        if (collection) {
            setName(collection.name);
            setDescription(collection.description || "");
            setIsActive(collection.isActive);
        } else {
            setName("");
            setDescription("");
            setIsActive(true);
        }
        setNameError("");
    }, [collection, open]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Validate
        if (!name.trim()) {
            setNameError("Collection name is required");
            return;
        }

        const data: CreateCollectionRequest | UpdateCollectionRequest = {
            name: name.trim(),
            description: description.trim(),
            isActive
        };

        onSave(data);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>{isEditing ? "Edit Collection" : "Add Collection"}</DialogTitle>
                    <DialogDescription>
                        {isEditing
                            ? "Update the details of this knowledge collection"
                            : "Create a new collection to organize your knowledge resources"}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Collection Name</Label>
                            <Input
                                id="name"
                                value={name}
                                onChange={(e) => {
                                    setName(e.target.value);
                                    setNameError("");
                                }}
                                placeholder="e.g., Product Documentation"
                            />
                            {nameError && <p className="text-sm text-destructive">{nameError}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Add a short description of this collection..."
                                rows={3}
                            />
                        </div>

                        <div className="flex items-center space-x-2">
                            <Switch
                                id="active"
                                checked={isActive}
                                onCheckedChange={setIsActive}
                            />
                            <Label htmlFor="active">Collection is active</Label>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            Cancel
                        </Button>
                        <Button type="submit">
                            {isEditing ? "Update Collection" : "Create Collection"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
} 