import { stripe } from "./client.ts";

export async function shippingLabel(sessionId: string): Promise<string> {
  const session = await stripe.checkout.sessions.retrieve(sessionId);
  const shipping = session.shipping_details;
  return shipping?.name ?? "No shipping address";
}

export async function createCheckout(priceId: string, customerId: string, returnUrl: string) {
  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer: customerId,
    line_items: [{ price: priceId, quantity: 1 }],
    shipping_address_collection: { allowed_countries: ["US", "CA", "GB"] },
    success_url: `${returnUrl}?session={CHECKOUT_SESSION_ID}`,
    cancel_url: returnUrl,
  });
  return session.url;
}
