# Story 6.4: Hover Micro-interactions & Project Card Hover Reveal

Status: done

## Story

As a **desktop visitor browsing projects**,
I want project cards to respond to hover with subtle visual feedback and reveal additional context,
so that the portfolio feels interactive and rewards attentive browsing.

## Acceptance Criteria

1. **Given** a visitor hovers over a `ProjectCard` on desktop
   **When** the hover state activates
   **Then** border transitions from `--border-subtle` to `--border-active`; background shifts from `--bg-secondary` to `--bg-tertiary`; the 150ms micro timing token governs the transition; implemented via Tailwind `group-hover:` utilities (no GSAP or Framer needed for simple hover states)

2. **Given** hover reveal is implemented (UX-DR17)
   **When** a visitor hovers a card on desktop
   **Then** additional context (outcome summary, date range) becomes visible via an opacity + max-height transition; this content is visually hidden by default on desktop (not `display: none` — screen readers can still access it)

3. **Given** `prefers-reduced-motion` is enabled
   **When** a visitor hovers any element
   **Then** hover transitions are instant (transition-duration `0ms`); reveal content is visible immediately without animation; `globals.css` already sets `--duration-micro: 0ms` and `transition-duration: 0.01ms !important` under `prefers-reduced-motion: reduce` — transitions become instant automatically; explicit `motion-reduce:transition-none` is still applied for belt-and-suspenders clarity

4. **Given** the hover interactions are on mobile
   **When** a visitor views cards on a touch device (below `md` breakpoint)
   **Then** hover states do not apply; all card information (including the reveal content — outcome and date range) is visible by default on mobile (UX-DR10); no content is hidden on small screens

## Tasks / Subtasks

- [x] **Task 1: Update `src/components/ProjectCard.tsx`** — add `group` class and hover reveal section (AC: 1, 2, 3, 4)
  - [x] Add `group` to the `<Link>` className (required to enable `group-hover:` on children)
  - [x] Keep all existing hover transition classes on `<Link>` unchanged (`hover:border-border-active`, `hover:bg-bg-tertiary`, `transition-colors`, `duration-micro`, `motion-reduce:transition-none`)
  - [x] Add hover-reveal `<div>` after the badges `<div>` with the following visibility logic:
    - Mobile (base): always visible — `opacity-100`, natural height
    - Desktop (`md:` and up): hidden by default — `md:opacity-0 md:max-h-0 md:overflow-hidden`
    - Desktop hover: revealed — `md:group-hover:opacity-100 md:group-hover:max-h-24`
    - Transition: `transition-all duration-micro motion-reduce:transition-none`
  - [x] Inside the reveal div, render two lines:
    - `project.outcome` — as `<p>` with `text-text-tertiary text-xs leading-xs` styling
    - Date range — formatted inline (see Dev Notes for format logic)
  - [x] Add a visual separator above the reveal div (e.g., a thin `border-t border-border-subtle mt-space-4 pt-space-4`)
  - [x] **Do NOT add `"use client"`** — pure Tailwind CSS hover; `ProjectCard` stays a server component
  - [x] **Do NOT import GSAP or Framer Motion** — this is exclusively a Tailwind hover solution per architecture

- [x] **Task 2: Verify date formatting** (AC: 2)
  - [x] Format `startDate` ("2026-04" → "Apr 2026") using a pure inline helper — see Dev Notes
  - [x] Format `endDate` if present, otherwise render "Present"
  - [x] Confirm both seed projects (`portfolio-website` and `realtime-dashboard`) render correct dates
  - [x] `endDate` is optional (`string | undefined`) — handle missing value gracefully

- [x] **Task 3: Verify build and visual QA** (AC: 1, 2, 3, 4)
  - [x] Run `pnpm build` — 0 TypeScript errors, all routes pre-render
  - [x] Run `pnpm dev` and open `http://localhost:3000` and `http://localhost:3000/projects`
  - [x] Hover project cards on desktop (> 768px viewport): confirm border/background transition AND reveal appears smoothly
  - [x] Resize viewport to mobile (< 768px): confirm reveal content (outcome + date) is visible WITHOUT hover
  - [x] Emulate `prefers-reduced-motion: reduce` via DevTools (Rendering → Emulate CSS media feature) — confirm reveal content appears instantly with no transition animation
  - [x] Keyboard-navigate to a card (Tab) — confirm focus ring still works; reveal content is accessible to screen reader (not `display:none`)
  - [x] Confirm existing behavior unchanged: badge rendering, link navigation, `motion-reduce:transition-none`, aria-label

## Dev Notes

### What Exists vs What This Story Changes

| Status                     | Asset                              | Location                         | Notes                                                                                    |
| -------------------------- | ---------------------------------- | -------------------------------- | ---------------------------------------------------------------------------------------- |
| **EXISTS — UPDATE**        | `src/components/ProjectCard.tsx`   | `src/components/ProjectCard.tsx` | Add `group` to Link, add hover-reveal section at bottom                                  |
| **EXISTS — DO NOT MODIFY** | `src/types/project.ts`             | `src/types/project.ts`           | `Project.outcome: string` and `Project.startDate/endDate` already defined — use as-is    |
| **EXISTS — DO NOT MODIFY** | `data/projects.json`               | `data/projects.json`             | `outcome` field populated on all entries; do not add or change fields                    |
| **EXISTS — DO NOT MODIFY** | `src/app/globals.css`              | `src/app/globals.css`            | `--duration-micro: 150ms`; reduced-motion block already sets it to `0ms` globally        |
| **NO CHANGE**              | `src/app/page.tsx`, projects pages | —                                | `ProjectCard` is rendered in these — no props changes needed; update is internal to card |

### Current `ProjectCard.tsx` State

The component is currently a **pure server component** with:

- `<Link>` as root element with `aria-label`, direct `hover:` classes, `transition-colors duration-micro motion-reduce:transition-none`
- Three children: `<h3>` title, `<p>` description, `<div>` badges
- No `"use client"` — must remain server component after this story

```tsx
// CURRENT (do not regress these classes):
<Link
  href={`/projects/${project.slug}`}
  aria-label={`View ${project.title} project details`}
  className="bg-bg-secondary border-border-subtle p-space-6 gap-space-4 duration-micro hover:border-border-active hover:bg-bg-tertiary focus-visible:ring-accent focus-visible:ring-offset-bg-primary flex flex-col rounded-lg border transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none motion-reduce:transition-none"
>
```

### Exact Implementation: Updated `src/components/ProjectCard.tsx`

```tsx
import Link from "next/link";
import { Badge } from "@/components/Badge";
import type { Project } from "@/types/project";

interface ProjectCardProps {
  project: Project;
}

function formatMonthYear(dateStr: string): string {
  const [year, month] = dateStr.split("-");
  const date = new Date(parseInt(year, 10), parseInt(month, 10) - 1);
  return date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

export function ProjectCard({ project }: ProjectCardProps) {
  const dateRange = project.endDate
    ? `${formatMonthYear(project.startDate)} – ${formatMonthYear(project.endDate)}`
    : `${formatMonthYear(project.startDate)} – Present`;

  return (
    <Link
      href={`/projects/${project.slug}`}
      aria-label={`View ${project.title} project details`}
      className="group bg-bg-secondary border-border-subtle p-space-6 gap-space-4 duration-micro hover:border-border-active hover:bg-bg-tertiary focus-visible:ring-accent focus-visible:ring-offset-bg-primary flex flex-col rounded-lg border transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none motion-reduce:transition-none"
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
      {/* Hover reveal: visible on mobile always; hidden on desktop until hover */}
      <div className="border-border-subtle mt-space-4 pt-space-4 duration-micro border-t transition-all motion-reduce:transition-none md:max-h-0 md:overflow-hidden md:opacity-0 md:group-hover:max-h-24 md:group-hover:opacity-100">
        <p className="text-text-tertiary leading-xs mb-1 text-xs">
          {project.outcome}
        </p>
        <p className="text-text-muted leading-xs font-mono text-xs">
          {dateRange}
        </p>
      </div>
    </Link>
  );
}
```

### Key Technical Decisions

**Why `group` + `group-hover:` instead of direct `hover:` on child elements:**

- The `<Link>` is the interactive element (the entire card). Children cannot use `:hover` on themselves because CSS `:hover` on a child only triggers when that child is hovered, not the parent.
- Adding `group` to the parent + `group-hover:` on children triggers child styles whenever the parent is hovered — exactly the pattern needed.
- Note: the existing direct `hover:border-border-active hover:bg-bg-tertiary` on `<Link>` itself remain unchanged; they affect the link element directly and continue to work alongside `group`.

**Why `max-h-0` / `max-h-24` for the reveal (not `height: 0`):**

- CSS `height` cannot transition to `auto`; `max-height` can be used as a proxy to animate from 0 to a fixed maximum.
- `max-h-24` = `6rem = 96px` — sufficient for two lines of text at `text-xs`.
- Content is accessible via screen readers despite `md:opacity-0 md:max-h-0` because opacity and max-height do NOT trigger `display:none` semantics; `visibility:hidden` or `display:none` would hide from AT.

**Why `md:` breakpoint (768px) for the reveal toggle:**

- The `md` breakpoint (768px) is Tailwind's tablet+ boundary; below it = mobile where all content must be visible (AC4, UX-DR10).
- Tailwind v4 uses the same mobile-first breakpoint system as v3.

**Why NO `"use client"` directive:**

- Hover reveal is entirely CSS-driven (Tailwind utilities). No JavaScript, no DOM access, no event handlers needed.
- Adding `"use client"` would unnecessarily shift the component to the client bundle, hurting performance.
- Architecture explicitly states: "`"use client"` only where DOM access or browser APIs are needed — never preemptively."

**Why `motion-reduce:transition-none` on the reveal div:**

- Belt-and-suspenders clarity alongside `globals.css` global override.
- Existing pattern throughout the codebase (`not-found.tsx`, `Footer.tsx`, `NavLinks.tsx`, existing card link).
- Under `prefers-reduced-motion`, `globals.css` already sets `transition-duration: 0.01ms !important` globally — the reveal content is effectively instant. Adding `motion-reduce:transition-none` makes the intent explicit.
- **Important:** Under reduced motion, the reveal content is visible immediately on hover (instant transition), and on mobile it remains always visible — both correct behaviors.

**Date formatting (`formatMonthYear`):**

- Helper is defined inside `ProjectCard.tsx`, not in `src/lib/` — it's a single-use formatting function specific to this component.
- Uses `Date` constructor with explicit integer parsing for reliable cross-runtime behavior.
- `startDate` format is `"YYYY-MM"` (ISO 8601 month precision) per schema docs (`data/README.md`).

### Animation System Ownership (Architecture Rule)

Per architecture doc (line 197–200):
| Concern | Owner | Mechanism |
|---|---|---|
| Hover/state micro-animations | **Tailwind CSS** | `transition-*`, `hover:`, `motion-reduce:` |

This story is **Tailwind-only**. Do NOT import GSAP or Framer Motion. These libraries are already used in `AnimatedSection.tsx` (GSAP) and `PageTransition.tsx` (Framer), and the architecture forbids mixing them in the same component.

### Project Structure Notes

- `ProjectCard.tsx` stays in `src/components/` — no new files created by this story
- Named export `ProjectCard` — no default export (ARC rule)
- No new dependencies needed — `group` and `group-hover:` are built-in Tailwind utilities
- No `tailwind.config.*` changes needed — Tailwind v4 uses CSS-native configuration via `globals.css`

### References

- [Source: epics.md — Story 6.4 full AC] Epic 6, lines ~789–815
- [Source: epics.md — UX-DR17] Line ~107: "Project hover reveal pattern: Tailwind `group-hover:` pattern; suppressed under `prefers-reduced-motion`"
- [Source: epics.md — UX-DR10] Line ~100: "hover reveal of additional context on desktop only — mobile shows all info by default"
- [Source: architecture.md — Animation system] Line ~197: "Hover/state micro-animations | Tailwind CSS | `transition-*`, `hover:`, `motion-reduce:`"
- [Source: architecture.md — `"use client"` rules] Line ~388: "Place `"use client"` only where DOM access or browser APIs are needed — never preemptively"
- [Source: architecture.md — Anti-patterns] Line ~415: "Importing GSAP in a Framer Motion component or vice versa" — applies inversely here (no GSAP/Framer in a Tailwind-only component)
- [Source: ux-design-specification.md — ProjectCard anatomy] Line ~962: "Hover (desktop): border shifts to accent color, card lifts 2px" — NOTE: the epics AC overrides "lifts 2px" with just border-active + bg-tertiary; follow epics, not UX spec for lift
- [Source: src/components/ProjectCard.tsx] Current file — full className preserved in exact implementation above
- [Source: src/app/globals.css] Lines 48, 187: `--duration-micro: 150ms` / `0ms` under prefers-reduced-motion
- [Source: data/README.md] `outcome` field: "Brief outcome for card hover state (≤ 100 chars recommended)"
- [Source: src/types/project.ts] `Project` interface — `outcome: string`, `startDate: string`, `endDate?: string`

## Dev Agent Record

### Agent Model Used

Claude Sonnet 4.6

### Debug Log References

_No blockers or deviations — implementation matched story spec exactly._

### Completion Notes List

- Implemented `group` + `group-hover:` pattern on `ProjectCard`'s `<Link>` root; all pre-existing hover/focus classes preserved.
- Added hover-reveal `<div>` with `border-t` separator: `outcome` text and date range visible always on mobile (`base:`), hidden on desktop until hover (`md:opacity-0 md:max-h-0` → `md:group-hover:opacity-100 md:group-hover:max-h-24`).
- `formatMonthYear` helper converts `"YYYY-MM"` → `"Mon YYYY"` using `Date` with explicit integer parsing; `endDate` optional guard renders "Present" when absent.
- Both seed projects render correct dates: `portfolio-website` → "Apr 2026 – Present"; `realtime-dashboard` → "Jun 2024 – Feb 2025".
- `ProjectCard` remains a server component — no `"use client"`, no GSAP/Framer imports.
- `motion-reduce:transition-none` applied on reveal div (belt-and-suspenders alongside `globals.css` global override).
- `pnpm build`: 0 TypeScript errors, all 6 routes pre-render successfully.

### File List

- `src/components/ProjectCard.tsx` — updated (added `group`, `formatMonthYear` helper, hover-reveal section)

## Change Log

| Date       | Change                                                                                                                                                                                                 | Author            |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------- |
| 2026-05-24 | Implemented hover reveal: `group`/`group-hover:` pattern, `formatMonthYear` helper, outcome + date range reveal div with mobile-always-visible / desktop-hover-reveal logic; `pnpm build` passes clean | Claude Sonnet 4.6 |
