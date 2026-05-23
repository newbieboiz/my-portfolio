# Story 4.2: Project Detail Page

Status: done

## Story

As a **visitor (recruiter or freelance client)**,
I want to read a structured case study for each project,
so that I can understand the problem BaoBao solved, how they approached it, and what the result was — in under 15 seconds of scanning.

## Acceptance Criteria

1. **Given** a visitor navigates to `/projects/[slug]`
   **When** the page renders
   **Then** the project detail page shows: project title at h1 scale, tech stack `Badge` components, and the MDX body rendered with the full `ProjectDetail` layout (UX-DR19)

2. **Given** the MDX body renders
   **When** a visitor scans the case study
   **Then** content is structured with visible section headings (Problem, Approach, Result); prose is constrained to max-width 680px for comfortable monospace reading; the page is scannable in < 15 seconds

3. **Given** the MDX body contains a code block
   **When** it renders
   **Then** the code block has syntax highlighting from Shiki (`github-dark` theme); background is `--bg-secondary` (#12121A); code is readable against the dark palette; no inline `background-color` style overrides the design token

4. **Given** Next.js static generation runs
   **When** `generateStaticParams()` is called for `/projects/[slug]`
   **Then** all slugs from `getAllProjectSlugs()` are pre-rendered as static pages at build time; no server runtime is required to serve project pages

5. **Given** a visitor navigates to a project slug that does not exist
   **When** the page would render
   **Then** `notFound()` is called and the custom 404 page (`src/app/not-found.tsx`) renders with terminal-style messaging (UX-DR16)

6. **Given** the page renders
   **When** the `<head>` is inspected
   **Then** the page has a unique `<title>` combining the project name and site name (`{project.title} | BaoBao`), a unique meta description from MDX frontmatter `description` field, and a canonical URL sourced from `NEXT_PUBLIC_SITE_URL` (FR24)

## Tasks / Subtasks

- [x] **Task 1: Update `src/app/projects/[slug]/page.tsx` with full ProjectDetail layout** (AC: 1, 2, 4, 5, 6)
  - [x] Add `import type { Metadata } from "next"` and `import Link from "next/link"` at the top
  - [x] Add `import { SectionLayout } from "@/components/SectionLayout"` and `import { Badge } from "@/components/Badge"`
  - [x] Add `generateMetadata()` async function that awaits `params`, calls `getProjectBySlug(slug)`, and returns title, description, and canonical URL from `NEXT_PUBLIC_SITE_URL`
  - [x] Replace the existing `return (...)` block in `ProjectDetailPage` with the full layout (see Dev Notes for exact implementation)
  - [x] **CRITICAL**: Do NOT add a `<main>` wrapper — root layout (`src/app/layout.tsx`) already provides `<main id="main-content">`. The existing stub's `<main>` must be removed.
  - [x] Preserve `generateStaticParams()` exactly as-is — it is already correct from Story 4.1
  - [x] Preserve `Props` interface (`params: Promise<{ slug: string }>`) — Next.js 16 pattern, do not change
  - [x] Preserve `notFound()` call on missing project

- [x] **Task 2: Add MDX prose CSS styles to `src/app/globals.css`** (AC: 2, 3)
  - [x] Append a clearly labelled section `/* MDX PROSE STYLES */` after the existing `@media (prefers-reduced-motion)` block at the end of the file
  - [x] Add `.mdx-prose` base styles, heading styles (h2, h3), paragraph, list, link, inline code, pre/code block, hr, and blockquote styles (see Dev Notes for exact CSS)
  - [x] Ensure `pre` background uses `var(--bg-secondary)` — this is where `keepBackground: false` in mdx.ts makes the design token the sole source of truth

- [x] **Task 3: Verify build and routes** (AC: 1–6)
  - [x] Run `pnpm build` — expect 0 TypeScript errors; build log shows `/projects/[slug]` pre-rendered for `sample-project`
  - [x] Run `pnpm dev` → navigate to `http://localhost:3000/projects/sample-project` — full ProjectDetail layout renders with title, badges, back-link, and styled MDX body
  - [x] Run `pnpm dev` → navigate to `http://localhost:3000/projects/nonexistent` — terminal-style 404 renders correctly
  - [x] Run `pnpm dev` → navigate to `http://localhost:3000/projects` — existing project listing page renders **unchanged**
  - [x] Verify `<head>` in browser DevTools: title shows `Sample Project | BaoBao`, description is set, canonical URL is set

## Dev Notes

### What Exists vs What This Story Builds

| Status                            | Asset                                    | Location                              | Notes                                                                                                                                                  |
| --------------------------------- | ---------------------------------------- | ------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **EXISTS — replace return block** | `ProjectDetailPage` page stub            | `src/app/projects/[slug]/page.tsx`    | Scaffold from Story 4.1. Replace `return` block, add `generateMetadata()`. Keep `generateStaticParams`, `Props`, `notFound`.                           |
| **EXISTS — do NOT modify**        | `getAllProjectSlugs`, `getProjectBySlug` | `src/lib/mdx.ts`                      | MDX processing is complete. `rehype-pretty-code` already configured with `keepBackground: false`.                                                      |
| **EXISTS — do NOT modify**        | `ProjectMeta` interface                  | `src/types/project.ts`                | Already the correct shape. `slug`, `title`, `description`, `techStack`, `outcome`, `isFeatured`, `startDate`, `endDate?`, `projectUrl?`, `githubUrl?`. |
| **EXISTS — reuse**                | `SectionLayout`                          | `src/components/SectionLayout.tsx`    | Use with `prose={true}` → wraps children in `max-w-prose` (680px). Uses h2 internally for `// label`.                                                  |
| **EXISTS — reuse**                | `Badge`                                  | `src/components/Badge.tsx`            | `label` + optional `category` prop. Use for `techStack` array.                                                                                         |
| **EXISTS — do NOT modify**        | Root layout with `<main>`                | `src/app/layout.tsx`                  | Provides `<main id="main-content">`. Page must NOT add another `<main>`.                                                                               |
| **UPDATE**                        | `globals.css`                            | `src/app/globals.css`                 | Append `.mdx-prose` styles at end. Do not modify existing rules.                                                                                       |
| **EXISTS — seed MDX**             | `sample-project.mdx`                     | `content/projects/sample-project.mdx` | Contains h2 headings (Problem, Approach, Result) and a fenced code block — good test coverage.                                                         |

### CRITICAL BUG IN EXISTING STUB — Fix Required

The Story 4.1 stub returns `<main className="...">` as its root element:

```tsx
// ❌ EXISTING STUB — THIS IS WRONG
return <main className="px-space-8 py-space-8 w-full">...</main>;
```

This creates **nested `<main>` elements** because `src/app/layout.tsx` already provides `<main id="main-content">`. Nested `<main>` is invalid HTML and a WCAG 2.1 failure (Technique H88).

**Fix:** Remove the `<main>` wrapper and use `SectionLayout` as the root return:

```tsx
// ✅ CORRECT — Story 4.2 replacement
return (
  <SectionLayout id="project-detail" label="project detail" prose>
    ...
  </SectionLayout>
);
```

### Exact Implementation: `src/app/projects/[slug]/page.tsx` — FULL REPLACEMENT

```tsx
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Badge } from "@/components/Badge";
import { SectionLayout } from "@/components/SectionLayout";
import { getAllProjectSlugs, getProjectBySlug } from "@/lib/mdx";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = await getAllProjectSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) return {};

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  return {
    title: `${project.meta.title} | BaoBao`,
    description: project.meta.description,
    alternates: {
      canonical: `${siteUrl}/projects/${slug}`,
    },
  };
}

export default async function ProjectDetailPage({ params }: Props) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) notFound();

  return (
    <SectionLayout id="project-detail" label="project detail" prose>
      {/* Back navigation */}
      <div className="mb-space-6">
        <Link
          href="/projects"
          className="text-text-tertiary hover:text-accent focus-visible:ring-accent focus-visible:ring-offset-bg-primary text-small duration-micro rounded font-mono transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
        >
          ← back to projects
        </Link>
      </div>

      {/* Project title */}
      <h1 className="mb-space-4 text-h1 leading-h1 tracking-heading text-text-primary font-bold">
        {project.meta.title}
      </h1>

      {/* One-line description */}
      <p className="mb-space-6 text-body leading-body text-text-secondary">
        {project.meta.description}
      </p>

      {/* Tech stack badges */}
      <div className="mb-space-8 gap-space-2 flex flex-wrap">
        {project.meta.techStack.map((tech) => (
          <Badge key={tech} label={tech} />
        ))}
      </div>

      {/* External links — only rendered when frontmatter provides URLs */}
      {(project.meta.projectUrl ?? project.meta.githubUrl) && (
        <div className="mb-space-8 gap-space-4 flex flex-wrap">
          {project.meta.projectUrl && (
            <a
              href={project.meta.projectUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`View ${project.meta.title} project (opens in new tab)`}
              className="text-accent hover:text-accent-hover focus-visible:ring-accent focus-visible:ring-offset-bg-primary text-small duration-micro rounded font-mono transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
            >
              View Project ↗
            </a>
          )}
          {project.meta.githubUrl && (
            <a
              href={project.meta.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`GitHub repository for ${project.meta.title} (opens in new tab)`}
              className="text-text-secondary hover:text-accent focus-visible:ring-accent focus-visible:ring-offset-bg-primary text-small duration-micro rounded font-mono transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
            >
              GitHub ↗
            </a>
          )}
        </div>
      )}

      {/* MDX prose content */}
      <div className="mdx-prose">{project.content}</div>
    </SectionLayout>
  );
}
```

**Import order follows architecture convention** [Source: architecture.md#Naming Patterns]:

1. `next` imports (Metadata, Link, navigation)
2. `@/components/` imports (alphabetical)
3. `@/lib/` imports

**`generateMetadata` notes:**

- Next.js deduplicates `getProjectBySlug(slug)` calls within a single build pass for the same slug — calling it in both `generateMetadata` and the page function is correct SSG practice
- Returns `{}` for unknown slugs (graceful — `notFound()` in the page handles the 404 response)
- `NEXT_PUBLIC_SITE_URL` fallback to `"http://localhost:3000"` for local dev

### Exact Implementation: `.mdx-prose` CSS — Append to `globals.css`

Append after the final closing `}` of the `@media (prefers-reduced-motion)` block:

```css
/* ─────────────────────────────────────────────
   MDX PROSE STYLES
   Targets rendered MDX HTML elements inside .mdx-prose
   Code blocks: styled by rehype-pretty-code + Shiki (github-dark)
   keepBackground: false in mdx.ts means pre bg = var(--bg-secondary)
   ──────────────────────────────────────────── */

.mdx-prose {
  color: var(--text-secondary);
  font-size: 1rem;
  line-height: var(--leading-body);
}

.mdx-prose h2 {
  color: var(--text-primary);
  font-size: var(--text-h2);
  font-weight: 600;
  letter-spacing: var(--tracking-heading);
  line-height: var(--leading-h2);
  margin-bottom: var(--space-4);
  margin-top: var(--space-12);
}

.mdx-prose h3 {
  color: var(--text-primary);
  font-size: var(--text-h3);
  font-weight: 600;
  letter-spacing: var(--tracking-heading);
  line-height: var(--leading-h3);
  margin-bottom: var(--space-3);
  margin-top: var(--space-8);
}

.mdx-prose p {
  margin-bottom: var(--space-4);
}

.mdx-prose ul,
.mdx-prose ol {
  margin-bottom: var(--space-4);
  padding-left: var(--space-6);
}

.mdx-prose ul {
  list-style-type: disc;
}

.mdx-prose ol {
  list-style-type: decimal;
}

.mdx-prose li {
  margin-bottom: var(--space-2);
}

.mdx-prose a {
  color: var(--accent);
  text-decoration: underline;
  text-underline-offset: 3px;
}

.mdx-prose a:hover {
  color: var(--accent-hover);
}

/* Inline code — backtick spans (not inside pre) */
.mdx-prose code:not(pre > code) {
  background-color: var(--bg-tertiary);
  border-radius: 4px;
  color: var(--accent);
  font-family: inherit;
  font-size: var(--text-code);
  padding: 2px 6px;
}

/* Code block container — rehype-pretty-code targets <figure> or <pre> */
.mdx-prose pre {
  background-color: var(--bg-secondary);
  border: 1px solid var(--border-subtle);
  border-radius: 8px;
  font-size: var(--text-code);
  line-height: var(--leading-code);
  margin-bottom: var(--space-6);
  overflow-x: auto;
  padding: var(--space-6);
}

.mdx-prose pre > code {
  background-color: transparent;
  color: inherit;
  padding: 0;
}

.mdx-prose hr {
  border: none;
  border-top: 1px solid var(--border-subtle);
  margin: var(--space-8) 0;
}

.mdx-prose blockquote {
  border-left: 2px solid var(--accent);
  color: var(--text-tertiary);
  font-style: italic;
  margin-bottom: var(--space-4);
  padding-left: var(--space-4);
}
```

### Architecture Compliance Checklist

- [x] No `"use client"` — this is a Server Component; MDX content is pre-compiled by `next-mdx-remote/rsc` at build time
- [x] No `<main>` wrapper — root layout provides `<main id="main-content">` already (see CRITICAL BUG section above)
- [x] Named export for page function; default export is required only for page routes per Next.js convention — page.tsx uses default export (architecture exception, ARC8)
- [x] Import order follows ESLint convention: Next.js → third-party → `@/components/` → `@/lib/` → `@/types/` (ARC8)
- [x] `@/` import alias only — no relative paths climbing more than one level (ARC8)
- [x] No `any` types — all types inferred from `ProjectMeta` and Next.js `Metadata` (ARC6)
- [x] `SectionLayout` provides section aria label and id — accessibility compliance (UX-DR12)
- [x] External links: `target="_blank" rel="noopener noreferrer"` + descriptive `aria-label` (FR23, NFR16)
- [x] Focus ring: `focus-visible:ring-accent` + `focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none` pattern consistent with other pages (UX-DR12)
- [x] Transitions: `transition-colors duration-micro` (150ms, from motion token) (UX-DR13)

### How `SectionLayout` Works — Prevents Misuse

```tsx
// SectionLayout renders:
// <section id={id} aria-labelledby={`${id}-heading`}>
//   <div className="max-w-content mx-auto">
//     <h2 id={`${id}-heading`} className="...">// {label}</h2>
//     {prose ? <div className="max-w-prose">{children}</div> : children}
//   </div>
// </section>
```

With `prose={true}`, all children receive 680px max-width — this covers the back-link, h1 title, description, badges, links, AND the MDX prose body. This matches UX-DR19 ("prose max-width 680px").

The internal SectionLayout `h2` becomes `// project detail` (the coding-vibe section label). The project title is then an `h1` (major content heading). This heading hierarchy (h1 inside section with h2 label) is semantically valid — the `<section>` has its own accessible name via `aria-labelledby` pointing to the h2.

### `rehype-pretty-code` Output Structure

`rehype-pretty-code` wraps syntax-highlighted code blocks in this structure:

```html
<figure data-rehype-pretty-code-figure>
  <pre data-language="ts">
    <code data-language="ts">
      <!-- Shiki-highlighted token spans -->
    </code>
  </pre>
</figure>
```

The `.mdx-prose pre` CSS rule targets the `<pre>` inside this figure. `keepBackground: false` in `mdx.ts` ensures Shiki does NOT inject `style="background-color: ..."` on `<pre>`, so the design token `var(--bg-secondary)` is the sole background source. Without `keepBackground: false`, Shiki's inline style would override the CSS and break the design token system.

### Previous Story Learnings from 4.1

- `params` is a `Promise<{ slug: string }>` in Next.js 16 — must `await params` before destructuring. Already correct in the stub; must preserve this pattern.
- `next-mdx-remote` v6 is installed (`"next-mdx-remote": "^6.0.0"`). The import `compileMDX` from `"next-mdx-remote/rsc"` is a Server Component API — no changes needed.
- `getProjectBySlug` returns `null` for missing files (not throws). The `notFound()` guard handles this.
- Do NOT modify `src/types/project.ts` — `ProjectMeta` already has all required fields.
- Do NOT modify `src/lib/mdx.ts` — MDX processing is complete and working.
- Do NOT add `withMDX` to `next.config.ts` — `next-mdx-remote` reads MDX as plain strings, no config changes needed.

### MDX Frontmatter Available Fields

From `src/types/project.ts` (reference only — do not modify):

```ts
interface ProjectMeta {
  slug: string; // injected from filename, NOT in frontmatter
  title: string; // required — used as page h1 and <title>
  description: string; // required — used as meta description
  techStack: string[]; // required — rendered as Badge components
  outcome: string; // required — available if needed in layout
  isFeatured: boolean; // frontmatter field
  startDate: string; // ISO 8601 — available if needed
  endDate?: string; // optional — available if needed
  projectUrl?: string; // optional — rendered as "View Project ↗" link
  githubUrl?: string; // optional — rendered as "GitHub ↗" link
}
```

### Design Tokens Used in This Story

| Token                                     | Value             | Usage                                        |
| ----------------------------------------- | ----------------- | -------------------------------------------- |
| `text-h1`                                 | 2.625rem          | Project title font size                      |
| `leading-h1`                              | 1.15              | Project title line height                    |
| `tracking-heading`                        | -0.02em           | Project title letter spacing                 |
| `text-body` / `leading-body`              | 1rem / 1.6        | Description + MDX prose                      |
| `text-small`                              | 0.875rem          | Back-link, external link labels              |
| `text-xs` / `tracking-badge`              | 0.75rem / 0.04em  | Badge text (handled by Badge component)      |
| `text-text-primary`                       | #E8E8ED           | Headings, project title                      |
| `text-text-secondary`                     | #A0A0B0           | Description, MDX body                        |
| `text-text-tertiary`                      | #6B6B80           | Back-link default state                      |
| `text-accent` / `hover:text-accent-hover` | #00DC82 / #00FF96 | Links hover, badge accent, View Project link |
| `bg-bg-secondary`                         | #12121A           | Code block background (via `.mdx-prose pre`) |
| `bg-bg-tertiary`                          | #1A1A25           | Inline code background                       |
| `border-border-subtle`                    | #2A2A3A           | Code block border, `<hr>`                    |
| `duration-micro`                          | 150ms             | Hover transition on links                    |
| `space-*`                                 | 4px grid          | All spacing                                  |

### Project Structure Notes

- File being modified: `src/app/projects/[slug]/page.tsx` — UPDATE (exists from 4.1)
- File being modified: `src/app/globals.css` — UPDATE (append `.mdx-prose` styles)
- No new files, no new dependencies, no config changes
- `@tailwindcss/typography` (prose plugin) is NOT installed and NOT needed — we use custom `.mdx-prose` CSS with design tokens directly

### References

- [Source: epics.md#Story 4.2] — Acceptance criteria
- [Source: epics.md#Epic 4] — Epic context and UX-DR19 requirement
- [Source: architecture.md#Naming Patterns] — Import order, naming conventions
- [Source: architecture.md#Frontend Architecture] — Server Component default, `"use client"` rules
- [Source: architecture.md#Project Structure] — File placement, no barrel files
- [Source: ux-design-specification.md#UX-DR19] — ProjectDetail layout: prose max-width 680px, structured sections
- [Source: implementation-artifacts/4-1-mdx-processing-infrastructure.md] — MDX infrastructure, `keepBackground: false`, stub implementation to replace

## Dev Agent Record

### Agent Model Used

Claude Sonnet 4.6

### Debug Log References

_None._

### Completion Notes List

- Replaced the Story 4.1 stub in `src/app/projects/[slug]/page.tsx` with the full ProjectDetail layout using `SectionLayout` (prose=true), removing the invalid nested `<main>` wrapper.
- Added `generateMetadata()` exporting unique `<title>`, `description`, and canonical URL sourced from `NEXT_PUBLIC_SITE_URL`.
- Appended `.mdx-prose` CSS block to `src/app/globals.css` covering all prose element types; `pre` background uses `var(--bg-secondary)` consistent with `keepBackground: false` in `mdx.ts`.
- Build: 0 TypeScript errors; `/projects/[slug]` SSG pre-renders `sample-project`.
- Routes verified: `/projects/sample-project` → 200, `/projects/nonexistent` → 404, `/projects` → 200 (unchanged).
- `<title>Sample Project | BaoBao</title>` confirmed in page HTML.

### File List

- `src/app/projects/[slug]/page.tsx` — modified (full replacement of stub)
- `src/app/globals.css` — modified (appended `.mdx-prose` styles)
- `_bmad-output/implementation-artifacts/sprint-status.yaml` — modified (status updates)

### Change Log

- 2026-05-23: Implemented Story 4.2 — replaced project detail page stub with full `ProjectDetail` layout; added `generateMetadata()` for SEO; appended `.mdx-prose` CSS styles to globals.css (Date: 2026-05-23)
