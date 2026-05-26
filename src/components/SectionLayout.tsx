import { cn } from "@/lib/cn";

interface SectionLayoutProps {
  label: string;
  id: string;
  children: React.ReactNode;
  className?: string;
  commandHint?: string;
  prose?: boolean;
  align?: "left" | "center" | "right";
}

export function SectionLayout({
  label,
  id,
  children,
  className,
  commandHint,
  prose = false,
  align = "left",
}: SectionLayoutProps) {
  const headingId = `${id}-heading`;

  return (
    <section
      id={id}
      aria-labelledby={headingId}
      className={cn("px-space-8 py-space-8 md:py-space-12 w-full", className)}
    >
      <div
        className={cn("max-w-content w-full", {
          "max-w-prose": prose,
          "mx-auto": align === "center",
          "ml-auto": align === "right",
        })}
      >
        <h2
          id={headingId}
          className="mb-space-8 text-small text-text-tertiary gap-space-4 flex items-center font-mono"
        >
          {`// ${label}`}
          {commandHint && (
            <span className="px-space-2 py-space-1 text-text-muted border-border-subtle tracking-badge ml-auto hidden items-center rounded border text-xs lg:inline-flex">
              {commandHint}
            </span>
          )}
        </h2>
        {children}
      </div>
    </section>
  );
}
