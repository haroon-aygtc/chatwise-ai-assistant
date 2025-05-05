
import { ReactNode } from "react";
import { ModeToggle } from "@/components/ModeToggle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight } from "lucide-react";

interface AuthLayoutProps {
  children: ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen w-full">
      {/* Left Column - Landing/Marketing Content */}
      <div className="hidden lg:flex flex-col w-3/5 bg-gray-100 p-8 relative overflow-hidden">
        <div className="z-10">
          <div className="flex items-center gap-2 mb-12">
            <div className="bg-white h-10 w-10 rounded-md flex items-center justify-center shadow-sm">
              <span className="font-bold text-lg">CS</span>
            </div>
            <h1 className="text-xl font-bold">ChatSystem</h1>
          </div>
          
          <div className="mt-24">
            <div className="bg-white p-6 rounded-xl shadow-lg w-3/4 mx-auto relative">
              <div className="absolute -top-3 -right-3 bg-orange-500 text-white h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold">
                AI
              </div>
              
              <div className="bg-gray-100 p-4 rounded-lg mb-4">
                <p className="text-sm text-gray-700">Hello! How can I help you today?</p>
              </div>
              
              <div className="bg-orange-100 text-orange-800 p-3 rounded-lg mb-4">
                <p className="text-sm">I need information about your services.</p>
              </div>
              
              <div className="bg-gray-100 p-4 rounded-lg">
                <p className="text-sm text-gray-700">I'd be happy to help! Our AI chat system offers seamless integration, customizable widgets, and advanced analytics.</p>
              </div>
              
              <div className="flex items-center mt-4 gap-2">
                <Input className="flex-1 bg-gray-100 border-0" placeholder="Type your message..." />
                <Button size="icon" className="bg-orange-500 hover:bg-orange-600">
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div className="mt-12 bg-white p-6 rounded-xl shadow-lg w-3/4 mx-auto">
              <h3 className="text-lg font-medium mb-3">"Revolutionize your customer experience"</h3>
              <p className="text-gray-600 text-sm mb-4">
                ChatSystem has transformed how we engage with our customers. The AI responses are incredibly accurate and the setup was effortless.
              </p>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center">
                  <span className="text-orange-500 font-bold">SJ</span>
                </div>
                <div>
                  <p className="font-medium">Sarah Johnson</p>
                  <p className="text-xs text-gray-500">Product Manager, TechCorp</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Background decoration */}
        <div className="absolute top-1/4 right-1/4 h-64 w-64 bg-gray-200 rounded-full opacity-30"></div>
      </div>
      
      {/* Right Column - Form */}
      <div className="w-full lg:w-2/5 bg-[#0A101F] text-white flex flex-col justify-between">
        <div className="flex justify-between items-center p-4">
          <div className="lg:hidden flex items-center gap-2">
            <div className="bg-white h-8 w-8 rounded-md flex items-center justify-center shadow-sm">
              <span className="font-bold text-sm text-black">CS</span>
            </div>
            <span className="font-bold">ChatSystem</span>
          </div>
          <div className="ml-auto">
            <ModeToggle />
          </div>
        </div>
        
        <div className="flex-1 flex flex-col justify-center px-8 md:px-12 lg:px-16 py-8">
          {children}
        </div>
        
        <div className="p-6 text-center text-xs text-gray-600">
          © 2025 ChatSystem. All rights reserved.
        </div>
      </div>
    </div>
  );
}
