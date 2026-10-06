import { adminClient } from "./shopify.js";

export async function scheduleRestock(
  shop: string,
  accessToken: string,
  input: Record<string, unknown>,
) {
  const client = adminClient(shop, accessToken);
  return client.request(
    `mutation scheduleRestock($input: InventorySetScheduledChangesInput!) {
      inventorySetScheduledChanges(input: $input) {
        scheduledChanges { expectedAt }
        userErrors { field message }
      }
    }`,
    { variables: { input } },
  );
}
