
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import apiService, { getCsrfToken } from '@/services/api/api';
import { API_BASE_URL } from '@/services/api/config';

export function CsrfDebugger() {
  const [csrfToken, setCsrfToken] = useState<string | null>(null);
  const [testResult, setTestResult] = useState<boolean | null>(null);
  const [diagResult, setDiagResult] = useState<any>(null);
  const [endpointResult, setEndpointResult] = useState<any>(null);

  // Get CSRF token from cookies
  const getTokenFromCookies = (): string | null => {
    const cookies = document.cookie.split(';');
    const xsrfCookie = cookies.find(cookie => cookie.trim().startsWith('XSRF-TOKEN='));
    if (xsrfCookie) {
      return decodeURIComponent(xsrfCookie.trim().substring('XSRF-TOKEN='.length));
    }
    return null;
  };

  const handleGetToken = () => {
    const token = getTokenFromCookies();
    setCsrfToken(token);
  };

  const handleRefreshToken = async () => {
    try {
      await getCsrfToken();
      const token = getTokenFromCookies();
      setCsrfToken(token);
    } catch (error) {
      console.error('Failed to refresh token:', error);
    }
  };

  const handleTestProtection = async () => {
    try {
      await apiService.post('/csrf-test', { test: true });
      setTestResult(true);
    } catch (error) {
      console.error('CSRF test failed:', error);
      setTestResult(false);
    }
  };

  const handleRunDiagnostics = async () => {
    try {
      // Get initial token
      const initialToken = getTokenFromCookies();

      // Refresh token
      await getCsrfToken();
      const refreshedToken = getTokenFromCookies();

      // Test protection
      let testResult = false;
      try {
        await apiService.post('/csrf-test', { test: true });
        testResult = true;
      } catch (error) {
        testResult = false;
      }

      setDiagResult({
        initialToken,
        refreshedToken,
        testResult
      });
    } catch (error) {
      console.error('Diagnostics failed:', error);
    }
  };

  const handleTestEndpoint = async () => {
    try {
      const result = await apiService.post('/csrf-test');
      setEndpointResult(result);
    } catch (error) {
      console.error('Endpoint test failed:', error);
      setEndpointResult({ success: false, message: 'Request failed' });
    }
  };

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>CSRF Debugger</CardTitle>
        <CardDescription>
          Test and debug Cross-Site Request Forgery (CSRF) protection
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label>API Base URL</Label>
          <div className="p-2 bg-muted rounded-md text-sm mt-1">{API_BASE_URL}</div>
        </div>

        <div>
          <Label>Current CSRF Token</Label>
          <div className="p-2 bg-muted rounded-md text-sm mt-1 break-all">
            {csrfToken || 'No token found'}
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button size="sm" onClick={handleGetToken}>
            Get Token
          </Button>
          <Button size="sm" onClick={handleRefreshToken}>
            Refresh Token
          </Button>
        </div>

        <Separator />

        <div>
          <Label>Protection Test Result</Label>
          <div className="p-2 bg-muted rounded-md text-sm mt-1">
            {testResult === null ? 'Not tested' : testResult ? 'Success ✅' : 'Failed ❌'}
          </div>
          <Button size="sm" className="mt-2" onClick={handleTestProtection}>
            Test Protection
          </Button>
        </div>

        <Separator />

        <div>
          <Label>Diagnostics Result</Label>
          <div className="p-2 bg-muted rounded-md text-sm mt-1 max-h-32 overflow-auto whitespace-pre">
            {diagResult ? JSON.stringify(diagResult, null, 2) : 'No results'}
          </div>
          <Button size="sm" className="mt-2" onClick={handleRunDiagnostics}>
            Run Diagnostics
          </Button>
        </div>

        <Separator />

        <div>
          <Label>Test Endpoint Result</Label>
          <div className="p-2 bg-muted rounded-md text-sm mt-1 max-h-32 overflow-auto whitespace-pre">
            {endpointResult ? JSON.stringify(endpointResult, null, 2) : 'No results'}
          </div>
          <Button size="sm" className="mt-2" onClick={handleTestEndpoint}>
            Test Endpoint
          </Button>
        </div>
      </CardContent>
      <CardFooter className="text-sm text-muted-foreground">
        CSRF tokens help protect your application from cross-site request forgery attacks.
      </CardFooter>
    </Card>
  );
}
