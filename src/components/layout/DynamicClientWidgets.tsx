"use client";

import dynamic from "next/dynamic";

const ProductQuickView = dynamic(
  () => import("@/components/product/ProductQuickView").then((m) => ({ default: m.ProductQuickView })),
  { ssr: false }
);

const IToolsAssistant = dynamic(
  () => import("@/components/layout/IToolsAssistant").then((m) => ({ default: m.IToolsAssistant })),
  { ssr: false }
);

export function DynamicClientWidgets() {
  return (
    <>
      <ProductQuickView />
      <IToolsAssistant />
    </>
  );
}
