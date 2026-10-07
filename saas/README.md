# saas

A support backend for online stores. Customers write tickets. The backend triages them, tracks SLAs, summarizes them, drafts replies, looks up products in Shopify and reads billing data from Stripe.

This project shows the Upseam Action and the Upseam App.

## Old on purpose

Do not fix these by hand.

- **OpenAI model.** `src/ai/models.ts` holds the GPT-4 Turbo model id. OpenAI shuts it down on October 23, 2026. The replacement is `gpt-5.6-sol`. The App opens a pull request that changes this one line. See [OpenAI deprecations](https://developers.openai.com/api/docs/deprecations).
- **Stripe.** The code uses `stripe` 16.12.0 and API version `2024-06-20`. `src/billing/subscriptions.ts` reads `current_period_end` and `src/billing/invoices.ts` reads `payment_intent`. Both change in API version `2025-03-31.basil`. These changes need an SDK upgrade, so Upseam lists them under "Needs you" and does not open a pull request. See the [Stripe changelog](https://docs.stripe.com/changelog/basil).
- **Shopify.** The code uses `@shopify/shopify-api` 11.5.0 and Admin API `2024-10`. `src/catalog/products.ts` queries `productByHandle`, removed in `2025-01`. See the [changelog](https://shopify.dev/changelog/removal-of-unused-deprecated-fields).

## Run

```sh
npm ci
npm test
npx @upseam/cli inspect openai .
```

`npm test` type-checks the code and runs unit tests. They make no network calls.

To start the server, set the variables below and run `node src/server.ts` on Node 22.18 or later.

The server reads `OPENAI_API_KEY`, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `SHOPIFY_API_KEY`, `SHOPIFY_API_SECRET`, `SHOPIFY_SHOP`, `SHOPIFY_ACCESS_TOKEN`, `HOST` and `PORT` from the environment.
