# Local Visual Smoke

## Preview

- Local preview URL: http://127.0.0.1:4199
- Browser: Chromium via system Chrome executable

## Public Routes

| Route | Viewport | Console Errors | Overflow | App Shell | Bottom Dock | Fake KR | Public ADMIN |
|---|---:|---:|---:|---|---|---|---|
| #/ | 360 | 0 | 0 | no | no | no | no |
| #/ | 390 | 0 | 0 | no | no | no | no |
| #/ | 430 | 0 | 0 | no | no | no | no |
| #/ | 768 | 0 | 0 | no | no | no | no |
| #/company | 390 | 0 | 0 | no | no | no | no |
| #/technology | 390 | 0 | 0 | no | no | no | no |
| #/process | 390 | 0 | 0 | no | no | no | no |
| #/quality | 390 | 0 | 0 | no | no | no | no |
| #/notice | 390 | 0 | 0 | no | no | no | no |
| #/ | 1440 | 0 | 0 | no | no | no | no |
| #/notice | 1440 | 0 | 0 | no | no | no | no |

## Admin Smoke

| Check | Result |
|---|---|
| #/admin login 390 loads | PASS |
| wrong credential blocked | PASS |
| dgtc66 / 1234 login works | PASS |
| notification panel opens | PASS |
| admin after-login 390 overflow | 0 |
| admin after-login 1024 overflow | 0 |
| admin after-login 1440 overflow | 0 |
| admin console errors | 0 |

## Process Guard

- Home route has normal home `process-band`: expected.
- Process route hasProcessBand=false: PASS.
- Process route hasProcessPage=true: PASS.

## Screenshots

- home-360.png
- home-390.png
- home-430.png
- home-768.png
- company-390.png
- technology-390.png
- process-390.png
- quality-390.png
- notice-390.png
- home-1440.png
- notice-1440.png
- admin-login-390.png
- admin-after-login-390.png
- admin-after-login-1024.png
- admin-after-login-1440.png
- admin-notification-1440.png
