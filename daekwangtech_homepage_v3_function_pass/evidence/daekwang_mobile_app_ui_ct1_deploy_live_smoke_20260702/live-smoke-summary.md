# DAEKWANG MOBILE APP UI CT1 LIVE SMOKE SUMMARY

## Public Routes
- `#/` at `360x800`, `390x844`, `430x932`, `768x1024`, `1440x1000`
- `#/company` at `390x844`
- `#/process` at `390x844`
- `#/quality` at `390x844`
- `#/facility` at `390x844`
- `#/products` at `390x844`, `1440x1000`
- `#/notice` at `390x844`, `1440x1000`
- Mobile menu at `390x844`

## Public Results
- Forbidden public/admin/draft text: `PASS`
- Forbidden inquiry/quote/contact CTA text: `PASS`
- Products ecommerce wording: `PASS`
- Console errors: `0`
- Horizontal overflow: `0`
- Mobile shell visible under `1024px`: `PASS`
- Desktop public shell visible at `1440px`: `PASS`
- Public ADMIN pill leakage: `0`
- Bottom dock: `sticky`, usable, not fixed over important content

## Admin Preview Sanity
- Route reachable: `YES`
- Preview smoke: `AUTH_BLOCKED_HOLD`
- Source/auth changes in this lock: `NONE`

Detailed machine-readable evidence:
- `asset-freshness.json`
- `public-text-assertion-live.json`
- `visual-smoke-result-live.json`
- `admin-preview-sanity-live.json`
