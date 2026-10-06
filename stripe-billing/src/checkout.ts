import { stripe } from "./client.js";

export async function shippingLabel(sessionId: string): Promise<string> {
  const session = await stripe.checkout.sessions.retrieve(sessionId);
  const shipping = session.shipping_details;
  return shipping?.name ?? "No shipping address";
}
