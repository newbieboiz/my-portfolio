import type { Metadata } from "next";
import {
  getSiteConfig,
  getSkills,
  getExperience,
  getEducation,
} from "@/lib/data";
import { SectionLayout } from "@/components/SectionLayout";
import { Badge } from "@/components/Badge";

export const metadata: Metadata = {
  title: "About | BaoBao",
  description:
    "BaoBao's background, technical skills, and work experience as a full-stack engineer.",
};

function formatDate(dateStr: string): string {
  const normalized = dateStr.length === 7 ? `${dateStr}-01` : dateStr;
  return new Intl.DateTimeFormat("en-US", {
    timeZone: "UTC",
    month: "short",
    year: "numeric",
  }).format(new Date(normalized));
}

export default function About() {
  const siteConfig = getSiteConfig();
  const skills = getSkills();
  const experience = getExperience();
  const education = getEducation();

  // Reverse-chronological: most recent startDate first
  const sortedExperience = [...experience].sort(
    (a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime(),
  );

  return (
    <>
      {/* ── Section 1: Bio ── */}
      <SectionLayout id="about" label="about" prose={true}>
        <p className="text-body leading-body text-text-secondary">
          {siteConfig.owner.bio}
        </p>
      </SectionLayout>

      {/* ── Section 2: Skills ── */}
      <SectionLayout id="skills" label="skills">
        <div className="gap-space-12 flex flex-col">
          {skills.map((skillCategory) => (
            <div key={skillCategory.category}>
              <h3 className="mb-space-4 text-h3 leading-h3 tracking-heading text-text-primary font-semibold">
                {skillCategory.category}
              </h3>
              <div className="gap-space-2 flex flex-wrap">
                {skillCategory.skills.map((skill) => (
                  <Badge key={skill.name} label={skill.name} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </SectionLayout>

      {/* ── Section 3: Experience & Education ── */}
      <SectionLayout id="experience" label="experience & education">
        <div className="gap-space-12 flex flex-col">
          {/* Work Experience */}
          {sortedExperience.map((exp) => (
            <div
              key={`${exp.company}-${exp.startDate}`}
              className="gap-space-4 flex flex-col"
            >
              <div className="gap-space-4 flex flex-wrap items-start justify-between">
                <div>
                  <h3 className="text-h3 leading-h3 tracking-heading text-text-primary font-semibold">
                    {exp.title}
                  </h3>
                  <p className="text-small leading-small text-accent font-mono">
                    {exp.company}
                  </p>
                </div>
                <p className="text-small leading-small text-text-tertiary font-mono">
                  {formatDate(exp.startDate)}
                  {" — "}
                  {exp.isCurrent ? "Present" : formatDate(exp.endDate!)}
                </p>
              </div>
              <p className="text-body leading-body text-text-secondary">
                {exp.description}
              </p>
              {exp.achievements.length > 0 && (
                <ul className="gap-space-2 flex flex-col">
                  {exp.achievements.map((achievement, i) => (
                    <li
                      key={i}
                      className="text-body leading-body text-text-secondary gap-space-2 flex"
                    >
                      <span className="text-accent shrink-0" aria-hidden="true">
                        ▸
                      </span>
                      <span>{achievement}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}

          {/* Visual separator between experience and education */}
          <hr className="border-border-subtle" />

          {/* Education */}
          {education.map((edu) => (
            <div
              key={`${edu.institution}-${edu.startDate}`}
              className="gap-space-4 flex flex-col"
            >
              <div className="gap-space-4 flex flex-wrap items-start justify-between">
                <div>
                  <h3 className="text-h3 leading-h3 tracking-heading text-text-primary font-semibold">
                    {edu.degree} in {edu.field}
                  </h3>
                  <p className="text-small leading-small text-accent font-mono">
                    {edu.institution}
                  </p>
                </div>
                <p className="text-small leading-small text-text-tertiary font-mono">
                  {formatDate(edu.startDate)} — {formatDate(edu.endDate)}
                </p>
              </div>
              {edu.description && (
                <p className="text-body leading-body text-text-secondary">
                  {edu.description}
                </p>
              )}
            </div>
          ))}
        </div>
      </SectionLayout>
    </>
  );
}
