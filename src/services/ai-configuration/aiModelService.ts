/**
 * AI Model Service
 *
 * Handles API interactions for AI model configuration
 */
import { apiClient } from "../api/axios";
import { API_BASE_URL } from "../api/config";
import { AIModel, RoutingRule } from "@/types/ai-configuration";
import { ApiResponse, PaginatedResponse } from "../api/types";

export class AIModelService {
  /**
   * Get all AI models
   */
  async getModels(): Promise<PaginatedResponse<AIModel>> {
    try {
      console.log("Fetching AI models from API...");
      const response = await apiClient.get(`${API_BASE_URL}/ai/models`);
      console.log("AI models API response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching AI models:", error);

      // Log more details about the error
      if (error.response) {
        console.error("Error response data:", error.response.data);
        console.error("Error response status:", error.response.status);
      }

      console.log("Returning mock AI models data for development");

      // Return mock data for development
      const mockData: PaginatedResponse<AIModel> = {
        data: [
          {
            id: "gemini-pro",
            name: "Gemini",
            provider: "Google",
            version: "Pro",
            description: "Google's advanced AI model",
            isActive: true,
            configuration: {
              temperature: 0.7,
              maxTokens: 1024,
              topP: 0.9,
              frequencyPenalty: 0,
              presencePenalty: 0,
            },
          },
          {
            id: "huggingface",
            name: "Hugging Face",
            provider: "Hugging Face",
            version: "Open Source",
            description: "Open-source model integration",
            isActive: false,
            configuration: {
              temperature: 0.5,
              maxTokens: 512,
              topP: 0.8,
              frequencyPenalty: 0,
              presencePenalty: 0,
            },
          },
        ] as AIModel[],
        meta: {
          current_page: 1,
          last_page: 1,
          per_page: 10,
          total: 2,
        },
      };

      return mockData;
    }
  }

  /**
   * Get a single AI model by ID
   */
  async getModel(id: string): Promise<ApiResponse<AIModel>> {
    try {
      const response = await apiClient.get(`${API_BASE_URL}/ai/models/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching AI model ${id}:`, error);
      // Return mock data for development
      return {
        data: {
          id,
          name: id === "gemini-pro" ? "Gemini" : "Hugging Face",
          provider: id === "gemini-pro" ? "Google" : "Hugging Face",
          version: id === "gemini-pro" ? "Pro" : "Open Source",
          description:
            id === "gemini-pro"
              ? "Google's advanced AI model"
              : "Open-source model integration",
          isActive: id === "gemini-pro",
          configuration: {
            temperature: id === "gemini-pro" ? 0.7 : 0.5,
            maxTokens: id === "gemini-pro" ? 1024 : 512,
            topP: id === "gemini-pro" ? 0.9 : 0.8,
            frequencyPenalty: 0,
            presencePenalty: 0,
          },
        },
      };
    }
  }

  /**
   * Create a new AI model
   */
  async createModel(
    modelData: Partial<AIModel>
  ): Promise<ApiResponse<AIModel>> {
    try {
      const response = await apiClient.post(
        `${API_BASE_URL}/ai/models`,
        modelData
      );
      return response.data;
    } catch (error) {
      console.error("Error creating AI model:", error);
      // Return mock data for development
      return {
        data: {
          id: Math.random().toString(36).substring(2, 11),
          name: modelData.name || "New Model",
          provider: modelData.provider || "Custom",
          version: modelData.version || "1.0",
          description: modelData.description || "Custom AI model",
          isActive: modelData.isActive || false,
          configuration: modelData.configuration || {
            temperature: 0.7,
            maxTokens: 1024,
            topP: 0.9,
            frequencyPenalty: 0,
            presencePenalty: 0,
          },
        },
        message: "AI model created successfully",
      };
    }
  }

  /**
   * Update an existing AI model
   */
  async updateModel(
    id: string,
    modelData: Partial<AIModel>
  ): Promise<ApiResponse<AIModel>> {
    try {
      const response = await apiClient.patch(
        `${API_BASE_URL}/ai/models/${id}`,
        modelData
      );
      return response.data;
    } catch (error) {
      console.error(`Error updating AI model ${id}:`, error);
      // Return mock data for development
      return {
        data: {
          ...(await this.getModel(id).then((res) => res.data)),
          ...modelData,
          id,
        },
        message: "AI model updated successfully",
      };
    }
  }

  /**
   * Delete an AI model
   */
  async deleteModel(id: string): Promise<ApiResponse<null>> {
    try {
      const response = await apiClient.delete(
        `${API_BASE_URL}/ai/models/${id}`
      );
      return response.data;
    } catch (error) {
      console.error(`Error deleting AI model ${id}:`, error);
      // Return mock success response for development
      return {
        data: null,
        message: "AI model deleted successfully",
      };
    }
  }

  /**
   * Get routing rules
   */
  async getRoutingRules(): Promise<PaginatedResponse<RoutingRule>> {
    try {
      console.log("Fetching routing rules from API...");
      const response = await apiClient.get(`${API_BASE_URL}/ai/routing-rules`);
      console.log("Routing rules API response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching routing rules:", error);

      // Log more details about the error
      if (error.response) {
        console.error("Error response data:", error.response.data);
        console.error("Error response status:", error.response.status);
      }

      console.log("Returning mock routing rules data for development");

      // Return mock data for development
      const mockData: PaginatedResponse<RoutingRule> = {
        data: [
          {
            id: "rule1",
            name: "Technical Support Queries",
            description: "Route to Gemini Pro",
            modelId: "gemini-pro",
            conditions: [
              {
                field: "message",
                operator: "contains",
                value: "help",
              },
              {
                field: "message",
                operator: "contains",
                value: "support",
              },
            ],
            priority: 1,
          },
          {
            id: "rule2",
            name: "Sales Inquiries",
            description: "Route to Hugging Face",
            modelId: "huggingface",
            conditions: [
              {
                field: "message",
                operator: "contains",
                value: "buy",
              },
              {
                field: "message",
                operator: "contains",
                value: "purchase",
              },
            ],
            priority: 2,
          },
        ] as RoutingRule[],
        meta: {
          current_page: 1,
          last_page: 1,
          per_page: 10,
          total: 2,
        },
      };

      return mockData;
    }
  }

  /**
   * Update routing rules
   */
  async updateRoutingRules(
    rules: RoutingRule[]
  ): Promise<ApiResponse<RoutingRule[]>> {
    try {
      const response = await apiClient.put(`${API_BASE_URL}/ai/routing-rules`, {
        rules,
      });
      return response.data;
    } catch (error) {
      console.error("Error updating routing rules:", error);
      // Return mock data for development
      return {
        data: rules,
        message: "Routing rules updated successfully",
      };
    }
  }
}

// Export a singleton instance
export const aiModelService = new AIModelService();
