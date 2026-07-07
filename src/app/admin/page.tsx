"use client";

import { useState } from "react";
import {
  Package, ShoppingBag, Users, TrendingUp, DollarSign, Eye,
  BarChart3, Settings, Bell, Search, Wrench, ArrowUpRight, ArrowDownRight,
} from "lucide-react";
import Link from "next/link";

const stats = [
  { label: "Ventas Hoy", value: "S/ 24,580", change: "+12.5%", up: true, icon: DollarSign, color: "#E35205" },
  { label: "Pedidos", value: "47", change: "+8.3%", up: true, icon: ShoppingBag, color: "#0077C8" },
  { label: "Productos", value: "96", change: "+6", up: true, icon: Package, color: "#1b7a3a" },
  { label: "Visitas Hoy", value: "1,284", change: "-2.1%", up: false, icon: Eye, color: "#8B6914" },
];

const recentOrders = [
  { id: "#IT-2024-0847", customer: "Carlos M.", total: "S/ 2,899.00", status: "Completado", brand: "Milwaukee", time: "Hace 12 min" },
  { id: "#IT-2024-0846", customer: "María L.", total: "S/ 549.00", status: "Enviado", brand: "Bosch", time: "Hace 34 min" },
  { id: "#IT-2024-0845", customer: "Jorge R.", total: "S/ 4,299.00", status: "Procesando", brand: "Festool", time: "Hace 1h" },
  { id: "#IT-2024-0844", customer: "Ana P.", total: "S/ 189.00", status: "Completado", brand: "3M", time: "Hace 2h" },
  { id: "#IT-2024-0843", customer: "Luis F.", total: "S/ 1,599.00", status: "Enviado", brand: "DeWalt", time: "Hace 3h" },
  { id: "#IT-2024-0842", customer: "Rosa G.", total: "S/ 329.00", status: "Completado", brand: "SKIL", time: "Hace 4h" },
];

const topProducts = [
  { name: "Taladro Percutor M18 FUEL 1/2\"", brand: "Milwaukee", sales: 34, revenue: "S/ 98,566", trend: "+18%" },
  { name: "Impacto Inalámbrico M18 1/4\" Hex", brand: "Milwaukee", sales: 28, revenue: "S/ 61,880", trend: "+12%" },
  { name: "Taladro Percutor 18V Brushless", brand: "Bosch", sales: 22, revenue: "S/ 52,780", trend: "+9%" },
  { name: "Kit 3 Herramientas SKIL 20V", brand: "SKIL", sales: 19, revenue: "S/ 30,381", trend: "+24%" },
  { name: "Soplador de Mochila EGO 580 CFM", brand: "EGO", sales: 16, revenue: "S/ 35,184", trend: "+15%" },
];

const statusColors: Record<string, string> = {
  Completado: "bg-green-500/15 text-green-400 border-green-500/20",
  Enviado: "bg-blue-500/15 text-blue-400 border-blue-500/20",
  Procesando: "bg-amber-500/15 text-amber-400 border-amber-500/20",
  Pendiente: "bg-red-500/15 text-red-400 border-red-500/20",
};

const navItems = [
  { name: "Dashboard", icon: BarChart3, active: true },
  { name: "Productos", icon: Package, href: "/admin/productos" },
  { name: "Pedidos", icon: ShoppingBag, href: "/admin/pedidos" },
  { name: "Clientes", icon: Users, href: "/admin/clientes" },
  { name: "Configuración", icon: Settings, href: "/admin/config" },
];

export default function AdminPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-[calc(100vh-56px)]">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-40 w-[240px] bg-[#0D0D0D] border-r border-[#1A1A1A] pt-16 lg:pt-0 transition-transform lg:transition-none`}>
        <nav className="p-3 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href || "#"}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                item.active
                  ? "bg-[#E35205]/10 text-[#E35205] border border-[#E35205]/20"
                  : "text-[#888] hover:text-white hover:bg-[#1A1A1A]"
              }`}
              onClick={() => setSidebarOpen(false)}
            >
              <item.icon className="h-4 w-4" />
              {item.name}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main content */}
      <main className="flex-1 p-4 lg:p-6 overflow-x-hidden">
        {/* Mobile hamburger */}
        <button
          onClick={() => setSidebarOpen(true)}
          className="lg:hidden mb-4 p-2 rounded-lg bg-[#1A1A1A] text-[#888]"
        >
          <BarChart3 className="h-5 w-5" />
        </button>

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
          <div>
            <h2 className="text-xl font-bold">Dashboard</h2>
            <p className="text-xs text-[#666] mt-0.5">Resumen de la tienda — Julio 6, 2026</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#555]" />
              <input
                type="text"
                placeholder="Buscar..."
                className="bg-[#1A1A1A] border border-[#222] rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder-[#555] focus:outline-none focus:border-[#E35205] w-48"
              />
            </div>
            <button className="relative w-9 h-9 rounded-lg bg-[#1A1A1A] border border-[#222] flex items-center justify-center text-[#888] hover:text-white transition-colors">
              <Bell className="h-4 w-4" />
              <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#E35205] text-[8px] font-bold text-white flex items-center justify-center">3</div>
            </button>
          </div>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-[#111] rounded-xl border border-[#1A1A1A] p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${stat.color}15` }}>
                  <stat.icon className="h-4 w-4" style={{ color: stat.color }} />
                </div>
                <div className={`flex items-center gap-0.5 text-[10px] font-bold ${stat.up ? "text-green-400" : "text-red-400"}`}>
                  {stat.up ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                  {stat.change}
                </div>
              </div>
              <p className="text-lg font-bold text-white">{stat.value}</p>
              <p className="text-[10px] text-[#666] mt-0.5">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Recent Orders */}
          <div className="lg:col-span-2 bg-[#111] rounded-xl border border-[#1A1A1A] overflow-hidden">
            <div className="px-4 py-3 border-b border-[#1A1A1A] flex items-center justify-between">
              <h3 className="text-sm font-bold">Pedidos Recientes</h3>
              <span className="text-[10px] text-[#E35205] font-semibold">Ver todos →</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-[10px] text-[#555] uppercase tracking-wider border-b border-[#1A1A1A]">
                    <th className="px-4 py-2.5 font-semibold">Orden</th>
                    <th className="px-4 py-2.5 font-semibold">Cliente</th>
                    <th className="px-4 py-2.5 font-semibold hidden sm:table-cell">Marca</th>
                    <th className="px-4 py-2.5 font-semibold">Total</th>
                    <th className="px-4 py-2.5 font-semibold">Estado</th>
                    <th className="px-4 py-2.5 font-semibold hidden sm:table-cell">Tiempo</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1A1A1A]">
                  {recentOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-[#0D0D0D] transition-colors">
                      <td className="px-4 py-3 text-xs font-mono text-[#E35205]">{order.id}</td>
                      <td className="px-4 py-3 text-xs text-[#CCC]">{order.customer}</td>
                      <td className="px-4 py-3 text-xs text-[#888] hidden sm:table-cell">{order.brand}</td>
                      <td className="px-4 py-3 text-xs font-semibold text-white">{order.total}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-block px-2 py-0.5 rounded-full text-[9px] font-bold border ${statusColors[order.status] || statusColors.Pendiente}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-[10px] text-[#666] hidden sm:table-cell">{order.time}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Top Products */}
          <div className="bg-[#111] rounded-xl border border-[#1A1A1A] overflow-hidden">
            <div className="px-4 py-3 border-b border-[#1A1A1A] flex items-center justify-between">
              <h3 className="text-sm font-bold">Top Productos</h3>
              <TrendingUp className="h-4 w-4 text-[#E35205]" />
            </div>
            <div className="divide-y divide-[#1A1A1A]">
              {topProducts.map((product, i) => (
                <div key={i} className="px-4 py-3 flex items-center gap-3">
                  <div className="w-7 h-7 rounded-lg bg-[#1A1A1A] flex items-center justify-center text-[10px] font-bold text-[#666]">
                    {i + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] text-[#CCC] font-medium truncate">{product.name}</p>
                    <p className="text-[9px] text-[#555]">{product.brand} · {product.sales} ventas</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-[11px] font-bold text-white">{product.revenue}</p>
                    <p className="text-[9px] text-green-400 font-medium">{product.trend}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Brand performance */}
        <div className="mt-4 bg-[#111] rounded-xl border border-[#1A1A1A] p-4">
          <h3 className="text-sm font-bold mb-3">Rendimiento por Marca</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
            {[
              { name: "Milwaukee", color: "#D1001C", pct: 85 },
              { name: "DeWalt", color: "#FFD700", pct: 72 },
              { name: "Bosch", color: "#005691", pct: 68 },
              { name: "Makita", color: "#0077C8", pct: 61 },
              { name: "STANLEY", color: "#E35205", pct: 45 },
              { name: "3M", color: "#CC3300", pct: 38 },
            ].map((b) => (
              <div key={b.name} className="bg-[#0D0D0D] rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold text-[#CCC]">{b.name}</span>
                  <span className="text-[10px] font-bold" style={{ color: b.color }}>{b.pct}%</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-[#1A1A1A]">
                  <div className="h-full rounded-full transition-all" style={{ width: `${b.pct}%`, backgroundColor: b.color }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}