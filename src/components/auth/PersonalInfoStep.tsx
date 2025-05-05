
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { User, Mail, Lock } from "lucide-react";

interface PersonalInfoStepProps {
  formData: {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
  };
  updateFormData: (key: string, value: string | boolean) => void;
  passwordStrength: {
    strength: number;
    label: string;
  };
}

export function PersonalInfoStep({ formData, updateFormData, passwordStrength }: PersonalInfoStepProps) {
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
}
