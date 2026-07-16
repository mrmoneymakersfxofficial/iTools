import Link from "next/link";

export function DealBlocks() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
      {/* Row 1: BOSCH (2/3) + Sierras (1/3) */}
      <div className="lg:col-span-2">
        <Link
          href="#"
          className="block bg-[#005691] rounded-lg overflow-hidden group min-h-[200px] lg:min-h-[250px] p-6 lg:p-8 flex flex-col justify-between"
        >
          <div>
            <h3 className="text-white font-bold text-xl lg:text-2xl mb-4">
              ¡CARGA Y AHORRA GRANDE!
            </h3>
            <ul className="space-y-1.5 text-white/90 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-white/60 mt-0.5">•</span>
                <span>
                  <strong>S/ 125 DE DESCUENTO</strong> en pedidos BOSCH de S/
                  500+
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-white/60 mt-0.5">•</span>
                <span>
                  <strong>S/ 75 DE DESCUENTO</strong> en pedidos BOSCH de S/
                  300+
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-white/60 mt-0.5">•</span>
                <span>
                  <strong>S/ 50 DE DESCUENTO</strong> en pedidos BOSCH de S/
                  200+
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-white/60 mt-0.5">•</span>
                <span>
                  <strong>S/ 15 DE DESCUENTO</strong> en pedidos BOSCH de S/
                  100+
                </span>
              </li>
            </ul>
          </div>
          <div className="flex items-center gap-4 mt-6">
            <span className="bg-white/20 rounded px-3 py-1 text-sm text-white font-mono">
              SPARKSAVE
            </span>
            <span className="bg-white text-[#005691] font-bold rounded px-6 py-2.5 text-sm uppercase tracking-wide group-hover:bg-gray-100 transition-colors">
              Compra Ahora
            </span>
          </div>
        </Link>
      </div>

      {/* Right column: Sierras + STIHL stacked */}
      <div className="flex flex-col gap-3">
        {/* Sierras block */}
        <Link
          href="#"
          className="block flex-1 bg-[#1A1A1A] rounded-lg overflow-hidden group p-5 lg:p-6 flex flex-col justify-between min-h-[120px]"
        >
          <div>
            <p className="text-white font-bold text-sm lg:text-base">
              Obtén <span className="text-[#D1001C]">10% DE DESCUENTO</span>{" "}
              en combos de sierras seleccionadas
            </p>
          </div>
          <div className="flex items-center gap-3 mt-4">
            <span className="bg-white/20 rounded px-3 py-1 text-xs text-white font-mono">
              SEASAVE
            </span>
            <span className="bg-[#D1001C] text-white font-bold rounded px-4 py-2 text-xs uppercase tracking-wide group-hover:bg-red-700 transition-colors">
              Compra Ahora
            </span>
          </div>
        </Link>

        {/* STIHL block */}
        <Link
          href="#"
          className="block flex-1 bg-[#E35205] rounded-lg overflow-hidden group p-5 lg:p-6 flex flex-col justify-between min-h-[120px]"
        >
          <div>
            <p className="text-white font-bold text-sm lg:text-base">
              AHORRA HASTA <span className="text-yellow-200">S/ 200</span> en
              artículos STIHL seleccionados
            </p>
          </div>
          <div className="flex items-center mt-4">
            <span className="bg-white text-[#E35205] font-bold rounded px-4 py-2 text-xs uppercase tracking-wide group-hover:bg-gray-100 transition-colors">
              Compra Ahora
            </span>
          </div>
        </Link>
      </div>

      {/* Full width Sorteo banner */}
      <div className="lg:col-span-3">
        <Link
          href="#"
          className="block bg-[#FFD700] rounded-lg overflow-hidden group py-4 px-6 text-center"
        >
          <p className="text-gray-900 font-bold text-sm lg:text-base uppercase tracking-wide">
            PARTICIPA Y GANA UN CARRITO RAILWORKS GRATIS
          </p>
          <p className="text-gray-800 font-mono text-lg lg:text-xl mt-1 font-semibold">
            ENVÍA WIN AL 86657
          </p>
        </Link>
      </div>
    </div>
  );
}