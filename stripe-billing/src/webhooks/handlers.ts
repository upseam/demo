import type Stripe from "stripe";
import { log } from "../logger.ts";

export function handleEvent(event: Stripe.Event): void {
  switch (event.type) {
    case "invoice.payment_succeeded": {
      const invoice = event.data.object;
      const intent = typeof invoice.payment_intent === "string" ? invoice.payment_intent : invoice.payment_intent?.id;
      log("info", "invoice paid", { invoice: invoice.id, intent });
      break;
    }
    case "invoice.payment_failed": {
      log("warn", "invoice payment failed", { invoice: event.data.object.id });
      break;
    }
    case "customer.subscription.updated": {
      const subscription = event.data.object;
      log("info", "subscription updated", {
        subscription: subscription.id,
        renews: new Date(subscription.current_period_end * 1000).toISOString(),
      });
      break;
    }
    default:
      log("info", "event ignored", { type: event.type });
  }
}
