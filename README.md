# Learning Studio

Learning Studio is a Next.js App Router application for practical GraphQL and Docker courses. The migration keeps the current course content, browser labs, progress tracking, Firebase sign-in, and visual layout while moving routing, server endpoints, and access checks into Next.js.

## Run locally

Use Node.js 20.9 or newer.

```sh
npm install
npm run dev
```

Open <http://localhost:3000>. `npm run build` creates a production build and `npm start` serves it.

## Routes

- `/` — course catalog
- `/auth/` — sign-in and account creation
- `/courses/graphql/` — GraphQL course (requires sign-in)
- `/courses/docker/` — Docker course (requires sign-in)
- `/graphql` — GraphQL teaching API (requires sign-in)
- `/api/state` and `/api/reset` — authenticated teaching-data endpoints
- `/api/firebase-config` — public Firebase web-app configuration
- `/api/health` — deployment health check

Course pages and their APIs verify a Firebase ID token stored in an HttpOnly server-session cookie. The browser client exchanges and refreshes the token through `/api/auth/session`. Firestore rules in [`firestore.rules`](./firestore.rules) restrict saved progress to its owner.

## Firebase setup

1. Enable Email/Password and Google providers in Firebase Authentication. Add `localhost` and your deployed hostname to Authorized domains.
2. Create Firestore and publish [`firestore.rules`](./firestore.rules).
3. Copy [`.env.example`](./.env.example) to `.env` and set the Firebase web app values. These values are client configuration; never add service-account credentials to the browser or repository.

Render receives the same values as environment variables. See [`RENDER_DEPLOY.md`](./RENDER_DEPLOY.md).

## Project layout

```text
src/
  app/                     Next routes, layouts, API handlers, and one global stylesheet
  components/              Shared React behaviors and page content boundary (TSX)
  content/page-content.ts  Preserved course and catalog markup during migration
  lib/                     Firebase session verification and app helpers (TypeScript)
  server/                  GraphQL schema, resolvers, and sample data (TypeScript)
public/
  scripts/                 Browser interactions and course simulations
  brand-mark.svg           Learning Studio brand mark
```

The App Router owns the document shell and each URL through `src/app/layout.tsx` and route components; Next.js does not use a hand-maintained `index.html` entry point. Each App Router page component is the source of truth for its route UI, preserving the original course content and interaction hooks. App and server code use TypeScript/TSX; the existing browser course engines remain JavaScript assets so their current interactive behavior stays unchanged. All app CSS is consolidated in `src/app/styles.css`; component files contain no inline CSS.

The GraphQL teaching library is in memory, so sample book changes reset when the server restarts and are not shared across multiple server instances. Replace that store with a shared database before scaling horizontally.
