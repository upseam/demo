import "@shopify/shopify-api/adapters/node";
import { ApiVersion, shopifyApi } from "@shopify/shopify-api";

const shopify = shopifyApi({
  apiKey: process.env.SHOPIFY_API_KEY ?? "",
  apiSecretKey: process.env.SHOPIFY_API_SECRET ?? "",
  scopes: ["read_products", "write_products"],
  hostName: process.env.HOST ?? "localhost",
  apiVersion: ApiVersion.October24,
  isEmbeddedApp: false,
});

export async function findProduct(
  shop: string,
  accessToken: string,
  handle: string,
) {
  const session = shopify.session.customAppSession(shop);
  session.accessToken = accessToken;
  const client = new shopify.clients.Graphql({ session });
  const response = await client.request(
    `query findProduct($handle: String!) {
      productByHandle(handle: $handle) {
        id
        title
      }
    }`,
    { variables: { handle } },
  );
  return response.data?.productByHandle ?? null;
}
