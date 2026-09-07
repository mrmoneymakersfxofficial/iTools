"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

interface MainCategoriesSectionProps {
  categories?: any[];
  dealTiles?: any[];
}

export function MainCategoriesSection({ categories, dealTiles }: MainCategoriesSectionProps) {
  // Countdown timer for Flash Sale "Duo Chambeador"
  const [timeLeft, setTimeLeft] = useState({ hours: 12, minutes: 29, seconds: 10 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 12, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const pad = (n: number) => n.toString().padStart(2, "0");

  return (
    <section className="py-4 md:py-6" data-section="Categorías Principales">
      <div className="mx-auto max-w-[1440px] px-3 sm:px-4 lg:px-6">
        {/* Section Title */}
        <div className="flex items-center gap-2 mb-3">
          <span className="text-[#E60000] font-black text-lg tracking-tighter">▶▶</span>
          <h2 className="text-base sm:text-lg font-black text-[#1A1A1A] dark:text-white uppercase tracking-wider">
            CATEGORIAS PRINCIPALES
          </h2>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Card 1: Flash Sale DUO CHAMBEADOR DEL TIO CHENG */}
          <div className="relative rounded-xl overflow-hidden shadow-sm bg-gradient-to-br from-[#0056D2] via-[#0047AB] to-[#002D72] p-4 flex flex-col justify-between min-h-[260px] text-white border border-blue-400/20">
            <div>
              <div className="inline-block bg-[#E60000] text-white text-[11px] font-black px-2.5 py-0.5 rounded uppercase tracking-wider mb-2">
                DUO
              </div>
              <h3 className="font-black text-2xl leading-none uppercase tracking-tight text-white mb-1">
                % CHAMBEADOR %
              </h3>
              <p className="text-xs font-bold uppercase tracking-wide text-blue-200">
                DEL TIO CHENG
              </p>
            </div>

            {/* Countdown timer */}
            <div className="mt-4 pt-3 border-t border-white/20">
              <div className="flex items-center justify-center gap-2 text-center">
                <div className="bg-white text-[#111] rounded-lg px-2.5 py-1.5 shadow min-w-[50px]">
                  <span className="text-lg font-black leading-none block">{pad(timeLeft.hours)}</span>
                  <span className="text-[9px] font-bold text-gray-500 uppercase">Hrs</span>
                </div>
                <span className="text-white font-black text-lg">:</span>
                <div className="bg-white text-[#111] rounded-lg px-2.5 py-1.5 shadow min-w-[50px]">
                  <span className="text-lg font-black leading-none block">{pad(timeLeft.minutes)}</span>
                  <span className="text-[9px] font-bold text-gray-500 uppercase">Min</span>
                </div>
                <span className="text-white font-black text-lg">:</span>
                <div className="bg-white text-[#111] rounded-lg px-2.5 py-1.5 shadow min-w-[50px]">
                  <span className="text-lg font-black leading-none block">{pad(timeLeft.seconds)}</span>
                  <span className="text-[9px] font-bold text-gray-500 uppercase">Seg</span>
                </div>
              </div>
              <Link
                href="/marca/dongcheng"
                className="mt-3 block w-full text-center bg-[#FFCC00] hover:bg-[#E6B800] text-[#111] font-black text-xs uppercase py-2 rounded-lg transition-colors shadow"
              >
                Ver Oferta Especial
              </Link>
            </div>
          </div>

          {/* Cards 2, 3, 4: DongCheng Combos */}
          {[1, 2, 3].map((idx) => (
            <Link
              key={idx}
              href="/marca/dongcheng"
              className="group relative rounded-xl overflow-hidden shadow-sm border border-[#E0E0E0] dark:border-[#333] transition-transform duration-300 hover:scale-[1.01] bg-[#0047AB]"
            >
              <div className="relative w-full h-[260px]">
                <img
                  src="/banners/sections/dongcheng-combo.webp"
                  alt={`Combo DongCheng ${idx}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 bg-[#E60000] text-white font-black text-[11px] px-2 py-0.5 rounded shadow">
                  S/ 899.00
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
