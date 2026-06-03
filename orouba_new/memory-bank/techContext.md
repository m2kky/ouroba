# Tech Context

## Stack
- Next.js `16.2.7`
- React `19.2.4`
- TypeScript
- Drizzle ORM
- PostgreSQL via `postgres`
- Redux Toolkit / React Redux
- Bootstrap
- Tailwind CSS v4
- RSuite
- Swiper
- Axios
- Cloudflare R2 via AWS SDK

## Commands
- `npm run dev`
- `npm run build`
- `npm run lint`

## Active Dev Server
During the latest inspection, Next reported an existing dev server:

- URL: `http://localhost:3000`
- PID: `12572`

Attempting to start another server for the same project on `3001` did not leave
a listener active because Next detected the existing server.

## Environment
`.env.local` is used by Next and Drizzle. It contains sensitive values and must
not be copied into memory-bank docs or committed.

Required runtime variables include:
- `DATABASE_URL`
- R2 account/bucket/access variables for server-side R2 usage

Public R2 media URL is stored in `src/data/r2MediaMap.js` and is safe as a
public asset base.

## Next.js Version Note
The local `AGENTS.md` warns that this Next.js version has breaking changes.
Before changing framework behavior, check the local Next docs in
`node_modules/next/dist/docs/`.

## Current Validation Results
- Build: failing on `test-about.ts`.
- Lint: failing with 177 problems.
- Route sweep: core localized routes pass on `3000`.
- Browser logs: hydration issues remain.
