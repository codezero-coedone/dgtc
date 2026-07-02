# Local Premium Visual Smoke

Preview URL:
`http://127.0.0.1:4317/`

## Routes / Viewports
- `#/` at `360x800`, `390x844`, `430x932`, `768x1024`, `1440x1000`
- `#/company` at `390x844`
- `#/process` at `390x844`
- `#/quality` at `390x844`
- `#/facility` at `390x844`
- `#/products` at `390x844`, `1440x1000`
- `#/notice` at `390x844`, `1440x1000`
- Mobile menu at `390x844`

## Automated Checks
- Forbidden admin/draft words: `PASS`
- Forbidden inquiry/quote/contact CTA words: `PASS`
- Products ecommerce wording: `PASS`
- Console errors: `0`
- Horizontal overflow: `0`
- Mobile shell visible under `1024px`: `PASS`
- Desktop public shell visible at `1440px`: `PASS`
- Public ADMIN pill leakage: `0`
- Bottom dock usable and not covering content: `PASS`

Detailed machine-readable evidence:
- `text-assertion.json`
- `visual-smoke-result.json`
