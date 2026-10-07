import { createServer } from "node:http";
import { HttpError } from "./lib/errors.ts";
import { log } from "./lib/logger.ts";
import { sendJson } from "./lib/http.ts";
import { Router } from "./lib/router.ts";
import { registerBilling } from "./routes/billing.ts";
import { registerCatalog } from "./routes/catalog.ts";
import { registerHealth } from "./routes/health.ts";
import { registerTickets } from "./routes/tickets.ts";
import { registerWebhooks } from "./routes/webhooks.ts";

export function buildRouter(): Router {
  const router = new Router();
  registerHealth(router);
  registerTickets(router);
  registerBilling(router);
  registerCatalog(router);
  registerWebhooks(router);
  return router;
}

export function buildServer(router: Router = buildRouter()) {
  return createServer(async (req, res) => {
    const url = new URL(req.url ?? "/", "http://localhost");
    const found = router.match(req.method ?? "GET", url.pathname);
    if (!found) {
      sendJson(res, 404, { error: "Not found" });
      return;
    }
    try {
      await found.handler({ req, res, url, params: found.params });
    } catch (error) {
      const status = error instanceof HttpError ? error.status : 500;
      if (status === 500) {
        log("error", "request failed", { path: url.pathname, message: (error as Error).message });
      }
      sendJson(res, status, { error: status === 500 ? "Internal error" : (error as Error).message });
    }
  });
}
