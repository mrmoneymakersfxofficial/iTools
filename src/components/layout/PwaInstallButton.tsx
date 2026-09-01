"use client";

import { useState, useEffect } from "react";
import { Download } from "lucide-react";
import { cn } from "@/lib/utils";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed', platform: string }>;
}

export function PwaInstallButton({ className }: { className?: string }) {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstallable, setIsInstallable] = useState(false);

  useEffect(() => {
    // Check if running as installed standalone app
    const isStandalone = 
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as any).standalone === true ||
      document.referrer.includes("android-app://");

    if (isStandalone) {
      setIsInstallable(false);
      return;
    }

    // If not in standalone mode, allow installing
    setIsInstallable(true);

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setIsInstallable(true);
    };

    const handleAppInstalled = () => {
      setIsInstallable(false);
      setDeferredPrompt(null);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt) {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === "accepted") {
        setIsInstallable(false);
      }
      setDeferredPrompt(null);
    } else {
      // Fallback instructions for browsers that don't support beforeinstallprompt or on iOS
      alert("Para instalar la aplicación:\n1. Pulsa en los tres puntos ⋮ o el botón Compartir de tu navegador.\n2. Selecciona 'Instalar aplicación' o 'Agregar a pantalla de inicio'.");
    }
  };

  if (!isInstallable) return null;

  return (
    <button 
      onClick={handleInstall}
      className={cn("flex items-center gap-2 bg-[#D1001C] text-white px-4 py-2.5 rounded-xl font-bold hover:bg-red-700 transition-colors shadow-md", className)}
    >
      <Download className="w-4 h-4" />
      <span>Instalar App</span>
    </button>
  );
}
