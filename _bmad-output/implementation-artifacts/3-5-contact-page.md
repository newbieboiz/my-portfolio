# Story 3.5: Contact Page

Status: done

## Story

As a **visitor ready to reach out**,
I want a frictionless way to contact BaoBao from any page,
so that the conversion action is never more than 2 clicks away.

## Acceptance Criteria

1. **Given** a visitor navigates to `/contact`
   **When** the page renders
   **Then** it shows the `// contact` section label, BaoBao's email as a visible mailto link, and social profile links from `data/site.json`; the page has a unique title and meta description (FR24)

2. **Given** a visitor clicks the email link
   **When** the click fires
   **Then** the visitor's default email client opens with `to:` pre-filled with BaoBao's email; no tracking parameters are appended (NFR16)

3. **Given** the contact page renders on mobile
   **When** a visitor arrives via QR scan and taps contact
   **Then** the email link is touch-target sized (min 44px height); social links are clearly visible and tappable; no form fields are required

4. **Given** contact information is sourced from data
   **When** `getSiteConfig()` is called
   **Then** email and social links are read from `data/site.json` — updating the data file updates the contact page with no component changes (NFR19)

5. **Given** social/contact links render
   **When** accessibility is checked
   **Then** all icon-only links have ARIA labels; external links open in new tabs with `rel="noopener noreferrer"` (FR23)

## Tasks / Subtasks

- [x] **Task 1: Replace the contact page stub** (AC: 1–5)
  - [x] Open `src/app/contact/page.tsx` — replace the entire stub with the implementation from Dev Notes
  - [x] Add `export const metadata: Metadata = { ... }` at the top for FR24 (unique title + meta description)
  - [x] Import `Metadata` from `"next"` (same pattern as `src/app/about/page.tsx`)
  - [x] Import `getSiteConfig` from `"@/lib/data"` — already exists, no changes to `data.ts` needed
  - [x] Import `SectionLayout` from `"@/components/SectionLayout"`
  - [x] `Contact()` is a Server Component — do **NOT** add `"use client"`; no browser APIs or state needed
  - [x] See Dev Notes for the exact, copy-pasteable implementation

- [x] **Task 2: Verify build and visual output** (AC: 1–5)
  - [x] Run `pnpm build` — expect 0 TypeScript errors
  - [x] Run `pnpm dev` and navigate to `http://localhost:3000/contact`
  - [x] Verify `// contact` section label renders in `--text-tertiary` colour
  - [x] Verify email link is visible and clicking opens the mail client with `hello@baobao.dev` pre-filled
  - [x] Verify GitHub and LinkedIn links are visible and open in new tabs
  - [x] Resize to 375px — all items tap-target sized (≥ 44px height), no horizontal overflow
  - [x] Tab through the page — email link and social links each receive the `focus-visible` accent ring
  - [x] Check browser DevTools → `<head>` → confirm `<title>Contact | BaoBao</title>` and `<meta name="description" ...>` exist

## Dev Notes

### Critical Context: What Exists vs What To Build

This story is a **single-file replacement** of the existing stub. No schema changes, no new components, no new data files.

| Existing asset            | Location                           | Used by this story as-is                                                                            |
| ------------------------- | ---------------------------------- | --------------------------------------------------------------------------------------------------- |
| `SectionLayout` component | `src/components/SectionLayout.tsx` | Used as-is; `label="contact"` renders `// contact` heading                                          |
| `getSiteConfig()`         | `src/lib/data.ts`                  | Returns full `SiteConfig`; has `owner.email`, `social.github`, `social.linkedin`, `social.twitter?` |
| `SiteConfig` interface    | `src/types/site.ts`                | `owner.email: string`; `social: { github, linkedin, twitter? }`                                     |
| `data/site.json`          | `data/site.json`                   | `owner.email = "hello@baobao.dev"`, `social.github`, `social.linkedin` are all populated            |
| Design tokens             | `src/app/globals.css`              | All needed tokens already defined — see Design Token Reference below                                |
| `Metadata` type           | Next.js built-in                   | Same import as `src/app/about/page.tsx` — `import type { Metadata } from "next"`                    |

**Current stub** (full file, to be replaced):

```tsx
import { SectionLayout } from "@/components/SectionLayout";

export default function Contact() {
  return (
    <SectionLayout id="contact" label="contact">
      <p className="text-text-secondary">Coming soon.</p>
    </SectionLayout>
  );
}
```

**Do NOT create** a separate client component, form, or any other file. This is a single-file, zero-dependency replacement.

### Design Token Reference

These tokens are already defined in `src/app/globals.css` and mapped to Tailwind utilities in the `@theme` block:

| Design token       | Tailwind utility class       | Usage in this story                        |
| ------------------ | ---------------------------- | ------------------------------------------ |
| `--accent`         | `text-accent`                | Email link text colour                     |
| `--accent-hover`   | `hover:text-accent-hover`    | Email link hover state                     |
| `--text-secondary` | `text-text-secondary`        | Body/descriptor text                       |
| `--text-tertiary`  | `text-text-tertiary`         | Secondary link text (social links)         |
| `--text-primary`   | `hover:text-text-primary`    | Social link hover text                     |
| `--border-subtle`  | `border-border-subtle`       | Visual separator `<hr>`                    |
| `--duration-micro` | `duration-micro`             | 150ms transition on hover                  |
| `--space-2`        | `gap-space-2` / `py-space-2` | Tight gaps                                 |
| `--space-4`        | `gap-space-4` / `py-space-4` | Standard gap between items                 |
| `--space-6`        | `gap-space-6`                | Gap between social links (matches Footer)  |
| `--space-8`        | `py-space-8`                 | Section padding (handled by SectionLayout) |

Focus ring pattern (matches established pattern in `Footer.tsx` and `ProjectCard.tsx`):

```
focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg-primary
```

### Accessibility Requirements

- **Email `mailto:` link**: use `aria-label="Email BaoBao at hello@baobao.dev"` (or similar) so screen readers announce the full action, not just the address
- **Social links**: each must have `aria-label="GitHub profile (opens in new tab)"` and `aria-label="LinkedIn profile (opens in new tab)"` — same pattern as `Footer.tsx`
- **All external links**: `target="_blank" rel="noopener noreferrer"` (NFR18, FR23)
- **Touch targets**: email link and social links must have `min-h-[44px]` or `py-space-3` to meet the 44px minimum (AC 3)
- **Keyboard navigation**: all links are natively keyboard-focusable; the focus-visible ring is the only required enhancement

### Exact Implementation: `src/app/contact/page.tsx` — FULL REPLACEMENT

```tsx
import type { Metadata } from "next";
import { getSiteConfig } from "@/lib/data";
import { SectionLayout } from "@/components/SectionLayout";

export const metadata: Metadata = {
  title: "Contact | BaoBao",
  description:
    "Get in touch with BaoBao — full-stack engineer open to new opportunities.",
};

export default function Contact() {
  const siteConfig = getSiteConfig();
  const { email } = siteConfig.owner;
  const { github, linkedin, twitter } = siteConfig.social;

  return (
    <SectionLayout id="contact" label="contact" prose={true}>
      <div className="gap-space-8 flex flex-col">
        {/* Email */}
        <div className="gap-space-2 flex flex-col">
          <p className="text-small text-text-secondary font-mono">
            // drop me a line
          </p>
          <a
            href={`mailto:${email}`}
            aria-label={`Email BaoBao at ${email}`}
            className="text-accent hover:text-accent-hover duration-micro focus-visible:ring-accent focus-visible:ring-offset-bg-primary text-body inline-flex min-h-[44px] items-center rounded font-mono transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
          >
            {email}
          </a>
        </div>

        {/* Visual separator */}
        <hr className="border-border-subtle" />

        {/* Social links */}
        <div className="gap-space-2 flex flex-col">
          <p className="text-small text-text-secondary font-mono">
            // find me online
          </p>
          <div className="gap-space-4 flex flex-wrap">
            <a
              href={github}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub profile (opens in new tab)"
              className="text-text-secondary hover:text-text-primary duration-micro focus-visible:ring-accent focus-visible:ring-offset-bg-primary text-body inline-flex min-h-[44px] items-center rounded font-mono transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
            >
              GitHub
            </a>
            <a
              href={linkedin}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn profile (opens in new tab)"
              className="text-text-secondary hover:text-text-primary duration-micro focus-visible:ring-accent focus-visible:ring-offset-bg-primary text-body inline-flex min-h-[44px] items-center rounded font-mono transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
            >
              LinkedIn
            </a>
            {twitter && (
              <a
                href={twitter}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter profile (opens in new tab)"
                className="text-text-secondary hover:text-text-primary duration-micro focus-visible:ring-accent focus-visible:ring-offset-bg-primary text-body inline-flex min-h-[44px] items-center rounded font-mono transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
              >
                Twitter
              </a>
            )}
          </div>
        </div>
      </div>
    </SectionLayout>
  );
}
```

### Why These Specific Choices

**`prose={true}` on `SectionLayout`:**
The contact section content is narrow — email address and two social links. `prose={true}` constrains children to `max-w-prose` (680px), matching the bio section on the About page. This prevents the content from stretching awkwardly to `max-w-content` (1120px) on wide viewports.

**Single `SectionLayout` (not multiple):**
The About page uses three `SectionLayout` sections because three distinct conceptual groupings warrant it. Contact is a single conceptual action — "reach me here" — so one section is correct. The visual separator (`<hr>`) divides the email from socials without adding the overhead of a second SectionLayout wrapper.

**`// drop me a line` and `// find me online` sub-labels:**
These are NOT `SectionLayout` labels (which would render as `<h2>` elements). They are decorative `<p>` tags styled in the same `text-small font-mono text-text-secondary` style as section descriptions — maintaining the coding aesthetic sub-labelling pattern without adding heading hierarchy noise. The page already has `// contact` as the `<h2>` from `SectionLayout`.

**`inline-flex min-h-[44px] items-center`:**
This is the correct pattern to achieve a 44px minimum touch target on an inline link without adding padding that would shift the text baseline. Matches WCAG 2.5.8 Touch Target guidance.

**`"use client"` NOT added:**
This is a Server Component. All data is synchronous JSON (`getSiteConfig()` reads from `data/site.json` — no async). No browser APIs, no state, no event handlers needed in the component itself (the `<a>` tag handles the mailto and external link behaviours natively).

**Destructuring `email`, `github`, `linkedin`, `twitter` from `siteConfig`:**
Matches the DRY principle — avoids `siteConfig.social.github` repeated 3 times. Consistent with how `Footer.tsx` receives the full `config: SiteConfig` and accesses `config.social.*` inline.

**`twitter` conditional rendering:**
`social.twitter` is typed `twitter?: string` in `SiteConfig` — it may be undefined. The conditional render matches the exact pattern in `Footer.tsx` (`{config.social.twitter && (<a ...>)}`).

### Regression Safety: What Must NOT Break

| Component/Behaviour        | Status    | Risk                                                                      |
| -------------------------- | --------- | ------------------------------------------------------------------------- |
| `src/app/contact/page.tsx` | REPLACE   | Only file changed; stub had no meaningful content to preserve             |
| Root layout (`layout.tsx`) | NO CHANGE | Contact page renders inside the existing layout; no layout changes needed |
| `getSiteConfig()`          | NO CHANGE | No data.ts changes; function already handles `twitter?` optional field    |
| `SiteConfig` interface     | NO CHANGE | All needed fields already typed correctly                                 |
| `data/site.json`           | NO CHANGE | `owner.email`, `social.github`, `social.linkedin` are already present     |
| `SectionLayout`            | NO CHANGE | Used as-is with standard `id`, `label`, `prose` props                     |
| NavBar `/contact` link     | NO CHANGE | Already present in nav from Story 2.1                                     |

### Project Structure Notes

- **Output file**: `src/app/contact/page.tsx` — replaces stub in-place, no new files
- **Import alias**: `@/` always used (ARC8); no deep relative paths
- **Named exports**: `metadata` is a named export constant; `Contact` is the default export (Next.js App Router page convention — default export is required for pages)
- **Component convention**: No `"use client"` directive; Server Component by default (ARC8)
- **No barrel files**: `SectionLayout` and `getSiteConfig` imported directly from their module paths (ARC8)

### References

- Story requirements: `_bmad-output/planning-artifacts/epics.md` — Epic 3, Story 3.5
- FR16 (contact mechanism), FR23 (ARIA/alt text), FR24 (page metadata), NFR16 (no tracking), NFR19 (data-driven content)
- `SiteConfig` interface: `src/types/site.ts`
- `getSiteConfig()`: `src/lib/data.ts`
- `SectionLayout`: `src/components/SectionLayout.tsx`
- Focus ring pattern source: `src/components/Footer.tsx` (social links section)
- Touch target min-height pattern: `src/app/about/page.tsx` — CTAs use same inline-flex approach
- `prose={true}` pattern: `src/app/about/page.tsx` (bio section), `src/components/SectionLayout.tsx`
- Social link conditional rendering: `src/components/Footer.tsx` (twitter optional guard)
- ARC8 (component conventions): `_bmad-output/planning-artifacts/epics.md` — Additional Requirements

## Dev Agent Record

### Agent Model Used

Claude Sonnet 4.6 (GitHub Copilot)

### Debug Log References

### Completion Notes List

- Replaced stub in `src/app/contact/page.tsx` with full Server Component implementation.
- Added `export const metadata` with unique title and description (FR24).
- Email link uses `mailto:${email}` sourced from `getSiteConfig()` — no hardcoded values.
- GitHub and LinkedIn social links sourced from `siteConfig.social`; `twitter` conditionally rendered.
- All links: `aria-label`, `target="_blank" rel="noopener noreferrer"`, `min-h-11` (44px) touch targets.
- Focus-visible ring applied to all links (`focus-visible:ring-2 focus-visible:ring-accent`).
- `prose={true}` on SectionLayout constrains content to `max-w-prose` on wide viewports.
- Fixed Tailwind lint: `min-h-[44px]` → `min-h-11` (canonical form).
- `pnpm build` passed with 0 TypeScript errors; `/contact` statically rendered.
- Browser verification: title `Contact | BaoBao`, meta description, email height 44px, no overflow all confirmed.

### File List

- `src/app/contact/page.tsx` — replaced stub with full contact page implementation

## Change Log

- 2026-05-23: Story implemented — replaced contact page stub with full Server Component; all 5 ACs satisfied; `pnpm build` green.
