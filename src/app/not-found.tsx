"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center gap-6 p-8 text-center">
      <h1 className="text-6xl font-bold text-primary">404</h1>
      <h2 className="text-2xl font-semibold">Página no encontrada</h2>
      <p className="max-w-md text-muted-foreground">
        Lo sentamos, la página que buscas no existe o ha sido movida.
      </p>
      <Link href="/">
        <Button size="lg">Volver al inicio</Button>
      </Link>
    </div>
  );
}
