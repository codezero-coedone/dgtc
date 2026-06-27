# NEXT ACTION PLAN

recommended path: Option 2, create a separate future lock for BRAND_LOGO_HOLD.

reason:

- Most remaining unstaged source changes are logo authority or logo rendering changes.
- `src/styles/brand-tokens.css`, `src/adminContentSeed.js`, `src/pages/NoticePages.jsx`, and `evidence/daekwang_logo_final_fix/` align more with logo source/render authority than with public mobile web UI.
- `AdminTopbar.jsx` and `admin-tokens.css` are admin logo placement changes and should be reviewed together with the logo lock, not with PUBLIC_MOBILE_WEB_UI_ONLY.

recommended next lock:

`DAEKWANG_LOGO_WORKTREE_RESOLUTION_AND_VISUAL_CONFIRM_LOCK_V1`

goal:

- Decide whether the existing unstaged logo changes are correct.
- If correct, validate them under a logo-only lock with public/admin/notice screenshots.
- If incorrect or stale, ask before reset/stash. Do not silently discard.

files to inspect in the next lock:

- src/admin-tokens.css
- src/adminContentSeed.js
- src/components/daekwang-admin/AdminTopbar.jsx
- src/pages/NoticePages.jsx
- src/styles/brand-tokens.css
- evidence/daekwang_logo_final_fix/

files not to touch in the next lock unless explicitly authorized:

- src/App.jsx
- styles.css public mobile web section added by commit 20a69c9
- server auth / Worker / D1 / KV / R2 files
- admin preview files

do not do now:

- Do not stage.
- Do not commit.
- Do not push.
- Do not deploy.
- Do not reset or stash.

alternate options:

- Option 1: leave unstaged and proceed to owner real-device QA for the already deployed public mobile web UI.
- Option 3: create a separate ADMIN_PREVIEW_HOLD or admin topbar lock if the next concern is admin visual consistency.
- Option 4: create a separate notice/content seed cleanup lock if notice route content is the next target.
- Option 5: if any unstaged file is judged accidental/noise, ask user before reset or stash.

current decision:

Leave all unstaged source and evidence as-is until the next explicit lock.
