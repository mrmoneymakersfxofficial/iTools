"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, ExternalLink } from "lucide-react";

interface CustomerOrder {
  id: string;
  orderNumber: string;
  total: number;
  status: string;
  createdAt: string;
  items: string;
}

interface CustomerAddress {
  id: string;
  label: string | null;
  street: string;
  city: string;
  state: string | null;
  zip: string | null;
  country: string;
  isDefault: boolean;
}

export function formatSoles(n: number) {
  return `S/ ${n.toLocaleString("es-PE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

const STATUS_LABELS: Record<string, string> = {
  PENDING: "Pendiente",
  CONFIRMED: "Confirmado",
  PROCESSING: "Procesando",
  SHIPPED: "Enviado",
  DELIVERED: "Entregado",
  CANCELLED: "Cancelado",
  REFUNDED: "Reembolsado",
};

const STATUS_COLORS: Record<string, string> = {
  DELIVERED: "bg-green-500/15 text-green-400 border-green-500/20",
  SHIPPED: "bg-blue-500/15 text-blue-400 border-blue-500/20",
  PROCESSING: "bg-amber-500/15 text-amber-400 border-amber-500/20",
  CONFIRMED: "bg-indigo-500/15 text-indigo-400 border-indigo-500/20",
  PENDING: "bg-yellow-500/15 text-yellow-400 border-yellow-500/20",
  CANCELLED: "bg-red-500/15 text-red-400 border-red-500/20",
  REFUNDED: "bg-red-500/15 text-red-400 border-red-500/20",
};

function CustomerDetailRow({
  customer,
  orders,
  addresses,
}: {
  customer: { id: string; name: string | null; email: string; phone: string | null; createdAt: string };
  orders: CustomerOrder[];
  addresses: CustomerAddress[];
}) {
  const [expanded, setExpanded] = useState(false);
  const totalSpent = orders.reduce((sum, o) => sum + o.total, 0);

  return (
    <>
      <tr
        className="hover:bg-[#0D0D0D] transition-colors cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <td className="px-4 py-3 text-xs text-white font-medium">
          {customer.name || "Sin nombre"}
        </td>
        <td className="px-4 py-3 text-xs text-[#888]">{customer.email}</td>
        <td className="px-4 py-3 text-xs text-[#888]">
          {customer.phone || "—"}
        </td>
        <td className="px-4 py-3 text-xs text-[#CCC] text-center">
          {orders.length}
        </td>
        <td className="px-4 py-3 text-xs font-semibold text-white text-right">
          {formatSoles(totalSpent)}
        </td>
        <td className="px-4 py-3 text-xs text-[#888]">
          {new Date(customer.createdAt).toLocaleDateString("es-PE", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })}
        </td>
        <td className="px-4 py-3 text-center">
          {expanded ? (
            <ChevronUp className="h-4 w-4 text-[#888] inline" />
          ) : (
            <ChevronDown className="h-4 w-4 text-[#888] inline" />
          )}
        </td>
      </tr>
      {expanded && (
        <tr>
          <td colSpan={7} className="bg-[#0A0A0A] px-4 py-4 border-b border-[#1A1A1A]">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Orders */}
              <div>
                <h4 className="text-[11px] font-bold text-[#CCC] uppercase tracking-wider mb-2">
                  Pedidos ({orders.length})
                </h4>
                {orders.length === 0 ? (
                  <p className="text-xs text-[#666]">Sin pedidos</p>
                ) : (
                  <div className="space-y-1.5 max-h-60 overflow-y-auto">
                    {orders.slice(0, 10).map((order) => (
                      <div
                        key={order.id}
                        className="flex items-center justify-between bg-[#111] rounded-lg px-3 py-2"
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono text-[#E35205]">
                            {order.orderNumber}
                          </span>
                          <span
                            className={`inline-block px-1.5 py-0.5 rounded-full text-[8px] font-bold border ${
                              STATUS_COLORS[order.status] || STATUS_COLORS.PENDING
                            }`}
                          >
                            {STATUS_LABELS[order.status] || order.status}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold text-white">
                            {formatSoles(order.total)}
                          </span>
                          <a
                            href={`/cuenta/pedidos/${order.id}`}
                            className="text-[#888] hover:text-white"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Addresses */}
              <div>
                <h4 className="text-[11px] font-bold text-[#CCC] uppercase tracking-wider mb-2">
                  Direcciones ({addresses.length})
                </h4>
                {addresses.length === 0 ? (
                  <p className="text-xs text-[#666]">Sin direcciones</p>
                ) : (
                  <div className="space-y-1.5 max-h-60 overflow-y-auto">
                    {addresses.map((addr) => (
                      <div
                        key={addr.id}
                        className="bg-[#111] rounded-lg px-3 py-2"
                      >
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="text-[10px] text-[#CCC] font-medium">
                            {addr.label || "Dirección"}
                          </span>
                          {addr.isDefault && (
                            <span className="px-1.5 py-0.5 rounded text-[8px] font-bold bg-[#E35205]/10 text-[#E35205] border border-[#E35205]/20">
                              Principal
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] text-[#888]">
                          {addr.street}, {addr.city}
                          {addr.state ? `, ${addr.state}` : ""}
                          {addr.zip ? ` ${addr.zip}` : ""}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}