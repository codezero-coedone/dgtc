const routes = {
  home: {label:'홈', img:'home.jpg'},
  company: {label:'회사소개', img:'company.jpg'},
  fields: {label:'가공분야', img:'fields.jpg'},
  products: {label:'제품·가공사례', img:'products.jpg'},
  facilities: {label:'설비현황', img:'facilities.jpg'},
  quality: {label:'품질관리', img:'quality.jpg'},
  'admin/login': {label:'Admin Login', admin:true},
  'admin/dashboard': {label:'대시보드', admin:true},
  'admin/company': {label:'회사정보', admin:true},
  'admin/products': {label:'제품·가공사례', admin:true},
  'admin/facilities': {label:'설비현황', admin:true},
  'admin/quality': {label:'품질관리', admin:true},
  'admin/flow': {label:'4D 플로우', admin:true},
  'admin/preview': {label:'미리보기', admin:true},
  'admin/settings': {label:'설정', admin:true},
};
const nav = ['home','company','fields','products','facilities','quality'];
const adminNav = ['admin/dashboard','admin/company','admin/products','admin/facilities','admin/quality','admin/flow','admin/preview','admin/settings'];
const app = document.getElementById('app');
const go = (path) => { location.hash = '#/' + path; };
const esc = (v='') => String(v).replace(/[&<>"']/g, s => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[s]));
function current(){ const key=(location.hash.replace('#/','') || 'home').replace(/^\//,''); return ['contact','admin'+'/contact','admin'+'/pipeline'].includes(key) ? 'company' : key; }
function isMobile(){ return window.matchMedia('(max-width:899px)').matches && !current().startsWith('admin'); }

const seedCms = {
  companyInfo:{name:'대광테크 / DAE KWANG TECH', ceo:'이원근 이사', phone:'055-323-7157', mobile:'010-9256-7475', email:'ndh7157@hanmail.net', address:'경남 김해시 한림면 신천리 984', hours:'평일 08:30 - 17:30', intro:'CNC 자동선반 기반 정밀 금속 부품 제조 전문 기업입니다.'},
  products:[
    {id:'AUTO-2024-0001', title:'자동차 변속기 밸브 바디', category:'자동차부품', material:'SCM415', process:'CNC 자동선반', tolerance:'±0.005 mm', status:'공개', image:'./public/screens/products.jpg', description:'고정밀 CNC 자동선반 가공을 통해 생산되는 변속기 핵심 부품입니다.'},
    {id:'HYD-2024-0015', title:'유압 블록 카트리지', category:'유압부품', material:'SUS304', process:'복합 가공', tolerance:'Ra 0.4 μm', status:'공개', image:'./public/screens/fields.jpg', description:'고압 유압 시스템에 적용 가능한 내구성 중심 가공품입니다.'},
    {id:'PREC-2024-0021', title:'정밀 샤프트', category:'정밀 양산가공', material:'SUS316', process:'선반/밀링', tolerance:'±0.003 mm', status:'임시저장', image:'./public/screens/home.jpg', description:'반복 생산에 적합한 정밀 축류 부품입니다.'},
  ],
  facilities:[
    {id:'EQ-01', name:'자동선반 라인', type:'가공', status:'가동', spec:'CNC 자동선반 기반 정밀 부품 가공', image:'./public/screens/facilities.jpg'},
    {id:'EQ-02', name:'정밀 측정/검사 장비', type:'검사', status:'가동', spec:'치수·형상·공차 측정 데이터 관리', image:'./public/screens/quality.jpg'},
    {id:'EQ-03', name:'세척·포장 설비', type:'후공정', status:'가동', spec:'세척, 포장, 출하 전 품질 유지', image:'./public/screens/facilities.jpg'},
  ],
  quality:[
    {id:'q1', label:'합격률 FTQ', value:'99.25%', note:'월간 기준'},
    {id:'q2', label:'공정 관리 Cpk', value:'1.67', note:'핵심 치수 기준'},
    {id:'q3', label:'납기 준수율', value:'99.2%', note:'월간 기준'},
    {id:'q4', label:'불량 최소화', value:'120 PPM', note:'관리 기준'},
  ],
  flows:[
    {id:'f1', title:'요구 확인', body:'제품 요구사항 및 사양 확인'},
    {id:'f2', title:'도면 검토', body:'도면 분석 및 가공성 검토'},
    {id:'f3', title:'공정 설계', body:'최적 공정 및 치공구 설계'},
    {id:'f4', title:'정밀 가공', body:'CNC 자동선반 기반 가공'},
    {id:'f5', title:'품질 검사', body:'치수·형상·공차 확인'},
    {id:'f6', title:'출하 관리', body:'세척·포장 후 출하 관리'},
  ],
  audit:[{time:new Date().toLocaleString('ko-KR'), action:'회사소개형 CMS 데이터 로드', actor:'system'}],
};
function clone(v){ return JSON.parse(JSON.stringify(v)); }
function loadCms(){ try { return JSON.parse(localStorage.getItem('DKT_COMPANY_CMS_V1')) || clone(seedCms); } catch { return clone(seedCms); } }
function saveCms(data, action='CMS 저장'){ data.audit = [{time:new Date().toLocaleString('ko-KR'), action, actor:'admin'}, ...(data.audit||[])].slice(0,30); localStorage.setItem('DKT_COMPANY_CMS_V1', JSON.stringify(data)); render(); }
function cms(){ return loadCms(); }
function isAuthed(){ return localStorage.getItem('DKT_ADMIN_AUTH') === 'ok'; }

function desktopScreen(routeKey){
  const r = routes[routeKey] || routes.home;
  const navLinks = nav.map((key,i)=>`<button class="hot nav-hot nav-${i} ${key===routeKey?'on':''}" onclick="go('${key}')" aria-label="${routes[key].label}"></button>`).join('');
  const isHome = routeKey === 'home';
  return `<main class="screen-wrap company-only-screen">
    <img class="exact-screen" src="./public/screens/${r.img}" alt="${r.label} exact screen" />
    <div class="screen-mask nav-out-mask" aria-hidden="true"></div>
    <button class="screen-mask top-company-btn" onclick="go('company')">회사소개 보기 →</button>
    <div class="screen-mask footer-out-mask" aria-hidden="true"></div>
    ${isHome?`<div class="screen-mask home-info-mask"><b>대광테크 회사소개</b><span>CNC 자동선반 기반 정밀가공 역량과 설비·품질 체계를 확인하세요.</span><button onclick="go('company')">회사정보 보기 →</button></div>`:''}
    ${navLinks}
    <button class="hot cta-hot" onclick="go('company')" aria-label="회사소개 보기"></button>
    <div class="dev-route-switcher">
      ${nav.map(key=>`<button class="${key===routeKey?'on':''}" onclick="go('${key}')">${routes[key].label}</button>`).join('')}
      <button onclick="go('admin/dashboard')">Admin</button>
    </div>
  </main>`;
}

function AdminLogin(){return `<main class="admin-live login-live"><section class="login-card"><div class="login-mark">DK</div><h1>대광테크 관리자 로그인</h1><p>회사소개형 홈페이지 관리 콘솔입니다.</p><label>아이디<input id="login-id" value="admin@daekwang.co.kr" /></label><label>비밀번호<input id="login-pw" type="password" value="demo1234" /></label><button onclick="adminLogin()">로그인</button><button class="ghost" onclick="go('home')">사이트로 돌아가기</button></section></main>`}
function adminLayout(active,title,subtitle,body){return `<main class="admin-live"><aside class="admin-side"><button class="brand" onclick="go('admin/dashboard')"><span>DK</span><b>DAE KWANG TECH</b><small>Company CMS</small></button><nav>${adminNav.map(k=>`<button class="${active===k?'on':''}" onclick="go('${k}')">${routes[k].label}</button>`).join('')}</nav><div class="admin-user"><b>관리자</b><small>localStorage CMS</small><button onclick="adminLogout()">로그아웃</button></div></aside><section class="admin-main"><header class="admin-top"><div><h1>${title}</h1><p>${subtitle}</p></div><div class="admin-top-actions"><button onclick="go('home')">사이트 보기</button><button onclick="adminExport()">JSON 내보내기</button></div></header>${body}</section></main>`}
function statCards(d){return `<div class="admin-stats"><article><small>제품·가공사례</small><b>${d.products.length}</b><span>등록 콘텐츠</span></article><article><small>공개 제품</small><b>${d.products.filter(p=>p.status==='공개').length}</b><span>노출 대상</span></article><article><small>설비 항목</small><b>${d.facilities.length}</b><span>운영 장비</span></article><article><small>품질 KPI</small><b>${d.quality.length}</b><span>관리 지표</span></article><article><small>4D 단계</small><b>${d.flows.length}</b><span>공정 플로우</span></article></div>`}
function AdminDashboard(){const d=cms();return adminLayout('admin/dashboard','대시보드','회사소개형 홈페이지 콘텐츠 상태를 확인합니다.',`${statCards(d)}<div class="admin-grid two"><section class="admin-panel"><h2>최근 활동</h2>${(d.audit||[]).slice(0,8).map(a=>`<div class="activity"><b>${esc(a.action)}</b><small>${esc(a.time)} · ${esc(a.actor)}</small></div>`).join('')}</section><section class="admin-panel"><h2>빠른 실행</h2><div class="quick-grid"><button onclick="go('admin/company')">회사정보 수정</button><button onclick="adminAdd('products')">제품 등록</button><button onclick="go('admin/flow')">4D 플로우 관리</button><button onclick="go('admin/preview')">CMS 미리보기</button></div></section></div>`)}
function AdminCompany(){const d=cms();const c=d.companyInfo;return adminLayout('admin/company','회사정보 관리','회사소개 홈페이지에 표시되는 기본 정보를 관리합니다.',`<section class="admin-panel editor"><h2>회사 기본 정보</h2><div class="field-grid"><label>회사명<input id="company-name" value="${esc(c.name)}"></label><label>대표/담당<input id="company-ceo" value="${esc(c.ceo)}"></label><label>대표전화<input id="company-phone" value="${esc(c.phone)}"></label><label>모바일<input id="company-mobile" value="${esc(c.mobile)}"></label><label>이메일<input id="company-email" value="${esc(c.email)}"></label><label>운영시간<input id="company-hours" value="${esc(c.hours)}"></label><label class="span2">주소<input id="company-address" value="${esc(c.address)}"></label><label class="span2">소개문<textarea id="company-intro">${esc(c.intro)}</textarea></label></div><div class="editor-actions"><button onclick="adminSaveCompany()">저장</button></div><p class="admin-note">공개 페이지에는 입력형 문의/견적/상담 폼을 두지 않습니다. 연락처는 회사 기본 정보로만 표시합니다.</p></section>`)}
function rowStatus(s){return `<span class="status ${s==='공개'?'ok':s==='비공개'?'off':'draft'}">${esc(s)}</span>`}
function AdminProducts(){const d=cms();const selected=d.products.find(p=>p.id===localStorage.getItem('DKT_SELECTED_PRODUCT')) || d.products[0];return adminLayout('admin/products','제품·가공사례 관리','제품 등록, 수정, 삭제, 발행 상태를 관리합니다.',`${statCards(d)}<div class="admin-grid editor-grid"><section class="admin-panel"><div class="panel-head"><h2>제품 목록</h2><button onclick="adminAdd('products')">+ 신규 등록</button></div><div class="admin-table">${d.products.map(p=>`<button class="table-row ${selected&&selected.id===p.id?'on':''}" onclick="adminSelectProduct('${p.id}')"><img src="${esc(p.image)}" /><span><b>${esc(p.title)}</b><small>${esc(p.id)} · ${esc(p.category)}</small></span><em>${esc(p.material)}</em>${rowStatus(p.status)}</button>`).join('')}</div></section><section class="admin-panel editor"><h2>제품 편집</h2>${selected?productEditor(selected):'<p>제품을 선택하세요.</p>'}</section></div>`)}
function productEditor(p){return `<div class="field-grid"><label>제품명<input data-edit="title" value="${esc(p.title)}" /></label><label>코드<input data-edit="id" value="${esc(p.id)}" disabled /></label><label>카테고리<input data-edit="category" value="${esc(p.category)}" /></label><label>상태<select data-edit="status"><option ${p.status==='공개'?'selected':''}>공개</option><option ${p.status==='임시저장'?'selected':''}>임시저장</option><option ${p.status==='비공개'?'selected':''}>비공개</option></select></label><label>소재<input data-edit="material" value="${esc(p.material)}" /></label><label>공정<input data-edit="process" value="${esc(p.process)}" /></label><label>정밀도<input data-edit="tolerance" value="${esc(p.tolerance)}" /></label><label>이미지 경로<input data-edit="image" value="${esc(p.image)}" /></label><label class="span2">설명<textarea data-edit="description">${esc(p.description)}</textarea></label></div><div class="editor-actions"><button onclick="adminSaveProduct('${p.id}')">저장</button><button class="ghost" onclick="adminDuplicateProduct('${p.id}')">복제</button><button class="danger" onclick="adminDelete('products','${p.id}')">삭제</button></div><img class="editor-preview" src="${esc(p.image)}" />`}
function AdminFacilities(){const d=cms();return adminLayout('admin/facilities','설비현황 관리','장비 항목, 상태, 스펙, 이미지를 관리합니다.',`<section class="admin-panel"><div class="panel-head"><h2>설비 목록</h2><button onclick="adminAdd('facilities')">+ 설비 등록</button></div><div class="facility-list">${d.facilities.map(f=>`<article><img src="${esc(f.image)}"><div><b>${esc(f.name)}</b><small>${esc(f.id)} · ${esc(f.type)}</small><p>${esc(f.spec)}</p>${rowStatus(f.status)}</div><div class="row-actions"><button onclick="adminEditFacility('${f.id}')">수정</button><button class="danger" onclick="adminDelete('facilities','${f.id}')">삭제</button></div></article>`).join('')}</div></section>`)}
function AdminQuality(){const d=cms();return adminLayout('admin/quality','품질관리 지표','품질 KPI 값을 수정합니다.',`<section class="admin-panel"><h2>KPI 편집</h2><div class="kpi-edit">${d.quality.map(q=>`<article><label>지표명<input id="q-label-${q.id}" value="${esc(q.label)}"></label><label>값<input id="q-value-${q.id}" value="${esc(q.value)}"></label><label>메모<input id="q-note-${q.id}" value="${esc(q.note)}"></label><button onclick="adminSaveQuality('${q.id}')">저장</button></article>`).join('')}</div></section>`)}
function AdminFlow(){const d=cms();return adminLayout('admin/flow','4D 플로우 관리','회사소개형 공정 흐름 단계명과 설명을 관리합니다.',`<section class="admin-panel"><div class="panel-head"><h2>플로우 단계</h2><button onclick="adminAdd('flows')">+ 단계 추가</button></div><div class="flow-edit">${d.flows.map((f,i)=>`<article><em>${String(i+1).padStart(2,'0')}</em><label>단계명<input id="flow-title-${f.id}" value="${esc(f.title)}"></label><label>설명<input id="flow-body-${f.id}" value="${esc(f.body)}"></label><button onclick="adminSaveFlow('${f.id}')">저장</button><button class="danger" onclick="adminDelete('flows','${f.id}')">삭제</button></article>`).join('')}</div></section>`)}
function AdminPreview(){const d=cms();return adminLayout('admin/preview','CMS 미리보기','관리 데이터가 모바일 public UI와 관리자 미리보기에 반영되는 상태를 확인합니다.',`<div class="admin-grid two"><section class="admin-panel"><h2>제품 미리보기</h2><div class="preview-cards">${d.products.filter(p=>p.status==='공개').map(p=>`<article><img src="${esc(p.image)}"><b>${esc(p.title)}</b><small>${esc(p.category)} · ${esc(p.material)}</small><p>${esc(p.description)}</p></article>`).join('')}</div></section><section class="admin-panel"><h2>회사정보 미리보기</h2><div class="contact-preview"><b>${esc(d.companyInfo.name)}</b><b>${esc(d.companyInfo.phone)}</b><p>${esc(d.companyInfo.address)}</p><p>${esc(d.companyInfo.intro)}</p></div><h2>4D 플로우</h2><div class="mini-flow">${d.flows.map((f,i)=>`<span>${i+1}. ${esc(f.title)}</span>`).join('')}</div></section></div>`) }
function AdminSettings(){return adminLayout('admin/settings','설정','로컬 CMS 데이터 초기화/내보내기를 관리합니다.',`<section class="admin-panel"><h2>데이터 관리</h2><p>현재 버전은 브라우저 localStorage 기반 CMS입니다. 새로고침 후에도 데이터가 유지됩니다.</p><div class="quick-grid"><button onclick="adminExport()">JSON 내보내기</button><button class="danger" onclick="adminReset()">초기 데이터로 리셋</button></div><pre class="json-preview">${esc(JSON.stringify(cms(),null,2)).slice(0,2400)}</pre></section>`) }
function adminApp(routeKey){ if(!isAuthed() && routeKey!=='admin/login') return AdminLogin(); if(routeKey==='admin/login') return AdminLogin(); if(routeKey==='admin/company') return AdminCompany(); if(routeKey==='admin/products'||routeKey==='admin/content') return AdminProducts(); if(routeKey==='admin/facilities') return AdminFacilities(); if(routeKey==='admin/quality') return AdminQuality(); if(routeKey==='admin/flow') return AdminFlow(); if(routeKey==='admin/preview') return AdminPreview(); if(routeKey==='admin/settings') return AdminSettings(); return AdminDashboard(); }

const productCards = [['자동차부품','고정밀·고신뢰성 부품','./public/screens/products.jpg'],['유압부품','고압 내구성 정밀 가공','./public/screens/fields.jpg'],['전자부품','소형 정밀부품 대응','./public/screens/home.jpg']];
function MobileTop(){return `<header class="m-top"><button onclick="go('home')"><img src="./public/screens/home.jpg" alt="logo" /></button><strong>DAE KWANG TECH</strong><button class="m-top-link" onclick="go('company')">회사정보</button></header>`}
function Bottom(active){return `<nav class="m-bottom">${[['home','홈'],['fields','가공'],['products','제품'],['facilities','설비'],['quality','품질']].map(([k,l])=>`<button class="${active===k?'on':''}" onclick="go('${k}')"><i>${{home:'⌂',fields:'◆',products:'▦',facilities:'▣',quality:'✓'}[k]}</i><span>${l}</span></button>`).join('')}</nav>`}
function Flow(title='4D 제조 플로우', list=cms().flows.map(f=>f.title)){return `<section class="m-card"><div class="m-head"><b>${title}</b><span>PROCESS</span></div><div class="m-flow">${list.map((s,i)=>`<div><em>${String(i+1).padStart(2,'0')}</em><b>${esc(s)}</b><small>${i<list.length-1?'→':'✓'}</small></div>`).join('')}</div></section>`}
function MobileHome(){const d=cms();return `${MobileTop()}<main class="mobile-app"><section class="m-hero"><span>CNC 자동선반 전문 가공업체</span><h1>정밀함이 만드는 차이,<br><mark>제조 경쟁력</mark>입니다.</h1><p>${esc(d.companyInfo.intro)}</p><div class="m-kpi">${d.quality.slice(0,3).map(q=>`<b>${esc(q.value)}</b>`).join('')}</div></section><section class="m-actions"><button onclick="go('company')">회사소개</button><button onclick="go('products')">제품 보기</button><button onclick="go('facilities')">설비 현황</button></section>${Flow()}<section class="m-card"><div class="m-head"><b>가공분야</b><button onclick="go('fields')">전체</button></div><div class="m-feed">${productCards.map(([t,desc,img])=>`<article><img src="${img}"><div><b>${t}</b><p>${desc}</p><span>자세히 보기 →</span></div></article>`).join('')}</div></section></main><button class="m-sticky" onclick="go('company')">회사정보 보기</button>${Bottom('home')}`}
function MobileFields(){return `${MobileTop()}<main class="mobile-app"><section class="m-title"><span>MACHINING FIELDS</span><h1>정밀 가공의 모든 분야</h1></section><div class="m-segments"><button class="on">자동차</button><button>유압</button><button>전자</button><button>양산</button></div><section class="m-card visual"><img src="./public/screens/fields.jpg"><b>자동차부품 가공</b><p>복잡 형상, 고정도 치수, 반복 생산을 위한 공정 설계를 지원합니다.</p></section>${Flow('4D 대응 프로세스',['요구 확인','소재 검토','공정 설계','가공','검사'])}</main><button class="m-sticky" onclick="go('products')">제품 사례 보기</button>${Bottom('fields')}`}
function MobileProducts(){const d=cms();return `${MobileTop()}<main class="mobile-app"><section class="m-title"><span>PRODUCT CASE</span><h1>제품·가공사례</h1></section><div class="m-segments"><button class="on">전체</button><button>자동차</button><button>유압</button><button>정밀</button></div><section class="m-feed products">${d.products.map(p=>`<article><img src="${esc(p.image)}"><div><b>${esc(p.title)}</b><p>${esc(p.material)} · ${esc(p.process)} · ${esc(p.tolerance)}</p><span>${esc(p.status)} · 상세 정보 보기 →</span></div></article>`).join('')}</section></main><button class="m-sticky" onclick="go('facilities')">설비·품질 보기</button>${Bottom('products')}`}
function MobileFacilities(){const d=cms();return `${MobileTop()}<main class="mobile-app"><section class="m-title"><span>EQUIPMENT</span><h1>자동선반 기반 정밀 가공 환경</h1></section><section class="m-card visual"><img src="./public/screens/facilities.jpg"><b>대표 장비 환경</b><p>가공·검사·세척·포장 공정을 안정적으로 운영합니다.</p></section><section class="m-feed">${d.facilities.map(f=>`<article><img src="${esc(f.image)}"><div><b>${esc(f.name)}</b><p>${esc(f.spec)}</p><span>${esc(f.status)}</span></div></article>`).join('')}</section>${Flow('4D 공정-설비 연계',['도면 검토','가공 실행','측정/검사','세척/포장','출하'])}</main><button class="m-sticky" onclick="go('quality')">품질관리 보기</button>${Bottom('facilities')}`}
function MobileQuality(){const d=cms();return `${MobileTop()}<main class="mobile-app"><section class="m-title"><span>QUALITY</span><h1>품질관리 체계</h1></section><section class="m-card visual"><img src="./public/screens/quality.jpg"><b>정밀 측정 기반 품질관리</b><p>검사 프로세스와 품질 데이터를 기반으로 안정적인 생산 품질을 유지합니다.</p></section><section class="m-card"><div class="m-head"><b>품질 KPI</b><span>MONTHLY</span></div><div class="m-kpi quality">${d.quality.map(q=>`<b><small>${esc(q.label)}</small>${esc(q.value)}</b>`).join('')}</div></section>${Flow('품질 검사 프로세스',['수입검사','공정검사','자주검사','최종검사','출하검사'])}</main><button class="m-sticky" onclick="go('home')">홈으로 이동</button>${Bottom('quality')}`}
function mobileApp(routeKey){ if(routeKey==='fields') return MobileFields(); if(routeKey==='products') return MobileProducts(); if(routeKey==='facilities') return MobileFacilities(); if(routeKey==='quality') return MobileQuality(); return MobileHome(); }

window.adminLogin=()=>{localStorage.setItem('DKT_ADMIN_AUTH','ok');go('admin/dashboard')};
window.adminLogout=()=>{localStorage.removeItem('DKT_ADMIN_AUTH');go('admin/login')};
window.adminSelectProduct=(id)=>{localStorage.setItem('DKT_SELECTED_PRODUCT',id);render()};
window.adminAdd=(type)=>{const d=cms();if(type==='products'){const id='NEW-'+Date.now();d.products.unshift({id,title:'신규 가공품',category:'정밀 양산가공',material:'SCM415',process:'CNC 자동선반',tolerance:'±0.005 mm',status:'임시저장',image:'./public/screens/products.jpg',description:'신규 등록 제품 설명'});localStorage.setItem('DKT_SELECTED_PRODUCT',id);saveCms(d,'제품 신규 등록');go('admin/products')}if(type==='facilities'){d.facilities.unshift({id:'EQ-'+Date.now(),name:'신규 설비',type:'가공',status:'가동',spec:'설비 스펙 입력',image:'./public/screens/facilities.jpg'});saveCms(d,'설비 신규 등록')}if(type==='flows'){d.flows.push({id:'F-'+Date.now(),title:'신규 단계',body:'단계 설명'});saveCms(d,'4D 단계 추가')}};
window.adminSaveProduct=(id)=>{const d=cms();const p=d.products.find(x=>x.id===id);if(!p)return;document.querySelectorAll('[data-edit]').forEach(el=>{const k=el.dataset.edit;if(k!=='id')p[k]=el.value});saveCms(d,'제품 수정: '+p.title)};
window.adminDuplicateProduct=(id)=>{const d=cms();const p=d.products.find(x=>x.id===id);if(!p)return;const np={...p,id:'COPY-'+Date.now(),title:p.title+' 복제',status:'임시저장'};d.products.unshift(np);localStorage.setItem('DKT_SELECTED_PRODUCT',np.id);saveCms(d,'제품 복제')};
window.adminDelete=(type,id)=>{if(!confirm('삭제할까요?'))return;const d=cms();d[type]=d[type].filter(x=>x.id!==id);saveCms(d,`${type} 삭제: ${id}`)};
window.adminEditFacility=(id)=>{const d=cms();const f=d.facilities.find(x=>x.id===id);if(!f)return;const name=prompt('설비명',f.name);if(name===null)return;const spec=prompt('스펙',f.spec);if(spec===null)return;f.name=name;f.spec=spec;saveCms(d,'설비 수정: '+name)};
window.adminSaveQuality=(id)=>{const d=cms();const q=d.quality.find(x=>x.id===id);if(!q)return;q.label=document.getElementById('q-label-'+id).value;q.value=document.getElementById('q-value-'+id).value;q.note=document.getElementById('q-note-'+id).value;saveCms(d,'품질 KPI 수정: '+q.label)};
window.adminSaveCompany=()=>{const d=cms();d.companyInfo={name:document.getElementById('company-name').value,ceo:document.getElementById('company-ceo').value,phone:document.getElementById('company-phone').value,mobile:document.getElementById('company-mobile').value,email:document.getElementById('company-email').value,address:document.getElementById('company-address').value,hours:document.getElementById('company-hours').value,intro:document.getElementById('company-intro').value};saveCms(d,'회사정보 수정')};
window.adminSaveFlow=(id)=>{const d=cms();const f=d.flows.find(x=>x.id===id);if(!f)return;f.title=document.getElementById('flow-title-'+id).value;f.body=document.getElementById('flow-body-'+id).value;saveCms(d,'4D 플로우 수정: '+f.title)};
window.adminReset=()=>{if(confirm('초기 데이터로 리셋할까요?')){localStorage.setItem('DKT_COMPANY_CMS_V1',JSON.stringify(clone(seedCms)));render()}};
window.adminExport=()=>{const blob=new Blob([JSON.stringify(cms(),null,2)],{type:'application/json'});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='daekwang-company-cms-export.json';a.click();URL.revokeObjectURL(a.href)};

function render(){ const key=current(); app.innerHTML = key.startsWith('admin') ? adminApp(key) : (isMobile() ? mobileApp(key) : desktopScreen(key)); }
window.go=go; window.addEventListener('hashchange',render); window.addEventListener('resize',render); render();
