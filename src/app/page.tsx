import Link from "next/link";
import { getSiteConfig, getProjects } from "@/lib/data";
import { buildMetadata } from "@/lib/metadata";
import { SectionLayout } from "@/components/SectionLayout";
import { ProjectCard } from "@/components/ProjectCard";
import { AnimatedSection } from "@/components/AnimatedSection";
import { CVDownloadButton } from "@/components/cv/CVDownloadButton";
import { HeroSection } from "@/components/HeroSection";

export const metadata = buildMetadata({
  title: "BaoBao — Full-Stack Engineer",
  description:
    "Full-stack engineer specialising in React and TypeScript — building interfaces that feel inevitable.",
  path: "/",
});

export default function Home() {
  const siteConfig = getSiteConfig();
  const featuredProjects = getProjects().filter((p) => p.isFeatured);

  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: siteConfig.owner.name,
    url: siteConfig.siteUrl,
    email: siteConfig.owner.email,
    jobTitle: siteConfig.owner.title,
    sameAs: [
      siteConfig.social.github,
      siteConfig.social.linkedin,
      ...(siteConfig.social.twitter ? [siteConfig.social.twitter] : []),
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />
      <HeroSection id="hello-world" label="hello world">
        <AnimatedSection>
          <div className="gap-space-6 flex flex-col">
            <h1 className="md:text-hero leading-hero tracking-hero text-text-primary text-[2.25rem] font-bold">
              {siteConfig.owner.name}
            </h1>

            {/* Tagline — h2 scale (32px desktop, 24px mobile) */}
            <p className="md:text-h2 leading-h2 tracking-heading text-text-secondary text-h3 max-w-prose font-semibold">
              {siteConfig.owner.tagline}
            </p>

            {/* CTAs — side-by-side on sm+ (≥640px), stacked on mobile */}
            <div className="gap-space-4 pt-space-2 flex flex-col sm:flex-row">
              {/* Primary CTA — updated to scroll to #selected-work on this page (Story 3.3) */}
              <Link
                href="#selected-work"
                className="px-space-6 py-space-4 bg-accent text-bg-primary text-small duration-micro hover:bg-accent-hover focus-visible:ring-accent focus-visible:ring-offset-bg-primary inline-flex items-center justify-center rounded font-mono font-bold transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
              >
                View Projects
              </Link>

              {/* Secondary CTA — PDF export (Story 7.3) */}
              <CVDownloadButton />
            </div>
          </div>
        </AnimatedSection>
      </HeroSection>

      <SectionLayout id="selected-work" label="selected work" commandHint="⌘K">
        <AnimatedSection
          stagger
          className="gap-space-6 grid grid-cols-1 md:grid-cols-2"
        >
          {featuredProjects.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </AnimatedSection>
      </SectionLayout>
    </>
  );
}
