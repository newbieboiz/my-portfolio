import { readdir, readFile } from "fs/promises";
import path from "path";

import { compileMDX } from "next-mdx-remote/rsc";
import rehypePrettyCode from "rehype-pretty-code";
import type { ReactElement } from "react";

import type { ProjectMeta } from "@/types/project";

const CONTENT_DIR = path.join(process.cwd(), "content/projects");

type MdxFrontmatter = Omit<ProjectMeta, "slug">;

export async function getAllProjectSlugs(): Promise<string[]> {
  const files = await readdir(CONTENT_DIR);
  return files
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => file.replace(/\.mdx$/, ""));
}

export async function getProjectBySlug(
  slug: string,
): Promise<{ meta: ProjectMeta; content: ReactElement } | null> {
  const filePath = path.join(CONTENT_DIR, `${slug}.mdx`);
  try {
    const source = await readFile(filePath, "utf8");
    const { content, frontmatter } = await compileMDX<MdxFrontmatter>({
      source,
      options: {
        parseFrontmatter: true,
        mdxOptions: {
          rehypePlugins: [
            [
              rehypePrettyCode,
              {
                theme: "github-dark",
                keepBackground: false, // use --bg-secondary from CSS, not Shiki's inline style
              },
            ],
          ],
        },
      },
    });
    return {
      meta: { ...frontmatter, slug },
      content,
    };
  } catch {
    // File not found or parse error → caller handles null as notFound()
    return null;
  }
}
