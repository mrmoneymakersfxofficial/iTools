"use client";

import { useEffect, useRef, useState, useCallback } from "react";

/**
 * ReadingProgressBar — Ultra Pro Immersive
 *
 * Visible on ALL pages and ALL devices (mobile, tablet, desktop).
 * Multi-layered glow effect with animated gradient.
 * Hides when progress is 0, smoothly fades in on scroll.
 */
export function ReadingProgressBar() {
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);
  const rafRef = useRef<number>(0);
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleScroll = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const pct = docHeight > 0 ? Math.min((scrollTop / docHeight) * 100, 100) : 0;
      setProgress(pct);

      // Show bar as soon as user starts scrolling (even 1px)
      if (pct > 0.1) {
        setVisible(true);
        // Reset hide timer
        if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
      }
    });
  }, []);

  // Show bar briefly on route changes then hide if no scroll
  useEffect(() => {
    setVisible(true);
    handleScroll();
    hideTimerRef.current = setTimeout(() => {
      if (progress <= 0.1) setVisible(false);
    }, 2000);
    return () => {
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    };
  }, [handleScroll, progress]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    // Also listen on touchmove for mobile
    window.addEventListener("touchmove", handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("touchmove", handleScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    };
  }, [handleScroll]);

  return (
    <div
      className={`reading-progress-bar ${visible ? "rpb-visible" : "rpb-hidden"}`}
      role="progressbar"
      aria-valuenow={Math.round(progress)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label="Progreso de lectura"
    >
      {/* Glow underlay */}
      <div
        className="reading-progress-bar__glow"
        style={{ width: `${Math.max(progress, 0)}%` }}
      />
      {/* Main fill */}
      <div
        className="reading-progress-bar__fill"
        style={{ width: `${progress}%` }}
      />
      {/* Bright core line */}
      <div
        className="reading-progress-bar__core"
        style={{ width: `${progress}%` }}
      />
      {/* Tip dot at the leading edge */}
      {progress > 0.5 && (
        <div
          className="reading-progress-bar__tip"
          style={{ left: `${progress}%` }}
        />
      )}
    </div>
  );
}