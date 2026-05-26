# Story 7.3: CV Download Button & Client-Side Export

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As the **owner**,
I want a "Download CV" button on the portfolio that triggers client-side PDF generation and download,
so that I can export a fresh, up-to-date CV with a working QR code at any time without a build step.

## Acceptance Criteria

1. **Given** `CVDownloadButton` is rendered on the home page hero
   **When** a visitor or owner clicks "Download CV"
   **Then** `@react-pdf/renderer`'s `pdf()` function is called client-side; a download is triggered with filename `BaoBao-CV.pdf` (derived from `getSiteConfig().owner.name`); the button shows a "Generating..." loading state during generation (NFR4)

2. **Given** PDF generation starts
   **When** it completes
   **Then** PDF generation finishes within 5 seconds on a modern desktop browser; the downloaded file opens correctly in standard PDF viewers (NFR4, NFR8)

3. **Given** the "Download CV" button is on mobile (viewport `max-width: 767px`)
   **When** a mobile visitor views the page
   **Then** the button displays "View on desktop to download" and is disabled/non-functional — no PDF generation is triggered on mobile

4. **Given** PDF generation fails
   **When** an error is caught in the try/catch around `pdf()`
   **Then** the button shows "Export failed — please try again" and returns to a clickable state; the error is not swallowed silently (logged to console)

5. **Given** `CVDownloadButton` is a client component
   **When** the component tree is inspected
   **Then** `"use client"` is present at the top of `CVDownloadButton.tsx`; `@react-pdf/renderer` is only imported inside this client component file — never in a Server Component or layout file (prevents SSR errors from browser-only PDF APIs)

6. **Given** the hero section CTA in `src/app/page.tsx` currently has a placeholder `<Link href="/contact">Download CV</Link>`
   **When** story 7.3 is complete
   **Then** that `<Link>` is replaced with `<CVDownloadButton />`; the button matches the secondary CTA visual style (outlined border, monospace font, same height as the primary "View Projects" button)

## Tasks / Subtasks

- [x] **Task 1: Create `src/components/cv/CVDownloadButton.tsx`** (AC: 1, 2, 3, 4, 5)
  - [x] Add `"use client"` directive as first line
  - [x] Import `useState`, `useEffect` from `react`
  - [x] Import `pdf` from `@react-pdf/renderer`
  - [x] Import `CVDocument` from `./CVDocument` (relative path — NOT `@/components/cv/CVDocument`)
  - [x] Import `generateQRDataURL` from `@/lib/qr`
  - [x] Import `getSiteConfig` from `@/lib/data`
  - [x] Implement `isMobile` detection using `window.matchMedia("(max-width: 767px)")` in a `useEffect` / `useState` pattern (SSR-safe: initialize to `false`)
  - [x] Implement `DownloadState` type: `"idle" | "generating" | "error"`
  - [x] Implement `handleClick` async handler: guard if mobile or generating → setDownloadState("generating") → generateQRDataURL → pdf() → toBlob() → createObjectURL → anchor.click() → revokeObjectURL → setDownloadState("idle")
  - [x] Implement error catch: `console.error(...)` + `setDownloadState("error")`
  - [x] Derive filename as `${site.owner.name.replace(/\s+/g, "-")}-CV.pdf` from `getSiteConfig()`
  - [x] Button label logic: mobile → "View on desktop to download"; generating → "Generating..."; error → "Export failed — please try again"; idle → "Download CV"
  - [x] Button disabled when `isMobile || downloadState === "generating"`
  - [x] Add `aria-live="polite"` and `aria-busy={downloadState === "generating"}` for accessibility (NFR9, NFR12)
  - [x] Apply exact secondary CTA Tailwind classes (see Dev Notes — match existing style from `page.tsx`)
  - [x] Export as named export: `export function CVDownloadButton()`

- [x] **Task 2: Update `src/app/page.tsx`** (AC: 6)
  - [x] Add import: `import { CVDownloadButton } from "@/components/cv/CVDownloadButton";`
  - [x] Replace the secondary CTA `<Link href="/contact" className="...">Download CV</Link>` block with `<CVDownloadButton />`
  - [x] Remove the `{/* Secondary CTA — PDF export deferred to Story 7.3; currently routes to /contact */}` comment
  - [x] Remove the now-unused `Link` import if `Link` is only used for the "Download CV" CTA — **verify** the `Link` import is still used for the primary "View Projects" `href="#selected-work"` CTA before removing

- [x] **Task 3: Verify TypeScript compiles cleanly** (AC: 5)
  - [x] Run `pnpm build` — 0 TypeScript errors, 0 lint errors
  - [x] Confirm no implicit `any` types in `CVDownloadButton.tsx`
  - [x] Confirm `pdf()` return type is correctly inferred (returns `PDFInstance` with `.toBlob(): Promise<Blob>`)

- [x] **Task 4: Manual smoke test** (AC: 1, 2, 3, 4)
  - [x] Run `pnpm dev`, navigate to `/`
  - [x] On desktop: click "Download CV" → button shows "Generating..." → PDF downloads → file opens in viewer with correct content
  - [x] On mobile (or DevTools mobile emulation, width < 768px): button shows "View on desktop to download", clicking does nothing
  - [x] Simulate error: temporarily pass an empty string to `generateQRDataURL` or `pdf()` and confirm error state renders

## Dev Notes

### What This Story Creates vs What Already Exists

| Status                 | Asset                                    | Location                                 | Notes                                                                                                                                                    |
| ---------------------- | ---------------------------------------- | ---------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **NEW — CREATE**       | `src/components/cv/CVDownloadButton.tsx` | `src/components/cv/CVDownloadButton.tsx` | Client trigger for PDF generation. Has `"use client"`. Orchestrates QR URL generation → CVDocument → Blob download.                                      |
| **UPDATE**             | `src/app/page.tsx`                       | `src/app/page.tsx`                       | Replace placeholder `<Link href="/contact">Download CV</Link>` with `<CVDownloadButton />`.                                                              |
| **EXISTS — READ ONLY** | `src/components/cv/CVDocument.tsx`       | `src/components/cv/CVDocument.tsx`       | Story 7.2 output. `export function CVDocument({ qrDataUrl }: { qrDataUrl: string })`. Synchronous React PDF component.                                   |
| **EXISTS — READ ONLY** | `src/lib/qr.ts`                          | `src/lib/qr.ts`                          | `export async function generateQRDataURL(url: string): Promise<string>`. Returns base64 PNG data URL.                                                    |
| **EXISTS — READ ONLY** | `src/lib/data.ts`                        | `src/lib/data.ts`                        | `getSiteConfig()` → `SiteConfig` with `siteUrl`, `owner.name`. Used in button for filename + QR URL.                                                     |
| **SKIP**               | `src/lib/pdf.ts`                         | —                                        | Architecture lists this but orchestration fits inline in `CVDownloadButton.tsx` (3 lines of logic). Do NOT create unless the component becomes unwieldy. |
| **NO CHANGE**          | All other `src/` files                   | —                                        | No other files are modified in this story.                                                                                                               |

### Critical Architecture: The `"use client"` Boundary

`@react-pdf/renderer` uses browser-only APIs (Web Workers, Canvas). It **cannot** be imported in a Server Component. The boundary is strictly:

```
page.tsx (Server Component)
└── <CVDownloadButton />   ← "use client" boundary here
    ├── import { pdf } from "@react-pdf/renderer"   ✅ Safe — client-only file
    └── import { CVDocument } from "./CVDocument"   ✅ Safe — imported through client boundary
```

**NEVER do this:**

```typescript
// ❌ WRONG — page.tsx is a Server Component; importing @react-pdf/renderer here will crash SSR
import { pdf } from "@react-pdf/renderer"; // in page.tsx or layout.tsx
```

**The reason `CVDocument.tsx` has no `"use client"`:**
`CVDocument` is a pure React PDF component — no `useState`, no browser APIs. It is rendered by `pdf()` inside `CVDownloadButton`'s click handler (client-side only). Having `"use client"` on `CVDocument` is unnecessary; the client boundary is `CVDownloadButton`.

### Exact Implementation: `CVDownloadButton.tsx`

```typescript
"use client";

import { useState, useEffect } from "react";
import { pdf } from "@react-pdf/renderer";
import { CVDocument } from "./CVDocument";
import { generateQRDataURL } from "@/lib/qr";
import { getSiteConfig } from "@/lib/data";

type DownloadState = "idle" | "generating" | "error";

export function CVDownloadButton() {
  const [downloadState, setDownloadState] = useState<DownloadState>("idle");
  const [isMobile, setIsMobile] = useState(false); // SSR-safe: start false

  useEffect(() => {
    const mql = window.matchMedia("(max-width: 767px)");
    setIsMobile(mql.matches);
    const handleChange = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mql.addEventListener("change", handleChange);
    return () => mql.removeEventListener("change", handleChange);
  }, []);

  const handleClick = async () => {
    if (isMobile || downloadState === "generating") return;

    setDownloadState("generating");
    try {
      const site = getSiteConfig();
      const qrDataUrl = await generateQRDataURL(site.siteUrl);
      const blob = await pdf(<CVDocument qrDataUrl={qrDataUrl} />).toBlob();

      const filename = `${site.owner.name.replace(/\s+/g, "-")}-CV.pdf`;
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(url);

      setDownloadState("idle");
    } catch (err) {
      console.error("CV PDF generation failed:", err);
      setDownloadState("error");
    }
  };

  const label =
    isMobile
      ? "View on desktop to download"
      : downloadState === "generating"
        ? "Generating..."
        : downloadState === "error"
          ? "Export failed — please try again"
          : "Download CV";

  return (
    <button
      onClick={handleClick}
      disabled={isMobile || downloadState === "generating"}
      aria-live="polite"
      aria-busy={downloadState === "generating"}
      className="px-space-6 py-space-4 border-border-active text-text-primary text-small duration-micro hover:border-accent hover:text-accent focus-visible:ring-accent focus-visible:ring-offset-bg-primary inline-flex items-center justify-center rounded border font-mono transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-60"
    >
      {label}
    </button>
  );
}
```

### Exact Change for `src/app/page.tsx`

**Before (lines ~36–44):**

```tsx
{
  /* Secondary CTA — PDF export deferred to Story 7.3; currently routes to /contact */
}
<Link
  href="/contact"
  className="px-space-6 py-space-4 border-border-active text-text-primary text-small duration-micro hover:border-accent hover:text-accent focus-visible:ring-accent focus-visible:ring-offset-bg-primary inline-flex items-center justify-center rounded border font-mono transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
>
  Download CV
</Link>;
```

**After:**

```tsx
<CVDownloadButton />
```

**Import to add at top of `page.tsx`:**

```typescript
import { CVDownloadButton } from "@/components/cv/CVDownloadButton";
```

**Verify `Link` import is still needed:**
`page.tsx` also uses `<Link href="#selected-work">View Projects</Link>` — so the `Link` import must NOT be removed.

### How `pdf()` from `@react-pdf/renderer` Works (v4.5.1)

```typescript
// Confirmed available: typeof pdf === "function"
import { pdf } from "@react-pdf/renderer";

// Usage pattern:
const blob = await pdf(<CVDocument qrDataUrl={qrDataUrl} />).toBlob();
// Returns PDFInstance with: .toBlob(): Promise<Blob>, .toString(): Promise<string>, .toBuffer(): Promise<Buffer>
```

`pdf()` accepts a React element (JSX). It is a **browser-only** function — calling it server-side throws. The try/catch in `handleClick` handles any runtime failures.

### The Blob → Download Pattern

```typescript
const url = URL.createObjectURL(blob); // Creates a temporary blob: URL
const a = document.createElement("a");
a.href = url;
a.download = filename; // Sets download filename
a.click(); // Triggers browser save dialog / auto-save
URL.revokeObjectURL(url); // Clean up — prevents memory leak
```

This pattern is the standard cross-browser download trigger for `Blob` objects. The `blob:` URL scheme is already permitted by the CSP in `next.config.ts`:

- `img-src 'self' data: blob: https:` — allows blob: images
- `worker-src 'self' blob:` — allows blob: workers (used internally by `@react-pdf/renderer`)

No CSP changes are needed for the download anchor pattern.

### Mobile Detection: SSR-Safe Pattern

`window` is unavailable during server-side rendering. The `useState(false)` + `useEffect` pattern is the SSR-safe approach:

```typescript
const [isMobile, setIsMobile] = useState(false); // Server renders: false (desktop-assumed)

useEffect(() => {
  // Runs client-side only, after hydration
  const mql = window.matchMedia("(max-width: 767px)");
  setIsMobile(mql.matches);
  // ...
}, []);
```

On the server: `isMobile = false` → button renders as "Download CV" (no hydration mismatch for text).
After hydration on mobile: `isMobile = true` → button updates to "View on desktop to download".

**Important:** The `useEffect` fires immediately after first paint. Mobile users will briefly see "Download CV" before it flips to "View on desktop to download" — this is acceptable (standard SSR behavior, not a regression). If this flash needs to be eliminated, a CSS-only approach using Tailwind responsive classes could be used, but that is NOT required by the ACs.

### Filename Derivation

```typescript
const filename = `${site.owner.name.replace(/\s+/g, "-")}-CV.pdf`;
// site.owner.name = "BaoBao" → filename = "BaoBao-CV.pdf"
```

Derive from data, not hardcoded. Handles multi-word names correctly.

### Architecture Compliance

| Rule                                                      | Enforcement                                                                         |
| --------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| `"use client"` on client components with state/effects    | ✅ `CVDownloadButton.tsx` first line                                                |
| Named exports only                                        | ✅ `export function CVDownloadButton()` — no default export                         |
| `CVDownloadButton` in `src/components/cv/`                | ✅ Consistent with CVDocument/CVHeader/CVSection location                           |
| No barrel file `src/components/cv/index.ts`               | ✅ Do NOT create — consumers import directly via `@/components/cv/CVDownloadButton` |
| `@/` alias for cross-module imports                       | ✅ `@/lib/qr`, `@/lib/data` — relative only for siblings in same `cv/` folder       |
| `@react-pdf/renderer` never imported in Server Components | ✅ Only in `CVDownloadButton.tsx` which has `"use client"`                          |
| No hardcoded content strings                              | ✅ Name, filename derived from `getSiteConfig()`                                    |
| WCAG 2.1 AA — `aria-live`, `aria-busy`                    | ✅ Screen readers announce state changes                                            |

### Key Anti-Patterns to Reject

| Anti-Pattern                                                                          | Why It Fails                                                                                                           |
| ------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| `import { pdf } from "@react-pdf/renderer"` in `page.tsx` or `layout.tsx`             | Server Component import of browser-only API → SSR crash                                                                |
| `"use client"` on `CVDocument.tsx`                                                    | Unnecessary; already works without it; adding it doesn't break but violates the principle of minimal client boundaries |
| `window.innerWidth` checked inline in render (not in useEffect)                       | Throws on server — must be inside `useEffect`                                                                          |
| `useState(window.matchMedia(...))` as initial value                                   | Throws on server during SSR — must use `useState(false)`                                                               |
| Not calling `URL.revokeObjectURL(url)` after download                                 | Memory leak — blob URL stays alive indefinitely                                                                        |
| Catching errors silently (empty catch block)                                          | AC 4 requires user-facing error message + console.error                                                                |
| Creating `src/lib/pdf.ts` with JSX inside a `.ts` file                                | JSX requires `.tsx` extension or explicit React.createElement; just keep generation inline in CVDownloadButton         |
| Creating barrel `src/components/cv/index.ts`                                          | Architecture explicitly says NO barrel files; direct imports only                                                      |
| `import { CVDownloadButton } from "@/components/cv/CVDownloadButton"` from `page.tsx` | ✅ This is CORRECT — Server Components CAN import Client Components. This is standard Next.js RSC model.               |

### Previous Story Learnings (from 7-1, 7-2)

1. **Named exports only** — `export function CVDownloadButton()` (not `export default`). Consistent with all previous CV components.
2. **`pnpm build` must pass with 0 TypeScript errors** before marking done.
3. **`@/` alias for non-sibling imports** — use `@/lib/qr`, `@/lib/data` (not `../../lib/qr`).
4. **Relative imports for siblings** — `./CVDocument` (not `@/components/cv/CVDocument`) — same folder imports use relative paths.
5. **No implicit `any` types** — `pdf()` return type, blob, err — all must be correctly typed.
6. **Commit message convention:** `feat: 7-3-cv-download-button-client-side-export`
7. **`getSiteConfig().siteUrl`** reads `process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'` — this is the canonical URL for QR generation, confirmed from `src/lib/data.ts` line 28.
8. **`generateQRDataURL` is async** — must be `await`ed before passing result to `CVDocument`.

### What the Current `page.tsx` Hero Looks Like (READ BEFORE EDITING)

The hero section in `src/app/page.tsx` currently has this CTA block:

```tsx
{
  /* CTAs — side-by-side on sm+ (≥640px), stacked on mobile */
}
<div className="gap-space-4 pt-space-2 flex flex-col sm:flex-row">
  {/* Primary CTA — updated to scroll to #selected-work on this page (Story 3.3) */}
  <Link
    href="#selected-work"
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
</div>;
```

**What to preserve:** The `<Link href="#selected-work">View Projects</Link>` primary CTA must NOT be touched. The `Link` import at the top of the file must stay (it's still used for the primary CTA).

**What to change:** Replace ONLY the secondary CTA `<Link>` block (including the comment above it) with `<CVDownloadButton />`.

**Add import:** `import { CVDownloadButton } from "@/components/cv/CVDownloadButton";`

### CSP Configuration (Already Correct — No Changes Needed)

`next.config.ts` already has:

```
worker-src 'self' blob:    ← required for @react-pdf/renderer Web Workers
img-src 'self' data: blob: https:  ← allows blob: URLs
```

The Blob download pattern (`URL.createObjectURL` + anchor click) is already covered. **No `next.config.ts` changes are required.**

## Dev Agent Record

### Agent Model Used

Claude Sonnet 4.6 (GitHub Copilot)

### Debug Log References

- CSP `connect-src` needed `data:` added to allow `@react-pdf/renderer` to fetch its WASM binary via `data:` URL inside the Web Worker. Story dev notes stated "no CSP changes needed" — this was incorrect for v4.x. Fixed in `next.config.ts`.

### Completion Notes List

- Created `src/components/cv/CVDownloadButton.tsx` — client component with `"use client"` directive, SSR-safe mobile detection via `useEffect`/`matchMedia`, async PDF generation via `@react-pdf/renderer`'s `pdf()`, Blob download anchor pattern, and full accessible state management (`aria-live`, `aria-busy`).
- Updated `src/app/page.tsx` — replaced secondary CTA `<Link>` with `<CVDownloadButton />`, added import, kept `Link` import (still used for primary "View Projects" CTA).
- Updated `next.config.ts` — added `data:` to `connect-src` CSP directive (required for `@react-pdf/renderer` WASM fetch inside Web Worker).
- Smoke tested via Playwright: desktop click → "Generating..." → PDF downloaded → idle state restored; mobile viewport → "View on desktop to download" label confirmed in screenshot.
- `pnpm build` passes with 0 TypeScript errors.

### File List

- `src/components/cv/CVDownloadButton.tsx` — NEW
- `src/app/page.tsx` — MODIFIED (import added, secondary CTA replaced)
- `next.config.ts` — MODIFIED (`data:` added to `connect-src`)

## Change Log

- 2026-05-26: Implemented story 7-3-cv-download-button-client-side-export. Created CVDownloadButton client component; replaced hero secondary CTA; fixed CSP connect-src to allow @react-pdf/renderer WASM fetch.
