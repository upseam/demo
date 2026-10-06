<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset=".github/assets/upseam-banner-dark.svg" />
    <img src=".github/assets/upseam-banner-light.svg" width="880" alt="Upseam. Dependabot for your APIs." />
  </picture>
</p>

# Upseam demo

**Three small projects with outdated API calls, to see what [Upseam](https://upseam.dev) finds.**

[Upseam](https://github.com/upseam/upseam) · [Action](https://github.com/upseam/action) · [Docs](https://docs.upseam.dev/)

## Projects

| Folder | What it is | Pinned to |
| --- | --- | --- |
| [`saas/`](saas/) | Support backend: Stripe billing, Shopify products, Claude summaries | `stripe` 16.12.0, `@shopify/shopify-api` 11.5.0, `claude-3-5-sonnet-20241022` |
| [`stripe-billing/`](stripe-billing/) | Renewal notices, invoices, checkout shipping | `stripe` 16.12.0, API `2024-06-20` |
| [`shopify/`](shopify/) | Product lookup, metafields, restocks | `@shopify/shopify-api` 11.14.0, Admin API `2024-10` |

The versions are old on purpose. Do not fix them by hand.

## See it

- **Free report.** Actions → `upseam` → Run workflow. One job per folder; each run page lists the outdated calls as `file:line` with the vendor change.
- **Pull request.** Install the [Upseam App](https://docs.upseam.dev/install/) on a fork. `saas/src/assistant.ts` uses a retired Claude model; the App opens a pull request to the replacement Anthropic names.
- **Needs you.** Stripe and Shopify changes behind an SDK upgrade change what the code means, so Upseam lists them for a person instead of guessing.

## Run locally

```sh
cd saas   # or stripe-billing, shopify
npm ci
npm test
```

MIT licensed.
