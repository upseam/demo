import { createServer, type IncomingMessage } from "node:http";
import { loadConfig } from "./config.ts";
import { log } from "./logger.ts";
import { adminClient } from "./shopify.ts";
import { syncProducts } from "./products/sync.ts";
import { ProductStore } from "./store/memory.ts";
import { createHandlers } from "./webhooks/handlers.ts";
import { verifyWebhook } from "./webhooks/verify.ts";

const config = loadConfig();
const store = new ProductStore();
const handlers = createHandlers(store);

function readBody(req: IncomingMessage): Promise<string> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    req.on("data", (chunk: Buffer) => chunks.push(chunk));
    req.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
    req.on("error", reject);
  });
}

const server = createServer(async (req, res) => {
  const url = new URL(req.url ?? "/", "http://localhost");
  try {
    if (req.method === "POST" && url.pathname.startsWith("/webhooks/")) {
      const body = await readBody(req);
      const hmac = req.headers["x-shopify-hmac-sha256"];
      if (!verifyWebhook(body, Array.isArray(hmac) ? hmac[0] : hmac, config.apiSecret)) {
        res.statusCode = 401;
        res.end();
        return;
      }
      const topic = String(req.headers["x-shopify-topic"] ?? "");
      handlers[topic]?.(JSON.parse(body));
      res.statusCode = 200;
      res.end();
    } else if (req.method === "POST" && url.pathname === "/sync") {
      const result = await syncProducts(adminClient(config.shop, config.accessToken), store);
      res.setHeader("content-type", "application/json");
      res.end(JSON.stringify(result));
    } else {
      res.statusCode = 404;
      res.end();
    }
  } catch (error) {
    log("error", "request failed", { path: url.pathname, message: (error as Error).message });
    res.statusCode = 500;
    res.end();
  }
});

server.listen(config.port);
