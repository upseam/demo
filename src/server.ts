import { createServer } from "node:http";
import { summarizeTicket } from "./assistant.js";
import { renewalDate } from "./billing.js";
import { findProduct } from "./shop.js";

const server = createServer(async (req, res) => {
  const url = new URL(req.url ?? "/", "http://localhost");
  res.setHeader("content-type", "application/json");
  if (url.pathname === "/renewal") {
    const date = await renewalDate(url.searchParams.get("subscription") ?? "");
    res.end(JSON.stringify({ renews: date.toISOString() }));
  } else if (url.pathname === "/product") {
    const product = await findProduct(
      process.env.SHOPIFY_SHOP ?? "",
      process.env.SHOPIFY_ACCESS_TOKEN ?? "",
      url.searchParams.get("handle") ?? "",
    );
    res.end(JSON.stringify(product));
  } else if (url.pathname === "/summary") {
    const summary = await summarizeTicket(url.searchParams.get("text") ?? "");
    res.end(JSON.stringify({ summary }));
  } else {
    res.statusCode = 404;
    res.end("{}");
  }
});

server.listen(Number(process.env.PORT ?? 3000));
