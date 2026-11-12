# Privacy policy

Effective date: 2026-09-22

This policy covers **Categories for Netflix (Unofficial)**, maintained by Pankaj ([project and support](https://github.com/antick/hidden-netflix-categories)). It is independent of Netflix.

## Information used

The extension stores your favorites, hidden category IDs, the last 10 category IDs you opened through it, theme, and settings in `chrome.storage.local` in your browser profile. Previously saved or imported empty-category IDs can also be retained and restored. These lists can reveal your interests; do not share a settings export unless you intend to disclose them.

Search text is processed in memory against a bundled catalog. It is not sent to the developer and is not saved as search history. Recent selections are extension activity, not your Netflix viewing history.

The store release requests only the `storage` permission. It does not inject scripts into Netflix, inspect Netflix pages, access cookies or account credentials, or read your browsing history. The experimental integration remains in the source repository but is excluded from the release package and cannot be enabled through settings or an import.

## Network and sharing

There is no developer-operated backend, analytics, advertising, telemetry, or remote category service. The developer does not receive your saved lists or searches. They are not sold or shared for advertising, credit decisions, or unrelated purposes. Use of information from Chrome APIs complies with the Chrome Web Store User Data Policy, including its Limited Use requirements.

Opening a category navigates your browser to an HTTPS Netflix URL. Netflix then receives the normal browser request and handles it under its own privacy policy. Opening the source, support, or privacy links visits GitHub. Those sites have their own privacy practices; this policy does not cover them. Chrome itself handles extension installation and updates.

## Export, import, retention, and deletion

Export creates an unencrypted JSON file on your device. Import reads a file you explicitly choose and replaces your local extension settings after confirmation. Neither feature uploads the file. Imported settings cannot enable page integration.

Saved settings remain until you clear or reset them in Options, remove the extension, or remove the browser profile. Options provides individual list controls and **Reset All Settings**. Resetting or uninstalling does not delete files you exported or copies retained in device backups; delete those separately. The extension does not add application-level encryption to local browser storage, so anyone with access to your browser profile or exports may be able to read them.

## Changes and contact

Changes to data handling will be reflected here and disclosed in the extension and store listing when required. For questions, use the [project issue tracker](https://github.com/antick/hidden-netflix-categories/issues). Do not post private exports, credentials, or account screenshots. For vulnerabilities, follow [SECURITY.md](https://github.com/antick/hidden-netflix-categories/blob/main/SECURITY.md).
