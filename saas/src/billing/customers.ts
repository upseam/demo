import type Stripe from "stripe";
import { notFound } from "../lib/errors.ts";
import { stripe } from "./stripe.ts";

export async function customerByEmail(email: string): Promise<Stripe.Customer> {
  const result = await stripe.customers.list({ email, limit: 1 });
  const customer = result.data[0];
  if (!customer) {
    throw notFound(`Customer ${email}`);
  }
  return customer;
}
