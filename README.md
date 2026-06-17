# DAE KWANG TECH Corporate Homepage

대광테크 회사소개형 B2B 원페이지 홈페이지입니다.

## Project

- 기업: 대광테크
- 영문명: DAE KWANG TECH
- 형태: 회사소개 / 사업영역 / 기술역량 / 공정·품질 / 설비·인프라 / 오시는 길 중심 원페이지
- URL: `https://dgtc.ejdzm90.workers.dev/`
- Worker name: `dgtc`

## Navigation

The app uses section anchors instead of separate route pages.

- `#home`
- `#company`
- `#business`
- `#technology`
- `#process-quality`
- `#facilities`
- `#location`

## Cloudflare Workers Static Assets

- Build command: `npm run build`
- Deploy command: `npx wrangler deploy`
- Production branch: `main`
- Static assets directory: `./daekwangtech_homepage_v3_function_pass/dist`
- SPA fallback: `not_found_handling = single-page-application` in `wrangler.jsonc`

Do not put `main` in the deploy command. Use `npx wrangler deploy`.

## Local

```powershell
$env:PATH='C:\Users\USER\AppData\Local\nvm\v22.22.0;' + $env:PATH
& 'C:\Users\USER\AppData\Local\nvm\v22.22.0\npm.cmd' install
& 'C:\Users\USER\AppData\Local\nvm\v22.22.0\npm.cmd' run typecheck
& 'C:\Users\USER\AppData\Local\nvm\v22.22.0\npm.cmd' run build
& 'C:\Users\USER\AppData\Local\nvm\v22.22.0\npm.cmd' run dev
```

## Notes

- The active deployed source is `daekwangtech_homepage_v3_function_pass`.
- No inquiry, quote, or consultation CTA is part of this site.
- Unknown official company values remain marked as `자료 확인 중`.
