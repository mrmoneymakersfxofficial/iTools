"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getSanityAttr } from "@/lib/sanity/visual-attributes";

interface CountdownTile {
  _id?: string;
  title?: string;
  subtitle?: string;
  href?: string;
  countdownEnabled?: boolean;
  countdownEnd?: string;
  image?: { asset?: { url?: string } };
  imageMobile?: { asset?: { url?: string } };
}

interface FlashSaleCountdownCardProps {
  tile?: CountdownTile | null;
}

function calcTimeLeft(countdownEnd?: string) {
  if (countdownEnd) {
    const diff = new Date(countdownEnd).getTime() - Date.now();
    if (diff > 0) {
      return {
        hours: Math.floor(diff / (1000 * 60 * 60)),
        minutes: Math.floor((diff / 1000 / 60) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      };
    }
  }
  return { hours: 12, minutes: 59, seconds: 41 };
}

export function FlashSaleCountdownCard({ tile }: FlashSaleCountdownCardProps) {
  const [timeLeft, setTimeLeft] = useState(() => calcTimeLeft(tile?.countdownEnd));

  useEffect(() => {
    setTimeLeft(calcTimeLeft(tile?.countdownEnd));
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
        return { hours: 12, minutes: 59, seconds: 41 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [tile?.countdownEnd]);

  const pad = (n: number) => n.toString().padStart(2, "0");
  const isCountdownEnabled = tile?.countdownEnabled !== false;

  const rawTitle = (tile?.title || "").trim();
  const displayTitle = !rawTitle || rawTitle.toLowerCase() === "chambeador" ? "PROMOS EXPRESS" : rawTitle.toUpperCase();
  const titleWords = displayTitle.split(/\s+/);
  const leadText = titleWords.length > 1 ? titleWords.slice(0, -1).join(" ") : displayTitle;
  const highlightWord = titleWords.length > 1 ? titleWords[titleWords.length - 1] : "";

  const rawSubtitle = (tile?.subtitle || "").trim();
  const displaySubtitle =
    !rawSubtitle || rawSubtitle.toUpperCase() === "DEL TIO CHENG"
      ? "¡COMPRA AHORA QUE SE AGOTA EL TIEMPO!"
      : rawSubtitle.toUpperCase();

  const sanityAttr = getSanityAttr(tile?._id || "deal-tile-duo-countdown", "dealTile", "countdownEnd");

  return (
    <Link
      href={tile?.href || "/categoria/combos"}
      {...sanityAttr}
      className="group relative block w-full rounded-2xl overflow-hidden transition-all duration-300 hover:scale-[1.01] hover:shadow-lg shadow-sm bg-[#004FD6]"
    >
      <div className="relative w-full px-3.5 py-4 sm:py-4 flex flex-col items-center justify-center text-center bg-gradient-to-b from-[#0059E8] to-[#0044BD]">
        {/* Header: PROMOS [EXPRESS] */}
        <div className="flex items-center justify-center gap-1.5 flex-wrap mb-1">
          <span className="text-white font-black text-xl sm:text-[22px] leading-none tracking-tight uppercase">
            {leadText}
          </span>
          {highlightWord && (
            <span className="bg-[#E60000] text-white font-black text-xl sm:text-[22px] leading-none px-1.5 py-0.5 rounded-[3px] tracking-tight uppercase">
              {highlightWord}
            </span>
          )}
        </div>

        {/* Subtitle */}
        <p className="text-white/95 text-[9.5px] sm:text-[10.5px] font-extrabold uppercase tracking-wide mb-3 leading-tight">
          {displaySubtitle}
        </p>

        {/* Countdown Boxes matching Web & Mobile Reference (with white colons) */}
        {isCountdownEnabled && (
          <div className="flex items-center justify-center gap-1.5 w-full max-w-[280px] mx-auto">
            <div className="flex-1 bg-white text-neutral-900 rounded-xl py-2 px-1 shadow-md flex flex-col items-center justify-center border border-black/5">
              <span className="text-xl sm:text-[22px] font-black leading-none tracking-tight tabular-nums text-neutral-900">
                {pad(timeLeft.hours)}
              </span>
              <span className="text-[8.5px] sm:text-[9px] font-bold text-neutral-500 uppercase tracking-wider mt-1">
                HRS
              </span>
            </div>

            <span className="text-white font-black text-lg sm:text-xl leading-none select-none pb-1">:</span>

            <div className="flex-1 bg-white text-neutral-900 rounded-xl py-2 px-1 shadow-md flex flex-col items-center justify-center border border-black/5">
              <span className="text-xl sm:text-[22px] font-black leading-none tracking-tight tabular-nums text-neutral-900">
                {pad(timeLeft.minutes)}
              </span>
              <span className="text-[8.5px] sm:text-[9px] font-bold text-neutral-500 uppercase tracking-wider mt-1">
                MIN
              </span>
            </div>

            <span className="text-white font-black text-lg sm:text-xl leading-none select-none pb-1">:</span>

            <div className="flex-1 bg-white text-neutral-900 rounded-xl py-2 px-1 shadow-md flex flex-col items-center justify-center border border-black/5">
              <span className="text-xl sm:text-[22px] font-black leading-none tracking-tight tabular-nums text-neutral-900">
                {pad(timeLeft.seconds)}
              </span>
              <span className="text-[8.5px] sm:text-[9px] font-bold text-neutral-500 uppercase tracking-wider mt-1">
                SEG
              </span>
            </div>
          </div>
        )}
      </div>
    </Link>
  );
}
