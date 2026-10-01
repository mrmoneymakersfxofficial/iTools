"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getSanityAttr } from "@/lib/sanity/visual-attributes";

interface FlashSaleCountdownCardProps {
  tile?: any;
}

export function FlashSaleCountdownCard({ tile }: FlashSaleCountdownCardProps) {
  const [timeLeft, setTimeLeft] = useState(() => {
    if (tile?.countdownEnd) {
      const diff = new Date(tile.countdownEnd).getTime() - Date.now();
      if (diff > 0) {
        return {
          hours: Math.floor(diff / (1000 * 60 * 60)),
          minutes: Math.floor((diff / 1000 / 60) % 60),
          seconds: Math.floor((diff / 1000) % 60),
        };
      }
    }
    return { hours: 12, minutes: 59, seconds: 43 };
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (tile?.countdownEnd) {
          const diff = new Date(tile.countdownEnd).getTime() - Date.now();
          if (diff > 0) {
            return {
              hours: Math.floor(diff / (1000 * 60 * 60)),
              minutes: Math.floor((diff / 1000 / 60) % 60),
              seconds: Math.floor((diff / 1000) % 60),
            };
          }
        }
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 12, minutes: 59, seconds: 43 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [tile?.countdownEnd]);

  const pad = (n: number) => n.toString().padStart(2, "0");
  const sanityAttr = getSanityAttr(tile?._id || "deal-tile-duo-countdown", "dealTile", "image");

  return (
    <Link
      href={tile?.href || "/marca/dongcheng"}
      {...sanityAttr}
      className="group relative block w-full rounded-2xl overflow-hidden transition-all duration-300 hover:scale-[1.01] hover:shadow-lg shadow-sm"
    >
      {/* Background Image uploaded from Sanity (Sin difuminado, sin bordes negros, 100% nítido) */}
      {tile?.image?.asset?.url ? (
        <div className="relative w-full aspect-[600/365]">
          <img
            src={tile.image.asset.url}
            alt={tile.title || "Promos Express"}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />

          {/* Solo el contador (sin texto superpuesto ni difuminado) */}
          <div className="absolute inset-x-2.5 sm:inset-x-3.5 bottom-[14%] sm:bottom-[15%] z-10">
            <div className="flex items-center justify-center gap-1 sm:gap-1.5 text-center">
              {/* Hours */}
              <div className="flex-1 bg-white text-neutral-900 rounded-lg py-1 sm:py-1.5 px-0.5 sm:px-1 shadow-md flex flex-col items-center justify-center text-center">
                <span className="text-base sm:text-lg font-black leading-none tracking-tight block">
                  {pad(timeLeft.hours)}
                </span>
                <span className="text-[7.5px] sm:text-[8px] font-bold text-neutral-500 uppercase tracking-wider mt-0.5 block">
                  HRS
                </span>
              </div>

              <span className="text-white font-black text-sm sm:text-base pb-0.5 leading-none select-none">:</span>

              {/* Minutes */}
              <div className="flex-1 bg-white text-neutral-900 rounded-lg py-1 sm:py-1.5 px-0.5 sm:px-1 shadow-md flex flex-col items-center justify-center text-center">
                <span className="text-base sm:text-lg font-black leading-none tracking-tight block">
                  {pad(timeLeft.minutes)}
                </span>
                <span className="text-[7.5px] sm:text-[8px] font-bold text-neutral-500 uppercase tracking-wider mt-0.5 block">
                  MIN
                </span>
              </div>

              <span className="text-white font-black text-sm sm:text-base pb-0.5 leading-none select-none">:</span>

              {/* Seconds */}
              <div className="flex-1 bg-white text-neutral-900 rounded-lg py-1 sm:py-1.5 px-0.5 sm:px-1 shadow-md flex flex-col items-center justify-center text-center">
                <span className="text-base sm:text-lg font-black leading-none tracking-tight block">
                  {pad(timeLeft.seconds)}
                </span>
                <span className="text-[7.5px] sm:text-[8px] font-bold text-neutral-500 uppercase tracking-wider mt-0.5 block">
                  SEG
                </span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="relative w-full aspect-[600/365] bg-[#0056D2] flex items-center justify-center p-3">
          <div className="w-full">
            <div className="flex items-center justify-center gap-1.5 text-center">
              <div className="flex-1 bg-white text-neutral-900 rounded-lg py-1.5 px-1 shadow-md flex flex-col items-center justify-center text-center">
                <span className="text-base sm:text-lg font-black leading-none tracking-tight block">
                  {pad(timeLeft.hours)}
                </span>
                <span className="text-[8px] font-bold text-neutral-500 uppercase tracking-wider mt-0.5 block">
                  HRS
                </span>
              </div>
              <span className="text-white font-black text-sm pb-1 leading-none select-none">:</span>
              <div className="flex-1 bg-white text-neutral-900 rounded-lg py-1.5 px-1 shadow-md flex flex-col items-center justify-center text-center">
                <span className="text-base sm:text-lg font-black leading-none tracking-tight block">
                  {pad(timeLeft.minutes)}
                </span>
                <span className="text-[8px] font-bold text-neutral-500 uppercase tracking-wider mt-0.5 block">
                  MIN
                </span>
              </div>
              <span className="text-white font-black text-sm pb-1 leading-none select-none">:</span>
              <div className="flex-1 bg-white text-neutral-900 rounded-lg py-1.5 px-1 shadow-md flex flex-col items-center justify-center text-center">
                <span className="text-base sm:text-lg font-black leading-none tracking-tight block">
                  {pad(timeLeft.seconds)}
                </span>
                <span className="text-[8px] font-bold text-neutral-500 uppercase tracking-wider mt-0.5 block">
                  SEG
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </Link>
  );
}
