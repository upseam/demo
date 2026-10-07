import { stripe } from "./stripe.ts";

export async function renewalDate(subscriptionId: string): Promise<Date> {
  const subscription = await stripe.subscriptions.retrieve(subscriptionId);
  return new Date(subscription.current_period_end * 1000);
}

export async function planSummary(customerId: string) {
  const result = await stripe.subscriptions.list({ customer: customerId, status: "active", limit: 10 });
  return result.data.map((subscription) => ({
    id: subscription.id,
    renews: new Date(subscription.current_period_end * 1000).toISOString(),
    cancelAtPeriodEnd: subscription.cancel_at_period_end,
    items: subscription.items.data.map((item) => item.price.nickname ?? item.price.id),
  }));
}
