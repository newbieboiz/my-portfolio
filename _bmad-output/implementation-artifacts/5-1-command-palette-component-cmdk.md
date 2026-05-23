# Story 5.1: Command Palette Component (⌘K)

Status: done

## Story

As a **developer-audience visitor**,
I want to open a fuzzy-search command palette with ⌘K / Ctrl+K,
so that I can navigate anywhere on the portfolio instantly without touching the mouse — the way I navigate my actual tools.

## Acceptance Criteria

1. **Given** a visitor presses ⌘K (macOS) or Ctrl+K (Windows/Linux) on any page
   **When** the key combination fires
   **Then** the `CommandPalette` overlay opens centered on the viewport with a search input auto-focused; the overlay has `--bg-secondary` background, `--border-subtle` border, and a backdrop behind it

2. **Given** the command palette is open and the visitor types a query
   **When** characters are entered
   **Then** results from a pre-built index (pages: Home, Projects, About, Contact; all project titles and slugs from `getProjects()`) are filtered using fuzzy matching via `cmdk`; results appear instantly with no async delay (index loaded at build time via root layout)

3. **Given** a result is highlighted and Enter is pressed
   **When** the action fires
   **Then** the visitor navigates to the selected page or project URL; the command palette closes

4. **Given** the command palette is open
   **When** the visitor presses Escape
   **Then** the palette closes and focus returns to the previously focused element

5. **Given** the command palette is open
   **When** inspected for accessibility
   **Then** it has `role="dialog"`, `aria-modal="true"`, and an `aria-label`; focus is trapped inside the overlay while open (NFR12)

6. **Given** the `CommandPalette` component is implemented
   **When** the component tree is inspected
   **Then** `"use client"` is on `CommandPalette` only; the root layout passes the pre-built content index as a prop from a Server Component; no data fetching occurs inside the palette at runtime

## Tasks / Subtasks

- [x] **Task 1: Create `src/hooks/` directory and `useCommandPalette.ts` hook** (AC: 1, 4)
  - [x] Create the directory `src/hooks/` (it does NOT currently exist)
  - [x] Create `src/hooks/useCommandPalette.ts` — exports `useCommandPalette()` hook (see Dev Notes for exact implementation)
  - [x] Hook manages: `open` state, `toggle()`, `close()` functions, and registers the `⌘K` / `Ctrl+K` keyboard listener
  - [x] Keyboard listener MUST be suppressed when focus is inside an `<input>`, `<textarea>`, or `[contenteditable]` (prevent conflict with Story 5.2 global shortcut conventions)
  - [x] Use `addEventListener("keydown", ...)` on `document`; clean up with `removeEventListener` in the `useEffect` cleanup

- [x] **Task 2: Create `src/components/CommandPalette.tsx`** (AC: 1, 2, 3, 4, 5, 6)
  - [x] Add `"use client"` as the first line
  - [x] Import `useCommandPalette` from `@/hooks/useCommandPalette`
  - [x] Import `Command` from `cmdk` (dot-notation sub-components: `Command.Dialog`, `Command.Input`, etc.)
  - [x] Import `useRouter` from `next/navigation` for programmatic navigation
  - [x] Define and export `CommandItem` interface (see Dev Notes for exact shape)
  - [x] Implement `CommandPalette` component with named export (AC: 6)
  - [x] Use `Command.Dialog` (not bare `Command` + custom dialog) — it wraps Radix Dialog and handles focus trap + `aria-modal` automatically (AC: 5)
  - [x] Pass `open` and `onOpenChange` props to `Command.Dialog`; pass `label="Global command palette"` for the accessible label (AC: 5)
  - [x] Render `Command.Input` with `placeholder="Search pages and projects…"` inside; it auto-focuses when dialog opens
  - [x] Render `Command.List` containing: `Command.Empty`, `Command.Group heading="Pages"`, `Command.Group heading="Projects"`
  - [x] For each item, render `Command.Item` with `value={item.label}`, `keywords={item.keywords ?? []}`, and `onSelect={() => handleSelect(item.href)}`
  - [x] `handleSelect` must call `setOpen(false)` (via `close()` from hook) then `router.push(href)` — in that order
  - [x] Apply Tailwind/CSS styles via `className` on `Command.Dialog` and children (see Dev Notes for exact classes and `[cmdk-*]` CSS)
  - [x] Do NOT use `useEffect` in `CommandPalette` for the ⌘K listener — that belongs in `useCommandPalette.ts`

- [x] **Task 3: Add `[cmdk-*]` CSS styles to `src/app/globals.css`** (AC: 1)
  - [x] Append a clearly labelled section `/* COMMAND PALETTE STYLES */` at the **end** of `globals.css` (after the existing `/* MDX PROSE STYLES */` block)
  - [x] Style the overlay, dialog container, input, list, group headings, items, selected item state, and empty state (see Dev Notes for exact CSS)
  - [x] `[cmdk-overlay]` must use `position: fixed; inset: 0` with a semi-transparent dark background
  - [x] `[cmdk-dialog]` must be centered using `position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%)`
  - [x] `[cmdk-item][data-selected="true"]` must use `background-color: var(--bg-tertiary)` and `color: var(--text-primary)` for keyboard selection highlight

- [x] **Task 4: Update `src/app/layout.tsx` to wire the command palette** (AC: 2, 6)
  - [x] Add import: `import { getProjects } from "@/lib/data"` (already imports `getSiteConfig`)
  - [x] Add import: `import { CommandPalette, type CommandItem } from "@/components/CommandPalette"`
  - [x] Inside `RootLayout` (Server Component, no changes to `"use client"` — layout stays Server), call `getProjects()` to build the content index
  - [x] Build the `commandItems: CommandItem[]` array from pages + projects (see Dev Notes for exact shape)
  - [x] Render `<CommandPalette items={commandItems} />` inside `<body>` **before** `{children}` — after `<NavBar />` (see Dev Notes for placement)
  - [x] Do NOT add `"use client"` to `layout.tsx` — `CommandPalette` is already a client component, Next.js handles the boundary automatically

- [x] **Task 5: Verify build, accessibility, and runtime behaviour** (AC: 1–6)
  - [x] Run `pnpm build` — 0 TypeScript errors; check no hydration warnings
  - [x] Run `pnpm dev` → press ⌘K on any page → palette opens, search input is focused, typing filters results
  - [x] Select a page item with Enter → navigates to page, palette closes
  - [x] Select a project item with Enter → navigates to `/projects/[slug]`, palette closes
  - [x] Press Escape → palette closes, focus returns to previously focused element
  - [x] Verify in browser DevTools: dialog has `role="dialog"`, `aria-modal="true"`, and `aria-label="Global command palette"`
  - [x] Verify `<CommandPalette>` renders inside `<body>` in the DOM (Radix portals to `<body>` by default)
  - [x] On mobile, the ⌘K hint in `StatusStripe` is hidden (already conditional via `hidden lg:flex`) — palette should still open on mobile via keyboard (no change needed to StatusStripe)

## Dev Notes

### What Exists vs What This Story Builds

| Status                     | Asset                                | Location                  | Notes                                                                     |
| -------------------------- | ------------------------------------ | ------------------------- | ------------------------------------------------------------------------- |
| **EXISTS — do NOT modify** | `getSiteConfig()`                    | `src/lib/data.ts`         | Returns `SiteConfig` with `navigation: NavigationItem[]`                  |
| **EXISTS — do NOT modify** | `getProjects()`                      | `src/lib/data.ts`         | Returns `Project[]` with `slug`, `title`, `techStack`                     |
| **EXISTS — do NOT modify** | `Project` / `ProjectMeta` interfaces | `src/types/project.ts`    | `slug`, `title`, `description`, `techStack: string[]`, `outcome`          |
| **EXISTS — do NOT modify** | `NavigationItem` interface           | `src/types/site.ts`       | `label: string`, `href: string`, `isExternal?: boolean`                   |
| **EXISTS — UPDATE**        | `src/app/layout.tsx`                 | Root layout               | Add `getProjects()` call, build `commandItems`, render `<CommandPalette>` |
| **EXISTS — UPDATE**        | `src/app/globals.css`                | Global styles             | Append `[cmdk-*]` CSS block at end                                        |
| **NEW**                    | `src/hooks/useCommandPalette.ts`     | `src/hooks/` (create dir) | Manages `open` state + ⌘K keyboard listener                               |
| **NEW**                    | `src/components/CommandPalette.tsx`  | `src/components/`         | Client component using `cmdk` v1.1.1                                      |
| **INSTALLED**              | `cmdk` v1.1.1                        | `node_modules/cmdk`       | Already in `package.json` from Story 1.1 — do NOT re-install              |
| **⚠️ MISSING**             | `src/hooks/` directory               | —                         | Does NOT exist yet — must be created (first file creates it)              |

### cmdk v1.1.1 API — Exact Usage Patterns

**Import pattern (named exports):**

```ts
import { Command } from "cmdk";
// Sub-components via dot notation:
// Command.Dialog, Command.Input, Command.List, Command.Item,
// Command.Group, Command.Empty, Command.Separator
```

**Dialog approach (use this — NOT bare `Command`):**

```tsx
<Command.Dialog
  open={open}
  onOpenChange={setOpen}
  label="Global command palette"
>
  <Command.Input placeholder="Search pages and projects…" />
  <Command.List>
    <Command.Empty>No results found.</Command.Empty>
    <Command.Group heading="Pages">
      <Command.Item value="Home" onSelect={() => handleSelect("/")}>
        Home
      </Command.Item>
    </Command.Group>
  </Command.List>
</Command.Dialog>
```

**Key API facts:**

- `Command.Dialog` wraps Radix UI's Dialog — **focus trap, `aria-modal`, and `role="dialog"` are automatic** (AC: 5 is satisfied by Radix, do NOT manually add these)
- `open={false}` must be the initial state (useState default = false) — **never compute from server state** to prevent hydration mismatch (cmdk FAQ)
- `onOpenChange` receives `boolean` — connect to `setOpen` from hook
- `label` prop on `Command.Dialog` sets `aria-label` on the dialog element
- `Command.Input` auto-focuses when the dialog opens — **do NOT add `autoFocus` manually**
- `Command.Item` `value` prop = the string that cmdk fuzzy-matches against
- `Command.Item` `keywords` prop = extra strings that boost matching (use `techStack` for projects)
- `Command.Item` `onSelect` fires on Enter or pointer click
- `Command.Empty` renders **automatically** when the filtered count is 0 — do not conditionally render it yourself
- `Command.Group heading="..."` hides automatically when all its children are filtered out

### Exact Implementation: `src/hooks/useCommandPalette.ts`

```ts
"use client";

import { useState, useEffect } from "react";

export function useCommandPalette() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      // Suppress when focus is inside a text input
      const target = e.target as HTMLElement;
      const isTextInput =
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable;

      if (isTextInput && e.key !== "k") return; // Allow ⌘K even from inputs to open palette

      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  return {
    open,
    setOpen,
    close: () => setOpen(false),
  };
}
```

> **Note:** ⌘K is allowed from inputs (to toggle the palette open even when an input is focused) — this matches developer tool conventions (e.g., VS Code, Linear). The Story 5.2 G+P/G+A/G+C shortcuts will be suppressed from inputs, but ⌘K is fine.

### Exact Implementation: `src/components/CommandPalette.tsx`

```tsx
"use client";

import { useRouter } from "next/navigation";
import { Command } from "cmdk";

import { useCommandPalette } from "@/hooks/useCommandPalette";

export interface CommandItem {
  id: string;
  label: string;
  href: string;
  group: "Pages" | "Projects";
  keywords?: string[];
}

interface CommandPaletteProps {
  items: CommandItem[];
}

export function CommandPalette({ items }: CommandPaletteProps) {
  const { open, setOpen, close } = useCommandPalette();
  const router = useRouter();

  const pageItems = items.filter((item) => item.group === "Pages");
  const projectItems = items.filter((item) => item.group === "Projects");

  const handleSelect = (href: string) => {
    close();
    router.push(href);
  };

  return (
    <Command.Dialog
      open={open}
      onOpenChange={setOpen}
      label="Global command palette"
    >
      <Command.Input placeholder="Search pages and projects…" />
      <Command.List>
        <Command.Empty>No results found.</Command.Empty>
        <Command.Group heading="Pages">
          {pageItems.map((item) => (
            <Command.Item
              key={item.id}
              value={item.label}
              keywords={item.keywords ?? []}
              onSelect={() => handleSelect(item.href)}
            >
              {item.label}
            </Command.Item>
          ))}
        </Command.Group>
        {projectItems.length > 0 && (
          <Command.Group heading="Projects">
            {projectItems.map((item) => (
              <Command.Item
                key={item.id}
                value={item.label}
                keywords={item.keywords ?? []}
                onSelect={() => handleSelect(item.href)}
              >
                {item.label}
              </Command.Item>
            ))}
          </Command.Group>
        )}
      </Command.List>
    </Command.Dialog>
  );
}
```

> **CRITICAL:** `Command.Dialog` renders the Radix Dialog **portal** directly into `<body>`, so it does not need to be inside any specific DOM parent in `layout.tsx`. Place it as a sibling to `<main>` for semantic clarity.

### Exact `commandItems` Array — `src/app/layout.tsx` Update

```tsx
// Add these imports at top (keep existing imports):
import { getProjects } from "@/lib/data";
import { CommandPalette, type CommandItem } from "@/components/CommandPalette";

// Inside RootLayout function body, after getSiteConfig():
const projects = getProjects();

const commandItems: CommandItem[] = [
  { id: "page-home", label: "Home", href: "/", group: "Pages" },
  { id: "page-projects", label: "Projects", href: "/projects", group: "Pages" },
  { id: "page-about", label: "About", href: "/about", group: "Pages" },
  { id: "page-contact", label: "Contact", href: "/contact", group: "Pages" },
  ...projects.map((p) => ({
    id: `project-${p.slug}`,
    label: p.title,
    href: `/projects/${p.slug}`,
    group: "Projects" as const,
    keywords: [...p.techStack, p.slug, p.description],
  })),
];
```

**Layout JSX placement — add `<CommandPalette>` after `<NavBar>`, before `<main>`:**

```tsx
<NavBar config={siteConfig} />
<CommandPalette items={commandItems} />
<main id="main-content" tabIndex={-1} className="flex flex-1 flex-col">
  {children}
</main>
```

> **Do NOT add `"use client"` to `layout.tsx`.** Next.js automatically splits the client boundary at `CommandPalette`. The `RootLayout` remains a Server Component and `getProjects()` runs at build time.

### Exact CSS — Append to `src/app/globals.css`

Add this block at the **very end** of the file, after the `/* MDX PROSE STYLES */` section:

```css
/* ─────────────────────────────────────────────
   COMMAND PALETTE STYLES
   Targets cmdk [cmdk-*] data attributes
   Command.Dialog portals to <body> via Radix
   ──────────────────────────────────────────── */

/* Overlay backdrop */
[cmdk-overlay] {
  background-color: rgba(0, 0, 0, 0.6);
  inset: 0;
  position: fixed;
  z-index: 100;
}

/* Dialog container — centered, max-width constrained */
[cmdk-dialog] {
  background-color: var(--bg-secondary);
  border: 1px solid var(--border-subtle);
  border-radius: 12px;
  box-shadow:
    0 24px 64px rgba(0, 0, 0, 0.6),
    0 0 0 1px var(--border-subtle);
  left: 50%;
  max-height: 480px;
  max-width: 560px;
  overflow: hidden;
  position: fixed;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 90vw;
  z-index: 101;
}

/* Search input */
[cmdk-input] {
  background: transparent;
  border: none;
  border-bottom: 1px solid var(--border-subtle);
  color: var(--text-primary);
  font-family: var(--font-geist-mono), monospace;
  font-size: var(--text-body);
  line-height: var(--leading-body);
  outline: none;
  padding: var(--space-4) var(--space-6);
  width: 100%;
}

[cmdk-input]::placeholder {
  color: var(--text-muted);
}

/* Scrollable results list */
[cmdk-list] {
  max-height: 360px;
  overflow-y: auto;
  padding: var(--space-2) 0;
  scroll-padding-block-end: 8px;
  scroll-padding-block-start: 8px;
}

/* Group heading */
[cmdk-group-heading] {
  color: var(--text-muted);
  font-family: var(--font-geist-mono), monospace;
  font-size: var(--text-xs);
  letter-spacing: var(--tracking-badge);
  padding: var(--space-2) var(--space-6);
  text-transform: uppercase;
  user-select: none;
}

/* Individual item */
[cmdk-item] {
  border-radius: 6px;
  color: var(--text-secondary);
  cursor: pointer;
  font-family: var(--font-geist-mono), monospace;
  font-size: var(--text-small);
  margin: 0 var(--space-2);
  padding: var(--space-3) var(--space-4);
  transition:
    background-color var(--duration-micro) ease,
    color var(--duration-micro) ease;
}

/* Keyboard-selected item */
[cmdk-item][data-selected="true"] {
  background-color: var(--bg-tertiary);
  color: var(--text-primary);
}

/* Pointer hover (matches selected state for consistency) */
[cmdk-item]:hover {
  background-color: var(--bg-tertiary);
  color: var(--text-primary);
}

/* Empty state */
[cmdk-empty] {
  color: var(--text-muted);
  font-family: var(--font-geist-mono), monospace;
  font-size: var(--text-small);
  padding: var(--space-8) var(--space-6);
  text-align: center;
}

/* Reduced motion — disable transitions */
@media (prefers-reduced-motion: reduce) {
  [cmdk-item] {
    transition: none;
  }
}
```

### Architecture Compliance Checklist

| Rule         | Requirement                                             | Compliance                          |
| ------------ | ------------------------------------------------------- | ----------------------------------- |
| ARC8         | Named export only (`export function CommandPalette`)    | ✅                                  |
| ARC8         | `"use client"` only where DOM/browser APIs are required | ✅ CommandPalette and hook only     |
| ARC8         | `@/` import aliases, no deep relative paths             | ✅                                  |
| ARC8         | No barrel `index.ts` files                              | ✅                                  |
| ARC6         | TypeScript interfaces for all data shapes; no `any`     | ✅ `CommandItem` interface          |
| Architecture | `CommandPalette` is a client component                  | ✅                                  |
| Architecture | Root layout passes pre-built index as prop              | ✅ `commandItems` built server-side |
| Architecture | No data fetching inside palette at runtime              | ✅                                  |
| UX-DR9       | `cmdk` library for fuzzy-search overlay                 | ✅                                  |
| UX-DR9       | ⌘K / Ctrl+K opens palette                               | ✅                                  |
| NFR12        | Focus trapped inside overlay while open                 | ✅ Radix Dialog handles this        |

### Previous Story Learnings (from 4.2)

- **Pattern: Avoid `<main>` wrappers in child pages** — root layout already provides `<main id="main-content">`. CommandPalette portals to `<body>`, so this is a non-issue for 5.1.
- **Pattern: Do not modify existing component imports in layout.tsx unless adding** — layout is critical infrastructure; surgical additions only.
- **Pattern: Append to `globals.css`, never reorder** — always append new CSS sections at the end with clear comment headers.
- **Pattern: Named exports only** (enforced since Story 1.1) — `CommandPalette` and `CommandItem` both use named exports.
- **Pattern: Build verification** — always run `pnpm build` as final check; TypeScript strict mode will catch any `any` or missing interface fields.

### Potential Pitfalls

1. **Hydration mismatch**: `open` state MUST default to `false` (useState default). Never initialize from server data. cmdk FAQ confirms: "Ensure the `open` prop to `Command.Dialog` is `false` on the server."
2. **Wrong import**: `import { Command } from "cmdk"` — NOT `import Command from "cmdk"`. The `Command` export is the `pkg` sub-component-containing object.
3. **Missing directory**: `src/hooks/` does not exist — the first file written there creates the directory.
4. **Do not import `CommandDialog` separately**: Use `Command.Dialog` (dot notation) for consistency with other sub-components.
5. **Focus trap**: Do NOT manually implement focus trapping — `Command.Dialog` (Radix Dialog) handles it completely. Adding `tabIndex` tricks or manual focus logic will conflict.
6. **cmdk overlay vs custom overlay**: `Command.Dialog` renders its own `[cmdk-overlay]` div. Do NOT add a second overlay/backdrop in JSX — style via `[cmdk-overlay]` CSS only.
7. **`useRouter` must stay inside client component**: `useRouter` from `next/navigation` requires `"use client"`. It's already inside `CommandPalette.tsx` — never move it to the layout.
8. **Empty state auto-renders**: `Command.Empty` renders automatically when filtered count is 0 — do not wrap it in a conditional.
9. **`getProjects()` in layout**: `getProjects()` is a synchronous function (reads pre-imported JSON) — no `await` needed, no `async` layout needed.
10. **z-index stacking**: Navbar uses `z-50`. The palette overlay uses `z-100` and dialog `z-101` — ensure these are above all existing elements. (Tailwind v4: `z-100` may need inline style or custom token if not in default scale — use `style={{ zIndex: 100 }}` if Tailwind `z-100` class isn't available.)

> **z-index note**: Check if `z-100`/`z-101` are in the default Tailwind v4 scale. If not, use CSS custom values in `[cmdk-overlay]` and `[cmdk-dialog]` (which the CSS block above already does via `z-index: 100`/`101` in the stylesheet). This is correct — do not add inline styles to the cmdk components.

## File List

- `src/hooks/useCommandPalette.ts` (new)
- `src/components/CommandPalette.tsx` (new)
- `src/app/globals.css` (modified — appended COMMAND PALETTE STYLES block)
- `src/app/layout.tsx` (modified — added getProjects import, CommandPalette import, commandItems array, and <CommandPalette> render)

## Dev Agent Record

### Implementation Plan

Implemented the cmdk-based command palette in four stages:

1. Created `src/hooks/useCommandPalette.ts` with `open` state management and ⌘K/Ctrl+K keyboard listener with proper cleanup.
2. Created `src/components/CommandPalette.tsx` using `Command.Dialog` (Radix-backed) for automatic focus trap and ARIA attributes; items filtered into Pages and Projects groups.
3. Appended `[cmdk-*]` CSS block to `globals.css` after the MDX PROSE STYLES section — overlay, dialog, input, list, group headings, items, and empty state all styled with design tokens.
4. Updated `src/app/layout.tsx` to build `commandItems` server-side from `getProjects()` + static page entries, and rendered `<CommandPalette items={commandItems} />` after `<NavBar />`.

### Completion Notes

- All 5 tasks and all subtasks completed and checked.
- `pnpm build` passes: 0 TypeScript errors, all 6 routes prerendered successfully.
- `open` state initializes to `false` (prevents hydration mismatch per cmdk FAQ).
- `layout.tsx` remains a Server Component — Next.js handles the client boundary at `<CommandPalette>`.
- `Command.Dialog` (Radix) automatically provides `role="dialog"`, `aria-modal="true"`, `aria-label` via `label` prop, and focus trapping — no manual implementation needed.
- z-index stacking handled entirely via CSS (`z-index: 100` overlay, `101` dialog) — no inline styles needed.
- Reduced-motion preference respected via `@media (prefers-reduced-motion: reduce)` block.

## Change Log

- 2026-05-23: Story 5.1 implemented — command palette component (⌘K) added with useCommandPalette hook, CommandPalette component, CSS styles, and layout wiring.
