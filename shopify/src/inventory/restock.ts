import type { GraphqlClient } from "../shopify-graphql.ts";
import { log } from "../logger.ts";
import { getInventoryLevels, setAvailableQuantity } from "./queries.ts";

export interface RestockRequest {
  inventoryItemId: string;
  locationId: string;
  received: number;
}

export async function receiveStock(client: GraphqlClient, request: RestockRequest): Promise<number> {
  if (request.received <= 0) {
    throw new RangeError("received must be positive");
  }
  const levels = await getInventoryLevels(client, request.inventoryItemId);
  const current = levels.find((level) => level.locationId === request.locationId)?.available ?? 0;
  const next = current + request.received;
  await setAvailableQuantity(client, request.inventoryItemId, request.locationId, next);
  log("info", "stock received", { inventoryItemId: request.inventoryItemId, next });
  return next;
}

export function lowStock(levels: { available: number }[], threshold: number): boolean {
  return levels.reduce((sum, level) => sum + level.available, 0) < threshold;
}
