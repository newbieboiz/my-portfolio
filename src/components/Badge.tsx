type BadgeCategory = "language" | "framework" | "tool" | "other";

interface BadgeProps {
  label: string;
  category?: BadgeCategory;
}

const categoryStyles: Record<BadgeCategory, string> = {
  language: "bg-accent-muted text-accent",
  framework: "bg-info/10 text-info",
  tool: "bg-warning/10 text-warning",
  other: "bg-accent-muted text-text-secondary",
};

export function Badge({ label, category = "other" }: BadgeProps) {
  const colorClasses = categoryStyles[category];
  return (
    <span
      className={`px-space-2 py-space-1 tracking-badge inline-block rounded font-mono text-xs ${colorClasses}`}
    >
      {label}
    </span>
  );
}
