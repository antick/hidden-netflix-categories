# Website

The retained landing page: Astro, Tailwind CSS 4, and shadcn/ui components, rendered as static pages.

```bash
bun run dev:landing    # from the repository root, http://127.0.0.1:4321
bun run build:landing  # writes apps/landing/dist
bun run test --filter=@netflix-categories/landing  # builds, then checks dist/
```

## Pages

- `/`: the landing page. The "Find a genre" search is the only React island; it loads `/codes.json` the first time someone uses it.
- `/codes`: every genre and code, rendered at build time from `packages/categories`. A small script filters the list in place.
- `/privacy`: renders the repository's `PRIVACY.md`.
- `/codes.json`, `/sitemap.xml`, `/robots.txt`: generated at build time.

## Design

"Late-night TV guide": the extension's plum ink with a marquee amber accent (`src/styles/global.css`). Netflix red is deliberately not used, and a test fails if it appears in the built CSS. Copy, links, and FAQ live in `src/lib/site.ts`.

`src/assets/popup-*.png` and `options.png` are crops of the store screenshots in `docs/store-assets/`. Re-crop them when those change. `social-card.png` is the 1200×630 Open Graph image.

## Deploys

There is no production deployment. The source, local preview commands, and CI checks are retained.

`SITE_URL` sets the origin used in canonical links, social metadata, robots.txt, and the sitemap. It defaults to `http://127.0.0.1:4321` for local previews. If hosting is restored, set `SITE_URL` to the new public origin when building and testing.
