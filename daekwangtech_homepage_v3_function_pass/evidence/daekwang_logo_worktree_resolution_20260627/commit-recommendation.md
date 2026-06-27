# COMMIT RECOMMENDATION

recommendation: separate commit recommended

decision: LOGO_WORKTREE_COMMIT_READY

## Rationale

The unstaged logo changes form a coherent logo-only worktree:

- shared logo source authority points to `/brand/daekwang-primary-logo.png`
- notice public pages use full image lockup
- admin topbar uses full image lockup
- admin seed references the same primary logo asset
- old text-logo CSS is removed

Build and local visual smoke passed.

## Suggested commit scope

Include:

- src/admin-tokens.css
- src/adminContentSeed.js
- src/components/daekwang-admin/AdminTopbar.jsx
- src/pages/NoticePages.jsx
- src/styles/brand-tokens.css
- evidence/daekwang_logo_final_fix/
- evidence/daekwang_logo_worktree_resolution_20260627/
- evidence/receipts/daekwang-logo-worktree-resolution-20260627.json

Do not include:

- src/App.jsx
- styles.css
- server auth / Worker / D1 / KV / R2 files
- admin preview files

Suggested commit message:

`Resolve Daekwang primary logo worktree`

## Deploy recommendation

Do not deploy in this lock.

Deploy only after a follow-up explicit deploy lock or owner approval.

## Remaining risk

- Physical device visual confirmation remains owner-side.
- No Cloudflare live proof was produced for this logo worktree because deploy was explicitly forbidden.
