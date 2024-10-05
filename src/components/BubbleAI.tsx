import React, {
  useState,
  useCallback,
  useRef,
  useEffect,
  useMemo,
} from "react";
import { useAIService } from "../hooks/useAIService";
import AIMenu from "./AIMenu";
import AIModal from "./AIModal";
import { handleGeneratedTextAction } from "../utils/textUtils";
import predefinedPrompts from "../utils/predefinedPrompts";
import { Action, BubbleAIProps } from "../types";
import { BoltIcon } from "../UI/Icons";

const BubbleAI: React.FC<BubbleAIProps> = ({ editor, configuration }) => {
  const [isComponentActive, setIsComponentActive] = useState(false);
  const [selectedText, setSelectedText] = useState<string>("");
  const [generatedText, setGeneratedText] = useState<string | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);
  const aiMenuRef = useRef<HTMLDivElement>(null);
  const { processAIRequest } = useAIService(configuration);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [APIType, setAPIType] = useState<"openai" | "gemini" | null>("openai");
  const [error, setError] = useState<string>("");

  const promptsToUse = useMemo(() => {
    if (configuration.prompts.usePredefined) return predefinedPrompts;
    return configuration.prompts.userPrompts || [];
  }, [configuration.prompts]);

  useEffect(() => {
    const { state } = editor;
    const { from, to } = state.selection;
    const text = state.doc.textBetween(from, to, "");
    setSelectedText(text);
  }, [editor.view.state.selection]);

  const showModalIfNeeded = useCallback(() => {
    if (generatedText) {
      setShowModal(true);
    } else {
      false;
      setIsComponentActive(false);
    }
  }, [generatedText]);

  const handleAiSubmit = useCallback(
    async (promptToUse: string) => {
      const { view, state } = editor;
      const { from, to } = view.state.selection;
      const selectedText = state.doc.textBetween(from, to, "");

      setIsLoading(true);
      try {
        const aiResponse = await processAIRequest(
          promptToUse,
          selectedText,
          APIType
        );
        setGeneratedText(aiResponse);
        setError("");
      } catch (error: any) {
        setError(error.message);
      }
      setIsLoading(false);
    },
    [editor, processAIRequest, APIType]
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        aiMenuRef.current &&
        !aiMenuRef.current.contains(event.target as Node)
      ) {
        showModalIfNeeded();
      }
    };

    const handleEditorClick = (event: MouseEvent) => {
      if (isComponentActive) {
        event.preventDefault();
        event.stopPropagation();
        showModalIfNeeded();
      }
    };

    if (isComponentActive) {
      document.addEventListener("mousedown", handleClickOutside);
      editor.view.dom.addEventListener("mousedown", handleEditorClick, true);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      editor.view.dom.removeEventListener("mousedown", handleEditorClick, true);
    };
  }, [isComponentActive, showModalIfNeeded, editor]);

  const handleModalAction = useCallback(
    (action: "Accept" | "Discard") => {
      if (action === "Accept") {
        handleGeneratedTextAction(editor, generatedText, "Accept", resetStates);
      } else if (action === "Discard") {
        setGeneratedText(null);
      }
      setShowModal(false);
      setIsComponentActive(false);
    },
    [editor, generatedText]
  );

  const resetStates = useCallback(() => {
    setGeneratedText(null);
    setIsComponentActive(false);
  }, []);

  if (!editor) {
    return null;
  }

  return (
    <>
      <button
        onClick={() => setIsComponentActive(true)}
      >
        <BoltIcon />
      </button>
      {isComponentActive && (
        <AIMenu
          aiMenuRef={aiMenuRef}
          selectedText={selectedText}
          generatedText={generatedText}
          handleAiSubmit={handleAiSubmit}
          handleGeneratedTextAction={(action: Action) =>
            handleGeneratedTextAction(
              editor,
              generatedText,
              action,
              resetStates
            )
          }
          isLoading={isLoading}
          APIType={APIType}
          setAPIType={setAPIType}
          error={error}
          prompts={promptsToUse}
          configuration={configuration}
        />
      )}
      {showModal && (
        <AIModal
          handleModalAction={handleModalAction}
          setShowModal={setShowModal}
          showModal={showModal}
        />
      )}
    </>
  );
};

export default BubbleAI;
