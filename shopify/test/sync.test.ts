import assert from "node:assert/strict";
import { test } from "node:test";
import { syncProducts } from "../src/products/sync.ts";
import { ProductStore } from "../src/store/memory.ts";
import { fakeClient } from "./fake-client.ts";

const product = (id: string, updatedAt: string) => ({
  id,
  handle: id,
  title: id,
  status: "ACTIVE",
  totalInventory: 3,
  updatedAt,
});

test("sync pages through products and counts changes", async () => {
  const client = fakeClient([
    {
      products: {
        edges: [{ cursor: "a", node: product("p1", "2026-01-01") }],
        pageInfo: { hasNextPage: true, endCursor: "a" },
      },
    },
    {
      products: {
        edges: [{ cursor: "b", node: product("p2", "2026-01-02") }],
        pageInfo: { hasNextPage: false, endCursor: "b" },
      },
    },
  ]);
  const store = new ProductStore();
  const result = await syncProducts(client, store);
  assert.deepEqual(result, { created: 2, updated: 0, unchanged: 0 });
  assert.equal(client.calls[1]?.variables?.after, "a");
  assert.equal(store.all().length, 2);
});

test("sync only asks for products changed since the last run", async () => {
  const store = new ProductStore();
  store.upsert(product("p1", "2026-02-01"));
  const client = fakeClient([
    { products: { edges: [], pageInfo: { hasNextPage: false, endCursor: null } } },
  ]);
  await syncProducts(client, store);
  assert.match(String(client.calls[0]?.variables?.query), /2026-02-01/);
});
