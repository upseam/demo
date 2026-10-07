import { log } from "../logger.ts";
import type { ProductStore } from "../store/memory.ts";

export type WebhookHandler = (payload: Record<string, any>) => void;

export function createHandlers(store: ProductStore): Record<string, WebhookHandler> {
  return {
    "products/update": (payload) => {
      store.upsert({
        id: `gid://shopify/Product/${payload.id}`,
        handle: String(payload.handle ?? ""),
        title: String(payload.title ?? ""),
        status: String(payload.status ?? "active").toUpperCase(),
        totalInventory: 0,
        updatedAt: String(payload.updated_at ?? new Date().toISOString()),
      });
    },
    "products/delete": (payload) => {
      store.remove(`gid://shopify/Product/${payload.id}`);
    },
    "orders/create": (payload) => {
      log("info", "order received", { order: payload.name, total: payload.total_price });
    },
    "inventory_levels/update": (payload) => {
      log("info", "inventory changed", { item: payload.inventory_item_id, available: payload.available });
    },
  };
}
