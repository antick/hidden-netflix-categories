# Open-source and Chrome Web Store release review

Reviewed on **2026-09-22**. Scope: repository source, reachable local Git history, dependency metadata/advisories, CI, production output/ZIP, and an isolated Chromium smoke test. No commit, push, repository visibility change, or store submission was performed.

## Decision

**The technical checks pass.** Remaining store preparation includes publishing the privacy policy and source for the release, and uploading the prepared store images. The category list has a source-review note, not an established licensing violation or proven publication blocker. The personal commit email is normal author metadata, not a security defect.

The injected header menu and automatic empty-page detection remain in source, as requested. They are excluded from the store build, cannot be enabled from the UI or an import, and have no permissions or runtime entrypoints in the package. This substantially reduces the identified Netflix terms risk; it is not a guarantee against rejection, a trademark complaint, or account enforcement.

## Findings and remaining work

| Priority               | Finding and impact                                                                                                                                                                                                                                      | Resolution                                                                                                                                                                                                                                      |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Source-review note     | The data consists of public category names and codes. The bulk table was imported from The Streamable, itself referencing What's On Netflix. No protected selection/arrangement or applicable restriction has been established by this review.          | Keep the source record and distinguish public facts from any protected compilation or other material. Absence of an explicit license alone does not establish that permission is required. See `CATEGORY_DATA.md` for the narrower uncertainty. |
| Release risk addressed | Netflix's terms restrict inserting code into/manipulating its service, automated access, and extraction. The original optional injection and page observation raised a direct concern.                                                                  | `lib/release.ts`, `wxt.config.ts`, preference migration, permission guards, and CI prevent this release from including or enabling that integration. Re-enabling it requires a fresh terms, security, and privacy review.                       |
| Informational          | On recheck, all five current-branch commits use a personal Gmail author address. Three additional commits reachable through other local refs use a T3 Code noreply identity. Email is ordinary Git author metadata and is not bundled in the extension. | No change is needed if this is intentional. GitHub also supports account attribution through its account-specific noreply address. No history was rewritten.                                                                                    |
| Submission requirement | The public policy URL and exact release source must be accessible before distribution.                                                                                                                                                                  | Publish `PRIVACY.md` and a tag/archive containing source and lockfile matching the binary. Verify the links signed out. The current review did not publish them.                                                                                |
| Store images prepared  | Historical screenshots show obsolete integration features and have the wrong store dimensions.                                                                                                                                                          | Current screenshots and the required small promotional tile are now available in `docs/store-assets/`; use its README upload mapping.                                                                                                           |
| Repository setup       | Public repository settings and store account settings are outside this local review.                                                                                                                                                                    | Enable private vulnerability reporting, dependency alerts, and available secret scanning. Complete Google's publisher verification and two-step verification.                                                                                   |

Source for the terms assessment: [Netflix Terms of Use](https://help.netflix.com/legal/termsofuse). Netflix also [documents public genre links](https://www.netflix.com/tudum/articles/netflix-secret-codes-guide); that does not grant redistribution rights to someone else's compilation. The review did not find payment/DRM/region bypass, private API use, account credential access, or runtime scraping in the shipped build.

## Security, permissions, and quality changes

- **Storage only:** removed the need for `activeTab`; current-tab navigation uses the tab ID without reading its URL. No host access, optional permissions, content scripts, background worker, externally connectable endpoint, or web-accessible resource declaration is shipped.
- **Injection cannot be restored by settings:** legacy preferences and imports are forced off. The release check rejects the integration flag being enabled and rejects unexpected manifest capabilities/files.
- **Prevent lost preferences:** failed storage reads now propagate instead of becoming empty defaults. Popup and Options edits read the latest state inside a native Web Lock. A regression test covers concurrent changes and a failed read that must never trigger a write. Save failures appear in the UI rather than reporting successful import/reset.
- **Save before navigating:** a browser test reproduced current-tab navigation losing the recent selection. The shared category control now waits for persistence before opening the URL, and callers preserve that promise. A rendered-component regression test checks that navigation cannot begin while the save is pending.
- **Constrain imports:** a 1 MB limit is checked before reading a selected file and when parsing text. Unsupported export versions and invalid preference containers are rejected; category IDs are sanitized. Imports do not grant website access.
- **Respect other page controls:** removed the retained integration's behavior that hid unrelated elements merely labelled “Categories.” A DOM test verifies that foreign controls survive cleanup. The disabled integration is not otherwise certified for use.
- **Accessibility:** search has an accessible name, library filters use pressed buttons in a labelled group, and the action panel uses ordinary buttons with Escape/focus handling rather than incomplete menu semantics.
- **Local privacy:** added `PRIVACY.md`, an Options link, secure-reporting guidance, and reminders not to post private exports or screenshots. No backend, analytics, tracking pixel, remote category fetch, remote font request, or remotely executed code was found in the release source.
- **Supply chain:** direct versions and Bun are pinned, the lockfile is updated, CI actions use verified commit SHAs, and the CI token has only `contents: read`. The DOM test dependency is now declared directly instead of relying on a transitive install.
- **Distribution notices:** GPLv3, corresponding-source information, and full notices for bundled third-party code/fonts are included in the ZIP. The release check checks notice versions against installed packages.
- **Repository hygiene:** local environment files and signing/key material are ignored. The historical category parser takes an explicit input file instead of a hardcoded temporary path. Historical specs/screenshots are clearly distinguished from current release behavior.

## Secrets and private information

At the original scan, Gitleaks 8.30.1 found **no secrets** in all seven then-reachable local commits, the final source snapshot, or the production output. The scanner binary's download checksum was verified. A separate pattern/provenance pass examined 139 distinct historical blobs and the initially tracked 95 files for credentials, personal paths, unrelated private-project references, and personal email content. No such content issue was found; ordinary commit-author email metadata is described above. The later email-only recheck found eight reachable commits; it was not a new full history secret scan.

The existing five screenshots and icon were visually inspected; no account details or personal viewing information were identified. Their release suitability is a separate issue. Third-party license notices contain their authors' public attribution details intentionally; those must not be stripped as “private info.”

These checks cover reachable **local** history and available files, not unreachable Git objects, un-fetched remote refs, GitHub issues/PR attachments, remote repository settings, or a future upload. Pattern scans cannot prove the absence of every possible secret. No discovered credential required rotation in this review.

## Dependencies

Registry metadata was checked on 2026-09-22. Every selected direct dependency is an exact version and was published at least two days before the review. **No latest stable version was skipped for being less than two days old.** Transitive versions are recorded in `bun.lock`; they are not independently forced to incompatible majors.

| Package                            | Selected version | Published (UTC date) |
| ---------------------------------- | ---------------- | -------------------- |
| `@fontsource-variable/figtree`     | 5.3.0            | 2026-07-19           |
| `lucide-react`                     | 1.47.0           | 2026-09-17           |
| `react`, `react-dom`               | 19.3.0           | 2026-09-09           |
| `@biomejs/biome`                   | 2.5.14           | 2026-09-16           |
| `@tailwindcss/vite`, `tailwindcss` | 4.3.3            | 2026-07-16           |
| `@types/react`, `@types/react-dom` | 19.3.0           | 2026-09-09           |
| `@wxt-dev/module-react`            | 1.2.2            | 2026-03-14           |
| `linkedom`                         | 0.18.13          | 2026-07-07           |
| `typescript`                       | 7.0.2            | 2026-07-08           |
| `wxt`                              | 0.21.4           | 2026-08-11           |
| Bun (package manager and CI)       | 1.4.2            | 2026-09-05           |

CI pins `actions/checkout` v7.0.1 (published 2026-07-20) and `oven-sh/setup-bun` v2.2.0 (published 2026-03-14) by full SHA. `bun audit --json` returned no reported advisories. That is a known-advisory check, not proof that every dependency is vulnerability-free.

## Biome versus Oxlint/Oxfmt

**Keep Biome for this release.** Its existing configuration already provides formatting, recommended lint rules, import organization, and Tailwind-aware CSS parsing. The full check takes tens of milliseconds here; no measured tooling bottleneck or missing required rule justifies replacing it now.

[Oxlint](https://oxc.rs/docs/guide/usage/linter) and [Oxfmt](https://oxc.rs/docs/guide/usage/formatter) are viable alternatives. Oxlint's [type-aware rules](https://oxc.rs/docs/guide/usage/linter/type-aware) could justify a later migration if we specifically want checks such as unhandled promises; they require the additional `oxlint-tsgolint` dependency. A migration should map the current rules, accessibility coverage, formatting, and import organization deliberately. Switching is not a security or store-approval requirement, so Biome was updated rather than replaced.

## License and branding

The requested license is applied as **GPL-3.0-only** in `LICENSE`, package metadata, README, contribution guidance, and bundled notices. It requires compliant source distribution and retained notices when distributing covered derivatives. It **does not prevent commercial copies or competing Chrome Web Store listings**. Earlier MIT-licensed copies retain their original permissions, and third-party components retain their own licenses. Relicensing assumes you control the relevant project contributions; it cannot relicense third-party data or code you do not own.

Keep the unofficial wording and generic icon. GPLv3 does not grant rights to Netflix's trademarks, and an affiliation disclaimer is not a blanket exemption from trademark law or Google's impersonation/IP rules. A competing listing using its own honest branding can still be lawful and GPL-compliant. See the [GNU GPL FAQ](https://www.gnu.org/licenses/gpl-faq.en.html), [Open Source Definition](https://opensource.org/osd), and [Chrome Web Store policies](https://developer.chrome.com/docs/webstore/program-policies/policies).

## Verification and limits

- Frozen-lockfile install succeeded with Bun 1.4.2 and Node.js 24.21.0.
- Data validation: **3,064 categories across 24 groups**. This checks structure and consistency, not current Netflix availability or data rights.
- Biome and TypeScript checks passed; **55 tests passed, zero failed**, with 6,244 assertions across eleven files.
- Production ZIP built successfully. Every one of its 16 files matched the production output byte-for-byte; root manifest is MV3 with only `storage`. No injection/background scripts or source maps were present. License and source notices were included.
- Release validation passed. No code file exceeded 500 lines.
- Isolated Chromium loaded the actual production extension. Runtime permissions were `storage` with no origins. Search, imported favorites, theme persistence, export, and import were exercised. Importing an experimental-enabled legacy file left integration disabled and permissions unchanged.
- Both current-tab and new-tab links opened the expected genre URL. Netflix requests were intercepted with local test responses: this proves extension navigation, **not** a logged-in Netflix journey or that a particular category currently contains titles.
- No Chrome Web Store upload/review, real Netflix account test, screen-reader audit, or multi-version Chrome matrix was performed. Historical injection tests do not prove that the disabled integration meets current Netflix terms.

The build emits a chunk-size warning for the approximately 506 kB shared JavaScript chunk, including the static catalog and React. It is not a failed build or evidence of remote code. A catalog-loading redesign is not needed to address the identified release risks.

Follow [CHROME_WEB_STORE_SUBMISSION.md](CHROME_WEB_STORE_SUBMISSION.md) for the exact publishing steps, disclosure copy, image sizes, and reviewer instructions. Neither this technical review nor a successful Google review guarantees legal clearance or freedom from future enforcement.
