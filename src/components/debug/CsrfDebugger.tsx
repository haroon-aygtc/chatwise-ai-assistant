
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getCookie } from "@/utils/helpers";
import axios from "axios";
import { API_URL } from "@/services/api/config";

export function CsrfDebugger() {
  const [csrfToken, setCsrfToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [testResult, setTestResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const refreshToken = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Get CSRF cookie
      await axios.get(`${API_URL}/sanctum/csrf-cookie`, {
        withCredentials: true
      });
      
      // Read the CSRF token from cookies
      const token = getCookie("XSRF-TOKEN");
      setCsrfToken(token);
      setTestResult(null);
    } catch (err) {
      setError("Failed to refresh CSRF token");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const testCsrf = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Test endpoint that requires CSRF protection
      const response = await axios.post(
        `${API_URL}/api/csrf-test`,
        { test: "data" },
        {
          withCredentials: true,
          headers: {
            "X-XSRF-TOKEN": csrfToken,
            "Content-Type": "application/json",
            "Accept": "application/json"
          }
        }
      );
      
      setTestResult(JSON.stringify(response.data, null, 2));
    } catch (err) {
      setError("CSRF test failed");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Get initial token when component mounts
    const token = getCookie("XSRF-TOKEN");
    setCsrfToken(token);
  }, []);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          CSRF Token Debugger
          <Badge variant={csrfToken ? "outline" : "destructive"}>
            {csrfToken ? "Token Present" : "No Token"}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Button onClick={refreshToken} disabled={isLoading}>
            {isLoading ? "Loading..." : "Refresh Token"}
          </Button>
          <Button onClick={testCsrf} disabled={isLoading || !csrfToken} variant="outline">
            Test CSRF Protection
          </Button>
        </div>

        {csrfToken && (
          <div className="rounded-md bg-muted p-4 overflow-x-auto">
            <code className="text-xs">{csrfToken}</code>
          </div>
        )}

        {testResult && (
          <div className="rounded-md bg-muted p-4 overflow-x-auto">
            <h4 className="text-sm font-medium mb-2">Test Result:</h4>
            <pre className="text-xs">{testResult}</pre>
          </div>
        )}

        {error && (
          <div className="rounded-md bg-destructive/10 p-4">
            <p className="text-sm text-destructive">{error}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
