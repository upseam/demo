import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "", {
  apiVersion: "2024-06-20",
});

export async function renewalDate(subscriptionId: string): Promise<Date> {
  const subscription = await stripe.subscriptions.retrieve(subscriptionId);
  return new Date(subscription.current_period_end * 1000);
}

export async function paymentIntentFor(
  invoiceId: string,
): Promise<string | null> {
  const invoice = await stripe.invoices.retrieve(invoiceId);
  return typeof invoice.payment_intent === "string"
    ? invoice.payment_intent
    : (invoice.payment_intent?.id ?? null);
}
