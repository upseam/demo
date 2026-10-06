import { stripe } from "./client.js";

export async function paymentIntentFor(
  invoiceId: string,
): Promise<string | null> {
  const invoice = await stripe.invoices.retrieve(invoiceId);
  return typeof invoice.payment_intent === "string"
    ? invoice.payment_intent
    : (invoice.payment_intent?.id ?? null);
}

export async function taxTotal(invoiceId: string): Promise<number> {
  const invoice = await stripe.invoices.retrieve(invoiceId);
  const amounts = invoice.total_tax_amounts ?? [];
  return amounts.reduce((sum, t) => sum + t.amount, 0);
}
