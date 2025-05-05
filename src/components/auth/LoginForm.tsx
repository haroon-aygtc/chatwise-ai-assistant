
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Mail, Lock, ArrowRight, Github, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { FormField } from "@/components/ui/form-field";
import { validateEmail, validateRequired } from "@/lib/validations";

interface LoginFormProps {
  onSuccess?: () => void;
}

export function LoginForm({ onSuccess }: LoginFormProps) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [touchedFields, setTouchedFields] = useState({
    email: false,
    password: false,
  });
  
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const updateFormField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    // Mark all fields as touched
    setTouchedFields({
      email: true,
      password: true,
    });
    
    // Validate fields
    const emailValidation = validateEmail(formData.email);
    const passwordValidation = validateRequired(formData.password);
    
    if (!emailValidation.isValid || !passwordValidation.isValid) {
      // Collect all error messages
      const errorMessages = [];
      if (!emailValidation.isValid) errorMessages.push(`Email: ${emailValidation.error}`);
      if (!passwordValidation.isValid) errorMessages.push(`Password: ${passwordValidation.error}`);
      
      // Show toast with all errors
      toast({
        title: "Please fix the following errors:",
        description: (
          <ul className="list-disc pl-4 space-y-1">
            {errorMessages.map((msg, i) => (
              <li key={i}>{msg}</li>
            ))}
          </ul>
        ),
        variant: "destructive",
      });
      return false;
    }
    
    return true;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    try {
      // Simulate API login delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Demo login - in production, this would validate with your backend
      if (formData.email === "admin@example.com" && formData.password === "password") {
        toast({
          title: "Login Successful",
          description: "Welcome to ChatWise Admin Dashboard",
        });
        navigate("/admin/chat-sessions");
        if (onSuccess) onSuccess();
      } else {
        toast({
          title: "Login Failed",
          description: "Invalid email or password. Try admin@example.com / password",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Login Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-2">Welcome back</h1>
        <p className="text-muted-foreground">Enter your credentials to access your account</p>
      </div>
      
      <form onSubmit={handleLogin} className="space-y-6">
        <FormField
          id="email"
          label="Email"
          type="email"
          placeholder="name@example.com"
          value={formData.email}
          onChange={(value) => updateFormField("email", value)}
          validate={() => validateEmail(formData.email)}
          required
          icon={<Mail className="h-4 w-4" />}
          autoComplete="email"
        />
        
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <Button variant="link" size="sm" className="p-0 h-auto">
              Forgot password?
            </Button>
          </div>
          <FormField
            id="password"
            label=""
            type="password"
            placeholder="••••••••"
            value={formData.password}
            onChange={(value) => updateFormField("password", value)}
            validate={() => validateRequired(formData.password)}
            required
            icon={<Lock className="h-4 w-4" />}
            autoComplete="current-password"
          />
        </div>
        
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="remember" 
            checked={rememberMe}
            onCheckedChange={(checked) => setRememberMe(checked as boolean)}
          />
          <Label htmlFor="remember" className="text-sm font-normal text-muted-foreground">
            Remember me
          </Label>
        </div>
        
        <Button 
          type="submit" 
          className="w-full h-12"
          disabled={isLoading}
        >
          {isLoading ? "Signing in..." : (
            <>
              Sign in <ArrowRight className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
        
        {/* <div className="relative my-6">
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
         */}
        {/* Demo credentials notice - can be removed in production */}
        <div className="mt-6 text-center text-xs text-muted-foreground">
          <p>Demo credentials: admin@example.com / password</p>
        </div>
      </form>
      
      <p className="text-center text-sm text-muted-foreground mt-8">
        Don't have an account?{" "}
        <Button variant="link" className="p-0 h-auto font-normal" onClick={() => navigate("/signup")}>
          Sign up
        </Button>
      </p>
    </>
  );
}
