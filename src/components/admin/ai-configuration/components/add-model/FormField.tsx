
import React from "react";
import { Label } from "@/components/ui/label";

interface FormFieldProps {
  id: string;
  label: string;
  render: () => React.ReactNode;
}

export const FormField = ({ id, label, render }: FormFieldProps) => {
  return (
    <div className="grid grid-cols-4 items-center gap-4">
      <Label htmlFor={id} className="text-right">
        {label}
      </Label>
      <div className="col-span-3">
        {render()}
      </div>
    </div>
  );
};
