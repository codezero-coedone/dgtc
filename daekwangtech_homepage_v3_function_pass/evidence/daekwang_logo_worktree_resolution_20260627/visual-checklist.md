# VISUAL CHECKLIST

local preview: http://127.0.0.1:4201

deployment: not run

## Checked surfaces

| surface | viewport | screenshot | result |
| --- | ---: | --- | --- |
| public home | 390 | logo-home-390.png | PASS |
| public home | 1440 | logo-home-1440.png | PASS |
| public notice | 390 | logo-notice-390.png | PASS |
| public notice | 1440 | logo-notice-1440.png | PASS |
| admin login | 390 | logo-admin-login-390.png | PASS |
| admin topbar after login | 1440 | logo-admin-topbar-1440.png | PASS |
| admin notice management | 1440 | logo-admin-notice-1440.png | PASS |

## Required checks

- logo not cropped: PASS
- logo not blurry at tested viewport scale: PASS
- logo not duplicated: PASS
- fake KR not reintroduced: PASS
- bottom dock not reintroduced: PASS
- public ADMIN pill not reintroduced: PASS
- notice layout not broken: PASS
- admin topbar layout not broken: PASS
- horizontal overflow 0: PASS
- console error 0: PASS

## Machine result

`visual-check-result.json` summary:

- checked surfaces: 7
- overflows: 0
- console errors: 0
- bad logo detections: 0
- KR hits: 0
- bottom dock/app shell hits: 0
- public admin hits: 0
