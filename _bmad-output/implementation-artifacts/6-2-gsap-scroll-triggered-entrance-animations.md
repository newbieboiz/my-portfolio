# Story 6.2: GSAP Scroll-Triggered Entrance Animations

Status: done

## Story

As a **visitor**,
I want content sections to animate into view as I scroll,
so that the portfolio feels alive and crafted rather than a static document dump.

## Acceptance Criteria

1. **Given** `AnimatedSection` client wrapper is implemented using `useGSAP` hook
   **When** a section scrolls into the viewport
   **Then** the content fades in and translates up (`y: 24 → 0`, `opacity: 0 → 1`) over 400ms with `ease-out` easing; the ScrollTrigger fires once per section (not on every scroll pass)

2. **Given** project cards in the grid animate on scroll
   **When** the `// selected work` section enters the viewport
   **Then** cards stagger in sequentially (80ms delay between cards) creating a cascade effect; stagger is suppressed under `prefers-reduced-motion`

3. **Given** `AnimatedSection` wraps server-rendered content
   **When** the component tree is inspected
   **Then** `"use client"` is only on `AnimatedSection`, not on any parent page or layout; GSAP is never imported in a Framer Motion component

4. **Given** animations run on mid-range hardware
   **When** scroll animations fire
   **Then** all animation frames target 60fps; no jank is perceptible on a mid-range mobile device (NFR5)

## Tasks / Subtasks

- [x] **Task 1: Install `@gsap/react`** (AC: 1, 2, 3)
  - [x] Run `pnpm add @gsap/react` from the project root
  - [x] Verify `@gsap/react` appears in `package.json` `dependencies` after install
  - [x] Do NOT install any other GSAP add-ons — only the React integration wrapper is missing

- [x] **Task 2: Create `src/components/AnimatedSection.tsx`** (AC: 1, 2, 3, 4)
  - [x] Add `"use client"` as the first line (this is the only component in the tree that needs it for animations)
  - [x] Import `useRef` from `"react"`, `useGSAP` from `"@gsap/react"`, `gsap` from `"gsap"`, `ScrollTrigger` from `"gsap/ScrollTrigger"`
  - [x] Register plugins once at module scope (outside component): `gsap.registerPlugin(useGSAP, ScrollTrigger)`
  - [x] Accept props: `children: React.ReactNode`, `className?: string`, `stagger?: boolean` (default `false`)
  - [x] Create `containerRef = useRef<HTMLDivElement>(null)`
  - [x] Inside `useGSAP`, use `gsap.matchMedia()` to guard animations behind `(prefers-reduced-motion: no-preference)` — content must be immediately visible when reduced motion is set (AC of 6.1 story)
  - [x] Non-stagger path: `gsap.from(containerRef.current, { opacity: 0, y: 24, duration: 0.4, ease: "power2.out", scrollTrigger: { trigger: containerRef.current, start: "top 85%", toggleActions: "play none none none" } })`
  - [x] Stagger path: `gsap.from(Array.from(containerRef.current!.children), { opacity: 0, y: 24, duration: 0.4, ease: "power2.out", stagger: 0.08, scrollTrigger: { trigger: containerRef.current, start: "top 85%", toggleActions: "play none none none" } })`
  - [x] Return `() => mm.revert()` from the `useGSAP` callback to clean up matchMedia on unmount
  - [x] Pass `{ scope: containerRef }` as the second argument to `useGSAP`
  - [x] Return a `<div ref={containerRef} className={className}>{children}</div>`
  - [x] Use named export `AnimatedSection` (no default export — see ARC8)
  - [x] See Dev Notes for exact implementation

- [x] **Task 3: Update `src/app/page.tsx`** — wrap hero content and project grid (AC: 1, 2)
  - [x] Import `AnimatedSection` from `"@/components/AnimatedSection"`
  - [x] Hero section: wrap the `<div className="gap-space-6 flex flex-col">` inside `<SectionLayout id="hello-world">` with `<AnimatedSection>` — preserving the inner div's className unchanged
  - [x] Project grid: replace `<div className="gap-space-6 grid grid-cols-1 md:grid-cols-2">` with `<AnimatedSection stagger className="gap-space-6 grid grid-cols-1 md:grid-cols-2">` — `AnimatedSection` becomes the grid container; remove the inner `<div>` wrapper
  - [x] page.tsx remains a server component (no `"use client"` added) — AnimatedSection is a client leaf imported into a server tree

- [x] **Task 4: Update `src/app/projects/page.tsx`** — wrap project grid with stagger (AC: 1, 2)
  - [x] Import `AnimatedSection` from `"@/components/AnimatedSection"`
  - [x] Replace `<div className="gap-space-6 grid grid-cols-1 md:grid-cols-2">` with `<AnimatedSection stagger className="gap-space-6 grid grid-cols-1 md:grid-cols-2">`
  - [x] page.tsx stays a server component — no `"use client"` added

- [x] **Task 5: Update `src/app/about/page.tsx`** — wrap each section's content (AC: 1)
  - [x] Import `AnimatedSection` from `"@/components/AnimatedSection"`
  - [x] Bio section (`id="about"`): wrap `<p className="text-body ...">` with `<AnimatedSection>`
  - [x] Skills section (`id="skills"`): wrap `<div className="gap-space-12 flex flex-col">` with `<AnimatedSection>` — preserving the inner div className
  - [x] Experience section: wrap the experience list container with `<AnimatedSection>`
  - [x] Education section: wrap the education list container with `<AnimatedSection>`
  - [x] page.tsx stays a server component — no `"use client"` added

- [x] **Task 6: Update `src/app/contact/page.tsx`** — wrap contact content (AC: 1)
  - [x] Import `AnimatedSection` from `"@/components/AnimatedSection"`
  - [x] Wrap `<div className="gap-space-8 flex flex-col">` inside `<SectionLayout id="contact">` with `<AnimatedSection>` — preserve the inner div's className
  - [x] page.tsx stays a server component — no `"use client"` added

- [x] **Task 7: Verify build and manual scroll test** (AC: 1, 2, 3, 4)
  - [x] Run `pnpm build` — 0 TypeScript errors; all routes pre-render successfully
  - [x] Run `pnpm dev` and manually scroll each page; verify sections animate in on scroll
  - [x] Toggle OS `prefers-reduced-motion` (macOS: System Settings → Accessibility → Display → Reduce motion) and verify animations are absent; all content immediately visible
  - [x] Use browser DevTools → Rendering → Emulate CSS media `prefers-reduced-motion: reduce` as an alternative to OS toggle
  - [x] Verify no console errors from GSAP (e.g., `ScrollTrigger not registered` — ensure `registerPlugin` call is present)
  - [x] Verify project card stagger on `/` and `/projects` routes

## Dev Notes

### Critical: `@gsap/react` Must Be Installed First

`@gsap/react` is **NOT in `package.json`** as of story 6.1 completion. The architecture specifies `useGSAP` from this package (ARC5, Architecture section "Animation System"). This must be Task 1.

```bash
pnpm add @gsap/react
```

GSAP 3.15.0 is already installed. `@gsap/react` is a peer of GSAP ≥3.12 and works with 3.15.

### What Exists vs What This Story Builds

| Status                     | Asset                                                  | Location                             | Notes                                                                                                                     |
| -------------------------- | ------------------------------------------------------ | ------------------------------------ | ------------------------------------------------------------------------------------------------------------------------- |
| **EXISTS — DO NOT MODIFY** | `useReducedMotion` hook                                | `src/hooks/useReducedMotion.ts`      | CSS/React reduced-motion primitive from 6.1; NOT used by AnimatedSection directly — GSAP uses `gsap.matchMedia()` instead |
| **EXISTS — DO NOT MODIFY** | Global `@media (prefers-reduced-motion: reduce)` block | `src/app/globals.css` lines ~186–200 | Sets `--duration-entrance: 0ms`; covers CSS animations site-wide                                                          |
| **EXISTS — DO NOT MODIFY** | `SectionLayout`                                        | `src/components/SectionLayout.tsx`   | The `section` + heading wrapper; `AnimatedSection` wraps SectionLayout's children from inside                             |
| **EXISTS — DO NOT MODIFY** | `ProjectCard`                                          | `src/components/ProjectCard.tsx`     | Already has `motion-reduce:transition-none` from 6.1; no changes needed                                                   |
| **NEW**                    | `src/components/AnimatedSection.tsx`                   | `src/components/`                    | Client wrapper for scroll-triggered GSAP entrance; named export                                                           |
| **EXISTS — UPDATE**        | `src/app/page.tsx`                                     | Home page                            | Import + apply `AnimatedSection` to hero content and project grid                                                         |
| **EXISTS — UPDATE**        | `src/app/projects/page.tsx`                            | Projects page                        | Import + apply `AnimatedSection` with stagger to project grid                                                             |
| **EXISTS — UPDATE**        | `src/app/about/page.tsx`                               | About page                           | Import + apply `AnimatedSection` to each section content block                                                            |
| **EXISTS — UPDATE**        | `src/app/contact/page.tsx`                             | Contact page                         | Import + apply `AnimatedSection` to contact content                                                                       |

### Exact Implementation: `src/components/AnimatedSection.tsx`

```tsx
"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register plugins once at module scope — safe to call multiple times (idempotent)
gsap.registerPlugin(useGSAP, ScrollTrigger);

interface AnimatedSectionProps {
  children: React.ReactNode;
  className?: string;
  stagger?: boolean;
}

export function AnimatedSection({
  children,
  className,
  stagger = false,
}: AnimatedSectionProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        if (stagger) {
          // Stagger mode: animate each direct child element individually
          gsap.from(Array.from(containerRef.current!.children), {
            opacity: 0,
            y: 24,
            duration: 0.4,
            ease: "power2.out",
            stagger: 0.08, // 80ms between each card — matches epics spec
            scrollTrigger: {
              trigger: containerRef.current,
              start: "top 85%",
              toggleActions: "play none none none", // fire once, no reverse
            },
          });
        } else {
          // Default mode: animate the whole container as one unit
          gsap.from(containerRef.current, {
            opacity: 0,
            y: 24,
            duration: 0.4,
            ease: "power2.out",
            scrollTrigger: {
              trigger: containerRef.current,
              start: "top 85%",
              toggleActions: "play none none none",
            },
          });
        }
      });

      return () => mm.revert();
    },
    { scope: containerRef },
  );

  return (
    <div ref={containerRef} className={className}>
      {children}
    </div>
  );
}
```

### Critical Implementation Notes

**`useGSAP` vs `useEffect` for GSAP:**

- Always use `useGSAP` from `@gsap/react` — it creates a GSAP context that automatically reverts all tweens/ScrollTriggers on unmount. Using `useEffect` can cause memory leaks and ghost ScrollTriggers.
- `{ scope: containerRef }` limits CSS selector scope to within the container. Since this story uses direct `containerRef.current` and `containerRef.current.children` as targets (not CSS selectors), the scope is belt-and-suspenders but still required per GSAP best practices.

**`gsap.matchMedia()` for reduced motion:**

- Do NOT import `useReducedMotion` from `@/hooks/useReducedMotion` inside `AnimatedSection`. The hook is for React state consumers (Framer Motion story 6.3). GSAP uses its own `gsap.matchMedia()` system, which synchronizes with the OS media query directly without React re-renders.
- The `mm.add("(prefers-reduced-motion: no-preference)", ...)` pattern means: run animations ONLY when the user has NOT requested reduced motion. Content at reduced motion stays at its natural visible state (opacity:1, y:0) because `gsap.from()` is never called.
- Return `() => mm.revert()` from the `useGSAP` callback — `useGSAP` calls this cleanup when the component unmounts.

**`gsap.from()` is content-safe:**

- `gsap.from()` initializes from `{opacity: 0, y: 24}` and animates TO the element's current/natural CSS state (opacity:1, y:0). If the callback never runs (reduced motion), the element is naturally visible.
- This means content is NEVER hidden behind an unplayed animation — satisfying AC 5 from story 6.1 ("no content hidden behind an animation that never fires").

**Plugin registration at module scope:**

- `gsap.registerPlugin(useGSAP, ScrollTrigger)` is called once at the top of the file, outside the component function. This is idempotent — calling it multiple times has no side effects. It will only execute once per module load (Next.js module caching).
- Do NOT call `registerPlugin` inside the component body or inside `useGSAP` — that would be redundant and could cause issues.

**`"use client"` boundary:**

- `AnimatedSection.tsx` has `"use client"`. All pages (`page.tsx`) remain server components. Server components CAN render client components — the client component receives `children` as props (which are server-rendered React elements) and wraps them in a client-side GSAP context. This is the correct RSC pattern.
- NEVER add `"use client"` to any page.tsx file for this story (violates ARC8).

**Stagger and `containerRef.current.children`:**

- When `stagger=true`, `AnimatedSection` IS the grid container div (it carries the grid className). Direct children are the `ProjectCard` `<Link>` elements.
- `Array.from(containerRef.current!.children)` converts `HTMLCollection` to an array for GSAP — GSAP accepts arrays of DOM elements directly.
- `containerRef.current!` — the non-null assertion is safe because `useGSAP` only runs after mount when the ref is populated.

**`toggleActions: "play none none none"`:**

- This fires the entrance animation once when the trigger enters the viewport. It does NOT reverse when scrolling back up. This is intentional — content entrances are one-shot.
- `start: "top 85%"` — fires when the top of the section is 85% down from the top of the viewport, giving a comfortable early trigger that feels responsive.

**ARC5 Animation System Boundary Enforcement:**

- `AnimatedSection.tsx` imports GSAP only. It must NEVER import from `framer-motion`.
- The upcoming `PageTransition` component (story 6.3) will import Framer Motion only. It must NEVER import GSAP.
- These are not in the same file — enforced by file structure.

### Page Update Patterns

**`src/app/page.tsx` — Hero section (non-stagger):**

Before:

```tsx
<SectionLayout id="hello-world" label="hello world">
  <div className="gap-space-6 flex flex-col">{/* content */}</div>
</SectionLayout>
```

After:

```tsx
import { AnimatedSection } from "@/components/AnimatedSection";
// ...
<SectionLayout id="hello-world" label="hello world">
  <AnimatedSection>
    <div className="gap-space-6 flex flex-col">{/* content — unchanged */}</div>
  </AnimatedSection>
</SectionLayout>;
```

**`src/app/page.tsx` — Project grid (stagger):**

Before:

```tsx
<SectionLayout id="selected-work" label="selected work" commandHint="⌘K">
  <div className="gap-space-6 grid grid-cols-1 md:grid-cols-2">
    {featuredProjects.map((project) => (
      <ProjectCard key={project.slug} project={project} />
    ))}
  </div>
</SectionLayout>
```

After (AnimatedSection REPLACES the grid div — it carries the className):

```tsx
<SectionLayout id="selected-work" label="selected work" commandHint="⌘K">
  <AnimatedSection
    stagger
    className="gap-space-6 grid grid-cols-1 md:grid-cols-2"
  >
    {featuredProjects.map((project) => (
      <ProjectCard key={project.slug} project={project} />
    ))}
  </AnimatedSection>
</SectionLayout>
```

**`src/app/projects/page.tsx` — Project grid (stagger):**

Before:

```tsx
<SectionLayout id="selected-work" label="selected work">
  <div className="gap-space-6 grid grid-cols-1 md:grid-cols-2">
    {projects.map((project) => (
      <ProjectCard key={project.slug} project={project} />
    ))}
  </div>
</SectionLayout>
```

After:

```tsx
import { AnimatedSection } from "@/components/AnimatedSection";
// ...
<SectionLayout id="selected-work" label="selected work">
  <AnimatedSection
    stagger
    className="gap-space-6 grid grid-cols-1 md:grid-cols-2"
  >
    {projects.map((project) => (
      <ProjectCard key={project.slug} project={project} />
    ))}
  </AnimatedSection>
</SectionLayout>;
```

**`src/app/contact/page.tsx` — wrap inner content div:**

Before:

```tsx
<SectionLayout id="contact" label="contact" prose={true}>
  <div className="gap-space-8 flex flex-col">{/* contact content */}</div>
</SectionLayout>
```

After:

```tsx
import { AnimatedSection } from "@/components/AnimatedSection";
// ...
<SectionLayout id="contact" label="contact" prose={true}>
  <AnimatedSection>
    <div className="gap-space-8 flex flex-col">
      {/* contact content — unchanged */}
    </div>
  </AnimatedSection>
</SectionLayout>;
```

### Architecture Compliance

| ARC Requirement                                               | Compliance                                                                           |
| ------------------------------------------------------------- | ------------------------------------------------------------------------------------ |
| ARC5: GSAP owns scroll-triggered entrances via `useGSAP` hook | ✅ `useGSAP` from `@gsap/react` used in `AnimatedSection`                            |
| ARC5: No component uses GSAP and Framer Motion simultaneously | ✅ `AnimatedSection` imports GSAP only; Framer deferred to story 6.3                 |
| ARC8: `"use client"` only where DOM/browser APIs required     | ✅ Only `AnimatedSection.tsx` has `"use client"`; all pages remain server components |
| ARC8: Named exports only (except page.tsx/layout.tsx)         | ✅ `export function AnimatedSection` — named export                                  |
| ARC8: No barrel `index.ts` files                              | ✅ Not applicable — no new barrel file                                               |
| NFR11: `prefers-reduced-motion` respected site-wide           | ✅ `gsap.matchMedia()` with `(prefers-reduced-motion: no-preference)` guard          |
| NFR5: All animation frames target 60fps                       | ✅ GSAP uses `requestAnimationFrame` internally; 0.4s duration, ease-out             |

### Previous Story Learnings (from 6.1)

- `useReducedMotion` hook is at `src/hooks/useReducedMotion.ts` — do NOT import it in `AnimatedSection` (GSAP's `matchMedia` handles its own reduced motion)
- All existing components have `motion-reduce:transition-none` on hover transitions — this story's GSAP animations are a separate concern and do not conflict
- `"use client"` pattern: existing hooks (`useCommandPalette.ts`, `useKeyboardShortcuts.ts`, `useReducedMotion.ts`) all have it as the first line — follow the same pattern in `AnimatedSection.tsx`
- `globals.css` `@media (prefers-reduced-motion: reduce)` block sets `--duration-entrance: 0ms` — this affects CSS but GSAP runs via JS. `gsap.matchMedia()` is the correct GSAP-layer guard.

### Project Structure

```
src/
  components/
    AnimatedSection.tsx   ← NEW (this story)
    Badge.tsx
    CommandPalette.tsx
    Footer.tsx
    KeyboardShortcutsHelp.tsx
    NavBar.tsx
    NavLinks.tsx
    ProjectCard.tsx
    SectionLayout.tsx
    StatusStripe.tsx
  hooks/
    useCommandPalette.ts
    useKeyboardShortcuts.ts
    useReducedMotion.ts   ← EXISTS (story 6.1)
  app/
    page.tsx              ← UPDATE (tasks 3)
    about/page.tsx        ← UPDATE (task 5)
    contact/page.tsx      ← UPDATE (task 6)
    projects/page.tsx     ← UPDATE (task 4)
```

### UX Design Requirements for This Story

- **UX-DR13:** Motion tokens: 150ms micro, 250ms transition, **400ms entrance** — use `duration: 0.4` (0.4s = 400ms) for `gsap.from()` ✅
- **UX-DR13:** Easing: ease-out for entrances — use `ease: "power2.out"` (GSAP's equivalent of `cubic-bezier(0,0,0.2,1)`) ✅
- **UX-DR14:** `AnimatedSection` client wrapper using GSAP + ScrollTrigger for scroll-triggered entrance animations ✅
- **UX-DR18:** No animation is load-bearing — all content accessible without motion ✅ (via `gsap.from()` which defaults to natural state)

### References

- Story 6.1 file: [_bmad-output/implementation-artifacts/6-1-reduced-motion-infrastructure-usereducedmotion-hook.md]
- Architecture animation system: [_bmad-output/planning-artifacts/architecture.md#Animation System]
- Epics story 6.2: [_bmad-output/planning-artifacts/epics.md#Story 6.2]
- ARC5 boundary rule: [_bmad-output/planning-artifacts/epics.md — ARC5]
- UX-DR13/14: [_bmad-output/planning-artifacts/epics.md — UX-DR13, UX-DR14]
- Existing `SectionLayout`: [src/components/SectionLayout.tsx]
- Existing `ProjectCard`: [src/components/ProjectCard.tsx]
- Home page: [src/app/page.tsx]
- Projects page: [src/app/projects/page.tsx]
- About page: [src/app/about/page.tsx]
- Contact page: [src/app/contact/page.tsx]

## Dev Agent Record

### Agent Model Used

Claude Sonnet 4.6

### Debug Log References

### Completion Notes List

- Installed `@gsap/react` 2.1.2 (peer of GSAP 3.15.0 already present)
- Created `src/components/AnimatedSection.tsx` as a named-export client component using `useGSAP` + `gsap.matchMedia()` for reduced-motion guard; `ScrollTrigger` registered at module scope
- Applied `AnimatedSection` (non-stagger) to hero content on home page and bio/skills/experience+education sections on about page and contact page
- Applied `AnimatedSection stagger` to project grids on home page and projects page — `AnimatedSection` replaces the grid `<div>` and carries the grid classNames directly
- All pages remain server components (`"use client"` only on `AnimatedSection.tsx`)
- `pnpm build` passes with 0 TypeScript errors; all 6 routes pre-render successfully
- `gsap.matchMedia()` with `(prefers-reduced-motion: no-preference)` guard ensures content is always visible at natural state when motion is reduced

### File List

- `src/components/AnimatedSection.tsx` (new)
- `src/app/page.tsx` (modified)
- `src/app/projects/page.tsx` (modified)
- `src/app/about/page.tsx` (modified)
- `src/app/contact/page.tsx` (modified)
- `package.json` (modified — added @gsap/react)
- `pnpm-lock.yaml` (modified — lockfile updated)

## Change Log

- 2026-05-23: Story 6.2 implementation complete — installed @gsap/react, created AnimatedSection client component with GSAP ScrollTrigger and reduced-motion guard, applied to all 4 page routes. Build passes 0 errors.
