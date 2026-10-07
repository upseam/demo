import type { Ticket } from "../tickets/types.ts";
import type { ChatClient } from "./client.ts";

export interface ReplyContext {
  storeName: string;
  agentName: string;
  productTitle?: string;
}

export async function draftReply(chat: ChatClient, ticket: Ticket, context: ReplyContext): Promise<string> {
  const product = context.productTitle ? `The customer asks about ${context.productTitle}.` : "";
  const text = await chat.complete(
    [
      {
        role: "system",
        content: `You write polite, short support replies for ${context.storeName}. Sign as ${context.agentName}. ${product}`,
      },
      { role: "user", content: `Subject: ${ticket.subject}\n\n${ticket.body}` },
    ],
    400,
  );
  return text.trim();
}
