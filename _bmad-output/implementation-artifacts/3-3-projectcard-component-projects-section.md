# Story 3.3: ProjectCard Component & Projects Section

Status: done

## Story

As a **visitor (recruiter or freelance client)**,
I want to scan a curated list of projects with title, tech stack, and outcome at a glance,
so that I can identify relevant work and choose which project to explore in under 5 seconds.

## Acceptance Criteria

1. **Given** the projects section renders on the home page and `/projects` page
   **When** a visitor views it
   **Then** the `// selected work` section label appears; project cards display in a 2-column grid on desktop/tablet, single column on mobile; each card shows title, one-line description, and `Badge` components for the tech stack (UX-DR5, UX-DR10)

2. **Given** a `ProjectCard` is rendered with project data
   **When** a visitor reads it
   **Then** the card is scannable in < 3 seconds: title in h3 scale, description in body text, tech stack badges below, inside `--bg-secondary` background with `--border-subtle` border; entire card is a clickable link to the project detail page

3. **Given** a visitor hovers a `ProjectCard` on desktop
   **When** hover state activates
   **Then** the card border transitions to `--border-active`; background shifts to `--bg-tertiary`; transition uses the 150ms micro timing token; hover effect is suppressed under `prefers-reduced-motion` (UX-DR17)

4. **Given** project cards render
   **When** the page is inspected for accessibility
   **Then** each card link has a descriptive `aria-label` including the project name; cards are keyboard focusable with visible focus ring (FR22, FR23, NFR12)

5. **Given** project data is loaded
   **When** `getProjects()` returns the array
   **Then** projects with `isFeatured: true` appear on the home page; all projects appear on `/projects`; order follows data file order (NFR19)

## Tasks / Subtasks

- [x] **Task 1: Create `ProjectCard` component** (AC: 1, 2, 3, 4)
  - [x] Create `src/components/ProjectCard.tsx` — new file, does NOT exist yet
  - [x] Import `Link` from `"next/link"`, `Badge` from `"@/components/Badge"`, and `Project` type from `"@/types/project"`
  - [x] Named export: `export function ProjectCard(...)` — NOT a default export
  - [x] Do **NOT** add `"use client"` — hover is pure Tailwind CSS utility classes, no JS events or DOM APIs
  - [x] Card outer element is `<Link href={/projects/${project.slug}}>` — entire card is clickable; `aria-label` on the Link
  - [x] Hover: add `transition-colors duration-micro hover:border-border-active hover:bg-bg-tertiary` directly on the Link element (no `group` needed — hover targets the card itself)
  - [x] Focus ring: `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg-primary` (matches hero CTA pattern from Story 3.2)
  - [x] See Dev Notes for the exact implementation

- [x] **Task 2: Update home page — add `// selected work` section** (AC: 1, 2, 3, 4, 5)
  - [x] Open `src/app/page.tsx` — add `getProjects` to the import from `"@/lib/data"`
  - [x] Add `import { ProjectCard } from "@/components/ProjectCard";`
  - [x] Call `getProjects().filter((p) => p.isFeatured)` to get featured projects
  - [x] Wrap both sections (hero + selected work) in a React fragment `<>...</>` (currently only one SectionLayout, now needs two)
  - [x] Add a second `<SectionLayout id="selected-work" label="selected work">` below the hero section
  - [x] Inside the SectionLayout: render a `<div className="grid grid-cols-1 md:grid-cols-2 gap-space-6">` containing `{featuredProjects.map((project) => <ProjectCard key={project.slug} project={project} />)}`
  - [x] Update the [View Projects] CTA `href` from `"/projects"` to `"#selected-work"` — the section now exists on the same page (Story 3.2 implementation note: "will update to `#selected-work` in Story 3.3")

- [x] **Task 3: Update `/projects` page — replace stub with full grid** (AC: 1, 2, 3, 4, 5)
  - [x] Replace entire contents of `src/app/projects/page.tsx` with the implementation from Dev Notes
  - [x] Import `SectionLayout`, `ProjectCard`, `getProjects` — render all projects (no `.filter`)
  - [x] Use same grid layout: `grid grid-cols-1 md:grid-cols-2 gap-space-6`

- [x] **Task 4: Verify build and visual output** (AC: 1–5)
  - [x] Run `pnpm build` — expect 0 TypeScript or CSS errors
  - [x] Run `pnpm dev` and verify: home page shows hero + `// selected work` grid with 2 project cards; [View Projects] scrolls to the grid on the same page
  - [x] Resize to 375px — confirm cards stack to single column, no horizontal overflow
  - [x] Verify hover state changes border/background colour on desktop
  - [x] Verify `/projects` page renders both seed projects in the grid
  - [x] Tab through the page — each card receives a visible focus ring; `aria-label` is readable in DevTools

## Dev Notes

### Critical Context: What Exists vs What To Build

This story builds entirely on existing foundations. **Do NOT re-implement or change any of these:**

| Existing asset            | Location                           | Used by this story as-is                                                          |
| ------------------------- | ---------------------------------- | --------------------------------------------------------------------------------- |
| `Badge` component         | `src/components/Badge.tsx`         | Imported directly — no changes                                                    |
| `SectionLayout` component | `src/components/SectionLayout.tsx` | Used as-is — no changes                                                           |
| `getProjects()` function  | `src/lib/data.ts`                  | Returns `Project[]` typed from `data/projects.json`                               |
| `Project` interface       | `src/types/project.ts`             | Already has all fields needed (slug, title, description, techStack, isFeatured)   |
| Seed project data         | `data/projects.json`               | 2 seed projects, both `isFeatured: true` — grid will render both                  |
| Design tokens             | `src/app/globals.css`              | `bg-bg-secondary`, `border-border-subtle`, `duration-micro`, etc. — all available |

### Exact Implementation

#### `src/components/ProjectCard.tsx` — NEW FILE

```tsx
import Link from "next/link";
import { Badge } from "@/components/Badge";
import type { Project } from "@/types/project";

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Link
      href={`/projects/${project.slug}`}
      aria-label={`View ${project.title} project details`}
      className="bg-bg-secondary border-border-subtle p-space-6 gap-space-4 duration-micro hover:border-border-active hover:bg-bg-tertiary focus-visible:ring-accent focus-visible:ring-offset-bg-primary flex flex-col rounded-lg border transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
    >
      <h3 className="text-h3 leading-h3 tracking-heading text-text-primary font-semibold">
        {project.title}
      </h3>
      <p className="text-body leading-body text-text-secondary flex-1">
        {project.description}
      </p>
      <div className="gap-space-2 flex flex-wrap">
        {project.techStack.map((tech) => (
          <Badge key={tech} label={tech} />
        ))}
      </div>
    </Link>
  );
}
```

#### `src/app/page.tsx` — FULL REPLACEMENT

```tsx
import Link from "next/link";
import { getSiteConfig, getProjects } from "@/lib/data";
import { SectionLayout } from "@/components/SectionLayout";
import { ProjectCard } from "@/components/ProjectCard";

export default function Home() {
  const siteConfig = getSiteConfig();
  const featuredProjects = getProjects().filter((p) => p.isFeatured);

  return (
    <>
      <SectionLayout id="hello-world" label="hello world">
        <div className="gap-space-6 flex flex-col">
          {/* Name — hero typography scale (56px desktop, 36px mobile) */}
          <p className="md:text-hero leading-hero tracking-hero text-text-primary text-[2.25rem] font-bold">
            {siteConfig.owner.name}
          </p>

          {/* Tagline — h2 scale (32px desktop, 24px mobile) */}
          <p className="md:text-h2 leading-h2 tracking-heading text-text-secondary max-w-prose text-[1.5rem] font-semibold">
            {siteConfig.owner.tagline}
          </p>

          {/* CTAs — side-by-side on sm+ (≥640px), stacked on mobile */}
          <div className="gap-space-4 pt-space-2 flex flex-col sm:flex-row">
            {/* Primary CTA — updated to scroll to #selected-work on this page (Story 3.3) */}
            <Link
              href="#selected-work"
              className="px-space-6 py-space-4 bg-accent text-bg-primary text-small duration-micro hover:bg-accent-hover focus-visible:ring-accent focus-visible:ring-offset-bg-primary inline-flex items-center justify-center rounded font-mono font-bold transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
            >
              View Projects
            </Link>

            {/* Secondary CTA — PDF export deferred to Story 7.3; currently routes to /contact */}
            <Link
              href="/contact"
              className="px-space-6 py-space-4 border-border-active text-text-primary text-small duration-micro hover:border-accent hover:text-accent focus-visible:ring-accent focus-visible:ring-offset-bg-primary inline-flex items-center justify-center rounded border font-mono transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
            >
              Download CV
            </Link>
          </div>
        </div>
      </SectionLayout>

      <SectionLayout id="selected-work" label="selected work">
        <div className="gap-space-6 grid grid-cols-1 md:grid-cols-2">
          {featuredProjects.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>
      </SectionLayout>
    </>
  );
}
```

#### `src/app/projects/page.tsx` — FULL REPLACEMENT

```tsx
import { SectionLayout } from "@/components/SectionLayout";
import { ProjectCard } from "@/components/ProjectCard";
import { getProjects } from "@/lib/data";

export default function Projects() {
  const projects = getProjects();

  return (
    <SectionLayout id="selected-work" label="selected work">
      <div className="gap-space-6 grid grid-cols-1 md:grid-cols-2">
        {projects.map((project) => (
          <ProjectCard key={project.slug} project={project} />
        ))}
      </div>
    </SectionLayout>
  );
}
```

### Why These Specific Choices

**Card is the link — no wrapper pattern:**
The entire `<Link>` element IS the card. This means `hover:` utilities apply directly without a `group`/`group-hover:` indirection. The `group` pattern is only needed when a child element needs to react to a parent's hover state — that's not the case here since we're only changing the card's own border and background. Using `group` when you don't need it adds noise and is an anti-pattern.

**No `"use client"` directive:**
Hover, focus, and transition effects are handled entirely by Tailwind CSS utility classes — no JavaScript, no event handlers, no React state. `getProjects()` is a synchronous JSON read (no `async`/`await`). The component tree is 100% Server Components. This is consistent with the project's "client boundary as deep as possible" rule (ARC8).

**`prefers-reduced-motion` is handled globally — no Tailwind `motion-reduce:` needed:**
`globals.css` contains a `@media (prefers-reduced-motion: reduce)` block that sets `--duration-micro: 0ms` and forces `transition-duration: 0.01ms !important` on all elements. When `prefers-reduced-motion` is on, the `duration-micro` token resolves to `0ms` automatically — the hover transition collapses to instant. **Do NOT add `motion-reduce:transition-none`** — it is redundant and conflicts with the established project pattern.

**`techStack` items render as `Badge` with no explicit `category` prop:**
The `techStack` field in `projects.json` is `string[]` — tech names without category metadata. The `Badge` component defaults `category` to `"other"` which applies `bg-accent-muted text-text-secondary`. This is the correct MVP approach. Do NOT attempt to map tech names to categories — that would require a lookup table not defined in the architecture. Category-aware badges can be added when (if) the `Project` schema gains a `techStackCategories` field.

**`href` points to `/projects/${project.slug}` — will 404 until Story 4.2:**
The project detail page (`src/app/projects/[slug]/page.tsx`) is implemented in Epic 4, Story 4.2. Until then, clicking a card navigates to a 404 page. This is intentional and acceptable — the `not-found.tsx` custom terminal error page (Story 2.3) handles the UX gracefully. **Do NOT add `disabled` states or remove the `href`** — a broken-looking card is worse than a clean 404.

**[View Projects] CTA updates from `/projects` to `#selected-work`:**
Story 3.2 Dev Notes explicitly stated: "[View Projects] → `href="/projects"` (will update to `#selected-work` in Story 3.3)". This story delivers that update. The `#selected-work` anchor corresponds to the `id="selected-work"` on the new `SectionLayout` below the hero. The scroll behavior is native browser anchor navigation — no JS smooth-scroll needed for MVP (smooth-scroll can be added in Epic 6).

**`md:grid-cols-2` breakpoint (768px) for the 2-column grid:**
The UX spec (UX-DR5) specifies: 2 columns on tablet+, single column on mobile. The `md:` prefix in Tailwind v4 is 768px — this matches the tablet breakpoint. Using `lg:` (1024px) would keep the grid single-column on tablets unnecessarily.

**`flex-1` on the description `<p>`:**
The description paragraph has `flex-1` to push the badges to the bottom of the card. This ensures visual alignment: all cards in a row have their badge rows at the same vertical position regardless of description length. Without `flex-1`, a short description would leave the badges floating high and the cards would look misaligned in the grid.

**`rounded-lg` on the card:**
The `Badge` component uses `rounded` (4px). The card uses `rounded-lg` (8px) for visual hierarchy — cards are larger containers and should have a slightly larger corner radius than their pill children. Tailwind default: `rounded-lg` = `0.5rem = 8px`.

**Why `<>...</>` fragment wrapping in `page.tsx`:**
The `Home` component now renders two `SectionLayout` components. React requires a single root element, so they must be wrapped. A React fragment `<>...</>` is the correct choice — it adds no extra DOM node, maintains valid HTML semantics, and follows the project's "no unnecessary wrappers" principle (ARC8).

### Design Token Reference

All tokens used in `ProjectCard.tsx` and their resolved values:

| Class                        | Token                                              | Resolved value                     |
| ---------------------------- | -------------------------------------------------- | ---------------------------------- |
| `bg-bg-secondary`            | `--bg-secondary`                                   | `#12121A`                          |
| `border-border-subtle`       | `--border-subtle`                                  | `#2A2A3A`                          |
| `hover:border-border-active` | `--border-active`                                  | `#3A3A50`                          |
| `hover:bg-bg-tertiary`       | `--bg-tertiary`                                    | `#1A1A25`                          |
| `duration-micro`             | `--transition-duration-micro` → `--duration-micro` | `150ms` (0ms under reduced-motion) |
| `text-h3`                    | `--text-h3`                                        | `1.5rem / 24px`                    |
| `leading-h3`                 | `--leading-h3`                                     | `1.3`                              |
| `tracking-heading`           | `--tracking-heading`                               | `-0.02em`                          |
| `text-body`                  | `--text-body`                                      | `1rem / 16px`                      |
| `leading-body`               | `--leading-body`                                   | `1.6`                              |
| `ring-accent`                | `--accent`                                         | `#00DC82`                          |
| `ring-offset-bg-primary`     | `--bg-primary`                                     | `#0A0A0F`                          |
| `p-space-6`                  | `--spacing-space-6`                                | `24px`                             |
| `gap-space-4`                | `--spacing-space-4`                                | `16px`                             |
| `gap-space-2`                | `--spacing-space-2`                                | `8px`                              |
| `gap-space-6`                | `--spacing-space-6`                                | `24px` (grid gap)                  |

### Focus Ring Pattern (Matches Story 3.2)

All interactive elements in this project use the same focus ring pattern from UX-DR12:

```
focus-visible:outline-none
focus-visible:ring-2
focus-visible:ring-accent
focus-visible:ring-offset-2
focus-visible:ring-offset-bg-primary
```

`focus-visible:` (not `focus:`) ensures the ring only shows on keyboard navigation, never on mouse click. This pattern is already established in the hero CTAs (Story 3.2) — use the exact same classes on `ProjectCard`.

### Files Being Modified

| File                             | Action | What Changes                                                                                                                                                                                                  |
| -------------------------------- | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `src/components/ProjectCard.tsx` | CREATE | New component — entire file new                                                                                                                                                                               |
| `src/app/page.tsx`               | UPDATE | Add `getProjects` import, `ProjectCard` import, `featuredProjects` variable, `// selected work` SectionLayout; update hero CTA href from `/projects` to `#selected-work`; wrap both sections in `<>` fragment |
| `src/app/projects/page.tsx`      | UPDATE | Replace "Coming soon." stub with full project grid                                                                                                                                                            |

### Files NOT Modified

| File                               | Why unchanged                                                                                  |
| ---------------------------------- | ---------------------------------------------------------------------------------------------- |
| `src/components/Badge.tsx`         | Used as-is — no new props needed                                                               |
| `src/components/SectionLayout.tsx` | Used as-is — `id="selected-work"` and `id="hello-world"` already supported                     |
| `src/lib/data.ts`                  | `getProjects()` already returns `Project[]` correctly                                          |
| `src/types/project.ts`             | All required fields already present: `slug`, `title`, `description`, `techStack`, `isFeatured` |
| `data/projects.json`               | 2 seed projects with all required fields; both `isFeatured: true`; no new fields needed        |
| `src/app/layout.tsx`               | Root layout unchanged — NavBar, Footer already handle page framing                             |

### Previous Story Learnings (3.2 Hero Section)

From the Story 3.2 implementation:

- **Hero CTA href update explicitly requested in 3.2 Dev Notes:** "will update to `#selected-work` in Story 3.3" — this is your instruction to update it.
- **`"use client"` boundary pattern confirmed:** page.tsx stays a Server Component; data is read synchronously via `getSiteConfig()` / `getProjects()`. Follow the same pattern.
- **Tailwind arbitrary values for mobile overrides:** `text-[2.25rem]` is the correct Tailwind v4 approach when a mobile size doesn't match a theme token. No arbitrary values are needed in this story — `grid-cols-1` / `md:grid-cols-2` are standard utilities.
- **Focus ring uses `focus-visible:` not `focus:`** — confirmed in 3.2, apply the same to ProjectCard.
- **`font-mono` on all text elements** — Geist Mono is the sole typeface. Every text node should render in mono. In ProjectCard, both `<h3>` and `<p>` inherit `font-mono` from the `html` element in `globals.css` — no explicit `font-mono` class needed on them. It is needed on Button/Link text where explicit override may be needed; but for body `<p>` and heading `<h3>`, inheritance covers it.

### Git Intelligence Summary

All 8 previous stories committed cleanly as single `feat:` commits. The naming convention is:
`feat: {story-key}` (e.g. `feat: 3-1-badge-component & 3-2-hero-section`).
After completing this story, the commit should be: `feat: 3-3-projectcard-component-projects-section`.

## Dev Agent Record

### Agent Model Used

Claude Sonnet 4.5 (via GitHub Copilot / bmad-create-story workflow)

### Debug Log References

### Completion Notes List

- Implemented `ProjectCard` as a pure Server Component (no `"use client"`) using Next.js `Link` as the card element. Hover/focus effects are fully CSS-driven via Tailwind utility classes.
- Updated `src/app/page.tsx`: added `getProjects` + `ProjectCard` imports, wrapped two `SectionLayout` components in a React fragment, added `// selected work` section with featured projects grid, updated "View Projects" CTA href from `/projects` to `#selected-work`.
- Replaced `/projects` page stub with full project grid rendering all projects (unfiltered).
- `pnpm build` passed with 0 TypeScript or CSS errors (all 7 routes static).
- Pre-existing IDE lint suggestion on `text-[1.5rem]` in tagline (line 20 of page.tsx) is from Story 3.2 and is intentional — not introduced by this story.

### File List

- `src/components/ProjectCard.tsx` — CREATED
- `src/app/page.tsx` — MODIFIED
- `src/app/projects/page.tsx` — MODIFIED

### Change Log

- 2026-05-23: Story 3.3 implemented — `ProjectCard` component created; home page updated with `// selected work` section; `/projects` page stub replaced with full grid.
