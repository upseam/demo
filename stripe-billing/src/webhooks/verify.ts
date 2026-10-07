import type Stripe from "stripe";
import { stripe } from "../client.ts";

export function parseEvent(rawBody: string, signature: string | undefined, secret: string): Stripe.Event {
  if (!signature) {
    throw new Error("Missing stripe-signature header");
  }
  return stripe.webhooks.constructEvent(rawBody, signature, secret);
}
