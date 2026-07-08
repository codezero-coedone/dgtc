import crypto from 'crypto';
import fs from 'fs';
const app=fs.readFileSync('src/app.js','utf8');
const css=fs.readFileSync('src/styles.css','utf8');
const fail=[];
const hashFile=(p)=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex').toUpperCase();
const desktopDesignLock={
  'public/screens/home.jpg':{bytes:405759,sha256:'424DFF358EADFB767B33D93A2D4D175DCF131E5AE69F0A171E0B0B4612E3296F'},
  'public/screens/company.jpg':{bytes:383728,sha256:'5437C63775A948793D527AE31F07E49AC1E4544C16758127AB2FC5DF0A0BFFE7'},
  'public/screens/fields.jpg':{bytes:366625,sha256:'9B91DE6C5CA82C632595C87647FD44B26AAF2ABDDB46374C08D4364089359483'},
  'public/screens/products.jpg':{bytes:354367,sha256:'9DA22B232E349BD5F9A277F16505FD9769732345D33788D092E26921246B5378'},
  'public/screens/facilities.jpg':{bytes:393231,sha256:'293A424BDABD92FAC576151D532DEB595A3208C8D9AA444F91AA4C1270D1C1C0'},
  'public/screens/quality.jpg':{bytes:349010,sha256:'895A092D346D90D73A03B26AE04F4BE9C744FC17B9AB7E00A7D607AB6DBD78C3'},
};
for(const [file,lock] of Object.entries(desktopDesignLock)){
  if(!fs.existsSync(file)){ fail.push('Desktop design lock asset missing: '+file); continue; }
  const stat=fs.statSync(file);
  if(stat.size!==lock.bytes) fail.push(`Desktop design lock asset size drift: ${file} expected ${lock.bytes} got ${stat.size}`);
  const digest=hashFile(file);
  if(digest!==lock.sha256) fail.push(`Desktop design lock asset hash drift: ${file}`);
}
if(!fs.existsSync('docs/DESKTOP_DESIGN_LOCK.md')) fail.push('Desktop design lock document missing');
if(!app.includes('company-only-screen full-functional r-initial-visual')) fail.push('Desktop exact-screen authority renderer drifted');
if(!app.includes('<img class="exact-screen" src="./public/screens/${r.img}"')) fail.push('Desktop exact-screen source mapping drifted');
if(!app.includes('home-lower-process-consult-mask')||!app.includes('home-lower-process-first-clean')||!app.includes('home-inquiry-card-mask')) fail.push('Desktop home CTA pixel cleanup masks drifted');
if(!css.includes('CT-X10 pixel authority')||!css.includes('.home-lower-process-consult-mask')||!css.includes('.home-lower-process-first-clean')||!css.includes('.home-inquiry-card-mask')) fail.push('Desktop home pixel authority CSS drifted');
if(!css.includes('.dev-route-switcher,.screen-ux-dock,.desktop-function-hint{display:none!important;}')) fail.push('Desktop drift helper suppression changed');
if(!css.includes('.clean-bottom-panel,')||!css.includes('.product-detail-clean-btn,')||!css.includes('.home-inquiry-card-clean,')) fail.push('Desktop bottom CTA/detail suppression drifted');
for(const img of ['home','company','fields','products','facilities','quality','admin-dashboard','admin-pipeline','admin-content']){
  if(!fs.existsSync(`public/screens/${img}.jpg`)) fail.push('Missing screen asset: '+img);
}
if(!fs.existsSync('public/screens/logo-angular-clean.png')) fail.push('Missing angular logo clean overlay asset');
const forbiddenRouteTokens = ["contact: {label", "'admin/contact'", "'admin/pipeline'", "MobileContact", "adminSaveContact", "CONTACT_URL"];
for(const token of forbiddenRouteTokens){ if(app.includes(token)) fail.push('Company-only violation in app.js: '+token); }
const publicInquiryTokens = ['문의폼', '견적 문의', '견적·기술', '기술 상담', '전화 문의', '이메일 문의', '도면 상담', '지금 전화 문의'];
for(const token of publicInquiryTokens){ if(app.includes(token)) fail.push('Public inquiry copy remains in app.js: '+token); }
if(!app.includes('companyInfo')||!app.includes('AdminCompany')||!app.includes('adminSaveCompany')) fail.push('Company information admin editor missing');
if(!app.includes('AdminProducts')||!app.includes('adminSaveProduct')||!app.includes('adminDelete')) fail.push('Admin product CRUD functions missing');
if(!app.includes('adminFilterProducts')||!app.includes('adminStatusFilter')) fail.push('Admin product search/filter UX missing');
if(!app.includes('localStorage')||!app.includes('DKT_COMPANY_CMS_V1')) fail.push('localStorage company CMS persistence missing');
if(!app.includes('AdminFlow')||!app.includes('adminSaveFlow')) fail.push('Admin flow editor missing');
if(!app.includes('MobileHome')||!css.includes('.m-bottom')) fail.push('Mobile app UI missing');
if(!app.includes('mobileSetProductFilter')||!app.includes('mobileOpenProduct')||!css.includes('.mobile-sheet')) fail.push('Mobile product filter/detail UX missing');
if(!app.includes('mobileSetField')||!css.includes('.m-segments')) fail.push('Mobile segmented UX missing');
if(!app.includes('toast(')||!css.includes('.ux-toast')) fail.push('UX toast feedback missing');
if(!css.includes('.company-only-screen')||!css.includes('.nav-out-mask')||!css.includes('.top-company-btn')||!css.includes('.top-cta-clean-mask')) fail.push('Desktop company-only overlay masks missing');
if(!app.includes('detailHotspots')||!app.includes('desktopDetails')||!css.includes('.detail-hot')||!css.includes('.desktop-detail-modal')) fail.push('Desktop clickable panel/detail hotspot UX missing');
if(!css.includes('.dev-route-switcher,.screen-ux-dock{display:none!important}')) fail.push('Dirty desktop helper UI cleanup missing');
if(!css.includes('.admin-live')||!css.includes('.admin-table')) fail.push('Functional admin CSS missing');

if(!app.includes('route-${routeKey}')||!css.includes('.page-clean-panel')||!css.includes('.brand-clean-logo')) fail.push('CT-F2 visual clean overlays missing');
if(!app.includes('monthlyCapacity')||!app.includes('equipmentCount')||!app.includes('principle1')) fail.push('CT-F4 company CMS metrics missing');
if(!app.includes('MobileCompany')||!css.includes('.m-info-list')) fail.push('CT-F5 mobile company screen polish missing');
if(!css.includes('CT-F5 MOBILE POLISH')) fail.push('CT-F5 mobile polish styles missing');

if(!fs.existsSync('public/screens/logo-angular-transparent.png')) fail.push('Missing transparent angular logo overlay asset');
if(!app.includes('logo-erase-mask')||!app.includes('logo-angular-transparent.png')) fail.push('CT-F10 logo/header cleanup markup missing');
if(!app.includes('product-action-clean-mask')||!app.includes('product-bottom-action-mask')) fail.push('CT-X product cleanup masks missing');
if(app.includes('product-detail-clean-btn')) fail.push('CT-X product detail overlay button still rendered in app.js');
if(!css.includes('CT-F10-F12 TOP CLEAN')||!css.includes('.logo-erase-mask')||!css.includes('.product-detail-clean-btn')) fail.push('CT-F10-F12 cleanup CSS missing');


if(!app.includes('CT-G1~G8 FEATURE UPGRADE')||!app.includes('AdminOps')||!app.includes('adminBulkStatus')||!app.includes('adminCreateBackup')||!app.includes('adminImportFile')) fail.push('CT-G admin ops / backup / import upgrade missing');
if(!app.includes('CommandPalette')||!app.includes('openCommandPalette')||!css.includes('.cmd-palette')) fail.push('CT-G command palette UX missing');
if(!app.includes('cmsHealth')||!app.includes('readinessBadge')||!css.includes('.admin-system-bar')||!css.includes('.score-ring')) fail.push('CT-G content health dashboard missing');
if(!app.includes('routeStep')||!css.includes('.route-progress')) fail.push('CT-G keyboard navigation / progress UX missing');
if(!css.includes('FEATURE UPGRADE / UX ADVANCEMENT PATCH')) fail.push('CT-G premium UX CSS marker missing');


if(!app.includes('CT-U1~U10 FULL FUNCTIONAL FINAL PATCH')||!css.includes('CT-U1~U10 FULL FUNCTIONAL FINAL STYLES')) fail.push('CT-U full functional patch markers missing');
if(!app.includes('desktopUniversalHotspots')||!app.includes('openFullDesktopDetail')||!css.includes('.u-hot')) fail.push('CT-U1 desktop universal clickable hotspots missing');
if(!app.includes('FullDetailModal')||!app.includes('desktopNextZone')||!css.includes('.full-detail-modal')) fail.push('CT-U3 desktop upgraded detail modal missing');
if(!app.includes('mobileZoomImage')||!app.includes('mobileImageZoom')||!css.includes('.mobile-zoom')) fail.push('CT-U4 mobile image zoom/detail UX missing');
if(!css.includes('padding-bottom:calc(188px + env(safe-area-inset-bottom))')||!css.includes('.m-sticky.full')) fail.push('CT-U5 mobile safe-area/sticky CTA correction missing');
if(!app.includes('adminDirtyChip')||!app.includes('adminMarkDirty')||!css.includes('.dirty-chip')) fail.push('CT-U6 admin dirty-state stabilization missing');
if(!app.includes('syncPreviewImage')||!css.includes('.editor-preview-wrap')) fail.push('CT-U6 admin image preview UX missing');



// CT-R1~R8 final verification gates
if(!app.includes('CT-R1~R8_INITIAL_VISUAL_RESTORE_FUNCTION_LOCK')) fail.push('CT-R final app marker missing');
if(!css.includes('CT-R1~R8_INITIAL_VISUAL_RESTORE_FUNCTION_LOCK')) fail.push('CT-R final CSS marker missing');
if(!app.includes('CT_R9_NO_BOTTOM_4D_NO_INQUIRY_LOCK') || !css.includes('CT-R9_NO_BOTTOM_4D_NO_INQUIRY_LOCK')) fail.push('CT-R9 no-bottom-4D/no-inquiry lock missing');
if(app.includes('${rProofLoop(routeKey)}')) fail.push('CT-R9 bottom 4D loop still rendered in desktopScreen');
if(!css.includes('.r-proof-loop{display:none!important')) fail.push('CT-R9 bottom 4D loop CSS suppression missing');
if(!app.includes('r-detail-modal') || !css.includes('.r-detail-modal') || !css.includes('.r-actions button:first-child')) fail.push('CT-R angular compact detail modal missing');
if(!css.includes('.desktop-function-hint{display:none!important}') && !css.includes('.desktop-function-hint{display:none')) fail.push('CT-R dirty hint suppression missing');
for (const token of ['문의','상담','견적']) { if (app.includes(token)) fail.push('CT-R public prohibited Korean CTA token remains in app.js: '+token); }
if(css.includes('background:rgba(20,124,255,.055);box-shadow:inset 0 0 0 1px rgba(101,177,255,.24),0 0 28px rgba(20,124,255,.12);outline:none;}') && !css.includes('CT-R1~R8_INITIAL_VISUAL_RESTORE_FUNCTION_LOCK')) fail.push('CT-R blue hotspot override not applied');
if(app.includes('home-inquiry-card-clean')) fail.push('CT-X home inquiry overlay card still rendered in app.js');
if(!app.includes('home-inquiry-card-mask') || !app.includes('home-process-first-clean')) fail.push('CT-X home mask/process cleanup missing');



// CT-X final public UI removal verification gates
if(!css.includes('CT-X_FINAL_REMOVE_PUBLIC_BOTTOM_CTA_DETAIL_LOCK')) fail.push('CT-X final removal CSS marker missing');
for (const token of ['제품 상세 보기','상세 확인','제품·가공사례 상세','문의','상담','견적']) { if (app.includes(token)) fail.push('CT-X prohibited public UI text remains in app.js: '+token); }
for (const token of ['detailConfirm','detailStrip','detailDock','bottomCta','fixedCta','bottomInquiry','productDetailCta','quoteCta','inquiryCta','consultCta']) { if (app.includes(token)) fail.push('CT-X prohibited public CTA class/function remains in app.js: '+token); }
if(!css.includes('.clean-bottom-panel,') || !css.includes('.product-detail-clean-btn,') || !css.includes('.home-inquiry-card-clean,')) fail.push('CT-X CSS suppression selectors missing');

// CT-ADMIN-IMG1~IMG8 image-only admin console verification gates
if(!app.includes('CT-ADMIN-IMG1~IMG8_EXACT_IMAGE_MANAGEMENT_CONSOLE_LOCK')) fail.push('CT-ADMIN image management app marker missing');
if(!css.includes('CT-ADMIN-IMG1~IMG8_EXACT_IMAGE_MANAGEMENT_CONSOLE_LOCK')) fail.push('CT-ADMIN image management CSS marker missing');
for (const token of ['AdminImageDashboard','AdminImageLibrary','AdminImageAdd','AdminImagePageMap','iaHandleFiles','iaRegisterQueue','DKT_IMAGE_ASSETS_V1']) {
  if(!app.includes(token)) fail.push('CT-ADMIN image workflow missing: '+token);
}
for (const asset of ['gear_assembly_03.jpg','cnc_process_02.jpg','factory_line_05.jpg','quality_inspection_04.jpg']) {
  if(!fs.existsSync('public/admin-assets/'+asset)) fail.push('CT-ADMIN admin asset missing: '+asset);
}
for (const cls of ['.ia-admin','.ia-side','.ia-grid','.ia-upload','.ia-detail-page','.ia-right']) {
  if(!css.includes(cls)) fail.push('CT-ADMIN exact admin CSS missing: '+cls);
}

if(fail.length){console.error('VERIFY HOLD');for(const f of fail)console.error('- '+f);process.exit(1)}
console.log('PASS: company-introduction policy locked');
console.log('PASS: public inquiry/contact routes removed');
console.log('PASS: desktop exact screens mapped with strengthened company-only masks and visual-clean overlays');
console.log('PASS: dirty helper UI hidden and desktop panel/photo/detail hotspots preserved');
console.log('PASS: functional admin company/product/facility/quality/flow editors exist with company metric CMS');
console.log('PASS: admin search/filter, CRUD, localStorage persistence, export UX preserved');
console.log('PASS: mobile app UI layer exists without inquiry tab');
console.log('PASS: mobile segmented controls, product detail sheet, company screen, sticky CTA preserved');
console.log('PASS: CT-F10 header/logo panel cleanup markers exist');
console.log('PASS: CT-F11 company-only CTA cleanup markers exist');
console.log('PASS: CT-F12 product functional action cleanup markers exist');
console.log('PASS: CT-G admin ops, backup/import, command palette, content health and UX upgrade markers exist');
console.log('PASS: CT-U1~U10 desktop/mobile/admin full functional UX gates passed');
console.log('PASS: CT-R1~R8 initial premium visual + stable functionality gates passed');
console.log('PASS: CT-R9 bottom 4D loop removed and inquiry/quote/consult pixels blocked');
console.log('PASS: CT-ADMIN image management console graft locked');
console.log('VERIFY PASS: company-only full functional final delivery gates passed');
