# DAEKWANG_SERVER_AUTH_D1_R2_OPERATION_PATCH PLAN

## 1. 현재 서버 운영 패치 결과 요약

운영형 서버 저장 전환은 staged patch 이후 2026-07-01 기준 live smoke까지 통과했다.

- Worker 서버 인증 API 추가: 적용
- D1 권위 관리자 세션 구조: 적용
- D1 공지사항 public API: 적용
- R2 이미지 업로드/삭제 lifecycle: 적용
- 프론트 로그인 게이트 서버 API 우선 호출: 적용
- 관리자 상태 snapshot D1 저장: 적용
- Cloudflare `ADMIN_ID` / `ADMIN_PASSWORD_SHA256` secret 주입: 적용
- plaintext `ADMIN_PASSWORD` secret 제거: 적용
- 로그인 rate limit: 적용
- logout 서버 세션 invalidation: 적용

## 2. 현재 localStorage 구조

- 관리자 store key: `daekwang.admin.v1`
- 인증 gate key: `daekwang.admin.auth.v1`
- 현재 관리자 UI 저장 범위: D1 admin_state 우선, localStorage는 fallback
- 현재 public 공지 읽기:
  - `/api/public/notices` D1 public API 우선
  - 네트워크 장애 시에만 controlled fallback

## 3. 서버 전환 대상

### 적용됨

- `POST /api/admin/login`
- `POST /api/admin/logout`
- `GET /api/admin/session`
- `GET /api/public/notices`
- `GET /api/public/site`
- `GET/POST/PUT/PATCH/DELETE /api/admin/notices`
- `GET/POST /api/admin/images`
- `DELETE /api/admin/images/:id`
- `GET/PUT /api/admin/state`
- 기존 `/api/cms/*` 보호 로직에 server session 허용

### 선택/후속 확장

- 다중 관리자 계정별 RBAC/비밀번호 재설정 UI
- SSR 기반 SEO 완전 대응
- 운영 모니터링/알림 정책

## 4. D1 테이블

Worker `ensureSchema()`가 아래 테이블을 생성한다.

- `site_content`
- `content_revisions`
- `media_assets`
- `admin_sessions`
- `admin_audit_logs`
- `notices`
- `admin_state`
- `admin_login_attempts`

공지사항은 `notices` 테이블에 seed 후 `/api/public/notices`에서 D1 기준으로 내려간다.

## 5. KV / R2

- KV binding: `CONTENT_CACHE`
  - public content cache
  - fallback cache
- R2 binding: `MEDIA_BUCKET`
  - 이미지 upload/read/delete lifecycle

## 6. Cloudflare secret 요구사항

운영 서버 인증 secret은 Cloudflare에 설정되어 있다.

- `ADMIN_ID`
- `ADMIN_PASSWORD_SHA256`

plaintext `ADMIN_PASSWORD` secret은 제거됐다.

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

1. owner 실기기 최종 육안 확인.
2. 다중 관리자/RBAC/비밀번호 재설정 정책 확정.
3. SSR SEO 필요 여부 결정.
4. 운영 모니터링/알림 정책 확정.

## 9. 현재 판정

`DAEKWANG_SERVER_AUTH_D1_R2_OPERATION_PATCH` 및 후속 remaining hold clear는 2026-07-01 live smoke 기준 `PASS`다.
