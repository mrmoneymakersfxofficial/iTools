'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { getWishlist, removeFromWishlist } from '@/lib/actions/wishlist'
import { useCartStore } from '@/stores/cart-store'
import Link from 'next/link'
import Image from 'next/image'
import {
  Heart,
  X,
  ShoppingCart,
  Star,
  Package,
  Loader2,
  Check,
} from 'lucide-react'
import type { WishlistItem } from '@/lib/actions/wishlist'

function formatPrice(price: number) {
  return `S/ ${price.toFixed(2)}`
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          className={`h-3 w-3 ${
            i < Math.round(rating) ? 'text-amber-400 fill-amber-400' : 'text-[#333]'
          }`}
        />
      ))}
    </div>
  )
}

export default function FavoritosPage() {
  const { data: session, status: authStatus } = useSession()
  const addItem = useCartStore((s) => s.addItem)
  const [items, setItems] = useState<WishlistItem[]>([])
  const [loading, setLoading] = useState(true)
  const [removedId, setRemovedId] = useState<string | null>(null)
  const [addedProductId, setAddedProductId] = useState<string | null>(null)

  // Fetch wishlist when authenticated
  useEffect(() => {
    if (authStatus === 'loading' || !session?.user?.id) return
    let cancelled = false
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true)
    getWishlist(session.user.id).then((data) => {
      if (cancelled) return
      setItems(data)
      setLoading(false)
    })
    return () => { cancelled = true }
  }, [authStatus, session?.user?.id])

  async function handleRemove(productId: string) {
    if (!session?.user?.id) return
    setRemovedId(productId)
    const result = await removeFromWishlist(session.user.id, productId)
    if (result.success) {
      setItems((prev) => prev.filter((i) => i.productId !== productId))
    }
    setRemovedId(null)
  }

  async function handleAddToCart(item: WishlistItem) {
    if (!item.product) return
    const product = {
      id: item.product.id,
      sku: '',
      name: item.product.name,
      slug: item.product.slug,
      description: '',
      shortDescription: '',
      price: item.product.price,
      comparePrice: item.product.comparePrice,
      categoryId: null,
      brandId: null,
      stock: item.product.stock,
      images: item.product.images,
      specs: {},
      rating: 0,
      reviewCount: 0,
      isFeatured: false,
      isOnSale: item.product.isOnSale,
      isNewArrival: false,
    }
    addItem(product, 1)
    setAddedProductId(item.productId)
    setTimeout(() => setAddedProductId(null), 1500)
  }

  if (authStatus === 'loading' || loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-xl font-bold text-white">Mis Favoritos</h1>
          <p className="text-xs text-[#666] mt-0.5">Cargando...</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-[#111] rounded-xl border border-[#1A1A1A] animate-pulse">
              <div className="aspect-square bg-[#1A1A1A] rounded-t-xl" />
              <div className="p-3 space-y-2">
                <div className="h-3 bg-[#1A1A1A] rounded w-3/4" />
                <div className="h-3 bg-[#1A1A1A] rounded w-1/2" />
                <div className="h-6 bg-[#1A1A1A] rounded w-full mt-3" />
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-white">Mis Favoritos</h1>
        <p className="text-xs text-[#666] mt-0.5">
          {items.length} producto{items.length !== 1 && 's'} guardado{items.length !== 1 && 's'}
        </p>
      </div>

      {items.length === 0 ? (
        <div className="bg-[#111] rounded-xl border border-[#1A1A1A] p-12 text-center">
          <Heart className="h-12 w-12 text-[#333] mx-auto mb-3" />
          <p className="text-sm text-[#666] mb-1">No tienes favoritos aún</p>
          <p className="text-xs text-[#555] mb-4">
            Explora nuestros productos y guarda los que más te gusten.
          </p>
          <Link
            href="/"
            className="inline-block px-5 py-2.5 rounded-xl text-xs font-semibold text-white transition-colors"
            style={{ background: 'linear-gradient(135deg, #E35205, #CC3300)' }}
          >
            Explorar productos
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {items.map((item) => {
            const image = item.product.images[0]

            return (
              <div
                key={item.id}
                className="bg-[#111] rounded-xl border border-[#1A1A1A] overflow-hidden group relative"
              >
                {/* Remove button */}
                <button
                  onClick={() => handleRemove(item.productId)}
                  disabled={removedId === item.productId}
                  className="absolute top-2 right-2 z-10 w-7 h-7 rounded-full bg-[#0A0A0A]/80 border border-[#333] flex items-center justify-center text-[#888] hover:text-red-400 hover:border-red-400/40 transition-colors"
                >
                  {removedId === item.productId ? (
                    <Loader2 className="h-3 w-3 animate-spin" />
                  ) : (
                    <X className="h-3 w-3" />
                  )}
                </button>

                {/* Image */}
                <Link href={`/producto/${item.product.slug}`} className="block">
                  <div className="aspect-square bg-[#1A1A1A] relative overflow-hidden">
                    {image ? (
                      <img
                        src={image}
                        alt={item.product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Package className="h-8 w-8 text-[#333]" />
                      </div>
                    )}
                    {item.product.isOnSale && item.product.comparePrice && (
                      <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-[9px] font-bold bg-red-500 text-white">
                        -{Math.round(((item.product.comparePrice - item.product.price) / item.product.comparePrice) * 100)}%
                      </span>
                    )}
                  </div>
                </Link>

                {/* Info */}
                <div className="p-3">
                  {item.product.brand && (
                    <p className="text-[10px] text-[#E35205] font-semibold mb-0.5">
                      {item.product.brand.name}
                    </p>
                  )}
                  <Link href={`/producto/${item.product.slug}`}>
                    <p className="text-xs text-[#CCC] font-medium line-clamp-2 hover:text-white transition-colors leading-relaxed">
                      {item.product.name}
                    </p>
                  </Link>

                  <div className="mt-1.5">
                    <StarRating rating={4} />
                  </div>

                  <div className="mt-2 flex items-baseline gap-2">
                    <p className="text-sm font-bold text-white">
                      {formatPrice(item.product.price)}
                    </p>
                    {item.product.isOnSale && item.product.comparePrice && (
                      <p className="text-[10px] text-[#666] line-through">
                        {formatPrice(item.product.comparePrice)}
                      </p>
                    )}
                  </div>

                  <button
                    onClick={() => handleAddToCart(item)}
                    disabled={item.product.stock === 0}
                    className={`mt-3 w-full py-2 rounded-lg text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-all ${
                      addedProductId === item.productId
                        ? 'bg-green-500/15 text-green-400 border border-green-500/20'
                        : item.product.stock === 0
                          ? 'bg-[#1A1A1A] text-[#555] border border-[#222] cursor-not-allowed'
                          : 'bg-[#E35205] text-white hover:bg-[#CC3300]'
                    }`}
                  >
                    {addedProductId === item.productId ? (
                      <>
                        <Check className="h-3.5 w-3.5" />
                        Agregado
                      </>
                    ) : item.product.stock === 0 ? (
                      'Agotado'
                    ) : (
                      <>
                        <ShoppingCart className="h-3.5 w-3.5" />
                        Agregar al Carrito
                      </>
                    )}
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}