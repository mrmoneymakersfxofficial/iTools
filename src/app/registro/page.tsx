import type { Metadata } from "next";
import { AuthForm } from "./layout";

export const metadata: Metadata = {
  title: "Crear Cuenta | iTools Perú",
  robots: { index: false },
};

export default function RegisterPage() {
  return <AuthForm mode="register" />;
}