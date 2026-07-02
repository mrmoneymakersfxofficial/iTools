"use client";

import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { heroSlides } from "@/lib/data";
import { motion, AnimatePresence } from "framer-motion";

export function HeroSlider() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(0);

  const goTo = useCallback(
    (index: number) => {
      setDirection(index > current ? 1 : -1);
      setCurrent(index);
    },
    [current]
  );

  const next = useCallback(() => {
    setDirection(1);
    setCurrent((prev) => (prev + 1) % heroSlides.length);
  }, []);

  const prev = useCallback(() => {
    setDirection(-1);
    setCurrent(
      (prev) => (prev - 1 + heroSlides.length) % heroSlides.length
    );
  }, []);

  // Auto-play
  useEffect(() => {
    const timer = setInterval(next, 6000);
    return () => clearInterval(timer);
  }, [next]);

  const slide = heroSlides[current];

  const variants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 300 : -300,
      opacity: 0,
    }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({
      x: dir > 0 ? -300 : 300,
      opacity: 0,
    }),
  };

  return (
    <section className="relative w-full overflow-hidden bg-itools-dark" aria-label="Banner principal">
      <div className="relative h-[280px] sm:h-[360px] md:h-[440px] lg:h-[500px]">
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={slide.id}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="absolute inset-0 flex"
          >
            {/* Background gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-itools-dark via-itools-dark/95 to-itools-dark/70 z-10" />

            {/* Decorative pattern */}
            <div className="absolute inset-0 opacity-[0.04] texture-overlay z-10" />

            {/* Red accent line */}
            <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-itools-red z-20" />

            {/* Content */}
            <div className="relative z-20 flex flex-col justify-center h-full px-6 sm:px-10 md:px-16 lg:px-24 max-w-3xl">
              {slide.badge && (
                <span
                  className={`${slide.badgeColor} inline-block self-start px-3 py-1 text-[11px] uppercase tracking-widest text-white rounded-sm mb-4`}
                >
                  {slide.badge}
                </span>
              )}
              <h1 className="font-impact text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-white leading-tight mb-3 md:mb-4">
                {slide.title}
              </h1>
              <p className="text-sm sm:text-base md:text-lg text-white/70 max-w-xl mb-6 md:mb-8 leading-relaxed">
                {slide.subtitle}
              </p>
              <div>
                <Button className="bg-itools-red hover:bg-itools-red-dark text-white font-impact px-6 md:px-8 h-11 md:h-12 text-sm md:text-base tracking-wide transition-colors">
                  {slide.cta}
                </Button>
              </div>
            </div>

            {/* Right decorative elements */}
            <div className="hidden md:flex absolute right-0 top-0 bottom-0 w-1/2 items-center justify-center z-10">
              <div className="relative">
                <div className="w-64 h-64 lg:w-80 lg:h-80 rounded-full border-2 border-white/10" />
                <div className="absolute inset-8 rounded-full border border-itools-blue/30" />
                <div className="absolute inset-16 rounded-full bg-itools-blue/5 flex items-center justify-center">
                  <span className="text-6xl lg:text-7xl text-white/10">
                    M18
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation arrows */}
        <Button
          variant="ghost"
          size="icon"
          onClick={prev}
          className="absolute left-3 top-1/2 -translate-y-1/2 z-30 h-10 w-10 rounded-full bg-black/20 text-white hover:bg-black/40 hover:text-white transition-colors"
          aria-label="Slide anterior"
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={next}
          className="absolute right-3 top-1/2 -translate-y-1/2 z-30 h-10 w-10 rounded-full bg-black/20 text-white hover:bg-black/40 hover:text-white transition-colors"
          aria-label="Slide siguiente"
        >
          <ChevronRight className="h-5 w-5" />
        </Button>

        {/* Dots */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2">
          {heroSlides.map((s, i) => (
            <button
              key={s.id}
              onClick={() => goTo(i)}
              aria-label={`Ir al slide ${i + 1}`}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === current
                  ? "w-8 bg-itools-red"
                  : "w-2 bg-white/40 hover:bg-white/60"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}