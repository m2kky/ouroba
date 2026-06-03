# Product Context

## Site Role
The public Orouba Foods site presents the company, brands, product categories,
recipes, export information, certifications, contact information, and careers.

## Audiences
- Arabic visitors browsing the local brand/product experience.
- English visitors browsing product/export information.
- Prospective export partners.
- Users looking for recipes.
- Applicants using the careers page.

## Core User Journeys
- Open `/ar` or `/en` and see the original Orouba look and feel.
- Navigate to About, Certifications, Product Types, Brands, Export, Recipes,
  Contact Us, and Careers.
- Switch language without losing the equivalent route.
- Browse brands, brand categories, product details, and recipe details.
- Download or view the export catalogue.
- Submit contact or career/collaboration forms.

## UX Expectations
- Arabic and English routes should both be first-class.
- Header, menu, footer, colors, spacing, typography, and font weights should
  visually match the original site.
- Images and videos should load from stable local/R2 sources, not broken old
  media URLs.
- Legacy URLs should not surprise users with 404s.

## Current UX Risk
Some source labels appear mojibake-encoded in legacy client files. Even when the
route works, this can produce broken Arabic text and hydration mismatch if the
server and client disagree about the initial language state.
