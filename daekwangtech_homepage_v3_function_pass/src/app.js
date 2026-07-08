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
function toast(msg){ const el=document.createElement('div'); el.className='ux-toast'; el.textContent=msg; document.body.appendChild(el); requestAnimationFrame(()=>el.classList.add('on')); setTimeout(()=>{el.classList.remove('on'); setTimeout(()=>el.remove(),260)},1700); }

const seedCms = {
  companyInfo:{name:'대광테크 / DAE KWANG TECH', ceo:'이원근 이사', phone:'055-323-7157', mobile:'010-9256-7475', email:'ndh7157@hanmail.net', address:'경남 김해시 한림면 신천리 984', hours:'평일 08:30 - 17:30', intro:'CNC 자동선반 기반 정밀 금속 부품 제조 전문 기업입니다.', founded:'2005년', businessArea:'CNC 자동선반 가공 / 정밀 금속 부품 제조', monthlyCapacity:'120만개+', equipmentCount:'32대+', qualityRate:'99.2%', principle1:'정밀성', principle2:'일관성', principle3:'납기 준수'},
  products:[
    {id:'AUTO-2024-0001', title:'자동차 변속기 밸브 바디', category:'자동차부품', material:'SCM415', process:'CNC 자동선반', tolerance:'±0.005 mm', status:'공개', image:'./public/screens/products.jpg', description:'고정밀 CNC 자동선반 가공을 통해 생산되는 변속기 핵심 부품입니다.'},
    {id:'HYD-2024-0015', title:'유압 블록 카트리지', category:'유압부품', material:'SUS304', process:'복합 가공', tolerance:'Ra 0.4 μm', status:'공개', image:'./public/screens/fields.jpg', description:'고압 유압 시스템에 적용 가능한 내구성 중심 가공품입니다.'},
    {id:'ELEC-2024-0008', title:'전자 커넥터 하우징', category:'전자부품', material:'AL6061', process:'소형 정밀가공', tolerance:'±0.004 mm', status:'공개', image:'./public/screens/home.jpg', description:'전자·전기기기용 소형 정밀 부품입니다.'},
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
function saveCms(data, action='CMS 저장'){ data.audit = [{time:new Date().toLocaleString('ko-KR'), action, actor:'admin'}, ...(data.audit||[])].slice(0,30); localStorage.setItem('DKT_COMPANY_CMS_V1', JSON.stringify(data)); toast(action); render(); }
function cms(){ return loadCms(); }
function isAuthed(){ return localStorage.getItem('DKT_ADMIN_AUTH') === 'ok'; }

const desktopDetails = {
  home: [
    {cls:'home-field-auto', title:'자동차부품', body:'자동차 엔진·구동·안전 계통에 적용되는 고정밀 부품 가공 영역입니다.', img:'products.jpg', target:'fields'},
    {cls:'home-field-hyd', title:'유압부품', body:'고압 내구성과 반복 정밀도가 필요한 유압 시스템 부품 가공 영역입니다.', img:'fields.jpg', target:'fields'},
    {cls:'home-field-elec', title:'전자부품', body:'전자·전기기기용 소형 정밀 부품과 커넥터류 가공 영역입니다.', img:'products.jpg', target:'fields'},
    {cls:'home-field-mass', title:'정밀 양산가공', body:'반복 생산의 품질 일관성과 납기 대응력을 중심으로 운영되는 양산 가공 체계입니다.', img:'home.jpg', target:'fields'},
    {cls:'home-products', title:'제품·가공사례', body:'자동차·유압·전자·정밀 양산가공 사례를 카테고리별로 확인합니다.', img:'products.jpg', target:'products'},
    {cls:'home-process', title:'제조 프로세스', body:'요구 확인부터 도면 검토, 공정 설계, 정밀 가공, 검사, 세척·포장, 납품까지 이어지는 4D 제조 흐름입니다.', img:'home.jpg', target:'fields'},
    {cls:'home-facility', title:'설비현황', body:'CNC 자동선반 라인과 검사·세척·포장 설비가 연결된 생산 환경입니다.', img:'facilities.jpg', target:'facilities'},
    {cls:'home-quality', title:'품질관리', body:'정밀 측정 장비와 검사 프로세스 기반으로 안정적인 품질 지표를 관리합니다.', img:'quality.jpg', target:'quality'},
  ],
  company: [
    {cls:'company-overview', title:'회사 개요', body:'대광테크의 정밀가공 역량, 주요 산업 분야, 품질 운영 원칙을 확인합니다.', img:'company.jpg', target:'company'},
    {cls:'company-fields', title:'주요 산업 분야', body:'자동차·유압·전자·정밀 양산가공 분야별 대응 범위를 확인합니다.', img:'fields.jpg', target:'fields'},
    {cls:'company-process', title:'4D 프로세스', body:'요구 확인, 설계 협의, 가공, 검사, 납품의 운영 흐름을 확인합니다.', img:'company.jpg', target:'fields'},
  ],
  fields: [
    {cls:'fields-category', title:'가공분야', body:'자동차부품, 유압부품, 전자부품, 정밀 양산가공을 분야별로 확인합니다.', img:'fields.jpg', target:'fields'},
    {cls:'fields-samples', title:'가공 샘플', body:'다양한 형상의 정밀 가공 샘플과 적용 분야를 확인합니다.', img:'products.jpg', target:'products'},
    {cls:'fields-process', title:'4D 대응 프로세스', body:'도면 검토부터 검사 및 납품까지 분야별 대응 흐름을 확인합니다.', img:'fields.jpg', target:'quality'},
  ],
  products: [
    {cls:'products-grid', title:'제품 갤러리', body:'제품 이미지를 선택해 주요 소재, 공정, 정밀도, 적용 분야를 확인합니다.', img:'products.jpg', target:'products'},
    {cls:'products-detail', title:'대표 제품 상세', body:'선택된 대표 사례의 가공 특징과 반복 생산 대응 포인트를 확인합니다.', img:'products.jpg', target:'facilities'},
    {cls:'products-material', title:'대응 가능 소재/형상', body:'SCM415, SUS 계열, AL6061, BRASS 등 대응 소재와 형상 범위를 확인합니다.', img:'fields.jpg', target:'fields'},
  ],
  facilities: [
    {cls:'facilities-cards', title:'대표 장비 환경', body:'자동선반 라인, 정밀 측정/검사 장비, 세척·포장 설비를 확인합니다.', img:'facilities.jpg', target:'facilities'},
    {cls:'facilities-flow', title:'4D 공정-설비 연계', body:'도면 검토, 가공 실행, 측정/검사, 세척·포장·출하로 이어지는 설비 운영 흐름입니다.', img:'facilities.jpg', target:'quality'},
    {cls:'facilities-strength', title:'설비 운영 강점', body:'생산 유연성, 정밀도 대응, 작업 안정성, 품질 일관성을 확인합니다.', img:'facilities.jpg', target:'quality'},
  ],
  quality: [
    {cls:'quality-kpi', title:'품질 KPI', body:'합격률, 공정 관리 능력, 납기 준수율, 검사 기록 보관율을 확인합니다.', img:'quality.jpg', target:'quality'},
    {cls:'quality-process', title:'품질 검사 프로세스', body:'수입검사부터 공정검사, 최종검사, 기록 보관, 출하검사까지의 체계를 확인합니다.', img:'quality.jpg', target:'facilities'},
    {cls:'quality-equipment', title:'검사 장비', body:'CMM, 형상 측정기, 표면 조도 측정기, 높이 게이지 등 검사 장비 체계를 확인합니다.', img:'quality.jpg', target:'facilities'},
  ]
};
function detailHotspots(routeKey){
  return (desktopDetails[routeKey]||[]).map((d,i)=>`<button class="detail-hot ${esc(d.cls)}" onclick="openDesktopDetail('${routeKey}',${i})" aria-label="${esc(d.title)} 상세 열기"></button>`).join('');
}
function DetailModal(){
  const raw = localStorage.getItem('DKT_DESKTOP_DETAIL');
  if(!raw) return '';
  let d; try{ d=JSON.parse(raw); }catch{return ''}
  return `<aside class="desktop-detail-backdrop" onclick="closeDesktopDetail()"><section class="desktop-detail-modal" onclick="event.stopPropagation()"><button class="detail-close" onclick="closeDesktopDetail()">×</button><img src="./public/screens/${esc(d.img||'home.jpg')}" alt="${esc(d.title)}"><div><span>DAEKWANG TECH</span><h2>${esc(d.title)}</h2><p>${esc(d.body)}</p><button onclick="closeDesktopDetail();go('${esc(d.target||'company')}')">해당 화면 보기 →</button></div></section></aside>`;
}


function cleanHeader(routeKey){
  const labels = nav.map(key=>`<button class="clean-nav-btn ${key===routeKey?'on':''}" onclick="go('${key}')">${esc(routes[key].label)}</button>`).join('');
  return `<header class="screen-mask clean-live-header" aria-label="대광테크 회사소개 네비게이션">
    <button class="clean-brand" onclick="go('home')"><img src="./public/screens/logo-angular-transparent.png" alt="DAE KWANG TECH"></button>
    <nav>${labels}</nav>
    <button class="clean-header-cta" onclick="go('company')">회사소개 보기 →</button>
  </header>`;
}
function cleanBottomPanel(routeKey){ return ''; }


function desktopScreen(routeKey){
  const r = routes[routeKey] || routes.home;
  const navLinks = nav.map((key,i)=>`<button class="hot nav-hot nav-${i} ${key===routeKey?'on':''}" onclick="go('${key}')" aria-label="${routes[key].label}"></button>`).join('');
  const isHome = routeKey === 'home';
  const index = nav.indexOf(routeKey);
  const cleanCopy = {
    company:['회사정보 보기','정밀가공 역량, 설비, 품질 체계를 한 화면에서 확인하세요.','핵심 경쟁력 보기 →','fields'],
    fields:['가공분야 확인','자동차·유압·전자·정밀 양산가공 대응 범위를 확인하세요.','제품 사례 보기 →','products'],
    products:['제품·가공사례 확인','보유 가공 사례와 반복 생산 대응 역량을 확인하세요.','설비현황 보기 →','facilities'],
    facilities:['설비현황 확인','자동선반 라인과 검사·세척·포장 설비 흐름을 확인하세요.','품질관리 보기 →','quality'],
    quality:['품질관리 확인','검사 프로세스와 품질 지표 중심의 관리 체계를 확인하세요.','회사소개로 이동 →','company']
  }[routeKey];
  return `<main class="screen-wrap company-only-screen route-${routeKey}">
    <img class="exact-screen" src="./public/screens/${r.img}" alt="${r.label} exact screen" />
    ${cleanHeader(routeKey)}
    <div class="screen-mask logo-erase-mask" aria-hidden="true"></div>
    <img class="screen-mask brand-clean-logo" src="./public/screens/logo-angular-transparent.png" alt="DAE KWANG TECH" />
    <div class="screen-mask nav-out-mask" aria-hidden="true"></div>
    <div class="screen-mask top-cta-clean-mask" aria-hidden="true"></div>
    <button class="screen-mask top-company-btn" onclick="go('company')">회사소개 보기 →</button>
    <div class="screen-mask footer-out-mask" aria-hidden="true"></div>
    ${isHome?`<div class="screen-mask home-info-mask clean-panel"><b>대광테크 회사소개</b><span>CNC 자동선반 기반 정밀가공 역량과 설비·품질 체계를 확인하세요.</span><button onclick="go('company')">회사정보 보기 →</button></div>`:''}
    ${cleanCopy?`<div class="screen-mask page-clean-panel clean-panel"><b>${cleanCopy[0]}</b><span>${cleanCopy[1]}</span><button onclick="go('${cleanCopy[3]}')">${cleanCopy[2]}</button></div>`:''}
    ${routeKey==='products'?`<div class="screen-mask product-action-clean-mask" aria-hidden="true"></div><div class="screen-mask product-bottom-action-mask" aria-hidden="true"></div>`:''}
    ${cleanBottomPanel(routeKey)}
    ${navLinks}
    ${detailHotspots(routeKey)}
    <button class="hot cta-hot" onclick="go('company')" aria-label="회사소개 보기"></button>
    ${DetailModal()}
  </main>`;
}

function AdminLogin(){return `<main class="admin-live login-live"><section class="login-card"><div class="login-mark">DK</div><h1>대광테크 관리자 로그인</h1><p>회사소개형 홈페이지 관리 콘솔입니다.</p><label>아이디<input id="login-id" value="admin@daekwang.co.kr" /></label><label>비밀번호<input id="login-pw" type="password" value="demo1234" /></label><button onclick="adminLogin()">로그인</button><button class="ghost" onclick="go('home')">사이트로 돌아가기</button></section></main>`}
function adminLayout(active,title,subtitle,body){return `<main class="admin-live"><aside class="admin-side"><button class="brand" onclick="go('admin/dashboard')"><span>DK</span><b>DAE KWANG TECH</b><small>Company CMS</small></button><nav>${adminNav.map(k=>`<button class="${active===k?'on':''}" onclick="go('${k}')">${routes[k].label}</button>`).join('')}</nav><div class="admin-user"><b>관리자</b><small>localStorage CMS</small><button onclick="adminLogout()">로그아웃</button></div></aside><section class="admin-main"><header class="admin-top"><div><h1>${title}</h1><p>${subtitle}</p></div><div class="admin-top-actions"><button onclick="go('home')">사이트 보기</button><button onclick="adminExport()">JSON 내보내기</button></div></header>${body}</section></main>`}
function statCards(d){return `<div class="admin-stats"><article><small>제품·가공사례</small><b>${d.products.length}</b><span>등록 콘텐츠</span></article><article><small>공개 제품</small><b>${d.products.filter(p=>p.status==='공개').length}</b><span>노출 대상</span></article><article><small>설비 항목</small><b>${d.facilities.length}</b><span>운영 장비</span></article><article><small>품질 KPI</small><b>${d.quality.length}</b><span>관리 지표</span></article><article><small>4D 단계</small><b>${d.flows.length}</b><span>공정 플로우</span></article></div>`}
function AdminDashboard(){const d=cms();return adminLayout('admin/dashboard','대시보드','회사소개형 홈페이지 콘텐츠 상태를 확인합니다.',`${statCards(d)}<div class="admin-grid two"><section class="admin-panel"><h2>최근 활동</h2>${(d.audit||[]).slice(0,8).map(a=>`<div class="activity"><b>${esc(a.action)}</b><small>${esc(a.time)} · ${esc(a.actor)}</small></div>`).join('')}</section><section class="admin-panel"><h2>빠른 실행</h2><div class="quick-grid"><button onclick="go('admin/company')">회사정보 수정</button><button onclick="adminAdd('products')">제품 등록</button><button onclick="go('admin/flow')">4D 플로우 관리</button><button onclick="go('admin/preview')">CMS 미리보기</button></div></section></div>`)}
function AdminCompany(){const d=cms();const c=d.companyInfo;return adminLayout('admin/company','회사정보 관리','회사소개 홈페이지에 표시되는 기본 정보와 핵심 지표를 관리합니다.',`<section class="admin-panel editor"><h2>회사 기본 정보</h2><div class="field-grid"><label>회사명<input id="company-name" value="${esc(c.name)}"></label><label>대표/담당<input id="company-ceo" value="${esc(c.ceo)}"></label><label>대표전화<input id="company-phone" value="${esc(c.phone)}"></label><label>모바일<input id="company-mobile" value="${esc(c.mobile)}"></label><label>이메일<input id="company-email" value="${esc(c.email)}"></label><label>운영시간<input id="company-hours" value="${esc(c.hours)}"></label><label class="span2">주소<input id="company-address" value="${esc(c.address)}"></label><label class="span2">소개문<textarea id="company-intro">${esc(c.intro)}</textarea></label></div><h2>회사소개 핵심 지표</h2><div class="field-grid"><label>설립연도<input id="company-founded" value="${esc(c.founded||'')}"></label><label>사업분야<input id="company-businessArea" value="${esc(c.businessArea||'')}"></label><label>월 생산능력<input id="company-monthlyCapacity" value="${esc(c.monthlyCapacity||'')}"></label><label>설비 보유대수<input id="company-equipmentCount" value="${esc(c.equipmentCount||'')}"></label><label>품질 합격률<input id="company-qualityRate" value="${esc(c.qualityRate||'')}"></label><label>운영원칙 1<input id="company-principle1" value="${esc(c.principle1||'')}"></label><label>운영원칙 2<input id="company-principle2" value="${esc(c.principle2||'')}"></label><label>운영원칙 3<input id="company-principle3" value="${esc(c.principle3||'')}"></label></div><div class="editor-actions"><button onclick="adminSaveCompany()">저장</button></div><p class="admin-note">공개 페이지는 회사소개·가공분야·제품사례·설비·품질 탐색 중심으로 운영합니다. 연락처는 회사 기본 정보로만 관리합니다.</p></section>`)}
function rowStatus(s){return `<span class="status ${s==='공개'?'ok':s==='비공개'?'off':'draft'}">${esc(s)}</span>`}
function productEditor(p){return `<div class="field-grid"><label>제품명<input data-edit="title" value="${esc(p.title)}" /></label><label>코드<input data-edit="id" value="${esc(p.id)}" disabled /></label><label>카테고리<input data-edit="category" value="${esc(p.category)}" /></label><label>상태<select data-edit="status"><option ${p.status==='공개'?'selected':''}>공개</option><option ${p.status==='임시저장'?'selected':''}>임시저장</option><option ${p.status==='비공개'?'selected':''}>비공개</option></select></label><label>소재<input data-edit="material" value="${esc(p.material)}" /></label><label>공정<input data-edit="process" value="${esc(p.process)}" /></label><label>정밀도<input data-edit="tolerance" value="${esc(p.tolerance)}" /></label><label>이미지 경로<input data-edit="image" value="${esc(p.image)}" /></label><label class="span2">설명<textarea data-edit="description">${esc(p.description)}</textarea></label></div><img class="editor-preview" src="${esc(p.image)}"><div class="editor-actions"><button onclick="adminSaveProduct('${p.id}')">저장</button><button class="ghost" onclick="adminDuplicateProduct('${p.id}')">복제</button><button class="danger" onclick="adminDelete('products','${p.id}')">삭제</button></div>`}
function AdminProducts(){const d=cms();const q=localStorage.getItem('DKT_PRODUCT_QUERY')||'';const status=localStorage.getItem('DKT_PRODUCT_STATUS')||'전체';const selected=d.products.find(p=>p.id===localStorage.getItem('DKT_SELECTED_PRODUCT')) || d.products[0];const filtered=d.products.filter(p=>(status==='전체'||p.status===status)&&[p.title,p.id,p.category,p.material,p.process].join(' ').includes(q));return adminLayout('admin/products','제품·가공사례 관리','검색, 필터, 등록, 수정, 삭제, 발행 상태를 관리합니다.',`${statCards(d)}<div class="admin-grid editor-grid"><section class="admin-panel"><div class="panel-head"><h2>제품 목록</h2><button onclick="adminAdd('products')">+ 신규 등록</button></div><div class="admin-toolbar"><input placeholder="제품명/코드/소재 검색" value="${esc(q)}" oninput="adminFilterProducts(this.value)"><select onchange="adminStatusFilter(this.value)"><option ${status==='전체'?'selected':''}>전체</option><option ${status==='공개'?'selected':''}>공개</option><option ${status==='임시저장'?'selected':''}>임시저장</option><option ${status==='비공개'?'selected':''}>비공개</option></select></div><div class="admin-table">${filtered.map(p=>`<button class="table-row ${selected&&selected.id===p.id?'on':''}" onclick="adminSelectProduct('${p.id}')"><img src="${esc(p.image)}" /><span><b>${esc(p.title)}</b><small>${esc(p.id)} · ${esc(p.category)}</small></span><em>${esc(p.material)}</em>${rowStatus(p.status)}</button>`).join('') || '<p class="admin-note">검색 결과가 없습니다.</p>'}</div></section><section class="admin-panel editor"><h2>제품 편집</h2>${selected?productEditor(selected):'<p>제품을 선택하세요.</p>'}</section></div>`)}
function AdminFacilities(){const d=cms();return adminLayout('admin/facilities','설비현황 관리','설비 항목을 추가, 수정, 삭제합니다.',`<section class="admin-panel"><div class="panel-head"><h2>설비 목록</h2><button onclick="adminAdd('facilities')">+ 설비 추가</button></div><div class="facility-list">${d.facilities.map(f=>`<article><img src="${esc(f.image)}"><div><b>${esc(f.name)}</b><small>${esc(f.type)} · ${esc(f.status)}</small><p>${esc(f.spec)}</p></div><div class="row-actions"><button onclick="adminEditFacility('${f.id}')">수정</button><button class="danger" onclick="adminDelete('facilities','${f.id}')">삭제</button></div></article>`).join('')}</div></section>`)}
function AdminQuality(){const d=cms();return adminLayout('admin/quality','품질관리 KPI','품질 지표 값을 수정합니다.',`<section class="admin-panel"><h2>품질 KPI</h2><div class="kpi-edit">${d.quality.map(q=>`<article><label>라벨<input id="q-label-${q.id}" value="${esc(q.label)}"></label><label>값<input id="q-value-${q.id}" value="${esc(q.value)}"></label><label>노트<input id="q-note-${q.id}" value="${esc(q.note)}"></label><button onclick="adminSaveQuality('${q.id}')">저장</button></article>`).join('')}</div></section>`)}
function AdminFlow(){const d=cms();return adminLayout('admin/flow','4D 플로우 관리','공정 흐름 단계를 관리합니다.',`<section class="admin-panel"><div class="panel-head"><h2>플로우 단계</h2><button onclick="adminAdd('flows')">+ 단계 추가</button></div><div class="flow-edit">${d.flows.map((f,i)=>`<article><em>${String(i+1).padStart(2,'0')}</em><label>단계명<input id="flow-title-${f.id}" value="${esc(f.title)}"></label><label>설명<input id="flow-body-${f.id}" value="${esc(f.body)}"></label><button onclick="adminSaveFlow('${f.id}')">저장</button><button class="danger" onclick="adminDelete('flows','${f.id}')">삭제</button></article>`).join('')}</div></section>`)}
function AdminPreview(){const d=cms();return adminLayout('admin/preview','CMS 미리보기','관리 데이터가 모바일/관리자 미리보기로 반영되는지 확인합니다.',`<div class="admin-grid two"><section class="admin-panel"><h2>제품 미리보기</h2><div class="preview-cards">${d.products.filter(p=>p.status==='공개').map(p=>`<article><img src="${esc(p.image)}"><b>${esc(p.title)}</b><small>${esc(p.category)} · ${esc(p.material)}</small><p>${esc(p.description)}</p></article>`).join('')}</div></section><section class="admin-panel"><h2>회사정보 미리보기</h2><div class="contact-preview company-preview"><b>${esc(d.companyInfo.name)}</b><p>${esc(d.companyInfo.intro)}</p><div class="preview-metrics"><span>월 생산능력 <b>${esc(d.companyInfo.monthlyCapacity||'-')}</b></span><span>설비 <b>${esc(d.companyInfo.equipmentCount||'-')}</b></span><span>품질 <b>${esc(d.companyInfo.qualityRate||'-')}</b></span></div><small>${esc(d.companyInfo.businessArea||'')}</small><small>${esc(d.companyInfo.address)}</small></div><h2>4D 플로우</h2><div class="mini-flow">${d.flows.map((f,i)=>`<span>${i+1}. ${esc(f.title)}</span>`).join('')}</div></section></div>`)}
function AdminSettings(){return adminLayout('admin/settings','설정','로컬 CMS 데이터 초기화/내보내기를 관리합니다.',`<section class="admin-panel"><h2>데이터 관리</h2><p>현재 버전은 브라우저 localStorage 기반 CMS입니다. 새로고침 후에도 데이터가 유지됩니다.</p><div class="quick-grid"><button onclick="adminExport()">JSON 내보내기</button><button class="danger" onclick="adminReset()">초기 데이터로 리셋</button></div><pre class="json-preview">${esc(JSON.stringify(cms(),null,2)).slice(0,2400)}</pre></section>`)}
function adminApp(routeKey){ if(!isAuthed() && routeKey!=='admin/login') return AdminLogin(); if(routeKey==='admin/login') return AdminLogin(); if(routeKey==='admin/company') return AdminCompany(); if(routeKey==='admin/products'||routeKey==='admin/content') return AdminProducts(); if(routeKey==='admin/facilities') return AdminFacilities(); if(routeKey==='admin/quality') return AdminQuality(); if(routeKey==='admin/flow') return AdminFlow(); if(routeKey==='admin/preview') return AdminPreview(); if(routeKey==='admin/settings') return AdminSettings(); return AdminDashboard(); }

const productCards = [['자동차부품','고정밀·고신뢰성 부품','./public/screens/products.jpg'],['유압부품','고압 내구성 정밀 가공','./public/screens/fields.jpg'],['전자부품','소형 정밀부품 대응','./public/screens/home.jpg'],['정밀 양산가공','반복 생산 공정 안정화','./public/screens/quality.jpg']];
function MobileTop(){return `<header class="m-top"><button onclick="go('home')"><img src="./public/screens/home.jpg" alt="logo" /></button><strong>DAE KWANG TECH</strong><button class="m-top-link" onclick="go('company')">회사정보</button></header>`}
function Bottom(active){return `<nav class="m-bottom">${[['home','홈'],['fields','가공'],['products','제품'],['facilities','설비'],['quality','품질']].map(([k,l])=>`<button class="${active===k?'on':''}" onclick="go('${k}')"><i>${{home:'⌂',fields:'◆',products:'▦',facilities:'▣',quality:'✓'}[k]}</i><span>${l}</span></button>`).join('')}</nav>`}
function MobileCompany(){const d=cms();const c=d.companyInfo;return `${MobileTop()}<main class="mobile-app"><section class="m-title"><span>COMPANY PROFILE</span><h1>정밀함과 신뢰로,<br><mark>최상의 제품</mark>을 만듭니다.</h1><p>${esc(c.intro)}</p></section><section class="m-card"><div class="m-head"><b>회사 개요</b><span>PROFILE</span></div><ul class="m-info-list"><li><b>회사명</b><span>${esc(c.name)}</span></li><li><b>사업분야</b><span>${esc(c.businessArea||'CNC 자동선반 가공')}</span></li><li><b>설립연도</b><span>${esc(c.founded||'-')}</span></li><li><b>주소</b><span>${esc(c.address)}</span></li></ul></section><section class="m-card"><div class="m-head"><b>핵심 지표</b><span>CAPABILITY</span></div><div class="m-kpi quality"><b><small>월 생산</small>${esc(c.monthlyCapacity||'-')}</b><b><small>설비</small>${esc(c.equipmentCount||'-')}</b><b><small>품질</small>${esc(c.qualityRate||'-')}</b><b><small>운영</small>${esc(c.principle1||'정밀성')}</b></div></section>${Flow('회사 운영 4D 프로세스',['요구 확인','도면 검토','공정 설계','가공/검사','출하 관리'])}</main><button class="m-sticky" onclick="go('fields')">가공분야 보기</button>${Bottom('home')}`}
function Flow(title='4D 제조 플로우', list=cms().flows.map(f=>f.title)){return `<section class="m-card"><div class="m-head"><b>${title}</b><span>PROCESS</span></div><div class="m-flow">${list.map((s,i)=>`<div><em>${String(i+1).padStart(2,'0')}</em><b>${esc(s)}</b><small>${i<list.length-1?'→':'✓'}</small></div>`).join('')}</div></section>`}
function MobileHome(){const d=cms();return `${MobileTop()}<main class="mobile-app"><section class="m-hero"><span>CNC 자동선반 전문 가공업체</span><h1>정밀함이 만드는 차이,<br><mark>제조 경쟁력</mark>입니다.</h1><p>${esc(d.companyInfo.intro)}</p><div class="m-kpi"><b><small>월 생산</small>${esc(d.companyInfo.monthlyCapacity||'120만+')}</b><b><small>설비</small>${esc(d.companyInfo.equipmentCount||'32대+')}</b><b><small>품질</small>${esc(d.companyInfo.qualityRate||'99.2%')}</b></div></section><section class="m-actions"><button onclick="go('company')">회사소개</button><button onclick="go('products')">제품 보기</button><button onclick="go('facilities')">설비 현황</button></section>${Flow()}<section class="m-card"><div class="m-head"><b>가공분야</b><button onclick="go('fields')">전체</button></div><div class="m-feed">${productCards.slice(0,3).map(([t,desc,img])=>`<article onclick="go('fields')"><img src="${img}"><div><b>${t}</b><p>${desc}</p><span>상세 열기 →</span></div></article>`).join('')}</div></section></main><button class="m-sticky" onclick="go('company')">회사정보 보기</button>${Bottom('home')}`}
function MobileFields(){const active=localStorage.getItem('DKT_FIELD_SEG')||'자동차부품';const [title,desc,img]=productCards.find(p=>p[0]===active)||productCards[0];return `${MobileTop()}<main class="mobile-app"><section class="m-title"><span>MACHINING FIELDS</span><h1>정밀 가공의 모든 분야</h1></section><div class="m-segments">${productCards.map(([t])=>`<button class="${active===t?'on':''}" onclick="mobileSetField('${t}')">${t.replace('부품','')}</button>`).join('')}</div><section class="m-card visual"><img src="${img}"><b>${title} 가공</b><p>${desc}. 복잡 형상, 고정도 치수, 반복 생산을 위한 공정 설계를 지원합니다.</p></section>${Flow('4D 대응 프로세스',['요구 확인','소재 검토','공정 설계','가공','검사'])}</main><button class="m-sticky" onclick="go('products')">제품 사례 보기</button>${Bottom('fields')}`}
function MobileProducts(){const d=cms();const active=localStorage.getItem('DKT_PRODUCT_SEG')||'전체';const items=d.products.filter(p=>active==='전체'||p.category===active);const selected=d.products.find(p=>p.id===localStorage.getItem('DKT_MOBILE_PRODUCT'));return `${MobileTop()}<main class="mobile-app"><section class="m-title"><span>PRODUCT CASE</span><h1>제품·가공사례</h1></section><div class="m-segments">${['전체','자동차부품','유압부품','전자부품','정밀 양산가공'].map(k=>`<button class="${active===k?'on':''}" onclick="mobileSetProductFilter('${k}')">${k==='전체'?'전체':k.replace('부품','')}</button>`).join('')}</div><section class="m-feed products">${items.map(p=>`<article onclick="mobileOpenProduct('${p.id}')"><img src="${esc(p.image)}"><div><b>${esc(p.title)}</b><p>${esc(p.material)} · ${esc(p.process)} · ${esc(p.tolerance)}</p><span>${esc(p.status)} · 상세 정보 보기 →</span></div></article>`).join('')}</section></main>${selected?`<aside class="mobile-sheet"><button class="sheet-close" onclick="mobileCloseSheet()">×</button><img src="${esc(selected.image)}"><b>${esc(selected.title)}</b><p>${esc(selected.description)}</p><div><span>${esc(selected.material)}</span><span>${esc(selected.process)}</span><span>${esc(selected.tolerance)}</span></div><button onclick="go('facilities')">관련 설비 보기</button></aside>`:''}<button class="m-sticky" onclick="go('facilities')">설비·품질 보기</button>${Bottom('products')}`}
function MobileFacilities(){const d=cms();return `${MobileTop()}<main class="mobile-app"><section class="m-title"><span>EQUIPMENT</span><h1>자동선반 기반 정밀 가공 환경</h1></section><section class="m-card visual"><img src="./public/screens/facilities.jpg"><b>대표 장비 환경</b><p>가공·검사·세척·포장 공정을 안정적으로 운영합니다.</p></section><section class="m-feed">${d.facilities.map(f=>`<article onclick="toast('${esc(f.name)} 확인')"><img src="${esc(f.image)}"><div><b>${esc(f.name)}</b><p>${esc(f.spec)}</p><span>${esc(f.status)}</span></div></article>`).join('')}</section>${Flow('4D 공정-설비 연계',['도면 검토','가공 실행','측정/검사','세척/포장','출하'])}</main><button class="m-sticky" onclick="go('quality')">품질관리 보기</button>${Bottom('facilities')}`}
function MobileQuality(){const d=cms();return `${MobileTop()}<main class="mobile-app"><section class="m-title"><span>QUALITY</span><h1>품질관리 체계</h1></section><section class="m-card visual"><img src="./public/screens/quality.jpg"><b>정밀 측정 기반 품질관리</b><p>검사 프로세스와 품질 데이터를 기반으로 안정적인 생산 품질을 유지합니다.</p></section><section class="m-card"><div class="m-head"><b>품질 KPI</b><span>MONTHLY</span></div><div class="m-kpi quality">${d.quality.map(q=>`<b><small>${esc(q.label)}</small>${esc(q.value)}</b>`).join('')}</div></section>${Flow('품질 검사 프로세스',['수입검사','공정검사','자주검사','최종검사','출하검사'])}</main><button class="m-sticky" onclick="go('home')">홈으로 이동</button>${Bottom('quality')}`}
function mobileApp(routeKey){ if(routeKey==='company') return MobileCompany(); if(routeKey==='fields') return MobileFields(); if(routeKey==='products') return MobileProducts(); if(routeKey==='facilities') return MobileFacilities(); if(routeKey==='quality') return MobileQuality(); return MobileHome(); }

window.adminLogin=()=>{localStorage.setItem('DKT_ADMIN_AUTH','ok');toast('로그인 완료');go('admin/dashboard')};
window.adminLogout=()=>{localStorage.removeItem('DKT_ADMIN_AUTH');toast('로그아웃');go('admin/login')};
window.adminSelectProduct=(id)=>{localStorage.setItem('DKT_SELECTED_PRODUCT',id);render()};
window.adminFilterProducts=(q)=>{localStorage.setItem('DKT_PRODUCT_QUERY',q);render()};
window.adminStatusFilter=(s)=>{localStorage.setItem('DKT_PRODUCT_STATUS',s);render()};
window.adminAdd=(type)=>{const d=cms();if(type==='products'){const id='NEW-'+Date.now();d.products.unshift({id,title:'신규 가공품',category:'정밀 양산가공',material:'SCM415',process:'CNC 자동선반',tolerance:'±0.005 mm',status:'임시저장',image:'./public/screens/products.jpg',description:'신규 등록 제품 설명'});localStorage.setItem('DKT_SELECTED_PRODUCT',id);saveCms(d,'제품 신규 등록');go('admin/products')}if(type==='facilities'){d.facilities.unshift({id:'EQ-'+Date.now(),name:'신규 설비',type:'가공',status:'가동',spec:'설비 스펙 입력',image:'./public/screens/facilities.jpg'});saveCms(d,'설비 신규 등록')}if(type==='flows'){d.flows.push({id:'F-'+Date.now(),title:'신규 단계',body:'단계 설명'});saveCms(d,'4D 단계 추가')}};
window.adminSaveProduct=(id)=>{const d=cms();const p=d.products.find(x=>x.id===id);if(!p)return;document.querySelectorAll('[data-edit]').forEach(el=>{const k=el.dataset.edit;if(k!=='id')p[k]=el.value});saveCms(d,'제품 수정: '+p.title)};
window.adminDuplicateProduct=(id)=>{const d=cms();const p=d.products.find(x=>x.id===id);if(!p)return;const np={...p,id:'COPY-'+Date.now(),title:p.title+' 복제',status:'임시저장'};d.products.unshift(np);localStorage.setItem('DKT_SELECTED_PRODUCT',np.id);saveCms(d,'제품 복제')};
window.adminDelete=(type,id)=>{if(!confirm('삭제할까요?'))return;const d=cms();d[type]=d[type].filter(x=>x.id!==id);saveCms(d,`${type} 삭제: ${id}`)};
window.adminEditFacility=(id)=>{const d=cms();const f=d.facilities.find(x=>x.id===id);if(!f)return;const name=prompt('설비명',f.name);if(name===null)return;const spec=prompt('스펙',f.spec);if(spec===null)return;f.name=name;f.spec=spec;saveCms(d,'설비 수정: '+name)};
window.adminSaveQuality=(id)=>{const d=cms();const q=d.quality.find(x=>x.id===id);if(!q)return;q.label=document.getElementById('q-label-'+id).value;q.value=document.getElementById('q-value-'+id).value;q.note=document.getElementById('q-note-'+id).value;saveCms(d,'품질 KPI 수정: '+q.label)};
window.adminSaveCompany=()=>{const d=cms();d.companyInfo={name:document.getElementById('company-name').value,ceo:document.getElementById('company-ceo').value,phone:document.getElementById('company-phone').value,mobile:document.getElementById('company-mobile').value,email:document.getElementById('company-email').value,address:document.getElementById('company-address').value,hours:document.getElementById('company-hours').value,intro:document.getElementById('company-intro').value,founded:document.getElementById('company-founded').value,businessArea:document.getElementById('company-businessArea').value,monthlyCapacity:document.getElementById('company-monthlyCapacity').value,equipmentCount:document.getElementById('company-equipmentCount').value,qualityRate:document.getElementById('company-qualityRate').value,principle1:document.getElementById('company-principle1').value,principle2:document.getElementById('company-principle2').value,principle3:document.getElementById('company-principle3').value};saveCms(d,'회사정보/핵심지표 수정')};
window.adminSaveFlow=(id)=>{const d=cms();const f=d.flows.find(x=>x.id===id);if(!f)return;f.title=document.getElementById('flow-title-'+id).value;f.body=document.getElementById('flow-body-'+id).value;saveCms(d,'4D 플로우 수정: '+f.title)};
window.adminReset=()=>{if(confirm('초기 데이터로 리셋할까요?')){localStorage.setItem('DKT_COMPANY_CMS_V1',JSON.stringify(clone(seedCms)));toast('초기화 완료');render()}};
window.adminExport=()=>{const blob=new Blob([JSON.stringify(cms(),null,2)],{type:'application/json'});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='daekwang-company-cms-export.json';a.click();URL.revokeObjectURL(a.href);toast('JSON 내보내기 완료')};
window.mobileSetField=(v)=>{localStorage.setItem('DKT_FIELD_SEG',v);render()};
window.mobileSetProductFilter=(v)=>{localStorage.setItem('DKT_PRODUCT_SEG',v);localStorage.removeItem('DKT_MOBILE_PRODUCT');render()};
window.mobileOpenProduct=(id)=>{localStorage.setItem('DKT_MOBILE_PRODUCT',id);render()};
window.mobileCloseSheet=()=>{localStorage.removeItem('DKT_MOBILE_PRODUCT');render()};
window.openDesktopDetail=(routeKey,i)=>{const d=(desktopDetails[routeKey]||[])[i]; if(!d)return; localStorage.setItem('DKT_DESKTOP_DETAIL', JSON.stringify(d)); render();};
window.closeDesktopDetail=()=>{localStorage.removeItem('DKT_DESKTOP_DETAIL'); render();};

function render(){ const key=current(); app.innerHTML = key.startsWith('admin') ? adminApp(key) : (isMobile() ? mobileApp(key) : desktopScreen(key)); }
window.go=go; window.toast=toast; window.addEventListener('hashchange',render); window.addEventListener('resize',render); render();

/* CT-G1~G8 FEATURE UPGRADE / UX ADVANCEMENT PATCH
   Scope: premium function upgrade while preserving company-only policy.
   Adds command palette, keyboard navigation, admin ops center, content health, backups/import, bulk actions, mobile gestures.
*/
var DKT_UPGRADE_VERSION = 'CT-G ADVANCED UX 2026-07-06';
if (typeof routes !== 'undefined') {
  routes['admin/ops'] = {label:'운영고도화', admin:true};
  if (!adminNav.includes('admin/ops')) adminNav.splice(1,0,'admin/ops');
}

function normalizeCms(data){
  const base = clone(seedCms);
  const d = data && typeof data === 'object' ? data : {};
  const merged = {
    ...base,
    ...d,
    companyInfo: {...base.companyInfo, ...(d.companyInfo||{})},
    products: Array.isArray(d.products) ? d.products : base.products,
    facilities: Array.isArray(d.facilities) ? d.facilities : base.facilities,
    quality: Array.isArray(d.quality) ? d.quality : base.quality,
    flows: Array.isArray(d.flows) ? d.flows : base.flows,
    audit: Array.isArray(d.audit) ? d.audit : base.audit,
    backups: Array.isArray(d.backups) ? d.backups.slice(0,8) : [],
    meta: {...(d.meta||{}), version: DKT_UPGRADE_VERSION || 'CT-G ADVANCED UX'}
  };
  merged.ops = {...(d.ops||{}), lastLoadedAt: new Date().toLocaleString('ko-KR')};
  return merged;
}
function loadCms(){
  try { return normalizeCms(JSON.parse(localStorage.getItem('DKT_COMPANY_CMS_V1'))); }
  catch { return normalizeCms(clone(seedCms)); }
}
function snapshotSlim(d){
  const s = normalizeCms(d);
  s.backups = [];
  return s;
}
function saveCms(data, action='CMS 저장'){
  const previousRaw = localStorage.getItem('DKT_COMPANY_CMS_V1');
  let previous = null;
  try { previous = previousRaw ? snapshotSlim(JSON.parse(previousRaw)) : null; } catch { previous = null; }
  const normalized = normalizeCms(data);
  if (previous) {
    normalized.backups = [{id:'BK-'+Date.now(), time:new Date().toLocaleString('ko-KR'), label:action, payload:previous}, ...(normalized.backups||[])].slice(0,8);
  }
  normalized.audit = [{time:new Date().toLocaleString('ko-KR'), action, actor:'admin'}, ...(normalized.audit||[])].slice(0,50);
  normalized.ops = {...(normalized.ops||{}), lastSavedAt:new Date().toLocaleString('ko-KR'), lastAction:action};
  localStorage.setItem('DKT_COMPANY_CMS_V1', JSON.stringify(normalized));
  toast(action);
  render();
}
function cmsHealth(d=cms()){
  const checks = [
    {key:'company', label:'회사정보', ok:!!(d.companyInfo.name && d.companyInfo.intro && d.companyInfo.businessArea)},
    {key:'products', label:'제품 공개', ok:d.products.filter(p=>p.status==='공개').length >= 3},
    {key:'facilities', label:'설비 정보', ok:d.facilities.length >= 3},
    {key:'quality', label:'품질 KPI', ok:d.quality.length >= 4},
    {key:'flows', label:'4D 플로우', ok:d.flows.length >= 5},
    {key:'policy', label:'회사소개 정책', ok:!location.hash.includes('contact')},
  ];
  const score = Math.round(checks.filter(c=>c.ok).length / checks.length * 100);
  return {score, checks};
}
function readinessBadge(score){
  return score >= 90 ? 'SSS' : score >= 75 ? 'PASS' : score >= 55 ? 'CHECK' : 'HOLD';
}
function adminLayout(active,title,subtitle,body){
  const d = cms();
  const h = cmsHealth(d);
  return `<main class="admin-live upgraded-admin"><aside class="admin-side"><button class="brand" onclick="go('admin/dashboard')"><span>DK</span><b>DAE KWANG TECH</b><small>Company CMS Pro</small></button><nav>${adminNav.map(k=>`<button class="${active===k?'on':''}" onclick="go('${k}')">${routes[k].label}</button>`).join('')}</nav><div class="admin-user"><b>관리자</b><small>${esc(readinessBadge(h.score))} · ${h.score}% ready</small><button onclick="adminLogout()">로그아웃</button></div></aside><section class="admin-main"><header class="admin-top"><div><h1>${title}</h1><p>${subtitle}</p></div><div class="admin-top-actions"><button onclick="openCommandPalette()">⌘ 기능검색</button><button onclick="go('admin/ops')">운영고도화</button><button onclick="go('home')">사이트 보기</button><button onclick="adminExport()">JSON 내보내기</button></div></header><section class="admin-system-bar"><div><small>운영 준비도</small><b>${h.score}% · ${readinessBadge(h.score)}</b></div><div><small>제품</small><b>${d.products.length}개 / 공개 ${d.products.filter(p=>p.status==='공개').length}</b></div><div><small>저장</small><b>${esc(d.ops?.lastSavedAt||'대기')}</b></div><div><small>백업</small><b>${(d.backups||[]).length}개</b></div></section>${body}</section></main>${CommandPalette()}`;
}
function AdminDashboard(){
  const d=cms(); const h=cmsHealth(d);
  return adminLayout('admin/dashboard','대시보드','회사소개형 홈페이지 콘텐츠 상태와 운영 품질을 한 번에 점검합니다.',`${statCards(d)}<div class="admin-grid two"><section class="admin-panel readiness-panel"><div class="panel-head"><h2>운영 준비도</h2><b class="score-ring">${h.score}%</b></div><div class="health-list">${h.checks.map(c=>`<span class="${c.ok?'ok':'hold'}"><b>${c.ok?'PASS':'HOLD'}</b>${esc(c.label)}</span>`).join('')}</div></section><section class="admin-panel"><h2>빠른 실행</h2><div class="quick-grid upgraded"><button onclick="go('admin/company')">회사정보 수정</button><button onclick="adminAdd('products')">제품 등록</button><button onclick="go('admin/ops')">운영 점검</button><button onclick="adminCreateBackup()">백업 생성</button><button onclick="go('admin/preview')">CMS 미리보기</button><button onclick="openCommandPalette()">기능 검색</button></div></section></div><div class="admin-grid two"><section class="admin-panel"><h2>최근 활동</h2>${(d.audit||[]).slice(0,10).map(a=>`<div class="activity"><b>${esc(a.action)}</b><small>${esc(a.time)} · ${esc(a.actor)}</small></div>`).join('')}</section><section class="admin-panel"><h2>콘텐츠 품질 메모</h2><div class="ops-note"><b>회사소개형 고정</b><p>Public 메뉴는 회사소개/가공/제품/설비/품질 중심으로 유지됩니다. 수집형 화면은 제거 상태를 유지합니다.</p></div><div class="ops-note"><b>Desktop Exact + Mobile App</b><p>데스크탑은 이미지 기반 exact 화면, 모바일은 CMS 데이터가 반영되는 앱 UI입니다.</p></div></section></div>`)
}
function AdminOps(){
  const d=cms(); const h=cmsHealth(d);
  return adminLayout('admin/ops','운영고도화 센터','데이터 품질, 백업, 일괄 발행, 검증을 관리합니다.',`<div class="admin-grid two"><section class="admin-panel"><div class="panel-head"><h2>품질 게이트</h2><b class="score-ring">${h.score}%</b></div><div class="health-list large">${h.checks.map(c=>`<span class="${c.ok?'ok':'hold'}"><b>${c.ok?'PASS':'HOLD'}</b>${esc(c.label)}</span>`).join('')}</div><div class="editor-actions"><button onclick="adminValidate()">검증 실행</button><button onclick="adminCreateBackup()">현재 상태 백업</button><button class="ghost" onclick="adminUndo()">직전 백업 복구</button></div></section><section class="admin-panel"><h2>제품 일괄 관리</h2><p class="admin-note">필터/검색 후 개별 수정이 가능하며, 아래 버튼은 전체 제품 상태를 일괄 변경합니다.</p><div class="quick-grid"><button onclick="adminBulkStatus('공개')">전체 공개</button><button onclick="adminBulkStatus('임시저장')">전체 임시저장</button><button onclick="adminBulkStatus('비공개')">전체 비공개</button><button onclick="go('admin/products')">제품 편집으로 이동</button></div></section></div><div class="admin-grid two"><section class="admin-panel"><h2>백업 목록</h2><div class="backup-list">${(d.backups||[]).map(b=>`<article><div><b>${esc(b.label)}</b><small>${esc(b.time)} · ${esc(b.id)}</small></div><button onclick="adminRestoreBackup('${esc(b.id)}')">복구</button></article>`).join('') || '<p class="admin-note">아직 백업이 없습니다.</p>'}</div></section><section class="admin-panel"><h2>JSON 가져오기</h2><p class="admin-note">내보낸 CMS JSON 파일을 다시 불러올 수 있습니다. 로컬 납품형 유지보수용 기능입니다.</p><input class="file-import" type="file" accept="application/json" onchange="adminImportFile(event)"><div class="editor-actions"><button onclick="adminExport()">JSON 내보내기</button><button class="danger" onclick="adminReset()">초기화</button></div></section></div>`)
}
function AdminSettings(){
  const d=cms();
  return adminLayout('admin/settings','설정','로컬 CMS 데이터 초기화, 백업, 가져오기/내보내기를 관리합니다.',`<section class="admin-panel"><h2>데이터 관리</h2><p>현재 버전은 브라우저 localStorage 기반 회사소개 CMS입니다. 실제 DB/인증 연동은 별도 운영 CT에서 진행합니다.</p><div class="quick-grid"><button onclick="adminCreateBackup()">백업 생성</button><button onclick="adminExport()">JSON 내보내기</button><button onclick="adminValidate()">검증 실행</button><button class="danger" onclick="adminReset()">초기화</button></div><h2>JSON 가져오기</h2><input class="file-import" type="file" accept="application/json" onchange="adminImportFile(event)"></section><section class="admin-panel"><h2>백업</h2><div class="backup-list">${(d.backups||[]).map(b=>`<article><div><b>${esc(b.label)}</b><small>${esc(b.time)} · ${esc(b.id)}</small></div><button onclick="adminRestoreBackup('${esc(b.id)}')">복구</button></article>`).join('') || '<p class="admin-note">백업 없음</p>'}</div></section>`)
}
function AdminProducts(){
  const d=cms();const q=localStorage.getItem('DKT_PRODUCT_QUERY')||'';const status=localStorage.getItem('DKT_PRODUCT_STATUS')||'전체';const selected=d.products.find(p=>p.id===localStorage.getItem('DKT_SELECTED_PRODUCT')) || d.products[0];const filtered=d.products.filter(p=>(status==='전체'||p.status===status)&&[p.title,p.id,p.category,p.material,p.process].join(' ').includes(q));
  return adminLayout('admin/products','제품·가공사례 관리','검색, 필터, 등록, 수정, 삭제, 발행 상태를 관리합니다.',`${statCards(d)}<div class="admin-grid editor-grid"><section class="admin-panel"><div class="panel-head"><h2>제품 목록</h2><button onclick="adminAdd('products')">+ 신규 등록</button></div><div class="admin-toolbar"><input placeholder="제품명/코드/소재 검색" value="${esc(q)}" oninput="adminFilterProducts(this.value)"><select onchange="adminStatusFilter(this.value)"><option ${status==='전체'?'selected':''}>전체</option><option ${status==='공개'?'selected':''}>공개</option><option ${status==='임시저장'?'selected':''}>임시저장</option><option ${status==='비공개'?'selected':''}>비공개</option></select></div><div class="bulk-actions"><button onclick="adminBulkStatus('공개')">전체 공개</button><button onclick="adminBulkStatus('임시저장')">전체 임시저장</button><button onclick="adminValidate()">품질 점검</button></div><div class="admin-table">${filtered.map(p=>`<button class="table-row ${selected&&selected.id===p.id?'on':''}" onclick="adminSelectProduct('${p.id}')"><img src="${esc(p.image)}" /><span><b>${esc(p.title)}</b><small>${esc(p.id)} · ${esc(p.category)}</small></span><em>${esc(p.material)}</em>${rowStatus(p.status)}</button>`).join('') || '<p class="admin-note">검색 결과가 없습니다.</p>'}</div></section><section class="admin-panel editor"><h2>제품 편집</h2>${selected?productEditor(selected):'<p>제품을 선택하세요.</p>'}</section></div>`)
}
function AdminPreview(){
  const d=cms(); const h=cmsHealth(d);
  return adminLayout('admin/preview','CMS 미리보기','관리 데이터가 모바일/관리자 미리보기로 반영되는지 확인합니다.',`<div class="preview-switch"><button onclick="go('home')">Desktop Exact 보기</button><button onclick="localStorage.setItem('DKT_FORCE_MOBILE_HINT','1');toast('브라우저 폭 390px로 확인하세요')">Mobile App 확인</button><button onclick="go('admin/ops')">운영 점검</button></div><div class="admin-grid two"><section class="admin-panel"><div class="panel-head"><h2>제품 미리보기</h2><b>${d.products.filter(p=>p.status==='공개').length} 공개</b></div><div class="preview-cards">${d.products.filter(p=>p.status==='공개').map(p=>`<article><img src="${esc(p.image)}"><b>${esc(p.title)}</b><small>${esc(p.category)} · ${esc(p.material)}</small><p>${esc(p.description)}</p></article>`).join('')}</div></section><section class="admin-panel"><h2>회사정보 미리보기</h2><div class="contact-preview company-preview"><b>${esc(d.companyInfo.name)}</b><p>${esc(d.companyInfo.intro)}</p><div class="preview-metrics"><span>월 생산능력 <b>${esc(d.companyInfo.monthlyCapacity||'-')}</b></span><span>설비 <b>${esc(d.companyInfo.equipmentCount||'-')}</b></span><span>품질 <b>${esc(d.companyInfo.qualityRate||'-')}</b></span></div><small>${esc(d.companyInfo.businessArea||'')}</small><small>${esc(d.companyInfo.address)}</small></div><h2>운영 준비도</h2><div class="mini-health"><b>${h.score}%</b><span>${readinessBadge(h.score)}</span></div><h2>4D 플로우</h2><div class="mini-flow">${d.flows.map((f,i)=>`<span>${i+1}. ${esc(f.title)}</span>`).join('')}</div></section></div>`)
}
function adminApp(routeKey){ if(!isAuthed() && routeKey!=='admin/login') return AdminLogin(); if(routeKey==='admin/login') return AdminLogin(); if(routeKey==='admin/company') return AdminCompany(); if(routeKey==='admin/products'||routeKey==='admin/content') return AdminProducts(); if(routeKey==='admin/facilities') return AdminFacilities(); if(routeKey==='admin/quality') return AdminQuality(); if(routeKey==='admin/flow') return AdminFlow(); if(routeKey==='admin/preview') return AdminPreview(); if(routeKey==='admin/settings') return AdminSettings(); if(routeKey==='admin/ops') return AdminOps(); return AdminDashboard(); }
function CommandPalette(){
  if(localStorage.getItem('DKT_COMMAND_OPEN')!=='1') return '';
  const items=[['home','홈'],['company','회사소개'],['fields','가공분야'],['products','제품·가공사례'],['facilities','설비현황'],['quality','품질관리'],['admin/dashboard','Admin 대시보드'],['admin/ops','운영고도화'],['admin/products','제품관리'],['admin/settings','설정']];
  return `<aside class="cmd-backdrop" onclick="closeCommandPalette()"><section class="cmd-palette" onclick="event.stopPropagation()"><div><b>기능 검색</b><button onclick="closeCommandPalette()">×</button></div><p>Ctrl+K / Esc / ← → 키보드 네비게이션 지원</p>${items.map(([k,l])=>`<button onclick="closeCommandPalette();go('${k}')"><span>${esc(l)}</span><small>#/${esc(k)}</small></button>`).join('')}</section></aside>`;
}
function ensureGlobalUX(){
  if(!document.getElementById('dkt-progress')) document.body.insertAdjacentHTML('beforeend','<div id="dkt-progress" class="route-progress"></div>');
  const pct = Math.max(0, Math.min(100, ((nav.indexOf(current())+1) / nav.length) * 100));
  const bar=document.getElementById('dkt-progress'); if(bar) bar.style.width = current().startsWith('admin') ? '100%' : pct+'%';
}
function routeStep(delta){ const k=current(); if(k.startsWith('admin')) return; const idx=nav.indexOf(k); if(idx<0)return; const next=nav[(idx+delta+nav.length)%nav.length]; go(next); }
function openCommandPalette(){ localStorage.setItem('DKT_COMMAND_OPEN','1'); render(); }
function closeCommandPalette(){ localStorage.removeItem('DKT_COMMAND_OPEN'); render(); }
function adminValidate(){ const h=cmsHealth(cms()); toast(`검증 완료: ${h.score}% · ${readinessBadge(h.score)}`); }
function adminBulkStatus(status){ const d=cms(); d.products=d.products.map(p=>({...p,status})); saveCms(d,`제품 전체 ${status} 처리`); }
function adminCreateBackup(){ const d=cms(); d.backups=[{id:'BK-MANUAL-'+Date.now(), time:new Date().toLocaleString('ko-KR'), label:'수동 백업', payload:snapshotSlim(d)}, ...(d.backups||[])].slice(0,8); saveCms(d,'수동 백업 생성'); }
function adminRestoreBackup(id){ const d=cms(); const b=(d.backups||[]).find(x=>x.id===id); if(!b||!b.payload){toast('복구할 백업 없음');return;} localStorage.setItem('DKT_COMPANY_CMS_V1', JSON.stringify(normalizeCms(b.payload))); toast('백업 복구 완료'); render(); }
function adminUndo(){ const d=cms(); const b=(d.backups||[])[0]; if(!b){toast('복구할 백업 없음');return;} adminRestoreBackup(b.id); }
function adminImportFile(ev){ const file=ev.target.files && ev.target.files[0]; if(!file)return; const reader=new FileReader(); reader.onload=()=>{ try{ const data=normalizeCms(JSON.parse(reader.result)); saveCms(data,'JSON 가져오기 완료'); }catch(e){ toast('JSON 형식 오류'); } }; reader.readAsText(file); }
function render(){ const key=current(); app.innerHTML = key.startsWith('admin') ? adminApp(key) : (isMobile() ? mobileApp(key) : desktopScreen(key)); ensureGlobalUX(); }
window.openCommandPalette=openCommandPalette;
window.closeCommandPalette=closeCommandPalette;
window.routeStep=routeStep;
window.adminValidate=adminValidate;
window.adminBulkStatus=adminBulkStatus;
window.adminCreateBackup=adminCreateBackup;
window.adminRestoreBackup=adminRestoreBackup;
window.adminUndo=adminUndo;
window.adminImportFile=adminImportFile;
document.addEventListener('keydown',(e)=>{ if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='k'){e.preventDefault();openCommandPalette();} if(e.key==='Escape'){closeDesktopDetail();closeCommandPalette();} if(e.key==='ArrowRight'&&!e.ctrlKey&&!e.metaKey) routeStep(1); if(e.key==='ArrowLeft'&&!e.ctrlKey&&!e.metaKey) routeStep(-1); });
try{ render(); }catch(e){ console.error('Advanced render failed', e); }

/* CT-MUX1~MUX8 MOBILE UX FUNCTION REVIVAL / PHOTO PANEL ACTION PATCH */
const mobileUxMap = {
  homeHero:{title:'대광테크 핵심 역량', body:'CNC 자동선반 기반의 정밀 가공, 안정적인 양산, 품질관리 체계를 한 화면에서 확인합니다.', img:'./public/screens/home.jpg', primary:'회사정보 보기', target:'company', secondary:'제품 보기', secondaryTarget:'products'},
  fieldsHero:{title:'정밀 가공 분야', body:'자동차·유압·전자·정밀 양산가공 분야별 대응 역량과 공정 흐름을 확인합니다.', img:'./public/screens/fields.jpg', primary:'제품 사례 보기', target:'products', secondary:'설비 보기', secondaryTarget:'facilities'},
  productsHero:{title:'제품·가공사례', body:'제품 사진을 선택하면 소재, 공정, 정밀도, 반복생산 대응 정보를 상세 패널로 확인할 수 있습니다.', img:'./public/screens/products.jpg', primary:'설비 보기', target:'facilities', secondary:'품질 보기', secondaryTarget:'quality'},
  facilitiesHero:{title:'설비 운용 환경', body:'자동선반 라인, 측정/검사, 세척/포장 설비의 역할과 공정 연결을 확인합니다.', img:'./public/screens/facilities.jpg', primary:'품질관리 보기', target:'quality', secondary:'가공분야 보기', secondaryTarget:'fields'},
  qualityHero:{title:'품질관리 체계', body:'품질 KPI, 검사 프로세스, 측정 장비 체계를 모바일 앱 UI로 확인합니다.', img:'./public/screens/quality.jpg', primary:'회사정보 보기', target:'company', secondary:'설비 보기', secondaryTarget:'facilities'}
};
function mobileUxPayload(kind, id){
  const d=cms();
  if(kind==='product'){
    const p=d.products.find(x=>x.id===id) || d.products[0];
    if(!p) return mobileUxMap.productsHero;
    return {title:p.title, body:`${p.material} · ${p.process} · ${p.tolerance}. ${p.description||'대표 가공 사례입니다.'}`, img:p.image, chips:[p.category,p.material,p.status], primary:'관련 설비 보기', target:'facilities', secondary:'품질 기준 보기', secondaryTarget:'quality'};
  }
  if(kind==='field'){
    const f=productCards.find(x=>x[0]===id) || productCards[0];
    return {title:`${f[0]} 가공`, body:`${f[1]}. 해당 분야의 적용 사례와 공정 흐름을 함께 확인합니다.`, img:f[2], chips:['가공분야','공정설계','반복생산'], primary:'제품 사례 보기', target:'products', secondary:'품질 보기', secondaryTarget:'quality'};
  }
  if(kind==='facility'){
    const f=d.facilities.find(x=>x.id===id) || d.facilities[0];
    return {title:f.name, body:`${f.spec}. 상태: ${f.status}. 설비별 역할과 공정 연결을 확인합니다.`, img:f.image, chips:[f.type,f.status,'설비'], primary:'품질관리 보기', target:'quality', secondary:'가공분야 보기', secondaryTarget:'fields'};
  }
  if(kind==='quality'){
    const q=d.quality.find(x=>x.id===id) || d.quality[0];
    return {title:q.label, body:`현재 지표 ${q.value}. ${q.note||'품질관리 기준 지표입니다.'}`, img:'./public/screens/quality.jpg', chips:['품질KPI',q.value,q.note||'관리'], primary:'설비현황 보기', target:'facilities', secondary:'회사정보 보기', secondaryTarget:'company'};
  }
  if(kind==='flow'){
    const f=d.flows[Number(id)] || {title:id,body:'4D 프로세스 단계'};
    return {title:`4D · ${f.title}`, body:f.body||'단계별 흐름을 확인합니다.', img:'./public/screens/home.jpg', chips:['4D','PROCESS','공정'], primary:'가공분야 보기', target:'fields', secondary:'품질관리 보기', secondaryTarget:'quality'};
  }
  return mobileUxMap[kind] || mobileUxMap.homeHero;
}
function mobileDetailOverlay(){
  const raw=localStorage.getItem('DKT_MOBILE_DETAIL');
  if(!raw) return '';
  let d; try{d=JSON.parse(raw)}catch{return ''}
  const chips=(d.chips||['DAEKWANG','DETAIL']).filter(Boolean).slice(0,4).map(c=>`<span>${esc(c)}</span>`).join('');
  return `<aside class="mobile-detail-backdrop" onclick="mobileCloseDetail()"><section class="mobile-detail-panel" onclick="event.stopPropagation()"><button class="sheet-close" onclick="mobileCloseDetail()">×</button><img src="${esc(d.img||'./public/screens/home.jpg')}" alt="${esc(d.title)}"><div class="mobile-detail-body"><small>DETAIL VIEW</small><b>${esc(d.title)}</b><p>${esc(d.body)}</p><div class="mobile-detail-chips">${chips}</div><div class="mobile-detail-actions"><button onclick="mobileCloseDetail();go('${esc(d.target||'company')}')">${esc(d.primary||'관련 화면')}</button><button class="ghost" onclick="mobileCloseDetail();go('${esc(d.secondaryTarget||'home')}')">${esc(d.secondary||'관련 화면')}</button></div></div></section></aside>`;
}
window.mobileOpenDetail=(kind,id)=>{localStorage.setItem('DKT_MOBILE_DETAIL', JSON.stringify(mobileUxPayload(kind,id))); render();};
window.mobileOpenVisual=(kind,id)=>window.mobileOpenDetail(kind,id);
window.mobileOpenProduct=(id)=>{localStorage.setItem('DKT_MOBILE_PRODUCT',id); localStorage.setItem('DKT_MOBILE_DETAIL', JSON.stringify(mobileUxPayload('product',id))); render();};
window.mobileCloseDetail=()=>{localStorage.removeItem('DKT_MOBILE_DETAIL'); render();};
window.mobileCloseSheet=()=>{localStorage.removeItem('DKT_MOBILE_PRODUCT');localStorage.removeItem('DKT_MOBILE_DETAIL');render()};
function MobileTop(){return `<header class="m-top upgraded"><button onclick="go('home')" aria-label="홈"><img class="m-logo" src="./public/screens/logo-angular-transparent.png" alt="DAE KWANG TECH" /></button><strong>DAE KWANG TECH</strong><button class="m-top-link" onclick="go('company')">회사정보</button></header>`}
function Flow(title='4D 제조 플로우', list=cms().flows.map(f=>f.title)){return `<section class="m-card m-flow-card"><div class="m-head"><b>${title}</b><span>PROCESS</span></div><div class="m-flow">${list.map((s,i)=>`<button onclick="mobileOpenDetail('flow','${i}')"><em>${String(i+1).padStart(2,'0')}</em><b>${esc(s)}</b><small>${i<list.length-1?'→':'✓'}</small></button>`).join('')}</div></section>`}
function MobileHome(){const d=cms();return `${MobileTop()}<main class="mobile-app mux"><section class="m-hero" onclick="mobileOpenDetail('homeHero')"><span>CNC 자동선반 전문 가공업체</span><h1>정밀함이 만드는 차이,<br><mark>제조 경쟁력</mark>입니다.</h1><p>${esc(d.companyInfo.intro)}</p><div class="m-kpi"><button onclick="event.stopPropagation();mobileOpenDetail('quality','q1')"><small>월 생산</small>${esc(d.companyInfo.monthlyCapacity||'120만+')}</button><button onclick="event.stopPropagation();go('facilities')"><small>설비</small>${esc(d.companyInfo.equipmentCount||'32대+')}</button><button onclick="event.stopPropagation();go('quality')"><small>품질</small>${esc(d.companyInfo.qualityRate||'99.2%')}</button></div></section><section class="m-actions"><button onclick="go('company')">회사소개</button><button onclick="go('products')">제품 보기</button><button onclick="go('facilities')">설비 현황</button></section>${Flow()}<section class="m-card"><div class="m-head"><b>가공분야</b><button onclick="go('fields')">전체</button></div><div class="m-feed">${productCards.slice(0,3).map(([t,desc,img])=>`<article onclick="mobileOpenDetail('field','${esc(t)}')"><img src="${img}" alt="${esc(t)}"><div><b>${t}</b><p>${desc}</p><span>상세 열기 →</span></div></article>`).join('')}</div></section></main>${mobileDetailOverlay()}<button class="m-sticky" onclick="go('company')">회사정보 보기</button>${Bottom('home')}`}
function MobileFields(){const active=localStorage.getItem('DKT_FIELD_SEG')||'자동차부품';const [title,desc,img]=productCards.find(p=>p[0]===active)||productCards[0];return `${MobileTop()}<main class="mobile-app mux"><section class="m-title"><span>MACHINING FIELDS</span><h1>정밀 가공의 모든 분야</h1></section><div class="m-segments">${productCards.map(([t])=>`<button class="${active===t?'on':''}" onclick="mobileSetField('${t}')">${t.replace('부품','')}</button>`).join('')}</div><section class="m-card visual clickable" onclick="mobileOpenDetail('field','${esc(active)}')"><img src="${img}" alt="${esc(title)}"><b>${title} 가공</b><p>${desc}. 복잡 형상, 고정도 치수, 반복 생산을 위한 공정 설계를 지원합니다.</p><span class="m-card-link">사진/패널 상세 보기 →</span></section>${Flow('4D 대응 프로세스',['요구 확인','소재 검토','공정 설계','가공','검사'])}</main>${mobileDetailOverlay()}<button class="m-sticky" onclick="go('products')">제품 사례 보기</button>${Bottom('fields')}`}
function MobileProducts(){const d=cms();const active=localStorage.getItem('DKT_PRODUCT_SEG')||'전체';const items=d.products.filter(p=>active==='전체'||p.category===active);const selected=d.products.find(p=>p.id===localStorage.getItem('DKT_MOBILE_PRODUCT'));return `${MobileTop()}<main class="mobile-app mux"><section class="m-title" onclick="mobileOpenDetail('productsHero')"><span>PRODUCT CASE</span><h1>제품·가공사례</h1></section><div class="m-segments">${['전체','자동차부품','유압부품','전자부품','정밀 양산가공'].map(k=>`<button class="${active===k?'on':''}" onclick="mobileSetProductFilter('${k}')">${k==='전체'?'전체':k.replace('부품','')}</button>`).join('')}</div><section class="m-feed products">${items.map(p=>`<article onclick="mobileOpenProduct('${p.id}')"><img src="${esc(p.image)}" alt="${esc(p.title)}"><div><b>${esc(p.title)}</b><p>${esc(p.material)} · ${esc(p.process)} · ${esc(p.tolerance)}</p><span>${esc(p.status)} · 상세 정보 보기 →</span></div></article>`).join('')}</section></main>${selected?`<aside class="mobile-sheet pro"><button class="sheet-close" onclick="mobileCloseSheet()">×</button><img src="${esc(selected.image)}" onclick="mobileOpenDetail('product','${selected.id}')" alt="${esc(selected.title)}"><b>${esc(selected.title)}</b><p>${esc(selected.description)}</p><div><span>${esc(selected.material)}</span><span>${esc(selected.process)}</span><span>${esc(selected.tolerance)}</span></div><button onclick="go('facilities')">관련 설비 보기</button><button class="ghost" onclick="go('quality')">품질 기준 보기</button></aside>`:''}${mobileDetailOverlay()}<button class="m-sticky" onclick="go('facilities')">설비·품질 보기</button>${Bottom('products')}`}
function MobileFacilities(){const d=cms();return `${MobileTop()}<main class="mobile-app mux"><section class="m-title"><span>EQUIPMENT</span><h1>자동선반 기반 정밀 가공 환경</h1></section><section class="m-card visual clickable" onclick="mobileOpenDetail('facilitiesHero')"><img src="./public/screens/facilities.jpg" alt="설비현황"><b>대표 장비 환경</b><p>가공·검사·세척·포장 공정을 안정적으로 운영합니다.</p><span class="m-card-link">설비 상세 보기 →</span></section><section class="m-feed">${d.facilities.map(f=>`<article onclick="mobileOpenDetail('facility','${f.id}')"><img src="${esc(f.image)}" alt="${esc(f.name)}"><div><b>${esc(f.name)}</b><p>${esc(f.spec)}</p><span>${esc(f.status)} · 상세 보기 →</span></div></article>`).join('')}</section>${Flow('4D 공정-설비 연계',['도면 검토','가공 실행','측정/검사','세척/포장','출하'])}</main>${mobileDetailOverlay()}<button class="m-sticky" onclick="go('quality')">품질관리 보기</button>${Bottom('facilities')}`}
function MobileQuality(){const d=cms();return `${MobileTop()}<main class="mobile-app mux"><section class="m-title"><span>QUALITY</span><h1>품질관리 체계</h1></section><section class="m-card visual clickable" onclick="mobileOpenDetail('qualityHero')"><img src="./public/screens/quality.jpg" alt="품질관리"><b>정밀 측정 기반 품질관리</b><p>검사 프로세스와 품질 데이터를 기반으로 안정적인 생산 품질을 유지합니다.</p><span class="m-card-link">품질 상세 보기 →</span></section><section class="m-card"><div class="m-head"><b>품질 KPI</b><span>MONTHLY</span></div><div class="m-kpi quality interactive">${d.quality.map(q=>`<button onclick="mobileOpenDetail('quality','${q.id}')"><small>${esc(q.label)}</small>${esc(q.value)}</button>`).join('')}</div></section>${Flow('품질 검사 프로세스',['수입검사','공정검사','자주검사','최종검사','출하검사'])}</main>${mobileDetailOverlay()}<button class="m-sticky" onclick="go('home')">홈으로 이동</button>${Bottom('quality')}`}
try{ render(); }catch(e){ console.error('Mobile UX render failed', e); }


/* CT-U1~U10 FULL FUNCTIONAL FINAL PATCH
   Scope: Desktop + Mobile + Admin + Launcher + Verify full UX functionalization.
   Goal: every visible photo/panel/CTA has a clear action; inquiry/contact stays OUT.
*/
function fullUxRouteTitle(routeKey){
  return ({home:'홈 종합 화면',company:'회사소개',fields:'가공분야',products:'제품·가공사례',facilities:'설비현황',quality:'품질관리'}[routeKey]||'대광테크');
}
function fullUxPayload(routeKey, zone='main'){
  const map={
    home:{hero:['대광테크 홈 핵심 화면','정밀가공 역량, 제품사례, 설비, 품질관리 흐름을 한 화면에서 확인합니다.','home.jpg','company'],left:['가공분야 카드','자동차·유압·전자·정밀 양산가공 분야별 대응 범위를 확인합니다.','fields.jpg','fields'],right:['제품·가공사례 미리보기','대표 가공품과 적용 분야를 확인합니다.','products.jpg','products'],process:['4D 제조 프로세스','요구 확인부터 출하 관리까지 이어지는 제조 흐름입니다.','home.jpg','fields'],bottom:['품질·설비 종합 확인','설비와 품질 지표를 함께 확인합니다.','quality.jpg','quality']},
    company:{hero:['회사소개 핵심 비주얼','대광테크의 정밀가공 신뢰성과 회사 역량을 확인합니다.','company.jpg','company'],left:['회사 개요','회사 정보, 사업분야, 주요 고객사, 품질 신뢰 항목을 확인합니다.','company.jpg','company'],right:['인증 및 신뢰','품질 운영 원칙과 인증/추천 정보를 확인합니다.','quality.jpg','quality'],process:['회사 운영 4D 프로세스','요구 확인과 공정 검토 중심의 회사 운영 흐름을 확인합니다.','company.jpg','fields'],bottom:['핵심 경쟁력','정밀성, 일관성, 납기 준수 등 회사 운영 원칙을 확인합니다.','fields.jpg','fields']},
    fields:{hero:['가공분야 Hero','산업별 정밀 가공 대응 범위와 설비 기반 역량을 확인합니다.','fields.jpg','fields'],left:['분야별 카드','자동차·유압·전자·정밀 양산가공 카드를 확인합니다.','fields.jpg','fields'],right:['적용 예시','제품군별 적용 사례와 가공 샘플을 확인합니다.','products.jpg','products'],process:['4D 대응 프로세스','도면 검토부터 검사 및 납품까지 분야별 대응 흐름입니다.','fields.jpg','quality'],bottom:['가공 샘플','다양한 형상의 정밀가공 샘플을 확인합니다.','products.jpg','products']},
    products:{hero:['제품·가공사례 Hero','대표 가공품의 소재, 공정, 정밀도, 적용 분야를 확인합니다.','products.jpg','products'],left:['제품 이미지 갤러리','사진을 선택해 제품 상세 정보를 확인합니다.','products.jpg','products'],right:['대표 제품 상세','대표 사례의 주요 포인트와 가공 특성을 확인합니다.','products.jpg','facilities'],process:['소재·형상·반복생산','소재 대응, 형상 대응, 반복 생산 대응 역량을 확인합니다.','fields.jpg','fields'],bottom:['제품 사례 연계','가공분야, 설비, 품질 체계를 제품 사례와 함께 확인합니다.','quality.jpg','quality']},
    facilities:{hero:['설비현황 Hero','자동선반 기반 정밀 가공 환경과 설비 운영 체계를 확인합니다.','facilities.jpg','facilities'],left:['대표 장비 환경','자동선반 라인, 정밀 측정/검사 장비, 세척·포장 설비를 확인합니다.','facilities.jpg','facilities'],right:['설비 스펙 패널','설비 개요와 운용 포인트를 확인합니다.','facilities.jpg','quality'],process:['4D 공정-설비 연계','도면 검토, 가공 실행, 측정/검사, 세척·포장·출하 흐름입니다.','facilities.jpg','quality'],bottom:['설비 운영 강점','생산 유연성, 정밀도 대응, 작업 안정성, 품질 일관성을 확인합니다.','facilities.jpg','quality']},
    quality:{hero:['품질관리 Hero','정밀 검사와 체계적 품질관리 흐름을 확인합니다.','quality.jpg','quality'],left:['품질 KPI','합격률, Cpk, 납기준수율, 검사기록 보관율을 확인합니다.','quality.jpg','quality'],right:['측정 장비 패널','품질관리 장비와 검사 체계를 확인합니다.','quality.jpg','facilities'],process:['품질 검사 프로세스','수입검사부터 고객 피드백까지 품질 검사 흐름입니다.','quality.jpg','quality'],bottom:['검사항목/검사체계','검사항목, 검사방법, 검사 기준, 기록 보관 체계를 확인합니다.','quality.jpg','quality']}
  };
  const a=(map[routeKey]||map.home)[zone] || (map[routeKey]||map.home).hero;
  return {title:a[0],body:a[1],img:a[2],target:a[3],routeKey,zone};
}
function desktopUniversalHotspots(routeKey){
  const zones=['hero','left','right','process','bottom'];
  return zones.map(z=>`<button class="u-hot u-${z}" onclick="openFullDesktopDetail('${routeKey}','${z}')" aria-label="${esc(fullUxPayload(routeKey,z).title)} 상세 보기"></button>`).join('');
}
function desktopFunctionHint(routeKey){
  return `<div class="screen-mask desktop-function-hint"><span>사진·패널 터치/클릭 가능</span><button onclick="openFullDesktopDetail('${routeKey}','hero')">현재 화면 상세 →</button></div>`;
}
function FullDetailModal(){
  const raw=localStorage.getItem('DKT_FULL_DETAIL') || localStorage.getItem('DKT_DESKTOP_DETAIL');
  if(!raw) return '';
  let d; try{d=JSON.parse(raw)}catch{return ''}
  const chips=[fullUxRouteTitle(d.routeKey||current()), d.zone||'detail', '회사소개형', '클릭 기능'].filter(Boolean).map(c=>`<span>${esc(c)}</span>`).join('');
  const route=d.routeKey||current();
  const zone=d.zone||'hero';
  return `<aside class="full-detail-backdrop" onclick="closeFullDetail()"><section class="full-detail-modal" onclick="event.stopPropagation()"><button class="detail-close" onclick="closeFullDetail()">×</button><div class="full-detail-visual"><img src="./public/screens/${esc(d.img||'home.jpg')}" alt="${esc(d.title)}"><button onclick="openImageLightbox('${esc(d.img||'home.jpg')}','${esc(d.title||'상세 이미지')}')">이미지 크게 보기</button></div><div class="full-detail-copy"><small>DAEKWANG TECH DETAIL</small><h2>${esc(d.title)}</h2><p>${esc(d.body)}</p><div class="full-detail-chips">${chips}</div><div class="full-detail-actions"><button onclick="closeFullDetail();go('${esc(d.target||'company')}')">관련 화면으로 이동 →</button><button class="ghost" onclick="desktopNextZone('${route}','${zone}',1)">다음 항목</button><button class="ghost" onclick="desktopNextZone('${route}','${zone}',-1)">이전 항목</button></div></div></section></aside>`;
}
function ImageLightbox(){
  const raw=localStorage.getItem('DKT_IMAGE_LIGHTBOX');
  if(!raw) return '';
  let d; try{d=JSON.parse(raw)}catch{return ''}
  return `<aside class="image-lightbox" onclick="closeImageLightbox()"><button onclick="closeImageLightbox()">×</button><img src="./public/screens/${esc(d.img)}" alt="${esc(d.title)}"><span>${esc(d.title)}</span></aside>`;
}
function desktopNextZone(routeKey, zone, dir){
  const zones=['hero','left','right','process','bottom'];
  const i=Math.max(0,zones.indexOf(zone));
  const next=zones[(i+dir+zones.length)%zones.length];
  localStorage.setItem('DKT_FULL_DETAIL', JSON.stringify(fullUxPayload(routeKey,next)));
  localStorage.removeItem('DKT_DESKTOP_DETAIL');
  render();
}
window.openFullDesktopDetail=(routeKey,zone)=>{localStorage.setItem('DKT_FULL_DETAIL',JSON.stringify(fullUxPayload(routeKey,zone)));localStorage.removeItem('DKT_DESKTOP_DETAIL');render();};
window.closeFullDetail=()=>{localStorage.removeItem('DKT_FULL_DETAIL');localStorage.removeItem('DKT_DESKTOP_DETAIL');render();};
window.openImageLightbox=(img,title)=>{localStorage.setItem('DKT_IMAGE_LIGHTBOX',JSON.stringify({img,title}));render();};
window.closeImageLightbox=()=>{localStorage.removeItem('DKT_IMAGE_LIGHTBOX');render();};
window.openDesktopDetail=(routeKey,i)=>{const base=(desktopDetails[routeKey]||[])[i]; const d=base?{...base,routeKey,zone:base.cls||'panel'}:fullUxPayload(routeKey,'hero'); localStorage.setItem('DKT_FULL_DETAIL',JSON.stringify(d));localStorage.removeItem('DKT_DESKTOP_DETAIL');render();};
window.closeDesktopDetail=()=>closeFullDetail();
function desktopScreen(routeKey){
  const r=routes[routeKey]||routes.home;
  const navLinks=nav.map((key,i)=>`<button class="hot nav-hot nav-${i} ${key===routeKey?'on':''}" onclick="go('${key}')" aria-label="${routes[key].label}"></button>`).join('');
  const isHome=routeKey==='home';
  const cleanCopy={
    company:['회사정보 보기','정밀가공 역량, 설비, 품질 체계를 한 화면에서 확인하세요.','핵심 경쟁력 보기 →','fields'],
    fields:['가공분야 확인','자동차·유압·전자·정밀 양산가공 대응 범위를 확인하세요.','제품 사례 보기 →','products'],
    products:['제품·가공사례 확인','보유 가공 사례와 반복 생산 대응 역량을 확인하세요.','설비현황 보기 →','facilities'],
    facilities:['설비현황 확인','자동선반 라인과 검사·세척·포장 설비 흐름을 확인하세요.','품질관리 보기 →','quality'],
    quality:['품질관리 확인','검사 프로세스와 품질 지표 중심의 관리 체계를 확인하세요.','회사소개로 이동 →','company']
  }[routeKey];
  return `<main class="screen-wrap company-only-screen full-functional route-${routeKey}">
    <img class="exact-screen" src="./public/screens/${r.img}" alt="${r.label} exact screen" />
    ${cleanHeader(routeKey)}
    <div class="screen-mask logo-erase-mask" aria-hidden="true"></div>
    <img class="screen-mask brand-clean-logo" src="./public/screens/logo-angular-transparent.png" alt="DAE KWANG TECH" />
    <div class="screen-mask nav-out-mask" aria-hidden="true"></div>
    <div class="screen-mask top-cta-clean-mask" aria-hidden="true"></div>
    <button class="screen-mask top-company-btn" onclick="go('company')">회사소개 보기 →</button>
    <div class="screen-mask footer-out-mask" aria-hidden="true"></div>
    ${isHome?`<div class="screen-mask home-info-mask clean-panel"><b>대광테크 회사소개</b><span>CNC 자동선반 기반 정밀가공 역량과 설비·품질 체계를 확인하세요.</span><button onclick="go('company')">회사정보 보기 →</button></div>`:''}
    ${cleanCopy?`<div class="screen-mask page-clean-panel clean-panel"><b>${cleanCopy[0]}</b><span>${cleanCopy[1]}</span><button onclick="go('${cleanCopy[3]}')">${cleanCopy[2]}</button></div>`:''}
    ${routeKey==='products'?`<div class="screen-mask product-action-clean-mask" aria-hidden="true"></div><div class="screen-mask product-bottom-action-mask" aria-hidden="true"></div>`:''}
    ${cleanBottomPanel(routeKey)}
    ${desktopFunctionHint(routeKey)}
    ${navLinks}
    ${detailHotspots(routeKey)}
    ${desktopUniversalHotspots(routeKey)}
    <button class="hot cta-hot" onclick="go('company')" aria-label="회사소개 보기"></button>
    ${FullDetailModal()}${ImageLightbox()}
  </main>`;
}
function mobileDetailOverlay(){
  const raw=localStorage.getItem('DKT_MOBILE_DETAIL');
  if(!raw) return '';
  let d; try{d=JSON.parse(raw)}catch{return ''}
  const chips=(d.chips||['DAEKWANG','DETAIL']).filter(Boolean).slice(0,5).map(c=>`<span>${esc(c)}</span>`).join('');
  return `<aside class="mobile-detail-backdrop upgraded" onclick="mobileCloseDetail()"><section class="mobile-detail-panel upgraded" onclick="event.stopPropagation()"><button class="sheet-close" onclick="mobileCloseDetail()">×</button><div class="sheet-grip"></div><img src="${esc(d.img||'./public/screens/home.jpg')}" onclick="mobileZoomImage('${esc((d.img||'./public/screens/home.jpg').replace('./public/screens/',''))}','${esc(d.title||'상세 이미지')}')" alt="${esc(d.title)}"><div class="mobile-detail-body"><small>DETAIL VIEW · TAP IMAGE TO ZOOM</small><b>${esc(d.title)}</b><p>${esc(d.body)}</p><div class="mobile-detail-chips">${chips}</div><div class="mobile-detail-actions"><button onclick="mobileCloseDetail();go('${esc(d.target||'company')}')">${esc(d.primary||'관련 화면')}</button><button class="ghost" onclick="mobileCloseDetail();go('${esc(d.secondaryTarget||'home')}')">${esc(d.secondary||'관련 화면')}</button></div></div></section></aside>`;
}
function mobileImageZoom(){
  const raw=localStorage.getItem('DKT_MOBILE_ZOOM');
  if(!raw) return '';
  let d; try{d=JSON.parse(raw)}catch{return ''}
  const img=d.img&&d.img.startsWith('.')?d.img:`./public/screens/${d.img||'home.jpg'}`;
  return `<aside class="mobile-zoom" onclick="mobileCloseZoom()"><button onclick="mobileCloseZoom()">×</button><img src="${esc(img)}" alt="${esc(d.title)}"><b>${esc(d.title)}</b></aside>`;
}
window.mobileZoomImage=(img,title)=>{localStorage.setItem('DKT_MOBILE_ZOOM',JSON.stringify({img,title}));render();};
window.mobileCloseZoom=()=>{localStorage.removeItem('DKT_MOBILE_ZOOM');render();};
function ctaLabelFor(routeKey){return ({home:'회사정보 보기',company:'가공분야 보기',fields:'제품 사례 보기',products:'설비·품질 보기',facilities:'품질관리 보기',quality:'홈으로 이동'}[routeKey]||'회사정보 보기')}
function ctaTargetFor(routeKey){return ({home:'company',company:'fields',fields:'products',products:'facilities',facilities:'quality',quality:'home'}[routeKey]||'company')}
function MobileTop(){return `<header class="m-top upgraded full"><button onclick="go('home')" aria-label="홈"><img class="m-logo" src="./public/screens/logo-angular-transparent.png" alt="DAE KWANG TECH" /></button><strong>DAE KWANG TECH</strong><button class="m-top-link" onclick="go('company')">회사정보</button></header>`}
function MobileHome(){const d=cms();return `${MobileTop()}<main class="mobile-app mux fullux"><section class="m-hero clickable" onclick="mobileOpenDetail('homeHero')"><span>CNC 자동선반 전문 가공업체</span><h1>정밀함이 만드는 차이,<br><mark>제조 경쟁력</mark>입니다.</h1><p>${esc(d.companyInfo.intro)}</p><div class="m-kpi"><button onclick="event.stopPropagation();mobileOpenDetail('quality','q1')"><small>월 생산</small>${esc(d.companyInfo.monthlyCapacity||'120만+')}</button><button onclick="event.stopPropagation();mobileOpenDetail('facilitiesHero')"><small>설비</small>${esc(d.companyInfo.equipmentCount||'32대+')}</button><button onclick="event.stopPropagation();mobileOpenDetail('quality','q3')"><small>품질</small>${esc(d.companyInfo.qualityRate||'99.2%')}</button></div><span class="tap-cue">화면 상세 보기 →</span></section><section class="m-actions full"><button onclick="go('company')">회사소개</button><button onclick="go('products')">제품 보기</button><button onclick="go('facilities')">설비 현황</button></section>${Flow()}<section class="m-card"><div class="m-head"><b>가공분야</b><button onclick="go('fields')">전체</button></div><div class="m-feed">${productCards.slice(0,3).map(([t,desc,img])=>`<article onclick="mobileOpenDetail('field','${esc(t)}')"><img src="${img}" alt="${esc(t)}"><div><b>${t}</b><p>${desc}</p><span>상세 열기 →</span></div></article>`).join('')}</div></section></main>${mobileDetailOverlay()}${mobileImageZoom()}<button class="m-sticky full" onclick="go('${ctaTargetFor('home')}')">${ctaLabelFor('home')}</button>${Bottom('home')}`}
function MobileCompany(){const d=cms();const c=d.companyInfo;return `${MobileTop()}<main class="mobile-app mux fullux"><section class="m-title clickable" onclick="mobileOpenDetail('companyHero')"><span>COMPANY PROFILE</span><h1>정밀함과 신뢰로,<br><mark>최상의 제품</mark>을 만듭니다.</h1><p>${esc(c.intro)}</p><span class="tap-cue">회사 상세 보기 →</span></section><section class="m-card clickable" onclick="mobileOpenDetail('companyHero')"><div class="m-head"><b>회사 개요</b><span>PROFILE</span></div><ul class="m-info-list"><li><b>회사명</b><span>${esc(c.name)}</span></li><li><b>사업분야</b><span>${esc(c.businessArea||'CNC 자동선반 가공')}</span></li><li><b>설립연도</b><span>${esc(c.founded||'-')}</span></li><li><b>주소</b><span>${esc(c.address)}</span></li></ul></section><section class="m-card"><div class="m-head"><b>핵심 지표</b><span>CAPABILITY</span></div><div class="m-kpi quality interactive"><button onclick="mobileOpenDetail('quality','q1')"><small>월 생산</small>${esc(c.monthlyCapacity||'-')}</button><button onclick="mobileOpenDetail('facilitiesHero')"><small>설비</small>${esc(c.equipmentCount||'-')}</button><button onclick="mobileOpenDetail('quality','q3')"><small>품질</small>${esc(c.qualityRate||'-')}</button><button onclick="mobileOpenDetail('flow','0')"><small>운영</small>${esc(c.principle1||'정밀성')}</button></div></section>${Flow('회사 운영 4D 프로세스',['요구 확인','도면 검토','공정 설계','가공/검사','출하 관리'])}</main>${mobileDetailOverlay()}${mobileImageZoom()}<button class="m-sticky full" onclick="go('${ctaTargetFor('company')}')">${ctaLabelFor('company')}</button>${Bottom('home')}`}
function MobileFields(){const active=localStorage.getItem('DKT_FIELD_SEG')||'자동차부품';const [title,desc,img]=productCards.find(p=>p[0]===active)||productCards[0];return `${MobileTop()}<main class="mobile-app mux fullux"><section class="m-title clickable" onclick="mobileOpenDetail('field','${esc(active)}')"><span>MACHINING FIELDS</span><h1>정밀 가공의 모든 분야</h1><span class="tap-cue">선택 분야 상세 보기 →</span></section><div class="m-segments">${productCards.map(([t])=>`<button class="${active===t?'on':''}" onclick="mobileSetField('${t}')">${t.replace('부품','')}</button>`).join('')}</div><section class="m-card visual clickable" onclick="mobileOpenDetail('field','${esc(active)}')"><img src="${img}" alt="${esc(title)}"><b>${title} 가공</b><p>${desc}. 복잡 형상, 고정도 치수, 반복 생산을 위한 공정 설계를 지원합니다.</p><span class="m-card-link">사진/패널 상세 보기 →</span></section>${Flow('4D 대응 프로세스',['요구 확인','소재 검토','공정 설계','가공','검사'])}</main>${mobileDetailOverlay()}${mobileImageZoom()}<button class="m-sticky full" onclick="go('${ctaTargetFor('fields')}')">${ctaLabelFor('fields')}</button>${Bottom('fields')}`}
function MobileProducts(){const d=cms();const active=localStorage.getItem('DKT_PRODUCT_SEG')||'전체';const items=d.products.filter(p=>active==='전체'||p.category===active);const selected=d.products.find(p=>p.id===localStorage.getItem('DKT_MOBILE_PRODUCT'));return `${MobileTop()}<main class="mobile-app mux fullux"><section class="m-title clickable" onclick="mobileOpenDetail('productsHero')"><span>PRODUCT CASE</span><h1>제품·가공사례</h1><span class="tap-cue">제품 화면 상세 보기 →</span></section><div class="m-segments">${['전체','자동차부품','유압부품','전자부품','정밀 양산가공'].map(k=>`<button class="${active===k?'on':''}" onclick="mobileSetProductFilter('${k}')">${k==='전체'?'전체':k.replace('부품','')}</button>`).join('')}</div><section class="m-feed products">${items.map(p=>`<article onclick="mobileOpenProduct('${p.id}')"><img src="${esc(p.image)}" alt="${esc(p.title)}"><div><b>${esc(p.title)}</b><p>${esc(p.material)} · ${esc(p.process)} · ${esc(p.tolerance)}</p><span>${esc(p.status)} · 상세 정보 보기 →</span></div></article>`).join('')}</section></main>${selected?`<aside class="mobile-sheet pro upgraded"><button class="sheet-close" onclick="mobileCloseSheet()">×</button><div class="sheet-grip"></div><img src="${esc(selected.image)}" onclick="mobileOpenDetail('product','${selected.id}')" alt="${esc(selected.title)}"><b>${esc(selected.title)}</b><p>${esc(selected.description)}</p><div><span>${esc(selected.material)}</span><span>${esc(selected.process)}</span><span>${esc(selected.tolerance)}</span></div><button onclick="go('facilities')">관련 설비 보기</button><button class="ghost" onclick="go('quality')">품질 기준 보기</button></aside>`:''}${mobileDetailOverlay()}${mobileImageZoom()}<button class="m-sticky full" onclick="go('${ctaTargetFor('products')}')">${ctaLabelFor('products')}</button>${Bottom('products')}`}
function MobileFacilities(){const d=cms();return `${MobileTop()}<main class="mobile-app mux fullux"><section class="m-title clickable" onclick="mobileOpenDetail('facilitiesHero')"><span>EQUIPMENT</span><h1>자동선반 기반 정밀 가공 환경</h1><span class="tap-cue">설비 상세 보기 →</span></section><section class="m-card visual clickable" onclick="mobileOpenDetail('facilitiesHero')"><img src="./public/screens/facilities.jpg" alt="설비현황"><b>대표 장비 환경</b><p>가공·검사·세척·포장 공정을 안정적으로 운영합니다.</p><span class="m-card-link">설비 상세 보기 →</span></section><section class="m-feed">${d.facilities.map(f=>`<article onclick="mobileOpenDetail('facility','${f.id}')"><img src="${esc(f.image)}" alt="${esc(f.name)}"><div><b>${esc(f.name)}</b><p>${esc(f.spec)}</p><span>${esc(f.status)} · 상세 보기 →</span></div></article>`).join('')}</section>${Flow('4D 공정-설비 연계',['도면 검토','가공 실행','측정/검사','세척/포장','출하'])}</main>${mobileDetailOverlay()}${mobileImageZoom()}<button class="m-sticky full" onclick="go('${ctaTargetFor('facilities')}')">${ctaLabelFor('facilities')}</button>${Bottom('facilities')}`}
function MobileQuality(){const d=cms();return `${MobileTop()}<main class="mobile-app mux fullux"><section class="m-title clickable" onclick="mobileOpenDetail('qualityHero')"><span>QUALITY</span><h1>품질관리 체계</h1><span class="tap-cue">품질 상세 보기 →</span></section><section class="m-card visual clickable" onclick="mobileOpenDetail('qualityHero')"><img src="./public/screens/quality.jpg" alt="품질관리"><b>정밀 측정 기반 품질관리</b><p>검사 프로세스와 품질 데이터를 기반으로 안정적인 생산 품질을 유지합니다.</p><span class="m-card-link">품질 상세 보기 →</span></section><section class="m-card"><div class="m-head"><b>품질 KPI</b><span>MONTHLY</span></div><div class="m-kpi quality interactive">${d.quality.map(q=>`<button onclick="mobileOpenDetail('quality','${q.id}')"><small>${esc(q.label)}</small>${esc(q.value)}</button>`).join('')}</div></section>${Flow('품질 검사 프로세스',['수입검사','공정검사','자주검사','최종검사','출하검사'])}</main>${mobileDetailOverlay()}${mobileImageZoom()}<button class="m-sticky full" onclick="go('${ctaTargetFor('quality')}')">${ctaLabelFor('quality')}</button>${Bottom('quality')}`}
function adminDirtyChip(){return localStorage.getItem('DKT_ADMIN_DIRTY')==='1'?'<span class="dirty-chip">미저장 변경</span>':'<span class="clean-chip">저장됨</span>'}
function adminLayout(active,title,subtitle,body){
  const d = cms(); const h = typeof cmsHealth==='function'?cmsHealth(d):{score:100,checks:[]};
  return `<main class="admin-live upgraded-admin full-admin"><aside class="admin-side"><button class="brand" onclick="go('admin/dashboard')"><span>DK</span><b>DAE KWANG TECH</b><small>Company CMS Pro</small></button><nav>${adminNav.map(k=>`<button class="${active===k?'on':''}" onclick="go('${k}')">${routes[k].label}</button>`).join('')}</nav><div class="admin-user"><b>관리자</b><small>${esc(readinessBadge(h.score))} · ${h.score}% ready</small><button onclick="adminLogout()">로그아웃</button></div></aside><section class="admin-main"><header class="admin-top"><div><h1>${title}</h1><p>${subtitle}</p>${adminDirtyChip()}</div><div class="admin-top-actions"><button onclick="openCommandPalette()">⌘ 기능검색</button><button onclick="go('admin/ops')">운영고도화</button><button onclick="go('admin/preview')">미리보기</button><button onclick="adminExport()">JSON 내보내기</button></div></header><section class="admin-system-bar"><div><small>운영 준비도</small><b>${h.score}% · ${readinessBadge(h.score)}</b></div><div><small>제품</small><b>${d.products.length}개 / 공개 ${d.products.filter(p=>p.status==='공개').length}</b></div><div><small>저장</small><b>${esc(d.ops?.lastSavedAt||'대기')}</b></div><div><small>백업</small><b>${(d.backups||[]).length}개</b></div></section>${body}</section></main>${CommandPalette()}`;
}
function productEditor(p){return `<div class="field-grid admin-dirty-scope"><label>제품명<input data-edit="title" value="${esc(p.title)}" oninput="adminMarkDirty()" /></label><label>코드<input data-edit="id" value="${esc(p.id)}" disabled /></label><label>카테고리<input data-edit="category" value="${esc(p.category)}" oninput="adminMarkDirty()" /></label><label>상태<select data-edit="status" onchange="adminMarkDirty()"><option ${p.status==='공개'?'selected':''}>공개</option><option ${p.status==='임시저장'?'selected':''}>임시저장</option><option ${p.status==='비공개'?'selected':''}>비공개</option></select></label><label>소재<input data-edit="material" value="${esc(p.material)}" oninput="adminMarkDirty()" /></label><label>공정<input data-edit="process" value="${esc(p.process)}" oninput="adminMarkDirty()" /></label><label>정밀도<input data-edit="tolerance" value="${esc(p.tolerance)}" oninput="adminMarkDirty()" /></label><label>이미지 경로<input data-edit="image" value="${esc(p.image)}" oninput="adminMarkDirty();syncPreviewImage(this.value)" /></label><label class="span2">설명<textarea data-edit="description" oninput="adminMarkDirty()">${esc(p.description)}</textarea></label></div><div class="editor-preview-wrap"><img class="editor-preview live-image-preview" src="${esc(p.image)}" onerror="this.style.opacity=.35"><small>이미지 경로 변경 시 즉시 미리보기됩니다.</small></div><div class="editor-actions"><button onclick="adminSaveProduct('${p.id}')">저장</button><button class="ghost" onclick="adminDuplicateProduct('${p.id}')">복제</button><button class="danger" onclick="adminDelete('products','${p.id}')">삭제</button></div>`}
window.adminMarkDirty=()=>{localStorage.setItem('DKT_ADMIN_DIRTY','1'); const chip=document.querySelector('.clean-chip,.dirty-chip'); if(chip){chip.className='dirty-chip'; chip.textContent='미저장 변경';}};
window.adminClearDirty=()=>{localStorage.removeItem('DKT_ADMIN_DIRTY');};
window.syncPreviewImage=(src)=>{document.querySelectorAll('.live-image-preview').forEach(img=>{img.src=src; img.style.opacity=1;});};
const __oldSaveCms = saveCms;
saveCms = function(data, action='CMS 저장'){ localStorage.removeItem('DKT_ADMIN_DIRTY'); return __oldSaveCms(data, action); };
window.adminDelete=(type,id)=>{if(!confirm('삭제 전 자동 백업을 생성합니다. 계속할까요?'))return;adminCreateBackup?.();if(!confirm('정말 삭제할까요? 되돌리기는 백업 복구로 가능합니다.'))return;const d=cms();d[type]=d[type].filter(x=>x.id!==id);saveCms(d,`${type} 삭제: ${id}`)};
window.addEventListener('beforeunload',(e)=>{if(localStorage.getItem('DKT_ADMIN_DIRTY')==='1'){e.preventDefault();e.returnValue='미저장 변경사항이 있습니다.';}});
try{ render(); }catch(e){ console.error('CT-U full functional render failed', e); }


/* CT-R1~R8_INITIAL_VISUAL_RESTORE_FUNCTION_LOCK
   R1 initial premium exact visual baseline restored
   R2 hero/card/section/photo density preserved from first visual version
   R3 inquiry/quote/contact residue blocked at public UI level
   R4 CTA/photo/card click functions wired without random blue overlay
   R5 mobile huge overlay / random hotspot visual exposure suppressed
   R6 angular premium detail modal locked
   R7 4D Proof Loop stays as manufacturing process evidence
   R8 build/verify/runtime QA marker
*/

const CT_R_FINAL_LOCK = 'CT-R1~R8_INITIAL_VISUAL_RESTORE_FUNCTION_LOCK';
const CT_R9_NO_BOTTOM_4D_NO_INQUIRY_LOCK = 'CT-R9_NO_BOTTOM_4D_NO_INQUIRY_LOCK';

function rProofSteps(){
  return [
    ['01','요구 확인','요구사항과 기준 확인'],
    ['02','도면 검토','도면 분석 및 가공성 검토'],
    ['03','공정 설계','치공구/공정 조건 설계'],
    ['04','CNC 정밀 가공','자동선반 기반 반복 정밀가공'],
    ['05','측정/검사','치수·형상·표면 품질 확인'],
    ['06','세척·포장','이물 관리 및 안전 포장'],
    ['07','납품','일정 기반 안정 출하']
  ];
}
function rProofPayload(i){
  const s = rProofSteps()[i] || rProofSteps()[0];
  return {title:`${s[0]} ${s[1]}`, body:s[2], img:i<2?'company.jpg':i<4?'fields.jpg':i<5?'quality.jpg':'facilities.jpg', target:i<2?'company':i<4?'fields':i<5?'quality':'facilities', routeKey:'home', zone:'proof-'+i};
}
function rProofLoop(routeKey){ return ''; }
window.openRDetailFromPayload = (i)=>{ localStorage.setItem('DKT_FULL_DETAIL', JSON.stringify(rProofPayload(i))); localStorage.removeItem('DKT_DESKTOP_DETAIL'); render(); };

function desktopFunctionHint(){ return ''; }
function fullUxPayload(routeKey, zone='main'){
  const map={
    home:{hero:['대광테크 홈 핵심 화면','정밀가공 역량, 제품사례, 설비, 품질관리 흐름을 한 화면에서 확인합니다.','home.jpg','company'],left:['가공분야 카드','자동차·유압·전자·정밀 양산가공 분야별 대응 범위를 확인합니다.','fields.jpg','fields'],right:['제품·가공사례 미리보기','대표 가공품과 적용 분야를 확인합니다.','products.jpg','products'],process:['4D 제조 프로세스','요구 확인부터 납품까지 이어지는 제조 공정 흐름입니다.','home.jpg','fields'],bottom:['품질·설비 종합 확인','설비와 품질 지표를 함께 확인합니다.','quality.jpg','quality']},
    company:{hero:['회사소개 핵심 비주얼','대광테크의 정밀가공 신뢰성과 회사 역량을 확인합니다.','company.jpg','company'],left:['회사 개요','회사 정보, 사업분야, 주요 고객사, 품질 신뢰 항목을 확인합니다.','company.jpg','company'],right:['품질 신뢰','품질 운영 원칙과 검사 체계를 확인합니다.','quality.jpg','quality'],process:['회사 운영 4D 프로세스','요구 확인과 공정 검토 중심의 회사 운영 흐름을 확인합니다.','company.jpg','fields'],bottom:['핵심 경쟁력','정밀성, 일관성, 납기 준수 등 회사 운영 원칙을 확인합니다.','fields.jpg','fields']},
    fields:{hero:['가공분야 핵심 화면','산업별 정밀 가공 대응 범위와 설비 기반 역량을 확인합니다.','fields.jpg','fields'],left:['분야별 카드','자동차·유압·전자·정밀 양산가공 카드를 확인합니다.','fields.jpg','fields'],right:['적용 예시','제품군별 적용 사례와 가공 샘플을 확인합니다.','products.jpg','products'],process:['4D 대응 프로세스','도면 검토부터 검사 및 납품까지 분야별 대응 흐름입니다.','fields.jpg','quality'],bottom:['가공 샘플','다양한 형상의 정밀가공 샘플을 확인합니다.','products.jpg','products']},
    products:{hero:['제품·가공사례 핵심 화면','대표 가공품의 소재, 공정, 정밀도, 적용 분야를 확인합니다.','products.jpg','products'],left:['제품 이미지 갤러리','사진을 선택해 제품 상세 정보를 확인합니다.','products.jpg','products'],right:['대표 제품 상세','대표 사례의 주요 포인트와 가공 특성을 확인합니다.','products.jpg','facilities'],process:['소재·형상·반복생산','소재 대응, 형상 대응, 반복 생산 대응 역량을 확인합니다.','fields.jpg','fields'],bottom:['제품 사례 연계','가공분야, 설비, 품질 체계를 제품 사례와 함께 확인합니다.','quality.jpg','quality']},
    facilities:{hero:['설비현황 핵심 화면','자동선반 기반 정밀 가공 환경과 설비 운영 체계를 확인합니다.','facilities.jpg','facilities'],left:['대표 장비 환경','자동선반 라인, 정밀 측정/검사 장비, 세척·포장 설비를 확인합니다.','facilities.jpg','facilities'],right:['설비 스펙 패널','설비 개요와 운용 포인트를 확인합니다.','facilities.jpg','quality'],process:['4D 공정-설비 연계','도면 검토, 가공 실행, 측정/검사, 세척·포장·출하 흐름입니다.','facilities.jpg','quality'],bottom:['설비 운영 강점','생산 유연성, 정밀도 대응, 작업 안정성, 품질 일관성을 확인합니다.','facilities.jpg','quality']},
    quality:{hero:['품질관리 핵심 화면','정밀 검사와 체계적 품질관리 흐름을 확인합니다.','quality.jpg','quality'],left:['품질 KPI','합격률, 공정 관리 능력, 납기 준수율, 검사 기록 보관율을 확인합니다.','quality.jpg','quality'],right:['측정 장비 패널','품질관리 장비와 검사 체계를 확인합니다.','quality.jpg','facilities'],process:['품질 검사 프로세스','수입검사부터 출하검사까지 품질 검사 흐름입니다.','quality.jpg','quality'],bottom:['검사항목/검사체계','검사항목, 검사방법, 검사 기준, 기록 보관 체계를 확인합니다.','quality.jpg','quality']}
  };
  const a=(map[routeKey]||map.home)[zone] || (map[routeKey]||map.home).hero;
  return {title:a[0],body:a[1],img:a[2],target:a[3],routeKey,zone};
}

function FullDetailModal(){
  const raw=localStorage.getItem('DKT_FULL_DETAIL') || localStorage.getItem('DKT_DESKTOP_DETAIL');
  if(!raw) return '';
  let d; try{d=JSON.parse(raw)}catch{return ''}
  const chips=[fullUxRouteTitle(d.routeKey||current()), d.zone||'detail', '회사소개형', '클릭 기능'].filter(Boolean).map(c=>`<span>${esc(c)}</span>`).join('');
  const route=d.routeKey||current();
  const zone=d.zone||'hero';
  return `<aside class="full-detail-backdrop r-detail-backdrop" onclick="closeFullDetail()"><section class="full-detail-modal r-detail-modal" onclick="event.stopPropagation()"><button class="detail-close r-close" onclick="closeFullDetail()">×</button><div class="full-detail-visual r-detail-visual"><img src="./public/screens/${esc(d.img||'home.jpg')}" alt="${esc(d.title)}"><button onclick="openImageLightbox('${esc(d.img||'home.jpg')}','${esc(d.title||'상세 이미지')}')">이미지 크게 보기</button></div><div class="full-detail-copy r-detail-copy"><small>DAEKWANG TECH DETAIL</small><h2>${esc(d.title)}</h2><p>${esc(d.body)}</p><div class="full-detail-chips r-chips">${chips}</div><div class="full-detail-actions r-actions"><button onclick="closeFullDetail();go('${esc(d.target||'company')}')">관련 화면으로 이동 →</button><button class="ghost" onclick="desktopNextZone('${route}','${zone}',1)">다음 항목</button><button class="ghost" onclick="desktopNextZone('${route}','${zone}',-1)">이전 항목</button></div></div></section></aside>`;
}

function desktopScreen(routeKey){
  const r=routes[routeKey]||routes.home;
  const navLinks=nav.map((key,i)=>`<button class="hot nav-hot nav-${i} ${key===routeKey?'on':''}" onclick="go('${key}')" aria-label="${routes[key].label}"></button>`).join('');
  const isHome=routeKey==='home';
  const cleanCopy={
    company:['회사정보 보기','정밀가공 역량, 설비, 품질 체계를 한 화면에서 확인하세요.','핵심 경쟁력 보기 →','fields'],
    fields:['가공분야 확인','자동차·유압·전자·정밀 양산가공 대응 범위를 확인하세요.','제품 사례 보기 →','products'],
    products:['제품·가공사례 확인','보유 가공 사례와 반복 생산 대응 역량을 확인하세요.','설비현황 보기 →','facilities'],
    facilities:['설비현황 확인','자동선반 라인과 검사·세척·포장 설비 흐름을 확인하세요.','품질관리 보기 →','quality'],
    quality:['품질관리 확인','검사 프로세스와 품질 지표 중심의 관리 체계를 확인하세요.','회사소개로 이동 →','company']
  }[routeKey];
  return `<main class="screen-wrap company-only-screen full-functional r-initial-visual route-${routeKey}">
    <img class="exact-screen" src="./public/screens/${r.img}" alt="${r.label} exact screen" />
    ${cleanHeader(routeKey)}
    <div class="screen-mask logo-erase-mask" aria-hidden="true"></div>
    <img class="screen-mask brand-clean-logo" src="./public/screens/logo-angular-transparent.png" alt="DAE KWANG TECH" />
    <div class="screen-mask nav-out-mask" aria-hidden="true"></div>
    <div class="screen-mask top-cta-clean-mask" aria-hidden="true"></div>
    <button class="screen-mask top-company-btn" onclick="go('company')">회사소개 보기 →</button>
    <div class="screen-mask footer-out-mask" aria-hidden="true"></div>
    ${isHome?`<div class="screen-mask home-info-mask clean-panel"><b>대광테크 회사소개</b><span>CNC 자동선반 기반 정밀가공 역량과 설비·품질 체계를 확인하세요.</span><button onclick="go('company')">회사정보 보기 →</button></div>`:''}
    ${cleanCopy?`<div class="screen-mask page-clean-panel clean-panel"><b>${cleanCopy[0]}</b><span>${cleanCopy[1]}</span><button onclick="go('${cleanCopy[3]}')">${cleanCopy[2]}</button></div>`:''}
    ${routeKey==='products'?`<div class="screen-mask product-action-clean-mask" aria-hidden="true"></div><div class="screen-mask product-bottom-action-mask" aria-hidden="true"></div>`:''}
    ${cleanBottomPanel(routeKey)}
    ${routeKey==='home'?'<div class="screen-mask home-process-consult-mask" aria-hidden="true"></div><button class="screen-mask home-process-first-clean" onclick="openFullDesktopDetail(\'home\',\'process\')">요구 확인</button><div class="screen-mask home-lower-process-consult-mask" aria-hidden="true"></div><button class="screen-mask home-lower-process-first-clean" onclick="openFullDesktopDetail(\'home\',\'process\')">요구 확인</button><div class="screen-mask home-inquiry-card-mask" aria-hidden="true"></div>':''}
    ${navLinks}
    ${detailHotspots(routeKey)}
    ${desktopUniversalHotspots(routeKey)}
    <button class="hot cta-hot" onclick="go('company')" aria-label="회사소개 보기"></button>
    ${FullDetailModal()}${ImageLightbox()}
  </main>`;
}

function mobileDetailOverlay(){
  const raw=localStorage.getItem('DKT_MOBILE_DETAIL');
  if(!raw) return '';
  let d; try{d=JSON.parse(raw)}catch{return ''}
  const chips=(d.chips||['DAEKWANG','DETAIL']).filter(Boolean).slice(0,5).map(c=>`<span>${esc(c)}</span>`).join('');
  return `<aside class="mobile-detail-backdrop upgraded r-mobile-safe" onclick="mobileCloseDetail()"><section class="mobile-detail-panel upgraded r-mobile-panel" onclick="event.stopPropagation()"><button class="sheet-close" onclick="mobileCloseDetail()">×</button><div class="sheet-grip"></div><img src="${esc(d.img||'./public/screens/home.jpg')}" onclick="mobileZoomImage('${esc((d.img||'./public/screens/home.jpg').replace('./public/screens/',''))}','${esc(d.title||'상세 이미지')}')" alt="${esc(d.title)}"><div class="mobile-detail-body"><small>DETAIL VIEW</small><b>${esc(d.title)}</b><p>${esc(d.body)}</p><div class="mobile-detail-chips">${chips}</div><div class="mobile-detail-actions"><button onclick="mobileCloseDetail();go('${esc(d.target||'company')}')">${esc(d.primary||'관련 화면')}</button><button class="ghost" onclick="mobileCloseDetail();go('${esc(d.secondaryTarget||'home')}')">${esc(d.secondary||'관련 화면')}</button></div></div></section></aside>`;
}

try{ render(); }catch(e){ console.error('CT-R final render failed', e); }

// CT_X_FINAL_REMOVE_PUBLIC_BOTTOM_CTA_DETAIL_LOCK


/* DGTC admin image console graft from canonical admin package. Public desktop authority above remains locked. */


/* CT-ADMIN-IMG1~IMG8_EXACT_IMAGE_MANAGEMENT_CONSOLE_LOCK
   Scope: Admin console exact rebuild around image library / image upload / page reflection only.
   Public site remains unchanged. Admin old product/company modules stay as fallback but visible admin flow is image-centered.
*/
const DKT_ADMIN_IMAGE_LOCK = 'CT-ADMIN-IMG1~IMG8_EXACT_IMAGE_MANAGEMENT_CONSOLE_LOCK';
const imageSeedAssets = [
  {id:'IMG-001', file:'gear_assembly_03.jpg', title:'기어 어셈블리', category:'제품/가공', status:'승인 완료', size:'1.24 MB', res:'2400×1600', tags:['기어','조립','정밀가공'], page:'제품·가공사례', src:'./public/admin-assets/gear_assembly_03.jpg', usage:['메인 / 제품 소개','제품·가공사례','품질관리'], quality:'우수'},
  {id:'IMG-002', file:'cnc_process_02.jpg', title:'CNC 가공 공정', category:'공정', status:'승인 완료', size:'3.1 MB', res:'2400×1600', tags:['CNC','가공','정밀가공'], page:'가공분야', src:'./public/admin-assets/cnc_process_02.jpg', usage:['홈','가공분야'], quality:'우수'},
  {id:'IMG-003', file:'shaft_component_01.jpg', title:'샤프트 부품', category:'제품/가공', status:'승인 완료', size:'1.8 MB', res:'2400×1600', tags:['샤프트','부품'], page:'제품·가공사례', src:'./public/admin-assets/shaft_component_01.jpg', usage:['제품·가공사례'], quality:'우수'},
  {id:'IMG-004', file:'quality_inspection_04.jpg', title:'품질 검사 장비', category:'품질/검사', status:'보류', size:'2.2 MB', res:'2400×1600', tags:['품질','검사','측정'], page:'품질관리', src:'./public/admin-assets/quality_inspection_04.jpg', usage:['품질관리'], quality:'양호'},
  {id:'IMG-005', file:'factory_line_05.jpg', title:'자동화 생산 라인', category:'설비/현장', status:'승인 완료', size:'2.8 MB', res:'2400×1600', tags:['공장','생산라인','설비'], page:'설비현황', src:'./public/admin-assets/factory_line_05.jpg', usage:['회사소개','설비현황'], quality:'양호'},
  {id:'IMG-006', file:'coupling_parts_06.jpg', title:'커플링 부품 세트', category:'제품/가공', status:'승인 완료', size:'1.9 MB', res:'2400×1600', tags:['커플링','부품'], page:'제품·가공사례', src:'./public/admin-assets/coupling_parts_06.jpg', usage:['제품·가공사례'], quality:'우수'},
  {id:'IMG-007', file:'valve_block_07.jpg', title:'밸브 블록', category:'제품/가공', status:'승인 완료', size:'1.7 MB', res:'2400×1600', tags:['밸브','가공품'], page:'제품·가공사례', src:'./public/admin-assets/valve_block_07.jpg', usage:['가공분야','제품·가공사례'], quality:'우수'},
  {id:'IMG-008', file:'welding_process_08.jpg', title:'로봇 용접 공정', category:'공정', status:'보류', size:'2.6 MB', res:'2400×1600', tags:['용접','자동화'], page:'가공분야', src:'./public/admin-assets/welding_process_08.jpg', usage:['가공분야'], quality:'미확인'},
  {id:'IMG-009', file:'factory_plant_02.jpg', title:'공장 설비 전경', category:'설비/현장', status:'승인 완료', size:'2.5 MB', res:'2400×1600', tags:['시설','라인'], page:'설비현황', src:'./public/admin-assets/factory_plant_02.jpg', usage:['회사소개','설비현황'], quality:'양호'},
  {id:'IMG-010', file:'inspection_05.jpg', title:'정밀 측정 공정', category:'품질/검사', status:'승인 완료', size:'2.0 MB', res:'2400×1600', tags:['검사','측정'], page:'품질관리', src:'./public/admin-assets/inspection_05.jpg', usage:['품질관리'], quality:'우수'},
  {id:'IMG-011', file:'flange_part_09.jpg', title:'플랜지 가공품', category:'제품/가공', status:'미승인', size:'2.0 MB', res:'2400×1600', tags:['플랜지','CNC'], page:'제품·가공사례', src:'./public/admin-assets/flange_part_09.jpg', usage:['제품·가공사례'], quality:'확인 필요'},
  {id:'IMG-012', file:'product_case_10.jpg', title:'정밀 양산 부품', category:'제품/가공', status:'승인 완료', size:'1.6 MB', res:'2400×1600', tags:['양산','부품'], page:'가공분야', src:'./public/admin-assets/product_case_10.jpg', usage:['가공분야'], quality:'우수'},
];
function iaAssets(){
  try { const raw=JSON.parse(localStorage.getItem('DKT_IMAGE_ASSETS_V1')); if(Array.isArray(raw)&&raw.length) return raw; } catch {}
  localStorage.setItem('DKT_IMAGE_ASSETS_V1', JSON.stringify(imageSeedAssets));
  return clone(imageSeedAssets);
}
function iaSaveAssets(items, msg='이미지 저장 완료'){localStorage.setItem('DKT_IMAGE_ASSETS_V1', JSON.stringify(items)); toast(msg); render();}
function iaSelected(){const items=iaAssets(); const id=localStorage.getItem('DKT_IMAGE_SELECTED')||items[0]?.id; return items.find(x=>x.id===id)||items[0];}
function iaQueue(){try{return JSON.parse(localStorage.getItem('DKT_IMAGE_QUEUE_V1'))||[]}catch{return []}}
function iaSaveQueue(q,msg='업로드 대기열 저장'){localStorage.setItem('DKT_IMAGE_QUEUE_V1',JSON.stringify(q)); toast(msg); render();}
function iaFilterItems(items){const q=(localStorage.getItem('DKT_IA_SEARCH')||'').toLowerCase(); const cat=localStorage.getItem('DKT_IA_CAT')||'전체'; const st=localStorage.getItem('DKT_IA_STATUS')||'전체'; return items.filter(x=>(cat==='전체'||x.category===cat)&&(st==='전체'||x.status===st)&&[x.file,x.title,x.category,x.status,(x.tags||[]).join(' ')].join(' ').toLowerCase().includes(q));}
function iaStatusClass(s=''){return s.includes('완료')?'ok':s.includes('보류')?'hold':s.includes('미승인')?'wait':'temp'}
function iaIcon(i){const icons=['▧','⇪','◷','✓','◉','▣'];return icons[i%icons.length]}
function AdminLogin(){return `<main class="ia-login"><section><div class="ia-logo">DK</div><h1>DAE KWANG TECH</h1><p>이미지 관리 시스템</p><label>아이디<input id="login-id" value="admin@daekwang.co.kr"></label><label>비밀번호<input id="login-pw" type="password" value="demo1234"></label><button onclick="adminLogin()">로그인</button><button class="ghost" onclick="go('home')">사이트로 돌아가기</button></section></main>`}
function iaSide(active){const items=[['admin/dashboard','대시보드','⌂'],['admin/image-library','이미지 라이브러리','▧'],['admin/image-add','이미지 추가','⊕'],['admin/collections','앨범/컬렉션','▤'],['admin/page-map','페이지 반영','▱'],['admin/settings','설정','⚙']];return `<aside class="ia-side"><button class="ia-brand" onclick="go('admin/dashboard')"><span>DK</span><b>DAE KWANG TECH</b><small>이미지 관리 시스템</small></button><nav>${items.map(([k,l,ic])=>`<button class="${active===k?'on':''}" onclick="go('${k}')"><i>${ic}</i>${l}</button>`).join('')}</nav><div class="ia-user"><span>A</span><b>관리자</b><small>superadmin</small></div></aside>`}
function iaLayout(active,title,sub,body,right=''){return `<main class="ia-admin"><div class="ia-bg"></div>${iaSide(active)}<section class="ia-main"><header class="ia-top"><div><h1>${esc(title)}</h1><p>${esc(sub)}</p></div><div class="ia-search"><input placeholder="이미지, 태그, 카테고리 검색..." value="${esc(localStorage.getItem('DKT_IA_SEARCH')||'')}" oninput="iaSearch(this.value)"><kbd>⌘K</kbd></div><button class="ia-icon">◌</button><button class="ia-bell">8</button></header>${body}</section>${right}</main>`}
function iaKpis(items=iaAssets()){
 const done=items.filter(x=>x.status==='승인 완료').length, hold=items.filter(x=>x.status==='보류').length, wait=items.filter(x=>x.status==='미승인').length;
 const cards=[['전체 이미지',items.length.toLocaleString(),'+128 이번 주','▧'],['업로드 현황','248','+31 이번 주','⇪'],['승인 대기',wait+hold,'검토 필요','◷'],['승인 완료',done.toLocaleString(),'사용 가능','✓'],['저장 공간','651.2 GB','/ 1.0 TB','▣']];
 return `<section class="ia-kpis">${cards.map((c,i)=>`<article><i>${c[3]}</i><small>${c[0]}</small><b>${c[1]}</b><span>${c[2]}</span></article>`).join('')}</section>`;
}
function iaThumbCard(x,selected=false){return `<button class="ia-card ${selected?'sel':''}" onclick="iaSelect('${esc(x.id)}')"><img src="${esc(x.src)}" alt="${esc(x.title)}"><span class="ia-check">${selected?'✓':''}</span><b>${esc(x.file)}</b><small><em>${esc(x.status)}</em><span>${esc(x.res)}</span></small><div>${(x.tags||[]).slice(0,2).map(t=>`<i>${esc(t)}</i>`).join('')}</div></button>`}
function iaRightPanel(x=iaSelected()){if(!x)return '';return `<aside class="ia-right"><button class="ia-primary full" onclick="go('admin/image-add')">⇪ 이미지 추가</button><section class="ia-panel selected"><div class="ia-panel-head"><h2>상세 정보</h2><button onclick="iaClearSelect()">×</button></div><img class="ia-preview" src="${esc(x.src)}" alt="${esc(x.title)}"><h3>${esc(x.file)}</h3><span class="ia-badge ${iaStatusClass(x.status)}">${esc(x.status)}</span><div class="ia-meta"><p><b>해상도</b><span>${esc(x.res)}</span></p><p><b>파일 크기</b><span>${esc(x.size)}</span></p><p><b>카테고리</b><span>${esc(x.category)}</span></p><p><b>업로드자</b><span>관리자</span></p></div><h4>태그</h4><div class="ia-tags">${(x.tags||[]).map(t=>`<span>${esc(t)}</span>`).join('')}<button onclick="iaTagPrompt('${esc(x.id)}')">+</button></div><h4>사용 위치 (${(x.usage||[]).length})</h4><ul class="ia-usage">${(x.usage||[]).map(u=>`<li>${esc(u)}<span>반영됨</span></li>`).join('')}</ul><div class="ia-actions"><button onclick="go('admin/page-map')">페이지 반영</button><button class="ghost" onclick="iaToggleApprove('${esc(x.id)}')">상태 변경</button></div></section></aside>`}
function AdminImageDashboard(){const items=iaAssets();const selected=iaSelected();const filtered=iaFilterItems(items).slice(0,12);const recent=items.slice(0,5);const body=`${iaKpis(items)}<section class="ia-dash-grid"><div class="ia-library"><div class="ia-panel-head"><h2>이미지 라이브러리</h2><button onclick="go('admin/image-library')">전체 보기</button></div>${iaFilters()}<div class="ia-grid">${filtered.map(x=>iaThumbCard(x,selected&&x.id===selected.id)).join('')}</div><footer class="ia-pager"><b>총 ${items.length.toLocaleString()}개</b><span>‹</span><em>1</em><span>2</span><span>3</span><span>4</span><span>5</span><span>…</span><span>250</span><span>›</span><button>20개씩 보기⌄</button></footer></div><aside class="ia-dash-side"><section class="ia-panel quick"><h2>빠른 작업</h2><button class="ia-primary" onclick="go('admin/image-add')">⇪ 이미지 업로드</button><button onclick="go('admin/image-add')">⊕ 이미지 등록</button><button onclick="iaSeedQueue()">⇧ 일괄 업로드</button><button onclick="go('admin/collections')">▤ 카테고리 생성</button><button onclick="go('admin/page-map')">▱ 페이지 반영</button></section><section class="ia-panel recent"><div class="ia-panel-head"><h2>최근 업로드</h2><button onclick="go('admin/image-library')">전체 보기</button></div>${recent.map(x=>`<button onclick="iaSelect('${esc(x.id)}')"><img src="${esc(x.src)}"><span><b>${esc(x.file)}</b><small>${esc(x.category)} · 2024.05.20</small></span></button>`).join('')}</section><section class="ia-panel chart"><h2>카테고리 요약</h2><div class="donut"><b>${items.length.toLocaleString()}</b><small>전체</small></div><ul><li><i></i>제품 42%</li><li><i></i>공정 23%</li><li><i></i>품질 16%</li><li><i></i>시설 14%</li></ul></section></aside></section><section class="ia-status"><article><i>◷</i><b>승인 대기</b><strong>${items.filter(x=>x.status!=='승인 완료').length}</strong><span>검토 필요 이미지</span></article><article><i>✓</i><b>승인 완료</b><strong>${items.filter(x=>x.status==='승인 완료').length}</strong><span>사용 가능한 이미지</span></article><article><i>×</i><b>보류</b><strong>${items.filter(x=>x.status==='보류').length}</strong><span>재검토 필요</span></article><article><i>▣</i><b>임시 저장</b><strong>${iaQueue().length}</strong><span>대기열 이미지</span></article></section>`; return iaLayout('admin/dashboard','이미지 관리','이미지 자산을 등록, 관리, 승인하고 효율적으로 활용하세요.',body);}
function iaFilters(){return `<div class="ia-filters"><select onchange="iaSet('DKT_IA_CAT',this.value)"><option>전체</option><option>제품/가공</option><option>공정</option><option>품질/검사</option><option>설비/현장</option></select><select onchange="iaSet('DKT_IA_STATUS',this.value)"><option>전체</option><option>승인 완료</option><option>보류</option><option>미승인</option></select><select><option>전체 해상도</option><option>2400×1600</option></select><select><option>최신순</option><option>이름순</option></select><button>필터</button></div>`}
function AdminImageLibrary(){const items=iaFilterItems(iaAssets()); const sel=iaSelected()||items[0]; const body=`${iaKpis(iaAssets())}<section class="ia-lib-full"><div class="ia-tabs"><button class="on">전체</button><button>제품/가공</button><button>조립/완성</button><button>설비/현장</button><button>품질/검사</button><button>기타</button></div>${iaFilters()}<p class="ia-count">검색 결과 ${items.length.toLocaleString()}건</p><div class="ia-grid large">${items.map(x=>iaThumbCard(x,sel&&x.id===sel.id)).join('')}</div><footer class="ia-pager"><b>총 ${items.length.toLocaleString()}개</b><span>‹</span><em>1</em><span>2</span><span>3</span><span>4</span><span>5</span><span>…</span><span>125</span><span>›</span><button>20개씩 보기⌄</button></footer></section>`; return iaLayout('admin/image-library','이미지 라이브러리','등록된 이미지를 검색하고 관리하세요.',body,iaRightPanel(sel));}
function AdminImageAdd(){const q=iaQueue(); const body=`<section class="ia-upload"><div class="ia-breadcrumb">‹ 이미지 관리 › 새 이미지 등록</div><div class="ia-drop" ondragover="event.preventDefault()" ondrop="iaDrop(event)"><i>⇪</i><h2>드래그 앤 드롭으로 이미지를 업로드하세요</h2><p>또는 파일을 선택하여 업로드할 수 있습니다.</p><input id="ia-file-input" type="file" accept="image/*" multiple hidden onchange="iaPick(event)"><button onclick="document.getElementById('ia-file-input').click()">파일 선택</button><small>JPG, PNG, WebP 지원 · 최대 100개 파일 · 최대 50MB / 파일</small></div><div class="ia-queue"><div class="ia-panel-head"><h2>업로드 대기열 (${q.length||6})</h2><div><button onclick="iaClearQueue()">전체 삭제</button><button onclick="iaRegisterQueue()">모두 완료</button></div></div>${(q.length?q:iaDemoQueue()).map((x,i)=>iaQueueRow(x,i)).join('')}<footer><b>총 ${(q.length||6)}개 파일</b><span>완료: ${q.filter(x=>x.status==='업로드 완료').length} · 대기: ${Math.max(0,(q.length||6)-q.filter(x=>x.status==='업로드 완료').length)}</span></footer></div><div class="ia-bottom-actions"><button onclick="iaSaveQueue(iaQueue(),'임시 저장 완료')">임시저장</button><button onclick="iaUploadAll()" class="ia-primary">⇪ 업로드 시작</button><button onclick="iaRegisterQueue()" class="ia-primary">✓ 등록 완료</button></div></section>`; const right=`<aside class="ia-right add"><section class="ia-panel"><h2>상세 정보</h2><label>설명<input id="ia-new-desc" placeholder="이미지에 대한 설명을 입력하세요."></label><label>카테고리<select id="ia-new-cat"><option>제품/가공</option><option>공정</option><option>설비/현장</option><option>품질/검사</option></select></label><label>태그<input id="ia-new-tags" placeholder="태그를 입력하고 Enter"></label><h3>공개 여부</h3><div class="ia-choice"><button class="on">공개</button><button>비공개</button></div><h3>품질 검사</h3><ul class="ia-checks"><li>✓ 해상도 2400×1600 이상</li><li>✓ 파일 크기 50MB 이하</li><li>✓ JPG, PNG, WebP</li><li>✓ 정상 파일</li></ul></section></aside>`; return iaLayout('admin/image-add','이미지 추가','이미지를 업로드하고 정보를 입력하여 라이브러리에 추가하세요.',body,right);}
function iaDemoQueue(){return iaAssets().slice(0,6).map((x,i)=>({...x,progress:i<3?100:i===3?85:0,status:i<3?'업로드 완료':i===3?'업로드 중':'대기 중'}))}
function iaQueueRow(x,i){return `<article class="ia-qrow"><img src="${esc(x.src)}"><span><b>${esc(x.file)}</b><small>${esc(x.size||'2.4 MB')} · ${esc(x.res||'2400×1600')}</small></span><div class="ia-progress"><em style="width:${Number(x.progress||0)}%"></em><small>${esc(x.status||'대기 중')}</small></div><b class="ia-quality ${Number(x.progress||0)>=100?'ok':''}">${x.quality||'미확인'}</b><button onclick="iaRemoveQueue(${i})">×</button></article>`}
function AdminImagePageMap(){const x=iaSelected()||iaAssets()[0]; const body=`<div class="ia-detail-page"><section class="ia-big-preview"><h2>선택한 이미지</h2><img src="${esc(x.src)}"><div class="ia-zoom"><button>−</button><span>33%</span><button>＋</button><button>⛶</button></div></section><section class="ia-panel ia-edit"><h2>이미지 정보</h2><label>파일명<input value="${esc(x.file)}" disabled></label><label>제목<input id="ia-edit-title" value="${esc(x.title)}"></label><label>카테고리<select id="ia-edit-cat"><option>${esc(x.category)}</option><option>제품/가공</option><option>공정</option><option>설비/현장</option><option>품질/검사</option></select></label><label>설명<input id="ia-edit-desc" value="${esc(x.title)} 이미지"></label><button class="ia-primary" onclick="iaSaveSelectedMeta()">정보 저장</button></section><section class="ia-panel ia-crop"><h2>크롭 및 초점 설정</h2><div class="ia-ratios"><button>자유</button><button>1:1</button><button class="on">16:9</button><button>4:3</button><button>3:2</button></div><div class="ia-cropbox"><img src="${esc(x.src)}"><span>＋</span></div><div class="ia-focus"><button>↖</button><button>↑</button><button>↗</button><button>←</button><button class="on">＋</button><button>→</button><button>↙</button><button>↓</button><button>↘</button></div></section><aside class="ia-panel ia-versions"><h2>이미지 관리</h2><button class="ia-primary" onclick="go('admin/image-add')">이미지 교체</button><h3>버전 히스토리</h3><button><img src="${esc(x.src)}"><span>v2.0 현재<br>2024-05-20</span></button><button><img src="${esc(x.src)}"><span>v1.1<br>2024-05-18</span></button><h3>이 이미지가 사용되는 페이지</h3><ul>${['홈','회사소개','가공분야','제품·가공사례','설비현황','품질관리'].map((p,i)=>`<li>${p}<b>${i===0?3:i===3?4:1}</b></li>`).join('')}</ul></aside></div><section class="ia-page-cards"><h2>페이지 반영 영역</h2>${['홈','회사소개','가공분야','제품·가공사례','설비현황','품질관리'].map((p,i)=>`<article><b>${p}</b><img src="${esc(i%2?x.src:'./public/admin-assets/selected_large.jpg')}"><span>${i+1}</span></article>`).join('')}</section>`; return iaLayout('admin/page-map','이미지 상세 / 페이지 반영','선택한 이미지의 정보, 크롭, 사용 위치를 관리하세요.',body);}
function AdminImageCollections(){const items=iaAssets(); const cats=['제품/가공','공정','설비/현장','품질/검사','기타']; const body=`<section class="ia-collections">${cats.map((c,i)=>`<article><i>${iaIcon(i)}</i><h2>${c}</h2><b>${items.filter(x=>x.category===c).length}</b><p>대표 이미지와 태그를 관리합니다.</p><button onclick="iaSet('DKT_IA_CAT','${esc(c)}');go('admin/image-library')">이미지 보기</button></article>`).join('')}</section>`; return iaLayout('admin/collections','컬렉션','이미지를 카테고리와 컬렉션으로 정리하세요.',body);}
function AdminImageSettings(){const body=`<section class="ia-settings"><article><h2>운영 범위</h2><p>이 관리자 콘솔은 이미지 라이브러리, 이미지 추가, 페이지 반영을 중심으로 동작합니다.</p></article><article><h2>데이터 저장</h2><p>현재 파일 납품판은 브라우저 localStorage 기반 이미지 관리 데모입니다. 실제 서버 저장소/보안 권한은 별도 운영 개발 범위입니다.</p></article><article><h2>내보내기</h2><button onclick="iaExport()">이미지 데이터 JSON 내보내기</button><button onclick="iaReset()">초기 이미지로 복구</button></article></section>`; return iaLayout('admin/settings','설정','이미지 관리 시스템의 동작 범위와 데이터를 관리합니다.',body);}
function adminApp(routeKey){ if(!isAuthed() && routeKey!=='admin/login') return AdminLogin(); if(routeKey==='admin/login') return AdminLogin(); if(['admin/dashboard','admin/ops'].includes(routeKey)) return AdminImageDashboard(); if(['admin/image-library','admin/products','admin/content','admin/company','admin/facilities','admin/quality','admin/flow','admin/preview'].includes(routeKey)) return AdminImageLibrary(); if(['admin/image-add','admin/image-upload','admin/image-register'].includes(routeKey)) return AdminImageAdd(); if(routeKey==='admin/collections') return AdminImageCollections(); if(routeKey==='admin/page-map') return AdminImagePageMap(); if(routeKey==='admin/settings') return AdminImageSettings(); return AdminImageDashboard(); }
function iaSelect(id){localStorage.setItem('DKT_IMAGE_SELECTED',id);render()}
function iaClearSelect(){localStorage.removeItem('DKT_IMAGE_SELECTED');render()}
function iaSearch(v){localStorage.setItem('DKT_IA_SEARCH',v);render()}
function iaSet(k,v){localStorage.setItem(k,v);render()}
function iaSeedQueue(){localStorage.setItem('DKT_IMAGE_QUEUE_V1', JSON.stringify(iaDemoQueue()));go('admin/image-add')}
function iaClearQueue(){localStorage.removeItem('DKT_IMAGE_QUEUE_V1');toast('대기열 비움');render()}
function iaRemoveQueue(i){const q=iaQueue();q.splice(i,1);iaSaveQueue(q,'대기열 수정')}
function iaUploadAll(){const q=iaQueue().length?iaQueue():iaDemoQueue();iaSaveQueue(q.map(x=>({...x,progress:100,status:'업로드 완료'})),'업로드 완료')}
function iaRegisterQueue(){const q=iaQueue().length?iaQueue():iaDemoQueue();const items=iaAssets();const add=q.map((x,i)=>({...x,id:'UP-'+Date.now()+'-'+i,status:'승인 완료',usage:['이미지 라이브러리'],progress:100}));iaSaveAssets([...add,...items].slice(0,80),'이미지 등록 완료');localStorage.removeItem('DKT_IMAGE_QUEUE_V1');go('admin/image-library')}
function iaDrop(ev){ev.preventDefault();iaHandleFiles(ev.dataTransfer.files)}
function iaPick(ev){iaHandleFiles(ev.target.files)}
function iaHandleFiles(files){const list=[...files].filter(f=>f.type.startsWith('image/')).slice(0,12); if(!list.length){toast('이미지 파일을 선택하세요');return;} const q=iaQueue(); let pending=list.length; list.forEach((file,idx)=>{const reader=new FileReader(); reader.onload=()=>{q.push({id:'Q-'+Date.now()+'-'+idx,file:file.name,title:file.name.replace(/\.[^.]+$/,''),category:document.getElementById('ia-new-cat')?.value||'제품/가공',status:'대기 중',size:(file.size/1024/1024).toFixed(1)+' MB',res:'업로드 이미지',tags:(document.getElementById('ia-new-tags')?.value||'신규').split(',').map(x=>x.trim()).filter(Boolean),page:'이미지 라이브러리',src:reader.result,usage:['이미지 라이브러리'],quality:'미확인',progress:0}); pending--; if(!pending) iaSaveQueue(q,'이미지 대기열 추가');}; reader.readAsDataURL(file);});}
function iaToggleApprove(id){const items=iaAssets();const x=items.find(a=>a.id===id);if(x){x.status=x.status==='승인 완료'?'보류':'승인 완료';iaSaveAssets(items,'상태 변경 완료')}}
function iaTagPrompt(id){const tag=prompt('태그 추가'); if(!tag)return; const items=iaAssets(); const x=items.find(a=>a.id===id); if(x){x.tags=[...(x.tags||[]),tag].slice(0,8);iaSaveAssets(items,'태그 추가 완료')}}
function iaSaveSelectedMeta(){const items=iaAssets();const x=iaSelected(); if(!x)return; const n=items.find(a=>a.id===x.id); if(n){n.title=document.getElementById('ia-edit-title')?.value||n.title;n.category=document.getElementById('ia-edit-cat')?.value||n.category;iaSaveAssets(items,'이미지 정보 저장 완료')}}
function iaExport(){const blob=new Blob([JSON.stringify(iaAssets(),null,2)],{type:'application/json'});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='dgtc-image-assets.json';a.click();URL.revokeObjectURL(a.href);toast('JSON 내보내기 완료')}
function iaReset(){localStorage.setItem('DKT_IMAGE_ASSETS_V1',JSON.stringify(imageSeedAssets));localStorage.removeItem('DKT_IMAGE_QUEUE_V1');toast('초기 이미지 복구');render()}
window.iaSelect=iaSelect;window.iaClearSelect=iaClearSelect;window.iaSearch=iaSearch;window.iaSet=iaSet;window.iaSeedQueue=iaSeedQueue;window.iaClearQueue=iaClearQueue;window.iaRemoveQueue=iaRemoveQueue;window.iaUploadAll=iaUploadAll;window.iaRegisterQueue=iaRegisterQueue;window.iaDrop=iaDrop;window.iaPick=iaPick;window.iaToggleApprove=iaToggleApprove;window.iaTagPrompt=iaTagPrompt;window.iaSaveSelectedMeta=iaSaveSelectedMeta;window.iaExport=iaExport;window.iaReset=iaReset;

try{ render(); }catch(e){ console.error('CT-R final render failed', e); }

// CT_X_FINAL_REMOVE_PUBLIC_BOTTOM_CTA_DETAIL_LOCK
