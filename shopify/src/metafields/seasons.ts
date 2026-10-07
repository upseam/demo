import type { GraphqlClient } from "../shopify-graphql.ts";
import { setMetafields } from "./queries.ts";

const SEASONS = ["spring", "summer", "autumn", "winter"] as const;
export type Season = (typeof SEASONS)[number];

export function isSeason(value: string): value is Season {
  return (SEASONS as readonly string[]).includes(value);
}

export async function tagProductsWithSeason(
  client: GraphqlClient,
  productIds: string[],
  season: string,
): Promise<number> {
  if (!isSeason(season)) {
    throw new RangeError(`Unknown season: ${season}`);
  }
  return setMetafields(
    client,
    productIds.map((ownerId) => ({
      ownerId,
      namespace: "custom",
      key: "season",
      type: "single_line_text_field",
      value: season,
    })),
  );
}
