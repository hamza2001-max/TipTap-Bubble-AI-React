# BubbleAI

BubbleAI is a powerful and flexible AI-powered text editing tool that can be easily integrated into your React applications. It supports multiple AI providers and allows for custom prompts to enhance your text editing experience.

## Installation

```bash
npm i tiptap-bubble-ai-react
```

## Usage

### JavaScript

```javascript
import { useState } from "react";
import StarterKit from "@tiptap/starter-kit";
import { BubbleMenu, EditorContent, useEditor } from "@tiptap/react";
import { BubbleAI } from "tiptap-bubble-ai-react";
import "tiptap-bubble-ai-react/dist/index.css";

const MyEditor = () => {
  const [content, setContent] = useState(
    `<p>Artificial Intelligence (AI) is transforming industries at a rapid pace. From healthcare to finance, AI is being used to automate processes and improve efficiency. One of the key areas where AI is making an impact is in data analysis.</p>`);

  const editor = useEditor({
    extensions: [StarterKit],
    content: content,
    onUpdate: ({ editor }: { editor: Editor }) => {
      setContent(editor.getHTML());
    },
  });

  const configuration = {
    OpenAI: {
      OpenAI_api_key: "your-openai-api-key",
      Model: "gpt-4o-mini",
    },
    Gemini: {
      Gemini_api_key: "your-gemini-api-key",
      Model: "gemini-1.5-flash",
    },
    prompts: {
      usePredefined: true,
      userPrompts: null
    },
  };

  return (
    <>
        <EditorContent editor={editor} />
        <BubbleMenu editor={editor}>
            <BubbleAI editor={editor} configuration={configuration} />
        </BubbleMenu>
    </>
  );
};

export default MyEditor;
```

### TypeScript

```typescript
import { useState } from "react";
import StarterKit from "@tiptap/starter-kit";
import { BubbleMenu, EditorContent, useEditor } from "@tiptap/react";
import { BubbleAI, BubbleAIConfiguration } from "tiptap-bubble-ai-react";
import "tiptap-bubble-ai-react/dist/index.css";

const MyEditor = () => {
  const [content, setContent] = useState<string>(
    `<p>Artificial Intelligence (AI) is transforming industries at a rapid pace. From healthcare to finance, AI is being used to automate processes and improve efficiency. One of the key areas where AI is making an impact is in data analysis.</p>`);

  const editor = useEditor({
    extensions: [StarterKit],
    content: content,
    onUpdate: ({ editor }: { editor: Editor }) => {
      setContent(editor.getHTML());
    },
  });

  const configuration: BubbleAIConfiguration = {
    OpenAI: {
      OpenAI_api_key: "your-openai-api-key",
      Model: "gpt-4o-mini",
    },
    Gemini: {
      Gemini_api_key: "your-gemini-api-key",
      Model: "gemini-1.5-flash",
    },
    prompts: {
      usePredefined: true,
      userPrompts: null,
    },
  };

  return (
    <>
        <EditorContent editor={editor} />
        <BubbleMenu editor={editor}>
            <BubbleAI editor={editor} configuration={configuration} />
        </BubbleMenu>
    </>
  );
};

export default MyEditor;
```

## Configuration

The `BubbleAIConfiguration` object allows you to customize behavior of BubbleAI. Here's a breakdown of its properties:

```typescript
interface BubbleAIConfiguration {
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
}

interface Prompt {
  text: string;
  prompt: string;
  options?: string[];
}
```

- `OpenAI` (optional): Configuration for OpenAI integration.

  - `OpenAI_api_key`: Your OpenAI API key.
  - `Model`: The OpenAI model to use (e.g., 'gpt-4o-mini').

- `Gemini` (optional): Configuration for Gemini integration.

  - `Gemini_api_key`: Your Gemini API key.
  - `Model`: The Gemini model to use (e.g., 'gemini-1.5-flash').

- `prompts`: Configuration for AI prompts.
  - `usePredefined`: Set to `true` to use predefined prompts, `false` to use custom prompts.
  - `userPrompts`: An array of custom prompts (only used when `usePredefined` is `false`). An Example of it can be seen below for reference.

```typescript
    prompts: {
      usePredefined: false,
      userPrompts:  [
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
        ],
    },
```

## Components

### BubbleMenu

The `BubbleMenu` component is a container for the BubbleAI functionality. It should wrap the `BubbleAI` component.

Props:

- `editor`: The editor instance (required)

### BubbleAI

The `BubbleAI` component provides the AI-powered text editing functionality.

Props:

- `editor`: The editor instance (required)
- `configuration`: The `BubbleAIConfiguration` object (required)

## Troubleshooting

When using BubbleAI with Vite, you may encounter certain errors related to missing Node.js polyfills. This is because Vite, doesn't include some Node.js core modules by default.

#### Common Errors

1. `Uncaught TypeError: util.inherits is not a function`
2. `Uncaught ReferenceError: process is not defined`

#### Solution: Using vite-plugin-node-polyfills

To resolve these issues, you can use the `vite-plugin-node-polyfills` package. This plugin adds the necessary polyfills for Node.js core modules in your Vite project.

1. Install the plugin:

   ```bash
   npm install vite-plugin-node-polyfills --save-dev
   ```

2. Update your `vite.config.ts` (or `vite.config.js`) file:

   ```typescript
   import { defineConfig } from 'vite'
   import react from '@vitejs/plugin-react'
   import { nodePolyfills } from 'vite-plugin-node-polyfills'

   export default defineConfig({
     plugins: [
       react(),
       nodePolyfills(),
     ],
   })
   ```

## Note

BubbleAI provides a powerful way to enhance your text editing experience with AI capabilities. By following this documentation, you should be able to integrate BubbleAI into your React applications.
