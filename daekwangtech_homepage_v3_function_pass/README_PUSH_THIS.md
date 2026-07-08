# DAEKWANG TECH SSS CT-1~CT-8 Final Package

이 패키지는 `codezero-coedone/dgtc` 저장소의 active 배포 폴더(`daekwangtech_homepage_v3_function_pass`) 교체용입니다.

## 적용 순서
1. ZIP 압축 해제
2. PowerShell에서 실행:
   ```powershell
   Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
   .\PUSH_ACTIVE_FOLDER_REPLACE_DGTC.ps1
   ```
3. Cloudflare 배포 후 확인:
   - https://dgtc.ejdzm90.workers.dev/?v=sss-ct1-8-final#/home
   - https://dgtc.ejdzm90.workers.dev/?v=sss-ct1-8-final#/fields
   - https://dgtc.ejdzm90.workers.dev/?v=sss-ct1-8-final#/products
   - https://dgtc.ejdzm90.workers.dev/?v=sss-ct1-8-final#/facilities
   - https://dgtc.ejdzm90.workers.dev/?v=sss-ct1-8-final#/quality

## 로컬 검증
```powershell
cd daekwangtech_homepage_v3_function_pass
npm run build
npm run verify
npm run dev
```

## 로그인
- Admin demo: `#/admin/login`
- ID: admin@daekwang.co.kr
- PW: demo1234

## 주의
- public 문의/견적/상담 기능은 회사소개형 정책으로 제거되어 있습니다.
- Admin은 mock/localStorage CMS입니다. 실제 DB/보안 로그인/파일 업로드는 별도 CT입니다.
