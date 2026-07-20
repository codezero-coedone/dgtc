# DGTC CMS Holds

- `PRODUCTION_DEPLOYMENT_HOLD`: no `wrangler deploy`, remote D1 migration, route change, or production asset mutation was executed.
- `WORKER_SCHEMA_CONFLICT`: resolved locally through `worker/cms-prime.js`; existing Worker routes remain in place.
- `MIGRATION_NUMBER_AND_SCHEMA_CONFLICT`: resolved locally through namespaced `0005_cms_prime_max.sql`; existing `notices` table is untouched.
- `CANDIDATE_TEST_HOLD`: candidate `npm test` ran 9 tests with 7 pass and 2 fail. `local-api.test.mjs` hit a Node native callback assertion; `patch.test.mjs` received `status=null` because it invokes `python3` on this Windows environment.
- `BROWSER_INTEGRATION_HOLD`: no integrated CMS browser QA was run because the candidate API is not safely connected to the current Worker.
- `CLOUDFLARE_CONFIG_HOLD`: candidate wrangler config has unresolved `REPLACE_WITH_*` placeholders; no values were guessed.

## Updated integration state

- Existing `dgtc_content` D1 and `dgtc-media` R2 were confirmed read-only through Wrangler.
- `wrangler deploy --dry-run` passed with `DB`, `MEDIA_BUCKET`, and active `dist` bindings.
- Production admin Access remains HOLD until `CF_ACCESS_TEAM_DOMAIN` and `CF_ACCESS_AUD` are configured outside source control.
