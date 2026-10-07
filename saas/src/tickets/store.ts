import { randomUUID } from "node:crypto";
import { notFound } from "../lib/errors.ts";
import { triage } from "./triage.ts";
import type { NewTicket, Status, Ticket } from "./types.ts";

export class TicketStore {
  private readonly tickets = new Map<string, Ticket>();

  create(input: NewTicket, now: Date = new Date()): Ticket {
    const { priority, category } = triage(input.subject, input.body);
    const stamp = now.toISOString();
    const ticket: Ticket = {
      id: randomUUID(),
      ...input,
      status: "open",
      priority,
      category,
      createdAt: stamp,
      updatedAt: stamp,
    };
    this.tickets.set(ticket.id, ticket);
    return ticket;
  }

  get(id: string): Ticket {
    const ticket = this.tickets.get(id);
    if (!ticket) {
      throw notFound(`Ticket ${id}`);
    }
    return ticket;
  }

  list(status?: Status): Ticket[] {
    const all = [...this.tickets.values()];
    return (status ? all.filter((t) => t.status === status) : all).sort((a, b) =>
      a.createdAt.localeCompare(b.createdAt),
    );
  }

  update(id: string, changes: Partial<Pick<Ticket, "status" | "priority" | "category" | "summary">>): Ticket {
    const next = { ...this.get(id), ...changes, updatedAt: new Date().toISOString() };
    this.tickets.set(id, next);
    return next;
  }
}

export const tickets = new TicketStore();
