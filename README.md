<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset=".github/assets/upseam-banner-dark.svg" />
    <img src=".github/assets/upseam-banner-light.svg" width="880" alt="Upseam. Dependabot for your APIs." />
  </picture>
</p>

# Upseam demo

**Three projects with outdated API calls, to see what [Upseam](https://upseam.dev) finds.**

[Upseam](https://github.com/upseam/upseam) · [Action](https://github.com/upseam/action) · [Docs](https://docs.upseam.dev/)

## Projects

| Folder | What it is | Old on purpose |
| --- | --- | --- |
| [`saas/`](saas/) | Support backend for online stores | OpenAI GPT-4 Turbo, shut down October 23, 2026. `stripe` 16.12.0, API `2024-06-20`. `@shopify/shopify-api` 11.5.0, Admin API `2024-10`. |
| [`stripe-billing/`](stripe-billing/) | Renewal notices, invoices, checkout, webhooks | `stripe` 16.12.0, API `2024-06-20` |
| [`shopify/`](shopify/) | Shopify app backend: products, inventory, orders, webhooks | Admin API `2025-10`, accessible until October 16, 2026. Then Shopify falls forward to `2026-01`. |

The versions are old on purpose. Do not fix them by hand.

Sources: [OpenAI deprecations](https://developers.openai.com/api/docs/deprecations) · [Shopify API versioning](https://shopify.dev/docs/api/usage/versioning) · [Stripe changelog](https://docs.stripe.com/changelog)

## See it

- **Free report.** Actions → `upseam` → Run workflow. Pick a project, or `all`. Each run page lists the outdated calls as `file:line` with the vendor change.
- **Pull request.** Install the [Upseam App](https://docs.upseam.dev/install/) on a fork. `saas/src/ai/models.ts` holds a model id that OpenAI shuts down on October 23, 2026. The App opens a one-line pull request to `gpt-5.6-sol`.
- **Needs you.** Stripe and Shopify changes behind an SDK upgrade change what the code means, so Upseam lists them for a person instead of guessing.
- **CLI.** In `shopify/`, run `npx @upseam/cli inspect shopify .` to see the changes that hit the code when Shopify falls forward to `2026-01`.

## Run locally

```sh
cd saas   # or stripe-billing, shopify
npm ci
npm test
```

MIT licensed.
