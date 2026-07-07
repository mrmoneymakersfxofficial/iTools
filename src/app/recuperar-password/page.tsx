import type { Metadata } from "next";
import { AuthForm } from "./layout";

export const metadata: Metadata = {
  title: "Recuperar Contraseña | iTools Perú",
  robots: { index: false },
};

export default function RecoverPage() {
  return <AuthForm mode="recover" />;
}