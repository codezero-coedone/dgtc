# CT-COMPANY-ONLY Report

## Summary
대광테크 범위를 회사소개형 홈페이지로 재잠금했습니다. 공개 문의/견적/상담 route와 CTA는 제거하고, 연락처는 회사 기본 정보로만 남겼습니다.

## Completed
- Public `#/contact` route 제거/redirect
- Public nav에서 문의 제거
- Mobile bottom tab에서 문의 제거 → 품질로 교체
- Mobile 공개 CTA를 문의/상담/견적에서 회사소개/제품/설비/품질 이동으로 교체
- Admin 문의안내를 회사정보 관리로 교체
- Admin pipeline/contact route 제거/redirect
- Verify 스크립트 company-only 정책으로 갱신
- Launcher 3번 메뉴를 회사소개 화면으로 교체

## PASS criteria
- `npm run build` PASS
- `npm run verify` PASS
- public inquiry/contact routes removed
- functional admin CMS remains
- mobile app UI remains

## HOLD
- Desktop exact screen은 원본 이미지에 과거 문의 CTA 픽셀이 들어 있어서 overlay mask로 가림 처리했습니다. 완전한 픽셀 삭제/재합성은 별도 visual-clean CT에서 추가 가능합니다.
