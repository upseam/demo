import { sendJson } from "../lib/http.ts";
import type { Router } from "../lib/router.ts";

export function registerHealth(router: Router) {
  router.add("GET", "/health", ({ res }) => sendJson(res, 200, { ok: true }));
}
