
import AuthLayout from "@/modules/auth/components/AuthLayout";
import { LoginForm } from "@/modules/auth/components/LoginForm";

export default function LoginPage() {
  return (
    <AuthLayout 
      title="Welcome Back" 
      description="Enter your credentials to sign in to your account"
    >
      <LoginForm />
    </AuthLayout>
  );
}
