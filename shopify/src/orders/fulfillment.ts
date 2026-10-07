import { assertNoUserErrors, gql, run, type GraphqlClient } from "../shopify-graphql.ts";
import type { UserError } from "../errors.ts";
import { NotFoundError } from "../errors.ts";
import { getFulfillmentOrders } from "./queries.ts";

export interface TrackingInfo {
  number: string;
  company: string;
  url?: string;
}

const FULFILLMENT_CREATE = gql`
  mutation fulfillmentCreate($fulfillment: FulfillmentInput!) {
    fulfillmentCreate(fulfillment: $fulfillment) {
      fulfillment {
        id
        status
      }
      userErrors {
        field
        message
      }
    }
  }
`;

export async function fulfillOrder(
  client: GraphqlClient,
  orderId: string,
  tracking: TrackingInfo,
): Promise<string[]> {
  const fulfillmentOrders = await getFulfillmentOrders(client, orderId);
  const open = fulfillmentOrders.filter((fo) => fo.status === "OPEN" || fo.status === "IN_PROGRESS");
  if (open.length === 0) {
    throw new NotFoundError(`Open fulfillment order for ${orderId}`);
  }
  const ids: string[] = [];
  for (const fulfillmentOrder of open) {
    const data = await run<{
      fulfillmentCreate: { fulfillment: { id: string } | null; userErrors: UserError[] };
    }>(client, FULFILLMENT_CREATE, {
      fulfillment: {
        notifyCustomer: true,
        trackingInfo: { number: tracking.number, company: tracking.company, url: tracking.url },
        lineItemsByFulfillmentOrder: [{ fulfillmentOrderId: fulfillmentOrder.id }],
      },
    });
    assertNoUserErrors("fulfillmentCreate", data.fulfillmentCreate.userErrors);
    if (data.fulfillmentCreate.fulfillment) {
      ids.push(data.fulfillmentCreate.fulfillment.id);
    }
  }
  return ids;
}
