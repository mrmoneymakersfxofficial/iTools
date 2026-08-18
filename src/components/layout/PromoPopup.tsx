"use client";

import { useEffect, useState, useCallback } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X, Clock } from "lucide-react";
import { urlFor } from "@/sanity/image";
import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "@/lib/format";

interface PromoPopupData {
  title?: string;
  subtitle?: string;
  image?: { asset?: { url?: string; metadata?: { dimensions?: { width?: number; height?: number }; lqip?: string } } };
  originalPrice?: number;
  promoPrice?: number;
  discountText?: string;
  ctaText?: string;
  ctaLink?: string;
  countdownEnd?: string;
  showOnEntry?: boolean;
  delaySeconds?: number;
}

function CountdownTimer({ endDate }: { endDate: string }) {
  const [timeLeft, setTimeLeft] = useState(() => getTimeLeft(endDate));

  function getTimeLeft(end: string) {
    const diff = new Date(end).getTime() - Date.now();
    if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, expired: true };
    return {
      days: Math.floor(diff / (1000 * 60 * 60 * 24)),
      hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((diff / (1000 * 60)) % 60),
      seconds: Math.floor((diff / 1000) % 60),
      expired: false,
    };
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(getTimeLeft(endDate));
    }, 1000);
    return () => clearInterval(interval);
  }, [endDate]);

  if (timeLeft.expired) return null;

  return (
    <div className="flex items-center gap-2 justify-center">
      <Clock className="h-4 w-4 text-itools-red" />
      <div className="flex gap-1">
        {[
          { value: timeLeft.days, label: "Días" },
          { value: timeLeft.hours, label: "Hrs" },
          { value: timeLeft.minutes, label: "Min" },
          { value: timeLeft.seconds, label: "Seg" },
        ].map((unit, i) => (
          <div key={i} className="flex items-center gap-0.5">
            <span className="bg-itools-dark text-white text-xs font-bold px-1.5 py-0.5 rounded">
              {String(unit.value).padStart(2, "0")}
            </span>
            {i < 3 && <span className="text-muted-foreground text-xs">:</span>}
          </div>
        ))}
      </div>
    </div>
  );
}

export function PromoPopup({ data }: { data: PromoPopupData | null }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!data) return;
    if (data.showOnEntry === false) return;

    // Check if popup was dismissed recently
    const dismissed = localStorage.getItem("promo-popup-dismissed");
    if (dismissed) {
      const dismissedDate = new Date(dismissed);
      // Show again after 24 hours
      if (Date.now() - dismissedDate.getTime() < 24 * 60 * 60 * 1000) return;
    }

    // Check if countdown expired
    if (data.countdownEnd && new Date(data.countdownEnd) < new Date()) return;

    // Show popup after configurable delay (default 3 seconds)
    const delay = (data.delaySeconds || 3) * 1000;
    const timer = setTimeout(() => setOpen(true), delay);
    return () => clearTimeout(timer);
  }, [data]);

  const handleDismiss = useCallback(() => {
    setOpen(false);
    localStorage.setItem("promo-popup-dismissed", new Date().toISOString());
  }, []);

  // Allow closing with Escape key
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleDismiss();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, handleDismiss]);

  if (!data) return null;

  return (
    <Dialog open={open} onOpenChange={(isOpen) => { if (!isOpen) handleDismiss(); }}>
      <DialogContent className="max-w-md p-0 overflow-hidden bg-white dark:bg-[#1a1a1a]">
        <DialogTitle className="sr-only">{data.title || "Promoción"}</DialogTitle>

        {/* Close button - prominent and easy to click */}
        <button
          onClick={handleDismiss}
          className="absolute right-3 top-3 z-10 rounded-full bg-black/40 hover:bg-black/60 p-2 text-white transition-colors"
          aria-label="Cerrar popup"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Product Image */}
        {data.image?.asset?.url && (
          <div className="relative w-full h-56 overflow-hidden">
            <Image
              src={urlFor(data.image).width(600).height(300).format("webp").url()!}
              alt={data.title || "Promoción"}
              fill
              className="object-cover"
            />
          </div>
        )}

        <div className="p-5 space-y-3">
          {/* Title */}
          <h3 className="text-lg font-bold text-foreground">{data.title}</h3>

          {/* Subtitle */}
          {data.subtitle && (
            <p className="text-sm text-muted-foreground">{data.subtitle}</p>
          )}

          {/* Discount Badge */}
          {data.discountText && (
            <div className="inline-block bg-itools-red text-white text-xs font-bold px-2.5 py-1 rounded">
              {data.discountText}
            </div>
          )}

          {/* Price Block */}
          {(data.originalPrice || data.promoPrice) && (
            <div className="bg-surface rounded-lg p-3 flex items-center gap-3">
              {data.originalPrice && (
                <span className="text-sm text-muted-foreground line-through">
                  {formatPrice(data.originalPrice)}
                </span>
              )}
              {data.promoPrice && (
                <span className="text-xl font-bold text-itools-red">
                  {formatPrice(data.promoPrice)}
                </span>
              )}
              {!data.promoPrice && data.originalPrice && (
                <span className="text-xl font-bold text-foreground">
                  {formatPrice(data.originalPrice)}
                </span>
              )}
              {data.originalPrice && data.promoPrice && (
                <span className="text-xs text-green-600 font-medium">
                  Ahorras {formatPrice(data.originalPrice - data.promoPrice)}
                </span>
              )}
            </div>
          )}

          {/* Countdown Timer */}
          {data.countdownEnd && new Date(data.countdownEnd) > new Date() && (
            <CountdownTimer endDate={data.countdownEnd} />
          )}

          {/* CTA Button */}
          <Link href={data.ctaLink || "/"} onClick={() => setOpen(false)}>
            <Button className="w-full bg-itools-red hover:bg-itools-red-dark text-white font-bold h-11 text-base">
              {data.ctaText || "Ver más"} →
            </Button>
          </Link>
        </div>
      </DialogContent>
    </Dialog>
  );
}
