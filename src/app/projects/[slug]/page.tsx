import { notFound } from "next/navigation";

import { getAllProjectSlugs, getProjectBySlug } from "@/lib/mdx";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = await getAllProjectSlugs();
  return slugs.map((slug) => ({ slug }));
}

export default async function ProjectDetailPage({ params }: Props) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) notFound();

  return (
    <main className="px-space-8 py-space-8 w-full">
      <div className="mx-auto max-w-prose">
        <h1 className="text-h1 leading-h1 tracking-heading text-text-primary mb-space-6 font-semibold">
          {project.meta.title}
        </h1>
        <div className="text-text-secondary leading-body">
          {project.content}
        </div>
      </div>
    </main>
  );
}
