import { stripe } from "./client.ts";

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

export async function unpaidInvoices(customerId: string) {
  const result = await stripe.invoices.list({ customer: customerId, status: "open", limit: 100 });
  return result.data.map((invoice) => ({
    id: invoice.id,
    amountDue: invoice.amount_due,
    currency: invoice.currency,
    dueDate: invoice.due_date,
  }));
}
