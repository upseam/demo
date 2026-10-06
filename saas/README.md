# saas

A small support backend for online stores: bills merchants with Stripe, reads products from Shopify, summarizes tickets with Claude.

- `src/assistant.ts` calls `claude-3-5-sonnet-20241022`, which Anthropic retired on 2025-10-28. The App opens a pull request to `claude-sonnet-4-6`.
- `src/billing.ts` reads Stripe `current_period_end` and `invoice.payment_intent`, changed in later API versions.
- `src/shop.ts` uses the Shopify `productByHandle` query, removed in Admin API `2025-01`.

```sh
npm ci
npm test
```

The server reads `STRIPE_SECRET_KEY`, `SHOPIFY_API_KEY`, `SHOPIFY_API_SECRET`, `SHOPIFY_SHOP`, `SHOPIFY_ACCESS_TOKEN` and `ANTHROPIC_API_KEY` from the environment.
