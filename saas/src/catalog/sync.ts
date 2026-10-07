import { log } from "../lib/logger.ts";
import { findProduct, type CatalogProduct } from "./products.ts";

const cache = new Map<string, { product: CatalogProduct | null; at: number }>();
const TTL_MS = 5 * 60_000;

export async function cachedProduct(handle: string, now: number = Date.now()): Promise<CatalogProduct | null> {
  const hit = cache.get(handle);
  if (hit && now - hit.at < TTL_MS) {
    return hit.product;
  }
  const product = await findProduct(handle);
  cache.set(handle, { product, at: now });
  log("info", "catalog lookup", { handle, found: product !== null });
  return product;
}

export function clearCatalogCache() {
  cache.clear();
}
