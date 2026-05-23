import { SectionLayout } from "@/components/SectionLayout";
import { ProjectCard } from "@/components/ProjectCard";
import { getProjects } from "@/lib/data";

export default function Projects() {
  const projects = getProjects();

  return (
    <SectionLayout id="selected-work" label="selected work">
      <div className="gap-space-6 grid grid-cols-1 md:grid-cols-2">
        {projects.map((project) => (
          <ProjectCard key={project.slug} project={project} />
        ))}
      </div>
    </SectionLayout>
  );
}
