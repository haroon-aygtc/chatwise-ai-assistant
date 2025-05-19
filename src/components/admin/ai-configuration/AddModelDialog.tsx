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
    modelId,
    setModelId,
    organization,
    setOrganization,
    topP,
    setTopP,
    topK,
    setTopK,
    frequencyPenalty,
    setFrequencyPenalty,
    presencePenalty,
    setPresencePenalty,
    repetitionPenalty,
    setRepetitionPenalty,
    task,
    setTask,
    waitForModel,
    setWaitForModel,
    routeType,
    setRouteType,
    safePrompt,
    setSafePrompt,
    baseUrl,
    setBaseUrl,
    isSubmitting,
    handleSubmit,
    isFormValid,
  } = useModelForm(onSuccess, onOpenChange);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
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
            modelId={modelId}
            setModelId={setModelId}
            organization={organization}
            setOrganization={setOrganization}
            topP={topP}
            setTopP={setTopP}
            topK={topK}
            setTopK={setTopK}
            frequencyPenalty={frequencyPenalty}
            setFrequencyPenalty={setFrequencyPenalty}
            presencePenalty={presencePenalty}
            setPresencePenalty={setPresencePenalty}
            repetitionPenalty={repetitionPenalty}
            setRepetitionPenalty={setRepetitionPenalty}
            task={task}
            setTask={setTask}
            waitForModel={waitForModel}
            setWaitForModel={setWaitForModel}
            routeType={routeType}
            setRouteType={setRouteType}
            safePrompt={safePrompt}
            setSafePrompt={setSafePrompt}
            baseUrl={baseUrl}
            setBaseUrl={setBaseUrl}
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
