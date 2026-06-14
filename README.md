# DAEKWANG TECH Corporate Homepage

대광테크 자동차 유압부품 제조 기업 홈페이지입니다.

## Cloudflare Workers Static Assets

현재 Cloudflare 프로젝트가 Workers 서비스로 연결된 경우 아래 값으로 둔다.

- Build command: `npm run build`
- Deploy command: `npx wrangler deploy`
- Root directory: empty
- Production branch: `main`
- Worker name: `dgtc`
- Public URL: `https://dgtc.ejdzm90.workers.dev/#/`
- Static assets directory: `./dist` via `wrangler.jsonc`
- SPA refresh fallback: `not_found_handling = single-page-application`

주의: Deploy command에 `main`을 넣으면 `/bin/sh: 1: main: not found`로 실패한다.

## Latest Verification Scope

2026-06-14 KST 기준 로컬 및 공개 배포 검수 기준.

- PASS: `npm run lint`
- PASS: `npm run build`
- PASS: `npx wrangler deploy`
- PASS: Public URL: `https://dgtc.ejdzm90.workers.dev/#/`
- PASS: Hash routes
  - `#/company`
  - `#/products`
  - `#/capability`
  - `#/quality`
  - `#/gallery`
  - `#/support`
- PASS: Contact form submit alert
- PASS: 390px mobile no horizontal scroll
- PASS: Gallery modal fits mobile viewport
- PASS: Public title is `대광테크 | DAEKWANG TECH`

## Image Replacement Paths

실제 사진 교체 시 아래 파일명으로 넣으면 코드 수정 없이 반영됩니다.

- Hero: `public/images/hero/hero-main.jpg`
- Products: `public/images/products/product-01.jpg` ... `product-06.jpg`
- Company: `public/images/company/company-01.jpg` ... `company-06.jpg`
- Equipment: `public/images/equipment/equipment-01.jpg` ... `equipment-04.jpg`

현재 일부 표준 이미지 파일은 기존 제공 사진을 임시 재사용했습니다. 최종 공개 전 실제 제품/회사/장비 사진으로 교체하면 됩니다.

## Cloudflare Pages Alternative

Cloudflare Pages 프로젝트를 새로 만들 경우 아래 값으로 둔다.

- Framework preset: Vite
- Build command: `npm run build`
- Build output directory: `dist`
- Node version: `22`
- Production branch: `main`

## Local

```powershell
$env:PATH='C:\Users\USER\AppData\Local\nvm\v22.22.0;' + $env:PATH
& 'C:\Users\USER\AppData\Local\nvm\v22.22.0\npm.cmd' run lint
& 'C:\Users\USER\AppData\Local\nvm\v22.22.0\npm.cmd' run build
& 'C:\Users\USER\AppData\Local\nvm\v22.22.0\npm.cmd' run dev
```
