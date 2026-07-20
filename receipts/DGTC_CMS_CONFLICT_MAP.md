# DGTC CMS Conflict Map

Generated for `feat/dgtc-admin-cms-v1` from base `598e6ef3e3abc37aa793f60086b5870be4344644`.

| File or area | Current authority | Candidate role | Conflict | Handling |
|---|---|---|---|---|
| `daekwangtech_homepage_v3_function_pass/src/app.js` | Existing public app plus legacy local admin | Candidate extension expects DOM/image hooks | Protected file; candidate does not require replacement, but runtime API is absent from current Worker | Leave unchanged pending API adapter proof |
| `daekwangtech_homepage_v3_function_pass/index.html` | Existing mobile/app script order | One CSS and one JS extension line | Additive insertion is mechanically possible | Not applied because Worker contract is unresolved |
| `src/dgtc-cms-extension.js` | Absent | Public slot and notice overlay extension | No filename collision | Not copied while its `/api/cms/public/bootstrap` endpoint is unavailable in current Worker |
| `src/dgtc-cms-extension.css` | Absent | CMS overlay/notice styles | No filename collision; public visual overlay scope needs review | Not copied pending public UI review |
| `public/admin-cms/*` | Absent; existing admin is inside `src/app.js` | Separate CMS UI | Route/asset path needs Worker routing and auth | Not copied pending route/auth adapter |
| `worker/index.js` | Existing Worker with `/api/public/*`, `/api/admin/*`, `/api/cms/*`, session auth, D1/R2/KV | Candidate Worker with `/api/cms/*`, Access JWT, D1/R2 CMS routes | Direct replacement would remove/alter existing routes and bindings | Do not copy; requires function-level merge |
| `migrations/0001_dgtc_cms.sql` | Existing `0001` through `0004`; `0001` owns `notices`, `media_assets`, sessions | Candidate `image_slots`, `image_versions`, `notices`, revisions, audit, 32 seeds | Filename and `notices` schema conflict; candidate columns differ from current `notices` | Do not copy or rename blindly; requires namespaced schema/adapter design |
| `wrangler.jsonc` | Existing static assets config and GitHub deploy path | Candidate example adds Worker main, D1, R2, Access vars/routes | Candidate contains placeholders and changes deployment architecture | Preserve current config; no production values guessed |
| `.github/workflows/deploy-cloudflare.yml` | Push-to-main deploys current root Worker/static build | Candidate scripts include separate deploy path | CI and production deploy scope not requested | Leave unchanged |

## Direct evidence

- Current root Worker defines `notices` with `publish_date`, `category`, `author`, `view_count`, and `content`.
- Candidate migration defines `notices` with `slug`, `body`, `publish_at`, `published_at`, `created_by`, and `updated_by`.
- Current Worker uses `MEDIA_BUCKET`; candidate Worker uses `MEDIA`.
- Current Worker already has server-session authentication and `/api/admin/*` routes; candidate admin calls `/api/cms/admin/*` and uses a different auth path.
- Candidate `wrangler.cms.example.jsonc` contains `REPLACE_WITH_*` placeholders.
- Direct candidate apply scripts copy over `worker/index.js` and `migrations/0001_dgtc_cms.sql`; they were not executed.

## Decision

The conflict was resolved in the integration worktree by keeping the existing Worker and adding `worker/cms-prime.js` as an adapter. Candidate CMS notices are stored in `cms_prime_notices`; the additive migration is `migrations/0005_cms_prime_max.sql`. Existing Worker routes and the existing `notices` table remain untouched. Production Access configuration and full browser QA remain HOLD items.
