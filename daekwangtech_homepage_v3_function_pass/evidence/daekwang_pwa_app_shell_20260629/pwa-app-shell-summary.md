# DAEKWANG PWA App Shell

## Scope
PWA runtime app shell only. No visual app shell, no bottom dock, no admin preview, no server auth/D1/R2 changes.

## Implemented
- Service worker registration from `src/pwaAppShell.js`.
- Service worker at `/daekwang-sw.js`.
- App shell cache for root, manifest, favicon/app icon, hero assets, and primary logo.
- Runtime stale-while-revalidate for static assets.
- Navigation fallback for hash routes when offline.
- API and non-GET requests are not intercepted.
- Manifest start_url changed to `/#/`, scope `/`, standalone display retained.

## Smoke
- SW registration active: PASS
- SW controller: PASS
- Cache keys: daekwang-app-shell-v1, daekwang-runtime-v1
- Manifest start_url: /#/
- Offline hash route fallback: PASS
- Admin login unaffected: PASS
- Public route overflow: 0
- Fake KR: 0
- Bottom dock/app shell UI: 0

## Note
Offline mode may emit browser network failure messages for uncached network attempts, but the app shell fallback renders the SPA and keeps routes available.
