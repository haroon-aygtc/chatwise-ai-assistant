import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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
import { Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/hooks/auth/useAuth";
import { getCsrfToken } from "@/services/api/api";

const formSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(1, {
    message: "Password is required.",
  }),
  remember: z.boolean().default(false),
});

export function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { login, updateUser } = useAuth();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      remember: false,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      // First, fetch a fresh CSRF token
      await getCsrfToken();

      console.log('CSRF token fetched, proceeding with login');

      // Now attempt the login
      await login(values.email, values.password, values.remember);

      toast({
        title: "Login successful!",
        description: "Welcome back to ChatSystem.",
      });

      // Check if there's a redirect URL in session storage
      const redirectUrl = sessionStorage.getItem('redirectAfterLogin');
      if (redirectUrl) {
        sessionStorage.removeItem('redirectAfterLogin');
        navigate(redirectUrl);
      } else {
        navigate('/dashboard');
      }
    } catch (error) {
      console.error("Login error:", error);
      toast({
        variant: "destructive",
        title: "Login failed",
        description: "Invalid email or password. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  // Updated mock login function to properly set authentication state
  const handleMockLogin = () => {
    setIsLoading(true);

    // Mock user data that would normally come from the backend
    // Make sure the Role type is properly satisfied with all required fields
    const mockUser = {
      id: "mock-user-1",
      name: "Mock User",
      email: "user@example.com",
      status: "active" as "active" | "inactive" | "pending", // Explicitly type as one of the allowed values
      avatar_url: null,
      last_active: new Date().toISOString(),
      roles: [{
        id: "1",
        name: "user",
        description: "Regular user role",
        permissions: ["access dashboard", "view profile"]
      }],
      permissions: ["access dashboard", "view profile"]
    };

    // Mock token for storage
    const mockToken = "mock-jwt-token-" + Date.now();

    // Store the mock token in localStorage (similar to what tokenService does)
    localStorage.setItem("token", mockToken);

    setTimeout(() => {
      // Update the user state in the auth context
      updateUser(mockUser);

      toast({
        title: "Mock Login Successful!",
        description: "Bypassing API for development purposes.",
      });

      // Check for redirect URL same as real login
      const redirectUrl = sessionStorage.getItem('redirectAfterLogin');
      if (redirectUrl) {
        sessionStorage.removeItem('redirectAfterLogin');
        navigate(redirectUrl);
      } else {
        navigate('/dashboard');
      }

      setIsLoading(false);
    }, 1000);
  }

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <FormField
            control={form.control}
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

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center justify-between">
                  <FormLabel>Password</FormLabel>
                  <Link
                    to="/reset-password"
                    className="text-sm font-medium text-primary hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>
                <FormControl>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
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
            control={form.control}
            name="remember"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Remember me for 30 days</FormLabel>
                </div>
              </FormItem>
            )}
          />

          <div className="space-y-2">
            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Sign in"}
            </Button>

            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={handleMockLogin}
              disabled={isLoading}
            >
              {isLoading ? "Please wait..." : "Mock Login (Development Only)"}
            </Button>
          </div>
        </form>
      </Form>

      <div className="text-center text-sm">
        Don't have an account?{" "}
        <Link
          to="/signup"
          className="text-primary font-medium hover:underline"
        >
          Sign up
        </Link>
      </div>
    </div>
  );
}
