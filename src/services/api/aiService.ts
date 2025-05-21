import ApiService from './apiService';
import { AIModel, ModelProvider, RoutingRule, ModelConfiguration, AIProvider } from '@/types/ai-configuration';
import API_CONFIG from './config';

/**
 * AI Service for handling all AI-related API calls
 * 
 * This service handles all communication with the AI-related
 * endpoints in the API. It uses the base ApiService for making
 * HTTP requests but adds AI-specific paths and type safety.
 */
class AIService extends ApiService {
    // Path constants for the API
    private static readonly BASE_PATH = '/ai';
    private static readonly MODELS_PATH = '/models';
    private static readonly PROVIDERS_PATH = '/providers';
    private static readonly ROUTING_RULES_PATH = '/routing-rules';

    // Request queue and timer to prevent API overload
    private requestQueue: Array<() => Promise<any>> = [];
    private isProcessingQueue = false;
    private requestDelay = 300; // ms between requests

    constructor() {
        // Initialize with the AI-specific base path
        super(AIService.BASE_PATH);
        if (API_CONFIG.DEBUG) {
            console.log('AIService initialized with path:', AIService.BASE_PATH);
            console.log('Using API base URL:', API_CONFIG.BASE_URL);
        }
    }

    /**
     * Queue a request to prevent too many concurrent API calls
     * This helps prevent authentication errors from server overload
     */
    private async queueRequest<T>(requestFn: () => Promise<T>): Promise<T> {
        return new Promise((resolve, reject) => {
            // Add the request to the queue
            this.requestQueue.push(async () => {
                try {
                    const result = await requestFn();
                    resolve(result);
                } catch (error) {
                    reject(error);
                }
            });

            // Start processing the queue if not already in progress
            if (!this.isProcessingQueue) {
                this.processQueue();
            }
        });
    }

    /**
     * Process the request queue with delay between requests
     */
    private async processQueue(): Promise<void> {
        if (this.isProcessingQueue || this.requestQueue.length === 0) {
            return;
        }

        this.isProcessingQueue = true;

        while (this.requestQueue.length > 0) {
            const request = this.requestQueue.shift();
            if (request) {
                try {
                    await request();
                } catch (error) {
                    console.error('Error in queued request:', error);
                }

                // Wait before processing the next request
                if (this.requestQueue.length > 0) {
                    await new Promise(resolve => setTimeout(resolve, this.requestDelay));
                }
            }
        }

        this.isProcessingQueue = false;
    }

    /**
     * Get all AI models
     */
    async getAllModels(): Promise<AIModel[]> {
        return this.queueRequest(async () => {
            try {
                if (API_CONFIG.DEBUG) {
                    console.log(`Fetching models from ${this.createEndpoint(AIService.MODELS_PATH)}`);
                }
                const response = await this.get<{ data: AIModel[] }>(AIService.MODELS_PATH);
                return response.data;
            } catch (error) {
                console.error("Error fetching AI models:", error);
                // Return empty array instead of throwing to prevent UI crashes
                return [];
            }
        });
    }

    /**
     * Get all model providers
     */
    async getAllProviders(): Promise<ModelProvider[]> {
        return this.queueRequest(async () => {
            try {
                if (API_CONFIG.DEBUG) {
                    console.log(`Fetching providers from ${this.createEndpoint(AIService.PROVIDERS_PATH)}`);
                }
                const response = await this.get<{ data: ModelProvider[] }>(AIService.PROVIDERS_PATH);
                return response.data;
            } catch (error) {
                console.error("Error fetching model providers:", error);
                // Return empty array instead of throwing
                return [];
            }
        });
    }

    /**
     * Create a new provider
     */
    async createProvider(
        provider: Omit<ModelProvider, 'id' | 'createdAt' | 'updatedAt' | 'slug'>,
    ): Promise<ModelProvider> {
        const response = await this.post<{ data: ModelProvider }>(AIService.PROVIDERS_PATH, provider);
        return response.data;
    }

    /**
     * Update an existing provider
     */
    async updateProvider(
        id: string,
        provider: Partial<ModelProvider>,
    ): Promise<ModelProvider> {
        const endpoint = `${AIService.PROVIDERS_PATH}/${id}`;
        const response = await this.put<{ data: ModelProvider }>(endpoint, provider);
        return response.data;
    }

    /**
     * Update an existing AI model
     */
    async updateModel(id: string, model: Partial<AIModel>): Promise<AIModel> {
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

        const endpoint = `${AIService.MODELS_PATH}/${id}`;
        const response = await this.put<{ data: AIModel }>(endpoint, model);
        return response.data;
    }

    /**
     * Get all routing rules
     */
    async getRoutingRules(): Promise<RoutingRule[]> {
        return this.queueRequest(async () => {
            try {
                if (API_CONFIG.DEBUG) {
                    console.log(`Fetching routing rules from ${this.createEndpoint(AIService.ROUTING_RULES_PATH)}`);
                }
                const response = await this.get<{ data: RoutingRule[] }>(AIService.ROUTING_RULES_PATH);
                return response.data;
            } catch (error) {
                console.error("Error fetching routing rules:", error);
                // Return empty array instead of throwing
                return [];
            }
        });
    }

    /**
     * Create a new routing rule
     */
    async createRoutingRule(
        rule: Omit<RoutingRule, 'id' | 'createdAt' | 'updatedAt'>,
    ): Promise<RoutingRule> {
        const response = await this.post<{ data: RoutingRule }>(AIService.ROUTING_RULES_PATH, rule);
        return response.data;
    }

    /**
     * Update an existing routing rule
     */
    async updateRoutingRule(
        id: string,
        rule: Partial<RoutingRule>,
    ): Promise<RoutingRule> {
        const endpoint = `${AIService.ROUTING_RULES_PATH}/${id}`;
        const response = await this.put<{ data: RoutingRule }>(endpoint, rule);
        return response.data;
    }

    /**
     * Delete a routing rule
     */
    async deleteRoutingRule(id: string): Promise<void> {
        const endpoint = `${AIService.ROUTING_RULES_PATH}/${id}`;
        await this.delete<{ success: boolean }>(endpoint);
    }
}

// Create and export a single instance
export const aiService = new AIService();

// Export the class for testing or custom instances
export default AIService; 