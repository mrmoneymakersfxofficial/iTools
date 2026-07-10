"use client";

import { useState, useEffect } from "react";

interface CountdownTimerProps {
  targetDate: string;
  message?: string;
  style?: "modern" | "minimal" | "bold";
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function calcTimeLeft(target: string): TimeLeft {
  const diff = new Date(target).getTime() - Date.now();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

export function CountdownTimer({
  targetDate,
  message,
  style = "modern",
}: CountdownTimerProps) {
  const [time, setTime] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    setTime(calcTimeLeft(targetDate));
    const id = setInterval(() => setTime(calcTimeLeft(targetDate)), 1000);
    return () => clearInterval(id);
  }, [targetDate]);

  const pad = (n: number) => String(n).padStart(2, "0");

  const isBold = style === "bold";
  const isMinimal = style === "minimal";

  const units = [
    { label: "d\u00edas", value: time.days },
    { label: "horas", value: time.hours },
    { label: "min", value: time.minutes },
    { label: "seg", value: time.seconds },
  ];

  if (isMinimal) {
    return (
      <div className="flex items-center gap-1.5 text-white/90 text-xs font-mono">
        {message && <span className="text-white/60 mr-1">{message}</span>}
        {units.map((u, i) => (
          <span key={u.label} className="flex items-center">
            <span className="font-bold text-white">{pad(u.value)}</span>
            <span className="text-white/50 text-[10px] ml-0.5">{u.label}</span>
            {i < units.length - 1 && (
              <span className="text-white/30 mx-1">:</span>
            )}
          </span>
        ))}
      </div>
    );
  }

  /* modern / bold */
  return (
    <div className="flex flex-col items-center gap-1.5">
      {message && (
        <span className={`uppercase tracking-[0.12em] ${isBold ? "text-xs font-bold" : "text-[10px] font-semibold"} text-white/70`}>
          {message}
        </span>
      )}
      <div className="flex items-center gap-1.5 sm:gap-2">
        {units.map((u, i) => (
          <div key={u.label} className="flex items-center">
            <div
              className={`flex flex-col items-center justify-center rounded-lg ${
                isBold
                  ? "bg-white/20 backdrop-blur-sm px-3 py-2 sm:px-4 sm:py-2.5"
                  : "bg-white/10 backdrop-blur-sm px-2.5 py-1.5 sm:px-3 sm:py-2"
              }`}
            >
              <span
                className={`font-mono leading-none ${
                  isBold
                    ? "text-xl sm:text-2xl lg:text-3xl font-black text-white"
                    : "text-lg sm:text-xl lg:text-2xl font-bold text-white"
                }`}
              >
                {pad(u.value)}
              </span>
              <span className="text-[9px] sm:text-[10px] text-white/50 uppercase tracking-wider mt-0.5">
                {u.label}
              </span>
            </div>
            {i < units.length - 1 && (
              <span className="text-white/40 font-bold text-lg mx-0.5 sm:mx-1">:</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}