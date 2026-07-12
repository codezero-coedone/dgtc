import fs from 'fs';
const app=fs.readFileSync('src/app.js','utf8');
const css=fs.readFileSync('src/styles.css','utf8');
const html=fs.readFileSync('index.html','utf8');
const fail=[];

function countFunction(name){
  return (app.match(new RegExp(`function\\s+${name}\\s*\\(`,'g'))||[]).length;
}
for(const name of ['render','go','detail','desktopPage','mobilePage','modal','adminPage']){
  const n=countFunction(name);
  if(n!==1) fail.push(`duplicate/missing function ${name}: ${n}`);
}
for(const token of ['const CTA_MAP','const DETAIL_CATALOG','const ADMIN_SEED','const APP_VERSION']){
  if((app.match(new RegExp(token.replace(/[.*+?^${}()|[\\]\\\\]/g,'\\\\$&'),'g'))||[]).length!==1) fail.push(`single authority violation: ${token}`);
}
for(const route of ['home','company','fields','products','facilities','quality']){
  if(!app.includes(`${route}:[`)) fail.push(`CTA map route missing: ${route}`);
  if(!fs.existsSync(`public/screens/${route}.jpg`)) fail.push(`screen missing: ${route}.jpg`);
}
for(const forbidden of ['견적 문의하기','견적 및 상담 문의','기술상담 신청','도면 업로드','상담 문의']){
  if(app.includes(forbidden)) fail.push(`forbidden public sales copy remains: ${forbidden}`);
}
if(!app.includes('indexedDB.open(DB_NAME,1)')) fail.push('IndexedDB image storage missing');
if(!app.includes('file.size>8*1024*1024')) fail.push('8MB upload guard missing');
if(!app.includes('.slice(0,10)')) fail.push('10-file upload cap missing');
if(!html.includes('meta name="description"')) fail.push('SEO description missing');
if(!html.includes('lang="ko"')) fail.push('lang=ko missing');
if(!app.includes('aria-modal="true"')) fail.push('ARIA modal missing');
if(!app.includes("e.key==='Escape'")) fail.push('ESC close missing');
if(!css.includes('@media(prefers-reduced-motion:reduce)')) fail.push('reduced motion support missing');
if(!css.includes('.hotspot{position:absolute;z-index:150')) fail.push('CTA z-index policy missing');
if(!css.includes('.modal-backdrop')||!css.includes('z-index:500')) fail.push('modal z-index policy missing');

if(fail.length){
  console.error('VERIFY HOLD');
  for(const f of fail) console.error('- '+f);
  process.exit(1);
}
console.log('VERIFY PASS: CT-S1~S8 single-source structure and policy gates');
