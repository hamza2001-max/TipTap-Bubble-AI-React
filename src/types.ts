import { Editor } from "@tiptap/react";
import { ReactNode, RefObject } from "react";

export type Action = "Accept" | "Insert Below" | "Discard";

export interface Prompt {
  text: string;
  prompt: string;
  options?: string[];
}

export interface UseAIPromptReturn {
  aiPrompt: string;
  setAiPrompt: React.Dispatch<React.SetStateAction<string>>;
  filteredPrompts: Prompt[];
}

export interface Configuration {
  OpenAI?: {
    OpenAI_api_key: string;
    Model: string;
  };
  Gemini?: {
    Gemini_api_key: string;
    Model: string;
  };
}

export interface AIResponse {
  content: string;
}

export type APIType = "openai" | "gemini" | null;

export interface AIMenuProps {
  aiMenuRef: RefObject<HTMLDivElement>;
  selectedText: string;
  generatedText: string | null;
  handleAiSubmit: (prompt: string) => Promise<void>;
  handleGeneratedTextAction: (action: Action) => void;
  isLoading: boolean;
  APIType: string | null;
  setAPIType: (type: "openai" | "gemini" | null) => void;
  error: string;
  configuration: Configuration;
  prompts: Prompt[];
}

export interface AIModalProps {
  handleModalAction: (action: "Accept" | "Discard") => void;
  setShowModal: (show: boolean) => void;
  showModal: boolean;
}

export type BubbleAIConfiguration = {
  OpenAI?: {
    OpenAI_api_key: string;
    Model: string;
  };
  Gemini?: {
    Gemini_api_key: string;
    Model: string;
  };
  prompts: {
    usePredefined: boolean;
    userPrompts: Prompt[] | null;
  };
};

export type BubbleAIProps = {
  editor: Editor;
  configuration: BubbleAIConfiguration;
};

export interface PredefinedPromptsBoxProps {
  filteredPrompts: Prompt[];
  handlePredefinedPromptClick: (prompt: string) => void;
}

export interface ModalProps {
  children: ReactNode;
  show?: boolean;
  closeable?: boolean;
  onClose?: () => void;
  className?: string;
}
