# Category data

The extension ships a static dataset at `packages/categories/netflix-categories.json`. Category lists are **never fetched at runtime**. The retained landing page in `apps/landing` renders its codes page from the same file at build time.

## What the data contains and the source question

Here, ‘dataset’ means the bundled category names, numeric genre codes, internal IDs, and grouping, for example, Horror Movies → 8711. It contains no films, descriptions of films, Netflix accounts, or viewing histories.

Under U.S. copyright guidance, facts and names are not protected by copyright; an original selection or arrangement of a compilation can be. See the [Copyright Office's explanation](https://www.copyright.gov/help/faq/faq-protect.html) and [compilation definition](https://www.copyright.gov/register/tx-compilations.html). The earlier review overstated the absence of an explicit source license as a definite publication blocker. It did not establish that this table contains protected material requiring permission.

The narrower open question is whether the bulk import copied any protected selection or arrangement from the sources below, or implicates applicable database rights or source terms. Keep the source record and avoid copying article prose, artwork, or other protected material. Permission or replacement would be needed if an applicable restriction is established; neither is automatically required merely because public category facts were gathered into a list. This review does not resolve that jurisdiction-dependent legal question.

## How the initial dataset was collected

Researched on **2026-08-15**.

### Primary sources

- [Netflix Tudum: Netflix Secret Codes in 2025](https://www.netflix.com/tudum/articles/netflix-secret-codes-guide): first-party explanations of genre URLs (`https://www.netflix.com/browse/genre/<code>`) and named collections with codes (90-Minute Movies, Cyberpunk, Twisted Christmas, and others). Featured Collections in the JSON come from this article.

### Secondary sources

- [The Streamable: Complete List of Netflix Category Codes](https://thestreamable.com/news/the-complete-list-of-netflix-category-codes): compiled public table of 3,000+ name/code pairs, itself attributed to What’s On Netflix’s public category library.
- Cross-checks against widely repeated public genre IDs (for example Action & Adventure `1365`, Anime `7424`, Horror `8711`).

### What was excluded

- Actor/director “Movies starring…” / “Movies directed by…” lists (not useful genre browse groups).
- Physical-media leftovers such as Blu-ray/IMAX rows.
- Private Netflix APIs, cookies, account data, and third-party extension source code.

Conflicting or malformed rows were dropped. Duplicate IDs/codes keep the first normalized name.

**Empty "No titles found" pages are expected.** Netflix's catalog is regional. A public genre code can have titles in the US and none in India (or the reverse), and Netflix can fill or empty a code later. The extension does **not** scrape Netflix to prune those rows from the bundled dataset. Automatic empty-page detection is disabled in the store build. Historical empty-category markers can be restored from the popup or cleared in Options. The retained experimental source must not be enabled without a new terms and privacy review. Keep the code in the JSON unless a public source shows it is retired.

Uncertain items: a few grouping parents (for example Featured Collections landing on Recently Added `1592210`, Niche Collections landing on Biographical `1096`) reuse a real public code as the group URL rather than inventing a fake ID.

## Verify a code

1. While logged into Netflix on the web, open `https://www.netflix.com/browse/genre/<CODE>`.
2. Confirm the page title/row matches the name closely enough to keep.
3. If the page is empty or unrelated, flag the row in a PR instead of guessing a replacement.

## Update the dataset

1. Research new or changed codes from public sources (prefer Tudum).
2. Edit `packages/categories/netflix-categories.json`.
3. Set `updatedAt` to today’s `YYYY-MM-DD`.
4. Update this file if sources or methodology changed.
5. Run:

```bash
bun run validate:data
bun run test
bun run build
```

6. Open a PR.

Do not add remote dataset fetching.

The historical parser accepts an explicit local input: `bun packages/categories/scripts/build-categories.ts <licensed-source-table.txt>`. It makes no network requests. Use it only with input you are authorized to redistribute; it overwrites the bundled dataset. The old temporary source dump is not part of this repository.
