import { db } from "@/lib/db";
import Link from "next/link";
import { Plus, Search, ChevronLeft, ChevronRight, Edit2, Trash2, ImageIcon } from "lucide-react";

const PER_PAGE = 20;

function formatSoles(n: number) {
  return `S/ ${n.toLocaleString("es-PE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function parseImages(imagesJson: string): string[] {
  try {
    const parsed = JSON.parse(imagesJson);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export default async function ProductosPage({
  searchParams,
}: {
  searchParams: Promise<{
    page?: string;
    search?: string;
    brand?: string;
    category?: string;
    status?: string;
  }>;
}) {
  const params = await searchParams;
  const page = Math.max(parseInt(params.page || "1", 10), 1);
  const search = params.search || "";
  const brandFilter = params.brand || "";
  const categoryFilter = params.category || "";
  const statusFilter = params.status || "";

  // Build where clause
  const where: Record<string, unknown> = {};
  if (search) {
    where.OR = [
      { name: { contains: search } },
      { sku: { contains: search } },
    ];
  }
  if (brandFilter) where.brandId = brandFilter;
  if (categoryFilter) where.categoryId = categoryFilter;
  if (statusFilter === "published") where.isPublished = true;
  if (statusFilter === "draft") where.isPublished = false;

  const [products, total, brands, categories] = await Promise.all([
    db.product.findMany({
      where,
      include: {
        brand: { select: { name: true } },
        category: { select: { name: true } },
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * PER_PAGE,
      take: PER_PAGE,
    }),
    db.product.count({ where }),
    db.brand.findMany({ select: { id: true, name: true }, orderBy: { name: "asc" } }),
    db.category.findMany({
      where: { parentId: null },
      select: { id: true, name: true },
      orderBy: { order: "asc" },
    }),
  ]);

  const totalPages = Math.ceil(total / PER_PAGE);

  function buildUrl(overrides: Record<string, string>) {
    const sp = new URLSearchParams();
    if (search) sp.set("search", search);
    if (brandFilter && !("brand" in overrides)) sp.set("brand", brandFilter);
    if (categoryFilter && !("category" in overrides)) sp.set("category", categoryFilter);
    if (statusFilter && !("status" in overrides)) sp.set("status", statusFilter);
    if (page > 1 && !("page" in overrides)) sp.set("page", String(page));
    for (const [k, v] of Object.entries(overrides)) {
      if (v) sp.set(k, v);
    }
    const qs = sp.toString();
    return qs ? `/admin/productos?${qs}` : "/admin/productos";
  }

  return (
    <>
      {/* Filters bar */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#555]" />
          <input
            type="text"
            name="search"
            defaultValue={search}
            placeholder="Buscar por nombre o SKU..."
            className="w-full bg-[#1A1A1A] border border-[#222] rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder-[#555] focus:outline-none focus:border-[#E35205] transition-colors"
            form="search-form"
          />
        </div>
        <div className="flex items-center gap-2">
          <select
            name="brand"
            defaultValue={brandFilter}
            className="bg-[#1A1A1A] border border-[#222] rounded-lg px-3 py-2 text-xs text-[#CCC] focus:outline-none focus:border-[#E35205] appearance-none min-w-[120px]"
            form="search-form"
          >
            <option value="">Todas las marcas</option>
            {brands.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name}
              </option>
            ))}
          </select>
          <select
            name="category"
            defaultValue={categoryFilter}
            className="bg-[#1A1A1A] border border-[#222] rounded-lg px-3 py-2 text-xs text-[#CCC] focus:outline-none focus:border-[#E35205] appearance-none min-w-[120px]"
            form="search-form"
          >
            <option value="">Todas las categorías</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          <select
            name="status"
            defaultValue={statusFilter}
            className="bg-[#1A1A1A] border border-[#222] rounded-lg px-3 py-2 text-xs text-[#CCC] focus:outline-none focus:border-[#E35205] appearance-none min-w-[110px]"
            form="search-form"
          >
            <option value="">Todo</option>
            <option value="published">Publicado</option>
            <option value="draft">Borrador</option>
          </select>
          <button
            type="submit"
            form="search-form"
            className="px-4 py-2 rounded-lg text-xs font-semibold text-white transition-colors"
            style={{ background: "linear-gradient(135deg, #E35205, #CC3300)" }}
          >
            Filtrar
          </button>
        </div>
      </div>

      <form id="search-form" method="get" className="hidden" />

      {/* Nuevo Producto button */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-xs text-[#666]">
          {total} producto{total !== 1 ? "s" : ""}
          {search && ` para "${search}"`}
        </p>
        <button
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold text-white transition-colors"
          style={{ background: "linear-gradient(135deg, #E35205, #CC3300)" }}
          onClick={() => alert("Próximamente: formulario de creación de productos")}
        >
          <Plus className="h-3.5 w-3.5" />
          Nuevo Producto
        </button>
      </div>

      {/* Products table */}
      <div className="bg-[#111] rounded-xl border border-[#1A1A1A] overflow-hidden">
        {products.length === 0 ? (
          <div className="px-4 py-16 text-center text-sm text-[#666]">
            No se encontraron productos
          </div>
        ) : (
          <>
            {/* Desktop table */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-[10px] text-[#555] uppercase tracking-wider border-b border-[#1A1A1A]">
                    <th className="px-4 py-3 font-semibold w-16">Imagen</th>
                    <th className="px-4 py-3 font-semibold">Producto</th>
                    <th className="px-4 py-3 font-semibold">SKU</th>
                    <th className="px-4 py-3 font-semibold">Marca</th>
                    <th className="px-4 py-3 font-semibold">Categoría</th>
                    <th className="px-4 py-3 font-semibold text-right">Precio</th>
                    <th className="px-4 py-3 font-semibold text-right">Stock</th>
                    <th className="px-4 py-3 font-semibold text-center">Estado</th>
                    <th className="px-4 py-3 font-semibold text-center">Etiquetas</th>
                    <th className="px-4 py-3 font-semibold text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1A1A1A]">
                  {products.map((p) => {
                    const images = parseImages(p.images);
                    const firstImage = images[0] || null;
                    return (
                      <tr key={p.id} className="hover:bg-[#0D0D0D] transition-colors">
                        <td className="px-4 py-3">
                          {firstImage ? (
                            <img
                              src={firstImage}
                              alt={p.name}
                              className="w-10 h-10 rounded-lg object-cover bg-[#1A1A1A]"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-lg bg-[#1A1A1A] flex items-center justify-center">
                              <ImageIcon className="h-4 w-4 text-[#555]" />
                            </div>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <p className="text-xs text-white font-medium truncate max-w-[200px]">
                            {p.name}
                          </p>
                        </td>
                        <td className="px-4 py-3 text-xs text-[#888] font-mono">
                          {p.sku}
                        </td>
                        <td className="px-4 py-3 text-xs text-[#888]">
                          {p.brand?.name || "—"}
                        </td>
                        <td className="px-4 py-3 text-xs text-[#888]">
                          {p.category?.name || "—"}
                        </td>
                        <td className="px-4 py-3 text-xs text-white font-semibold text-right">
                          {formatSoles(p.price)}
                          {p.comparePrice && p.comparePrice > p.price && (
                            <span className="block text-[10px] text-[#666] line-through">
                              {formatSoles(p.comparePrice)}
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <span
                            className={`text-xs font-bold ${
                              p.stock === 0
                                ? "text-red-400"
                                : p.stock <= (p.lowStockAlert || 5)
                                ? "text-amber-400"
                                : "text-green-400"
                            }`}
                          >
                            {p.stock}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span
                            className={`inline-block px-2 py-0.5 rounded-full text-[9px] font-bold border ${
                              p.isPublished
                                ? "bg-green-500/15 text-green-400 border-green-500/20"
                                : "bg-[#1A1A1A] text-[#666] border-[#222]"
                            }`}
                          >
                            {p.isPublished ? "Publicado" : "Borrador"}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <div className="flex items-center justify-center gap-1">
                            {p.isFeatured && (
                              <span className="px-1.5 py-0.5 rounded text-[8px] font-bold bg-amber-500/15 text-amber-400 border border-amber-500/20">
                                Destacado
                              </span>
                            )}
                            {p.isOnSale && (
                              <span className="px-1.5 py-0.5 rounded text-[8px] font-bold bg-red-500/15 text-red-400 border border-red-500/20">
                                Oferta
                              </span>
                            )}
                            {p.isNewArrival && (
                              <span className="px-1.5 py-0.5 rounded text-[8px] font-bold bg-blue-500/15 text-blue-400 border border-blue-500/20">
                                Nuevo
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              className="p-1.5 rounded-lg hover:bg-[#1A1A1A] text-[#888] hover:text-white transition-colors"
                              title="Editar"
                              onClick={() => alert("Próximamente: edición de productos")}
                            >
                              <Edit2 className="h-3.5 w-3.5" />
                            </button>
                            <button
                              className="p-1.5 rounded-lg hover:bg-red-500/10 text-[#888] hover:text-red-400 transition-colors"
                              title="Eliminar"
                              onClick={() => {
                                if (confirm(`¿Eliminar "${p.name}"?`)) {
                                  alert("Próximamente: eliminación de productos");
                                }
                              }}
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile card view */}
            <div className="lg:hidden divide-y divide-[#1A1A1A]">
              {products.map((p) => {
                const images = parseImages(p.images);
                const firstImage = images[0] || null;
                return (
                  <div key={p.id} className="p-3 flex gap-3">
                    {firstImage ? (
                      <img
                        src={firstImage}
                        alt={p.name}
                        className="w-14 h-14 rounded-lg object-cover bg-[#1A1A1A] shrink-0"
                      />
                    ) : (
                      <div className="w-14 h-14 rounded-lg bg-[#1A1A1A] flex items-center justify-center shrink-0">
                        <ImageIcon className="h-5 w-5 text-[#555]" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-white font-medium truncate">
                        {p.name}
                      </p>
                      <p className="text-[10px] text-[#888] mt-0.5">
                        {p.brand?.name} · {p.sku}
                      </p>
                      <div className="flex items-center gap-2 mt-1.5">
                        <span className="text-xs font-bold text-white">
                          {formatSoles(p.price)}
                        </span>
                        <span
                          className={`text-[10px] font-bold ${p.stock === 0 ? "text-red-400" : p.stock <= 5 ? "text-amber-400" : "text-green-400"}`}
                        >
                          Stock: {p.stock}
                        </span>
                        <span
                          className={`inline-block px-1.5 py-0.5 rounded-full text-[8px] font-bold border ${
                            p.isPublished
                              ? "bg-green-500/15 text-green-400 border-green-500/20"
                              : "bg-[#1A1A1A] text-[#666] border-[#222]"
                          }`}
                        >
                          {p.isPublished ? "Publicado" : "Borrador"}
                        </span>
                      </div>
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