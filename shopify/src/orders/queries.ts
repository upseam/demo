import { gql, run, type GraphqlClient } from "../shopify-graphql.ts";
import { collectAll, type Connection } from "../util/pagination.ts";
import type { Money } from "../util/money.ts";

export interface OrderSummary {
  id: string;
  name: string;
  displayFulfillmentStatus: string;
  totalPriceSet: { shopMoney: Money };
  createdAt: string;
}

export interface FulfillmentOrderSummary {
  id: string;
  status: string;
  assignedLocation: { location: { id: string } | null };
}

const ORDERS_PAGE = gql`
  query ordersPage($first: Int!, $after: String, $query: String) {
    orders(first: $first, after: $after, query: $query, sortKey: CREATED_AT) {
      edges {
        cursor
        node {
          id
          name
          displayFulfillmentStatus
          createdAt
          totalPriceSet {
            shopMoney {
              amount
              currencyCode
            }
          }
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;

const FULFILLMENT_ORDERS = gql`
  query fulfillmentOrders($orderId: ID!) {
    order(id: $orderId) {
      fulfillmentOrders(first: 10) {
        edges {
          node {
            id
            status
            assignedLocation {
              location {
                id
              }
            }
          }
        }
      }
    }
  }
`;

export async function listUnfulfilledOrders(client: GraphqlClient): Promise<OrderSummary[]> {
  return collectAll((after) =>
    run<{ orders: Connection<OrderSummary> }>(client, ORDERS_PAGE, {
      first: 100,
      after,
      query: "fulfillment_status:unfulfilled",
    }).then((data) => data.orders),
  );
}

export async function getFulfillmentOrders(
  client: GraphqlClient,
  orderId: string,
): Promise<FulfillmentOrderSummary[]> {
  const data = await run<{
    order: { fulfillmentOrders: { edges: { node: FulfillmentOrderSummary }[] } } | null;
  }>(client, FULFILLMENT_ORDERS, { orderId });
  return data.order?.fulfillmentOrders.edges.map((edge) => edge.node) ?? [];
}
