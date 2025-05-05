
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

interface TermsCheckboxProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}

export function TermsCheckbox({ checked, onCheckedChange }: TermsCheckboxProps) {
  return (
    <div className="flex items-center space-x-2">
      <Checkbox 
        id="terms" 
        checked={checked}
        onCheckedChange={(checked) => onCheckedChange(checked as boolean)}
        className="border-gray-500 data-[state=checked]:bg-blue-500"
      />
      <Label htmlFor="terms" className="text-sm font-normal text-gray-400">
        I agree to the <Button variant="link" className="p-0 h-auto text-blue-400">Terms of Service</Button> and <Button variant="link" className="p-0 h-auto text-blue-400">Privacy Policy</Button>
      </Label>
    </div>
  );
}
