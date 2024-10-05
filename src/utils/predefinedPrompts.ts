const predefinedPrompts = [
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
      text: "Translate To",
      prompt:
        "Translate the following text into [target language] while preserving its meaning and tone:",
      options: ["Spanish", "Russian", "Chinese", "French"],
    },
    {
      text: "Change Tone To",
      prompt: "Modify the tone of the following text to [desired tone]:",
      options: ["Professional", "Straightforward", "Friendly"],
    },
    {
      text: "Summarize",
      prompt:
        "Provide a concise and accurate summary of the following text, highlighting key points and main ideas:",
    },
    {
      text: "Extend",
      prompt:
        "Expand on the ideas and details of the following text, adding depth and additional insights:",
    },
    {
      text: "Shorten",
      prompt:
        "Shorten the following text without, making it more concise and to the point:",
    },
  ];

  export default predefinedPrompts;