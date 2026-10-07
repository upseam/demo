export interface BillingConfig {
  secretKey: string;
  webhookSecret: string;
  noticeDays: number;
  port: number;
}

export function loadConfig(env: NodeJS.ProcessEnv = process.env): BillingConfig {
  return {
    secretKey: env.STRIPE_SECRET_KEY ?? "",
    webhookSecret: env.STRIPE_WEBHOOK_SECRET ?? "",
    noticeDays: Number(env.RENEWAL_NOTICE_DAYS ?? 7),
    port: Number(env.PORT ?? 3000),
  };
}
