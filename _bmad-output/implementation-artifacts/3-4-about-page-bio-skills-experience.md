# Story 3.4: About Page (Bio, Skills & Experience)

Status: done

## Story

As a **visitor (recruiter or freelance client)**,
I want to read BaoBao's professional bio, skills, and work history on a single scannable page,
so that I can assess seniority, technical range, and career narrative in one visit.

## Acceptance Criteria

1. **Given** a visitor navigates to `/about`
   **When** the page renders
   **Then** it contains three `SectionLayout` sections: `// about` (bio), `// skills`, `// experience & education` — each with clear visual separation; the page has a unique title and meta description (FR24)

2. **Given** the bio section renders
   **When** a visitor reads it
   **Then** BaoBao's professional introduction is displayed in body text at 16px with 1.6 line height; text is left-aligned; content is sourced from `data/site.json`

3. **Given** the skills section renders
   **When** a visitor scans it
   **Then** skills are grouped by category from `data/skills.json` with category headings in h3 scale; individual skills render as `Badge` components; the section is scannable without reading every word

4. **Given** the experience section renders
   **When** a visitor reads it
   **Then** work experience entries from `data/experience.json` display in reverse-chronological order: company, role, date range, and description; education entries from `data/education.json` appear below; dates use `Intl.DateTimeFormat` (never manually formatted strings)

5. **Given** the owner updates `data/experience.json` or `data/skills.json` and redeploys
   **When** the About page loads
   **Then** it reflects the new content with zero component code changes (NFR19)

## Tasks / Subtasks

- [x] **Task 1: Add `bio` field to data schema** (AC: 1, 2)
  - [x] Open `src/types/site.ts` — add `bio: string` to the `owner` object inside `SiteConfig`
  - [x] Open `data/site.json` — add a `bio` string to the `owner` object (see Dev Notes for seed value)
  - [x] Do **NOT** modify `src/lib/data.ts` — `getSiteConfig()` already returns the full `owner` object; it will include `bio` automatically once the interface and JSON are updated

- [x] **Task 2: Implement the About page — full replacement** (AC: 1, 2, 3, 4, 5)
  - [x] Open `src/app/about/page.tsx` — replace the "Coming soon." stub entirely with the implementation from Dev Notes
  - [x] Add `export const metadata: Metadata = { ... }` at the top for FR24 (unique title + meta description)
  - [x] Import `Metadata` from `"next"` — this is the Next.js 16 App Router metadata API
  - [x] Import `getSiteConfig`, `getSkills`, `getExperience`, `getEducation` from `"@/lib/data"` — all four functions already exist, no changes to `data.ts` needed
  - [x] Import `SectionLayout` from `"@/components/SectionLayout"` and `Badge` from `"@/components/Badge"`
  - [x] `About()` is a Server Component — do **NOT** add `"use client"`; all data is static JSON, no browser APIs needed
  - [x] The page returns `<>...</>` fragment wrapping three `<SectionLayout>` elements (same pattern as `page.tsx` in Story 3.3)
  - [x] Add the `formatDate()` inline helper for `Intl.DateTimeFormat` — see Dev Notes for exact implementation
  - [x] Sort experience with `[...experience].sort(...)` before rendering — do NOT mutate the original array; use spread to clone first
  - [x] See Dev Notes for the exact, copy-pasteable implementation

- [x] **Task 3: Verify build and visual output** (AC: 1–5)
  - [x] Run `pnpm build` — expect 0 TypeScript errors, 0 CSS errors
  - [x] Run `pnpm dev` and navigate to `http://localhost:3000/about`
  - [x] Verify three distinct sections render with `// about`, `// skills`, `// experience & education` labels
  - [x] Bio text appears in body size with correct colour (`text-text-secondary`)
  - [x] Skills render grouped by category with h3 headings + Badge pills per skill
  - [x] Experience entries render in reverse-chronological order (Acme Corp first, Beta Studio second); dates formatted as "Mar 2022 — Present" style
  - [x] Education entry appears below work experience
  - [x] Resize to 375px — single-column layout, no horizontal overflow
  - [x] Tab through the page — no interactive elements here, but verify section headings are reachable for screen readers
  - [x] Check browser DevTools → `<head>` → confirm `<title>About | BaoBao</title>` and `<meta name="description" ...>` exist

## Dev Notes

### Critical Context: What Exists vs What To Build

This story has one schema change plus one page replacement. **Do NOT re-implement or change any of these:**

| Existing asset            | Location                                                          | Used by this story as-is                                                                                     |
| ------------------------- | ----------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| `Badge` component         | `src/components/Badge.tsx`                                        | Imported directly — no changes; use default `category="other"` for skill badges                              |
| `SectionLayout` component | `src/components/SectionLayout.tsx`                                | Used as-is; supports optional `prose={true}` which constrains children to `max-w-prose` (680px)              |
| `getSiteConfig()`         | `src/lib/data.ts`                                                 | Already returns full `SiteConfig`; adding `bio` to the interface auto-includes it                            |
| `getSkills()`             | `src/lib/data.ts`                                                 | Returns `SkillCategory[]` from `data/skills.json`                                                            |
| `getExperience()`         | `src/lib/data.ts`                                                 | Returns `Experience[]` from `data/experience.json`                                                           |
| `getEducation()`          | `src/lib/data.ts`                                                 | Returns `Education[]` from `data/education.json`                                                             |
| `Experience` interface    | `src/types/experience.ts`                                         | Has `company`, `title`, `startDate`, `endDate?`, `isCurrent`, `description`, `achievements[]`, `techStack[]` |
| `Education` interface     | `src/types/experience.ts`                                         | Has `institution`, `degree`, `field`, `startDate`, `endDate`, `description?`                                 |
| `SkillCategory` interface | `src/types/site.ts`                                               | Has `category: string` and `skills: Skill[]`; `Skill` has `name` and optional `level`                        |
| `Skill` interface         | `src/types/site.ts`                                               | Has `name: string` and `level?: "beginner" \| "intermediate" \| "advanced" \| "expert"`                      |
| Design tokens             | `src/app/globals.css`                                             | All needed tokens already defined — see Design Token Reference below                                         |
| Seed data                 | `data/experience.json`, `data/skills.json`, `data/education.json` | All populated — no data changes needed beyond adding `bio` to `site.json`                                    |

### Schema Change: Adding `bio` to `SiteConfig`

**`src/types/site.ts` — UPDATE** (one line change inside `owner`):

```ts
export interface SiteConfig {
  siteUrl: string;
  owner: {
    name: string;
    title: string;
    bio: string; // ← ADD THIS LINE
    tagline: string;
    email: string;
    isAvailable: boolean;
    availabilityText: string;
  };
  // ... rest unchanged
}
```

**`data/site.json` — UPDATE** (add `bio` to `owner` object):

```json
{
  "owner": {
    "name": "BaoBao",
    "title": "Full-Stack Engineer",
    "bio": "Full-stack engineer with 6+ years of experience building modern web applications. I specialise in React and TypeScript, with a strong focus on performance, developer experience, and UI craft. I care about writing code that reads clearly, runs fast, and holds up over time.",
    "tagline": "I build interfaces that feel inevitable.",
    "email": "hello@baobao.dev",
    "isAvailable": true,
    "availabilityText": "Open to new opportunities"
  }
}
```

> **No change to `src/lib/data.ts`.** `getSiteConfig()` spreads `siteData` via `...(siteData as Omit<SiteConfig, "siteUrl">)` which will include `bio` automatically once it exists in the JSON.

### Date Formatting Helper

Dates in the JSON use `"YYYY-MM"` month-precision format (e.g. `"2022-03"`). `new Date("2022-03")` is valid ISO 8601 but is parsed as UTC midnight on the first of that month. To avoid timezone offset shifting the displayed month (e.g. showing "Feb" instead of "Mar" for UTC+0), always:

1. Normalise to a full date: append `"-01"` if only 7 chars
2. Pass `timeZone: "UTC"` to `Intl.DateTimeFormat`

```ts
function formatDate(dateStr: string): string {
  const normalized = dateStr.length === 7 ? `${dateStr}-01` : dateStr;
  return new Intl.DateTimeFormat("en-US", {
    timeZone: "UTC",
    month: "short",
    year: "numeric",
  }).format(new Date(normalized));
}
// formatDate("2022-03")  → "Mar 2022"
// formatDate("2019-07")  → "Jul 2019"
// formatDate("2022-02")  → "Feb 2022"
```

This helper is defined at module scope (outside the component) in `page.tsx`. It is NOT extracted to `src/lib/` — it is a single-use page-level formatting detail, not a shared utility.

### Exact Implementation: `src/app/about/page.tsx` — FULL REPLACEMENT

```tsx
import type { Metadata } from "next";
import {
  getSiteConfig,
  getSkills,
  getExperience,
  getEducation,
} from "@/lib/data";
import { SectionLayout } from "@/components/SectionLayout";
import { Badge } from "@/components/Badge";

export const metadata: Metadata = {
  title: "About | BaoBao",
  description:
    "BaoBao's background, technical skills, and work experience as a full-stack engineer.",
};

function formatDate(dateStr: string): string {
  const normalized = dateStr.length === 7 ? `${dateStr}-01` : dateStr;
  return new Intl.DateTimeFormat("en-US", {
    timeZone: "UTC",
    month: "short",
    year: "numeric",
  }).format(new Date(normalized));
}

export default function About() {
  const siteConfig = getSiteConfig();
  const skills = getSkills();
  const experience = getExperience();
  const education = getEducation();

  // Reverse-chronological: most recent startDate first
  const sortedExperience = [...experience].sort(
    (a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime(),
  );

  return (
    <>
      {/* ── Section 1: Bio ── */}
      <SectionLayout id="about" label="about" prose={true}>
        <p className="text-body leading-body text-text-secondary">
          {siteConfig.owner.bio}
        </p>
      </SectionLayout>

      {/* ── Section 2: Skills ── */}
      <SectionLayout id="skills" label="skills">
        <div className="gap-space-12 flex flex-col">
          {skills.map((skillCategory) => (
            <div key={skillCategory.category}>
              <h3 className="mb-space-4 text-h3 leading-h3 tracking-heading text-text-primary font-semibold">
                {skillCategory.category}
              </h3>
              <div className="gap-space-2 flex flex-wrap">
                {skillCategory.skills.map((skill) => (
                  <Badge key={skill.name} label={skill.name} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </SectionLayout>

      {/* ── Section 3: Experience & Education ── */}
      <SectionLayout id="experience" label="experience & education">
        <div className="gap-space-12 flex flex-col">
          {/* Work Experience */}
          {sortedExperience.map((exp) => (
            <div
              key={`${exp.company}-${exp.startDate}`}
              className="gap-space-4 flex flex-col"
            >
              <div className="gap-space-4 flex flex-wrap items-start justify-between">
                <div>
                  <h3 className="text-h3 leading-h3 tracking-heading text-text-primary font-semibold">
                    {exp.title}
                  </h3>
                  <p className="text-small leading-small text-accent font-mono">
                    {exp.company}
                  </p>
                </div>
                <p className="text-small leading-small text-text-tertiary font-mono">
                  {formatDate(exp.startDate)}
                  {" — "}
                  {exp.isCurrent ? "Present" : formatDate(exp.endDate!)}
                </p>
              </div>
              <p className="text-body leading-body text-text-secondary">
                {exp.description}
              </p>
              {exp.achievements.length > 0 && (
                <ul className="gap-space-2 flex flex-col">
                  {exp.achievements.map((achievement, i) => (
                    <li
                      key={i}
                      className="text-body leading-body text-text-secondary gap-space-2 flex"
                    >
                      <span className="text-accent shrink-0" aria-hidden="true">
                        ▸
                      </span>
                      <span>{achievement}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}

          {/* Visual separator between experience and education */}
          <hr className="border-border-subtle" />

          {/* Education */}
          {education.map((edu) => (
            <div
              key={`${edu.institution}-${edu.startDate}`}
              className="gap-space-4 flex flex-col"
            >
              <div className="gap-space-4 flex flex-wrap items-start justify-between">
                <div>
                  <h3 className="text-h3 leading-h3 tracking-heading text-text-primary font-semibold">
                    {edu.degree} in {edu.field}
                  </h3>
                  <p className="text-small leading-small text-accent font-mono">
                    {edu.institution}
                  </p>
                </div>
                <p className="text-small leading-small text-text-tertiary font-mono">
                  {formatDate(edu.startDate)} — {formatDate(edu.endDate)}
                </p>
              </div>
              {edu.description && (
                <p className="text-body leading-body text-text-secondary">
                  {edu.description}
                </p>
              )}
            </div>
          ))}
        </div>
      </SectionLayout>
    </>
  );
}
```

### Why These Specific Choices

**Three `SectionLayout` sections in a `<>` fragment:**
The About page renders three sibling sections. React requires a single root — use `<>...</>` fragment (same pattern as `page.tsx` after Story 3.3 added the `// selected work` section). A `<div>` wrapper would add an unnecessary DOM element. This is consistent with the project's no-unnecessary-wrappers rule.

**`prose={true}` only for the bio section:**
`SectionLayout` with `prose={true}` wraps children in `<div className="max-w-prose">`, limiting width to 680px. This is correct for the bio paragraph (line lengths beyond ~75 chars hurt readability). The skills grid and experience list benefit from full content-width — they should NOT use `prose={true}`.

**No `"use client"` directive:**
All four data calls (`getSiteConfig`, `getSkills`, `getExperience`, `getEducation`) are synchronous JSON imports — no `async`/`await`. No browser APIs, no event handlers, no React state. This page is 100% Server Component. Adding `"use client"` would be an anti-pattern per architecture rules.

**`[...experience].sort(...)` — spread before sort:**
`Array.prototype.sort()` mutates in place. The `experienceData` import is a module-level constant. Mutating it would cause unexpected behaviour on subsequent renders (in development hot-reloads). Always spread to clone before sorting: `[...experience].sort(...)`.

**`exp.endDate!` non-null assertion is safe here:**
The `isCurrent ? "Present" : formatDate(exp.endDate!)` pattern uses `!` because TypeScript correctly infers `endDate` as `string | undefined`. When `isCurrent === false`, the data contract guarantees `endDate` is present (validated at build time via TypeScript strict mode). The assertion is safe. Do NOT use optional chaining `?.` here — that would silently render an empty string instead of throwing a type error that catches a data bug.

**Achievement bullet `▸` as flex child:**
Using a flex row with `<span aria-hidden="true">▸</span>` and `<span>{text}</span>` is cleaner than CSS `::before` pseudo-elements with `content-['▸']` Tailwind arbitrary values. The `aria-hidden="true"` ensures screen readers skip the decorative bullet glyph and read only the achievement text.

**`key={i}` on achievement `<li>` is acceptable:**
Achievements are a static ordered array of strings with no stable unique identifier. Using array index as the key is acceptable here because: (a) the list is static (never reordered at runtime), (b) there's no client-side state on these items. This is one of the few cases where `key={index}` is fine per React documentation.

**`border-border-subtle` `<hr>` between experience and education:**
A subtle horizontal rule provides clear visual separation between the two subsections (Work vs Education) inside the `// experience & education` SectionLayout. Without it, the two groups blend together. The `<hr>` is semantic HTML (thematic break) and appropriate here. Style: `border-border-subtle` matches the project's established border colour for dividers.

**`flex-wrap` on the date row header:**
The header row (`title + company` / `date range`) uses `flex-wrap` to handle narrow viewports gracefully. On mobile (375px), the date range wraps below the title/company block rather than overflowing. Without `flex-wrap`, the date could push off-screen on very narrow viewports.

**`generateMetadata` as `export const metadata: Metadata` (static, not function):**
Story 3.4's About page has no dynamic data that affects metadata — the title and description are fixed strings. Use `export const metadata: Metadata = { ... }` (static export), NOT `export async function generateMetadata()`. The static export is simpler, produces the same result for SSG, and does not require an async function. The `generateMetadata` async function is reserved for pages whose metadata depends on route params (e.g. project detail pages in Epic 4).

**`id="experience"` on the SectionLayout (not `"experience-and-education"`):**
The `label` prop becomes the visible `// experience & education` text in the section heading. The `id` is used for anchor links and `aria-labelledby` — keep it short and URL-safe: `id="experience"`. Using `id="experience-&-education"` would be technically valid HTML but unconventional. The `&` in the label is fine in rendered text; avoid it in the `id`.

### Design Token Reference

| Tailwind class                               | CSS token            | Resolved value    |
| -------------------------------------------- | -------------------- | ----------------- |
| `text-body`                                  | `--text-body`        | `1rem / 16px`     |
| `leading-body`                               | `--leading-body`     | `1.6`             |
| `text-small`                                 | `--text-small`       | `0.875rem / 14px` |
| `leading-small`                              | `--leading-small`    | `1.5`             |
| `text-h3`                                    | `--text-h3`          | `1.5rem / 24px`   |
| `leading-h3`                                 | `--leading-h3`       | `1.3`             |
| `tracking-heading`                           | `--tracking-heading` | `-0.02em`         |
| `text-text-primary`                          | `--text-primary`     | `#E8E8ED`         |
| `text-text-secondary`                        | `--text-secondary`   | `#A0A0B0`         |
| `text-text-tertiary`                         | `--text-tertiary`    | `#6B6B80`         |
| `text-accent`                                | `--accent`           | `#00DC82`         |
| `border-border-subtle`                       | `--border-subtle`    | `#2A2A3A`         |
| `gap-space-2`                                | `--space-2`          | `8px`             |
| `gap-space-4`                                | `--space-4`          | `16px`            |
| `gap-space-12`                               | `--space-12`         | `48px`            |
| `mb-space-4`                                 | `--space-4`          | `16px`            |
| `max-w-prose` (via SectionLayout prose=true) | `--width-prose`      | `680px`           |

### Files Being Modified

| File                     | Action | What Changes                                                                           |
| ------------------------ | ------ | -------------------------------------------------------------------------------------- |
| `src/types/site.ts`      | UPDATE | Add `bio: string` to `SiteConfig.owner` interface                                      |
| `data/site.json`         | UPDATE | Add `bio` string to `owner` object                                                     |
| `src/app/about/page.tsx` | UPDATE | Replace "Coming soon." stub with full three-section implementation + `metadata` export |

### Files NOT Modified

| File                               | Why unchanged                                                                            |
| ---------------------------------- | ---------------------------------------------------------------------------------------- |
| `src/lib/data.ts`                  | All four functions (`getSiteConfig`, `getSkills`, `getExperience`, `getEducation`) exist |
| `src/components/Badge.tsx`         | Used as-is — skill names use default `category="other"` which applies `bg-accent-muted`  |
| `src/components/SectionLayout.tsx` | Used as-is — `prose`, `id`, and `label` props already support everything needed          |
| `src/types/experience.ts`          | `Experience` and `Education` interfaces already have all required fields                 |
| `data/skills.json`                 | 4 categories × 4 skills each — sufficient seed data                                      |
| `data/experience.json`             | 2 work entries with `achievements`, `techStack` — all needed fields present              |
| `data/education.json`              | 1 education entry — sufficient seed data                                                 |
| `src/app/layout.tsx`               | Root layout unchanged — NavBar, Footer already handle page framing                       |
| `src/app/page.tsx`                 | Home page unchanged                                                                      |

### Previous Story Learnings (3.3 ProjectCard)

From the Story 3.3 implementation:

- **Fragment wrapper for multiple sections:** `page.tsx` now uses `<>...</>` to wrap two `SectionLayout` elements. About page needs the same pattern for three sections.
- **`"use client"` only where DOM/events needed:** All data calls are synchronous JSON imports. No `"use client"` on this page.
- **`font-mono` inheritance:** All text inherits Geist Mono from the `html` element in `globals.css`. Do NOT add explicit `font-mono` on `<p>` and `<h3>` elements — it is already inherited.
- **`prefers-reduced-motion` handled globally:** `globals.css` sets all `--duration-*: 0ms` under `prefers-reduced-motion: reduce`. No `motion-reduce:` Tailwind utilities needed.
- **Named exports:** `export function About()` ← WRONG. For Next.js pages, the convention REQUIRES `export default function About()`. Named exports are for components in `src/components/`. Pages and layouts use default exports per Next.js App Router convention.
- **`focus-visible:` not `focus:`** — no interactive elements on this page but keep the pattern in mind if any are added.

### Git Intelligence Summary

All previous stories committed as `feat: {story-key}`. The commit for this story should be:

```
feat: 3-4-about-page-bio-skills-experience
```

## Dev Agent Record

### Agent Model Used

Claude Sonnet 4.6 (GitHub Copilot)

### Debug Log References

### Completion Notes List

- Added `bio: string` to `SiteConfig.owner` interface in `src/types/site.ts` and populated seed value in `data/site.json`; `getSiteConfig()` in `data.ts` required no changes — it spreads the full JSON.
- Replaced the "Coming soon." stub in `src/app/about/page.tsx` with a full three-section Server Component (`// about`, `// skills`, `// experience & education`) using `<>` fragment wrapper.
- Implemented `formatDate()` module-scope helper using `Intl.DateTimeFormat` with `timeZone: "UTC"` to prevent month-offset bugs on `"YYYY-MM"` date strings.
- Experience sorted reverse-chronologically with `[...experience].sort(...)` (spread to avoid mutating module-level constant).
- `export const metadata: Metadata` provides static title `"About | BaoBao"` and meta description (FR24).
- Build: 0 TypeScript errors, 0 CSS errors (`pnpm build` clean).
- Visual verification: all three sections render correctly; page title confirmed as "About | BaoBao"; dates display as "Mar 2022 — Present" and "Jul 2019 — Feb 2022"; education below experience with `<hr>` separator.

### File List

- src/types/site.ts
- data/site.json
- src/app/about/page.tsx

## Change Log

| Date       | Change                                                                                                                                                                                                           |
| ---------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 2026-05-23 | Implemented About page — added `bio` to SiteConfig schema; full three-section page with bio, skills (Badge), experience & education (reverse-chronological, Intl.DateTimeFormat dates); static metadata for FR24 |
