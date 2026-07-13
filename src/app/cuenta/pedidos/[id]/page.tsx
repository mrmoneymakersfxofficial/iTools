import { getServerSession } from '@/lib/auth'
import { getOrderById } from '@/lib/actions/orders'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeft,
  Package,
  MapPin,
  CreditCard,
  Check,
  Circle,
  Truck,
  Clock,
  ShoppingBag,
} from 'lucide-react'

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

const paymentLabels: Record<string, string> = {
  MERCADO_PAGO: 'Mercado Pago',
  TRANSFERENCIA: 'Transferencia Bancaria',
  EFECTIVO: 'Efectivo contra entrega',
}

const statusSteps = ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED'] as const
const stepLabels: Record<string, string> = {
  PENDING: 'Pendiente',
  PROCESSING: 'Procesando',
  SHIPPED: 'Enviado',
  DELIVERED: 'Entregado',
}
const stepIcons: Record<string, React.ElementType> = {
  PENDING: Clock,
  PROCESSING: Package,
  SHIPPED: Truck,
  DELIVERED: Check,
}

function formatDate(date: Date | string) {
  return new Date(date).toLocaleDateString('es-PE', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })
}

function formatShortDate(date: Date | string) {
  return new Date(date).toLocaleDateString('es-PE', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const session = await getServerSession()
  if (!session?.user?.id) redirect('/login')

  const { id } = await params
  const order = await getOrderById(id, session.user.id)

  if (!order) notFound()

  const currentStepIndex = statusSteps.indexOf(order.status as typeof statusSteps[number])
  const isCancelledOrRefunded = order.status === 'CANCELLED' || order.status === 'REFUNDED'

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link
          href="/cuenta/pedidos"
          className="p-2 rounded-lg bg-[#111] border border-[#1A1A1A] text-[#888] hover:text-white transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-xl font-bold text-white">{order.orderNumber}</h1>
            <span
              className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                statusColors[order.status] || statusColors.PENDING
              }`}
            >
              {statusLabels[order.status] || order.status}
            </span>
          </div>
          <p className="text-xs text-[#666] mt-0.5">
            Realizado el {formatDate(order.createdAt)}
          </p>
        </div>
      </div>

      {/* Status Timeline */}
      {!isCancelledOrRefunded && (
        <div className="bg-[#111] rounded-xl border border-[#1A1A1A] p-5">
          <h3 className="text-sm font-bold text-white mb-5">Estado del Pedido</h3>
          <div className="flex items-center justify-between relative">
            {/* Background line */}
            <div className="absolute top-5 left-5 right-5 h-0.5 bg-[#1A1A1A]" />
            {/* Progress line */}
            <div
              className="absolute top-5 left-5 h-0.5 bg-[#E35205] transition-all duration-500"
              style={{ width: `${(currentStepIndex / (statusSteps.length - 1)) * 100}%` }}
            />

            {statusSteps.map((step, index) => {
              const isCompleted = index <= currentStepIndex
              const isCurrent = index === currentStepIndex
              const StepIcon = stepIcons[step]

              return (
                <div key={step} className="relative flex flex-col items-center z-10 flex-1">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${
                      isCompleted
                        ? 'bg-[#E35205] border-[#E35205] text-white'
                        : 'bg-[#0D0D0D] border-[#333] text-[#555]'
                    }`}
                  >
                    <StepIcon className="h-4 w-4" />
                  </div>
                  <p
                    className={`text-[10px] font-semibold mt-2 text-center ${
                      isCompleted ? 'text-[#E35205]' : 'text-[#555]'
                    }`}
                  >
                    {stepLabels[step]}
                  </p>
                  {isCurrent && (
                    <div className="w-1.5 h-1.5 rounded-full bg-[#E35205] mt-1 animate-pulse" />
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}

      {isCancelledOrRefunded && (
        <div
          className={`rounded-xl border p-4 flex items-center gap-3 ${
            statusColors[order.status] || statusColors.CANCELLED
          }`}
        >
          <Circle className="h-5 w-5 shrink-0" />
          <div>
            <p className="text-sm font-bold">
              {statusLabels[order.status] || order.status}
            </p>
            <p className="text-xs opacity-70">
              {order.status === 'CANCELLED'
                ? 'Este pedido fue cancelado.'
                : 'Este pedido fue reembolsado.'}
            </p>
          </div>
        </div>
      )}

      {/* Tracking number */}
      {order.trackingNumber && (
        <div className="bg-[#111] rounded-xl border border-[#1A1A1A] p-4 flex items-center gap-3">
          <Truck className="h-4 w-4 text-cyan-400" />
          <div>
            <p className="text-[10px] text-[#666]">Número de seguimiento</p>
            <p className="text-sm font-mono font-semibold text-white">
              {order.trackingNumber}
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Order items */}
        <div className="lg:col-span-2 space-y-6">
          {/* Items */}
          <div className="bg-[#111] rounded-xl border border-[#1A1A1A] overflow-hidden">
            <div className="px-5 py-3 border-b border-[#1A1A1A]">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <ShoppingBag className="h-4 w-4 text-[#E35205]" />
                Artículos del Pedido
              </h3>
            </div>
            <div className="divide-y divide-[#1A1A1A]">
              {order.items.map((item, index) => (
                <div key={index} className="flex items-center gap-4 px-5 py-3.5">
                  {/* Image */}
                  <div className="w-14 h-14 rounded-lg bg-[#1A1A1A] border border-[#222] flex items-center justify-center shrink-0 overflow-hidden">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Package className="h-5 w-5 text-[#333]" />
                    )}
                  </div>
                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/producto/${item.slug}`}
                      className="text-sm text-[#CCC] font-medium hover:text-white transition-colors line-clamp-1"
                    >
                      {item.name}
                    </Link>
                    <p className="text-[10px] text-[#666] mt-0.5">
                      SKU: {item.sku} · Cantidad: {item.quantity}
                    </p>
                  </div>
                  {/* Price */}
                  <div className="text-right shrink-0">
                    <p className="text-xs font-bold text-white">
                      S/ {(item.price * item.quantity).toFixed(2)}
                    </p>
                    {item.quantity > 1 && (
                      <p className="text-[10px] text-[#666]">
                        S/ {item.price.toFixed(2)} c/u
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Shipping address */}
          {order.shippingAddress && (
            <div className="bg-[#111] rounded-xl border border-[#1A1A1A] p-5">
              <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-3">
                <MapPin className="h-4 w-4 text-[#E35205]" />
                Dirección de Envío
              </h3>
              <div className="bg-[#0D0D0D] rounded-lg p-3">
                {order.shippingAddress.label && (
                  <p className="text-xs font-semibold text-[#E35205] mb-1">
                    {order.shippingAddress.label}
                  </p>
                )}
                <p className="text-xs text-[#CCC]">{order.shippingAddress.street}</p>
                <p className="text-xs text-[#888]">
                  {[
                    order.shippingAddress.city,
                    order.shippingAddress.state,
                    order.shippingAddress.zip,
                  ]
                    .filter(Boolean)
                    .join(', ')}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Order summary sidebar */}
        <div className="space-y-6">
          {/* Summary */}
          <div className="bg-[#111] rounded-xl border border-[#1A1A1A] p-5">
            <h3 className="text-sm font-bold text-white mb-4">Resumen del Pedido</h3>
            <div className="space-y-3">
              <div className="flex justify-between text-xs">
                <span className="text-[#888]">Subtotal</span>
                <span className="text-[#CCC]">S/ {order.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-[#888]">Envío</span>
                <span className="text-[#CCC]">
                  {order.shippingCost === 0 ? 'Gratis' : `S/ ${order.shippingCost.toFixed(2)}`}
                </span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-xs">
                  <span className="text-[#888]">Descuento</span>
                  <span className="text-green-400">- S/ {order.discount.toFixed(2)}</span>
                </div>
              )}
              <div className="border-t border-[#1A1A1A] pt-3 flex justify-between">
                <span className="text-sm font-bold text-white">Total</span>
                <span className="text-sm font-bold text-[#E35205]">
                  S/ {order.total.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Payment info */}
          <div className="bg-[#111] rounded-xl border border-[#1A1A1A] p-5">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-3">
              <CreditCard className="h-4 w-4 text-[#E35205]" />
              Método de Pago
            </h3>
            <div className="bg-[#0D0D0D] rounded-lg p-3">
              <p className="text-xs text-[#CCC] font-medium">
                {paymentLabels[order.paymentMethod || ''] || order.paymentMethod || 'No especificado'}
              </p>
              <p className="text-[10px] text-[#666] mt-1">
                Estado: {order.paymentStatus === 'PENDING' ? 'Pendiente' : order.paymentStatus}
              </p>
            </div>
          </div>

          {/* Notes */}
          {order.notes && (
            <div className="bg-[#111] rounded-xl border border-[#1A1A1A] p-5">
              <h3 className="text-sm font-bold text-white mb-2">Notas</h3>
              <p className="text-xs text-[#888]">{order.notes}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}