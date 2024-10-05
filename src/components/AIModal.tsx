import React from "react";
import Modal from "../UI/Modal";
import { AIModalProps } from "../types";
import { GeminiIcon } from "../UI/Icons";

const AIModal: React.FC<AIModalProps> = ({
  handleModalAction,
  setShowModal,
  showModal,
}) => {
  return (
    <Modal onClose={() => setShowModal(false)} show={showModal}>
      <div className="ai-modal-container ai-modal-container-spacing">
        <GeminiIcon />
        <h2 className="ai-modal-heading">
          Do you want to keep or discard pending AI edits?
        </h2>
        <div className="options-container options-container-spacing">
          <button
            onClick={() => handleModalAction("Accept")}
            className="option"
          >
            Accept
          </button>
          <button
            onClick={() => handleModalAction("Discard")}
            className="option"
          >
            Discard
          </button>
          <button onClick={() => setShowModal(false)} className="option">
            Cancel
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default AIModal;
