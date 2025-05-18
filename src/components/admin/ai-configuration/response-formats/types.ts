
import { ResponseFormat } from "@/types/ai-configuration";

export interface FormatSettingsCardProps {
  formatSettings: Partial<ResponseFormat>;
  setFormatSettings: (settings: Partial<ResponseFormat>) => void;
  handleSave: () => void;
  onDelete?: () => void;
  isNew?: boolean;
  isLoading?: boolean;
}

export interface FormatPreviewTabProps {
  testPrompt: string;
  testResponse: string;
  formatSettings: Partial<ResponseFormat>;
  onGoToSettings: () => void;
}

export interface TestPromptCardProps {
  value: string;
  onChange: (value: string) => void;
  selectedFormatId: string;
  onTest: () => void;
  isLoading?: boolean;
}

export interface PreviewCardProps {
  formattedResponse: string;
  isLoading?: boolean;
}

export interface SavedFormatCardProps {
  formats: ResponseFormat[];
  selectedFormatId: string;
  onSelectFormat: (format: ResponseFormat) => void;
  onNewFormat: () => void;
  isLoading?: boolean;
}
