
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, User, Lock, ArrowRight, Github, ChevronLeft, ChevronRight, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ModeToggle } from "@/components/ModeToggle";
import { Checkbox } from "@/components/ui/checkbox";

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
              s === step ? "w-8 bg-blue-500" : "w-2 bg-gray-700"
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
              <Label htmlFor="name" className="text-gray-300">Full Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  id="name"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={(e) => updateFormData("name", e.target.value)}
                  required
                  className="pl-10 h-12 bg-[#131B2E] border-[#2A3349] focus:border-gray-500 text-white"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-300">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={(e) => updateFormData("email", e.target.value)}
                  required
                  className="pl-10 h-12 bg-[#131B2E] border-[#2A3349] focus:border-gray-500 text-white"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-300">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => updateFormData("password", e.target.value)}
                  className="pl-10 h-12 bg-[#131B2E] border-[#2A3349] focus:border-gray-500 text-white"
                  required
                />
              </div>
              
              {formData.password && (
                <div className="mt-2">
                  <div className="flex items-center justify-between mb-1">
                    <div className="text-sm text-gray-400">
                      Password strength: <span className={`font-semibold ${
                        passwordStrength.strength <= 1 ? "text-red-500" : 
                        passwordStrength.strength === 2 ? "text-yellow-500" :
                        passwordStrength.strength === 3 ? "text-green-500" : "text-green-600"
                      }`}>{passwordStrength.label}</span>
                    </div>
                  </div>
                  <div className="h-1 w-full bg-gray-800 rounded-full overflow-hidden">
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
              <Label htmlFor="confirmPassword" className="text-gray-300">Confirm Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={(e) => updateFormData("confirmPassword", e.target.value)}
                  className="pl-10 h-12 bg-[#131B2E] border-[#2A3349] focus:border-gray-500 text-white"
                  required
                />
              </div>
            </div>
          </div>
        );
      
      case 2:
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="orgName" className="text-gray-300">Organization Name (Optional)</Label>
              <Input
                id="orgName"
                placeholder="Your Company"
                value={formData.orgName}
                onChange={(e) => updateFormData("orgName", e.target.value)}
                className="h-12 bg-[#131B2E] border-[#2A3349] focus:border-gray-500 text-white"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="jobTitle" className="text-gray-300">Job Title (Optional)</Label>
              <Input
                id="jobTitle"
                placeholder="Manager, Developer, etc."
                value={formData.jobTitle}
                onChange={(e) => updateFormData("jobTitle", e.target.value)}
                className="h-12 bg-[#131B2E] border-[#2A3349] focus:border-gray-500 text-white"
              />
            </div>
          </div>
        );
      
      case 3:
        return (
          <div className="space-y-6">
            <div className="bg-[#131B2E] p-4 rounded-lg">
              <h3 className="font-medium mb-2 text-gray-300">Account Summary</h3>
              <div className="grid grid-cols-2 gap-y-2">
                <div className="text-sm text-gray-500">Name:</div>
                <div className="text-sm font-medium text-white">{formData.name}</div>
                
                <div className="text-sm text-gray-500">Email:</div>
                <div className="text-sm font-medium text-white">{formData.email}</div>
                
                {formData.orgName && (
                  <>
                    <div className="text-sm text-gray-500">Organization:</div>
                    <div className="text-sm font-medium text-white">{formData.orgName}</div>
                  </>
                )}
                
                {formData.jobTitle && (
                  <>
                    <div className="text-sm text-gray-500">Job Title:</div>
                    <div className="text-sm font-medium text-white">{formData.jobTitle}</div>
                  </>
                )}
              </div>
            </div>
            
            <div className="flex items-start space-x-2">
              <Checkbox
                id="agreeTerms"
                checked={formData.agreeTerms}
                onCheckedChange={(checked) => updateFormData("agreeTerms", checked as boolean)}
                className="mt-1 border-gray-500 data-[state=checked]:bg-blue-500"
              />
              <Label htmlFor="agreeTerms" className="text-sm font-normal text-gray-400">
                I agree to the <Button variant="link" className="p-0 h-auto text-blue-400">Terms of Service</Button> and <Button variant="link" className="p-0 h-auto text-blue-400">Privacy Policy</Button>
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
              className="h-12 bg-transparent border-gray-700 text-white hover:bg-gray-800"
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
            className="h-12 bg-blue-600 hover:bg-blue-700"
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
          className="h-12 bg-transparent border-gray-700 text-white hover:bg-gray-800"
          onClick={handlePrevStep}
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        
        <Button
          type="submit"
          className="h-12 bg-blue-600 hover:bg-blue-700"
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
      
      {/* Right Column - Signup Form */}
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
          <div className="mb-4 text-center">
            <h1 className="text-3xl font-bold mb-2">Create an Account</h1>
            <p className="text-gray-400">
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
                  <div className="w-full border-t border-gray-700"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="bg-[#0A101F] px-2 text-gray-500">OR SIGN UP WITH</span>
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
            </>
          )}
          
          <p className="text-center text-sm text-gray-500 mt-6">
            Already have an account?{" "}
            <Button variant="link" className="p-0 h-auto font-normal text-blue-400" onClick={() => navigate("/login")}>
              Sign in
            </Button>
          </p>
        </div>
        
        <div className="p-6 text-center text-xs text-gray-600">
          © 2025 ChatSystem. All rights reserved.
        </div>
      </div>
    </div>
  );
}
