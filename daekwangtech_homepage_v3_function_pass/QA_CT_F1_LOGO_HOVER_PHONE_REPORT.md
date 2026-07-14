# CT-F1 Logo / Hover / Mobile Number Cleanup

## Applied
- Rebuilt all six public-screen footers.
- Removed the boxed/duplicated footer logo.
- Replaced it with the transparent angular DK logo and a subtle blue glow.
- Removed mobile phone number 010-9256-7475 from every footer image.
- Kept TEL, FAX and email.
- Removed hotspot hover fill and blue pre-click visual panel.
- Preserved keyboard focus indication without a filled overlay.

## Verification
- node --check src/app.js
- npm run build
- npm run verify
- npm run verify:cta
- npm run verify:runtime
- npm run verify:footer-ui

## HOLD
- Live browser visual confirmation remains required after deployment.
