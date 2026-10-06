import { adminClient } from "./shopify.js";

export async function tagCollection(
  shop: string,
  accessToken: string,
  collectionId: string,
  season: string,
) {
  const client = adminClient(shop, accessToken);
  return client.request(
    `mutation tagCollection($id: ID!, $metafields: [MetafieldInput!]) {
      collectionUpdate(input: { id: $id, metafields: $metafields }) {
        collection { id }
        userErrors { field message }
      }
    }`,
    {
      variables: {
        id: collectionId,
        metafields: [
          {
            namespace: "custom",
            key: "season",
            type: "single_line_text_field",
            value: season,
            description: "Season the collection belongs to",
          },
        ],
      },
    },
  );
}
