import { gql, run, type GraphqlClient } from "../shopify-graphql.ts";
import type { Money } from "../util/money.ts";

export interface DraftOrderSummary {
  id: string;
  name: string;
  status: string;
  totalPriceSet: { shopMoney: Money };
}

const OPEN_DRAFT_ORDERS = gql`
  query openDraftOrders {
    shop {
      draftOrders(first: 50, query: "status:open") {
        edges {
          node {
            id
            name
            status
            totalPriceSet {
              shopMoney {
                amount
                currencyCode
              }
            }
          }
        }
      }
    }
  }
`;

export async function listOpenDraftOrders(client: GraphqlClient): Promise<DraftOrderSummary[]> {
  const data = await run<{
    shop: { draftOrders: { edges: { node: DraftOrderSummary }[] } };
  }>(client, OPEN_DRAFT_ORDERS);
  return data.shop.draftOrders.edges.map((edge) => edge.node);
}
