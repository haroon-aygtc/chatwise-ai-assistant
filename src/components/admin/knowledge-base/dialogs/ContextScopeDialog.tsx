import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ContextScope, CreateContextScopeRequest, UpdateContextScopeRequest } from "@/types/knowledge-base";
import { CodeEditor } from "@/components/ui/code-editor";

interface ContextScopeDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    isEditing: boolean;
    contextScope?: ContextScope;
    onSave: (data: CreateContextScopeRequest | UpdateContextScopeRequest) => void;
}

export function ContextScopeDialog({
    open,
    onOpenChange,
    isEditing,
    contextScope,
    onSave,
}: ContextScopeDialogProps) {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [isActive, setIsActive] = useState(true);
    const [scopeType, setScopeType] = useState<string>("CONVERSATION");
    const [conditions, setConditions] = useState<string>("{}");
    const [nameError, setNameError] = useState("");
    const [conditionsError, setConditionsError] = useState("");

    useEffect(() => {
        if (contextScope) {
            setName(contextScope.name);
            setDescription(contextScope.description || "");
            setIsActive(contextScope.isActive || true);
            setScopeType(contextScope.scopeType || "CONVERSATION");
            setConditions(JSON.stringify(contextScope.conditions || {}, null, 2));
        } else {
            setName("");
            setDescription("");
            setIsActive(true);
            setScopeType("CONVERSATION");
            setConditions("{}");
        }
        setNameError("");
        setConditionsError("");
    }, [contextScope, open]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Validate
        if (!name.trim()) {
            setNameError("Context scope name is required");
            return;
        }

        // Validate JSON
        let parsedConditions;
        try {
            parsedConditions = JSON.parse(conditions);
            if (typeof parsedConditions !== 'object' || parsedConditions === null) {
                throw new Error("Conditions must be a valid JSON object");
            }
        } catch (error) {
            setConditionsError("Invalid JSON format for conditions");
            return;
        }

        const data: CreateContextScopeRequest | UpdateContextScopeRequest = {
            name: name.trim(),
            description: description.trim(),
            isActive,
            scopeType,
            conditions: parsedConditions
        };

        onSave(data);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>{isEditing ? "Edit Context Scope" : "Add Context Scope"}</DialogTitle>
                    <DialogDescription>
                        {isEditing
                            ? "Update rules for conditional knowledge access"
                            : "Create conditional rules for when specific knowledge should be available"}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Scope Name</Label>
                            <Input
                                id="name"
                                value={name}
                                onChange={(e) => {
                                    setName(e.target.value);
                                    setNameError("");
                                }}
                                placeholder="e.g., Support Tickets Context"
                            />
                            {nameError && <p className="text-sm text-destructive">{nameError}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Add a short description of when this context scope applies..."
                                rows={2}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="scopeType">Scope Type</Label>
                                <Select
                                    value={scopeType}
                                    onValueChange={(value) => setScopeType(value)}
                                >
                                    <SelectTrigger id="scopeType">
                                        <SelectValue placeholder="Select scope type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="CONVERSATION">Conversation</SelectItem>
                                        <SelectItem value="USER">User</SelectItem>
                                        <SelectItem value="SESSION">Session</SelectItem>
                                        <SelectItem value="CUSTOM">Custom</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="flex items-center space-x-2 pt-6">
                                <Switch
                                    id="active"
                                    checked={isActive}
                                    onCheckedChange={setIsActive}
                                />
                                <Label htmlFor="active">Scope is active</Label>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="conditions">Conditions (JSON)</Label>
                            <CodeEditor
                                value={conditions}
                                onChange={setConditions}
                                onValidate={(isValid) => {
                                    if (isValid) {
                                        setConditionsError("");
                                    }
                                }}
                                language="json"
                                height="200px"
                            />
                            {conditionsError && <p className="text-sm text-destructive">{conditionsError}</p>}
                            <p className="text-xs text-muted-foreground">
                                Define conditions that determine when this context scope should be applied
                            </p>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            Cancel
                        </Button>
                        <Button type="submit">
                            {isEditing ? "Update Scope" : "Create Scope"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
} 