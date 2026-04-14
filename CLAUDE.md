# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

```bash
npm run dev      # Start dev server (http://localhost:3000)
npm run build    # Production build
npm start        # Run production server
npm run lint     # ESLint (flat config, v9)
```

## Architecture

- **Next.js 16.2.2** with App Router, **React 19.2.4**, TypeScript (strict), Tailwind CSS 4
- All source code lives in `src/app/` using file-system routing (`page.tsx`, `layout.tsx`, `route.ts`)
- Path alias: `@/*` → `./src/*`
- Components are **Server Components by default**; add `'use client'` for interactivity/hooks
- ESLint uses flat config format (`eslint.config.mjs`) with `core-web-vitals` and `typescript` rulesets
- Tailwind CSS 4 imported via `@import "tailwindcss"` in `globals.css`; theming uses CSS custom properties with dark mode via `prefers-color-scheme`
- Fonts: Geist Sans and Geist Mono loaded via `next/font/google`

## Next.js 16.2.2 — Read Before Coding

This version has breaking changes from what you may know. **Always read the relevant guide in `node_modules/next/dist/docs/01-app/` before implementing a feature.** Key docs:

- `01-getting-started/05-server-and-client-components.md` — RSC boundaries
- `01-getting-started/06-fetching-data.md` — async server components, fetch memoization
- `01-getting-started/08-caching.md` — `use-cache` directive (new)
- `01-getting-started/14-route-handlers.md` — API routes
