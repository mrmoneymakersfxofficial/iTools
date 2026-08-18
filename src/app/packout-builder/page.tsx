import { fetchPackoutBases, fetchPackoutStackables } from "@/lib/sanity/fetch-packout";
import { PackoutBuilderClient } from "./packout-builder-client";

export default async function PackoutBuilderPage() {
  const [bases, stackables] = await Promise.all([
    fetchPackoutBases(),
    fetchPackoutStackables(),
  ]);

  return <PackoutBuilderClient bases={bases} stackables={stackables} />;
}
