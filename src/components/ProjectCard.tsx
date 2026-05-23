import Link from "next/link";
import { Badge } from "@/components/Badge";
import type { Project } from "@/types/project";

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Link
      href={`/projects/${project.slug}`}
      aria-label={`View ${project.title} project details`}
      className="bg-bg-secondary border-border-subtle p-space-6 gap-space-4 duration-micro hover:border-border-active hover:bg-bg-tertiary focus-visible:ring-accent focus-visible:ring-offset-bg-primary flex flex-col rounded-lg border transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none motion-reduce:transition-none"
    >
      <h3 className="text-h3 leading-h3 tracking-heading text-text-primary font-semibold">
        {project.title}
      </h3>
      <p className="text-body leading-body text-text-secondary flex-1">
        {project.description}
      </p>
      <div className="gap-space-2 flex flex-wrap">
        {project.techStack.map((tech) => (
          <Badge key={tech} label={tech} />
        ))}
      </div>
    </Link>
  );
}
