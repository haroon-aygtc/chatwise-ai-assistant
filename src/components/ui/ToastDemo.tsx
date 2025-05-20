import React from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export function ToastDemo() {
  const { toast, success, error, warning } = useToast();

  const showDefaultToast = () => {
    toast({
      title: 'Default Toast',
      description: 'This is a default toast notification',
    });
  };

  const showSuccessToast = () => {
    success({
      title: 'Success!',
      description: 'Your action was completed successfully',
    });
  };

  const showErrorToast = () => {
    error({
      title: 'Error!',
      description: 'There was a problem with your request',
    });
  };

  const showWarningToast = () => {
    warning({
      title: 'Warning!',
      description: 'This action might have consequences',
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Toast Notifications</CardTitle>
        <CardDescription>Click the buttons below to see different toast variants</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-wrap gap-4">
        <Button onClick={showDefaultToast}>Default Toast</Button>
        <Button onClick={showSuccessToast} className="bg-success hover:bg-success/90">Success Toast</Button>
        <Button onClick={showErrorToast} variant="destructive">Error Toast</Button>
        <Button onClick={showWarningToast} className="bg-warning hover:bg-warning/90">Warning Toast</Button>
      </CardContent>
    </Card>
  );
}

export default ToastDemo;
