export interface Skill {
  name: string;
  level?: "beginner" | "intermediate" | "advanced" | "expert";
}

export interface SkillCategory {
  category: string;
  skills: Skill[];
}

export interface NavigationItem {
  label: string;
  href: string;
  isExternal?: boolean;
}

export interface SiteConfig {
  siteUrl: string;
  owner: {
    name: string;
    title: string;
    tagline: string;
    email: string;
    isAvailable: boolean;
    availabilityText: string;
  };
  social: {
    github: string;
    linkedin: string;
    twitter?: string;
  };
  navigation: NavigationItem[];
  footer: {
    branch: string;
    framework: string;
    cssFramework: string;
    encoding: string;
  };
}
