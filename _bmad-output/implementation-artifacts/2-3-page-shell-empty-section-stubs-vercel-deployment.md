# Story 2.3: Page Shell with Empty Section Stubs & Vercel Deployment

Status: done

## Story

As the **owner**,
I want all four pages (Home, Projects, About, Contact) to exist as deployed, navigable stubs on a live Vercel URL,
so that the site is publicly accessible with a stable canonical URL before any content is added.

## Acceptance Criteria

1. **Given** the App Router pages exist
   **When** a visitor navigates to `/`, `/projects`, `/about`, `/contact`
   **Then** each page renders within the root layout with a placeholder `SectionLayout` stub; no 404 errors on any of these routes

2. **Given** the site is deployed to Vercel
   **When** a push to `main` is made
   **Then** Vercel auto-deploys to the production URL; `NEXT_PUBLIC_SITE_URL` is set to the custom domain in Vercel environment variables; the custom domain resolves with HTTPS (NFR17)

3. **Given** the canonical URL is established
   **When** `process.env.NEXT_PUBLIC_SITE_URL` is read anywhere in the codebase
   **Then** it returns the live production URL on Vercel and `http://localhost:3000` locally; no page hardcodes the domain string

4. **Given** a visitor navigates to a non-existent route
   **When** the 404 page renders
   **Then** `not-found.tsx` displays a terminal-style error message with `--error` accent color, a link to `/projects`, and a link to `/contact` — reinforcing the coding aesthetic on error (UX-DR16)

5. **Given** the site loads on mobile (QR scan scenario)
   **When** a recruiter scans the QR code and lands on the home page
   **Then** First Contentful Paint completes in < 1.5s; the dark background renders immediately with no flash of white; CLS < 0.1 (NFR1, NFR3)

## Tasks / Subtasks

- [x] **Task 1: Create `/projects` page stub** (AC: 1)
  - [x] Create `src/app/projects/page.tsx` as a default-export Server Component
  - [x] Render a single `<SectionLayout id="selected-work" label="selected work">` with a placeholder `<p className="text-text-secondary">Coming soon.</p>`
  - [x] Default export function named `Projects`
  - [x] Import: `import { SectionLayout } from "@/components/SectionLayout"` — no other imports needed

- [x] **Task 2: Create `/about` page stub** (AC: 1)
  - [x] Create `src/app/about/page.tsx` as a default-export Server Component
  - [x] Render a single `<SectionLayout id="about" label="about">` with placeholder paragraph
  - [x] Default export function named `About`

- [x] **Task 3: Create `/contact` page stub** (AC: 1)
  - [x] Create `src/app/contact/page.tsx` as a default-export Server Component
  - [x] Render a single `<SectionLayout id="contact" label="contact">` with placeholder paragraph
  - [x] Default export function named `Contact`

- [x] **Task 4: Create terminal-style 404 page** (AC: 4)
  - [x] Create `src/app/not-found.tsx` as a default-export Server Component
  - [x] Import `Link` from `"next/link"` — the only import needed
  - [x] Outer wrapper: `<div className="flex flex-1 flex-col items-center justify-center px-space-8 py-space-16 font-mono">` — fills vertical space because `<main>` is `flex flex-1 flex-col`
  - [x] Inner container: `<div className="w-full max-w-prose">`
  - [x] Section label: `<p className="text-text-tertiary text-small mb-space-2">// error</p>`
  - [x] Error heading: `<h1 className="text-error text-h1 font-bold tracking-heading mb-space-4">404</h1>`
  - [x] Prompt line: `<p className="text-text-secondary text-body mb-space-2"><span className="text-text-tertiary" aria-hidden="true">{">"}</span> route not found</p>`
  - [x] Description: `<p className="text-text-muted text-small mb-space-8">the page you are looking for does not exist.</p>`
  - [x] Link container: `<div className="flex flex-wrap gap-space-4">`
  - [x] Projects link: `<Link href="/projects" className="text-accent hover:text-accent-hover text-small transition-colors duration-micro underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg-primary rounded">cd /projects</Link>`
  - [x] Contact link: `<Link href="/contact" className="text-text-secondary hover:text-text-primary text-small transition-colors duration-micro underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg-primary rounded">./contact</Link>`

- [x] **Task 5: Verify home page stub (no code change)** (AC: 1, 5)
  - [x] Read `src/app/page.tsx` — confirm it already has `SectionLayout id="hello-world" label="hello world"` stub
  - [x] Read `src/app/globals.css` — confirm `html { background-color: var(--bg-primary) }` is set, preventing white flash
  - [x] No code changes needed — document verification in completion notes

- [x] **Task 6: Vercel deployment (manual operations — human task)** (AC: 2, 3)
  - [ ] Go to https://vercel.com/new — import the GitHub repository
  - [ ] In Vercel project settings → Environment Variables → add `NEXT_PUBLIC_SITE_URL=https://<your-domain>` for **Production** environment; keep `.env.local` as `http://localhost:3000` for local dev
  - [ ] In Vercel project settings → Domains — add custom domain; Vercel provisions HTTPS automatically
  - [ ] Push to `main` to trigger first production deploy; verify all 4 routes return HTTP 200
  - [ ] Record the live production URL in completion notes

- [x] **Task 7: Tighten CSP `connect-src` with production domain** (AC: 2) — perform **after** domain is confirmed
  - [ ] In `next.config.ts`, update the `connect-src` entry in `ContentSecurityPolicy`:
    - Replace `wss:` (overly permissive) with `wss://<your-domain>` (specific origin)
    - Add `https://<your-domain>` before `https://*.vercel.app` in `connect-src`
  - [ ] Result: `"connect-src 'self' https://<your-domain> https://*.vercel.app https://*.vercel-insights.com wss://<your-domain>"`
  - [ ] Commit and push to redeploy
  - [ ] This resolves two deferred items from Story 1.1 (see `deferred-work.md`)

- [x] **Task 8: Validate** (AC: 1–5)
  - [x] Run `pnpm lint` — must pass with zero errors
  - [x] Run `pnpm build` — must pass with zero TypeScript errors
  - [ ] `pnpm dev`: navigate to `/projects`, `/about`, `/contact` — each renders within root layout with `// comment` section label, no 404 (manual verification)
  - [ ] `pnpm dev`: navigate to `/foo` (non-existent) — `not-found.tsx` renders; `404` is in error red; links to `/projects` and `/contact` are present and keyboard-focusable (manual verification)
  - [ ] Keyboard test on 404 page: Tab through both links — each receives the `ring-accent` focus ring (manual verification)
  - [ ] After Vercel deploy: run Lighthouse on production home page — Performance ≥ 90 desktop, FCP < 1.5s, CLS < 0.1 (post-deploy)

## Dev Notes

### Developer Context

Story 2.3 completes Epic 2. After this story the full portfolio shell is live:

```
layout.tsx (Server)
  ├── StatusStripe.tsx   — top bar
  ├── <a> skip link      — accessibility
  ├── NavBar.tsx         — persistent nav (Projects | About | Contact)
  ├── <main>
  │   ├── /              — home page (// hello world stub)
  │   ├── /projects      — projects page (// selected work stub)  ← NEW
  │   ├── /about         — about page (// about stub)             ← NEW
  │   ├── /contact       — contact page (// contact stub)         ← NEW
  │   └── [404]          — not-found.tsx terminal error           ← NEW
  └── Footer.tsx         — VS Code status bar
```

**What already exists — do NOT recreate:**

| File                               | Status    | Notes                                                      |
| ---------------------------------- | --------- | ---------------------------------------------------------- |
| `src/app/page.tsx`                 | ✅ exists | Has `SectionLayout id="hello-world"` stub — no changes     |
| `src/app/layout.tsx`               | ✅ exists | Full root layout — do NOT touch                            |
| `src/components/SectionLayout.tsx` | ✅ exists | Accepts `id`, `label`, `children`, `prose?`                |
| `src/components/StatusStripe.tsx`  | ✅ exists | Story 2.1 — do NOT touch                                   |
| `src/components/NavBar.tsx`        | ✅ exists | Story 2.1 — do NOT touch                                   |
| `src/components/Footer.tsx`        | ✅ exists | Story 2.2 — do NOT touch                                   |
| `src/app/globals.css`              | ✅ exists | `html { background-color: var(--bg-primary) }` already set |
| `src/lib/data.ts`                  | ✅ exists | `getSiteConfig()` reads `NEXT_PUBLIC_SITE_URL` from env    |

**Stub pages are intentionally minimal:**
`/projects`, `/about`, and `/contact` pages exist ONLY to establish routes. Do NOT add content, data fetching, metadata, or components beyond one `SectionLayout` with a placeholder paragraph. Content is Epic 3's responsibility.

**Why `id` values matter:**
The `id` props assigned now (`"selected-work"`, `"about"`, `"contact"`) will be used as anchor targets in Story 3.2 (hero [View Projects] CTA → `#selected-work`). Use the exact values from the task list; do not improvise.

**`not-found.tsx` is a Next.js special file:**
Placing `not-found.tsx` in `src/app/` makes it the global 404 handler. It automatically renders inside the root layout (inside `<main class="flex flex-1 flex-col">`). To fill vertical space, the top-level wrapper must use `flex flex-1`. Do NOT add this file anywhere else.

**`not-found.tsx` must NOT call `getSiteConfig()`:**
The 404 page is fully static — no dynamic data needed. Adding `getSiteConfig()` would add an unnecessary import and make the page depend on env vars. Keep it dependency-free.

**Vercel deployment is a human task:**
Tasks 6–7 require manual steps in the Vercel dashboard. The dev agent should implement Tasks 1–5 and document Tasks 6–7 as instructions in the completion notes. After the domain is confirmed, Task 7 (CSP tightening) is a simple code edit that can be done in the same PR.

### Technical Requirements

**Stub page template (identical structure for all 3 routes):**

```tsx
import { SectionLayout } from "@/components/SectionLayout";

export default function PageName() {
  return (
    <SectionLayout id="section-id" label="section label">
      <p className="text-text-secondary">Coming soon.</p>
    </SectionLayout>
  );
}
```

**Required `id` and `label` values — use exactly:**

| File                        | `id`              | `label`           |
| --------------------------- | ----------------- | ----------------- |
| `src/app/projects/page.tsx` | `"selected-work"` | `"selected work"` |
| `src/app/about/page.tsx`    | `"about"`         | `"about"`         |
| `src/app/contact/page.tsx`  | `"contact"`       | `"contact"`       |

**`not-found.tsx` exact implementation:**

```tsx
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="px-space-8 py-space-16 flex flex-1 flex-col items-center justify-center font-mono">
      <div className="w-full max-w-prose">
        <p className="text-text-tertiary text-small mb-space-2">// error</p>
        <h1 className="text-error text-h1 tracking-heading mb-space-4 font-bold">
          404
        </h1>
        <p className="text-text-secondary text-body mb-space-2">
          <span className="text-text-tertiary" aria-hidden="true">
            {">"}
          </span>{" "}
          route not found
        </p>
        <p className="text-text-muted text-small mb-space-8">
          the page you are looking for does not exist.
        </p>
        <div className="gap-space-4 flex flex-wrap">
          <Link
            href="/projects"
            className="text-accent hover:text-accent-hover text-small duration-micro focus-visible:ring-accent focus-visible:ring-offset-bg-primary rounded underline underline-offset-4 transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
          >
            cd /projects
          </Link>
          <Link
            href="/contact"
            className="text-text-secondary hover:text-text-primary text-small duration-micro focus-visible:ring-accent focus-visible:ring-offset-bg-primary rounded underline underline-offset-4 transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
          >
            ./contact
          </Link>
        </div>
      </div>
    </div>
  );
}
```

**Tailwind token reference (relevant to this story):**

| Token class           | Value             |
| --------------------- | ----------------- |
| `text-error`          | `#FF6B6B`         |
| `text-text-tertiary`  | `#6B6B80`         |
| `text-text-secondary` | `#A0A0B0`         |
| `text-text-muted`     | `#45455A`         |
| `text-accent`         | `#00DC82`         |
| `text-accent-hover`   | `#00FF96`         |
| `text-text-primary`   | `#E8E8ED`         |
| `text-h1`             | `2.625rem / 42px` |
| `text-small`          | `0.875rem / 14px` |
| `text-body`           | `1rem / 16px`     |
| `tracking-heading`    | `-0.02em`         |
| `max-w-prose`         | `680px`           |
| `px-space-8`          | `32px`            |
| `py-space-16`         | `64px`            |
| `mb-space-2`          | `8px`             |
| `mb-space-4`          | `16px`            |
| `mb-space-8`          | `32px`            |
| `gap-space-4`         | `16px`            |
| `duration-micro`      | `150ms`           |

### Architecture Compliance

- **Default exports for pages**: `page.tsx` and `not-found.tsx` use `export default function` — this is the ONLY exception to the named-export rule (Next.js requires it). All other components continue to use named exports.
- **No `"use client"`**: All 3 stub pages and `not-found.tsx` are pure Server Components — no DOM access, no event handlers, no animation libraries.
- **`@/` aliases only**: Import as `import { SectionLayout } from "@/components/SectionLayout"` — never `../../components/SectionLayout`.
- **No barrel files**: Import directly from each component file.
- **`next/link` for internal navigation**: Use `<Link href="...">` not `<a href="...">` for all intra-site links, including in `not-found.tsx`.
- **Import order in new files** (ESLint enforced): Next.js imports first (`import Link from "next/link"`), then `@/components/` imports.

### Library / Framework Requirements

**No new packages required.** All dependencies are already installed:

- `next@16.2.6` — App Router page conventions, `Link` component, `not-found.tsx` file convention
- `react@19.2.4` — Server Components (no hooks needed)
- `tailwindcss@^4` — all required tokens already defined in `src/app/globals.css`

**`next/link` behavior:**

- `Link` from `"next/link"` prefetches linked routes by default — no extra config needed
- For internal-only links (no `target="_blank"`) no `rel` attribute is needed
- `href` values are literal strings: `"/projects"`, `"/contact"`

### File Structure Requirements

#### Files to Create

- `src/app/projects/page.tsx` (NEW) — default export `Projects`
- `src/app/about/page.tsx` (NEW) — default export `About`
- `src/app/contact/page.tsx` (NEW) — default export `Contact`
- `src/app/not-found.tsx` (NEW) — default export `NotFound`, global 404 handler

#### Files to Update (conditional — after Vercel domain is confirmed)

- `next.config.ts` (UPDATE) — tighten `connect-src` CSP directive with production domain

#### Files to Preserve (No Change Expected)

- `src/app/page.tsx` — existing home stub is correct, leave it alone
- `src/app/layout.tsx` — root layout is complete
- `src/components/SectionLayout.tsx` — Story 1.4, do not modify
- `src/components/Footer.tsx` — Story 2.2, do not modify
- `src/components/NavBar.tsx` — Story 2.1, do not modify
- `src/components/StatusStripe.tsx` — Story 2.1, do not modify
- `src/app/globals.css` — token source of truth, do not modify
- `src/lib/data.ts` — no data loading needed for stubs, do not modify

### Update-File Intelligence

#### `src/app/page.tsx` — READ ONLY, verify no change needed

Current content (verified from codebase):

```tsx
import { SectionLayout } from "@/components/SectionLayout";

export default function Home() {
  return (
    <SectionLayout id="hello-world" label="hello world">
      <p className="text-text-secondary">Portfolio coming soon.</p>
    </SectionLayout>
  );
}
```

This satisfies AC 1 for the `/` route. No change required.

#### `next.config.ts` — conditional UPDATE (Task 7, after domain confirmed)

**Current `connect-src` value** (in `ContentSecurityPolicy` array):

```ts
"connect-src 'self' https://*.vercel.app https://*.vercel-insights.com wss:",
```

**Target `connect-src` value** (replace `wss:` and add production domain):

```ts
"connect-src 'self' https://<your-domain> https://*.vercel.app https://*.vercel-insights.com wss://<your-domain>",
```

Where `<your-domain>` is the value set for `NEXT_PUBLIC_SITE_URL` in Vercel (e.g., `bao.dev`).

This directly resolves two deferred work items from Story 1.1 recorded in `_bmad-output/implementation-artifacts/deferred-work.md`:

- "Bare `wss:` in CSP `connect-src` is overly permissive — tighten to specific origins when deployment domain is known"
- "Custom production domain not in CSP `connect-src` — add `NEXT_PUBLIC_SITE_URL`-derived origin to connect-src when domain is set"

### Previous Story Learnings (from Story 2.2)

**Established code patterns to replicate:**

- Focus ring: `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg-primary rounded` — used verbatim in `not-found.tsx` links
- Hover color transitions: `transition-colors duration-micro` — used in 404 links
- Section label aesthetic: `// section-name` in `text-text-tertiary font-mono` — replicated in 404 heading label
- Server Component default: no `"use client"` unless DOM/browser API needed

**Key git commit context (HEAD):**

```
1153ab7  feat: 2-2-footer-status-bar
  data/site.json          — added footer block (branch, framework, cssFramework, encoding)
  src/types/site.ts       — added footer property to SiteConfig
  src/components/Footer.tsx — created, named export
  src/app/layout.tsx      — added <Footer config={siteConfig} />
```

**What the `SectionLayout` component accepts** (from Story 1.4 implementation):

```tsx
interface SectionLayoutProps {
  label: string; // e.g. "selected work" — rendered as "// selected work"
  id: string; // e.g. "selected-work" — used as <section id="..."> and aria-labelledby
  children: React.ReactNode;
  prose?: boolean; // if true, wraps children in max-w-prose (680px)
}
```

For stub pages, `prose` defaults to `false` — no need to pass it.

### Project Context Reference

- Architecture: `_bmad-output/planning-artifacts/architecture.md`
- Epics: `_bmad-output/planning-artifacts/epics.md` (Story 2.3 in the Epic 2 section)
- Design tokens: `src/app/globals.css` (authoritative token values)
- Deferred work: `_bmad-output/implementation-artifacts/deferred-work.md` (CSP items resolved by Task 7)
- Previous story: `_bmad-output/implementation-artifacts/2-2-footer-status-bar.md`

## Dev Agent Record

### Agent Model Used

Claude Sonnet 4.6 (GitHub Copilot)

### Debug Log References

None — implementation was straightforward with one lint fix noted below.

### Completion Notes List

- **Task 1–3**: Created minimal Server Component stubs for `/projects`, `/about`, and `/contact`. Each uses the exact `id`/`label` values specified (`selected-work`, `about`, `contact`) for future anchor targeting in Story 3.2. No `prose` prop passed (defaults to false).
- **Task 4**: Created `src/app/not-found.tsx` as the global 404 handler. One adaptation from the spec: `// error` text node was wrapped as `{"// error"}` JSX expression to satisfy the `react/jsx-no-comment-textnodes` ESLint rule (bare `//` in JSX text content triggers this rule). All other markup matches the spec exactly.
- **Task 5**: Verified `src/app/page.tsx` has `SectionLayout id="hello-world" label="hello world"` — no changes needed. Verified `globals.css` has `html { background-color: var(--bg-primary) }` on line 165 — no flash of white.
- **Task 6 (Human Task)**: Deploy to Vercel via https://vercel.com/new. Add `NEXT_PUBLIC_SITE_URL=https://<your-domain>` env var for Production. Add custom domain in Vercel project settings. Push to `main` to trigger deploy.
- **Task 7 (Human Task — after domain confirmed)**: Update `connect-src` in `next.config.ts`: replace `wss:` with `wss://<your-domain>` and prepend `https://<your-domain>`. See deferred-work.md for full context.
- **Task 8**: `pnpm lint` — zero errors. `pnpm build` — clean build, all 7 routes statically prerendered (`/`, `/_not-found`, `/about`, `/contact`, `/projects`). Manual dev server tests and Lighthouse are post-deploy steps.

### File List

- `src/app/projects/page.tsx` — NEW
- `src/app/about/page.tsx` — NEW
- `src/app/contact/page.tsx` — NEW
- `src/app/not-found.tsx` — NEW
- `_bmad-output/implementation-artifacts/sprint-status.yaml` — UPDATED (status: review)

### Change Log

- 2026-05-23: Implemented Tasks 1–5, 8 — created 4 new pages (`/projects`, `/about`, `/contact`, `not-found.tsx`). `pnpm lint` and `pnpm build` pass. Tasks 6–7 documented as human tasks pending Vercel deployment.
