# DAEKWANG_PUBLIC_MOBILE_WEB_UI_PREMIUM_FINISH_CODEX_V1

## Precheck

- Branch: main
- Working tree before patch: clean
- Static check: PASS
- Vite build: PASS
- Existing Tailwind content warning remains P2 HOLD

## Current Public Mobile Structure

- Header: `site-header`, logo lockup, desktop nav hidden under 1100px, mobile menu button/panel.
- Hero: `hero`, image background, blueprint accent, headline/copy/progress.
- Home sections: feature rail, product cards, process band, quality home grid, facility/trust/company, notice section, footer.
- Sub pages: `SubPage` with hero, metric row, card grid, optional process page section, quality control panel, compact closing panel.
- Notice pages: dedicated `NoticeListPage` / `NoticeDetailPage` plus shared public header/footer.

## Findings

- Public mobile is website-based, not app shell based.
- `PublicMobileAppLayer.jsx` is not present at the expected path and is not an active route dependency.
- Bottom dock/app shell classes are not active in public render.
- Fake KR selector and public ADMIN pill are not present in the visible public header flow.
- Main polish opportunities are CSS-level: mobile section spacing, card radius/shadow consistency, hero text rhythm, process/quality mobile readability, notice chip/list wrapping, and footer line rhythm.

## Patch Boundary

- Allowed source files: `styles.css`, `src/App.jsx`.
- Planned source edit: `styles.css` only unless a structural bug appears.
- Forbidden circuits: admin preview, admin shell, server auth/D1/R2, logo authority, app shell.
