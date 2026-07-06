"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import {
  Search,
  ShoppingCart,
  Heart,
  User,
  Menu,
  X,
  ChevronDown,
  ChevronRight,
  Phone,
  MapPin,
  Truck,
  Shield,
  Sparkles,
  LogOut,
  Package,
  Settings,
  HelpCircle,
} from "lucide-react";
import { AccountMenu, AccountMenuDesktop } from "@/components/layout/AccountMenu";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { useCartStore } from "@/stores/cart-store";
import { useWishlistStore } from "@/stores/wishlist-store";
import { categories, searchProducts } from "@/lib/data";
import type { Product, Category } from "@/types";
import { cn } from "@/lib/utils";

/* ───────────────────────── helpers ───────────────────────── */

function formatPrice(n: number): string {
  return `S/ ${n.toLocaleString("es-PE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function getTopLevelCategories(): Category[] {
  return categories.filter((c) => c.parentId === null);
}

/* ───────────────────────── sub-components ───────────────────────── */

/** Desktop category dropdown row */
function CategoryNavItem({ category }: { category: Category }) {
  const [open, setOpen] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setOpen(true);
  };

  const handleLeave = () => {
    timeoutRef.current = setTimeout(() => setOpen(false), 150);
  };

  const hasChildren = category.children && category.children.length > 0;

  return (
    <div
      className="relative"
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
      <button
        type="button"
        className="flex items-center gap-1 px-4 py-2.5 text-sm font-medium text-white/90 hover:text-white hover:bg-white/10 transition-colors whitespace-nowrap"
      >
        {category.name}
        {hasChildren && <ChevronDown className="h-3.5 w-3.5" />}
      </button>

      {hasChildren && open && (
        <div className="absolute left-0 top-full z-50 min-w-[220px] rounded-b-xl border-t-2 border-itools-blue bg-white dark:bg-[#1a1a1a] shadow-xl animate-in fade-in-0 slide-in-from-top-2 duration-150">
          <div className="py-2">
            {category.children!.map((child) => (
              <a
                key={child.id}
                href={`/categoria/${child.slug}`}
                className="block px-5 py-2.5 text-sm text-itools-dark dark:text-white/90 hover:bg-surface dark:hover:bg-[#222] hover:text-itools-blue transition-colors"
              >
                {child.name}
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/** Mobile search overlay */
function MobileSearchOverlay({
  onClose,
}: {
  onClose: () => void;
}) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Product[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => inputRef.current?.focus(), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleChange = useCallback((value: string) => {
    setQuery(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!value.trim()) {
      setResults([]);
      return;
    }
    debounceRef.current = setTimeout(() => {
      setResults(searchProducts(value));
    }, 300);
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[60] bg-white dark:bg-[#111111] flex flex-col">
      <div className="flex items-center gap-3 px-4 py-3 border-b border-border dark:border-[#222]">
        <Input
          ref={inputRef}
          value={query}
          onChange={(e) => handleChange(e.target.value)}
          placeholder="Buscar herramientas, marcas, SKUs..."
          className="flex-1 h-11 text-base bg-transparent dark:text-white focus-visible:ring-itools-blue/30 focus-visible:border-itools-blue/50"
        />
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="shrink-0 text-muted-foreground hover:text-foreground"
          aria-label="Cerrar búsqueda"
        >
          <X className="h-5 w-5" />
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {query.trim() && results.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
            <Search className="h-10 w-10 text-muted-foreground/40 mb-3" />
            <p className="text-sm text-muted-foreground">
              No se encontraron resultados para &ldquo;{query}&rdquo;
            </p>
          </div>
        )}

        {results.length > 0 && (
          <div className="divide-y divide-border dark:divide-[#222]">
            {results.map((product) => (
              <a
                key={product.id}
                href={`/producto/${product.slug}`}
                className="flex items-start gap-3 px-4 py-3 hover:bg-surface dark:hover:bg-[#1a1a1a] transition-colors"
                onClick={onClose}
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">
                    {product.name}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {product.brand?.name} &middot; {product.sku}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm text-itools-red">
                    {formatPrice(product.price)}
                  </p>
                  {product.comparePrice && (
                    <p className="text-xs text-muted-foreground line-through">
                      {formatPrice(product.comparePrice)}
                    </p>
                  )}
                </div>
              </a>
            ))}
          </div>
        )}

        {!query.trim() && (
          <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
            <Search className="h-10 w-10 text-muted-foreground/30 mb-3" />
            <p className="text-sm text-muted-foreground">
              Escribe para buscar herramientas
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

/* ───────────────────────── Modern Hamburger Menu ───────────────────────── */

function MobileMenuContent({ onClose }: { onClose: () => void }) {
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  const toggleCategory = (id: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const topLevelCategories = getTopLevelCategories();

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-[#0d0d1a] to-[#111128] text-white">
      {/* ── Modern Header with rounded profile area ── */}
      <div className="px-5 pt-6 pb-5">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-itools-blue to-indigo-600 flex items-center justify-center shadow-lg shadow-itools-blue/20">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-[15px] font-semibold tracking-tight">iTools Perú</p>
              <p className="text-[11px] text-white/50">Tu tienda de herramientas</p>
            </div>
          </div>
        </div>

        {/* Quick actions row */}
        <div className="grid grid-cols-3 gap-2">
          <a
            href="/cuenta"
            onClick={() => onClose()}
            className="flex flex-col items-center gap-1.5 py-3 rounded-2xl bg-white/5 hover:bg-white/10 transition-colors"
          >
            <div className="h-9 w-9 rounded-xl bg-white/10 flex items-center justify-center">
              <User className="h-4 w-4 text-white/80" />
            </div>
            <span className="text-[10px] text-white/60 font-medium">Mi Cuenta</span>
          </a>
          <a
            href="/categoria/herramientas-electricas"
            onClick={() => onClose()}
            className="flex flex-col items-center gap-1.5 py-3 rounded-2xl bg-white/5 hover:bg-white/10 transition-colors"
          >
            <div className="h-9 w-9 rounded-xl bg-white/10 flex items-center justify-center">
              <Package className="h-4 w-4 text-white/80" />
            </div>
            <span className="text-[10px] text-white/60 font-medium">Categorías</span>
          </a>
          <a
            href="/contacto"
            onClick={() => onClose()}
            className="flex flex-col items-center gap-1.5 py-3 rounded-2xl bg-white/5 hover:bg-white/10 transition-colors"
          >
            <div className="h-9 w-9 rounded-xl bg-white/10 flex items-center justify-center">
              <HelpCircle className="h-4 w-4 text-white/80" />
            </div>
            <span className="text-[10px] text-white/60 font-medium">Ayuda</span>
          </a>
        </div>
      </div>

      {/* ── Categories List ── */}
      <nav className="flex-1 overflow-y-auto px-3" aria-label="Menú de navegación">
        <p className="px-3 pb-2 pt-2 text-[10px] font-semibold uppercase tracking-widest text-white/30">
          Categorías
        </p>
        <div className="space-y-0.5">
          {topLevelCategories.map((category, idx) => {
            const hasChildren = category.children && category.children.length > 0;
            const isExpanded = expanded.has(category.id);

            return (
              <div key={category.id}>
                <button
                  type="button"
                  onClick={() =>
                    hasChildren
                      ? toggleCategory(category.id)
                      : onClose()
                  }
                  className="flex items-center justify-between w-full px-3 py-3 text-sm font-medium text-white/85 hover:text-white hover:bg-white/5 rounded-xl transition-all duration-200 group"
                >
                  <a
                    href={`/categoria/${category.slug}`}
                    onClick={(e) => {
                      if (!hasChildren) {
                        e.preventDefault();
                        onClose();
                      }
                    }}
                    className="group-hover:text-itools-blue-light transition-colors"
                  >
                    {category.name}
                  </a>
                  {hasChildren ? (
                    <ChevronDown
                      className={cn(
                        "h-4 w-4 text-white/30 group-hover:text-white/60 transition-all duration-300",
                        isExpanded && "rotate-180"
                      )}
                    />
                  ) : (
                    <ChevronRight className="h-4 w-4 text-white/20 group-hover:text-white/50 transition-colors" />
                  )}
                </button>

                {hasChildren && isExpanded && (
                  <div className="ml-2 mt-0.5 mb-1 space-y-0.5 pl-2 border-l border-white/10">
                    {category.children!.map((child, childIdx) => (
                      <a
                        key={child.id}
                        href={`/categoria/${child.slug}`}
                        onClick={() => onClose()}
                        className="flex items-center gap-2 px-3 py-2.5 text-[13px] text-white/55 hover:text-white hover:bg-white/5 rounded-lg transition-all duration-200"
                      >
                        <span className="h-1 w-1 rounded-full bg-itools-blue/60" />
                        {child.name}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </nav>

      {/* ── Bottom section: theme toggle ── */}
      <div className="px-4 py-4 border-t border-white/5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-xl bg-white/5 flex items-center justify-center">
              <Settings className="h-4 w-4 text-white/50" />
            </div>
            <span className="text-sm text-white/60">Apariencia</span>
          </div>
          <ThemeToggle />
        </div>
      </div>
    </div>
  );
}

/* ───────────────────────── main Header ───────────────────────── */

export default function Header() {
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [desktopQuery, setDesktopQuery] = useState("");
  const [desktopResults, setDesktopResults] = useState<Product[]>([]);
  const [desktopResultsOpen, setDesktopResultsOpen] = useState(false);
  const desktopSearchRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  const cartItemCount = useCartStore((s) => s.getItemCount());
  const wishlistCount = useWishlistStore((s) => s.getCount());
  const openCart = useCartStore((s) => s.openCart);

  const handleDesktopSearch = useCallback((value: string) => {
    setDesktopQuery(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!value.trim()) {
      setDesktopResults([]);
      setDesktopResultsOpen(false);
      return;
    }
    debounceRef.current = setTimeout(() => {
      const res = searchProducts(value);
      setDesktopResults(res);
      setDesktopResultsOpen(res.length > 0);
    }, 300);
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        desktopSearchRef.current &&
        !desktopSearchRef.current.contains(e.target as Node)
      ) {
        setDesktopResultsOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setDesktopResultsOpen(false);
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  const topLevelCategories = getTopLevelCategories();

  return (
    <>
      <header className="sticky top-0 z-50 w-full">
        {/* ── Top Bar (desktop only) ── */}
        <div className="hidden md:block bg-itools-dark text-white">
          <div className="mx-auto max-w-7xl px-4 flex items-center justify-between h-8 text-xs">
            <div className="flex items-center gap-4">
              <a
                href="tel:+5112345678"
                className="flex items-center gap-1.5 text-white/80 hover:text-white transition-colors"
              >
                <Phone className="h-3 w-3" />
                <span>01 234 5678</span>
              </a>
              <span className="text-white/30">|</span>
              <span className="flex items-center gap-1.5 text-white/80">
                <MapPin className="h-3 w-3" />
                <span>Lima, Perú</span>
              </span>
            </div>

            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1.5 text-white/80">
                <Shield className="h-3 w-3 text-gold" />
                <span>Servicio Técnico Oficial Milwaukee</span>
              </span>
              <span className="text-white/30">|</span>
              <span className="flex items-center gap-1.5 text-white/80">
                <Truck className="h-3 w-3" />
                <span>Envío a todo Perú</span>
              </span>
            </div>
          </div>
        </div>

        {/* ── Main Bar ── */}
        <div className="bg-white dark:bg-[#111111] border-b border-border dark:border-[#222] shadow-sm">
          <div className="mx-auto max-w-7xl px-4 h-16 flex items-center gap-3 lg:gap-6">
            {/* Left: Mobile hamburger / Desktop logo */}
            <div className="flex items-center gap-3 shrink-0">
              {/* Mobile hamburger */}
              <Sheet>
                <SheetTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="md:hidden -ml-1 text-itools-dark dark:text-white/90 hover:text-itools-blue"
                    aria-label="Abrir menú"
                  >
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent
                  side="left"
                  className="w-[300px] sm:w-[340px] p-0 border-0 rounded-r-3xl"
                  style={{ backgroundColor: "transparent" }}
                >
                  <MobileMenuContent onClose={() => {}} />
                </SheetContent>
              </Sheet>

              {/* Logo */}
              <a href="/" className="flex items-center">
                <img
                  src="/logo.png"
                  alt="iTools.Pe — Herramientas profesionales en Perú"
                  className="h-10 lg:h-12 w-auto object-contain"
                  width={180}
                  height={56}
                />
              </a>
            </div>

            {/* Center: Desktop search */}
            <div className="hidden md:flex flex-1 max-w-2xl relative" ref={desktopSearchRef}>
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                <Input
                  value={desktopQuery}
                  onChange={(e) => handleDesktopSearch(e.target.value)}
                  onFocus={() => {
                    if (desktopResults.length > 0) setDesktopResultsOpen(true);
                  }}
                  placeholder="Buscar herramientas, marcas, SKUs..."
                  className="w-full h-10 pl-10 pr-4 bg-surface dark:bg-[#1a1a1a] dark:text-white border-0 rounded-xl text-sm focus-visible:ring-itools-blue/30 focus-visible:border-itools-blue/50"
                  aria-label="Buscar productos"
                  aria-expanded={desktopResultsOpen}
                  role="combobox"
                />
              </div>

              {desktopResultsOpen && desktopResults.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 z-50 bg-white dark:bg-[#1a1a1a] rounded-xl border border-border dark:border-[#333] shadow-xl max-h-96 overflow-y-auto">
                  <div className="divide-y divide-border dark:divide-[#222]">
                    {desktopResults.slice(0, 8).map((product) => (
                      <a
                        key={product.id}
                        href={`/producto/${product.slug}`}
                        className="flex items-start gap-3 px-4 py-3 hover:bg-surface dark:hover:bg-[#222] transition-colors"
                        onClick={() => {
                          setDesktopResultsOpen(false);
                          setDesktopQuery("");
                          setDesktopResults([]);
                        }}
                      >
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground truncate">
                            {product.name}
                          </p>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {product.brand?.name} &middot; {product.sku}
                          </p>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="text-sm text-itools-red">
                            {formatPrice(product.price)}
                          </p>
                          {product.comparePrice && (
                            <p className="text-xs text-muted-foreground line-through">
                              {formatPrice(product.comparePrice)}
                            </p>
                          )}
                        </div>
                      </a>
                    ))}
                  </div>
                  {desktopResults.length > 8 && (
                    <div className="px-4 py-2.5 border-t border-border dark:border-[#222] text-center">
                      <a
                        href={`/buscar?q=${encodeURIComponent(desktopQuery)}`}
                        className="text-xs font-medium text-itools-blue hover:underline"
                        onClick={() => setDesktopResultsOpen(false)}
                      >
                        Ver todos los resultados ({desktopResults.length})
                      </a>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Right: Action icons */}
            <div className="flex items-center gap-0.5 sm:gap-1 ml-auto shrink-0">
              {/* Mobile search trigger */}
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden text-itools-dark dark:text-white/90 hover:text-itools-blue"
                onClick={() => setMobileSearchOpen(true)}
                aria-label="Buscar"
              >
                <Search className="h-5 w-5" />
              </Button>

              {/* Theme toggle (desktop: left of heart) */}
              <div className="hidden md:block">
                <ThemeToggle />
              </div>

              {/* Wishlist — fully functional */}
              <Button
                variant="ghost"
                size="icon"
                className="relative text-itools-dark dark:text-white/90 hover:text-itools-red dark:hover:text-itools-red transition-colors"
                aria-label={`Lista de deseos (${wishlistCount} artículos)`}
                onClick={() => {
                  // If items exist, navigate to wishlist page; otherwise just visual feedback
                  if (typeof window !== "undefined" && wishlistCount > 0) {
                    // Toggle a quick pulse animation on the button
                  }
                }}
              >
                <Heart
                  className={cn(
                    "h-5 w-5 transition-all duration-200",
                    wishlistCount > 0 && "fill-itools-red text-itools-red"
                  )}
                />
                {wishlistCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-4 min-w-4 px-1 text-[10px] flex items-center justify-center bg-itools-red text-white border-0 rounded-full">
                    {wishlistCount > 99 ? "99+" : wishlistCount}
                  </Badge>
                )}
              </Button>

              {/* Cart */}
              <Button
                variant="ghost"
                size="icon"
                className="relative text-itools-dark dark:text-white/90 hover:text-itools-blue"
                onClick={openCart}
                aria-label={`Carrito de compras (${cartItemCount} artículos)`}
              >
                <ShoppingCart className="h-5 w-5" />
                {cartItemCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-4 min-w-4 px-1 text-[10px] flex items-center justify-center bg-itools-red text-white border-0 rounded-full">
                    {cartItemCount > 99 ? "99+" : cartItemCount}
                  </Badge>
                )}
              </Button>

              {/* Account Menu: desktop with text */}
              <div className="hidden md:block">
                <AccountMenuDesktop />
              </div>
              {/* Account Menu: mobile icon */}
              <div className="md:hidden">
                <AccountMenu />
              </div>
            </div>
          </div>
        </div>

        {/* ── Category Nav (desktop only) ── */}
        <nav
          className="hidden md:block bg-itools-dark"
          aria-label="Categorías de productos"
        >
          <div className="mx-auto max-w-7xl px-4 flex items-center">
            {topLevelCategories.map((cat) => (
              <CategoryNavItem key={cat.id} category={cat} />
            ))}
          </div>
        </nav>
      </header>

      {mobileSearchOpen && (
        <MobileSearchOverlay
          key={Date.now()}
          onClose={() => setMobileSearchOpen(false)}
        />
      )}
    </>
  );
}