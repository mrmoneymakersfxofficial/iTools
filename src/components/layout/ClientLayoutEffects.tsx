"use client";

import { useEffect } from "react";
import { useSectionDeepLinking } from "@/hooks/useSectionDeepLinking";
import { ReadingProgressBar } from "@/components/ui/ReadingProgressBar";
import { ParticleTrail } from "@/components/ui/ParticleTrail";

export function ClientLayoutEffects() {
  useSectionDeepLinking();

  useEffect(() => {
    const header = document.querySelector("header");
    if (!header) return;
    const update = () => {
      const h = header.getBoundingClientRect().height;
      document.documentElement.style.setProperty("--header-h", `${h}px`);
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(header);
    return () => ro.disconnect();
  }, []);

  return (
    <>
      <ReadingProgressBar />
      <ParticleTrail />
    </>
  );
}
