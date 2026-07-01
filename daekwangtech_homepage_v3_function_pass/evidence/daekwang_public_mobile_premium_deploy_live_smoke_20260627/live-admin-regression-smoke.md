# Live Admin Regression Smoke

## Routes

- #/admin at 390
- #/admin after login at 390
- #/admin after login at 1440

## Credentials

- Wrong credential: blocked
- Demo fallback: dgtc66 / 1234

## Result

| Check | Result |
|---|---|
| Login gate visible | PASS |
| Wrong credential blocked | PASS |
| dgtc66 / 1234 login | PASS |
| Admin 390 overflow | 0 |
| Admin 1440 overflow | 0 |
| Admin console errors | 0 |
| Notification panel opens at 1440 | PASS |
| Admin preview untouched by this lock | PASS |

## Note

The 390 admin smoke verifies login and responsive access without modifying admin shell code. Notification panel behavior was verified at 1440 where the topbar control is visible.

## Evidence

- admin-login-390.png
- admin-after-login-390.png
- admin-after-login-1440.png
