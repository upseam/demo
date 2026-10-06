# shopify

A small Shopify app backend: it looks up products, tags collections with metafields and schedules restocks through the Admin GraphQL API.

It is pinned on purpose to `@shopify/shopify-api` 11.14.0 and Admin API version `2024-10`. Some of the fields it uses are removed or replaced in later versions. Do not fix them by hand: this project exists to show what [Upseam](https://upseam.dev) reports.

```sh
npm ci
npm test
```
