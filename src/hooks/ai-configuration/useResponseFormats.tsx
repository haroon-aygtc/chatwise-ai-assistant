
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ResponseFormat, CreateResponseFormatRequest } from "@/types/ai-configuration";
import * as ResponseFormatService from "@/services/ai-configuration/responseFormatService";
import { useToast } from "@/components/ui/use-toast";

export function useResponseFormats() {
  const [selectedFormat, setSelectedFormat] = useState<ResponseFormat | null>(null);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Fetch all formats
  const { 
    data: formats = [], 
    isLoading: isLoadingFormats,
    error: formatsError,
    refetch: refetchFormats
  } = useQuery({
    queryKey: ["responseFormats"],
    queryFn: ResponseFormatService.getAllFormats,
  });

  // Fetch default format
  const { 
    data: defaultFormat, 
    isLoading: isLoadingDefaultFormat,
  } = useQuery({
    queryKey: ["defaultResponseFormat"],
    queryFn: ResponseFormatService.getDefaultFormat,
  });

  // Create format mutation
  const createFormatMutation = useMutation({
    mutationFn: (formatData: CreateResponseFormatRequest) => ResponseFormatService.createFormat(formatData),
    onSuccess: () => {
      toast({
        title: "Format created",
        description: "The response format has been created successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["responseFormats"] });
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to create format: ${error.message}`,
      });
    },
  });

  // Update format mutation
  const updateFormatMutation = useMutation({
    mutationFn: ({ id, format }: { id: string; format: Partial<ResponseFormat> }) => 
      ResponseFormatService.updateFormat(id, format),
    onSuccess: () => {
      toast({
        title: "Format updated",
        description: "The response format has been updated successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["responseFormats"] });
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to update format: ${error.message}`,
      });
    },
  });

  // Delete format mutation
  const deleteFormatMutation = useMutation({
    mutationFn: ResponseFormatService.deleteFormat,
    onSuccess: () => {
      toast({
        title: "Format deleted",
        description: "The response format has been deleted successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["responseFormats"] });
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to delete format: ${error.message}`,
      });
    },
  });

  // Set default format mutation
  const setDefaultFormatMutation = useMutation({
    mutationFn: ResponseFormatService.setDefaultFormat,
    onSuccess: () => {
      toast({
        title: "Default format updated",
        description: "The default response format has been updated successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["responseFormats", "defaultResponseFormat"] });
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to set default format: ${error.message}`,
      });
    },
  });

  // Test format mutation
  const testFormatMutation = useMutation({
    mutationFn: ({ formatId, prompt }: { formatId: string; prompt: string }) => 
      ResponseFormatService.testFormat(formatId, prompt),
  });

  // Helper functions
  const createFormat = async (format: CreateResponseFormatRequest) => {
    try {
      await createFormatMutation.mutateAsync(format);
      return true;
    } catch (error) {
      return false;
    }
  };

  const updateFormat = async (id: string, format: Partial<ResponseFormat>) => {
    try {
      await updateFormatMutation.mutateAsync({ id, format });
      return true;
    } catch (error) {
      return false;
    }
  };

  const deleteFormat = async (id: string) => {
    try {
      await deleteFormatMutation.mutateAsync(id);
      return true;
    } catch (error) {
      return false;
    }
  };

  const setDefaultFormat = async (id: string) => {
    try {
      await setDefaultFormatMutation.mutateAsync(id);
      return true;
    } catch (error) {
      return false;
    }
  };

  const testFormat = async (formatId: string, prompt: string) => {
    try {
      return await testFormatMutation.mutateAsync({ formatId, prompt });
    } catch (error) {
      if (error instanceof Error) {
        toast({
          variant: "destructive",
          title: "Test failed",
          description: error.message,
        });
      }
      return null;
    }
  };

  return {
    formats,
    defaultFormat,
    selectedFormat,
    setSelectedFormat,
    isLoadingFormats,
    isLoadingDefaultFormat,
    isSaving: createFormatMutation.isPending || updateFormatMutation.isPending,
    isDeleting: deleteFormatMutation.isPending,
    isSettingDefault: setDefaultFormatMutation.isPending,
    isTesting: testFormatMutation.isPending,
    formatsError,
    createFormat,
    updateFormat,
    deleteFormat,
    setDefaultFormat,
    testFormat,
    refetchFormats,
  };
}
