import type { Category, Priority } from "./types.ts";

const CATEGORY_WORDS: Record<Exclude<Category, "other">, string[]> = {
  billing: ["invoice", "charge", "refund", "payment", "subscription", "card"],
  shipping: ["delivery", "shipping", "tracking", "package", "courier"],
  product: ["size", "broken", "damaged", "defect", "stock"],
  account: ["password", "login", "email", "account"],
};

const URGENT_WORDS = ["urgent", "asap", "immediately", "chargeback", "fraud"];

export function triage(subject: string, body: string): { priority: Priority; category: Category } {
  const text = `${subject} ${body}`.toLowerCase();
  let category: Category = "other";
  for (const [name, words] of Object.entries(CATEGORY_WORDS)) {
    if (words.some((word) => text.includes(word))) {
      category = name as Category;
      break;
    }
  }
  let priority: Priority = "normal";
  if (URGENT_WORDS.some((word) => text.includes(word))) {
    priority = "urgent";
  } else if (category === "billing") {
    priority = "high";
  } else if (text.length < 40) {
    priority = "low";
  }
  return { priority, category };
}
