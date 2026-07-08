# DAE KWANG TECH — Final Public Package

대광테크 회사소개형 public 사이트 최종 패키지입니다.

## 실행
```powershell
npm install
npm run build
npm run verify
npm run dev
```

## 정책
- Public 사이트는 회사소개형입니다.
- Public 화면에는 하단 고정 CTA, 상세확인 패널, 제품상세보기 오버레이를 노출하지 않습니다.
- 기능은 상단 nav, 카드/사진 클릭, 상세 모달 내부 최소 버튼으로만 유지합니다.
- Admin은 직접 `#/admin/login` 접근용 mock/localStorage CMS입니다.
- 실제 DB, 보안 로그인, 파일 업로드는 별도 개발 범위입니다.

## 주요 기능
- 데스크탑 exact visual 기반 화면
- 상단 nav route 이동
- 카드/사진 클릭 상세 모달
- 모달 닫기/다음/이전/관련 화면 이동
- 모바일 safe sheet / bottom nav
- 제품/설비/품질/회사정보 mock CMS

## 검증
- `npm run build`
- `npm run verify`
- `node --check src/app.js`
