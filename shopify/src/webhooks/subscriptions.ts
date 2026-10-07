import { assertNoUserErrors, gql, run, type GraphqlClient } from "../shopify-graphql.ts";
import type { UserError } from "../errors.ts";

export const TOPICS = ["PRODUCTS_UPDATE", "PRODUCTS_DELETE", "ORDERS_CREATE", "INVENTORY_LEVELS_UPDATE"] as const;

const SUBSCRIBE = gql`
  mutation subscribe($topic: WebhookSubscriptionTopic!, $subscription: WebhookSubscriptionInput!) {
    webhookSubscriptionCreate(topic: $topic, webhookSubscription: $subscription) {
      webhookSubscription {
        id
      }
      userErrors {
        field
        message
      }
    }
  }
`;

export async function subscribeAll(client: GraphqlClient, callbackBase: string): Promise<number> {
  for (const topic of TOPICS) {
    const data = await run<{ webhookSubscriptionCreate: { userErrors: UserError[] } }>(client, SUBSCRIBE, {
      topic,
      subscription: {
        callbackUrl: `${callbackBase}/webhooks/${topic.toLowerCase()}`,
        format: "JSON",
      },
    });
    assertNoUserErrors("webhookSubscriptionCreate", data.webhookSubscriptionCreate.userErrors);
  }
  return TOPICS.length;
}
