# DAEKWANG_PUBLIC_MOBILE_REAL_DEVICE_EDITORIAL_REDUCTION_PATCH_V1

## Summary
Public mobile web UI was reduced editorially after real-device dissatisfaction. The patch avoids reviving app shell/bottom dock/admin public controls and focuses on reducing mobile content density, decorative shadows/gradients, and visible card overload.

## Changed source
- src/App.jsx: added section-specific classes for route-local/mobile editorial targeting.
- styles.css: mobile-only section reduction, simplified decorative surfaces, lower shadow/gradient usage, safer one-column flow.

## HQFS result
- Before user-requested hqfs diagnostic: design-smell score 478, risk HIGH.
- First patch attempt increased static score to 502 because extra selectors included card/shadow strings.
- Reduced-selector pass: design-smell score 461, risk HIGH.
- Net: improved vs original static smell score, but risk remains HIGH due inherited admin/public card-heavy codebase.

## Local visual observations
- 390 home: no app shell, no bottom dock, no fake KR, no public ADMIN pill, no horizontal overflow.
- 390 process: dedicated process page remains, no nested home ProcessBand.
- 390 quality: quality panel is readable; no horizontal overflow.
- 390 notice: search/filter/list remains usable; no bottom dock overlap.

## Remaining HOLD
- Owner real-device visual confirmation.
- Server auth/D1/R2 production remains out of scope.
- Static design smell remains HIGH due inherited card-heavy codebase and admin CSS.
