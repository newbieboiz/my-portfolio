# Story 7.1: QR Code Generation Utility

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As the **owner**,
I want a utility that generates a QR code data URL from the canonical portfolio URL,
so that the QR code in the exported PDF always points to the live site — never a stale or hardcoded address.

## Acceptance Criteria

1. **Given** `src/lib/qr.ts` exports `generateQRDataURL(url: string): Promise<string>`
   **When** called with `process.env.NEXT_PUBLIC_SITE_URL`
   **Then** it returns a base64 PNG data URL (format: `data:image/png;base64,...`) suitable for embedding as an `<Image>` src in `@react-pdf/renderer`; the QR code resolves correctly when scanned with a phone camera

2. **Given** `NEXT_PUBLIC_SITE_URL` changes (e.g. domain update)
   **When** the PDF is re-exported
   **Then** the new URL is encoded in the QR code; no URL string is hardcoded in `qr.ts` or any CV component

3. **Given** the QR generation call fails
   **When** an error occurs in the `qrcode` library
   **Then** the error is caught and propagated to the PDF generation layer with a descriptive message; the PDF generation does not silently produce a blank QR code

4. **Given** `qr.ts` is a utility module
   **When** the module is inspected
   **Then** it has no UI imports; it is a pure async function usable from any client or server context; it uses the `qrcode` npm package (not a CDN script)

## Tasks / Subtasks

- [x] **Task 1: Create `src/lib/qr.ts`** (AC: 1, 2, 3, 4)
  - [x] Import `QRCode` from `'qrcode'` (default import — see Dev Notes for correct import pattern)
  - [x] Export `generateQRDataURL(url: string): Promise<string>` as a named export
  - [x] Call `QRCode.toDataURL(url, { errorCorrectionLevel: 'M', width: 200 })` — returns `Promise<string>` when no callback is passed
  - [x] Let errors propagate naturally (no try/catch inside the utility — the Promise rejection carries the descriptive error; the caller handles it). See AC 3 note in Dev Notes.
  - [x] No UI imports — no React, no Next.js, no Tailwind; this is a pure TypeScript utility
  - [x] No hardcoded URL strings anywhere in the file

- [x] **Task 2: Verify TypeScript types compile cleanly** (AC: 1, 4)
  - [x] Run `pnpm build` — 0 TypeScript errors
  - [x] Verify the return type of `QRCode.toDataURL` is correctly inferred as `Promise<string>` by `@types/qrcode` v1.5.6
  - [x] Verify no implicit `any` types in the file

- [x] **Task 3: Manual smoke test** (AC: 1, 3)
  - [x] Add a temporary test call in a scratch script or confirm via `pnpm dev` console: `import { generateQRDataURL } from '@/lib/qr'; generateQRDataURL('https://example.com').then(console.log)`
  - [x] Confirm the output starts with `data:image/png;base64,`
  - [x] Confirm passing an empty string or invalid input produces a rejected Promise (error propagates)
  - [x] Remove any temporary test code before committing

## Dev Notes

### What This Story Creates vs What Already Exists

| Status                 | Asset                  | Location          | Notes                                                                                                          |
| ---------------------- | ---------------------- | ----------------- | -------------------------------------------------------------------------------------------------------------- |
| **NEW — CREATE**       | `src/lib/qr.ts`        | `src/lib/qr.ts`   | Pure async utility — no UI, no framework deps. Only file changed in this story.                                |
| **EXISTS — READ ONLY** | `src/lib/data.ts`      | `src/lib/data.ts` | Shows the `src/lib/` utility pattern; `getSiteConfig().siteUrl` is how callers obtain the canonical URL        |
| **EXISTS — READ ONLY** | `data/site.json`       | `data/site.json`  | `siteUrl` is NOT in here — it comes from `process.env.NEXT_PUBLIC_SITE_URL` (ARC2). Do not read URL from JSON. |
| **NO CHANGE**          | All other `src/` files | —                 | This story creates one file only; nothing else is modified                                                     |

### Canonical URL Architecture (Critical)

Per `architecture.md` (Data Architecture section) and ARC2:

> `NEXT_PUBLIC_SITE_URL` environment variable is the **single source of truth** for the canonical portfolio URL — consumed by QR generation, OG tags, sitemap, and canonical URLs. NOT stored in `site.json`.

The utility function accepts `url: string` as a parameter. The **caller** (story 7.2/7.3 — `CVDocument`, `CVDownloadButton`) is responsible for passing `getSiteConfig().siteUrl` which already reads from `process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'`.

This design is intentional:

- `qr.ts` remains a pure, testable utility with no environment variable coupling
- The URL source is configurable at the call site — supports testing with mock URLs
- Story 7.2 will call: `generateQRDataURL(getSiteConfig().siteUrl)`

### qrcode Library API Reference (v1.5.4)

**Installed versions:** `qrcode@1.5.4`, `@types/qrcode@1.5.6`

**Correct import pattern (TypeScript with `@types/qrcode`):**

```typescript
import QRCode from "qrcode";
```

**Promise-based API (no callback = returns Promise):**

```typescript
// Returns Promise<string> — data URL like "data:image/png;base64,iVBOR..."
const dataUrl = await QRCode.toDataURL("https://example.com");
```

**Recommended options for PDF embedding:**

```typescript
await QRCode.toDataURL(url, {
  errorCorrectionLevel: "M", // Medium — good balance for clean print
  width: 200, // 200px; @react-pdf/renderer embeds at this resolution
  margin: 2, // 2-module quiet zone (default 4 is excessive for PDF)
});
```

**Why `errorCorrectionLevel: 'M'`:**

- Default is `M` (15% correction) — appropriate for printed QR codes on clean paper
- `H` (30%) would be used for codes likely to be physically damaged; overkill for PDF
- `L` (7%) is too low for print where minor scanner angle variation occurs

**Why `width: 200`:**

- `@react-pdf/renderer`'s `<Image>` will render it at ~80-120px in the PDF layout
- 200px source gives 2× resolution headroom for high-DPI printing without file bloat
- Story 7.2 will size the `<Image>` element (min 80px × 80px per AC)

**Error propagation:** `QRCode.toDataURL` rejects the Promise on invalid input. The utility should **not** catch and swallow this — let the rejection propagate to the PDF generation layer (story 7.3's try/catch around `pdf()`). This fulfils AC 3: "the error is caught and propagated to the PDF generation layer with a descriptive message."

**Works in both server and client contexts:** `qrcode` works in Node.js (server-side data generation) and in browser (Webpack/Turbopack bundles it). `@react-pdf/renderer` runs client-side only, but `generateQRDataURL` itself can be called from either context.

### Exact Implementation

```typescript
// src/lib/qr.ts
import QRCode from "qrcode";

export async function generateQRDataURL(url: string): Promise<string> {
  return QRCode.toDataURL(url, {
    errorCorrectionLevel: "M",
    width: 200,
    margin: 2,
  });
}
```

That is the **complete file**. No additional exports, no helper types, no fallback logic. Keep it minimal — this is a thin adapter over `qrcode`'s Promise API.

### Architecture Compliance Guardrails

From `architecture.md` — Implementation Patterns:

| Rule                      | Applies To         | Enforcement                                                                                     |
| ------------------------- | ------------------ | ----------------------------------------------------------------------------------------------- |
| Utilities: `camelCase.ts` | File name          | ✅ `qr.ts` — correct                                                                            |
| Named exports only        | Functions          | ✅ `export async function generateQRDataURL` — no default export                                |
| `src/lib/` for utilities  | File location      | ✅ `src/lib/qr.ts`                                                                              |
| No barrel files           | `src/lib/index.ts` | ✅ Do NOT create `src/lib/index.ts` — import directly from `@/lib/qr`                           |
| No UI imports in lib      | Import constraints | ✅ `qr.ts` imports only `qrcode` — no React, no Next.js, no Tailwind                            |
| `@/*` alias for imports   | Import paths       | ✅ Consumers import as `@/lib/qr`; `qr.ts` itself imports from `node_modules` (no alias needed) |

### Previous Story Learnings (from 6-4)

Story 6-4 established these patterns that carry forward:

1. **Utility helpers live in the file they're used OR in `src/lib/`** — date formatting went inside `ProjectCard.tsx` as it's single-use. `generateQRDataURL` goes in `src/lib/qr.ts` because it's shared across stories 7.1, 7.2, and 7.3.
2. **No `"use client"` unless DOM access required** — `qr.ts` is a pure async function, no client directive needed.
3. **`pnpm build` must pass with 0 TypeScript errors** before marking done — always verify.
4. **Commit message convention:** `feat: 7-1-qr-code-generation-utility`

### Git Intelligence (Recent Patterns)

Recent commits show clean story-by-story implementation:

- `07036e0 feat: 6-4-hover-micro-interactions-project-card-hover-reveal`
- `68bdfa8 feat: 6-3-framer-motion-page-transitions`
- `4c11e16 feat: 6-2-gsap-scroll-triggered-entrance-animations`

All follow pattern: single focused commit per story, `feat:` prefix, story key as suffix.

### Testing Standards

Per architecture — no testing framework is specified for this project (no Jest/Vitest setup). Verification is done via:

1. **TypeScript type checking** — `pnpm build` must succeed with 0 errors
2. **Manual smoke test** — described in Task 3 above
3. **Build-time validation** — TypeScript enforces the `Promise<string>` return type

Story 7.2 will be the integration test when it embeds the QR data URL into a PDF document.

### References

- Epic 7, Story 7.1 — [\_bmad-output/planning-artifacts/epics.md](_bmad-output/planning-artifacts/epics.md) (line 813+)
- Architecture, PDF Generation section — [\_bmad-output/planning-artifacts/architecture.md](_bmad-output/planning-artifacts/architecture.md)
- Architecture, Data Architecture section — `NEXT_PUBLIC_SITE_URL` canonical URL design
- Architecture, Naming Patterns — `camelCase.ts` for utilities
- ARC2: `NEXT_PUBLIC_SITE_URL` as single source of truth
- ARC4: `qrcode` (generates data URL) + `@react-pdf/renderer` (PDF library)
- `src/lib/data.ts` — existing utility pattern in `src/lib/`
- qrcode v1.5.4 API: `QRCode.toDataURL(text, options) → Promise<string>`
- `@types/qrcode` v1.5.6 — TypeScript definitions for `qrcode`

## Dev Agent Record

### Agent Model Used

Claude Sonnet 4.6 (GitHub Copilot)

### Debug Log References

### Completion Notes List

- Created `src/lib/qr.ts` as a pure async TypeScript utility wrapping `qrcode@1.5.4`'s Promise API
- `generateQRDataURL(url)` returns `data:image/png;base64,...` suitable for `@react-pdf/renderer <Image>` src
- Error propagation confirmed: empty string input rejects with `"No input text"`; no try/catch inside utility
- `pnpm build` passes with 0 TypeScript errors; `@types/qrcode@1.5.6` correctly infers `Promise<string>` return type
- No UI imports, no hardcoded URLs, no barrel file created

### File List

- `src/lib/qr.ts` (new)

## Change Log

- 2026-05-24: Implemented story 7-1 — created `src/lib/qr.ts` pure async QR code utility; all ACs satisfied; `pnpm build` 0 errors
