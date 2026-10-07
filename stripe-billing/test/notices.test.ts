import assert from "node:assert/strict";
import { test } from "node:test";
import { renderRenewalNotice, shouldNotify } from "../src/notices.ts";

test("renders a renewal notice with the formatted amount", () => {
  const text = renderRenewalNotice({ customerName: "Ana", planName: "Pro", amount: 4900, currency: "usd", daysLeft: 3 });
  assert.match(text, /renews in 3 days for \$49\.00/);
});

test("uses tomorrow for the last day", () => {
  const text = renderRenewalNotice({ customerName: "Ana", planName: "Pro", amount: 4900, currency: "usd", daysLeft: 1 });
  assert.match(text, /renews tomorrow/);
});

test("only notifies inside the notice window", () => {
  assert.equal(shouldNotify(7, 7), true);
  assert.equal(shouldNotify(8, 7), false);
  assert.equal(shouldNotify(0, 7), false);
});
