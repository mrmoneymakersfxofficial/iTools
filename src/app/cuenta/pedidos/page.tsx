import { getServerSession } from '@/lib/auth'
import { getOrdersByUserId } from '@/lib/actions/orders'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Package, ArrowRight, Search } from 'lucide-react'
import OrdersListClient from './OrdersListClient'

export default async function PedidosPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; status?: string }>
}) {
  const session = await getServerSession()
  if (!session?.user?.id) redirect('/login')

  const params = await searchParams
  const page = parseInt(params.page || '1', 10)

  const allOrders = await getOrdersByUserId(session.user.id)

  // Apply status filter
  const statusFilter = params.status
  const filteredOrders = statusFilter
    ? allOrders.filter((o) => o.status === statusFilter)
    : allOrders

  // Pagination
  const limit = 10
  const totalPages = Math.ceil(filteredOrders.length / limit)
  const paginatedOrders = filteredOrders.slice((page - 1) * limit, page * limit)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-white">Mis Pedidos</h1>
        <p className="text-xs text-[#666] mt-0.5">
          {allOrders.length} pedido{allOrders.length !== 1 && 's'} en total
        </p>
      </div>

      {/* Status filters */}
      <OrdersListClient
        orders={paginatedOrders}
        currentPage={page}
        totalPages={totalPages}
        activeStatus={statusFilter || null}
      />
    </div>
  )
}