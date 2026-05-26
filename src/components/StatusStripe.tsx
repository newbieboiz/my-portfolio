"use client";

import type { SiteConfig } from "@/types/site";

export function StatusStripe({ config }: { config: SiteConfig }) {
  const isAvailable = config.owner.isAvailable;
  const statusText = isAvailable
    ? config.owner.availabilityText
    : "System operational — consultations closed";

  const handleToggleMenu = () => {
    window.dispatchEvent(new CustomEvent("toggle-command-palette"));
  };

  return (
    <div
      aria-label="Availability status"
      className="bg-bg-secondary border-border-subtle px-space-4 py-space-2 flex items-center justify-between border-b font-mono text-xs"
    >
      <div className="gap-space-2 flex items-center">
        <span className="relative flex h-2 w-2 items-center justify-center">
          {isAvailable ? (
            <>
              <span className="bg-accent absolute inline-flex h-full w-full animate-ping rounded-full opacity-75 motion-reduce:hidden" />
              <span className="bg-accent relative inline-flex h-1.5 w-1.5 rounded-full" />
            </>
          ) : (
            <span className="bg-text-muted inline-block h-1.5 w-1.5 rounded-full" />
          )}
        </span>
        <span className="text-text-secondary font-mono select-none">
          {statusText}
        </span>
      </div>

      <button
        onClick={handleToggleMenu}
        aria-label="Toggle command palette menu"
        className="text-text-secondary hover:text-accent duration-micro focus-visible:ring-accent cursor-pointer rounded px-1 font-mono text-xs transition-colors select-none focus-visible:ring-1 focus-visible:outline-none"
      >
        <span className="hidden sm:inline">⌘K to navigate</span>
        <span className="sm:hidden">Menu ⌘K</span>
      </button>
    </div>
  );
}
