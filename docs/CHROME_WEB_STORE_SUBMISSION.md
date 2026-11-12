# Chrome Web Store submission

Checked against Google's official guidance on 2026-09-22. No listing has been created or submitted by this review. This guide describes the **storage-only build**, with page integration excluded.

## 1. Prepare the public repository

- Read the [category-source note](CATEGORY_DATA.md). The list contains public category names and numeric codes; this review has not established a licensing violation or a permission requirement for those facts. Keep source attribution and avoid copying protected article content.
- Your personal commit email is normal Git metadata. Leave it unchanged if intentional; using GitHub's noreply address for future commits is an optional privacy choice, not a release requirement.
- Publish the reviewed source, including GPLv3, `bun.lock`, notices, and build instructions. The source linked in `apps/extension/public/SOURCE.txt` must match each binary release. Tag/archive the exact release; do not link only to a changing default branch as the sole source for old releases.
- Enable GitHub private vulnerability reporting, dependency alerts, and secret scanning where available. Do not upload local `.git` contents, profiles, settings exports, or development artifacts to the store.
- Review [RELEASE_REVIEW.md](RELEASE_REVIEW.md). This technical review is not legal clearance, and neither Google approval nor freedom from Netflix enforcement is guaranteed.

In practical terms, “publish the privacy policy” means push `PRIVACY.md` to the public repository, open its GitHub link while signed out, and paste that link into the store's Privacy policy URL field. No separate website is necessary. “Matching source” means commit the files used to build version 1.0.0, create a GitHub tag/release such as `v1.0.0` at that commit, and link that release from the store listing. Include the source, lockfile, and build instructions so someone can build the version they installed.

## 2. Register and secure the publisher account

1. Choose a Google account you control and monitor long-term. Enable two-step verification before publishing.
2. Open the [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole).
3. Accept the developer agreement and pay the one-time registration fee shown by Google. Use the current dashboard amount; do not rely on old screenshots quoting a fee.
4. Complete publisher details and verify the contact email. Complete any identity, trader/non-trader, address, or phone verification the dashboard requires for your circumstances and distribution regions. Answer truthfully; a free extension does not automatically settle trader status.
5. Check which contact details will be public and enable policy/review notifications.

Sources: [register](https://developer.chrome.com/docs/webstore/register), [account setup](https://developer.chrome.com/docs/webstore/set-up-account), [two-step verification](https://developer.chrome.com/docs/webstore/program-policies/two-step-verification).

## 3. Build and verify the exact upload

Use Bun 1.4.2 and a supported Node.js version (22 or newer):

```bash
bun install --frozen-lockfile
bun run validate:data
bun run check
bun run typecheck
bun run test
bun run zip
bun run validate:release
unzip -l apps/extension/.output/netflix-categories-chrome-1.0.0-chrome.zip
```

The version in the ZIP filename follows `apps/extension/package.json`. Run these from the repository root; the website in `apps/landing` is not part of the ZIP. `wxt zip` performs a production build. Upload the generated ZIP, **not** a ZIP of the repository and not a development build.

The ZIP must have `manifest.json` at its root, Manifest V3, `permissions: ["storage"]`, packaged scripts/styles/fonts, GPLv3, source information, and third-party notices. It must have no background/content script, host/optional/scripting/activeTab permission, development reload client, `.env`, key, profile, or source map. `validate:release` checks the output directory; inspect the corresponding ZIP too.

Keep `PAGE_INTEGRATION_ENABLED = false` in `apps/extension/lib/release.ts`. Do not bypass the release check or silently re-enable the retained integration.

Load `apps/extension/.output/chrome-mv3` at `chrome://extensions` in a fresh profile. Check search, current/new-tab links, favorites, hide/restore, recent, themes, export/import, and reset. Confirm there is no header integration switch, including after importing an older export with its flag set to true. Test on the Chrome versions you intend to support.

## 4. Prepare the listing images

Use the current production UI and synthetic preferences; do not expose personal accounts, browsing tabs, emails, or watch history.

- Package/store icon: `apps/extension/public/icons/icon-128.png` (128×128 PNG). The icon uses generic category/search artwork, not the Netflix N logo.
- Screenshots: at least one, maximum five, **1280×800** preferred or **640×400**, full bleed with square corners.
- Small promotional tile: **440×280**, required.
- Optional marquee: **1400×560**.

Ready-to-upload images are in [store-assets/](store-assets/README.md): four current 1280×800 screenshots, the 128×128 icon, and a 440×280 promotional tile. Upload them according to that folder's table. The existing files in `docs/screenshots/` are historical reference images with different dimensions and disabled features; do not use them for this listing or advertise automatic empty detection.

Source: [Google's image requirements](https://developer.chrome.com/docs/webstore/images).

## 5. Create the draft item

1. In the dashboard, select **Add new item**.
2. Upload `apps/extension/.output/netflix-categories-chrome-1.0.0-chrome.zip`.
3. Check the Package tab's version and permissions. Stop if it shows site access or a content/background script.
4. Fill the Store listing tab with accurate English copy, the closest available category, and current images. Use an entertainment-related category if offered; the dashboard's choices can change.
5. Set the homepage to `https://github.com/antick/hidden-netflix-categories` and support to `https://github.com/antick/hidden-netflix-categories/issues`. Set the privacy policy URL to `https://github.com/antick/hidden-netflix-categories/blob/main/PRIVACY.md`. Listing fields can be submitted without a new package upload. Remove any retired website links from descriptions and the Official URL field as well.

Source: [publish an extension](https://developer.chrome.com/docs/webstore/publish).

## 6. Fill privacy practices

**Single purpose**

> Help users find and open public Netflix genre pages and organize their category selections locally.

**storage justification**

> Save favorites, hidden categories, the last 10 categories opened through this extension, theme, settings, and any imported historical empty-category markers in the user's browser. Provide local export/import and reset controls. No backend or analytics.

**Remote code**

Select **No, I am not using remote code**. Runtime code, fonts, and category data are bundled. Links that navigate to Netflix/GitHub are not remotely executed extension code.

**Privacy policy URL**

Publish `PRIVACY.md`, then use `https://github.com/antick/hidden-netflix-categories/blob/main/PRIVACY.md` or a public hosted copy. Open the URL while signed out and verify it works. A private-repository URL is not an acceptable public policy link.

**Data-use disclosures**

Describe local preferences and recent extension selections accurately. No information is transmitted to the developer, advertisers, or analytics providers. The extension still handles local user data; do not equate "no server" with "no data processing." Review the current dashboard definitions and disclose any categories that encompass locally stored activity/preferences. Certify the limited-use statements only if they remain true. Do not list unrelated account, payment, health, location, cookie, or browsing-history access that the extension does not perform.

Google requires a privacy policy even for local-only user data. Sources: [privacy fields](https://developer.chrome.com/docs/webstore/cws-dashboard-privacy), [local storage FAQ](https://developer.chrome.com/docs/webstore/program-policies/user-data-faq).

## 7. Listing copy

**Name:** Categories for Netflix (Unofficial)

**Short description:** Search Netflix genre codes, save favorites, hide categories, and keep your lists locally. Unofficial; no site access.

**Long description:**

> Find public Netflix genre codes from a bundled catalog. Search by name or numeric code, open a category in the current tab or a new tab, and copy links or codes.
>
> Keep favorites, hide categories, and see the last 10 categories you opened through this extension. Export/import settings as a local JSON file and switch between light and dark themes. Everything is stored in your browser; there is no developer backend, advertising, or analytics.
>
> This release does not inject a Netflix menu, inspect Netflix pages, or automatically detect empty categories. It requests only local storage permission.
>
> Category availability varies by region and can change. Opening Netflix pages still requires normal Netflix access; this extension does not unlock restricted titles, bypass subscription/region restrictions, or modify playback.
>
> Independent open-source software under GPLv3. Not affiliated with, endorsed by, or sponsored by Netflix. Netflix is a third-party trademark.

Avoid "official," "all titles," "unlocks Netflix," guaranteed regional access, or claims that every listed code has been independently verified.

## 8. Reviewer test instructions

> No extension account or sign-in is required. Install, open the toolbar popup, search "cyberpunk" or "8711", favorite a result, then use Favorites. Hide a category and restore it from Hidden. Choose a category's current-tab/new-tab button; it opens a normal `https://www.netflix.com/browse/genre/<code>` URL. Netflix itself may require the reviewer's own account; do not supply personal credentials.
>
> Open Options, change theme, export settings, and import that file after confirming replacement. Reset All Settings clears local lists. Importing a legacy settings file with the experimental flag enabled cannot activate page integration.
>
> Only `storage` is requested. There are no content scripts, background scripts, host permissions, telemetry, remote code, or private Netflix API calls in this package. Historical integration code is retained in the public source but excluded from this release. License and source notices are bundled.

If Google requires additional evidence, provide a truthful recording using synthetic data; never invent a working Netflix test account or share your own password.

## 9. Choose distribution and submit

1. Select intended countries/regions and the truthful free/paid settings.
2. Start with private trusted testers or unlisted visibility if you want an initial review/test rollout. These choices do not bypass store policies.
3. Confirm the public policy and exact corresponding source links work, all required fields are complete, and the ZIP matches the reviewed build.
4. Select **Submit for Review**. Choose deferred/manual publishing if you want to control the launch after approval.
5. Watch the verified email and dashboard. Review timing varies. Resolve rejections against the specific cited policy; do not repeatedly resubmit unchanged builds or create new accounts to evade enforcement.
6. After approval, publish within Google's stated window (currently 30 days for a staged approved submission), then test the store-installed version and add the real store link to README.

Source: [submission and deferred publishing](https://developer.chrome.com/docs/webstore/publish).

## 10. Future releases

Increase `apps/extension/package.json`'s version, update the lockfile/notices as needed, repeat tests and package checks, publish matching GPLv3 source, and upload the new ZIP to the same item. Keep data disclosures and screenshots aligned with the shipped features. Treat enabling page integration as a new legal/privacy/permissions decision, not a routine toggle.

The landing page source and checks are retained for local use. GitHub Releases no longer deploy a website.
