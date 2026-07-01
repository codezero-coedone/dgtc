# Local Smoke Summary

Preview:
- URL: `http://127.0.0.1:4199/`

Public routes:
- `#/` 390, 430, 1024, 1440: PASS, overflow 0, fake KR 0, bottom dock 0, public ADMIN 0.
- `#/company` 390: PASS, overflow 0.
- `#/technology` 390: PASS, overflow 0.
- `#/process` 390 and 1024: PASS, overflow 0. 1024 uses compact desktop density.
- `#/quality` 390: PASS, overflow 0.
- `#/notice` 390 and 1440: PASS, overflow 0.

Admin:
- Fresh `#/admin` login gate visible at 390.
- Wrong credential blocked.
- `dgtc66 / 1234` login works.
- Admin shell visible after login at 390, 1024, 1440.
- Notification button opens panel at 1440.
- Admin overflow 0 in checked viewports.

Console:
- Browser error logs: 0.

Screenshots:
- Stored in this evidence folder as `*.png`.
