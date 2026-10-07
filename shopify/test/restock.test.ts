import assert from "node:assert/strict";
import { test } from "node:test";
import { receiveStock } from "../src/inventory/restock.ts";
import { fakeClient } from "./fake-client.ts";

test("receiveStock adds to the current quantity", async () => {
  const client = fakeClient([
    {
      inventoryItem: {
        inventoryLevels: {
          edges: [{ node: { location: { id: "loc1" }, quantities: [{ name: "available", quantity: 4 }] } }],
        },
      },
    },
    { inventorySetQuantities: { userErrors: [] } },
  ]);
  const next = await receiveStock(client, { inventoryItemId: "i1", locationId: "loc1", received: 6 });
  assert.equal(next, 10);
  const input = client.calls[1]?.variables?.input as { quantities: { quantity: number }[] };
  assert.equal(input.quantities[0]?.quantity, 10);
});

test("receiveStock rejects empty deliveries", async () => {
  await assert.rejects(
    receiveStock(fakeClient([]), { inventoryItemId: "i1", locationId: "loc1", received: 0 }),
    RangeError,
  );
});
