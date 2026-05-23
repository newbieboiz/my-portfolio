import type { SiteConfig } from "@/types/site";

export function StatusStripe({ config }: { config: SiteConfig }) {
  if (!config.owner.isAvailable) {
    return null;
  }

  return (
    <div
      aria-label="Availability status"
      className="bg-bg-secondary border-border-subtle px-space-4 py-space-2 flex items-center justify-between border-b font-mono text-xs"
    >
      <div className="gap-space-2 flex items-center">
        <span aria-hidden="true" className="text-accent">
          ●
        </span>
        <span className="text-text-secondary">
          {config.owner.availabilityText}
        </span>
      </div>
      <div className="gap-space-2 text-text-secondary hidden items-center lg:flex">
        ⌘K to navigate
      </div>
    </div>
  );
}
