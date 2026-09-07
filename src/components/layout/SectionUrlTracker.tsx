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

  if (!activeSection) return null;

  return (
    <aside
      aria-label="Identificador de sección"
      className="fixed bottom-16 left-4 z-40 hidden md:flex items-center gap-2 bg-black/85 backdrop-blur-md text-white px-3 py-1.5 rounded-full text-xs font-semibold shadow-lg border border-white/20 transition-all duration-200 pointer-events-auto"
    >
      <span className="h-2 w-2 rounded-full bg-[#E60000] animate-pulse" />
      <span className="text-gray-300 font-medium truncate max-w-[200px]">
        {activeSection.name}
      </span>
      <span className="text-[#0056D2] font-mono text-[11px] bg-white/10 px-1.5 py-0.5 rounded">
        #{activeSection.id}
      </span>
      {isCmsUser && (
        <Link
          href={`/cms/structure/homepage/${activeSection.docType || "homeSettings"}`}
          target="_blank"
          className="flex items-center gap-1 bg-[#0056D2] hover:bg-[#0047AB] text-white px-2 py-0.5 rounded-full text-[10px] font-bold uppercase transition-colors"
          title="Editar en CMS Sanity"
        >
          <Edit3 className="h-3 w-3" />
          CMS
        </Link>
      )}
    </aside>
  );
}
