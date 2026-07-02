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
  Phone,
  MapPin,
  Truck,
  Shield,
} from "lucide-react";
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
        <div className="absolute left-0 top-full z-50 min-w-[220px] rounded-b-lg border-t-2 border-itools-blue bg-white shadow-lg animate-in fade-in-0 slide-in-from-top-2 duration-150">
          <div className="py-2">
            {category.children!.map((child) => (
              <a
                key={child.id}
                href={`/categoria/${child.slug}`}
                className="block px-5 py-2.5 text-sm text-itools-dark hover:bg-surface hover:text-itools-blue transition-colors"
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

  // Auto-focus input on mount
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

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[60] bg-white flex flex-col">
      {/* Search header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
        <Input
          ref={inputRef}
          value={query}
          onChange={(e) => handleChange(e.target.value)}
          placeholder="Buscar herramientas, marcas, SKUs..."
          className="flex-1 h-11 text-base focus-visible:ring-itools-blue/30 focus-visible:border-itools-blue/50"
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

      {/* Results */}
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
          <div className="divide-y divide-border">
            {results.map((product) => (
              <a
                key={product.id}
                href={`/producto/${product.slug}`}
                className="flex items-start gap-3 px-4 py-3 hover:bg-surface transition-colors"
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
                  <p className="text-sm font-bold text-itools-red">
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

/** Mobile menu sidebar content */
function MobileMenuContent({ onClose }: { onClose: () => void }) {
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  const toggleCategory = (id: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  return (
    <div className="flex flex-col h-full">
      <SheetHeader className="border-b border-border pb-4">
        <SheetTitle className="flex items-center gap-2">
          <span className="text-xl font-extrabold text-itools-blue font-impact tracking-tight">
            iTools
          </span>
          <span className="text-[10px] font-bold text-itools-red font-impact tracking-[0.2em] uppercase leading-none">
            PERÚ
          </span>
        </SheetTitle>
      </SheetHeader>

      <nav className="flex-1 overflow-y-auto py-2" aria-label="Menú de navegación">
        {getTopLevelCategories().map((category) => {
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
                className="flex items-center justify-between w-full px-4 py-3 text-sm font-medium text-itools-dark hover:bg-surface transition-colors"
              >
                <a
                  href={`/categoria/${category.slug}`}
                  onClick={(e) => {
                    if (!hasChildren) {
                      e.preventDefault();
                      onClose();
                    }
                  }}
                  className="hover:text-itools-blue transition-colors"
                >
                  {category.name}
                </a>
                {hasChildren && (
                  <ChevronDown
                    className={`h-4 w-4 text-muted-foreground transition-transform duration-200 ${
                      isExpanded ? "rotate-180" : ""
                    }`}
                  />
                )}
              </button>

              {hasChildren && isExpanded && (
                <div className="bg-surface/60 border-l-2 border-itools-blue/20">
                  {category.children!.map((child) => (
                    <a
                      key={child.id}
                      href={`/categoria/${child.slug}`}
                      onClick={() => onClose()}
                      className="block pl-8 pr-4 py-2.5 text-sm text-muted-foreground hover:text-itools-blue hover:bg-white transition-colors"
                    >
                      {child.name}
                    </a>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      <div className="border-t border-border p-4">
        <a
          href="/cuenta"
          onClick={() => onClose()}
          className="flex items-center gap-2 text-sm font-medium text-itools-dark hover:text-itools-blue transition-colors"
        >
          <User className="h-4 w-4" />
          Mi Cuenta
        </a>
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

  // Desktop search with debounce
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

  // Close desktop results on outside click
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

  // Close desktop results on Escape
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
        {/* ── Top Bar (hidden on mobile) ── */}
        <div className="hidden md:block bg-itools-dark text-white">
          <div className="mx-auto max-w-7xl px-4 flex items-center justify-between h-8 text-xs">
            {/* Left side */}
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

            {/* Right side */}
            <div className="flex items-center gap-4">
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
        <div className="bg-white border-b border-border shadow-sm">
          <div className="mx-auto max-w-7xl px-4 h-16 flex items-center gap-3 lg:gap-6">
            {/* Left: Mobile hamburger / Desktop logo */}
            <div className="flex items-center gap-3 shrink-0">
              {/* Mobile hamburger */}
              <Sheet>
                <SheetTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="md:hidden -ml-1 text-itools-dark hover:text-itools-blue"
                    aria-label="Abrir menú"
                  >
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[300px] sm:w-[360px] p-0">
                  <MobileMenuContent onClose={() => {}} />
                </SheetContent>
              </Sheet>

              {/* Logo */}
              <a href="/" className="flex flex-col items-start leading-none">
                <span className="text-xl lg:text-2xl font-extrabold text-itools-blue font-impact tracking-tight">
                  iTools
                </span>
                <span className="text-[9px] lg:text-[10px] font-bold text-itools-red font-impact tracking-[0.18em] uppercase -mt-0.5">
                  PERÚ
                </span>
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
                  className="w-full h-10 pl-10 pr-4 bg-surface border-0 rounded-lg text-sm focus-visible:ring-itools-blue/30 focus-visible:border-itools-blue/50"
                  aria-label="Buscar productos"
                  aria-expanded={desktopResultsOpen}
                  role="combobox"
                />
              </div>

              {/* Desktop search dropdown */}
              {desktopResultsOpen && desktopResults.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 z-50 bg-white rounded-lg border border-border shadow-xl max-h-96 overflow-y-auto">
                  <div className="divide-y divide-border">
                    {desktopResults.slice(0, 8).map((product) => (
                      <a
                        key={product.id}
                        href={`/producto/${product.slug}`}
                        className="flex items-start gap-3 px-4 py-3 hover:bg-surface transition-colors"
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
                          <p className="text-sm font-bold text-itools-red">
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
                    <div className="px-4 py-2.5 border-t border-border text-center">
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
                className="md:hidden text-itools-dark hover:text-itools-blue"
                onClick={() => setMobileSearchOpen(true)}
                aria-label="Buscar"
              >
                <Search className="h-5 w-5" />
              </Button>

              {/* Wishlist */}
              <Button
                variant="ghost"
                size="icon"
                className="relative text-itools-dark hover:text-itools-blue"
                aria-label={`Lista de deseos (${wishlistCount} artículos)`}
              >
                <Heart className="h-5 w-5" />
                {wishlistCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-4 min-w-4 px-1 text-[10px] font-bold flex items-center justify-center bg-itools-red text-white border-0 rounded-full">
                    {wishlistCount > 99 ? "99+" : wishlistCount}
                  </Badge>
                )}
              </Button>

              {/* Cart */}
              <Button
                variant="ghost"
                size="icon"
                className="relative text-itools-dark hover:text-itools-blue"
                onClick={openCart}
                aria-label={`Carrito de compras (${cartItemCount} artículos)`}
              >
                <ShoppingCart className="h-5 w-5" />
                {cartItemCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-4 min-w-4 px-1 text-[10px] font-bold flex items-center justify-center bg-itools-red text-white border-0 rounded-full">
                    {cartItemCount > 99 ? "99+" : cartItemCount}
                  </Badge>
                )}
              </Button>

              {/* User: mobile icon only, desktop with text */}
              <a href="/cuenta" className="hidden md:block">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-itools-dark hover:text-itools-blue gap-1.5"
                >
                  <User className="h-4 w-4" />
                  <span className="text-sm font-medium">Mi Cuenta</span>
                </Button>
              </a>
              <a href="/cuenta" className="md:hidden">
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-itools-dark hover:text-itools-blue"
                  aria-label="Mi cuenta"
                >
                  <User className="h-5 w-5" />
                </Button>
              </a>
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

      {/* ── Mobile Search Overlay (portal-like, rendered outside header) ── */}
      {mobileSearchOpen && (
        <MobileSearchOverlay
          key={Date.now()}
          onClose={() => setMobileSearchOpen(false)}
        />
      )}
    </>
  );
}