# Progress

## Working
- Next.js 16 App Router structure exists for both `ar` and `en`.
- Main localized pages respond on the active dev server.
- Root `/` redirects to `/ar`.
- `/ar/brands` and `/en/brands` redirect to `/brands/5`.
- `/ar/products` and `/en/products` redirect to `/product_types`.
- Localized legacy redirects exist for several old paths.
- Cloudflare R2 public media map is available through `src/data/r2MediaMap.js`.
- `resolveMediaTree` converts known legacy media URLs to R2 URLs.
- Contact and collaborate forms insert into the local database through server actions.
- Recipe details now render `Ingredients` and `Instructions` as separate
  sections. Legacy descriptions containing both `المكونات` and `الخطوات` are
  split before rendering.
- `/about` now filters hidden dashboard records and groups production steps to
  match the old two-block visual layout more closely.
- `/certifications` now filters hidden certificates and certificate values.
- The admin dashboard has a new certificates upload API route in the sibling
  admin project, so certificate images can upload to R2 from the dashboard.
- Drizzle schema now includes `isHidden` for about sections, production steps,
  and certificate values to match the admin Prisma schema.

## Not Done
- Production build is not green because static prerender currently exhausts
  PostgreSQL connections.
- ESLint is not green.
- Old backend calls still exist in home fallback, header, footer, search,
  careers, and Redux reducers.
- Some legacy URLs without `/ar` or `/en` still return 404.
- Recipe details no longer render rich HTML inside `<p>` wrappers. Continue
  watching browser logs for unrelated hydration issues.
- Some Arabic labels in source appear mojibake-encoded in legacy client files.
- Some dynamic page defaults are hard-coded, especially brand id `5`.

## Latest Route Sweep
Generated file: `memory-bank/route-sweep.latest.json`

Summary:
- `200`: `/ar`, `/en`, `/about`, `/certifications`, `/product_types`,
  `/brands/5`, `/export`, `/export_cat`, `/recipes`, `/contactus`,
  `/careers` for both locales.
- `307`: `/ar/brands -> /ar/brands/5`, `/en/brands -> /en/brands/5`.
- `308`: `/ar/about/whoWeAre -> /ar/about`,
  `/en/about/whoWeAre -> /en/about`.
- `404`: `/about/whoWeAre` without locale prefix.

## Next Priority Order
1. Stop stale Node/dev processes or otherwise free DB connections, then make
   `npm run build` pass.
2. Fix the remaining locale-less legacy redirects.
3. Fix hydration errors in recipe details and header language rendering.
4. Remove or replace remaining legacy backend calls.
5. Clean lint enough for CI confidence.
6. Do visual QA against the original site for AR and EN.
