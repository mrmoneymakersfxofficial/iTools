"use client";

import { useSectionDeepLinking } from "@/hooks/useSectionDeepLinking";
import { ReadingProgressBar } from "@/components/ui/ReadingProgressBar";

export function ClientLayoutEffects() {
  useSectionDeepLinking();
  return (
    <>
      <ReadingProgressBar />
    </>
  );
}