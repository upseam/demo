import { stripe } from "./client.ts";
import { fromUnix } from "./util/dates.ts";

export async function renewalDate(subscriptionId: string): Promise<Date> {
  const subscription = await stripe.subscriptions.retrieve(subscriptionId);
  return new Date(subscription.current_period_end * 1000);
}

export async function periodStart(subscriptionId: string): Promise<Date> {
  const subscription = await stripe.subscriptions.retrieve(subscriptionId);
  return fromUnix(subscription.current_period_start);
}

export async function renewalNotice(subscriptionId: string): Promise<string> {
  const end = await renewalDate(subscriptionId);
  const days = Math.ceil((end.getTime() - Date.now()) / 86_400_000);
  return `Your plan renews in ${days} days`;
}
