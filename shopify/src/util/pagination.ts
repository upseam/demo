export interface Connection<T> {
  edges: { cursor: string; node: T }[];
  pageInfo: { hasNextPage: boolean; endCursor: string | null };
}

export async function collectAll<T>(
  fetchPage: (after: string | null) => Promise<Connection<T>>,
  maxPages = 50,
): Promise<T[]> {
  const nodes: T[] = [];
  let after: string | null = null;
  for (let page = 0; page < maxPages; page += 1) {
    const connection: Connection<T> = await fetchPage(after);
    nodes.push(...connection.edges.map((edge) => edge.node));
    if (!connection.pageInfo.hasNextPage) {
      break;
    }
    after = connection.pageInfo.endCursor;
  }
  return nodes;
}
