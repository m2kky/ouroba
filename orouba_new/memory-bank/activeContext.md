# Active Context

## Snapshot
Date: 2026-06-03

The project is in a late migration/stabilization phase. Many missing route
problems have been addressed, R2 media resolution is wired, and the public site
now has localized App Router pages for the main sections.

## Recent Commits
- `4afa012` fix: resolve DB relations error and about page sql syntax error
- `30dbe3e` fix: resolve React hydration error caused by nested p tags in WhyUs component
- `728bcd0` fix: remove case-insensitive redirect loops for Brands and ContactUs
- `774b97b` fix: restore missing brand videos and related category products sliders
- `42c95fe` fix: resolve data mapping bugs in about, product types, and brands components

## Current Checks
- `npx tsc --noEmit --pretty false`: passes.
- Focused ESLint for recipe details passes with only the legacy `<img>` warning.
- `npm run build`: passes compile and TypeScript, then fails during static
  prerender because PostgreSQL reports `too many clients already`.
- `npm run lint`: fails with 177 total problems, including 40 errors.
- Local route sweep on `http://127.0.0.1:3000`: core AR/EN pages respond.
- A second dev server on `3001` could not stay active because Next detected an
  existing dev server for the same project on `3000`.

## Build Blocker
The old TypeScript blocker in `test-about.ts` was fixed by removing ordering
against non-existent `number` columns on `Building` and `Feature`.

The current build blocker is database connection exhaustion during static page
generation. `src/db/index.ts` now caps the postgres client pool with
`POSTGRES_MAX_CONNECTIONS` defaulting to `1`, but existing dev/build node
processes may still need to be stopped before a clean build can complete.

## Current Working Tree Notes
- `test-about.ts` is untracked and still included by TypeScript, but its current
  query compiles.
- `memory-bank/route-sweep.latest.json` was generated from the latest local
  route sweep.
- There is an unrelated untracked file in the sibling admin project:
  `../orouba-admin/public/TlXmtOsy9Ylfe47V2FS5YqfSNF8lYvWC4fxcpJRC.png`.

## Main Risk
The site is partially decoupled from the old backend, but not fully. Several
client components and store reducers still call `https://camp-coding.site`.

Recipe detail rendering now separates `Ingredients` from `Instructions`.
Ingredients come from `RecipeStep`; when legacy data stores both sections inside
the recipe description, `RecipeAbout` parses section labels such as
`المكونات`/`الخطوات` and renders them separately.
