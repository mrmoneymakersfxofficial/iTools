'use server'

import { db } from '@/lib/db'
import { revalidatePath } from 'next/cache'
import type { Prisma } from '@prisma/client'

// ── Types ──────────────────────────────────────────────────

export interface OrderItemInput {
  productId: string
  quantity: number
  price: number
}

export interface CreateOrderInput {
  userId: string
  items: OrderItemInput[]
  shippingAddressId: string
  shippingCost: number
  discount: number
  couponCode?: string
  paymentMethod: string
  notes?: string
}

export interface OrderItemOutput {
  productId: string
  name: string
  sku: string
  slug: string
  quantity: number
  price: number
  image: string
}

export interface OrderAddress {
  label: string | null
  street: string
  city: string
  state: string | null
  zip: string | null
  country: string
}

export interface OrderDetail {
  id: string
  orderNumber: string
  items: OrderItemOutput[]
  subtotal: number
  shippingCost: number
  discount: number
  total: number
  status: string
  paymentMethod: string | null
  paymentStatus: string
  shippingAddress: OrderAddress | null
  trackingNumber: string | null
  notes: string | null
  createdAt: Date
  updatedAt: Date
}

export interface OrderListItem {
  id: string
  orderNumber: string
  items: OrderItemOutput[]
  subtotal: number
  shippingCost: number
  discount: number
  total: number
  status: string
  paymentMethod: string | null
  paymentStatus: string
  trackingNumber: string | null
  createdAt: Date
  updatedAt: Date
}

export interface CreateOrderResult {
  success: boolean
  order?: OrderDetail
  error?: string
}

export interface OrderFilters {
  status?: string
  page?: number
  limit?: number
  search?: string
}

export interface PaginatedOrders {
  orders: OrderListItem[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface UpdateOrderStatusResult {
  success: boolean
  order?: OrderDetail
  error?: string
}

// ── Helpers ────────────────────────────────────────────────

function parseItems(itemsJson: string): OrderItemOutput[] {
  try {
    const parsed = JSON.parse(itemsJson)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function parseAddress(addressJson: string | null): OrderAddress | null {
  if (!addressJson) return null
  try {
    return JSON.parse(addressJson) as OrderAddress
  } catch {
    return null
  }
}

function mapOrderToDetail(order: {
  id: string
  orderNumber: string
  items: string
  subtotal: number
  shippingCost: number
  discount: number
  total: number
  status: string
  paymentMethod: string | null
  paymentStatus: string
  shippingAddress: string | null
  trackingNumber: string | null
  notes: string | null
  createdAt: Date
  updatedAt: Date
}): OrderDetail {
  return {
    ...order,
    items: parseItems(order.items),
    shippingAddress: parseAddress(order.shippingAddress),
  }
}

function mapOrderToListItem(order: {
  id: string
  orderNumber: string
  items: string
  subtotal: number
  shippingCost: number
  discount: number
  total: number
  status: string
  paymentMethod: string | null
  paymentStatus: string
  trackingNumber: string | null
  createdAt: Date
  updatedAt: Date
}): OrderListItem {
  return {
    ...order,
    items: parseItems(order.items),
  }
}

async function generateOrderNumber(): Promise<string> {
  const year = new Date().getFullYear()

  // Find the latest order for this year to determine the next sequential number
  const prefix = `IT-${year}-`
  const latestOrder = await db.order.findFirst({
    where: { orderNumber: { startsWith: prefix } },
    orderBy: { orderNumber: 'desc' },
    select: { orderNumber: true },
  })

  let nextNum = 1
  if (latestOrder) {
    const parts = latestOrder.orderNumber.split('-')
    const lastNum = parseInt(parts[2] || '0', 10)
    nextNum = lastNum + 1
  }

  return `${prefix}${String(nextNum).padStart(4, '0')}`
}

// ── Actions ────────────────────────────────────────────────

export async function createOrder(
  data: CreateOrderInput,
): Promise<CreateOrderResult> {
  try {
    // Validate items
    if (!data.items || data.items.length === 0) {
      return { success: false, error: 'El pedido no tiene productos.' }
    }

    // Fetch all products to validate stock and get details
    const productIds = data.items.map((item) => item.productId)
    const products = await db.product.findMany({
      where: { id: { in: productIds } },
      select: {
        id: true,
        name: true,
        sku: true,
        slug: true,
        stock: true,
        price: true,
        images: true,
      },
    })

    const productMap = new Map(products.map((p) => [p.id, p]))

    // Validate stock for each item
    for (const item of data.items) {
      const product = productMap.get(item.productId)
      if (!product) {
        return { success: false, error: `Producto no encontrado (ID: ${item.productId}).` }
      }
      if (product.stock < item.quantity) {
        return {
          success: false,
          error: `Stock insuficiente para "${product.name}". Disponible: ${product.stock}.`,
        }
      }
    }

    // Validate and apply coupon if provided
    let discount = data.discount
    if (data.couponCode) {
      const coupon = await db.coupon.findUnique({
        where: { code: data.couponCode.toUpperCase() },
      })

      if (!coupon || !coupon.isActive) {
        return { success: false, error: 'El cupón no es válido o está inactivo.' }
      }
      if (coupon.expiresAt && coupon.expiresAt < new Date()) {
        return { success: false, error: 'El cupón ha expirado.' }
      }
      if (coupon.maxUses !== null && coupon.usedCount >= coupon.maxUses) {
        return { success: false, error: 'El cupón ha alcanzado su límite de usos.' }
      }
      if (coupon.minOrder !== null) {
        const subtotal = data.items.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0,
        )
        if (subtotal < coupon.minOrder) {
          return {
            success: false,
            error: `El pedido mínimo para este cupón es S/ ${coupon.minOrder.toFixed(2)}.`,
          }
        }
      }
    }

    // Fetch shipping address
    const address = await db.address.findUnique({
      where: { id: data.shippingAddressId },
    })

    if (!address) {
      return { success: false, error: 'Dirección de envío no encontrada.' }
    }

    // Build order items with product details
    const orderItems: OrderItemOutput[] = data.items.map((item) => {
      const product = productMap.get(item.productId)!
      let firstImage = ''
      try {
        const imgs = JSON.parse(product.images)
        firstImage = Array.isArray(imgs) && imgs.length > 0 ? imgs[0] : ''
      } catch {
        // ignore
      }
      return {
        productId: item.productId,
        name: product.name,
        sku: product.sku,
        slug: product.slug,
        quantity: item.quantity,
        price: item.price,
        image: firstImage,
      }
    })

    // Generate order number
    const orderNumber = await generateOrderNumber()

    // Create the order
    const order = await db.order.create({
      data: {
        orderNumber,
        userId: data.userId,
        items: JSON.stringify(orderItems),
        subtotal: data.items.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0,
        ),
        shippingCost: data.shippingCost,
        discount,
        total:
          data.items.reduce(
            (sum, item) => sum + item.price * item.quantity,
            0,
          ) +
          data.shippingCost -
          discount,
        status: 'PENDING',
        paymentMethod: data.paymentMethod,
        paymentStatus: 'PENDING',
        shippingAddress: JSON.stringify({
          label: address.label,
          street: address.street,
          city: address.city,
          state: address.state,
          zip: address.zip,
          country: address.country,
        }),
        notes: data.notes || null,
      },
    })

    // Decrease stock for each product
    for (const item of data.items) {
      await db.product.update({
        where: { id: item.productId },
        data: { stock: { decrement: item.quantity } },
      })
    }

    // Increment coupon used count if coupon was used
    if (data.couponCode) {
      await db.coupon.update({
        where: { code: data.couponCode.toUpperCase() },
        data: { usedCount: { increment: 1 } },
      })
    }

    revalidatePath('/cuenta/pedidos')
    revalidatePath('/admin')

    const created = await db.order.findUnique({ where: { id: order.id } })
    return {
      success: true,
      order: created ? mapOrderToDetail(created) : undefined,
    }
  } catch (error) {
    console.error('Error creating order:', error)
    return { success: false, error: 'Error al crear el pedido. Inténtalo de nuevo.' }
  }
}

export async function getOrdersByUserId(
  userId: string,
): Promise<OrderListItem[]> {
  try {
    const orders = await db.order.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    })

    return orders.map(mapOrderToListItem)
  } catch (error) {
    console.error('Error fetching orders by user:', error)
    return []
  }
}

export async function getOrderById(
  orderId: string,
  userId?: string,
): Promise<OrderDetail | null> {
  try {
    const where: Prisma.OrderWhereUniqueInput = { id: orderId }
    if (userId) {
      where.userId = userId
    }

    const order = await db.order.findFirst({
      where: { id: orderId, ...(userId ? { userId } : {}) },
    })

    if (!order) return null

    return mapOrderToDetail(order)
  } catch (error) {
    console.error('Error fetching order by id:', error)
    return null
  }
}

export async function getAllOrders(
  filters?: OrderFilters,
): Promise<PaginatedOrders> {
  try {
    const page = filters?.page ?? 1
    const limit = filters?.limit ?? 20
    const skip = (page - 1) * limit

    const where: Prisma.OrderWhereInput = {}

    if (filters?.status) {
      where.status = filters.status
    }
    if (filters?.search) {
      where.OR = [
        { orderNumber: { contains: filters.search } },
      ]
    }

    const [orders, total] = await Promise.all([
      db.order.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      db.order.count({ where }),
    ])

    return {
      orders: orders.map(mapOrderToListItem),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    }
  } catch (error) {
    console.error('Error fetching all orders:', error)
    return { orders: [], total: 0, page: 1, limit: 20, totalPages: 0 }
  }
}

export async function updateOrderStatus(
  orderId: string,
  status: string,
): Promise<UpdateOrderStatusResult> {
  try {
    const validStatuses = [
      'PENDING',
      'CONFIRMED',
      'PROCESSING',
      'SHIPPED',
      'DELIVERED',
      'CANCELLED',
      'REFUNDED',
    ]

    if (!validStatuses.includes(status)) {
      return { success: false, error: 'Estado de pedido no válido.' }
    }

    const order = await db.order.update({
      where: { id: orderId },
      data: { status },
    })

    revalidatePath('/admin')
    revalidatePath(`/admin/pedidos/${orderId}`)

    return { success: true, order: mapOrderToDetail(order) }
  } catch (error) {
    console.error('Error updating order status:', error)
    return { success: false, error: 'Error al actualizar el estado del pedido.' }
  }
}