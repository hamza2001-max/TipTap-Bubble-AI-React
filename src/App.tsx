import "./App.css";
import { useState } from "react";
import { BubbleMenu, EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Editor } from "@tiptap/core";
import BubbleAI from "./components/BubbleAI";
import { BubbleAIConfiguration } from "./types";

function App() {
  const [content, setContent] = useState<string>(
    `<p>Artificial Intelligence (AI) is transforming industries at a rapid pace. From healthcare to finance, AI is being used to automate processes and improve efficiency. One of the key areas where AI is making an impact is in data analysis. With the ability to process large datasets quickly, AI algorithms can identify patterns and insights that humans might miss. This allows businesses to make more informed decisions. AI is also being used in customer service, with chatbots and virtual assistants providing 24/7 support. In addition, AI-powered tools are helping with language translation, image recognition, and even creative writing. However, the rise of AI also raises important ethical questions. How do we ensure that AI systems are used responsibly and fairly? These are questions that society must grapple with as AI continues to evolve.</p>`
  );

  const editor = useEditor({
    extensions: [StarterKit],
    content: content,
    onUpdate: ({ editor }: { editor: Editor }) => {
      setContent(editor.getHTML());
    },
  });

  const newPrompts = [
    {
      text: "Improve Writing",
      prompt:
        "Refine and enhance the clarity, structure, and flow of the following text:",
    },
    {
      text: "Fix Grammar and Spelling",
      prompt:
        "Identify and correct grammatical errors, punctuation issues, and spelling mistakes in the following text:",
    },
    {
      text: "Change Tone To",
      prompt: "Modify the tone of the following text to [desired tone]:",
      options: ["Professional", "Straightforward", "Friendly"],
    },
  ];

  const configuration: BubbleAIConfiguration = {
    OpenAI: {
      OpenAI_api_key: import.meta.env.VITE_OPENAI_API_KEY,
      Model: "gpt-4o-mini",
    },
    Gemini: {
      Gemini_api_key: import.meta.env.VITE_GEMINI_API_KEY,
      Model: "gemini-1.5-flash",
    },
    prompts: {
      usePredefined: false,
      userPrompts: newPrompts,
    },
  };

  if (editor) {
    return (
      <>
        <EditorContent
          editor={editor}
          className="max-w-none p-4 focus:outline-none outline-none appearance-none"
        />
        <BubbleMenu editor={editor}>
          <BubbleAI editor={editor} configuration={configuration} />
        </BubbleMenu>
      </>
    );
  }
}

export default App;
