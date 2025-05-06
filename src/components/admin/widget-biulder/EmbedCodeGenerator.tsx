
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Copy, Check, Code, AlertTriangle } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface EmbedCodeGeneratorProps {
  config: any;
  aiModel?: {
    id: string;
    name: string;
  } | null;
  promptTemplate?: {
    id: string;
    name: string;
  } | null;
}

const EmbedCodeGenerator = ({ config, aiModel = null, promptTemplate = null }: EmbedCodeGeneratorProps) => {
  const [copied, setCopied] = useState(false);
  const [codeTab, setCodeTab] = useState('script');
  const [scriptVersion, setScriptVersion] = useState('standard');
  const [includeAnalytics, setIncludeAnalytics] = useState(true);
  const [advancedOptions, setAdvancedOptions] = useState(false);
  const [hasSecurityIssues, setHasSecurityIssues] = useState(false);
  const { toast } = useToast();

  // Generate widget unique ID based on config name
  const widgetId = config.general.name.toLowerCase().replace(/\s+/g, '-');
  
  // Check for potential security issues
  useEffect(() => {
    // Simple check - if custom CSS or webhook URL is used, highlight security considerations
    setHasSecurityIssues(
      (config.appearance.customCSS && config.appearance.customCSS.length > 0) ||
      (config.advanced?.webhookUrl && config.advanced.webhookUrl.length > 0)
    );
  }, [config.appearance.customCSS, config.advanced?.webhookUrl]);
  
  // Generate JavaScript embed code
  const generateScriptCode = () => {
    if (scriptVersion === 'standard') {
      return `<!-- ChatAdmin Widget -->
<script>
  (function(d, t) {
    var g = d.createElement(t),
        s = d.getElementsByTagName(t)[0];
    g.src = "https://cdn.chatadmin.ai/widget/${widgetId}.js";
    g.async = true;
    g.defer = true;
    ${includeAnalytics ? '    g.setAttribute("data-analytics", "true");\n' : ''}${aiModel ? `    g.setAttribute("data-ai-model", "${aiModel.id}");\n` : ''}${promptTemplate ? `    g.setAttribute("data-prompt-template", "${promptTemplate.id}");\n` : ''}    s.parentNode.insertBefore(g, s);
  }(document, "script"));
</script>`;
    } else if (scriptVersion === 'delayed') {
      return `<!-- ChatAdmin Widget (Delayed Load) -->
<script>
  window.addEventListener('DOMContentLoaded', function() {
    setTimeout(function() {
      var d = document, t = 'script';
      var g = d.createElement(t),
          s = d.getElementsByTagName(t)[0];
      g.src = "https://cdn.chatadmin.ai/widget/${widgetId}.js";
      g.async = true;
      g.defer = true;
      ${includeAnalytics ? '      g.setAttribute("data-analytics", "true");\n' : ''}${aiModel ? `      g.setAttribute("data-ai-model", "${aiModel.id}");\n` : ''}${promptTemplate ? `      g.setAttribute("data-prompt-template", "${promptTemplate.id}");\n` : ''}      s.parentNode.insertBefore(g, s);
    }, 2000); // 2 second delay
  });
</script>`;
    } else {
      return `<!-- ChatAdmin Widget (On User Interaction) -->
<script>
  document.addEventListener('scroll', loadWidget);
  document.addEventListener('click', loadWidget);
  document.addEventListener('mousemove', loadWidget);
  
  var widgetLoaded = false;
  function loadWidget() {
    if (widgetLoaded) return;
    widgetLoaded = true;
    
    // Remove event listeners
    document.removeEventListener('scroll', loadWidget);
    document.removeEventListener('click', loadWidget);
    document.removeEventListener('mousemove', loadWidget);
    
    // Load widget
    var d = document, t = 'script';
    var g = d.createElement(t),
        s = d.getElementsByTagName(t)[0];
    g.src = "https://cdn.chatadmin.ai/widget/${widgetId}.js";
    g.async = true;
    g.defer = true;
    ${includeAnalytics ? '    g.setAttribute("data-analytics", "true");\n' : ''}${aiModel ? `    g.setAttribute("data-ai-model", "${aiModel.id}");\n` : ''}${promptTemplate ? `    g.setAttribute("data-prompt-template", "${promptTemplate.id}");\n` : ''}    s.parentNode.insertBefore(g, s);
  }
</script>`;
    }
  };

  const scriptCode = generateScriptCode();

  // Generate HTML embed code (iframe)
  const iframeCode = `<!-- ChatAdmin Widget (iframe) -->
<iframe
  src="https://app.chatadmin.ai/widget/${widgetId}${aiModel ? `?aiModel=${aiModel.id}` : ''}${promptTemplate ? `${aiModel ? '&' : '?'}promptTemplate=${promptTemplate.id}` : ''}"
  width="${config.appearance.widgetWidth || 350}"
  height="${config.appearance.widgetHeight || 550}"
  frameborder="0"
  allow="microphone"
  style="border: none; position: fixed; ${config.general.widgetPosition.replace('-', ' ')}: 20px; z-index: 9999;"
></iframe>`;

  // Generate NPM install code
  const npmCode = `// Install the package
npm install chatadmin-widget

// In your component
import ChatAdminWidget from 'chatadmin-widget';

// In your render function
<ChatAdminWidget 
  widgetId="${widgetId}"
  position="${config.general.widgetPosition}" 
  primaryColor="${config.appearance.primaryColor}"
  darkMode={${config.appearance.darkMode}}
  ${aiModel ? `  aiModelId="${aiModel.id}"\n` : ''}${promptTemplate ? `  promptTemplateId="${promptTemplate.id}"\n` : ''}${config.appearance.glassMorphism ? '  glassMorphism={true}\n' : ''}  ${config.advanced?.abTesting ? '  abTesting={true}\n' : ''}  onChatOpen={() => console.log('Chat opened')}
  onChatClose={() => console.log('Chat closed')}
  onMessageSent={(msg) => console.log('Message sent:', msg)}
/>`;

  // Generate React component
  const reactCode = `// Create a ChatWidget.tsx component
import { useEffect } from 'react';

interface ChatWidgetProps {
  widgetId: string;
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  aiModelId?: string;
  promptTemplateId?: string;
}

const ChatWidget = ({ 
  widgetId = "${widgetId}", 
  position = "${config.general.widgetPosition}",
  aiModelId${aiModel ? ` = "${aiModel.id}"` : ' = undefined'},
  promptTemplateId${promptTemplate ? ` = "${promptTemplate.id}"` : ' = undefined'}
}: ChatWidgetProps) => {
  useEffect(() => {
    // Create script element
    const script = document.createElement('script');
    script.src = \`https://cdn.chatadmin.ai/widget/\${widgetId}.js\`;
    script.async = true;
    script.defer = true;
    
    // Add data attributes
    script.setAttribute('data-position', position);
    ${includeAnalytics ? "    script.setAttribute('data-analytics', 'true');\n" : ''}    if (aiModelId) {
      script.setAttribute('data-ai-model', aiModelId);
    }
    if (promptTemplateId) {
      script.setAttribute('data-prompt-template', promptTemplateId);
    }
    
    // Append script to document
    document.body.appendChild(script);
    
    // Cleanup
    return () => {
      document.body.removeChild(script);
      // Remove widget if present
      const widgetContainer = document.getElementById('chat-admin-widget');
      if (widgetContainer) {
        document.body.removeChild(widgetContainer);
      }
    };
  }, [widgetId, position, aiModelId, promptTemplateId]);
  
  return null;
};

export default ChatWidget;`;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    
    toast({
      title: "Copied to clipboard",
      description: "The embed code has been copied to your clipboard.",
    });
    
    setTimeout(() => setCopied(false), 2000);
  };

  const getCode = () => {
    switch (codeTab) {
      case 'script':
        return scriptCode;
      case 'iframe':
        return iframeCode;
      case 'npm':
        return npmCode;
      case 'react':
        return reactCode;
      default:
        return scriptCode;
    }
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground mb-2">
        Use this code to embed the chat widget on your website. Choose the method that works best for your platform.
      </p>
      
      {aiModel && (
        <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-md flex items-start space-x-3 mb-3">
          <div className="text-blue-600 dark:text-blue-400 shrink-0 mt-0.5">
            <Code className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-medium text-blue-800 dark:text-blue-300">
              AI Integration Detected
            </p>
            <p className="text-sm text-blue-600 dark:text-blue-400">
              This widget uses the <strong>{aiModel.name}</strong> AI model
              {promptTemplate && (
                <> with the <strong>{promptTemplate.name}</strong> prompt template</>
              )}. The embed code includes these configurations.
            </p>
          </div>
        </div>
      )}
      
      <Tabs defaultValue="script" value={codeTab} onValueChange={setCodeTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="script">JavaScript</TabsTrigger>
          <TabsTrigger value="iframe">iframe</TabsTrigger>
          <TabsTrigger value="npm">React/NPM</TabsTrigger>
          <TabsTrigger value="react">React Component</TabsTrigger>
        </TabsList>
        
        <TabsContent value="script" className="mt-4">
          <div className="flex justify-between items-center mb-4">
            <div className="text-sm text-muted-foreground">
              Add this script to your HTML page, preferably just before the closing <code className="px-1 py-0.5 bg-muted rounded">&lt;/body&gt;</code> tag.
            </div>
            <div>
              <Select
                value={scriptVersion}
                onValueChange={setScriptVersion}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Script version" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="standard">Standard</SelectItem>
                  <SelectItem value="delayed">Delayed Load</SelectItem>
                  <SelectItem value="interactive">On User Interaction</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {advancedOptions && (
            <div className="my-3 flex items-center space-x-2">
              <Checkbox
                id="includeAnalytics"
                checked={includeAnalytics}
                onCheckedChange={() => setIncludeAnalytics(!includeAnalytics)}
              />
              <Label htmlFor="includeAnalytics" className="text-sm text-muted-foreground">Include Analytics</Label>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="iframe" className="mt-4">
          <div className="text-sm text-muted-foreground mb-2 flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-amber-500" />
            <span>Use this iframe code if you have limited access to add custom JavaScript to your site (some features may be limited).</span>
          </div>
        </TabsContent>
        
        <TabsContent value="npm" className="mt-4">
          <div className="text-sm text-muted-foreground mb-2">
            For React applications, you can use our NPM package for easier integration and full access to the widget API.
          </div>
        </TabsContent>

        <TabsContent value="react" className="mt-4">
          <div className="text-sm text-muted-foreground mb-2">
            Create a reusable React component to integrate the widget with proper lifecycle management.
          </div>
        </TabsContent>
      </Tabs>

      <div className="flex justify-between items-center">
        <Button
          variant="ghost"
          size="sm"
          className="text-xs"
          onClick={() => setAdvancedOptions(!advancedOptions)}
        >
          {advancedOptions ? "Hide Advanced Options" : "Show Advanced Options"}
        </Button>
        
        {hasSecurityIssues && (
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="sm" className="flex items-center gap-1 text-amber-600 hover:text-amber-700 hover:bg-amber-100">
                <AlertTriangle className="h-4 w-4" />
                <span>Security Considerations</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="space-y-2">
                <h4 className="font-medium text-amber-600 flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4" />
                  Security Considerations
                </h4>
                <p className="text-sm text-muted-foreground">
                  Your configuration includes custom code or external services that require security review:
                </p>
                <ul className="list-disc text-xs text-muted-foreground pl-4 space-y-1">
                  {config.appearance.customCSS && config.appearance.customCSS.length > 0 && (
                    <li>Custom CSS should be reviewed for potential security issues</li>
                  )}
                  {config.advanced?.webhookUrl && config.advanced.webhookUrl.length > 0 && (
                    <li>Ensure your webhook endpoint is secure and validates requests</li>
                  )}
                </ul>
              </div>
            </PopoverContent>
          </Popover>
        )}
      </div>
      
      <div className="relative">
        <pre className="bg-gray-900 text-gray-100 p-4 rounded-md overflow-x-auto text-sm">
          <code>{getCode()}</code>
        </pre>
        
        <div className="absolute top-2 right-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="bg-gray-800 border-gray-700 hover:bg-gray-700 text-gray-200"
            onClick={() => copyToClipboard(getCode())}
          >
            {copied ? (
              <>
                <Check className="h-4 w-4 mr-1" />
                Copied
              </>
            ) : (
              <>
                <Copy className="h-4 w-4 mr-1" />
                Copy
              </>
            )}
          </Button>
        </div>
      </div>
      
      <div className="bg-muted p-4 rounded-md flex items-start space-x-3 mt-4">
        <div className="mt-0.5">
          <Code className="h-5 w-5 text-amber-500" />
        </div>
        <div>
          <h4 className="text-sm font-medium mb-1">Installation Notes</h4>
          <ul className="text-sm text-muted-foreground space-y-1 list-disc pl-4">
            <li>The widget will appear in the <strong>{config.general.widgetPosition.replace('-', ' ')}</strong> of your website.</li>
            {aiModel && (
              <li>This widget uses the <strong>{aiModel.name}</strong> AI model for processing conversations.</li>
            )}
            {promptTemplate && (
              <li>The widget uses the <strong>{promptTemplate.name}</strong> prompt template for generating responses.</li>
            )}
            <li>Make sure your website allows third-party scripts if you're using the JavaScript embed method.</li>
            <li>For WordPress sites, you can add the code in the theme footer or use a "Custom HTML" block.</li>
            <li>For advanced customization options, use the NPM package with your React application.</li>
            <li>
              <span className="flex items-center gap-1">
                <Badge variant="outline" className="text-xs py-0 h-4">New</Badge>
                <span>Performance options let you control when and how the widget loads.</span>
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default EmbedCodeGenerator;
