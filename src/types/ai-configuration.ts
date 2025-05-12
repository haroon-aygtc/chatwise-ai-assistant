export interface AIModel {
  id: string;
  name: string;
  provider: string;
  version: string;
  description?: string;
  maxTokens?: number;
  temperature?: number;
  apiKey?: string;
  status: 'active' | 'inactive';
  createdAt?: string;
  updatedAt?: string;
}

export interface ResponseFormat {
  id: string;
  name: string;
  description?: string;
  format: string;
  template?: string;
  systemInstructions?: string;
  content?: string;
  sources?: string[];
  active: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateResponseFormatRequest {
  name: string;
  description?: string;
  format: string;
  template?: string;
  systemInstructions?: string;
  content?: string;
  sources?: string[];
  active?: boolean;
}
