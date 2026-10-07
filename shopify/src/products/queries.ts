import { gql, run, type GraphqlClient } from "../shopify-graphql.ts";
import { collectAll, type Connection } from "../util/pagination.ts";

export interface ProductSummary {
  id: string;
  handle: string;
  title: string;
  status: string;
  totalInventory: number;
  updatedAt: string;
}

const PRODUCT_FIELDS = gql`
  id
  handle
  title
  status
  totalInventory
  updatedAt
`;

const PRODUCT_BY_HANDLE = gql`
  query productFromHandle($handle: String!) {
    productByIdentifier(identifier: { handle: $handle }) {
      ${PRODUCT_FIELDS}
    }
  }
`;

const PRODUCTS_PAGE = gql`
  query productsPage($first: Int!, $after: String, $query: String) {
    products(first: $first, after: $after, query: $query) {
      edges {
        cursor
        node {
          ${PRODUCT_FIELDS}
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;

export async function findProductByHandle(
  client: GraphqlClient,
  handle: string,
): Promise<ProductSummary | null> {
  const data = await run<{ productByIdentifier: ProductSummary | null }>(client, PRODUCT_BY_HANDLE, { handle });
  return data.productByIdentifier;
}

export async function listProducts(
  client: GraphqlClient,
  updatedSince?: string,
): Promise<ProductSummary[]> {
  const query = updatedSince ? `updated_at:>'${updatedSince}'` : undefined;
  return collectAll((after) =>
    run<{ products: Connection<ProductSummary> }>(client, PRODUCTS_PAGE, {
      first: 100,
      after,
      query,
    }).then((data) => data.products),
  );
}
