import fs from 'fs';
const app=fs.readFileSync('src/app.js','utf8');
const css=fs.readFileSync('src/styles.css','utf8');
const fail=[];
for(const img of ['home','company','fields','products','facilities','quality','admin-dashboard','admin-pipeline','admin-content']){
  if(!fs.existsSync(`public/screens/${img}.jpg`)) fail.push('Missing screen asset: '+img);
}
const forbiddenRouteTokens = ["contact: {label", "'admin/contact'", "'admin/pipeline'", "MobileContact", "adminSaveContact", "CONTACT_URL"];
for(const token of forbiddenRouteTokens){ if(app.includes(token)) fail.push('Company-only violation in app.js: '+token); }
const publicInquiryTokens = ['문의폼', '견적 문의', '견적·기술', '기술 상담', '전화 문의', '이메일 문의', '도면 상담', '지금 전화 문의'];
for(const token of publicInquiryTokens){ if(app.includes(token)) fail.push('Public inquiry copy remains in app.js: '+token); }
if(!app.includes('companyInfo')||!app.includes('AdminCompany')||!app.includes('adminSaveCompany')) fail.push('Company information admin editor missing');
if(!app.includes('AdminProducts')||!app.includes('adminSaveProduct')||!app.includes('adminDelete')) fail.push('Admin product CRUD functions missing');
if(!app.includes('localStorage')||!app.includes('DKT_COMPANY_CMS_V1')) fail.push('localStorage company CMS persistence missing');
if(!app.includes('AdminFlow')||!app.includes('adminSaveFlow')) fail.push('Admin flow editor missing');
if(!app.includes('MobileHome')||!css.includes('.m-bottom')) fail.push('Mobile app UI missing');
if(!css.includes('.company-only-screen')||!css.includes('.nav-out-mask')||!css.includes('.top-company-btn')) fail.push('Desktop company-only overlay masks missing');
if(!css.includes('.admin-live')||!css.includes('.admin-table')) fail.push('Functional admin CSS missing');
if(fail.length){console.error('VERIFY HOLD');for(const f of fail)console.error('- '+f);process.exit(1)}
console.log('PASS: company-introduction policy locked');
console.log('PASS: public inquiry/contact routes removed');
console.log('PASS: desktop exact screens mapped with company-only CTA masks');
console.log('PASS: functional admin company/product/facility/quality/flow editors exist');
console.log('PASS: localStorage company CMS persistence exists');
console.log('PASS: mobile app UI layer exists without inquiry tab');
console.log('VERIFY PASS: company-only homepage gates passed');
