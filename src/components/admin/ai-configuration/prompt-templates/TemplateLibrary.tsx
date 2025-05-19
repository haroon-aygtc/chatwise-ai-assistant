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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { PromptTemplate } from "@/types/ai-configuration";
import { BookOpen, Check, Copy, Filter, Search, Tag } from "lucide-react";

interface TemplateLibraryProps {
  onSelectTemplate: (template: PromptTemplate) => void;
}

// Sample template categories
const categories = [
  "All Templates",
  "Customer Support",
  "Content Creation",
  "Marketing",
  "Sales",
  "Product",
  "Technical",
  "Custom",
];

// Sample templates library
const sampleTemplates: PromptTemplate[] = [
  {
    id: "1",
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
    category: "Customer Support",
    usageCount: 128,
  },
  {
    id: "2",
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
    category: "Content Creation",
    usageCount: 87,
  },
  {
    id: "3",
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
    category: "Marketing",
    usageCount: 65,
  },
  {
    id: "4",
    name: "Sales Email",
    description: "Generate personalized sales emails",
    template:
      "Subject: {{subject_line}}\n\nDear {{recipient_name}},\n\nI hope this email finds you well. I'm reaching out because I noticed that {{company_name}} is {{pain_point}}.\n\nAt {{our_company}}, we specialize in {{solution}} that helps businesses like yours {{benefit}}.\n\n{{case_study}}\n\nI'd love to schedule a {{meeting_type}} to discuss how we can help {{company_name}} {{goal}}. Would you be available for a quick {{meeting_duration}} call next {{proposed_day}}?\n\nBest regards,\n{{sender_name}}\n{{sender_title}}\n{{our_company}}",
    variables: [
      {
        name: "subject_line",
        description: "Email subject line",
        type: "string",
        required: true,
      },
      {
        name: "recipient_name",
        description: "Name of the recipient",
        type: "string",
        required: true,
      },
      {
        name: "company_name",
        description: "Prospect's company name",
        type: "string",
        required: true,
      },
      {
        name: "pain_point",
        description: "Specific challenge or pain point",
        type: "string",
        required: true,
      },
      {
        name: "our_company",
        description: "Your company name",
        type: "string",
        required: true,
      },
      {
        name: "solution",
        description: "Your solution",
        type: "string",
        required: true,
      },
      {
        name: "benefit",
        description: "Key benefit",
        type: "string",
        required: true,
      },
      {
        name: "case_study",
        description: "Brief case study or social proof",
        type: "string",
        required: false,
      },
      {
        name: "meeting_type",
        description: "Type of meeting",
        type: "string",
        defaultValue: "call",
        required: true,
      },
      {
        name: "goal",
        description: "Goal or outcome",
        type: "string",
        required: true,
      },
      {
        name: "meeting_duration",
        description: "Meeting duration",
        type: "string",
        defaultValue: "15-minute",
        required: true,
      },
      {
        name: "proposed_day",
        description: "Proposed day",
        type: "string",
        defaultValue: "Tuesday",
        required: true,
      },
      {
        name: "sender_name",
        description: "Your name",
        type: "string",
        required: true,
      },
      {
        name: "sender_title",
        description: "Your title",
        type: "string",
        required: true,
      },
    ],
    category: "Sales",
    usageCount: 42,
  },
  {
    id: "5",
    name: "Technical Documentation",
    description: "Generate technical documentation for APIs or features",
    template:
      "# {{feature_name}} Documentation\n\n## Overview\n{{overview}}\n\n## Prerequisites\n{{prerequisites}}\n\n## Installation\n```\n{{installation_steps}}\n```\n\n## Usage\n```{{language}}\n{{usage_example}}\n```\n\n## Parameters\n{{parameters}}\n\n## Return Values\n{{return_values}}\n\n## Error Handling\n{{error_handling}}\n\n## Examples\n{{examples}}\n\n## Best Practices\n{{best_practices}}\n\n## Related Resources\n{{related_resources}}",
    variables: [
      {
        name: "feature_name",
        description: "Name of the feature or API",
        type: "string",
        required: true,
      },
      {
        name: "overview",
        description: "Brief overview of the feature",
        type: "string",
        required: true,
      },
      {
        name: "prerequisites",
        description: "Required dependencies or setup",
        type: "string",
        required: true,
      },
      {
        name: "installation_steps",
        description: "Steps to install or set up",
        type: "string",
        required: true,
      },
      {
        name: "language",
        description: "Programming language for examples",
        type: "string",
        defaultValue: "javascript",
        required: true,
      },
      {
        name: "usage_example",
        description: "Example code showing usage",
        type: "string",
        required: true,
      },
      {
        name: "parameters",
        description: "Description of parameters",
        type: "string",
        required: true,
      },
      {
        name: "return_values",
        description: "Description of return values",
        type: "string",
        required: true,
      },
      {
        name: "error_handling",
        description: "How to handle errors",
        type: "string",
        required: true,
      },
      {
        name: "examples",
        description: "Additional examples",
        type: "string",
        required: false,
      },
      {
        name: "best_practices",
        description: "Best practices for usage",
        type: "string",
        required: false,
      },
      {
        name: "related_resources",
        description: "Links to related documentation",
        type: "string",
        required: false,
      },
    ],
    category: "Technical",
    usageCount: 31,
  },
];

export const TemplateLibrary = ({ onSelectTemplate }: TemplateLibraryProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Templates");
  const [templates, setTemplates] = useState<PromptTemplate[]>(sampleTemplates);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);

  // Filter templates based on search query and category
  const filteredTemplates = templates.filter((template) => {
    const matchesSearch =
      template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === "All Templates" ||
      template.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  // Handle template selection
  const handleSelectTemplate = (template: PromptTemplate) => {
    setSelectedTemplate(template.id);
    onSelectTemplate(template);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search templates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
          />
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="flex gap-1">
            <Filter className="h-4 w-4" /> Filters
          </Button>
          <Button variant="outline" className="flex gap-1">
            <Tag className="h-4 w-4" /> Tags
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Categories sidebar */}
        <div className="md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Categories</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="space-y-1">
                {categories.map((category) => (
                  <Button
                    key={category}
                    variant={
                      selectedCategory === category ? "default" : "ghost"
                    }
                    className="w-full justify-start"
                    onClick={() => setSelectedCategory(category)}
                  >
                    {category}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Templates grid */}
        <div className="md:col-span-3">
          {filteredTemplates.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredTemplates.map((template) => (
                <Card
                  key={template.id}
                  className={`cursor-pointer transition-all ${selectedTemplate === template.id ? "border-primary ring-2 ring-primary/20" : "hover:border-primary/50"}`}
                  onClick={() => handleSelectTemplate(template)}
                >
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-base">
                        {template.name}
                      </CardTitle>
                      {selectedTemplate === template.id && (
                        <Check className="h-5 w-5 text-primary" />
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Badge variant="outline">{template.category}</Badge>
                      <Badge
                        variant="secondary"
                        className="flex items-center gap-1"
                      >
                        <BookOpen className="h-3 w-3" /> {template.usageCount}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {template.description}
                    </p>
                  </CardContent>
                  <CardFooter className="pt-0">
                    <div className="flex justify-between w-full">
                      <div className="flex gap-1">
                        {template.variables && (
                          <Badge variant="outline" className="text-xs">
                            {template.variables.length} variables
                          </Badge>
                        )}
                      </div>
                      <Button variant="ghost" size="sm" className="h-8 px-2">
                        <Copy className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 border rounded-md bg-muted/20">
              <p className="text-muted-foreground">
                No templates found matching your criteria
              </p>
              <Button
                variant="outline"
                className="mt-2"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("All Templates");
                }}
              >
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TemplateLibrary;
