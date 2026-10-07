import type { Priority, Ticket } from "./types.ts";

const HOURS: Record<Priority, number> = { urgent: 1, high: 4, normal: 24, low: 72 };

export function dueAt(ticket: Pick<Ticket, "createdAt" | "priority">): Date {
  return new Date(new Date(ticket.createdAt).getTime() + HOURS[ticket.priority] * 3_600_000);
}

export function isBreached(ticket: Ticket, now: Date = new Date()): boolean {
  return ticket.status !== "solved" && dueAt(ticket).getTime() < now.getTime();
}

export function breached(tickets: Ticket[], now: Date = new Date()): Ticket[] {
  return tickets.filter((ticket) => isBreached(ticket, now));
}
