import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { X, Plus, ArrowRight } from "lucide-react";
import { PromptVariable } from "@/types/ai-configuration";

interface VariablesPanelProps {
    variables: PromptVariable[];
    onChange: (variables: PromptVariable[]) => void;
    onInsert?: (variableName: string) => void;
}

/**
 * VariablesPanel - A component for managing template variables
 * 
 * Features:
 * - Add, edit, and remove variables
 * - Set variable types, default values, and requirements
 * - Insert variables into the template
 */
export function VariablesPanel({
    variables,
    onChange,
    onInsert,
}: VariablesPanelProps) {
    const [newVariable, setNewVariable] = useState<PromptVariable>({
        name: "",
        description: "",
        type: "string",
        defaultValue: "",
        required: true,
    });

    // Variable types
    const variableTypes = [
        { value: "string", label: "Text" },
        { value: "number", label: "Number" },
        { value: "boolean", label: "True/False" },
        { value: "date", label: "Date" },
        { value: "email", label: "Email" },
        { value: "url", label: "URL" },
    ];

    // Add a new variable
    const handleAddVariable = () => {
        if (!newVariable.name.trim()) return;

        // Check for duplicate names
        if (variables.some(v => v.name === newVariable.name)) {
            // In production, use a proper toast notification
            alert("A variable with this name already exists");
            return;
        }

        onChange([...variables, newVariable]);

        // Reset form
        setNewVariable({
            name: "",
            description: "",
            type: "string",
            defaultValue: "",
            required: true,
        });
    };

    // Update an existing variable
    const handleUpdateVariable = (index: number, field: keyof PromptVariable, value: any) => {
        const updatedVariables = [...variables];
        updatedVariables[index] = {
            ...updatedVariables[index],
            [field]: value,
        };

        // For name changes, ensure no duplicates
        if (field === 'name') {
            const isDuplicate = updatedVariables.some(
                (v, i) => i !== index && v.name === value
            );

            if (isDuplicate) {
                // In production, use a proper toast notification
                alert("A variable with this name already exists");
                return;
            }
        }

        onChange(updatedVariables);
    };

    // Remove a variable
    const handleRemoveVariable = (index: number) => {
        const updatedVariables = [...variables];
        updatedVariables.splice(index, 1);
        onChange(updatedVariables);
    };

    // Insert a variable into the template
    const handleInsert = (name: string) => {
        if (onInsert) {
            onInsert(name);
        }
    };

    return (
        <div className="space-y-6">
            <div className="space-y-4">
                <h3 className="text-lg font-medium">Add New Variable</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                        <label className="text-sm mb-1 block">Name</label>
                        <Input
                            value={newVariable.name}
                            onChange={(e) =>
                                setNewVariable({ ...newVariable, name: e.target.value })
                            }
                            placeholder="user_name"
                        />
                    </div>

                    <div>
                        <label className="text-sm mb-1 block">Type</label>
                        <Select
                            value={newVariable.type}
                            onValueChange={(value) =>
                                setNewVariable({ ...newVariable, type: value })
                            }
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                                {variableTypes.map((type) => (
                                    <SelectItem key={type.value} value={type.value}>
                                        {type.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div>
                        <label className="text-sm mb-1 block">Default Value</label>
                        <Input
                            value={newVariable.defaultValue || ""}
                            onChange={(e) =>
                                setNewVariable({
                                    ...newVariable,
                                    defaultValue: e.target.value,
                                })
                            }
                            placeholder="Default value"
                        />
                    </div>

                    <div className="flex items-end">
                        <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="required"
                                    checked={newVariable.required}
                                    onCheckedChange={(checked) =>
                                        setNewVariable({
                                            ...newVariable,
                                            required: Boolean(checked),
                                        })
                                    }
                                />
                                <label htmlFor="required" className="text-sm">
                                    Required
                                </label>
                            </div>

                            <Button onClick={handleAddVariable} size="sm">
                                <Plus className="h-4 w-4 mr-1" />
                                Add
                            </Button>
                        </div>
                    </div>
                </div>

                <div>
                    <label className="text-sm mb-1 block">Description</label>
                    <Input
                        value={newVariable.description || ""}
                        onChange={(e) =>
                            setNewVariable({
                                ...newVariable,
                                description: e.target.value,
                            })
                        }
                        placeholder="Variable description"
                    />
                </div>
            </div>

            <div>
                <h3 className="text-lg font-medium mb-4">Existing Variables</h3>
                {variables.length > 0 ? (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Default Value</TableHead>
                                <TableHead>Required</TableHead>
                                <TableHead>Description</TableHead>
                                <TableHead className="w-[100px]">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {variables.map((variable, index) => (
                                <TableRow key={index}>
                                    <TableCell>
                                        <Input
                                            value={variable.name}
                                            onChange={(e) =>
                                                handleUpdateVariable(index, "name", e.target.value)
                                            }
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Select
                                            value={variable.type || "string"}
                                            onValueChange={(value) =>
                                                handleUpdateVariable(index, "type", value)
                                            }
                                        >
                                            <SelectTrigger className="w-full">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {variableTypes.map((type) => (
                                                    <SelectItem key={type.value} value={type.value}>
                                                        {type.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </TableCell>
                                    <TableCell>
                                        <Input
                                            value={variable.defaultValue || ""}
                                            onChange={(e) =>
                                                handleUpdateVariable(
                                                    index,
                                                    "defaultValue",
                                                    e.target.value
                                                )
                                            }
                                            placeholder="Default value"
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Checkbox
                                            checked={variable.required || false}
                                            onCheckedChange={(checked) =>
                                                handleUpdateVariable(
                                                    index,
                                                    "required",
                                                    Boolean(checked)
                                                )
                                            }
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Input
                                            value={variable.description || ""}
                                            onChange={(e) =>
                                                handleUpdateVariable(
                                                    index,
                                                    "description",
                                                    e.target.value
                                                )
                                            }
                                            placeholder="Description"
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex space-x-2">
                                            {onInsert && (
                                                <Button
                                                    size="icon"
                                                    variant="outline"
                                                    onClick={() => handleInsert(variable.name)}
                                                    title="Insert into template"
                                                >
                                                    <ArrowRight className="h-4 w-4" />
                                                </Button>
                                            )}
                                            <Button
                                                size="icon"
                                                variant="outline"
                                                onClick={() => handleRemoveVariable(index)}
                                                title="Remove variable"
                                            >
                                                <X className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                ) : (
                    <div className="text-center p-4 border rounded-md text-muted-foreground">
                        No variables defined. Add your first variable above.
                    </div>
                )}
            </div>
        </div>
    );
} 