"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";
import { cn } from "@/lib/utils";

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <div
        className={cn(
          "relative h-8 w-14 rounded-full bg-muted animate-pulse",
          className
        )}
      />
    );
  }

  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={cn(
        "relative flex items-center h-8 w-14 rounded-full p-1 transition-all duration-500 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-itools-blue/50",
        isDark
          ? "bg-gradient-to-r from-[#1a1a2e] to-[#2d2d44] shadow-[0_0_12px_rgba(99,102,241,0.3)]"
          : "bg-gradient-to-r from-amber-300 to-orange-400 shadow-[0_0_12px_rgba(251,191,36,0.3)]",
        className
      )}
      aria-label={isDark ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
    >
      {/* Track icons (static, behind the thumb) */}
      <span className="absolute left-2 top-1/2 -translate-y-1/2 z-0">
        <Sun
          className={cn(
            "h-3.5 w-3.5 transition-opacity duration-300",
            isDark ? "opacity-40" : "opacity-90"
          )}
          strokeWidth={2}
        />
      </span>
      <span className="absolute right-2 top-1/2 -translate-y-1/2 z-0">
        <Moon
          className={cn(
            "h-3.5 w-3.5 transition-opacity duration-300",
            isDark ? "opacity-90" : "opacity-40"
          )}
          strokeWidth={2}
        />
      </span>

      {/* Sliding thumb */}
      <span
        className={cn(
          "relative z-10 flex items-center justify-center h-6 w-6 rounded-full shadow-lg transition-all duration-500 ease-in-out",
          isDark
            ? "translate-x-6 bg-gradient-to-br from-indigo-400 to-purple-500"
            : "translate-x-0 bg-gradient-to-br from-yellow-300 to-amber-400"
        )}
      >
        {isDark ? (
          <Moon className="h-3.5 w-3.5 text-white" strokeWidth={2.5} />
        ) : (
          <Sun className="h-3.5 w-3.5 text-white" strokeWidth={2.5} />
        )}
      </span>
    </button>
  );
}