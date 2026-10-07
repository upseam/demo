import type { Category, Priority } from "../tickets/types.ts";
import type { ChatClient } from "./client.ts";

const CATEGORIES: Category[] = ["billing", "shipping", "product", "account", "other"];
const PRIORITIES: Priority[] = ["low", "normal", "high", "urgent"];

export interface Classification {
  category: Category;
  priority: Priority;
}

export function parseClassification(raw: string): Classification | null {
  const match = /\{[\s\S]*\}/.exec(raw);
  if (!match) {
    return null;
  }
  try {
    const value = JSON.parse(match[0]) as Partial<Classification>;
    if (CATEGORIES.includes(value.category as Category) && PRIORITIES.includes(value.priority as Priority)) {
      return value as Classification;
    }
  } catch {
    return null;
  }
  return null;
}

export async function classifyTicket(chat: ChatClient, text: string): Promise<Classification | null> {
  const raw = await chat.complete(
    [
      {
        role: "system",
        content: `Reply with JSON only: {"category": one of ${CATEGORIES.join("|")}, "priority": one of ${PRIORITIES.join("|")}}.`,
      },
      { role: "user", content: text },
    ],
    60,
  );
  return parseClassification(raw);
}
