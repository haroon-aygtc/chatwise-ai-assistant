import { apiService } from "../api/apiService";
import {
  AIModel,
  AIProvider,
  ModelConfiguration,
  ModelProvider,
  RoutingRule,
} from "@/types/ai-configuration";

const API_ENDPOINT = '/ai';

/**
 * Get all AI models
 */
export const getAllModels = async (): Promise<AIModel[]> => {
  try {
    const response = await apiService.get<{ data: AIModel[] }>(`${API_ENDPOINT}/models`);
    return response.data;
  } catch (error) {
    console.error("Error fetching AI models:", error);
    throw error;
  }
};

/**
 * Get models by provider
 */
export const getModelsByProvider = async (
  provider: AIProvider,
): Promise<AIModel[]> => {
  try {
    const response = await apiService.get<{ data: AIModel[] }>(
      `${API_ENDPOINT}/models/provider/${provider}`,
    );
    return response.data;
  } catch (error) {
    console.error(`Error fetching AI models for provider ${provider}:`, error);
    throw error;
  }
};

/**
 * Get public AI models (no auth required)
 */
export const getPublicModels = async (): Promise<AIModel[]> => {
  try {
    const response = await apiService.get<{ data: AIModel[] }>(
      `${API_ENDPOINT}/models/public`,
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching public AI models:", error);
    throw error;
  }
};

/**
 * Get a specific AI model by ID
 */
export const getModelById = async (id: string): Promise<AIModel> => {
  try {
    const response = await apiService.get<{ data: AIModel }>(
      `${API_ENDPOINT}/models/${id}`,
    );
    return response.data;
  } catch (error) {
    console.error(`Error fetching AI model ${id}:`, error);
    throw error;
  }
};

/**
 * Create a new AI model
 */
export const createModel = async (
  model: Omit<AIModel, "id" | "createdAt" | "updatedAt">,
): Promise<AIModel> => {
  try {
    // Ensure the model has a configuration object
    if (!model.configuration) {
      model.configuration = {
        temperature: model.temperature || 0.7,
        maxTokens: model.maxTokens || 2048,
        model: model.modelId || undefined,
      };
    }

    // Ensure required fields are present
    const modelToCreate = {
      ...model,
      pricePerToken: model.pricePerToken || 0.0001,
      contextSize: model.contextSize || model.maxTokens || 2048,
      capabilities: model.capabilities || {
        chat: true,
        completion: true,
        embeddings: false,
        vision: false
      },
      isActive: model.isActive !== undefined ? model.isActive : true,
      isDefault: model.isDefault !== undefined ? model.isDefault : false,
    };

    try {
      const response = await apiService.post<{ data: AIModel }>(
        `${API_ENDPOINT}/models`,
        modelToCreate,
      );
      return response.data;
    } catch (apiError) {
      // If there's a validation error, provide more details
      if (apiError.response?.status === 422) {
        const validationErrors = apiError.response.data?.errors as Record<string, string[]>;
        let errorMessage = 'Validation failed';

        if (validationErrors && typeof validationErrors === 'object') {
          try {
            errorMessage = Object.entries(validationErrors)
              .map(([field, errors]) => {
                if (Array.isArray(errors)) {
                  return `${field}: ${errors.join(', ')}`;
                }
                return `${field}: ${String(errors)}`;
              })
              .join('; ');
          } catch (parseError) {
            console.error("Error parsing validation errors:", parseError);
          }
        }

        throw new Error(`Validation error: ${errorMessage}`);
      }

      throw apiError;
    }
  } catch (error) {
    console.error("Error creating AI model:", error);
    throw error;
  }
};

/**
 * Update an existing AI model
 */
export const updateModel = async (
  id: string,
  model: Partial<AIModel>,
): Promise<AIModel> => {
  try {
    // If temperature or maxTokens are provided but not in configuration, update configuration
    if (
      model.configuration &&
      (model.temperature !== undefined || model.maxTokens !== undefined)
    ) {
      model.configuration = {
        ...model.configuration,
        temperature:
          model.temperature !== undefined
            ? model.temperature
            : model.configuration.temperature,
        maxTokens:
          model.maxTokens !== undefined
            ? model.maxTokens
            : model.configuration.maxTokens,
      };
    }

    const response = await apiService.put<{ data: AIModel }>(
      `${API_ENDPOINT}/models/${id}`,
      model,
    );
    return response.data;
  } catch (error) {
    console.error(`Error updating AI model ${id}:`, error);
    throw error;
  }
};

/**
 * Delete an AI model
 */
export const deleteModel = async (id: string): Promise<void> => {
  try {
    await apiService.delete<{ success: boolean }>(`${API_ENDPOINT}/models/${id}`);
  } catch (error) {
    console.error(`Error deleting AI model ${id}:`, error);
    throw error;
  }
};

/**
 * Set a model as the default
 */
export const setDefaultModel = async (id: string): Promise<AIModel> => {
  try {
    const response = await apiService.post<{ data: AIModel }>(
      `${API_ENDPOINT}/models/${id}/default`,
    );
    return response.data;
  } catch (error) {
    console.error(`Error setting default model ${id}:`, error);
    throw error;
  }
};

/**
 * Test a model with a prompt
 */
export const testModel = async (
  id: string,
  prompt: string,
  options?: Record<string, unknown>,
): Promise<string> => {
  try {
    const response = await apiService.post<{ data: { response: string } }>(
      `${API_ENDPOINT}/models/${id}/test`,
      {
        prompt,
        options,
      },
    );
    return response.data.response;
  } catch (error) {
    console.error(`Error testing AI model ${id}:`, error);
    throw error;
  }
};

/**
 * Test a model configuration directly without saving
 */
export const testModelConfiguration = async (
  provider: AIProvider,
  configuration: ModelConfiguration,
  prompt: string,
  apiKey?: string,
  baseUrl?: string,
): Promise<string> => {
  try {
    const response = await apiService.post<{ data: { response: string } }>(
      `${API_ENDPOINT}/models/test-configuration`,
      {
        provider,
        configuration,
        prompt,
        apiKey,
        baseUrl,
      },
    );
    return response.data.response;
  } catch (error) {
    console.error(`Error testing model configuration for ${provider}:`, error);
    throw error;
  }
};

/**
 * Get all model providers
 */
export const getAllProviders = async (): Promise<ModelProvider[]> => {
  try {
    const response = await apiService.get<{ data: ModelProvider[] }>(
      `${API_ENDPOINT}/providers`,
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching model providers:", error);
    throw error;
  }
};

/**
 * Get available model options for a specific provider
 */
export const getProviderModelOptions = async (
  providerId: string,
): Promise<string[]> => {
  try {
    const response = await apiService.get<{ data: string[] }>(
      `${API_ENDPOINT}/providers/${providerId}/models`,
    );
    return response.data;
  } catch (error) {
    console.error(
      `Error fetching model options for provider ${providerId}:`,
      error,
    );
    throw error;
  }
};

/**
 * Fetch available models from a provider without saving them to the database
 */
export const fetchProviderModels = async (
  providerSlug: string,
): Promise<AIModel[]> => {
  try {
    // In a real implementation, this would call the API to fetch models
    // For now, we'll simulate it with a delay and mock data
    console.log(`Fetching models for provider: ${providerSlug}`);

    // No artificial delay needed

    // Generate mock models based on provider
    const mockModels: AIModel[] = [];
    const timestamp = Date.now();

    switch (providerSlug.toLowerCase()) {
      case 'openai':
        mockModels.push(
          createMockModel(`openai-model-${timestamp}-1`, "GPT-4o", "OpenAI", "Latest GPT-4o model with vision capabilities"),
          createMockModel(`openai-model-${timestamp}-2`, "GPT-4 Turbo", "OpenAI", "High performance GPT-4 model"),
          createMockModel(`openai-model-${timestamp}-3`, "GPT-3.5 Turbo", "OpenAI", "Fast and efficient model for most tasks")
        );
        break;
      case 'anthropic':
        mockModels.push(
          createMockModel(`anthropic-model-${timestamp}-1`, "Claude 3 Opus", "Anthropic", "Most powerful Claude model"),
          createMockModel(`anthropic-model-${timestamp}-2`, "Claude 3 Sonnet", "Anthropic", "Balanced performance and efficiency"),
          createMockModel(`anthropic-model-${timestamp}-3`, "Claude 3 Haiku", "Anthropic", "Fast and efficient model")
        );
        break;
      case 'mistral':
        mockModels.push(
          createMockModel(`mistral-model-${timestamp}-1`, "Mistral Large", "Mistral", "Most capable Mistral model"),
          createMockModel(`mistral-model-${timestamp}-2`, "Mistral Medium", "Mistral", "Balanced performance and efficiency"),
          createMockModel(`mistral-model-${timestamp}-3`, "Mistral Small", "Mistral", "Fast and efficient model")
        );
        break;
      case 'gemini':
        mockModels.push(
          createMockModel(`gemini-model-${timestamp}-1`, "Gemini 1.5 Pro", "Gemini", "Most powerful Gemini model"),
          createMockModel(`gemini-model-${timestamp}-2`, "Gemini 1.5 Flash", "Gemini", "Fast and efficient model")
        );
        break;
      default:
        mockModels.push(
          createMockModel(`${providerSlug}-model-${timestamp}-1`, `${providerSlug} Large`, providerSlug, "Large model"),
          createMockModel(`${providerSlug}-model-${timestamp}-2`, `${providerSlug} Medium`, providerSlug, "Medium model"),
          createMockModel(`${providerSlug}-model-${timestamp}-3`, `${providerSlug} Small`, providerSlug, "Small model")
        );
    }

    return mockModels;
  } catch (error) {
    console.error(`Error fetching models for provider ${providerSlug}:`, error);
    throw error;
  }
};

/**
 * Helper function to create a mock model
 */
const createMockModel = (
  id: string,
  name: string,
  provider: string,
  description?: string
): AIModel => {
  return {
    id,
    name,
    provider: provider as AIProvider,
    version: "1.0",
    description,
    modelId: name.toLowerCase().replace(/\s+/g, '-'),
    isActive: true,
    status: "active",
    maxTokens: 4096,
    temperature: 0.7,
    configuration: {
      temperature: 0.7,
      maxTokens: 4096,
      model: name.toLowerCase().replace(/\s+/g, '-'),
    }
  };
};

/**
 * Get a specific provider by ID
 */
export const getProviderById = async (id: string): Promise<ModelProvider> => {
  try {
    const response = await apiService.get<{ data: ModelProvider }>(
      `${API_ENDPOINT}/providers/${id}`,
    );
    return response.data;
  } catch (error) {
    console.error(`Error fetching model provider ${id}:`, error);
    throw error;
  }
};

/**
 * Create a new model provider
 */
export const createProvider = async (
  provider: Omit<ModelProvider, "id" | "createdAt" | "updatedAt" | "slug">,
): Promise<ModelProvider> => {
  try {
    const response = await apiService.post<{ data: ModelProvider }>(
      `${API_ENDPOINT}/providers`,
      provider,
    );
    return response.data;
  } catch (error) {
    console.error("Error creating model provider:", error);
    throw error;
  }
};

/**
 * Update an existing model provider
 */
export const updateProvider = async (
  id: string,
  provider: Partial<ModelProvider>,
): Promise<ModelProvider> => {
  try {
    const response = await apiService.put<{ data: ModelProvider }>(
      `${API_ENDPOINT}/providers/${id}`,
      provider,
    );
    return response.data;
  } catch (error) {
    console.error(`Error updating model provider ${id}:`, error);
    throw error;
  }
};

/**
 * Delete a model provider
 */
export const deleteProvider = async (id: string): Promise<void> => {
  try {
    await apiService.delete<{ success: boolean }>(`${API_ENDPOINT}/providers/${id}`);
  } catch (error) {
    console.error(`Error deleting model provider ${id}:`, error);
    throw error;
  }
};

/**
 * Validate API key for a provider
 */
export const validateProviderApiKey = async (
  provider: AIProvider,
  apiKey: string,
  baseUrl?: string,
): Promise<boolean> => {
  try {
    const response = await apiService.post<{ data: { valid: boolean } }>(
      `${API_ENDPOINT}/providers/validate-key`,
      {
        provider,
        apiKey,
        baseUrl,
      },
    );
    return response.data.valid;
  } catch (error) {
    console.error(`Error validating API key for provider ${provider}:`, error);
    return false;
  }
};

/**
 * Get all routing rules
 */
export const getRoutingRules = async (): Promise<RoutingRule[]> => {
  try {
    const response = await apiService.get<{ data: RoutingRule[] }>(
      `${API_ENDPOINT}/routing-rules`,
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching routing rules:", error);
    throw error;
  }
};

/**
 * Create a new routing rule
 */
export const createRoutingRule = async (
  rule: Omit<RoutingRule, "id" | "createdAt" | "updatedAt">,
): Promise<RoutingRule> => {
  try {
    const response = await apiService.post<{ data: RoutingRule }>(
      `${API_ENDPOINT}/routing-rules`,
      rule,
    );
    return response.data;
  } catch (error) {
    console.error("Error creating routing rule:", error);
    throw error;
  }
};

/**
 * Update an existing routing rule
 */
export const updateRoutingRule = async (
  id: string,
  rule: Partial<RoutingRule>,
): Promise<RoutingRule> => {
  try {
    const response = await apiService.put<{ data: RoutingRule }>(
      `${API_ENDPOINT}/routing-rules/${id}`,
      rule,
    );
    return response.data;
  } catch (error) {
    console.error(`Error updating routing rule ${id}:`, error);
    throw error;
  }
};

/**
 * Delete a routing rule
 */
export const deleteRoutingRule = async (id: string): Promise<void> => {
  try {
    await apiService.delete<{ success: boolean }>(`${API_ENDPOINT}/routing-rules/${id}`);
  } catch (error) {
    console.error(`Error deleting routing rule ${id}:`, error);
    throw error;
  }
};

/**
 * Get default configuration template for a provider
 */
export const getProviderDefaultConfiguration = (
  provider: AIProvider,
): ModelConfiguration => {
  switch (provider) {
    case "OpenAI":
      return {
        temperature: 0.7,
        maxTokens: 4096,
        model: "gpt-4o",
        topP: 1,
        frequencyPenalty: 0,
        presencePenalty: 0,
      };
    case "Google":
      return {
        temperature: 0.7,
        maxTokens: 2048,
        model: "gemini-pro",
        topP: 0.95,
      };
    case "Anthropic":
      return {
        temperature: 0.7,
        maxTokens: 4096,
        model: "claude-3-opus-20240229",
        topP: 0.9,
        topK: 40,
      };
    case "HuggingFace":
      return {
        temperature: 0.7,
        maxTokens: 1024,
        model: "mistralai/Mistral-7B-Instruct-v0.2",
        task: "text-generation",
        waitForModel: false,
      };
    case "OpenRouter":
      return {
        temperature: 0.7,
        maxTokens: 4096,
        model: "openai/gpt-4o",
        routeType: "lowest-cost",
      };
    case "Groq":
      return {
        temperature: 0.7,
        maxTokens: 4096,
        model: "llama3-70b-8192",
      };
    case "Mistral":
      return {
        temperature: 0.7,
        maxTokens: 4096,
        model: "mistral-large-latest",
        safePrompt: false,
      };
    case "TogetherAI":
      return {
        temperature: 0.7,
        maxTokens: 4096,
        model: "meta-llama/Llama-3-70b-chat",
        repetitionPenalty: 1.1,
      };
    case "Gemini":
      return {
        temperature: 0.7,
        maxTokens: 4096,
        model: "gemini-1.5-pro",
        topP: 0.95,
        topK: 40,
      };
    default:
      return {
        temperature: 0.7,
        maxTokens: 2048,
      };
  }
};
