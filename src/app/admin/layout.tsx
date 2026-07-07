import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Panel de Administración | iTools Perú",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      {/* Top admin bar */}
      <header className="bg-[#111] border-b border-[#1A1A1A] px-4 py-3 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "linear-gradient(135deg, #E35205, #CC3300)" }}>
            <span className="text-xs font-black text-white">iT</span>
          </div>
          <div>
            <h1 className="text-sm font-bold uppercase tracking-wider">iTools Admin</h1>
            <p className="text-[10px] text-[#555]">Panel de Administración</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <a href="/" className="text-[10px] text-[#E35205] font-semibold hover:underline">← Ver Tienda</a>
          <div className="w-8 h-8 rounded-full bg-[#1A1A1A] flex items-center justify-center">
            <span className="text-[10px] font-bold text-[#888]">AD</span>
          </div>
        </div>
      </header>
      {children}
    </div>
  );
}