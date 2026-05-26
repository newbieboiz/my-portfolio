interface HeroSectionProps {
  label: string;
  id: string;
  children: React.ReactNode;
}

export function HeroSection({ label, id, children }: HeroSectionProps) {
  const headingId = `${id}-heading`;

  return (
    <section
      id={id}
      aria-labelledby={headingId}
      className="px-space-8 py-space-8 md:py-space-12 w-full"
    >
      <div className="w-full max-w-2xl">
        <p
          id={headingId}
          className="mb-space-8 text-small text-text-tertiary gap-space-4 flex items-center font-mono"
        >
          {`// ${label}`}
        </p>
        {children}
      </div>
    </section>
  );
}
