import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Eye, EyeOff, ArrowLeft } from "lucide-react";
import { AuthService } from "@/services/auth";
import AuthLayout from "@/modules/auth/components/AuthLayout";

// Schema for requesting password reset
const requestSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
});

// Schema for password reset form (with token)
const resetSchema = z.object({
  password: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export function ResetPasswordForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const email = searchParams.get("email");
  const { toast } = useToast();
  const navigate = useNavigate();

  // Form for requesting password reset (step 1)
  const requestForm = useForm<z.infer<typeof requestSchema>>({
    resolver: zodResolver(requestSchema),
    defaultValues: {
      email: email || "",
    },
  });

  // Form for setting new password (step 2)
  const resetForm = useForm<z.infer<typeof resetSchema>>({
    resolver: zodResolver(resetSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  // Handle request password reset
  async function onRequestSubmit(values: z.infer<typeof requestSchema>) {
    setIsLoading(true);
    try {
      await AuthService.requestPasswordReset(values.email);
      setEmailSent(true);
      toast({
        title: "Reset link sent",
        description: "Check your email for a link to reset your password.",
      });
    } catch (error) {
      console.error("Reset request error:", error);
      toast({
        variant: "destructive",
        title: "Request failed",
        description: "There was a problem sending your reset link. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  // Handle password reset with token
  async function onResetSubmit(values: z.infer<typeof resetSchema>) {
    if (!token || !email) return;
    
    setIsLoading(true);
    try {
      await AuthService.resetPassword({
        token,
        email,
        password: values.password,
        password_confirmation: values.confirmPassword,
      });
      
      toast({
        title: "Password reset successful",
        description: "Your password has been reset. You can now log in with your new password.",
      });
      
      navigate("/login");
    } catch (error) {
      console.error("Password reset error:", error);
      toast({
        variant: "destructive",
        title: "Reset failed",
        description: "There was a problem resetting your password. The link may have expired.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <AuthLayout 
      title={token ? "Reset Your Password" : "Forgot Your Password?"}
      description={token 
        ? "Enter your new password below."
        : "Enter your email and we'll send you a reset link."
      }
    >
      <div className="space-y-6">
        {!token ? (
          // Step 1: Request password reset
          <>
            {!emailSent ? (
              <Form {...requestForm}>
                <form onSubmit={requestForm.handleSubmit(onRequestSubmit)} className="space-y-5">
                  <FormField
                    control={requestForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="Enter your email" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isLoading}
                  >
                    {isLoading ? "Sending reset link..." : "Send Reset Link"}
                  </Button>
                </form>
              </Form>
            ) : (
              // Email sent confirmation
              <div className="space-y-4 p-6 bg-primary/5 rounded-lg text-center">
                <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-primary"
                  >
                    <rect width="20" height="16" x="2" y="4" rx="2" />
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium">Check your email</h3>
                <p className="text-sm text-muted-foreground">
                  We've sent a password reset link to <strong>{requestForm.getValues().email}</strong>
                </p>
                <div className="pt-2">
                  <Button
                    variant="outline"
                    onClick={() => setEmailSent(false)}
                    className="mt-2"
                  >
                    Send to a different email
                  </Button>
                </div>
              </div>
            )}
          </>
        ) : (
          // Step 2: Reset password with token
          <Form {...resetForm}>
            <form onSubmit={resetForm.handleSubmit(onResetSubmit)} className="space-y-5">
              <FormField
                control={resetForm.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="Create a new password"
                          {...field}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-0 top-0 h-full px-3 py-2"
                          onClick={() => setShowPassword(!showPassword)}
                          tabIndex={-1}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={resetForm.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="Confirm your new password"
                          {...field}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-0 top-0 h-full px-3 py-2"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          tabIndex={-1}
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? "Resetting password..." : "Reset Password"}
              </Button>
            </form>
          </Form>
        )}
        
        <div className="text-center text-sm">
          <Link
            to="/login"
            className="text-primary font-medium hover:underline inline-flex items-center"
          >
            <ArrowLeft className="mr-1 h-4 w-4" /> Back to login
          </Link>
        </div>
      </div>
    </AuthLayout>
  );
}
