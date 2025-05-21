import apiService from "../api/api";

export interface DataSourceSettings {
  enabled: boolean;
  priority: "low" | "medium" | "high" | "exclusive";
  includeCitation: boolean;
}

export interface DataSource {
  id: string;
  name: string;
  type:
    | "database"
    | "storage"
    | "knowledge-base"
    | "website"
    | "file"
    | "context"
    | "rule";
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
    const response = await apiService.get("/knowledge-base/data-sources");
    return response.data || [];
  } catch (error) {
    console.error("Error fetching data sources:", error);
    return [];
  }
};

/**
 * Get a specific data source by ID
 */
export const getDataSourceById = async (
  id: string,
): Promise<DataSource | null> => {
  try {
    const response = await apiService.get(`/knowledge-base/data-sources/${id}`);
    return response.data || null;
  } catch (error) {
    console.error(`Error fetching data source ${id}:`, error);
    return null;
  }
};

/**
 * Create a new data source
 */
export const createDataSource = async (
  dataSource: Omit<DataSource, "id">,
): Promise<DataSource> => {
  const response = await apiService.post(
    "/knowledge-base/data-sources",
    dataSource,
  );
  return response.data;
};

/**
 * Update an existing data source
 */
export const updateDataSource = async (
  id: string,
  dataSource: Partial<DataSource>,
): Promise<DataSource> => {
  const response = await apiService.put(
    `/knowledge-base/data-sources/${id}`,
    dataSource,
  );
  return response.data;
};

/**
 * Delete a data source
 */
export const deleteDataSource = async (id: string): Promise<void> => {
  await apiService.delete(`/knowledge-base/data-sources/${id}`);
};

/**
 * Get data source settings
 */
export const getDataSourceSettings = async (): Promise<DataSourceSettings> => {
  try {
    const response = await apiService.get(
      "/knowledge-base/data-sources/settings",
    );
    return (
      response.data || {
        enabled: true,
        priority: "medium",
        includeCitation: true,
      }
    );
  } catch (error) {
    console.error("Error fetching data source settings:", error);
    return {
      enabled: true,
      priority: "medium",
      includeCitation: true,
    };
  }
};

/**
 * Update data source settings
 */
export const updateDataSourceSettings = async (
  settings: DataSourceSettings,
): Promise<DataSourceSettings> => {
  const response = await apiService.put(
    "/knowledge-base/data-sources/settings",
    { ...settings },
  );
  return response.data;
};

/**
 * Test data source functionality
 */
export const testDataSource = async (
  id: string,
  query: string,
): Promise<{
  result: string;
  sources: Array<{ title: string; url?: string }>;
}> => {
  const response = await apiService.post(
    `/knowledge-base/data-sources/${id}/test`,
    { query },
  );
  return response.data;
};
