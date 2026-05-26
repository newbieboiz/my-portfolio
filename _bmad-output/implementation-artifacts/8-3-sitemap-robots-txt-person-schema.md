# Story 8.3: Sitemap, Robots.txt & Person Schema

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a **search engine crawler**,
I want a sitemap, robots.txt, and structured data markup,
so that BaoBao's portfolio is correctly indexed and name-based searches surface the portfolio prominently.

## Acceptance Criteria

1. **Given** `src/app/sitemap.ts` is implemented using the Next.js file convention  
   **When** a crawler requests `/sitemap.xml`  
   **Then** it returns a valid XML sitemap containing all static routes (`/`, `/projects`, `/about`, `/contact`) plus all project detail URLs (`/projects/[slug]` for each slug from `getAllProjectSlugs()`); all URLs use the absolute `NEXT_PUBLIC_SITE_URL` base (FR26)

2. **Given** `src/app/robots.ts` is implemented  
   **When** a crawler requests `/robots.txt`  
   **Then** it returns `User-agent: *`, `Allow: /`, and `Sitemap: ${NEXT_PUBLIC_SITE_URL}/sitemap.xml` — no pages are disallowed (FR26)

3. **Given** the home page renders  
   **When** the `<head>` is inspected for structured data  
   **Then** a `<script type="application/ld+json">` tag contains a valid `Person` schema with `name`, `url`, `email`, `sameAs` (social profile URLs from `site.json`), and `jobTitle`; the schema validates without errors in Google's Rich Results Test (FR27)

4. **Given** the sitemap and robots files are generated  
   **When** `pnpm build` runs  
   **Then** both files are generated statically at build time using the Next.js file convention — no runtime API calls required; Vercel deploys them as static assets (NFR7)

## Tasks / Subtasks

- [x] **Task 1: Create `src/app/sitemap.ts`** (AC: 1, 4)
  - [x] Export a default async function following the `MetadataRoute.Sitemap` type from `next`
  - [x] Read `NEXT_PUBLIC_SITE_URL` with `"http://localhost:3000"` fallback — this is the canonical base
  - [x] Include all 4 static routes: `/`, `/projects`, `/about`, `/contact` — each with absolute URL
  - [x] Call `getAllProjectSlugs()` from `@/lib/mdx` to enumerate dynamic project routes
  - [x] Add each project as `${siteUrl}/projects/${slug}` to the sitemap entries
  - [x] Set `lastModified` to `new Date()` for all entries (standard practice, build-time value)
  - [x] Set `changeFrequency` to `"monthly"` for project detail pages, `"weekly"` for home/projects listing
  - [x] Set `priority` to `1` for home, `0.8` for projects/about/contact, `0.6` for individual project pages

- [x] **Task 2: Create `src/app/robots.ts`** (AC: 2, 4)
  - [x] Export a default function following the `MetadataRoute.Robots` type from `next`
  - [x] Return a robots object with `rules: { userAgent: "*", allow: "/" }` and `sitemap` set to `${NEXT_PUBLIC_SITE_URL}/sitemap.xml`
  - [x] Read `NEXT_PUBLIC_SITE_URL` with `"http://localhost:3000"` fallback
  - [x] No disallow rules — all pages are publicly indexable

- [x] **Task 3: Add Person schema JSON-LD to home page** (AC: 3)
  - [x] In `src/app/page.tsx`, read `getSiteConfig()` (already imported — zero new imports needed)
  - [x] Build the Person schema object inline with: `@context`, `@type: "Person"`, `name`, `url`, `email`, `jobTitle`, `sameAs` array
  - [x] Render it as `<script type="application/ld+json">{JSON.stringify(personSchema)}</script>` inside the returned JSX
  - [x] Place the `<script>` tag as the **first child** of the outermost `<>` fragment (before `SectionLayout`)
  - [x] Use `dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}` — this is the correct Next.js App Router pattern for inline JSON-LD
  - [x] All values sourced from `siteConfig` (already loaded in the component) and `NEXT_PUBLIC_SITE_URL` via `siteConfig.siteUrl`

- [x] **Task 4: Verify build and output** (AC: 4)
  - [x] Run `pnpm build` — expect 0 TypeScript errors, 0 lint errors
  - [x] Verify `/sitemap.xml` is generated in `.next/server/app/` directory after build
  - [x] Verify `/robots.txt` is generated in `.next/server/app/` directory after build
  - [x] Run `pnpm dev` and visit `/sitemap.xml` and `/robots.txt` in browser to confirm content
  - [x] Inspect home page `<head>` in DevTools to confirm `<script type="application/ld+json">` is present with correct `Person` data

## Dev Notes

### What This Story Creates vs What Already Exists

| Status           | Asset                      | Notes                                                                                                                   |
| ---------------- | -------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| **NEW — CREATE** | `src/app/sitemap.ts`       | Next.js file convention for `/sitemap.xml` — exports default async function returning `MetadataRoute.Sitemap`           |
| **NEW — CREATE** | `src/app/robots.ts`        | Next.js file convention for `/robots.txt` — exports default function returning `MetadataRoute.Robots`                   |
| **UPDATE**       | `src/app/page.tsx`         | Add Person JSON-LD `<script>` tag to the home page JSX — all data sourced from `siteConfig` already loaded in component |
| **NO CHANGE**    | `src/lib/metadata.ts`      | Story 8.1/8.2 built this — nothing to change here                                                                       |
| **NO CHANGE**    | `src/lib/data.ts`          | `getSiteConfig()` already used in home page — no changes needed                                                         |
| **NO CHANGE**    | `src/lib/mdx.ts`           | `getAllProjectSlugs()` imported by sitemap — no changes needed                                                          |
| **NO CHANGE**    | All other pages/components | Zero changes in this story                                                                                              |

### Exact Implementation: `src/app/sitemap.ts`

```typescript
import type { MetadataRoute } from "next";

import { getAllProjectSlugs } from "@/lib/mdx";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const projectSlugs = await getAllProjectSlugs();

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${siteUrl}/projects`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${siteUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${siteUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
  ];

  const projectRoutes: MetadataRoute.Sitemap = projectSlugs.map((slug) => ({
    url: `${siteUrl}/projects/${slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...staticRoutes, ...projectRoutes];
}
```

**Why this works:**

- Next.js 16 App Router automatically serves `src/app/sitemap.ts` as `/sitemap.xml` — no `next.config.ts` rewrites needed
- `MetadataRoute.Sitemap` is the typed return value from `"next"` — no extra packages required
- `getAllProjectSlugs()` is the same function used by `generateStaticParams()` in the project detail page — same data source, zero divergence
- `new Date()` at build time gives the build timestamp — valid and standard; no need for per-file mtime tracking

### Exact Implementation: `src/app/robots.ts`

```typescript
import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
```

**Why this works:**

- `MetadataRoute.Robots` is the typed return value from `"next"` — no extra packages required
- Next.js 16 App Router automatically serves `src/app/robots.ts` as `/robots.txt`
- The `rules` object with `allow: "/"` and no `disallow` means all pages are fully crawlable
- `sitemap` field informs crawlers of the sitemap URL — standard SEO practice

### Exact Change: `src/app/page.tsx` (Person schema addition only)

The home page already uses `getSiteConfig()` and `getProjects()`. The only change is adding the Person schema `<script>` tag to the JSX.

**Current `page.tsx` structure (simplified):**

```tsx
export default function Home() {
  const siteConfig = getSiteConfig();
  const featuredProjects = getProjects().filter((p) => p.isFeatured);

  return (
    <>
      <SectionLayout id="hello-world" ...>
```

**Updated `page.tsx` structure:**

```tsx
export default function Home() {
  const siteConfig = getSiteConfig();
  const featuredProjects = getProjects().filter((p) => p.isFeatured);

  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: siteConfig.owner.name,
    url: siteConfig.siteUrl,
    email: siteConfig.owner.email,
    jobTitle: siteConfig.owner.title,
    sameAs: [
      siteConfig.social.github,
      siteConfig.social.linkedin,
      ...(siteConfig.social.twitter ? [siteConfig.social.twitter] : []),
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />
      <SectionLayout id="hello-world" ...>
```

**Critical details:**

- `siteConfig.siteUrl` is already `process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"` — injected by `getSiteConfig()` in `src/lib/data.ts`. Do NOT read the env var again directly in `page.tsx`.
- `siteConfig.social.twitter` is optional (`twitter?: string` in `SiteConfig`) — use conditional spread to avoid `undefined` in `sameAs` array (JSON-LD validators reject undefined values)
- `dangerouslySetInnerHTML` is the correct pattern for inline JSON-LD in React/Next.js — the content is static structured data, not user input, so XSS risk is zero. This is the industry standard approach.
- Place the `<script>` tag as **first child** of the `<>` fragment — before all `SectionLayout` children — to ensure it appears early in the document and is parsed before viewport content

### Critical Architecture Rules for This Story

**Rule 1: `NEXT_PUBLIC_SITE_URL` is the single canonical URL source**

- Both `sitemap.ts` and `robots.ts` must use `process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"`
- The home page reads this via `getSiteConfig().siteUrl` — do NOT duplicate the env var read
- ARC2 mandates this: "single source of truth for canonical URL consumed by QR generation, OG tags, and sitemap"

**Rule 2: Next.js file conventions — no routes to configure**

- `src/app/sitemap.ts` → automatically `/sitemap.xml` (Next.js 16 App Router)
- `src/app/robots.ts` → automatically `/robots.txt` (Next.js 16 App Router)
- Do NOT use `pages/sitemap.xml.ts` (Pages Router pattern — wrong)
- Do NOT use `next.config.ts` rewrites — the file convention handles everything

**Rule 3: No new packages required**

- `MetadataRoute` is exported directly from `"next"` — already a dependency
- `getAllProjectSlugs` is already in `@/lib/mdx` — already used elsewhere
- `getSiteConfig` is already in `@/lib/data` — already used on the home page
- Installing any additional package for sitemap generation (e.g., `next-sitemap`) would violate architecture conventions

**Rule 4: Static generation at build time**

- Both `sitemap.ts` and `robots.ts` are called at `pnpm build` time and cached as static responses by Vercel
- No `export const dynamic = "force-dynamic"` or similar — they must remain statically generated (NFR7)
- `robots.ts` is synchronous (no `async`) — it has no async data dependencies

**Rule 5: Do NOT modify any existing file except `src/app/page.tsx`**

- `src/lib/metadata.ts` — already complete from Stories 8.1 and 8.2, zero changes
- `src/lib/data.ts` — already exports `getSiteConfig()` with `siteUrl` injected, zero changes
- `src/lib/mdx.ts` — already exports `getAllProjectSlugs()`, zero changes
- `src/app/layout.tsx` — already has fallback metadata, zero changes
- Any other `page.tsx` — not touched in this story

### What Exists in `src/lib/data.ts` (Do Not Change)

```typescript
// getSiteConfig already returns NEXT_PUBLIC_SITE_URL as siteUrl:
export function getSiteConfig(): SiteConfig {
  return {
    ...(siteData as Omit<SiteConfig, "siteUrl">),
    siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  };
}
```

The `SiteConfig` type already has:

- `owner.name`, `owner.title`, `owner.email` — all Person schema fields
- `siteUrl` — the canonical URL
- `social.github`, `social.linkedin`, `social.twitter?` — the `sameAs` array values

### `data/site.json` Current State (Reference)

```json
{
  "owner": {
    "name": "BaoBao",
    "title": "Full-Stack Engineer",
    "email": "hello@baobao.dev"
  },
  "social": {
    "github": "https://github.com/baobao",
    "linkedin": "https://linkedin.com/in/baobao"
  }
}
```

`social.twitter` is absent in `site.json` — this means `siteConfig.social.twitter` will be `undefined`. The conditional spread `...(siteConfig.social.twitter ? [siteConfig.social.twitter] : [])` handles this safely.

### Person Schema Validation

The generated JSON-LD for the home page should look like:

```json
{
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "BaoBao",
  "url": "https://baobao.dev",
  "email": "hello@baobao.dev",
  "jobTitle": "Full-Stack Engineer",
  "sameAs": ["https://github.com/baobao", "https://linkedin.com/in/baobao"]
}
```

Validate at: [Google Rich Results Test](https://search.google.com/test/rich-results) (requires public URL) or [Schema.org Validator](https://validator.schema.org/) (accepts direct JSON-LD paste).

### Previous Story Learnings (From Story 8.2)

- The `buildMetadata` helper in `src/lib/metadata.ts` is the single source of truth for all page metadata — this story does NOT touch it
- `process.env.NEXT_PUBLIC_SITE_URL` is used directly at module level in `sitemap.ts` and `robots.ts` (server-side at build time) — this is safe and correct
- `dangerouslySetInnerHTML` for JSON-LD is the correct React pattern — not a security issue when the content is structured data
- Keep changes minimal and surgical — this story only creates 2 new files and makes 1 targeted addition to `page.tsx`

### Git Intelligence (From Recent Commits)

Recent commit pattern: `feat: 8-2-open-graph-tags-social-preview-images`

Established conventions from prior work:

- Files created: `src/app/sitemap.ts`, `src/app/robots.ts` (new); `src/app/page.tsx` (update)
- TypeScript type imports from `"next"` (e.g., `MetadataRoute`) — same pattern as `Metadata` import in `metadata.ts`
- All content sourced from `data/*.json` via `src/lib/data.ts` — never read JSON files directly in page components
- `getSiteConfig()` is the standard way to access site metadata in page components — already used on home page

### Project Context

- **Framework:** Next.js 16.2.6 (App Router)
- **Language:** TypeScript (strict mode)
- **Environment:** `NEXT_PUBLIC_SITE_URL` in `.env.local` (development) and Vercel (production)
- **Data source:** `data/site.json` → `src/lib/data.ts` → `getSiteConfig()` — single access pattern
- **Existing project slug source:** `content/projects/*.mdx` → `getAllProjectSlugs()` in `src/lib/mdx.ts`
- **No new packages needed** — everything required is already installed and imported in the codebase

### Completion Note

Ultimate context engine analysis completed — comprehensive developer guide created.
All implementation details are fully specified; no ambiguity remains for the dev agent.

## Dev Agent Record

### Implementation Plan

Implemented exactly as specified in Dev Notes:

1. Created `src/app/sitemap.ts` using Next.js `MetadataRoute.Sitemap` file convention — exports async default function returning 4 static routes + dynamic project routes from `getAllProjectSlugs()`
2. Created `src/app/robots.ts` using Next.js `MetadataRoute.Robots` file convention — synchronous, returns `User-agent: *`, `Allow: /`, and sitemap URL
3. Updated `src/app/page.tsx` to add Person JSON-LD `<script>` tag as first child of the root fragment, sourcing all values from the existing `siteConfig` variable

### Completion Notes

- ✅ Task 1: `src/app/sitemap.ts` created — all 4 static routes + dynamic project routes, correct priorities/frequencies
- ✅ Task 2: `src/app/robots.ts` created — full crawl access, sitemap reference, no disallow rules
- ✅ Task 3: Person schema added to `src/app/page.tsx` — `@context`, `@type: Person`, `name`, `url`, `email`, `jobTitle`, `sameAs` with safe twitter conditional spread
- ✅ Task 4: `pnpm build` passed — 0 TypeScript errors, 0 lint errors; `/robots.txt` and `/sitemap.xml` confirmed as static routes in build output; `.next/server/app/robots.txt.body` and `sitemap.xml.body` verified with correct content
- No new dependencies added — `MetadataRoute` is from `"next"`, `getAllProjectSlugs` and `getSiteConfig` were already in the codebase

## File List

- `src/app/sitemap.ts` — NEW: Next.js sitemap route handler
- `src/app/robots.ts` — NEW: Next.js robots route handler
- `src/app/page.tsx` — MODIFIED: Added Person JSON-LD structured data

## Change Log

- 2026-05-26: Implemented Story 8.3 — created sitemap.ts and robots.ts using Next.js file conventions; added Person schema JSON-LD to home page; pnpm build verified with 0 errors and static generation confirmed
