# Active handoff: Learning Studio Next.js and Tailwind migration

## Where to work
Continue only in `~/Learning` on `hrms-dev`. This repository was copied from the laptop to the VM so development does not consume laptop resources. The project is not committed, pushed, or deployed; preserve the existing working changes.

## Completed migration work
- Migrated the four original static pages into Next App Router TSX routes: `/`, `/auth`, `/courses/graphql`, and `/courses/docker`.
- The old public HTML files were removed. Next generates the document shell through `src/app/layout.tsx`; there are no handwritten `.html` files.
- All original page IDs were checked against the TSX pages and were present. Existing course engine scripts were moved under `public/scripts`; GraphQL/Docker engines and progress tracker were verified byte-for-byte unchanged.
- Firebase protected server routes were added for course pages and state APIs.
- Existing Firebase client has a homepage detection fix: it checks the page wrapper instead of expecting a body class.
- Production build passed after the Next.js migration and auth compatibility fix.
- A custom brand SVG is at `public/brand-mark.svg`.
- The user can view the VM dev server from the laptop browser at `localhost:3000` through SSH port forwarding. In VS Code Remote SSH, use the Ports panel to forward port 3000 if needed.
- A Next dev overlay warning was traced to a Chrome extension adding `cz-shortcut-listen` to `<body>` before hydration; it is not a content mismatch in the app.

## Current styling status: NOT COMPLETE
The user explicitly asked to migrate the whole project to Tailwind while retaining the current UI and behavior, keeping one global CSS file and no inline styles. Tailwind is installed and wired into PostCSS. `src/app/styles.css` has the Tailwind utilities import and `@theme` tokens, but the old page-specific CSS is still present and most TSX still uses legacy semantic class names. Do not claim the migration is complete until the legacy route styling has been converted to Tailwind utilities and obsolete component CSS has been removed or reduced to true global/complex rules.

Tailwind packages added: `tailwindcss`, `@tailwindcss/postcss`, `postcss`. Shared class utility packages added: `class-variance-authority`, `clsx`, `tailwind-merge`, `@radix-ui/react-slot`.

## Reusable UI setup
- `components.json` is configured for shadcn/ui New York style, React Server Components, TSX, Tailwind CSS v4, CSS variables, and `@/` aliases.
- `tsconfig.json` maps `@/*` to `./src/*`.
- `src/lib/utils.ts` exports `cn()`.
- `src/components/ui/button.tsx` is a typed shadcn-style Button primitive. It has not yet been adopted by the route pages.
- User suggested prebuilt UI components. Recommended direction: use shadcn/ui components with accessible Radix primitives for common controls, forms, and dialogs, while keeping course art and simulators custom. Avoid blanket restyling that changes the existing brand/UI.

## Next steps
1. Continue converting route markup to Tailwind utility classes, starting with the landing page, then auth, GraphQL, and Docker.
2. Preserve functional DOM hooks used by `public/scripts`. Move behavior hooks to data attributes or update script selectors before removing hooked classes.
3. Keep the single stylesheet for imports, theme tokens, global typography/base rules, and only complex rules not practical as utilities.
4. Use the configured shared Button or other shadcn components where suitable; do not add unrelated UI kits.
5. After each route conversion, run `npm run build` on the VM and visually inspect via VS Code port forwarding at `localhost:3000`.
6. Recheck protected course routing and browser scripts before any deploy. Do not deploy without a separate explicit request.

## Laptop resource note
The laptop had no Node processes when checked. Do not start npm dev/build on the laptop; use the VM.
