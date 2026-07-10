import { db } from "@/lib/db";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";
import { CustomerDetailRow, formatSoles } from "./ClientesClient";

const PER_PAGE = 20;

interface CustomerRow {
  id: string;
  name: string | null;
  email: string;
  phone: string | null;
  createdAt: Date;
  _count: { orders: number };
  _sum: { total: number | null };
}

export default async function ClientesPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; search?: string }>;
}) {
  const params = await searchParams;
  const page = Math.max(parseInt(params.page || "1", 10), 1);
  const search = params.search || "";

  // Build where clause
  const where: Record<string, unknown> = { role: "CUSTOMER" };
  if (search) {
    where.OR = [
      { name: { contains: search } },
      { email: { contains: search } },
    ];
  }

  const [customers, total] = await Promise.all([
    db.user.findMany({
      where,
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        createdAt: true,
        _count: { select: { orders: true } },
        orders: {
          select: {
            id: true,
            orderNumber: true,
            total: true,
            status: true,
            createdAt: true,
            items: true,
          },
          orderBy: { createdAt: "desc" },
          take: 50,
        },
        addresses: {
          select: {
            id: true,
            label: true,
            street: true,
            city: true,
            state: true,
            zip: true,
            country: true,
            isDefault: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * PER_PAGE,
      take: PER_PAGE,
    }),
    db.user.count({ where }),
  ]);

  const totalPages = Math.ceil(total / PER_PAGE);

  function buildUrl(overrides: Record<string, string>) {
    const sp = new URLSearchParams();
    if (search) sp.set("search", search);
    if (page > 1 && !("page" in overrides)) sp.set("page", String(page));
    for (const [k, v] of Object.entries(overrides)) {
      if (v) sp.set(k, v);
    }
    const qs = sp.toString();
    return qs ? `/admin/clientes?${qs}` : "/admin/clientes";
  }

  return (
    <>
      {/* Search */}
      <form method="get" className="mb-4">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#555]" />
          <input
            type="text"
            name="search"
            defaultValue={search}
            placeholder="Buscar por nombre o email..."
            className="w-full bg-[#1A1A1A] border border-[#222] rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder-[#555] focus:outline-none focus:border-[#E35205] transition-colors"
          />
        </div>
      </form>

      {/* Count */}
      <p className="text-xs text-[#666] mb-4">
        {total} cliente{total !== 1 ? "s" : ""}
        {search && ` para "${search}"`}
      </p>

      {/* Customers table */}
      <div className="bg-[#111] rounded-xl border border-[#1A1A1A] overflow-hidden">
        {customers.length === 0 ? (
          <div className="px-4 py-16 text-center text-sm text-[#666]">
            No se encontraron clientes
          </div>
        ) : (
          <>
            {/* Desktop table */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-[10px] text-[#555] uppercase tracking-wider border-b border-[#1A1A1A]">
                    <th className="px-4 py-3 font-semibold">Nombre</th>
                    <th className="px-4 py-3 font-semibold">Email</th>
                    <th className="px-4 py-3 font-semibold">Teléfono</th>
                    <th className="px-4 py-3 font-semibold text-center">
                      Pedidos
                    </th>
                    <th className="px-4 py-3 font-semibold text-right">
                      Total Gastado
                    </th>
                    <th className="px-4 py-3 font-semibold">Registro</th>
                    <th className="px-4 py-3 font-semibold w-8"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1A1A1A]">
                  {customers.map((customer) => (
                    <CustomerDetailRow
                      key={customer.id}
                      customer={{
                        id: customer.id,
                        name: customer.name,
                        email: customer.email,
                        phone: customer.phone,
                        createdAt: customer.createdAt.toISOString(),
                      }}
                      orders={customer.orders.map((o) => ({
                        id: o.id,
                        orderNumber: o.orderNumber,
                        total: o.total,
                        status: o.status,
                        createdAt: o.createdAt.toISOString(),
                        items: o.items,
                      }))}
                      addresses={customer.addresses}
                    />
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile card view */}
            <div className="lg:hidden divide-y divide-[#1A1A1A]">
              {customers.map((customer) => {
                const totalSpent = customer.orders.reduce(
                  (sum, o) => sum + o.total,
                  0
                );
                return (
                  <div key={customer.id} className="p-3 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-white font-medium">
                        {customer.name || "Sin nombre"}
                      </p>
                      <span className="text-xs font-bold text-white">
                        {formatSoles(totalSpent)}
                      </span>
                    </div>
                    <p className="text-[10px] text-[#888]">{customer.email}</p>
                    <div className="flex items-center gap-3 text-[10px] text-[#666]">
                      <span>{customer.phone || "—"}</span>
                      <span>·</span>
                      <span>{customer._count.orders} pedidos</span>
                      <span>·</span>
                      <span>
                        {customer.createdAt.toLocaleDateString("es-PE", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
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
              <a
                href={buildUrl({ page: String(page - 1) })}
                className="p-2 rounded-lg bg-[#1A1A1A] border border-[#222] text-[#888] hover:text-white transition-colors"
              >
                <ChevronLeft className="h-4 w-4" />
              </a>
            )}
            {Array.from(
              { length: Math.min(totalPages, 5) },
              (_, i) => {
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
                  <a
                    key={pageNum}
                    href={buildUrl({ page: String(pageNum) })}
                    className={`w-8 h-8 rounded-lg text-xs font-bold flex items-center justify-center transition-colors ${
                      pageNum === page
                        ? "bg-[#E35205] text-white"
                        : "bg-[#1A1A1A] border border-[#222] text-[#888] hover:text-white"
                    }`}
                  >
                    {pageNum}
                  </a>
                );
              }
            )}
            {page < totalPages && (
              <a
                href={buildUrl({ page: String(page + 1) })}
                className="p-2 rounded-lg bg-[#1A1A1A] border border-[#222] text-[#888] hover:text-white transition-colors"
              >
                <ChevronRight className="h-4 w-4" />
              </a>
            )}
          </div>
        </div>
      )}
    </>
  );
}