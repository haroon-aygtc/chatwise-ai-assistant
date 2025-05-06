
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import ResponseFormatService, { CreateResponseFormatRequest, UpdateResponseFormatRequest } from "@/services/ai-configuration/responseFormatService";
import { ResponseFormat } from "@/types/ai-configuration";

export function useResponseFormats() {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [currentFormat, setCurrentFormat] = useState<ResponseFormat | null>(null);
  const queryClient = useQueryClient();

  // Fetch formats
  const { 
    data: formatsData = { data: [], total: 0 },
    isLoading,
    isError,
    refetch
  } = useQuery({
    queryKey: ['responseFormats'],
    queryFn: () => ResponseFormatService.getFormats(),
  });

  // Fetch default format
  const { 
    data: defaultFormat,
  } = useQuery({
    queryKey: ['defaultResponseFormat'],
    queryFn: ResponseFormatService.getDefaultFormat,
  });

  // Create format mutation
  const createFormatMutation = useMutation({
    mutationFn: ResponseFormatService.createFormat,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['responseFormats'] });
      setShowAddDialog(false);
      toast.success("Format created successfully");
    },
    onError: (error: any) => {
      toast.error(`Failed to create format: ${error.message || "Unknown error"}`);
    }
  });

  // Update format mutation
  const updateFormatMutation = useMutation({
    mutationFn: ({ id, data }: { id: string, data: UpdateResponseFormatRequest }) => 
      ResponseFormatService.updateFormat(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['responseFormats'] });
      setShowEditDialog(false);
      toast.success("Format updated successfully");
    },
    onError: (error: any) => {
      toast.error(`Failed to update format: ${error.message || "Unknown error"}`);
    }
  });

  // Delete format mutation
  const deleteFormatMutation = useMutation({
    mutationFn: ResponseFormatService.deleteFormat,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['responseFormats'] });
      toast.success("Format deleted successfully");
    },
    onError: (error: any) => {
      toast.error(`Failed to delete format: ${error.message || "Unknown error"}`);
    }
  });

  // Set default format mutation
  const setDefaultFormatMutation = useMutation({
    mutationFn: ResponseFormatService.setDefaultFormat,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['responseFormats'] });
      queryClient.invalidateQueries({ queryKey: ['defaultResponseFormat'] });
      toast.success("Default format updated successfully");
    },
    onError: (error: any) => {
      toast.error(`Failed to set default format: ${error.message || "Unknown error"}`);
    }
  });

  // Handlers
  const handleRefresh = () => {
    refetch();
  };

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

  const handleSaveNewFormat = (formatData: CreateResponseFormatRequest) => {
    createFormatMutation.mutate(formatData);
  };

  const handleSaveEditedFormat = (formatData: UpdateResponseFormatRequest) => {
    if (!currentFormat) return;
    updateFormatMutation.mutate({ id: currentFormat.id, data: formatData });
  };

  const handleSetDefaultFormat = (id: string) => {
    setDefaultFormatMutation.mutate(id);
  };

  return {
    formats: formatsData.data,
    totalFormats: formatsData.total,
    defaultFormat,
    showAddDialog,
    setShowAddDialog,
    showEditDialog,
    setShowEditDialog,
    currentFormat,
    isLoading,
    isError,
    handleRefresh,
    handleAddFormat,
    handleEditFormat,
    handleDeleteFormat,
    handleSaveNewFormat,
    handleSaveEditedFormat,
    handleSetDefaultFormat,
    createFormatMutation,
    updateFormatMutation,
    deleteFormatMutation,
    setDefaultFormatMutation
  };
}
