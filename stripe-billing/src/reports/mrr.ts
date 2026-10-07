import type Stripe from "stripe";

export function monthlyAmount(subscription: Stripe.Subscription): number {
  return subscription.items.data.reduce((sum, item) => {
    const unit = item.price.unit_amount ?? 0;
    const quantity = item.quantity ?? 1;
    const interval = item.price.recurring?.interval;
    const factor = interval === "year" ? 1 / 12 : interval === "week" ? 52 / 12 : interval === "day" ? 30 : 1;
    return sum + unit * quantity * factor;
  }, 0);
}

export function monthlyRecurringRevenue(subscriptions: Stripe.Subscription[]): number {
  return Math.round(subscriptions.reduce((sum, subscription) => sum + monthlyAmount(subscription), 0));
}
