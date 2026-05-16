import type { Project } from "@/types/project";
import type { Experience, Education } from "@/types/experience";
import type { SkillCategory, SiteConfig } from "@/types/site";

import projectsData from "../../data/projects.json";
import experienceData from "../../data/experience.json";
import skillsData from "../../data/skills.json";
import educationData from "../../data/education.json";
import siteData from "../../data/site.json";

export function getProjects(): Project[] {
  return projectsData as Project[];
}

export function getExperience(): Experience[] {
  return experienceData as Experience[];
}

export function getEducation(): Education[] {
  return educationData as Education[];
}

export function getSkills(): SkillCategory[] {
  return skillsData as SkillCategory[];
}

export function getSiteConfig(): SiteConfig {
  return {
    ...(siteData as Omit<SiteConfig, "siteUrl">),
    siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  };
}
