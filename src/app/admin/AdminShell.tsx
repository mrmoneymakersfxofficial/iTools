"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  BarChart3,
  Package,
  ShoppingBag,
  Users,
  Tag,
  Settings,
  Menu,
  X,
  Search,
  Bell,
} from "lucide-react";

const navItems = [
  { name: "Dashboard", icon: BarChart3, href: "/admin" },
  { name: "Productos", icon: Package, href: "/admin/productos" },
  { name: "Pedidos", icon: ShoppingBag, href: "/admin/pedidos" },
  { name: "Clientes", icon: Users, href: "/admin/clientes" },
  { name: "Cupones", icon: Tag, href: "/admin/cupones" },
  { name: "Configuración", icon: Settings, href: "/admin/configuracion" },
];

function isActive(href: string, pathname: string) {
  if (href === "/admin") return pathname === "/admin";
  return pathname.startsWith(href);
}

export default function AdminShell({
  userName,
  children,
}: {
  userName: string;
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  const currentPage = navItems.find((item) => isActive(item.href, pathname));

  return (
    <div className="flex min-h-[calc(100vh-56px)]">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-40 w-[240px] bg-[#0D0D0D] border-r border-[#1A1A1A] pt-[56px] transition-transform duration-200 flex flex-col`}
      >
        {/* User info */}
        <div className="px-4 py-4 border-b border-[#1A1A1A]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#E35205] flex items-center justify-center shrink-0">
              <span className="text-xs font-bold text-white">
                {userName
                  ?.split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()
                  .slice(0, 2) || "AD"}
              </span>
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-white truncate">
                {userName || "Admin"}
              </p>
              <p className="text-[10px] text-[#666] font-medium uppercase tracking-wider">
                Administrador
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const active = isActive(item.href, pathname);
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  active
                    ? "bg-[#E35205]/10 text-[#E35205] border border-[#E35205]/20"
                    : "text-[#888] hover:text-white hover:bg-[#1A1A1A] border border-transparent"
                }`}
              >
                <item.icon className="h-4 w-4 shrink-0" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Sidebar footer */}
        <div className="p-3 border-t border-[#1A1A1A]">
          <Link
            href="/"
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-[#666] hover:text-[#CCC] hover:bg-[#1A1A1A] transition-colors"
          >
            ← Volver a la tienda
          </Link>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 min-w-0 overflow-x-hidden">
        {/* Top bar */}
        <div className="sticky top-[56px] z-20 bg-[#0A0A0A]/90 backdrop-blur-sm border-b border-[#1A1A1A]">
          <div className="flex items-center justify-between px-4 lg:px-6 py-3">
            <div className="flex items-center gap-3">
              {/* Mobile hamburger */}
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 -ml-2 rounded-lg text-[#888] hover:text-white hover:bg-[#1A1A1A] transition-colors"
              >
                <Menu className="h-5 w-5" />
              </button>
              <div>
                <h2 className="text-base font-bold text-white">
                  {currentPage?.name || "Admin"}
                </h2>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative hidden sm:block">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#555]" />
                <input
                  type="text"
                  placeholder="Buscar..."
                  className="bg-[#1A1A1A] border border-[#222] rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder-[#555] focus:outline-none focus:border-[#E35205] w-48 transition-colors"
                />
              </div>
              <button className="relative w-9 h-9 rounded-lg bg-[#1A1A1A] border border-[#222] flex items-center justify-center text-[#888] hover:text-white transition-colors">
                <Bell className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Page content */}
        <div className="p-4 lg:p-6">{children}</div>
      </main>
    </div>
  );
}