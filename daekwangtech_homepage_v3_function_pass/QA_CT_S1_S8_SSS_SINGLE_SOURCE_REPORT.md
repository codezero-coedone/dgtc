# CT-S1~S8 SSS Single-Source Report

## 결론
패치 누적형 소스를 폐기하고 단일 정본으로 재작성했습니다.

## CT 상태
- CT-S1 소스 회로 단일화: PASS
- CT-S2 CSS 권한 정리: PASS
- CT-S3 이미지 금지 픽셀 직접 제거: PASS (좌표 기반 시각 감사)
- CT-S4 CTA 지도 단일화: PASS
- CT-S5 실제 브라우저 클릭 QA: HOLD_ENVIRONMENT
- CT-S6 이미지 저장 현실화: PASS (IndexedDB Blob + localStorage metadata, 10개/8MB 제한)
- CT-S7 레거시 어드민 제거: PASS
- CT-S8 사실성/SEO/접근성: PASS_PARTIAL (구조 반영, 실제 회사 수치 확정은 HOLD)

## 소스 감사
- app.js: 40,137 bytes
- styles.css: 12,169 bytes
- 함수 선언: 49
- 고유 함수명: 49
- 중복 함수: {}
- CTA 단일 지도 항목: 51

## 검증
- `node --check src/app.js`: PASS
- `npm run build`: PASS
- `npm run verify`: PASS
- `npm run verify:cta`: PASS
- `npm run verify:runtime`: PASS
- `npm run verify:browser`: HOLD_ENVIRONMENT

## 브라우저 QA
현재 컨테이너 Chromium은 crashpad 제약으로 실제 headless 실행에 실패했습니다.
패키지의 `RUN_BROWSER_QA.cmd`는 Windows Edge/Chrome에서 실제 elementFromPoint hit-test, 라우트 이동, 모달 동작을 검증합니다.

## 사실성 HOLD
화면에 포함된 공차·조도·KPI·생산능력 수치는 실제 대광테크 자료 확인 후 확정해야 합니다.
공개 모달과 모바일 문구에서는 미검증 수치를 확정값으로 사용하지 않도록 정리했습니다.

## SHA-256
```json
{
  "index.html": "e270f4a1aa7261e2cad39e3fd10378b041ec22fc377f02f26cef78d9e116734e",
  "src/app.js": "88db6bd59a6eab8bf71e53c73a58949f7a38f39db6651fc26d14f11d5e361f50",
  "src/styles.css": "9a2decfedf222eb518b5a1e5e751257b9ad00aebdb632b7bd36d9b2c16a0eb45",
  "scripts/verify.mjs": "f51b1ea38668d1d52a6f0d86dd1b75ac30f67c0228e2ffff9d0e39f089355319",
  "scripts/verify-cta.mjs": "3c5084101b7eceed9438120db7eee0f04afb903cb8947b2b5d46207804019c44",
  "scripts/verify-runtime.mjs": "4a2f38572ec709f6d89c87adf6f1728b781b300df153b68ded995125d8bcb0f3",
  "scripts/browser-qa.mjs": "17a89871ab49250529a92d46300a2f185c1a23eb5c2ee56cfd2fa87715bdc011"
}
```
