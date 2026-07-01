# DAEKWANG DELIVERY LOCK

## 현재 납품 상태 요약

대광테크 홈페이지, 공지사항 공개 페이지, 관리자 콘솔, 서버 인증/D1/R2 저장, 신규 로고 적용 상태를 2026-07-01 기준 운영 스냅샷으로 잠근다.

## Public URL

- Home: https://dgtc.ejdzm90.workers.dev/#/
- Notice: https://dgtc.ejdzm90.workers.dev/#/notice
- Admin: https://dgtc.ejdzm90.workers.dev/#/admin

## Login

- ID: dgtc66
- PW: 1234

주의: 현재 로그인은 Cloudflare Worker 서버 세션 기준이다. `ADMIN_PASSWORD_SHA256` secret을 사용하며 plaintext password secret은 제거되어 있다.

## Git / Deploy

- Product baseline Git HEAD: d71fc55
- Branch: main
- Deploy version: 81b50af9-4a64-4dad-95b2-1ef7dd5e8aad
- Worker URL: https://dgtc.ejdzm90.workers.dev

## 기능 목록

- 공개 홈페이지
- 공지사항 목록 `#/notice`
- 공지사항 상세 `#/notice/:id`
- 관리자 로그인 게이트
- 관리자 콘솔
- 좌측 메뉴 12개
- 이미지 관리
- 공지사항 관리
- 페이지 관리
- 팝업 관리
- 메뉴 관리
- 푸터 관리
- 기본 설정
- SEO 설정
- 사용자 관리
- 로그 관리
- 백업 관리
- 상단 검색 결과 이동

## PASS 검증 목록

- public home 200
- public admin 200
- public notice 200
- build PASS
- lint PASS
- typecheck PASS
- deploy PASS
- console error 0
- desktop overflow 0
- mobile overflow 0
- old visual logo visible count 0
- admin sidebar 12/12 PASS
- admin notice -> public reflection PASS
- hidden notice public block PASS
- server admin auth/session PASS
- wrong credential block PASS
- logout server session invalidation PASS
- D1 notices/public reflection PASS
- D1 admin_state snapshot PASS
- R2 image upload/delete lifecycle PASS
- unknown hash NotFound route PASS
- Tailwind content warning 0

## Evidence / Receipt 목록

- `evidence/receipts/admin-full-function-normalization-20260626.json`
- `evidence/receipts/notice-public-page-full-add-20260626.json`
- `evidence/receipts/notice-ui-brand-logo-premium-finish-20260626.json`
- `evidence/receipts/real-browser-admin-ux-audit-logo-fix-gap-20260626.json`
- `evidence/receipts/admin-login-gate-hologram-modal-20260626.json`
- `evidence/receipts/daekwang-current-state-delivery-lock-20260626.json`
- `evidence/receipts/daekwang-server-holds-cleared-20260701.json`
- `evidence/receipts/daekwang-all-holds-clear-20260701.json`
- `evidence/registries/DAEKWANG_CURRENT_STATE_REGISTRY_20260626.md`
- `evidence/registries/DAEKWANG_CURRENT_STATE_REGISTRY_20260626.json`

## 남은 외부/선택 게이트

- owner 실기기 최종 육안 확인
- 다중 관리자/RBAC/비밀번호 재설정 정책
- SSR SEO 완전 대응 필요 여부
- 운영 모니터링/알림 정책

## 운영 전 필수 주의사항

현재 핵심 관리자 인증, 공지, admin_state, 이미지 lifecycle은 Cloudflare Worker/D1/R2 기준으로 동작한다. localStorage는 UI fallback/migration 성격으로 남아 있다.

## Rollback 기준

- 기준 제품 커밋: `6af3cd5`
- 기준 배포 버전: `bcee0492-1614-4d92-bae8-879e67c5a7a1`
- 기준 백업: `backups/daekwangtech_homepage_admin_pass_lock_20260626_git_6af3cd5.zip`

문제가 생기면 기준 커밋 또는 백업 zip을 복원한 뒤 build/deploy/smoke를 다시 수행한다.

이 문서는 Cloudflare Worker/D1/R2 서버 저장 및 관리자 인증 적용 후의 납품 잠금 문서다. 추가 운영 체계는 별도 정책 확정 후 확장한다.
