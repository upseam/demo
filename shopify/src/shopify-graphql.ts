import { ShopifyUserError, type UserError } from "./errors.ts";

export interface GraphqlClient {
  request<T = any>(
    query: string,
    options?: { variables?: Record<string, unknown> },
  ): Promise<{ data?: T }>;
}

export function gql(strings: TemplateStringsArray, ...values: unknown[]): string {
  return strings.reduce((out, s, i) => out + s + (values[i] ?? ""), "");
}

export async function run<T>(
  client: GraphqlClient,
  query: string,
  variables?: Record<string, unknown>,
): Promise<T> {
  const response = await client.request<T>(query, { variables });
  if (!response.data) {
    throw new Error("Empty GraphQL response");
  }
  return response.data;
}

export function assertNoUserErrors(operation: string, userErrors: UserError[] | undefined) {
  if (userErrors && userErrors.length > 0) {
    throw new ShopifyUserError(operation, userErrors);
  }
}
