
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import * as responseFormatService from "@/services/ai-configuration/responseFormatService";
import { ResponseFormat } from "@/types/ai-configuration";

// Define request types
interface CreateResponseFormatRequest {
  name: string;
  description?: string;
  content: string;
  systemInstructions?: string;
  parameters?: Record<string, any>;
  isDefault?: boolean;
}

interface UpdateResponseFormatRequest {
  name?: string;
  description?: string;
  content?: string;
  systemInstructions?: string;
  parameters?: Record<string, any>;
  isDefault?: boolean;
}

export function useResponseFormats() {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [currentFormat, setCurrentFormat] = useState<ResponseFormat | null>(null);
  const queryClient = useQueryClient();

  // Fetch response formats
  const { 
    data: formats = [],
    isLoading,
    isError,
    refetch
  } = useQuery({
    queryKey: ['responseFormats'],
    queryFn: responseFormatService.getAllFormats,
  });

  // Fetch default format
  const { 
    data: defaultFormat,
  } = useQuery({
    queryKey: ['defaultResponseFormat'],
    queryFn: responseFormatService.getDefaultFormat,
  });

  // Create format mutation
  const createFormatMutation = useMutation({
    mutationFn: (data: CreateResponseFormatRequest) => 
      responseFormatService.createFormat(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['responseFormats'] });
      setShowAddDialog(false);
      toast.success("Response format created successfully");
    },
    onError: (error: any) => {
      toast.error(`Failed to create format: ${error.message || "Unknown error"}`);
    }
  });

  // Update format mutation
  const updateFormatMutation = useMutation({
    mutationFn: ({ id, data }: { id: string, data: UpdateResponseFormatRequest }) => 
      responseFormatService.updateFormat(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['responseFormats'] });
      setShowEditDialog(false);
      toast.success("Response format updated successfully");
    },
    onError: (error: any) => {
      toast.error(`Failed to update format: ${error.message || "Unknown error"}`);
    }
  });

  // Delete format mutation
  const deleteFormatMutation = useMutation({
    mutationFn: responseFormatService.deleteFormat,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['responseFormats'] });
      toast.success("Response format deleted successfully");
    },
    onError: (error: any) => {
      toast.error(`Failed to delete format: ${error.message || "Unknown error"}`);
    }
  });

  // Set default format mutation
  const setDefaultFormatMutation = useMutation({
    mutationFn: responseFormatService.setDefaultFormat,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['responseFormats', 'defaultResponseFormat'] });
      toast.success("Default response format set successfully");
    },
    onError: (error: any) => {
      toast.error(`Failed to set default format: ${error.message || "Unknown error"}`);
    }
  });

  // Test format mutation
  const testFormatMutation = useMutation({
    mutationFn: ({ formatId, prompt }: { formatId: string, prompt: string }) => 
      responseFormatService.testFormat(formatId, prompt),
    onSuccess: () => {
      toast.success("Test completed successfully");
    },
    onError: (error: any) => {
      toast.error(`Test failed: ${error.message || "Unknown error"}`);
    }
  });

  // Handlers
  const handleAddFormat = () => {
    setShowAddDialog(true);
  };

  const handleEditFormat = (format: ResponseFormat) => {
    setCurrentFormat(format);
    setShowEditDialog(true);
  };

  const handleDeleteFormat = (id: string) => {
    if (window.confirm("Are you sure you want to delete this format?")) {
      deleteFormatMutation.mutate(id);
    }
  };

  const handleSetDefaultFormat = (id: string) => {
    setDefaultFormatMutation.mutate(id);
  };

  const handleTestFormat = (formatId: string, prompt: string) => {
    return testFormatMutation.mutateAsync({ formatId, prompt });
  };

  return {
    formats,
    defaultFormat,
    isLoading,
    isError,
    currentFormat,
    showAddDialog,
    setShowAddDialog,
    showEditDialog,
    setShowEditDialog,
    refetch,
    handleAddFormat,
    handleEditFormat,
    handleDeleteFormat,
    handleSetDefaultFormat,
    handleTestFormat,
    createFormatMutation,
    updateFormatMutation,
    deleteFormatMutation,
    setDefaultFormatMutation,
    testFormatMutation
  };
}
