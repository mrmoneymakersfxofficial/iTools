'use client'

import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback } from 'react'
import { Package, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react'
import type { OrderListItem } from '@/lib/actions/orders'

const statusColors: Record<string, string> = {
  PENDING: 'bg-amber-500/15 text-amber-400 border-amber-500/20',
  PROCESSING: 'bg-blue-500/15 text-blue-400 border-blue-500/20',
  SHIPPED: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/20',
  DELIVERED: 'bg-green-500/15 text-green-400 border-green-500/20',
  CANCELLED: 'bg-red-500/15 text-red-400 border-red-500/20',
  CONFIRMED: 'bg-purple-500/15 text-purple-400 border-purple-500/20',
  REFUNDED: 'bg-rose-500/15 text-rose-400 border-rose-500/20',
}

const statusLabels: Record<string, string> = {
  PENDING: 'Pendiente',
  PROCESSING: 'Procesando',
  SHIPPED: 'Enviado',
  DELIVERED: 'Entregado',
  CANCELLED: 'Cancelado',
  CONFIRMED: 'Confirmado',
  REFUNDED: 'Reembolsado',
}

const filterTabs = [
  { value: null, label: 'Todos' },
  { value: 'PENDING', label: 'Pendientes' },
  { value: 'PROCESSING', label: 'Procesando' },
  { value: 'SHIPPED', label: 'Enviados' },
  { value: 'DELIVERED', label: 'Entregados' },
  { value: 'CANCELLED', label: 'Cancelados' },
]

function formatDate(date: Date | string) {
  return new Date(date).toLocaleDateString('es-PE', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

export default function OrdersListClient({
  orders,
  currentPage,
  totalPages,
  activeStatus,
}: {
  orders: OrderListItem[]
  currentPage: number
  totalPages: number
  activeStatus: string | null
}) {
  const router = useRouter()

  function setFilter(status: string | null) {
    if (status) {
      router.push(`/cuenta/pedidos?status=${status}&page=1`)
    } else {
      router.push('/cuenta/pedidos?page=1')
    }
  }

  function setPage(page: number) {
    const params = new URLSearchParams()
    if (activeStatus) params.set('status', activeStatus)
    params.set('page', String(page))
    router.push(`/cuenta/pedidos?${params.toString()}`)
  }

  return (
    <>
      {/* Filter tabs */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
        {filterTabs.map((tab) => (
          <button
            key={tab.value || 'all'}
            onClick={() => setFilter(tab.value)}
            className={`px-3 py-1.5 rounded-full text-[11px] font-semibold whitespace-nowrap border transition-colors ${
              (tab.value === null && !activeStatus) || tab.value === activeStatus
                ? 'bg-[#E35205] text-white border-[#E35205]'
                : 'bg-[#111] text-[#888] border-[#1A1A1A] hover:text-white hover:border-[#333]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Orders list */}
      {orders.length === 0 ? (
        <div className="bg-[#111] rounded-xl border border-[#1A1A1A] p-12 text-center">
          <Package className="h-12 w-12 text-[#333] mx-auto mb-3" />
          <p className="text-sm text-[#666] mb-1">No se encontraron pedidos</p>
          <p className="text-xs text-[#555]">
            {activeStatus
              ? 'No tienes pedidos con este estado.'
              : 'Realiza tu primera compra para verla aquí.'}
          </p>
          {!activeStatus && (
            <Link
              href="/"
              className="inline-block mt-4 px-4 py-2 rounded-xl text-xs font-semibold text-white transition-colors"
              style={{ background: 'linear-gradient(135deg, #E35205, #CC3300)' }}
            >
              Explorar productos
            </Link>
          )}
        </div>
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden md:block bg-[#111] rounded-xl border border-[#1A1A1A] overflow-hidden">
            <table className="w-full text-left">
              <thead>
                <tr className="text-[10px] text-[#555] uppercase tracking-wider border-b border-[#1A1A1A]">
                  <th className="px-5 py-3 font-semibold">Pedido</th>
                  <th className="px-5 py-3 font-semibold">Fecha</th>
                  <th className="px-5 py-3 font-semibold">Artículos</th>
                  <th className="px-5 py-3 font-semibold">Total</th>
                  <th className="px-5 py-3 font-semibold">Estado</th>
                  <th className="px-5 py-3 font-semibold text-right">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1A1A1A]">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-[#0D0D0D] transition-colors">
                    <td className="px-5 py-3.5 text-xs font-mono font-semibold text-[#E35205]">
                      {order.orderNumber}
                    </td>
                    <td className="px-5 py-3.5 text-xs text-[#CCC]">
                      {formatDate(order.createdAt)}
                    </td>
                    <td className="px-5 py-3.5 text-xs text-[#888]">
                      {order.items.length} artículo{order.items.length !== 1 && 's'}
                    </td>
                    <td className="px-5 py-3.5 text-xs font-bold text-white">
                      S/ {order.total.toFixed(2)}
                    </td>
                    <td className="px-5 py-3.5">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-[9px] font-bold border ${
                          statusColors[order.status] || statusColors.PENDING
                        }`}
                      >
                        {statusLabels[order.status] || order.status}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <Link
                        href={`/cuenta/pedidos/${order.id}`}
                        className="inline-flex items-center gap-1 text-[10px] text-[#E35205] font-semibold hover:underline"
                      >
                        Ver detalle <ArrowRight className="h-3 w-3" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="md:hidden space-y-3">
            {orders.map((order) => (
              <Link
                key={order.id}
                href={`/cuenta/pedidos/${order.id}`}
                className="block bg-[#111] rounded-xl border border-[#1A1A1A] p-4 hover:border-[#333] transition-colors"
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="text-xs font-mono font-semibold text-[#E35205]">
                      {order.orderNumber}
                    </p>
                    <p className="text-[10px] text-[#666] mt-0.5">
                      {formatDate(order.createdAt)}
                    </p>
                  </div>
                  <span
                    className={`inline-block px-2 py-0.5 rounded-full text-[9px] font-bold border ${
                      statusColors[order.status] || statusColors.PENDING
                    }`}
                  >
                    {statusLabels[order.status] || order.status}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-[11px] text-[#888]">
                    {order.items.length} artículo{order.items.length !== 1 && 's'}
                  </p>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-bold text-white">
                      S/ {order.total.toFixed(2)}
                    </p>
                    <ArrowRight className="h-3.5 w-3.5 text-[#555]" />
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2">
              <button
                onClick={() => setPage(currentPage - 1)}
                disabled={currentPage <= 1}
                className="p-2 rounded-lg bg-[#111] border border-[#1A1A1A] text-[#888] hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`w-8 h-8 rounded-lg text-xs font-semibold transition-colors ${
                    p === currentPage
                      ? 'bg-[#E35205] text-white'
                      : 'bg-[#111] border border-[#1A1A1A] text-[#888] hover:text-white'
                  }`}
                >
                  {p}
                </button>
              ))}
              <button
                onClick={() => setPage(currentPage + 1)}
                disabled={currentPage >= totalPages}
                className="p-2 rounded-lg bg-[#111] border border-[#1A1A1A] text-[#888] hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </>
      )}
    </>
  )
}