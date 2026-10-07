import { assertNoUserErrors, gql, run, type GraphqlClient } from "../shopify-graphql.ts";
import type { UserError } from "../errors.ts";

const PRODUCT_EXPORT = gql`
  {
    products {
      edges {
        node {
          id
          title
          variants {
            edges {
              node {
                id
                sku
                inventoryQuantity
              }
            }
          }
        }
      }
    }
  }
`;

const RUN_QUERY = gql`
  mutation runExport($query: String!) {
    bulkOperationRunQuery(query: $query, groupObjects: true) {
      bulkOperation {
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

export async function startProductExport(client: GraphqlClient): Promise<string> {
  const data = await run<{
    bulkOperationRunQuery: { bulkOperation: { id: string } | null; userErrors: UserError[] };
  }>(client, RUN_QUERY, { query: PRODUCT_EXPORT });
  assertNoUserErrors("bulkOperationRunQuery", data.bulkOperationRunQuery.userErrors);
  const operation = data.bulkOperationRunQuery.bulkOperation;
  if (!operation) {
    throw new Error("Bulk export did not start");
  }
  return operation.id;
}
