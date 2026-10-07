import { assertNoUserErrors, gql, run, type GraphqlClient } from "../shopify-graphql.ts";
import type { UserError } from "../errors.ts";

export interface MetafieldInput {
  ownerId: string;
  namespace: string;
  key: string;
  type: string;
  value: string;
}

const METAFIELDS_SET = gql`
  mutation metafieldsSet($metafields: [MetafieldsSetInput!]!) {
    metafieldsSet(metafields: $metafields) {
      metafields {
        id
        key
      }
      userErrors {
        field
        message
      }
    }
  }
`;

export async function setMetafields(client: GraphqlClient, metafields: MetafieldInput[]): Promise<number> {
  let written = 0;
  for (let i = 0; i < metafields.length; i += 25) {
    const batch = metafields.slice(i, i + 25);
    const data = await run<{
      metafieldsSet: { metafields: { id: string }[]; userErrors: UserError[] };
    }>(client, METAFIELDS_SET, { metafields: batch });
    assertNoUserErrors("metafieldsSet", data.metafieldsSet.userErrors);
    written += data.metafieldsSet.metafields.length;
  }
  return written;
}
