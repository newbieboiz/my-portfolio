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
    bio: string;
    tagline: string;
    email: string;
    phone: string;
    isAvailable: boolean;
    availabilityText: string;
  };
  social: {
    linkedin: string;
    github?: string;
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
