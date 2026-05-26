import Link from "next/link";
import type { SiteConfig } from "@/types/site";
import { NavLinks } from "@/components/NavLinks";

export function NavBar({ config }: { config: SiteConfig }) {
  const focusRingClasses =
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg-primary rounded";

  return (
    <nav
      aria-label="Main navigation"
      className="bg-bg-primary/95 border-border-subtle sticky top-0 z-50 border-b backdrop-blur-sm"
    >
      <div className="max-w-content px-space-4 md:px-space-8 mx-auto flex h-16 items-center justify-between">
        <Link
          href="/"
          className={`text-small font-mono font-bold ${focusRingClasses}`}
        >
          <span className="text-text-primary">BaoBao</span>
        </Link>
        <NavLinks navigation={config.navigation} />
      </div>
    </nav>
  );
}
