
export interface AiConfig {
  id: string;
  name: string;
  model: string;
  systemPrompt: string;
  temperature: number;
  maxTokens: number;
  frequencyPenalty: number;
  presencePenalty: number;
  stopSequences: string[];
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PromptTemplate {
  id: string;
  name: string;
  description: string;
  content: string;
  category: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export const mockAiConfigs: AiConfig[] = [
  {
    id: "ai_001",
    name: "Customer Support Assistant",
    model: "gemini-1.5-pro",
    systemPrompt: "You are a helpful customer support AI assistant. Answer user questions based on the provided knowledge base. Be friendly, concise, and helpful. If you don't know the answer, politely say so and offer to connect the user with a human agent.",
    temperature: 0.7,
    maxTokens: 1024,
    frequencyPenalty: 0.0,
    presencePenalty: 0.0,
    stopSequences: [],
    isDefault: true,
    createdAt: "2025-04-01T10:00:00Z",
    updatedAt: "2025-05-01T15:30:00Z"
  },
  {
    id: "ai_002",
    name: "Sales Specialist",
    model: "gemini-1.5-pro",
    systemPrompt: "You are a knowledgeable sales AI assistant. Help users understand product features, pricing, and how our solutions can solve their problems. Be persuasive but not pushy. Focus on benefits rather than just features. Suggest the most appropriate plan based on user needs.",
    temperature: 0.8,
    maxTokens: 1024,
    frequencyPenalty: 0.0,
    presencePenalty: 0.0,
    stopSequences: [],
    isDefault: false,
    createdAt: "2025-04-10T09:15:00Z",
    updatedAt: "2025-04-25T16:40:00Z"
  },
  {
    id: "ai_003",
    name: "Technical Support Engineer",
    model: "huggingface-falcon-7b",
    systemPrompt: "You are an expert technical support AI. Help users troubleshoot issues with specific technical details. Use clear step-by-step instructions. Don't hesitate to ask for logs or screenshots when needed. For complex issues, suggest debugging steps or relevant documentation.",
    temperature: 0.5,
    maxTokens: 1536,
    frequencyPenalty: 0.1,
    presencePenalty: 0.1,
    stopSequences: [],
    isDefault: false,
    createdAt: "2025-04-15T14:20:00Z",
    updatedAt: "2025-04-30T11:10:00Z"
  }
];

export const mockPromptTemplates: PromptTemplate[] = [
  {
    id: "prompt_001",
    name: "General Greeting",
    description: "Welcome message for new conversations",
    content: "Hello! I'm {{business_name}}'s AI assistant. How can I help you today?",
    category: "Greetings",
    tags: ["welcome", "greeting", "introduction"],
    createdAt: "2025-04-01T09:00:00Z",
    updatedAt: "2025-04-01T09:00:00Z"
  },
  {
    id: "prompt_002",
    name: "Subscription Inquiry",
    description: "Template for handling subscription questions",
    content: "I understand you have a question about your subscription. Let me help with that. Could you please confirm which subscription plan you currently have? This will help me provide you with the most accurate information.",
    category: "Support",
    tags: ["subscription", "billing", "payment"],
    createdAt: "2025-04-02T10:15:00Z",
    updatedAt: "2025-04-15T11:30:00Z"
  },
  {
    id: "prompt_003",
    name: "Technical Issue Response",
    description: "Template for responding to technical problems",
    content: "I'm sorry you're experiencing technical difficulties. Let's troubleshoot this together. First, could you please provide more details about what you're seeing? If possible, include:\n\n1. The exact error message\n2. Which browser/device you're using\n3. When the issue started\n\nThis information will help me find a solution for you faster.",
    category: "Support",
    tags: ["technical", "troubleshooting", "error", "bug"],
    createdAt: "2025-04-03T14:20:00Z",
    updatedAt: "2025-04-20T09:45:00Z"
  },
  {
    id: "prompt_004",
    name: "Product Feature Explanation",
    description: "Template for explaining product features",
    content: "The {{feature_name}} feature works by {{feature_explanation}}. Here are some key benefits:\n\n• {{benefit_1}}\n• {{benefit_2}}\n• {{benefit_3}}\n\nWould you like me to explain how to use this feature or would you prefer to see a quick tutorial?",
    category: "Sales",
    tags: ["features", "product", "explanation"],
    createdAt: "2025-04-05T16:30:00Z",
    updatedAt: "2025-04-25T13:50:00Z"
  },
  {
    id: "prompt_005",
    name: "Handoff to Human Agent",
    description: "Template for transferring to a human agent",
    content: "I understand this is an important issue that might need specialized attention. I'd be happy to connect you with a human agent who can assist you further. Our support team is available {{support_hours}} and typically responds within {{response_time}}. Would you like me to arrange this for you?",
    category: "Support",
    tags: ["handoff", "human", "agent", "transfer"],
    createdAt: "2025-04-08T11:10:00Z",
    updatedAt: "2025-04-28T14:15:00Z"
  }
];
