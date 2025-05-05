
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface OrganizationStepProps {
  formData: {
    orgName: string;
    jobTitle: string;
  };
  updateFormData: (key: string, value: string | boolean) => void;
}

export function OrganizationStep({ formData, updateFormData }: OrganizationStepProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="orgName" className="text-gray-300">Organization Name (Optional)</Label>
        <Input
          id="orgName"
          placeholder="Your Company"
          value={formData.orgName}
          onChange={(e) => updateFormData("orgName", e.target.value)}
          className="h-12 bg-[#131B2E] border-[#2A3349] focus:border-gray-500 text-white"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="jobTitle" className="text-gray-300">Job Title (Optional)</Label>
        <Input
          id="jobTitle"
          placeholder="Manager, Developer, etc."
          value={formData.jobTitle}
          onChange={(e) => updateFormData("jobTitle", e.target.value)}
          className="h-12 bg-[#131B2E] border-[#2A3349] focus:border-gray-500 text-white"
        />
      </div>
    </div>
  );
}
