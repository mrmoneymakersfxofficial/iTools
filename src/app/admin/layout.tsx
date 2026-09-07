import type { Metadata } from "next";
import { getServerSession } from "@/lib/auth";
import AdminShell from "./AdminShell";
import AdminLoginModal from "./components/AdminLoginModal";
import Link from "next/link";
import { Shield, Sparkles, ExternalLink } from "lucide-react";

// Force dynamic rendering — admin pages query the DB and must not be prerendered at build time
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Panel de Administración (Modo Dios) | iTools Perú",
  robots: { index: false, follow: false },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession();

  // Not authenticated or not admin -> Show Super Admin Modo Dios Access Portal
  if (!session?.user || session.user.role !== "ADMIN") {
    return <AdminLoginModal />;
  }

  const userName = session.user.name || "Super Administrador";

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      {/* Top admin bar */}
      <header className="bg-[#111] border-b border-[#1A1A1A] px-4 py-3 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center shadow-md shadow-orange-500/20"
            style={{ background: "linear-gradient(135deg, #E35205, #CC3300)" }}
          >
            <span className="text-xs font-black text-white">iT</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm font-bold uppercase tracking-wider">
                iTools Admin
              </h1>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-extrabold bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-400 border border-amber-500/30 shadow-sm animate-pulse">
                <Sparkles className="w-2.5 h-2.5" />
                MODO DIOS
              </span>
            </div>
            <p className="text-[10px] text-[#777]">
              Control Maestro de Ventas, Clientes y Bsale ERP
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          <Link
            href="/cms"
            target="_blank"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-purple-500/10 text-purple-300 border border-purple-500/20 hover:bg-purple-500/20 transition-colors"
          >
            <span>Sanity CMS Studio</span>
            <ExternalLink className="w-3 h-3" />
          </Link>

          <Link
            href="/"
            className="text-xs text-[#E35205] font-semibold hover:underline"
          >
            ← Ver Tienda
          </Link>

          <div className="flex items-center gap-2 pl-2 border-l border-[#222]">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-sm">
              <span className="text-[10px] font-black text-black">
                {userName
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()
                  .slice(0, 2)}
              </span>
            </div>
            <span className="text-xs font-medium text-[#CCC] hidden md:inline truncate max-w-[120px]">
              {userName}
            </span>
          </div>
        </div>
      </header>
      <AdminShell userName={userName}>{children}</AdminShell>
    </div>
  );
}