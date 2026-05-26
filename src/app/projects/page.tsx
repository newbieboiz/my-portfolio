import { buildMetadata } from "@/lib/metadata";
import { SectionLayout } from "@/components/SectionLayout";
import { ProjectCard } from "@/components/ProjectCard";
import { getProjects } from "@/lib/data";
import { AnimatedSection } from "@/components/AnimatedSection";

export const metadata = buildMetadata({
  title: "Projects | BaoBao",
  description:
    "A curated selection of full-stack projects built with React, TypeScript, and modern web technologies.",
  path: "/projects",
});

export default function Projects() {
  const projects = getProjects();

  return (
    <SectionLayout id="selected-work" label="selected work">
      <AnimatedSection
        stagger
        className="gap-space-6 grid grid-cols-1 md:grid-cols-2"
      >
        {projects.map((project) => (
          <ProjectCard key={project.slug} project={project} />
        ))}
      </AnimatedSection>
    </SectionLayout>
  );
}
