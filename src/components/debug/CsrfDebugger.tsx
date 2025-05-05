import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { JsonViewer } from "@/components/ui/json-viewer";
import {
  runCsrfDiagnostics,
  testCsrfEndpoint,
} from "@/services/api/csrf-debug";
import { tokenService } from "@/services/auth/tokenService";
import { API_BASE_URL } from "@/services/api/config";

const CsrfDebugger = () => {
  // Helper function to format log results as structured JSON
  const formatResultsAsJson = (results: string[]) => {
    try {
      const formattedData: Record<string, any> = {
        summary: {},
        logs: [],
      };

      // Extract key information
      const apiBaseUrl = results.find((line) => line.includes("API Base URL"));
      if (apiBaseUrl) {
        formattedData.summary.apiBaseUrl = apiBaseUrl
          .split("API Base URL:")[1]
          ?.trim();
      }

      const csrfEndpoint = results.find((line) =>
        line.includes("Making request to:"),
      );
      if (csrfEndpoint) {
        formattedData.summary.csrfEndpoint = csrfEndpoint
          .split("Making request to:")[1]
          ?.trim();
      }

      const responseStatus = results.find((line) =>
        line.includes("Response status:"),
      );
      if (responseStatus) {
        formattedData.summary.responseStatus = responseStatus
          .split("Response status:")[1]
          ?.trim();
      }

      const xsrfCookie = results.find((line) =>
        line.includes("XSRF-TOKEN cookie found:"),
      );
      if (xsrfCookie) {
        formattedData.summary.xsrfCookieFound = xsrfCookie.includes("true");
      }

      // Process all logs with type information
      results.forEach((line) => {
        const logMatch = line.match(/\[(info|error|warn)\]\s(.+)/);
        if (logMatch) {
          const [, type, message] = logMatch;
          formattedData.logs.push({
            type,
            message,
            timestamp: new Date().toISOString(),
          });
        } else {
          formattedData.logs.push({
            type: "info",
            message: line,
            timestamp: new Date().toISOString(),
          });
        }
      });

      setFormattedResults(formattedData);
    } catch (error) {
      console.error("Error formatting results as JSON:", error);
      // Fallback to raw results if formatting fails
      setFormattedResults(null);
    }
  };

  const [isRunningTests, setIsRunningTests] = useState(false);
  const [testResults, setTestResults] = useState<string[]>([]);
  const [formattedResults, setFormattedResults] = useState<any>(null);
  const [csrfToken, setCsrfToken] = useState<string | null>(
    tokenService.getCsrfToken(),
  );

  const runDiagnostics = async () => {
    setIsRunningTests(true);
    setTestResults([]);

    // Override console.log to capture output
    const originalConsoleLog = console.log;
    const originalConsoleError = console.error;
    const originalConsoleWarn = console.warn;

    const captureLog = (type: string, ...args: any[]) => {
      const message = args
        .map((arg) => {
          if (typeof arg === "object" && arg !== null) {
            try {
              return JSON.stringify(arg, null, 2);
            } catch (e) {
              return String(arg);
            }
          }
          return String(arg);
        })
        .join(" ");

      setTestResults((prev) => [...prev, `[${type}] ${message}`]);

      if (type === "error") {
        originalConsoleError(...args);
      } else if (type === "warn") {
        originalConsoleWarn(...args);
      } else {
        originalConsoleLog(...args);
      }
    };

    console.log = (...args) => captureLog("info", ...args);
    console.error = (...args) => captureLog("error", ...args);
    console.warn = (...args) => captureLog("warn", ...args);

    try {
      await runCsrfDiagnostics();

      // Try to get a new CSRF token
      const token = await tokenService.initCsrfToken();
      setCsrfToken(token);

      captureLog("info", "-----------------------------------");
      captureLog(
        "info",
        "CSRF Token after diagnostics:",
        token || "Not available",
      );
    } catch (error) {
      captureLog("error", "Diagnostics failed:", error);
    } finally {
      // Restore original console methods
      console.log = originalConsoleLog;
      console.error = originalConsoleError;
      console.warn = originalConsoleWarn;
      setIsRunningTests(false);

      // Format results as structured data for the JsonViewer
      formatResultsAsJson(testResults);
    }
  };

  const testCsrfCookie = async () => {
    setIsRunningTests(true);
    setTestResults([]);

    // Override console.log to capture output
    const originalConsoleLog = console.log;
    const originalConsoleError = console.error;
    const originalConsoleWarn = console.warn;

    const captureLog = (type: string, ...args: any[]) => {
      const message = args
        .map((arg) => {
          if (typeof arg === "object" && arg !== null) {
            try {
              return JSON.stringify(arg, null, 2);
            } catch (e) {
              return String(arg);
            }
          }
          return String(arg);
        })
        .join(" ");

      setTestResults((prev) => [...prev, `[${type}] ${message}`]);

      if (type === "error") {
        originalConsoleError(...args);
      } else if (type === "warn") {
        originalConsoleWarn(...args);
      } else {
        originalConsoleLog(...args);
      }
    };

    console.log = (...args) => captureLog("info", ...args);
    console.error = (...args) => captureLog("error", ...args);
    console.warn = (...args) => captureLog("warn", ...args);

    try {
      await testCsrfEndpoint();

      // Try to get a new CSRF token
      const token = await tokenService.initCsrfToken();
      setCsrfToken(token);

      captureLog("info", "-----------------------------------");
      captureLog("info", "CSRF Token after test:", token || "Not available");
    } catch (error) {
      captureLog("error", "CSRF test failed:", error);
    } finally {
      // Restore original console methods
      console.log = originalConsoleLog;
      console.error = originalConsoleError;
      console.warn = originalConsoleWarn;
      setIsRunningTests(false);

      // Format results as structured data for the JsonViewer
      formatResultsAsJson(testResults);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>CSRF Token Debugger</CardTitle>
        <CardDescription>
          Diagnose and fix CSRF token issues with your Laravel backend
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium">Current CSRF Token Status</h3>
              <p className="text-sm text-muted-foreground">
                Check if a valid CSRF token is available
              </p>
            </div>
            <Badge variant={csrfToken ? "success" : "destructive"}>
              {csrfToken ? "Available" : "Not Available"}
            </Badge>
          </div>

          <Separator />

          <div>
            <h3 className="text-lg font-medium mb-2">API Configuration</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 border rounded-md">
                <p className="text-sm font-medium">API Base URL</p>
                <p className="text-sm text-muted-foreground break-all">
                  {API_BASE_URL}
                </p>
              </div>
              <div className="p-4 border rounded-md">
                <p className="text-sm font-medium">CSRF Endpoint</p>
                <p className="text-sm text-muted-foreground break-all">
                  {API_BASE_URL.endsWith("/api")
                    ? API_BASE_URL.substring(0, API_BASE_URL.length - 4)
                    : API_BASE_URL}
                  /sanctum/csrf-cookie
                </p>
              </div>
            </div>
          </div>

          {testResults.length > 0 && (
            <>
              <Separator />

              <div>
                <h3 className="text-lg font-medium mb-2">Diagnostic Results</h3>
                <div className="mb-4">
                  <JsonViewer
                    data={formattedResults || testResults.join("\n")}
                    height="300px"
                    title="CSRF Diagnostics"
                    showRawToggle={true}
                  />
                </div>
              </div>
            </>
          )}

          {!csrfToken && (
            <Alert variant="destructive">
              <AlertDescription>
                No CSRF token is currently available. This may cause
                authentication issues with your Laravel backend. Run the
                diagnostics to troubleshoot the problem.
              </AlertDescription>
            </Alert>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button
          variant="outline"
          onClick={testCsrfCookie}
          disabled={isRunningTests}
        >
          {isRunningTests ? "Testing..." : "Test CSRF Cookie"}
        </Button>
        <Button onClick={runDiagnostics} disabled={isRunningTests}>
          {isRunningTests ? "Running Diagnostics..." : "Run Full Diagnostics"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CsrfDebugger;
