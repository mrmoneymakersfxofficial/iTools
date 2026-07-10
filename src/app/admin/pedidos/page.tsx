import { db } from "@/lib/db";
import Link from "next/link";
import { Search, ChevronLeft, ChevronRight, ExternalLink, Package } from "lucide-react";
import {
  StatusBadge,
  PaymentBadge,
  OrderStatusSelect,
} from "./OrderStatusClient";

const PER_PAGE = 20;

function formatSoles(n: number) {
  return `S/ ${n.toLocaleString("es-PE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function parseItems(itemsJson: string) {
  try {
    const parsed = JSON.parse(itemsJson);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function formatDate(date: Date) {
  return date.toLocaleDateString("es-PE", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

const STATUS_TABS = [
  { value: "", label: "Todos" },
  { value: "PENDING", label: "Pendientes" },
  { value: "CONFIRMED", label: "Confirmados" },
  { value: "PROCESSING", label: "Procesando" },
  { value: "SHIPPED", label: "Enviados" },
  { value: "DELIVERED", label: "Entregados" },
  { value: "CANCELLED", label: "Cancelados" },
];

export default async function PedidosPage({
  searchParams,
}: {
  searchParams: Promise<{
    page?: string;
    search?: string;
    status?: string;
  }>;
}) {
  const params = await searchParams;
  const page = Math.max(parseInt(params.page || "1", 10), 1);
  const search = params.search || "";
  const statusFilter = params.status || "";

  // Build where clause
  const where: Record<string, unknown> = {};
  if (statusFilter) where.status = statusFilter;
  if (search) {
    where.OR = [{ orderNumber: { contains: search } }];
  }

  const [orders, total, statusCounts] = await Promise.all([
    db.order.findMany({
      where,
      include: {
        user: { select: { name: true, email: true } },
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * PER_PAGE,
      take: PER_PAGE,
    }),
    db.order.count({ where }),
    db.order.groupBy({
      by: ["status"],
      _count: { status: true },
    }),
  ]);

  const totalPages = Math.ceil(total / PER_PAGE);

  const statusCountMap: Record<string, number> = {};
  for (const sc of statusCounts) {
    statusCountMap[sc.status] = sc._count.status;
  }

  function buildUrl(overrides: Record<string, string>) {
    const sp = new URLSearchParams();
    if (search) sp.set("search", search);
    if (statusFilter && !("status" in overrides)) sp.set("status", statusFilter);
    if (page > 1 && !("page" in overrides)) sp.set("page", String(page));
    for (const [k, v] of Object.entries(overrides)) {
      if (v) sp.set(k, v);
    }
    const qs = sp.toString();
    return qs ? `/admin/pedidos?${qs}` : "/admin/pedidos";
  }

  return (
    <>
      {/* Status tabs */}
      <div className="flex gap-1 mb-4 overflow-x-auto pb-1 -mb-1">
        {STATUS_TABS.map((tab) => {
          const isActive = (statusFilter || "") === tab.value;
          return (
            <Link
              key={tab.value}
              href={buildUrl({ status: tab.value, page: "1" })}
              className={`px-3 py-1.5 rounded-lg text-[11px] font-semibold whitespace-nowrap transition-colors border ${
                isActive
                  ? "bg-[#E35205]/10 text-[#E35205] border-[#E35205]/20"
                  : "text-[#888] border-transparent hover:text-white hover:bg-[#1A1A1A]"
              }`}
            >
              {tab.label}
              {tab.value && statusCountMap[tab.value] !== undefined && (
                <span className="ml-1 text-[9px] opacity-70">
                  ({statusCountMap[tab.value]})
                </span>
              )}
            </Link>
          );
        })}
      </div>

      {/* Search */}
      <form method="get" className="mb-4">
        {statusFilter && (
          <input type="hidden" name="status" value={statusFilter} />
        )}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#555]" />
          <input
            type="text"
            name="search"
            defaultValue={search}
            placeholder="Buscar por número de pedido..."
            className="w-full bg-[#1A1A1A] border border-[#222] rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder-[#555] focus:outline-none focus:border-[#E35205] transition-colors"
          />
        </div>
      </form>

      {/* Count */}
      <p className="text-xs text-[#666] mb-4">
        {total} pedido{total !== 1 ? "s" : ""}
        {statusFilter && ` con estado "${STATUS_TABS.find(t => t.value === statusFilter)?.label}"`}
      </p>

      {/* Orders table */}
      <div className="bg-[#111] rounded-xl border border-[#1A1A1A] overflow-hidden">
        {orders.length === 0 ? (
          <div className="px-4 py-16 text-center text-sm text-[#666]">
            No se encontraron pedidos
          </div>
        ) : (
          <>
            {/* Desktop table */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-[10px] text-[#555] uppercase tracking-wider border-b border-[#1A1A1A]">
                    <th className="px-4 py-3 font-semibold">Pedido</th>
                    <th className="px-4 py-3 font-semibold">Cliente</th>
                    <th className="px-4 py-3 font-semibold">Fecha</th>
                    <th className="px-4 py-3 font-semibold text-center">Items</th>
                    <th className="px-4 py-3 font-semibold text-right">Total</th>
                    <th className="px-4 py-3 font-semibold text-center">Estado</th>
                    <th className="px-4 py-3 font-semibold text-center">Pago</th>
                    <th className="px-4 py-3 font-semibold text-center">Cambiar</th>
                    <th className="px-4 py-3 font-semibold"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1A1A1A]">
                  {orders.map((order) => {
                    const items = parseItems(order.items);
                    return (
                      <tr
                        key={order.id}
                        className="hover:bg-[#0D0D0D] transition-colors"
                      >
                        <td className="px-4 py-3">
                          <Link
                            href={`/cuenta/pedidos/${order.id}`}
                            className="text-xs font-mono text-[#E35205] hover:underline"
                          >
                            {order.orderNumber}
                          </Link>
                        </td>
                        <td className="px-4 py-3">
                          <p className="text-xs text-[#CCC]">
                            {order.user?.name || "Cliente"}
                          </p>
                          <p className="text-[10px] text-[#666]">
                            {order.user?.email || "—"}
                          </p>
                        </td>
                        <td className="px-4 py-3 text-xs text-[#888]">
                          {formatDate(order.createdAt)}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <div className="flex items-center justify-center gap-1">
                            <Package className="h-3 w-3 text-[#555]" />
                            <span className="text-xs text-[#CCC]">
                              {items.length}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-xs font-semibold text-white text-right">
                          {formatSoles(order.total)}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <StatusBadge status={order.status} />
                        </td>
                        <td className="px-4 py-3 text-center">
                          <PaymentBadge status={order.paymentStatus} />
                        </td>
                        <td className="px-4 py-3 text-center">
                          <OrderStatusSelect
                            orderId={order.id}
                            currentStatus={order.status}
                          />
                        </td>
                        <td className="px-4 py-3 text-right">
                          <Link
                            href={`/cuenta/pedidos/${order.id}`}
                            className="p-1.5 rounded-lg hover:bg-[#1A1A1A] text-[#888] hover:text-white transition-colors inline-flex"
                            title="Ver detalle"
                          >
                            <ExternalLink className="h-3.5 w-3.5" />
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile card view */}
            <div className="lg:hidden divide-y divide-[#1A1A1A]">
              {orders.map((order) => {
                const items = parseItems(order.items);
                return (
                  <div key={order.id} className="p-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <Link
                        href={`/cuenta/pedidos/${order.id}`}
                        className="text-xs font-mono text-[#E35205] hover:underline"
                      >
                        {order.orderNumber}
                      </Link>
                      <StatusBadge status={order.status} />
                    </div>
                    <p className="text-xs text-[#CCC]">
                      {order.user?.name || "Cliente"}
                    </p>
                    <div className="flex items-center justify-between text-[10px] text-[#666]">
                      <span>{formatDate(order.createdAt)} · {items.length} items</span>
                      <span className="text-xs font-bold text-white">
                        {formatSoles(order.total)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <PaymentBadge status={order.paymentStatus} />
                      <OrderStatusSelect
                        orderId={order.id}
                        currentStatus={order.status}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4">
          <p className="text-[10px] text-[#666]">
            Mostrando {(page - 1) * PER_PAGE + 1}–
            {Math.min(page * PER_PAGE, total)} de {total}
          </p>
          <div className="flex items-center gap-1">
            {page > 1 && (
              <Link
                href={buildUrl({ page: String(page - 1) })}
                className="p-2 rounded-lg bg-[#1A1A1A] border border-[#222] text-[#888] hover:text-white transition-colors"
              >
                <ChevronLeft className="h-4 w-4" />
              </Link>
            )}
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
              let pageNum: number;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (page <= 3) {
                pageNum = i + 1;
              } else if (page >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = page - 2 + i;
              }
              return (
                <Link
                  key={pageNum}
                  href={buildUrl({ page: String(pageNum) })}
                  className={`w-8 h-8 rounded-lg text-xs font-bold flex items-center justify-center transition-colors ${
                    pageNum === page
                      ? "bg-[#E35205] text-white"
                      : "bg-[#1A1A1A] border border-[#222] text-[#888] hover:text-white"
                  }`}
                >
                  {pageNum}
                </Link>
              );
            })}
            {page < totalPages && (
              <Link
                href={buildUrl({ page: String(page + 1) })}
                className="p-2 rounded-lg bg-[#1A1A1A] border border-[#222] text-[#888] hover:text-white transition-colors"
              >
                <ChevronRight className="h-4 w-4" />
              </Link>
            )}
          </div>
        </div>
      )}
    </>
  );
}