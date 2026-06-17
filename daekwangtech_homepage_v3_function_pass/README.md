# DAEKWANG TECH HOMEPAGE V3 — 기능 정상작동 보강본

## 실행
1. 압축을 풀어 폴더 전체를 유지합니다.
2. `index.html`을 더블클릭하거나 아래 명령으로 로컬 서버를 실행합니다.

```bash
python -m http.server 5173
```

브라우저에서 `http://localhost:5173` 접속.

## V3 보강 내용
- PC/태블릿/모바일 반응형 유지
- 상단 메뉴 및 로고 이동 정상화
- 모바일 햄버거 메뉴 열기/닫기/외부 클릭/ESC 닫기
- 현재 페이지 active 및 aria-current 적용
- 자세히 보기 링크 정상 이동
- 제품/품질/설비/지도 이미지 클릭 확대 모달
- 모달 X/배경 클릭/ESC 닫기, 모바일 터치 대응
- 이미지 lazy loading, alt, fallback 이미지 처리
- 빈 `#` 링크 제거
- KR 버튼 안내 토스트 처리
- hover/focus/touch 영역 및 접근성 보강
- favicon, 404.html, robots.txt, sitemap.xml, site.webmanifest 추가

## React/Vite 배포
이 폴더는 React/Vite 패키지로 구성되어 있습니다.

```bash
npm install
npm run typecheck
npm run build
```

빌드 산출물은 `dist`에 생성됩니다.

## 주의
`sitemap.xml`과 `robots.txt`는 `https://dgtc.ejdzm90.workers.dev/` 기준으로 설정되어 있습니다.
