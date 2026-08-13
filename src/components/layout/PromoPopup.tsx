"use client";

import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { urlFor } from "@/sanity/image";
import Image from "next/image";
import Link from "next/link";

interface PromoPopupData {
  title?: string;
  subtitle?: string;
  image?: { asset?: { url?: string; metadata?: { dimensions?: { width?: number; height?: number }; lqip?: string } } };
  ctaText?: string;
  ctaLink?: string;
  countdownEnd?: string;
}

export function PromoPopup({ data }: { data: PromoPopupData | null }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!data) return;
    // Check if popup was dismissed
    const dismissed = localStorage.getItem("promo-popup-dismissed");
    if (dismissed) {
      const dismissedDate = new Date(dismissed);
      // Show again after 24 hours
      if (Date.now() - dismissedDate.getTime() < 24 * 60 * 60 * 1000) return;
    }
    // Check if countdown expired
    if (data.countdownEnd && new Date(data.countdownEnd) < new Date()) return;
    // Show popup after 2 seconds delay
    const timer = setTimeout(() => setOpen(true), 2000);
    return () => clearTimeout(timer);
  }, [data]);

  const handleDismiss = () => {
    setOpen(false);
    localStorage.setItem("promo-popup-dismissed", new Date().toISOString());
  };

  if (!data) return null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-lg p-0 overflow-hidden">
        <DialogTitle className="sr-only">{data.title || "Promoción"}</DialogTitle>
        <button
          onClick={handleDismiss}
          className="absolute right-3 top-3 z-10 rounded-full bg-black/40 p-1.5 text-white hover:bg-black/60 transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
        {data.image?.asset?.url && (
          <div className="relative w-full h-48 overflow-hidden">
            <Image
              src={urlFor(data.image).width(600).height(250).format("webp").url()!}
              alt={data.title || "Promoción"}
              fill
              className="object-cover"
            />
          </div>
        )}
        <div className="p-6 space-y-3">
          <h3 className="text-xl font-bold">{data.title}</h3>
          {data.subtitle && <p className="text-muted-foreground">{data.subtitle}</p>}
          <Link href={data.ctaLink || "/"}>
            <Button className="w-full" size="lg" onClick={() => setOpen(false)}>
              {data.ctaText || "Ver más"}
            </Button>
          </Link>
        </div>
      </DialogContent>
    </Dialog>
  );
}
