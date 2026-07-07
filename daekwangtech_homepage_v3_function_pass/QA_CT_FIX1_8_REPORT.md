# DAE KWANG TECH CT-FIX1~FIX8 QA Report

## 판정

- CT-FIX1 문의/견적/상담 전수 삭제: PASS(code/image overlay/build 기준)
- CT-FIX2 설비현황 클릭 수리: PASS(code click-bridge/header route 기준)
- CT-FIX3 전체 클릭 기능 재잠금: PASS(code delegate/hotspot 기준)
- CT-FIX4 제품 이미지 데이터 정리: PASS(clean product assets + product row overlay 기준)
- CT-FIX5 floating route chip 제거: PASS(CSS forced hidden)
- CT-FIX6 header/logo 마감: PASS(final DOM header + source header pixel cleanup)
- CT-FIX7 verify 강화: PASS(CT-FIX gates added)
- CT-FIX8 build/verify QA: PASS

## 실행 증거

```txt
npm run build: PASS
npm run verify: PASS
node --check src/app.js: PASS
```

## 주요 수정

1. public exact image의 상단 문의/견적 영역을 이미지 픽셀 단계에서 제거.
2. final DOM header를 최상위 z-index로 재고정하고 public nav를 홈/회사소개/가공분야/제품·가공사례/설비현황/품질관리 6개로 잠금.
3. 설비현황 header click을 좌표 기반 capture bridge로 보강.
4. 제품 페이지의 명함/로고/웹 캡처 노출 구간을 제품 이미지 카드로 대체.
5. 제품 clean assets `public/products/product-01~07.jpg` 추가.
6. 우하단 floating route/dev chip 강제 숨김.
7. public 하단 CTA를 회사소개형 탐색 패널로 교체.
8. verify script에 CT-FIX1~8 마커와 제품 clean asset 검증 추가.

## 남은 HOLD

- 실제 GitHub push: 사용자 로컬 인증 필요.
- live workers.dev 재배포 후 실기기 클릭 PASS_VERIFIED: 사용자 캡처/영상 또는 live URL 확인 필요.
