import "server-only";

import { draftMode } from "next/headers";
import { client } from "../client";
import { serverClient } from "../client.server";

export async function sanityFetch<QueryResponse>({
  query,
  params = {},
}: {
  query: string;
  params?: any;
}): Promise<QueryResponse> {
  const isDraftMode = (await draftMode()).isEnabled;

  if (isDraftMode) {
    return serverClient.fetch<QueryResponse>(query, params, {
      stega: true,
      perspective: "previewDrafts",
      useCdn: false,
    });
  }

  return client.fetch<QueryResponse>(query, params);
}
