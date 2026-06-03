# Project Brief

## Project
Orouba Foods public website migration to Next.js App Router with two locales:
`ar` and `en`.

## Current Objective
Stabilize the migrated public site so it can run independently from the old
frontend/backend stack where possible, while matching the original
`oroubafoods.com` design closely and keeping AR/EN navigation intact.

## Quality Bar
- Main AR and EN routes should load without 404s.
- Production `npm run build` should pass.
- Browser console should be clean of React hydration errors and invalid DOM
  warnings.
- Styling, colors, font, font weight, spacing, and layout should match the
  original site.
- Legacy URLs should redirect into the localized Next.js routes.
- Media should resolve from Cloudflare R2 when available.

## Current Reality
The App Router route surface is mostly present and the basic AR/EN route sweep
passes on the currently running dev server. The project is not production-ready
yet because build and lint are not green, some legacy API calls remain, and
browser logs still show hydration issues on recipe details.
