import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { JsonViewer } from "@/components/ui/json-viewer";
import { getAllEndpoints } from "@/services/api-tester/registry";
import apiTester from "@/services/api-tester/base";
import { API_BASE_URL } from "@/services/api-tester/config";
import tokenService from "@/modules/auth/services/tokenService";
import {
  Check,
  Copy,
  Download,
  Play,
  Plus,
  Save,
  Trash2,
  X,
} from "lucide-react";

interface ApiTestRequest {
  id: string;
  name: string;
  url: string;
  method: string;
  headers: Record<string, string>;
  body: string;
  params: Record<string, string>;
  pathParams: Record<string, string>;
  contentType: string;
}

interface ApiTestResponse {
  status: number;
  statusText: string;
  headers: Record<string, string>;
  body: any;
  time: number;
}

interface SavedRequest {
  id: string;
  name: string;
  request: ApiTestRequest;
}

const HTTP_METHODS = ["GET", "POST", "PUT", "PATCH", "DELETE"];

const CONTENT_TYPES = [
  { value: "application/json", label: "JSON" },
  { value: "application/x-www-form-urlencoded", label: "URL Encoded" },
  { value: "multipart/form-data", label: "Form Data" },
];

const EXAMPLE_TEMPLATES = {
  "application/json": [
    {
      name: "User Login",
      body: JSON.stringify(
        {
          email: "user@example.com",
          password: "password123",
        },
        null,
        2,
      ),
    },
    {
      name: "User Registration",
      body: JSON.stringify(
        {
          name: "John Doe",
          email: "john@example.com",
          password: "securePassword123",
          password_confirmation: "securePassword123",
        },
        null,
        2,
      ),
    },
    {
      name: "Create Post",
      body: JSON.stringify(
        {
          title: "My New Post",
          content: "This is the content of my post.",
          tags: ["news", "technology"],
          published: true,
        },
        null,
        2,
      ),
    },
  ],
  "application/x-www-form-urlencoded": [
    {
      name: "Simple Form",
      body: "name=John+Doe&email=john%40example.com&message=Hello+world",
    },
    {
      name: "Search Query",
      body: "query=search+term&page=1&limit=10&sort=relevance",
    },
  ],
  "multipart/form-data": [
    {
      name: "File Upload",
      body:
        "// For multipart/form-data (file uploads):\n// In a real implementation, you would use FormData API\n// Example structure:\n\n/*\nconst formData = new FormData();\nformData.append('name', 'John Doe');\nformData.append('email', 'john@example.com');\nformData.append('profile_image', fileObject);\nformData.append('documents', fileObject2);\n*/\n\n// For testing purposes, you can use this JSON representation:\n" +
        JSON.stringify(
          {
            name: "John Doe",
            email: "john@example.com",
            profile_image: "[Binary File Data]",
            documents: "[Binary File Data]",
          },
          null,
          2,
        ),
    },
    {
      name: "Profile Update with Avatar",
      body:
        "// For multipart/form-data (file uploads):\n// In a real implementation, you would use FormData API\n// Example structure:\n\n/*\nconst formData = new FormData();\nformData.append('user_id', '12345');\nformData.append('display_name', 'John Doe');\nformData.append('bio', 'Software developer and tech enthusiast');\nformData.append('avatar', fileObject);\n*/\n\n// For testing purposes, you can use this JSON representation:\n" +
        JSON.stringify(
          {
            user_id: "12345",
            display_name: "John Doe",
            bio: "Software developer and tech enthusiast",
            avatar: "[Binary File Data]",
          },
          null,
          2,
        ),
    },
  ],
};

const DEFAULT_HEADERS = {
  "Content-Type": "application/json",
  Accept: "application/json",
};

const ApiTester = () => {
  const [activeTab, setActiveTab] = useState("request");
  const [isLoading, setIsLoading] = useState(false);
  const [request, setRequest] = useState<ApiTestRequest>({
    id: Date.now().toString(),
    name: "New Request",
    url: API_BASE_URL,
    method: "GET",
    headers: { ...DEFAULT_HEADERS },
    body: "",
    params: {},
    pathParams: {},
    contentType: "application/json",
  });
  const [response, setResponse] = useState<ApiTestResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [savedRequests, setSavedRequests] = useState<SavedRequest[]>([]);
  const [registryEndpoints, setRegistryEndpoints] = useState<any[]>([]);
  const [headerKeys, setHeaderKeys] = useState<string[]>(
    Object.keys(DEFAULT_HEADERS),
  );
  const [paramKeys, setParamKeys] = useState<string[]>([]);
  const [pathParamKeys, setPathParamKeys] = useState<string[]>([]);
  const [copiedToClipboard, setCopiedToClipboard] = useState(false);

  // Load saved requests from localStorage on mount
  useEffect(() => {
    const savedRequestsJson = localStorage.getItem("api_tester_saved_requests");
    if (savedRequestsJson) {
      try {
        const parsed = JSON.parse(savedRequestsJson);
        setSavedRequests(parsed);
      } catch (e) {
        console.error("Failed to parse saved requests", e);
      }
    }

    // Load registry endpoints
    try {
      const endpoints = getAllEndpoints();
      setRegistryEndpoints(endpoints);
    } catch (e) {
      console.error("Failed to load registry endpoints", e);
    }
  }, []);

  // Update token in headers when available
  useEffect(() => {
    const token = tokenService.getToken();
    if (token) {
      setRequest((prev) => ({
        ...prev,
        headers: {
          ...prev.headers,
          Authorization: `Bearer ${token}`,
        },
      }));
      setHeaderKeys((prev) => {
        if (!prev.includes("Authorization")) {
          return [...prev, "Authorization"];
        }
        return prev;
      });
    }
  }, []);

  const handleSendRequest = async () => {
    setIsLoading(true);
    setError(null);
    setResponse(null);
    setActiveTab("response");

    try {
      // Build URL with query parameters
      let url = request.url;
      const queryParams = new URLSearchParams();
      Object.entries(request.params).forEach(([key, value]) => {
        if (key && value) {
          queryParams.append(key, value);
        }
      });

      // Replace path parameters in URL
      Object.entries(request.pathParams).forEach(([key, value]) => {
        if (key && value) {
          url = url.replace(`:${key}`, value);
        }
      });

      // Add query parameters to URL
      const queryString = queryParams.toString();
      if (queryString) {
        url = `${url}${url.includes("?") ? "&" : "?"}${queryString}`;
      }

      // Prepare headers
      const headers: Record<string, string> = {};
      Object.entries(request.headers).forEach(([key, value]) => {
        if (key && value) {
          headers[key] = value;
        }
      });

      // Prepare request options
      const options: RequestInit = {
        method: request.method,
        headers,
      };

      // Add body for non-GET requests
      if (request.method !== "GET" && request.body) {
        // Handle different content types
        if (request.contentType === "application/json") {
          try {
            // Try to parse as JSON
            const parsedBody = JSON.parse(request.body);
            options.body = JSON.stringify(parsedBody);
          } catch (e) {
            // If not valid JSON, use as is
            options.body = request.body;
          }
        } else if (
          request.contentType === "application/x-www-form-urlencoded"
        ) {
          // URL encoded form data is sent as is
          options.body = request.body;
        } else if (request.contentType === "multipart/form-data") {
          // For multipart/form-data, we would normally use FormData
          // But since we're just simulating it in the textarea, we'll parse the JSON representation
          try {
            // Extract the JSON part from the comment block
            const jsonMatch = request.body.match(/\{[\s\S]*\}/m);
            if (jsonMatch) {
              const formData = new FormData();
              const parsedBody = JSON.parse(jsonMatch[0]);

              // Add each field to the FormData object
              Object.entries(parsedBody).forEach(([key, value]) => {
                formData.append(key, String(value));
              });

              // Remove the Content-Type header as the browser will set it with the boundary
              const newHeaders = { ...headers };
              delete newHeaders["Content-Type"];
              options.headers = newHeaders;

              options.body = formData;
            } else {
              // Fallback to using the body as is
              options.body = request.body;
            }
          } catch (e) {
            // If parsing fails, use as is
            options.body = request.body;
          }
        } else {
          // Default: use as is
          options.body = request.body;
        }
      }

      // Measure request time
      const startTime = performance.now();

      // Send request
      const fetchResponse = await fetch(url, options);
      const endTime = performance.now();

      // Parse response headers
      const responseHeaders: Record<string, string> = {};
      fetchResponse.headers.forEach((value, key) => {
        responseHeaders[key] = value;
      });

      // Parse response body based on content type
      let responseBody;
      const contentType = fetchResponse.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        responseBody = await fetchResponse.json();
      } else {
        responseBody = await fetchResponse.text();
      }

      // Set response
      setResponse({
        status: fetchResponse.status,
        statusText: fetchResponse.statusText,
        headers: responseHeaders,
        body: responseBody,
        time: Math.round(endTime - startTime),
      });
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveRequest = () => {
    const newSavedRequest: SavedRequest = {
      id: request.id,
      name: request.name,
      request: { ...request },
    };

    const updatedSavedRequests = [...savedRequests];
    const existingIndex = updatedSavedRequests.findIndex(
      (r) => r.id === request.id,
    );

    if (existingIndex >= 0) {
      updatedSavedRequests[existingIndex] = newSavedRequest;
    } else {
      updatedSavedRequests.push(newSavedRequest);
    }

    setSavedRequests(updatedSavedRequests);
    localStorage.setItem(
      "api_tester_saved_requests",
      JSON.stringify(updatedSavedRequests),
    );
  };

  const handleLoadRequest = (savedRequest: SavedRequest) => {
    setRequest(savedRequest.request);
    setHeaderKeys(Object.keys(savedRequest.request.headers));
    setParamKeys(Object.keys(savedRequest.request.params));
    setPathParamKeys(Object.keys(savedRequest.request.pathParams));
  };

  const handleDeleteRequest = (id: string) => {
    const updatedSavedRequests = savedRequests.filter((r) => r.id !== id);
    setSavedRequests(updatedSavedRequests);
    localStorage.setItem(
      "api_tester_saved_requests",
      JSON.stringify(updatedSavedRequests),
    );
  };

  const handleNewRequest = () => {
    setRequest({
      id: Date.now().toString(),
      name: "New Request",
      url: API_BASE_URL,
      method: "GET",
      headers: { ...DEFAULT_HEADERS },
      body: "",
      params: {},
      pathParams: {},
      contentType: "application/json",
    });
    setHeaderKeys(Object.keys(DEFAULT_HEADERS));
    setParamKeys([]);
    setPathParamKeys([]);
    setResponse(null);
    setError(null);
    setActiveTab("request");
  };

  const handleLoadFromRegistry = (endpoint: any) => {
    // Extract path parameters from the endpoint path
    const pathParamMatches =
      endpoint.definition.path.match(/:[a-zA-Z0-9_]+/g) || [];
    const pathParams: Record<string, string> = {};
    pathParamMatches.forEach((match: string) => {
      const paramName = match.substring(1); // Remove the ':' prefix
      pathParams[paramName] = "";
    });

    setRequest({
      id: Date.now().toString(),
      name: `${endpoint.category} - ${endpoint.endpoint}`,
      url: `${API_BASE_URL}${endpoint.definition.path}`,
      method: endpoint.definition.method,
      headers: { ...DEFAULT_HEADERS },
      body: "",
      params: {},
      pathParams,
      contentType: "application/json",
    });
    setHeaderKeys(Object.keys(DEFAULT_HEADERS));
    setParamKeys([]);
    setPathParamKeys(Object.keys(pathParams));
    setResponse(null);
    setError(null);
    setActiveTab("request");
  };

  const handleAddHeader = () => {
    setHeaderKeys([...headerKeys, ""]);
  };

  const handleRemoveHeader = (index: number) => {
    const newHeaderKeys = [...headerKeys];
    const keyToRemove = newHeaderKeys[index];
    newHeaderKeys.splice(index, 1);
    setHeaderKeys(newHeaderKeys);

    setRequest((prev) => {
      const newHeaders = { ...prev.headers };
      delete newHeaders[keyToRemove];
      return { ...prev, headers: newHeaders };
    });
  };

  const handleHeaderChange = (index: number, value: string) => {
    const oldKey = headerKeys[index];
    const newHeaderKeys = [...headerKeys];
    newHeaderKeys[index] = value;
    setHeaderKeys(newHeaderKeys);

    setRequest((prev) => {
      const newHeaders = { ...prev.headers };
      if (oldKey && oldKey !== value) {
        const oldValue = newHeaders[oldKey];
        delete newHeaders[oldKey];
        if (value) {
          newHeaders[value] = oldValue || "";
        }
      } else if (value && !newHeaders[value]) {
        newHeaders[value] = "";
      }
      return { ...prev, headers: newHeaders };
    });
  };

  const handleHeaderValueChange = (key: string, value: string) => {
    setRequest((prev) => ({
      ...prev,
      headers: { ...prev.headers, [key]: value },
    }));
  };

  const handleAddParam = () => {
    setParamKeys([...paramKeys, ""]);
  };

  const handleRemoveParam = (index: number) => {
    const newParamKeys = [...paramKeys];
    const keyToRemove = newParamKeys[index];
    newParamKeys.splice(index, 1);
    setParamKeys(newParamKeys);

    setRequest((prev) => {
      const newParams = { ...prev.params };
      delete newParams[keyToRemove];
      return { ...prev, params: newParams };
    });
  };

  const handleParamChange = (index: number, value: string) => {
    const oldKey = paramKeys[index];
    const newParamKeys = [...paramKeys];
    newParamKeys[index] = value;
    setParamKeys(newParamKeys);

    setRequest((prev) => {
      const newParams = { ...prev.params };
      if (oldKey && oldKey !== value) {
        const oldValue = newParams[oldKey];
        delete newParams[oldKey];
        if (value) {
          newParams[value] = oldValue || "";
        }
      } else if (value && !newParams[value]) {
        newParams[value] = "";
      }
      return { ...prev, params: newParams };
    });
  };

  const handleParamValueChange = (key: string, value: string) => {
    setRequest((prev) => ({
      ...prev,
      params: { ...prev.params, [key]: value },
    }));
  };

  const handlePathParamValueChange = (key: string, value: string) => {
    setRequest((prev) => ({
      ...prev,
      pathParams: { ...prev.pathParams, [key]: value },
    }));
  };

  const handleCopyResponse = () => {
    if (!response) return;

    const responseText = JSON.stringify(response.body, null, 2);
    navigator.clipboard.writeText(responseText);
    setCopiedToClipboard(true);
    setTimeout(() => setCopiedToClipboard(false), 2000);
  };

  const handleDownloadResponse = () => {
    if (!response) return;

    const responseText = JSON.stringify(response.body, null, 2);
    const blob = new Blob([responseText], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `response-${new Date().toISOString()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getStatusColor = (status: number) => {
    if (status >= 200 && status < 300) return "bg-green-500";
    if (status >= 300 && status < 400) return "bg-blue-500";
    if (status >= 400 && status < 500) return "bg-yellow-500";
    if (status >= 500) return "bg-red-500";
    return "bg-gray-500";
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">API Tester</h1>
          <p className="text-muted-foreground">
            Test API endpoints directly from the interface
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleNewRequest}>
            <Plus className="mr-2 h-4 w-4" /> New Request
          </Button>
          <Button onClick={handleSaveRequest}>
            <Save className="mr-2 h-4 w-4" /> Save Request
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Saved Requests & Registry Sidebar */}
        <div className="space-y-6">
          {/* Saved Requests */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Saved Requests</CardTitle>
              <CardDescription>
                Your previously saved API requests
              </CardDescription>
            </CardHeader>
            <CardContent>
              {savedRequests.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No saved requests yet
                </p>
              ) : (
                <ScrollArea className="h-[200px]">
                  <div className="space-y-2">
                    {savedRequests.map((savedRequest) => (
                      <div
                        key={savedRequest.id}
                        className="flex items-center justify-between p-2 rounded-md hover:bg-muted cursor-pointer"
                        onClick={() => handleLoadRequest(savedRequest)}
                      >
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline">
                            {savedRequest.request.method}
                          </Badge>
                          <span className="text-sm font-medium">
                            {savedRequest.name}
                          </span>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteRequest(savedRequest.id);
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              )}
            </CardContent>
          </Card>

          {/* API Registry */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>API Registry</CardTitle>
              <CardDescription>
                Available endpoints from the registry
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px]">
                <Accordion type="multiple" className="w-full">
                  {Object.entries(
                    registryEndpoints.reduce(
                      (acc, endpoint) => {
                        if (!acc[endpoint.category]) {
                          acc[endpoint.category] = [];
                        }
                        acc[endpoint.category].push(endpoint);
                        return acc;
                      },
                      {} as Record<string, any[]>,
                    ),
                  ).map(([category, endpoints]) => (
                    <AccordionItem key={category} value={category}>
                      <AccordionTrigger className="text-sm font-medium">
                        {category}
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-2">
                          {Array.isArray(endpoints) && endpoints.map((endpoint) => (
                            <div
                              key={`${endpoint.category}-${endpoint.endpoint}`}
                              className="flex items-center justify-between p-2 rounded-md hover:bg-muted cursor-pointer"
                              onClick={() => handleLoadFromRegistry(endpoint)}
                            >
                              <div className="flex items-center space-x-2">
                                <Badge
                                  variant={
                                    endpoint.definition.method === "GET"
                                      ? "secondary"
                                      : endpoint.definition.method === "POST"
                                        ? "default"
                                        : endpoint.definition.method === "PUT"
                                          ? "outline"
                                          : endpoint.definition.method ===
                                              "DELETE"
                                            ? "destructive"
                                            : "outline"
                                  }
                                >
                                  {endpoint.definition.method}
                                </Badge>
                                <span className="text-sm">
                                  {endpoint.endpoint}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        {/* Request & Response Area */}
        <div className="lg:col-span-3 space-y-6">
          {/* Request Name */}
          <div className="flex items-center space-x-2">
            <Input
              value={request.name}
              onChange={(e) => setRequest({ ...request, name: e.target.value })}
              className="text-lg font-medium"
              placeholder="Request Name"
            />
          </div>

          {/* URL and Method */}
          <div className="flex space-x-2">
            <Select
              value={request.method}
              onValueChange={(value) =>
                setRequest({ ...request, method: value })
              }
            >
              <SelectTrigger className="w-[100px]">
                <SelectValue placeholder="Method" />
              </SelectTrigger>
              <SelectContent>
                {HTTP_METHODS.map((method) => (
                  <SelectItem key={method} value={method}>
                    {method}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              value={request.url}
              onChange={(e) => setRequest({ ...request, url: e.target.value })}
              placeholder="Enter URL"
              className="flex-1"
            />
            <Button onClick={handleSendRequest} disabled={isLoading}>
              {isLoading ? (
                <div className="h-4 w-4 rounded-full border-2 border-t-transparent border-white animate-spin mr-2"></div>
              ) : (
                <Play className="mr-2 h-4 w-4" />
              )}
              Send
            </Button>
          </div>

          {/* Request & Response Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="request">Request</TabsTrigger>
              <TabsTrigger value="response">Response</TabsTrigger>
            </TabsList>

            <TabsContent value="request" className="space-y-4">
              {/* Path Parameters */}
              {Object.keys(request.pathParams).length > 0 && (
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Path Parameters</CardTitle>
                    <CardDescription>
                      Parameters to replace in the URL path
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {Object.keys(request.pathParams).map((key) => (
                        <div key={key} className="flex items-center space-x-2">
                          <Label className="w-1/3">{key}</Label>
                          <Input
                            value={request.pathParams[key] || ""}
                            onChange={(e) =>
                              handlePathParamValueChange(key, e.target.value)
                            }
                            placeholder="Value"
                            className="flex-1"
                          />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Query Parameters */}
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">
                        Query Parameters
                      </CardTitle>
                      <CardDescription>
                        Parameters to append to the URL
                      </CardDescription>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleAddParam}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {paramKeys.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      No query parameters
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {paramKeys.map((key, index) => (
                        <div
                          key={index}
                          className="flex items-center space-x-2"
                        >
                          <Input
                            value={key}
                            onChange={(e) =>
                              handleParamChange(index, e.target.value)
                            }
                            placeholder="Key"
                            className="w-1/3"
                          />
                          <Input
                            value={key ? request.params[key] || "" : ""}
                            onChange={(e) =>
                              key && handleParamValueChange(key, e.target.value)
                            }
                            placeholder="Value"
                            className="flex-1"
                            disabled={!key}
                          />
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRemoveParam(index)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Headers */}
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">Headers</CardTitle>
                      <CardDescription>
                        HTTP headers to send with the request
                      </CardDescription>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleAddHeader}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {headerKeys.map((key, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <Input
                          value={key}
                          onChange={(e) =>
                            handleHeaderChange(index, e.target.value)
                          }
                          placeholder="Key"
                          className="w-1/3"
                        />
                        <Input
                          value={key ? request.headers[key] || "" : ""}
                          onChange={(e) =>
                            key && handleHeaderValueChange(key, e.target.value)
                          }
                          placeholder="Value"
                          className="flex-1"
                          disabled={!key}
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveHeader(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Request Body */}
              {request.method !== "GET" && (
                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-lg">Request Body</CardTitle>
                        <CardDescription>
                          Data to send with the request
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="flex-1">
                        <Label htmlFor="content-type" className="mb-2 block">
                          Content Type
                        </Label>
                        <Select
                          value={request.contentType}
                          onValueChange={(value) => {
                            // Update Content-Type header when content type changes
                            const newHeaders = { ...request.headers };
                            newHeaders["Content-Type"] = value;
                            setRequest({
                              ...request,
                              contentType: value,
                              headers: newHeaders,
                            });
                          }}
                        >
                          <SelectTrigger id="content-type">
                            <SelectValue placeholder="Select content type" />
                          </SelectTrigger>
                          <SelectContent>
                            {CONTENT_TYPES.map((type) => (
                              <SelectItem key={type.value} value={type.value}>
                                {type.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="flex-1">
                        <Label htmlFor="template" className="mb-2 block">
                          Example Templates
                        </Label>
                        <Select
                          onValueChange={(value) => {
                            const templates =
                              EXAMPLE_TEMPLATES[
                                request.contentType as keyof typeof EXAMPLE_TEMPLATES
                              ] || [];
                            const template = templates.find(
                              (t) => t.name === value,
                            );
                            if (template) {
                              setRequest({ ...request, body: template.body });
                            }
                          }}
                        >
                          <SelectTrigger id="template">
                            <SelectValue placeholder="Select a template" />
                          </SelectTrigger>
                          <SelectContent>
                            {(
                              EXAMPLE_TEMPLATES[
                                request.contentType as keyof typeof EXAMPLE_TEMPLATES
                              ] || []
                            ).map((template, index) => (
                              <SelectItem key={index} value={template.name}>
                                {template.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <Textarea
                      value={request.body}
                      onChange={(e) =>
                        setRequest({ ...request, body: e.target.value })
                      }
                      placeholder={`Enter request body (${request.contentType})`}
                      className="font-mono h-[300px]"
                    />
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="response" className="space-y-4">
              {error ? (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              ) : response ? (
                <>
                  {/* Response Status */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div
                        className={`h-3 w-3 rounded-full ${getStatusColor(
                          response.status,
                        )}`}
                      ></div>
                      <span className="font-medium">
                        {response.status} {response.statusText}
                      </span>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {response.time}ms
                    </span>
                  </div>

                  {/* Response Headers */}
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg">
                        Response Headers
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ScrollArea className="h-[150px]">
                        <div className="space-y-1">
                          {Object.entries(response.headers).map(
                            ([key, value]) => (
                              <div
                                key={key}
                                className="flex items-center justify-between py-1 border-b border-border last:border-0"
                              >
                                <span className="font-medium text-sm">
                                  {key}:
                                </span>
                                <span className="text-sm text-muted-foreground">
                                  {value}
                                </span>
                              </div>
                            ),
                          )}
                        </div>
                      </ScrollArea>
                    </CardContent>
                  </Card>

                  {/* Response Body */}
                  <Card>
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">Response Body</CardTitle>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleDownloadResponse}
                        >
                          <Download className="mr-2 h-4 w-4" />
                          Download
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <JsonViewer
                        data={response.body}
                        height="400px"
                        showCopyButton={true}
                        showRawToggle={true}
                      />
                    </CardContent>
                  </Card>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center py-12">
                  <p className="text-muted-foreground">
                    Send a request to see the response
                  </p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default ApiTester;
