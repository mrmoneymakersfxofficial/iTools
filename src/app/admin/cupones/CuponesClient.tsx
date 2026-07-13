"use client";

import { useState, useTransition, useRef } from "react";
import { useRouter } from "next/navigation";
import { Plus, X, Trash2 } from "lucide-react";

interface Coupon {
  id: string;
  code: string;
  type: string;
  value: number;
  minOrder: number | null;
  maxUses: number | null;
  usedCount: number;
  expiresAt: string | null;
  isActive: boolean;
  createdAt: string;
}

function formatDate(dateStr: string | null) {
  if (!dateStr) return "Sin límite";
  return new Date(dateStr).toLocaleDateString("es-PE", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function isExpired(dateStr: string | null) {
  if (!dateStr) return false;
  return new Date(dateStr) < new Date();
}

export function CouponManager({ coupons: initialCoupons }: { coupons: Coupon[] }) {
  const [coupons, setCoupons] = useState(initialCoupons);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const deleteConfirmRef = useRef<string | null>(null);

  // Form state
  const [code, setCode] = useState("");
  const [type, setType] = useState("PERCENTAGE");
  const [value, setValue] = useState("");
  const [minOrder, setMinOrder] = useState("");
  const [maxUses, setMaxUses] = useState("");
  const [expiresAt, setExpiresAt] = useState("");

  function resetForm() {
    setCode("");
    setType("PERCENTAGE");
    setValue("");
    setMinOrder("");
    setMaxUses("");
    setExpiresAt("");
    setEditingId(null);
  }

  function openCreate() {
    resetForm();
    setDialogOpen(true);
  }

  function openEdit(coupon: Coupon) {
    setEditingId(coupon.id);
    setCode(coupon.code);
    setType(coupon.type);
    setValue(String(coupon.value));
    setMinOrder(coupon.minOrder ? String(coupon.minOrder) : "");
    setMaxUses(coupon.maxUses ? String(coupon.maxUses) : "");
    setExpiresAt(
      coupon.expiresAt
        ? new Date(coupon.expiresAt).toISOString().split("T")[0]
        : ""
    );
    setDialogOpen(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const body = {
      code: code.toUpperCase(),
      type,
      value: parseFloat(value) || 0,
      minOrder: minOrder ? parseFloat(minOrder) : null,
      maxUses: maxUses ? parseInt(maxUses, 10) : null,
      expiresAt: expiresAt || null,
    };

    startTransition(async () => {
      try {
        const url = editingId
          ? `/api/admin/coupons?id=${editingId}`
          : "/api/admin/coupons";
        const method = editingId ? "PUT" : "POST";
        const res = await fetch(url, {
          method,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        if (res.ok) {
          const data = await res.json();
          setCoupons((prev) => {
            if (editingId) {
              return prev.map((c) => (c.id === editingId ? data.coupon : c));
            }
            return [data.coupon, ...prev];
          });
          setDialogOpen(false);
          resetForm();
          router.refresh();
        } else {
          const err = await res.json();
          alert(err.error || "Error al guardar el cupón");
        }
      } catch {
        alert("Error de conexión");
      }
    });
  }

  async function toggleActive(coupon: Coupon) {
    startTransition(async () => {
      try {
        const res = await fetch("/api/admin/coupons/toggle", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: coupon.id }),
        });
        if (res.ok) {
          setCoupons((prev) =>
            prev.map((c) =>
              c.id === coupon.id ? { ...c, isActive: !c.isActive } : c
            )
          );
          router.refresh();
        }
      } catch {
        alert("Error al actualizar el cupón");
      }
    });
  }

  async function deleteCoupon(id: string, code: string) {
    if (deleteConfirmRef.current === id) {
      // Second click = confirmed
      try {
        const res = await fetch(`/api/admin/coupons?id=${id}`, {
          method: "DELETE",
        });
        if (res.ok) {
          setCoupons((prev) => prev.filter((c) => c.id !== id));
          router.refresh();
        }
      } catch {
        alert("Error al eliminar");
      }
      deleteConfirmRef.current = null;
    } else {
      deleteConfirmRef.current = id;
      alert(`Haz clic de nuevo en eliminar para confirmar la eliminación de "${code}"`);
      setTimeout(() => {
        deleteConfirmRef.current = null;
      }, 3000);
    }
  }

  return (
    <>
      {/* Button */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-xs text-[#666]">
          {coupons.length} cupón{coupons.length !== 1 ? "es" : ""}
        </p>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold text-white transition-colors"
          style={{ background: "linear-gradient(135deg, #E35205, #CC3300)" }}
        >
          <Plus className="h-3.5 w-3.5" />
          Nuevo Cupón
        </button>
      </div>

      {/* Table */}
      <div className="bg-[#111] rounded-xl border border-[#1A1A1A] overflow-hidden">
        {coupons.length === 0 ? (
          <div className="px-4 py-16 text-center text-sm text-[#666]">
            No hay cupones creados
          </div>
        ) : (
          <>
            {/* Desktop */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-[10px] text-[#555] uppercase tracking-wider border-b border-[#1A1A1A]">
                    <th className="px-4 py-3 font-semibold">Código</th>
                    <th className="px-4 py-3 font-semibold">Tipo</th>
                    <th className="px-4 py-3 font-semibold">Valor</th>
                    <th className="px-4 py-3 font-semibold">Pedido Mín.</th>
                    <th className="px-4 py-3 font-semibold text-center">Usos</th>
                    <th className="px-4 py-3 font-semibold text-center">Estado</th>
                    <th className="px-4 py-3 font-semibold">Vencimiento</th>
                    <th className="px-4 py-3 font-semibold text-right">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1A1A1A]">
                  {coupons.map((coupon) => {
                    const expired = isExpired(coupon.expiresAt);
                    return (
                      <tr
                        key={coupon.id}
                        className={`transition-colors ${!coupon.isActive || expired ? "opacity-50" : "hover:bg-[#0D0D0D]"}`}
                      >
                        <td className="px-4 py-3">
                          <span className="text-xs font-mono font-bold text-[#E35205]">
                            {coupon.code}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-xs text-[#888]">
                          {coupon.type === "PERCENTAGE" ? "Porcentaje" : "Monto fijo"}
                        </td>
                        <td className="px-4 py-3 text-xs font-semibold text-white">
                          {coupon.type === "PERCENTAGE"
                            ? `${coupon.value}%`
                            : `S/ ${coupon.value.toFixed(2)}`}
                        </td>
                        <td className="px-4 py-3 text-xs text-[#888]">
                          {coupon.minOrder
                            ? `S/ ${coupon.minOrder.toFixed(2)}`
                            : "—"}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className="text-xs text-[#CCC]">
                            {coupon.usedCount}
                            {coupon.maxUses !== null && ` / ${coupon.maxUses}`}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <button
                            onClick={() => toggleActive(coupon)}
                            className={`inline-block px-2 py-0.5 rounded-full text-[9px] font-bold border cursor-pointer transition-colors ${
                              coupon.isActive && !expired
                                ? "bg-green-500/15 text-green-400 border-green-500/20"
                                : "bg-[#1A1A1A] text-[#666] border-[#222]"
                            }`}
                          >
                            {expired
                              ? "Expirado"
                              : coupon.isActive
                              ? "Activo"
                              : "Inactivo"}
                          </button>
                        </td>
                        <td className="px-4 py-3 text-xs text-[#888]">
                          {formatDate(coupon.expiresAt)}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              className="p-1.5 rounded-lg hover:bg-[#1A1A1A] text-[#888] hover:text-white transition-colors"
                              onClick={() => openEdit(coupon)}
                            >
                              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </button>
                            <button
                              className="p-1.5 rounded-lg hover:bg-red-500/10 text-[#888] hover:text-red-400 transition-colors"
                              onClick={() => deleteCoupon(coupon.id, coupon.code)}
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

            {/* Mobile */}
            <div className="lg:hidden divide-y divide-[#1A1A1A]">
              {coupons.map((coupon) => {
                const expired = isExpired(coupon.expiresAt);
                return (
                  <div
                    key={coupon.id}
                    className={`p-3 space-y-1.5 ${!coupon.isActive || expired ? "opacity-50" : ""}`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold text-[#E35205]">
                        {coupon.code}
                      </span>
                      <button
                        onClick={() => toggleActive(coupon)}
                        className={`inline-block px-2 py-0.5 rounded-full text-[9px] font-bold border cursor-pointer ${
                          coupon.isActive && !expired
                            ? "bg-green-500/15 text-green-400 border-green-500/20"
                            : "bg-[#1A1A1A] text-[#666] border-[#222]"
                        }`}
                      >
                        {expired ? "Expirado" : coupon.isActive ? "Activo" : "Inactivo"}
                      </button>
                    </div>
                    <div className="flex items-center gap-3 text-[10px] text-[#888]">
                      <span>
                        {coupon.type === "PERCENTAGE"
                          ? `${coupon.value}% desc.`
                          : `S/ ${coupon.value.toFixed(2)} desc.`}
                      </span>
                      <span>·</span>
                      <span>Usos: {coupon.usedCount}{coupon.maxUses ? `/${coupon.maxUses}` : ""}</span>
                      <span>·</span>
                      <span>Vence: {formatDate(coupon.expiresAt)}</span>
                    </div>
                    <div className="flex items-center gap-1 pt-1">
                      <button
                        className="p-1.5 rounded-lg hover:bg-[#1A1A1A] text-[#888] hover:text-white transition-colors"
                        onClick={() => openEdit(coupon)}
                      >
                        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        className="p-1.5 rounded-lg hover:bg-red-500/10 text-[#888] hover:text-red-400 transition-colors"
                        onClick={() => deleteCoupon(coupon.id, coupon.code)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>

      {/* Create/Edit Dialog */}
      {dialogOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-[#111] border border-[#1A1A1A] rounded-xl w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#1A1A1A]">
              <h3 className="text-sm font-bold">
                {editingId ? "Editar Cupón" : "Nuevo Cupón"}
              </h3>
              <button
                onClick={() => {
                  setDialogOpen(false);
                  resetForm();
                }}
                className="text-[#888] hover:text-white transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              {/* Code */}
              <div>
                <label className="block text-[10px] text-[#888] uppercase tracking-wider font-semibold mb-1.5">
                  Código
                </label>
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="Ej: ITOOLS10"
                  className="w-full bg-[#0A0A0A] border border-[#1A1A1A] rounded-lg px-3 py-2 text-xs text-white placeholder-[#555] focus:outline-none focus:border-[#E35205] uppercase font-mono"
                  required
                />
              </div>

              {/* Type & Value */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] text-[#888] uppercase tracking-wider font-semibold mb-1.5">
                    Tipo
                  </label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="w-full bg-[#0A0A0A] border border-[#1A1A1A] rounded-lg px-3 py-2 text-xs text-[#CCC] focus:outline-none focus:border-[#E35205] appearance-none"
                  >
                    <option value="PERCENTAGE">Porcentaje (%)</option>
                    <option value="FIXED">Monto fijo (S/)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] text-[#888] uppercase tracking-wider font-semibold mb-1.5">
                    Valor
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    placeholder={type === "PERCENTAGE" ? "10" : "50.00"}
                    className="w-full bg-[#0A0A0A] border border-[#1A1A1A] rounded-lg px-3 py-2 text-xs text-white placeholder-[#555] focus:outline-none focus:border-[#E35205]"
                    required
                  />
                </div>
              </div>

              {/* Min Order & Max Uses */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] text-[#888] uppercase tracking-wider font-semibold mb-1.5">
                    Pedido Mínimo (S/)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={minOrder}
                    onChange={(e) => setMinOrder(e.target.value)}
                    placeholder="Opcional"
                    className="w-full bg-[#0A0A0A] border border-[#1A1A1A] rounded-lg px-3 py-2 text-xs text-white placeholder-[#555] focus:outline-none focus:border-[#E35205]"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-[#888] uppercase tracking-wider font-semibold mb-1.5">
                    Máximo de Usos
                  </label>
                  <input
                    type="number"
                    value={maxUses}
                    onChange={(e) => setMaxUses(e.target.value)}
                    placeholder="Ilimitado"
                    className="w-full bg-[#0A0A0A] border border-[#1A1A1A] rounded-lg px-3 py-2 text-xs text-white placeholder-[#555] focus:outline-none focus:border-[#E35205]"
                  />
                </div>
              </div>

              {/* Expires */}
              <div>
                <label className="block text-[10px] text-[#888] uppercase tracking-wider font-semibold mb-1.5">
                  Fecha de Vencimiento
                </label>
                <input
                  type="date"
                  value={expiresAt}
                  onChange={(e) => setExpiresAt(e.target.value)}
                  className="w-full bg-[#0A0A0A] border border-[#1A1A1A] rounded-lg px-3 py-2 text-xs text-[#CCC] focus:outline-none focus:border-[#E35205] [color-scheme:dark]"
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isPending}
                className="w-full py-2.5 rounded-lg text-xs font-bold text-white transition-colors disabled:opacity-50"
                style={{
                  background:
                    "linear-gradient(135deg, #E35205, #CC3300)",
                }}
              >
                {isPending
                  ? "Guardando..."
                  : editingId
                  ? "Guardar Cambios"
                  : "Crear Cupón"}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}