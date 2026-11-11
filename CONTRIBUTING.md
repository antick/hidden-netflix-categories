# Contributing

Thanks for helping improve Netflix Categories. This is an unofficial project and is not affiliated with Netflix.

## Development

1. Install [Bun](https://bun.sh) matching `package.json` `packageManager`.
2. `bun install`
3. `bun run dev` for the extension, or `bun run dev:landing` for the website

The extension is in `apps/extension`, the website in `apps/landing`, and the shared dataset in `packages/categories`. Website changes don't need an extension version bump, but they only reach production with the next tagged release.

Use oxlint and oxfmt (`bun run check`) instead of ESLint/Prettier.

## Category data

See `docs/CATEGORY_DATA.md`. Do not scrape Netflix accounts or private APIs.

## Pull requests

- Keep permissions minimal.
- Add or update tests for domain logic.
- Run the CI commands locally before opening a PR.

## Specs

Product behavior lives in `openspec/`. Use `/opsx:propose` for requirement changes.

Chrome Web Store listing copy, permission justifications, and reviewer notes: `docs/CHROME_WEB_STORE_SUBMISSION.md`. There is no live store listing yet.

## License and security

Contributions you submit for inclusion must be available under GPL-3.0-only. Retain third-party notices and include provenance for imported code, fonts, images, and data. Do not add a no-competing-listings restriction: GPLv3 permits compliant redistribution, including commercial forks.

For security issues, see [SECURITY.md](SECURITY.md). Do not post tokens, cookies, account screenshots, or exported personal settings in public issues.
