import { createChatClient, type ChatClient } from "../ai/client.ts";
import { classifyTicket } from "../ai/classify.ts";
import { draftReply } from "../ai/reply.ts";
import { summarizeTicket } from "../ai/summary.ts";
import { cachedProduct } from "../catalog/sync.ts";
import { badRequest } from "../lib/errors.ts";
import { readJson, sendJson } from "../lib/http.ts";
import type { Router } from "../lib/router.ts";
import { breached } from "../tickets/sla.ts";
import { tickets } from "../tickets/store.ts";
import type { NewTicket, Status } from "../tickets/types.ts";

export function registerTickets(router: Router, chat: () => ChatClient = createChatClient) {
  router.add("POST", "/tickets", async ({ req, res }) => {
    const input = await readJson<Partial<NewTicket>>(req);
    if (!input.subject || !input.body || !input.customerEmail) {
      throw badRequest("subject, body and customerEmail are required");
    }
    const ticket = tickets.create({ subject: input.subject, body: input.body, customerEmail: input.customerEmail });
    const classification = await classifyTicket(chat(), `${ticket.subject}\n${ticket.body}`);
    sendJson(res, 201, classification ? tickets.update(ticket.id, classification) : ticket);
  });

  router.add("GET", "/tickets", ({ res, url }) => {
    const status = url.searchParams.get("status") as Status | null;
    sendJson(res, 200, tickets.list(status ?? undefined));
  });

  router.add("GET", "/tickets/breached", ({ res }) => {
    sendJson(res, 200, breached(tickets.list()));
  });

  router.add("POST", "/tickets/:id/summary", async ({ res, params }) => {
    const ticket = tickets.get(params.id ?? "");
    const summary = await summarizeTicket(chat(), ticket);
    sendJson(res, 200, tickets.update(ticket.id, { summary }));
  });

  router.add("POST", "/tickets/:id/reply", async ({ res, params, url }) => {
    const ticket = tickets.get(params.id ?? "");
    const handle = url.searchParams.get("product");
    const product = handle ? await cachedProduct(handle) : null;
    const reply = await draftReply(chat(), ticket, {
      storeName: "the store",
      agentName: "Support",
      productTitle: product?.title,
    });
    sendJson(res, 200, { reply });
  });
}
