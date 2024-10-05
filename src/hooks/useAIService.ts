import axios from "axios";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { AIResponse, APIType, Configuration } from "../types";

export const useAIService = (configuration: Configuration) => {
  const processAIRequest = async (
    prompt: string,
    selectedText: string,
    apiType: APIType
  ): Promise<string> => {
    try {
      let response: AIResponse;

      if (apiType === "openai" && configuration.OpenAI?.OpenAI_api_key) {
        const openAIResponse = await axios.post(
          "https://api.openai.com/v1/chat/completions",
          {
            model: configuration.OpenAI?.Model,
            messages: [
              {
                role: "system",
                content: `You are an expert assistant specializing in text editing, language translation, tone adjustments, and content enhancements. Always aim to improve the user's text, ensuring clarity, correctness, and style.`,
              },
              {
                role: "user",
                content: `Task: ${prompt}\n\nText: "${selectedText}"\n\nPlease process the text accurately, making only meaningful changes. Ensure the response is concise and direct, with no unnecessary commentary, headers, or surrounding text. Return only the final result without additional explanations.`,
              },
            ],
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${configuration.OpenAI?.OpenAI_api_key}`,
            },
          }
        );

        if (!openAIResponse.data.choices?.[0]?.message?.content) {
          throw new Error("Unexpected response format from OpenAI API");
        }

        response = {
          content: openAIResponse.data.choices[0].message.content,
        };
      } else if (apiType === "gemini" && configuration.Gemini?.Gemini_api_key) {
        const genAI = new GoogleGenerativeAI(
          configuration.Gemini?.Gemini_api_key
        );
        const model = genAI.getGenerativeModel({
          model: configuration.Gemini?.Model,
        });
        const result = await model.generateContent(
          `Task: ${prompt}\n\nText: "${selectedText}"\n\nPlease process the text accurately, making only meaningful changes. Ensure the response is concise and direct, with no unnecessary commentary, headers, or surrounding text. Return only the final result without additional explanations.`
        );

        if (!result.response?.candidates?.[0]?.content?.parts?.[0]?.text) {
          throw new Error("Unexpected response format from Gemini API");
        }

        response = {
          content: result.response.candidates[0].content.parts[0].text,
        };
      } else {
        throw new Error("Unsupported or disabled API type");
      }

      return response.content;
    } catch (error: any) {
      const openAiErrorMessage = error.response?.data?.error?.message || "";
      const filteredMessage = openAiErrorMessage
        .replace(/For more information.*?api-errors./i, "")
        .trim();

      if (apiType === "openai") {
        if (filteredMessage.includes("Incorrect API key provided")) {
          throw new Error("Incorrect OpenAI API key provided");
        } else {
          throw new Error(
            filteredMessage || "An error occurred with OpenAI API"
          );
        }
      } else if (apiType === "gemini") {
        if (error.message.includes("API key not valid")) {
          throw new Error(
            "API key not valid. Please pass a valid Gemini API key."
          );
        } else if (error.message.includes("is not found for API version v1beta, or is not supported for generateContent. Call ListModels to see the list of available models and their supported methods.")) {
          throw new Error(
            `${configuration.Gemini?.Model} is not found as a valid Gemini model.`
          );
        } else {
          throw new Error(error.message || "An error occurred with Gemini API");
        }
      } else {
        throw new Error("Unsupported or disabled API type");
      }
    }
  };

  return { processAIRequest };
};
