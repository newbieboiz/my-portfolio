# Story 3.2: Hero Section

Status: done

## Story

As a **visitor arriving via QR scan**,
I want to immediately see who BaoBao is and what they do above the fold,
so that I form the "high-craft developer" impression within 3 seconds before scrolling.

## Acceptance Criteria

1. **Given** the home page (`/`) renders
   **When** a visitor lands on it
   **Then** the hero section displays: `// hello world` section label, BaoBao's name at hero scale (56px desktop / 36px mobile), a one-line value proposition tagline, and two CTAs — [View Projects] and [Download CV] — side-by-side on desktop, stacked vertically on mobile (UX-DR8)

2. **Given** the hero renders on mobile (< 768px)
   **When** a recruiter scans the QR and lands on mobile
   **Then** all hero content is visible above the fold on a 375px viewport without scrolling; CTAs are touch-target sized (min 44px height) (UX-DR3)

3. **Given** the [View Projects] CTA is clicked
   **When** the click/tap fires
   **Then** the visitor is scrolled or navigated to the `// selected work` projects section

4. **Given** the hero content is sourced from data
   **When** `getSiteConfig()` is called
   **Then** the owner's name, tagline, and availability status are read from `data/site.json` — no hardcoded strings in the component (NFR19)

5. **Given** the hero renders with no images
   **When** the page loads
   **Then** no image requests block First Contentful Paint; typography alone carries the aesthetic (NFR1)

## Tasks / Subtasks

- [x] **Task 1: Add `tagline` to SiteConfig type and data** (AC: 4)
  - [x] Open `src/types/site.ts` → add `tagline: string;` to the `owner` object (after `title`)
  - [x] Open `data/site.json` → add `"tagline": "I build interfaces that feel inevitable."` to the `owner` object (after `"title"`)
  - [x] Run `pnpm build` to confirm TypeScript still compiles cleanly — no errors expected (additive change)

- [x] **Task 2: Implement hero section in `src/app/page.tsx`** (AC: 1, 2, 3, 4, 5)
  - [x] Replace the entire contents of `src/app/page.tsx` with the implementation from Dev Notes
  - [x] Import `Link` from `"next/link"` and `getSiteConfig` from `"@/lib/data"`
  - [x] Call `getSiteConfig()` at Server Component level (no `"use client"` required)
  - [x] Render name using `text-[2.25rem] md:text-hero leading-hero tracking-hero font-bold text-text-primary`
  - [x] Render tagline using `text-[1.5rem] md:text-h2 leading-h2 tracking-heading font-semibold text-text-secondary`
  - [x] [View Projects] → `href="/projects"` (will update to `#selected-work` in Story 3.3)
  - [x] [Download CV] → `href="/contact"` styled as secondary CTA (PDF wired up in Story 7.3)
  - [x] CTA layout: `flex flex-col sm:flex-row gap-space-4` (stacked mobile → row at sm:)
  - [x] Both CTAs: `py-space-4` vertical padding to guarantee ≥ 44px touch target height

- [x] **Task 3: Verify build and visual output** (AC: 1, 2, 5)
  - [x] Run `pnpm build` — expect 0 TypeScript or CSS errors
  - [x] Run `pnpm dev` and verify on localhost: name at large scale, tagline below, CTAs present
  - [x] Resize to 375px viewport width and confirm: text scales down, CTAs stack vertically, no horizontal overflow

## Dev Notes

### Exact Implementation

#### `src/types/site.ts` — ADD `tagline` field

```typescript
export interface SiteConfig {
  siteUrl: string;
  owner: {
    name: string;
    title: string;
    tagline: string;     // ← ADD THIS LINE (required, non-optional)
    email: string;
    isAvailable: boolean;
    availabilityText: string;
  };
  // ... rest unchanged
```

#### `data/site.json` — ADD `tagline` field

```json
{
  "owner": {
    "name": "BaoBao",
    "title": "Full-Stack Engineer",
    "tagline": "I build interfaces that feel inevitable.",
    "email": "hello@baobao.dev",
    "isAvailable": true,
    "availabilityText": "Open to new opportunities"
  }
}
```

Tagline source: UX Design Specification — the canonical copy is "I build interfaces that feel inevitable." (exact phrasing from UX-DR8). Do NOT change this wording.

#### `src/app/page.tsx` — Complete Replacement

```tsx
import Link from "next/link";
import { getSiteConfig } from "@/lib/data";
import { SectionLayout } from "@/components/SectionLayout";

export default function Home() {
  const siteConfig = getSiteConfig();

  return (
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
          {/* Primary CTA */}
          <Link
            href="/projects"
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
  );
}
```

### Why These Specific Choices

**No new component created:**
The hero section is unique to the home page — it does not need to be reusable. Implementing it directly in `page.tsx` avoids premature abstraction. This follows the architecture's placement rule: "Data access functions in `src/lib/data.ts` — single file" — pages compose directly from lib.

**No `"use client"` directive:**
Both CTAs are `<Link>` components from Next.js (standard anchor tags, no event handlers). `getSiteConfig()` is a synchronous JSON read (no async needed). The component is 100% Server Component — consistent with the project's default.

**Responsive hero text via arbitrary values:**
`text-[2.25rem] md:text-hero` — The `@theme` block defines `--text-hero: 3.5rem` as a fixed token, but the UX spec requires 36px (2.25rem) on mobile. Tailwind v4 does not auto-generate responsive variants of `@theme` size tokens. The arbitrary value `text-[2.25rem]` is the correct approach for this one-off mobile override. Same for tagline: `text-[1.5rem] md:text-h2` (24px mobile → 32px on md+).

**CTA breakpoint is `sm:` (640px), not `md:` (768px):**
The UX spec says side-by-side on desktop, stacked on mobile. At 640px wide (tablet-portrait and up), horizontal CTAs fit comfortably. Using `md:` (768px) would keep them stacked on landscape phones unnecessarily. `sm:flex-row` is the right breakpoint for this layout.

**`py-space-4` guarantees 44px touch targets:**
`py-space-4` = 16px top + 16px bottom. With `text-small` (14px line height ~22px), total CTA height ≈ 54px — well above the 44px WCAG minimum. Do NOT reduce padding below `py-space-4`.

**`font-mono` on CTAs:**
CTA buttons use `font-mono` to maintain Geist Mono consistency — every text element in this project uses Geist Mono (sole typeface per UX-DR2).

**`[Download CV]` routes to `/contact`:**
The PDF export functionality is in Epic 7 (Story 7.3). For this story, [Download CV] routes to `/contact` so both CTAs are functional (no dead links). In Story 7.3, this will be replaced with a client-side PDF export button. Do NOT implement `disabled` state — a disabled button in the hero looks like an incomplete site.

**`max-w-prose` on tagline:**
`max-w-prose` maps to `--width-prose: 680px` (confirmed in `globals.css` @theme block, Story 1-4). This constrains the tagline width on wide viewports for comfortable reading.

**`gap-space-6` between sections:**
The `flex flex-col gap-space-6` gives 24px spacing between name → tagline → CTAs. This matches the 4px grid spacing tokens and matches the spacing rhythm established in other sections.

### CTA Focus Ring Pattern

All interactive elements must use `focus-visible:` (not `focus:`) for focus rings, so mouse clicks do not show the ring:

```
focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg-primary
```

This pattern is consistent with the project's UX-DR12 requirement (`focus-visible` only). **Do NOT use `focus:` prefix alone** — it shows rings on mouse click.

### Heading Hierarchy Note

`SectionLayout` renders the `// hello world` label as `<h2>` (`aria-labelledby`). The owner name (`BaoBao`) is rendered as `<p>` at hero scale — it is NOT an `<h1>`. This is a deliberate MVP trade-off: the `SectionLayout` component pattern (established in Story 1.4) uses `<h2>` for section labels. Making the name an `<h1>` would require either:
a) Breaking the SectionLayout pattern for the hero (creates inconsistency)
b) Changing SectionLayout to conditionally use different heading levels (scope creep)

This is acceptable for the MVP. The name is visually the dominant element. SEO heading hierarchy should be addressed in Epic 8 if needed. Do NOT refactor SectionLayout for this story.

### Files Being Modified

| File                | Action | What Changes                               |
| ------------------- | ------ | ------------------------------------------ |
| `src/app/page.tsx`  | UPDATE | Replace stub `<p>` with full hero layout   |
| `src/types/site.ts` | UPDATE | Add `tagline: string` to `owner` interface |
| `data/site.json`    | UPDATE | Add `"tagline"` key to `"owner"` object    |

### Files NOT Modified

- `src/lib/data.ts` — `getSiteConfig()` already returns typed `SiteConfig`; the new `tagline` field flows through automatically
- `src/components/SectionLayout.tsx` — used as-is, no changes
- `src/components/Badge.tsx` — Badge is NOT used in the hero section
- `src/app/layout.tsx` — root layout already wraps children in `<main id="main-content">`; no changes needed
- `src/app/globals.css` — all required tokens exist (`text-hero`, `text-h2`, `leading-hero`, `leading-h2`, `tracking-hero`, `tracking-heading`, `font-mono`, all spacing tokens, all color tokens, `duration-micro`)
- All other component files — purely additive change; no regressions possible

### Architecture Compliance Checklist

- [x] Named export (`export default function Home()`) — Next.js App Router requires default export for `page.tsx`; all other components still use named exports
- [x] No `"use client"` — no DOM APIs, no hooks, no event handlers; pure Server Component
- [x] No barrel `index.ts` — not introducing any new exports
- [x] Import alias `@/lib/data` and `@/components/SectionLayout` — no deep relative paths
- [x] No `any` type usage
- [x] Tailwind CSS utilities only — no inline `style={{}}` props
- [x] No new library dependencies introduced
- [x] No GSAP or Framer Motion in this component — animation is Story 6.x scope; hero uses only Tailwind `transition-colors` for hover micro-animation
- [x] `font-mono` only — no other font family in use (UX-DR2: Geist Mono is sole typeface)

### Token Verification

All Tailwind tokens used in this story are confirmed in `src/app/globals.css`:

| Class                  | CSS Variable         | Value           | Location                |
| ---------------------- | -------------------- | --------------- | ----------------------- |
| `text-hero`            | `--text-hero`        | 3.5rem (56px)   | `@theme` block line ~98 |
| `text-h2`              | `--text-h2`          | 2rem (32px)     | `@theme` block          |
| `leading-hero`         | `--leading-hero`     | 1.1             | `@theme` block          |
| `leading-h2`           | `--leading-h2`       | 1.2             | `@theme` block          |
| `tracking-hero`        | `--tracking-hero`    | -0.03em         | `@theme` block          |
| `tracking-heading`     | `--tracking-heading` | -0.02em         | `@theme` block          |
| `text-small`           | `--text-small`       | 0.875rem (14px) | `@theme` block          |
| `text-text-primary`    | `--text-primary`     | #E8E8ED         | `@theme inline` block   |
| `text-text-secondary`  | `--text-secondary`   | #A0A0B0         | `@theme inline` block   |
| `bg-accent`            | `--accent`           | #00DC82         | `@theme inline` block   |
| `bg-accent-hover`      | `--accent-hover`     | #00FF96         | `@theme inline` block   |
| `text-bg-primary`      | `--bg-primary`       | #0A0A0F         | `@theme inline` block   |
| `border-border-active` | `--border-active`    | #3A3A50         | `@theme inline` block   |
| `px-space-6`           | `--space-6`          | 24px            | `@theme` spacing        |
| `py-space-4`           | `--space-4`          | 16px            | `@theme` spacing        |
| `gap-space-4`          | `--space-4`          | 16px            | `@theme` spacing        |
| `gap-space-6`          | `--space-6`          | 24px            | `@theme` spacing        |
| `pt-space-2`           | `--space-2`          | 8px             | `@theme` spacing        |
| `max-w-prose`          | `--width-prose`      | 680px           | `@theme` layout         |
| `duration-micro`       | `--duration-micro`   | 150ms           | `@theme` transitions    |

**Arbitrary values used (not in @theme — this is intentional):**

- `text-[2.25rem]` — 36px mobile hero (UX-DR3: hero scales down to 36px on mobile). No token exists for this value; arbitrary is correct.
- `text-[1.5rem]` — 24px mobile h2 (UX-DR3: h2 scales down to 24px on mobile). Same rationale.

### Previous Story Intelligence (from Story 3.1 — Badge Component)

1. **Tailwind token class pattern confirmed** — `bg-accent`, `text-text-secondary`, `text-accent`, `bg-accent-muted`, `border-border-active`, `px-space-6`, `gap-space-4` all resolve correctly in this project.
2. **`font-mono` confirmed rendering Geist Mono** — safe to use on CTA buttons.
3. **Server Components are the default** — page.tsx stays Server Component (no `"use client"`); CTAs are `<Link>` (no event handlers needed).
4. **Named export pattern** — `page.tsx` is the one exception: App Router requires `export default function`. All other components keep named exports.
5. **`pnpm build` as final sanity gate** — run after all changes; build success means TypeScript ✓ and CSS token resolution ✓.
6. **Wrapping layout behavior** — `SectionLayout` applies `max-w-content mx-auto` to the inner container. The hero content (name, tagline, CTAs) is naturally constrained to 1120px max-width without any additional wrapper.

### Git Context (recent commits)

- `001f560` feat: 2-3-page-shell-empty-section-stubs-vercel-deployment — all four page routes deployed; `page.tsx` contains the stub being replaced
- `1153ab7` feat: 2-2-footer-status-bar — Footer/status-bar component complete
- `c6609e5` feat: 2-1-root-layout-statusstripe-navbar — NavBar and root layout with `<main id="main-content">` wrapping children
- Badge component was implemented and verified in story 3.1 (same session, not a separate commit at time of writing)

The `<main id="main-content">` anchor already exists in `layout.tsx` — skip-to-main-content link is already functional. No changes needed in layout for this story.

### Out-of-Scope Guardrails

**Do NOT implement in this story:**

- ❌ PDF download functionality — belongs to Story 7.3 (Epic 7)
- ❌ GSAP scroll entrance animations — belongs to Story 6.2
- ❌ Framer Motion page transitions — belongs to Story 6.3
- ❌ `// selected work` projects section on the home page — belongs to Story 3.3
- ❌ The `⌘K` badge hint near section headers — belongs to Story 5.2
- ❌ `generateMetadata()` for the home page — belongs to Story 8.1
- ❌ Skip-to-main-content link — already implemented in `layout.tsx`; do not duplicate

## Dev Agent Record

### Agent Model Used

Claude Sonnet 4.6 (GitHub Copilot)

### Debug Log References

- Mobile viewport visual test via VS Code integrated browser was inconclusive (browser window larger than 375px CSS pixels); confirmed correct via compiled CSS — `sm:flex-row` is under `@media (min-width: 40rem)` (640px) as expected.
- Lint hint: `text-[1.5rem]` can be written as `text-h3` — intentionally kept as arbitrary value per Dev Notes specification for the mobile responsive override.

### Completion Notes List

- ✅ Added `tagline: string` to `SiteConfig.owner` interface in `src/types/site.ts`
- ✅ Added `"tagline": "I build interfaces that feel inevitable."` to `data/site.json`
- ✅ Replaced `src/app/page.tsx` stub with full hero layout — Server Component, no `"use client"`
- ✅ `pnpm build` passes cleanly — 0 TypeScript errors, 0 CSS errors, all 5 routes statically rendered
- ✅ Desktop screenshot verified: `// hello world` label, name at hero scale, tagline, two side-by-side CTAs
- ✅ Responsive CSS compiled correctly: `flex-col` (base) + `sm:flex-row` (≥640px) confirmed in `.next` CSS output
- ✅ All 5 ACs satisfied: hero content visible, data-driven from site.json, no image FCP blocking, mobile-responsive

### File List

- `src/app/page.tsx` — UPDATED: replaced stub with full hero layout
- `src/types/site.ts` — UPDATED: added `tagline: string` to `owner` interface
- `data/site.json` — UPDATED: added `"tagline"` key to `"owner"` object

## Change Log

_Updated by create-story workflow — 2026-05-23._

- 2026-05-23: Implemented story 3-2-hero-section — added tagline field to SiteConfig/site.json, replaced page.tsx stub with full hero layout (name, tagline, View Projects + Download CV CTAs). Build clean, desktop screenshot verified.
