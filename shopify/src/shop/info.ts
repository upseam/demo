import { gql, run, type GraphqlClient } from "../shopify-graphql.ts";

export interface ShopInfo {
  name: string;
  email: string;
  currencyCode: string;
  billingAddress: {
    address1: string | null;
    city: string | null;
    province: string | null;
    zip: string | null;
    country: string | null;
  };
}

const SHOP_INFO = gql`
  query shopInfo {
    shop {
      name
      email
      currencyCode
      billingAddress {
        address1
        city
        province
        zip
        country
      }
    }
  }
`;

export async function getShopInfo(client: GraphqlClient): Promise<ShopInfo> {
  const data = await run<{ shop: ShopInfo }>(client, SHOP_INFO);
  return data.shop;
}

export function formatAddress(address: ShopInfo["billingAddress"]): string {
  return [address.address1, address.city, address.province, address.zip, address.country]
    .filter((part): part is string => Boolean(part))
    .join(", ");
}
