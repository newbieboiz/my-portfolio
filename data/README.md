# `data/` — Content Schema Documentation

This folder contains all site content as JSON files. They are consumed by `src/lib/data.ts` via typed accessor functions. **Do not move these files into `src/`** — they are content, not source code.

---

## `site.json`

Owner metadata and site-wide configuration. **Does NOT contain a canonical URL** — that is sourced exclusively from the `NEXT_PUBLIC_SITE_URL` environment variable.

| Field                     | Type      | Required | Description                                                       |
| ------------------------- | --------- | -------- | ----------------------------------------------------------------- |
| `owner.name`              | `string`  | ✅       | Display name shown in headers, footer, and CV.                    |
| `owner.title`             | `string`  | ✅       | Professional title or tagline.                                    |
| `owner.email`             | `string`  | ✅       | Contact email address. Use a valid format: `hello@example.com`.   |
| `owner.isAvailable`       | `boolean` | ✅       | Controls the availability badge in the UI. `true` = open to work. |
| `owner.availabilityText`  | `string`  | ✅       | Short label displayed alongside the availability badge.           |
| `social.github`           | `string`  | ✅       | Full GitHub profile URL.                                          |
| `social.linkedin`         | `string`  | ✅       | Full LinkedIn profile URL.                                        |
| `social.twitter`          | `string`  | ❌       | Full Twitter/X profile URL. Omit if not applicable.               |
| `navigation`              | `array`   | ✅       | Ordered list of top-level navigation links (see below).           |
| `navigation[].label`      | `string`  | ✅       | Link text shown in the navbar.                                    |
| `navigation[].href`       | `string`  | ✅       | Path (`/about`) or full URL for external links.                   |
| `navigation[].isExternal` | `boolean` | ❌       | Set `true` to open in a new tab. Defaults to `false`.             |

---

## `projects.json`

Array of portfolio projects. Minimum 2 entries required.

| Field           | Type       | Required | Description                                                                                        |
| --------------- | ---------- | -------- | -------------------------------------------------------------------------------------------------- |
| `slug`          | `string`   | ✅       | URL-safe identifier used in routing. Lowercase, hyphen-separated. Example: `"realtime-dashboard"`. |
| `title`         | `string`   | ✅       | Project display name.                                                                              |
| `description`   | `string`   | ✅       | One-liner summary for card display (≤ 120 chars recommended).                                      |
| `techStack`     | `string[]` | ✅       | Ordered list of technologies used. Most prominent first.                                           |
| `outcome`       | `string`   | ✅       | Brief outcome for card hover state (≤ 100 chars recommended).                                      |
| `isFeatured`    | `boolean`  | ✅       | `true` to feature on the homepage.                                                                 |
| `startDate`     | `string`   | ✅       | ISO 8601 month precision: `"2024-03"`.                                                             |
| `endDate`       | `string`   | ❌       | ISO 8601 month precision. Omit if project is ongoing.                                              |
| `projectUrl`    | `string`   | ❌       | Live project URL.                                                                                  |
| `githubUrl`     | `string`   | ❌       | GitHub repository URL.                                                                             |
| `problem`       | `string`   | ✅       | Problem statement (used in case study fallback if no MDX file).                                    |
| `approach`      | `string`   | ✅       | Description of the approach taken.                                                                 |
| `result`        | `string`   | ✅       | Outcome / impact description.                                                                      |
| `hasCodeSample` | `boolean`  | ✅       | `true` if the project has an accompanying code sample to display.                                  |

---

## `experience.json`

Array of work experience entries. Minimum 1 entry required.

| Field          | Type       | Required | Description                                                    |
| -------------- | ---------- | -------- | -------------------------------------------------------------- |
| `company`      | `string`   | ✅       | Employer name.                                                 |
| `title`        | `string`   | ✅       | Job title.                                                     |
| `startDate`    | `string`   | ✅       | ISO 8601 month precision: `"2022-03"`.                         |
| `endDate`      | `string`   | ❌       | ISO 8601 month precision. Omit if `isCurrent` is `true`.       |
| `isCurrent`    | `boolean`  | ✅       | `true` for the current role. Only one entry should be current. |
| `description`  | `string`   | ✅       | Short summary of responsibilities.                             |
| `achievements` | `string[]` | ✅       | List of specific, quantified achievements. Use active voice.   |
| `techStack`    | `string[]` | ✅       | Technologies used in this role.                                |

---

## `skills.json`

Array of skill categories. Minimum 3 categories required.

| Field            | Type     | Required | Description                                                                          |
| ---------------- | -------- | -------- | ------------------------------------------------------------------------------------ |
| `category`       | `string` | ✅       | Display name for the skill group (e.g., `"Frontend"`, `"Backend & Data"`).           |
| `skills`         | `array`  | ✅       | Ordered list of skills within the category.                                          |
| `skills[].name`  | `string` | ✅       | Skill display name.                                                                  |
| `skills[].level` | `string` | ❌       | Proficiency level. One of: `"beginner"`, `"intermediate"`, `"advanced"`, `"expert"`. |

---

## `education.json`

Array of education entries. Minimum 1 entry required.

| Field         | Type     | Required | Description                                                             |
| ------------- | -------- | -------- | ----------------------------------------------------------------------- |
| `institution` | `string` | ✅       | Name of the university, college, or training provider.                  |
| `degree`      | `string` | ✅       | Degree type (e.g., `"Bachelor of Science"`, `"Master of Engineering"`). |
| `field`       | `string` | ✅       | Field of study (e.g., `"Computer Science"`).                            |
| `startDate`   | `string` | ✅       | ISO 8601 month precision: `"2018-09"`.                                  |
| `endDate`     | `string` | ✅       | ISO 8601 month precision: `"2022-06"`.                                  |
| `description` | `string` | ❌       | Optional notes about focus areas, honours, thesis, etc.                 |

---

## Date Format

All date fields use **ISO 8601 month precision**: `"YYYY-MM"`.

- ✅ `"2024-03"` — March 2024
- ❌ `"March 2024"` — not accepted by the TypeScript schema
- ❌ `"2024-03-15"` — day precision is unnecessary and inconsistent

## Canonical URL

The site's canonical URL (`https://yourdomain.com`) is **never stored here**. It is set via the `NEXT_PUBLIC_SITE_URL` environment variable:

- Development: set in `.env.local` as `http://localhost:3000`
- Production: set in your Vercel project environment variables

`getSiteConfig()` in `src/lib/data.ts` merges this value into the returned `SiteConfig` object automatically.
