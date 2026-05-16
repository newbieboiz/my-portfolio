# Story 1.3: Content Data Schema, TypeScript Interfaces & Seed Data

Status: done

## Story

As the **owner (BaoBao)**,
I want all content types defined as TypeScript interfaces and seeded with realistic placeholder data,
so that every subsequent story can build UI against real, typed data without fictional assumptions.

## Acceptance Criteria

1. **Given** the TypeScript interfaces are created in `src/types/`
   **When** a data file is loaded via `src/lib/data.ts`
   **Then** `Project`, `ProjectMeta`, `Experience`, `Education`, `Skill`, `SkillCategory`, `SiteConfig`, and `NavigationItem` interfaces exist; the TypeScript compiler enforces schema compliance at build time; `any` type usage causes a build error via `strict: true` in `tsconfig.json`

2. **Given** the JSON data files exist in `data/`
   **When** `src/lib/data.ts` loads them
   **Then** `data/site.json` (name, social links, email, availability status), `data/projects.json` (min 2 seed projects with all required fields), `data/experience.json` (min 1 entry), `data/skills.json` (min 3 categories), `data/education.json` (min 1 entry) all parse without TypeScript errors

3. **Given** the canonical URL is needed by multiple consumers (QR generation, OG tags, sitemap)
   **When** `NEXT_PUBLIC_SITE_URL` is set in the environment
   **Then** `src/lib/data.ts` uses `process.env.NEXT_PUBLIC_SITE_URL` as the canonical URL source (not from `site.json`); `data/site.json` stores owner name, social links, availability, and other metadata; no URL string is hardcoded anywhere in the codebase

4. **Given** the data schema is complete
   **When** a developer opens any JSON file in `data/`
   **Then** every field has documentation in `data/README.md` explaining what to edit, valid formats, and which fields are required vs optional (NFR20)

5. **Given** `src/lib/data.ts` exports typed functions
   **When** a Server Component calls `getProjects()`, `getExperience()`, `getSkills()`, or `getSiteConfig()`
   **Then** each function returns the correctly typed array or object; no `any` casts are present in `lib/data.ts`

## Tasks / Subtasks

- [x] **Task 1: Create TypeScript interfaces in `src/types/`** (AC: 1)
  - [x] Create `src/types/project.ts` — `ProjectMeta` and `Project` interfaces
  - [x] Create `src/types/experience.ts` — `Experience` and `Education` interfaces
  - [x] Create `src/types/site.ts` — `Skill`, `SkillCategory`, `SiteConfig`, `NavigationItem` interfaces

- [x] **Task 2: Create JSON seed data files in `data/`** (AC: 2, 3)
  - [x] Create `data/site.json` — owner metadata (name, title, email, social links, availability, navigation); NO canonical URL (sourced from env)
  - [x] Create `data/projects.json` — 2 seed projects with all required fields
  - [x] Create `data/experience.json` — 1+ work experience entries
  - [x] Create `data/skills.json` — 3+ skill categories with skills
  - [x] Create `data/education.json` — 1+ education entries

- [x] **Task 3: Create `src/lib/data.ts`** (AC: 3, 5)
  - [x] Import JSON files using relative paths from `src/lib/` (e.g., `../../data/projects.json`)
  - [x] Export `getProjects(): Project[]` — returns all projects
  - [x] Export `getExperience(): Experience[]` — returns all experience entries
  - [x] Export `getEducation(): Education[]` — returns all education entries
  - [x] Export `getSkills(): SkillCategory[]` — returns all skill categories
  - [x] Export `getSiteConfig(): SiteConfig` — returns site config with canonical URL from `process.env.NEXT_PUBLIC_SITE_URL`
  - [x] Zero `any` types — use proper interface types throughout

- [x] **Task 4: Create `data/README.md`** (AC: 4)
  - [x] Document each JSON file's fields, valid formats, required vs optional

- [x] **Task 5: Validate** (AC: 1, 2, 3, 5)
  - [x] Run `pnpm build` — zero TypeScript errors, zero ESLint errors

### Review Findings

- [x] [Review][Decision] AC3 canonical URL fallback ambiguity — resolved: keep localhost fallback for development; accepted as aligned with current implementation intent.

## Dev Notes

### ⚠️ CRITICAL: `data/` Is at Project Root, NOT Inside `src/`

The architecture explicitly places JSON data files at the **project root** level in `data/` — not inside `src/`. This is intentional: they are content, not source code.

```
my-portfolio/          ← project root
├── data/              ← HERE (not src/data/)
│   ├── site.json
│   ├── projects.json
│   ├── experience.json
│   ├── skills.json
│   └── education.json
├── src/
│   ├── lib/
│   │   └── data.ts    ← imports from ../../data/
│   └── types/
```

**`@/` alias maps to `./src/` only.** You CANNOT import `data/` files via `@/`. Use relative paths:

```typescript
// src/lib/data.ts — correct relative import
import projectsData from "../../data/projects.json";
import experienceData from "../../data/experience.json";
import skillsData from "../../data/skills.json";
import educationData from "../../data/education.json";
import siteData from "../../data/site.json";
```

`tsconfig.json` has `"resolveJsonModule": true` — direct JSON imports work without any extra library.

### ⚠️ CRITICAL: `NEXT_PUBLIC_SITE_URL` Is Canonical URL — Never in `site.json`

**ARC2 rule**: `NEXT_PUBLIC_SITE_URL` is the single source of truth for the canonical URL. It is already set in `.env.local` as `http://localhost:3000` and will be set per-environment in Vercel.

`data/site.json` must NOT contain a `siteUrl` or `canonicalUrl` field. The `getSiteConfig()` function must read the env var:

```typescript
export function getSiteConfig(): SiteConfig {
  return {
    ...siteData,
    siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  };
}
```

`SiteConfig` interface must include `siteUrl: string` so consumers (QR, OG, sitemap) have a typed field.

### ⚠️ CRITICAL: `strict: true` — No `any` Type

`tsconfig.json` has `"strict": true`. The TypeScript compiler will reject `any` type at build time. Use proper interfaces for all data shapes. Use `unknown` if a type is genuinely uncertain (but there's no uncertain data in this story — all types are known from the JSON schema).

**Anti-pattern to avoid:**

```typescript
// ❌ WRONG — will fail strict build
const data: any = JSON.parse(...)

// ✅ CORRECT — use typed imports
import projectsData from "../../data/projects.json";
// TypeScript infers the type from JSON structure automatically with resolveJsonModule
```

### TypeScript Interface Definitions

Create these exact interfaces:

**`src/types/project.ts`:**

```typescript
export interface ProjectMeta {
  slug: string;
  title: string;
  description: string; // One-liner for card display
  techStack: string[];
  outcome: string; // Brief outcome summary for card hover
  isFeatured: boolean;
  startDate: string; // ISO 8601 month precision: "2024-03"
  endDate?: string; // Omit or null if current/ongoing
  projectUrl?: string; // Live URL
  githubUrl?: string; // Repository URL
}

export interface Project extends ProjectMeta {
  problem: string; // Problem statement (MDX case study fallback)
  approach: string; // Approach description
  result: string; // Result/impact description
  hasCodeSample: boolean;
}
```

**`src/types/experience.ts`:**

```typescript
export interface Experience {
  company: string;
  title: string;
  startDate: string; // ISO 8601: "2022-03"
  endDate?: string; // Omit if isCurrent
  isCurrent: boolean;
  description: string;
  achievements: string[];
  techStack: string[];
}

export interface Education {
  institution: string;
  degree: string;
  field: string;
  startDate: string; // ISO 8601: "2018-09"
  endDate: string; // ISO 8601: "2022-06"
  description?: string;
}
```

**`src/types/site.ts`:**

```typescript
export interface Skill {
  name: string;
  level?: "beginner" | "intermediate" | "advanced" | "expert";
}

export interface SkillCategory {
  category: string;
  skills: Skill[];
}

export interface NavigationItem {
  label: string;
  href: string;
  isExternal?: boolean;
}

export interface SiteConfig {
  siteUrl: string; // From NEXT_PUBLIC_SITE_URL env var — NOT from JSON
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

### `src/lib/data.ts` Implementation

```typescript
import type { Project } from "@/types/project";
import type { Experience, Education } from "@/types/experience";
import type { SkillCategory, SiteConfig } from "@/types/site";

import projectsData from "../../data/projects.json";
import experienceData from "../../data/experience.json";
import skillsData from "../../data/skills.json";
import educationData from "../../data/education.json";
import siteData from "../../data/site.json";

export function getProjects(): Project[] {
  return projectsData as Project[];
}

export function getExperience(): Experience[] {
  return experienceData as Experience[];
}

export function getEducation(): Education[] {
  return educationData as Education[];
}

export function getSkills(): SkillCategory[] {
  return skillsData as SkillCategory[];
}

export function getSiteConfig(): SiteConfig {
  return {
    ...(siteData as Omit<SiteConfig, "siteUrl">),
    siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  };
}
```

> **Note on casts**: `as Project[]` is required because TypeScript's JSON inference produces a wider structural type, not the exact interface. This is the correct pattern — it is NOT `any`. The cast will fail at runtime if data shapes don't match, which is caught by `pnpm build`.

### JSON Data Field Conventions (Architecture ARC8)

- All field names: `camelCase` — `techStack`, `startDate`, `projectUrl`
- Boolean fields prefixed `is`/`has` — `isFeatured`, `isCurrent`, `hasCodeSample`
- Dates: ISO 8601 strings — `"2024-03"` for month precision
- No abbreviations — `description` not `desc`

### Named Exports Rule (ARC8)

`src/lib/data.ts` must use **named exports only**. No default export. No barrel `index.ts` files.

### No `src/types/index.ts` Barrel File

Do **not** create `src/types/index.ts`. Each type file is imported directly:

```typescript
import type { Project } from "@/types/project"; // ✅
import type { Project } from "@/types"; // ❌ barrel file
```

### Project Structure Notes

New files created by this story (all NEW, no UPDATE to existing files):

| File                      | Type | Purpose                                                  |
| ------------------------- | ---- | -------------------------------------------------------- |
| `src/types/project.ts`    | NEW  | `ProjectMeta`, `Project` interfaces                      |
| `src/types/experience.ts` | NEW  | `Experience`, `Education` interfaces                     |
| `src/types/site.ts`       | NEW  | `Skill`, `SkillCategory`, `SiteConfig`, `NavigationItem` |
| `src/lib/data.ts`         | NEW  | Typed data accessor functions                            |
| `data/site.json`          | NEW  | Owner metadata (no canonical URL)                        |
| `data/projects.json`      | NEW  | 2 seed projects                                          |
| `data/experience.json`    | NEW  | 1+ experience entries                                    |
| `data/skills.json`        | NEW  | 3+ skill categories                                      |
| `data/education.json`     | NEW  | 1+ education entries                                     |
| `data/README.md`          | NEW  | Schema documentation (NFR20)                             |

**No existing files are modified by this story.** The `src/app/` files from stories 1-1 and 1-2 are left untouched.

### Seed Data Guidance

Use BaoBao's real data or realistic placeholder data. The seed data must populate all required fields — no `undefined` for required fields in the JSON.

**projects.json shape example:**

```json
[
  {
    "slug": "portfolio-website",
    "title": "Personal Portfolio",
    "description": "Developer portfolio with terminal aesthetic and command palette navigation.",
    "techStack": ["Next.js", "TypeScript", "Tailwind CSS", "GSAP"],
    "outcome": "Live portfolio site with sub-1.5s FCP and keyboard-first navigation.",
    "isFeatured": true,
    "startDate": "2026-04",
    "problem": "Needed a portfolio that communicates technical depth to a developer audience.",
    "approach": "Built with Next.js App Router, custom design tokens, and a cmdk command palette.",
    "result": "Achieved Lighthouse 95+ performance score with rich developer-oriented UX.",
    "hasCodeSample": false,
    "githubUrl": "https://github.com/baobao/my-portfolio"
  }
]
```

**skills.json shape example (3 required categories):**

```json
[
  {
    "category": "Frontend",
    "skills": [
      { "name": "React", "level": "expert" },
      { "name": "TypeScript", "level": "expert" },
      { "name": "Next.js", "level": "advanced" }
    ]
  },
  {
    "category": "Styling",
    "skills": [
      { "name": "Tailwind CSS", "level": "expert" },
      { "name": "CSS", "level": "advanced" }
    ]
  },
  {
    "category": "Tooling",
    "skills": [
      { "name": "Git", "level": "advanced" },
      { "name": "pnpm", "level": "intermediate" }
    ]
  }
]
```

### Previous Story Learnings (from Story 1-2)

1. **Tailwind v4 uses CSS-based config** — no `tailwind.config.ts` for tokens. Not relevant to this story, but confirms the pattern of CSS-native configuration.
2. **`src/app/globals.css`** and **`src/app/layout.tsx`** were both modified in 1-2. This story creates new files and does NOT touch these.
3. **`@/` path alias** maps to `./src/*` — confirmed working in 1-2. Use `@/types/` and `@/lib/` for intra-src imports.
4. **`pnpm build` is the acceptance gate** — run it last to confirm zero TypeScript and ESLint errors.

### References

- [Source: _bmad-output/planning-artifacts/architecture.md#Data Architecture] — JSON+MDX hybrid, `data/` at project root, `NEXT_PUBLIC_SITE_URL` canonical URL rule
- [Source: _bmad-output/planning-artifacts/architecture.md#Naming Patterns] — camelCase JSON fields, `is`/`has` booleans, ISO 8601 dates
- [Source: _bmad-output/planning-artifacts/architecture.md#Structure Patterns] — `src/types/`, `src/lib/data.ts`, no barrel files
- [Source: _bmad-output/planning-artifacts/architecture.md#Enforcement Guidelines] — named exports, `@/` aliases, no `any`
- [Source: _bmad-output/planning-artifacts/epics.md#Story 1.3] — ACs and story definition
- [Source: tsconfig.json] — `strict: true`, `resolveJsonModule: true`, `paths: { "@/*": ["./src/*"] }`
- [Source: .env.local] — `NEXT_PUBLIC_SITE_URL=http://localhost:3000` already set
- [Source: _bmad-output/planning-artifacts/architecture.md#ARC2, ARC6, ARC8, ARC9] — core architectural rules

## Dev Agent Record

### Agent Model Used

Claude Sonnet 4.6

### Debug Log References

- Used `as Project[]` cast pattern (and equivalents) in `src/lib/data.ts` as documented in Dev Notes — TypeScript JSON inference produces a wider type than the declared interface; the cast is correct and not `any`.
- `pnpm build` passed on first attempt: zero TypeScript errors, zero ESLint errors.

### Completion Notes List

- Created 3 TypeScript interface files in `src/types/`: `project.ts`, `experience.ts`, `site.ts`. All interfaces match the story spec exactly.
- Created 5 JSON seed data files in `data/`: `site.json`, `projects.json` (2 projects), `experience.json` (2 entries), `skills.json` (4 categories), `education.json` (1 entry). All required fields populated; `site.json` contains no canonical URL field.
- Created `src/lib/data.ts` with 5 named exports (`getProjects`, `getExperience`, `getEducation`, `getSkills`, `getSiteConfig`). `getSiteConfig()` reads `NEXT_PUBLIC_SITE_URL` from env; zero `any` casts.
- Created `data/README.md` documenting all JSON fields with required/optional status, valid formats, and date conventions.
- All ACs verified: TypeScript strict build passes, env-based canonical URL enforced, no `any` in data layer, README covers all fields.

### File List

- `src/types/project.ts` (NEW)
- `src/types/experience.ts` (NEW)
- `src/types/site.ts` (NEW)
- `src/lib/data.ts` (NEW)
- `data/site.json` (NEW)
- `data/projects.json` (NEW)
- `data/experience.json` (NEW)
- `data/skills.json` (NEW)
- `data/education.json` (NEW)
- `data/README.md` (NEW)

## Change Log

| Date       | Change                                                                                                                                     |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| 2026-05-15 | Initial implementation — TypeScript interfaces, JSON seed data, `src/lib/data.ts`, `data/README.md`. `pnpm build` passes with zero errors. |
