# Story 3.1: Badge Component

Status: done

## Story

As a **visitor**,
I want to instantly read the technology stack of any project via visual pill tags,
so that I can assess technical fit in seconds without reading a description.

## Acceptance Criteria

1. **Given** `Badge` is rendered with a `label` prop
   **When** it appears on a project card or detail page
   **Then** it displays in Geist Mono at `--text-xs` size (12px), letter-spacing `0.04em`, `--accent-muted` background (12% opacity), with 4px border-radius; the tag is readable at a glance

2. **Given** multiple `Badge` components render in a row
   **When** they wrap to a new line on narrow viewports
   **Then** they wrap cleanly without overflow or clipping; gap between badges uses `--space-2` (8px)

3. **Given** a `Badge` receives an optional `category` prop
   **When** rendered
   **Then** badges from different categories (language vs framework vs tool) can have subtle color variations via predefined category-to-color mappings in the component

## Tasks / Subtasks

- [x] **Task 1: Create `Badge` component** (AC: 1, 2, 3)
  - [x] Create `src/components/Badge.tsx` — new file, does NOT exist yet
  - [x] Define `BadgeCategory` type inside the file: `"language" | "framework" | "tool" | "other"`
  - [x] Define `BadgeProps` interface: `{ label: string; category?: BadgeCategory }`
  - [x] Define `categoryStyles` as a `Record<BadgeCategory, string>` constant — see Dev Notes for exact values
  - [x] Implement `Badge` function returning a `<span>` with classes from Tailwind tokens
  - [x] Export as a named export: `export function Badge(...)` — NOT a default export
  - [x] Do **NOT** add `"use client"` — Badge is a pure Server Component (no DOM events, no hooks)

- [x] **Task 2: Verify Tailwind token classes resolve correctly** (AC: 1)
  - [x] Confirm `text-xs` resolves to 12px — it maps to `--text-xs: 0.75rem` in `globals.css` `@theme` block (line ~99)
  - [x] Confirm `tracking-badge` resolves to `0.04em` — it maps to `--tracking-badge: 0.04em` in the `@theme` block
  - [x] Confirm `bg-accent-muted` resolves to `#00dc8220` — it maps to `--color-accent-muted: var(--accent-muted)` in the `@theme inline` block
  - [x] Confirm `px-space-2` / `py-space-1` are available spacing tokens
  - [x] Run `pnpm build` to confirm no TypeScript or CSS errors

## Dev Notes

### Exact Implementation

**File:** `src/components/Badge.tsx`

```tsx
type BadgeCategory = "language" | "framework" | "tool" | "other";

interface BadgeProps {
  label: string;
  category?: BadgeCategory;
}

const categoryStyles: Record<BadgeCategory, string> = {
  language: "bg-accent-muted text-accent",
  framework: "bg-info/10 text-info",
  tool: "bg-warning/10 text-warning",
  other: "bg-accent-muted text-text-secondary",
};

export function Badge({ label, category = "other" }: BadgeProps) {
  const colorClasses = categoryStyles[category];
  return (
    <span
      className={`px-space-2 py-space-1 tracking-badge inline-block rounded font-mono text-xs ${colorClasses}`}
    >
      {label}
    </span>
  );
}
```

**Why these specific choices:**

- `<span>` not `<div>` — pill tags are inline phrasing content; spans compose correctly inside flex/flow containers
- `inline-block` — allows padding to apply correctly while staying flow-inline
- `rounded` — Tailwind default `0.25rem` = 4px, matches the AC exactly
- `text-xs` — maps to `--text-xs: 0.75rem` (12px) via the `@theme` block in `globals.css`
- `tracking-badge` — maps to `--tracking-badge: 0.04em` via the `@theme` block
- `font-mono` — maps to `--font-mono: var(--font-geist-mono)` via `--font-mono` in `@theme inline`
- `px-space-2 py-space-1` — 8px horizontal, 4px vertical padding (4px base grid)
- `bg-info/10` — `#60A5FA` at 10% opacity (≈ same visual weight as `--accent-muted` at 12%)
- `bg-warning/10` — `#FFB224` at 10% opacity — consistent opacity treatment

### AC 2 — Wrapping Behavior

The Badge component itself does **not** control wrapping. The **parent container** must use `flex flex-wrap gap-space-2` to achieve the 8px gap and clean line-wrapping. This is intentional: Badge is a leaf component and wrapping is a layout concern of its parent. Downstream stories (3-3 ProjectCard, 3-4 About) will implement the flex-wrap container.

### Category Color Mappings (for future consumer guidance)

| `category` prop       | Background                              | Text color                   | Use case                 |
| --------------------- | --------------------------------------- | ---------------------------- | ------------------------ |
| `"language"`          | `bg-accent-muted` (#00DC82 12% opacity) | `text-accent` (green)        | TypeScript, Python, Rust |
| `"framework"`         | `bg-info/10` (#60A5FA 10% opacity)      | `text-info` (blue)           | React, Next.js, Express  |
| `"tool"`              | `bg-warning/10` (#FFB224 10% opacity)   | `text-warning` (amber)       | Git, Docker, Vercel      |
| `"other"` _(default)_ | `bg-accent-muted`                       | `text-text-secondary` (grey) | Generic / unclassified   |

When `category` is omitted, `"other"` is the default — yields accent-muted background with grey text.

### Files Being Created (New — no regressions possible)

- `src/components/Badge.tsx` — NEW file, no existing file to break

### Files NOT Modified By This Story

- `src/app/globals.css` — all required tokens already exist
- `src/lib/data.ts` — no data loading needed; Badge receives `label` as a plain string prop
- `src/types/project.ts` — `techStack: string[]` remains as-is; callers pass each string as `label` prop
- `src/types/site.ts` — no changes
- Any existing `src/components/` file — Badge is purely additive

### Architecture Compliance Checklist

- [x] Named export only (`export function Badge`) — no default export [Source: architecture.md#Naming Patterns]
- [x] No `"use client"` directive — Badge has zero browser API or event handler usage [Source: architecture.md#Frontend Architecture]
- [x] No barrel `index.ts` in `src/components/` — direct import path used by consumers [Source: architecture.md#ARC8]
- [x] Import alias `@/components/Badge` used by consumers — not deep relative paths [Source: architecture.md#ARC8]
- [x] `BadgeCategory` type lives in the component file — it is a presentation concern, not a data contract, so `src/types/` is not required [Source: architecture.md#Structure Patterns]
- [x] No `any` type usage [Source: architecture.md#ARC6]
- [x] Tailwind CSS utilities only — no inline `style={{}}` props [Source: architecture.md#Frontend Architecture]
- [x] Animation: none required — Badge is a static display component; hover states on Badge are the parent's (ProjectCard) responsibility in Story 3-3

### Previous Story Learnings (from 2-3-page-shell)

From the completed stories, the following patterns are confirmed working:

1. **Tailwind token class syntax confirmed** — classes like `text-text-tertiary`, `text-small`, `text-accent`, `bg-bg-secondary`, `border-border-subtle`, `px-space-8`, `gap-space-4` all resolve correctly. Use the same pattern for Badge.
2. **`font-mono` works as expected** — used in SectionLayout (`className="... font-mono"`) and confirmed rendering Geist Mono.
3. **Server Components are the default** — every component built so far (NavBar internals, SectionLayout, Footer sections, all pages) is a Server Component unless it needs DOM APIs or event handlers. Badge needs neither.
4. **Named export pattern** — every component uses `export function ComponentName(...)` with no default export. Match this exactly.

### Git Context (last 3 commits)

- `001f560` feat: 2-3-page-shell-empty-section-stubs-vercel-deployment — pages and not-found implemented
- `1153ab7` feat: 2-2-footer-status-bar — Footer component with VS Code status bar
- `c6609e5` feat: 2-1-root-layout-statusstripe-navbar — NavBar, StatusStripe, root layout

All confirmed clean. No outstanding TODOs that affect Badge.

### Project Structure Notes

```
src/components/
├── Footer.tsx          (exists — do not modify)
├── NavBar.tsx          (exists — do not modify)
├── NavLinks.tsx        (exists — do not modify)
├── SectionLayout.tsx   (exists — do not modify)
├── StatusStripe.tsx    (exists — do not modify)
└── Badge.tsx           ← CREATE THIS FILE
```

### References

- [Source: _bmad-output/planning-artifacts/epics.md#Story 3.1] — AC source and user story statement
- [Source: _bmad-output/planning-artifacts/architecture.md#Naming Patterns] — PascalCase component files, named exports
- [Source: _bmad-output/planning-artifacts/architecture.md#Frontend Architecture] — Server Components default, `"use client"` opt-in rule
- [Source: src/app/globals.css#@theme block] — All Tailwind token utilities: `text-xs`, `tracking-badge`, `font-mono`, spacing, colors
- [Source: _bmad-output/planning-artifacts/epics.md#UX-DR11] — "tech stack pill tags, Geist Mono, --text-xs size, accent-muted background, slight color variation by category"
- [Source: _bmad-output/planning-artifacts/epics.md#ARC8] — No barrel files, named exports, `@/` aliases, `"use client"` only when DOM required

## Dev Agent Record

### Agent Model Used

Claude Sonnet 4.6 (GitHub Copilot)

### Debug Log References

- Token verification: All classes (`text-xs`, `tracking-badge`, `bg-accent-muted`, `px-space-2`, `py-space-1`) confirmed in `globals.css` `@theme` blocks before implementation.
- `pnpm build` passed cleanly: TypeScript ✓, CSS ✓, 7 static pages generated.

### Completion Notes List

- Created `src/components/Badge.tsx` as a pure Server Component with named export.
- Implemented `BadgeCategory` type and `categoryStyles` map exactly per Dev Notes spec.
- No `"use client"` directive — component has zero browser API or event handler dependencies.
- All four AC conditions satisfied: Geist Mono via `font-mono`, 12px via `text-xs`, 0.04em letter-spacing via `tracking-badge`, 4px border-radius via `rounded`, color variations via `categoryStyles`, wrapping delegated to parent container.
- `pnpm build` passed with zero errors or warnings.

### File List

- `src/components/Badge.tsx` (created)

## Change Log

- 2026-05-23: Implemented Badge component — created `src/components/Badge.tsx` with `BadgeCategory` type, `BadgeProps` interface, `categoryStyles` map, and `Badge` named export. Verified all Tailwind tokens resolve correctly. `pnpm build` passed cleanly. (Claude Sonnet 4.6)
