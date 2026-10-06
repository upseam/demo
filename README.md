# demo-saas

A small support backend for online stores. It bills merchants with Stripe, reads products from their Shopify store and summarizes support tickets with a Claude model.

It is a demo for [Upseam](https://upseam.dev). The dependencies are pinned on purpose to old versions, so some of what the code calls has since been changed or retired by the vendors. Do not fix it by hand.

## What the demo shows

1. **A free report.** `.github/workflows/upseam.yml` runs the Upseam Action with the `contents: read` right only. Run it from the Actions tab and open the run page: the report lists each outdated call as `file:line`, with the change that affects it.
2. **A pull request.** Install the Upseam GitHub App on this repository. It finds that `src/assistant.ts` uses `claude-3-5-sonnet-20241022`, a model Anthropic retired on 2025-10-28, and opens a pull request that switches to `claude-sonnet-4-6`, the replacement Anthropic names.
3. **"Needs you".** Stripe's `current_period_end` and `invoice.payment_intent` and the Shopify `productByHandle` query changed in later API versions. They sit behind an SDK upgrade and change what the code means, so Upseam lists them for you instead of guessing.

## Run it

```sh
npm ci
npm test
```

The server reads `STRIPE_SECRET_KEY`, `SHOPIFY_API_KEY`, `SHOPIFY_API_SECRET`, `SHOPIFY_SHOP`, `SHOPIFY_ACCESS_TOKEN` and `ANTHROPIC_API_KEY` from the environment.

MIT licensed.
