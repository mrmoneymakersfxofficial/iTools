"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

const STATUS_OPTIONS = [
  { value: "PENDING", label: "Pendiente" },
  { value: "CONFIRMED", label: "Confirmado" },
  { value: "PROCESSING", label: "Procesando" },
  { value: "SHIPPED", label: "Enviado" },
  { value: "DELIVERED", label: "Entregado" },
  { value: "CANCELLED", label: "Cancelado" },
  { value: "REFUNDED", label: "Reembolsado" },
];

const STATUS_COLORS: Record<string, string> = {
  DELIVERED: "bg-green-500/15 text-green-400 border-green-500/20",
  SHIPPED: "bg-blue-500/15 text-blue-400 border-blue-500/20",
  PROCESSING: "bg-amber-500/15 text-amber-400 border-amber-500/20",
  CONFIRMED: "bg-indigo-500/15 text-indigo-400 border-indigo-500/20",
  PENDING: "bg-yellow-500/15 text-yellow-400 border-yellow-500/20",
  CANCELLED: "bg-red-500/15 text-red-400 border-red-500/20",
  REFUNDED: "bg-red-500/15 text-red-400 border-red-500/20",
};

const STATUS_LABELS: Record<string, string> = {
  PENDING: "Pendiente",
  CONFIRMED: "Confirmado",
  PROCESSING: "Procesando",
  SHIPPED: "Enviado",
  DELIVERED: "Entregado",
  CANCELLED: "Cancelado",
  REFUNDED: "Reembolsado",
};

export function getStatusLabel(status: string) {
  return STATUS_LABELS[status] || status;
}

export function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={`inline-block px-2 py-0.5 rounded-full text-[9px] font-bold border ${
        STATUS_COLORS[status] || STATUS_COLORS.PENDING
      }`}
    >
      {getStatusLabel(status)}
    </span>
  );
}

export function PaymentBadge({ status }: { status: string }) {
  const paymentLabels: Record<string, string> = {
    PAID: "Pagado",
    PENDING: "Pendiente",
    FAILED: "Fallido",
    REFUNDED: "Reembolsado",
  };
  const paymentColors: Record<string, string> = {
    PAID: "bg-green-500/15 text-green-400 border-green-500/20",
    PENDING: "bg-yellow-500/15 text-yellow-400 border-yellow-500/20",
    FAILED: "bg-red-500/15 text-red-400 border-red-500/20",
    REFUNDED: "bg-red-500/15 text-red-400 border-red-500/20",
  };
  return (
    <span
      className={`inline-block px-2 py-0.5 rounded-full text-[9px] font-bold border ${
        paymentColors[status] || paymentColors.PENDING
      }`}
    >
      {paymentLabels[status] || status}
    </span>
  );
}

export function OrderStatusSelect({
  orderId,
  currentStatus,
}: {
  orderId: string;
  currentStatus: string;
}) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const newStatus = e.target.value;
    if (newStatus === currentStatus) return;

    startTransition(async () => {
      try {
        const res = await fetch("/api/admin/orders/status", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ orderId, status: newStatus }),
        });
        if (res.ok) {
          router.refresh();
        } else {
          alert("Error al actualizar el estado");
        }
      } catch {
        alert("Error al actualizar el estado");
      }
    });
  }

  return (
    <select
      value={currentStatus}
      onChange={handleChange}
      disabled={isPending}
      className="bg-[#1A1A1A] border border-[#222] rounded-lg px-2 py-1 text-[10px] text-[#CCC] focus:outline-none focus:border-[#E35205] appearance-none cursor-pointer disabled:opacity-50"
    >
      {STATUS_OPTIONS.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}