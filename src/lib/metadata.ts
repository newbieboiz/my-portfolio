import type { Metadata } from "next";

export interface PageMeta {
  /** Full page title — e.g. "BaoBao — Full-Stack Engineer" or "About | BaoBao" */
  title: string;
  /** Concise one-sentence description for <meta name="description"> */
  description: string;
  /** Absolute path for canonical URL — e.g. "/", "/about", "/projects/my-project" */
  path: string;
}

export function buildMetadata({
  title,
  description,
  path,
}: PageMeta): Metadata {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  return {
    title,
    description,
    alternates: {
      canonical: `${siteUrl}${path}`,
    },
  };
}
