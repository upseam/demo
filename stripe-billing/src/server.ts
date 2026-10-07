import { createServer, type IncomingMessage } from "node:http";
import { loadConfig } from "./config.ts";
import { log } from "./logger.ts";
import { renewalNotice } from "./renewals.ts";
import { parseEvent } from "./webhooks/verify.ts";
import { handleEvent } from "./webhooks/handlers.ts";

const config = loadConfig();

function readBody(req: IncomingMessage): Promise<string> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    req.on("data", (chunk: Buffer) => chunks.push(chunk));
    req.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
    req.on("error", reject);
  });
}

createServer(async (req, res) => {
  const url = new URL(req.url ?? "/", "http://localhost");
  try {
    if (req.method === "POST" && url.pathname === "/webhook") {
      const signature = req.headers["stripe-signature"];
      const event = parseEvent(await readBody(req), Array.isArray(signature) ? signature[0] : signature, config.webhookSecret);
      handleEvent(event);
      res.end();
    } else if (url.pathname === "/notice") {
      res.end(await renewalNotice(url.searchParams.get("subscription") ?? ""));
    } else {
      res.statusCode = 404;
      res.end();
    }
  } catch (error) {
    log("error", "request failed", { message: (error as Error).message });
    res.statusCode = 400;
    res.end();
  }
}).listen(config.port);
