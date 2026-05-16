# Story 1.4: SectionLayout Component

Status: done

## Story

As a **visitor**,
I want every page section to have consistent structure, spacing, and the coding-vibe `// comment` label,
so that the portfolio feels like one coherent design system rather than isolated pages.

## Acceptance Criteria

1. **Given** `SectionLayout` is rendered with a `label` and `id` prop  
   **When** it renders on any viewport  
   **Then** the `// {label}` comment-style heading appears in `--text-tertiary` color using Geist Mono; section content is constrained to max-width 1120px; vertical padding uses values from the spacing scale

2. **Given** `SectionLayout` is rendered with a `prose` boolean prop  
   **When** long-form content renders inside it  
   **Then** inner content max-width is 680px for optimal monospace reading line length

3. **Given** a keyboard user tabs through the page  
   **When** the skip-to-main-content link is the first focusable element  
   **Then** it resolves to the `id="main-content"` anchor; section `id` props are usable as anchor link targets

4. **Given** `SectionLayout` renders on mobile (< 768px)  
   **When** the viewport is 320px wide  
   **Then** horizontal padding ensures no content overflow; `// comment` labels do not truncate or wrap awkwardly

## Tasks / Subtasks

- [x] **Task 1: Create `SectionLayout` component** (AC: 1, 2, 4)
  - [x] Create `src/components/SectionLayout.tsx` as a Server Component (no `"use client"`)
  - [x] Add typed props interface: `label`, `id`, `children`, optional `prose`
  - [x] Render semantic `<section>` with `aria-labelledby`
  - [x] Render `// {label}` heading in Geist Mono and `--text-tertiary`
  - [x] Apply responsive padding and width constraints (`1120px` default, `680px` prose)

- [x] **Task 2: Implement skip-to-main-content anchor flow** (AC: 3)
  - [x] Update `src/app/layout.tsx` so the first focusable element is a skip link targeting `#main-content`
  - [x] Ensure main landmark exists and receives `id="main-content"`
  - [x] Preserve existing root layout server-rendering and font wiring

- [x] **Task 3: Integrate SectionLayout in live page shell** (supports AC: 1-4 verification)
  - [x] Replace starter scaffold in `src/app/page.tsx` with a minimal `SectionLayout` usage
  - [x] Use a real section anchor id and label from UX (`hello world`)
  - [x] Keep page as default-exported Server Component

- [x] **Task 4: Validate behavior and regression safety** (AC: 1-4)
  - [x] Run `pnpm lint`
  - [x] Run `pnpm build`
  - [x] Run manual viewport checks at 320px, 768px, 1024px+
  - [x] Run keyboard checks for skip-link visibility and target focus behavior

### Review Findings

- [x] [Review][Patch] Skip-link target should be programmatically focusable for reliable keyboard flow [src/app/layout.tsx:29]
- [x] [Review][Patch] Skip-link focus styles should use tokenized spacing and typography utilities [src/app/layout.tsx:25]
- [x] [Review][Defer] Section id normalization and duplicate-id guards for anchor safety [src/components/SectionLayout.tsx:18] — deferred, pre-existing
- [x] [Review][Defer] Long unbroken labels may wrap awkwardly on narrow viewports [src/components/SectionLayout.tsx:25] — deferred, pre-existing

## Dev Notes

### Developer Context Section

Story 1.4 is the first reusable layout primitive in the UI layer and a dependency for subsequent shell/content stories:

- Epic 2 story shell components (`NavBar`, `StatusStripe`, `Footer`) assume `SectionLayout` exists.
- Epic 3+ content pages depend on stable section rhythm, width rules, and anchor ids.
- This component sets the baseline for visual coherence and accessibility semantics for all page sections.

### Technical Requirements

- Use existing design-token system from `src/app/globals.css`; do not introduce new ad-hoc colors or spacing scales.
- Honor spacing tokens that map to UX rhythm:
  - Mobile section padding baseline: `--space-8` / 32px
  - Desktop section padding baseline: `--space-12` / 48px
- Respect width constraints already defined in tokens:
  - Content max width: `1120px`
  - Prose max width: `680px`
- Section ids must be stable anchor targets (`#projects`, `#about`, etc.) and should not be generated randomly.

### Architecture Compliance

- Server Components by default (architecture): `SectionLayout` remains server-rendered.
- Named exports only for shared components:
  - `export function SectionLayout(...)`
- No barrel files (`index.ts`) for components.
- Keep `"use client"` as deep as possible; do not place it in `layout.tsx` or `page.tsx`.
- Keep imports aligned to alias rules (`@/components/...`) for intra-`src` imports.

### Library / Framework Requirements

Current project stack (from `package.json`):

- `next@16.2.6`
- `react@19.2.4`
- `tailwindcss@^4`
- `typescript@^5`

Latest technical specifics relevant to this story:

- Next.js App Router docs confirm layouts/pages are Server Components by default; only add `"use client"` where interactivity is required.
- Next.js `use client` directive defines client/server boundary; avoid promoting static layout wrappers into client bundles.
- Tailwind responsive system is mobile-first:
  - unprefixed classes target mobile base
  - `md:` starts at 768px
  - `lg:` starts at 1024px
- WCAG 2.1 AA contrast minimum for normal text is `4.5:1`; `--text-tertiary` on `--bg-primary` was designed to meet this threshold.

### File Structure Requirements

#### Files to Create

- `src/components/SectionLayout.tsx` (NEW)
- `src/components/` directory (NEW, if absent)

#### Files to Update

- `src/app/layout.tsx` (UPDATE)
- `src/app/page.tsx` (UPDATE)

#### Files to Preserve (No Change Expected)

- `src/app/globals.css` (token source of truth)
- `src/lib/data.ts` and all `data/*.json` (unrelated to this layout story)

### Update-File Intelligence (Read Before Implementing)

#### `src/app/layout.tsx` (UPDATE)

Current state:

- Loads Geist Mono via `next/font/google`
- Applies font variable + base layout classes on `<html>` and `<body>`
- Metadata still starter default
- Does not yet provide skip-link or explicit main landmark id

What this story changes:

- Add skip-to-main-content link as first focusable element in `<body>`
- Ensure children are wrapped so `id="main-content"` exists as anchor target

What must be preserved:

- Keep Geist Mono variable binding (`--font-geist-mono`)
- Keep server-component root layout (no `"use client"`)
- Keep body flex/min-height behavior to avoid shell regressions

#### `src/app/page.tsx` (UPDATE)

Current state:

- Still default create-next-app starter markup with `next/image` assets
- Uses placeholder content and styling not aligned with project UX direction

What this story changes:

- Replace starter scaffold with a minimal `SectionLayout`-based section
- Establish the first real section label (`// hello world`) and anchor id usage

What must be preserved:

- Keep page as default-exported server page component
- Avoid introducing client-only logic or browser APIs here

#### `src/app/globals.css` (PRESERVE)

Current state:

- Contains full token system (colors, spacing, typography, motion)
- Includes width constants for content/prose
- Includes reduced-motion handling and dark-first base styles

What this story changes:

- No direct edits required unless a hard blocker appears during implementation

What must be preserved:

- Token values and naming conventions
- `@theme` mappings that power Tailwind utility generation

### Testing Requirements

Automated checks required:

- `pnpm lint`
- `pnpm build`

Manual checks required:

1. **AC1 - Label + width + spacing**
   - Render section with `label` and `id`
   - Verify visible `// {label}` in tertiary text color
   - Verify content wrapper caps at `1120px` on desktop

2. **AC2 - Prose variant**
   - Render with `prose={true}`
   - Verify inner content width capped at `680px`

3. **AC3 - Skip-link + anchor flow**
   - First `Tab` reveals skip-link
   - `Enter` navigates/focuses main content target `#main-content`
   - Section ids remain usable as anchor link targets

4. **AC4 - Mobile safety at 320px**
   - No horizontal overflow
   - `// comment` labels remain readable without awkward truncation/wrapping

Regression checks:

- Root font loading still works (Geist Mono active)
- No reintroduction of light background flash
- No accessibility regressions in focus order

### Previous Story Intelligence (from Story 1.3)

- Preserve strict TypeScript discipline (`strict: true`, no `any`).
- Keep architecture boundaries clear: data/content concerns remain in `data/` + `src/lib/*`.
- Continue named export and alias conventions established in prior stories.
- Continue using `pnpm build` as final acceptance gate after edits.

### Git Intelligence Summary (Recent Patterns)

- Recent commits are story-scoped and narrow in file footprint (good pattern to keep).
- Foundation stories touched only expected layers:
  - Story 1.2 mainly `src/app/globals.css` and `src/app/layout.tsx`
  - Story 1.3 mainly `data/`, `src/types/`, `src/lib/data.ts`
- Implementation artifacts under `_bmad-output/implementation-artifacts/` are updated alongside story progress.
- No dedicated test framework files yet; quality gates currently rely on `lint`, `build`, and manual checks.

### Latest Tech Information

- **Next.js (16.2.6 docs):** App Router `layout.tsx` / `page.tsx` are server by default; add `"use client"` only at true interactive boundaries.
- **Next.js `use client` directive docs:** Client entry points should stay minimal; props crossing server→client boundaries must be serializable.
- **Tailwind responsive docs:** mobile-first with `md` at 768px and `lg` at 1024px, matching project breakpoint requirements.
- **WCAG 2.1 contrast minimum:** normal text requires at least `4.5:1`; avoid lowering tertiary text contrast during implementation.

### Project Context Reference

- Planning artifacts used:
  - `_bmad-output/planning-artifacts/epics.md`
  - `_bmad-output/planning-artifacts/prd.md`
  - `_bmad-output/planning-artifacts/architecture.md`
  - `_bmad-output/planning-artifacts/ux-design-specification.md`
- Previous implementation artifact used:
  - `_bmad-output/implementation-artifacts/1-3-content-data-schema-typescript-interfaces-seed-data.md`
- Existing implementation files analyzed:
  - `src/app/layout.tsx`
  - `src/app/page.tsx`
  - `src/app/globals.css`
  - `package.json`

### References

- [Source: `_bmad-output/planning-artifacts/epics.md#Story 1.4: SectionLayout Component`]
- [Source: `_bmad-output/planning-artifacts/epics.md#Epic 1`, `#Epic 2`]
- [Source: `_bmad-output/planning-artifacts/architecture.md#Core Architectural Decisions`]
- [Source: `_bmad-output/planning-artifacts/architecture.md#Implementation Patterns & Consistency Rules`]
- [Source: `_bmad-output/planning-artifacts/ux-design-specification.md#SectionLayout`]
- [Source: `_bmad-output/planning-artifacts/ux-design-specification.md#Spacing & Layout Foundation`]
- [Source: `_bmad-output/planning-artifacts/ux-design-specification.md#Accessibility Considerations`]
- [Source: `_bmad-output/implementation-artifacts/1-3-content-data-schema-typescript-interfaces-seed-data.md`]
- [Source: `src/app/layout.tsx`]
- [Source: `src/app/page.tsx`]
- [Source: `src/app/globals.css`]
- [Source: `package.json`]
- [Source: Next.js docs — Server and Client Components, `use client` directive]
- [Source: Tailwind CSS docs — Responsive design]
- [Source: WCAG 2.1 Understanding SC 1.4.3 Contrast (Minimum)]

## Project Structure Notes

- Align with established structure from architecture: shared components belong in `src/components/`.
- Keep routing/page ownership in `src/app/*` and reusable layout primitive ownership in `src/components/*`.
- Do not move or duplicate design tokens; consume from the existing global token layer.

## Story Completion Status

- **Status:** done
- **Completion Note:** All tasks complete. SectionLayout created, skip-link added to layout, page scaffold replaced. Lint, build, and manual viewport/keyboard checks all pass.
- **Checklist Outcome:** Story includes requirements, architecture guardrails, update-file intelligence, prior learnings, git pattern context, testing plan, and latest technical guidance.

## Dev Agent Record

### Agent Model Used

GPT-5.3-Codex

### Debug Log References

- Artifact discovery and synthesis completed from PRD, architecture, UX, and epics.
- Previous story and current update-target files read completely before story drafting.

### Completion Notes List

- Selected first ready-for-dev story from sprint status: `1-4-sectionlayout-component`.
- Created `src/components/SectionLayout.tsx` as a Server Component with `label`, `id`, `children`, `prose` props; renders `<section aria-labelledby>` with `// {label}` as an `<h2>` in Geist Mono tertiary color; uses design-token Tailwind utilities (`max-w-content`, `max-w-prose`, `px-space-8`, `py-space-8`, `md:py-space-12`).
- Updated `src/app/layout.tsx`: added `sr-only focus:not-sr-only` skip link targeting `#main-content` as first focusable element; wrapped `{children}` in `<main id="main-content">`.
- Replaced starter scaffold in `src/app/page.tsx` with minimal `SectionLayout` usage (`id="hello-world"`, `label="hello world"`).
- `pnpm lint` and `pnpm build` pass with zero errors.
- Manual viewport checks at 320px, 768px, 1024px+ confirmed: no overflow, label stays single-line, correct spacing.
- Keyboard check confirmed: first Tab press reveals skip link with accent color styling; link targets `#main-content`.
- All 4 ACs satisfied.

### File List

- `src/components/SectionLayout.tsx` (NEW)
- `src/app/layout.tsx` (UPDATED)
- `src/app/page.tsx` (UPDATED)
- `_bmad-output/implementation-artifacts/1-4-sectionlayout-component.md` (UPDATED)
- `_bmad-output/implementation-artifacts/sprint-status.yaml` (UPDATED)

## Change Log

- 2026-05-16: Story implemented — SectionLayout component created, skip-link + main landmark added to layout, page scaffold replaced with minimal SectionLayout usage. All lint/build/manual checks pass. Status → review.
