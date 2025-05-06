
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import * as dataSourceService from '@/services/ai-configuration/dataSourceService';
import { DataSourceSettings } from '@/services/ai-configuration/dataSourceService';

export function useDataSourceSettings() {
  const [settings, setSettings] = useState<DataSourceSettings>({
    enabled: true,
    priority: 'medium',
    includeCitation: true,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const fetchSettings = async () => {
    setIsLoading(true);
    try {
      const data = await dataSourceService.getDataSourceSettings();
      setSettings(data);
    } catch (error) {
      console.error('Error fetching data source settings:', error);
      toast.error('Failed to load data source settings');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleSaveSettings = async (newSettings: DataSourceSettings) => {
    setIsSaving(true);
    try {
      const updatedSettings = await dataSourceService.updateDataSourceSettings(newSettings);
      setSettings(updatedSettings);
      toast.success('Settings saved successfully');
      return true;
    } catch (error) {
      console.error('Error saving data source settings:', error);
      toast.error('Failed to save settings');
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  return {
    settings,
    isLoading,
    isSaving,
    handleSaveSettings,
    refreshSettings: fetchSettings,
  };
}
