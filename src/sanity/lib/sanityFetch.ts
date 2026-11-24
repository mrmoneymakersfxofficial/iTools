import "server-only";

import { draftMode } from "next/headers";
import { client } from "../client";
import { serverClient } from "../client.server";

export async function sanityFetch<QueryResponse>({
  query,
  params = {},
  revalidate = 0,
  tags = ["sanity"],
}: {
  query: string;
  params?: any;
  revalidate?: number | false;
  tags?: string[];
}): Promise<QueryResponse> {
  const isDraftMode = (await draftMode()).isEnabled;

  if (isDraftMode) {
    return serverClient.fetch<QueryResponse>(query, params, {
      stega: true,
      perspective: "previewDrafts",
      useCdn: false,
    });
  }

  return client.fetch<QueryResponse>(query, params, {
    useCdn: false,
    next: {
      revalidate: revalidate === false ? false : revalidate,
      tags,
    },
  });
}
