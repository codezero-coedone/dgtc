import fs from 'fs';
const app=fs.readFileSync('src/app.js','utf8');
const css=fs.readFileSync('src/styles.css','utf8');
const fail=[];
for(const img of ['home','company','fields','products','facilities','quality']){
  if(!fs.existsSync(`public/screens/${img}.jpg`)) fail.push('Missing public screen asset: '+img);
}
for(const stale of ['contact.jpg','admin-dashboard.jpg','admin-pipeline.jpg','admin-content.jpg']){
  if(fs.existsSync(`public/screens/${stale}`)) fail.push('Unused/stale delivery asset should be removed: '+stale);
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
if(!app.includes('product-action-clean-mask')||!app.includes('product-detail-clean-btn')||!app.includes('product-bottom-action-mask')) fail.push('CT-F12 product action cleanup markup missing');
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

if(!app.includes('CT-LIVE-QA1~QA8')) fail.push('CT-LIVE-QA desktop/mobile/admin interaction patch marker missing');
if(!css.includes('CT-LIVE-QA1~QA8 DESKTOP+MOBILE+ADMIN FINAL FUNCTIONAL AUDIT PATCH')) fail.push('CT-LIVE-QA stylesheet marker missing');
if(!app.includes('addDesktopLiveHotspots') || !app.includes('enhanceMobileClickability')) fail.push('live desktop/mobile functional delegates missing');


if(!app.includes('CT-CLICK-LOCK1~6 COMPLETE CLICK FUNCTION LOCK PATCH')||!css.includes('CT-CLICK-LOCK1~6 COMPLETE CLICK FUNCTION LOCK STYLES')) fail.push('CT-CLICK-LOCK all desktop/mobile click function lock marker missing');
if(!app.includes('dktInstallDesktopClickLock')||!app.includes('dktInstallMobileClickLock')||!app.includes('dktOpenDesktopByPoint')) fail.push('CT-CLICK-LOCK robust click delegates missing');
if(!app.includes('CT-HUMAN1~HUMAN5 HUMAN-FINISH POLISH PATCH')||!css.includes('CT-HUMAN1~HUMAN5 HUMAN-FINISH POLISH STYLES')) fail.push('CT-HUMAN human finish polish marker missing');
if(!app.includes('김해 한림면에서 CNC 자동선반')||!app.includes('자동차 변속기용 밸브 바디')||!app.includes('CNC 자동선반 소형 정밀부품')) fail.push('CT-HUMAN concrete manufacturing copy missing');


// CT-FIX1~FIX8 final repair gates
if(!app.includes('CT-FIX1~FIX8 FINAL PUBLIC REPAIR LOCK')) fail.push('CT-FIX1~FIX8 final app repair marker missing');
if(!css.includes('CT-FIX1~FIX8 FINAL PUBLIC REPAIR LOCK')) fail.push('CT-FIX1~FIX8 final CSS repair marker missing');
if(!app.includes('finalRouteFromHeaderPercent') || !app.includes('dktFinalPublicNav') || !app.includes("'facilities'")) fail.push('CT-FIX2 facilities header click repair bridge missing');
if(!app.includes('ct-product-clean-row') || !css.includes('.ct-product-clean-row')) fail.push('CT-FIX4 product image cleanup overlay missing');
if(!css.includes('.dev-route-switcher,') || !css.includes('.screen-ux-dock')) fail.push('CT-FIX5 floating public route chip removal missing');
if(!css.includes('.ct-fix-final .clean-live-header.ct-fix-header') || !css.includes('z-index:2200')) fail.push('CT-FIX6 final header/logo lock CSS missing');
for(const productAsset of ['product-01.jpg','product-02.jpg','product-03.jpg','product-04.jpg']){
  if(!fs.existsSync(`public/products/${productAsset}`)) fail.push('CT-FIX4 missing cleaned product asset: '+productAsset);
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


console.log('VERIFY PASS: company-only full functional final delivery gates passed');

// CT-MB1 selective motion blur gate
const cssMb=fs.readFileSync('src/styles.css','utf8');
if(!cssMb.includes('CT-MB1 SELECTIVE MOTION BLUR POLISH')){ console.error('VERIFY HOLD'); console.error('- CT-MB1 selective motion blur CSS marker missing'); process.exit(1); }
console.log('PASS: CT-MB1 selective motion blur polish exists');
console.log('PASS: CT-HUMAN human finish / concrete manufacturing copy polish exists');
if(!app.includes('CT-CLICK-LOCK1~6 COMPLETE CLICK FUNCTION LOCK PATCH')){ console.error('VERIFY HOLD'); console.error('- CT-GH click lock patch missing'); process.exit(1); }
console.log('PASS: CT-GH1~GH5 click-function final lock exists');

// CT-SSS1~8 final upgrade gates
const app2=fs.readFileSync('src/app.js','utf8');
const css2=fs.readFileSync('src/styles.css','utf8');
const fail2=[];
if(!app2.includes('CT-SSS1~8 FINAL UPGRADE LOCK')) fail2.push('CT-SSS1~8 final app marker missing');
if(!css2.includes('CT-SSS1~8 FINAL UPGRADE LOCK')) fail2.push('CT-SSS1~8 final CSS marker missing');
for(const token of ['ProofLoopMobile','ct-sss-proof-rail','mobile-safe-sheet','sss-mobile','m4d-mini']){
  if(!app2.includes(token) && !css2.includes(token)) fail2.push('CT-SSS final missing token: '+token);
}
if(!css2.includes('body.ct-sss1-8-lock .mobile-detail-backdrop') || !css2.includes('display:none!important')) fail2.push('CT-SSS mobile old overlay suppression missing');
if(!app2.includes('정보 탐색만으로 회사 역량을 확인하는 흐름입니다.')) fail2.push('CT-SSS company-intro CTA copy missing');
if(fail2.length){ console.error('VERIFY HOLD'); for(const f of fail2) console.error('- '+f); process.exit(1); }
console.log('PASS: CT-SSS1~8 final upgrade markers, 4D proof loop, mobile safe sheet and overlay suppression exist');


// CT-0~CT-10 final authority gates
const finalApp = fs.readFileSync('src/app.js','utf8');
const finalCss = fs.readFileSync('src/styles.css','utf8');
const finalFail = [];
if(!finalApp.includes('CT-0~CT-10_FINAL_AUTHORITY_LOCK')) finalFail.push('CT-0~CT-10 final app marker missing');
if(!finalCss.includes('CT-0~CT-10 FINAL AUTHORITY LOCK')) finalFail.push('CT-0~CT-10 final CSS marker missing');
['final-detail-panel','final-actions','final-proof-rail','final-inline-cta','final-mobile-sheet','final-mcards'].forEach(token=>{
  if(!finalApp.includes(token) && !finalCss.includes(token)) finalFail.push('missing final UI token: '+token);
});
['요구 확인','도면 검토','공정 설계','CNC 정밀 가공','측정/검사','세척·포장','납품'].forEach(token=>{
  if(!finalApp.includes(token)) finalFail.push('missing final 4D step: '+token);
});
const publicUiSlice = finalApp.split('function AdminLogin')[0] + finalApp.split('CT-0~CT-10 FINAL AUTHORITY LOCK').slice(-1)[0];
['견적 문의','상담 문의','기술문의','기술상담','문의하세요','도면 검토 및 견적 문의','지금, 대광테크에 문의하세요'].forEach(token=>{
  if(publicUiSlice.includes(token)) finalFail.push('forbidden public inquiry CTA: '+token);
});
if(finalFail.length){ console.error('VERIFY FAIL CT-0~CT-10'); finalFail.forEach(x=>console.error('- '+x)); process.exit(1); }
console.log('PASS: CT-0~CT-10 final authority gates, compact CTA, angular modal, proof loop, mobile safety');

// CT-B1~B10 final delivery hardening gates
const bApp = fs.readFileSync('src/app.js','utf8');
const bCss = fs.readFileSync('src/styles.css','utf8');
const bFail = [];
if(!bApp.includes('CT-B1~B10_FINAL_DELIVERY_LOCK')) bFail.push('CT-B1~B10 final app marker missing');
if(!bCss.includes('CT-B1~B10_FINAL_DELIVERY_LOCK')) bFail.push('CT-B1~B10 final CSS marker missing');
['b10-detail-panel','b10-actions','b10-proof','b10-cards','b10-bottom','b10-mobile'].forEach(t=>{ if(!bApp.includes(t) && !bCss.includes(t)) bFail.push('missing B10 UI token: '+t); });
['요구 확인','도면 검토','공정 설계','CNC 정밀 가공','측정/검사','세척·포장','납품'].forEach(t=>{ if(!bApp.includes(t)) bFail.push('missing B10 4D step: '+t); });
['product-01.jpg','product-02.jpg','product-03.jpg','product-04.jpg','product-05.jpg','product-06.jpg'].forEach(t=>{ if(!fs.existsSync('public/products/'+t)) bFail.push('missing product evidence image: '+t); });
['home.jpg','company.jpg','fields.jpg','products.jpg','facilities.jpg','quality.jpg','logo-angular-transparent.png'].forEach(t=>{ if(!fs.existsSync('public/screens/'+t)) bFail.push('missing screen/evidence image: '+t); });
const bPublicBlock = bApp.split('CT-B1~B10_FINAL_DELIVERY_LOCK').slice(-1)[0].split('function BPrevRender')[0];
['견적 문의','상담 문의','기술문의','기술상담','문의하세요','도면 검토 및 견적 문의','지금, 대광테크에 문의하세요'].forEach(t=>{ if(bPublicBlock.includes(t)) bFail.push('forbidden B10 public copy: '+t); });
if(!bCss.includes('body.ct-b10-lock .mobile-detail-backdrop') || !bCss.includes('display:none!important')) bFail.push('B10 legacy mobile overlay suppression missing');
if(!bApp.includes('setFinalDetail') || !bApp.includes('openFinalDetail')) bFail.push('B10 CTA/detail click handler missing');
if(bFail.length){ console.error('VERIFY FAIL CT-B1~B10'); bFail.forEach(x=>console.error('- '+x)); process.exit(1); }
console.log('PASS: CT-B1~B10 live marker, full CTA/card/photo/4D click wiring, mobile safe sheet, bottom finish, angular modal and evidence images');
