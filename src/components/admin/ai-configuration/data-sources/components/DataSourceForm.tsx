
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { 
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { DataSource } from "@/services/ai-configuration/dataSourceService";

const dataSourceSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  description: z.string().optional(),
  type: z.enum([
    "database", 
    "storage", 
    "knowledge-base", 
    "website", 
    "file", 
    "context", 
    "rule"
  ]),
  isActive: z.boolean().default(true),
  priority: z.number().min(0).max(10),
  configuration: z.record(z.any()).default({}),
});

type DataSourceFormValues = z.infer<typeof dataSourceSchema>;

interface DataSourceFormProps {
  initialData?: DataSource;
  onSubmit: (values: DataSourceFormValues) => void;
  isSubmitting: boolean;
}

export function DataSourceForm({ initialData, onSubmit, isSubmitting }: DataSourceFormProps) {
  const [advancedConfig, setAdvancedConfig] = useState(false);

  const form = useForm<DataSourceFormValues>({
    resolver: zodResolver(dataSourceSchema),
    defaultValues: initialData ? {
      ...initialData,
    } : {
      name: "",
      description: "",
      type: "knowledge-base",
      isActive: true,
      priority: 5,
      configuration: {},
    },
  });

  const dataSourceType = form.watch("type");

  const handleSubmit = (values: DataSourceFormValues) => {
    onSubmit(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter data source name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Enter a brief description of this data source" 
                  {...field} 
                  value={field.value || ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Type</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select data source type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="database">Database</SelectItem>
                  <SelectItem value="storage">Storage / Project Files</SelectItem>
                  <SelectItem value="knowledge-base">Knowledge Base</SelectItem>
                  <SelectItem value="website">Website / URL</SelectItem>
                  <SelectItem value="file">Uploaded Files</SelectItem>
                  <SelectItem value="context">Contextual Input</SelectItem>
                  <SelectItem value="rule">Rule-based Data</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="isActive"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
              <div className="space-y-0.5">
                <FormLabel>Active</FormLabel>
                <div className="text-sm text-muted-foreground">
                  Enable this data source for AI responses
                </div>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="priority"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Priority (0-10)</FormLabel>
              <div className="flex items-center gap-4">
                <FormControl>
                  <Slider
                    min={0}
                    max={10}
                    step={1}
                    defaultValue={[field.value]}
                    onValueChange={(value) => field.onChange(value[0])}
                  />
                </FormControl>
                <span className="w-12 text-center font-medium">
                  {field.value}
                </span>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Additional configuration based on type */}
        {advancedConfig && dataSourceType === "database" && (
          <div className="space-y-4 border p-4 rounded-md">
            <h4 className="font-medium">Database Configuration</h4>
            {/* Database-specific fields would go here */}
          </div>
        )}

        {advancedConfig && dataSourceType === "website" && (
          <div className="space-y-4 border p-4 rounded-md">
            <h4 className="font-medium">Website Configuration</h4>
            {/* Website-specific fields would go here */}
          </div>
        )}

        <div className="flex justify-between items-center">
          <button
            type="button"
            className="text-sm text-muted-foreground underline"
            onClick={() => setAdvancedConfig(!advancedConfig)}
          >
            {advancedConfig ? "Hide advanced settings" : "Show advanced settings"}
          </button>
          
          {/* Submit button is expected in the parent dialog component */}
        </div>
      </form>
    </Form>
  );
}
