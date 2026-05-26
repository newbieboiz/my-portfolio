"use client";

import { useState, useEffect } from "react";

export function useCommandPalette() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handleToggle = () => {
      setOpen((prev) => !prev);
    };

    const down = (e: KeyboardEvent) => {
      // Suppress when focus is inside a text input
      const target = e.target as HTMLElement;
      const isTextInput =
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable;

      if (isTextInput && e.key !== "k") return; // Allow ⌘K even from inputs to open palette

      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    };

    document.addEventListener("keydown", down);
    window.addEventListener("toggle-command-palette", handleToggle);
    return () => {
      document.removeEventListener("keydown", down);
      window.removeEventListener("toggle-command-palette", handleToggle);
    };
  }, []);

  return {
    open,
    setOpen,
    close: () => setOpen(false),
  };
}
