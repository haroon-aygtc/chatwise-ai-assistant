
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { SignupSteps } from "@/components/auth/SignupSteps";
import { Github } from "lucide-react";

export default function SignupPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
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

  return (
    <AuthLayout>
      <SignupSteps 
        formData={formData} 
        updateFormData={updateFormData} 
        isLoading={isLoading} 
        handleSignup={handleSignup} 
      />
      
      <p className="text-center text-sm text-gray-500 mt-6">
        Already have an account?{" "}
        <Button variant="link" className="p-0 h-auto font-normal text-blue-400" onClick={() => navigate("/login")}>
          Sign in
        </Button>
      </p>
    </AuthLayout>
  );
}
