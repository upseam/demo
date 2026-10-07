import { handleStripeEvent, parseStripeEvent } from "../billing/webhook.ts";
import { config } from "../lib/config.ts";
import { HttpError } from "../lib/errors.ts";
import { readBody } from "../lib/http.ts";
import type { Router } from "../lib/router.ts";

export function registerWebhooks(router: Router) {
  router.add("POST", "/webhooks/stripe", async ({ req, res }) => {
    const header = req.headers["stripe-signature"];
    const signature = Array.isArray(header) ? header[0] : header;
    try {
      handleStripeEvent(parseStripeEvent(await readBody(req), signature, config.stripeWebhookSecret));
    } catch (error) {
      throw new HttpError(400, (error as Error).message);
    }
    res.statusCode = 200;
    res.end();
  });
}
