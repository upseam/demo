# shopify

A Shopify app backend. It syncs products, sets inventory, writes metafields, fulfills orders, exports products in bulk and receives webhooks, all through the Admin GraphQL API.

## Old on purpose

The app is pinned to Admin API `2025-10` and `@shopify/shopify-api` 12.0.0. Do not fix it by hand.

- Shopify supports `2025-10` until October 16, 2026 15:00 UTC. After that, Shopify "falls forward and responds using the oldest accessible stable version", which is `2026-01`. See [API versioning](https://shopify.dev/docs/api/usage/versioning).
- `src/orders/draftOrders.ts` reads `shop.draftOrders`, removed in `2026-01`. See the [changelog](https://shopify.dev/changelog/removal-of-deprecated-shopdraftorders-connection-in-admin-graphql-api).
- `src/shop/info.ts` reads `shop.billingAddress`, deprecated in `2026-01` for `shopAddress`. See the [changelog](https://shopify.dev/changelog/deprecation-of-shop-billingaddress-in-favor-of-shop-shopaddress).
- `src/orders/fulfillmentService.ts` sends `permitsSkuSharing`, removed in `2026-04`. See the [changelog](https://shopify.dev/changelog/removing-permitsskusharing-field-from-fulfillment-service).

## Run

```sh
npm ci
npm test
npx @upseam/cli inspect shopify .
```

`npm test` type-checks the code and runs the unit tests. They use a fake client and make no network calls.

The server reads `SHOPIFY_SHOP`, `SHOPIFY_ACCESS_TOKEN`, `SHOPIFY_API_KEY`, `SHOPIFY_API_SECRET`, `HOST` and `PORT` from the environment.
