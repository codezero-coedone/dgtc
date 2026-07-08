# DGTC Desktop Design Lock

LOCK: `DGTC_DESKTOP_EXACT_SCREEN_AUTHORITY_LOCK_V1`

This repo treats the current desktop public homepage as screenshot-authority UI.
The desktop design is not rebuilt from free CSS layout. It is composed from:

- `public/screens/home.jpg`
- `public/screens/company.jpg`
- `public/screens/fields.jpg`
- `public/screens/products.jpg`
- `public/screens/facilities.jpg`
- `public/screens/quality.jpg`
- `src/app.js` desktop exact-screen renderer
- `src/styles.css` cleanup masks and desktop suppression rules

Do not replace desktop screenshots, reintroduce bottom CTA panels, expose public
admin chips, or alter the desktop authority renderer unless the design lock is
intentionally reissued.

Required command before push:

```bash
npm run verify
```

If a team push changes the locked desktop authority by accident, verification
must fail before Cloudflare deployment.
