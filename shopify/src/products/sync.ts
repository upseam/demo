import type { GraphqlClient } from "../shopify-graphql.ts";
import { log } from "../logger.ts";
import type { ProductStore } from "../store/memory.ts";
import { listProducts } from "./queries.ts";

export interface SyncResult {
  created: number;
  updated: number;
  unchanged: number;
}

export async function syncProducts(client: GraphqlClient, store: ProductStore): Promise<SyncResult> {
  const result: SyncResult = { created: 0, updated: 0, unchanged: 0 };
  const products = await listProducts(client, store.latestUpdate());
  for (const product of products) {
    result[store.upsert(product)] += 1;
  }
  log("info", "product sync finished", { ...result });
  return result;
}
