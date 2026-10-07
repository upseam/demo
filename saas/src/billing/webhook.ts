import type Stripe from "stripe";
import { log } from "../lib/logger.ts";
import { stripe } from "./stripe.ts";

export function parseStripeEvent(rawBody: string, signature: string | undefined, secret: string): Stripe.Event {
  if (!signature) {
    throw new Error("Missing stripe-signature header");
  }
  return stripe.webhooks.constructEvent(rawBody, signature, secret);
}

export function handleStripeEvent(event: Stripe.Event): void {
  if (event.type === "invoice.payment_failed") {
    log("warn", "invoice payment failed", { invoice: event.data.object.id });
  } else if (event.type === "customer.subscription.deleted") {
    log("info", "subscription ended", { subscription: event.data.object.id });
  } else {
    log("info", "stripe event ignored", { type: event.type });
  }
}
