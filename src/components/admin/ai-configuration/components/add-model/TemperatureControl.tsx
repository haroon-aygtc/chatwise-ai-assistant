import { Slider } from "@/components/ui/slider";
import { FormField } from "./FormField";

interface TemperatureControlProps {
  temperature: number;
  setTemperature: (temperature: number) => void;
}

export const TemperatureControl = ({
  temperature,
  setTemperature,
}: TemperatureControlProps) => {
  const handleTemperatureChange = (values: number[]) => {
    setTemperature(values[0]);
  };

  // Get description based on temperature value
  const getTemperatureDescription = () => {
    if (temperature <= 0.3) return "More deterministic, focused responses";
    if (temperature <= 0.7) return "Balanced creativity and coherence";
    if (temperature <= 1.2) return "More creative, varied responses";
    return "Highly creative, potentially unpredictable";
  };

  return (
    <FormField
      id="temperature"
      label={`Temperature: ${temperature.toFixed(1)}`}
      render={() => (
        <div className="space-y-2">
          <Slider
            id="temperature"
            min={0}
            max={2}
            step={0.1}
            value={[temperature]}
            onValueChange={handleTemperatureChange}
          />
          <p className="text-xs text-muted-foreground">
            {getTemperatureDescription()}
          </p>
        </div>
      )}
    />
  );
};
