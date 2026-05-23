"use client";

import { useEffect, useRef } from "react";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";

export function KeyboardShortcutsHelp() {
  const { showHelp, closeHelp } = useKeyboardShortcuts();
  const dialogRef = useRef<HTMLDivElement>(null);

  // Focus the dialog container when it opens so Escape works
  useEffect(() => {
    if (showHelp && dialogRef.current) {
      dialogRef.current.focus();
    }
  }, [showHelp]);

  if (!showHelp) return null;

  return (
    <div className="hidden lg:block">
      {/* Backdrop */}
      <div
        aria-hidden="true"
        className="fixed inset-0 bg-black/60"
        style={{ zIndex: 100 }}
        onClick={closeHelp}
      />
      {/* Dialog */}
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label="Keyboard shortcuts"
        tabIndex={-1}
        className="bg-bg-secondary border-border-subtle fixed top-1/2 left-1/2 w-[90vw] max-w-120 -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-xl border outline-none"
        style={{
          zIndex: 101,
          boxShadow:
            "0 24px 64px rgba(0,0,0,0.6), 0 0 0 1px var(--border-subtle)",
        }}
      >
        {/* Header */}
        <div className="border-border-subtle border-b px-6 py-4">
          <p className="text-text-tertiary text-small font-mono">
            {"// keyboard shortcuts"}
          </p>
        </div>
        {/* Shortcuts table */}
        <div className="px-6 py-4">
          <table className="w-full">
            <tbody className="divide-border-subtle divide-y">
              <tr>
                <td
                  className="py-space-3 text-text-muted font-mono text-xs"
                  colSpan={2}
                >
                  Navigation
                </td>
              </tr>
              <ShortcutRow keys={["G", "P"]} description="Go to Projects" />
              <ShortcutRow keys={["G", "A"]} description="Go to About" />
              <ShortcutRow keys={["G", "C"]} description="Go to Contact" />
              <tr>
                <td
                  className="pt-space-4 pb-space-2 text-text-muted font-mono text-xs"
                  colSpan={2}
                >
                  Tools
                </td>
              </tr>
              <ShortcutRow keys={["⌘K"]} description="Open command palette" />
              <ShortcutRow
                keys={["?"]}
                description="Toggle this help overlay"
              />
            </tbody>
          </table>
        </div>
        {/* Footer */}
        <div className="border-border-subtle border-t px-6 py-3">
          <p className="text-text-muted font-mono text-xs">Esc to close</p>
        </div>
      </div>
    </div>
  );
}

function ShortcutRow({
  keys,
  description,
}: {
  keys: string[];
  description: string;
}) {
  return (
    <tr>
      <td className="py-space-2 pr-space-6 w-32">
        <div className="gap-space-2 flex items-center">
          {keys.map((key, i) => (
            <span
              key={i}
              className="bg-bg-tertiary border-border-active text-text-secondary px-space-2 py-space-1 inline-block rounded border font-mono text-xs"
            >
              {key}
            </span>
          ))}
        </div>
      </td>
      <td className="py-space-2 text-text-secondary text-small font-mono">
        {description}
      </td>
    </tr>
  );
}
