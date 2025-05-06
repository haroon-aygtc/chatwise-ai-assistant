
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ThemeDebugger } from "@/components/debug/ThemeDebugger";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useSettings } from "@/hooks/settings/useSettings";
import { Save, Loader2, RotateCcw } from "lucide-react";

export default function SettingsPage() {
  const { userSettings, isLoading, isSaving, fetchUserSettings, updateUserSettings, resetUserSettings } = useSettings();
  const [formValues, setFormValues] = useState<any>(null);
  const { toast } = useToast();

  // Initialize form values when settings are loaded
  useEffect(() => {
    if (userSettings) {
      setFormValues({ ...userSettings });
    }
  }, [userSettings]);

  const handleChange = (field: string, value: any) => {
    // Handle nested fields like notifications.email
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormValues((prev: any) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormValues((prev: any) => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formValues) return;
    
    // Only send fields that have changed
    const changedFields: any = {};
    Object.keys(formValues).forEach(key => {
      if (typeof formValues[key] === 'object' && formValues[key] !== null) {
        // Handle nested objects
        const nestedChanges: any = {};
        let hasNestedChanges = false;
        
        Object.keys(formValues[key]).forEach(nestedKey => {
          if (userSettings?.[key as keyof typeof userSettings]?.[nestedKey as any] !== formValues[key][nestedKey]) {
            nestedChanges[nestedKey] = formValues[key][nestedKey];
            hasNestedChanges = true;
          }
        });
        
        if (hasNestedChanges) {
          changedFields[key] = nestedChanges;
        }
      } else if (userSettings?.[key as keyof typeof userSettings] !== formValues[key]) {
        changedFields[key] = formValues[key];
      }
    });
    
    // If there are changes, update settings
    if (Object.keys(changedFields).length > 0) {
      const result = await updateUserSettings(changedFields);
      if (result) {
        toast({
          title: "Settings saved",
          description: "Your preferences have been updated successfully.",
        });
      }
    } else {
      toast({
        title: "No changes",
        description: "No changes were detected in the settings.",
      });
    }
  };

  const handleReset = async () => {
    if (window.confirm("Are you sure you want to reset all settings to default values?")) {
      await resetUserSettings();
    }
  };

  if (isLoading || !formValues) {
    return (
      <div className="container py-6 flex justify-center items-center min-h-[300px]">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          <p className="text-muted-foreground">Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Settings</h1>
        <ThemeSwitcher />
      </div>
      
      <form onSubmit={handleSubmit}>
        <Tabs defaultValue="appearance">
          <TabsList className="mb-4">
            <TabsTrigger value="appearance">Appearance</TabsTrigger>
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="advanced">Advanced</TabsTrigger>
          </TabsList>
          
          <TabsContent value="appearance">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Theme Settings</CardTitle>
                  <CardDescription>Customize the appearance of the application</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="theme">Theme Preference</Label>
                    <Select 
                      value={formValues.theme} 
                      onValueChange={(value) => handleChange('theme', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select theme" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="light">Light</SelectItem>
                        <SelectItem value="dark">Dark</SelectItem>
                        <SelectItem value="system">System</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <ThemeDebugger />
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Accessibility</CardTitle>
                  <CardDescription>Adjust display settings for improved accessibility</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="fontSize">Font Size</Label>
                    <Select 
                      value={formValues.accessibility?.fontSize} 
                      onValueChange={(value) => handleChange('accessibility.fontSize', value)}
                    >
                      <SelectTrigger id="fontSize">
                        <SelectValue placeholder="Select font size" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="small">Small</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="large">Large</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="contrast">Contrast</Label>
                    <Select 
                      value={formValues.accessibility?.contrast} 
                      onValueChange={(value) => handleChange('accessibility.contrast', value)}
                    >
                      <SelectTrigger id="contrast">
                        <SelectValue placeholder="Select contrast" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="normal">Normal</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="reducedMotion"
                      checked={formValues.accessibility?.reducedMotion}
                      onCheckedChange={(checked) => handleChange('accessibility.reducedMotion', checked)}
                    />
                    <Label htmlFor="reducedMotion">Reduced motion</Label>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Display Preferences</CardTitle>
                  <CardDescription>Customize your view preferences</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="compactView"
                      checked={formValues.display?.compactView}
                      onCheckedChange={(checked) => handleChange('display.compactView', checked)}
                    />
                    <Label htmlFor="compactView">Compact view</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="sidebarCollapsed"
                      checked={formValues.display?.sidebarCollapsed}
                      onCheckedChange={(checked) => handleChange('display.sidebarCollapsed', checked)}
                    />
                    <Label htmlFor="sidebarCollapsed">Default sidebar collapsed</Label>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="tableRows">Table rows per page</Label>
                    <Select 
                      value={String(formValues.display?.tableRows)} 
                      onValueChange={(value) => handleChange('display.tableRows', Number(value))}
                    >
                      <SelectTrigger id="tableRows">
                        <SelectValue placeholder="Select rows" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="10">10 rows</SelectItem>
                        <SelectItem value="25">25 rows</SelectItem>
                        <SelectItem value="50">50 rows</SelectItem>
                        <SelectItem value="100">100 rows</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="account">
            <Card>
              <CardHeader>
                <CardTitle>Account Settings</CardTitle>
                <CardDescription>Manage your account details and preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="language">Language</Label>
                  <Select 
                    value={formValues.language} 
                    onValueChange={(value) => handleChange('language', value)}
                  >
                    <SelectTrigger id="language">
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Spanish</SelectItem>
                      <SelectItem value="fr">French</SelectItem>
                      <SelectItem value="de">German</SelectItem>
                      <SelectItem value="ja">Japanese</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    disabled
                    value="user@example.com"
                    className="bg-muted"
                  />
                  <p className="text-xs text-muted-foreground">
                    To change your email address, please contact the administrator.
                  </p>
                </div>
                
                <div>
                  <Button variant="outline" type="button">
                    Change Password
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>Notification Settings</CardTitle>
                <CardDescription>Configure how you receive notifications</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium">Email Notifications</h4>
                    <p className="text-xs text-muted-foreground">Receive notifications via email</p>
                  </div>
                  <Switch 
                    id="emailNotifications"
                    checked={formValues.notifications?.email}
                    onCheckedChange={(checked) => handleChange('notifications.email', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium">Push Notifications</h4>
                    <p className="text-xs text-muted-foreground">Receive notifications on your device</p>
                  </div>
                  <Switch 
                    id="pushNotifications"
                    checked={formValues.notifications?.push}
                    onCheckedChange={(checked) => handleChange('notifications.push', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium">In-App Notifications</h4>
                    <p className="text-xs text-muted-foreground">Receive notifications in the application</p>
                  </div>
                  <Switch 
                    id="inAppNotifications"
                    checked={formValues.notifications?.inApp}
                    onCheckedChange={(checked) => handleChange('notifications.inApp', checked)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="digestFrequency">Activity Digest</Label>
                  <Select 
                    value={formValues.notifications?.digest} 
                    onValueChange={(value) => handleChange('notifications.digest', value)}
                  >
                    <SelectTrigger id="digestFrequency">
                      <SelectValue placeholder="Select frequency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="never">Never</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="advanced">
            <Card>
              <CardHeader>
                <CardTitle>Chat Preferences</CardTitle>
                <CardDescription>Configure chat behavior settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium">Auto-save Conversations</h4>
                    <p className="text-xs text-muted-foreground">Automatically save chat conversations</p>
                  </div>
                  <Switch 
                    id="autoSave"
                    checked={formValues.chatPreferences?.autoSave}
                    onCheckedChange={(checked) => handleChange('chatPreferences.autoSave', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium">Typing Indicators</h4>
                    <p className="text-xs text-muted-foreground">Show when others are typing</p>
                  </div>
                  <Switch 
                    id="typingIndicator"
                    checked={formValues.chatPreferences?.showTypingIndicator}
                    onCheckedChange={(checked) => handleChange('chatPreferences.showTypingIndicator', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium">Sound Effects</h4>
                    <p className="text-xs text-muted-foreground">Play sounds for new messages</p>
                  </div>
                  <Switch 
                    id="soundEffects"
                    checked={formValues.chatPreferences?.soundEffects}
                    onCheckedChange={(checked) => handleChange('chatPreferences.soundEffects', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium">Show Timestamps</h4>
                    <p className="text-xs text-muted-foreground">Display timestamps on messages</p>
                  </div>
                  <Switch 
                    id="showTimestamps"
                    checked={formValues.chatPreferences?.showTimestamps}
                    onCheckedChange={(checked) => handleChange('chatPreferences.showTimestamps', checked)}
                  />
                </div>
              </CardContent>
            </Card>
            
            <div className="flex justify-between mt-6">
              <Button type="button" variant="outline" onClick={handleReset} disabled={isSaving}>
                <RotateCcw className="h-4 w-4 mr-2" />
                Reset to Defaults
              </Button>
              
              <Button type="submit" disabled={isSaving}>
                {isSaving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                <Save className="h-4 w-4 mr-2" />
                Save All Settings
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </form>
    </div>
  );
}
