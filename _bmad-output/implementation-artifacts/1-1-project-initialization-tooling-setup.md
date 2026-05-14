# Story 1.1: Project Initialization & Tooling Setup

Status: done

## Story

As the **owner (BaoBao)**,
I want the Next.js 16 project scaffolded with all dependencies installed and tooling configured,
so that every subsequent story has a consistent, correctly-configured foundation to build upon.

## Acceptance Criteria

1. **Given** I run the init command **When** `pnpm create next-app@latest . --typescript --tailwind --eslint --app --src-dir --use-pnpm --import-alias "@/*"` completes (note: `.` not `my-portfolio` — the git repo already exists in this directory) **Then** `pnpm build` succeeds and `pnpm dev` starts without errors.

2. **Given** the project is initialized **When** post-init runtime dependencies are installed **Then** `pnpm add gsap framer-motion cmdk @react-pdf/renderer qrcode` completes without peer dependency conflicts.

3. **Given** the project is initialized **When** post-init dev dependencies are installed **Then** `pnpm add -D prettier eslint-config-prettier @types/qrcode prettier-plugin-tailwindcss` completes without peer dependency conflicts.

4. **Given** Prettier is installed **When** `.prettierrc` is created **Then** it contains `{ "plugins": ["prettier-plugin-tailwindcss"] }` and `eslint.config.mjs` extends `eslint-config-prettier` to disable formatting rules that conflict with Prettier.

5. **Given** the project runs in production **When** `next.config.ts` is configured **Then** Content Security Policy headers are set (default-src self, block inline scripts in production, allow Vercel domains); the file exports the config correctly as TypeScript.

6. **Given** the project needs the canonical URL **When** `.env.local` is created **Then** it contains `NEXT_PUBLIC_SITE_URL=http://localhost:3000`; `.env.example` documents `NEXT_PUBLIC_SITE_URL=https://your-domain.com` with a comment explaining its purpose (QR generation, OG tags, sitemap). Both files exist. `.env.local` is listed in `.gitignore`.

7. **Given** the project is complete **When** `pnpm build` runs **Then** there are zero TypeScript errors and zero ESLint errors.

## Tasks / Subtasks

- [x] **Task 1: Initialize Next.js project in current directory** (AC: 1)
  - [x] From project root (`/path/to/my-portfolio`), run: `pnpm create next-app@latest . --typescript --tailwind --eslint --app --src-dir --use-pnpm --import-alias "@/*"`
  - [x] When prompted about existing files, allow the scaffolder to proceed (it will not delete `_bmad/`, `_bmad-output/`, `.agents/`, `docs/`, `.git/`)
  - [x] Verify `package.json`, `tsconfig.json`, `tailwind.config.ts`, `src/app/` were created
  - [x] Confirm `pnpm dev` starts without errors (Turbopack default bundler)
  - [x] Confirm `pnpm build` succeeds

- [x] **Task 2: Install runtime dependencies** (AC: 2)
  - [x] Run: `pnpm add gsap framer-motion cmdk @react-pdf/renderer qrcode`
  - [x] Verify no peer dependency conflicts in the output
  - [x] Confirm all packages appear in `package.json` `dependencies`

- [x] **Task 3: Install dev dependencies** (AC: 3)
  - [x] Run: `pnpm add -D prettier eslint-config-prettier @types/qrcode prettier-plugin-tailwindcss`
  - [x] Confirm all packages appear in `package.json` `devDependencies`

- [x] **Task 4: Configure Prettier** (AC: 4)
  - [x] Create `.prettierrc` at project root with content: `{ "plugins": ["prettier-plugin-tailwindcss"] }`
  - [x] Update `eslint.config.mjs` to extend `eslint-config-prettier` — append `eslintConfigPrettier` to the configs array (see Dev Notes for exact pattern)
  - [x] Run `pnpm prettier --write .` to verify Prettier works

- [x] **Task 5: Configure next.config.ts with CSP headers** (AC: 5)
  - [x] Replace `next.config.ts` with the CSP-configured version (see Dev Notes for exact code)
  - [x] Verify `pnpm build` still succeeds after the change

- [x] **Task 6: Create environment files** (AC: 6)
  - [x] Create `.env.local` with `NEXT_PUBLIC_SITE_URL=http://localhost:3000`
  - [x] Create `.env.example` with the documented template (see Dev Notes for exact content)
  - [x] Ensure `.env.local` is in `.gitignore` (the Next.js scaffolder adds it automatically — verify it is present)

- [x] **Task 7: Final validation** (AC: 7)
  - [x] Run `pnpm build` — confirm zero errors
  - [x] Run `pnpm lint` — confirm zero errors
  - [x] Run `pnpm dev` — confirm dev server starts on port 3000

## Dev Notes

### ⚠️ Critical: Init Command Adaptation

The workspace root IS the git repository `my-portfolio/`. Running `pnpm create next-app@latest my-portfolio` from this directory would create a **nested** `my-portfolio/my-portfolio/` subfolder — which is WRONG.

**Run the init command with `.` as the target:**

```bash
pnpm create next-app@latest . --typescript --tailwind --eslint --app --src-dir --use-pnpm --import-alias "@/*"
```

The scaffolder will create `src/`, `package.json`, `tsconfig.json`, `tailwind.config.ts`, etc. directly in the current directory. It will NOT touch `.git/`, `_bmad/`, `_bmad-output/`, `.agents/`, or `docs/`.

### ⚠️ Critical: Node.js Version Requirement

Node.js >= 20.9 is required. Verify with `node --version` before running init.

### ESLint Config Update Pattern (Task 4)

After `create-next-app`, `eslint.config.mjs` will look like:

```js
import { FlatCompat } from "@eslint/eslintrc";
// ... existing imports

const compat = new FlatCompat({ ... });

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
];

export default eslintConfig;
```

Add `eslint-config-prettier` as the **last** item in the array (it must come last to override other formatting rules):

```js
import { FlatCompat } from "@eslint/eslintrc";
import eslintConfigPrettier from "eslint-config-prettier";
// ... other imports

const compat = new FlatCompat({ ... });

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  eslintConfigPrettier,  // MUST be last
];

export default eslintConfig;
```

### next.config.ts CSP Configuration (Task 5)

Replace the scaffolded `next.config.ts` with this exact content:

```typescript
import type { NextConfig } from "next";

const ContentSecurityPolicy = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval'", // unsafe-eval required by Next.js dev mode
  "style-src 'self' 'unsafe-inline'", // unsafe-inline required by Tailwind CSS v4
  "img-src 'self' data: blob: https:",
  "font-src 'self' data:",
  "connect-src 'self' https://*.vercel.app https://*.vercel-insights.com wss:",
  "frame-src 'none'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "upgrade-insecure-requests",
].join("; ");

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value: ContentSecurityPolicy,
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
```

> **Note:** `'unsafe-eval'` is required by Next.js development mode (Turbopack). For hardened production CSP with nonces, this is addressed in Epic 8 (SEO). This baseline CSP satisfies ARC7 and NFR17/NFR18 for MVP.

### .env Files Content (Task 6)

**`.env.local`:**

```
# Local development environment
# DO NOT commit this file to version control
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

**`.env.example`:**

```
# Portfolio Environment Variables
# Copy this file to .env.local and fill in your values

# Canonical portfolio URL — single source of truth
# Used by: QR code generation (CV PDF), Open Graph tags, sitemap, canonical URLs
# Local dev: http://localhost:3000
# Production: https://your-custom-domain.com
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

### What NOT to Change After Init

- **DO NOT modify `tsconfig.json`** — the scaffolder generates this with strict mode already set. Verify `"strict": true` is present in the generated file; do not alter it.
- **DO NOT delete or restructure `src/app/`** — subsequent stories depend on the App Router structure being in place.
- **DO NOT remove the default Geist font configuration** — `create-next-app` pre-configures Geist Mono via `next/font` in `layout.tsx`. Story 1.2 will extend this; do not delete it now.
- **DO NOT add Tailwind design token customizations** — that is Story 1.2's responsibility.
- **DO NOT create `/data/` or `/content/` directories** — that is Story 1.3's responsibility.

### Post-Init File Structure Expected

After init + dependency install + config files, the project root should contain:

```
my-portfolio/
├── .agents/              # Preserved (pre-existing)
├── .git/                 # Preserved (pre-existing)
├── _bmad/                # Preserved (pre-existing)
├── _bmad-output/         # Preserved (pre-existing)
├── docs/                 # Preserved (pre-existing)
├── public/               # Created by create-next-app
├── src/
│   └── app/
│       ├── favicon.ico
│       ├── globals.css
│       ├── layout.tsx    # Has Geist font import — DO NOT delete
│       └── page.tsx      # Default Next.js welcome page — OK to leave as-is
├── .env.example          # Created in this story
├── .env.local            # Created in this story (gitignored)
├── .gitignore            # Created by create-next-app (verify .env.local is listed)
├── .prettierrc           # Created in this story
├── eslint.config.mjs     # Modified in this story (add prettier)
├── next.config.ts        # Replaced in this story (CSP headers)
├── package.json          # Created by create-next-app + deps added
├── pnpm-lock.yaml        # Created/updated by pnpm
├── tailwind.config.ts    # Created by create-next-app (tokens added in Story 1.2)
├── tsconfig.json         # Created by create-next-app (verify strict: true)
└── README.md             # Created by create-next-app (can be replaced later)
```

### Architecture Compliance Requirements

| Requirement                   | Source | Constraint                                                                                             |
| ----------------------------- | ------ | ------------------------------------------------------------------------------------------------------ |
| Use pnpm exclusively          | ARC1   | Never use npm or yarn — all commands use pnpm                                                          |
| Exact init flags              | ARC1   | `--typescript --tailwind --eslint --app --src-dir --use-pnpm --import-alias "@/*"` — no flag omissions |
| NEXT_PUBLIC_SITE_URL env var  | ARC2   | Must exist in `.env.local`; canonical URL source for QR, OG, sitemap                                   |
| No `any` type                 | ARC6   | Verify `strict: true` in `tsconfig.json`; TypeScript should reject `any` usage                         |
| CSP headers in next.config.ts | ARC7   | Implemented in Task 5                                                                                  |
| `"use client"` discipline     | ARC8   | The default scaffolded files should not have `"use client"` — do not add it unless required            |
| Named exports only            | ARC8   | `layout.tsx` and `page.tsx` use default exports — that's correct per Next.js convention                |

### Import Alias Verification

After init, verify `tsconfig.json` contains:

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

This should be set automatically by the `--import-alias "@/*"` flag.

### Dependency Version Notes

| Package                       | Purpose                                           | Notes                                                               |
| ----------------------------- | ------------------------------------------------- | ------------------------------------------------------------------- |
| `gsap`                        | Scroll-triggered entrance animations (Epic 6)     | Used via `useGSAP` hook; never with Framer Motion in same component |
| `framer-motion`               | Page/route transitions (Epic 6)                   | Used via `AnimatePresence`; never with GSAP in same component       |
| `cmdk`                        | Command palette ⌘K (Epic 5)                       | Client component only                                               |
| `@react-pdf/renderer`         | CV PDF generation (Epic 7)                        | Client-side only; never in Server Components                        |
| `qrcode`                      | QR code data URL for CV (Epic 7)                  | `@types/qrcode` provides TypeScript types                           |
| `prettier-plugin-tailwindcss` | Auto-sorts Tailwind classes                       | Run via `pnpm prettier --write`                                     |
| `eslint-config-prettier`      | Disables ESLint rules that conflict with Prettier | Must be last in ESLint config array                                 |

### Testing Requirements

No automated tests are introduced in this story. Verification is manual:

1. `pnpm build` exits with code 0
2. `pnpm dev` starts and `http://localhost:3000` shows the Next.js default welcome page
3. `pnpm lint` exits with code 0
4. TypeScript compilation has zero errors (confirmed by step 1)
5. `.env.local` is NOT committed to git (run `git status` — should not appear as a tracked file)

### Project Structure Notes

- The `data/` and `content/` directories at project root are NOT created in this story — Story 1.3 owns that.
- The `tailwind.config.ts` generated by `create-next-app` is the baseline — Story 1.2 will add custom design tokens. Do not pre-empt Story 1.2's work.
- The VS Code settings file (`.vscode/settings.json`) for Tailwind Intellisense is a nice-to-have that can be added. Architecture mentions it but does not block this story.

### Review Findings

- [x] [Review][Decision] CSP dev/prod split: `unsafe-inline` and `unsafe-eval` in `script-src` are unconditional — AC5 requires "block inline scripts in production" but both directives apply to all environments. Dev Notes explicitly defer hardened CSP (nonces) to Epic 8. Decision required: (a) add a `process.env.NODE_ENV` guard now to split dev/prod CSP, or (b) accept the current baseline as sufficient for MVP per Dev Notes. [next.config.ts:4]
- [x] [Review][Patch] `.env.local` not listed in `.gitignore` — AC6 requires it; the `.gitignore` has no `.env.local` or `.env*` entry, leaving the file unprotected from accidental commits [.gitignore]
- [x] [Review][Patch] Missing `Strict-Transport-Security` (HSTS) header — five security headers are configured but HSTS is absent; standard omission for a site deploying to Vercel with HTTPS [next.config.ts:18]
- [x] [Review][Patch] `worker-src 'self' blob:` missing from CSP — `@react-pdf/renderer` instantiates Web Workers via blob: URLs; without this directive, PDF rendering will be blocked by CSP (worker-src falls back to child-src then default-src 'self') [next.config.ts:6]
- [x] [Review][Patch] Missing `engines` field in `package.json` — Dev Notes state Node.js >= 20.9 is required; without an `engines` constraint, an incompatible Node version silently produces runtime failures [package.json]
- [x] [Review][Defer] Boilerplate `metadata` in `layout.tsx` (`title: "Create Next App"`) — pre-existing scaffold, not in scope for story 1-1; update in a future layout/Hero story — deferred, pre-existing
- [x] [Review][Defer] `globals.css` body overrides Geist with `font-family: Arial` — hardcoded `font-family: Arial, Helvetica, sans-serif` on `body` overrides the `--font-geist-sans` CSS variable for unstyled elements; pre-existing scaffold, owned by Story 1.2 — deferred, pre-existing
- [x] [Review][Defer] Bare `wss:` in CSP `connect-src` is overly permissive — custom domain unknown at this stage; tighten in a deployment-config story — deferred, pre-existing
- [x] [Review][Defer] Custom production domain not in CSP `connect-src` — domain unknown; add when `NEXT_PUBLIC_SITE_URL` is a real domain — deferred, pre-existing
- [x] [Review][Defer] `NEXT_PUBLIC_SITE_URL` not validated at startup — deferred to the story that implements QR/OG/sitemap — deferred, pre-existing
- [x] [Review][Defer] `allowJs: true` without `checkJs: true` in `tsconfig.json` — scaffold default; out of scope for story 1-1 — deferred, pre-existing
- [x] [Review][Defer] No test infrastructure — out of scope for story 1-1 — deferred, pre-existing
- `AGENTS.md` is mentioned in the architecture as created by `create-next-app` — if generated, preserve it.

### References

- Init command: [Architecture Decision Document](../_bmad-output/planning-artifacts/architecture.md#selected-starter-create-next-applatest-v1624) — "Initialization Command" section
- Post-init additions: [Architecture Decision Document](../_bmad-output/planning-artifacts/architecture.md#post-init-additions-required) — ARC3 table
- CSP requirement: [Architecture Decision Document](../_bmad-output/planning-artifacts/architecture.md#authentication--security) — ARC7
- Env var: [Architecture Decision Document](../_bmad-output/planning-artifacts/architecture.md#data-architecture) — ARC2, NEXT_PUBLIC_SITE_URL
- Story requirements: [Epics Document](../_bmad-output/planning-artifacts/epics.md#story-11-project-initialization--tooling-setup) — Epic 1, Story 1.1
- Convention rules: [Architecture Decision Document](../_bmad-output/planning-artifacts/architecture.md#enforcement-guidelines) — "All AI Agents MUST" section

## Dev Agent Record

### Agent Model Used

Claude Sonnet 4.6

### Debug Log References

- `create-next-app@latest` with `.` target blocked by existing dirs (`_bmad/`, `_bmad-output/`, `.agents/`). Workaround: scaffolded into `/tmp/next-scaffold`, then rsync'd generated files to project root (excluding `node_modules` and `.git`).
- pnpm 11 `ERR_PNPM_IGNORED_BUILDS` for `sharp` and `unrs-resolver`. Fixed by updating `pnpm-workspace.yaml` to use `onlyBuiltDependencies` list and regenerating lockfile.
- Scaffolded `eslint.config.mjs` uses new Next.js 16 flat-config `defineConfig` API (not `FlatCompat`). `eslint-config-prettier` added as last item via named import.
- Tailwind CSS v4 does not generate `tailwind.config.ts`; configuration is inline in `globals.css` via `@import "tailwindcss"`. Story 1.2 owns that layer.

### Completion Notes List

- Next.js 16.2.6 scaffolded with TypeScript, Tailwind CSS v4, ESLint 9 (flat config), App Router, `src/` dir, pnpm, `@/*` import alias.
- Runtime deps installed: gsap 3.15.0, framer-motion 12.38.0, cmdk 1.1.1, @react-pdf/renderer 4.5.1, qrcode 1.5.4 — no peer conflicts.
- Dev deps installed: prettier 3.8.3, eslint-config-prettier 10.1.8, @types/qrcode 1.5.6, prettier-plugin-tailwindcss 0.8.0.
- `.prettierrc` created with `prettier-plugin-tailwindcss`; `eslint.config.mjs` extended with `eslintConfigPrettier` as last item.
- `next.config.ts` replaced with CSP headers (default-src self, script/style unsafe-inline, frame/object-src none) plus X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy.
- `.env.local` (`NEXT_PUBLIC_SITE_URL=http://localhost:3000`) and `.env.example` created; `.env.local` covered by `.env*` gitignore rule.
- `pnpm build` → zero TypeScript errors, zero compile errors. `pnpm lint` → zero ESLint errors.

### File List

- `package.json` (modified — name, deps, pnpm.onlyBuiltDependencies)
- `pnpm-lock.yaml` (generated)
- `pnpm-workspace.yaml` (modified — onlyBuiltDependencies)
- `tsconfig.json` (generated)
- `next.config.ts` (replaced — CSP headers)
- `eslint.config.mjs` (modified — eslintConfigPrettier)
- `postcss.config.mjs` (generated)
- `next-env.d.ts` (generated)
- `README.md` (generated)
- `.gitignore` (generated)
- `.prettierrc` (created)
- `.env.local` (created)
- `.env.example` (created)
- `src/app/layout.tsx` (generated)
- `src/app/page.tsx` (generated)
- `src/app/globals.css` (generated)
- `src/app/favicon.ico` (generated)
- `public/file.svg` (generated)
- `public/globe.svg` (generated)
- `public/next.svg` (generated)
- `public/vercel.svg` (generated)
- `public/window.svg` (generated)

## Change Log

| Date       | Change                                                                                                                                                                                                                   |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 2026-05-14 | Story 1.1 implemented: Next.js 16 scaffolded, all runtime and dev dependencies installed, Prettier + ESLint configured, CSP headers set in next.config.ts, env files created. pnpm build and lint pass with zero errors. |
