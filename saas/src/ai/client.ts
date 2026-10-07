import OpenAI from "openai";
import { config } from "../lib/config.ts";
import { SUPPORT_MODEL } from "./models.ts";

export interface ChatMessage {
  role: "system" | "user";
  content: string;
}

export interface ChatClient {
  complete(messages: ChatMessage[], maxTokens?: number): Promise<string>;
}

export function createChatClient(apiKey: string = config.openaiApiKey): ChatClient {
  const openai = new OpenAI({ apiKey });
  return {
    async complete(messages, maxTokens = 512) {
      const completion = await openai.chat.completions.create({
        model: SUPPORT_MODEL,
        max_tokens: maxTokens,
        messages,
      });
      return completion.choices[0]?.message.content ?? "";
    },
  };
}
