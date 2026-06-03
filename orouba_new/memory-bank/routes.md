# Routes

## Current App Router Inventory
- `/` -> redirects to `/ar`
- `/[lang]`
- `/[lang]/about`
- `/[lang]/brands` -> redirects to `/[lang]/brands/5`
- `/[lang]/brands/[brandId]`
- `/[lang]/brands/[brandId]/categories/[categoryId]`
- `/[lang]/careers`
- `/[lang]/certifications`
- `/[lang]/contactus`
- `/[lang]/export`
- `/[lang]/export_cat`
- `/[lang]/product_types`
- `/[lang]/products` -> redirects to `/[lang]/product_types`
- `/[lang]/products/[id]`
- `/[lang]/recipes`
- `/[lang]/recipe_details/[id]`

## Localized Redirects in next.config.ts
- `/:lang/about/whoWeAre` -> `/:lang/about`
- `/:lang/about/certifications` -> `/:lang/certifications`
- `/:lang/about/ProductType` -> `/:lang/product_types`
- `/:lang/ExportCatalog` -> `/:lang/export_cat`
- `/:lang/Reciepe` -> `/:lang/recipes`
- `/:lang/career` -> `/:lang/careers`

## Client Route Mapping
`src/utils/routes.js` maps legacy menu routes such as:
- `/about/whoWeAre`
- `/about/certifications`
- `/about/ProductType`
- `/Brands`
- `/ExportCatalog`
- `/Reciepe`
- `/ContactUs`
- `career`

## Missing Compatibility
Locale-less legacy paths still need redirect coverage. Latest confirmed
failure:

- `/about/whoWeAre` -> `404`

Older logs also show locale-less `/brands/5`, `/brands/7`, `/brands/8`, and
`/about/ProductType` returning 404.
