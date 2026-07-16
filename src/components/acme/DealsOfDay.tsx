import Image from "next/image";
import Link from "next/link";
import { trendingProducts } from "@/app/data/mock";

function formatPrice(n: number): string {
  return `S/ ${n.toLocaleString("es-PE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

// Pick the 4 products that have discounts or are most deal-worthy
const dealProducts = trendingProducts.filter((p) => p.discount);

export function DealsOfDay() {
  return (
    <section>
      <div className="flex items-center justify-between mb-0">
        <h2 className="text-white bg-[#D1001C] px-6 py-3 rounded-t-lg text-sm font-bold uppercase tracking-wider">
          Ofertas del Día
        </h2>
        <Link
          href="/productos?filtro=ofertas"
          className="text-sm font-medium text-gray-500 hover:text-[#D1001C] transition-colors"
        >
          Ver Todas las Ofertas →
        </Link>
      </div>
      <div className="border border-gray-200 border-t-0 rounded-b-lg p-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {dealProducts.map((product) => (
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
                {product.discount && (
                  <span className="absolute top-2 left-2 bg-[#D1001C] text-white rounded px-2 py-0.5 text-[10px] font-bold">
                    {product.discount}
                  </span>
                )}
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
      </div>
    </section>
  );
}