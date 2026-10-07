import "@shopify/shopify-api/adapters/node";
import { ApiVersion, shopifyApi } from "@shopify/shopify-api";
import { config } from "../lib/config.ts";

let api: ReturnType<typeof createApi> | undefined;

function createApi() {
  return shopifyApi({
    apiKey: config.shopifyApiKey,
    apiSecretKey: config.shopifyApiSecret,
    scopes: ["read_products", "write_products"],
    hostName: config.host,
    apiVersion: ApiVersion.October24,
    isEmbeddedApp: false,
  });
}

export function adminClient(shop: string = config.shopifyShop, accessToken: string = config.shopifyAccessToken) {
  api ??= createApi();
  const session = api.session.customAppSession(shop);
  session.accessToken = accessToken;
  return new api.clients.Graphql({ session });
}
