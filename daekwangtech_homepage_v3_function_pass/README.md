# DAE KWANG TECH Company Homepage

대광테크 회사소개형 B2B 홈페이지 최종 납품본입니다.

## 구성

- Desktop: 제공 화면 기반 exact visual 구현 + 클릭 hotspot 상세 모달
- Mobile: 별도 앱 UI, 하단 탭, 사진/카드 터치 상세, 이미지 확대
- Admin: localStorage 기반 CMS 데모/관리 콘솔
- 정책: 문의/contact route 및 문의폼 제거
- 배포: Cloudflare Workers Static Assets 대응

## 로컬 실행

```bash
npm run dev
```

브라우저: `http://localhost:4173`

## 검증

```bash
npm run build
npm run verify
```

## 주요 라우트

- `#/home`
- `#/company`
- `#/fields`
- `#/products`
- `#/facilities`
- `#/quality`
- `#/admin/login`
- `#/admin/dashboard`
- `#/admin/products`
- `#/admin/facilities`
- `#/admin/quality`
- `#/admin/flow`
- `#/admin/ops`

## Admin 로그인

- ID: `admin@daekwang.co.kr`
- PW: `demo1234`

## 배포

```bash
npm run build
npx wrangler deploy
```

`wrangler.jsonc`는 `./dist`를 Static Assets directory로 사용합니다.

## 한계

- 현재 Admin은 localStorage 기반 기능형 CMS입니다.
- 실제 DB 저장, 실제 보안 로그인, 실제 파일 업로드는 별도 운영형 CMS CT입니다.


## CT-FIX1~FIX8 Final Repair

- 문의/견적/상담 public residue 제거
- 설비현황 클릭 bridge 보강
- 사진/패널/CTA 전체 클릭 상세 연결
- 제품 이미지 clean assets 추가
- floating dev route chip 제거
- final header/logo DOM lock
- verify 강화 및 build/verify PASS
