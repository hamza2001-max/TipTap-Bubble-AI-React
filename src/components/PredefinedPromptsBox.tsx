import React, { useState } from "react";
import { PredefinedPromptsBoxProps } from "../types";
import { ChevronRightIcon } from "../UI/Icons";

const PredefinedPromptsBox: React.FC<PredefinedPromptsBoxProps> = ({
  filteredPrompts,
  handlePredefinedPromptClick,
}) => {
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);

  const toggleDropdown = (index: number) => {
    setActiveDropdown(activeDropdown === index ? null : index);
  };

  return (
    <div className="predefinedPrompts-container">
      {filteredPrompts.map((prompt, index) => (
        <div key={index} className="predefinedPrompts-button-wrapper">
          <button
            onClick={() =>
              prompt.options
                ? toggleDropdown(index)
                : handlePredefinedPromptClick(prompt.prompt)
            }
            className="predefinedPrompts-button"
          >
            {prompt.text}
            {prompt.options && <ChevronRightIcon />}
          </button>
          {prompt.options && activeDropdown === index && (
            <div className="predefinedPrompts-options">
              {prompt.options.map((option, optionIndex) => (
                <button
                  key={optionIndex}
                  onClick={() =>
                    handlePredefinedPromptClick(`${(prompt.text, " ", option)}`)
                  }
                  className="option"
                >
                  {option}
                </button>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default PredefinedPromptsBox;
