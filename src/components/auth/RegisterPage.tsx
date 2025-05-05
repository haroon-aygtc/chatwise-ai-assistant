import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import AuthLayout from "./AuthLayout";
import {
  ArrowRight,
  Check,
  Github,
  Mail,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

// Define the validation schema using zod
const registerSchema = z
  .object({
    fullName: z
      .string()
      .min(2, { message: "Name must be at least 2 characters" }),
    email: z.string().email({ message: "Please enter a valid email address" }),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters" })
      .regex(/[A-Z]/, {
        message: "Password must contain at least one uppercase letter",
      })
      .regex(/[0-9]/, { message: "Password must contain at least one number" }),
    confirmPassword: z.string(),
    agreeToTerms: z.boolean().refine((val) => val === true, {
      message: "You must agree to the terms and conditions",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type RegisterFormValues = z.infer<typeof registerSchema>;

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register: registerUser } = useAuth();

  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [apiError, setApiError] = useState<string | null>(null);
  const [registerSuccess, setRegisterSuccess] = useState(false);

  // Initialize react-hook-form with zod resolver
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    trigger,
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
      agreeToTerms: false,
    },
  });

  // Watch password field for strength calculation
  const password = watch("password");

  // Calculate password strength whenever password changes
  useEffect(() => {
    if (password) {
      calculatePasswordStrength(password);
    }
  }, [password]);

  const calculatePasswordStrength = (password: string) => {
    // Simple password strength calculation
    let strength = 0;
    if (password.length > 6) strength += 25;
    if (password.length > 10) strength += 25;
    if (/[A-Z]/.test(password)) strength += 25;
    if (/[0-9]/.test(password)) strength += 25;
    setPasswordStrength(strength);
  };

  const getPasswordStrengthText = () => {
    if (passwordStrength <= 25) return "Weak";
    if (passwordStrength <= 50) return "Fair";
    if (passwordStrength <= 75) return "Good";
    return "Strong";
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength <= 25) return "bg-red-500";
    if (passwordStrength <= 50) return "bg-yellow-500";
    if (passwordStrength <= 75) return "bg-blue-500";
    return "bg-green-500";
  };

  const handleNextStep = async () => {
    // Validate only the fields in step 1
    const isValid = await trigger(["fullName", "email"]);
    if (isValid) {
      setStep(2);
    }
  };

  const handleRegister = async (data: RegisterFormValues) => {
    setApiError(null);
    setIsLoading(true);

    try {
      const success = await registerUser(
        data.fullName,
        data.email,
        data.password,
        data.confirmPassword,
      );

      if (success) {
        setRegisterSuccess(true);
        // Redirect after a short delay to show success message
        setTimeout(() => {
          navigate("/dashboard");
        }, 1500);
      } else {
        setApiError("Registration failed. Please try again.");
      }
    } catch (error: any) {
      console.error("Registration failed:", error);
      setApiError(
        error.response?.data?.message ||
          error.response?.data?.data?.message ||
          "Registration failed. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Create an account"
      description="Enter your information to get started"
    >
      <div className="space-y-6">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div
                className={`h-8 w-8 rounded-full flex items-center justify-center ${step >= 1 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}
              >
                {step > 1 ? <Check className="h-4 w-4" /> : "1"}
              </div>
              <span className="text-sm font-medium">Account</span>
            </div>
            <Separator className="flex-1 mx-4" />
            <div className="flex items-center gap-2">
              <div
                className={`h-8 w-8 rounded-full flex items-center justify-center ${step >= 2 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}
              >
                2
              </div>
              <span className="text-sm font-medium">Security</span>
            </div>
          </div>
        </div>

        {apiError && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{apiError}</AlertDescription>
          </Alert>
        )}

        {registerSuccess && (
          <Alert className="mb-4 border-green-500 text-green-500">
            <CheckCircle2 className="h-4 w-4" />
            <AlertDescription>
              Registration successful! Redirecting to dashboard...
            </AlertDescription>
          </Alert>
        )}

        {step === 1 ? (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleNextStep();
            }}
            className="space-y-4"
          >
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                {...register("fullName")}
                placeholder="John Doe"
                className={`h-12 ${errors.fullName ? "border-red-500 focus-visible:ring-red-500" : ""}`}
              />
              {errors.fullName && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.fullName.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                {...register("email")}
                placeholder="name@example.com"
                className={`h-12 ${errors.email ? "border-red-500 focus-visible:ring-red-500" : ""}`}
              />
              {errors.email && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>
            <Button type="submit" className="w-full h-12 text-base font-medium">
              <div className="flex items-center gap-2">
                <span>Continue</span>
                <ArrowRight className="h-4 w-4" />
              </div>
            </Button>
          </form>
        ) : (
          <form onSubmit={handleSubmit(handleRegister)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                {...register("password")}
                placeholder="••••••••"
                className={`h-12 ${errors.password ? "border-red-500 focus-visible:ring-red-500" : ""}`}
              />
              {errors.password && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.password.message}
                </p>
              )}
              {password && (
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span>Password strength:</span>
                    <span
                      className={
                        passwordStrength > 75
                          ? "text-green-500"
                          : passwordStrength > 50
                            ? "text-blue-500"
                            : passwordStrength > 25
                              ? "text-yellow-500"
                              : "text-red-500"
                      }
                    >
                      {getPasswordStrengthText()}
                    </span>
                  </div>
                  <Progress
                    value={passwordStrength}
                    className={getPasswordStrengthColor()}
                  />
                </div>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                {...register("confirmPassword")}
                placeholder="••••••••"
                className={`h-12 ${errors.confirmPassword ? "border-red-500 focus-visible:ring-red-500" : ""}`}
              />
              {errors.confirmPassword && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="agreeToTerms"
                {...register("agreeToTerms")}
                onCheckedChange={(checked) =>
                  setValue("agreeToTerms", !!checked, { shouldValidate: true })
                }
              />
              <Label
                htmlFor="agreeToTerms"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                I agree to the{" "}
                <Link
                  to="/terms"
                  className="text-primary hover:underline"
                  target="_blank"
                >
                  terms of service
                </Link>{" "}
                and{" "}
                <Link
                  to="/privacy"
                  className="text-primary hover:underline"
                  target="_blank"
                >
                  privacy policy
                </Link>
              </Label>
            </div>
            {errors.agreeToTerms && (
              <p className="text-sm text-red-500 mt-1">
                {errors.agreeToTerms.message}
              </p>
            )}
            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                className="flex-1 h-12"
                onClick={() => setStep(1)}
              >
                Back
              </Button>
              <Button
                type="submit"
                className="flex-1 h-12 text-base font-medium"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 rounded-full border-2 border-t-transparent border-white animate-spin"></div>
                    <span>Creating account...</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <span>Create account</span>
                    <ArrowRight className="h-4 w-4" />
                  </div>
                )}
              </Button>
            </div>
          </form>
        )}

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Or continue with
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Button variant="outline" className="h-12">
            <Github className="mr-2 h-4 w-4" />
            GitHub
          </Button>
          <Button variant="outline" className="h-12">
            <Mail className="mr-2 h-4 w-4" />
            Google
          </Button>
        </div>

        <div className="text-center text-sm">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-medium text-primary hover:underline"
          >
            Sign in
          </Link>
        </div>
      </div>
    </AuthLayout>
  );
};

export default RegisterPage;
