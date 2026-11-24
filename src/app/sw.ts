import { defaultCache } from "@serwist/next/worker";
import { NetworkOnly, type PrecacheEntry, type SerwistGlobalConfig } from "serwist";
import { Serwist } from "serwist";

declare global {
  interface WorkerGlobalScope extends SerwistGlobalConfig {
    __SW_MANIFEST: (PrecacheEntry | string)[] | undefined;
  }
}

declare const self: WorkerGlobalScope;

const serwist = new Serwist({
  precacheEntries: self.__SW_MANIFEST,
  skipWaiting: true,
  clientsClaim: true,
  navigationPreload: true,
  runtimeCaching: [
    // Never serve stale cached HTML, Next.js RSC payloads, APIs or CMS routes
    {
      matcher: ({ request, url }) =>
        request.mode === "navigate" ||
        request.destination === "document" ||
        request.headers.get("RSC") === "1" ||
        url.searchParams.has("_rsc") ||
        url.pathname.startsWith("/api/") ||
        url.pathname.startsWith("/cms"),
      handler: new NetworkOnly(),
    },
    ...defaultCache,
  ],
});

serwist.addEventListeners();
