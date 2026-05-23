"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

export function useKeyboardShortcuts() {
  const router = useRouter();
  const [showHelp, setShowHelp] = useState(false);
  const pendingGRef = useRef(false);
  const pendingGTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const closeHelp = useCallback(() => setShowHelp(false), []);

  const clearPendingG = useCallback(() => {
    pendingGRef.current = false;
    if (pendingGTimerRef.current !== null) {
      clearTimeout(pendingGTimerRef.current);
      pendingGTimerRef.current = null;
    }
  }, []);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      // Suppress when focus is inside a text input or contenteditable
      const target = e.target as HTMLElement;
      const isTextInput =
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable;

      if (isTextInput) return;

      // Escape always closes the help overlay (handled BEFORE dialogOpen check)
      if (e.key === "Escape") {
        setShowHelp((prev) => {
          if (prev) {
            e.preventDefault();
            return false;
          }
          return prev;
        });
        clearPendingG();
        // Don't return early — let Escape propagate to close other dialogs too
        // (Radix Dialog handles its own Escape for the command palette)
        return;
      }

      // Suppress G+P/G+A/G+C and ? when any dialog is open (command palette or help overlay)
      const dialogOpen = !!document.querySelector('[role="dialog"]');
      if (dialogOpen) return;

      // ? key — toggle help overlay
      if (e.key === "?") {
        e.preventDefault();
        setShowHelp((prev) => !prev);
        clearPendingG();
        return;
      }

      // G chord initiation
      if (e.key === "g" && !e.metaKey && !e.ctrlKey && !e.altKey) {
        e.preventDefault();
        clearPendingG();
        pendingGRef.current = true;
        // Auto-clear after 1000ms if second key not pressed
        pendingGTimerRef.current = setTimeout(() => {
          pendingGRef.current = false;
          pendingGTimerRef.current = null;
        }, 1000);
        return;
      }

      // G+P/A/C chord completion
      if (pendingGRef.current) {
        clearPendingG();
        if (e.key === "p") {
          e.preventDefault();
          router.push("/projects");
        } else if (e.key === "a") {
          e.preventDefault();
          router.push("/about");
        } else if (e.key === "c") {
          e.preventDefault();
          router.push("/contact");
        }
        // Any other key cancels the chord without navigation
        return;
      }
    };

    document.addEventListener("keydown", down);
    return () => {
      document.removeEventListener("keydown", down);
      clearPendingG();
    };
  }, [router, clearPendingG]);

  return { showHelp, setShowHelp, closeHelp };
}
