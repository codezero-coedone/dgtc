# DAEKWANG HQFS Mobile Real Device Diagnostic

## Context

- User reported real-device mobile visual dissatisfaction after automated smoke passed.
- Objective: use `hqfs-core.exe` to identify the circuit failure before another patch.
- Source mutation: NO.
- Deploy: NO.

## HQFS Commands Used

- `origin-battlefield-compile`
- `visual-layout-static-analyzer`
- `ui-density-meter`
- `design-smell-detector`

## Key Results

| Gate | Result | Meaning |
|---|---|---|
| origin battlefield compile | PASS | repo battlefield compiled, no direct organ call |
| visual layout static analyzer | PASS / LOW risk | no catastrophic static layout failure found |
| ui density meter | PASS | density measured; shell/public code still dense |
| design smell detector | HIGH | visual quality problem confirmed structurally |

## Root Cause Judgment

The current real-device issue is not primarily horizontal overflow or route breakage.
The problem is visual authority and mobile information density:

- Too many card-like surfaces.
- Too many shadows and gradients.
- Mobile home has long repeated card sections.
- Product/facility/quality image cards feel stacked rather than edited.
- Several dark placeholder-looking image areas make the page feel unfinished on a phone.
- Smoke tests pass because DOM, routing, overflow, and console are stable, but customer-review visual quality remains HOLD.

## HQFS Evidence Numbers

From `design-smell-detector`:

- `smellScore`: 478
- `risk`: HIGH
- `card_spam`: 281
- `gradient_spam`: 79
- `shadow_spam`: 69
- `badge_noise`: 29
- `fake_status_label`: 16

From `visual-layout-static-analyzer`:

- `styles.css` card/shadow signals: 297
- `styles.css` fixed px width signals: 56
- `styles.css` panel width rules: 11
- `styles.css` z-index stack: 14

## What This Means

Previous patches kept the site functional and stable, but the mobile visual system is still over-layered.
The next patch should not add another app shell or more cards.
It should reduce, consolidate, and editorialize the mobile public homepage.

## Next Safe Patch

Recommended lock:

`DAEKWANG_PUBLIC_MOBILE_REAL_DEVICE_EDITORIAL_REDUCTION_PATCH_V1`

Scope:

- public mobile route only
- `src/App.jsx`
- `styles.css`
- no admin
- no server auth
- no logo asset
- no bottom dock/app shell

Repair direction:

1. Mobile home: reduce visible sections and card count in first long scroll.
2. Product/service cards: compress into 2-3 premium grouped rows or horizontal scroll-free editorial blocks.
3. Facility/quality image cards: remove dark placeholder feeling by using consistent image crop and fewer repeated cards.
4. Process: keep vertical step flow but reduce card chrome.
5. Notice: keep current stable list but soften duplicate pinned/list repetition if visible.
6. Footer: preserve compact finish.

## Final Diagnostic Decision

`HQFS_DIAGNOSTIC_COMPLETE_REAL_DEVICE_VISUAL_HOLD`

Functional deploy may remain PASS_HOLD, but customer-review mobile visual PASS should stay HOLD until the editorial reduction patch lands and owner confirms on real device.
