import type { SiteConfig } from "@/types/site";

export function Footer({ config }: { config: SiteConfig }) {
  return (
    <footer role="contentinfo" className="mt-auto">
      {/* Desktop VS Code-style status bar */}
      <div className="bg-bg-secondary border-border-subtle hidden h-8 items-center justify-between border-t font-mono text-xs lg:flex">
        <div className="max-w-content px-space-4 md:px-space-8 mx-auto flex w-full items-center justify-between">
          {/* Left: branch, framework, css */}
          <div className="gap-space-4 flex items-center">
            <span className="text-text-tertiary" aria-hidden="true">
              ⎇ {config.footer.branch}
            </span>
            <span className="text-border-active mx-space-2" aria-hidden="true">
              |
            </span>
            <span className="text-text-tertiary" aria-hidden="true">
              {config.footer.framework}
            </span>
            <span className="text-border-active mx-space-2" aria-hidden="true">
              |
            </span>
            <span className="text-text-tertiary" aria-hidden="true">
              {config.footer.cssFramework}
            </span>
          </div>
          {/* Right: encoding, availability dot */}
          <div className="gap-space-4 flex items-center">
            <span className="text-text-tertiary" aria-hidden="true">
              {config.footer.encoding}
            </span>
            {config.owner.isAvailable && (
              <span className="text-accent" aria-label="Available for work">
                ●
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Mobile social links */}
      <div className="gap-space-6 border-border-subtle py-space-4 bg-bg-primary px-space-4 flex items-center justify-center border-t lg:hidden">
        <a
          href={config.social.github}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="GitHub profile (opens in new tab)"
          className="text-text-secondary hover:text-text-primary duration-micro focus-visible:ring-accent focus-visible:ring-offset-bg-primary rounded font-mono text-xs transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none motion-reduce:transition-none"
        >
          GitHub
        </a>
        <a
          href={config.social.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="LinkedIn profile (opens in new tab)"
          className="text-text-secondary hover:text-text-primary duration-micro focus-visible:ring-accent focus-visible:ring-offset-bg-primary rounded font-mono text-xs transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none motion-reduce:transition-none"
        >
          LinkedIn
        </a>
        {config.social.twitter && (
          <a
            href={config.social.twitter}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Twitter profile (opens in new tab)"
            className="text-text-secondary hover:text-text-primary duration-micro focus-visible:ring-accent focus-visible:ring-offset-bg-primary rounded font-mono text-xs transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none motion-reduce:transition-none"
          >
            Twitter
          </a>
        )}
      </div>
    </footer>
  );
}
