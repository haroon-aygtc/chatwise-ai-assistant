
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { getCSRFToken, refreshCSRFToken, testCSRFProtection, runCsrfDiagnostics, testCsrfEndpoint } from '@/services/api/csrf-debug';
import { addGlobalHeader, removeGlobalHeader } from '@/services/api/config';
import { API_BASE_URL } from '@/services/api/config';

export function CsrfDebugger() {
  const [csrfToken, setCsrfToken] = useState<string | null>(null);
  const [testResult, setTestResult] = useState<boolean | null>(null);
  const [diagResult, setDiagResult] = useState<any>(null);
  const [endpointResult, setEndpointResult] = useState<any>(null);

  const handleGetToken = () => {
    const token = getCSRFToken();
    setCsrfToken(token);
  };

  const handleRefreshToken = async () => {
    const token = await refreshCSRFToken();
    setCsrfToken(token);
  };

  const handleTestProtection = async () => {
    const result = await testCSRFProtection();
    setTestResult(result);
  };

  const handleRunDiagnostics = async () => {
    const result = await runCsrfDiagnostics();
    setDiagResult(result);
  };

  const handleTestEndpoint = async () => {
    const result = await testCsrfEndpoint();
    setEndpointResult(result);
  };

  const handleAddHeader = () => {
    const token = getCSRFToken();
    if (token) {
      addGlobalHeader('X-CSRF-TOKEN', token);
      setCsrfToken(token);
    }
  };

  const handleRemoveHeader = () => {
    removeGlobalHeader('X-CSRF-TOKEN');
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
          <Button size="sm" onClick={handleAddHeader}>
            Add as Header
          </Button>
          <Button size="sm" variant="outline" onClick={handleRemoveHeader}>
            Remove Header
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
