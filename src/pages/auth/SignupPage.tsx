
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MessageSquare, ArrowRight, Eye, EyeOff, Check, ChevronLeft, ChevronRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function SignupPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    orgName: "",
    jobTitle: "",
    agreeTerms: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const updateFormData = (key: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleNextStep = () => {
    if (step === 1) {
      // Validate step 1
      if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
        toast({
          title: "Missing information",
          description: "Please fill in all required fields.",
          variant: "destructive",
        });
        return;
      }
      
      if (formData.password !== formData.confirmPassword) {
        toast({
          title: "Password error",
          description: "Passwords do not match. Please try again.",
          variant: "destructive",
        });
        return;
      }
    }
    
    setStep(prev => Math.min(prev + 1, 3));
  };

  const handlePrevStep = () => {
    setStep(prev => Math.max(prev - 1, 1));
  };

  const getPasswordStrength = () => {
    const password = formData.password;
    if (!password) return { strength: 0, label: "" };
    
    // Simple password strength check
    let strength = 0;
    if (password.length >= 8) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    
    const labels = ["Weak", "Fair", "Good", "Strong"];
    return { 
      strength, 
      label: labels[strength - 1] || "" 
    };
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.agreeTerms) {
      toast({
        title: "Agreement required",
        description: "You must agree to the terms and privacy policy.",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Simulate API signup delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Registration successful",
        description: "Your account has been created. Please sign in.",
      });
      
      navigate("/login");
    } catch (error) {
      toast({
        title: "Registration error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const passwordStrength = getPasswordStrength();
  
  const renderStepIndicator = () => {
    return (
      <div className="flex items-center justify-center space-x-2 mb-8">
        {[1, 2, 3].map((s) => (
          <div 
            key={s} 
            className={`h-2 rounded-full transition-all ${
              s === step ? "w-8 bg-primary" : "w-2 bg-gray-300"
            }`}
          />
        ))}
      </div>
    );
  };

  const renderFormStep = () => {
    switch(step) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                placeholder="John Doe"
                value={formData.name}
                onChange={(e) => updateFormData("name", e.target.value)}
                required
                className="h-12"
                autoComplete="name"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="john@example.com"
                value={formData.email}
                onChange={(e) => updateFormData("email", e.target.value)}
                required
                className="h-12"
                autoComplete="email"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => updateFormData("password", e.target.value)}
                  className="h-12 pr-10"
                  required
                  autoComplete="new-password"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                  <span className="sr-only">
                    {showPassword ? "Hide password" : "Show password"}
                  </span>
                </Button>
              </div>
              
              {formData.password && (
                <div className="mt-2">
                  <div className="flex items-center justify-between mb-1">
                    <div className="text-sm font-medium">
                      Password strength: <span className={`font-semibold ${
                        passwordStrength.strength <= 1 ? "text-red-500" : 
                        passwordStrength.strength === 2 ? "text-yellow-500" :
                        passwordStrength.strength === 3 ? "text-green-500" : "text-green-600"
                      }`}>{passwordStrength.label}</span>
                    </div>
                  </div>
                  <div className="h-1 w-full bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${
                        passwordStrength.strength <= 1 ? "bg-red-500" : 
                        passwordStrength.strength === 2 ? "bg-yellow-500" :
                        passwordStrength.strength === 3 ? "bg-green-500" : "bg-green-600"
                      }`}
                      style={{ width: `${passwordStrength.strength * 25}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={(e) => updateFormData("confirmPassword", e.target.value)}
                  className="h-12 pr-10"
                  required
                  autoComplete="new-password"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                  <span className="sr-only">
                    {showConfirmPassword ? "Hide password" : "Show password"}
                  </span>
                </Button>
              </div>
            </div>
          </div>
        );
      
      case 2:
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="orgName">Organization Name (Optional)</Label>
              <Input
                id="orgName"
                placeholder="Your Company"
                value={formData.orgName}
                onChange={(e) => updateFormData("orgName", e.target.value)}
                className="h-12"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="jobTitle">Job Title (Optional)</Label>
              <Input
                id="jobTitle"
                placeholder="Manager, Developer, etc."
                value={formData.jobTitle}
                onChange={(e) => updateFormData("jobTitle", e.target.value)}
                className="h-12"
              />
            </div>
          </div>
        );
      
      case 3:
        return (
          <div className="space-y-6">
            <div className="bg-muted p-4 rounded-lg">
              <h3 className="font-medium mb-2">Account Summary</h3>
              <div className="grid grid-cols-2 gap-y-2">
                <div className="text-sm text-muted-foreground">Name:</div>
                <div className="text-sm font-medium">{formData.name}</div>
                
                <div className="text-sm text-muted-foreground">Email:</div>
                <div className="text-sm font-medium">{formData.email}</div>
                
                {formData.orgName && (
                  <>
                    <div className="text-sm text-muted-foreground">Organization:</div>
                    <div className="text-sm font-medium">{formData.orgName}</div>
                  </>
                )}
                
                {formData.jobTitle && (
                  <>
                    <div className="text-sm text-muted-foreground">Job Title:</div>
                    <div className="text-sm font-medium">{formData.jobTitle}</div>
                  </>
                )}
              </div>
            </div>
            
            <div className="flex items-start space-x-2">
              <input
                type="checkbox"
                id="agreeTerms"
                checked={formData.agreeTerms}
                onChange={(e) => updateFormData("agreeTerms", e.target.checked)}
                className="h-4 w-4 mt-1 rounded border-gray-300"
              />
              <Label htmlFor="agreeTerms" className="text-sm font-normal">
                I agree to the <Button variant="link" className="p-0 h-auto">Terms of Service</Button> and <Button variant="link" className="p-0 h-auto">Privacy Policy</Button>
              </Label>
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };

  const renderStepButtons = () => {
    if (step < 3) {
      return (
        <div className="flex justify-between">
          {step > 1 ? (
            <Button
              type="button"
              variant="outline"
              className="h-12"
              onClick={handlePrevStep}
            >
              <ChevronLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
          ) : (
            <div></div> // Empty div for spacing
          )}
          
          <Button
            type="button"
            className="h-12"
            onClick={handleNextStep}
          >
            Next Step
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      );
    }
    
    return (
      <div className="flex justify-between">
        <Button
          type="button"
          variant="outline"
          className="h-12"
          onClick={handlePrevStep}
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        
        <Button
          type="submit"
          className="h-12"
          disabled={isLoading}
        >
          {isLoading ? "Creating account..." : (
            <>
              Create Account <Check className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      </div>
    );
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Column - Branding & Info */}
      <div className="hidden md:flex md:w-2/5 bg-gradient-to-br from-accent/90 to-primary/90 text-white p-10 flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 mb-8">
            <div className="bg-white h-10 w-10 rounded-lg flex items-center justify-center">
              <MessageSquare className="h-6 w-6 text-accent" />
            </div>
            <h1 className="text-2xl font-bold">ChatWise AI</h1>
          </div>
          
          <h2 className="text-3xl font-bold mb-6">Join ChatWise AI Platform</h2>
          <p className="text-lg opacity-90 mb-8">
            Create your account to start managing AI-powered conversations and building intelligent chat experiences.
          </p>
          
          <div className="grid grid-cols-1 gap-4">
            <div className="bg-white/10 p-4 rounded-lg flex items-start gap-3">
              <div className="bg-white/20 p-2 rounded-full mt-1">
                <Check className="h-4 w-4" />
              </div>
              <div>
                <h3 className="font-medium">Powerful Admin Dashboard</h3>
                <p className="opacity-75 text-sm">Control every aspect of your AI chat system</p>
              </div>
            </div>
            
            <div className="bg-white/10 p-4 rounded-lg flex items-start gap-3">
              <div className="bg-white/20 p-2 rounded-full mt-1">
                <Check className="h-4 w-4" />
              </div>
              <div>
                <h3 className="font-medium">Customizable Chat Widget</h3>
                <p className="opacity-75 text-sm">Embed on any website with your own branding</p>
              </div>
            </div>
            
            <div className="bg-white/10 p-4 rounded-lg flex items-start gap-3">
              <div className="bg-white/20 p-2 rounded-full mt-1">
                <Check className="h-4 w-4" />
              </div>
              <div>
                <h3 className="font-medium">Advanced Knowledge Base</h3>
                <p className="opacity-75 text-sm">Train your AI with your own content library</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="border-t border-white/20 pt-6 mt-6">
          <p className="text-sm opacity-75">
            © 2025 ChatWise AI. All rights reserved.
          </p>
        </div>
      </div>
      
      {/* Right Column - Form */}
      <div className="w-full md:w-3/5 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Mobile logo - only visible on small screens */}
          <div className="flex md:hidden items-center justify-center mb-8">
            <div className="bg-accent h-12 w-12 rounded-lg flex items-center justify-center">
              <MessageSquare className="h-6 w-6 text-white" />
            </div>
          </div>
          
          <div className="text-center mb-4">
            <h1 className="text-3xl font-bold">Create an Account</h1>
            <p className="text-muted-foreground mt-2">
              Step {step} of 3: {step === 1 ? "Personal Information" : step === 2 ? "Organization Details" : "Review & Submit"}
            </p>
          </div>
          
          {renderStepIndicator()}
          
          <form onSubmit={handleSignup} className="space-y-6">
            {renderFormStep()}
            
            <div className="pt-4">
              {renderStepButtons()}
            </div>
          </form>
          
          {step === 1 && (
            <>
              <div className="relative my-8">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="bg-background px-2 text-muted-foreground">or sign up with</span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <Button variant="outline" className="h-12">
                  <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
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
                <Button variant="outline" className="h-12">
                  <svg className="mr-2 h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                  </svg>
                  GitHub
                </Button>
              </div>
            </>
          )}
          
          <p className="text-center text-sm text-muted-foreground mt-6">
            Already have an account?{" "}
            <Button variant="link" className="p-0 h-auto font-normal" onClick={() => navigate("/login")}>
              Sign in
            </Button>
          </p>
        </div>
      </div>
    </div>
  );
}
