# Story 8.1: Per-Page Metadata & Canonical URLs

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a **visitor who shares or searches for BaoBao's portfolio**,
I want every page to have accurate title, meta description, and canonical URL metadata,
so that search results and link previews represent the portfolio correctly and each page is uniquely identifiable.

## Acceptance Criteria

1. **Given** `src/lib/metadata.ts` exports a `buildMetadata(page: PageMeta)` helper
   **When** called from each `page.tsx`
   **Then** it returns a Next.js `Metadata` object with `title`, `description`, and `alternates.canonical` populated from the page-specific values and `NEXT_PUBLIC_SITE_URL`

2. **Given** a visitor searches for BaoBao by name on Google
   **When** the home page is indexed
   **Then** the `<title>` is `BaoBao — Full-Stack Engineer` (derived from `site.json` `owner.name` + `owner.title`); the meta description is a concise one-sentence value proposition; the canonical URL matches `NEXT_PUBLIC_SITE_URL`

3. **Given** each page (`/`, `/projects`, `/about`, `/contact`, `/projects/[slug]`) is rendered
   **When** the `<head>` is inspected
   **Then** each page has a unique `<title>` and `<meta name="description">` — no two pages share the same values (FR24); each page has a correct `<link rel="canonical">` pointing to its absolute URL

4. **Given** `generateMetadata()` or `export const metadata` is used in each `page.tsx`
   **When** the implementation is reviewed
   **Then** metadata is generated server-side using the Next.js 16 metadata API exclusively; no `<Head>` component from `next/head` is used anywhere (incompatible with App Router)

5. **Given** `pnpm build` runs after all changes
   **When** build completes
   **Then** 0 TypeScript errors, 0 lint errors; all metadata is generated statically at build time

## Tasks / Subtasks

- [x] **Task 1: Create `src/lib/metadata.ts`** (AC: 1)
  - [x] Define and export `PageMeta` interface with `title: string`, `description: string`, `path: string`
  - [x] Implement and export `buildMetadata(page: PageMeta): Metadata`
  - [x] Read `NEXT_PUBLIC_SITE_URL` from `process.env` with fallback `"http://localhost:3000"` for canonical construction
  - [x] Return `{ title, description, alternates: { canonical: \`${siteUrl}${path}\` } }`
  - [x] Import `Metadata` from `"next"` — no other imports needed in this file

- [x] **Task 2: Update `src/app/layout.tsx` default metadata** (AC: 2, 4)
  - [x] Update existing `export const metadata` — change title from `"BaoBao | Full-Stack Engineer"` to `"BaoBao — Full-Stack Engineer"` (dash not pipe; matches per-page home title)
  - [x] Keep description as-is — it's the root fallback, not shown when pages override
  - [x] Do NOT add a title template (`{ template: "..." }`) — each page provides its complete title via `buildMetadata`
  - [x] Do NOT remove or restructure any existing layout imports, components, or JSX — only the `metadata` export changes

- [x] **Task 3: Add metadata to `src/app/page.tsx` (home)** (AC: 2, 3, 4)
  - [x] Add import: `import { buildMetadata } from "@/lib/metadata";`
  - [x] Add `export const metadata = buildMetadata({ title: "BaoBao — Full-Stack Engineer", description: "Full-stack engineer specialising in React and TypeScript — building interfaces that feel inevitable.", path: "/" });`
  - [x] Place the `export const metadata` line BEFORE the `export default function Home()` declaration
  - [x] Do NOT use `generateMetadata` here — the home title is static, `export const metadata` is correct

- [x] **Task 4: Update `src/app/about/page.tsx`** (AC: 1, 3, 4)
  - [x] Add import: `import { buildMetadata } from "@/lib/metadata";`
  - [x] Replace existing `export const metadata: Metadata = { title: "About | BaoBao", description: "..." }` with `export const metadata = buildMetadata({ title: "About | BaoBao", description: "BaoBao's background, technical skills, and work experience as a full-stack engineer.", path: "/about" });`
  - [x] Remove the now-redundant `import type { Metadata } from "next"` import if `Metadata` is no longer directly referenced in this file (check first — `Metadata` may still be needed for a type annotation)
  - [x] Do NOT modify any JSX, functions, or other exports in this file

- [x] **Task 5: Update `src/app/contact/page.tsx`** (AC: 1, 3, 4)
  - [x] Add import: `import { buildMetadata } from "@/lib/metadata";`
  - [x] Replace existing `export const metadata: Metadata = { title: "Contact | BaoBao", description: "..." }` with `export const metadata = buildMetadata({ title: "Contact | BaoBao", description: "Get in touch with BaoBao — full-stack engineer open to new opportunities.", path: "/contact" });`
  - [x] Remove now-redundant `import type { Metadata } from "next"` if no longer needed
  - [x] Do NOT modify JSX or other code

- [x] **Task 6: Add metadata to `src/app/projects/page.tsx`** (AC: 1, 3, 4)
  - [x] Add import: `import { buildMetadata } from "@/lib/metadata";`
  - [x] Add `export const metadata = buildMetadata({ title: "Projects | BaoBao", description: "A curated selection of full-stack projects built with React, TypeScript, and modern web technologies.", path: "/projects" });`
  - [x] Place `export const metadata` BEFORE `export default function Projects()`
  - [x] Do NOT add `import type { Metadata } from "next"` — `buildMetadata` already returns the correct type

- [x] **Task 7: Update `src/app/projects/[slug]/page.tsx`** (AC: 1, 3, 4)
  - [x] Add import: `import { buildMetadata } from "@/lib/metadata";`
  - [x] In the existing `generateMetadata` function, replace the inline `return { title: ..., description: ..., alternates: { canonical: ... } }` with a call to `buildMetadata`
  - [x] Remove the now-redundant `const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"` line inside `generateMetadata`
  - [x] The updated `generateMetadata` body should be: `return buildMetadata({ title: \`${project.meta.title} | BaoBao\`, description: project.meta.description, path: \`/projects/${slug}\` });`
  - [x] If project not found: `return {};` (keep existing early return — `buildMetadata` should not be called with undefined data)
  - [x] Do NOT change `generateStaticParams`, JSX, or any other function

- [x] **Task 8: Verify build and type correctness** (AC: 5)
  - [x] Run `pnpm build` — expect 0 TypeScript errors, 0 lint errors
  - [x] Confirm each page head contains unique `<title>` and `<meta name="description">` by running `pnpm dev` and inspecting with browser DevTools
  - [x] Confirm `<link rel="canonical">` is present on each page with correct absolute URL

## Dev Notes

### What This Story Creates vs What Already Exists

| Status           | Asset                                   | Notes                                                                                                                  |
| ---------------- | --------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| **NEW — CREATE** | `src/lib/metadata.ts`                   | `buildMetadata` helper + `PageMeta` interface. Thin utility — no imports beyond `"next"`.                              |
| **UPDATE**       | `src/app/layout.tsx`                    | Only the `export const metadata` title string changes. ALL other code (components, JSX, imports) is preserved exactly. |
| **UPDATE (add)** | `src/app/page.tsx`                      | Currently has NO metadata export. Add `export const metadata = buildMetadata(...)` before `export default function`.   |
| **UPDATE**       | `src/app/about/page.tsx`                | Has metadata but no canonical. Replace with `buildMetadata` call.                                                      |
| **UPDATE**       | `src/app/contact/page.tsx`              | Has metadata but no canonical. Replace with `buildMetadata` call.                                                      |
| **UPDATE (add)** | `src/app/projects/page.tsx`             | Currently has NO metadata export. Add `export const metadata = buildMetadata(...)`.                                    |
| **UPDATE**       | `src/app/projects/[slug]/page.tsx`      | Has `generateMetadata` but builds canonical inline. Refactor to use `buildMetadata`.                                   |
| **NO CHANGE**    | `src/lib/data.ts`                       | `getSiteConfig()` is NOT called inside `buildMetadata` — titles are passed as strings by each page.                    |
| **NO CHANGE**    | All components, hooks, types, CSS files | Zero component changes in this story.                                                                                  |

### Critical Architecture Rules for This Story

**Rule 1: `NEXT_PUBLIC_SITE_URL` is the ONLY source for canonical URLs**

- `buildMetadata` reads `process.env.NEXT_PUBLIC_SITE_URL` internally — never hardcode domain strings
- The fallback `"http://localhost:3000"` ensures local dev doesn't break
- In production Vercel, `NEXT_PUBLIC_SITE_URL` is set to the live domain — this is already configured per ARC2

**Rule 2: No `<Head>` from `next/head` — EVER**

- The App Router uses the `metadata` export and `generateMetadata` — NOT `next/head`
- Using `next/head` in App Router is broken/deprecated
- All existing pages already follow this rule; maintain it

**Rule 3: Named exports only**

- `buildMetadata` → `export function buildMetadata(...)` ✅
- `PageMeta` → `export interface PageMeta` ✅
- No default exports in `metadata.ts` (ARC8)

**Rule 4: `"use client"` — do NOT add**

- `src/lib/metadata.ts` is a pure server utility — no `"use client"`
- `export const metadata` and `generateMetadata` are Next.js server conventions — they only work in Server Components (which all these `page.tsx` files already are)

**Rule 5: No barrel files**

- Do NOT create `src/lib/index.ts` or `src/app/metadata/index.ts` (ARC8)

### Exact Implementation: `src/lib/metadata.ts`

```typescript
import type { Metadata } from "next";

export interface PageMeta {
  /** Full page title — e.g. "BaoBao — Full-Stack Engineer" or "About | BaoBao" */
  title: string;
  /** Concise one-sentence description for <meta name="description"> */
  description: string;
  /** Absolute path for canonical URL — e.g. "/", "/about", "/projects/my-project" */
  path: string;
}

export function buildMetadata({
  title,
  description,
  path,
}: PageMeta): Metadata {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  return {
    title,
    description,
    alternates: {
      canonical: `${siteUrl}${path}`,
    },
  };
}
```

### Exact Change: `src/app/layout.tsx` (metadata only)

```typescript
// BEFORE:
export const metadata: Metadata = {
  title: "BaoBao | Full-Stack Engineer",
  description:
    "Full-stack engineer portfolio — projects, experience, and contact.",
};

// AFTER:
export const metadata: Metadata = {
  title: "BaoBao — Full-Stack Engineer",
  description:
    "Full-stack engineer portfolio — projects, experience, and contact.",
};
```

Only the title string changes (pipe → em-dash, consistent with home page). The `Metadata` type import stays. Nothing else in `layout.tsx` changes.

### Exact Change: `src/app/page.tsx` (add metadata export)

```typescript
// ADD this import at the top (after existing imports):
import { buildMetadata } from "@/lib/metadata";

// ADD this before export default function Home():
export const metadata = buildMetadata({
  title: "BaoBao — Full-Stack Engineer",
  description:
    "Full-stack engineer specialising in React and TypeScript — building interfaces that feel inevitable.",
  path: "/",
});
```

`page.tsx` already calls `getSiteConfig()` — do NOT use `getSiteConfig()` in metadata here, just use the static strings above (the description is derived from site.json data but written as a static string).

### Exact Change: `src/app/about/page.tsx`

```typescript
// ADD import:
import { buildMetadata } from "@/lib/metadata";

// REPLACE:
export const metadata: Metadata = {
  title: "About | BaoBao",
  description:
    "BaoBao's background, technical skills, and work experience as a full-stack engineer.",
};

// WITH:
export const metadata = buildMetadata({
  title: "About | BaoBao",
  description:
    "BaoBao's background, technical skills, and work experience as a full-stack engineer.",
  path: "/about",
});
```

After this change, check if `import type { Metadata } from "next"` is still needed. If the `Metadata` type is not referenced anywhere else in the file, remove it. If it is referenced (e.g., a type annotation), keep it.

### Exact Change: `src/app/contact/page.tsx`

```typescript
// ADD import:
import { buildMetadata } from "@/lib/metadata";

// REPLACE:
export const metadata: Metadata = {
  title: "Contact | BaoBao",
  description:
    "Get in touch with BaoBao — full-stack engineer open to new opportunities.",
};

// WITH:
export const metadata = buildMetadata({
  title: "Contact | BaoBao",
  description:
    "Get in touch with BaoBao — full-stack engineer open to new opportunities.",
  path: "/contact",
});
```

### Exact Change: `src/app/projects/page.tsx`

```typescript
// ADD import (new line at top):
import { buildMetadata } from "@/lib/metadata";

// ADD before export default function Projects():
export const metadata = buildMetadata({
  title: "Projects | BaoBao",
  description:
    "A curated selection of full-stack projects built with React, TypeScript, and modern web technologies.",
  path: "/projects",
});
```

The existing imports (`SectionLayout`, `ProjectCard`, `getProjects`, `AnimatedSection`) stay unchanged.

### Exact Change: `src/app/projects/[slug]/page.tsx`

```typescript
// ADD import (after existing imports):
import { buildMetadata } from "@/lib/metadata";

// REPLACE the existing generateMetadata body:
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) return {};

  // REMOVE: const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  return buildMetadata({
    title: `${project.meta.title} | BaoBao`,
    description: project.meta.description,
    path: `/projects/${slug}`,
  });
}
```

The `if (!project) return {}` early return stays exactly as-is. Only the `return` statement changes. `generateStaticParams` is untouched.

### Current Metadata Audit (What Exists vs What Changes)

| File                       | Current Title                   | Current Canonical | After Story                                    |
| -------------------------- | ------------------------------- | ----------------- | ---------------------------------------------- |
| `layout.tsx`               | "BaoBao \| Full-Stack Engineer" | ❌ None           | "BaoBao — Full-Stack Engineer" (fallback only) |
| `page.tsx` (home)          | ❌ None (uses layout default)   | ❌ None           | "BaoBao — Full-Stack Engineer" + canonical `/` |
| `about/page.tsx`           | "About \| BaoBao"               | ❌ None           | "About \| BaoBao" + canonical `/about`         |
| `contact/page.tsx`         | "Contact \| BaoBao"             | ❌ None           | "Contact \| BaoBao" + canonical `/contact`     |
| `projects/page.tsx`        | ❌ None (uses layout default)   | ❌ None           | "Projects \| BaoBao" + canonical `/projects`   |
| `projects/[slug]/page.tsx` | `${title} \| BaoBao` ✅         | ✅ Has canonical  | Same + uses `buildMetadata` (refactor)         |

### Title Uniqueness Verification

All page titles after this story:

- `/` → `BaoBao — Full-Stack Engineer`
- `/about` → `About | BaoBao`
- `/contact` → `Contact | BaoBao`
- `/projects` → `Projects | BaoBao`
- `/projects/[slug]` → `{Project Title} | BaoBao`

All unique ✅ — FR24 satisfied.

### Why `getSiteConfig()` Is NOT Used in `buildMetadata`

`buildMetadata` is a pure utility function. It deliberately does NOT call `getSiteConfig()` because:

1. It would create a hidden dependency on the data layer from a presentation utility
2. Titles are domain-specific per page — there's no generic formula that works for all 5 pages
3. `getSiteConfig()` already works in the `page.tsx` components themselves if needed
4. The owner name "BaoBao" in titles is stable metadata — treating it as a config value adds unnecessary indirection for zero benefit

The title strings passed to `buildMetadata` are the source of truth for SEO titles. They can be updated in the page file if the owner rebrands, just like any other content change.

### Next.js 16 Metadata API — Critical Notes

- `export const metadata: Metadata = {...}` → static metadata (correct for all pages except `[slug]`)
- `export async function generateMetadata(...)` → dynamic metadata (required for `[slug]` because it reads slug from params)
- Both are **server-side only** — they run at build time for SSG
- `alternates.canonical` → generates `<link rel="canonical" href="...">` in `<head>`
- `title` as a plain string → sets `<title>` directly (no template processing)
- The metadata exported from a page **overrides** the layout's metadata for that page
- App Router **does not** support `<Head>` from `next/head` — the metadata API replaces it entirely

### Import Order Compliance (ARC enforcement)

New imports go in this order per architecture:

1. `import type { Metadata } from "next"` ← if kept
2. `import { buildMetadata } from "@/lib/metadata"` ← add here (after Next.js, before components)

In `metadata.ts` itself:

1. `import type { Metadata } from "next"` ← only import needed

### Project Structure Notes

- `src/lib/metadata.ts` follows the pattern: `camelCase.ts` utility in `src/lib/` (same as `data.ts`, `mdx.ts`, `qr.ts`)
- Named exports only, no default exports
- No barrel file (`src/lib/index.ts`) — direct imports via `@/lib/metadata`
- File is pure TypeScript (no `.tsx`) — no JSX in this utility

### References

- Epic 8 Story 8.1 requirements: [\_bmad-output/planning-artifacts/epics.md](../../_bmad-output/planning-artifacts/epics.md) (line ~907)
- Architecture SEO decision: [\_bmad-output/planning-artifacts/architecture.md](../../_bmad-output/planning-artifacts/architecture.md) — "SEO & Metadata" section
- ARC2 (canonical URL env var): epics.md line ~79
- ARC8 (named exports, no barrels): epics.md line ~86
- FR24 (unique page titles/descriptions): epics.md line ~48
- NFR7 (static generation): epics.md NFR section
- Existing `projects/[slug]/page.tsx` pattern to refactor: [src/app/projects/[slug]/page.tsx](../../src/app/projects/%5Bslug%5D/page.tsx)
- `getSiteConfig()` implementation: [src/lib/data.ts](../../src/lib/data.ts) — confirms `siteUrl` comes from env var

## Dev Agent Record

### Agent Model Used

Claude Sonnet 4.6

### Debug Log References

### Completion Notes List

- Created `src/lib/metadata.ts` with `PageMeta` interface and `buildMetadata` helper — pure server utility, named exports, no default export, no barrel file.
- Updated `src/app/layout.tsx`: title changed from pipe to em-dash (`BaoBao — Full-Stack Engineer`) — only the `metadata` export changed.
- Updated `src/app/page.tsx`: added `buildMetadata` import and `export const metadata` (static) before `export default function Home()`.
- Updated `src/app/about/page.tsx`: replaced `export const metadata: Metadata` with `buildMetadata` call; removed now-redundant `import type { Metadata } from "next"`.
- Updated `src/app/contact/page.tsx`: same pattern as about — replaced inline metadata with `buildMetadata`; removed redundant Metadata import.
- Updated `src/app/projects/page.tsx`: added `buildMetadata` import and `export const metadata` (static) — no Metadata type import needed.
- Updated `src/app/projects/[slug]/page.tsx`: added `buildMetadata` import; refactored `generateMetadata` return to use `buildMetadata`; removed inline `siteUrl` variable.
- `pnpm build` passed: 0 TypeScript errors, 0 lint errors, all 6 routes generated statically.
- All 5 pages have unique titles and canonical URLs (FR24 satisfied). `NEXT_PUBLIC_SITE_URL` is the single source for canonical domain (ARC2). No `next/head` used (App Router compliant).

### File List

- src/lib/metadata.ts (created)
- src/app/layout.tsx (modified)
- src/app/page.tsx (modified)
- src/app/about/page.tsx (modified)
- src/app/contact/page.tsx (modified)
- src/app/projects/page.tsx (modified)
- src/app/projects/[slug]/page.tsx (modified)

## Change Log

- 2026-05-26: Implemented story 8-1 — created `buildMetadata` helper, added canonical URLs and unique titles to all 5 pages, refactored `projects/[slug]` to use helper. Build: 0 errors.
