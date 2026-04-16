"use client";

import { useEffect, useState } from "react";

export function useCountdown(initialSeconds: number, active: boolean) {
  const [seconds, setSeconds] = useState(initialSeconds);

  useEffect(() => {
    if (!active) {
      return;
    }

    setSeconds(initialSeconds);
  }, [active, initialSeconds]);

  useEffect(() => {
    if (!active || seconds <= 0) {
      return;
    }

    const timer = window.setInterval(() => {
      setSeconds((current) => current - 1);
    }, 1000);

    return () => window.clearInterval(timer);
  }, [active, seconds]);

  const minutes = String(Math.floor(seconds / 60)).padStart(2, "0");
  const remainder = String(seconds % 60).padStart(2, "0");

  return {
    seconds,
    label: `${minutes}:${remainder}`,
    expired: seconds <= 0
  };
}
