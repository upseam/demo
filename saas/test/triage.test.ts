import assert from "node:assert/strict";
import { test } from "node:test";
import { triage } from "../src/tickets/triage.ts";

test("billing words set the category and a high priority", () => {
  const result = triage("Wrong charge", "I was charged twice for my subscription this month.");
  assert.deepEqual(result, { category: "billing", priority: "high" });
});

test("urgent words win over the category", () => {
  assert.equal(triage("Package", "My package never arrived, I need it urgent please").priority, "urgent");
});

test("short unknown messages are low priority", () => {
  assert.deepEqual(triage("Hi", "Hello"), { category: "other", priority: "low" });
});
