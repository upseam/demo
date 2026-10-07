import assert from "node:assert/strict";
import { test } from "node:test";
import { ShopifyUserError } from "../src/errors.ts";
import { fulfillOrder } from "../src/orders/fulfillment.ts";
import { fakeClient } from "./fake-client.ts";

const openOrder = {
  order: { fulfillmentOrders: { edges: [{ node: { id: "fo1", status: "OPEN", assignedLocation: { location: { id: "l1" } } } }] } },
};

test("fulfillOrder creates one fulfillment per open fulfillment order", async () => {
  const client = fakeClient([
    openOrder,
    { fulfillmentCreate: { fulfillment: { id: "f1" }, userErrors: [] } },
  ]);
  const ids = await fulfillOrder(client, "o1", { number: "TRK1", company: "UPS" });
  assert.deepEqual(ids, ["f1"]);
});

test("fulfillOrder surfaces user errors", async () => {
  const client = fakeClient([
    openOrder,
    { fulfillmentCreate: { fulfillment: null, userErrors: [{ message: "Invalid tracking" }] } },
  ]);
  await assert.rejects(fulfillOrder(client, "o1", { number: "", company: "UPS" }), ShopifyUserError);
});
