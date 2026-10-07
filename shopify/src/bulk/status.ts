import { gql, run, type GraphqlClient } from "../shopify-graphql.ts";

export interface BulkOperationStatus {
  id: string;
  status: string;
  objectCount: string;
  url: string | null;
}

const CURRENT_OPERATION = gql`
  query currentExport {
    currentBulkOperation(type: QUERY) {
      id
      status
      objectCount
      url
    }
  }
`;

export async function currentExport(client: GraphqlClient): Promise<BulkOperationStatus | null> {
  const data = await run<{ currentBulkOperation: BulkOperationStatus | null }>(client, CURRENT_OPERATION);
  return data.currentBulkOperation;
}

export async function waitForExport(
  client: GraphqlClient,
  sleep: (ms: number) => Promise<void> = (ms) => new Promise((resolve) => setTimeout(resolve, ms)),
  attempts = 30,
): Promise<BulkOperationStatus> {
  for (let i = 0; i < attempts; i += 1) {
    const operation = await currentExport(client);
    if (operation && operation.status !== "CREATED" && operation.status !== "RUNNING") {
      return operation;
    }
    await sleep(2000);
  }
  throw new Error("Bulk export did not finish in time");
}
