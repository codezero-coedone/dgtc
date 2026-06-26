# DAEKWANG_SERVER_AUTH_D1_R2_OPERATION_PATCH PLAN

## 1. 목표

프론트 데모 관리자 상태를 서버 운영형 구조로 전환한다. 인증은 Worker 서버 세션으로 처리하고, 공지/이미지/메뉴/푸터/SEO/설정은 D1/KV/R2 기반으로 모든 방문자에게 동일하게 반영한다.

## 2. 현재 localStorage 구조

- 관리자 store key: `daekwang.admin.v1`
- 인증 gate key: `daekwang.admin.auth.v1`
- 공개 콘텐츠 seed key: `daekwang.admin.content.v1`
- 현재 저장 범위: 같은 브라우저 기준

## 3. 서버 전환 대상

- 관리자 로그인/로그아웃/세션
- 공지사항 CRUD
- 이미지 업로드/교체/삭제/정렬
- 메뉴 관리
- 푸터 관리
- 기본 설정
- SEO 설정
- 팝업 관리
- 감사 로그
- 백업 생성/복원

## 4. D1 테이블 후보

- `admin_sessions`
- `notices`
- `image_assets`
- `menu_items`
- `footer_settings`
- `site_settings`
- `seo_settings`
- `popup_items`
- `audit_logs`
- `admin_users`

## 5. R2 bucket 후보

- `daekwang-assets`

현재 wrangler에는 `dgtc-media` R2 binding이 있다. 다음 패치에서 실제 bucket 명칭과 운영 정책을 확정한다.

## 6. Worker API 후보

- `POST /api/admin/login`
- `POST /api/admin/logout`
- `GET /api/admin/session`
- `GET/POST/PUT/DELETE /api/admin/notices`
- `GET/POST/PUT/DELETE /api/admin/images`
- `GET/PUT /api/admin/settings`
- `GET/PUT /api/admin/seo`
- `GET/POST /api/admin/backups`
- `GET /api/public/notices`
- `GET /api/public/site`

## 7. Migration plan

1. localStorage export 기능으로 현재 관리자 데이터를 JSON으로 추출한다.
2. D1 schema를 생성한다.
3. notices/menu/footer/site/seo/popup/admin_users/audit_logs를 D1로 import한다.
4. 이미지 data URL 또는 local placeholder는 R2 업로드 방식으로 교체한다.
5. public 페이지는 localStorage 우선이 아니라 `GET /api/public/*`를 우선 사용한다.
6. localStorage는 migration fallback과 오프라인 데모 용도로 격하한다.

## 8. No-touch list

- public UI visual design
- notice UI premium finish
- logo v2 components
- admin layout
- 기존 hash route 구조
- 기존 공지 목록/상세 UX
- 390px overflow 0 기준

## 9. PASS criteria

- 기존 public `#/` 정상
- 기존 `#/notice` 정상
- 기존 `#/notice/:id` 정상
- `#/admin` 서버 로그인 정상
- old visual logo count 0 유지
- 공지 등록 -> 모든 브라우저 공개 반영
- hidden 공지 public 차단
- 이미지 업로드 -> R2 저장 -> public 렌더 가능
- 관리자 좌측 메뉴 12/12 유지
- 서버 감사 로그 기록
- console error 0
- desktop/mobile overflow 0
- typecheck/lint/build/deploy PASS

## 10. Risks

- 기존 localStorage 데이터와 서버 데이터 migration 충돌
- 이미지 업로드 권한/용량 제한 미정
- Worker session cookie 보안 속성 설정 필요
- D1 schema migration 실패 가능성
- R2 public/private URL 정책 결정 필요
- SSR SEO는 SPA 구조상 별도 고려 필요
