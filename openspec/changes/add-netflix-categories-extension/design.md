## Context

The repository is an empty MIT-licensed Chrome extension repo (`antick/hidden-netflix-categories`). There is no existing application code. The product is an unofficial extension that makes Netflix hidden category/genre codes discoverable through a popup and an optional in-page header menu. Category data must be researched from public sources and bundled; nothing is fetched at runtime.

Constraints: Bun-only tooling, WXT + React + TypeScript + Tailwind + Biome, Manifest V3, minimal permissions, no analytics/telemetry/backends, no Netflix private APIs, no official Netflix branding.

## Goals / Non-Goals

**Goals:**

- Ship a complete, installable MV3 extension with a substantial real category dataset.
- Share one domain layer between popup and experimental Netflix UI.
- Keep the experimental header opt-in, isolated, and fail-safe.
- Provide tests, CI, docs, original icons, and a store-submission guide that matches the built artifact.

**Non-Goals:**

- Remote category APIs or auto-updating datasets.
- Firefox/Safari packaging in this change.
- Automated Chrome Web Store publish.
- Logged-in Netflix header screenshots if the owner has not logged in yet.
- Reading Netflix viewing history, cookies, or account data.

## Decisions

### 1. WXT as the extension framework

Use current WXT React + TypeScript conventions (`entrypoints/`, `wxt.config.ts`, `wxt prepare`) rather than a hand-rolled MV3 scaffold. WXT owns content-script registration, Shadow DOM UI mounting, and zip/build output paths. Directory names in older sketches are advisory; follow the installed WXT version.

Alternative considered: vanilla Vite MV3. Rejected because WXT already encodes Chrome extension entrypoints, HMR, and Shadow DOM isolation.

### 2. Static bundled JSON as the only category source

`data/netflix-categories.json` is imported/bundled into the extension. A validator script and `docs/CATEGORY_DATA.md` make updates a maintainer workflow. Runtime never fetches categories.

Alternative considered: hosted JSON. Rejected for privacy, store review, and “no remote executable/config” rules.

### 3. Shared domain modules, React only at the edges

Pure TypeScript modules own categories, search, preferences, navigation, permissions, and Netflix DOM adapters. Popup and Options are WXT React entrypoints. The Netflix mega menu is a Shadow DOM UI that calls the same modules and storage. No Redux or extra client state libraries; React state plus `browser.storage` change events keep UIs in sync.

### 4. Optional permissions for Netflix integration

Required: `storage`, `activeTab`. Optional: `scripting` + `https://www.netflix.com/*`. Content script is registered/activated only after opt-in. Default experimental flag is `false`.

Alternative considered: always-on Netflix content script. Rejected because it would request host access before the user needs it.

### 5. Isolated Netflix adapter + Shadow DOM

All selectors live in one adapter module. Injection uses WXT Shadow DOM so Tailwind cannot leak onto Netflix and Netflix CSS cannot restyle the menu. Predictable pixel/`px` sizing avoids host `rem` surprises. MutationObserver is scoped to the header region; no polling loops.

### 6. Preference schema versioning

Store a `schemaVersion` with ID arrays and flags. Provide a single migrate-on-read function. Do not build a migration framework beyond that.

### 7. Search without a fuzzy library

Case-insensitive includes on name and code, plus flattened child records with parent context, is enough for this dataset size. Add a library only if that proves insufficient.

### 8. OpenSpec replaces PLAN.md

This change’s proposal, specs, design, and tasks are the implementation source of truth. `PLAN.md` is deleted after artifacts validate.

## Risks / Trade-offs

- [Netflix header DOM changes] → Fail closed; popup remains the product. Document experimental status.
- [Category codes vary by region and go stale] → Document provenance; ship the best public verified set; no runtime scrape.
- [WXT APIs differ by version] → Use current docs at implementation time; record actual output paths in README and store guide.
- [Logged-in header testing blocked] → Stop for owner login; capture popup/options screenshots locally; defer mega-menu shots.
- [Large JSON in popup] → Load once, flatten once, avoid rendering collapsed children.

## Migration Plan

Greenfield install. No user-data migration. Future preference changes use `schemaVersion` migrate-on-read. Rollback is “unload the extension.” Dataset updates are a new extension version.

## Open Questions

- Logged-in Netflix session for header testing and mega-menu screenshots (owner will log in when implementation reaches that point).
- Exact WXT output directory and zip path (record after `bun run build` / `bun run zip`, do not guess).
