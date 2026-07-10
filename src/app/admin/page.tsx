import { db } from "@/lib/db";
import {
  DollarSign,
  ShoppingBag,
  Package,
  Users,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  AlertTriangle,
} from "lucide-react";
import Link from "next/link";

/* ── Helpers ─────────────────────────────────────────────────── */

function parseItems(itemsJson: string): Array<{ productId: string; name: string; quantity: number; price: number }> {
  try {
    const parsed = JSON.parse(itemsJson);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

const statusColors: Record<string, string> = {
  DELIVERED: "bg-green-500/15 text-green-400 border-green-500/20",
  SHIPPED: "bg-blue-500/15 text-blue-400 border-blue-500/20",
  PROCESSING: "bg-amber-500/15 text-amber-400 border-amber-500/20",
  CONFIRMED: "bg-indigo-500/15 text-indigo-400 border-indigo-500/20",
  PENDING: "bg-yellow-500/15 text-yellow-400 border-yellow-500/20",
  CANCELLED: "bg-red-500/15 text-red-400 border-red-500/20",
  REFUNDED: "bg-red-500/15 text-red-400 border-red-500/20",
};

const statusLabels: Record<string, string> = {
  PENDING: "Pendiente",
  CONFIRMED: "Confirmado",
  PROCESSING: "Procesando",
  SHIPPED: "Enviado",
  DELIVERED: "Entregado",
  CANCELLED: "Cancelado",
  REFUNDED: "Reembolsado",
};

function formatSoles(n: number) {
  return `S/ ${n.toLocaleString("es-PE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function timeAgo(date: Date) {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return "Ahora";
  if (diffMin < 60) return `Hace ${diffMin} min`;
  const diffHrs = Math.floor(diffMin / 60);
  if (diffHrs < 24) return `Hace ${diffHrs}h`;
  const diffDays = Math.floor(diffHrs / 24);
  return `Hace ${diffDays}d`;
}

/* ── Data Fetching ───────────────────────────────────────────── */

const todayStart = new Date();
todayStart.setHours(0, 0, 0, 0);

const sevenDaysAgo = new Date();
sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
sevenDaysAgo.setHours(0, 0, 0, 0);

async function getDashboardData() {
  const [
    salesToday,
    totalOrders,
    totalProducts,
    totalCustomers,
    recentOrders,
    allOrders,
    lowStockProducts,
    revenueLast7Days,
  ] = await Promise.all([
    // Sales today (non-cancelled)
    db.order.aggregate({
      where: {
        createdAt: { gte: todayStart },
        status: { not: "CANCELLED" },
      },
      _sum: { total: true },
    }),
    // Total orders
    db.order.count(),
    // Total products
    db.product.count(),
    // Total customers
    db.user.count({ where: { role: "CUSTOMER" } }),
    // Recent 10 orders with user
    db.order.findMany({
      take: 10,
      orderBy: { createdAt: "desc" },
      include: { user: { select: { name: true } } },
    }),
    // All orders for status breakdown & top products
    db.order.findMany({
      where: { status: { not: "CANCELLED" } },
      select: { items: true, status: true },
    }),
    // Low stock products
    db.product.findMany({
      where: {
        isPublished: true,
        stock: { lte: db.product.fields.lowStockAlert },
      },
      include: { brand: { select: { name: true } } },
      orderBy: { stock: "asc" },
      take: 8,
    }),
    // Revenue last 7 days
    db.order.groupBy({
      by: ["createdAt"],
      where: {
        createdAt: { gte: sevenDaysAgo },
        status: { not: "CANCELLED" },
      },
      _sum: { total: true },
    }),
  ]);

  // Status breakdown
  const statusBreakdown: Record<string, number> = {};
  for (const o of allOrders) {
    statusBreakdown[o.status] = (statusBreakdown[o.status] || 0) + 1;
  }

  // Top 5 products by quantity sold
  const productSales: Record<string, { name: string; quantity: number; revenue: number }> = {};
  for (const o of allOrders) {
    const items = parseItems(o.items);
    for (const item of items) {
      if (!productSales[item.productId]) {
        productSales[item.productId] = { name: item.name, quantity: 0, revenue: 0 };
      }
      productSales[item.productId].quantity += item.quantity;
      productSales[item.productId].revenue += item.price * item.quantity;
    }
  }
  const topProducts = Object.values(productSales)
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5);

  // Revenue by day (last 7 days)
  const revenueByDay: { day: string; total: number }[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    d.setHours(0, 0, 0, 0);
    const nextD = new Date(d);
    nextD.setDate(nextD.getDate() + 1);
    const dayTotal = revenueLast7Days
      .filter((r) => {
        const rd = new Date(r.createdAt);
        return rd >= d && rd < nextD;
      })
      .reduce((sum, r) => sum + (r._sum.total || 0), 0);
    revenueByDay.push({
      day: d.toLocaleDateString("es-PE", { weekday: "short" }),
      total: dayTotal,
    });
  }

  const maxRevenue = Math.max(...revenueByDay.map((d) => d.total), 1);

  return {
    salesToday: salesToday._sum.total || 0,
    totalOrders,
    totalProducts,
    totalCustomers,
    recentOrders,
    statusBreakdown,
    topProducts,
    lowStockProducts,
    revenueByDay,
    maxRevenue,
  };
}

/* ── Page ────────────────────────────────────────────────────── */

export default async function AdminDashboard() {
  const data = await getDashboardData();

  const todayLabel = new Date().toLocaleDateString("es-PE", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const stats = [
    {
      label: "Ventas Hoy",
      value: formatSoles(data.salesToday),
      icon: DollarSign,
      color: "#E35205",
    },
    {
      label: "Pedidos",
      value: data.totalOrders.toLocaleString("es-PE"),
      icon: ShoppingBag,
      color: "#0077C8",
    },
    {
      label: "Productos",
      value: data.totalProducts.toLocaleString("es-PE"),
      icon: Package,
      color: "#1b7a3a",
    },
    {
      label: "Clientes",
      value: data.totalCustomers.toLocaleString("es-PE"),
      icon: Users,
      color: "#8B6914",
    },
  ];

  const statusEntries = Object.entries(data.statusBreakdown).sort(
    (a, b) => b[1] - a[1]
  );

  return (
    <>
      {/* Subheader */}
      <div className="mb-6">
        <p className="text-xs text-[#666]">
          Resumen de la tienda — {todayLabel}
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-[#111] rounded-xl border border-[#1A1A1A] p-4"
          >
            <div className="flex items-center justify-between mb-3">
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: `${stat.color}15` }}
              >
                <stat.icon
                  className="h-4 w-4"
                  style={{ color: stat.color }}
                />
              </div>
            </div>
            <p className="text-lg font-bold text-white">{stat.value}</p>
            <p className="text-[10px] text-[#666] mt-0.5">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
        {/* Recent Orders */}
        <div className="lg:col-span-2 bg-[#111] rounded-xl border border-[#1A1A1A] overflow-hidden">
          <div className="px-4 py-3 border-b border-[#1A1A1A] flex items-center justify-between">
            <h3 className="text-sm font-bold">Pedidos Recientes</h3>
            <Link
              href="/admin/pedidos"
              className="text-[10px] text-[#E35205] font-semibold hover:underline"
            >
              Ver todos →
            </Link>
          </div>
          {data.recentOrders.length === 0 ? (
            <div className="px-4 py-12 text-center text-sm text-[#666]">
              No hay pedidos todavía
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-[10px] text-[#555] uppercase tracking-wider border-b border-[#1A1A1A]">
                    <th className="px-4 py-2.5 font-semibold">Orden</th>
                    <th className="px-4 py-2.5 font-semibold">Cliente</th>
                    <th className="px-4 py-2.5 font-semibold hidden sm:table-cell">
                      Items
                    </th>
                    <th className="px-4 py-2.5 font-semibold">Total</th>
                    <th className="px-4 py-2.5 font-semibold">Estado</th>
                    <th className="px-4 py-2.5 font-semibold hidden sm:table-cell">
                      Tiempo
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1A1A1A]">
                  {data.recentOrders.map((order) => {
                    const items = parseItems(order.items);
                    return (
                      <tr
                        key={order.id}
                        className="hover:bg-[#0D0D0D] transition-colors"
                      >
                        <td className="px-4 py-3 text-xs font-mono text-[#E35205]">
                          {order.orderNumber}
                        </td>
                        <td className="px-4 py-3 text-xs text-[#CCC]">
                          {order.user?.name || "Cliente"}
                        </td>
                        <td className="px-4 py-3 text-xs text-[#888] hidden sm:table-cell">
                          {items.length} {items.length === 1 ? "item" : "items"}
                        </td>
                        <td className="px-4 py-3 text-xs font-semibold text-white">
                          {formatSoles(order.total)}
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`inline-block px-2 py-0.5 rounded-full text-[9px] font-bold border ${
                              statusColors[order.status] ||
                              statusColors.PENDING
                            }`}
                          >
                            {statusLabels[order.status] || order.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-[10px] text-[#666] hidden sm:table-cell">
                          {timeAgo(order.createdAt)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Top Products */}
        <div className="bg-[#111] rounded-xl border border-[#1A1A1A] overflow-hidden">
          <div className="px-4 py-3 border-b border-[#1A1A1A] flex items-center justify-between">
            <h3 className="text-sm font-bold">Top Productos</h3>
            <TrendingUp className="h-4 w-4 text-[#E35205]" />
          </div>
          {data.topProducts.length === 0 ? (
            <div className="px-4 py-12 text-center text-sm text-[#666]">
              Sin datos de ventas
            </div>
          ) : (
            <div className="divide-y divide-[#1A1A1A]">
              {data.topProducts.map((product, i) => (
                <div key={i} className="px-4 py-3 flex items-center gap-3">
                  <div className="w-7 h-7 rounded-lg bg-[#1A1A1A] flex items-center justify-center text-[10px] font-bold text-[#666]">
                    {i + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] text-[#CCC] font-medium truncate">
                      {product.name}
                    </p>
                    <p className="text-[9px] text-[#555]">
                      {product.quantity} ventas
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-[11px] font-bold text-white">
                      {formatSoles(product.revenue)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Revenue Chart Placeholder (7 days) */}
        <div className="bg-[#111] rounded-xl border border-[#1A1A1A] p-4">
          <h3 className="text-sm font-bold mb-4">Ingresos — Últimos 7 días</h3>
          {data.revenueByDay.every((d) => d.total === 0) ? (
            <div className="h-40 flex items-center justify-center text-sm text-[#666]">
              Sin datos de ingresos
            </div>
          ) : (
            <div className="flex items-end gap-2 h-40">
              {data.revenueByDay.map((day, i) => (
                <div
                  key={i}
                  className="flex-1 flex flex-col items-center gap-1"
                >
                  <span className="text-[9px] text-[#888] font-medium">
                    {day.total > 0
                      ? `${(day.total / 1000).toFixed(0)}k`
                      : ""}
                  </span>
                  <div
                    className="w-full rounded-t-md transition-all"
                    style={{
                      height: `${Math.max((day.total / data.maxRevenue) * 120, 2)}px`,
                      background:
                        "linear-gradient(to top, #E35205, #FF7A3D)",
                    }}
                  />
                  <span className="text-[9px] text-[#666] capitalize">
                    {day.day}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Orders by Status */}
        <div className="bg-[#111] rounded-xl border border-[#1A1A1A] p-4">
          <h3 className="text-sm font-bold mb-4">Pedidos por Estado</h3>
          {statusEntries.length === 0 ? (
            <div className="h-40 flex items-center justify-center text-sm text-[#666]">
              Sin pedidos
            </div>
          ) : (
            <div className="space-y-3">
              {statusEntries.map(([status, count]) => {
                const total = Object.values(data.statusBreakdown).reduce(
                  (s, v) => s + v,
                  0
                );
                const pct = total > 0 ? Math.round((count / total) * 100) : 0;
                return (
                  <div key={status} className="flex items-center gap-3">
                    <span
                      className={`inline-block px-2 py-0.5 rounded-full text-[9px] font-bold border w-24 text-center shrink-0 ${
                        statusColors[status] || statusColors.PENDING
                      }`}
                    >
                      {statusLabels[status] || status}
                    </span>
                    <div className="flex-1 h-2 rounded-full bg-[#1A1A1A] overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{
                          width: `${pct}%`,
                          backgroundColor:
                            status === "DELIVERED"
                              ? "#22c55e"
                              : status === "SHIPPED"
                              ? "#3b82f6"
                              : status === "PROCESSING"
                              ? "#f59e0b"
                              : status === "PENDING"
                              ? "#eab308"
                              : status === "CANCELLED"
                              ? "#ef4444"
                              : "#8b5cf6",
                        }}
                      />
                    </div>
                    <span className="text-xs font-bold text-[#CCC] w-8 text-right shrink-0">
                      {count}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Low Stock Alerts */}
      {data.lowStockProducts.length > 0 && (
        <div className="mt-4 bg-[#111] rounded-xl border border-[#1A1A1A] p-4">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="h-4 w-4 text-amber-400" />
            <h3 className="text-sm font-bold">Alertas de Stock Bajo</h3>
            <span className="text-[10px] text-amber-400 font-semibold bg-amber-500/10 px-2 py-0.5 rounded-full">
              {data.lowStockProducts.length}
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
            {data.lowStockProducts.map((p) => (
              <Link
                key={p.id}
                href={`/producto/${p.slug}`}
                className="bg-[#0D0D0D] rounded-lg p-3 hover:bg-[#151515] transition-colors"
              >
                <p className="text-[11px] text-[#CCC] font-medium truncate">
                  {p.name}
                </p>
                <p className="text-[9px] text-[#555] mt-0.5">
                  {p.brand?.name || "Sin marca"} · SKU: {p.sku}
                </p>
                <div className="flex items-center justify-between mt-2">
                  <span
                    className={`text-[10px] font-bold ${p.stock === 0 ? "text-red-400" : "text-amber-400"}`}
                  >
                    {p.stock === 0 ? "Agotado" : `${p.stock} en stock`}
                  </span>
                  <span className="text-[9px] text-[#555]">
                    Alerta: ≤{p.lowStockAlert}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </>
  );
}