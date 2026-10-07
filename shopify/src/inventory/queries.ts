import { assertNoUserErrors, gql, run, type GraphqlClient } from "../shopify-graphql.ts";
import type { UserError } from "../errors.ts";

export interface InventoryLevel {
  locationId: string;
  available: number;
}

const INVENTORY_LEVELS = gql`
  query inventoryLevels($inventoryItemId: ID!) {
    inventoryItem(id: $inventoryItemId) {
      id
      inventoryLevels(first: 20) {
        edges {
          node {
            location {
              id
            }
            quantities(names: ["available"]) {
              name
              quantity
            }
          }
        }
      }
    }
  }
`;

const SET_QUANTITIES = gql`
  mutation setQuantities($input: InventorySetQuantitiesInput!) {
    inventorySetQuantities(input: $input) {
      inventoryAdjustmentGroup {
        createdAt
        reason
      }
      userErrors {
        field
        message
      }
    }
  }
`;

export async function getInventoryLevels(
  client: GraphqlClient,
  inventoryItemId: string,
): Promise<InventoryLevel[]> {
  const data = await run<{
    inventoryItem: {
      inventoryLevels: {
        edges: {
          node: { location: { id: string }; quantities: { name: string; quantity: number }[] };
        }[];
      };
    } | null;
  }>(client, INVENTORY_LEVELS, { inventoryItemId });
  const edges = data.inventoryItem?.inventoryLevels.edges ?? [];
  return edges.map(({ node }) => ({
    locationId: node.location.id,
    available: node.quantities.find((q) => q.name === "available")?.quantity ?? 0,
  }));
}

export async function setAvailableQuantity(
  client: GraphqlClient,
  inventoryItemId: string,
  locationId: string,
  quantity: number,
): Promise<void> {
  const data = await run<{
    inventorySetQuantities: { userErrors: UserError[] };
  }>(client, SET_QUANTITIES, {
    input: {
      name: "available",
      reason: "correction",
      ignoreCompareQuantity: true,
      quantities: [{ inventoryItemId, locationId, quantity }],
    },
  });
  assertNoUserErrors("inventorySetQuantities", data.inventorySetQuantities.userErrors);
}
