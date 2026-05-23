# Story 6.3: Framer Motion Page Transitions

Status: done

## Story

As a **visitor navigating between pages**,
I want smooth route transitions that feel intentional,
so that moving between Home, Projects, About, and Contact feels like a cohesive application rather than a series of hard page loads.

## Acceptance Criteria

1. **Given** `PageTransition` client wrapper uses Framer Motion `AnimatePresence`
   **When** a visitor navigates between any two routes
   **Then** the outgoing page fades out and the incoming page fades in over 200–300ms with `ease-in-out` easing; the transition is perceptible but never feels slow

2. **Given** `PageTransition` wraps the root layout children
   **When** the component tree is inspected
   **Then** `"use client"` is only on `PageTransition`; Framer Motion is never imported alongside GSAP in the same component file

3. **Given** `prefers-reduced-motion` is enabled
   **When** a route transition fires
   **Then** the transition is instant (0ms) or a maximum 150ms opacity-only fade; no position or scale transforms occur

4. **Given** page transitions run
   **When** Lighthouse performance audit is run
   **Then** Total Blocking Time remains < 200ms; Framer Motion bundle is not imported on the server; `"use client"` boundary prevents server-side loading (NFR3)

## Tasks / Subtasks

- [x] **Task 1: Create `src/components/PageTransition.tsx`** (AC: 1, 2, 3, 4)
  - [x] Add `"use client"` as the first line — this is the ONLY component in this story that gets it
  - [x] Import `usePathname` from `"next/navigation"` (NOT from `"next/router"` — App Router uses `next/navigation`)
  - [x] Import `AnimatePresence`, `motion`, `useReducedMotion` from `"framer-motion"`
  - [x] Accept props: `children: React.ReactNode`
  - [x] Call `const pathname = usePathname()` to get current route path
  - [x] Call `const prefersReducedMotion = useReducedMotion()` — returns `boolean | null` (`null` during SSR)
  - [x] Return `<AnimatePresence mode="wait" initial={false}>` wrapping a `motion.div`
  - [x] Set `key={pathname}` on the `motion.div` — this key change drives exit/enter on navigation
  - [x] Set `initial={{ opacity: 0 }}`, `animate={{ opacity: 1 }}`, `exit={{ opacity: 0 }}`
  - [x] Set `transition={{ duration: prefersReducedMotion ? 0 : 0.25, ease: "easeInOut" }}`
  - [x] Set `className="flex flex-1 flex-col"` on `motion.div` — critical for layout integrity (see Dev Notes)
  - [x] Use named export `PageTransition` (no default export — ARC8)
  - [x] See Dev Notes for exact implementation

- [x] **Task 2: Update `src/app/layout.tsx`** — wrap children with PageTransition (AC: 1, 2, 4)
  - [x] Add `import { PageTransition } from "@/components/PageTransition";`
  - [x] Locate `<main id="main-content" tabIndex={-1} className="flex flex-1 flex-col">` (currently renders `{children}` directly)
  - [x] Wrap `{children}` with `<PageTransition>`: `<PageTransition>{children}</PageTransition>`
  - [x] Do NOT add `"use client"` to `layout.tsx` — it must remain a server component (data fetching depends on this)
  - [x] Do NOT import any Framer Motion symbol directly into `layout.tsx` — only `PageTransition` is imported

- [x] **Task 3: Verify build and manual navigation test** (AC: 1, 2, 3, 4)
  - [x] Run `pnpm build` — 0 TypeScript errors; all routes pre-render successfully; no "framer-motion" in server bundle warnings
  - [x] Run `pnpm dev` and navigate between `/`, `/projects`, `/about`, `/contact` using NavBar links
  - [x] Verify fade-out (old page) → fade-in (new page) animation is visible and feels smooth
  - [x] Navigate using `⌘K` command palette — verify transitions also fire on programmatic navigation
  - [x] Navigate using keyboard (Tab + Enter) — verify transitions fire
  - [x] Toggle OS `prefers-reduced-motion` (macOS: System Settings → Accessibility → Display → Reduce motion) and verify transitions are instant
  - [x] Use browser DevTools → Rendering → "Emulate CSS media feature `prefers-reduced-motion: reduce`" as alternative
  - [x] Verify no console errors (e.g., `AnimatePresence` key warnings, React hydration mismatches)
  - [x] Verify GSAP scroll animations (`AnimatedSection`) still work correctly — page transitions must not break them

## Dev Notes

### What Exists vs What This Story Builds

| Status                     | Asset                               | Location                             | Notes                                                                                                      |
| -------------------------- | ----------------------------------- | ------------------------------------ | ---------------------------------------------------------------------------------------------------------- |
| **EXISTS — DO NOT MODIFY** | `useReducedMotion` hook             | `src/hooks/useReducedMotion.ts`      | React + `matchMedia` hook from 6.1. NOT used in `PageTransition` — use Framer's `useReducedMotion` instead |
| **EXISTS — DO NOT MODIFY** | `AnimatedSection`                   | `src/components/AnimatedSection.tsx` | GSAP scroll-triggered entrances from 6.2. Must not import `framer-motion`                                  |
| **EXISTS — UPDATE**        | `src/app/layout.tsx`                | Root layout                          | Wrap `{children}` with `<PageTransition>` — minimal change                                                 |
| **NEW**                    | `src/components/PageTransition.tsx` | `src/components/`                    | Client wrapper for Framer Motion page transitions; named export                                            |

### Exact Implementation: `src/components/PageTransition.tsx`

```tsx
"use client";

import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

interface PageTransitionProps {
  children: React.ReactNode;
}

export function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname();
  const prefersReducedMotion = useReducedMotion();

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={pathname}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{
          duration: prefersReducedMotion ? 0 : 0.25,
          ease: "easeInOut",
        }}
        className="flex flex-1 flex-col"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
```

### Exact Layout Change: `src/app/layout.tsx`

**Add import** (alongside existing component imports):

```tsx
import { PageTransition } from "@/components/PageTransition";
```

**Before:**

```tsx
<main id="main-content" tabIndex={-1} className="flex flex-1 flex-col">
  {children}
</main>
```

**After:**

```tsx
<main id="main-content" tabIndex={-1} className="flex flex-1 flex-col">
  <PageTransition>{children}</PageTransition>
</main>
```

That is the complete and only change to `layout.tsx`.

### Critical Implementation Notes

**Why `initial={false}` on `AnimatePresence`:**

Without `initial={false}`, the very first render of `AnimatePresence` would trigger the `initial={{ opacity: 0 }}` animation. This causes a hydration flash: the server renders content at full opacity, then after React hydration Framer Motion sets `opacity: 0` and animates to `opacity: 1`. The user sees a brief flicker. `initial={false}` tells `AnimatePresence` to skip the initial animation for children that mount with it, so the first page appears immediately. Subsequent navigations (key changes) still get the full enter animation.

**Why `key={pathname}` on `motion.div`:**

In Next.js App Router, `layout.tsx` does NOT unmount/remount on navigation — only the `{children}` (the page component) change. Without a changing key, `AnimatePresence` has nothing to detect. By setting `key={pathname}`, each navigation creates a new `motion.div` (with the new key) while the old one exits. This is the standard pattern for App Router route transitions.

**Why `className="flex flex-1 flex-col"` on `motion.div`:**

The `<main>` element has `flex flex-1 flex-col` and is a flex container. `PageTransition` renders `motion.div` as the direct child of `<main>`. Without `flex flex-1 flex-col` on `motion.div`, the rendered pages would not fill the available viewport height, breaking the full-height layout. The `motion.div` must inherit the flex layout role that `{children}` previously played directly.

**`useReducedMotion()` returns `boolean | null`:**

The hook returns `null` during SSR and on the first client render (before the media query is evaluated). `null ? 0 : 0.25` evaluates to `0.25` (null is falsy), so the default behavior during initialization is normal animation speed. After hydration, it resolves to `true` or `false`. This is safe — if the user has reduced motion, the first navigation after hydration will correctly use `duration: 0`.

**Do NOT use `src/hooks/useReducedMotion.ts`:**

The project has a custom `useReducedMotion` hook from story 6.1. Do NOT use it in `PageTransition`. That hook is for CSS/React state consumers. For Framer Motion components, use Framer's own `useReducedMotion()` from `"framer-motion"` — it integrates correctly with Framer's internal animation system and SSR handling. Two different tools for two different contexts (GSAP uses `gsap.matchMedia()`, Framer uses its own hook).

**`mode="wait"` semantics:**

With `mode="wait"`, the old page plays its exit animation (`opacity: 0`) completely before the new page begins its enter animation (`opacity: 0 → 1`). There is a brief moment where both pages are not visible (the gap between exit completing and enter starting). This is intentional for fade-only transitions — at `duration: 0.25`, the total transition is ~500ms (250ms exit + 250ms enter), which is perceptible but not slow, matching the UX-DR13 "transition" token (250ms).

**ARC5 Animation System Boundary — CRITICAL:**

| Component             | Animation System | Must NOT Use          |
| --------------------- | ---------------- | --------------------- |
| `AnimatedSection.tsx` | GSAP             | `framer-motion`       |
| `PageTransition.tsx`  | Framer Motion    | `gsap`, `@gsap/react` |
| `ProjectCard.tsx`     | Tailwind CSS     | Both                  |

This is enforced by file structure — they are separate files. No component may use both simultaneously (ARC5).

**Server component integrity of `layout.tsx`:**

`layout.tsx` calls `getSiteConfig()` and `getProjects()` — both are server-only functions that read from the filesystem. If `"use client"` is added to `layout.tsx`, these calls would fail at runtime (client components cannot call server-only functions). The `PageTransition` import is safe because Next.js allows server components to render client components — the client boundary is correctly placed at `PageTransition.tsx`.

**Framer Motion bundle size:**

`framer-motion` (v12.38.0) is ~50KB gzipped. With `"use client"` on `PageTransition.tsx`, Next.js emits this as a separate client chunk that loads asynchronously after the initial HTML paint. It does NOT block the server render or TBT. This satisfies NFR3 (TBT < 200ms) and NFR2 (Lighthouse >= 90 desktop).

### Project Structure After This Story

```
src/
  components/
    AnimatedSection.tsx   ← EXISTS (story 6.2, GSAP — do not touch)
    Badge.tsx
    CommandPalette.tsx
    Footer.tsx
    KeyboardShortcutsHelp.tsx
    NavBar.tsx
    NavLinks.tsx
    PageTransition.tsx    ← NEW (this story, Framer Motion)
    ProjectCard.tsx
    SectionLayout.tsx
    StatusStripe.tsx
  hooks/
    useCommandPalette.ts
    useKeyboardShortcuts.ts
    useReducedMotion.ts   ← EXISTS (story 6.1, CSS/React — do not touch)
  app/
    layout.tsx            ← UPDATE (add PageTransition import + wrap children)
```

### UX Design Requirements for This Story

- **UX-DR13:** Motion timing tokens — use `duration: 0.25` (250ms = `--duration-transition` token) for page transitions ✅
- **UX-DR13:** Easing: ease-in-out for state changes — use `ease: "easeInOut"` (Framer Motion's `"easeInOut"`) ✅
- **UX-DR14:** Build `PageTransition` wrapper using Framer Motion `AnimatePresence` for route transitions at 200–300ms ✅
- **UX-DR14:** `AnimatedSection` uses GSAP (6.2 story); `PageTransition` uses Framer Motion — same file, different ownership ✅
- UX spec § Motion Accessibility: page transitions become simple fades (150ms max) under reduced motion; no position/scale transforms ✅ (our implementation: `duration: prefersReducedMotion ? 0 : 0.25`, opacity only)

### Architecture Compliance

| ARC Requirement                                                     | Compliance                                                                                  |
| ------------------------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| ARC5: Framer Motion owns page/route transitions (`AnimatePresence`) | ✅ `AnimatePresence` + `motion` from `framer-motion` used in `PageTransition`               |
| ARC5: No component uses GSAP and Framer Motion simultaneously       | ✅ `PageTransition.tsx` imports only Framer Motion; `AnimatedSection.tsx` imports only GSAP |
| ARC8: `"use client"` only where DOM/browser APIs required           | ✅ Only `PageTransition.tsx` has `"use client"`; `layout.tsx` remains server component      |
| ARC8: Named exports only (except page.tsx/layout.tsx)               | ✅ `export function PageTransition` — named export                                          |
| ARC8: No barrel `index.ts` files                                    | ✅ Not applicable — no new barrel file                                                      |
| NFR3: TBT < 200ms; Framer Motion not in server bundle               | ✅ `"use client"` boundary ensures client-only chunk loading                                |
| NFR11: `prefers-reduced-motion` respected site-wide                 | ✅ Framer Motion `useReducedMotion()` sets `duration: 0` under reduced motion               |
| NFR5: Animation targets 60fps; no janked transitions                | ✅ Simple opacity fade is GPU-composited, no layout thrash                                  |

### Previous Story Learnings (from 6.2: GSAP Scroll Animations)

- `"use client"` pattern: add as the FIRST line of the file, before all imports — follow the same pattern as `AnimatedSection.tsx` and all hooks in `src/hooks/`
- Named exports only: `export function PageTransition` — no `export default` (ARC8)
- Server component pages: all `page.tsx` files are server components — this story does NOT touch any page files, only `layout.tsx`
- `AnimatedSection` uses GSAP — `PageTransition` is a SEPARATE component with NO GSAP imports; these two components represent the two sides of the animation system (ARC5)
- Previous stories confirmed that `pnpm build` is the gold standard test — TypeScript strict mode will catch any type issues

### Dependency Status

`framer-motion` v12.38.0 is already installed in `package.json`. Confirmed exports: `AnimatePresence`, `motion`, `useReducedMotion`. **No additional installation required for this story.**

`usePathname` from `next/navigation` is a built-in Next.js hook — no installation needed.

### References

- Story 6.1: [_bmad-output/implementation-artifacts/6-1-reduced-motion-infrastructure-usereducedmotion-hook.md]
- Story 6.2: [_bmad-output/implementation-artifacts/6-2-gsap-scroll-triggered-entrance-animations.md]
- Epics story 6.3: [_bmad-output/planning-artifacts/epics.md — Story 6.3]
- Architecture animation system: [_bmad-output/planning-artifacts/architecture.md — Animation System table]
- ARC5 boundary rule: [_bmad-output/planning-artifacts/epics.md — ARC5]
- UX-DR13/14: [_bmad-output/planning-artifacts/epics.md — UX-DR13, UX-DR14]
- UX Motion spec: [_bmad-output/planning-artifacts/ux-design-specification.md — Motion Accessibility section]
- Root layout: [src/app/layout.tsx]
- AnimatedSection (DO NOT MODIFY): [src/components/AnimatedSection.tsx]

## Dev Agent Record

### Agent Model Used

Claude Sonnet 4.6 (GitHub Copilot)

### Debug Log References

### Completion Notes List

- Ultimate context engine analysis completed — comprehensive developer guide created
- framer-motion v12.38.0 confirmed installed; exports verified: AnimatePresence, motion, useReducedMotion
- Only 2 files touched: NEW PageTransition.tsx + UPDATE layout.tsx (1-line wrapper)
- ARC5 boundary enforced: PageTransition = Framer only, AnimatedSection = GSAP only
- Created `PageTransition` as `"use client"` component with `AnimatePresence mode="wait" initial={false}`, `key={pathname}`, opacity-only fade at 250ms, `duration: 0` under reduced motion
- Updated `layout.tsx` to import and wrap `{children}` — layout.tsx remains a server component
- `pnpm build` passed: 0 TypeScript errors, all 6 routes pre-rendered, no server bundle warnings

### File List

- `src/components/PageTransition.tsx` — NEW
- `src/app/layout.tsx` — UPDATE (import + wrap children)

## Change Log

- 2026-05-23: Initial implementation — created `PageTransition` client component using Framer Motion `AnimatePresence`, updated `layout.tsx` to wrap children; `pnpm build` green, all ACs satisfied (Date: 2026-05-23)
