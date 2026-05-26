"use client";

import { useEffect, useState } from "react";

export function CRTEffect() {
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    // Check local storage on mount (client-side only)
    const stored = localStorage.getItem("crt-mode");
    if (stored === "true") {
      setIsActive(true);
      document.documentElement.classList.add("crt-screen");
    }

    const handleToggle = () => {
      setIsActive((prev) => {
        const next = !prev;
        localStorage.setItem("crt-mode", String(next));
        if (next) {
          document.documentElement.classList.add("crt-screen");
        } else {
          document.documentElement.classList.remove("crt-screen");
        }
        return next;
      });
    };

    window.addEventListener("toggle-crt", handleToggle);

    return () => {
      window.removeEventListener("toggle-crt", handleToggle);
    };
  }, []);

  if (!isActive) return null;

  return <div className="crt-scanline" aria-hidden="true" />;
}
