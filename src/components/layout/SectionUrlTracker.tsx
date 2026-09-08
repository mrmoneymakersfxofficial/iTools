"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Edit3 } from "lucide-react";

export function SectionUrlTracker() {
  const [activeSection, setActiveSection] = useState<{ id: string; name: string; docType?: string } | null>(null);
  const [isCmsUser, setIsCmsUser] = useState(false);

  useEffect(() => {
    // Detect if inside an iframe or admin/cms preview
    const inIframe = typeof window !== "undefined" && window.self !== window.top;
    const isLocalOrPreview = window.location.hostname === "localhost" || inIframe;
    setIsCmsUser(isLocalOrPreview);

    const sections = Array.from(document.querySelectorAll<HTMLElement>("[data-section]"));
    if (sections.length === 0) return;

    let timeoutId: NodeJS.Timeout;

    const handleIntersect: IntersectionObserverCallback = (entries) => {
      // Find the entry that has the highest intersection ratio
      const visible = entries
        .filter((e) => e.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

      if (visible.length > 0) {
        const target = visible[0].target as HTMLElement;
        const id = target.id || target.getAttribute("data-section")?.toLowerCase().replace(/\s+/g, "-") || "";
        const name = target.getAttribute("data-section") || id;
        const docType = target.getAttribute("data-sanity-doc") || "";

        if (id) {
          clearTimeout(timeoutId);
          timeoutId = setTimeout(() => {
            setActiveSection({ id, name, docType });
            if (window.location.hash !== `#${id}`) {
              window.history.replaceState(null, "", `#${id}`);
            }
          }, 150);
        }
      }
    };

    const observer = new IntersectionObserver(handleIntersect, {
      threshold: [0.2, 0.5, 0.8],
      rootMargin: "-80px 0px -20% 0px",
    });

    sections.forEach((sec) => observer.observe(sec));

    // Also update on mousemove/mouseenter over sections
    const handleMouseOver = (e: MouseEvent) => {
      const target = (e.target as HTMLElement)?.closest<HTMLElement>("[data-section]");
      if (target) {
        const id = target.id || target.getAttribute("data-section")?.toLowerCase().replace(/\s+/g, "-") || "";
        const name = target.getAttribute("data-section") || id;
        const docType = target.getAttribute("data-sanity-doc") || "";
        if (id && (!activeSection || activeSection.id !== id)) {
          setActiveSection({ id, name, docType });
          window.history.replaceState(null, "", `#${id}`);
        }
      }
    };

    window.addEventListener("mouseover", handleMouseOver, { passive: true });

    return () => {
      clearTimeout(timeoutId);
      observer.disconnect();
      window.removeEventListener("mouseover", handleMouseOver);
    };
  }, []);

  // Visual badge hidden per user request — URL hash tracking remains active in background
  return null;
}
