import { cachedProduct } from "../catalog/sync.ts";
import { notFound } from "../lib/errors.ts";
import { sendJson } from "../lib/http.ts";
import type { Router } from "../lib/router.ts";

export function registerCatalog(router: Router) {
  router.add("GET", "/products/:handle", async ({ res, params }) => {
    const product = await cachedProduct(params.handle ?? "");
    if (!product) {
      throw notFound(`Product ${params.handle}`);
    }
    sendJson(res, 200, product);
  });
}
