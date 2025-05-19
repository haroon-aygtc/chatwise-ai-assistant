import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PromptTemplate } from "@/types/ai-configuration";
import { Check, ChevronRight, Lightbulb, Wand2 } from "lucide-react";

interface TemplateWizardProps {
  onComplete: (template: Partial<PromptTemplate>) => void;
  onCancel: () => void;
}

type WizardStep = "purpose" | "details" | "variables" | "review";

const templateSuggestions = [
  {
    purpose: "customer-support",
    name: "Customer Support Response",
    description: "Generate helpful responses to customer inquiries",
    template:
      "You are a helpful customer support agent for {{company_name}}. Please respond to the following customer inquiry in a {{tone}} tone:\n\n{{customer_inquiry}}\n\nInclude information about {{topic}} if relevant.",
    variables: [
      {
        name: "company_name",
        description: "The name of your company",
        type: "string",
        required: true,
      },
      {
        name: "tone",
        description: "The tone of the response",
        type: "string",
        defaultValue: "friendly",
        required: true,
      },
      {
        name: "customer_inquiry",
        description: "The customer's question or issue",
        type: "string",
        required: true,
      },
      {
        name: "topic",
        description: "Specific topic to address",
        type: "string",
        required: false,
      },
    ],
  },
  {
    purpose: "content-creation",
    name: "Blog Post Outline",
    description: "Generate an outline for a blog post",
    template:
      "Create a detailed outline for a {{word_count}} word blog post about {{topic}}. The target audience is {{audience}} and the tone should be {{tone}}. Include {{num_sections}} main sections with subpoints.",
    variables: [
      {
        name: "word_count",
        description: "Target word count for the blog post",
        type: "number",
        defaultValue: "1000",
        required: true,
      },
      {
        name: "topic",
        description: "The main topic of the blog post",
        type: "string",
        required: true,
      },
      {
        name: "audience",
        description: "The target audience",
        type: "string",
        required: true,
      },
      {
        name: "tone",
        description: "The tone of the blog post",
        type: "string",
        defaultValue: "informative",
        required: true,
      },
      {
        name: "num_sections",
        description: "Number of main sections",
        type: "number",
        defaultValue: "3",
        required: true,
      },
    ],
  },
  {
    purpose: "product-description",
    name: "Product Description",
    description: "Generate compelling product descriptions",
    template:
      "Write a {{length}} product description for {{product_name}}, which is a {{product_category}}. Highlight its {{feature_1}}, {{feature_2}}, and {{feature_3}}. The target audience is {{target_audience}} and the tone should be {{tone}}.",
    variables: [
      {
        name: "length",
        description: "Length of the description",
        type: "string",
        defaultValue: "short",
        required: true,
      },
      {
        name: "product_name",
        description: "Name of the product",
        type: "string",
        required: true,
      },
      {
        name: "product_category",
        description: "Category of the product",
        type: "string",
        required: true,
      },
      {
        name: "feature_1",
        description: "First key feature",
        type: "string",
        required: true,
      },
      {
        name: "feature_2",
        description: "Second key feature",
        type: "string",
        required: true,
      },
      {
        name: "feature_3",
        description: "Third key feature",
        type: "string",
        required: true,
      },
      {
        name: "target_audience",
        description: "Target audience",
        type: "string",
        required: true,
      },
      {
        name: "tone",
        description: "Tone of the description",
        type: "string",
        defaultValue: "persuasive",
        required: true,
      },
    ],
  },
  {
    purpose: "custom",
    name: "",
    description: "",
    template: "",
    variables: [],
  },
];

export const TemplateWizard = ({
  onComplete,
  onCancel,
}: TemplateWizardProps) => {
  const [currentStep, setCurrentStep] = useState<WizardStep>("purpose");
  const [selectedPurpose, setSelectedPurpose] = useState("custom");
  const [template, setTemplate] = useState<Partial<PromptTemplate>>({
    name: "",
    description: "",
    template: "",
    variables: [],
    category: "",
  });

  // Handle purpose selection
  const handlePurposeSelect = (purpose: string) => {
    setSelectedPurpose(purpose);
    const suggestion = templateSuggestions.find((s) => s.purpose === purpose);
    if (suggestion && purpose !== "custom") {
      setTemplate({
        ...template,
        name: suggestion.name,
        description: suggestion.description,
        template: suggestion.template,
        variables: suggestion.variables,
        category: purpose,
      });
    }
  };

  // Handle next step
  const handleNext = () => {
    const steps: WizardStep[] = ["purpose", "details", "variables", "review"];
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1]);
    }
  };

  // Handle previous step
  const handlePrevious = () => {
    const steps: WizardStep[] = ["purpose", "details", "variables", "review"];
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1]);
    }
  };

  // Handle template details update
  const handleDetailsChange = (field: keyof PromptTemplate, value: any) => {
    setTemplate({ ...template, [field]: value });
  };

  // Add variable
  const addVariable = () => {
    const newVar = {
      name: `variable${(template.variables?.length || 0) + 1}`,
      description: "",
      type: "string",
      required: true,
    };
    setTemplate({
      ...template,
      variables: [...(template.variables || []), newVar],
    });
  };

  // Update variable
  const updateVariable = (index: number, field: string, value: any) => {
    if (!template.variables) return;

    const updatedVars = [...template.variables];
    updatedVars[index] = { ...updatedVars[index], [field]: value };

    setTemplate({
      ...template,
      variables: updatedVars,
    });
  };

  // Remove variable
  const removeVariable = (index: number) => {
    if (!template.variables) return;

    setTemplate({
      ...template,
      variables: template.variables.filter((_, i) => i !== index),
    });
  };

  // Complete wizard
  const handleComplete = () => {
    onComplete(template);
  };

  // Render step content
  const renderStepContent = () => {
    switch (currentStep) {
      case "purpose":
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <Wand2 className="h-12 w-12 mx-auto text-primary mb-2" />
              <h2 className="text-2xl font-bold">
                What will this template do?
              </h2>
              <p className="text-muted-foreground">
                Choose a purpose or start from scratch
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {templateSuggestions.map((suggestion) => (
                <Card
                  key={suggestion.purpose}
                  className={`cursor-pointer transition-all ${selectedPurpose === suggestion.purpose ? "border-primary ring-2 ring-primary/20" : "hover:border-primary/50"}`}
                  onClick={() => handlePurposeSelect(suggestion.purpose)}
                >
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex justify-between items-center">
                      {suggestion.purpose === "custom"
                        ? "Custom Template"
                        : suggestion.name}
                      {selectedPurpose === suggestion.purpose && (
                        <Check className="h-5 w-5 text-primary" />
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      {suggestion.purpose === "custom"
                        ? "Create a template from scratch with your own content and variables"
                        : suggestion.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        );

      case "details":
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold">Template Details</h2>
              <p className="text-muted-foreground">
                Provide basic information about your template
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="template-name">Template Name</Label>
                <Input
                  id="template-name"
                  value={template.name}
                  onChange={(e) => handleDetailsChange("name", e.target.value)}
                  placeholder="E.g., Customer Support Response"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="template-category">Category</Label>
                <Input
                  id="template-category"
                  value={template.category}
                  onChange={(e) =>
                    handleDetailsChange("category", e.target.value)
                  }
                  placeholder="E.g., Support, Marketing, Sales"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="template-description">Description</Label>
                <Textarea
                  id="template-description"
                  value={template.description}
                  onChange={(e) =>
                    handleDetailsChange("description", e.target.value)
                  }
                  placeholder="Describe what this template does and when to use it"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="template-content">Template Content</Label>
                <div className="mt-1 relative">
                  <Textarea
                    id="template-content"
                    value={template.template}
                    onChange={(e) =>
                      handleDetailsChange("template", e.target.value)
                    }
                    placeholder="Write your template here. Use {{variable_name}} for variables."
                    className="min-h-[200px] font-mono"
                  />
                  <div className="absolute bottom-2 right-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-xs flex items-center gap-1 text-muted-foreground"
                      onClick={() => {
                        // Show a tooltip or hint about variables
                      }}
                    >
                      <Lightbulb className="h-3 w-3" />
                      <span>Use {{ variable_name }} for variables</span>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case "variables":
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold">Define Variables</h2>
              <p className="text-muted-foreground">
                Add variables that can be customized when using this template
              </p>
            </div>

            <div className="flex justify-end">
              <Button variant="outline" onClick={addVariable}>
                Add Variable
              </Button>
            </div>

            {template.variables && template.variables.length > 0 ? (
              <div className="space-y-4">
                {template.variables.map((variable, index) => (
                  <Card key={index}>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium flex justify-between items-center">
                        <span>Variable {index + 1}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                          onClick={() => removeVariable(index)}
                        >
                          Remove
                        </Button>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor={`var-name-${index}`}>Name</Label>
                          <Input
                            id={`var-name-${index}`}
                            value={variable.name}
                            onChange={(e) =>
                              updateVariable(index, "name", e.target.value)
                            }
                            placeholder="E.g., customer_name"
                            className="mt-1"
                          />
                        </div>

                        <div>
                          <Label htmlFor={`var-type-${index}`}>Type</Label>
                          <Select
                            value={variable.type}
                            onValueChange={(value) =>
                              updateVariable(index, "type", value)
                            }
                          >
                            <SelectTrigger
                              id={`var-type-${index}`}
                              className="mt-1"
                            >
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="string">Text</SelectItem>
                              <SelectItem value="number">Number</SelectItem>
                              <SelectItem value="boolean">Yes/No</SelectItem>
                              <SelectItem value="array">List</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label htmlFor={`var-default-${index}`}>
                            Default Value (Optional)
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
                            placeholder="Default value"
                            className="mt-1"
                          />
                        </div>

                        <div className="flex items-center space-x-2 mt-6">
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
                            className="h-4 w-4"
                          />
                          <Label htmlFor={`var-required-${index}`}>
                            Required
                          </Label>
                        </div>
                      </div>

                      <div className="mt-4">
                        <Label htmlFor={`var-desc-${index}`}>Description</Label>
                        <Input
                          id={`var-desc-${index}`}
                          value={variable.description || ""}
                          onChange={(e) =>
                            updateVariable(index, "description", e.target.value)
                          }
                          placeholder="Explain what this variable is used for"
                          className="mt-1"
                        />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 border rounded-md bg-muted/20">
                <p className="text-muted-foreground">
                  No variables defined yet
                </p>
                <Button
                  variant="outline"
                  className="mt-2"
                  onClick={addVariable}
                >
                  Add Your First Variable
                </Button>
              </div>
            )}
          </div>
        );

      case "review":
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold">Review Your Template</h2>
              <p className="text-muted-foreground">
                Make sure everything looks good before saving
              </p>
            </div>

            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Template Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div>
                    <span className="font-medium">Name:</span> {template.name}
                  </div>
                  <div>
                    <span className="font-medium">Category:</span>{" "}
                    {template.category}
                  </div>
                  <div>
                    <span className="font-medium">Description:</span>{" "}
                    {template.description}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Template Content</CardTitle>
                </CardHeader>
                <CardContent>
                  <pre className="whitespace-pre-wrap bg-muted p-4 rounded-md text-sm">
                    {template.template}
                  </pre>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>
                    Variables ({template.variables?.length || 0})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {template.variables && template.variables.length > 0 ? (
                    <div className="space-y-2">
                      {template.variables.map((variable, index) => (
                        <div key={index} className="p-2 border rounded-md">
                          <div className="flex justify-between">
                            <span className="font-medium">{variable.name}</span>
                            <span className="text-sm text-muted-foreground">
                              {variable.type}
                            </span>
                          </div>
                          {variable.description && (
                            <p className="text-sm text-muted-foreground mt-1">
                              {variable.description}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">
                      No variables defined
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white dark:bg-gray-950 p-6 rounded-lg border">
      {/* Progress indicator */}
      <div className="mb-8">
        <div className="flex justify-between">
          {["purpose", "details", "variables", "review"].map((step, index) => (
            <div
              key={step}
              className="flex flex-col items-center"
              style={{ width: index === 0 || index === 3 ? "auto" : "100%" }}
            >
              <div className="relative flex items-center justify-center">
                <div
                  className={`h-10 w-10 rounded-full flex items-center justify-center ${currentStep === step ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}
                >
                  {index + 1}
                </div>
                {index < 3 && (
                  <div
                    className={`absolute left-10 w-full h-0.5 ${index < ["purpose", "details", "variables", "review"].indexOf(currentStep) ? "bg-primary" : "bg-muted"}`}
                  />
                )}
              </div>
              <span className="text-xs mt-1 text-muted-foreground capitalize">
                {step}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Step content */}
      <div className="mb-8">{renderStepContent()}</div>

      {/* Navigation buttons */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={currentStep === "purpose" ? onCancel : handlePrevious}
        >
          {currentStep === "purpose" ? "Cancel" : "Back"}
        </Button>

        <Button
          onClick={currentStep === "review" ? handleComplete : handleNext}
          disabled={
            currentStep === "details" && (!template.name || !template.template)
          }
        >
          {currentStep === "review" ? (
            "Create Template"
          ) : (
            <>
              Next <ChevronRight className="ml-1 h-4 w-4" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default TemplateWizard;
