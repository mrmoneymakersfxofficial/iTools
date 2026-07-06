"use client";

import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  User,
  Heart,
  ShoppingBag,
  LogIn,
  UserPlus,
  Shield,
  LogOut,
  ChevronDown,
} from "lucide-react";
import Link from "next/link";
import { useWishlistStore } from "@/stores/wishlist-store";
import { useCartStore } from "@/stores/cart-store";

export function AccountMenu() {
  // TODO: Replace with NextAuth useSession when auth is implemented
  const [isLoggedIn] = useState(false);
  const [userName] = useState("Usuario");
  const [userEmail] = useState("usuario@itools.pe");
  const isAdmin = false;

  const wishlistCount = useWishlistStore((s) => s.getCount());
  const cartItemCount = useCartStore((s) => s.getItemCount());

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative text-itools-dark hover:text-itools-blue rounded-full hover:bg-surface transition-colors"
          aria-label="Mi cuenta"
        >
          <User className="h-5 w-5" />
          {isLoggedIn && (
            <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 bg-green-500 rounded-full border-2 border-white" />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-60 bg-white border border-border shadow-xl rounded-xl overflow-hidden"
      >
        {isLoggedIn ? (
          <>
            {/* User Info Header */}
            <DropdownMenuLabel className="font-normal bg-surface/50">
              <div className="flex flex-col space-y-1 py-1">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-itools-blue flex items-center justify-center">
                    <User className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold leading-none text-foreground">{userName}</p>
                    <p className="text-xs leading-none text-muted-foreground mt-0.5">{userEmail}</p>
                  </div>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />

            <DropdownMenuItem asChild className="cursor-pointer py-2.5 focus:bg-itools-blue/5">
              <Link href="/cuenta" className="flex items-center gap-2.5">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Mi Cuenta</span>
              </Link>
            </DropdownMenuItem>

            <DropdownMenuItem asChild className="cursor-pointer py-2.5 focus:bg-itools-blue/5">
              <Link href="/pedidos" className="flex items-center gap-2.5">
                <ShoppingBag className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm flex-1">Mis Pedidos</span>
              </Link>
            </DropdownMenuItem>

            <DropdownMenuItem asChild className="cursor-pointer py-2.5 focus:bg-itools-blue/5">
              <Link href="/favoritos" className="flex items-center gap-2.5">
                <Heart className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm flex-1">Favoritos</span>
                {wishlistCount > 0 && (
                  <span className="ml-auto text-xs font-medium text-itools-blue bg-itools-blue/10 px-2 py-0.5 rounded-full">
                    {wishlistCount}
                  </span>
                )}
              </Link>
            </DropdownMenuItem>

            {isAdmin && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild className="cursor-pointer py-2.5 focus:bg-itools-blue/5">
                  <Link href="/admin" className="flex items-center gap-2.5">
                    <Shield className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Panel Admin</span>
                  </Link>
                </DropdownMenuItem>
              </>
            )}

            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer py-2.5 text-red-600 focus:bg-red-50 dark:focus:bg-red-950 focus:text-red-700">
              <LogOut className="h-4 w-4 mr-2.5" />
              <span className="text-sm">Cerrar Sesión</span>
            </DropdownMenuItem>
          </>
        ) : (
          <>
            {/* Guest Header */}
            <DropdownMenuLabel className="font-normal bg-surface/50">
              <div className="flex items-center gap-2.5 py-1">
                <div className="h-8 w-8 rounded-full bg-gray-200 dark:bg-[#333] flex items-center justify-center">
                  <User className="h-4 w-4 text-gray-500" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">Invitado</p>
                  <p className="text-xs text-muted-foreground">Inicia sesión para más opciones</p>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />

            <DropdownMenuItem asChild className="cursor-pointer py-3 focus:bg-itools-blue/5">
              <Link href="/login" className="flex items-center gap-2.5">
                <LogIn className="h-4 w-4 text-itools-blue" />
                <div className="flex flex-col">
                  <span className="text-sm font-medium">Iniciar Sesión</span>
                  <span className="text-[11px] text-muted-foreground">Accede a tu cuenta</span>
                </div>
              </Link>
            </DropdownMenuItem>

            <DropdownMenuItem asChild className="cursor-pointer py-3 focus:bg-itools-blue/5">
              <Link href="/registro" className="flex items-center gap-2.5">
                <UserPlus className="h-4 w-4 text-itools-blue" />
                <div className="flex flex-col">
                  <span className="text-sm font-medium">Crear Cuenta</span>
                  <span className="text-[11px] text-muted-foreground">Regístrate gratis</span>
                </div>
              </Link>
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem asChild className="cursor-pointer py-2.5 focus:bg-itools-blue/5">
              <Link href="/favoritos" className="flex items-center gap-2.5">
                <Heart className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm flex-1">Mis Favoritos</span>
                {wishlistCount > 0 && (
                  <span className="ml-auto text-xs font-medium text-itools-blue bg-itools-blue/10 px-2 py-0.5 rounded-full">
                    {wishlistCount}
                  </span>
                )}
              </Link>
            </DropdownMenuItem>

            <DropdownMenuItem asChild className="cursor-pointer py-2.5 focus:bg-itools-blue/5">
              <Link href="/pedidos" className="flex items-center gap-2.5">
                <ShoppingBag className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Mis Pedidos</span>
              </Link>
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

/** Desktop version with text label */
export function AccountMenuDesktop() {
  const [isLoggedIn] = useState(false);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="flex items-center gap-1.5 text-sm font-medium text-itools-dark hover:text-itools-blue transition-colors py-2 px-1"
        >
          <User className="h-4 w-4" />
          <span>Mi Cuenta</span>
          <ChevronDown className="h-3 w-3" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-60 bg-white border border-border shadow-xl rounded-xl overflow-hidden"
      >
        {isLoggedIn ? (
          <>
            <DropdownMenuLabel className="font-normal bg-surface/50">
              <div className="flex flex-col space-y-1 py-1">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-itools-blue flex items-center justify-center">
                    <User className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold leading-none text-foreground">Usuario</p>
                    <p className="text-xs leading-none text-muted-foreground mt-0.5">usuario@itools.pe</p>
                  </div>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild className="cursor-pointer py-2.5 focus:bg-itools-blue/5">
              <Link href="/cuenta" className="flex items-center gap-2.5">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Mi Cuenta</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild className="cursor-pointer py-2.5 focus:bg-itools-blue/5">
              <Link href="/pedidos" className="flex items-center gap-2.5">
                <ShoppingBag className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Mis Pedidos</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild className="cursor-pointer py-2.5 focus:bg-itools-blue/5">
              <Link href="/favoritos" className="flex items-center gap-2.5">
                <Heart className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Favoritos</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer py-2.5 text-red-600 focus:bg-red-50 dark:focus:bg-red-950">
              <LogOut className="h-4 w-4 mr-2.5" />
              <span className="text-sm">Cerrar Sesión</span>
            </DropdownMenuItem>
          </>
        ) : (
          <>
            <DropdownMenuItem asChild className="cursor-pointer py-3 focus:bg-itools-blue/5">
              <Link href="/login" className="flex items-center gap-2.5">
                <LogIn className="h-4 w-4 text-itools-blue" />
                <div className="flex flex-col">
                  <span className="text-sm font-medium">Iniciar Sesión</span>
                  <span className="text-[11px] text-muted-foreground">Accede a tu cuenta</span>
                </div>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild className="cursor-pointer py-3 focus:bg-itools-blue/5">
              <Link href="/registro" className="flex items-center gap-2.5">
                <UserPlus className="h-4 w-4 text-itools-blue" />
                <div className="flex flex-col">
                  <span className="text-sm font-medium">Crear Cuenta</span>
                  <span className="text-[11px] text-muted-foreground">Regístrate gratis</span>
                </div>
              </Link>
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}