
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Lock, ArrowRight, Github } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ModeToggle } from "@/components/ModeToggle";
import { Checkbox } from "@/components/ui/checkbox";

export default function LoginPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Simulate API login delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Demo login - in production, this would validate with your Laravel backend
      if (email === "admin@example.com" && password === "password") {
        toast({
          title: "Login successful",
          description: "Welcome to ChatWise Admin Dashboard",
        });
        navigate("/admin/chat-sessions");
      } else {
        toast({
          title: "Login failed",
          description: "Invalid email or password. Try admin@example.com / password",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Login error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

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
      
      {/* Right Column - Login Form */}
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
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold mb-2">Welcome back</h1>
            <p className="text-gray-400">Enter your credentials to access your account</p>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-300">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="pl-10 h-12 bg-[#131B2E] border-[#2A3349] focus:border-gray-500 text-white"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-gray-300">Password</Label>
                <Button variant="link" size="sm" className="p-0 h-auto text-blue-400">
                  Forgot password?
                </Button>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 h-12 bg-[#131B2E] border-[#2A3349] focus:border-gray-500 text-white"
                  required
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="remember" 
                checked={rememberMe}
                onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                className="border-gray-500 data-[state=checked]:bg-blue-500"
              />
              <Label htmlFor="remember" className="text-sm font-normal text-gray-400">
                Remember me
              </Label>
            </div>
            
            <Button 
              type="submit" 
              className="w-full h-12 bg-blue-600 hover:bg-blue-700"
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : (
                <>
                  Sign in <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
            
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-700"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-[#0A101F] px-2 text-gray-500">OR CONTINUE WITH</span>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <Button variant="outline" className="h-12 bg-transparent border-gray-700 text-white hover:bg-gray-800">
                <Github className="mr-2 h-5 w-5" />
                GitHub
              </Button>
              <Button variant="outline" className="h-12 bg-transparent border-gray-700 text-white hover:bg-gray-800">
                <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                Google
              </Button>
            </div>
          </form>
          
          <p className="text-center text-sm text-gray-500 mt-8">
            Don't have an account?{" "}
            <Button variant="link" className="p-0 h-auto font-normal text-blue-400" onClick={() => navigate("/signup")}>
              Sign up
            </Button>
          </p>
          
          {/* Demo credentials notice - can be removed in production */}
          <div className="mt-6 text-center text-xs text-gray-600">
            <p>Demo credentials: admin@example.com / password</p>
          </div>
        </div>
        
        <div className="p-6 text-center text-xs text-gray-600">
          © 2025 ChatSystem. All rights reserved.
        </div>
      </div>
    </div>
  );
}
