import type Stripe from "stripe";
import { stripe } from "./client.ts";

export async function activeSubscriptions(customerId: string): Promise<Stripe.Subscription[]> {
  const result = await stripe.subscriptions.list({ customer: customerId, status: "active", limit: 100 });
  return result.data;
}

export async function cancelAtPeriodEnd(subscriptionId: string): Promise<Stripe.Subscription> {
  return stripe.subscriptions.update(subscriptionId, { cancel_at_period_end: true });
}

export async function resume(subscriptionId: string): Promise<Stripe.Subscription> {
  return stripe.subscriptions.update(subscriptionId, { cancel_at_period_end: false });
}
