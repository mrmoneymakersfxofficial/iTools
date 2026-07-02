"use client";

import { useEffect, useRef, useCallback } from "react";

/**
 * Converts a section title to a URL-friendly slug.
 * e.g. "Ofertas del Día" → "ofertas-del-dia"
 */
function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // remove accents
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

interface SectionConfig {
  /** The human-readable title (used for URL slug and fallback ID) */
  title: string;
  /** Override the auto-generated ID. If omitted, slugify(title) is used. */
  id?: string;
}

/**
 * useSectionDeepLinking
 *
 * - Observes all `[data-section]` elements via IntersectionObserver.
 * - When a section becomes the most visible, updates the URL via
 *   `history.replaceState` (no reload, no scroll jump).
 * - On mount, if the URL contains a hash, smooth-scrolls to that section.
 * - Easy to extend: just add `data-section="Mi Título"` to any <section>.
 */
export function useSectionDeepLinking() {
  const isScrollingRef = useRef(false);

  const scrollToHash = useCallback(() => {
    const hash = window.location.hash.slice(1);
    if (!hash) return;
    // Small delay to let the DOM paint
    requestAnimationFrame(() => {
      const el = document.getElementById(hash);
      if (el) {
        isScrollingRef.current = true;
        const offset = 120; // header height
        const top = el.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: "smooth" });
        // Reset flag after scroll animation ends
        setTimeout(() => {
          isScrollingRef.current = false;
        }, 800);
      }
    });
  }, []);

  useEffect(() => {
    scrollToHash();
  }, [scrollToHash]);

  useEffect(() => {
    const sections = document.querySelectorAll<HTMLElement>("[data-section]");
    if (sections.length === 0) return;

    // Ensure each section has an id derived from its data-section attribute
    sections.forEach((section) => {
      const rawTitle = section.getAttribute("data-section") || "";
      if (!section.id) {
        section.id = slugify(rawTitle);
      }
    });

    // Build the observer
    const observer = new IntersectionObserver(
      (entries) => {
        if (isScrollingRef.current) return;

        // Find the entry with the highest intersection ratio that is intersecting
        let bestEntry: IntersectionObserverEntry | null = null;
        for (const entry of entries) {
          if (entry.isIntersecting) {
            if (!bestEntry || entry.intersectionRatio > bestEntry.intersectionRatio) {
              bestEntry = entry;
            }
          }
        }

        if (bestEntry) {
          const sectionId = bestEntry.target.id;
          const currentHash = window.location.hash.slice(1);
          if (sectionId && sectionId !== currentHash) {
            const url = `${window.location.pathname}#${sectionId}`;
            window.history.replaceState(null, "", url);
            // Dispatch a custom event so other components can react
            window.dispatchEvent(
              new CustomEvent("sectionchange", { detail: { sectionId } })
            );
          }
        }
      },
      {
        rootMargin: "-20% 0px -70% 0px",
        threshold: [0, 0.25, 0.5, 0.75, 1],
      }
    );

    sections.forEach((s) => observer.observe(s));

    // Listen for hash changes (back/forward)
    const handleHashChange = () => {
      scrollToHash();
    };
    window.addEventListener("hashchange", handleHashChange);

    return () => {
      observer.disconnect();
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, [scrollToHash]);
}

/** Utility: generate the section ID from a title (for use in JSX) */
export function sectionId(title: string): string {
  return slugify(title);
}