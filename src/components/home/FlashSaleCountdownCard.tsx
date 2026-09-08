"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getSanityAttr } from "@/lib/sanity/visual-attributes";

export function FlashSaleCountdownCard() {
  const [timeLeft, setTimeLeft] = useState({ hours: 12, minutes: 29, seconds: 10 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 12, minutes: 29, seconds: 10 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const pad = (n: number) => n.toString().padStart(2, "0");
  const sanityAttr = getSanityAttr("deal-tile-duo-countdown", "dealTile", "countdownEnd");

  return (
    <Link
      href="/marca/dongcheng"
      {...sanityAttr}
      className="group relative block w-full rounded-xl overflow-hidden shadow-md bg-gradient-to-br from-[#0056D2] via-[#0047AB] to-[#002D72] p-3.5 text-white border border-blue-400/25 transition-all duration-300 hover:scale-[1.01] hover:shadow-lg"
    >
      {/* Top Header */}
      <div className="flex items-start justify-between">
        <div className="inline-block bg-[#E60000] text-white text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-wider shadow-sm">
          DUO
        </div>
      </div>

      <div className="mt-1.5">
        <h3 className="font-black text-lg xl:text-xl leading-none uppercase tracking-tight text-white group-hover:text-yellow-300 transition-colors">
          % CHAMBEADOR %
        </h3>
        <p className="text-[10px] font-bold uppercase tracking-wider text-blue-200 mt-0.5">
          DEL TIO CHENG
        </p>
      </div>

      {/* Countdown timer 3 blocks */}
      <div className="mt-3 pt-2.5 border-t border-white/20">
        <div className="flex items-center justify-center gap-1.5 text-center">
          {/* Hours */}
          <div className="flex-1 bg-white text-[#111] rounded-lg py-1 px-1 shadow-sm">
            <span className="text-base font-black leading-none block font-mono">
              {pad(timeLeft.hours)}
            </span>
            <span className="text-[8px] font-extrabold text-gray-500 uppercase tracking-tight">
              Hrs
            </span>
          </div>

          <span className="text-white font-black text-sm pb-1">:</span>

          {/* Minutes */}
          <div className="flex-1 bg-white text-[#111] rounded-lg py-1 px-1 shadow-sm">
            <span className="text-base font-black leading-none block font-mono">
              {pad(timeLeft.minutes)}
            </span>
            <span className="text-[8px] font-extrabold text-gray-500 uppercase tracking-tight">
              Min
            </span>
          </div>

          <span className="text-white font-black text-sm pb-1">:</span>

          {/* Seconds */}
          <div className="flex-1 bg-white text-[#111] rounded-lg py-1 px-1 shadow-sm">
            <span className="text-base font-black leading-none block font-mono">
              {pad(timeLeft.seconds)}
            </span>
            <span className="text-[8px] font-extrabold text-gray-500 uppercase tracking-tight">
              Seg
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
