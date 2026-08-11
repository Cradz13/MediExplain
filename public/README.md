# Brand assets

| File | Size | Used for |
| --- | --- | --- |
| `logo.png` | 512×512 | App header brand mark, printed report header, large favicon |
| `logo-192.png` | 192×192 | Apple touch icon, Android home-screen icon |
| `favicon-64.png` | 64×64 | Browser tab favicon |

The logo is the MediExplain mark: a dark navy squircle containing a blue rounded
square with a white stethoscope.

## Where it is wired up

- `index.html` — `<link rel="icon">` / `<link rel="apple-touch-icon">`
- `src/components/BrandLogo.tsx` — shared component (used by `Header.tsx`)
- `src/components/PrintableReportView.tsx` — print/PDF header

If `logo.png` is ever missing, `BrandLogo` falls back to the built-in
stethoscope badge so the header never breaks.

## Replacing the logo

Overwrite the three PNGs above, keeping the same file names and dimensions.
No code changes are required.
