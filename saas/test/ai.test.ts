import assert from "node:assert/strict";
import { test } from "node:test";
import { classifyTicket, parseClassification } from "../src/ai/classify.ts";
import type { ChatClient } from "../src/ai/client.ts";
import { summarizeTicket } from "../src/ai/summary.ts";

const fixed = (answer: string): ChatClient => ({ complete: async () => answer });

test("parseClassification reads JSON wrapped in text", () => {
  assert.deepEqual(parseClassification('Sure: {"category":"billing","priority":"high"}'), {
    category: "billing",
    priority: "high",
  });
});

test("parseClassification rejects unknown values", () => {
  assert.equal(parseClassification('{"category":"x","priority":"high"}'), null);
  assert.equal(parseClassification("no json"), null);
});

test("classifyTicket and summarizeTicket use the chat client", async () => {
  assert.equal((await classifyTicket(fixed('{"category":"shipping","priority":"low"}'), "text"))?.category, "shipping");
  assert.equal(await summarizeTicket(fixed("  Short summary.  "), { subject: "s", body: "b" }), "Short summary.");
});
