import type { Metadata } from "next";
import { getServerSession } from "@/lib/auth";
import AdminShell from "./AdminShell";

export const metadata: Metadata = {
  title: "Panel de Administración | iTools Perú",
  robots: { index: false, follow: false },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession();

  // Not authenticated or not admin
  if (!session?.user || session.user.role !== "ADMIN") {
    return (
      <div className="min-h-screen bg-[#0A0A0A] text-white flex flex-col items-center justify-center px-4">
        <div className="w-16 h-16 rounded-2xl bg-[#E35205]/10 border border-[#E35205]/20 flex items-center justify-center mb-6">
          <svg className="w-8 h-8 text-[#E35205]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold mb-2">Acceso denegado</h1>
        <p className="text-sm text-[#888] mb-6 text-center max-w-md">
          No tienes permisos para acceder al panel de administración. Inicia sesión con una cuenta de administrador.
        </p>
        <a
          href="/login"
          className="px-6 py-2.5 rounded-lg text-sm font-semibold text-white transition-colors"
          style={{ background: "linear-gradient(135deg, #E35205, #CC3300)" }}
        >
          Iniciar sesión
        </a>
      </div>
    );
  }

  const userName = session.user.name || "Admin";

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      {/* Top admin bar */}
      <header className="bg-[#111] border-b border-[#1A1A1A] px-4 py-3 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #E35205, #CC3300)" }}
          >
            <span className="text-xs font-black text-white">iT</span>
          </div>
          <div>
            <h1 className="text-sm font-bold uppercase tracking-wider">
              iTools Admin
            </h1>
            <p className="text-[10px] text-[#555]">
              Panel de Administración
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <a
            href="/"
            className="text-[10px] text-[#E35205] font-semibold hover:underline"
          >
            ← Ver Tienda
          </a>
          <div className="w-8 h-8 rounded-full bg-[#E35205] flex items-center justify-center">
            <span className="text-[10px] font-bold text-white">
              {userName
                .split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()
                .slice(0, 2)}
            </span>
          </div>
        </div>
      </header>
      <AdminShell userName={userName}>{children}</AdminShell>
    </div>
  );
}