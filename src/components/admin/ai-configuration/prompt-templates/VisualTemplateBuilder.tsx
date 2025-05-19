import React, { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlusCircle, Trash2, MoveVertical, Variable, Eye } from "lucide-react";
import { PromptTemplate, PromptVariable } from "@/types/ai-configuration";

interface VisualTemplateBuilderProps {
  initialTemplate?: Partial<PromptTemplate>;
  onSave: (template: Partial<PromptTemplate>) => void;
}

type TemplateBlock = {
  id: string;
  type: "text" | "variable" | "condition";
  content: string;
};

export const VisualTemplateBuilder = ({
  initialTemplate,
  onSave,
}: VisualTemplateBuilderProps) => {
  const [name, setName] = useState(initialTemplate?.name || "");
  const [description, setDescription] = useState(
    initialTemplate?.description || "",
  );
  const [category, setCategory] = useState(initialTemplate?.category || "");
  const [blocks, setBlocks] = useState<TemplateBlock[]>(
    initialTemplate?.template
      ? parseTemplateToBlocks(initialTemplate.template)
      : [{ id: "block-1", type: "text", content: "" }],
  );
  const [variables, setVariables] = useState<PromptVariable[]>(
    initialTemplate?.variables || [],
  );
  const [activeTab, setActiveTab] = useState("visual");
  const [previewContent, setPreviewContent] = useState("");

  // Parse template string into blocks (simplified implementation)
  function parseTemplateToBlocks(template: string): TemplateBlock[] {
    // This is a simplified implementation
    // In a real app, you'd need more sophisticated parsing
    const blocks: TemplateBlock[] = [];
    let currentIndex = 0;

    // Simple regex to find {{variable}} patterns
    const variableRegex = /\{\{([^}]+)\}\}/g;
    let match;
    let lastIndex = 0;

    while ((match = variableRegex.exec(template)) !== null) {
      // Add text before the variable if any
      if (match.index > lastIndex) {
        blocks.push({
          id: `block-${currentIndex++}`,
          type: "text",
          content: template.substring(lastIndex, match.index),
        });
      }

      // Add the variable
      blocks.push({
        id: `block-${currentIndex++}`,
        type: "variable",
        content: match[1].trim(),
      });

      lastIndex = match.index + match[0].length;
    }

    // Add remaining text if any
    if (lastIndex < template.length) {
      blocks.push({
        id: `block-${currentIndex++}`,
        type: "text",
        content: template.substring(lastIndex),
      });
    }

    return blocks.length > 0
      ? blocks
      : [{ id: "block-1", type: "text", content: "" }];
  }

  // Convert blocks back to template string
  const generateTemplateString = () => {
    return blocks
      .map((block) => {
        if (block.type === "text") return block.content;
        if (block.type === "variable") return `{{${block.content}}}`;
        return "";
      })
      .join("");
  };

  // Handle drag and drop reordering
  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const items = Array.from(blocks);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setBlocks(items);
  };

  // Add a new block
  const addBlock = (type: "text" | "variable") => {
    setBlocks([...blocks, { id: `block-${Date.now()}`, type, content: "" }]);
  };

  // Update block content
  const updateBlockContent = (id: string, content: string) => {
    setBlocks(
      blocks.map((block) => (block.id === id ? { ...block, content } : block)),
    );
  };

  // Remove a block
  const removeBlock = (id: string) => {
    setBlocks(blocks.filter((block) => block.id !== id));
  };

  // Add a new variable
  const addVariable = () => {
    const newVar: PromptVariable = {
      name: `variable${variables.length + 1}`,
      description: "",
      type: "string",
      required: true,
    };
    setVariables([...variables, newVar]);
  };

  // Update variable
  const updateVariable = (
    index: number,
    field: keyof PromptVariable,
    value: any,
  ) => {
    const updatedVars = [...variables];
    updatedVars[index] = { ...updatedVars[index], [field]: value };
    setVariables(updatedVars);
  };

  // Remove variable
  const removeVariable = (index: number) => {
    setVariables(variables.filter((_, i) => i !== index));
  };

  // Use variable in template
  const useVariableInTemplate = (varName: string) => {
    addBlock("variable");
    updateBlockContent(`block-${Date.now()}`, varName);
  };

  // Generate preview
  const generatePreview = () => {
    let preview = generateTemplateString();

    // Replace variables with sample values
    variables.forEach((variable) => {
      const placeholder = `{{${variable.name}}}`;
      const sampleValue = variable.defaultValue || `[${variable.name}]`;
      preview = preview.replace(new RegExp(placeholder, "g"), sampleValue);
    });

    setPreviewContent(preview);
    setActiveTab("preview");
  };

  // Handle save
  const handleSave = () => {
    const template: Partial<PromptTemplate> = {
      name,
      description,
      category,
      template: generateTemplateString(),
      variables,
    };
    onSave(template);
  };

  return (
    <div className="space-y-6 bg-white dark:bg-gray-950 p-6 rounded-lg border">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="template-name">Template Name</Label>
          <Input
            id="template-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter template name"
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="template-category">Category</Label>
          <Input
            id="template-category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="E.g., Customer Support, Marketing"
            className="mt-1"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="template-description">Description</Label>
        <Textarea
          id="template-description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe what this template does"
          className="mt-1"
        />
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 w-full">
          <TabsTrigger value="visual">Visual Builder</TabsTrigger>
          <TabsTrigger value="code">Code View</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
        </TabsList>

        <TabsContent value="visual" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex justify-between items-center">
                <span>Template Blocks</span>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => addBlock("text")}
                  >
                    <PlusCircle className="h-4 w-4 mr-1" /> Add Text
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => addBlock("variable")}
                  >
                    <Variable className="h-4 w-4 mr-1" /> Add Variable
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="blocks">
                  {(provided) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className="space-y-3"
                    >
                      {blocks.map((block, index) => (
                        <Draggable
                          key={block.id}
                          draggableId={block.id}
                          index={index}
                        >
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              className={`p-3 rounded-md border flex items-start gap-2 ${block.type === "variable" ? "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800" : "bg-white dark:bg-gray-900"}`}
                            >
                              <div
                                {...provided.dragHandleProps}
                                className="mt-2 cursor-move"
                              >
                                <MoveVertical className="h-5 w-5 text-gray-400" />
                              </div>

                              {block.type === "text" ? (
                                <Textarea
                                  value={block.content}
                                  onChange={(e) =>
                                    updateBlockContent(block.id, e.target.value)
                                  }
                                  placeholder="Enter text content"
                                  className="flex-1 min-h-[80px]"
                                />
                              ) : (
                                <div className="flex-1 flex items-center gap-2">
                                  <Badge variant="secondary" className="py-2">
                                    <Variable className="h-4 w-4 mr-1" />
                                    Variable
                                  </Badge>
                                  <select
                                    value={block.content}
                                    onChange={(e) =>
                                      updateBlockContent(
                                        block.id,
                                        e.target.value,
                                      )
                                    }
                                    className="flex-1 p-2 border rounded-md bg-transparent"
                                  >
                                    <option value="">Select variable</option>
                                    {variables.map((v) => (
                                      <option key={v.name} value={v.name}>
                                        {v.name}
                                      </option>
                                    ))}
                                  </select>
                                </div>
                              )}

                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => removeBlock(block.id)}
                                className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="text-lg flex justify-between items-center">
                <span>Variables</span>
                <Button variant="outline" size="sm" onClick={addVariable}>
                  <PlusCircle className="h-4 w-4 mr-1" /> Add Variable
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {variables.length === 0 ? (
                <div className="text-center py-4 text-gray-500">
                  No variables defined. Add variables to make your template
                  dynamic.
                </div>
              ) : (
                <div className="space-y-4">
                  {variables.map((variable, index) => (
                    <div
                      key={index}
                      className="p-4 border rounded-md bg-gray-50 dark:bg-gray-900"
                    >
                      <div className="flex justify-between items-center mb-3">
                        <div className="flex items-center gap-2">
                          <Badge>{variable.name}</Badge>
                          {variable.required && (
                            <Badge variant="destructive" className="text-xs">
                              Required
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => useVariableInTemplate(variable.name)}
                          >
                            Use
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeVariable(index)}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor={`var-name-${index}`}>Name</Label>
                          <Input
                            id={`var-name-${index}`}
                            value={variable.name}
                            onChange={(e) =>
                              updateVariable(index, "name", e.target.value)
                            }
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor={`var-type-${index}`}>Type</Label>
                          <select
                            id={`var-type-${index}`}
                            value={variable.type}
                            onChange={(e) =>
                              updateVariable(index, "type", e.target.value)
                            }
                            className="w-full p-2 border rounded-md bg-transparent mt-1"
                          >
                            <option value="string">Text</option>
                            <option value="number">Number</option>
                            <option value="boolean">Yes/No</option>
                            <option value="array">List</option>
                          </select>
                        </div>
                        <div>
                          <Label htmlFor={`var-default-${index}`}>
                            Default Value
                          </Label>
                          <Input
                            id={`var-default-${index}`}
                            value={variable.defaultValue || ""}
                            onChange={(e) =>
                              updateVariable(
                                index,
                                "defaultValue",
                                e.target.value,
                              )
                            }
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label
                            htmlFor={`var-required-${index}`}
                            className="flex items-center gap-2"
                          >
                            <input
                              type="checkbox"
                              id={`var-required-${index}`}
                              checked={variable.required}
                              onChange={(e) =>
                                updateVariable(
                                  index,
                                  "required",
                                  e.target.checked,
                                )
                              }
                            />
                            Required
                          </Label>
                          <div className="mt-1">
                            <Input
                              value={variable.description || ""}
                              onChange={(e) =>
                                updateVariable(
                                  index,
                                  "description",
                                  e.target.value,
                                )
                              }
                              placeholder="Description (optional)"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="code" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Template Code</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={generateTemplateString()}
                className="font-mono h-[400px]"
                readOnly
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preview" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>Preview</span>
                <Button variant="outline" size="sm" onClick={generatePreview}>
                  <Eye className="h-4 w-4 mr-1" /> Refresh Preview
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="p-4 border rounded-md bg-gray-50 dark:bg-gray-900 min-h-[200px] whitespace-pre-wrap">
                {previewContent ||
                  "Click 'Refresh Preview' to see how your template will look with sample values."}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end gap-3">
        <Button variant="outline" onClick={generatePreview}>
          Preview
        </Button>
        <Button onClick={handleSave} disabled={!name || blocks.length === 0}>
          Save Template
        </Button>
      </div>
    </div>
  );
};

export default VisualTemplateBuilder;
