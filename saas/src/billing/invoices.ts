import { stripe } from "./stripe.ts";

export async function paymentIntentFor(
  invoiceId: string,
): Promise<string | null> {
  const invoice = await stripe.invoices.retrieve(invoiceId);
  return typeof invoice.payment_intent === "string"
    ? invoice.payment_intent
    : (invoice.payment_intent?.id ?? null);
}

export async function refundLastInvoice(invoiceId: string): Promise<string> {
  const intent = await paymentIntentFor(invoiceId);
  if (!intent) {
    throw new Error(`Invoice ${invoiceId} has no payment to refund`);
  }
  const refund = await stripe.refunds.create({ payment_intent: intent });
  return refund.id;
}
