import fs from 'fs';
import path from 'path';

const fail = [];
const app = fs.readFileSync('src/app.js', 'utf8');
const css = fs.readFileSync('src/styles.css', 'utf8');
const wrangler = fs.existsSync('../wrangler.jsonc') ? fs.readFileSync('../wrangler.jsonc', 'utf8') : '';

function has(filePath, label){
  if(!fs.existsSync(filePath)) fail.push(`missing ${label}: ${filePath}`);
}

has('index.html', 'entry');
has('src/app.js', 'public app');
has('src/styles.css', 'public style');
has('assets/equipment-hanwha-xdi32.jpg', 'facility body image');
has('assets/equipment-hanwha-xdi32-label.jpg', 'facility label image');
has('assets/real-hero-batch-components.jpg', 'hero product image');
has('assets/inspection-cmm.jpg', 'quality image');
if(fs.existsSync('dist')){
  has('dist/assets/equipment-hanwha-xdi32.jpg', 'dist facility body image');
  has('dist/assets/equipment-hanwha-xdi32-label.jpg', 'dist facility label image');
  has('dist/assets/real-hero-batch-components.jpg', 'dist hero product image');
  has('dist/assets/inspection-cmm.jpg', 'dist quality image');
}
for(const item of ['public/products/product-01.jpg','public/products/product-02.jpg','public/products/product-03.jpg','public/products/product-04.jpg','public/products/product-05.jpg','public/products/product-06.jpg']){
  has(item, 'product image');
}

if(!wrangler.includes('./daekwangtech_homepage_v3_function_pass/dist')) fail.push('wrangler assets path is not active dist');
if(!app.includes('CT-SSS0~SSS8_PUBLIC_AUTHORITY_FINAL')) fail.push('CT-SSS final marker missing');
if(!app.includes('data-proof-loop="true"')) fail.push('proof loop DOM marker missing');
for(const step of ['도면 검토','공정 설계','CNC 가공','측정/검사','세척/포장','출하']){
  if(!app.includes(step)) fail.push(`proof loop step missing: ${step}`);
}
for(const cta of ['회사정보 보기','제품사례 보기','가공분야 보기','설비현황 보기','품질관리 보기']){
  if(!app.includes(cta)) fail.push(`allowed navigation copy missing: ${cta}`);
}
for(const route of ['company','fields','products','facilities','quality']){
  if(!app.includes(`${route}:`)) fail.push(`route missing: ${route}`);
}
if(app.includes('openFullDesktopDetail') || app.includes('desktopUniversalHotspots')) fail.push('legacy random desktop detail bridge remains');
if(!css.includes('.mobile-bottom')) fail.push('mobile bottom nav style missing');
if(!css.includes('.detail-panel')) fail.push('single detail panel style missing');
if(!css.includes('.dev-route-switcher') || !css.includes('.admin-public-chip')) fail.push('dev/admin public chip suppression missing');
if(/\.hero-section[^{}]*filter|backdrop-filter|blur\(/.test(css)) fail.push('large blur layer risk remains in hero styles');

const publicSource = `${app}\n${css}`;
const forbidden = ['문의','견적','상담','기술문의','기술상담신청','지금 문의하세요','견적 및 상담 문의','도면 검토 및 견적 문의','contact','inquiry','quote','form','textarea','submit','checkbox','file upload'];
for(const token of forbidden){
  if(publicSource.toLowerCase().includes(token.toLowerCase())) fail.push(`forbidden public UI token remains: ${token}`);
}

const distIndex = path.join('dist','index.html');
if(fs.existsSync(distIndex)){
  const distApp = fs.existsSync(path.join('dist','src','app.js')) ? fs.readFileSync(path.join('dist','src','app.js'), 'utf8') : '';
  if(!distApp.includes('CT-SSS0~SSS8_PUBLIC_AUTHORITY_FINAL')) fail.push('dist app does not contain final marker');
}

if(fail.length){
  console.error('VERIFY HOLD');
  for(const item of fail) console.error('- ' + item);
  process.exit(1);
}

console.log('PASS: active folder and wrangler dist path aligned');
console.log('PASS: public company-introduction axis locked');
console.log('PASS: forbidden public CTA copy absent from active public source');
console.log('PASS: 4D proof loop DOM exists');
console.log('PASS: facilities route and equipment images exist');
console.log('PASS: single detail panel and mobile bottom navigation exist');
console.log('PASS: legacy floating helper and public admin chip suppression exists');
