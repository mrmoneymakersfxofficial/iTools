"use client";

import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";

const companyItems = [
  { label: "Nuestros Productos", href: "#" },
  { label: "Catálogos", href: "#" },
  { label: "Nuestras Tiendas", href: "#" },
  { label: "Atención al Cliente", href: "#" },
  { label: "Seguir mi Pedido", href: "#" },
  { label: "Solicitar Cotización", href: "#" },
];

export function UtilityBar() {
  return (
    <div className="hidden md:flex items-center bg-black h-8 w-full">
      <div className="mx-auto max-w-7xl w-full px-4 flex items-center justify-between">
        {/* Left */}
        <div className="flex items-center gap-3 text-[11px] uppercase tracking-wider">
          <span className="text-white font-medium">Envío Rápido</span>
          <span className="text-gray-300">
            Envío Gratis en pedidos superiores a S/ 199
          </span>
        </div>

        {/* Center - Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="flex items-center gap-1 text-[11px] uppercase tracking-wider text-gray-300 hover:text-white transition-colors cursor-pointer"
            >
              Nuestra Empresa
              <ChevronDown className="h-3 w-3" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="center"
            className="min-w-[200px] bg-white border border-gray-200 rounded-lg shadow-lg"
          >
            {companyItems.map((item) => (
              <DropdownMenuItem key={item.label} asChild>
                <Link
                  href={item.href}
                  className="text-sm text-gray-700 hover:bg-gray-50 cursor-pointer"
                >
                  {item.label}
                </Link>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Right */}
        <div className="flex items-center gap-3 text-[11px] uppercase tracking-wider">
          <Link
            href="/login"
            className="text-gray-300 hover:text-white transition-colors"
          >
            Iniciar Sesión
          </Link>
          <span className="text-gray-600">|</span>
          <Link
            href="/registro"
            className="text-gray-300 hover:text-white transition-colors"
          >
            Crear Cuenta
          </Link>
          <span className="text-gray-600">|</span>
          <Link
            href="#"
            className="text-gray-300 hover:text-white transition-colors"
          >
            Mi Carrito (0)
          </Link>
        </div>
      </div>
    </div>
  );
}