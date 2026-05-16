export interface ProjectMeta {
  slug: string;
  title: string;
  description: string;
  techStack: string[];
  outcome: string;
  isFeatured: boolean;
  startDate: string;
  endDate?: string;
  projectUrl?: string;
  githubUrl?: string;
}

export interface Project extends ProjectMeta {
  problem: string;
  approach: string;
  result: string;
  hasCodeSample: boolean;
}
