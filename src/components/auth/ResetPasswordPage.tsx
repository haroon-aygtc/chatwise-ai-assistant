import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { authService } from "@/services/auth";
import { ApiError } from "@/services/api/base";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import AuthLayout from "./AuthLayout";
import { ArrowRight, ArrowLeft, CheckCircle, Lock } from "lucide-react";

const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    token: "",
  });

  useEffect(() => {
    // Get token and email from URL parameters
    const token = searchParams.get("token");
    const email = searchParams.get("email");

    if (token && email) {
      setFormData((prev) => ({
        ...prev,
        token,
        email: decodeURIComponent(email),
      }));
    } else {
      setError("Invalid password reset link. Please request a new one.");
    }
  }, [searchParams]);
  const [passwordStrength, setPasswordStrength] = useState(0);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Calculate password strength when password field changes
    if (name === "password") {
      calculatePasswordStrength(value);
    }
  };

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    try {
      await authService.resetPassword({
        email: formData.email,
        password: formData.password,
        password_confirmation: formData.confirmPassword,
        token: formData.token,
      });
      setIsSubmitted(true);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message || "Failed to reset password");
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleContinue = () => {
    navigate("/login");
  };

  return (
    <AuthLayout
      title="Create new password"
      description="Enter your new password below"
      showImagePanel={true}
    >
      <div className="space-y-6">
        {!isSubmitted ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <div className="space-y-2">
              <Label htmlFor="password">New Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                required
                className="h-12"
              />
              {formData.password && (
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
                name="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                className="h-12"
              />
              {formData.password &&
                formData.confirmPassword &&
                formData.password !== formData.confirmPassword && (
                  <p className="text-xs text-red-500">Passwords do not match</p>
                )}
            </div>
            <Button
              type="submit"
              className="w-full h-12 text-base font-medium"
              disabled={
                isLoading ||
                formData.password !== formData.confirmPassword ||
                !formData.password
              }
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 rounded-full border-2 border-t-transparent border-white animate-spin"></div>
                  <span>Updating password...</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <span>Reset password</span>
                  <ArrowRight className="h-4 w-4" />
                </div>
              )}
            </Button>
          </form>
        ) : (
          <div className="space-y-4">
            <div className="flex flex-col items-center justify-center py-4">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <CheckCircle className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-medium">Password reset successful</h3>
              <p className="text-center text-muted-foreground mt-2">
                Your password has been reset successfully. You can now log in
                with your new password.
              </p>
            </div>
            <Button
              className="w-full h-12 text-base font-medium"
              onClick={handleContinue}
            >
              <div className="flex items-center gap-2">
                <Lock className="h-4 w-4" />
                <span>Continue to login</span>
              </div>
            </Button>
          </div>
        )}

        {!isSubmitted && (
          <div className="text-center text-sm">
            <Link
              to="/login"
              className="flex items-center justify-center gap-2 text-primary hover:underline"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to login
            </Link>
          </div>
        )}
      </div>
    </AuthLayout>
  );
};

export default ResetPasswordPage;
