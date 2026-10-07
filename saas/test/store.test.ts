import assert from "node:assert/strict";
import { test } from "node:test";
import { HttpError } from "../src/lib/errors.ts";
import { TicketStore } from "../src/tickets/store.ts";

test("create triages and list filters by status", () => {
  const store = new TicketStore();
  const ticket = store.create({ subject: "Refund", body: "Please refund my payment", customerEmail: "a@example.com" });
  assert.equal(ticket.category, "billing");
  store.update(ticket.id, { status: "solved" });
  assert.equal(store.list("open").length, 0);
  assert.equal(store.list("solved").length, 1);
});

test("get throws a 404 for unknown tickets", () => {
  assert.throws(() => new TicketStore().get("missing"), (error) => error instanceof HttpError && error.status === 404);
});
