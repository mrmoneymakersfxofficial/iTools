import type { Metadata } from "next";
import { AuthForm } from "./layout";

export const metadata: Metadata = {
  title: "Iniciar Sesión | iTools Perú",
  robots: { index: false },
};

export default function LoginPage() {
  return <AuthForm mode="login" />;
}