
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AIModel } from "@/types/ai-configuration";
import { useModelForm } from "./hooks/useModelForm";
import { ModelForm } from "./components/add-model/ModelForm";
import { ModelDialogFooter } from "./components/add-model/DialogFooter";

interface AddModelDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: (model: AIModel) => void;
}

export const AddModelDialog = ({
  open,
  onOpenChange,
  onSuccess,
}: AddModelDialogProps) => {
  const {
    provider,
    setProvider,
    name,
    setName,
    description,
    setDescription,
    version,
    setVersion,
    apiKey,
    setApiKey,
    temperature,
    setTemperature,
    maxTokens,
    setMaxTokens,
    isSubmitting,
    handleSubmit,
    isFormValid,
  } = useModelForm(onSuccess, onOpenChange);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add AI Model</DialogTitle>
            <DialogDescription>
              Configure a new AI model for your application
            </DialogDescription>
          </DialogHeader>
          
          <ModelForm
            provider={provider}
            setProvider={setProvider}
            name={name}
            setName={setName}
            description={description}
            setDescription={setDescription}
            version={version}
            setVersion={setVersion}
            apiKey={apiKey}
            setApiKey={setApiKey}
            temperature={temperature}
            setTemperature={setTemperature}
            maxTokens={maxTokens}
            setMaxTokens={setMaxTokens}
          />
          
          <ModelDialogFooter
            isSubmitting={isSubmitting}
            onCancel={() => onOpenChange(false)}
            isFormValid={isFormValid}
          />
        </form>
      </DialogContent>
    </Dialog>
  );
};
