import type { Metadata } from "next";

export interface PageMeta {
  /** Full page title — e.g. "BaoBao — Full-Stack Engineer" or "About | BaoBao" */
  title: string;
  /** Concise one-sentence description for <meta name="description"> */
  description: string;
  /** Absolute path for canonical URL — e.g. "/", "/about", "/projects/my-project" */
  path: string;
  /**
   * Optional absolute URL for the OG image.
   * Defaults to `${NEXT_PUBLIC_SITE_URL}/images/og-image.png` when omitted.
   * Pass a project-specific image URL here if one exists.
   */
  ogImage?: string;
}

export function buildMetadata({
  title,
  description,
  path,
  ogImage,
}: PageMeta): Metadata {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const canonicalUrl = `${siteUrl}${path}`;
  const imageUrl = ogImage ?? `${siteUrl}/images/og-image.png`;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      type: "website",
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: `${title} — BaoBao's portfolio`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
  };
}
