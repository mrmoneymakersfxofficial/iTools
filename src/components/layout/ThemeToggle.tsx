"use client";

import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

export function ThemeToggle({ className = "" }: { className?: string }) {
  const [dark, setDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem("itools-theme");
    if (stored === "dark") {
      setDark(true);
      document.documentElement.classList.add("dark");
    } else if (stored === "light") {
      setDark(false);
      document.documentElement.classList.remove("dark");
    } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      setDark(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggle = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("itools-theme", next ? "dark" : "light");
  };

  if (!mounted) {
    return <div className={`w-8 h-8 ${className}`} />;
  }

  return (
    <button
      onClick={toggle}
      className={`relative w-8 h-8 rounded-lg flex items-center justify-center transition-all active:scale-90 hover:bg-accent ${className}`}
      aria-label={dark ? "Modo claro" : "Modo oscuro"}
      title={dark ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
    >
      <Sun
        className={`h-4 w-4 absolute transition-all duration-300 ${
          dark ? "opacity-0 rotate-90 scale-0" : "opacity-100 rotate-0 scale-100 text-amber-500"
        }`}
      />
      <Moon
        className={`h-4 w-4 absolute transition-all duration-300 ${
          dark ? "opacity-100 rotate-0 scale-100 text-blue-400" : "opacity-0 -rotate-90 scale-0 text-slate-600"
        }`}
      />
    </button>
  );
}