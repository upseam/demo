# stripe-billing

A billing helper for a subscription product. It sends renewal notices, reads invoices, builds checkout sessions, reports monthly recurring revenue and handles Stripe webhooks.

## Old on purpose

The project is pinned to `stripe` 16.12.0 and API version `2024-06-20`. Do not fix it by hand.

Several fields it reads change in API version `2025-03-31.basil`. See the [Stripe changelog](https://docs.stripe.com/changelog/basil).

- `src/renewals.ts` and `src/webhooks/handlers.ts` read `subscription.current_period_end`. See the [changelog](https://docs.stripe.com/changelog/basil/2025-03-31/deprecate-subscription-current-period-start-and-end).
- `src/checkout.ts` reads `session.shipping_details`. See the [changelog](https://docs.stripe.com/changelog/basil/2025-03-31/checkout-session-remove-shipping-details).
- `src/invoices.ts` reads `invoice.payment_intent` and `invoice.total_tax_amounts`. See the changelogs for [partial payments](https://docs.stripe.com/changelog/basil/2025-03-31/add-support-for-multiple-partial-payments-on-invoices) and [taxes](https://docs.stripe.com/changelog/basil/2025-03-31/invoice-tax-configurations).

## Run

```sh
npm ci
npm test
npx @upseam/cli inspect stripe .
```

`npm test` type-checks the code and runs unit tests. They make no network calls.

The server reads `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `RENEWAL_NOTICE_DAYS` and `PORT` from the environment.
