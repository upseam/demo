# stripe-billing

A small billing helper: renewal notices, invoice details and checkout shipping labels.

It is pinned on purpose to `stripe` 16.12.0 and API version `2024-06-20`. Several of the fields it reads are changed or removed in later Stripe API versions. Do not fix them by hand: this project exists to show what [Upseam](https://upseam.dev) reports.

```sh
npm ci
npm test
```
