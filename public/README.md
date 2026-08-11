# Brand assets

Drop your logo here as **`logo.png`** (square PNG, transparent background, ideally 512×512).

It is used automatically in three places, with no code changes needed:

| Where | File |
| --- | --- |
| Browser tab icon / apple-touch-icon | `index.html` (`<link rel="icon" href="/logo.png">`) |
| App header brand mark | `src/components/BrandLogo.tsx` (used by `Header.tsx`) |
| Printed / saved report header | `src/components/PrintableReportView.tsx` |

If `logo.png` is missing, the app falls back to the built-in stethoscope badge.
