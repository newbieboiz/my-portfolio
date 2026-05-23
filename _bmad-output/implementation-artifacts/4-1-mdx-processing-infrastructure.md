# Story 4.1: MDX Processing Infrastructure

Status: done

## Story

As the **owner**,
I want MDX files in `content/projects/` to be processed and available as typed data,
so that I can write project case studies in markdown with frontmatter and have them render as structured pages without touching component code.

## Acceptance Criteria

1. **Given** an MDX file exists at `content/projects/[slug].mdx`
   **When** `src/lib/mdx.ts` processes it
   **Then** the frontmatter (`title`, `description`, `techStack`, `outcome`, `startDate`) is parsed and returned as a typed `ProjectMeta` object; the MDX body is available as renderable React content

2. **Given** `lib/mdx.ts` exports `getAllProjectSlugs()` and `getProjectBySlug(slug)`
   **When** called from a Server Component
   **Then** `getAllProjectSlugs()` returns an array of slug strings matching `.mdx` filenames in `content/projects/`; `getProjectBySlug(slug)` returns `{ meta: ProjectMeta; content: ReactElement }` or `null` if the file does not exist

3. **Given** MDX frontmatter is validated
   **When** a required field (e.g. `title`) is missing
   **Then** the TypeScript generic on `compileMDX<MdxFrontmatter>` enforces the shape at build time; a missing required field causes a TypeScript build error rather than a silent runtime failure

4. **Given** at least one seed MDX file exists (`content/projects/sample-project.mdx`)
   **When** the project is built
   **Then** `pnpm build` completes with 0 errors and the slug is resolvable via a minimal `src/app/projects/[slug]/page.tsx` stub (full styling added in Story 4.2)

## Tasks / Subtasks

- [x] **Task 1: Install MDX dependencies** (AC: 1, 2, 4)
  - [x] Run: `pnpm add next-mdx-remote rehype-pretty-code shiki` in the project root
  - [x] Confirm `package.json` now lists all three packages under `dependencies`

- [x] **Task 2: Create content directory and seed MDX file** (AC: 4)
  - [x] Create `content/projects/` directory at the **project root** (alongside `data/`, NOT inside `src/`)
  - [x] Create `content/projects/sample-project.mdx` — see Dev Notes for exact content

- [x] **Task 3: Implement `src/lib/mdx.ts`** (AC: 1, 2, 3)
  - [x] Create `src/lib/mdx.ts` — see Dev Notes for exact implementation
  - [x] Export `getAllProjectSlugs(): Promise<string[]>`
  - [x] Export `getProjectBySlug(slug: string): Promise<{ meta: ProjectMeta; content: ReactElement } | null>`
  - [x] Do **NOT** modify `src/lib/data.ts` — JSON and MDX access are separate concerns
  - [x] Do **NOT** modify `src/types/project.ts` — `ProjectMeta` is already the correct shape

- [x] **Task 4: Create minimal `src/app/projects/[slug]/page.tsx` stub** (AC: 4)
  - [x] Create `src/app/projects/[slug]/page.tsx` — see Dev Notes for exact minimal stub
  - [x] MUST include `generateStaticParams()` calling `getAllProjectSlugs()` — required for SSG pre-rendering
  - [x] MUST call `notFound()` for missing slugs — custom 404 already exists at `src/app/not-found.tsx`
  - [x] This is a **barebones scaffold** — Story 4.2 replaces it with full `ProjectDetail` layout
  - [x] **CRITICAL**: In Next.js 16, `params` is a `Promise` — must `await params` before destructuring `slug`

- [x] **Task 5: Verify build and routes** (AC: 1–4)
  - [x] Run `pnpm build` — expect 0 TypeScript errors; build log shows `[slug]` route pre-rendered for `sample-project`
  - [x] Run `pnpm dev` → navigate to `http://localhost:3000/projects/sample-project` — page renders "Sample Project" title + MDX body
  - [x] Run `pnpm dev` → navigate to `http://localhost:3000/projects/nonexistent` — terminal-style 404 renders correctly
  - [x] Run `pnpm dev` → navigate to `http://localhost:3000/projects` — existing project listing renders **unchanged**

## Dev Notes

### Critical Context: What Exists vs What to Build

This story adds a new MDX content layer. **Zero existing files are modified** — all changes are additive.

| Status                    | Asset                                 | Location                       | Notes                                                                         |
| ------------------------- | ------------------------------------- | ------------------------------ | ----------------------------------------------------------------------------- |
| **EXISTS — reuse as-is**  | `ProjectMeta` interface               | `src/types/project.ts`         | Already the exact right shape for MDX frontmatter — **do not modify**         |
| **EXISTS — untouched**    | `src/lib/data.ts`                     | `src/lib/data.ts`              | JSON data access — separate from MDX, leave alone                             |
| **EXISTS — untouched**    | `src/app/projects/page.tsx`           | `src/app/projects/page.tsx`    | Project listing — already works with JSON, no changes needed                  |
| **EXISTS — will trigger** | `src/app/not-found.tsx`               | `src/app/not-found.tsx`        | Terminal-style custom 404 — already handles invalid slugs via `notFound()`    |
| **EXISTS — untouched**    | Design tokens                         | `src/app/globals.css`          | All tokens available; `--bg-secondary: #12121a` used as code block background |
| **NEW**                   | `content/projects/` dir               | Project root (next to `data/`) | MDX prose content directory                                                   |
| **NEW**                   | `content/projects/sample-project.mdx` | See above                      | Required seed file for build validation                                       |
| **NEW**                   | `src/lib/mdx.ts`                      | `src/lib/`                     | MDX processing — `getAllProjectSlugs` + `getProjectBySlug`                    |
| **NEW**                   | `src/app/projects/[slug]/page.tsx`    | `src/app/projects/[slug]/`     | Minimal stub; Story 4.2 replaces with full UI                                 |

### `ProjectMeta` Interface — Already Correct, No Changes Needed

```ts
// src/types/project.ts — DO NOT MODIFY THIS FILE
export interface ProjectMeta {
  slug: string; // ← derived from filename by getProjectBySlug(), NOT written in MDX frontmatter
  title: string; // ← required frontmatter field
  description: string; // ← required frontmatter field
  techStack: string[]; // ← required frontmatter field (YAML array)
  outcome: string; // ← required frontmatter field
  isFeatured: boolean; // ← frontmatter field (recommend including, default false)
  startDate: string; // ← required frontmatter field (ISO 8601: "2026-05")
  endDate?: string; // ← optional frontmatter field
  projectUrl?: string; // ← optional frontmatter field
  githubUrl?: string; // ← optional frontmatter field
}
```

The `MdxFrontmatter` type used inside `mdx.ts` is `Omit<ProjectMeta, "slug">` — this enforces that
frontmatter does NOT include `slug` (slug comes from the filename). The `slug` is injected in
`getProjectBySlug` as `{ ...frontmatter, slug }`.

### Why `next-mdx-remote` (not `@next/mdx`)

| Approach                          | Verdict                                                                                                                                                                                                                                                                      |
| --------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `@next/mdx` (official)            | Designed for `.mdx` files as page routes — not for loading MDX from the filesystem in lib functions. Requires `next.config.ts` plugin wrapping (`withMDX`) and can't cleanly return frontmatter from a lib function.                                                         |
| Raw `gray-matter` + `@mdx-js/mdx` | More packages, more complexity, manual MDX compilation — same result as `next-mdx-remote` but without the convenience wrapper.                                                                                                                                               |
| **`next-mdx-remote` v5** ✅       | Purpose-built for filesystem-loaded MDX in Server Components. `compileMDX` from `next-mdx-remote/rsc` is a single async call that returns both `content` (React element) and typed `frontmatter`. No `next.config.ts` changes. Works perfectly in `async` Server Components. |

### Exact Implementation: `content/projects/sample-project.mdx` — FULL FILE

````mdx
---
title: Sample Project
description: A demonstration project validating the MDX case study infrastructure.
techStack:
  - Next.js
  - TypeScript
  - Tailwind CSS
outcome: Confirmed MDX processing infrastructure works end-to-end — build passes, slug resolves.
isFeatured: false
startDate: "2026-05"
---

## Problem

This seed project exists to validate that the MDX processing pipeline is working correctly.
The content layer must parse frontmatter, compile MDX body content, and make both available
to Server Components for static generation at build time.

## Approach

Implemented `src/lib/mdx.ts` with two exports: `getAllProjectSlugs()` scans `content/projects/`
for `.mdx` files; `getProjectBySlug(slug)` reads and compiles a single file using
`next-mdx-remote/rsc`.

```ts
// Simplified view of the implementation pattern
const source = await readFile(filePath, "utf8");
const { content, frontmatter } = await compileMDX({
  source,
  options: { parseFrontmatter: true },
});
```
````

## Result

Build completes with 0 errors. Route `/projects/sample-project` renders successfully.
Custom 404 renders for unknown slugs. Infrastructure is ready for Story 4.2 to add
full `ProjectDetail` layout styling.

````

### Exact Implementation: `src/lib/mdx.ts` — FULL FILE

```ts
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
  slug: string
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
````

**Import order is correct** per architecture conventions:

1. Node built-ins (`fs/promises`, `path`)
2. Third-party (`next-mdx-remote/rsc`, `rehype-pretty-code`, `react`)
3. `@/types/` imports

### Exact Implementation: `src/app/projects/[slug]/page.tsx` — MINIMAL STUB

```tsx
import { notFound } from "next/navigation";

import { getAllProjectSlugs, getProjectBySlug } from "@/lib/mdx";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = await getAllProjectSlugs();
  return slugs.map((slug) => ({ slug }));
}

export default async function ProjectDetailPage({ params }: Props) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) notFound();

  return (
    <main className="px-space-8 py-space-8 w-full">
      <div className="mx-auto max-w-prose">
        <h1 className="text-h1 leading-h1 tracking-heading text-text-primary mb-space-6 font-semibold">
          {project.meta.title}
        </h1>
        <div className="text-text-secondary leading-body">
          {project.content}
        </div>
      </div>
    </main>
  );
}
```

**This stub is intentionally minimal** — Story 4.2 replaces the entire `return (...)` block with the
full `ProjectDetail` layout: `SectionLayout` wrapper, `Badge` components for tech stack, back-navigation,
`generateMetadata()` for FR24, and MDX prose styles.

### CRITICAL: `params` is a Promise in Next.js 15+

Next.js 15 introduced a breaking change: dynamic route `params` is now a `Promise`. This applies to
Next.js 16 as well.

```tsx
// ✅ CORRECT — Next.js 16
interface Props {
  params: Promise<{ slug: string }>;
}
export default async function Page({ params }: Props) {
  const { slug } = await params; // must await!
}

// ❌ WRONG — Next.js 14 pattern, will cause TypeScript errors in Next.js 16
export default async function Page({ params }: { params: { slug: string } }) {
  const { slug } = params; // missing await
}
```

### No Changes to `next.config.ts`

`next-mdx-remote` reads MDX as plain strings via `fs.readFile` and compiles them server-side.
No webpack/Turbopack config changes needed. The existing CSP in `next.config.ts` is unaffected —
MDX compiles at build time, no inline scripts are injected at runtime.

### No Changes to `src/types/project.ts`

`ProjectMeta` already has exactly the right shape. The only "new" type (`MdxFrontmatter`) is a
local `Omit<ProjectMeta, "slug">` defined inside `mdx.ts` itself — no changes to the types file.

### Syntax Highlighting: `rehype-pretty-code` + `github-dark`

`rehype-pretty-code` uses Shiki (v1.x) under the hood and requires `shiki` as a peer dependency —
hence `pnpm add rehype-pretty-code shiki` (both required).

`keepBackground: false` is essential: it prevents `rehype-pretty-code` from injecting an inline
`background-color` style onto `<pre>` elements. Without this, the Shiki theme background overwrites
`--bg-secondary` and breaks the design token system.

**Shiki theme options** (can be swapped in Story 4.2 if needed):
| Theme | Character |
|-------|-----------|
| `github-dark` ✅ | Safe, well-tested, high contrast |
| `github-dark-dimmed` | Slightly lighter background |
| `vitesse-dark` | Warm dark tones |
| `night-owl` | Popular terminal-vibe dark |

Changing the theme is a one-line edit in `mdx.ts` — zero API changes.

### Design Token Reference (Minimal Stub)

| Token                       | Tailwind utility            | Used in                  |
| --------------------------- | --------------------------- | ------------------------ |
| `--text-primary`            | `text-text-primary`         | `<h1>` title             |
| `--text-secondary`          | `text-text-secondary`       | MDX body prose           |
| `--space-8`                 | `px-space-8` / `py-space-8` | Page outer padding       |
| `--space-6`                 | `mb-space-6`                | Title bottom margin      |
| `--prose-max-width` (680px) | `max-w-prose`               | Content width constraint |

Story 4.2 adds the full design token set (back-link, Badge styles, `SectionLayout` wrapper, etc.).

### References

- [Source: _bmad-output/planning-artifacts/epics.md — Epic 4, Story 4.1]
- [Source: _bmad-output/planning-artifacts/architecture.md — Data Architecture: MDX files]
- [Source: _bmad-output/planning-artifacts/architecture.md — Project Structure: `content/` directory at root]
- [Source: _bmad-output/planning-artifacts/architecture.md — Implementation Patterns: Naming conventions, import order]
- [Source: src/types/project.ts — ProjectMeta interface — already complete]
- [Source: src/lib/data.ts — Established pattern for data access functions (mirrors mdx.ts)]
- [Source: src/app/not-found.tsx — Custom 404 already exists; `notFound()` triggers it]
- [Source: package.json — No MDX packages present; all three must be installed]

## Dev Agent Record

### Agent Model Used

Claude Sonnet 4.6

### Debug Log References

None — implementation followed story spec exactly with no deviations.

### Completion Notes List

- ✅ Installed `next-mdx-remote@6.0.0`, `rehype-pretty-code@0.14.3`, `shiki@4.1.0` via pnpm
- ✅ Created `content/projects/sample-project.mdx` with exact frontmatter as specified
- ✅ Created `src/lib/mdx.ts` with `getAllProjectSlugs()` and `getProjectBySlug()` exports; `MdxFrontmatter = Omit<ProjectMeta, "slug">` enforces AC3 at build time
- ✅ Created `src/app/projects/[slug]/page.tsx` minimal stub with `generateStaticParams()` and `await params` (Next.js 16 Promise params pattern)
- ✅ `pnpm build` passes with 0 TypeScript errors; `/projects/sample-project` pre-rendered as SSG
- ✅ Dev server verified: sample-project renders title + MDX body; nonexistent slug triggers terminal-style 404; /projects listing unchanged
- ✅ `src/lib/data.ts` and `src/types/project.ts` untouched as required

### File List

- `package.json` (modified — added next-mdx-remote, rehype-pretty-code, shiki)
- `pnpm-lock.yaml` (modified — lockfile updated)
- `content/projects/sample-project.mdx` (new)
- `src/lib/mdx.ts` (new)
- `src/app/projects/[slug]/page.tsx` (new)

## Change Log

- 2026-05-23: Story 4.1 implemented — MDX processing infrastructure added. Installed next-mdx-remote/rehype-pretty-code/shiki, created content/projects/ directory with seed MDX file, implemented src/lib/mdx.ts with getAllProjectSlugs/getProjectBySlug, created minimal [slug]/page.tsx stub. Build passes with 0 errors, all routes verified.
