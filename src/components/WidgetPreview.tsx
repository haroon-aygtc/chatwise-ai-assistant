import ChatWidget from "./chat/ChatWidget";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

function WidgetPreview() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-6">
      <div className="max-w-screen-xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <Link to="/">
            <Button variant="outline" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Admin
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">Widget Preview</h1>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Desktop Preview</CardTitle>
              <CardDescription>
                How your widget appears on desktop browsers
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[600px] bg-white relative border rounded-md">
              <div className="absolute top-4 left-4 right-4 h-8 bg-gray-100 rounded flex items-center px-4">
                <div className="w-3 h-3 rounded-full bg-red-400 mr-2"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-400 mr-2"></div>
                <div className="w-3 h-3 rounded-full bg-green-400 mr-2"></div>
                <div className="flex-1 text-xs text-center text-gray-500">
                  https://yourwebsite.com
                </div>
              </div>
              <div className="absolute top-16 left-4 right-4 bottom-4 bg-gray-50 rounded">
                <div className="p-4 text-sm text-gray-500 text-center mt-20">
                  Your website content would appear here
                </div>
              </div>
              <ChatWidget
                position="bottom-right"
                botName="AI Assistant"
                welcomeMessage="Hello! How can I help you today?"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Mobile Preview</CardTitle>
              <CardDescription>
                How your widget appears on mobile devices
              </CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center p-6">
              <div className="w-[320px] h-[600px] bg-white border-8 border-gray-800 rounded-3xl relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-6 bg-gray-800 flex justify-center items-center">
                  <div className="w-20 h-2 bg-gray-600 rounded-full"></div>
                </div>
                <div className="h-full bg-gray-50 pt-8 px-2 pb-2">
                  <div className="p-4 text-sm text-gray-500 text-center mt-20">
                    Your mobile website content would appear here
                  </div>
                  <ChatWidget
                    position="bottom-right"
                    botName="AI Assistant"
                    welcomeMessage="Hello! How can I help you today?"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Integration Code</CardTitle>
            <CardDescription>
              Add this code to your website to embed the chat widget
            </CardDescription>
          </CardHeader>
          <CardContent>
            <pre className="bg-gray-900 text-gray-100 p-4 rounded-md overflow-x-auto">
              <code>{`<script src="https://chat-widget.example.com/embed.js" 
  data-widget-id="widget-123456" 
  data-position="bottom-right"
  data-primary-color="#1e40af"
  data-bot-name="AI Assistant"
  async>
</script>`}</code>
            </pre>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default WidgetPreview;
