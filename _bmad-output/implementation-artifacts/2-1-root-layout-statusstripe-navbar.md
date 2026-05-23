# Story 2.1: Root Layout, StatusStripe & NavBar

Status: done

## Story

As a **visitor**,
I want a persistent navigation bar and top status stripe visible on every page,
so that I always know where I am and can navigate to any section instantly.

## Acceptance Criteria

1. **Given** the root `layout.tsx` is rendered  
   **When** any page loads  
   **Then** `StatusStripe` renders at the top with `● open to work` availability dot (accent green) and a `⌘K` hint text on desktop (hidden on mobile); `NavBar` renders below it with `bao.dev` logo (accent-colored period) and links: Projects, About, Contact

2. **Given** the NavBar renders on desktop (> 1024px)  
   **When** a visitor views the page  
   **Then** the logo and 3 nav links are visible inline; no hamburger or collapsed state is visible

3. **Given** the NavBar renders on mobile (< 768px)  
   **When** a visitor views the page  
   **Then** the logo is visible; a minimal menu icon reveals the 3 nav links; the menu opens/closes cleanly without layout shift

4. **Given** a keyboard user navigates the NavBar  
   **When** they tab through it  
   **Then** each nav link receives a `focus-visible` ring (`2px solid var(--accent)` with 2px offset); the active page link has a visible active state; focus order is logo → nav links → main content

5. **Given** `NavBar` is implemented  
   **When** the component tree is inspected  
   **Then** `"use client"` is only on the mobile menu toggle wrapper component, not on `NavBar` itself

## Tasks / Subtasks

- [x] **Task 1: Create `StatusStripe` server component** (AC: 1)
  - [x] Create `src/components/StatusStripe.tsx` as a named-export Server Component (no `"use client"`)
  - [x] Accept `config: SiteConfig` prop
  - [x] Render availability dot (`●`) in `text-accent` with `aria-hidden="true"`, followed by `config.owner.availabilityText` in `text-text-secondary text-xs font-mono`
  - [x] Render `⌘K` hint text on the right, hidden on mobile with `hidden lg:flex items-center gap-space-2`
  - [x] Apply outer wrapper: `<div aria-label="Availability status" className="bg-bg-secondary border-b border-border-subtle px-space-4 py-space-2 flex items-center justify-between text-xs font-mono">`
  - [x] Show StatusStripe only when `config.owner.isAvailable` is true; render `null` when false

- [x] **Task 2: Create `NavLinks` client component** (AC: 3, 4, 5)
  - [x] Create `src/components/NavLinks.tsx` with `"use client"` as the very first line
  - [x] Accept `navigation: NavigationItem[]` prop
  - [x] Import `usePathname` from `next/navigation` and `useState`, `useEffect` from `react`
  - [x] Implement active detection: `const isActive = (href: string) => pathname ? pathname === href || pathname.startsWith(href + '/') : false`
  - [x] Render desktop links: `<ul className="hidden lg:flex items-center gap-space-6">` — each `<li>` contains `<Link>` with classes `text-text-secondary hover:text-text-primary transition-colors duration-micro` inactive, `text-accent` active
  - [x] Apply `aria-current="page"` attribute on the active link
  - [x] Apply focus-visible ring on every link: `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg-primary rounded`
  - [x] Render mobile hamburger button: `<button className="lg:hidden ..." aria-label="Open navigation menu" aria-expanded={isOpen} aria-controls="mobile-menu">` — toggle `☰` / `✕` icon via `isOpen` state
  - [x] Implement mobile overlay: `<div id="mobile-menu" className="fixed inset-0 z-40 bg-bg-primary/95 backdrop-blur-sm flex flex-col items-center justify-center lg:hidden" role="dialog" aria-modal="true" aria-label="Navigation menu">`
  - [x] Render mobile nav links stacked vertically inside overlay — same active/inactive styling as desktop
  - [x] Close menu on: nav link click (in `onClick` handler), Escape key (`useEffect` on `keydown`), hamburger button re-click
  - [x] Lock body scroll on open: `useEffect` sets `document.body.style.overflow = 'hidden'` when `isOpen`, cleans up with `return () => { document.body.style.overflow = '' }`
  - [x] Conditionally render overlay only when `isOpen` to avoid hidden DOM impact

- [x] **Task 3: Create `NavBar` server component** (AC: 1, 2, 4, 5)
  - [x] Create `src/components/NavBar.tsx` as a named-export Server Component (no `"use client"`)
  - [x] Accept `config: SiteConfig` prop
  - [x] Render `<nav aria-label="Main navigation">` as root element
  - [x] Apply sticky positioning: `sticky top-0 z-50 bg-bg-primary/95 backdrop-blur-sm border-b border-border-subtle`
  - [x] Inner layout wrapper: `<div className="flex items-center justify-between max-w-content mx-auto px-space-4 md:px-space-8 h-16">`
  - [x] Render logo: `<Link href="/" className="font-bold text-small font-mono ... focus-visible ring classes">` containing `<span className="text-text-primary">bao</span><span className="text-accent">.</span><span className="text-text-primary">dev</span>`
  - [x] Render `<NavLinks navigation={config.navigation} />` — imports from `@/components/NavLinks`
  - [x] Logo link must include same focus-visible ring as nav links

- [x] **Task 4: Update `layout.tsx` to wire StatusStripe + NavBar** (AC: 1)
  - [x] Add `import { getSiteConfig } from "@/lib/data"` at top
  - [x] Add `import { StatusStripe } from "@/components/StatusStripe"`
  - [x] Add `import { NavBar } from "@/components/NavBar"`
  - [x] Call `const siteConfig = getSiteConfig()` inside the layout function body (server side)
  - [x] Insert `<StatusStripe config={siteConfig} />` as the first child inside `<body>`, before the skip link — StatusStripe has no focusable elements so skip-link remains the first focusable element
  - [x] Insert `<NavBar config={siteConfig} />` after the skip link, before `<main>` — NavBar goes between skip-link and main
  - [x] Update boilerplate metadata: `title: "BaoBao | Full-Stack Engineer"`, `description: "Full-stack engineer portfolio — projects, experience, and contact."` (deferred cleanup from Story 1-1)
  - [x] Preserve Geist Mono font variable on `<html>`, preserve skip-link, preserve `<main id="main-content" tabIndex={-1}>`
  - [x] Do NOT add `"use client"` to `layout.tsx`

- [x] **Task 5: Validate** (AC: 1–5)
  - [x] Run `pnpm lint` — must pass with zero errors
  - [x] Run `pnpm build` — must pass with zero TypeScript errors
  - [ ] Manual viewport check at 320px (mobile): StatusStripe shows dot + text only, NavBar shows logo + hamburger icon, ⌘K hint hidden
  - [ ] Manual viewport check at 1280px (desktop): StatusStripe shows dot + text + ⌘K hint, NavBar shows logo + 3 inline nav links, no hamburger
  - [ ] Keyboard test: Tab → skip link → logo → nav links (confirm ring) → main content; Escape closes mobile menu
  - [ ] Navigate to `/`, `/projects` — confirm `aria-current="page"` updates on active link (inspect DOM or check styling)
  - [ ] Open mobile menu, tap nav link — confirm menu closes and navigation occurs, no layout shift

### Review Findings

- [x] [Review][Patch] Use non-modal semantics for mobile menu overlay (remove modal dialog ARIA) [src/components/NavLinks.tsx:77]
- [x] [Review][Patch] Mobile menu can leave body scroll locked after resize to desktop [src/components/NavLinks.tsx:27]
- [x] [Review][Patch] Skip link can be visually obscured by sticky navbar due to equal z-index [src/app/layout.tsx:31]
- [x] [Review][Patch] Mobile menu toggle aria-label does not reflect open/close state [src/components/NavLinks.tsx:64]

## Dev Notes

### Developer Context

Story 2.1 creates the page shell frame that ALL subsequent stories render inside. StatusStripe and NavBar are the most visible components in the entire portfolio — every visitor sees them on every route. Get these right.

**Server/Client component boundary:**

```
layout.tsx (Server)
  ├── StatusStripe.tsx (Server — no interactivity)
  └── NavBar.tsx (Server — logo rendered server-side)
        └── NavLinks.tsx (Client "use client" — usePathname + mobile menu state)
```

**Why NavLinks must be a client component:**  
`usePathname()` from `next/navigation` is client-only. It is required to detect the active route for `aria-current="page"` and accent styling. Combined with `useState` for mobile menu toggle, a single `NavLinks.tsx` client component is the minimal and correct approach — satisfying AC#5 (no `"use client"` on NavBar itself).

**Data flow:**  
`getSiteConfig()` is called **once** in `layout.tsx` and passed as props. No duplicate data loading. `SiteConfig` contains `owner.isAvailable`, `owner.availabilityText`, and `navigation[]` — all needed by StatusStripe and NavBar/NavLinks.

### Technical Requirements

**StatusStripe design:**

- Height: thin — `py-space-2` (8px vertical padding)
- Background: `bg-bg-secondary` — slightly lighter than page bg, visually distinct from NavBar
- Text: `text-xs font-mono` throughout
- Dot: Unicode `●` (U+25CF), `text-accent`, `aria-hidden="true"` (decorative)
- Availability text: sourced from `config.owner.availabilityText` (NFR19 — content changes via data files only). Do NOT hardcode "open to work"
- ⌘K hint: hardcoded UI string `"⌘K to navigate"` — display only (`hidden lg:flex`)
- When `config.owner.isAvailable` is false, render `null` (hide stripe entirely) rather than showing "not available"

**NavBar design:**

- Height: `h-16` (64px) — comfortable, professional
- Sticky: `sticky top-0 z-50` — stays fixed on scroll (StatusStripe scrolls away; only NavBar is sticky)
- Background: `bg-bg-primary/95 backdrop-blur-sm` — semi-transparent with blur for content below
- Bottom border: `border-b border-border-subtle` — visual separation from page content
- Max-width inner: `max-w-content mx-auto` (1120px)
- Logo font: Geist Mono (inherits from html), `font-bold text-small` — compact, intentional

**NavLinks active state:**

```typescript
const isActive = (href: string) =>
  pathname ? pathname === href || pathname.startsWith(href + "/") : false;
```

- `pathname.startsWith(href + '/')` handles nested routes (e.g., `/projects/my-project` marks "Projects" active)
- Guard `pathname ?` handles the server pre-render where pathname is `null`

**Mobile menu:**

- z-index: `z-40` (below NavBar's `z-50` so the navbar/logo stays visible above the overlay)
- Background: `bg-bg-primary/95 backdrop-blur-sm` — dark overlay, branded
- Layout: `flex flex-col items-center justify-center` — centered stacked links, full screen
- Links: larger text than desktop (`text-h3` or `text-body`) for touch targets
- Body scroll lock prevents background scroll while menu is open

**Focus ring specification (UX-DR12):**

```
focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg-primary rounded
```

Apply to: logo link in `NavBar`, all nav links in `NavLinks`, mobile hamburger button in `NavLinks`.

### Architecture Compliance

- **Named exports only**: `export function StatusStripe(...)`, `export function NavBar(...)`, `export function NavLinks(...)` — NEVER default exports for shared components
- **No barrel files**: Import directly by file path: `import { NavBar } from "@/components/NavBar"`
- **`"use client"` depth**: Only in `NavLinks.tsx`. Confirmed absent from `layout.tsx`, `NavBar.tsx`, `StatusStripe.tsx`
- **`@/` aliases**: Every intra-`src/` import uses `@/` prefix — no `../../` relative paths
- **Types from `src/types/`**: Use `SiteConfig` and `NavigationItem` from `@/types/site` — never inline type definitions

### Library / Framework Requirements

Installed versions (from `package.json`):

- `next@16.2.6` — use `Link` from `next/link`; use `usePathname` from `next/navigation`
- `react@19.2.4` — `useState`, `useEffect` from `react`
- `tailwindcss@^4` — custom tokens via `globals.css` `@theme inline`

**`usePathname()` in Next.js 16 App Router:**  
Returns the current URL pathname as a string (e.g., `/projects`). Returns `null` during server-side pre-render of the client component — always guard: `pathname ? ... : false`.

**`next/link` `<Link>` component:**  
Use `<Link href="...">` for all internal navigation. Provides client-side navigation without full page reload. Do NOT use `<a>` for internal links.

**Tailwind v4 token reference** (from `src/app/globals.css`):
| Token class | Value |
|---|---|
| `bg-bg-primary` | `#0A0A0F` |
| `bg-bg-secondary` | `#12121A` |
| `text-accent` | `#00DC82` |
| `text-text-primary` | `#E8E8ED` |
| `text-text-secondary` | `#A0A0B0` |
| `border-border-subtle` | `#2A2A3A` |
| `max-w-content` | 1120px |
| `px-space-4` | 16px |
| `px-space-8` | 32px |
| `gap-space-6` | 24px |
| `py-space-2` | 8px |
| `duration-micro` | 150ms |

### File Structure Requirements

#### Files to Create

- `src/components/StatusStripe.tsx` (NEW) — Server Component, named export `StatusStripe`
- `src/components/NavBar.tsx` (NEW) — Server Component, named export `NavBar`
- `src/components/NavLinks.tsx` (NEW) — Client Component (`"use client"` first line), named export `NavLinks`

#### Files to Update

- `src/app/layout.tsx` (UPDATE) — Add StatusStripe + NavBar, update metadata

#### Files to Preserve (No Change Expected)

- `src/components/SectionLayout.tsx` — established by Story 1.4, do not touch
- `src/app/page.tsx` — placeholder content, not in scope for this story
- `src/app/globals.css` — token source of truth, do not modify
- `src/lib/data.ts` — already exports `getSiteConfig()`, no changes needed
- `data/site.json` — content data, no changes needed
- `src/types/site.ts` — `SiteConfig` and `NavigationItem` already defined, no changes needed

### Update-File Intelligence

#### `src/app/layout.tsx` (UPDATE)

**Current state** (as of Story 1.4 completion):

```tsx
import type { Metadata } from "next";
import { Geist_Mono } from "next/font/google";
import "./globals.css";

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Create Next App", // ← stale boilerplate
  description: "Generated by create next app", // ← stale boilerplate
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${geistMono.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        <a href="#main-content" className="sr-only focus:not-sr-only ... ...">
          Skip to main content
        </a>
        <main id="main-content" tabIndex={-1} className="flex flex-1 flex-col">
          {children}
        </main>
      </body>
    </html>
  );
}
```

**What this story changes:**

- Add 3 imports: `getSiteConfig`, `StatusStripe`, `NavBar`
- Call `getSiteConfig()` inside layout function body
- Add `<StatusStripe config={siteConfig} />` as first child of `<body>` (before skip-link)
- Add `<NavBar config={siteConfig} />` between skip-link and `<main>`
- Update `metadata.title` and `metadata.description`

**What must be preserved:**

- `geistMono.variable` class on `<html>` — removes this breaks the font system
- `lang="en"` on `<html>`
- `h-full antialiased` on `<html>`
- Skip-link element with all its classes (reviewed + patched in Story 1.4)
- `<main id="main-content" tabIndex={-1}>` — skip-link target must be programmatically focusable
- `flex flex-1 flex-col` on `<main>` — maintains full-height layout
- Server Component root — no `"use client"`

**Target layout structure after this story:**

```tsx
<html lang="en" className={`${geistMono.variable} h-full antialiased`}>
  <body className="flex min-h-full flex-col">
    <StatusStripe config={siteConfig} /> {/* decorative, no focus targets */}
    <a href="#main-content" className="...">
      {" "}
      {/* first focusable element */}
      Skip to main content
    </a>
    <NavBar config={siteConfig} /> {/* sticky nav, focusable links */}
    <main id="main-content" tabIndex={-1} className="flex flex-1 flex-col">
      {children}
    </main>
  </body>
</html>
```

> **Accessibility note:** StatusStripe has no focusable elements, so the skip-link remains the first focusable element in tab order. NavBar comes after the skip-link, so keyboard users can skip nav entirely.

### Previous Story Intelligence (from Story 1.4)

1. **Skip-link was patched in review** — The skip link's focus styles use tokenized spacing utilities and `focus:not-sr-only` pattern. Do NOT modify the skip-link element or its classes.

2. **`tabIndex={-1}` on `<main>`** — Added in Story 1.4 review so the skip-link programmatically moves focus to `#main-content`. This MUST be preserved.

3. **Server Component convention confirmed** — `SectionLayout`, `layout.tsx`, `page.tsx` are all Server Components. Follow same pattern for `StatusStripe` and `NavBar`.

4. **Named export convention confirmed** — `export function SectionLayout(...)` is the established pattern. Use same for `NavBar`, `StatusStripe`, `NavLinks`.

5. **`@/` import alias confirmed** — `import { SectionLayout } from "@/components/SectionLayout"` is the pattern. Do not use relative paths for intra-src imports.

6. **Tailwind v4 class names confirmed working** — `text-text-secondary`, `bg-bg-secondary`, `text-accent`, `px-space-8`, `py-space-8`, `max-w-content` all resolve correctly from `globals.css` `@theme`. Use these confidently.

7. **`SectionLayout` uses `px-space-8`** — The section wrapper provides `px-space-8` padding on mobile. NavBar must match this horizontal padding at `md:` and above (`md:px-space-8`) so logo and section content align visually.

### Testing Requirements

**Automated (must pass):**

- `pnpm lint` — zero ESLint/Prettier errors
- `pnpm build` — zero TypeScript errors, clean build output

**Manual (required before marking done):**

1. **AC1 — StatusStripe and NavBar presence**
   - Load `http://localhost:3000` with `pnpm dev`
   - Verify StatusStripe thin bar appears at very top (bg-secondary, accent dot, availability text)
   - Verify NavBar renders below (sticky, bao.dev logo, 3 nav links on desktop)

2. **AC2 — Desktop layout (set viewport ≥ 1024px)**
   - Logo and 3 nav links visible inline in NavBar
   - No hamburger icon visible
   - ⌘K hint visible in StatusStripe on the right

3. **AC3 — Mobile layout (set viewport 375px)**
   - StatusStripe shows dot + availability text only (no ⌘K hint)
   - NavBar shows `bao.dev` logo + hamburger `☰` icon
   - Tap `☰`: overlay menu opens with 3 stacked links, no layout shift (check no CLS)
   - Tap a nav link: menu closes, page navigates
   - Press Escape key: menu closes
   - Tap `☰` again: menu closes (toggle behavior)

4. **AC4 — Keyboard navigation**
   - Tab from top of page: skip link → logo → nav links (in order) → first focusable in main
   - Each link shows `2px accent-colored ring` on focus (focus-visible only, not on mouse click)
   - Navigate to `/projects`: "Projects" link shows accent text + `aria-current="page"` in DOM

5. **AC5 — use client boundary**
   - Inspect `NavBar.tsx`: no `"use client"` at top
   - Inspect `NavLinks.tsx`: `"use client"` is first line
   - React DevTools (optional): NavBar in Server Component tree, NavLinks in Client tree

### Project Structure Notes

- All 3 new component files are flat in `src/components/` — no subdirectories needed (architecture rule: flat component structure)
- `getSiteConfig()` called once in `layout.tsx`, not re-fetched in child components — single data-loading point for shell components
- No new `src/hooks/` files needed for this story — `usePathname` and `useState` are used directly in `NavLinks.tsx`
- Mobile menu state is self-contained in `NavLinks.tsx` — no global state or Context needed (React Context only for cross-cutting state per architecture)

### References

- [Source: _bmad-output/planning-artifacts/epics.md#Story 2.1] — User story, acceptance criteria
- [Source: _bmad-output/planning-artifacts/architecture.md#Frontend Architecture] — Server/client boundary rules, `"use client"` placement policy
- [Source: _bmad-output/planning-artifacts/architecture.md#Naming Patterns] — Named exports, PascalCase components, `camelCase` utilities
- [Source: _bmad-output/planning-artifacts/architecture.md#Structure Patterns] — `src/components/` flat structure, one component per file
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md#NavBar] — Logo anatomy, states, mobile overlay, ARIA requirements
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md#StatusStripe (Top)] — Anatomy, desktop/mobile states, ARIA
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md#UX-DR12] — Focus ring specification (2px accent, 2px offset)
- [Source: _bmad-output/implementation-artifacts/1-4-sectionlayout-component.md#Dev Notes] — Server Component pattern, skip-link structure, Tailwind token usage
- [Source: _bmad-output/implementation-artifacts/deferred-work.md] — Metadata boilerplate cleanup assigned here
- [Source: src/app/globals.css] — Tailwind token names and values
- [Source: src/types/site.ts] — `SiteConfig`, `NavigationItem` interfaces
- [Source: src/lib/data.ts] — `getSiteConfig()` signature and implementation
- [Source: data/site.json] — `owner.isAvailable`, `owner.availabilityText`, `navigation` field names

## Dev Agent Record

### Agent Model Used

Claude Sonnet 4.6

### Debug Log References

### Completion Notes List

- Created `src/components/StatusStripe.tsx` as a Server Component with named export; renders null when `isAvailable` is false; dot is `aria-hidden="true"`, ⌘K hint hidden on mobile via `hidden lg:flex`.
- Created `src/components/NavLinks.tsx` as a Client Component (`"use client"` first line); uses `usePathname` for active detection with null-guard; mobile overlay with `role="dialog"`, `aria-modal="true"`, Escape key handler, body scroll lock, and `☰`/`✕` toggle.
- Created `src/components/NavBar.tsx` as a Server Component; sticky `z-50` nav with `bao.dev` logo (accent period), imports `NavLinks` — no `"use client"` in this file.
- Updated `src/app/layout.tsx`: added 3 imports, called `getSiteConfig()` server-side, inserted `<StatusStripe>` before skip-link and `<NavBar>` after skip-link, updated metadata title and description. All preserved elements intact (Geist Mono, skip-link, `tabIndex={-1}` on main).
- `pnpm lint`: zero errors. `pnpm build`: clean TypeScript compilation, static page generation successful.
- Manual viewport and keyboard checks are required by the reviewer before marking done.

### File List

- `src/components/StatusStripe.tsx` (CREATED)
- `src/components/NavBar.tsx` (CREATED)
- `src/components/NavLinks.tsx` (CREATED)
- `src/app/layout.tsx` (MODIFIED)

## Change Log

- 2026-05-23: Implemented Story 2.1 — created StatusStripe, NavBar, NavLinks components; updated root layout to wire them in; updated page metadata.
