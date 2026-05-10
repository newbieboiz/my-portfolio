---
stepsCompleted:
  [
    "step-01-validate-prerequisites",
    "step-02-design-epics",
    "step-03-create-stories",
    "step-04-final-validation",
  ]
inputDocuments:
  - "_bmad-output/planning-artifacts/prd.md"
  - "_bmad-output/planning-artifacts/architecture.md"
  - "_bmad-output/planning-artifacts/ux-design-specification.md"
---

# MyPortfolio - Epic Breakdown

## Overview

This document provides the complete epic and story breakdown for MyPortfolio, decomposing the requirements from the PRD, UX Design Specification, and Architecture Decision Document into implementable stories.

## Requirements Inventory

### Functional Requirements

FR1: Visitors can view BaoBao's professional bio and personal introduction
FR2: Visitors can browse a curated list of projects with title, description, tech stack tags, and outcome summary
FR3: Visitors can view individual project details including problem, approach, and result
FR4: Visitors can view BaoBao's skills and technology proficiencies
FR5: Visitors can view BaoBao's work experience and education history
FR6: Visitors can navigate between distinct portfolio sections (Home, Projects, About, Contact)
FR7: Visitors can access the portfolio from a stable, memorable custom domain URL
FR8: Visitors on mobile can navigate the site with a collapsed, minimal mobile menu
FR9: Owner can trigger a CV/resume export as a downloadable PDF from the portfolio site
FR10: The exported PDF includes a QR code that links to the live canonical portfolio URL
FR11: The QR code URL is sourced from a configurable value (not hardcoded) so it remains valid after domain changes
FR12: Owner can re-export the CV at any time to reflect current content and canonical URL
FR13: Owner can update personal bio, experience, education, skills, and projects by editing structured data files without modifying UI component code
FR14: Content changes are reflected on the live site after a standard build/deploy cycle
FR15: The CV PDF export reads from the same data source as the portfolio website, ensuring consistency
FR16: Visitors can initiate contact with BaoBao via a visible contact mechanism (email link or contact form)
FR17: Visitors can access BaoBao's professional social and GitHub profiles via footer links
FR18: The portfolio renders a coding-vibe aesthetic: dark color palette, monospace typography, terminal-inspired UI motifs
FR19: The portfolio includes purposeful micro-animations on key interactions and scroll events
FR20: Animations are suppressed or reduced when the visitor's OS has `prefers-reduced-motion` enabled
FR21: The portfolio is fully responsive and usable across mobile, tablet, and desktop viewports
FR22: All interactive elements are keyboard-navigable with visible focus indicators
FR23: All images and icon-only controls include descriptive alternative text or ARIA labels
FR24: Each page has a unique title, meta description, and canonical URL
FR25: The site exposes Open Graph tags so shared links render rich previews on social and messaging platforms
FR26: The site generates a sitemap and robots.txt for search engine crawling
FR27: The home page includes structured data (Person schema) to support name-based search discovery

### NonFunctional Requirements

NFR1: First Contentful Paint < 1.5s; Largest Contentful Paint < 2.5s on desktop (3G equivalent: LCP < 4s)
NFR2: Lighthouse Performance score >= 90 on desktop, >= 80 on mobile
NFR3: Cumulative Layout Shift < 0.1; Total Blocking Time < 200ms
NFR4: CV PDF export generation completes within 5 seconds of trigger
NFR5: All animation frames target 60fps; no janked transitions on mid-range hardware
NFR6: The canonical portfolio URL must remain stable and resolvable at all times — a broken URL invalidates every distributed CV
NFR7: Site uptime >= 99.9% (Vercel SLA; no custom infra to maintain)
NFR8: CV PDF download succeeds on every attempt — 0% failure rate is the expectation
NFR9: WCAG 2.1 AA best-effort — all success criteria targeted; exceptions documented if unavoidable
NFR10: Color contrast ratio >= 4.5:1 for body text, >= 3:1 for large text and UI components
NFR11: `prefers-reduced-motion` respected site-wide — all animations suppressed or reduced when set
NFR12: All interactive elements operable by keyboard alone; focus order follows visual reading order
NFR13: Full functionality on Chrome, Firefox, Safari, Edge (last 2 major versions each)
NFR14: Responsive across mobile (>= 320px), tablet (768px), and desktop (1024px+) viewports
NFR15: PDF export renders correctly on A4 and US Letter paper sizes
NFR16: No user data collected or stored (no auth, no analytics backend, no form data persistence)
NFR17: HTTPS enforced on all pages (Vercel default); no mixed-content warnings
NFR18: No third-party scripts loaded without explicit evaluation (no CDN tracking, no analytics without consent)
NFR19: Content updates require only structured data file edits — zero UI/component code changes for routine portfolio maintenance
NFR20: All content fields documented in a schema comment or README so owner knows what to edit

### Additional Requirements

- ARC1: Project must be initialized using `pnpm create next-app@latest my-portfolio --typescript --tailwind --eslint --app --src-dir --use-pnpm --import-alias "@/*"` — this is the first story of Epic 1
- ARC2: `NEXT_PUBLIC_SITE_URL` environment variable must be configured in `.env.local` and Vercel — it is the single source of truth for the canonical URL consumed by QR generation, OG tags, and sitemap
- ARC3: Post-init additions required: Prettier + `eslint-config-prettier`, ESLint import-order rule, GSAP, Framer Motion, `cmdk`, `@react-pdf/renderer`, `qrcode`, custom Tailwind design tokens
- ARC4: PDF generation library: `@react-pdf/renderer`; QR code library: `qrcode` (generates data URL embedded as image in PDF)
- ARC5: Animation system boundary rule — GSAP owns scroll-triggered entrances (via `useGSAP` hook), Framer Motion owns page/route transitions (`AnimatePresence`), Tailwind owns hover/state micro-animations — no component may use GSAP and Framer Motion simultaneously
- ARC6: All data shapes must be typed via TypeScript interfaces in `src/types/` — build fails on schema mismatch; no `any` type usage
- ARC7: CSP headers must be configured in `next.config.ts` (NFR17/NFR18 enforcement)
- ARC8: Component conventions: named exports only (except `page.tsx` / `layout.tsx`); no barrel `index.ts` files; `"use client"` only where DOM/browser APIs are required; `@/` import aliases, no deep relative paths
- ARC9: Content data architecture is JSON + MDX hybrid: JSON files in `/data/` for structured data (experience, skills, projects, site config), MDX files in `/content/projects/` for project case studies — both consumed by `src/lib/data.ts` and `src/lib/mdx.ts`
- ARC10: Deployment: push to `main` → Vercel auto-deploys to production; PRs → preview URLs; `NEXT_PUBLIC_SITE_URL` set per environment in Vercel dashboard

### UX Design Requirements

UX-DR1: Implement Tailwind CSS v4 design token layer with exact color palette: --bg-primary: #0A0A0F, --bg-secondary: #12121A, --bg-tertiary: #1A1A25, --border-subtle: #2A2A3A, --border-active: #3A3A50, --accent: #00DC82, --accent-hover: #00FF96, --accent-muted: #00DC8220 (12% opacity), --accent-glow: #00DC8215 (subtle glow effects), plus text hierarchy (--text-primary: #E8E8ED, --text-secondary: #A0A0B0, --text-tertiary: #6B6B80, --text-muted: #45455A) and semantic colors (--warning: #FFB224, --error: #FF6B6B, --info: #60A5FA)
UX-DR2: Implement typography scale using Geist Mono as the sole typeface via `next/font` — sizes: hero 56px/700, h1 42px/700, h2 32px/600, h3 24px/600, body 16px/400 (line-height 1.6), small 14px/400, xs 12px/400, code 14px/400; letter-spacing: headings -0.02em, hero -0.03em, badges +0.04em
UX-DR3: Implement mobile typography scale adjustments: hero 36px (from 56px), h1 28px (from 42px), h2 24px (from 32px); all body/small/xs sizes unchanged
UX-DR4: Implement spacing scale with 4px base grid: --space-1 (4px) through --space-32 (128px) as defined in UX spec
UX-DR5: Implement layout grid — mobile: 4 cols/16px gutter/16px margin; tablet: 8 cols/24px gutter/32px margin; desktop: 12 cols/24px gutter/auto margin/1120px max content width; prose max width 680px; project card grid: 2 columns on tablet+, single column on mobile
UX-DR6: Implement Direction 06 (Status Bar + Clean) page structure: StatusStripe top bar with availability dot + "● open to work" + ⌘K hint on desktop; minimal NavBar with logo (bao.dev with accent-colored period) + 4 nav items; 2-column project card grid; VS Code-style status bar footer (desktop only, hidden on mobile) showing branch, stack, CSS version, encoding, green dot
UX-DR7: Implement `// comment` syntax as section labels throughout: `// hello world` (hero), `// selected work` (projects section), `// about`, `// contact` — these are the visual section identifiers in the coding aesthetic
UX-DR8: Hero section: `// hello world` label, name at hero scale, tagline ("I build interfaces that feel inevitable." or equivalent), two CTAs — [View Projects] and [Download CV] — side-by-side on desktop, stacked on mobile
UX-DR9: Build CommandPalette component using `cmdk` library: ⌘K / Ctrl+K opens fuzzy-search overlay over all pages and projects; keyboard shortcuts G+P (Projects), G+A (About), G+C (Contact) with `?` overlay showing available shortcuts; ⌘K badge hint visible near section headers on desktop
UX-DR10: Build ProjectCard component: title, one-line description, tech stack Badge components, hover reveal of additional context (tech stack detail, date, brief outcome) on desktop only — mobile shows all info by default; entire card scannable in < 3 seconds
UX-DR11: Build Badge component: tech stack pill tags, Geist Mono, --text-xs size, accent-muted background, slight color variation by category
UX-DR12: Implement custom focus ring system: `2px solid var(--accent)` with `2px offset`, `focus-visible` only (no focus ring on mouse click), tab order follows visual reading order, include skip-to-main-content link as first focusable element
UX-DR13: Implement motion timing tokens in Tailwind config: 150ms (micro-interactions), 250ms (transitions), 400ms (entrance animations); easing: ease-out for entrances, ease-in-out for state changes; all gated by `prefers-reduced-motion` — when reduced, transitions become instant (0ms) or max 150ms simple fade
UX-DR14: Build AnimatedSection client wrapper using GSAP + ScrollTrigger for scroll-triggered entrance animations on content sections; build PageTransition wrapper using Framer Motion AnimatePresence for route transitions at 200–300ms
UX-DR15: Build SectionLayout component: consistent section wrapper with `// comment` heading label, max-width 1120px, responsive padding using spacing scale
UX-DR16: Build custom 404 / not-found page with terminal-style personality — terminal-aesthetic error message, accent-colored error code, links to projects and contact — reinforces coding identity on error
UX-DR17: Project hover reveal pattern: on desktop, project cards show additional context (tech stack detail, outcome) on hover; Tailwind `group-hover:` pattern; suppressed under `prefers-reduced-motion`
UX-DR18: Implement motion accessibility globally: Tailwind `motion-reduce:` variant on every animated element; GSAP `matchMedia` for ScrollTrigger; Framer Motion `useReducedMotion` hook — no animation is load-bearing (all content accessible without motion)
UX-DR19: ProjectDetail (MDX case study) layout: structured sections — problem statement, approach, result, tech stack badges, optional code snippets with syntax highlighting; prose max-width 680px; scannable in < 15 seconds

### FR Coverage Map

| FR   | Epic                     | Domain                                       |
| ---- | ------------------------ | -------------------------------------------- |
| FR1  | Epic 3                   | Bio & intro content                          |
| FR2  | Epic 3                   | Projects listing with cards                  |
| FR3  | Epic 4                   | Project detail (MDX case study)              |
| FR4  | Epic 3                   | Skills proficiencies                         |
| FR5  | Epic 3                   | Experience & education                       |
| FR6  | Epic 2 + Epic 5          | Section navigation (basic → command palette) |
| FR7  | Epic 2                   | Custom domain + Vercel deployment            |
| FR8  | Epic 2                   | Mobile navigation                            |
| FR9  | Epic 7                   | PDF export trigger                           |
| FR10 | Epic 7                   | QR code in PDF                               |
| FR11 | Epic 7                   | Configurable canonical URL for QR            |
| FR12 | Epic 7                   | Re-export on demand                          |
| FR13 | Epic 1                   | Structured data files (JSON/MDX schema)      |
| FR14 | Epic 1 + Epic 4          | Content changes via build cycle              |
| FR15 | Epic 1 + Epic 7          | Shared data source (web + PDF)               |
| FR16 | Epic 3                   | Contact mechanism                            |
| FR17 | Epic 2                   | Social/GitHub footer links                   |
| FR18 | Epic 1 + Epic 2 + Epic 3 | Coding-vibe aesthetic                        |
| FR19 | Epic 6                   | Micro-animations                             |
| FR20 | Epic 6                   | `prefers-reduced-motion`                     |
| FR21 | Epic 2 + Epic 3          | Responsive layout                            |
| FR22 | Epic 2 + Epic 5          | Keyboard navigation                          |
| FR23 | Epic 3                   | ARIA / alt text                              |
| FR24 | Epic 8                   | Page metadata                                |
| FR25 | Epic 8                   | Open Graph tags                              |
| FR26 | Epic 8                   | Sitemap + robots.txt                         |
| FR27 | Epic 8                   | Person schema                                |

## Epic List

### Epic 1: Project Foundation & Design System

Owner has a running Next.js 16 project with the full design system established — brand tokens, typography, spacing, data schema, and TypeScript types — so every subsequent epic builds on a consistent, brand-aligned foundation.
**FRs covered:** FR13, FR14 (partial), FR18 (partial)
**NFRs covered:** NFR17, NFR18, NFR19, NFR20
**Architecture:** ARC1–ARC10
**UX Design:** UX-DR1, UX-DR2, UX-DR3, UX-DR4, UX-DR5, UX-DR12, UX-DR13, UX-DR15

### Epic 2: Portfolio Shell & Core Navigation

Visitors can land on the deployed portfolio and navigate between all sections — the page frame (StatusStripe, NavBar, Footer/status bar, SectionLayout) is in place, the site is live on Vercel with a custom domain, and mobile navigation works.
**FRs covered:** FR6, FR7, FR8, FR17, FR21, FR22 (partial), FR23 (partial)
**NFRs covered:** NFR6 (partial), NFR12 (partial), NFR13, NFR14
**UX Design:** UX-DR6, UX-DR7, UX-DR16

### Epic 3: Core Portfolio Content

Visitors can read BaoBao's full story — hero section, projects listing with cards and badges, About page (bio, skills, experience, education), and Contact page are content-complete and publicly accessible.
**FRs covered:** FR1, FR2, FR4, FR5, FR16, FR18 (full), FR21, FR22 (partial), FR23
**NFRs covered:** NFR1, NFR2, NFR3, NFR9, NFR10, NFR16
**UX Design:** UX-DR8, UX-DR10, UX-DR11

### Epic 4: Project Case Studies (MDX Deep-Dives)

Visitors can explore individual project case studies in depth — each project has a structured page with problem, approach, result, tech stack, and optional code snippets, powered by MDX.
**FRs covered:** FR3, FR14, FR15 (partial)
**UX Design:** UX-DR19

### Epic 5: Developer Experience Layer (Command Palette)

Developer-audience visitors can navigate via ⌘K command palette with instant fuzzy search across all pages and projects, and keyboard shortcuts (G+P, G+A, G+C, `?` overlay) — the defining developer-native delight moment.
**FRs covered:** FR6 (enhanced), FR22 (enhanced)
**NFRs covered:** NFR12 (enhanced)
**UX Design:** UX-DR9

### Epic 6: Animation & Craft Layer

The portfolio communicates craft through purposeful motion — scroll-triggered entrance animations (GSAP), page transitions (Framer Motion), hover reveals on project cards — all fully accessible via `prefers-reduced-motion` compliance.
**FRs covered:** FR19, FR20
**NFRs covered:** NFR5, NFR11
**UX Design:** UX-DR13 (implementation), UX-DR14, UX-DR17, UX-DR18

### Epic 7: CV Export & QR Bridge

Owner can export a print-ready PDF CV with an embedded QR code that dynamically sources the live canonical portfolio URL — bridging paper CV screening directly to the digital portfolio. Re-exportable on demand.
**FRs covered:** FR9, FR10, FR11, FR12, FR15
**NFRs covered:** NFR4, NFR6 (full), NFR8, NFR15

### Epic 8: SEO & Discoverability

The portfolio is discoverable via name-based search, renders rich link previews when shared on social/messaging platforms, and is correctly indexed by search engines with a sitemap and Person schema.
**FRs covered:** FR24, FR25, FR26, FR27
**NFRs covered:** NFR7

---

## Epic 1: Project Foundation & Design System

Owner has a running Next.js 16 project with the full design system established — brand tokens, typography, spacing, data schema, and TypeScript types — so every subsequent epic builds on a consistent, brand-aligned foundation that never needs to be retrofitted.

### Story 1.1: Project Initialization & Tooling Setup

As the **owner (BaoBao)**,
I want the Next.js 16 project scaffolded with all dependencies installed and tooling configured,
So that every subsequent story has a consistent, correctly-configured foundation to build upon.

**Acceptance Criteria:**

**Given** I run the init command
**When** `pnpm create next-app@latest my-portfolio --typescript --tailwind --eslint --app --src-dir --use-pnpm --import-alias "@/*"` completes
**Then** the project builds successfully with `pnpm build` and `pnpm dev` starts without errors

**Given** the project is initialized
**When** post-init dependencies are installed
**Then** `pnpm add gsap framer-motion cmdk @react-pdf/renderer qrcode` and `pnpm add -D prettier eslint-config-prettier @types/qrcode prettier-plugin-tailwindcss` are installed without peer dependency conflicts

**Given** the project has Prettier installed
**When** `.prettierrc` is created
**Then** it includes `{ "plugins": ["prettier-plugin-tailwindcss"] }` and `eslint.config.mjs` extends `eslint-config-prettier` to disable conflicting rules

**Given** the project runs in production
**When** `next.config.ts` is configured
**Then** Content Security Policy headers are set that allow Vercel domains and block inline scripts; HTTPS is enforced via Vercel deployment settings

**Given** the project needs the canonical URL
**When** `.env.local` is created
**Then** it contains `NEXT_PUBLIC_SITE_URL=http://localhost:3000`; `.env.example` documents `NEXT_PUBLIC_SITE_URL=https://your-domain.com` with a comment explaining its purpose (QR generation, OG tags, sitemap)

---

### Story 1.2: Tailwind Design Token Layer

As the **owner**,
I want all brand design tokens configured in Tailwind so every component uses the same colors, typography, spacing, and motion values,
So that the coding-vibe aesthetic is consistent and cannot drift between components.

**Acceptance Criteria:**

**Given** `tailwind.config.ts` is configured
**When** a component uses the custom color utilities
**Then** the exact hex values are applied: `--bg-primary: #0A0A0F`, `--bg-secondary: #12121A`, `--bg-tertiary: #1A1A25`, `--border-subtle: #2A2A3A`, `--border-active: #3A3A50`

**Given** the accent color system is configured
**When** accent tokens are used
**Then** `--accent: #00DC82`, `--accent-hover: #00FF96`, `--accent-muted: #00DC8220` (12% opacity) are available; semantic colors `--warning: #FFB224`, `--error: #FF6B6B`, `--info: #60A5FA` are configured

**Given** the text hierarchy is configured
**When** text tokens are applied
**Then** `--text-primary: #E8E8ED`, `--text-secondary: #A0A0B0`, `--text-tertiary: #6B6B80`, `--text-muted: #45455A` all achieve their documented contrast ratios (15.2:1, 8.1:1, 4.6:1 respectively on `--bg-primary`)

**Given** Geist Mono is loaded via `next/font`
**When** the typography scale is applied
**Then** font sizes hero (56px/3.5rem), h1 (42px/2.625rem), h2 (32px/2rem), h3 (24px/1.5rem), body (16px), small (14px), xs (12px) are available as Tailwind utilities; letter-spacing values -0.03em (hero), -0.02em (headings), 0.04em (badges) are configured

**Given** the spacing scale is configured
**When** spacing utilities are used
**Then** `--space-1` (4px) through `--space-32` (128px) increments are all available as Tailwind tokens; the 4px base grid is the only spacing source used throughout

**Given** the motion token system is configured
**When** animated elements use Tailwind transition utilities
**Then** timing values 150ms (micro), 250ms (transition), 400ms (entrance) are available; `motion-reduce:` variant is functional and suppresses all animated elements site-wide when OS reduces motion

**Given** `globals.css` is configured
**When** the app loads
**Then** `@tailwind base/components/utilities` directives are present; all CSS custom properties are declared in `:root`; default dark background is applied to `<html>` with no flash of white on first paint

---

### Story 1.3: Content Data Schema, TypeScript Interfaces & Seed Data

As the **owner**,
I want all content types defined as TypeScript interfaces and seeded with realistic placeholder data,
So that every subsequent story can build UI against real, typed data without fictional assumptions.

**Acceptance Criteria:**

**Given** the TypeScript interfaces are created in `src/types/`
**When** a data file is loaded via `src/lib/data.ts`
**Then** `Project`, `ProjectMeta`, `Experience`, `Education`, `Skill`, `SkillCategory`, `SiteConfig`, and `NavigationItem` interfaces exist; the TypeScript compiler enforces schema compliance at build time; `any` type usage causes a build error via `strict: true` in `tsconfig.json`

**Given** the JSON data files exist in `data/`
**When** `src/lib/data.ts` loads them
**Then** `data/site.json` (canonical URL, name, social links, email, availability status), `data/projects.json` (min 2 seed projects with all required fields), `data/experience.json` (min 1 entry), `data/skills.json` (min 3 categories), `data/education.json` (min 1 entry) all parse without TypeScript errors

**Given** the canonical URL is needed by multiple consumers (QR generation, OG tags, sitemap)
**When** `NEXT_PUBLIC_SITE_URL` is set in the environment
**Then** `src/lib/data.ts` uses `process.env.NEXT_PUBLIC_SITE_URL` as the canonical URL source (not from `site.json`); `data/site.json` stores owner name, social links, availability, and other metadata; no URL string is hardcoded anywhere in the codebase

**Given** the data schema is complete
**When** a developer opens any JSON file in `data/`
**Then** every field has an inline comment or a `data/README.md` explaining what to edit, valid formats, and which fields are required vs optional (NFR20)

**Given** `src/lib/data.ts` exports typed functions
**When** a Server Component calls `getProjects()`, `getExperience()`, `getSkills()`, or `getSiteConfig()`
**Then** each function returns the correctly typed array or object; no `any` casts are present in `lib/data.ts`

---

### Story 1.4: SectionLayout Component

As a **visitor**,
I want every page section to have consistent structure, spacing, and the coding-vibe `// comment` label,
So that the portfolio feels like one coherent design system rather than isolated pages.

**Acceptance Criteria:**

**Given** `SectionLayout` is rendered with a `label` and `id` prop
**When** it renders on any viewport
**Then** the `// {label}` comment-style heading appears in `--text-tertiary` color using Geist Mono; section content is constrained to max-width 1120px; vertical padding uses values from the spacing scale

**Given** `SectionLayout` is rendered with a `prose` boolean prop
**When** long-form content renders inside it
**Then** inner content max-width is 680px for optimal monospace reading line length

**Given** a keyboard user tabs through the page
**When** the skip-to-main-content link is the first focusable element
**Then** it resolves to the `id="main-content"` anchor; section `id` props are usable as anchor link targets

**Given** `SectionLayout` renders on mobile (< 768px)
**When** the viewport is 320px wide
**Then** horizontal padding ensures no content overflow; `// comment` labels do not truncate or wrap awkwardly

---

## Epic 2: Portfolio Shell & Core Navigation

Visitors can land on the deployed portfolio and navigate between all sections — the page frame (StatusStripe, NavBar, Footer/status bar, SectionLayout) is in place, the site is live on Vercel with a custom domain, and mobile navigation works.

### Story 2.1: Root Layout, StatusStripe & NavBar

As a **visitor**,
I want a persistent navigation bar and top status stripe visible on every page,
So that I always know where I am and can navigate to any section instantly.

**Acceptance Criteria:**

**Given** the root `layout.tsx` is rendered
**When** any page loads
**Then** `StatusStripe` renders at the top with `● open to work` availability dot (accent green) and a `⌘K` hint text on desktop (hidden on mobile); `NavBar` renders below it with `bao.dev` logo (accent-colored period) and links: Projects, About, Contact

**Given** the NavBar renders on desktop (> 1024px)
**When** a visitor views the page
**Then** the logo and 3 nav links are visible inline; no hamburger or collapsed state

**Given** the NavBar renders on mobile (< 768px)
**When** a visitor views the page
**Then** the logo is visible; a minimal menu icon reveals the 3 nav links; the menu opens/closes cleanly without layout shift

**Given** a keyboard user navigates the NavBar
**When** they tab through it
**Then** each nav link receives a `focus-visible` ring (`2px solid var(--accent)` with 2px offset); the active page link has a visible active state; focus order is logo → nav links → main content

**Given** `NavBar` is implemented
**When** the component tree is inspected
**Then** `"use client"` is only on the mobile menu toggle wrapper, not on the `NavBar` itself

---

### Story 2.2: Footer Status Bar

As a **visitor (developer audience)**,
I want a VS Code-style status bar at the bottom of the page,
So that I encounter the developer Easter egg that signals craft and attention to detail.

**Acceptance Criteria:**

**Given** the `Footer` component renders on desktop (> 1024px)
**When** a developer-audience visitor views the bottom of any page
**Then** a status bar renders showing: branch name (e.g. `main`), framework (`Next.js 16`), CSS version (`Tailwind v4`), encoding (`UTF-8`), and a green availability dot — styled as a VS Code status bar in `--bg-secondary` background

**Given** the `Footer` renders on mobile (< 768px)
**When** a visitor views the page
**Then** the status bar footer is hidden; social/GitHub links from `data/site.json` are accessible via a minimal mobile footer (FR17)

**Given** `Footer` reads from `data/site.json`
**When** the site config changes
**Then** the status bar content updates from data — no hardcoded strings in the component (NFR19)

**Given** footer social links are rendered
**When** a visitor clicks a social link
**Then** it opens in a new tab (`target="_blank" rel="noopener noreferrer"`); each icon-only link has a descriptive ARIA label (FR23)

---

### Story 2.3: Page Shell with Empty Section Stubs & Vercel Deployment

As the **owner**,
I want all four pages (Home, Projects, About, Contact) to exist as deployed, navigable stubs on a live Vercel URL,
So that the site is publicly accessible with a stable canonical URL before any content is added.

**Acceptance Criteria:**

**Given** the App Router pages exist
**When** a visitor navigates to `/`, `/projects`, `/about`, `/contact`
**Then** each page renders within the root layout with a placeholder `SectionLayout` stub; no 404 errors on any of these routes

**Given** the site is deployed to Vercel
**When** a push to `main` is made
**Then** Vercel auto-deploys to the production URL; `NEXT_PUBLIC_SITE_URL` is set to the custom domain in Vercel environment variables; the custom domain resolves with HTTPS (NFR17)

**Given** the canonical URL is established
**When** `process.env.NEXT_PUBLIC_SITE_URL` is read anywhere in the codebase
**Then** it returns the live production URL on Vercel and `http://localhost:3000` locally; no page hardcodes the domain string

**Given** a visitor navigates to a non-existent route
**When** the 404 page renders
**Then** `not-found.tsx` displays a terminal-style error message with `--error` accent color, a link to `/projects`, and a link to contact — reinforcing the coding aesthetic on error (UX-DR16)

**Given** the site loads on mobile (QR scan scenario)
**When** a recruiter scans the QR code and lands on the home page
**Then** First Contentful Paint completes in < 1.5s; the dark background renders immediately with no flash of white; CLS < 0.1 (NFR1, NFR3)

---

## Epic 3: Core Portfolio Content

Visitors can read BaoBao's full story — the hero section, projects listing with cards and badges, About page (bio, skills, experience, education), and Contact page are all content-complete and publicly accessible.

### Story 3.1: Badge Component

As a **visitor**,
I want to instantly read the technology stack of any project via visual pill tags,
So that I can assess technical fit in seconds without reading a description.

**Acceptance Criteria:**

**Given** `Badge` is rendered with a `label` prop
**When** it appears on a project card or detail page
**Then** it displays in Geist Mono at `--text-xs` size (12px), letter-spacing `0.04em`, `--accent-muted` background (12% opacity), with 4px border-radius; the tag is readable at a glance

**Given** multiple `Badge` components render in a row
**When** they wrap to a new line on narrow viewports
**Then** they wrap cleanly without overflow or clipping; gap between badges uses `--space-2` (8px)

**Given** a `Badge` receives an optional `category` prop
**When** rendered
**Then** badges from different categories (language vs framework vs tool) can have subtle color variations via predefined category-to-color mappings in the component

---

### Story 3.2: Hero Section

As a **visitor arriving via QR scan**,
I want to immediately see who BaoBao is and what they do above the fold,
So that I form the "high-craft developer" impression within 3 seconds before scrolling.

**Acceptance Criteria:**

**Given** the home page (`/`) renders
**When** a visitor lands on it
**Then** the hero section displays: `// hello world` section label, BaoBao's name at hero scale (56px desktop / 36px mobile), a one-line value proposition tagline, and two CTAs — [View Projects] and [Download CV] — side-by-side on desktop, stacked vertically on mobile (UX-DR8)

**Given** the hero renders on mobile (< 768px)
**When** a recruiter scans the QR and lands on mobile
**Then** all hero content is visible above the fold on a 375px viewport without scrolling; CTAs are touch-target sized (min 44px height) (UX-DR3)

**Given** the [View Projects] CTA is clicked
**When** the click/tap fires
**Then** the visitor is scrolled or navigated to the `// selected work` projects section

**Given** the hero content is sourced from data
**When** `getSiteConfig()` is called
**Then** the owner's name, tagline, and availability status are read from `data/site.json` — no hardcoded strings in the component (NFR19)

**Given** the hero renders with no images
**When** the page loads
**Then** no image requests block First Contentful Paint; typography alone carries the aesthetic (NFR1)

---

### Story 3.3: ProjectCard Component & Projects Section

As a **visitor (recruiter or freelance client)**,
I want to scan a curated list of projects with title, tech stack, and outcome at a glance,
So that I can identify relevant work and choose which project to explore in under 5 seconds.

**Acceptance Criteria:**

**Given** the projects section renders on the home page and `/projects` page
**When** a visitor views it
**Then** the `// selected work` section label appears; project cards display in a 2-column grid on desktop/tablet, single column on mobile; each card shows title, one-line description, and `Badge` components for the tech stack (UX-DR5, UX-DR10)

**Given** a `ProjectCard` is rendered with project data
**When** a visitor reads it
**Then** the card is scannable in < 3 seconds: title in h3 scale, description in body text, tech stack badges below, inside `--bg-secondary` background with `--border-subtle` border; entire card is a clickable link to the project detail page

**Given** a visitor hovers a `ProjectCard` on desktop
**When** hover state activates
**Then** the card border transitions to `--border-active`; background shifts to `--bg-tertiary`; transition uses the 150ms micro timing token; hover effect is suppressed under `prefers-reduced-motion` (UX-DR17)

**Given** project cards render
**When** the page is inspected for accessibility
**Then** each card link has a descriptive `aria-label` including the project name; cards are keyboard focusable with visible focus ring (FR22, FR23, NFR12)

**Given** project data is loaded
**When** `getProjects()` returns the array
**Then** projects with `isFeatured: true` appear on the home page; all projects appear on `/projects`; order follows data file order (NFR19)

---

### Story 3.4: About Page (Bio, Skills & Experience)

As a **visitor (recruiter or freelance client)**,
I want to read BaoBao's professional bio, skills, and work history on a single scannable page,
So that I can assess seniority, technical range, and career narrative in one visit.

**Acceptance Criteria:**

**Given** a visitor navigates to `/about`
**When** the page renders
**Then** it contains three `SectionLayout` sections: `// about` (bio), `// skills`, `// experience & education` — each with clear visual separation; the page has a unique title and meta description (FR24)

**Given** the bio section renders
**When** a visitor reads it
**Then** BaoBao's professional introduction is displayed in body text at 16px with 1.6 line height; text is left-aligned; content is sourced from `data/site.json`

**Given** the skills section renders
**When** a visitor scans it
**Then** skills are grouped by category from `data/skills.json` with category headings in h3 scale; individual skills render as `Badge` components; the section is scannable without reading every word

**Given** the experience section renders
**When** a visitor reads it
**Then** work experience entries from `data/experience.json` display in reverse-chronological order: company, role, date range, and description; education entries from `data/education.json` appear below; dates use `Intl.DateTimeFormat` (never manually formatted strings)

**Given** the owner updates `data/experience.json` or `data/skills.json` and redeploys
**When** the About page loads
**Then** it reflects the new content with zero component code changes (NFR19)

---

### Story 3.5: Contact Page

As a **visitor ready to reach out**,
I want a frictionless way to contact BaoBao from any page,
So that the conversion action is never more than 2 clicks away.

**Acceptance Criteria:**

**Given** a visitor navigates to `/contact`
**When** the page renders
**Then** it shows the `// contact` section label, BaoBao's email as a visible mailto link, and social profile links from `data/site.json`; the page has a unique title and meta description (FR24)

**Given** a visitor clicks the email link
**When** the click fires
**Then** the visitor's default email client opens with `to:` pre-filled with BaoBao's email; no tracking parameters are appended (NFR16)

**Given** the contact page renders on mobile
**When** a visitor arrives via QR scan and taps contact
**Then** the email link is touch-target sized (min 44px); social links are clearly visible and tappable; no form fields are required

**Given** contact information is sourced from data
**When** `getSiteConfig()` is called
**Then** email and social links are read from `data/site.json` — updating the data file updates the contact page with no component changes (NFR19)

**Given** social/contact links render
**When** accessibility is checked
**Then** all icon-only links have ARIA labels; external links open in new tabs with `rel="noopener noreferrer"` (FR23)

---

## Epic 4: Project Case Studies (MDX Deep-Dives)

Visitors can explore individual project case studies in depth — each project has a structured page with problem, approach, result, tech stack, and optional code snippets, powered by MDX.

### Story 4.1: MDX Processing Infrastructure

As the **owner**,
I want MDX files in `content/projects/` to be processed and available as typed data,
So that I can write project case studies in markdown with frontmatter and have them render as structured pages without touching component code.

**Acceptance Criteria:**

**Given** an MDX file exists at `content/projects/[slug].mdx`
**When** `src/lib/mdx.ts` processes it
**Then** the frontmatter (title, slug, description, techStack, outcome, date) is parsed and returned as a typed `ProjectMeta` object; the MDX body is available as renderable React content

**Given** `lib/mdx.ts` exports `getAllProjectSlugs()` and `getProjectBySlug(slug)`
**When** called from a Server Component
**Then** `getAllProjectSlugs()` returns an array of slug strings matching filenames in `content/projects/`; `getProjectBySlug(slug)` returns the full project data and compiled MDX content

**Given** MDX frontmatter is validated
**When** a required field (e.g. `title` or `slug`) is missing
**Then** the TypeScript interface enforces the shape at build time; a missing required field causes a build error rather than a silent runtime failure

**Given** at least one seed MDX file exists (`content/projects/sample-project.mdx`)
**When** the project is built
**Then** `pnpm build` completes without errors and the slug is resolvable via the detail page route

---

### Story 4.2: Project Detail Page

As a **visitor (recruiter or freelance client)**,
I want to read a structured case study for each project,
So that I can understand the problem BaoBao solved, how they approached it, and what the result was — in under 15 seconds of scanning.

**Acceptance Criteria:**

**Given** a visitor navigates to `/projects/[slug]`
**When** the page renders
**Then** the project detail page shows: project title at h1 scale, tech stack `Badge` components, and the MDX body rendered with the `ProjectDetail` layout (UX-DR19)

**Given** the MDX body renders
**When** a visitor scans the case study
**Then** content is structured with visible section headings: Problem, Approach, Result; prose is constrained to max-width 680px for comfortable monospace reading; the page is scannable in < 15 seconds

**Given** the MDX body contains a code block
**When** it renders
**Then** the code block has syntax highlighting compatible with the dark palette; code is readable against `--bg-secondary` background

**Given** Next.js static generation runs
**When** `generateStaticParams()` is called for `/projects/[slug]`
**Then** all slugs from `getAllProjectSlugs()` are pre-rendered as static pages at build time; no server runtime is required to serve project pages

**Given** a visitor navigates to a project slug that does not exist
**When** the page would render
**Then** `notFound()` is called and the custom 404 page renders with terminal-style messaging (UX-DR16)

**Given** the page renders
**When** the `<head>` is inspected
**Then** the page has a unique `<title>` combining the project name and site name, a unique meta description from MDX frontmatter, and a canonical URL (FR24)

---

## Epic 5: Developer Experience Layer (Command Palette)

Developer-audience visitors can navigate via ⌘K command palette with instant fuzzy search across all pages and projects, and keyboard shortcuts (G+P, G+A, G+C, `?` overlay) — the defining developer-native delight moment.

### Story 5.1: Command Palette Component (⌘K)

As a **developer-audience visitor**,
I want to open a fuzzy-search command palette with ⌘K / Ctrl+K,
So that I can navigate anywhere on the portfolio instantly without touching the mouse — the way I navigate my actual tools.

**Acceptance Criteria:**

**Given** a visitor presses ⌘K (macOS) or Ctrl+K (Windows/Linux) on any page
**When** the key combination fires
**Then** the `CommandPalette` overlay opens centered on the viewport with a search input auto-focused; the overlay has `--bg-secondary` background, `--border-subtle` border, and a backdrop behind it

**Given** the command palette is open and the visitor types a query
**When** characters are entered
**Then** results from a pre-built index (pages: Home, Projects, About, Contact; all project titles and slugs from `getProjects()`) are filtered using fuzzy matching via `cmdk`; results appear instantly with no async delay (index loaded at build time via root layout)

**Given** a result is highlighted and Enter is pressed
**When** the action fires
**Then** the visitor navigates to the selected page or project URL; the command palette closes

**Given** the command palette is open
**When** the visitor presses Escape
**Then** the palette closes and focus returns to the previously focused element

**Given** the command palette is open
**When** inspected for accessibility
**Then** it has `role="dialog"`, `aria-modal="true"`, and an `aria-label`; focus is trapped inside the overlay while open (NFR12)

**Given** the `CommandPalette` component is implemented
**When** the component tree is inspected
**Then** `"use client"` is on `CommandPalette` only; the root layout passes the pre-built content index as a prop from a Server Component; no data fetching occurs inside the palette at runtime

---

### Story 5.2: Keyboard Navigation Shortcuts

As a **developer-audience visitor**,
I want keyboard shortcuts (G+P, G+A, G+C) to jump directly to portfolio sections,
So that I can navigate the portfolio at the speed of thought — the way I navigate GitHub or Linear.

**Acceptance Criteria:**

**Given** a visitor presses `G` then `P` in sequence (no input focused)
**When** the shortcut fires
**Then** the visitor is navigated to `/projects`

**Given** a visitor presses `G` then `A` (no input focused)
**When** the shortcut fires
**Then** the visitor is navigated to `/about`

**Given** a visitor presses `G` then `C` (no input focused)
**When** the shortcut fires
**Then** the visitor is navigated to `/contact`

**Given** a visitor presses `?` (no input focused)
**When** the shortcut fires
**Then** a help overlay appears listing all available keyboard shortcuts in a clean table; pressing `?` or Escape closes it

**Given** a visitor is typing in an input or textarea
**When** any shortcut key fires
**Then** no navigation occurs — shortcuts are suppressed when focus is inside a text input

**Given** the ⌘K badge hint is implemented (UX-DR9)
**When** section headers render on desktop
**Then** a subtle `⌘K` badge appears near the `// selected work` section label; the hint is hidden on mobile (keyboard-only feature)

---

## Epic 6: Animation & Craft Layer

The portfolio communicates craft through purposeful motion — scroll-triggered entrance animations (GSAP), page transitions (Framer Motion), hover reveals on project cards — all fully accessible via `prefers-reduced-motion` compliance.

### Story 6.1: Reduced Motion Infrastructure & useReducedMotion Hook

As a **visitor with motion sensitivity**,
I want all animations to be suppressed when I have `prefers-reduced-motion` enabled,
So that I can browse the portfolio comfortably without vestibular discomfort — and the site is fully usable without any motion.

**Acceptance Criteria:**

**Given** `src/hooks/useReducedMotion.ts` is implemented
**When** the hook is called inside any client component
**Then** it returns `true` when the OS `prefers-reduced-motion: reduce` media query matches, and `false` otherwise; the hook re-evaluates if the OS setting changes mid-session

**Given** Tailwind's `motion-reduce:` variant is applied to every animated element
**When** `prefers-reduced-motion` is enabled
**Then** all CSS transitions and animations are suppressed (duration set to `0ms` or `1ms`) with no exceptions across the entire site (NFR11)

**Given** GSAP ScrollTrigger animations use `gsap.matchMedia()`
**When** `prefers-reduced-motion` is enabled
**Then** all GSAP timelines are skipped entirely; content renders in its final visible state immediately without any entrance animation

**Given** Framer Motion page transitions use `useReducedMotion()`
**When** the hook returns `true`
**Then** `AnimatePresence` transitions are instant (duration 0) or a simple 150ms opacity-only fade at most; no position or scale transforms occur

**Given** no animation is load-bearing
**When** a visitor browses with all motion disabled
**Then** every piece of content is fully visible and readable; no content is hidden behind an animation that never fires

---

### Story 6.2: GSAP Scroll-Triggered Entrance Animations

As a **visitor**,
I want content sections to animate into view as I scroll,
So that the portfolio feels alive and crafted rather than a static document dump.

**Acceptance Criteria:**

**Given** `AnimatedSection` client wrapper is implemented using `useGSAP` hook
**When** a section scrolls into the viewport
**Then** the content fades in and translates up (e.g. `y: 24 → 0`, `opacity: 0 → 1`) over 400ms with `ease-out` easing; the ScrollTrigger fires once per section (not on every scroll pass)

**Given** project cards in the grid animate on scroll
**When** the `// selected work` section enters the viewport
**Then** cards stagger in sequentially (e.g. 80ms delay between cards) creating a cascade effect; stagger is suppressed under `prefers-reduced-motion`

**Given** `AnimatedSection` wraps server-rendered content
**When** the component tree is inspected
**Then** `"use client"` is only on `AnimatedSection`, not on any parent page or layout; GSAP is never imported in a Framer Motion component

**Given** animations run on mid-range hardware
**When** scroll animations fire
**Then** all animation frames target 60fps; no jank is perceptible on a mid-range mobile device (NFR5)

---

### Story 6.3: Framer Motion Page Transitions

As a **visitor navigating between pages**,
I want smooth route transitions that feel intentional,
So that moving between Home, Projects, About, and Contact feels like a cohesive application rather than a series of hard page loads.

**Acceptance Criteria:**

**Given** `PageTransition` client wrapper uses Framer Motion `AnimatePresence`
**When** a visitor navigates between any two routes
**Then** the outgoing page fades out and the incoming page fades in over 200–300ms with `ease-in-out` easing; the transition is perceptible but never feels slow

**Given** `PageTransition` wraps the root layout children
**When** the component tree is inspected
**Then** `"use client"` is only on `PageTransition`; Framer Motion is never imported alongside GSAP in the same component file

**Given** `prefers-reduced-motion` is enabled
**When** a route transition fires
**Then** the transition is instant (0ms) or a maximum 150ms opacity-only fade; no position or scale transforms occur

**Given** page transitions run
**When** Lighthouse performance audit is run
**Then** Total Blocking Time remains < 200ms; Framer Motion bundle is not imported on the server; `"use client"` boundary prevents server-side loading (NFR3)

---

### Story 6.4: Hover Micro-interactions & Project Card Hover Reveal

As a **desktop visitor browsing projects**,
I want project cards to respond to hover with subtle visual feedback and reveal additional context,
So that the portfolio feels interactive and rewards attentive browsing.

**Acceptance Criteria:**

**Given** a visitor hovers over a `ProjectCard` on desktop
**When** the hover state activates
**Then** border transitions from `--border-subtle` to `--border-active`; background shifts from `--bg-secondary` to `--bg-tertiary`; the 150ms micro timing token governs the transition; implemented via Tailwind `group-hover:` utilities (no GSAP or Framer needed for simple hover states)

**Given** hover reveal is implemented (UX-DR17)
**When** a visitor hovers a card on desktop
**Then** additional context (e.g. project date, brief outcome summary) becomes visible via an opacity/height transition; this content is visually hidden by default (not `display: none` — screen readers can still access it)

**Given** `prefers-reduced-motion` is enabled
**When** a visitor hovers any element
**Then** hover transitions are instant (transition-duration `0ms`); reveal content is visible immediately without animation

**Given** the hover interactions are mobile
**When** a visitor views cards on a touch device
**Then** hover states do not apply; all card information (including the hover-reveal content) is visible by default on mobile (UX-DR10)

---

## Epic 7: CV Export & QR Bridge

Owner can export a print-ready PDF CV with an embedded QR code that dynamically sources the live canonical portfolio URL — bridging paper CV screening directly to the digital portfolio. Re-exportable on demand.

### Story 7.1: QR Code Generation Utility

As the **owner**,
I want a utility that generates a QR code data URL from the canonical portfolio URL,
So that the QR code in the exported PDF always points to the live site — never a stale or hardcoded address.

**Acceptance Criteria:**

**Given** `src/lib/qr.ts` exports `generateQRDataURL(url: string): Promise<string>`
**When** called with `process.env.NEXT_PUBLIC_SITE_URL`
**Then** it returns a base64 PNG data URL suitable for embedding as an `<Image>` src in `@react-pdf/renderer`; the QR code resolves correctly when scanned with a phone camera

**Given** `NEXT_PUBLIC_SITE_URL` changes (e.g. domain update)
**When** the PDF is re-exported
**Then** the new URL is encoded in the QR code; no URL string is hardcoded in `qr.ts` or any CV component

**Given** the QR generation call fails
**When** an error occurs in the `qrcode` library
**Then** the error is caught and propagated to the PDF generation layer with a descriptive message; the PDF generation does not silently produce a blank QR code

**Given** `qr.ts` is a utility module
**When** the module is inspected
**Then** it has no UI imports; it is a pure async function usable from any client or server context; it uses the `qrcode` npm package (not a CDN script)

---

### Story 7.2: CV PDF Document Components

As the **owner**,
I want the CV PDF to be composed of typed `@react-pdf/renderer` components that read from the same JSON data as the website,
So that the PDF and portfolio website are always in sync — one data source, two surfaces.

**Acceptance Criteria:**

**Given** `src/components/cv/CVDocument.tsx` is implemented using `@react-pdf/renderer`
**When** it renders
**Then** it reads `Experience[]`, `Skill[]`, `Education[]`, and `SiteConfig` from the shared `data/*.json` files via typed data functions; no content is hardcoded in the PDF components

**Given** `CVDocument` includes a QR code section
**When** the PDF renders
**Then** the QR code image (from `generateQRDataURL`) is embedded as a `<Image>` element in the PDF footer or header with an appropriate size (min 80px × 80px) and a label "Scan to view live portfolio"

**Given** the PDF is exported
**When** printed on A4 and US Letter paper sizes
**Then** the layout does not overflow page boundaries; margins are print-safe (min 15mm); all content fits within a single page for a concise CV (NFR15)

**Given** the CV components are in `src/components/cv/`
**When** the component tree is inspected
**Then** CV components (`CVDocument`, `CVHeader`, `CVSection`) are isolated from web UI components; no web-only Tailwind classes or browser APIs are used inside CV components

**Given** the data schema is the single source of truth
**When** `data/experience.json` is updated and a new PDF is exported
**Then** the new experience entry appears in the PDF with no changes to any CV component (FR15, NFR19)

---

### Story 7.3: CV Download Button & Client-Side Export

As the **owner**,
I want a "Download CV" button on the portfolio that triggers client-side PDF generation and download,
So that I can export a fresh, up-to-date CV with a working QR code at any time without a build step.

**Acceptance Criteria:**

**Given** `CVDownloadButton` is rendered on the home page hero and/or an About/CV page
**When** a visitor or owner clicks "Download CV"
**Then** `@react-pdf/renderer`'s `pdf()` function is called client-side; a download is triggered with a filename like `BaoBao-CV.pdf`; the button shows a "Generating..." loading state during generation (NFR4)

**Given** the PDF generation starts
**When** it completes
**Then** PDF generation finishes within 5 seconds on a modern desktop browser; the downloaded file opens correctly in standard PDF viewers (NFR4, NFR8)

**Given** the "Download CV" button is on mobile
**When** a mobile visitor taps it
**Then** the button displays a "View on desktop to download" message instead of triggering PDF generation; client-side PDF generation is desktop-only (per UX spec)

**Given** PDF generation fails
**When** an error is caught in the try/catch around `pdf()`
**Then** the button shows a user-facing error message (e.g. "Export failed — please try again"); the error is not swallowed silently

**Given** `CVDownloadButton` is a client component
**When** the component tree is inspected
**Then** `"use client"` is present; `@react-pdf/renderer` is only imported inside this client component boundary — never in a Server Component or layout file (prevents SSR errors from browser-only PDF APIs)

---

## Epic 8: SEO & Discoverability

The portfolio is discoverable via name-based search, renders rich link previews when shared on social/messaging platforms, and is correctly indexed by search engines with a sitemap and Person schema.

### Story 8.1: Per-Page Metadata & Canonical URLs

As a **visitor who shares or searches for BaoBao's portfolio**,
I want every page to have accurate title, description, and canonical URL metadata,
So that search results and link previews represent the portfolio correctly and each page is uniquely identifiable.

**Acceptance Criteria:**

**Given** `src/lib/metadata.ts` exports a `buildMetadata(page: PageMeta)` helper
**When** called from each `page.tsx`
**Then** it returns a Next.js `Metadata` object with `title`, `description`, and `canonical` populated from the page-specific values and `NEXT_PUBLIC_SITE_URL`

**Given** a visitor searches for BaoBao by name on Google
**When** the home page is indexed
**Then** the `<title>` is `BaoBao — Frontend Developer` (or equivalent from `site.json`); the meta description is a one-sentence value proposition; the canonical URL matches the live domain

**Given** each page (`/`, `/projects`, `/about`, `/contact`, `/projects/[slug]`) is rendered
**When** the `<head>` is inspected
**Then** each page has a unique `<title>` and `<meta name="description">` — no two pages share the same values (FR24)

**Given** `generateMetadata()` is used in each `page.tsx`
**When** the implementation is reviewed
**Then** metadata is generated server-side using the Next.js 16 metadata API exclusively; no `<Head>` component from `next/head` is used (incompatible with App Router)

---

### Story 8.2: Open Graph Tags & Social Preview Images

As a **visitor sharing the portfolio URL on Slack, LinkedIn, or iMessage**,
I want rich link previews with title, description, and an image,
So that the portfolio makes a strong first impression before anyone even clicks the link.

**Acceptance Criteria:**

**Given** a portfolio URL is pasted into Slack, LinkedIn, or iMessage
**When** the platform fetches the URL's metadata
**Then** `og:title`, `og:description`, `og:url`, and `og:image` tags are present and populated from `site.json` and `NEXT_PUBLIC_SITE_URL` (FR25)

**Given** a static OG image exists at `public/images/og-image.png`
**When** the `og:image` tag is resolved
**Then** it points to the absolute URL `${NEXT_PUBLIC_SITE_URL}/images/og-image.png`; the image is at least 1200×630px; it visually represents the portfolio's coding aesthetic

**Given** a project detail page is shared
**When** `og:` tags are inspected for `/projects/[slug]`
**Then** `og:title` includes the project name; `og:description` uses the project's frontmatter description; `og:image` falls back to the site-wide OG image if no project-specific image exists

**Given** `twitter:card` meta tags are included
**When** the URL is shared on X/Twitter
**Then** `twitter:card` is `summary_large_image`; `twitter:title` and `twitter:description` are populated; the card renders correctly in Twitter's card validator

---

### Story 8.3: Sitemap, Robots.txt & Person Schema

As a **search engine crawler**,
I want a sitemap, robots.txt, and structured data markup,
So that BaoBao's portfolio is correctly indexed and name-based searches surface the portfolio prominently.

**Acceptance Criteria:**

**Given** `src/app/sitemap.ts` is implemented using the Next.js file convention
**When** a crawler requests `/sitemap.xml`
**Then** it returns a valid XML sitemap containing all static routes (`/`, `/projects`, `/about`, `/contact`) plus all project detail URLs (`/projects/[slug]` for each slug from `getAllProjectSlugs()`); all URLs use the absolute `NEXT_PUBLIC_SITE_URL` base (FR26)

**Given** `src/app/robots.ts` is implemented
**When** a crawler requests `/robots.txt`
**Then** it returns `User-agent: *`, `Allow: /`, and `Sitemap: ${NEXT_PUBLIC_SITE_URL}/sitemap.xml` — no pages are disallowed (FR26)

**Given** the home page renders
**When** the `<head>` is inspected for structured data
**Then** a `<script type="application/ld+json">` tag contains a valid `Person` schema with `name`, `url`, `email`, `sameAs` (social profile URLs from `site.json`), and `jobTitle`; the schema validates without errors in Google's Rich Results Test (FR27)

**Given** the sitemap and robots files are generated
**When** `pnpm build` runs
**Then** both files are generated statically at build time using the Next.js file convention — no runtime API calls required; Vercel deploys them as static assets (NFR7)
