# Story 6.1: Reduced Motion Infrastructure & useReducedMotion Hook

Status: done

## Story

As a **visitor with motion sensitivity**,
I want all animations to be suppressed when I have `prefers-reduced-motion` enabled,
so that I can browse the portfolio comfortably without vestibular discomfort — and the site is fully usable without any motion.

## Acceptance Criteria

1. **Given** `src/hooks/useReducedMotion.ts` is implemented
   **When** the hook is called inside any client component
   **Then** it returns `true` when the OS `prefers-reduced-motion: reduce` media query matches, and `false` otherwise; the hook re-evaluates if the OS setting changes mid-session

2. **Given** Tailwind's `motion-reduce:` variant is applied to every animated element
   **When** `prefers-reduced-motion` is enabled
   **Then** all CSS transitions and animations are suppressed (duration set to `0ms` or `1ms`) with no exceptions across the entire site (NFR11)

3. **Given** GSAP ScrollTrigger animations use `gsap.matchMedia()`
   **When** `prefers-reduced-motion` is enabled
   **Then** all GSAP timelines are skipped entirely; content renders in its final visible state immediately without any entrance animation

4. **Given** Framer Motion page transitions use `useReducedMotion()`
   **When** the hook returns `true`
   **Then** `AnimatePresence` transitions are instant (duration 0) or a simple 150ms opacity-only fade at most; no position or scale transforms occur

5. **Given** no animation is load-bearing
   **When** a visitor browses with all motion disabled
   **Then** every piece of content is fully visible and readable; no content is hidden behind an animation that never fires

## Tasks / Subtasks

- [x] **Task 1: Create `src/hooks/useReducedMotion.ts`** (AC: 1)
  - [x] Add `"use client"` as the first line
  - [x] Import `useEffect`, `useState` from `"react"` (no other imports needed)
  - [x] Initialize state to `false` (SSR-safe — no `window` access during server render)
  - [x] In `useEffect`, read `window.matchMedia("(prefers-reduced-motion: reduce)").matches` and set state
  - [x] Add `addEventListener("change", handler)` on the MQL object so the hook re-evaluates reactively when OS setting changes mid-session
  - [x] Return cleanup: `mql.removeEventListener("change", handler)` in the `useEffect` return
  - [x] Return type is `boolean` — export as named export `useReducedMotion`
  - [x] See Dev Notes for exact implementation

- [x] **Task 2: Add `motion-reduce:transition-none` to existing animated elements** (AC: 2)
  - [x] Update `src/components/ProjectCard.tsx` — add `motion-reduce:transition-none` to the `<Link>` className alongside `transition-colors`
  - [x] Update `src/components/Footer.tsx` — add `motion-reduce:transition-none` to all three `<a>` elements that have `transition-colors`
  - [x] Update `src/components/NavLinks.tsx` — add `motion-reduce:transition-none` to the three elements that have `transition-colors` (desktop nav link, mobile hamburger button, mobile nav link)
  - [x] Update `src/app/not-found.tsx` — add `motion-reduce:transition-none` to both `<a>` elements with `transition-colors`
  - [x] Update `src/app/projects/[slug]/page.tsx` — add `motion-reduce:transition-none` to the back-link `<a>` with `transition-colors`
  - [x] Update `src/app/globals.css` `[cmdk-item]` rule — already has `transition` with duration tokens; the existing `@media (prefers-reduced-motion: reduce) { [cmdk-item] { transition: none; } }` block is already correct — no change needed
  - [x] **Note:** `globals.css` already has a global `@media (prefers-reduced-motion: reduce)` block that sets ALL transition-durations to `0.01ms !important`. The per-element `motion-reduce:` additions in this task are belt-and-suspenders explicit declarations that comply with AC2's letter and serve as documentation of intent. Do NOT remove the existing global block.

- [x] **Task 3: Verify content is load-bearing safe** (AC: 5)
  - [x] Confirm `ProjectCard` — content (title, description, badge stack) is always rendered; no content gated behind animation state
  - [x] Confirm `SectionLayout` — heading and children always render; no opacity:0 initial state anywhere
  - [x] Confirm all pages — run `pnpm build` and check that all routes pre-render successfully with content visible in HTML
  - [x] This task is a read-only audit, no code changes expected unless a load-bearing animation is found

- [x] **Task 4: Document forward patterns in story dev notes (non-code)** (AC: 3, 4)
  - [x] Confirm GSAP 3.15.0 is installed (`gsap` in `package.json` ✅)
  - [x] Confirm Framer Motion 12.x is installed (`framer-motion` in `package.json` ✅)
  - [x] Note: ACs 3 and 4 are requirements that stories 6.2 and 6.3 must satisfy using `useReducedMotion()` hook from `@/hooks/useReducedMotion`; no code ships in 6.1 for GSAP or Framer animations (they don't exist yet)
  - [x] The hook created in Task 1 is the shared primitive that makes ACs 3 and 4 possible in those downstream stories

- [x] **Task 5: Verify build** (AC: 1–5)
  - [x] Run `pnpm build` — 0 TypeScript errors; all routes pre-render successfully
  - [x] Manually test: toggle OS `prefers-reduced-motion` setting (macOS: System Settings → Accessibility → Display → Reduce motion) and verify `transition-colors` transitions are suppressed on `ProjectCard` hover
  - [x] If available, use browser DevTools → Rendering → Emulate CSS media `prefers-reduced-motion: reduce` to verify suppression without OS toggle

## Dev Notes

### What Exists vs What This Story Builds

| Status                     | Asset                                             | Location                                           | Notes                                                                                         |
| -------------------------- | ------------------------------------------------- | -------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| **EXISTS — DO NOT MODIFY** | Global `prefers-reduced-motion` CSS block         | `src/app/globals.css` lines ~185–200               | Sets all duration tokens to 0ms; `transition-duration: 0.01ms !important` on `*` — covers AC2 |
| **EXISTS — DO NOT MODIFY** | Motion duration tokens (`--duration-micro`, etc.) | `src/app/globals.css` `:root` block                | Already set to 0ms under reduced motion via token override                                    |
| **EXISTS — DO NOT MODIFY** | `[cmdk-item]` reduced-motion override             | `src/app/globals.css` end of COMMAND PALETTE block | `transition: none` already present                                                            |
| **EXISTS — UPDATE**        | `src/components/ProjectCard.tsx`                  | `src/components/ProjectCard.tsx`                   | Add `motion-reduce:transition-none` to Link className                                         |
| **EXISTS — UPDATE**        | `src/components/Footer.tsx`                       | `src/components/Footer.tsx`                        | Add `motion-reduce:transition-none` to 3 link classNames                                      |
| **EXISTS — UPDATE**        | `src/components/NavLinks.tsx`                     | `src/components/NavLinks.tsx`                      | Add `motion-reduce:transition-none` to 3 element classNames                                   |
| **EXISTS — UPDATE**        | `src/app/not-found.tsx`                           | `src/app/not-found.tsx`                            | Add `motion-reduce:transition-none` to 2 link classNames                                      |
| **EXISTS — UPDATE**        | `src/app/projects/[slug]/page.tsx`                | `src/app/projects/[slug]/page.tsx`                 | Add `motion-reduce:transition-none` to back-link className                                    |
| **NEW**                    | `src/hooks/useReducedMotion.ts`                   | `src/hooks/`                                       | Reactive React hook wrapping `matchMedia`; returns boolean; used by 6.2 and 6.3               |

### Exact Implementation: `src/hooks/useReducedMotion.ts`

```ts
"use client";

import { useEffect, useState } from "react";

export function useReducedMotion(): boolean {
  // Initialize to false (SSR-safe — window is not available during server render).
  // The effect immediately reads the real value on the client after hydration.
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");

    // Sync with real OS value after hydration
    setPrefersReducedMotion(mql.matches);

    const handleChange = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };

    mql.addEventListener("change", handleChange);
    return () => mql.removeEventListener("change", handleChange);
  }, []);

  return prefersReducedMotion;
}
```

> **⚠️ SSR-SAFE INIT**: Initialize to `false`, NOT with a lazy initializer that reads `window`. `useState(() => window.matchMedia(...))` would throw during Next.js server render. The `useEffect` runs only on client, immediately syncing to the real value — any brief flash is irrelevant because the CSS layer already handles the visual suppression before React hydrates.

> **⚠️ `"use client"` REQUIRED**: This hook uses `window.matchMedia` and `useEffect`. It MUST have `"use client"` as the first line. This is consistent with `useCommandPalette.ts` and `useKeyboardShortcuts.ts` in the same `src/hooks/` directory.

> **⚠️ NO FRAMER IMPORT**: Do NOT import `useReducedMotion` from `framer-motion`. Our custom hook in `src/hooks/useReducedMotion.ts` is the single source of truth. It is library-agnostic and works in both GSAP and Framer Motion contexts. Stories 6.2 and 6.3 must import from `@/hooks/useReducedMotion`.

> **⚠️ `addEventListener` vs `addListener`**: `mql.addListener()` is deprecated. Always use `mql.addEventListener("change", handler)` — fully supported in all browsers this project targets (Chrome/Firefox/Safari/Edge last 2 versions).

### Exact Component Updates for Task 2

All changes follow the same pattern: add `motion-reduce:transition-none` to the className of any element that has `transition-*` utility classes.

**`src/components/ProjectCard.tsx` — Link className (line ~14):**

Current:

```tsx
className =
  "bg-bg-secondary border-border-subtle p-space-6 gap-space-4 duration-micro hover:border-border-active hover:bg-bg-tertiary focus-visible:ring-accent focus-visible:ring-offset-bg-primary flex flex-col rounded-lg border transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none";
```

Updated (add `motion-reduce:transition-none` at the end):

```tsx
className =
  "bg-bg-secondary border-border-subtle p-space-6 gap-space-4 duration-micro hover:border-border-active hover:bg-bg-tertiary focus-visible:ring-accent focus-visible:ring-offset-bg-primary flex flex-col rounded-lg border transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none motion-reduce:transition-none";
```

**`src/components/Footer.tsx` — all three `<a>` / link elements with `transition-colors`:**

Each of the three links at lines ~48, ~57, ~67 has `transition-colors` in its className. Add `motion-reduce:transition-none` to each:

```tsx
// Before (example — same pattern on all three):
className =
  "text-text-secondary hover:text-text-primary duration-micro focus-visible:ring-accent focus-visible:ring-offset-bg-primary rounded font-mono text-xs transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none";

// After:
className =
  "text-text-secondary hover:text-text-primary duration-micro focus-visible:ring-accent focus-visible:ring-offset-bg-primary rounded font-mono text-xs transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none motion-reduce:transition-none";
```

**`src/components/NavLinks.tsx` — three animated elements:**

- Desktop nav link (line ~67): add `motion-reduce:transition-none` to the `className` string
- Mobile hamburger button (line ~82): add `motion-reduce:transition-none` to the `className` template literal
- Mobile nav link (line ~103): add `motion-reduce:transition-none` to the `className` template literal

**`src/app/not-found.tsx` — two `<a>` links (lines ~23, ~29):**

Add `motion-reduce:transition-none` to each link's className after `transition-colors`.

**`src/app/projects/[slug]/page.tsx` — back-link (line ~47):**

Add `motion-reduce:transition-none` after `transition-colors` in the link className.

### Why Both Global CSS and Per-Element `motion-reduce:` Classes?

The global `@media (prefers-reduced-motion: reduce)` block in `globals.css` already handles all transitions site-wide via `transition-duration: 0.01ms !important`. This satisfies NFR11 functionally.

The per-element `motion-reduce:transition-none` Tailwind additions (Task 2) serve three purposes:

1. **AC2 compliance** — the AC explicitly requires the Tailwind variant be applied
2. **Documentation of intent** — makes motion sensitivity handling visible at the call site without having to trace to globals.css
3. **Tailwind scanning correctness** — Tailwind's CSS purging will include the `motion-reduce:transition-none` utility; the global CSS block exists independently and is not subject to purging

Both mechanisms coexist safely — `!important` from the global rule and `transition: none` from the Tailwind utility achieve the same outcome. Do not remove the global block.

### GSAP Pattern for Story 6.2 (Reference — No Code in This Story)

Story 6.2 will create an `AnimatedSection` component using GSAP. That story MUST use `gsap.matchMedia()` to gate all timeline animations. The hook from this story (`useReducedMotion`) should also be imported as a secondary guard.

**Required pattern for 6.2:**

```ts
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

gsap.registerPlugin(ScrollTrigger);

// Inside client component:
const prefersReducedMotion = useReducedMotion();

useGSAP(
  () => {
    if (prefersReducedMotion) {
      // Content already visible — skip animation, do not call gsap.from()
      return;
    }

    // Alternatively, use gsap.matchMedia() for library-level gating:
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.from(containerRef.current, {
        opacity: 0,
        y: 24,
        duration: 0.4,
        ease: "power2.out",
        scrollTrigger: {
          /* ... */
        },
      });
      return () => mm.revert();
    });
  },
  { scope: containerRef },
);
```

> The `useReducedMotion()` early-return guard and `gsap.matchMedia()` are complementary approaches — both should be used for belt-and-suspenders coverage. `gsap.matchMedia()` handles the GSAP system level; the hook handles JSX-level conditional branches.

### Framer Motion Pattern for Story 6.3 (Reference — No Code in This Story)

Story 6.3 will create a `PageTransition` component using Framer Motion's `AnimatePresence`. That story MUST import `useReducedMotion` from `@/hooks/useReducedMotion` (NOT from `framer-motion`) and gate transition durations.

**Required pattern for 6.3:**

```tsx
"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export function PageTransition({ children }: { children: React.ReactNode }) {
  const prefersReducedMotion = useReducedMotion();

  const variants = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  };

  const transition = prefersReducedMotion
    ? { duration: 0 }
    : { duration: 0.25, ease: [0.4, 0, 0.2, 1] }; // ease-in-out

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={/* route key */}
        variants={variants}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={transition}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
```

> **Architecture rule**: No component uses both GSAP and Framer Motion simultaneously. `PageTransition` uses only Framer Motion. `AnimatedSection` (6.2) uses only GSAP.

### Architecture Compliance

| Rule  | Requirement                                         | Compliance                                                              |
| ----- | --------------------------------------------------- | ----------------------------------------------------------------------- |
| ARC8  | Named exports only                                  | ✅ `useReducedMotion` is a named export                                 |
| ARC8  | `"use client"` only where DOM/browser APIs required | ✅ Hook uses `window.matchMedia` and `useEffect`                        |
| ARC8  | `@/` import aliases                                 | ✅ Downstream consumers import `@/hooks/useReducedMotion`               |
| ARC8  | No barrel `index.ts` files                          | ✅                                                                      |
| ARC6  | TypeScript; no `any`                                | ✅ Return type `boolean`; `MediaQueryListEvent` is typed by lib.dom     |
| NFR11 | `prefers-reduced-motion` respected site-wide        | ✅ CSS global block + per-element Tailwind classes + JS hook            |
| NFR12 | Keyboard navigable; focus order preserved           | ✅ No keyboard behavior changed by this story                           |
| FR20  | Animations suppressed when reduced motion enabled   | ✅ Three-layer approach: CSS global, Tailwind `motion-reduce:`, JS hook |

### Existing CSS Coverage (Already Done Before This Story)

`src/app/globals.css` already has these blocks — **do NOT duplicate or modify**:

```css
/* Motion tokens zeroed out under reduced motion */
@media (prefers-reduced-motion: reduce) {
  :root {
    --duration-micro: 0ms;
    --duration-transition: 0ms;
    --duration-entrance: 0ms;
  }

  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}

/* cmdk-item specific override */
@media (prefers-reduced-motion: reduce) {
  [cmdk-item] {
    transition: none;
  }
}
```

This global coverage means **no content or functionality is currently gated behind motion**. All text, images, and interactive elements render immediately.

### Previous Story Learnings (from 5.2)

- **Pattern: `"use client"` + `useEffect` for browser APIs** — `useCommandPalette.ts` and `useKeyboardShortcuts.ts` both follow this pattern. `useReducedMotion.ts` is the same: `"use client"`, DOM API in `useEffect`, return cleanup.
- **Pattern: Named exports only** — all hooks in `src/hooks/` use named exports. No default exports.
- **Pattern: `useRef` for non-rendering state** — not applicable here (state IS the output), but keep in mind for 6.2's GSAP timeline refs.
- **Pattern: One hook per file, one component per file** — `src/hooks/useReducedMotion.ts` is a single file. Do not combine with other hooks.
- **Pattern: Build verification first** — run `pnpm build` as final check; TypeScript strict mode catches type errors.
- **Pattern: `src/app/globals.css` append-only** — do NOT reorder or restructure the CSS file. If a CSS change is needed, append at the end with a clear comment block header. No changes to `globals.css` are needed in this story (Task 2 changes are in `.tsx` component files only).

### Potential Pitfalls

1. **`window` during SSR**: `window.matchMedia` does not exist during server-side rendering. Always guard with `useEffect` — never call `window.matchMedia` in component body, `useState` initializer (lazy form), or outside a hook. The `useEffect`-only pattern is safe.

2. **Hydration mismatch**: If the server renders with `true` (motion preferred) but the hook initializes to `false`, React will log a hydration mismatch warning. Always initialize to `false` so server and initial client render agree, then sync the real value in `useEffect`.

3. **Forgetting `removeEventListener`**: The MQL change listener MUST be removed in the `useEffect` cleanup. Forgetting it causes a memory leak and stale state updates after the component unmounts.

4. **`motion-reduce:transition-none` vs `motion-reduce:duration-0`**: Either class suppresses transitions under reduced motion. `transition-none` removes the transition property entirely; `duration-0` sets duration to 0ms. Both are valid. This story uses `transition-none` for clarity and alignment with the existing `[cmdk-item]` override in globals.css.

5. **`motion-reduce:` in Tailwind v4**: Tailwind v4's `motion-reduce:` variant generates `@media (prefers-reduced-motion: reduce) { ... }`. It is fully supported in Tailwind v4 with no special configuration needed.

6. **Do NOT import from `framer-motion`'s `useReducedMotion`**: Framer Motion 12.x exports its own `useReducedMotion`. Using it would create a hidden Framer Motion dependency in components that only need motion detection (e.g., a GSAP component). Always use `@/hooks/useReducedMotion` for consistency.

7. **ACs 3 and 4 are forward-looking**: GSAP animations (6.2) and Framer Motion page transitions (6.3) do not exist in the codebase yet. ACs 3 and 4 are requirements that will be verified in those stories, not in 6.1. The hook created in Task 1 is what enables 6.2 and 6.3 to satisfy those ACs.

## File List

- `src/hooks/useReducedMotion.ts` (new)
- `src/components/ProjectCard.tsx` (modified — add `motion-reduce:transition-none`)
- `src/components/Footer.tsx` (modified — add `motion-reduce:transition-none` to 3 links)
- `src/components/NavLinks.tsx` (modified — add `motion-reduce:transition-none` to 3 elements)
- `src/app/not-found.tsx` (modified — add `motion-reduce:transition-none` to 2 links)
- `src/app/projects/[slug]/page.tsx` (modified — add `motion-reduce:transition-none` to back-link)

## Dev Agent Record

### Agent Model Used

Claude Sonnet 4.6

### Debug Log References

### Completion Notes List

- Implemented `src/hooks/useReducedMotion.ts` — SSR-safe named export hook using `useEffect` + `window.matchMedia`; initializes to `false` (server-safe), syncs real OS value on client hydration, and listens for live OS setting changes via `addEventListener("change", handler)` with cleanup.
- Added `motion-reduce:transition-none` to 8 animated elements across 5 files: `ProjectCard.tsx` (1), `Footer.tsx` (3 links), `NavLinks.tsx` (desktop nav link, hamburger, mobile nav link), `not-found.tsx` (2 links), `projects/[slug]/page.tsx` (back-link).
- Audit confirmed: no `opacity-0` or load-bearing animation state anywhere in the codebase — AC5 satisfied by design.
- Confirmed `gsap@^3.15.0` and `framer-motion@^12.38.0` present in `package.json`; ACs 3 & 4 are forward requirements for stories 6.2 and 6.3.
- `pnpm build` passed: 0 TypeScript errors, all 8 routes pre-render successfully.

### Change Log

- 2026-05-23: Story 6.1 created — reduced motion infrastructure and `useReducedMotion` hook comprehensive developer guide prepared.
- 2026-05-23: Story 6.1 implemented — created `useReducedMotion` hook, added `motion-reduce:transition-none` to 8 elements across 5 files, verified load-bearing safety audit, confirmed GSAP/Framer Motion dependencies, build passed 0 errors.
