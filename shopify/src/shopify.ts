import "@shopify/shopify-api/adapters/node";
import { ApiVersion, shopifyApi } from "@shopify/shopify-api";
import { loadConfig } from "./config.ts";
import type { GraphqlClient } from "./shopify-graphql.ts";

const config = loadConfig();

export const shopify = shopifyApi({
  apiKey: config.apiKey,
  apiSecretKey: config.apiSecret,
  scopes: ["read_products", "write_products", "read_inventory", "write_inventory", "read_orders", "write_fulfillments"],
  hostName: config.host,
  apiVersion: ApiVersion.October25,
  isEmbeddedApp: false,
});

export function adminClient(shop: string, accessToken: string): GraphqlClient {
  const session = shopify.session.customAppSession(shop);
  session.accessToken = accessToken;
  return new shopify.clients.Graphql({ session }) as unknown as GraphqlClient;
}
