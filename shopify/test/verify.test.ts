import assert from "node:assert/strict";
import { createHmac } from "node:crypto";
import { test } from "node:test";
import { verifyWebhook } from "../src/webhooks/verify.ts";

const secret = "test-secret";
const body = JSON.stringify({ id: 1 });
const signature = createHmac("sha256", secret).update(body).digest("base64");

test("accepts a valid signature", () => {
  assert.equal(verifyWebhook(body, signature, secret), true);
});

test("rejects a wrong or missing signature", () => {
  assert.equal(verifyWebhook(body, "AAAA", secret), false);
  assert.equal(verifyWebhook(body, undefined, secret), false);
});
