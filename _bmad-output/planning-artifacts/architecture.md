---
stepsCompleted: [1, 2, 3, 4, 5, 6, 7, 8]
inputDocuments:
  - "_bmad-output/planning-artifacts/prd.md"
  - "_bmad-output/planning-artifacts/ux-design-specification.md"
workflowType: "architecture"
lastStep: 8
status: "complete"
completedAt: "2026-05-04"
project_name: "MyPortfolio"
user_name: "BaoBao"
date: "2026-04-28"
---

# Architecture Decision Document

_This document builds collaboratively through step-by-step discovery. Sections are appended as we work through each architectural decision together._

## Project Context Analysis

### Requirements Overview

**Functional Requirements:**
27 FRs across 8 categories — Portfolio Content Display (5), Navigation & Site Structure (3), CV Export & QR Code (4), Owner Content Management (3), Contact & Outreach (2), Design & Aesthetic (3), Performance & Accessibility (3), Discoverability & SEO (4). The CV export cluster (FR9–FR12) carries the highest architectural risk due to client-side PDF generation with dynamic QR embedding. The content management cluster (FR13–FR15) defines the data architecture — all content in structured files, shared between web and PDF surfaces.

**Non-Functional Requirements:**
20 NFRs across 6 domains — Performance (5), Reliability (3), Accessibility (4), Compatibility (3), Security (3), Maintainability (2). Performance targets are aggressive but achievable for SSG: Lighthouse >= 90 desktop / >= 80 mobile, FCP < 1.5s, LCP < 2.5s, CLS < 0.1. The critical reliability requirement is NFR6 — canonical URL stability, since every distributed CV depends on it.

**UX Architectural Implications:**
Direction 06 (Status Bar + Clean) drives component architecture — 10 custom components, no library dependencies beyond `cmdk`, `framer-motion`, `gsap`, and a PDF/QR generation stack. Geist Mono loaded via `next/font`. Mobile-first layout with desktop enrichments (status bar footer, command palette, hover states). Two-layer experience: recruiter surface + developer easter-egg layer.

**Scale & Complexity:**

- Primary domain: Frontend JAMstack (SSG)
- Complexity level: Medium
- Estimated architectural components: ~10 UI components + data layer + PDF generation pipeline + animation system

### Technical Constraints & Dependencies

- Next.js 16 App Router with static generation (SSG) — no server runtime for page serving
- Tailwind CSS v4 — utility-first, custom design tokens in config
- Vercel deployment — automatic HTTPS, CDN, preview deployments
- Client-side PDF generation — library TBD (`react-pdf` vs `@react-pdf/renderer`)
- QR code generation — library TBD (`qrcode` or `qrcode.react`)
- `cmdk` for command palette — requires content index
- Solo developer (BaoBao) — architecture must be maintainable by one person

### Cross-Cutting Concerns Identified

1. **Structured content data schema** — consumed by every page, the command palette index, the PDF export, and SEO metadata. The schema IS the architecture.
2. **Animation system boundaries** — GSAP for scroll-triggered effects, Framer Motion for layout/page transitions. Clear ownership rules needed to prevent conflicts.
3. **Accessibility compliance** — `prefers-reduced-motion` gating, keyboard navigation, focus management, WCAG AA contrast — affects every component.
4. **Canonical URL management** — single source of truth for the portfolio URL, consumed by QR generation, OG tags, sitemap, and structured data.

## Starter Template Evaluation

### Primary Technology Domain

Frontend JAMstack (SSG) — Next.js 16 App Router with static generation, deployed to Vercel.

### Starter Options Considered

| Option                       | Description                                                                             | Verdict                                                        |
| ---------------------------- | --------------------------------------------------------------------------------------- | -------------------------------------------------------------- |
| `create-next-app` (official) | Next.js 16.2.4 scaffolding — TypeScript, Tailwind CSS v4, ESLint, App Router, Turbopack | **Selected** — exact stack match, minimal, actively maintained |
| T3 Stack (`create-t3-app`)   | Full-stack starter with tRPC, Prisma, NextAuth                                          | Rejected — no backend, auth, or database needed                |
| Custom manual setup          | Manual `next`, `react`, `react-dom` installation                                        | Rejected — unnecessary friction for no benefit                 |

### Selected Starter: `create-next-app@latest` (v16.2.4)

**Rationale for Selection:**
The official `create-next-app` provides exactly the foundation this project requires with zero unnecessary dependencies. It scaffolds TypeScript, Tailwind CSS v4, ESLint, App Router, and Turbopack as the default bundler. Geist fonts (including Geist Mono — the UX spec's chosen typeface) are pre-configured via `next/font`. The `AGENTS.md` file is included by default to guide AI coding agents to write idiomatic Next.js 16 code.

**Initialization Command:**

```bash
pnpm create next-app@latest my-portfolio --typescript --tailwind --eslint --app --src-dir --use-pnpm --import-alias "@/*"
```

**Architectural Decisions Provided by Starter:**

**Language & Runtime:**

- TypeScript (strict mode — will be tightened further post-init)
- React (canary channel via Next.js 16 App Router)
- Node.js >= 20.9

**Styling Solution:**

- Tailwind CSS v4 configured and ready
- PostCSS integration via Tailwind

**Build Tooling:**

- Turbopack (default bundler in Next.js 16 — replaces Webpack for dev)
- Next.js compiler for production builds
- `next dev`, `next build`, `next start` scripts

**Linting:**

- ESLint with `eslint.config.mjs` (flat config)
- Next.js 16 no longer runs linter during `next build` — lint via npm scripts

**Code Organization:**

- `src/` directory separating source from config files
- `src/app/` for App Router pages and layouts
- `@/*` import alias pointing to `src/`

**Development Experience:**

- Turbopack hot reloading (fast refresh)
- TypeScript type checking
- Geist fonts pre-loaded via `next/font`

**Post-Init Additions Required:**

| Addition                            | Purpose                                                  |
| ----------------------------------- | -------------------------------------------------------- |
| Prettier + `eslint-config-prettier` | Code formatting (user preference)                        |
| GSAP                                | Scroll-triggered animations                              |
| Framer Motion                       | Layout/page transitions                                  |
| `cmdk`                              | Command palette (⌘K)                                     |
| PDF generation library (TBD)        | CV export                                                |
| QR code library (TBD)               | QR embed in CV PDF                                       |
| Custom Tailwind tokens              | Design system from UX spec (colors, spacing, typography) |
| `/data/` structured content files   | Content layer shared between web and PDF                 |

**Note:** Project initialization using this command should be the first implementation story.

## Core Architectural Decisions

### Decision Priority Analysis

**Critical Decisions (Block Implementation):**

- Content data architecture (JSON + MDX hybrid)
- PDF generation strategy (`@react-pdf/renderer` + `qrcode`)
- Animation system boundaries (GSAP vs Framer Motion ownership)

**Important Decisions (Shape Architecture):**

- Component architecture (Server Components default, `"use client"` opt-in)
- State management (React Context only)
- SEO strategy (Next.js metadata API)

**Deferred Decisions (Post-MVP):**

- Analytics integration (Phase 2)
- Dark/light mode toggle (Phase 2)
- Blog/writing section (Phase 2)

### Data Architecture

**Decision:** Hybrid content model — JSON for structured data, MDX for prose content.

- **JSON files** (`/data/*.json`): experience, skills, site config, project metadata. Typed via TypeScript interfaces. Consumed by both web pages and CV PDF export.
- **MDX files** (`/content/projects/*.mdx`): Project deep-dive case studies with frontmatter metadata and markdown body (supports code blocks, rich formatting). Web-only — not consumed by PDF.
- **Site config** (`/data/site.json`): Owner name, social links, availability status, and other site metadata. Note: the canonical URL is sourced from `NEXT_PUBLIC_SITE_URL` environment variable (not from `site.json`) to allow per-environment configuration. `NEXT_PUBLIC_SITE_URL` is the single source of truth for QR generation, OG tags, sitemap, and canonical URLs.
- **Validation:** TypeScript interfaces enforce schema at build time. No runtime validation library needed for static data.

### Authentication & Security

**Decision:** Not applicable — no auth, no user data, no API.

- Zero user data collection or storage (NFR16)
- HTTPS enforced via Vercel (NFR17)
- No third-party scripts without evaluation (NFR18)
- Content Security Policy headers configured in `next.config.ts`

### API & Communication Patterns

**Decision:** Not applicable — no API layer.

- All data is local (JSON/MDX files, build-time only)
- No external API calls at runtime
- CV PDF generation is client-side only

### Frontend Architecture

**State Management:** React Context + `useState` for minimal client state (command palette, mobile nav, active section). No external state library.

**Component Architecture:** Server Components by default. `"use client"` directive only for interactive components requiring DOM access, event handlers, or animation libraries.

**Client Components:**

- `CommandPalette` — keyboard events, fuzzy search state
- `NavBar` — mobile menu toggle
- `StatusStripe` / `Footer` — active section tracking (optional)
- Animation wrappers — GSAP ScrollTrigger and Framer Motion require client context

**Component Convention:** One component per file, named exports, `src/components/` directory. No barrel files.

**Animation System:**

| Concern                      | Owner                | Mechanism                                                               |
| ---------------------------- | -------------------- | ----------------------------------------------------------------------- |
| Scroll-triggered entrances   | GSAP + ScrollTrigger | `useGSAP` hook in client components                                     |
| Page/route transitions       | Framer Motion        | `AnimatePresence` + `motion` in layout                                  |
| Hover/state micro-animations | Tailwind CSS         | `transition-*`, `hover:`, `motion-reduce:`                              |
| Reduced motion               | All three            | Tailwind `motion-reduce:`, GSAP `matchMedia`, Framer `useReducedMotion` |

**Rule:** No component uses both GSAP and Framer Motion simultaneously.

**PDF Generation:**

- Library: `@react-pdf/renderer` for CV PDF generation
- QR code: `qrcode` library generates QR as data URL, embedded in PDF as image
- Data source: Reads from same JSON data files as website
- Output: Vector PDF, optimized for A4 and US Letter
- Trigger: Client-side button click on desktop

### Infrastructure & Deployment

**Hosting:** Vercel (zero-config Next.js, automatic HTTPS, global CDN, preview deployments)

**CI/CD:** Vercel Git integration — push to `main` triggers production deploy, PRs get preview URLs.

**Environment Configuration:** `NEXT_PUBLIC_SITE_URL` for canonical URL (used by QR generation, OG tags, sitemap). Configured in Vercel environment variables.

**Monitoring:** None for MVP. Vercel Analytics in Phase 2.

### SEO & Metadata

**Strategy:** Next.js 16 built-in metadata API exclusively.

- `generateMetadata()` in each page for dynamic `<title>`, `<meta>`
- `opengraph-image` file convention or static OG images
- `sitemap.ts` and `robots.ts` file conventions for auto-generation
- Person schema (`application/ld+json`) on home page
- Canonical URLs via metadata API

### Decision Impact Analysis

**Implementation Sequence:**

1. Project initialization (`create-next-app` + post-init setup)
2. Design tokens in `tailwind.config.ts` (color, typography, spacing from UX spec)
3. JSON data schema + TypeScript interfaces (`/data/`)
4. Page shell (layout, NavBar, Footer/StatusBar, SectionLayout)
5. Content pages (Home, Projects, About, Contact)
6. MDX integration for project detail pages
7. Animation layer (GSAP + Framer Motion)
8. Command palette (`cmdk`)
9. CV PDF export (`@react-pdf/renderer` + QR)
10. SEO metadata + OG images
11. Custom 404 page

**Cross-Component Dependencies:**

- JSON data schema must be finalized before any content page or CV export can be built
- Tailwind design tokens must be configured before any component styling
- NavBar and SectionLayout must exist before content pages
- Content pages must exist before command palette (needs page index to search)
- PDF export depends on finalized JSON schema and QR library

## Implementation Patterns & Consistency Rules

### Pattern Categories Defined

**Critical Conflict Points Identified:** 5 categories where AI agents could make different choices — naming, structure, format, process, and enforcement.

### Naming Patterns

**File Naming:**

| Category         | Convention                                    | Examples                                              |
| ---------------- | --------------------------------------------- | ----------------------------------------------------- |
| Components       | `PascalCase.tsx`                              | `NavBar.tsx`, `ProjectCard.tsx`, `CommandPalette.tsx` |
| Pages/routes     | `kebab-case` directories (Next.js convention) | `src/app/projects/[slug]/page.tsx`                    |
| Data files       | `kebab-case.json`                             | `site.json`, `experience.json`, `projects.json`       |
| MDX content      | `kebab-case.mdx`                              | `portfolio-dashboard.mdx`                             |
| Utilities/hooks  | `camelCase.ts`                                | `useScrollAnimation.ts`, `formatDate.ts`              |
| Type definitions | `camelCase.ts` in `src/types/`                | `project.ts`, `experience.ts`, `site.ts`              |

**Code Naming:**

| Category              | Convention                  | Examples                                |
| --------------------- | --------------------------- | --------------------------------------- |
| Components            | `PascalCase` named exports  | `export function ProjectCard()`         |
| Functions/hooks       | `camelCase`                 | `getProjects()`, `useScrollAnimation()` |
| TypeScript interfaces | `PascalCase`, no `I` prefix | `Project`, `Experience`, `SiteConfig`   |
| TypeScript types      | `PascalCase`                | `ProjectMeta`, `NavigationItem`         |
| Constants             | `UPPER_SNAKE_CASE`          | `ANIMATION_DURATION`, `BREAKPOINTS`     |
| CSS custom properties | `kebab-case`                | `--bg-primary`, `--text-hero`           |

**JSON Data Fields:**

- `camelCase` throughout — `techStack`, `startDate`, `projectUrl`
- No abbreviations — `description` not `desc`, `technology` not `tech`
- Boolean fields prefixed with `is`/`has` — `isFeatured`, `hasCodeSample`

### Structure Patterns

**Project Organization:**

```
src/
├── app/                    # Next.js App Router pages
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Home page
│   ├── projects/
│   │   ├── page.tsx        # Projects listing
│   │   └── [slug]/
│   │       └── page.tsx    # Project detail
│   ├── about/
│   │   └── page.tsx
│   └── contact/
│       └── page.tsx
├── components/             # Shared UI components
│   ├── NavBar.tsx
│   ├── CommandPalette.tsx
│   ├── ProjectCard.tsx
│   ├── Badge.tsx
│   ├── SectionLayout.tsx
│   ├── StatusStripe.tsx
│   ├── Footer.tsx
│   └── ErrorPage.tsx
├── components/cv/          # CV/PDF-specific components
│   └── CVDocument.tsx
├── hooks/                  # Custom React hooks
│   ├── useScrollAnimation.ts
│   └── useCommandPalette.ts
├── lib/                    # Utility functions and data access
│   ├── data.ts             # Data loading functions
│   ├── mdx.ts              # MDX processing utilities
│   └── pdf.ts              # PDF generation utilities
├── types/                  # TypeScript type definitions
│   ├── project.ts
│   ├── experience.ts
│   └── site.ts
└── styles/                 # Global styles (if any beyond Tailwind)
    └── globals.css
data/                       # Structured content (JSON) — at project root
├── site.json
├── projects.json
├── experience.json
├── skills.json
└── education.json
content/                    # MDX content — at project root
└── projects/
    ├── project-one.mdx
    └── project-two.mdx
```

**Placement Rules:**

- Components in `src/components/` — flat structure, no nesting by feature
- Data access functions in `src/lib/data.ts` — single file, typed returns
- Hooks in `src/hooks/` — one hook per file
- Types in `src/types/` — one file per domain entity
- `data/` and `content/` at project root (not inside `src/`) — they're content, not source code

### Format Patterns

**Date Formats:**

- In JSON data: ISO 8601 strings — `"2024-03"` for month precision, `"2024-03-15"` for day precision
- In UI display: formatted via `Intl.DateTimeFormat` — never manually formatted strings

**Import Order (enforced by ESLint):**

1. React / Next.js imports
2. Third-party library imports
3. `@/components/` imports
4. `@/hooks/` imports
5. `@/lib/` imports
6. `@/types/` imports
7. Relative imports
8. CSS/style imports

### Process Patterns

**Error Handling:**

- Page-level: Next.js `error.tsx` convention for route errors
- 404: Custom `not-found.tsx` with terminal-style personality (per UX spec)
- Component-level: No try/catch in UI components — data is static and pre-validated at build time
- PDF generation: Try/catch around PDF render with user-facing fallback message

**Loading States:**

- SSG pages: No loading states needed — pages are pre-rendered
- PDF generation: Show "Generating..." state while `@react-pdf/renderer` works
- Command palette: Instant — content index is loaded at build time
- Images: Next.js `<Image>` with `placeholder="blur"` where available

**`"use client"` Boundary Rules:**

- Place `"use client"` as deep in the component tree as possible
- Never put `"use client"` on a page or layout file — wrap only the interactive part
- Create thin client wrapper components: e.g., `AnimatedSection.tsx` wraps `SectionLayout` children with GSAP

**Tailwind Class Ordering:**

- Follow Tailwind's recommended class order: layout → sizing → spacing → typography → visual → interactive → responsive
- Use Prettier with `prettier-plugin-tailwindcss` to auto-sort

### Enforcement Guidelines

**All AI Agents MUST:**

- Follow the file naming conventions exactly (`PascalCase` for components, `camelCase` for utilities/hooks)
- Use named exports, never default exports (except `page.tsx` and `layout.tsx` which Next.js requires as default)
- Place `"use client"` only where DOM access or browser APIs are needed — never preemptively
- Import from `@/` aliases, never relative paths that climb more than one level (`../` is fine, `../../` use alias)
- Use TypeScript interfaces from `src/types/` for all data shapes — never inline type definitions for shared data

**Anti-Patterns to Reject:**

- Creating `index.ts` barrel files — violates tree-shaking and increases bundle
- Putting business logic in components — data access goes in `src/lib/`
- Using `any` type — use `unknown` if type is genuinely uncertain
- Creating wrapper components unnecessarily — only wrap when adding behavior (animation, state)
- Importing GSAP in a Framer Motion component or vice versa

## Project Structure & Boundaries

### Complete Project Directory Structure

```
my-portfolio/
├── .github/                        # CI/CD (future — Vercel handles deploy)
├── .vscode/                        # VS Code workspace settings
│   └── settings.json               # Tailwind intellisense, format-on-save
├── data/                           # Structured content (JSON) — project root
│   ├── site.json                   # Owner name, social links, availability (canonical URL from NEXT_PUBLIC_SITE_URL env var)
│   ├── projects.json               # Project metadata (title, slug, stack, outcome)
│   ├── experience.json             # Work experience entries
│   ├── skills.json                 # Technology proficiencies
│   └── education.json              # Education history
├── content/                        # MDX prose content — project root
│   └── projects/                   # Project deep-dive case studies
│       ├── project-one.mdx         # Frontmatter + markdown body
│       └── project-two.mdx
├── public/                         # Static assets
│   ├── fonts/                      # Fallback fonts (if needed beyond next/font)
│   ├── images/                     # Project screenshots, OG images
│   │   └── projects/               # Per-project images
│   └── cv/                         # Generated CV PDF (if pre-built)
├── src/
│   ├── app/                        # Next.js App Router
│   │   ├── layout.tsx              # Root layout — font loading, metadata, NavBar, Footer
│   │   ├── page.tsx                # Home page — hero, featured projects, CTA
│   │   ├── not-found.tsx           # Custom 404 — terminal-style error page
│   │   ├── error.tsx               # Global error boundary
│   │   ├── globals.css             # Tailwind directives + custom properties
│   │   ├── sitemap.ts              # Auto-generated sitemap
│   │   ├── robots.ts               # Robots.txt generation
│   │   ├── projects/
│   │   │   ├── page.tsx            # Projects listing — card grid
│   │   │   └── [slug]/
│   │   │       └── page.tsx        # Project detail — MDX case study
│   │   ├── about/
│   │   │   └── page.tsx            # About — bio, skills, experience, education
│   │   └── contact/
│   │       └── page.tsx            # Contact — email CTA, social links
│   ├── components/                 # Shared UI components
│   │   ├── NavBar.tsx              # Persistent navigation + mobile menu
│   │   ├── CommandPalette.tsx      # ⌘K fuzzy search (cmdk)
│   │   ├── ProjectCard.tsx         # Project summary card with badges
│   │   ├── Badge.tsx               # Tech stack pill tag
│   │   ├── SectionLayout.tsx       # Consistent section wrapper with // labels
│   │   ├── StatusStripe.tsx        # Top bar — availability + ⌘K hint
│   │   ├── Footer.tsx              # VS Code-style status bar footer
│   │   ├── AnimatedSection.tsx     # Client wrapper for GSAP scroll animations
│   │   └── PageTransition.tsx      # Client wrapper for Framer Motion route transitions
│   ├── components/cv/              # CV/PDF-specific components
│   │   ├── CVDocument.tsx          # @react-pdf/renderer document layout
│   │   ├── CVHeader.tsx            # PDF header section
│   │   ├── CVSection.tsx           # PDF section component
│   │   └── CVDownloadButton.tsx    # Client trigger for PDF generation
│   ├── hooks/                      # Custom React hooks
│   │   ├── useScrollAnimation.ts   # GSAP ScrollTrigger wrapper
│   │   ├── useCommandPalette.ts    # Command palette state + keyboard shortcut
│   │   ├── useActiveSection.ts     # Track current section for status bar
│   │   └── useReducedMotion.ts     # Shared reduced-motion detection
│   ├── lib/                        # Utility functions and data access
│   │   ├── data.ts                 # Load and type JSON data files
│   │   ├── mdx.ts                  # MDX processing + frontmatter parsing
│   │   ├── pdf.ts                  # PDF generation orchestration
│   │   ├── qr.ts                   # QR code generation (data URL output)
│   │   └── metadata.ts             # Shared metadata generation helpers
│   ├── types/                      # TypeScript type definitions
│   │   ├── project.ts              # Project, ProjectMeta interfaces
│   │   ├── experience.ts           # Experience, Education interfaces
│   │   ├── site.ts                 # SiteConfig, NavigationItem interfaces
│   │   └── skills.ts               # Skill, SkillCategory interfaces
│   └── styles/
│       └── globals.css             # (import target — Tailwind directives)
├── .env.local                      # Local environment (NEXT_PUBLIC_SITE_URL)
├── .env.example                    # Documented env vars for contributors
├── eslint.config.mjs               # ESLint flat config
├── .prettierrc                     # Prettier config
├── .gitignore
├── next.config.ts                  # Next.js config (CSP headers, redirects)
├── tailwind.config.ts              # Design tokens — colors, typography, spacing
├── tsconfig.json                   # TypeScript strict config
├── package.json
├── pnpm-lock.yaml
├── AGENTS.md                       # AI agent coding guide (from create-next-app)
└── README.md
```

### Architectural Boundaries

**Component Boundaries:**

| Boundary        | Server Side                                | Client Side                                            | Communication                                             |
| --------------- | ------------------------------------------ | ------------------------------------------------------ | --------------------------------------------------------- |
| Page rendering  | `page.tsx` files (Server Components)       | `AnimatedSection`, `PageTransition` wrappers           | Props passed down; client wrappers receive children       |
| Navigation      | `NavBar.tsx` renders nav links (server)    | Mobile menu toggle state (client portion)              | `"use client"` on interactive sub-component only          |
| Command palette | Not involved                               | `CommandPalette.tsx` — fully client                    | Receives pre-built page index as prop from layout         |
| CV export       | Not involved                               | `CVDownloadButton.tsx` triggers client-side generation | Reads from imported JSON data; generates PDF in browser   |
| Data access     | `src/lib/data.ts` loads JSON at build time | Not involved                                           | Server Components call `lib/data.ts`; data flows as props |

**Data Boundaries:**

| Data Source          | Location                 | Consumed By                                                     | Access Pattern                          |
| -------------------- | ------------------------ | --------------------------------------------------------------- | --------------------------------------- |
| Site config          | `data/site.json`         | Layout, Footer, StatusStripe, OG tags, QR generation, sitemap   | `lib/data.ts` → typed `SiteConfig`      |
| Projects metadata    | `data/projects.json`     | Projects page, Home (featured), CommandPalette index, CV export | `lib/data.ts` → typed `Project[]`       |
| Project case studies | `content/projects/*.mdx` | Project detail `[slug]/page.tsx` only                           | `lib/mdx.ts` → parsed MDX + frontmatter |
| Experience           | `data/experience.json`   | About page, CV export                                           | `lib/data.ts` → typed `Experience[]`    |
| Skills               | `data/skills.json`       | About page, CV export                                           | `lib/data.ts` → typed `Skill[]`         |
| Education            | `data/education.json`    | About page, CV export                                           | `lib/data.ts` → typed `Education[]`     |

### Requirements to Structure Mapping

**FR Category Mapping:**

| FR Category                             | Primary Files                                                                                 | Key Dependencies                                           |
| --------------------------------------- | --------------------------------------------------------------------------------------------- | ---------------------------------------------------------- |
| Portfolio Content Display (FR1–FR5)     | `app/page.tsx`, `app/about/page.tsx`, `app/projects/page.tsx`, `ProjectCard.tsx`, `Badge.tsx` | `data/*.json`, `lib/data.ts`, `types/`                     |
| Navigation & Site Structure (FR6–FR8)   | `NavBar.tsx`, `app/layout.tsx`, `CommandPalette.tsx`                                          | `data/site.json`, `hooks/useCommandPalette.ts`             |
| CV Export & QR Code (FR9–FR12)          | `components/cv/*`, `lib/pdf.ts`, `lib/qr.ts`, `CVDownloadButton.tsx`                          | `data/*.json`, `data/site.json` (canonical URL)            |
| Owner Content Management (FR13–FR15)    | `data/*.json`, `content/projects/*.mdx`                                                       | `lib/data.ts`, `lib/mdx.ts`                                |
| Contact & Outreach (FR16–FR17)          | `app/contact/page.tsx`, `Footer.tsx`                                                          | `data/site.json` (social links, email)                     |
| Design & Aesthetic (FR18–FR20)          | `tailwind.config.ts`, `globals.css`, `AnimatedSection.tsx`, `PageTransition.tsx`              | `hooks/useScrollAnimation.ts`, `hooks/useReducedMotion.ts` |
| Performance & Accessibility (FR21–FR23) | All components (cross-cutting)                                                                | `next.config.ts` (headers), Tailwind `motion-reduce:`      |
| Discoverability & SEO (FR24–FR27)       | `app/sitemap.ts`, `app/robots.ts`, `lib/metadata.ts`, each `page.tsx`                         | `data/site.json`                                           |

**Cross-Cutting Concerns Mapping:**

| Concern                | Files Affected                                                                         | Enforcement                                              |
| ---------------------- | -------------------------------------------------------------------------------------- | -------------------------------------------------------- |
| Structured data schema | `data/*.json`, `types/*.ts`, `lib/data.ts`                                             | TypeScript interfaces — build fails on schema mismatch   |
| Animation system       | `AnimatedSection.tsx` (GSAP), `PageTransition.tsx` (Framer), all components (Tailwind) | GSAP/Framer never in same component                      |
| Accessibility          | Every component                                                                        | `motion-reduce:`, ARIA attrs, focus management, contrast |
| Canonical URL          | `data/site.json` → `lib/qr.ts`, `lib/metadata.ts`, `app/sitemap.ts`                    | Single source in `site.json`, read everywhere            |

### Data Flow

```
data/*.json ──→ lib/data.ts ──→ Server Components (pages) ──→ Props ──→ Client Components
                                        │
content/*.mdx ──→ lib/mdx.ts ───────────┘
                                        │
                                        ├──→ UI Rendering (web)
                                        └──→ CV PDF Generation (client-side, on demand)
                                                │
data/site.json ──→ lib/qr.ts ──→ QR data URL ──┘
```

### Development Workflow Integration

**Dev Server:** `pnpm dev` → Turbopack hot reload on `src/`, `data/`, `content/` changes.

**Build Process:** `pnpm build` → Next.js static generation. All pages pre-rendered. JSON data imported at build time. MDX compiled to React components.

**Deployment:** Push to `main` → Vercel auto-deploys. Preview URLs on PRs. `NEXT_PUBLIC_SITE_URL` set in Vercel environment variables.

**Content Update Workflow:** Edit `data/*.json` or `content/*.mdx` → commit → push → Vercel rebuilds → live in minutes.

## Architecture Validation Results

### Coherence Validation ✅

**Decision Compatibility:**

- Next.js 16 + Tailwind v4 + TypeScript — native integration, no adapters needed
- `@react-pdf/renderer` is React-based — runs client-side in Next.js without server runtime conflicts
- GSAP + Framer Motion — non-overlapping ownership rules prevent conflicts
- `cmdk` is a React component — drops into App Router client components cleanly
- Geist Mono via `next/font` — included in `create-next-app` by default

**Pattern Consistency:**

- Naming conventions are consistent across files, code, and data
- Server/client boundary rules align with animation library ownership
- Import alias strategy (`@/`) is compatible with flat component structure

**Structure Alignment:**

- `data/` and `content/` at project root cleanly separate content from source
- `src/components/cv/` isolates PDF generation from web components
- `src/lib/` centralizes data access — single import path for all data consumers

### Requirements Coverage Validation ✅

**Functional Requirements — all 27 covered:**

| FR Category                    | Status | Architectural Support                                             |
| ------------------------------ | ------ | ----------------------------------------------------------------- |
| FR1–FR5 (Content Display)      | ✅     | Pages + JSON data + components                                    |
| FR6–FR8 (Navigation)           | ✅     | NavBar + CommandPalette + App Router                              |
| FR9–FR12 (CV Export + QR)      | ✅     | `@react-pdf/renderer` + `qrcode` + `data/site.json` canonical URL |
| FR13–FR15 (Content Management) | ✅     | JSON files + MDX + `lib/data.ts`                                  |
| FR16–FR17 (Contact)            | ✅     | Contact page + Footer + `data/site.json` social links             |
| FR18–FR20 (Design & Aesthetic) | ✅     | Tailwind tokens + GSAP + Framer + `motion-reduce:`                |
| FR21–FR23 (Performance & A11y) | ✅     | SSG + keyboard nav + ARIA + focus management                      |
| FR24–FR27 (SEO)                | ✅     | `generateMetadata()` + `sitemap.ts` + `robots.ts` + Person schema |

**Non-Functional Requirements — all 20 covered:**

| NFR Category                  | Status | Architectural Support                                                     |
| ----------------------------- | ------ | ------------------------------------------------------------------------- |
| NFR1–NFR5 (Performance)       | ✅     | SSG, Turbopack, selective animations, no heavy runtime                    |
| NFR6–NFR8 (Reliability)       | ✅     | Vercel SLA, canonical URL in config, client-side PDF                      |
| NFR9–NFR12 (Accessibility)    | ✅     | WCAG AA via Tailwind contrast, `motion-reduce:`, keyboard nav             |
| NFR13–NFR15 (Compatibility)   | ✅     | Browser matrix handled by Next.js, responsive via Tailwind, PDF A4/Letter |
| NFR16–NFR18 (Security)        | ✅     | No user data, HTTPS via Vercel, CSP headers, no third-party scripts       |
| NFR19–NFR20 (Maintainability) | ✅     | Structured data files, TypeScript interfaces, documented schema           |

### Implementation Readiness Validation ✅

**Decision Completeness:** All critical and important decisions documented with library choices, version references, and rationale. No open questions remain.

**Structure Completeness:** Every file in the project tree maps to at least one FR. No orphan directories or undefined components.

**Pattern Completeness:** Naming, structure, format, process, and enforcement rules all defined. Anti-patterns documented.

### Gap Analysis Results

**Critical Gaps:** None found.

**Important Gaps (addressable during implementation, not blocking):**

1. **MDX configuration details** — `@next/mdx` vs `next-mdx-remote` not specified. Decide during implementation based on whether MDX files need dynamic loading or are statically importable.
2. **Command palette content index** — the exact shape of the search index is an implementation detail, not an architectural decision — `cmdk` accepts any searchable array.

**Nice-to-Have Gaps:**

- OG image generation strategy (static vs `ImageResponse`) — decide during SEO implementation
- Prettier plugin list beyond `prettier-plugin-tailwindcss` — minimal concern

### Architecture Completeness Checklist

**✅ Requirements Analysis**

- [x] Project context thoroughly analyzed
- [x] Scale and complexity assessed
- [x] Technical constraints identified
- [x] Cross-cutting concerns mapped

**✅ Architectural Decisions**

- [x] Critical decisions documented with library choices
- [x] Technology stack fully specified
- [x] Animation system boundaries defined
- [x] PDF generation strategy decided
- [x] Data architecture (JSON + MDX hybrid) established

**✅ Implementation Patterns**

- [x] Naming conventions established
- [x] Structure patterns defined
- [x] Import ordering specified
- [x] Process patterns documented (error handling, loading states, `"use client"` rules)
- [x] Anti-patterns documented

**✅ Project Structure**

- [x] Complete directory structure defined
- [x] Component boundaries established (Server vs Client)
- [x] Data flow mapped
- [x] All 27 FRs mapped to specific files
- [x] Cross-cutting concerns mapped

### Architecture Readiness Assessment

**Overall Status:** READY FOR IMPLEMENTATION

**Confidence Level:** High — all requirements covered, no blocking gaps, technology choices are boring and proven.

**Key Strengths:**

- Clean separation of content (data/content) from source (src) from config (root)
- Single data source feeding both web and PDF surfaces — no drift possible
- Server/client boundary rules prevent accidental bundle bloat
- Animation ownership rules prevent GSAP/Framer conflicts
- TypeScript interfaces enforce data schema at build time

**Areas for Future Enhancement:**

- Phase 2: Analytics, dark/light toggle, blog section
- Phase 3: Interactive terminal hero, GitHub graph, open-source template

### Implementation Handoff

**AI Agent Guidelines:**

- Follow all architectural decisions exactly as documented
- Use implementation patterns consistently across all components
- Respect project structure and boundaries
- Refer to this document for all architectural questions

**First Implementation Priority:**

```bash
pnpm create next-app@latest my-portfolio --typescript --tailwind --eslint --app --src-dir --use-pnpm --import-alias "@/*"
```

Then: Prettier setup → Tailwind design tokens → JSON data schema → page shell → content pages → animations → command palette → CV export → SEO → 404 page.
