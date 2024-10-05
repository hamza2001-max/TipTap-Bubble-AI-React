import { Editor } from "@tiptap/react";
import { Action } from "../types";

export const handleGeneratedTextAction = (
  editor: Editor,
  generatedText: string | null,
  action: Action,
  resetStates: () => void
): void => {
  const { view } = editor;
  const { from, to } = view.state.selection;

  switch (action) {
    case "Accept":
      generatedText &&
        view.dispatch(
          view.state.tr.replaceWith(
            from,
            to,
            view.state.schema.text(generatedText)
          )
        );
      resetStates();
      break;
    case "Insert Below":
      view.dispatch(
        view.state.tr.insert(to, view.state.schema.text("\n" + generatedText))
      );
      resetStates();
      break;
    case "Discard":
      resetStates();
      break;
    default:
      console.warn("Unknown action:", action);
  }
};
