import assert from "node:assert/strict";
import { test } from "node:test";
import { waitForExport } from "../src/bulk/status.ts";
import { fakeClient } from "./fake-client.ts";

test("waitForExport polls until the operation completes", async () => {
  const client = fakeClient([
    { currentBulkOperation: { id: "b1", status: "RUNNING", objectCount: "0", url: null } },
    { currentBulkOperation: { id: "b1", status: "COMPLETED", objectCount: "12", url: "https://example.com/out.jsonl" } },
  ]);
  const operation = await waitForExport(client, async () => {});
  assert.equal(operation.status, "COMPLETED");
  assert.equal(client.calls.length, 2);
});
