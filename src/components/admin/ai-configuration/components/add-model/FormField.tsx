import { ReactNode } from "react";

interface FormFieldProps {
  id: string;
  label: string;
  render: () => ReactNode;
}

export const FormField = ({ id, label, render }: FormFieldProps) => {
  return (
    <div className="grid grid-cols-4 items-center gap-4">
      <label htmlFor={id} className="text-right text-sm font-medium">
        {label}
      </label>
      <div className="col-span-3">{render()}</div>
    </div>
  );
};
