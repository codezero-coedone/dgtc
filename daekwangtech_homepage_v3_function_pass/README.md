# Daekwang Tech Company-Only Homepage Package

## 상태
- 회사소개 홈페이지 정책: PASS
- Public 문의/견적/상담 route 제거: PASS
- Desktop exact screen 유지 + 문의 CTA mask 처리: PASS
- Mobile app UI: PASS, 하단 탭 `홈/가공/제품/설비/품질`
- Admin 기능형 localStorage CMS: PASS
- Build / Verify: PASS

## 실행
```bash
npm run dev
```
브라우저: http://localhost:4173

## 빌드/검증
```bash
npm run build
npm run verify
```

## Public 라우트
- #/home
- #/company
- #/fields
- #/products
- #/facilities
- #/quality

## Admin 라우트
- #/admin/login
- #/admin/dashboard
- #/admin/company
- #/admin/products
- #/admin/facilities
- #/admin/quality
- #/admin/flow
- #/admin/preview
- #/admin/settings

## 최종 정책
- 대광테크는 회사소개형 홈페이지로 운용합니다.
- public 문의 페이지, 문의폼, 견적 CTA, 상담 CTA는 제거했습니다.
- 연락처는 회사 기본 정보로만 관리합니다.
- 데스크탑은 사용자가 제공한 exact screen을 유지하되, legacy 문의 버튼/메뉴 영역은 company-only overlay로 가립니다.
- 모바일은 데스크탑 축소판이 아니라 별도 앱 UI입니다.
- Admin은 localStorage 기반 mock CMS입니다. 실제 DB/파일업로드/실인증은 별도 백엔드 CT 범위입니다.

## 스타트 런처 사용법
Windows에서 압축을 푼 뒤 아래 파일 중 하나를 더블클릭합니다.

- `START_DAEKWANG.cmd` : 압축 해제 루트에서 실행하는 바로가기 런처
- `daekwang-tech-final-exact-no-form/START_HERE.cmd` : 프로젝트 폴더 안에서 실행하는 종합 런처

런처 메뉴:
1. 개발 서버 실행 + 홈 화면 열기
2. Admin 콘솔 열기
3. 회사소개 화면 열기
4. Build 실행
5. Verify 실행
6. Build + Verify 연속 실행
7. 프로젝트 폴더 열기
8. 종료

Node.js가 설치되어 있어야 합니다. 이 프로젝트는 외부 npm 패키지 의존성이 없으므로 `npm install` 없이도 실행 가능합니다.
