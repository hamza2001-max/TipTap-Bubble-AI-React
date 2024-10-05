import React, { useState, useRef, useEffect } from "react";
import { useAIPrompt } from "../hooks/useAIPrompt";
import PredefinedPromptsBox from "./PredefinedPromptsBox";
import { AIMenuProps } from "../types";
import {
  ChevronDownIcon,
  ChevronUpIcon,
  DefaultAIIcon,
  GeminiIcon,
  OpenAIIcon,
  SendIcon,
  UserIcon,
} from "../UI/Icons";

const AIMenu: React.FC<AIMenuProps> = ({
  aiMenuRef,
  selectedText,
  generatedText,
  handleAiSubmit,
  handleGeneratedTextAction,
  isLoading,
  APIType,
  setAPIType,
  error,
  configuration,
  prompts,
}) => {
  const [isTextExpanded, setIsTextExpanded] = useState(false);
  const [isTextOverflowing, setIsTextOverflowing] = useState(false);
  const aiPromptInputRef = useRef<HTMLInputElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const [showAPIType, setShowAPIType] = useState(false);
  const apiTypeRef = useRef<HTMLDivElement>(null);

  const { aiPrompt, setAiPrompt, filteredPrompts } = useAIPrompt(prompts);

  useEffect(() => {
    const checkTextOverflow = () => {
      if (textRef.current) {
        const computedStyle = getComputedStyle(textRef.current);
        let lineHeight = parseFloat(computedStyle.lineHeight);
  
        if (isNaN(lineHeight)) {
          lineHeight = 1.2 * parseFloat(computedStyle.fontSize);
        }
  
        const textHeight = textRef.current.scrollHeight;
        const lines = textHeight / lineHeight;
        setIsTextOverflowing(lines > 3);
      }
    };
    setTimeout(checkTextOverflow, 0);
  }, [selectedText]);
  

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        apiTypeRef.current &&
        !apiTypeRef.current.contains(event.target as Node)
      ) {
        setShowAPIType(false);
      }
    };

    if (showAPIType) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showAPIType]);

  const getAPIIcon = (type: string | null) => {
    switch (type) {
      case "openai":
        return <OpenAIIcon />;
      case "gemini":
        return <GeminiIcon />;
      default:
        return <DefaultAIIcon />;
    }
  };

  const enabledAIServices: string[] = [];
  if (configuration.OpenAI?.OpenAI_api_key) {
    enabledAIServices.push("openai");
  }
  if (configuration.Gemini?.Gemini_api_key) {
    enabledAIServices.push("gemini");
  }
  
  const canSelectAPI = enabledAIServices.length > 1;

  return (
    <div className="ai-menu-container" ref={aiMenuRef}>
      <div className="ai-menu">
        {selectedText && (
          <div className="text-area">
            <div className="selected-text-container text-container-spacing">
              <UserIcon />
              <div
                ref={textRef}
                className="selected-text"
                style={{
                  overflow: isTextExpanded ? "visible" : "hidden",
                  display: isTextExpanded ? "block" : "-webkit-box",
                  WebkitBoxOrient: "vertical",
                  WebkitLineClamp: isTextExpanded ? "none" : 3,
                }}
              >
                <p>{selectedText}</p>
              </div>
              {isTextOverflowing && (
                <button
                  onClick={() => setIsTextExpanded((prev) => !prev)}
                  style={{
                    marginLeft: "16px",
                    margin: "0"
                  }}
                >
                  {isTextExpanded ? <ChevronUpIcon /> : <ChevronDownIcon />}
                </button>
              )}
            </div>
            {!error ? (
              generatedText && (
                <div className="generated-text-container text-container-spacing">
                  {getAPIIcon(APIType)}
                  <div
                    style={{
                      width: "100%",
                    }}
                  >
                    <p className="generated-text">{generatedText}</p>
                  </div>
                </div>
              )
            ) : (
              <div className="error-text-container text-container-spacing">
                {getAPIIcon(APIType)}
                <p className="error-text">{error}</p>
              </div>
            )}
          </div>
        )}
        <div className="user-control-container user-control-container-spacing">
          {canSelectAPI ? (
            <div
              style={{
                position: "relative",
              }}
              ref={apiTypeRef}
            >
              {showAPIType && (
                <div className="show-api-type-container">
                  {configuration.OpenAI?.OpenAI_api_key && (
                    <div
                      className="show-api-type-openAI user-control-container-spacing"
                      onClick={() => {
                        setAPIType("openai");
                        setShowAPIType(false);
                      }}
                    >
                      <OpenAIIcon />
                      <span>OpenAI</span>
                    </div>
                  )}
                  {configuration.Gemini?.Gemini_api_key && (
                    <div
                      className="show-api-type-gemini user-control-container-spacing"
                      onClick={() => {
                        setAPIType("gemini");
                        setShowAPIType(false);
                      }}
                    >
                      <GeminiIcon />
                      <span>Gemini</span>
                    </div>
                  )}
                </div>
              )}
              <button
                onClick={() => setShowAPIType((prev) => !prev)}
                className="show-api-type-button"
              >
                {getAPIIcon(APIType)}
              </button>
            </div>
          ) : (
            <div>{getAPIIcon(enabledAIServices[0])}</div>
          )}

          {!isLoading ? (
            <input
              ref={aiPromptInputRef}
              type="text"
              placeholder="Ask AI anything..."
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              className="prompt-input"
              onKeyDown={async (e) => {
                if (e.key === "Enter" && aiPrompt.trim()) {
                  await handleAiSubmit(aiPrompt);
                }
              }}
            />
          ) : (
            <div className="generating-animation-container generating-animation-container-spacing">
              <h3
                style={{
                  fontSize: "16px",
                }}
              >
                Generating
              </h3>
              <div className="generating-animation-wrapper">
                <div className="blue ball"></div>
                <div className="red ball"></div>
                <div className="yellow ball"></div>
                <div className="green ball"></div>
              </div>
            </div>
          )}
          <button
            onClick={async () => await handleAiSubmit(aiPrompt)}
            disabled={!aiPrompt || isLoading}
          >
            {!isLoading && <SendIcon />}
          </button>
        </div>
      </div>
      {generatedText && (
        <div className="after-generation-options">
          {!error && (
            <button
              onClick={() => handleGeneratedTextAction("Accept")}
              className="option"
            >
              Accept
            </button>
          )}
          <button
            onClick={() => handleGeneratedTextAction("Discard")}
            className="option"
          >
            Discard
          </button>
          {!error && (
            <button
              onClick={() => handleGeneratedTextAction("Insert Below")}
              className="option"
            >
              Insert Below
            </button>
          )}
          <button onClick={() => handleAiSubmit(aiPrompt)} className="option">
            Try Again
          </button>
        </div>
      )}
      {filteredPrompts.length > 0 && !generatedText && (
        <PredefinedPromptsBox
          filteredPrompts={filteredPrompts}
          handlePredefinedPromptClick={handleAiSubmit}
        />
      )}
    </div>
  );
};

export default AIMenu;
