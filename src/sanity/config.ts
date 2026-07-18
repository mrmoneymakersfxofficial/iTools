import { defineConfig } from "next-sanity/studio";
import { apiVersion, dataset, projectId } from "./env";
import { schemaTypes } from "./schemas";

export default defineConfig({
  name: "iTools-CMS",
  title: "iTools Perú CMS",
  projectId,
  dataset,
  apiVersion,
  basePath: "/studio",
  plugins: [],
  schema: {
    types: schemaTypes,
  },
});