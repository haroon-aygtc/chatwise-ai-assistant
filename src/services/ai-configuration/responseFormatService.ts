
import axios from "axios";
import API_CONFIG from "../api/config";
import { ResponseFormat, CreateResponseFormatRequest } from "@/types/ai-configuration";

// Utility function to simulate API calls
const simulateApi = <T>(data: T, delay = 1000): Promise<T> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(data), delay);
  });
};

// Sample formats for testing
const sampleFormats: ResponseFormat[] = [
  {
    id: "format-1",
    name: "JSON Response",
    description: "Structured JSON response format",
    format: "json",
    template: "{\n  \"answer\": \"{{answer}}\",\n  \"sources\": [{{sources}}]\n}",
    systemInstructions: "Return responses in JSON format",
    content: "",
    sources: [],
    active: true,
    isDefault: true,
    length: "medium",
    tone: "neutral",
    options: {
      useHeadings: false,
      useBulletPoints: false,
      includeLinks: true,
      formatCodeBlocks: true
    }
  },
  {
    id: "format-2",
    name: "Conversational",
    description: "Friendly conversational format",
    format: "text",
    template: "",
    systemInstructions: "Respond in a friendly, conversational tone",
    content: "",
    sources: [],
    active: true,
    isDefault: false,
    length: "short",
    tone: "friendly",
    options: {
      useHeadings: false,
      useBulletPoints: false,
      includeLinks: false,
      formatCodeBlocks: false
    }
  },
  {
    id: "format-3",
    name: "Technical Documentation",
    description: "Detailed technical format with headings",
    format: "markdown",
    template: "# {{title}}\n\n{{content}}\n\n## References\n{{sources}}",
    systemInstructions: "Create detailed technical documentation with headings and code examples",
    content: "",
    sources: [],
    active: true,
    isDefault: false,
    length: "long",
    tone: "professional",
    options: {
      useHeadings: true,
      useBulletPoints: true,
      includeLinks: true,
      formatCodeBlocks: true
    }
  }
];

// Get all response formats
export async function getAllFormats(): Promise<ResponseFormat[]> {
  try {
    // const response = await axios.get(`${API_CONFIG.BASE_URL}/api/response-formats`);
    // return response.data;
    return simulateApi(sampleFormats);
  } catch (error) {
    console.error("Error fetching response formats:", error);
    throw new Error("Failed to fetch response formats");
  }
}

// Get default response format
export async function getDefaultFormat(): Promise<ResponseFormat | undefined> {
  try {
    // const response = await axios.get(`${API_CONFIG.BASE_URL}/api/response-formats/default`);
    // return response.data;
    return simulateApi(sampleFormats.find(f => f.isDefault));
  } catch (error) {
    console.error("Error fetching default format:", error);
    throw new Error("Failed to fetch default format");
  }
}

// Create new response format
export async function createFormat(formatData: Omit<ResponseFormat, "id">): Promise<ResponseFormat> {
  try {
    // const response = await axios.post(`${API_CONFIG.BASE_URL}/api/response-formats`, formatData);
    // return response.data;
    const newFormat: ResponseFormat = {
      id: `format-${Date.now()}`,
      ...formatData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    sampleFormats.push(newFormat);
    return simulateApi(newFormat);
  } catch (error) {
    console.error("Error creating response format:", error);
    throw new Error("Failed to create response format");
  }
}

// Update existing response format
export async function updateFormat(id: string, formatData: Partial<ResponseFormat>): Promise<ResponseFormat> {
  try {
    // const response = await axios.put(`${API_CONFIG.BASE_URL}/api/response-formats/${id}`, formatData);
    // return response.data;
    const index = sampleFormats.findIndex(f => f.id === id);
    if (index === -1) throw new Error("Format not found");
    
    const updatedFormat = {
      ...sampleFormats[index],
      ...formatData,
      updatedAt: new Date().toISOString()
    };
    sampleFormats[index] = updatedFormat;
    return simulateApi(updatedFormat);
  } catch (error) {
    console.error("Error updating response format:", error);
    throw new Error("Failed to update response format");
  }
}

// Delete response format
export async function deleteFormat(id: string): Promise<boolean> {
  try {
    // await axios.delete(`${API_CONFIG.BASE_URL}/api/response-formats/${id}`);
    // return true;
    const index = sampleFormats.findIndex(f => f.id === id);
    if (index === -1) throw new Error("Format not found");
    
    sampleFormats.splice(index, 1);
    return simulateApi(true);
  } catch (error) {
    console.error("Error deleting response format:", error);
    throw new Error("Failed to delete response format");
  }
}

// Set default format
export async function setDefaultFormat(id: string): Promise<boolean> {
  try {
    // await axios.put(`${API_CONFIG.BASE_URL}/api/response-formats/${id}/set-default`);
    // return true;
    sampleFormats.forEach(format => {
      format.isDefault = format.id === id;
    });
    return simulateApi(true);
  } catch (error) {
    console.error("Error setting default format:", error);
    throw new Error("Failed to set default format");
  }
}

// Test format with a prompt
export async function testFormat(formatId: string, prompt: string): Promise<{ formatted: string }> {
  try {
    // const response = await axios.post(`${API_CONFIG.BASE_URL}/api/response-formats/${formatId}/test`, { prompt });
    // return response.data;
    const format = sampleFormats.find(f => f.id === formatId);
    if (!format) throw new Error("Format not found");
    
    // Generate a sample response based on format type
    let response = "";
    if (format.format === 'json') {
      response = `{\n  "answer": "This is a sample response to your prompt: ${prompt}",\n  "sources": ["Sample Source 1", "Sample Source 2"]\n}`;
    } else if (format.format === 'markdown') {
      response = `# Response to: ${prompt}\n\nThis is a sample markdown response.\n\n## Key Points\n- Point one\n- Point two\n\n## References\n1. Sample Reference`;
    } else {
      response = `Here is a response to your prompt: "${prompt}"\n\nThis is generated as a sample to demonstrate the ${format.name} format.`;
    }
    
    return simulateApi({ formatted: response });
  } catch (error) {
    console.error("Error testing format:", error);
    throw new Error("Failed to test format");
  }
}
