
import React from "react";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

interface TemperatureControlProps {
  temperature: number;
  setTemperature: (temperature: number) => void;
}

export const TemperatureControl = ({ temperature, setTemperature }: TemperatureControlProps) => {
  return (
    <div className="grid grid-cols-4 items-start gap-4">
      <Label className="text-right pt-2">Temperature</Label>
      <div className="col-span-3 space-y-1">
        <Slider
          value={[temperature]}
          min={0}
          max={1}
          step={0.1}
          onValueChange={(value) => setTemperature(value[0])}
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Precise (0.0)</span>
          <span>{temperature.toFixed(1)}</span>
          <span>Creative (1.0)</span>
        </div>
      </div>
    </div>
  );
};
