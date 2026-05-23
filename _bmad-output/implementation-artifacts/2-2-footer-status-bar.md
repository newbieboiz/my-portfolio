# Story 2.2: Footer Status Bar

Status: done

## Story

As a **visitor (developer audience)**,
I want a VS Code-style status bar at the bottom of the page,
so that I encounter the developer Easter egg that signals craft and attention to detail.

## Acceptance Criteria

1. **Given** the `Footer` component renders on desktop (> 1024px)
   **When** a developer-audience visitor views the bottom of any page
   **Then** a status bar renders showing: branch name (e.g. `main`), framework (`Next.js 16`), CSS version (`Tailwind v4`), encoding (`UTF-8`), and a green availability dot — styled as a VS Code status bar in `--bg-secondary` background

2. **Given** the `Footer` renders on mobile (< 768px)
   **When** a visitor views the page
   **Then** the status bar footer is hidden; social/GitHub links from `data/site.json` are accessible via a minimal mobile footer (FR17)

3. **Given** `Footer` reads from `data/site.json`
   **When** the site config changes
   **Then** the status bar content updates from data — no hardcoded strings in the component (NFR19)

4. **Given** footer social links are rendered
   **When** a visitor clicks a social link
   **Then** it opens in a new tab (`target="_blank" rel="noopener noreferrer"`); each link has a descriptive ARIA label (FR23)

## Tasks / Subtasks

- [x] **Task 1: Extend `data/site.json` and `SiteConfig` type** (AC: 3)
  - [x] Add `footer` object to `data/site.json` with keys: `branch` ("main"), `framework` ("Next.js 16"), `cssFramework` ("Tailwind v4"), `encoding` ("UTF-8")
  - [x] Update `src/types/site.ts`: add `footer: { branch: string; framework: string; cssFramework: string; encoding: string }` to `SiteConfig` interface

- [x] **Task 2: Create `Footer` server component** (AC: 1, 2, 3, 4)
  - [x] Create `src/components/Footer.tsx` as a named-export Server Component (no `"use client"`)
  - [x] Accept `config: SiteConfig` prop; import from `@/types/site`
  - [x] Wrap all content in `<footer role="contentinfo" className="mt-auto">`
  - [x] Desktop status bar section: `<div className="hidden lg:flex items-center justify-between bg-bg-secondary border-t border-border-subtle h-8 text-xs font-mono">` with `max-w-content mx-auto px-space-4 md:px-space-8 w-full flex items-center justify-between` inner wrapper
  - [x] Left side items inside `<div className="flex items-center gap-space-4">`: render `⎇ {config.footer.branch}`, `{config.footer.framework}`, `{config.footer.cssFramework}` each as `<span className="text-text-tertiary" aria-hidden="true">` — use `<span className="text-border-active mx-space-2" aria-hidden="true">|</span>` as visual separator between items
  - [x] Right side items inside `<div className="flex items-center gap-space-4">`: render `{config.footer.encoding}` as `<span className="text-text-tertiary" aria-hidden="true">`, then conditionally render `<span className="text-accent" aria-label="Available for work">●</span>` when `config.owner.isAvailable` is true
  - [x] Mobile social links section: `<div className="lg:hidden flex items-center justify-center gap-space-6 border-t border-border-subtle py-space-4 bg-bg-primary px-space-4">` — shown only on mobile
  - [x] Render social links from `config.social`: GitHub link as `<a href={config.social.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub profile (opens in new tab)" className="text-text-secondary hover:text-text-primary transition-colors duration-micro text-xs font-mono focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg-primary rounded">GitHub</a>`
  - [x] Render LinkedIn link similarly: `aria-label="LinkedIn profile (opens in new tab)"`, text "LinkedIn"
  - [x] Conditionally render Twitter link if `config.social.twitter` is defined, with `aria-label="Twitter profile (opens in new tab)"`, text "Twitter"

- [x] **Task 3: Update `layout.tsx` to add Footer** (AC: 1, 2)
  - [x] Add `import { Footer } from "@/components/Footer"` at top (after NavBar import, following import order convention)
  - [x] Add `<Footer config={siteConfig} />` as the last child inside `<body>`, after `</main>`

- [x] **Task 4: Validate** (AC: 1–4)
  - [x] Run `pnpm lint` — must pass with zero errors
  - [x] Run `pnpm build` — must pass with zero TypeScript errors
  - [x] Manual viewport check at 320px (mobile): status bar hidden, social links (GitHub, LinkedIn) visible and tappable
  - [x] Manual viewport check at 1280px (desktop): status bar visible at bottom with `⎇ main`, `Next.js 16`, `Tailwind v4`, `UTF-8`, green dot; social link section hidden
  - [x] Keyboard test: Tab through footer on mobile — GitHub, LinkedIn links receive focus ring; on desktop — footer has no focusable elements (all items are decorative)
  - [x] Click a social link: opens in new tab; inspect DOM to confirm `rel="noopener noreferrer"` and `aria-label` present

## Dev Notes

### Developer Context

Story 2.2 completes the page frame. After this story, the root layout renders the full shell in this order:

```
layout.tsx (Server)
  ├── StatusStripe.tsx   (Server) — top bar: availability + ⌘K hint
  ├── <a> skip link      (SR-only) — accessibility
  ├── NavBar.tsx         (Server) — sticky nav + NavLinks.tsx (Client)
  ├── <main>             — page content (filled by future stories)
  └── Footer.tsx         (Server) — bottom VS Code status bar + mobile social links
```

**Why Footer is a Server Component:**
Footer reads static config data only. No DOM access, no browser APIs, no interactivity. Server Component is correct and preferred. "Current section" tracking (mentioned in UX spec anatomy as `Right: current section, encoding, availability dot`) is deferred — it requires the `useActiveSection` hook which is in the architecture for future implementation. The ACs only require the static items (branch, framework, CSS, encoding, dot), so those fully satisfy this story. Do NOT add client-side section tracking here.

**Data model change required for NFR19:**
AC: 3 says "no hardcoded strings in the component". The status bar items (branch name, framework, CSS, encoding) must come from `data/site.json` via `SiteConfig`. A new `footer` block must be added to `site.json` and the `SiteConfig` interface. This is a data model extension — `getSiteConfig()` in `src/lib/data.ts` does NOT need changes because it spreads `siteData` and merges `siteUrl` — the new `footer` block will be picked up automatically by the spread.

**Mobile footer rationale:**
FR17 requires social/GitHub links are accessible to all visitors. On desktop they are embedded in the status bar (if implemented) or visible via other means. On mobile where the status bar is hidden, a simple text link section ensures FR17 is satisfied. No icons needed — there is no icon library in the project.

### Technical Requirements

**Desktop status bar design (AC: 1):**

- Height: `h-8` (32px) — matches VS Code status bar scale
- Background: `bg-bg-secondary` (`#12121A`) — visually distinct from `bg-bg-primary` page background, same as StatusStripe
- Top border: `border-t border-border-subtle` — subtle visual separation from page content above
- Text: `text-xs font-mono` — 12px, monospace, consistent with StatusStripe
- Layout: hidden on mobile via `hidden lg:flex`; inner content max-width contained: `max-w-content mx-auto px-space-4 md:px-space-8 w-full flex items-center justify-between`

**Status bar left items:**

- Branch indicator: `⎇` (U+2387 ALTERNATIVE KEY SYMBOL) + space + `{config.footer.branch}` — `text-text-tertiary`
- Framework: `{config.footer.framework}` — `text-text-tertiary`
- CSS Framework: `{config.footer.cssFramework}` — `text-text-tertiary`
- Separator between items: `|` in `text-border-active` color — visually subdued
- All are decorative: `aria-hidden="true"`

**Status bar right items:**

- Encoding: `{config.footer.encoding}` — `text-text-tertiary`, `aria-hidden="true"`
- Availability dot: `●` (U+25CF) in `text-accent` when `config.owner.isAvailable === true` — this dot conveys availability status and must have `aria-label="Available for work"` (not `aria-hidden`)

**Mobile social links (AC: 2, 4):**

- Container: `lg:hidden flex items-center justify-center gap-space-6 border-t border-border-subtle py-space-4 bg-bg-primary px-space-4`
- Link text: "GitHub", "LinkedIn", "Twitter" (if twitter present) — human-readable text, no icon-only
- Security attributes: `target="_blank" rel="noopener noreferrer"` — required on ALL external links (OWASP: no `rel="noopener noreferrer"` = opener attack surface)
- ARIA: `aria-label="GitHub profile (opens in new tab)"` — describes destination AND new-tab behavior
- Focus ring: `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg-primary rounded`
- Color: `text-text-secondary hover:text-text-primary transition-colors duration-micro`

### Architecture Compliance

- **Named export only**: `export function Footer(...)` — NEVER `export default function Footer`
- **No `"use client"`**: Footer has no interactivity — Server Component confirmed
- **No barrel files**: Import directly: `import { Footer } from "@/components/Footer"`
- **`@/` aliases**: Every intra-`src/` import uses `@/` prefix — no `../../` paths
- **Types from `src/types/`**: Extend `SiteConfig` in `@/types/site` — never inline types
- **Import order in Footer.tsx** (ESLint enforced):
  1. `import type { SiteConfig } from "@/types/site"` — types import

### Library / Framework Requirements

Installed versions (from `package.json`):

- `next@16.2.6` — Server Component, no special APIs needed
- `react@19.2.4` — Server Component (no hooks)
- `tailwindcss@^4` — custom tokens via `src/app/globals.css`

**No new packages required for this story.**

**Tailwind v4 token reference** (from `src/app/globals.css`):

| Token class            | Value                                        |
| ---------------------- | -------------------------------------------- |
| `bg-bg-primary`        | `#0A0A0F`                                    |
| `bg-bg-secondary`      | `#12121A`                                    |
| `border-border-subtle` | `#2A2A3A`                                    |
| `text-border-active`   | `#3A3A50` — for separators                   |
| `text-accent`          | `#00DC82`                                    |
| `text-text-primary`    | `#E8E8ED`                                    |
| `text-text-secondary`  | `#A0A0B0`                                    |
| `text-text-tertiary`   | `#6B6B80`                                    |
| `max-w-content`        | 1120px (`--width-content`)                   |
| `h-8`                  | 32px (standard Tailwind, not a custom token) |
| `px-space-4`           | 16px                                         |
| `px-space-8`           | 32px                                         |
| `py-space-4`           | 16px                                         |
| `gap-space-4`          | 16px                                         |
| `gap-space-6`          | 24px                                         |
| `mx-space-2`           | 8px — separator spacing                      |
| `duration-micro`       | 150ms                                        |

### File Structure Requirements

#### Files to Create

- `src/components/Footer.tsx` (NEW) — Server Component, named export `Footer`

#### Files to Update

- `data/site.json` (UPDATE) — Add `footer` block with `branch`, `framework`, `cssFramework`, `encoding`
- `src/types/site.ts` (UPDATE) — Add `footer` property to `SiteConfig` interface
- `src/app/layout.tsx` (UPDATE) — Import and render `<Footer config={siteConfig} />`

#### Files to Preserve (No Change Expected)

- `src/components/StatusStripe.tsx` — established by Story 2.1, do not touch
- `src/components/NavBar.tsx` — established by Story 2.1, do not touch
- `src/components/NavLinks.tsx` — established by Story 2.1, do not touch
- `src/components/SectionLayout.tsx` — established by Story 1.4, do not touch
- `src/app/globals.css` — token source of truth, do not modify
- `src/lib/data.ts` — `getSiteConfig()` spreads `siteData` object; the new `footer` block flows through automatically; NO changes needed

### Update-File Intelligence

#### `data/site.json` (UPDATE)

**Current state:**

```json
{
  "owner": {
    "name": "BaoBao",
    "title": "Full-Stack Engineer",
    "email": "hello@baobao.dev",
    "isAvailable": true,
    "availabilityText": "Open to new opportunities"
  },
  "social": {
    "github": "https://github.com/baobao",
    "linkedin": "https://linkedin.com/in/baobao"
  },
  "navigation": [
    { "label": "Projects", "href": "/projects" },
    { "label": "About", "href": "/about" },
    { "label": "Contact", "href": "/contact" }
  ]
}
```

**Required addition** — append `footer` block before closing brace:

```json
{
  "owner": { "..." },
  "social": { "..." },
  "navigation": [ "..." ],
  "footer": {
    "branch": "main",
    "framework": "Next.js 16",
    "cssFramework": "Tailwind v4",
    "encoding": "UTF-8"
  }
}
```

#### `src/types/site.ts` (UPDATE)

**Current `SiteConfig` interface:**

```typescript
export interface SiteConfig {
  siteUrl: string;
  owner: {
    name: string;
    title: string;
    email: string;
    isAvailable: boolean;
    availabilityText: string;
  };
  social: {
    github: string;
    linkedin: string;
    twitter?: string;
  };
  navigation: NavigationItem[];
}
```

**Required addition** — add `footer` property:

```typescript
export interface SiteConfig {
  siteUrl: string;
  owner: { ... };   // unchanged
  social: { ... };  // unchanged
  navigation: NavigationItem[];  // unchanged
  footer: {
    branch: string;
    framework: string;
    cssFramework: string;
    encoding: string;
  };
}
```

#### `src/app/layout.tsx` (UPDATE)

**Current state** (as of Story 2.1 completion):

```tsx
import type { Metadata } from "next";
import { Geist_Mono } from "next/font/google";
import "./globals.css";
import { getSiteConfig } from "@/lib/data";
import { StatusStripe } from "@/components/StatusStripe";
import { NavBar } from "@/components/NavBar";
// ...
export default function RootLayout({ children }) {
  const siteConfig = getSiteConfig();
  return (
    <html lang="en" className={`${geistMono.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        <StatusStripe config={siteConfig} />
        <a href="#main-content" className="...">
          Skip to main content
        </a>
        <NavBar config={siteConfig} />
        <main id="main-content" tabIndex={-1} className="flex flex-1 flex-col">
          {children}
        </main>
      </body>
    </html>
  );
}
```

**Required changes:**

1. Add import: `import { Footer } from "@/components/Footer"` (after NavBar import)
2. Add `<Footer config={siteConfig} />` after `</main>`, before `</body>`

**Result body structure:**

```tsx
<body className="flex min-h-full flex-col">
  <StatusStripe config={siteConfig} />
  <a href="#main-content" className="...">
    Skip to main content
  </a>
  <NavBar config={siteConfig} />
  <main id="main-content" tabIndex={-1} className="flex flex-1 flex-col">
    {children}
  </main>
  <Footer config={siteConfig} />
</body>
```

### Previous Story Intelligence (from Story 2.1)

**Patterns to carry forward:**

1. **Server Component + prop injection**: `getSiteConfig()` called once in `layout.tsx`, passed as `config: SiteConfig` — identical pattern for Footer
2. **Named exports**: `export function Footer(...)` — follows StatusStripe, NavBar precedent
3. **Tailwind token-only styling**: No inline styles; all design tokens via utility classes
4. **Focus ring pattern** (apply to ALL focusable elements in Footer — the social links):
   ```
   focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg-primary rounded
   ```
5. **External link security**: `target="_blank" rel="noopener noreferrer"` — already established pattern
6. **ARIA decorative vs. informative**: Decorative dots get `aria-hidden="true"`; dots conveying information (availability) get `aria-label` instead
7. **Conditional rendering for optional fields**: `config.social.twitter` is optional — use `{config.social.twitter && <a href={config.social.twitter}>...`

**Review learnings from Story 2.1 to avoid repeating:**

- Do NOT add `role="dialog"` or `aria-modal` to non-modal elements — for Footer, use `role="contentinfo"` on `<footer>` (correct semantic landmark) and no additional ARIA on the inner status bar items
- The `<footer>` HTML element already carries implicit `role="contentinfo"` — adding `role="contentinfo"` explicitly is optional but acceptable for clarity
- z-index is not needed — Footer is in document flow, not fixed/sticky positioned

### Git Intelligence

Recent commits (all on `main`):

- `c6609e5` — `feat: 2-1-root-layout-statusstripe-navbar` — StatusStripe, NavBar, NavLinks, layout.tsx update
- `a0dda8a` — `feat: 1-4-sectionlayout-component`
- `f7835b9` — `feat: 1-3-content-data-schema-typescript-interfaces-seed-data` — established data schema

Commit pattern: one commit per story, `feat: {story-key}` message. Footer story should follow same convention.

### References

- [Source: _bmad-output/planning-artifacts/epics.md — Story 2.2 requirements]
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md — UX-DR6, Footer (StatusBar) section (line 1019–1030)]
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md — FR17, FR23 requirements]
- [Source: _bmad-output/planning-artifacts/architecture.md — Component directory structure, placement rules]
- [Source: _bmad-output/implementation-artifacts/2-1-root-layout-statusstripe-navbar.md — Previous story patterns and review findings]
- [Source: data/site.json — Current content data structure]
- [Source: src/types/site.ts — SiteConfig type definition]
- [Source: src/app/globals.css — Tailwind v4 token definitions]
- [Source: src/app/layout.tsx — Current layout structure to update]

## Dev Agent Record

### Agent Model Used

Claude Sonnet 4.6 (GitHub Copilot)

### Debug Log References

### Completion Notes List

- Implemented `Footer` as a Server Component with named export — no `"use client"` directive
- Added `footer` block to `data/site.json` with branch, framework, cssFramework, encoding values
- Extended `SiteConfig` interface in `src/types/site.ts` with `footer` property; `getSiteConfig()` picks up the new block automatically via object spread in `src/lib/data.ts` (no changes needed there)
- Desktop status bar: `hidden lg:flex` layout, `bg-bg-secondary` + `border-border-subtle` top border, left items (branch/framework/css with `|` separators) + right items (encoding + conditional availability dot)
- Availability dot uses `aria-label="Available for work"` (informative, not decorative) per ARIA semantics
- Mobile section: `lg:hidden`, renders GitHub + LinkedIn links with `target="_blank" rel="noopener noreferrer"` + `aria-label` on each; Twitter conditionally rendered if `config.social.twitter` is defined
- All social links have `focus-visible` ring pattern consistent with Story 2.1 precedent
- `pnpm lint` — zero errors; `pnpm build` — TypeScript clean, static generation successful

### File List

- `src/components/Footer.tsx` (CREATED)
- `data/site.json` (MODIFIED)
- `src/types/site.ts` (MODIFIED)
- `src/app/layout.tsx` (MODIFIED)

## Change Log

- 2026-05-23: Story 2-2 implemented — created Footer component, extended site.json + SiteConfig with footer block, wired Footer into root layout (Date: 2026-05-23)
