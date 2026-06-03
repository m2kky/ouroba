# System Patterns

## Routing
The app uses Next.js App Router under `src/app/[lang]`.

Locales:
- `ar`
- `en`

Root route:
- `src/app/page.tsx` redirects to `/ar`.

Main localized routes:
- `/[lang]`
- `/[lang]/about`
- `/[lang]/brands`
- `/[lang]/brands/[brandId]`
- `/[lang]/brands/[brandId]/categories/[categoryId]`
- `/[lang]/careers`
- `/[lang]/certifications`
- `/[lang]/contactus`
- `/[lang]/export`
- `/[lang]/export_cat`
- `/[lang]/product_types`
- `/[lang]/products`
- `/[lang]/products/[id]`
- `/[lang]/recipes`
- `/[lang]/recipe_details/[id]`

## Layout
`src/app/[lang]/layout.tsx` provides:
- Bootstrap CSS
- RSuite loader CSS
- global CSS
- Cairo font link
- original site CSS link from `oroubafoods.com`
- Redux `StoreProvider`
- shared `Header`
- shared `Footer`

## State
Redux is initialized through `src/components/StoreProvider/index.tsx`.
The provider receives `initialLanguage` from the route param and stores it in
localStorage as `ouroubaLanguage`.

## Data Access
Server pages mostly query Drizzle directly through `src/db`.

Client components still use axios against the legacy API in several places.
This is the main remaining split-brain pattern.

## Media Resolution
`src/utils/media.js` resolves known legacy media URLs into R2 public URLs using
`src/data/r2MediaMap.js`.

The resolver is applied recursively through `resolveMediaTree`.

## Legacy URLs
There are two route compatibility layers:
- `next.config.ts` redirects for localized legacy paths.
- `src/utils/routes.js` converts old client-side menu paths into localized
  current routes.

The redirect coverage currently favors localized paths. Locale-less legacy
paths still need coverage.
