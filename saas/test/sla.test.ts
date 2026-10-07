import assert from "node:assert/strict";
import { test } from "node:test";
import { dueAt, isBreached } from "../src/tickets/sla.ts";
import type { Ticket } from "../src/tickets/types.ts";

const ticket: Ticket = {
  id: "t1",
  subject: "s",
  body: "b",
  customerEmail: "a@example.com",
  status: "open",
  priority: "high",
  category: "billing",
  createdAt: "2026-01-01T00:00:00.000Z",
  updatedAt: "2026-01-01T00:00:00.000Z",
};

test("high priority is due after four hours", () => {
  assert.equal(dueAt(ticket).toISOString(), "2026-01-01T04:00:00.000Z");
});

test("a solved ticket is never breached", () => {
  const late = new Date("2026-02-01T00:00:00Z");
  assert.equal(isBreached(ticket, late), true);
  assert.equal(isBreached({ ...ticket, status: "solved" }, late), false);
});
