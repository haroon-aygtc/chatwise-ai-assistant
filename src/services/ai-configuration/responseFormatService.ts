import apiService from "../api/api";
import { ResponseFormat } from "@/types/ai-configuration";

/**
 * Get all response formats
 */
export async function getAllFormats(): Promise<ResponseFormat[]> {
  try {
    const response = await apiService.get<{ data: ResponseFormat[] }>("/ai/response-formats");
    return response.data;
  } catch (error) {
    console.error("Error fetching response formats:", error);
    throw error;
  }
}

/**
 * Get response format by ID
 */
export async function getFormatById(id: string): Promise<ResponseFormat> {
  try {
    const response = await apiService.get<{ data: ResponseFormat }>(`/ai/response-formats/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching response format ${id}:`, error);
    throw error;
  }
}

/**
 * Create a new response format
 */
export async function createFormat(format: Omit<ResponseFormat, "id">): Promise<ResponseFormat> {
  try {
    const response = await apiService.post<{ data: ResponseFormat }>("/ai/response-formats", format);
    return response.data;
  } catch (error) {
    console.error("Error creating response format:", error);
    throw error;
  }
}

/**
 * Update an existing response format
 */
export async function updateFormat(id: string, format: Partial<ResponseFormat>): Promise<ResponseFormat> {
  try {
    const response = await apiService.put<{ data: ResponseFormat }>(`/ai/response-formats/${id}`, format);
    return response.data;
  } catch (error) {
    console.error(`Error updating response format ${id}:`, error);
    throw error;
  }
}

/**
 * Delete a response format
 */
export async function deleteFormat(id: string): Promise<void> {
  try {
    await apiService.delete(`/ai/response-formats/${id}`);
  } catch (error) {
    console.error(`Error deleting response format ${id}:`, error);
    throw error;
  }
}

/**
 * Set a response format as default
 */
export async function setDefaultFormat(id: string): Promise<ResponseFormat> {
  try {
    const response = await apiService.post<{ data: ResponseFormat }>(`/ai/response-formats/${id}/default`, {});
    return response.data;
  } catch (error) {
    console.error(`Error setting response format ${id} as default:`, error);
    throw error;
  }
}

/**
 * Get default response format
 */
export async function getDefaultFormat(): Promise<ResponseFormat> {
  try {
    const response = await apiService.get<{ data: ResponseFormat }>("/ai/response-formats/default");
    return response.data;
  } catch (error) {
    console.error("Error fetching default format:", error);
    throw error;
  }
}

/**
 * Create a branching format connection
 */
export async function createBranchConnection(
  sourceFormatId: string,
  targetFormatId: string,
  options?: {
    condition?: string;
    priority?: number;
  }
): Promise<{ id: string }> {
  try {
    const response = await apiService.post<{ data: { id: string } }>("/ai/response-formats/branches", {
      sourceFormatId,
      targetFormatId,
      ...options
    });
    return response.data;
  } catch (error) {
    console.error("Error creating branch connection:", error);
    throw error;
  }
}

/**
 * Get all branching connections
 */
export async function getBranchConnections(formatId?: string): Promise<any[]> {
  try {
    const url = formatId
      ? `/ai/response-formats/${formatId}/branches`
      : "/ai/response-formats/branches";

    const response = await apiService.get<{ data: any[] }>(url);
    return response.data;
  } catch (error) {
    console.error("Error fetching branch connections:", error);
    throw error;
  }
}

/**
 * Delete a branching connection
 */
export async function deleteBranchConnection(id: string): Promise<void> {
  try {
    await apiService.delete(`/ai/response-formats/branches/${id}`);
  } catch (error) {
    console.error(`Error deleting branch connection ${id}:`, error);
    throw error;
  }
}
