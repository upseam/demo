import type { Ticket } from "../tickets/types.ts";
import type { ChatClient } from "./client.ts";

export async function summarizeTicket(chat: ChatClient, ticket: Pick<Ticket, "subject" | "body">): Promise<string> {
  const text = await chat.complete(
    [
      { role: "system", content: "You summarize customer support tickets for an online store in two sentences." },
      { role: "user", content: `Subject: ${ticket.subject}\n\n${ticket.body}` },
    ],
    256,
  );
  return text.trim();
}
