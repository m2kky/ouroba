# QA Checklist

## Build And Static Checks
- Run `npm run build`.
- Run `npm run lint`.
- Confirm root utility/test scripts are not included in app type checking unless
  intentional.

## Route Sweep
- Test `/ar` and `/en`.
- Test all main localized routes.
- Test localized legacy redirects.
- Test locale-less legacy redirects from the old site.
- Test dynamic brand/category/product/recipe IDs from real DB records.

## Browser Console
- Check home, about, products, brand details, recipe list, recipe details,
  export, contact, and careers.
- No hydration errors.
- No invalid DOM warnings.
- No empty `src=""`.
- No `className={false}` warnings.
- No Swiper loop warning on sliders with too few items.

## Data
- Run pages with the old backend unavailable to prove the app is detached.
- Verify header brands and footer contact/social data are local or safely
  mocked.
- Verify contact and collaboration submissions insert into the local database.

## Media
- Check R2 images and videos on AR and EN home pages.
- Check brand videos.
- Check product category sliders.
- Check recipes and recipe details.
- Search for `/missing-image.png` requests.

## Visual Match
- Compare AR and EN against `https://oroubafoods.com/ar` and
  `https://oroubafoods.com/en`.
- Check colors, font family, font weights, line heights, spacing, header,
  footer, hero, cards/sliders, and responsive layouts.
