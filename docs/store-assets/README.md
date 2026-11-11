# Chrome Web Store images

Captured from the installed production extension using visible Chrome controls on 2026-09-22. Sample favorites were used for the screenshots. Original user preferences were backed up outside the repository, restored, and compared successfully afterward. No account information, browser tabs, bookmarks, or personal settings exports are included here.

In the Chrome Web Store Developer Dashboard, open your extension and select **Store listing**. Upload these PNG files individually:

| File                | Size       | Upload field                                                     |
| ------------------- | ---------- | ---------------------------------------------------------------- |
| `icon-128.png`      | 128 x 128  | Store icon, if requested (also bundled in the extension ZIP)     |
| `01-browse.png`     | 1280 x 800 | Screenshots, first image: category browsing in dark theme        |
| `02-search.png`     | 1280 x 800 | Screenshots, second image: search in light theme                 |
| `03-favorites.png`  | 1280 x 800 | Screenshots, third image: sample favorites in dark theme         |
| `04-options.png`    | 1280 x 800 | Screenshots, fourth image: appearance, backup, and data controls |
| `promo-440x280.png` | 440 x 280  | Small promotional tile                                           |

The optional marquee image is not included; leave that field blank. Do not upload `promo.html` or this README. `promo.html` is the editable source of the promotional tile, rendered and captured through Chrome at 440 x 280 and device pixel ratio 1.

The popup screenshots show the actual popup page opened in a tab at 100% zoom. Its surrounding background is part of the page capture, and the scrollable category list may continue below the visible portion. Options was captured at 80% browser zoom to fit all controls. No UI elements or features were invented or added to the captures.

Use these images instead of the historical images in `docs/screenshots/`, which include disabled features and different dimensions. Listing images are separate from the extension package, so these assets do not require a ZIP rebuild.
