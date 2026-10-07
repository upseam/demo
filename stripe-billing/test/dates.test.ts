import assert from "node:assert/strict";
import { test } from "node:test";
import { daysUntil, fromUnix } from "../src/util/dates.ts";

test("fromUnix converts seconds to a date", () => {
  assert.equal(fromUnix(0).toISOString(), "1970-01-01T00:00:00.000Z");
});

test("daysUntil rounds partial days up", () => {
  const now = new Date("2026-01-01T00:00:00Z");
  assert.equal(daysUntil(new Date("2026-01-03T06:00:00Z"), now), 3);
});
