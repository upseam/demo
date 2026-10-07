import { assertNoUserErrors, gql, run, type GraphqlClient } from "../shopify-graphql.ts";
import type { UserError } from "../errors.ts";

const REGISTER = gql`
  mutation registerFulfillmentService($name: String!, $callbackUrl: URL!) {
    fulfillmentServiceCreate(
      name: $name
      callbackUrl: $callbackUrl
      trackingSupport: true
      inventoryManagement: true
      permitsSkuSharing: true
    ) {
      fulfillmentService {
        id
        serviceName
      }
      userErrors {
        field
        message
      }
    }
  }
`;

export async function registerFulfillmentService(
  client: GraphqlClient,
  name: string,
  callbackUrl: string,
): Promise<string> {
  const data = await run<{
    fulfillmentServiceCreate: { fulfillmentService: { id: string } | null; userErrors: UserError[] };
  }>(client, REGISTER, { name, callbackUrl });
  assertNoUserErrors("fulfillmentServiceCreate", data.fulfillmentServiceCreate.userErrors);
  const service = data.fulfillmentServiceCreate.fulfillmentService;
  if (!service) {
    throw new Error("Fulfillment service was not created");
  }
  return service.id;
}
