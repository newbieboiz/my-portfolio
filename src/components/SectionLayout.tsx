interface SectionLayoutProps {
  label: string;
  id: string;
  children: React.ReactNode;
  prose?: boolean;
}

export function SectionLayout({
  label,
  id,
  children,
  prose = false,
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
          className="mb-space-8 text-small text-text-tertiary font-mono"
        >
          {`// ${label}`}
        </h2>
        {prose ? <div className="max-w-prose">{children}</div> : children}
      </div>
    </section>
  );
}
