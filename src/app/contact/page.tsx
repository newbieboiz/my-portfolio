import { getSiteConfig } from "@/lib/data";
import { buildMetadata } from "@/lib/metadata";
import { SectionLayout } from "@/components/SectionLayout";
import { AnimatedSection } from "@/components/AnimatedSection";

export const metadata = buildMetadata({
  title: "Contact | BaoBao",
  description:
    "Get in touch with BaoBao — full-stack engineer open to new opportunities.",
  path: "/contact",
});

export default function Contact() {
  const siteConfig = getSiteConfig();
  const { email } = siteConfig.owner;
  const { github, linkedin, twitter } = siteConfig.social;

  return (
    <SectionLayout id="contact" label="contact" prose={true}>
      <AnimatedSection>
        <div className="gap-space-8 flex flex-col">
          {/* Email */}
          <div className="gap-space-2 flex flex-col">
            <p className="text-small text-text-secondary font-mono">
              {"// drop me a line"}
            </p>
            <p>
              <a
                href={`mailto:${email}`}
                aria-label={`Email BaoBao at ${email}`}
                className="text-accent hover:text-accent-hover duration-micro focus-visible:ring-accent focus-visible:ring-offset-bg-primary text-body inline-flex min-h-11 items-center rounded font-mono transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
              >
                {email}
              </a>
            </p>
          </div>

          {/* Visual separator */}
          <hr className="border-border-subtle" />

          {/* Social links */}
          <div className="gap-space-2 flex flex-col">
            <p className="text-small text-text-secondary font-mono">
              {"// find me online"}
            </p>
            <div className="gap-space-4 flex flex-wrap">
              <a
                href={github}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub profile (opens in new tab)"
                className="text-text-secondary hover:text-text-primary duration-micro focus-visible:ring-accent focus-visible:ring-offset-bg-primary text-body inline-flex min-h-11 items-center rounded font-mono transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
              >
                GitHub
              </a>
              <a
                href={linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn profile (opens in new tab)"
                className="text-text-secondary hover:text-text-primary duration-micro focus-visible:ring-accent focus-visible:ring-offset-bg-primary text-body inline-flex min-h-11 items-center rounded font-mono transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
              >
                LinkedIn
              </a>
              {twitter && (
                <a
                  href={twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Twitter profile (opens in new tab)"
                  className="text-text-secondary hover:text-text-primary duration-micro focus-visible:ring-accent focus-visible:ring-offset-bg-primary text-body inline-flex min-h-11 items-center rounded font-mono transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
                >
                  Twitter
                </a>
              )}
            </div>
          </div>
        </div>
      </AnimatedSection>
    </SectionLayout>
  );
}
