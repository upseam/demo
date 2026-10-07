import assert from "node:assert/strict";
import { test } from "node:test";
import { collectAll } from "../src/util/pagination.ts";
import { sumMoney, toCents } from "../src/util/money.ts";

test("sumMoney adds without float drift", () => {
  const total = sumMoney([
    { amount: "0.10", currencyCode: "USD" },
    { amount: "0.20", currencyCode: "USD" },
  ]);
  assert.equal(total.amount, "0.30");
  assert.equal(toCents(total), 30);
});

test("collectAll stops at the last page", async () => {
  const pages = [
    { edges: [{ cursor: "1", node: 1 }], pageInfo: { hasNextPage: true, endCursor: "1" } },
    { edges: [{ cursor: "2", node: 2 }], pageInfo: { hasNextPage: false, endCursor: "2" } },
  ];
  let i = 0;
  const all = await collectAll(async () => pages[i++]!);
  assert.deepEqual(all, [1, 2]);
});
