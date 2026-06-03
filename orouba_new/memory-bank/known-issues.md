# Known Issues

## Build
`npm run build` currently compiles and passes TypeScript, then fails during
static prerender because PostgreSQL reports `too many clients already`.

`src/db/index.ts` caps the postgres client pool to `1` by default, with
`POSTGRES_MAX_CONNECTIONS` available as an override. If the failure persists,
check for stale local dev/build Node processes holding database connections.

## Lint
`npm run lint` currently fails with 177 problems:
- 40 errors
- 137 warnings

High-signal lint groups:
- root codemod/fix scripts use CommonJS `require`
- several App Router pages still use `any`
- React 19 lint rules flag ref access during render in `StoreProvider`
- several client components call `setState` synchronously in effects
- several mapped JSX elements are missing `key`
- many legacy `<img>` warnings remain

## Hydration
The recipe detail HTML nesting issue was addressed in
`src/views/RecipeDetails/RecipeAbout/RecipeAbout.jsx` by rendering rich HTML in
`div.recipe-rich-text` blocks rather than wrapping database HTML inside `<p>`.

Older logs also show header text hydration mismatches where the server rendered
English and the client rendered Arabic. Check initial Redux language state and
client-only language changes.

## Recipe Data
Some recipes have no `RecipeStep` ingredients. `RecipeAbout` now splits legacy
descriptions that contain explicit section labels such as `المكونات` and
`الخطوات`, but recipes without `RecipeStep` and without recognizable labels can
still show no Ingredients section until the dashboard data is completed.

## 404
Localized main routes pass, but locale-less legacy URLs still 404. Confirmed:
- `/about/whoWeAre`

Older logs also show:
- `/brands/5`
- `/brands/7`
- `/brands/8`
- `/about/ProductType`

## Backend Decoupling
The project is partially decoupled from the old backend, not fully. Header,
footer, search, careers, cart, refresh, and site-info code paths still call the
old `camp-coding.site` API.

## Arabic Text
Several legacy client files display Arabic labels as mojibake in the current
source view. This should be repaired with proper UTF-8 Arabic strings or moved
into a clean translation map.

## Dev Server
The active server found during inspection was `localhost:3000`. The in-app
browser was pointing at `localhost:3001`, but `3001` was not listening after
Next rejected a second dev server for the same project.
