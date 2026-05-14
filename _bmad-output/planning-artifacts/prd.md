---
stepsCompleted:
  [
    "step-01-init",
    "step-02-discovery",
    "step-02b-vision",
    "step-02c-executive-summary",
    "step-03-success",
    "step-04-journeys",
    "step-05-domain",
    "step-06-innovation",
    "step-07-project-type",
    "step-08-scoping",
    "step-09-functional",
    "step-10-nonfunctional",
    "step-11-polish",
  ]
inputDocuments:
  - "_bmad-output/brainstorming/brainstorming-session-2026-04-28-1000.md"
workflowType: "prd"
releaseMode: "phased"
briefCount: 0
researchCount: 0
brainstormingCount: 1
projectDocsCount: 0
classification:
  projectType: "JAMstack Web App (personal portfolio)"
  domain: "Developer Personal Branding"
  complexity: "medium"
  projectContext: "greenfield"
  primaryGoal: "This person is hireable"
  primaryAudience:
    [
      "potential employers",
      "freelance clients",
      "collaborators",
      "general public",
    ]
  techStack: ["Next.js 16", "Tailwind CSS v4", "GSAP", "Framer Motion"]
---

# Product Requirements Document - MyPortfolio

**Author:** BaoBao
**Date:** 2026-04-28

## Executive Summary

BaoBao's personal portfolio is a coding-aesthetic web application built to convert -- transforming passive portfolio visitors into active hiring conversations. The primary audience is potential employers and freelance clients who encounter BaoBao first through a traditional CV screening process, then need a compelling reason to trust the craft behind the code.

The product solves a structural gap in the modern developer job search: the paper CV and the digital portfolio are disconnected surfaces that tell an inconsistent, incomplete story. This portfolio collapses that gap. The CV is exportable directly from the site as a polished PDF with an embedded QR code -- so the recruiter's paper artifact becomes a portal into the full, animated, interactive portfolio experience. One workflow, two surfaces, zero dropped threads.

Content is data-driven and owner-updatable without code changes, ensuring the portfolio remains current without deployment friction.

### What Makes This Special

Three properties differentiate this portfolio from conventional developer sites:

1. **CV <-> Portfolio feedback loop.** The PDF export with QR code bridges the recruiter paper-screening workflow directly into the digital experience -- a capability absent from virtually all developer portfolios.
2. **The site IS the proof.** Built on Next.js 16, Tailwind CSS v4, and GSAP/Framer Motion, the technical and aesthetic choices are visible to anyone who inspects the work. The container demonstrates the same craft as the content inside it.
3. **Coding-vibe aesthetic as a signal.** The UI design language -- terminal motifs, monospace typography, dark palette, precise micro-interactions -- communicates developer identity at a glance, before a single project is read.

## Project Classification

| Dimension           | Value                                                   |
| ------------------- | ------------------------------------------------------- |
| **Project Type**    | JAMstack Web App (personal portfolio)                   |
| **Domain**          | Developer Personal Branding                             |
| **Complexity**      | Medium (high craft/animation bar; multi-surface output) |
| **Project Context** | Greenfield                                              |
| **Tech Stack**      | Next.js 16, Tailwind CSS v4, GSAP / Framer Motion       |

## Success Criteria

### User Success

- **Recruiter / Employer:** Lands via QR code from PDF CV -> reads as high-craft within 10 seconds -> navigates to at least one project or the contact section. The portfolio advances the conversation further than the CV alone would.
- **Freelance Client:** Arrives via link or search -> immediately reads the coding-vibe aesthetic as intentional and professional -> initiates contact.
- **Collaborator / Peer Developer:** Discovers the site -> is impressed by the technical and aesthetic execution -> reaches out or bookmarks for reference.
- **Owner (BaoBao):** Can update portfolio content (projects, skills, experience) without code changes. CV export with QR code generates correctly on demand at any time.

### Business Success

- Portfolio generates at least one qualified inbound contact (interview request or freelance inquiry) within the first month of being shared actively.
- The CV PDF export is the primary distribution channel -- every recruiter who receives BaoBao's CV gets a QR code that works.

### Technical Success

- CV export produces a polished, print-ready PDF with a correctly generated QR code pointing to the live portfolio URL.
- Portfolio loads in under 2 seconds on desktop (Lighthouse performance score >= 90).
- Fully responsive -- mobile experience is not degraded (QR code recipients may scan on mobile, then browse on desktop).
- Content is managed via structured data files -- no component code changes required for content updates.
- Animations (GSAP / Framer Motion) do not compromise performance or accessibility (respects `prefers-reduced-motion`).

### Measurable Outcomes

| Outcome                            | Target                        | How Measured            |
| ---------------------------------- | ----------------------------- | ----------------------- |
| Recruiter QR scan -> stays on site | > 10 seconds session          | Analytics               |
| CV PDF export works correctly      | 100% of exports               | Manual + automated test |
| Content update without code change | Owner self-serve              | Manual verification     |
| First-load performance             | Lighthouse >= 90              | Lighthouse audit        |
| Inbound contact from portfolio     | >= 1 within 30 days of launch | Direct tracking         |

## User Journeys

### Journey 1: The Recruiter -- "From PDF to Proof"

_Primary User -- Happy Path_

**Meet Maya.** She's a technical recruiter at a product company, screening 40 CVs this week for a mid-senior frontend role. BaoBao's PDF lands in her inbox. It's clean -- not a wall-of-text. She skims the skills section, sees Next.js and Tailwind, notes it looks polished.

Then she notices something most CVs don't have: a QR code at the bottom. _"Scan to view live portfolio."_ Curiosity beats her afternoon slump.

She pulls out her phone, scans. The portfolio opens. It loads fast. The aesthetic is immediately distinct -- dark, code-flavored, not a generic Notion export. She's already forming a mental model: _this person cares about craft._ She taps into one project, reads a concise case write-up, and screenshots the URL to pass to the hiring manager.

Total time: 4 minutes. Outcome: BaoBao moves from "maybe" pile to "first interview" list.

**Requirements revealed:** QR code generation, fast mobile load, single-project deep-dive pages, clear contact/next-step CTA.

---

### Journey 2: The Recruiter -- "Broken QR"

_Primary User -- Edge Case / Error Recovery_

Same Maya, different day. She scans a QR code from an older printed CV. The domain has changed since BaoBao updated their hosting. The QR resolves to a 404 or wrong URL.

She shrugs and moves on.

**Requirements revealed:** The QR code must always point to a stable, canonical URL (not a Vercel preview URL). The PDF export must regenerate with the current live URL -- not a hardcoded one from months ago. Owner must be able to re-export CV after a domain change.

---

### Journey 3: The Freelance Client -- "Can This Person Build What I Need?"

_Secondary User -- Happy Path_

**Meet Liam.** He runs a small SaaS and needs a freelance developer to build a dashboard. A mutual contact sends him BaoBao's portfolio link directly.

He's on his laptop. The site loads. The coding aesthetic signals: _developer, not designer-turned-developer._ He scrolls through the projects section -- he's not reading every word, he's pattern-matching for evidence: Has this person shipped real things? Can they work at the complexity level I need?

He finds a project that's close enough to what he needs. He clicks "Contact" and sends a message.

**Requirements revealed:** Projects section with clear tech stack tags, a visible and frictionless contact mechanism, scannable project summaries (not walls of text).

---

### Journey 4: The Peer Developer -- "I Want to Know How This Was Built"

_Tertiary User -- Appreciation / Inspiration_

**Meet Priya.** She's a frontend developer who finds BaoBao's portfolio shared in a Discord server. She opens it expecting something generic.

Instead: smooth page transitions, a terminal-style intro animation, precise spacing. She opens DevTools. Sees Next.js, Tailwind classes, GSAP scroll triggers. She's impressed -- not just at the aesthetic, but at the restraint. No over-engineering.

She DMs BaoBao: _"Loved your portfolio -- did you open source the template?"_

**Requirements revealed:** Code quality matters as much as visual output (it's visible in DevTools). Social/contact links reachable easily. Optional: GitHub link or "built with" note in footer.

---

### Journey 5: BaoBao (Owner) -- "I Just Got a New Job, Time to Update"

_Owner -- Content Management_

BaoBao starts a new role. Opens the portfolio repo. Finds the structured data file (`data/experience.json` or similar). Adds the new entry: company, role, dates, description. Saves the file. The site rebuilds automatically (or on next deploy). The CV export regenerates with the new data the next time it's triggered.

No component editing. No style changes needed.

**Requirements revealed:** All personal content (experience, projects, skills, bio) lives in structured data files separate from UI components. CV export reads from the same data source as the website.

---

### Journey Requirements Summary

| Journey                 | Key Capabilities Required                                              |
| ----------------------- | ---------------------------------------------------------------------- |
| Recruiter -- QR scan    | PDF export, QR code generation, stable canonical URL, fast mobile load |
| Recruiter -- Broken QR  | Dynamic URL in QR (reads from config), re-export on demand             |
| Freelance Client        | Projects section, tech stack tags, contact mechanism                   |
| Peer Developer          | Code quality / DevTools-visible craft, footer links, GitHub presence   |
| Owner -- Content update | Structured data layer, data-driven CV export, no-code content editing  |

## Innovation & Novel Patterns

### Detected Innovation Areas

**1. The Two-Surface Portfolio**
Most developer portfolios treat the PDF CV and the online portfolio as separate artifacts maintained independently. This product makes them a single system: the website _generates_ the CV, and the CV _drives traffic back_ to the website via QR code. The insight is that hiring is a multi-surface journey -- this product owns both surfaces from one data source.

**2. Content-Separated Architecture as UX Feature**
Structuring portfolio content as data (not hardcoded in components) is a technical pattern, but here it becomes a product feature: the owner can update their story in minutes, keeping the portfolio credible at any career stage. The architecture _is_ the experience.

### Market Context & Competitive Landscape

Existing developer portfolio approaches fall into three buckets:

- **Template sites** (e.g., GitHub Pages, Notion) -- fast but generic; no CV export
- **Custom-built** -- expressive but static; CV maintained separately in Canva/Word
- **Portfolio platforms** (e.g., Read.cv, Layers.to) -- polished but no ownership, no code proof

None of them close the paper->digital gap with a QR-linked export from a self-hosted, custom-coded site.

### Validation Approach

- **QR scan rate:** Track how many PDF recipients scan the QR within the first 30 days of sharing the CV actively
- **Recruiter feedback:** 2-3 direct conversations with recruiters or hiring managers on whether the QR-linked portfolio influenced their decision
- **Bounce rate post-QR:** If people scan and immediately leave, the landing experience needs work -- not the concept

### Risk Mitigation

| Risk                                      | Mitigation                                                                        |
| ----------------------------------------- | --------------------------------------------------------------------------------- |
| QR links to wrong URL after domain change | QR URL sourced dynamically from config at export time; re-export on domain change |
| PDF export looks unprofessional on print  | Print-specific CSS; test on A4 and Letter sizes before launch                     |
| Animations hurt performance on mobile     | `prefers-reduced-motion` respected; GSAP/Framer used selectively                  |

## Web App Specific Requirements

### Project-Type Overview

MyPortfolio is a **multi-page application (MPA)** built with the Next.js 16 App Router, statically generated (SSG) at build time. No server-side runtime is required for portfolio browsing; the CV export feature triggers a client-side PDF generation process. The site is deployed to Vercel with a stable custom domain.

### Browser Matrix

| Browser     | Minimum Version       | Support Level |
| ----------- | --------------------- | ------------- |
| Chrome      | Last 2 major versions | Full          |
| Firefox     | Last 2 major versions | Full          |
| Safari      | Last 2 major versions | Full          |
| Edge        | Last 2 major versions | Full          |
| IE / Legacy | --                    | Not supported |

### Responsive Design

- **Mobile-first** layout -- QR code recipients will scan on mobile; the first experience must be polished on small screens
- Breakpoints: mobile (< 768px), tablet (768-1024px), desktop (> 1024px)
- Navigation collapses to a minimal mobile menu (no hamburger-soup -- minimal and intentional)
- CV export is desktop-triggered; mobile surfaces a "view on desktop" fallback

### Performance Targets

| Metric                   | Target                          |
| ------------------------ | ------------------------------- |
| Lighthouse Performance   | >= 90 (desktop), >= 80 (mobile) |
| First Contentful Paint   | < 1.5s                          |
| Largest Contentful Paint | < 2.5s                          |
| Cumulative Layout Shift  | < 0.1                           |
| Total Blocking Time      | < 200ms                         |

All animations must be lazy-loaded and respect `prefers-reduced-motion`. GSAP/Framer Motion used selectively -- not on every element.

### SEO Strategy

- **Scope:** Basic -- sufficient for name-based discovery, not content marketing
- Unique `<title>` and `<meta description>` per page
- Open Graph tags (og:title, og:description, og:image) -- critical for link previews when portfolio URL is shared
- `robots.txt` and `sitemap.xml` auto-generated
- Canonical URLs to prevent duplicate content
- Structured data (`application/ld+json`) for Person schema on home page

### Accessibility Level

- **Target:** WCAG 2.1 AA best-effort
- All interactive elements keyboard-navigable
- Focus indicators visible (styled to match coding aesthetic -- not default browser outline)
- ARIA labels on icon-only buttons and non-descriptive links
- Color contrast ratio >= 4.5:1 for body text; >= 3:1 for large text
- `prefers-reduced-motion` media query respected globally

### Implementation Considerations

- **Static generation (SSG):** All pages pre-rendered at build time; content changes trigger a rebuild + redeploy
- **No CMS backend:** Content lives in version-controlled structured data files (`/data/*.json` or MDX)
- **CV export:** Client-side PDF generation (e.g., `react-pdf` or `puppeteer` via API route) -- QR code embedded using a QR generation library pointed at the canonical portfolio URL
- **Deployment:** Vercel (zero-config Next.js support, automatic HTTPS, CDN distribution)

## Project Scoping

### Strategy & Philosophy

**Approach:** Experience MVP -- the product must feel complete and polished on launch day, not a scrappy prototype. The QR code on the CV is a promise; the portfolio must honor it.

**Resource Requirements:** Solo developer (BaoBao). No backend infrastructure to maintain.

### MVP Feature Set

**Core User Journeys Supported:**

- Journey 1: Recruiter -- QR scan to portfolio (primary conversion path)
- Journey 3: Freelance Client -- direct link browse and contact
- Journey 5: Owner -- content update without code changes

**Must-Have Capabilities:**

1. Portfolio website with coding-vibe UX/UI -- dark theme, monospace typography, terminal motifs, GSAP/Framer Motion micro-animations
2. CV / PDF export with embedded QR code linking to the live canonical portfolio URL
3. Owner-updatable content via structured data files -- no component code changes for content updates
4. Projects section with tech stack tags and scannable summaries
5. Contact mechanism (email link or contact form)
6. Mobile-responsive layout (QR recipients land on mobile)
7. Basic SEO (meta, OG tags, sitemap, Person schema)
8. Deployed to Vercel with stable custom domain

**Nice-to-Have for MVP (include if time allows, cut if needed):**

- GitHub link / footer attribution
- Page transition animations

> **Note:** `prefers-reduced-motion` support was previously listed here as nice-to-have but is classified as must-have per FR20 and NFR11.

### Post-MVP Features

**Growth (Phase 2):**

- Analytics (visitor source, QR scan tracking, session depth)
- Project case study deep-dives with process documentation
- Blog / writing section
- Dark/light mode toggle

**Vision (Phase 3):**

- Interactive terminal hero entry point
- Live GitHub contribution graph integration
- Physics-based scroll/cursor micro-animations
- Portfolio-as-a-product open-source template

### Risk Mitigation Strategy

| Risk                                  | Mitigation                                                                    |
| ------------------------------------- | ----------------------------------------------------------------------------- |
| QR URL goes stale after domain change | QR sourced dynamically from config at export time; re-export on domain change |
| PDF looks unprofessional on print     | Print-specific CSS; test on A4 and Letter before launch                       |
| Animations tank Lighthouse score      | GSAP/Framer used selectively; lazy-loaded; `prefers-reduced-motion` gate      |
| Scope creep delays launch             | MVP is 3 hard requirements -- anything else is Phase 2                        |

## Functional Requirements

### Portfolio Content Display

- **FR1:** Visitors can view BaoBao's professional bio and personal introduction
- **FR2:** Visitors can browse a curated list of projects with title, description, tech stack tags, and outcome summary
- **FR3:** Visitors can view individual project details including problem, approach, and result
- **FR4:** Visitors can view BaoBao's skills and technology proficiencies
- **FR5:** Visitors can view BaoBao's work experience and education history

### Navigation & Site Structure

- **FR6:** Visitors can navigate between distinct portfolio sections (Home, Projects, About, Contact)
- **FR7:** Visitors can access the portfolio from a stable, memorable custom domain URL
- **FR8:** Visitors on mobile can navigate the site with a collapsed, minimal mobile menu

### CV Export & QR Code

- **FR9:** Owner can trigger a CV/resume export as a downloadable PDF from the portfolio site
- **FR10:** The exported PDF includes a QR code that links to the live canonical portfolio URL
- **FR11:** The QR code URL is sourced from a configurable value (not hardcoded) so it remains valid after domain changes
- **FR12:** Owner can re-export the CV at any time to reflect current content and canonical URL

### Owner Content Management

- **FR13:** Owner can update personal bio, experience, education, skills, and projects by editing structured data files without modifying UI component code
- **FR14:** Content changes are reflected on the live site after a standard build/deploy cycle
- **FR15:** The CV PDF export reads from the same data source as the portfolio website, ensuring consistency

### Contact & Outreach

- **FR16:** Visitors can initiate contact with BaoBao via a visible contact mechanism (email link or contact form)
- **FR17:** Visitors can access BaoBao's professional social and GitHub profiles via footer links

### Design & Aesthetic

- **FR18:** The portfolio renders a coding-vibe aesthetic: dark color palette, monospace typography, terminal-inspired UI motifs
- **FR19:** The portfolio includes purposeful micro-animations on key interactions and scroll events
- **FR20:** Animations are suppressed or reduced when the visitor's OS has `prefers-reduced-motion` enabled

### Performance & Accessibility

- **FR21:** The portfolio is fully responsive and usable across mobile, tablet, and desktop viewports
- **FR22:** All interactive elements are keyboard-navigable with visible focus indicators
- **FR23:** All images and icon-only controls include descriptive alternative text or ARIA labels

### Discoverability & SEO

- **FR24:** Each page has a unique title, meta description, and canonical URL
- **FR25:** The site exposes Open Graph tags so shared links render rich previews on social and messaging platforms
- **FR26:** The site generates a sitemap and robots.txt for search engine crawling
- **FR27:** The home page includes structured data (Person schema) to support name-based search discovery

## Non-Functional Requirements

### Performance

- **NFR1:** First Contentful Paint < 1.5s; Largest Contentful Paint < 2.5s on desktop (3G equivalent: LCP < 4s)
- **NFR2:** Lighthouse Performance score >= 90 on desktop, >= 80 on mobile
- **NFR3:** Cumulative Layout Shift < 0.1; Total Blocking Time < 200ms
- **NFR4:** CV PDF export generation completes within 5 seconds of trigger
- **NFR5:** All animation frames target 60fps; no janked transitions on mid-range hardware

### Reliability

- **NFR6:** The canonical portfolio URL must remain stable and resolvable at all times -- a broken URL invalidates every distributed CV
- **NFR7:** Site uptime >= 99.9% (Vercel SLA; no custom infra to maintain)
- **NFR8:** CV PDF download succeeds on every attempt -- 0% failure rate is the expectation for this feature

### Accessibility

- **NFR9:** WCAG 2.1 AA best-effort -- all success criteria targeted; exceptions documented if unavoidable
- **NFR10:** Color contrast ratio >= 4.5:1 for body text, >= 3:1 for large text and UI components
- **NFR11:** `prefers-reduced-motion` respected site-wide -- all animations suppressed or reduced when set
- **NFR12:** All interactive elements operable by keyboard alone; focus order follows visual reading order

### Compatibility

- **NFR13:** Full functionality on Chrome, Firefox, Safari, Edge (last 2 major versions each)
- **NFR14:** Responsive across mobile (>= 320px), tablet (768px), and desktop (1024px+) viewports
- **NFR15:** PDF export renders correctly on A4 and US Letter paper sizes

### Security

- **NFR16:** No user data collected or stored (no auth, no analytics backend, no form data persistence by default)
- **NFR17:** HTTPS enforced on all pages (Vercel default); no mixed-content warnings
- **NFR18:** No third-party scripts loaded without explicit evaluation (no CDN tracking, no analytics without consent)

### Maintainability

- **NFR19:** Content updates require only structured data file edits -- zero UI/component code changes for routine portfolio maintenance
- **NFR20:** All content fields documented in a schema comment or README so owner knows what to edit
