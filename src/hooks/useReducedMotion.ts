"use client";

import { useEffect, useState } from "react";

export function useReducedMotion(): boolean {
  // Initialize to false (SSR-safe — window is not available during server render).
  // The effect immediately reads the real value on the client after hydration.
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");

    // Sync with real OS value after hydration
    setPrefersReducedMotion(mql.matches);

    const handleChange = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };

    mql.addEventListener("change", handleChange);
    return () => mql.removeEventListener("change", handleChange);
  }, []);

  return prefersReducedMotion;
}
