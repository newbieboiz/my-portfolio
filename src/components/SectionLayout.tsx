interface SectionLayoutProps {
  label: string;
  id: string;
  children: React.ReactNode;
  prose?: boolean;
  commandHint?: string;
}

export function SectionLayout({
  label,
  id,
  children,
  prose = false,
  commandHint,
}: SectionLayoutProps) {
  const headingId = `${id}-heading`;

  return (
    <section
      id={id}
      aria-labelledby={headingId}
      className="px-space-8 py-space-8 md:py-space-12 w-full"
    >
      <div className="max-w-content mx-auto w-full">
        <h2
          id={headingId}
          className="mb-space-8 text-small text-text-tertiary gap-space-4 flex items-center font-mono"
        >
          {`// ${label}`}
          {commandHint && (
            <span className="px-space-2 py-space-1 text-text-muted border-border-subtle tracking-badge hidden items-center rounded border text-xs lg:inline-flex">
              {commandHint}
            </span>
          )}
        </h2>
        {prose ? <div className="max-w-prose">{children}</div> : children}
      </div>
    </section>
  );
}
