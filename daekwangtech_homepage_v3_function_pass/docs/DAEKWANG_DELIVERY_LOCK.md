# DAEKWANG DELIVERY LOCK

## 현재 납품 상태 요약

대광테크 홈페이지, 공지사항 공개 페이지, 관리자 콘솔, 관리자 로그인 게이트, 신규 로고 v2 적용 상태를 2026-06-26 기준 운영 스냅샷으로 잠근다.

## Public URL

- Home: https://dgtc.ejdzm90.workers.dev/#/
- Notice: https://dgtc.ejdzm90.workers.dev/#/notice
- Admin: https://dgtc.ejdzm90.workers.dev/#/admin

## Login

- ID: dgtc66
- PW: 1234

주의: 현재 로그인은 프론트 데모 게이트다. 실제 운영 전 서버 인증으로 교체해야 한다.

## Git / Deploy

- Product baseline Git HEAD: 6af3cd5
- Branch: main
- Deploy version: bcee0492-1614-4d92-bae8-879e67c5a7a1
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

## Evidence / Receipt 목록

- `evidence/receipts/admin-full-function-normalization-20260626.json`
- `evidence/receipts/notice-public-page-full-add-20260626.json`
- `evidence/receipts/notice-ui-brand-logo-premium-finish-20260626.json`
- `evidence/receipts/real-browser-admin-ux-audit-logo-fix-gap-20260626.json`
- `evidence/receipts/admin-login-gate-hologram-modal-20260626.json`
- `evidence/receipts/daekwang-current-state-delivery-lock-20260626.json`
- `evidence/registries/DAEKWANG_CURRENT_STATE_REGISTRY_20260626.md`
- `evidence/registries/DAEKWANG_CURRENT_STATE_REGISTRY_20260626.json`

## 남은 HOLD

- 실제 서버 인증/세션
- 비밀번호 해시/서버 검증
- 관리자 권한별 서버 보호
- D1/KV/R2 저장
- 모든 방문자 공통 데이터 반영
- 실제 R2 이미지 업로드
- 이미지/공지/팝업 휴지통 복원 UX
- 원본 AI/SVG 로고 파일 수급
- SSR SEO 완전 대응

## 운영 전 필수 주의사항

현재 관리자 저장은 localStorage 기준이다. 같은 브라우저에서는 유지되지만, 모든 방문자에게 동일하게 반영되는 서버 저장 방식은 아니다. 실제 운영 전 `DAEKWANG_SERVER_AUTH_D1_R2_OPERATION_PATCH`가 필요하다.

## Rollback 기준

- 기준 제품 커밋: `6af3cd5`
- 기준 배포 버전: `bcee0492-1614-4d92-bae8-879e67c5a7a1`
- 기준 백업: `backups/daekwangtech_homepage_admin_pass_lock_20260626_git_6af3cd5.zip`

문제가 생기면 기준 커밋 또는 백업 zip을 복원한 뒤 build/deploy/smoke를 다시 수행한다.

이 문서는 D1/KV/R2 서버 저장 및 실제 관리자 인증 전 단계의 프론트 운영형 납품 잠금 문서다. 실제 운영 투입 전 서버 인증과 공통 저장소 연동이 필요하다.
