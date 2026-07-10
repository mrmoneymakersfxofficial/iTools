'use client'

import { useEffect, useState } from 'react'
import { useSession, signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useCartStore } from '@/stores/cart-store'
import { getAddresses } from '@/lib/actions/addresses'
import { createOrder } from '@/lib/actions/orders'
import { validateCoupon } from '@/lib/actions/coupons'
import type { AddressItem } from '@/lib/actions/addresses'
import type { CouponDetail } from '@/lib/actions/coupons'
import Link from 'next/link'
import {
  MapPin,
  CreditCard,
  Truck,
  ShoppingBag,
  Tag,
  ArrowLeft,
  ArrowRight,
  Loader2,
  Check,
  X,
  Package,
  ShieldCheck,
  Wallet,
  Banknote,
  LogIn,
  ChevronRight,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'

const paymentMethods = [
  {
    id: 'MERCADO_PAGO',
    label: 'Mercado Pago',
    desc: 'Tarjeta, Yape, Plin, transferencia',
    icon: Wallet,
  },
  {
    id: 'TRANSFERENCIA',
    label: 'Transferencia Bancaria',
    desc: 'BCP, Interbank, BBVA, Scotiabank',
    icon: Banknote,
  },
  {
    id: 'EFECTIVO',
    label: 'Efectivo contra entrega',
    desc: 'Paga cuando recibas tu pedido',
    icon: Truck,
  },
]

const SHIPPING_COST: number = 15

function formatPrice(price: number) {
  return `S/ ${price.toFixed(2)}`
}

export default function CheckoutPage() {
  const { data: session, status: authStatus } = useSession()
  const router = useRouter()
  const items = useCartStore((s) => s.items)
  const clearCart = useCartStore((s) => s.clearCart)
  const removeItem = useCartStore((s) => s.removeItem)
  const updateQuantity = useCartStore((s) => s.updateQuantity)

  const [addresses, setAddresses] = useState<AddressItem[]>([])
  const [selectedAddressId, setSelectedAddressId] = useState<string>('')
  const [selectedPayment, setSelectedPayment] = useState('MERCADO_PAGO')
  const [couponCode, setCouponCode] = useState('')
  const [couponResult, setCouponResult] = useState<CouponDetail | null>(null)
  const [couponError, setCouponError] = useState('')
  const [couponLoading, setCouponLoading] = useState(false)
  const [couponApplied, setCouponApplied] = useState(false)
  const [discountAmount, setDiscountAmount] = useState(0)
  const [placing, setPlacing] = useState(false)
  const [error, setError] = useState('')
  const [orderSuccess, setOrderSuccess] = useState(false)
  const [createdOrderNumber, setCreatedOrderNumber] = useState('')

  const subtotal = items.reduce((sum, i) => sum + i.product.price * i.quantity, 0)
  const total = subtotal + SHIPPING_COST - discountAmount

  // Fetch addresses when authenticated
  useEffect(() => {
    if (authStatus === 'loading' || !session?.user?.id) return
    let cancelled = false
    getAddresses(session.user.id).then((data) => {
      if (cancelled) return
      setAddresses(data)
      const defaultAddr = data.find((a) => a.isDefault) || data[0]
      if (defaultAddr) setSelectedAddressId(defaultAddr.id)
    })
    return () => { cancelled = true }
  }, [authStatus, session?.user?.id])

  async function handleApplyCoupon() {
    if (!couponCode.trim()) return
    setCouponLoading(true)
    setCouponError('')
    setCouponResult(null)
    setCouponApplied(false)
    setDiscountAmount(0)

    const result = await validateCoupon(couponCode, subtotal)
    if (result.valid && result.coupon && result.discountAmount) {
      setCouponResult(result.coupon)
      setDiscountAmount(result.discountAmount)
      setCouponApplied(true)
    } else {
      setCouponError(result.error || 'Cupón no válido.')
    }
    setCouponLoading(false)
  }

  function removeCoupon() {
    setCouponCode('')
    setCouponResult(null)
    setCouponError('')
    setCouponApplied(false)
    setDiscountAmount(0)
  }

  async function handlePlaceOrder() {
    if (!session?.user?.id) return
    if (!selectedAddressId) {
      setError('Selecciona una dirección de envío.')
      return
    }
    if (items.length === 0) {
      setError('El carrito está vacío.')
      return
    }

    setPlacing(true)
    setError('')

    const result = await createOrder({
      userId: session.user.id,
      items: items.map((i) => ({
        productId: i.product.id,
        quantity: i.quantity,
        price: i.product.price,
      })),
      shippingAddressId: selectedAddressId,
      shippingCost: SHIPPING_COST,
      discount: discountAmount,
      couponCode: couponApplied ? couponCode.toUpperCase() : undefined,
      paymentMethod: selectedPayment,
    })

    if (result.success && result.order) {
      setOrderSuccess(true)
      setCreatedOrderNumber(result.order.orderNumber)
      clearCart()
    } else {
      setError(result.error || 'Error al crear el pedido.')
    }
    setPlacing(false)
  }

  // Auth gate
  if (authStatus === 'loading') {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-[#E35205] border-t-transparent rounded-full" />
      </div>
    )
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center px-4">
        <div className="bg-[#111] rounded-xl border border-[#1A1A1A] p-8 max-w-md w-full text-center">
          <LogIn className="h-10 w-10 text-[#E35205] mx-auto mb-4" />
          <h1 className="text-xl font-bold text-white mb-2">Inicia Sesión</h1>
          <p className="text-sm text-[#888] mb-6">
            Necesitas una cuenta para completar tu compra.
          </p>
          <button
            onClick={() => signIn()}
            className="w-full py-3 rounded-xl font-semibold text-white text-sm transition-all"
            style={{ background: 'linear-gradient(135deg, #E35205, #CC3300)' }}
          >
            Iniciar Sesión
          </button>
        </div>
      </div>
    )
  }

  // Order success
  if (orderSuccess) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center px-4">
        <div className="bg-[#111] rounded-xl border border-[#1A1A1A] p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 rounded-full bg-green-500/15 border-2 border-green-500/30 flex items-center justify-center mx-auto mb-4">
            <Check className="h-8 w-8 text-green-400" />
          </div>
          <h1 className="text-xl font-bold text-white mb-1">¡Pedido Exitoso!</h1>
          <p className="text-sm text-[#888] mb-2">
            Tu pedido ha sido creado correctamente.
          </p>
          <p className="text-sm font-mono font-bold text-[#E35205] mb-6">
            {createdOrderNumber}
          </p>
          <div className="flex gap-3">
            <Link
              href={`/cuenta/pedidos`}
              className="flex-1 py-2.5 rounded-xl text-xs font-semibold text-white bg-[#E35205] hover:bg-[#CC3300] text-center transition-colors"
            >
              Ver mis Pedidos
            </Link>
            <Link
              href="/"
              className="flex-1 py-2.5 rounded-xl text-xs font-semibold text-[#888] bg-[#0D0D0D] border border-[#222] hover:text-white text-center transition-colors"
            >
              Seguir Comprando
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // Empty cart
  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center px-4">
        <div className="bg-[#111] rounded-xl border border-[#1A1A1A] p-8 max-w-md w-full text-center">
          <ShoppingBag className="h-12 w-12 text-[#333] mx-auto mb-3" />
          <h1 className="text-lg font-bold text-white mb-1">Tu carrito está vacío</h1>
          <p className="text-sm text-[#888] mb-4">
            Agrega productos para proceder al pago.
          </p>
          <Link
            href="/"
            className="inline-block px-5 py-2.5 rounded-xl text-xs font-semibold text-white transition-colors"
            style={{ background: 'linear-gradient(135deg, #E35205, #CC3300)' }}
          >
            Explorar productos
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      {/* Top bar */}
      <header className="bg-[#111] border-b border-[#1A1A1A] px-4 py-3 flex items-center gap-3 sticky top-0 z-50">
        <Link
          href="/"
          className="p-2 rounded-lg bg-[#1A1A1A] text-[#888] hover:text-white transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <h1 className="text-sm font-bold text-white">Checkout</h1>
        <div className="flex-1" />
        <ShieldCheck className="h-4 w-4 text-green-400" />
        <span className="text-[10px] text-green-400 font-semibold">Pago Seguro</span>
      </header>

      <div className="max-w-5xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Left column - Steps */}
          <div className="lg:col-span-3 space-y-6">
            {/* Step 1: Shipping Address */}
            <div className="bg-[#111] rounded-xl border border-[#1A1A1A] p-5">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-7 h-7 rounded-full bg-[#E35205] text-white flex items-center justify-center text-xs font-bold">
                  1
                </div>
                <h2 className="text-sm font-bold text-white flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-[#E35205]" />
                  Dirección de Envío
                </h2>
              </div>

              {addresses.length === 0 ? (
                <div className="text-center py-4">
                  <p className="text-xs text-[#888] mb-3">No tienes direcciones guardadas.</p>
                  <Link
                    href="/cuenta/direcciones"
                    className="inline-block px-4 py-2 rounded-xl text-xs font-semibold text-white bg-[#E35205] hover:bg-[#CC3300] transition-colors"
                  >
                    Agregar Dirección
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {addresses.map((addr) => (
                    <button
                      key={addr.id}
                      onClick={() => setSelectedAddressId(addr.id)}
                      className={`text-left p-3 rounded-lg border transition-all ${
                        selectedAddressId === addr.id
                          ? 'border-[#E35205] bg-[#E35205]/5 ring-1 ring-[#E35205]/20'
                          : 'border-[#1A1A1A] bg-[#0D0D0D] hover:border-[#333]'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <div
                          className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                            selectedAddressId === addr.id
                              ? 'border-[#E35205] bg-[#E35205]'
                              : 'border-[#444]'
                          }`}
                        >
                          {selectedAddressId === addr.id && (
                            <Check className="h-2.5 w-2.5 text-white" />
                          )}
                        </div>
                        <span className="text-xs font-semibold text-white">
                          {addr.label || 'Sin etiqueta'}
                        </span>
                        {addr.isDefault && (
                          <span className="text-[8px] font-bold text-[#E35205] bg-[#E35205]/10 px-1.5 py-0.5 rounded-full">
                            Principal
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-[#888] ml-6 line-clamp-2">
                        {addr.street}, {addr.city}
                        {addr.state ? `, ${addr.state}` : ''}
                      </p>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Step 2: Order Items */}
            <div className="bg-[#111] rounded-xl border border-[#1A1A1A] p-5">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-7 h-7 rounded-full bg-[#E35205] text-white flex items-center justify-center text-xs font-bold">
                  2
                </div>
                <h2 className="text-sm font-bold text-white flex items-center gap-2">
                  <ShoppingBag className="h-4 w-4 text-[#E35205]" />
                  Resumen del Pedido
                </h2>
              </div>

              <div className="divide-y divide-[#1A1A1A]">
                {items.map((item) => (
                  <div key={item.product.id} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
                    {/* Image */}
                    <div className="w-14 h-14 rounded-lg bg-[#1A1A1A] border border-[#222] flex items-center justify-center shrink-0 overflow-hidden">
                      {item.product.images[0] ? (
                        <img
                          src={item.product.images[0]}
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Package className="h-5 w-5 text-[#333]" />
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-[#CCC] font-medium line-clamp-1">
                        {item.product.name}
                      </p>
                      <p className="text-[10px] text-[#888]">
                        {formatPrice(item.product.price)} c/u
                      </p>
                    </div>

                    {/* Quantity */}
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        className="w-7 h-7 rounded-lg bg-[#1A1A1A] border border-[#222] text-[#888] hover:text-white flex items-center justify-center text-xs transition-colors"
                      >
                        -
                      </button>
                      <span className="text-xs font-semibold text-white w-6 text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        className="w-7 h-7 rounded-lg bg-[#1A1A1A] border border-[#222] text-[#888] hover:text-white flex items-center justify-center text-xs transition-colors"
                      >
                        +
                      </button>
                    </div>

                    {/* Price + remove */}
                    <div className="text-right shrink-0">
                      <p className="text-xs font-bold text-white">
                        {formatPrice(item.product.price * item.quantity)}
                      </p>
                      <button
                        onClick={() => removeItem(item.product.id)}
                        className="text-[10px] text-[#666] hover:text-red-400 transition-colors"
                      >
                        Quitar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Step 3: Coupon */}
            <div className="bg-[#111] rounded-xl border border-[#1A1A1A] p-5">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-7 h-7 rounded-full bg-[#E35205] text-white flex items-center justify-center text-xs font-bold">
                  3
                </div>
                <h2 className="text-sm font-bold text-white flex items-center gap-2">
                  <Tag className="h-4 w-4 text-[#E35205]" />
                  Cupón de Descuento
                </h2>
              </div>

              {couponApplied ? (
                <div className="flex items-center justify-between bg-green-500/10 border border-green-500/20 rounded-lg px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-400" />
                    <div>
                      <p className="text-xs font-semibold text-green-400">
                        {couponCode.toUpperCase()}
                      </p>
                      <p className="text-[10px] text-green-400/70">
                        -{formatPrice(discountAmount)} de descuento
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={removeCoupon}
                    className="text-[10px] text-[#888] hover:text-red-400 transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <Input
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    placeholder="Ingresa tu cupón"
                    className="flex-1 bg-[#0D0D0D] border-[#222] text-white text-sm h-10 focus:border-[#E35205] uppercase"
                    onKeyDown={(e) => e.key === 'Enter' && handleApplyCoupon()}
                  />
                  <Button
                    onClick={handleApplyCoupon}
                    disabled={couponLoading || !couponCode.trim()}
                    className="bg-[#1A1A1A] border border-[#222] text-[#CCC] hover:text-white hover:border-[#333] text-xs font-semibold h-10 px-4 rounded-xl transition-colors"
                  >
                    {couponLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      'Aplicar'
                    )}
                  </Button>
                </div>
              )}

              {couponError && (
                <p className="text-[11px] text-red-400 mt-2 flex items-center gap-1">
                  <X className="h-3 w-3" />
                  {couponError}
                </p>
              )}
            </div>

            {/* Step 4: Payment Method */}
            <div className="bg-[#111] rounded-xl border border-[#1A1A1A] p-5">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-7 h-7 rounded-full bg-[#E35205] text-white flex items-center justify-center text-xs font-bold">
                  4
                </div>
                <h2 className="text-sm font-bold text-white flex items-center gap-2">
                  <CreditCard className="h-4 w-4 text-[#E35205]" />
                  Método de Pago
                </h2>
              </div>

              <div className="space-y-2">
                {paymentMethods.map((method) => {
                  const MethodIcon = method.icon
                  const isSelected = selectedPayment === method.id

                  return (
                    <button
                      key={method.id}
                      onClick={() => setSelectedPayment(method.id)}
                      className={`w-full flex items-center gap-3 p-3 rounded-lg border transition-all text-left ${
                        isSelected
                          ? 'border-[#E35205] bg-[#E35205]/5 ring-1 ring-[#E35205]/20'
                          : 'border-[#1A1A1A] bg-[#0D0D0D] hover:border-[#333]'
                      }`}
                    >
                      <div
                        className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                          isSelected ? 'bg-[#E35205]/15' : 'bg-[#1A1A1A]'
                        }`}
                      >
                        <MethodIcon
                          className={`h-4 w-4 ${isSelected ? 'text-[#E35205]' : 'text-[#666]'}`}
                        />
                      </div>
                      <div className="flex-1">
                        <p
                          className={`text-xs font-semibold ${
                            isSelected ? 'text-white' : 'text-[#CCC]'
                          }`}
                        >
                          {method.label}
                        </p>
                        <p className="text-[10px] text-[#666]">{method.desc}</p>
                      </div>
                      <div
                        className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                          isSelected ? 'border-[#E35205] bg-[#E35205]' : 'border-[#444]'
                        }`}
                      >
                        {isSelected && <Check className="h-2.5 w-2.5 text-white" />}
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Right column - Order Summary */}
          <div className="lg:col-span-2">
            <div className="sticky top-20 bg-[#111] rounded-xl border border-[#1A1A1A] p-5">
              <h3 className="text-sm font-bold text-white mb-4">Resumen de Compra</h3>

              <div className="space-y-3 mb-4">
                <div className="flex justify-between text-xs">
                  <span className="text-[#888]">
                    Subtotal ({items.reduce((s, i) => s + i.quantity, 0)} artículos)
                  </span>
                  <span className="text-[#CCC]">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-[#888]">Envío</span>
                  <span className="text-[#CCC]">
                    {SHIPPING_COST === 0 ? 'Gratis' : formatPrice(SHIPPING_COST)}
                  </span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-xs">
                    <span className="text-green-400">Descuento</span>
                    <span className="text-green-400">-{formatPrice(discountAmount)}</span>
                  </div>
                )}
              </div>

              <Separator className="bg-[#1A1A1A] mb-4" />

              <div className="flex justify-between mb-6">
                <span className="text-sm font-bold text-white">Total</span>
                <span className="text-lg font-bold text-[#E35205]">{formatPrice(total)}</span>
              </div>

              {/* Error */}
              {error && (
                <div className="flex items-center gap-2 text-xs px-3 py-2 rounded-lg bg-red-500/10 text-red-400 border border-red-500/20 mb-4">
                  <X className="h-3.5 w-3.5 shrink-0" />
                  {error}
                </div>
              )}

              {/* Place order button */}
              <Button
                onClick={handlePlaceOrder}
                disabled={
                  placing || !selectedAddressId || items.length === 0
                }
                className="w-full py-3.5 rounded-xl text-sm font-bold text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  background: placing
                    ? undefined
                    : 'linear-gradient(135deg, #E35205, #CC3300)',
                }}
              >
                {placing ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Procesando...
                  </>
                ) : (
                  <>
                    Confirmar Pedido
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </>
                )}
              </Button>

              {/* Trust signals */}
              <div className="mt-4 flex items-center justify-center gap-4 text-[10px] text-[#555]">
                <div className="flex items-center gap-1">
                  <ShieldCheck className="h-3 w-3 text-green-500/60" />
                  <span>Pago seguro</span>
                </div>
                <div className="flex items-center gap-1">
                  <Truck className="h-3 w-3 text-blue-500/60" />
                  <span>Envío confiable</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}