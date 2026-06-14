# DAEKWANG TECH Corporate Homepage

대광테크 자동차 유압부품 제조 기업 홈페이지입니다.

## Cloudflare Workers Static Assets

현재 Cloudflare 프로젝트가 Workers 서비스로 연결된 경우 아래 값으로 둔다.

- Build command: `npm run build`
- Deploy command: `npx wrangler deploy`
- Root directory: empty
- Production branch: `main`
- Static assets directory: `dist` via `wrangler.jsonc`

주의: Deploy command에 `main`을 넣으면 `/bin/sh: 1: main: not found`로 실패한다.

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
