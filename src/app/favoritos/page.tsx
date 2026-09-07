import type { Metadata } from "next";
import { FavoritosClient } from "./favoritos-client";

export const metadata: Metadata = {
  title: "Mis Favoritos | iTools Perú",
  description: "Revisa tus productos guardados y herramientas favoritas en iTools Perú.",
};

export default function FavoritosPage() {
  return <FavoritosClient />;
}
