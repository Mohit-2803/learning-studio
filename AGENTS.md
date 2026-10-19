# Learning Studio project instructions

## Scope
- Work only in this Learning Studio repository.
- The active checkout for development is `~/Learning` on the `hrms-dev` GCP VM.
- Do not touch sibling project directories.
- Do not commit, push, deploy, or change external services unless the user explicitly asks.

## Product requirements
- Preserve the existing Learning Studio pages, course content, responsive UI, and browser interactions while modernizing the implementation.
- Follow [`docs/course-design-principles.md`](./docs/course-design-principles.md) when creating or revising any course; it is the shared standard for the beginner introduction, focused outcomes, teaching depth, interactive practice, lab behavior, progress, and visual consistency.
- Next.js App Router route components are the source of truth for page UI. Do not restore static public HTML pages.
- Keep page and server code in TypeScript or TSX. Existing browser course engines under `public/scripts` are JavaScript compatibility assets; preserve them unless they are intentionally migrated with parity.
- Use Tailwind CSS utilities in TSX as the styling system. Keep one global stylesheet at `src/app/styles.css` for Tailwind imports, design tokens, and only genuinely global or complex styles.
- Do not use inline style props or style attributes.
- Use semantic design tokens such as `bg-bg-primary`, `bg-bg-secondary`, `text-text-primary`, `border-border-subtle`, and the shared font tokens.
- Prefer accessible reusable components from the configured shadcn/ui source setup when they fit. Preserve custom course visualizations and labs.
- Keep readable body and control text, especially on mobile.

## Current application structure
- `src/app/page.tsx`: course landing page.
- `src/app/auth/page.tsx`: sign-in and sign-up page.
- `src/app/courses/graphql/page.tsx`: protected GraphQL course.
- `src/app/courses/docker/page.tsx`: protected Docker course.
- `src/app/api`: Firebase session/configuration and course state endpoints.
- `src/server`: GraphQL schema, resolvers, and data.
- `src/app/styles.css`: single global stylesheet.
- `public/scripts`: Firebase client, progress tracker, and GraphQL/Docker browser engines.

## Development
- The VM uses Node 22 via nvm. In a new shell run: `source "$HOME/.nvm/nvm.sh"`.
- Install dependencies with `npm ci` when needed.
- Run the production build with `npm run build`.
- Run the dev server with `npm run dev -- --hostname 127.0.0.1` when exposing it through SSH port forwarding.
- VS Code Remote SSH can forward port 3000 from its Ports panel. The laptop should not need a local Node process.
- Never place secrets in source files or handoff notes. Use environment files or VM environment configuration.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
