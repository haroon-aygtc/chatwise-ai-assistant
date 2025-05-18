
import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import * as widgetService from '@/services/widget/widgetService';
import { ChatWidget, WidgetSettings } from '@/types/chat';

export const useWidgets = (widgetId?: string) => {
  const [widgets, setWidgets] = useState<ChatWidget[]>([]);
  const [currentWidget, setCurrentWidget] = useState<ChatWidget | null>(null);
  const [widgetSettings, setWidgetSettings] = useState<WidgetSettings[]>([]);
  const [customizationOptions, setCustomizationOptions] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [previewCode, setPreviewCode] = useState('');
  const { toast } = useToast();

  // Fetch all widgets
  const fetchWidgets = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await widgetService.getAllWidgets();
      setWidgets(data);
      return data;
    } catch (error) {
      console.error('Error fetching widgets:', error);
      toast({
        title: 'Error',
        description: 'Failed to load widgets',
        variant: 'destructive',
      });
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  // Fetch widget by ID
  const fetchWidget = useCallback(async (id: string) => {
    try {
      setIsLoading(true);
      const data = await widgetService.getWidgetById(id);
      setCurrentWidget(data);
      return data;
    } catch (error) {
      console.error('Error fetching widget:', error);
      toast({
        title: 'Error',
        description: 'Failed to load widget',
        variant: 'destructive',
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  // Create a new widget
  const createWidget = useCallback(async (data: Omit<ChatWidget, 'id'>) => {
    try {
      setIsSaving(true);
      const newWidget = await widgetService.createWidget(data);
      setCurrentWidget(newWidget);
      setWidgets(prev => [newWidget, ...prev]);
      
      toast({
        title: 'Success',
        description: 'Widget created successfully',
      });
      
      return newWidget;
    } catch (error) {
      console.error('Error creating widget:', error);
      toast({
        title: 'Error',
        description: 'Failed to create widget',
        variant: 'destructive',
      });
      return null;
    } finally {
      setIsSaving(false);
    }
  }, [toast]);

  // Update widget
  const updateWidget = useCallback(async (id: string, data: Partial<ChatWidget>) => {
    try {
      setIsSaving(true);
      const updatedWidget = await widgetService.updateWidget(id, data);
      setCurrentWidget(updatedWidget);
      
      // Update in the widgets list
      setWidgets(prev => prev.map(widget => 
        widget.id === id ? updatedWidget : widget
      ));
      
      toast({
        title: 'Success',
        description: 'Widget updated successfully',
      });
      
      return updatedWidget;
    } catch (error) {
      console.error('Error updating widget:', error);
      toast({
        title: 'Error',
        description: 'Failed to update widget',
        variant: 'destructive',
      });
      return null;
    } finally {
      setIsSaving(false);
    }
  }, [toast]);

  // Delete widget
  const deleteWidget = useCallback(async (id: string) => {
    try {
      setIsSaving(true);
      await widgetService.deleteWidget(id);
      
      // Remove from widgets list
      setWidgets(prev => prev.filter(widget => widget.id !== id));
      
      // Reset current widget if it's the one being deleted
      if (currentWidget && currentWidget.id === id) {
        setCurrentWidget(null);
      }
      
      toast({
        title: 'Success',
        description: 'Widget deleted successfully',
      });
      
      return true;
    } catch (error) {
      console.error('Error deleting widget:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete widget',
        variant: 'destructive',
      });
      return false;
    } finally {
      setIsSaving(false);
    }
  }, [currentWidget, toast]);

  // Fetch widget settings
  const fetchWidgetSettings = useCallback(async (widgetId: string) => {
    try {
      setIsLoading(true);
      const data = await widgetService.getWidgetSettings(widgetId);
      setWidgetSettings(data);
      return data;
    } catch (error) {
      console.error('Error fetching widget settings:', error);
      toast({
        title: 'Error',
        description: 'Failed to load widget settings',
        variant: 'destructive',
      });
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  // Create widget settings
  const createWidgetSettings = useCallback(async (widgetId: string, data: Omit<WidgetSettings, 'id' | 'widgetId' | 'createdAt' | 'updatedAt'>) => {
    try {
      setIsSaving(true);
      const newSettings = await widgetService.createWidgetSettings(widgetId, data);
      setWidgetSettings(prev => [newSettings, ...prev]);
      
      toast({
        title: 'Success',
        description: 'Widget settings created successfully',
      });
      
      return newSettings;
    } catch (error) {
      console.error('Error creating widget settings:', error);
      toast({
        title: 'Error',
        description: 'Failed to create widget settings',
        variant: 'destructive',
      });
      return null;
    } finally {
      setIsSaving(false);
    }
  }, [toast]);

  // Get widget preview code
  const getWidgetCode = useCallback(async (widgetId: string, format: 'js' | 'react' | 'iframe' = 'js') => {
    try {
      setIsLoading(true);
      const data = await widgetService.getWidgetPreviewCode(widgetId, format);
      setPreviewCode(data.code);
      return data.code;
    } catch (error) {
      console.error('Error getting widget code:', error);
      toast({
        title: 'Error',
        description: 'Failed to generate widget code',
        variant: 'destructive',
      });
      return '';
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  // Get widget analytics
  const getWidgetAnalytics = useCallback(async (widgetId: string) => {
    try {
      setIsLoading(true);
      const analytics = await widgetService.getWidgetAnalytics(widgetId);
      return analytics;
    } catch (error) {
      console.error('Error getting widget analytics:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch widget analytics',
        variant: 'destructive',
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  // Get customization options
  const fetchCustomizationOptions = useCallback(async () => {
    try {
      setIsLoading(true);
      const options = await widgetService.getCustomizationOptions();
      setCustomizationOptions(options);
      return options;
    } catch (error) {
      console.error('Error fetching customization options:', error);
      toast({
        title: 'Error',
        description: 'Failed to load widget customization options',
        variant: 'destructive',
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [toast]);
  
  // Test widget configuration
  const testWidgetConfig = useCallback(async (config: Partial<ChatWidget>) => {
    try {
      setIsLoading(true);
      const result = await widgetService.testWidgetConfig(config);
      
      if (result.status === 'success') {
        toast({
          title: 'Success',
          description: result.message || 'Widget configuration is valid',
        });
      } else {
        toast({
          title: 'Warning',
          description: result.message || 'Widget configuration has issues',
          variant: 'destructive',
        });
      }
      
      return result;
    } catch (error) {
      console.error('Error testing widget config:', error);
      toast({
        title: 'Error',
        description: 'Failed to test widget configuration',
        variant: 'destructive',
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  // Initialize with widgetId if provided
  useEffect(() => {
    if (widgetId) {
      fetchWidget(widgetId);
      fetchWidgetSettings(widgetId);
    } else {
      fetchWidgets();
    }
    
    // Load customization options on init
    fetchCustomizationOptions();
  }, [widgetId, fetchWidget, fetchWidgetSettings, fetchWidgets, fetchCustomizationOptions]);

  return {
    widgets,
    currentWidget,
    widgetSettings,
    customizationOptions,
    isLoading,
    isSaving,
    previewCode,
    fetchWidgets,
    fetchWidget,
    createWidget,
    updateWidget,
    deleteWidget,
    fetchWidgetSettings,
    createWidgetSettings,
    getWidgetCode,
    getWidgetAnalytics,
    fetchCustomizationOptions,
    testWidgetConfig,
    setCurrentWidget,
  };
};
