import { adminClient } from "./shopify.ts";

export interface CatalogProduct {
  id: string;
  title: string;
}

export async function findProduct(handle: string): Promise<CatalogProduct | null> {
  const client = adminClient();
  const response = await client.request(
    `query findProduct($handle: String!) {
      productByHandle(handle: $handle) {
        id
        title
      }
    }`,
    { variables: { handle } },
  );
  return (response.data?.productByHandle as CatalogProduct | null | undefined) ?? null;
}
