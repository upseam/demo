import "@shopify/shopify-api/adapters/node";
import { ApiVersion, shopifyApi } from "@shopify/shopify-api";

export const shopify = shopifyApi({
  apiKey: process.env.SHOPIFY_API_KEY ?? "",
  apiSecretKey: process.env.SHOPIFY_API_SECRET ?? "",
  scopes: ["read_products", "write_products", "read_orders"],
  hostName: process.env.HOST ?? "localhost",
  apiVersion: ApiVersion.October24,
  isEmbeddedApp: false,
});

export function adminClient(shop: string, accessToken: string) {
  const session = shopify.session.customAppSession(shop);
  session.accessToken = accessToken;
  return new shopify.clients.Graphql({ session });
}
