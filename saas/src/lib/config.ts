export interface Config {
  port: number;
  openaiApiKey: string;
  stripeSecretKey: string;
  stripeWebhookSecret: string;
  shopifyApiKey: string;
  shopifyApiSecret: string;
  shopifyShop: string;
  shopifyAccessToken: string;
  host: string;
}

export function loadConfig(env: NodeJS.ProcessEnv = process.env): Config {
  return {
    port: Number(env.PORT ?? 3000),
    openaiApiKey: env.OPENAI_API_KEY ?? "",
    stripeSecretKey: env.STRIPE_SECRET_KEY ?? "",
    stripeWebhookSecret: env.STRIPE_WEBHOOK_SECRET ?? "",
    shopifyApiKey: env.SHOPIFY_API_KEY ?? "",
    shopifyApiSecret: env.SHOPIFY_API_SECRET ?? "",
    shopifyShop: env.SHOPIFY_SHOP ?? "",
    shopifyAccessToken: env.SHOPIFY_ACCESS_TOKEN ?? "",
    host: env.HOST ?? "localhost",
  };
}

export const config = loadConfig();
