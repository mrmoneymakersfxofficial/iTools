"use client";

import { useEffect, useRef, useState } from "react";

/**
 * ReadingProgressBar
 *
 * A thin gradient bar fixed at the very top of the viewport that fills
 * from left to right as the user scrolls down the page.
 * Hidden on the homepage (only shows on sub-pages).
 */
export function ReadingProgressBar() {
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    // Show only on sub-pages, not on the homepage
    const isHome = window.location.pathname === "/";
    setVisible(!isHome);

    const handleScroll = () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        if (docHeight > 0) {
          setProgress(Math.min((scrollTop / docHeight) * 100, 100));
        }
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // initial

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  if (!visible) return null;

  return (
    <div className="reading-progress-bar" role="progressbar" aria-valuenow={Math.round(progress)} aria-valuemin={0} aria-valuemax={100} aria-label="Progreso de lectura">
      <div
        className="reading-progress-bar__fill"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}