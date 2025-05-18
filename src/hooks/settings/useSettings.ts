
import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import * as settingsService from '@/services/settings/settingsService';

export const useSettings = () => {
  const [userSettings, setUserSettings] = useState<settingsService.UserSettings | null>(null);
  const [appSettings, setAppSettings] = useState<settingsService.AppSettings | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  // Fetch user settings
  const fetchUserSettings = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await settingsService.getUserSettings();
      setUserSettings(data);
      return data;
    } catch (error) {
      console.error('Error fetching user settings:', error);
      toast({
        title: 'Error',
        description: 'Failed to load user settings',
        variant: 'destructive',
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  // Update user settings
  const updateUserSettings = useCallback(async (data: Partial<settingsService.UserSettings>) => {
    try {
      setIsSaving(true);
      const updatedSettings = await settingsService.updateUserSettings(data);
      setUserSettings(updatedSettings);
      
      toast({
        title: 'Success',
        description: 'Settings updated successfully',
      });
      
      return updatedSettings;
    } catch (error) {
      console.error('Error updating user settings:', error);
      toast({
        title: 'Error',
        description: 'Failed to update settings',
        variant: 'destructive',
      });
      return null;
    } finally {
      setIsSaving(false);
    }
  }, [toast]);

  // Reset user settings
  const resetUserSettings = useCallback(async () => {
    try {
      setIsSaving(true);
      const defaultSettings = await settingsService.resetUserSettings();
      setUserSettings(defaultSettings);
      
      toast({
        title: 'Success',
        description: 'Settings reset to defaults',
      });
      
      return defaultSettings;
    } catch (error) {
      console.error('Error resetting user settings:', error);
      toast({
        title: 'Error',
        description: 'Failed to reset settings',
        variant: 'destructive',
      });
      return null;
    } finally {
      setIsSaving(false);
    }
  }, [toast]);

  // Fetch app settings (admin only)
  const fetchAppSettings = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await settingsService.getAppSettings();
      setAppSettings(data);
      return data;
    } catch (error) {
      console.error('Error fetching app settings:', error);
      toast({
        title: 'Error',
        description: 'Failed to load app settings',
        variant: 'destructive',
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  // Update app settings (admin only)
  const updateAppSettings = useCallback(async (data: Partial<settingsService.AppSettings>) => {
    try {
      setIsSaving(true);
      const updatedSettings = await settingsService.updateAppSettings(data);
      setAppSettings(updatedSettings);
      
      toast({
        title: 'Success',
        description: 'App settings updated successfully',
      });
      
      return updatedSettings;
    } catch (error) {
      console.error('Error updating app settings:', error);
      toast({
        title: 'Error',
        description: 'Failed to update app settings',
        variant: 'destructive',
      });
      return null;
    } finally {
      setIsSaving(false);
    }
  }, [toast]);

  // Initialize settings
  useEffect(() => {
    fetchUserSettings();
    // Only fetch app settings if user has admin rights
    // This check could be handled in the fetchAppSettings function
    fetchAppSettings();
  }, [fetchUserSettings, fetchAppSettings]);

  return {
    userSettings,
    appSettings,
    isLoading,
    isSaving,
    fetchUserSettings,
    updateUserSettings,
    resetUserSettings,
    fetchAppSettings,
    updateAppSettings,
  };
};
