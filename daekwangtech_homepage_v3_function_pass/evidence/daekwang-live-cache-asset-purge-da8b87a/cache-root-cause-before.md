LOCK: DAEKWANG_LIVE_CACHE_ASSET_PURGE_V1

BEFORE:
- Service worker registered from src/pwaAppShell.js at /daekwang-sw.js.
- public/daekwang-sw.js used fixed caches daekwang-app-shell-v1 and daekwang-runtime-v1.
- Strategy cached app shell, navigation root, and static runtime assets, allowing stale mobile UI on existing devices.
- App can run without service worker because SW registration is progressive enhancement only.
