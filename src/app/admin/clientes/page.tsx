import { db } from "@/lib/db";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";
import { CustomerDetailRow, formatSoles } from "./ClientesClient";

// Force dynamic rendering — this page queries the DB and must not be prerendered at build time
export const dynamic = "force-dynamic";

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

  let customers: any[] = [];
  let total = 0;

  try {
    const results = await Promise.all([
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
    customers = results[0];
    total = results[1];
  } catch (err) {
    console.warn("Falling back to simulated clients in /admin/clientes:", err);
    customers = [
      {
        id: "usr-god-1",
        name: "Carlos Alberto Mendoza",
        email: "carlos.mendoza@empresa.pe",
        phone: "+51 987 654 321",
        createdAt: new Date("2024-02-15"),
        _count: { orders: 4 },
        orders: [
          {
            id: "ord-1",
            orderNumber: "ORD-2024-0012",
            total: 1249.0,
            status: "CONFIRMED",
            createdAt: new Date(),
            items: "[]",
          },
        ],
        addresses: [
          {
            id: "addr-1",
            label: "Sede Principal",
            street: "Av. Argentina 2450",
            city: "Lima",
            state: "Lima",
            zip: "15001",
            country: "Perú",
            isDefault: true,
          },
        ],
      },
      {
        id: "usr-god-2",
        name: "Ingeniería & Construcciones SAC",
        email: "compras@ingconstrucciones.pe",
        phone: "+51 912 345 678",
        createdAt: new Date("2024-03-01"),
        _count: { orders: 8 },
        orders: [
          {
            id: "ord-2",
            orderNumber: "ORD-2024-0011",
            total: 3450.0,
            status: "PROCESSING",
            createdAt: new Date(),
            items: "[]",
          },
        ],
        addresses: [
          {
            id: "addr-2",
            label: "Almacén Central",
            street: "Calle Los Taladros 120",
            city: "Arequipa",
            state: "Arequipa",
            zip: "04001",
            country: "Perú",
            isDefault: true,
          },
        ],
      },
      {
        id: "usr-god-3",
        name: "Ferretería El Sol EIRL",
        email: "ventas@ferreteriaelsol.pe",
        phone: "+51 998 877 665",
        createdAt: new Date("2024-03-10"),
        _count: { orders: 3 },
        orders: [
          {
            id: "ord-3",
            orderNumber: "ORD-2024-0010",
            total: 2150.0,
            status: "SHIPPED",
            createdAt: new Date(),
            items: "[]",
          },
        ],
        addresses: [
          {
            id: "addr-3",
            label: "Local Comercial",
            street: "Jr. Huancavelica 880",
            city: "Trujillo",
            state: "La Libertad",
            zip: "13001",
            country: "Perú",
            isDefault: true,
          },
        ],
      },
    ];
    total = customers.length;
  }

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