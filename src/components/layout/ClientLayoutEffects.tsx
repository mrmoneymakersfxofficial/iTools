"use client";

import { useSectionDeepLinking } from "@/hooks/useSectionDeepLinking";
import { ReadingProgressBar } from "@/components/ui/ReadingProgressBar";
import { ParticleTrail } from "@/components/ui/ParticleTrail";

export function ClientLayoutEffects() {
  useSectionDeepLinking();
  return (
    <>
      <ReadingProgressBar />
      <ParticleTrail />
    </>
  );
}