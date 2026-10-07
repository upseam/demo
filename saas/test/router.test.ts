import assert from "node:assert/strict";
import { test } from "node:test";
import { Router } from "../src/lib/router.ts";

test("match extracts decoded params and checks the method", () => {
  const router = new Router();
  router.add("GET", "/products/:handle", () => {});
  assert.equal(router.match("GET", "/products/blue%20shirt")?.params.handle, "blue shirt");
  assert.equal(router.match("POST", "/products/x"), null);
  assert.equal(router.match("GET", "/other"), null);
});
