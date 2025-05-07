
import ApiService from "../api/api";

export interface DataSourceSettings {
  enabled: boolean;
  priority: 'low' | 'medium' | 'high' | 'exclusive';
  includeCitation: boolean;
}

export interface DataSource {
  id: string;
  name: string;
  type: 'database' | 'storage' | 'knowledge-base' | 'website' | 'file' | 'context' | 'rule';
  description?: string;
  configuration: Record<string, unknown>;
  isActive: boolean;
  priority: number;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Get all data sources
 */
export const getAllDataSources = async (): Promise<DataSource[]> => {
  try {
    return await ApiService.get('/data-sources');
  } catch (error) {
    console.error('Error fetching data sources:', error);
    return [];
  }
};

/**
 * Get a specific data source by ID
 */
export const getDataSourceById = async (id: string): Promise<DataSource | null> => {
  try {
    return await ApiService.get(`/data-sources/${id}`);
  } catch (error) {
    console.error(`Error fetching data source ${id}:`, error);
    return null;
  }
};

/**
 * Create a new data source
 */
export const createDataSource = async (dataSource: Omit<DataSource, 'id'>): Promise<DataSource> => {
  return await ApiService.post('/data-sources', dataSource);
};

/**
 * Update an existing data source
 */
export const updateDataSource = async (id: string, dataSource: Partial<DataSource>): Promise<DataSource> => {
  return await ApiService.put(`/data-sources/${id}`, dataSource);
};

/**
 * Delete a data source
 */
export const deleteDataSource = async (id: string): Promise<void> => {
  await ApiService.delete(`/data-sources/${id}`);
};

/**
 * Get data source settings
 */
export const getDataSourceSettings = async (): Promise<DataSourceSettings> => {
  try {
    return await ApiService.get('/data-sources/settings');
  } catch (error) {
    console.error('Error fetching data source settings:', error);
    return {
      enabled: true,
      priority: 'medium',
      includeCitation: true,
    };
  }
};

/**
 * Update data source settings
 */
export const updateDataSourceSettings = async (settings: DataSourceSettings): Promise<DataSourceSettings> => {
  return await ApiService.put('/data-sources/settings', settings);
};

/**
 * Test data source functionality
 */
export const testDataSource = async (id: string, query: string): Promise<{
  result: string;
  sources: Array<{ title: string; url?: string; }>
}> => {
  return await ApiService.post(`/data-sources/${id}/test`, { query });
};
