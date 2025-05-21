import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import {
  DataSourceSettings,
  getDataSourceSettings,
  updateDataSourceSettings,
} from "@/services/ai-configuration/dataSourceService";

export function useDataSourceSettings() {
  const [settings, setSettings] = useState<DataSourceSettings>({
    enabled: true,
    priority: "medium",
    includeCitation: true,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchSettings = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getDataSourceSettings();
      setSettings(data);
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error("Failed to fetch settings"),
      );
      toast.error("Failed to load data source settings");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const handleSaveSettings = async (updatedSettings: DataSourceSettings) => {
    setIsSaving(true);
    try {
      const data = await updateDataSourceSettings(updatedSettings);
      setSettings(data);
      toast.success("Settings updated successfully");
      return true;
    } catch (err) {
      toast.error("Failed to update settings");
      console.error(err);
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  return {
    settings,
    isLoading,
    isSaving,
    error,
    handleSaveSettings,
    refreshSettings: fetchSettings,
  };
}
