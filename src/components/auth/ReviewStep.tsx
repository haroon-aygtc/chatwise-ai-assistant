
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface ReviewStepProps {
  formData: {
    name: string;
    email: string;
    orgName: string;
    agreeTerms: boolean;
  };
  updateFormData: (key: string, value: string | boolean) => void;
}

export function ReviewStep({ formData, updateFormData }: ReviewStepProps) {
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
}
