export type TechStackCategory = "language" | "framework" | "tool" | "other";

const techStackCategoryMap: Record<TechStackCategory, string[]> = {
  // languages
  language: [
    "javascript",
    "typescript",
    "jsx",
    "tsx",
    "html",
    "css",
    "scss",
    "sass",
    "less",
    "sql",
    "graphql",
    "python",
    "go",
    "golang",
    "rust",
    "java",
    "kotlin",
    "swift",
    "dart",
    "csharp",
    "c#",
    "cpp",
    "c++",
    "ruby",
    "php",
    "bash",
    "shell",
    "powershell",
    "markdown",
    "mdx",
  ],

  // frameworks / libraries
  framework: [
    "react",
    "next",
    "nextjs",
    "nextdotjs",
    "astro",
    "svelte",
    "sveltekit",
    "vue",
    "nuxt",
    "angular",
    "ember",
    "solid",
    "preact",
    "remix",
    "gatsby",
    "rails",
    "rubyrails",
    "django",
    "flask",
    "express",
    "nestjs",
    "fastify",
    "tailwindcss",
    "tailwind",
    "bootstrap",
    "chakraui",
    "mantine",
    "materialui",
    "styledcomponents",
    "emotion",
    "electron",
    "reactnative",
    "nextauth",
  ],

  // tools / platforms
  tool: [
    "node",
    "nodejs",
    "deno",
    "npm",
    "pnpm",
    "yarn",
    "vite",
    "webpack",
    "rollup",
    "esbuild",
    "babel",
    "eslint",
    "prettier",
    "stylelint",
    "jest",
    "vitest",
    "cypress",
    "playwright",
    "storybook",
    "prisma",
    "postcss",
    "sqlite",
    "postgres",
    "mysql",
    "mongodb",
    "github",
    "firebase",
    "supabase",
    "stripe",
    "vercel",
    "netlify",
    "figma",
    "docker",
    "kubernetes",
    "graphqlcodegen",
    "lodash",
  ],

  // other
  other: [
    "gsap",
    "d3",
    "threejs",
    "framer",
    "ramda",
    "leaflet",
    "dayjs",
    "datefns",
    "apollo",
    "stripejs",
  ],
};

function normalizeTechLabel(label: string) {
  return label
    .trim()
    .toLowerCase()
    .replace(/^@/, "")
    .replace(/[^a-z0-9#+]+/g, "");
}

export function categorizeTechStack(label: string): TechStackCategory {
  const normalized = normalizeTechLabel(label);
  for (const [category, techs] of Object.entries(techStackCategoryMap)) {
    if (techs.includes(normalized)) {
      return category as TechStackCategory;
    }
  }
  return "other";
}
