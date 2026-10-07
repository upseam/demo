import type { GraphqlClient } from "../src/shopify-graphql.ts";

export interface Call {
  query: string;
  variables?: Record<string, unknown>;
}

export function fakeClient(responses: unknown[]): GraphqlClient & { calls: Call[] } {
  const calls: Call[] = [];
  let index = 0;
  return {
    calls,
    async request(query, options) {
      calls.push({ query, variables: options?.variables });
      const data = responses[index];
      index += 1;
      return { data: data as any };
    },
  };
}
