import { useState, useEffect } from "react";
import predefinedPrompts from "../utils/predefinedPrompts";
import { Prompt, UseAIPromptReturn } from "../types";

export const useAIPrompt = (prompts: Prompt[] = predefinedPrompts): UseAIPromptReturn => {
  const [aiPrompt, setAiPrompt] = useState<string>("");
  const [filteredPrompts, setFilteredPrompts] = useState<Prompt[]>(prompts);

  useEffect(() => {
    if (aiPrompt) {
      const filtered = prompts.filter((prompt) =>
        prompt.text.toLowerCase().includes(aiPrompt.toLowerCase())
      );
      setFilteredPrompts(filtered);
    } else {
      setFilteredPrompts(prompts);
    }
  }, [aiPrompt, prompts]);

  return {
    aiPrompt,
    setAiPrompt,
    filteredPrompts,
  };
};
