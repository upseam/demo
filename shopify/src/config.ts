export interface AppConfig {
  shop: string;
  accessToken: string;
  apiKey: string;
  apiSecret: string;
  host: string;
  port: number;
}

export function loadConfig(env: NodeJS.ProcessEnv = process.env): AppConfig {
  return {
    shop: env.SHOPIFY_SHOP ?? "",
    accessToken: env.SHOPIFY_ACCESS_TOKEN ?? "",
    apiKey: env.SHOPIFY_API_KEY ?? "",
    apiSecret: env.SHOPIFY_API_SECRET ?? "",
    host: env.HOST ?? "localhost",
    port: Number(env.PORT ?? 3000),
  };
}
