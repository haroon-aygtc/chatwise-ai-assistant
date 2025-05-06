
import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { DataSource } from '@/services/ai-configuration/dataSourceService';
import * as dataSourceService from '@/services/ai-configuration/dataSourceService';

export function useDataSources() {
  const [dataSources, setDataSources] = useState<DataSource[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [currentDataSource, setCurrentDataSource] = useState<DataSource | null>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  
  const fetchDataSources = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await dataSourceService.getAllDataSources();
      setDataSources(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch data sources'));
      toast.error('Failed to load data sources');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDataSources();
  }, [fetchDataSources]);

  const handleAddDataSource = () => {
    setShowAddDialog(true);
  };

  const handleEditDataSource = (dataSource: DataSource) => {
    setCurrentDataSource(dataSource);
    setShowEditDialog(true);
  };

  const handleDeleteDataSource = async (id: string) => {
    try {
      await dataSourceService.deleteDataSource(id);
      setDataSources(dataSources.filter(ds => ds.id !== id));
      toast.success('Data source deleted successfully');
    } catch (err) {
      toast.error('Failed to delete data source');
      console.error(err);
    }
  };

  const handleSaveNewDataSource = async (newDataSource: Omit<DataSource, 'id'>) => {
    setIsSaving(true);
    try {
      const created = await dataSourceService.createDataSource(newDataSource);
      setDataSources([...dataSources, created]);
      setShowAddDialog(false);
      toast.success('Data source created successfully');
      return true;
    } catch (err) {
      toast.error('Failed to create data source');
      console.error(err);
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveEditedDataSource = async (editedDataSource: DataSource) => {
    if (!currentDataSource) return false;
    
    setIsSaving(true);
    try {
      const updated = await dataSourceService.updateDataSource(currentDataSource.id, editedDataSource);
      setDataSources(dataSources.map(ds => ds.id === updated.id ? updated : ds));
      setShowEditDialog(false);
      setCurrentDataSource(null);
      toast.success('Data source updated successfully');
      return true;
    } catch (err) {
      toast.error('Failed to update data source');
      console.error(err);
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  const handleTestDataSource = async (id: string, query: string) => {
    try {
      return await dataSourceService.testDataSource(id, query);
    } catch (err) {
      toast.error('Failed to test data source');
      console.error(err);
      throw err;
    }
  };

  return {
    dataSources,
    isLoading,
    isSaving,
    error,
    currentDataSource,
    showAddDialog,
    showEditDialog,
    searchQuery,
    selectedType,
    setSearchQuery,
    setSelectedType,
    setShowAddDialog,
    setShowEditDialog,
    handleAddDataSource,
    handleEditDataSource,
    handleDeleteDataSource,
    handleSaveNewDataSource,
    handleSaveEditedDataSource,
    handleTestDataSource,
    refreshDataSources: fetchDataSources,
  };
}
