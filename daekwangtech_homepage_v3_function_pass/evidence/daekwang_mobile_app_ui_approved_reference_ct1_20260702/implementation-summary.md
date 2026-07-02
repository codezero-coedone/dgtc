# DAEKWANG MOBILE APP UI APPROVED REFERENCE CT1

## Scope
- Active circuit: `PUBLIC_MOBILE_APP_UI_APPROVED_REFERENCE_CT1_ONLY`
- Source changes: `src/App.jsx`, `styles.css`
- Deploy: not run in this lock
- Push target after commit: `origin/main`

## Implementation
- Added a mobile/tablet-only public shell for widths below `1024px`.
- Preserved the desktop public render at `1024px+`.
- Added compact app-style top brand bar, dark blue manufacturing hero, card-based capability/process/quality/facility/products/notice surfaces, dark full menu, and bottom app-style dock.
- Products are presented as manufacturing capability cards, not ecommerce.
- Notice cards use public-facing copy only.
- Bottom dock was changed to sticky/flow placement to keep the tab experience without covering important content.

## Forbidden Circuits
- Server/auth/D1/R2/PWA runtime: not touched.
- Logo asset authority: not touched.
- Admin preview/admin shell: not touched.
- Package dependencies: not touched.
- Cloudflare deploy config: not touched.
