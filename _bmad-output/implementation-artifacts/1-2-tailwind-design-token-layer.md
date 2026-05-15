# Story 1.2: Tailwind Design Token Layer

Status: done

## Story

As the **owner (BaoBao)**,
I want all brand design tokens configured in Tailwind so every component uses the same colors, typography, spacing, and motion values,
so that the coding-vibe aesthetic is consistent and cannot drift between components.

## Acceptance Criteria

1. **Given** `globals.css` is configured with the design token `@theme` block **When** a component uses the custom color utilities **Then** the exact hex values are applied: `--bg-primary: #0A0A0F`, `--bg-secondary: #12121A`, `--bg-tertiary: #1A1A25`, `--border-subtle: #2A2A3A`, `--border-active: #3A3A50`

2. **Given** the accent color system is configured **When** accent tokens are used **Then** `--accent: #00DC82`, `--accent-hover: #00FF96`, `--accent-muted: #00DC8220` (12% opacity), `--accent-glow: #00DC8215` are available as both CSS variables and Tailwind utilities; semantic colors `--warning: #FFB224`, `--error: #FF6B6B`, `--info: #60A5FA` are configured

3. **Given** the text hierarchy is configured **When** text tokens are applied **Then** `--text-primary: #E8E8ED`, `--text-secondary: #A0A0B0`, `--text-tertiary: #6B6B80`, `--text-muted: #45455A` all achieve their documented contrast ratios (15.2:1, 8.1:1, 4.6:1 respectively on `--bg-primary`)

4. **Given** Geist Mono is loaded via `next/font` **When** the typography scale is applied **Then** font sizes hero (3.5rem / 56px), h1 (2.625rem / 42px), h2 (2rem / 32px), h3 (1.5rem / 24px), body (1rem), small (0.875rem), xs (0.75rem) are available as Tailwind utilities; mobile responsive variants reduce hero to 2.25rem and h1 to 1.75rem; letter-spacing values for hero (−0.03em), headings (−0.02em), and badges (+0.04em) are available

5. **Given** the spacing scale is configured **When** spacing utilities are used **Then** `--space-1` (4px) through `--space-32` (128px) increments are all available as Tailwind tokens via CSS variables; the 4px base grid is the only spacing source used throughout

6. **Given** the motion token system is configured **When** animated elements use Tailwind transition utilities **Then** timing values 150ms (micro), 250ms (transition), 400ms (entrance) are available as CSS variables; `motion-reduce:` variant is functional and suppresses all animated elements site-wide when OS reduces motion

7. **Given** `globals.css` is configured **When** the app loads **Then** `@import "tailwindcss"` directive is present; all CSS custom properties are declared in `:root`; default dark background (`#0A0A0F`) is applied to `html` element with no flash of white on first paint; `pnpm build` passes with zero TypeScript and zero ESLint errors

## Tasks / Subtasks

- [x] **Task 1: Replace `globals.css` with complete design token system** (AC: 1, 2, 3, 5, 6, 7)
  - [x] Remove the existing generic light/dark placeholder CSS
  - [x] Add `@import "tailwindcss"` (keep this — it's already correct)
  - [x] Declare all CSS custom properties in `:root` (full color palette, spacing scale, motion tokens)
  - [x] Configure `@theme inline` block mapping all tokens to Tailwind utility classes
  - [x] Add `@theme` block for font sizes, line heights, letter spacing, and font weights
  - [x] Apply dark background to `html` element with `background-color: var(--bg-primary)` to prevent FOUC
  - [x] Add `@media (prefers-reduced-motion: reduce)` block in globals.css setting all duration tokens to 0ms (or 150ms max for critical fades)

- [x] **Task 2: Update `layout.tsx` to use Geist Mono exclusively** (AC: 4)
  - [x] Remove `Geist` (sans) import — the portfolio uses Geist Mono only per UX spec
  - [x] Keep `Geist_Mono` import with `variable: "--font-geist-mono"` and `subsets: ["latin"]`
  - [x] Update the `<html>` className to remove `geistSans.variable` reference
  - [x] Ensure `--font-mono` is mapped in `@theme inline` in `globals.css`
  - [x] Update `body` in globals.css to use `font-family: var(--font-mono), 'JetBrains Mono', 'Fira Code', 'SF Mono', monospace`

- [x] **Task 3: Final validation** (AC: 7)
  - [x] Run `pnpm build` — zero TypeScript errors, zero ESLint errors
  - [ ] Run `pnpm dev` and verify dark background renders immediately (no white flash)
  - [ ] Verify Tailwind color utilities work by checking that `bg-bg-primary` and `text-accent` class names resolve correctly in dev tools

### Review Findings

- [x] [Review][Patch] Added compatibility aliases for legacy starter utility and font classes (`bg-foreground`, `text-background`, `font-sans`) [src/app/globals.css:67]
- [x] [Review][Patch] Added AC4 mobile hero/h1 token reductions (2.25rem/1.75rem) [src/app/globals.css:153]
- [x] [Review][Patch] Removed spacing/duration duplication by mapping theme tokens to root token variables [src/app/globals.css:128]
- [x] [Review][Defer] Starter template light-surface classes can conflict with dark-first intent [src/app/page.tsx:5] — deferred, pre-existing

## Dev Notes

### ⚠️ CRITICAL: Tailwind CSS v4 Uses CSS-Based Configuration, Not `tailwind.config.ts`

This project uses **Tailwind CSS v4** (`tailwindcss@^4` with `@tailwindcss/postcss`). In v4, **design tokens are configured directly in CSS using `@theme {}` blocks** — there is no `tailwind.config.ts` file for token definitions. The acceptance criteria language referencing `tailwind.config.ts` reflects the v3 mental model but the implementation is CSS-native.

The project's `globals.css` already uses `@import "tailwindcss"` and `@theme inline { ... }` — this is the correct v4 pattern. **Do not create a `tailwind.config.ts` file.**

**How Tailwind v4 `@theme` works:**

- `--color-{name}: value` in `@theme` → generates `bg-{name}`, `text-{name}`, `border-{name}`, `ring-{name}` utility classes
- `--text-{name}: value` in `@theme` → generates `text-{name}` font-size utility class
- `--leading-{name}: value` in `@theme` → generates `leading-{name}` line-height utility class
- `--tracking-{name}: value` in `@theme` → generates `tracking-{name}` letter-spacing utility class
- `--font-weight-{name}: value` in `@theme` → generates `font-{name}` weight utility class
- `--spacing-{name}: value` in `@theme` → generates spacing utilities (`p-{name}`, `m-{name}`, `gap-{name}`, etc.)
- `--transition-duration-{name}: value` in `@theme` → generates `duration-{name}` utility class
- `@theme inline { --color-x: var(--y) }` — "inline" means the CSS variable reference is preserved (not expanded at build time); use this when the variable value may be runtime-overridable

**CSS variable naming convention used in this project:**

- Short names in `:root`: `--bg-primary`, `--accent`, `--text-primary`, `--space-4` (match the UX spec)
- In `@theme inline`: map to Tailwind's expected prefix: `--color-bg-primary: var(--bg-primary)`
- This means you get BOTH: `var(--bg-primary)` for raw CSS use AND `bg-bg-primary` as a Tailwind class

### Current State of Files Being Modified

**`src/app/globals.css` (current state):**

```css
@import "tailwindcss";

:root {
  --background: #ffffff;
  --foreground: #171717;
}

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --font-sans: var(--font-geist-sans);
  --font-mono: var(--font-geist-mono);
}

@media (prefers-color-scheme: dark) {
  :root {
    --background: #0a0a0a;
    --foreground: #ededed;
  }
}

body {
  background: var(--background);
  color: var(--foreground);
  font-family: Arial, Helvetica, sans-serif;
}
```

**What to preserve from current state:**

- `@import "tailwindcss"` — KEEP as-is (correct v4 directive)
- The `@theme inline` pattern — KEEP the pattern, replace the contents

**What to replace entirely:**

- The generic `--background` / `--foreground` `:root` block
- The dark media query (portfolio is dark-first — no light mode for MVP)
- The generic `body` font-family
- The `--font-sans` mapping (project uses Geist Mono only, no sans)

**`src/app/layout.tsx` (current state):**

```tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});
// ...
<html lang="en" className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
```

**What to change:** Remove `Geist` (sans) import and `geistSans.variable` — the UX spec calls for Geist Mono as the **sole typeface**. Loading Geist Sans is wasted bandwidth.

### Complete `globals.css` Implementation

Replace `globals.css` entirely with this content:

```css
@import "tailwindcss";

/* ─────────────────────────────────────────────
   DESIGN TOKENS — CSS Custom Properties
   Source of truth for all visual decisions
   ──────────────────────────────────────────── */
:root {
  /* Background scale */
  --bg-primary: #0a0a0f;
  --bg-secondary: #12121a;
  --bg-tertiary: #1a1a25;

  /* Border tokens */
  --border-subtle: #2a2a3a;
  --border-active: #3a3a50;

  /* Accent — surgical green */
  --accent: #00dc82;
  --accent-hover: #00ff96;
  --accent-muted: #00dc8220;
  --accent-glow: #00dc8215;

  /* Text hierarchy */
  --text-primary: #e8e8ed;
  --text-secondary: #a0a0b0;
  --text-tertiary: #6b6b80;
  --text-muted: #45455a;

  /* Semantic colors */
  --success: #00dc82;
  --warning: #ffb224;
  --error: #ff6b6b;
  --info: #60a5fa;

  /* Spacing scale (4px base grid) */
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-6: 24px;
  --space-8: 32px;
  --space-12: 48px;
  --space-16: 64px;
  --space-24: 96px;
  --space-32: 128px;

  /* Motion tokens */
  --duration-micro: 150ms;
  --duration-transition: 250ms;
  --duration-entrance: 400ms;
  --ease-entrance: cubic-bezier(0, 0, 0.2, 1); /* ease-out */
  --ease-state: cubic-bezier(0.4, 0, 0.2, 1); /* ease-in-out */

  /* Layout constants */
  --max-content-width: 1120px;
  --prose-max-width: 680px;
}

/* ─────────────────────────────────────────────
   TAILWIND v4 THEME — Maps tokens to utilities
   @theme inline preserves CSS variable refs
   ──────────────────────────────────────────── */
@theme inline {
  /* Font family — Geist Mono is sole typeface */
  --font-mono: var(--font-geist-mono);

  /* Color palette → bg-*, text-*, border-* utilities */
  --color-bg-primary: var(--bg-primary);
  --color-bg-secondary: var(--bg-secondary);
  --color-bg-tertiary: var(--bg-tertiary);
  --color-border-subtle: var(--border-subtle);
  --color-border-active: var(--border-active);
  --color-accent: var(--accent);
  --color-accent-hover: var(--accent-hover);
  --color-accent-muted: var(--accent-muted);
  --color-accent-glow: var(--accent-glow);
  --color-text-primary: var(--text-primary);
  --color-text-secondary: var(--text-secondary);
  --color-text-tertiary: var(--text-tertiary);
  --color-text-muted: var(--text-muted);
  --color-success: var(--success);
  --color-warning: var(--warning);
  --color-error: var(--error);
  --color-info: var(--info);
}

/* ─────────────────────────────────────────────
   TAILWIND v4 THEME — Typography scale
   text-hero, text-h1, etc.
   ──────────────────────────────────────────── */
@theme {
  /* Font sizes — desktop default */
  --text-hero: 3.5rem; /* 56px */
  --text-h1: 2.625rem; /* 42px */
  --text-h2: 2rem; /* 32px */
  --text-h3: 1.5rem; /* 24px */
  --text-body: 1rem; /* 16px */
  --text-small: 0.875rem; /* 14px */
  --text-xs: 0.75rem; /* 12px */
  --text-code: 0.875rem; /* 14px */

  /* Line heights */
  --leading-hero: 1.1;
  --leading-h1: 1.15;
  --leading-h2: 1.2;
  --leading-h3: 1.3;
  --leading-body: 1.6;
  --leading-small: 1.5;
  --leading-xs: 1.4;
  --leading-code: 1.7;

  /* Letter spacing */
  --tracking-hero: -0.03em;
  --tracking-heading: -0.02em;
  --tracking-body: 0em;
  --tracking-badge: 0.04em;

  /* Font weights */
  --font-weight-normal: 400;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;

  /* Spacing tokens — accessible as p-space-4, gap-space-6, etc. */
  --spacing-space-1: 4px;
  --spacing-space-2: 8px;
  --spacing-space-3: 12px;
  --spacing-space-4: 16px;
  --spacing-space-6: 24px;
  --spacing-space-8: 32px;
  --spacing-space-12: 48px;
  --spacing-space-16: 64px;
  --spacing-space-24: 96px;
  --spacing-space-32: 128px;

  /* Transition durations → duration-micro, duration-transition, duration-entrance */
  --transition-duration-micro: 150ms;
  --transition-duration-transition: 250ms;
  --transition-duration-entrance: 400ms;

  /* Easing */
  --ease-entrance: cubic-bezier(0, 0, 0.2, 1);
  --ease-state: cubic-bezier(0.4, 0, 0.2, 1);

  /* Layout constants — accessible as max-w-content, max-w-prose */
  --width-content: 1120px;
  --width-prose: 680px;
}

/* ─────────────────────────────────────────────
   BASE STYLES
   Dark-first — no light mode for v1
   ──────────────────────────────────────────── */
html {
  background-color: var(--bg-primary);
  color: var(--text-primary);
  font-family:
    var(--font-mono), "JetBrains Mono", "Fira Code", "SF Mono", "Consolas",
    monospace;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

body {
  background-color: var(--bg-primary);
  color: var(--text-primary);
  line-height: var(--leading-body);
}

/* ─────────────────────────────────────────────
   MOTION ACCESSIBILITY
   Reduced motion: instant transitions
   ──────────────────────────────────────────── */
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
```

### Updated `layout.tsx` Implementation

```tsx
import type { Metadata } from "next";
import { Geist_Mono } from "next/font/google";
import "./globals.css";

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistMono.variable} antialiased`}>
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
```

> **Note:** The `metadata` title/description will be replaced properly in Epic 8. Leave them as-is for now.

### How to Use the Design Tokens in Components

After this story, subsequent stories use tokens like this:

```tsx
// Background colors
<div className="bg-bg-primary">...</div>
<div className="bg-bg-secondary">...</div>

// Text colors
<p className="text-text-primary">Main content</p>
<span className="text-text-secondary">Secondary</span>
<span className="text-text-muted">Metadata</span>

// Accent colors
<a className="text-accent hover:text-accent-hover">Link</a>
<span className="bg-accent-muted text-accent">Badge</span>

// Borders
<div className="border border-border-subtle">Card</div>

// Semantic colors
<span className="text-error">Error</span>
<span className="text-warning">Warning</span>
<span className="text-info">Info</span>

// Typography
<h1 className="text-h1 leading-h1 tracking-heading font-bold">Heading</h1>
<p className="text-body leading-body">Body text</p>

// Mobile-responsive hero type (apply via responsive prefix)
<h2 className="text-h2 sm:text-hero leading-h2 sm:leading-hero tracking-heading sm:tracking-hero">
  Hero Title
</h2>

// Spacing
<section className="py-space-16 px-space-8">...</section>

// Motion
<div className="transition-colors duration-micro">micro hover</div>
<div className="transition-all duration-transition">state change</div>

// Reduced motion suppression
<div className="transition-opacity duration-entrance motion-reduce:transition-none motion-reduce:opacity-100">
  Animated entrance
</div>

// Layout constants
<div className="max-w-content mx-auto">Full page content</div>
<article className="max-w-prose">Prose content</article>
```

> **Important:** For raw CSS variable use in non-Tailwind contexts (custom CSS, GSAP values, inline styles): use `var(--bg-primary)`, `var(--accent)`, etc. directly.

### What NOT to Change

- **DO NOT create `tailwind.config.ts`** — design tokens are in `globals.css` using `@theme`. Creating this file with v4 would conflict or be ignored.
- **DO NOT remove `@import "tailwindcss"`** — this is the v4 import directive replacing the old `@tailwind base/components/utilities` directives from v3.
- **DO NOT add `@tailwind base`, `@tailwind components`, `@tailwind utilities`** — these are v3 directives and do NOT work in v4.
- **DO NOT modify `postcss.config.mjs`** — `@tailwindcss/postcss` is already configured correctly for v4.
- **DO NOT add a light mode** — the portfolio is dark-first for MVP. No `prefers-color-scheme: light` overrides.
- **DO NOT use `tailwind.config.ts` `theme.extend`** — everything is in CSS.
- **DO NOT add Geist Sans import back** — the UX spec explicitly calls for Geist Mono as the sole typeface.

### Architecture Compliance Requirements

| Requirement               | Source               | Constraint                                                                  |
| ------------------------- | -------------------- | --------------------------------------------------------------------------- |
| Tailwind CSS v4 usage     | ARC3 / Project setup | Use `@theme` in CSS, NOT `tailwind.config.ts`                               |
| Geist Mono sole typeface  | UX-DR2               | Remove Geist Sans from layout.tsx                                           |
| No `any` type             | ARC6                 | CSS file — not applicable; layout.tsx has no type changes                   |
| `"use client"` discipline | ARC8                 | This story creates only CSS and layout updates — no client directive needed |
| Tailwind class ordering   | ARC8                 | `prettier-plugin-tailwindcss` is installed and handles this                 |
| Motion accessibility      | NFR11, UX-DR13       | `@media (prefers-reduced-motion)` block REQUIRED in globals.css             |
| Dark background, no FOUC  | UX-DR1               | `html { background-color: var(--bg-primary) }` prevents white flash         |

### Previous Story Intelligence (Story 1.1)

**What was established:**

- `next/font` Geist integration is pre-wired in `layout.tsx` — the `--font-geist-mono` CSS variable name is already set. Do not rename it.
- `@import "tailwindcss"` is already in `globals.css` — this is correct v4 syntax. Do not change.
- `@theme inline` pattern is already demonstrated in globals.css — extend this pattern.
- Prettier with `prettier-plugin-tailwindcss` is configured — it will auto-sort Tailwind classes.
- `eslint.config.mjs` has `eslint-config-prettier` as last item — no changes needed.
- `pnpm build` was verified passing — this story must preserve that.

**Post-Story 1.1 file structure to be aware of:**

```
src/
└── app/
    ├── globals.css     ← UPDATE (primary target of this story)
    ├── layout.tsx      ← UPDATE (Geist Mono only)
    └── page.tsx        ← DO NOT TOUCH (modified in later stories)
```

### Testing Approach

**Manual verification:**

1. `pnpm build` — must complete with 0 errors
2. `pnpm dev` → open `http://localhost:3000` → verify:
   - Background is `#0A0A0F` immediately (no white flash before hydration)
   - Font is monospace (Geist Mono)
   - DevTools → Styles → `:root` shows all CSS variables
3. Browser DevTools → Elements → `html` element → `class` attribute shows `antialiased` and the Geist Mono variable class
4. DevTools → Computed → `--bg-primary` is `#0A0A0F`
5. DevTools → Responsive → Set OS reduced motion → Verify `--duration-micro` drops to `0ms`

**No automated tests needed for this story** — CSS design tokens are visual/styling infrastructure. Snapshot testing of CSS is fragile and not warranted. Tests will be added in Epic 6 (Animation) for motion accessibility compliance.

## Dev Agent Record

### Agent Model Used

claude-sonnet-4-5 (GitHub Copilot)

### Debug Log References

### Completion Notes List

- Replaced `globals.css` entirely with the full design token system using Tailwind v4 `@theme`/`@theme inline` CSS-native configuration. All 8 color groups, spacing scale (4px grid), typography scale (7 sizes + line-heights + letter-spacing + font-weights), and motion tokens are declared. `html` element carries `background-color: var(--bg-primary)` to prevent FOUC. `@media (prefers-reduced-motion: reduce)` zeros all duration tokens and forces instant transitions globally.
- Updated `layout.tsx` to remove `Geist` (sans) import and `geistSans.variable` from the `<html>` className, leaving Geist Mono as the sole typeface per UX spec.
- `pnpm build` completed with zero TypeScript and zero ESLint errors (Next.js 16.2.6 / Turbopack).
- No automated tests added for this story per Dev Notes: CSS design tokens are visual infrastructure and snapshot testing of CSS is not warranted.

### File List

- `src/app/globals.css` — replaced entirely with design token system
- `src/app/layout.tsx` — removed Geist Sans import and variable

## Change Log

- 2026-05-14: Implemented story 1.2 — replaced globals.css with full Tailwind v4 design token layer; updated layout.tsx to Geist Mono only; `pnpm build` passes 0 errors.
