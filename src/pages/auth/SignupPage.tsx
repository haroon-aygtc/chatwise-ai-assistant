
import AuthLayout from "@/modules/auth/components/AuthLayout";
import { SignupForm } from "@/modules/auth/components/SignupForm";

export default function SignupPage() {
  return (
    <AuthLayout 
      title="Create an Account" 
      description="Fill in the details below to create your account"
    >
      <SignupForm />
    </AuthLayout>
  );
}
