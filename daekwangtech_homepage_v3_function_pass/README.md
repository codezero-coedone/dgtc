# DGTC SSS Single-Source Final

## 실행
1. `START_HERE.cmd`
2. 브라우저: `http://127.0.0.1:4173/#/home`
3. 관리자: `http://127.0.0.1:4173/#/admin/login`

관리자 데모:
- ID: `admin@daekwang.co.kr`
- PW: `demo1234`

## 검증
```bash
npm run build
npm run verify
npm run verify:cta
npm run verify:runtime
npm run verify:browser
```

`verify:browser`는 Windows Edge/Chrome 또는 지원 Chromium에서 실제 브라우저 hit-test를 수행합니다.

## 구조
- `src/app.js`: 단일 라우터, 단일 CTA_MAP, 단일 모달, 단일 관리자 이미지 콘솔
- `src/styles.css`: 단일 z-index/pointer-events 정책
- `public/screens`: 금지 영업 CTA 픽셀을 직접 정리한 exact 화면
- `public/admin-assets`: 관리자 기본 이미지 자산
- 이미지 업로드: 원본 Blob은 IndexedDB, 메타데이터는 localStorage

## 운영 한계
현재 관리자는 브라우저 로컬 저장 기반입니다. 서버 다중 사용자 운영에는 R2/D1/실제 인증 연동이 필요합니다.
공차·조도·KPI·생산능력 수치는 실제 회사 자료 확인 후 확정해야 합니다.
