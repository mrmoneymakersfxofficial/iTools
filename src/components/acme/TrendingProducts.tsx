import Image from "next/image";
import Link from "next/link";
import { trendingProducts } from "@/app/data/mock";

function formatPrice(n: number): string {
  return `S/ ${n.toLocaleString("es-PE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function TrendingProducts() {
  return (
    <section>
      <h2 className="text-lg font-bold text-gray-900 uppercase tracking-wide border-b-2 border-[#D1001C] pb-2 mb-4">
        Productos Destacados
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
        {trendingProducts.map((product) => (
          <Link
            key={product.id}
            href="#"
            className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow group"
          >
            <div className="relative aspect-square bg-gray-100 overflow-hidden">
              <Image
                src={product.image}
                alt={product.name}
                fill
                unoptimized
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
              {/* Discount badge */}
              {product.discount && (
                <span className="absolute top-2 left-2 bg-[#D1001C] text-white rounded px-2 py-0.5 text-[10px] font-bold">
                  {product.discount}
                </span>
              )}
              {/* Free shipping badge */}
              {product.freeShipping && (
                <span className="absolute top-2 right-2 bg-[#16A34A] text-white rounded px-2 py-0.5 text-[10px] font-bold">
                  Envío Gratis
                </span>
              )}
            </div>
            <div className="p-3">
              <h3 className="text-xs text-gray-800 line-clamp-2 leading-snug min-h-[2.5rem]">
                {product.name}
              </h3>
              <p className="text-base font-bold text-[#D1001C] mt-1.5">
                {formatPrice(product.price)}
              </p>
              {product.oldPrice && (
                <p className="text-xs text-gray-400 line-through mt-0.5">
                  {formatPrice(product.oldPrice)}
                </p>
              )}
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}