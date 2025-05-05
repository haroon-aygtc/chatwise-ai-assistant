
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export function LoginLink() {
  const navigate = useNavigate();
  
  return (
    <p className="text-center text-sm text-gray-500 mt-8">
      Already have an account?{" "}
      <Button variant="link" className="p-0 h-auto font-normal text-blue-400" onClick={() => navigate("/login")}>
        Sign in
      </Button>
    </p>
  );
}
