import assert from "node:assert/strict";
import { test } from "node:test";
import type Stripe from "stripe";
import { monthlyRecurringRevenue } from "../src/reports/mrr.ts";

function subscription(unit: number, interval: string, quantity = 1) {
  return {
    items: { data: [{ quantity, price: { unit_amount: unit, recurring: { interval } } }] },
  } as unknown as Stripe.Subscription;
}

test("sums monthly and yearly plans into monthly revenue", () => {
  const total = monthlyRecurringRevenue([subscription(1000, "month", 2), subscription(12000, "year")]);
  assert.equal(total, 3000);
});
