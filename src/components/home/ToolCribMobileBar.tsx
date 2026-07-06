"use client";

import Link from "next/link";
import { Wrench, ChevronRight } from "lucide-react";

/**
 * Mobile: Thin horizontal "Tool Crib of the North" banner card.
 * Matches Acme's mobile Tool Crib bar (image 2).
 * Clickable to products page.
 */
export function ToolCribMobileBar() {
  return (
    <Link
      href="/categoria/herramientas-electricas"
      className="block mx-2.5 my-2.5 bg-white dark:bg-[#111111] border border-[#E0E0E0] dark:border-[#333] rounded-lg overflow-hidden hover:shadow-md transition-shadow"
      data-section="Tool Crib Móvil"
    >
      <div className="flex items-center justify-between px-4 py-3">
        {/* Left: icon + text */}
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg bg-[#F5F6F8] dark:bg-[#1a1a1a] flex items-center justify-center">
            <Wrench className="h-5 w-5 text-[#555]" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[#1A1A1A] dark:text-white uppercase tracking-wide leading-tight">
              Tool Crib
            </h3>
            <p className="text-[10px] text-[#999] dark:text-gray-400 uppercase tracking-wider">
              of the North
            </p>
          </div>
        </div>

        {/* Right: arrow */}
        <ChevronRight className="h-5 w-5 text-[#999] dark:text-gray-400" />
      </div>
    </Link>
  );
}