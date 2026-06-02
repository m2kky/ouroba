# Tech Context

## Technology Stack
- **Frontend**: Next.js 16.2.7, React 19, Tailwind CSS v4, Framer Motion
- **UI Libraries**: React-Bootstrap, RSuite, React Icons, Swiper
- **State**: React-Redux, Redux Toolkit
- **Backend/API**: Next.js Server Actions / API Routes
- **Database**: PostgreSQL
- **ORM**: Drizzle ORM
- **Storage**: Cloudflare R2 (via AWS SDK)

## Development Environment
- Node.js environment.
- TypeScript for type safety.
- ESLint for linting.
- Drizzle Kit for database migrations.

## Known Constraints
- The project is migrating from a legacy codebase, meaning some components might still be using older patterns or require codemods.
- Strict requirement for zero hydration mismatches and console errors before production release.
