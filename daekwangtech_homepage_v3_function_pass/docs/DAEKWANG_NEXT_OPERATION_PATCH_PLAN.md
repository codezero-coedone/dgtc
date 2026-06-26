# DAEKWANG_SERVER_AUTH_D1_R2_OPERATION_PATCH PLAN

## 1. 이번 패치 결과 요약

운영형 서버 저장 전환을 한 번에 대형 리팩토링하지 않고 staged patch로 시작했다.

- Worker 서버 인증 API 추가: 적용
- KV/D1 기반 관리자 세션 구조: 적용
- D1 공지사항 public API: 적용
- R2 이미지 API 기존 골격 유지 및 `/api/admin/images` alias 추가: 적용
- 프론트 로그인 게이트 서버 API 우선 호출: 적용
- 기존 localStorage 관리자 UX fallback: 유지
- 전체 관리자 CRUD 서버 전환: HOLD
- Cloudflare `ADMIN_ID` / `ADMIN_PASSWORD` 또는 `ADMIN_PASSWORD_SHA256` secret 주입: HOLD

## 2. 현재 localStorage 구조

- 관리자 store key: `daekwang.admin.v1`
- 인증 gate key: `daekwang.admin.auth.v1`
- 현재 관리자 UI 저장 범위: 같은 브라우저 기준 fallback
- 현재 public 공지 읽기:
  - local admin state가 있으면 기존 smoke 보존을 위해 localStorage 우선
  - local admin state가 없으면 `/api/public/notices` D1 public API 우선

## 3. 서버 전환 대상

### 적용됨

- `POST /api/admin/login`
- `POST /api/admin/logout`
- `GET /api/admin/session`
- `GET /api/public/notices`
- `GET /api/public/site`
- `GET/POST/PUT/PATCH/DELETE /api/admin/notices`
- `GET/POST /api/admin/images`
- 기존 `/api/cms/*` 보호 로직에 server session 허용

### HOLD

- 팝업/메뉴/푸터/SEO/설정/사용자/백업의 완전 서버 CRUD
- 관리자 UI 전체 store의 D1 전환
- 모든 방문자에게 관리자 변경분을 즉시 공통 반영하는 전체 adapter wiring
- 실제 운영 인증 secret 주입

## 4. D1 테이블

Worker `ensureSchema()`가 아래 테이블을 생성한다.

- `site_content`
- `content_revisions`
- `media_assets`
- `admin_sessions`
- `admin_audit_logs`
- `notices`

공지사항은 `notices` 테이블에 seed 후 `/api/public/notices`에서 D1 기준으로 내려간다.

## 5. KV / R2

- KV binding: `CONTENT_CACHE`
  - public content cache
  - admin session token lookup
- R2 binding: `MEDIA_BUCKET`
  - 기존 media upload flow 유지
  - `/api/admin/images` POST alias 추가

## 6. Cloudflare secret 요구사항

운영 서버 인증을 실제 PASS로 만들려면 아래 중 하나를 설정해야 한다.

- `ADMIN_ID`
- `ADMIN_PASSWORD`

또는:

- `ADMIN_ID`
- `ADMIN_PASSWORD_SHA256`

현재 public 배포에서는 `/api/admin/login`이 `SERVER_AUTH_NOT_CONFIGURED`를 반환한다.
프론트는 기존 관리자 UX를 깨지 않기 위해 이 경우에만 `dgtc66 / 1234` 데모 fallback으로 진입한다.

## 7. No-touch 유지

- public UI visual design
- notice UI premium finish
- logo v2 components
- admin layout
- 기존 hash route 구조
- 기존 공지 목록/상세 UX
- 390px overflow 0 기준
- 문의/견적/상담 CTA 금지

## 8. 다음 패치 순서

1. Cloudflare secret 설정:
   - `wrangler secret put ADMIN_ID`
   - `wrangler secret put ADMIN_PASSWORD` 또는 `wrangler secret put ADMIN_PASSWORD_SHA256`
2. `/api/admin/login` server-session PASS 재검증.
3. 관리자 공지 CRUD를 localStorage action과 서버 D1 action에 동시 연결.
4. 성공 시 localStorage를 migration/fallback 전용으로 격하.
5. 이미지 upload/replace/delete를 R2 + D1 media metadata로 연결.
6. 팝업/메뉴/푸터/SEO/settings를 D1 테이블로 확장.
7. 실제 사용자/권한/감사 로그 정책 확정.

## 9. 현재 판정

`DAEKWANG_SERVER_AUTH_D1_R2_OPERATION_PATCH`는 서버 레이어 최소 구현과 D1 public notices는 적용됐지만, 운영 secret과 전체 admin CRUD wiring이 남아 있으므로 `HOLD`다.
