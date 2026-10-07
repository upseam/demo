import type Stripe from "stripe";
import { stripe } from "./client.ts";
import { BillingError } from "./errors.ts";

export async function findCustomerByEmail(email: string): Promise<Stripe.Customer | null> {
  const result = await stripe.customers.list({ email, limit: 1 });
  return result.data[0] ?? null;
}

export async function requireCustomer(customerId: string): Promise<Stripe.Customer> {
  const customer = await stripe.customers.retrieve(customerId);
  if (customer.deleted) {
    throw new BillingError(`Customer ${customerId} was deleted`);
  }
  return customer;
}
