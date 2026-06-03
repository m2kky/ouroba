# Data And Media

## Database
The main server routes use Drizzle and PostgreSQL through `src/db`.

Important schema file:
- `src/db/schema.ts`

Drizzle migration files live in:
- `drizzle/`

The postgres client pool in `src/db/index.ts` defaults to one connection to
avoid exhausting the database during Next static generation. Override with
`POSTGRES_MAX_CONNECTIONS` only when the target database can support it.

## Recipe Content Model
Recipe detail sections are currently mapped as:
- Ingredients: `RecipeStep.stepAr` / `RecipeStep.stepEn`
- Instructions: `Recipe.descriptionAr` / `Recipe.descriptionEn`

Some migrated recipes store both ingredients and instructions in the
description field. The recipe detail view detects section labels such as
`المكونات`, `الخطوات`, `Ingredients`, and `Instructions`, then splits the
description before rendering.

Known recipe data gaps from the latest audit:
- 10 recipes have no `RecipeStep` rows.
- 7 recipes have no linked `RecipeFood` rows.
- Several duplicate recipes exist, including duplicate Mango Juice and Mango Ice
  Cream entries.

Dashboard cleanup is still needed for recipes that have neither `RecipeStep`
ingredients nor recognizable section labels in their description.

## Data Source Split
The app is not fully detached from the old backend yet.

Still referencing the old API:
- `src/consts.js`
- `src/Axios/base_url.js`
- `src/app/[lang]/page.tsx`
- `src/layouts/header/index.js`
- `src/layouts/footer/index.js`
- `src/components/header/searchBox/index.js`
- `src/views/Careers/Careers.jsx`
- `src/store/siteReducer/index.js`
- `src/store/refresh/index.js`
- `src/store/cartReducer/index.js`

## Local Server Actions
Local DB server actions exist for:
- contact form: `src/actions/contact.ts`
- collaboration/career style form: `src/actions/collaborate.ts`

## R2 Media
R2 public media mapping is implemented with:
- `src/data/r2MediaMap.js`
- `src/utils/media.js`

The resolver maps legacy storage/static media URLs into the public R2 URL by
matching basenames/stems. It intentionally keeps unknown URLs unchanged.

Certificate uploads in the sibling dashboard are handled by
`../orouba-admin/src/app/api/admin/certificates/route.ts`, which uploads to R2
and writes the local `Certificate` table.

## Media Risks
- Unknown legacy media names stay unresolved.
- Logs show repeated requests for `/missing-image.png`.
- `next.config.ts` currently allows all HTTP/HTTPS image hostnames, which is
  flexible for migration but broad for production.

## Schema Risk
There is a visible mismatch between old migration naming and current schema
naming around About entities. For example, the migration includes
`AboutBuilding`, while the current schema maps `aboutBuildings` to `Building`.
Keep this in mind when comparing DB data, seed scripts, and production tables.
