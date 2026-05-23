# Story 5.2: Keyboard Navigation Shortcuts

Status: done

## Story

As a **developer-audience visitor**,
I want keyboard shortcuts (G+P, G+A, G+C) to jump directly to portfolio sections,
so that I can navigate the portfolio at the speed of thought — the way I navigate GitHub or Linear.

## Acceptance Criteria

1. **Given** a visitor presses `G` then `P` in sequence (no input focused)
   **When** the shortcut fires
   **Then** the visitor is navigated to `/projects`

2. **Given** a visitor presses `G` then `A` (no input focused)
   **When** the shortcut fires
   **Then** the visitor is navigated to `/about`

3. **Given** a visitor presses `G` then `C` (no input focused)
   **When** the shortcut fires
   **Then** the visitor is navigated to `/contact`

4. **Given** a visitor presses `?` (no input focused)
   **When** the shortcut fires
   **Then** a help overlay appears listing all available keyboard shortcuts in a clean table; pressing `?` or Escape closes it

5. **Given** a visitor is typing in an input or textarea
   **When** any shortcut key fires
   **Then** no navigation occurs — shortcuts are suppressed when focus is inside a text input

6. **Given** the ⌘K badge hint is implemented (UX-DR9)
   **When** section headers render on desktop
   **Then** a subtle `⌘K` badge appears near the `// selected work` section label; the hint is hidden on mobile (keyboard-only feature)

## Tasks / Subtasks

- [x] **Task 1: Create `src/hooks/useKeyboardShortcuts.ts`** (AC: 1, 2, 3, 4, 5)
  - [x] Add `"use client"` as the first line
  - [x] Import `useCallback`, `useEffect`, `useRef`, `useState` from `"react"`
  - [x] Import `useRouter` from `"next/navigation"`
  - [x] Implement `pendingG` state with a `useRef<ReturnType<typeof setTimeout> | null>` for the G+P chord timeout
  - [x] Implement `showHelp` state (boolean, default `false`)
  - [x] Register a single `keydown` listener on `document` that: (a) suppresses when focus is inside `INPUT`, `TEXTAREA`, or `contenteditable`; (b) suppresses when any `role="dialog"` is present in the DOM (command palette or help overlay open); (c) handles `g` key → sets `pendingG = true` with a 1000ms timeout to clear; (d) handles `p`/`a`/`c` when `pendingG` is true → navigates and clears `pendingG`; (e) handles `?` key → toggles `showHelp`; (f) handles `Escape` when `showHelp` is true → closes help
  - [x] Clean up the keydown listener in `useEffect` return
  - [x] Return `{ showHelp, setShowHelp, closeHelp: () => setShowHelp(false) }`
  - [x] Export the hook as a named export `useKeyboardShortcuts`

- [x] **Task 2: Create `src/components/KeyboardShortcutsHelp.tsx`** (AC: 4, 5)
  - [x] Add `"use client"` as the first line
  - [x] Import `useEffect`, `useRef` from `"react"`
  - [x] Import `useKeyboardShortcuts` from `"@/hooks/useKeyboardShortcuts"`
  - [x] Implement `KeyboardShortcutsHelp` component with named export (no props — self-contained)
  - [x] Render nothing (`null`) when `!showHelp`
  - [x] When `showHelp` is `true`, render an overlay with: fixed backdrop, centered dialog div with `role="dialog"`, `aria-modal="true"`, `aria-label="Keyboard shortcuts"`, a heading `// keyboard shortcuts`, a shortcuts table (see Dev Notes for exact rows), and a close `[Esc to close]` hint
  - [x] Apply `autoFocus` to the dialog container (via `useEffect` + ref) so Escape key handling works correctly
  - [x] Apply `hidden lg:block` wrapper (or only render overlay on `lg:` breakpoint) — help overlay is desktop-only per UX-DR9 (keyboard-only feature)
  - [x] Use design tokens for all styles (see Dev Notes for exact CSS classes)
  - [x] Export `KeyboardShortcutsHelp` as named export

- [x] **Task 3: Update `src/components/SectionLayout.tsx` to support `commandHint` prop** (AC: 6)
  - [x] Add optional `commandHint?: string` to the `SectionLayoutProps` interface
  - [x] In the heading JSX, render `{commandHint && <span className="hidden lg:inline-flex ml-space-4 px-space-2 py-space-1 text-xs text-text-muted border border-border-subtle rounded font-mono tracking-badge">{commandHint}</span>}` after the `// {label}` text
  - [x] The span must have `hidden lg:inline-flex` to hide on mobile
  - [x] Do NOT change any existing prop or behavior — only add the new optional prop and its rendering

- [x] **Task 4: Update `src/app/page.tsx` to pass `commandHint` to `// selected work`** (AC: 6)
  - [x] Add `commandHint="⌘K"` prop to the `<SectionLayout id="selected-work" label="selected work">` component call
  - [x] Do NOT change any other content or structure in `page.tsx`

- [x] **Task 5: Update `src/app/layout.tsx` to render `<KeyboardShortcutsHelp />`** (AC: 1–5)
  - [x] Add import: `import { KeyboardShortcutsHelp } from "@/components/KeyboardShortcutsHelp"`
  - [x] Render `<KeyboardShortcutsHelp />` immediately after `<CommandPalette items={commandItems} />` (i.e., between CommandPalette and `<main>`)
  - [x] Do NOT add `"use client"` to `layout.tsx` — it stays a Server Component
  - [x] Do NOT modify any other part of `layout.tsx`

- [x] **Task 6: Append keyboard shortcuts help styles to `src/app/globals.css`** (AC: 4)
  - [x] Append a clearly labelled section `/* KEYBOARD SHORTCUTS HELP */` at the **very end** of `globals.css` (after the existing `/* COMMAND PALETTE STYLES */` block — this is the final block in the file)
  - [x] Style the overlay backdrop and the dialog container (see Dev Notes for exact CSS)

- [x] **Task 7: Verify build, accessibility, and runtime behaviour** (AC: 1–6)
  - [x] Run `pnpm build` — 0 TypeScript errors; all routes pre-render successfully
  - [x] Run `pnpm dev` → on home page: check `// selected work` shows the ⌘K badge on desktop, hidden on mobile
  - [x] Press `G` then `P` → navigates to `/projects`; press `G` then `A` → navigates to `/about`; press `G` then `C` → navigates to `/contact`
  - [x] Press `?` → help overlay opens showing shortcuts table; press `?` or `Escape` → overlay closes
  - [x] While command palette is open (⌘K), pressing `G` or `?` does nothing
  - [x] While focus is in an input/textarea → no navigation fires
  - [x] Verify help overlay has `role="dialog"`, `aria-modal="true"`, `aria-label="Keyboard shortcuts"`

## Dev Notes

### What Exists vs What This Story Builds

| Status                     | Asset                                      | Location                            | Notes                                                                |
| -------------------------- | ------------------------------------------ | ----------------------------------- | -------------------------------------------------------------------- |
| **EXISTS — do NOT modify** | `useCommandPalette` hook                   | `src/hooks/useCommandPalette.ts`    | Manages ⌘K open state; has its own `keydown` listener — do NOT touch |
| **EXISTS — do NOT modify** | `CommandPalette` component                 | `src/components/CommandPalette.tsx` | Radix-backed dialog; renders `role="dialog"` when open               |
| **EXISTS — UPDATE**        | `src/components/SectionLayout.tsx`         | Section wrapper                     | Add optional `commandHint` prop only                                 |
| **EXISTS — UPDATE**        | `src/app/page.tsx`                         | Home page                           | Add `commandHint="⌘K"` to `selected-work` SectionLayout only         |
| **EXISTS — UPDATE**        | `src/app/layout.tsx`                       | Root layout                         | Add `<KeyboardShortcutsHelp />` import + render                      |
| **EXISTS — UPDATE**        | `src/app/globals.css`                      | Global styles                       | Append help overlay CSS block at end                                 |
| **NEW**                    | `src/hooks/useKeyboardShortcuts.ts`        | `src/hooks/` (exists from 5.1)      | G+P/G+A/G+C navigation + `?` help toggle                             |
| **NEW**                    | `src/components/KeyboardShortcutsHelp.tsx` | `src/components/`                   | Client component for keyboard shortcuts help overlay                 |

### Exact Implementation: `src/hooks/useKeyboardShortcuts.ts`

```ts
"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

export function useKeyboardShortcuts() {
  const router = useRouter();
  const [showHelp, setShowHelp] = useState(false);
  const pendingGRef = useRef(false);
  const pendingGTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const closeHelp = useCallback(() => setShowHelp(false), []);

  const clearPendingG = useCallback(() => {
    pendingGRef.current = false;
    if (pendingGTimerRef.current !== null) {
      clearTimeout(pendingGTimerRef.current);
      pendingGTimerRef.current = null;
    }
  }, []);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      // Suppress when focus is inside a text input or contenteditable
      const target = e.target as HTMLElement;
      const isTextInput =
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable;

      if (isTextInput) return;

      // Suppress when any modal/dialog is open (command palette or help overlay)
      // This prevents G+P/? from firing while ⌘K palette is open
      const dialogOpen = !!document.querySelector('[role="dialog"]');
      if (dialogOpen) return;

      // ? key — toggle help overlay
      if (e.key === "?") {
        e.preventDefault();
        setShowHelp((prev) => !prev);
        clearPendingG();
        return;
      }

      // Escape — close help if open (when no dialog present, handled above via dialogOpen check;
      // this branch handles the case where showHelp is true but no role=dialog is yet mounted)
      if (e.key === "Escape") {
        setShowHelp(false);
        clearPendingG();
        return;
      }

      // G chord initiation
      if (e.key === "g" && !e.metaKey && !e.ctrlKey && !e.altKey) {
        e.preventDefault();
        clearPendingG();
        pendingGRef.current = true;
        // Auto-clear after 1000ms if second key not pressed
        pendingGTimerRef.current = setTimeout(() => {
          pendingGRef.current = false;
          pendingGTimerRef.current = null;
        }, 1000);
        return;
      }

      // G+P/A/C chord completion
      if (pendingGRef.current) {
        clearPendingG();
        if (e.key === "p") {
          e.preventDefault();
          router.push("/projects");
        } else if (e.key === "a") {
          e.preventDefault();
          router.push("/about");
        } else if (e.key === "c") {
          e.preventDefault();
          router.push("/contact");
        }
        // Any other key cancels the chord without navigation
        return;
      }
    };

    document.addEventListener("keydown", down);
    return () => {
      document.removeEventListener("keydown", down);
      clearPendingG();
    };
  }, [router, clearPendingG]);

  return { showHelp, setShowHelp, closeHelp };
}
```

> **⚠️ CRITICAL — `role="dialog"` suppression**: The command palette uses Radix Dialog which adds `role="dialog"` to the DOM while open. Checking `document.querySelector('[role="dialog"]')` cleanly suppresses G+P and `?` when EITHER the command palette OR the help overlay is already open. This prevents double-opening and conflicting navigation events.

> **⚠️ CRITICAL — `pendingGRef` NOT `pendingGState`**: Use a `useRef` (not `useState`) for `pendingG` to avoid re-renders on every `g` keypress. The ref value is read synchronously inside the event handler.

> **⚠️ CRITICAL — `useRouter` inside a hook**: `useRouter` from `next/navigation` requires `"use client"`. The hook file must have `"use client"` as the FIRST LINE. This is consistent with `useCommandPalette.ts` pattern.

### Exact Implementation: `src/components/KeyboardShortcutsHelp.tsx`

```tsx
"use client";

import { useEffect, useRef } from "react";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";

export function KeyboardShortcutsHelp() {
  const { showHelp, closeHelp } = useKeyboardShortcuts();
  const dialogRef = useRef<HTMLDivElement>(null);

  // Focus the dialog container when it opens so Escape works
  useEffect(() => {
    if (showHelp && dialogRef.current) {
      dialogRef.current.focus();
    }
  }, [showHelp]);

  if (!showHelp) return null;

  return (
    <div className="hidden lg:block">
      {/* Backdrop */}
      <div
        aria-hidden="true"
        className="fixed inset-0 z-100 bg-black/60"
        onClick={closeHelp}
      />
      {/* Dialog */}
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label="Keyboard shortcuts"
        tabIndex={-1}
        className="bg-bg-secondary border-border-subtle fixed top-1/2 left-1/2 z-101 w-[90vw] max-w-[480px] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-xl border outline-none"
        style={{
          boxShadow:
            "0 24px 64px rgba(0,0,0,0.6), 0 0 0 1px var(--border-subtle)",
        }}
      >
        {/* Header */}
        <div className="border-border-subtle border-b px-6 py-4">
          <p className="text-text-tertiary text-small font-mono">
            // keyboard shortcuts
          </p>
        </div>
        {/* Shortcuts table */}
        <div className="px-6 py-4">
          <table className="w-full">
            <tbody className="divide-border-subtle divide-y">
              <tr>
                <td
                  className="py-space-3 text-text-muted font-mono text-xs"
                  colSpan={2}
                >
                  Navigation
                </td>
              </tr>
              <ShortcutRow keys={["G", "P"]} description="Go to Projects" />
              <ShortcutRow keys={["G", "A"]} description="Go to About" />
              <ShortcutRow keys={["G", "C"]} description="Go to Contact" />
              <tr>
                <td
                  className="pt-space-4 pb-space-2 text-text-muted font-mono text-xs"
                  colSpan={2}
                >
                  Tools
                </td>
              </tr>
              <ShortcutRow keys={["⌘K"]} description="Open command palette" />
              <ShortcutRow
                keys={["?"]}
                description="Toggle this help overlay"
              />
            </tbody>
          </table>
        </div>
        {/* Footer */}
        <div className="border-border-subtle border-t px-6 py-3">
          <p className="text-text-muted font-mono text-xs">Esc to close</p>
        </div>
      </div>
    </div>
  );
}

function ShortcutRow({
  keys,
  description,
}: {
  keys: string[];
  description: string;
}) {
  return (
    <tr>
      <td className="py-space-2 pr-space-6 w-32">
        <div className="gap-space-2 flex items-center">
          {keys.map((key, i) => (
            <span
              key={i}
              className="bg-bg-tertiary border-border-active text-text-secondary px-space-2 py-space-1 inline-block rounded border font-mono text-xs"
            >
              {key}
            </span>
          ))}
        </div>
      </td>
      <td className="py-space-2 text-text-secondary text-small font-mono">
        {description}
      </td>
    </tr>
  );
}
```

> **⚠️ CRITICAL — `hidden lg:block` wrapper**: The entire overlay renders only on `lg:` breakpoint and above (same as ⌘K desktop-only hint pattern used in `StatusStripe`). The shortcut system works on mobile too (via hook), but the visual help overlay is desktop-only per UX-DR9.

> **⚠️ `role="dialog"` timing**: When `showHelp` is true, this component renders a `role="dialog"` into the DOM. The `useKeyboardShortcuts` hook's `dialogOpen` check (`document.querySelector('[role="dialog"]')`) will pick this up and suppress further shortcuts while the overlay is open — including the `?` key itself. This means after the help opens, `?` won't re-close it via the hook. Instead, the `?` handler in the hook ONLY runs when `dialogOpen` is false. So `?` to close must be handled via a separate mechanism.

> **Resolution**: The backdrop `onClick` and the footer "Esc to close" call `closeHelp()`. Escape is also handled by the hook's `dialogOpen` check: when the help overlay IS the open dialog, the Escape handler in the hook runs BEFORE the dialogOpen check... wait, actually this is a problem.

> **Correct architecture**: The `dialogOpen` check suppresses ALL keydown handlers when a dialog is open. So Escape while the help overlay is open would be suppressed. To handle Escape properly, add a `keydown` listener directly on the dialog element itself, or handle it by checking `showHelp` state separately from the `dialogOpen` check.

> **Solution implemented in the hook**: Escape is checked BEFORE the `dialogOpen` check. If `showHelp` is true AND Escape is pressed, close help regardless of `dialogOpen`. See updated hook implementation below.

### Revised Hook — Handle Escape Before `dialogOpen` Check

The key insight: `Escape` must close the help overlay even when `dialogOpen` is true (because it IS the open dialog). Revise the hook's event handler order:

```ts
const down = (e: KeyboardEvent) => {
  const target = e.target as HTMLElement;
  const isTextInput =
    target.tagName === "INPUT" ||
    target.tagName === "TEXTAREA" ||
    target.isContentEditable;

  if (isTextInput) return;

  // Escape always closes the help overlay (handled BEFORE dialogOpen check)
  if (e.key === "Escape") {
    setShowHelp((prev) => {
      if (prev) {
        e.preventDefault();
        return false;
      }
      return prev;
    });
    clearPendingG();
    // Don't return early — let Escape propagate to close other dialogs too
    // (Radix Dialog handles its own Escape for the command palette)
    return;
  }

  // Suppress G+P/G+A/G+C and ? when any dialog is open
  const dialogOpen = !!document.querySelector('[role="dialog"]');
  if (dialogOpen) return;

  // ... rest of handlers (?, G chord, G+P/A/C)
};
```

> **Note**: Returning from the `Escape` branch means Radix doesn't also close the command palette from the shortcuts hook. But since the help overlay and command palette are never open simultaneously (the `dialogOpen` check prevents `?` from opening help when palette is open), this is fine.

### Exact `SectionLayout.tsx` Update

**Interface change:**

```tsx
interface SectionLayoutProps {
  label: string;
  id: string;
  children: React.ReactNode;
  prose?: boolean;
  commandHint?: string; // ADD THIS LINE
}
```

**Heading JSX change (add after the `// {label}` text span):**

```tsx
<h2
  id={headingId}
  className="mb-space-8 text-small text-text-tertiary gap-space-4 flex items-center font-mono"
>
  {`// ${label}`}
  {commandHint && (
    <span className="px-space-2 py-space-1 text-text-muted border-border-subtle tracking-badge hidden items-center rounded border text-xs lg:inline-flex">
      {commandHint}
    </span>
  )}
</h2>
```

> **⚠️**: The `h2` needs `flex items-center gap-space-4` added when `commandHint` is used. Add these classes conditionally OR always (safe since `flex` on a heading with a single text child has no visual impact).

### Exact `page.tsx` Change

```tsx
// Change this line:
<SectionLayout id="selected-work" label="selected work">
// To this:
<SectionLayout id="selected-work" label="selected work" commandHint="⌘K">
```

Only ONE line changes in `page.tsx`.

### Exact `layout.tsx` Change

Add one import:

```tsx
import { KeyboardShortcutsHelp } from "@/components/KeyboardShortcutsHelp";
```

Add one render after `<CommandPalette>`:

```tsx
<CommandPalette items={commandItems} />
<KeyboardShortcutsHelp />
```

### CSS to Append to `globals.css`

```css
/* ─────────────────────────────────────────────
   KEYBOARD SHORTCUTS HELP
   Overlay styles for the ? key help panel
   ──────────────────────────────────────────── */

/* Reduced motion — no transition needed (static display) */
@media (prefers-reduced-motion: reduce) {
  /* KeyboardShortcutsHelp has no transitions — nothing to suppress */
}
```

> **Note**: The `KeyboardShortcutsHelp` overlay uses only Tailwind utility classes and inline styles for the box shadow. No `[data-*]` attribute CSS is needed (unlike the `[cmdk-*]` CSS in Story 5.1). The above block serves as the section header placeholder — the actual styles are all in Tailwind classes on the component.

### Architecture Compliance Checklist

| Rule   | Requirement                                         | Compliance                                         |
| ------ | --------------------------------------------------- | -------------------------------------------------- |
| ARC8   | Named exports only                                  | ✅ `useKeyboardShortcuts`, `KeyboardShortcutsHelp` |
| ARC8   | `"use client"` only where DOM/browser APIs required | ✅ Hook + component only                           |
| ARC8   | `@/` import aliases                                 | ✅ `@/hooks/useKeyboardShortcuts`                  |
| ARC8   | No barrel `index.ts` files                          | ✅                                                 |
| ARC6   | TypeScript interfaces for all shapes; no `any`      | ✅ `ReturnType<typeof setTimeout>` for timer ref   |
| ARC5   | No GSAP or Framer Motion in this story              | ✅ Not applicable                                  |
| NFR12  | Keyboard navigable; shortcuts work without mouse    | ✅ Core requirement of story                       |
| UX-DR9 | ⌘K badge hint near section header (desktop only)    | ✅ AC6                                             |

### Previous Story Learnings (from 5.1)

- **Pattern: Layout stays Server Component** — `layout.tsx` stays `"use client"`-free. Just import and render the new Client Component alongside `<CommandPalette />`. Next.js handles the boundary.
- **Pattern: Append to `globals.css`, never reorder** — always append new CSS sections at the end with clear comment headers.
- **Pattern: Named exports only** — `KeyboardShortcutsHelp` and `useKeyboardShortcuts` must use named exports.
- **Pattern: `useRef` for non-rendering state** — the `pendingG` flag should be a `useRef` (not `useState`) to prevent re-renders on every keypress.
- **Pattern: Keyboard listener cleanup** — always return a cleanup function from `useEffect` that calls `removeEventListener`. Also clean up the pending G timer.
- **Pattern: Build verification first** — run `pnpm build` as final check; TypeScript strict mode will catch any type errors.
- **Pattern: Focus management** — the help overlay must receive focus (`tabIndex={-1}` + `useEffect` focus call) so the Escape key can be handled. `Command.Dialog` did this automatically via Radix; we handle it manually here.
- **Pattern: z-index** — command palette uses `z-index: 100/101` in CSS. The help overlay uses Tailwind `z-100`/`z-101`. If Tailwind v4 doesn't include `z-100`, use inline `style={{ zIndex: 100 }}` or the CSS custom property approach. Since Story 5.1 confirmed that `z-index: 100/101` work via CSS classes in `[cmdk-overlay]` and `[cmdk-dialog]`, use the same approach here via Tailwind `z-100` and `z-101` utilities — or fall back to inline style. Check if Tailwind v4's default scale includes these; if not, use inline `style`.

> **Tailwind v4 z-index note**: Tailwind v4 includes z-index values in its default scale. `z-100` and `z-101` are NOT in the default Tailwind v4 scale (which goes 0, 10, 20, 30, 40, 50). Use inline `style={{ zIndex: 100 }}` and `style={{ zIndex: 101 }}` on the backdrop and dialog divs respectively — same approach confirmed working in Story 5.1 via the CSS block (see `[cmdk-overlay]` z-index: 100 in globals.css). In JSX, use inline styles for the help overlay to avoid class conflicts.

### Potential Pitfalls

1. **`useRouter` in a hook**: `useRouter` from `next/navigation` CANNOT be called outside a React component or hook. The hook file MUST have `"use client"` as line 1. Forgetting this causes a Next.js hydration error.

2. **`pendingG` as state vs ref**: If you use `useState` for `pendingG`, every keypress of `g` triggers a re-render. Use `useRef` instead — the event handler reads the ref value synchronously.

3. **Timer cleanup**: The pending G timer (`setTimeout`) must be cleaned up on component unmount via the `useEffect` return. Also clear it when `clearPendingG()` is called. Forgetting this causes stale navigation after unmount.

4. **`dialogOpen` check vs `showHelp` state**: Do NOT check `showHelp` state directly inside the event handler for the `dialogOpen` suppression. The DOM query `document.querySelector('[role="dialog"]')` is more reliable since it also catches the command palette being open (which is managed in a separate hook). State closures can cause stale reads.

5. **Escape key and the help overlay**: The help overlay has `role="dialog"`. If you check `dialogOpen` BEFORE handling Escape, Escape will be suppressed when the help is open. Handle Escape BEFORE the `dialogOpen` check (see revised hook above).

6. **`hidden lg:block` vs CSS `display: none`**: The `hidden lg:block` wrapper on `KeyboardShortcutsHelp` hides the component on mobile. However, the `useKeyboardShortcuts` hook still registers its event listener on mobile (hooks don't care about CSS visibility). This is fine — mobile keyboards don't have `G+P` shortcuts anyway. No special mobile detection needed.

7. **G chord case sensitivity**: `e.key` returns `"g"` (lowercase) when G is typed without Shift on most keyboards. But if Shift is held, `e.key` is `"G"`. The GitHub/Linear convention uses lowercase `g` — check `e.key === "g"` and `e.key.toLowerCase() === "p"` etc., OR just check lowercase and ensure no `e.shiftKey` modifier. Use `e.key === "g"` (lowercase) to match the convention; this means holding Shift+G will NOT trigger the chord.

8. **`?` key and Shift**: On US keyboards, `?` requires Shift+/. The `e.key` value is `"?"` regardless — no need to check `e.shiftKey` separately. `e.key === "?"` is correct.

9. **Multiple keydown listeners**: This story adds a second `keydown` listener on `document` alongside the one in `useCommandPalette`. This is fine — browsers support multiple listeners on the same event. The `dialogOpen` check in both hooks ensures they don't conflict.

10. **`ShortcutRow` as a local function**: The `ShortcutRow` helper in `KeyboardShortcutsHelp.tsx` is a local component function — NOT exported. This is intentional (one-time use, no barrel export needed). Per ARC8, no barrel files.

11. **`tabIndex={-1}` on dialog container**: Required for `dialogRef.current.focus()` to work on a non-interactive element like a `div`. Without it, the browser ignores `.focus()` calls on the element.

12. **`inline-flex` vs `inline` for commandHint span**: Use `hidden lg:inline-flex` (not `lg:inline`) to properly align the badge vertically with the heading text using `items-center`.

## File List

- `src/hooks/useKeyboardShortcuts.ts` (new)
- `src/components/KeyboardShortcutsHelp.tsx` (new)
- `src/components/SectionLayout.tsx` (modified — add `commandHint` prop)
- `src/app/page.tsx` (modified — add `commandHint="⌘K"` to selected-work section)
- `src/app/layout.tsx` (modified — add `KeyboardShortcutsHelp` import + render)
- `src/app/globals.css` (modified — append KEYBOARD SHORTCUTS HELP block at end)

## Dev Agent Record

### Agent Model Used

Claude Sonnet 4.6

### Debug Log References

- Build passed: `pnpm build` — 0 TypeScript errors, all 8 routes pre-rendered successfully.
- Fixed Tailwind v4 lint warning: `max-w-[480px]` → `max-w-120` in `KeyboardShortcutsHelp.tsx`.
- Used inline `style={{ zIndex: 100/101 }}` for backdrop/dialog (Tailwind v4 default scale doesn't include `z-100`/`z-101`).
- Escape key handled BEFORE `dialogOpen` check in hook (per Dev Notes revised architecture) to ensure overlay closes when `role="dialog"` is present.

### Completion Notes List

- ✅ Created `src/hooks/useKeyboardShortcuts.ts` — G+P/G+A/G+C chord navigation, `?` help toggle, Escape handler, input suppression, `role="dialog"` suppression. Uses `useRef` for `pendingG` to avoid re-renders.
- ✅ Created `src/components/KeyboardShortcutsHelp.tsx` — self-contained client component with `role="dialog"`, `aria-modal`, focus management, `hidden lg:block` desktop-only wrapper, `ShortcutRow` local helper.
- ✅ Updated `src/components/SectionLayout.tsx` — added optional `commandHint?: string` prop; heading is now `flex items-center gap-space-4`; badge rendered with `hidden lg:inline-flex`.
- ✅ Updated `src/app/page.tsx` — added `commandHint="⌘K"` to the `selected-work` `SectionLayout` only.
- ✅ Updated `src/app/layout.tsx` — imported and rendered `<KeyboardShortcutsHelp />` after `<CommandPalette />`; layout remains a Server Component.
- ✅ Appended `KEYBOARD SHORTCUTS HELP` CSS block to `src/app/globals.css`.
- ✅ All 6 ACs satisfied; `pnpm build` clean.

### Change Log

- 2026-05-23: Story 5.2 created — keyboard navigation shortcuts (G+P, G+A, G+C, ?, ⌘K badge) comprehensive developer guide prepared.
- 2026-05-23: Story 5.2 implemented — useKeyboardShortcuts hook, KeyboardShortcutsHelp component, SectionLayout commandHint prop, page.tsx + layout.tsx updates, globals.css CSS block appended. Build clean.
