import { getServerSession } from '@/lib/auth'
import { getOrdersByUserId } from '@/lib/actions/orders'
import { getAddresses } from '@/lib/actions/addresses'
import { getWishlist } from '@/lib/actions/wishlist'
import { updateProfile } from '@/lib/actions/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import ProfileForm from './ProfileForm'
import {
  User,
  Package,
  Heart,
  MapPin,
  Calendar,
  Shield,
  ArrowRight,
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

function formatDate(date: Date) {
  return new Date(date).toLocaleDateString('es-PE', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

export default async function CuentaPage() {
  const session = await getServerSession()
  if (!session?.user?.id) redirect('/login')

  const [orders, addresses, wishlist] = await Promise.all([
    getOrdersByUserId(session.user.id),
    getAddresses(session.user.id),
    getWishlist(session.user.id),
  ])

  const defaultAddress = addresses.find((a) => a.isDefault) || addresses[0]
  const recentOrders = orders.slice(0, 3)

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-xl font-bold text-white">Mi Perfil</h1>
        <p className="text-xs text-[#666] mt-0.5">
          Gestiona tu información personal
        </p>
      </div>

      {/* User info card */}
      <div className="bg-[#111] rounded-xl border border-[#1A1A1A] p-5">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-2xl bg-[#E35205]/10 flex items-center justify-center shrink-0">
            <User className="h-6 w-6 text-[#E35205]" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-base font-bold text-white truncate">
                {session.user.name || 'Sin nombre'}
              </h2>
              <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-[#1A1A1A] text-[#888] border border-[#222]">
                {session.user.role === 'ADMIN' ? 'Administrador' : 'Cliente'}
              </span>
            </div>
            <p className="text-sm text-[#888]">{session.user.email}</p>
          </div>
        </div>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-[#111] rounded-xl border border-[#1A1A1A] p-4 text-center">
          <Package className="h-5 w-5 text-[#E35205] mx-auto mb-2" />
          <p className="text-lg font-bold text-white">{orders.length}</p>
          <p className="text-[10px] text-[#666]">Pedidos</p>
        </div>
        <div className="bg-[#111] rounded-xl border border-[#1A1A1A] p-4 text-center">
          <Heart className="h-5 w-5 text-[#E35205] mx-auto mb-2" />
          <p className="text-lg font-bold text-white">{wishlist.length}</p>
          <p className="text-[10px] text-[#666]">Favoritos</p>
        </div>
        <div className="bg-[#111] rounded-xl border border-[#1A1A1A] p-4 text-center">
          <MapPin className="h-5 w-5 text-[#E35205] mx-auto mb-2" />
          <p className="text-lg font-bold text-white">{addresses.length}</p>
          <p className="text-[10px] text-[#666]">Direcciones</p>
        </div>
      </div>

      {/* Edit profile form */}
      <div className="bg-[#111] rounded-xl border border-[#1A1A1A] p-5">
        <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
          <Shield className="h-4 w-4 text-[#E35205]" />
          Editar Perfil
        </h3>
        <ProfileForm
          userId={session.user.id}
          name={session.user.name || ''}
          email={session.user.email || ''}
        />
      </div>

      {/* Default address */}
      {defaultAddress && (
        <div className="bg-[#111] rounded-xl border border-[#1A1A1A] p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <MapPin className="h-4 w-4 text-[#E35205]" />
              Dirección Predeterminada
            </h3>
            <Link
              href="/cuenta/direcciones"
              className="text-[10px] text-[#E35205] font-semibold hover:underline"
            >
              Ver todas
            </Link>
          </div>
          <div className="bg-[#0D0D0D] rounded-lg p-3">
            {defaultAddress.label && (
              <p className="text-xs font-semibold text-[#E35205] mb-1">
                {defaultAddress.label}
              </p>
            )}
            <p className="text-xs text-[#CCC]">{defaultAddress.street}</p>
            <p className="text-xs text-[#888]">
              {[defaultAddress.city, defaultAddress.state, defaultAddress.zip]
                .filter(Boolean)
                .join(', ')}
            </p>
          </div>
        </div>
      )}

      {/* Recent orders */}
      <div className="bg-[#111] rounded-xl border border-[#1A1A1A] overflow-hidden">
        <div className="px-5 py-3 border-b border-[#1A1A1A] flex items-center justify-between">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Package className="h-4 w-4 text-[#E35205]" />
            Pedidos Recientes
          </h3>
          {orders.length > 3 && (
            <Link
              href="/cuenta/pedidos"
              className="text-[10px] text-[#E35205] font-semibold hover:underline flex items-center gap-1"
            >
              Ver todos <ArrowRight className="h-3 w-3" />
            </Link>
          )}
        </div>

        {recentOrders.length === 0 ? (
          <div className="p-8 text-center">
            <Package className="h-10 w-10 text-[#333] mx-auto mb-3" />
            <p className="text-sm text-[#666]">No tienes pedidos aún</p>
            <Link
              href="/"
              className="inline-block mt-3 text-xs text-[#E35205] font-semibold hover:underline"
            >
              Explorar productos
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-[#1A1A1A]">
            {recentOrders.map((order) => (
              <Link
                key={order.id}
                href={`/cuenta/pedidos/${order.id}`}
                className="flex items-center gap-4 px-5 py-3 hover:bg-[#0D0D0D] transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-mono font-semibold text-[#E35205]">
                    {order.orderNumber}
                  </p>
                  <p className="text-[10px] text-[#666] mt-0.5">
                    {order.items.length} artículo{order.items.length !== 1 && 's'} · {formatDate(order.createdAt)}
                  </p>
                </div>
                <p className="text-xs font-bold text-white">
                  S/ {order.total.toFixed(2)}
                </p>
                <span
                  className={`inline-block px-2 py-0.5 rounded-full text-[9px] font-bold border ${
                    statusColors[order.status] || statusColors.PENDING
                  }`}
                >
                  {statusLabels[order.status] || order.status}
                </span>
                <ArrowRight className="h-3.5 w-3.5 text-[#555] shrink-0" />
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}