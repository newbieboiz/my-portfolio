import Link from "next/link";
import { Badge } from "@/components/Badge";
import { categorizeTechStack } from "@/lib/categorize-techstack";
import type { Project } from "@/types/project";

interface ProjectCardProps {
  project: Project;
}

function formatMonthYear(dateStr: string): string {
  const [year, month] = dateStr.split("-");
  const date = new Date(parseInt(year, 10), parseInt(month, 10) - 1);
  return date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

export function ProjectCard({ project }: ProjectCardProps) {
  const dateRange = project.endDate
    ? `${formatMonthYear(project.startDate)} – ${formatMonthYear(project.endDate)}`
    : `${formatMonthYear(project.startDate)} – Present`;

  return (
    <Link
      href={`/projects/${project.slug}`}
      aria-label={`View ${project.title} project details`}
      className="group bg-bg-secondary border-border-subtle p-space-6 gap-space-4 duration-micro hover:border-border-active hover:bg-bg-tertiary focus-visible:ring-accent focus-visible:ring-offset-bg-primary flex flex-col rounded-lg border transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none motion-reduce:transition-none"
    >
      <h3 className="text-h3 leading-h3 tracking-heading text-text-primary font-semibold">
        {project.title}
      </h3>
      <p className="text-body leading-body text-text-secondary flex-1">
        {project.description}
      </p>
      <div className="gap-space-2 flex flex-wrap">
        {project.techStack.map((tech) => (
          <Badge key={tech} label={tech} category={categorizeTechStack(tech)} />
        ))}
      </div>
      <div className="border-border-subtle mt-space-4 pt-space-4 duration-micro border-t transition-all motion-reduce:transition-none">
        <p className="text-text-tertiary leading-xs mb-1 text-xs">
          {project.outcome}
        </p>
        <p className="text-text-muted leading-xs font-mono text-xs">
          {dateRange}
        </p>
      </div>
    </Link>
  );
}
