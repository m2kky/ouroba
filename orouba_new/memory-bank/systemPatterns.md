# System Patterns

## Architecture
- **Framework**: Next.js App Router (v16.2.7)
- **Database Layer**: Drizzle ORM connected to a PostgreSQL database.
- **State Management**: Redux Toolkit for global state.
- **Styling Strategy**: Tailwind CSS v4 alongside React-Bootstrap and RSuite for UI components.

## Key Design Decisions
- **Internationalization (i18n)**: Route-based localization (`/[locale]/...`) for English and Arabic.
- **Media Storage**: Using AWS SDK (`@aws-sdk/client-s3`) to interface with Cloudflare R2 for asset hosting.
- **Animations**: Framer Motion for smooth UI transitions and micro-interactions.

## Directory Structure
- `src/app`: Next.js App Router pages and layouts.
- `drizzle`: Drizzle ORM schema and migrations.
- `public`: Static assets.
