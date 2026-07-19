import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { presentationTool } from "@sanity/presentation";
import { apiVersion, dataset, projectId } from "./env";
import { schemaTypes } from "./schemas";

const projectIdValue = projectId;

export default defineConfig({
  name: "iTools-CMS",
  title: "iTools Perú CMS",
  projectId: projectIdValue,
  dataset,
  apiVersion,
  basePath: "/studio",
  plugins: [
    structureTool(),
    visionTool(),
    presentationTool({
      previewUrl: {
        origin: "https://i-tools-steel.vercel.app",
        previewMode: {
          enable: "/api/draft",
        },
      },
    }),
  ],
  schema: {
    types: schemaTypes,
  },
});