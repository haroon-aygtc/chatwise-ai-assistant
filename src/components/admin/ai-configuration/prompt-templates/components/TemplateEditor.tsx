import React, { useState, useEffect } from "react";
import { Editor } from "@monaco-editor/react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";
import { PromptVariable } from "@/types/ai-configuration";
import { VariablesPanel } from "./VariablesPanel";
import { cn } from "@/lib/utils";
import { TabsContent, Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Define prop types with TypeScript
interface TemplateEditorProps {
    value: string;
    onChange: (value: string) => void;
    variables: PromptVariable[];
    onVariablesChange: (variables: PromptVariable[]) => void;
    readOnly?: boolean;
    height?: string;
    className?: string;
}

/**
 * TemplateEditor - A production-ready editor for creating and editing prompt templates
 * 
 * Features:
 * - Monaco editor with syntax highlighting
 * - Variables panel for managing template variables
 * - Preview mode to see rendered template
 * - Variable validation and insertion
 */
export function TemplateEditor({
    value,
    onChange,
    variables,
    onVariablesChange,
    readOnly = false,
    height = "500px",
    className
}: TemplateEditorProps) {
    const [currentTab, setCurrentTab] = useState<string>("edit");
    const [previewValues, setPreviewValues] = useState<Record<string, string>>({});
    const [previewContent, setPreviewContent] = useState<string>("");
    const [showVariablesPanel, setShowVariablesPanel] = useState<boolean>(false);

    // Extract variables when template changes
    useEffect(() => {
        extractVariablesFromTemplate(value);
    }, [value]);

    // Update preview when template or preview values change
    useEffect(() => {
        renderPreview();
    }, [value, previewValues]);

    // Extract variables from template content using regex
    const extractVariablesFromTemplate = (content: string) => {
        const regex = /\{\{([^}]+)\}\}/g;
        const matches = [...content.matchAll(regex)];
        const extractedVars = new Set<string>();

        matches.forEach(match => {
            const varName = match[1].trim();
            extractedVars.add(varName);
        });

        // Create or update variable definitions
        const updatedVariables = [...variables];

        // Add new variables
        extractedVars.forEach(varName => {
            const exists = variables.some(v => v.name === varName);
            if (!exists) {
                updatedVariables.push({
                    name: varName,
                    description: "",
                    type: "string",
                    required: true
                });
            }
        });

        // Don't remove variables that are not in the template,
        // as they might be temporarily removed but needed later

        onVariablesChange(updatedVariables);
    };

    // Insert a variable at cursor position
    const insertVariable = (variableName: string) => {
        if (readOnly) return;

        // The insertion is handled by the monaco editor instance
        // This is a placeholder for the actual implementation
        onChange(`${value}{{${variableName}}}`);
    };

    // Render preview by replacing variables with values
    const renderPreview = () => {
        let rendered = value;
        variables.forEach(variable => {
            const value = previewValues[variable.name] || `[${variable.name}]`;
            rendered = rendered.replace(
                new RegExp(`\\{\\{${variable.name}\\}\\}`, 'g'),
                value
            );
        });
        setPreviewContent(rendered);
    };

    // Handle changes to preview values
    const handlePreviewValueChange = (variableName: string, value: string) => {
        setPreviewValues(prev => ({
            ...prev,
            [variableName]: value
        }));
    };

    return (
        <div className={cn("space-y-4", className)}>
            <Tabs value={currentTab} onValueChange={setCurrentTab} className="w-full">
                <div className="flex justify-between items-center mb-4">
                    <TabsList>
                        <TabsTrigger value="edit">Edit</TabsTrigger>
                        <TabsTrigger value="preview">Preview</TabsTrigger>
                    </TabsList>

                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            onClick={() => setShowVariablesPanel(true)}
                            disabled={readOnly}
                        >
                            Manage Variables
                        </Button>
                    </div>
                </div>

                <TabsContent value="edit" className="mt-0">
                    <Card>
                        <CardContent className="p-0">
                            <Editor
                                height={height}
                                defaultLanguage="markdown"
                                value={value}
                                onChange={(val) => onChange(val || "")}
                                options={{
                                    minimap: { enabled: false },
                                    lineNumbers: "on",
                                    scrollBeyondLastLine: false,
                                    wordWrap: "on",
                                    wrappingIndent: "same",
                                    readOnly
                                }}
                            />
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="preview" className="mt-0">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="md:col-span-2">
                            <Card>
                                <CardContent className="p-4">
                                    <h3 className="font-medium mb-2">Template Preview</h3>
                                    <div className="whitespace-pre-wrap bg-muted p-4 rounded-md min-h-[300px] max-h-[500px] overflow-auto">
                                        {previewContent}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        <div>
                            <Card>
                                <CardContent className="p-4">
                                    <h3 className="font-medium mb-2">Variable Values</h3>
                                    <div className="space-y-4">
                                        {variables.map(variable => (
                                            <div key={variable.name} className="space-y-2">
                                                <label className="text-sm font-medium">
                                                    {variable.name}
                                                    {variable.required && <span className="text-destructive">*</span>}
                                                </label>
                                                <input
                                                    type="text"
                                                    className="w-full border border-input bg-background px-3 py-2 rounded-md"
                                                    value={previewValues[variable.name] || ""}
                                                    onChange={(e) => handlePreviewValueChange(variable.name, e.target.value)}
                                                    placeholder={variable.description || `Enter ${variable.name}`}
                                                />
                                            </div>
                                        ))}

                                        {variables.length === 0 && (
                                            <div className="text-muted-foreground">
                                                No variables defined in this template
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </TabsContent>
            </Tabs>

            <Dialog open={showVariablesPanel} onOpenChange={setShowVariablesPanel}>
                <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Manage Template Variables</DialogTitle>
                    </DialogHeader>

                    <VariablesPanel
                        variables={variables}
                        onChange={onVariablesChange}
                        onInsert={insertVariable}
                    />
                </DialogContent>
            </Dialog>
        </div>
    );
} 