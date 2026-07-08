# DGTC CT-B1~B10 Final Delivery Hardening Package

This package replaces the active deployed source folder:
`daekwangtech_homepage_v3_function_pass/`

## What changed
- CT-B1 Live/Repo final marker lock added: `CT-B1~B10_FINAL_DELIVERY_LOCK`.
- CT-B2 all CTA/card/photo/4D click paths re-locked.
- CT-B3 mobile safe bottom sheet and safe-area layout reinforced.
- CT-B4 bottom clipping, excessive blank space, and scroll margin repaired.
- CT-B5 detail modal changed to compact angular industrial card style.
- CT-B6 actual product/facility/quality evidence images restored.
- CT-B7 4D Proof Loop strengthened with seven clickable process steps.
- CT-B8 verify script strengthened for markers, forbidden public CTA copy, legacy overlays, and image assets.
- CT-B9 README/customer handoff notes updated with feature limits.
- CT-B10 build/verify QA passed locally; live/pass still requires user push/deploy and real-device check.

## Local verify
```powershell
cd daekwangtech_homepage_v3_function_pass
npm install
npm run build
npm run verify
node --check src/app.js
```

## Push/deploy
```powershell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
.\PUSH_ACTIVE_FOLDER_REPLACE_DGTC.ps1
```

Check after deploy:
https://dgtc.ejdzm90.workers.dev/?v=ct-b1-10-final#/home
