import { adminClient } from "./shopify.js";

export async function findProduct(
  shop: string,
  accessToken: string,
  handle: string,
) {
  const client = adminClient(shop, accessToken);
  const response = await client.request(
    `query findProduct($handle: String!) {
      productByHandle(handle: $handle) {
        id
        title
        status
      }
    }`,
    { variables: { handle } },
  );
  return response.data?.productByHandle ?? null;
}
