import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Badge } from "@/components/Badge";
import { SectionLayout } from "@/components/SectionLayout";
import { buildMetadata } from "@/lib/metadata";
import { getAllProjectSlugs, getProjectBySlug } from "@/lib/mdx";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = await getAllProjectSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) return {};

  return buildMetadata({
    title: `${project.meta.title} | BaoBao`,
    description: project.meta.description,
    path: `/projects/${slug}`,
  });
}

export default async function ProjectDetailPage({ params }: Props) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) notFound();

  return (
    <SectionLayout id="project-detail" label="project detail" prose>
      {/* Back navigation */}
      <div className="mb-space-6">
        <Link
          href="/projects"
          className="text-text-tertiary hover:text-accent focus-visible:ring-accent focus-visible:ring-offset-bg-primary text-small duration-micro rounded font-mono transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none motion-reduce:transition-none"
        >
          ← back to projects
        </Link>
      </div>

      {/* Project title */}
      <h1 className="mb-space-4 text-h1 leading-h1 tracking-heading text-text-primary font-bold">
        {project.meta.title}
      </h1>

      {/* One-line description */}
      <p className="mb-space-6 text-body leading-body text-text-secondary">
        {project.meta.description}
      </p>

      {/* Tech stack badges */}
      <div className="mb-space-8 gap-space-2 flex flex-wrap">
        {project.meta.techStack.map((tech) => (
          <Badge key={tech} label={tech} />
        ))}
      </div>

      {/* External links — only rendered when frontmatter provides URLs */}
      {(project.meta.projectUrl ?? project.meta.githubUrl) && (
        <div className="mb-space-8 gap-space-4 flex flex-wrap">
          {project.meta.projectUrl && (
            <a
              href={project.meta.projectUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`View ${project.meta.title} project (opens in new tab)`}
              className="text-accent hover:text-accent-hover focus-visible:ring-accent focus-visible:ring-offset-bg-primary text-small duration-micro rounded font-mono transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
            >
              View Project ↗
            </a>
          )}
          {project.meta.githubUrl && (
            <a
              href={project.meta.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`GitHub repository for ${project.meta.title} (opens in new tab)`}
              className="text-text-secondary hover:text-accent focus-visible:ring-accent focus-visible:ring-offset-bg-primary text-small duration-micro rounded font-mono transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
            >
              GitHub ↗
            </a>
          )}
        </div>
      )}

      {/* MDX prose content */}
      <div className="mdx-prose">{project.content}</div>
    </SectionLayout>
  );
}
