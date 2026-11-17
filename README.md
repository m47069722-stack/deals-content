# deals-content

Content files for the Deals Soldier app, served as static files from GitHub Pages (`docs/`).

- `docs/deals.json` is rebuilt every two days by the `refresh` workflow from Woot's official API (key in the `WOOT_KEY` repository secret) and from the public deal pages of Walmart and eBay. Each source is independent: if one fails, its earlier cards stay for a few days and the others are published. `docs/status.json` records every run.
- The other `docs/*.json` files (settlements, refunds, repair programs and rules) are updated by hand.
- `docs/privacy.html` is the app's privacy policy.

Run locally: `WOOT_KEY=… node collect/build.mjs` (Node 20 or newer, no dependencies).
