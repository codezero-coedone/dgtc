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
  return (desktopDetails[routeKey]||[]).map((d,i)=>`<button class="detail-hot ${esc(d.cls)}" onclick="openDesktopDetail('${routeKey}',${i})" aria-label="${esc(d.title)} 자세히 보기"></button>`).join('');
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
function cleanBottomPanel(routeKey){
  const map={
    home:['대광테크 정밀가공 역량 보기','회사소개·가공분야·제품사례·설비·품질 체계를 한 번에 확인하세요.','회사소개 보기','company','제품사례 보기','products'],
    company:['회사 핵심 역량 확인','정밀가공 경험, 설비, 품질 운영 원칙을 회사소개 화면에서 확인하세요.','가공분야 보기','fields','품질관리 보기','quality'],
    fields:['가공분야별 대응 역량','자동차·유압·전자·정밀 양산가공 영역을 제품 사례와 함께 확인하세요.','제품사례 보기','products','설비현황 보기','facilities'],
    products:['제품·가공사례 상세 확인','사진과 패널을 클릭해 대표 사례, 소재, 형상, 반복 생산 대응 정보를 확인하세요.','제품 상세 보기','products','품질관리 보기','quality'],
    facilities:['설비 기반 생산 환경 확인','자동선반 라인, 측정·검사, 세척·포장 설비의 운영 흐름을 확인하세요.','품질관리 보기','quality','가공분야 보기','fields'],
    quality:['품질관리 체계 확인','검사 프로세스와 품질 KPI, 측정 장비 체계를 확인하세요.','설비현황 보기','facilities','회사소개 보기','company']
  };
  const c=map[routeKey]||map.home;
  return `<section class="screen-mask clean-bottom-panel" aria-label="회사소개형 탐색 패널">
    <div><b>${esc(c[0])}</b><span>${esc(c[1])}</span></div>
    <button onclick="go('${esc(c[3])}')">${esc(c[2])} →</button>
    <button class="ghost" onclick="go('${esc(c[5])}')">${esc(c[4])} →</button>
  </section>`;
}

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
    ${routeKey==='products'?`<div class="screen-mask product-action-clean-mask" aria-hidden="true"></div><button class="screen-mask product-detail-clean-btn" onclick="openDesktopDetail('products',1)">제품 상세 보기 →</button><div class="screen-mask product-bottom-action-mask" aria-hidden="true"></div>`:''}
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
function MobileHome(){const d=cms();return `${MobileTop()}<main class="mobile-app"><section class="m-hero"><span>CNC 자동선반 전문 가공업체</span><h1>정밀함이 만드는 차이,<br><mark>제조 경쟁력</mark>입니다.</h1><p>${esc(d.companyInfo.intro)}</p><div class="m-kpi"><b><small>월 생산</small>${esc(d.companyInfo.monthlyCapacity||'120만+')}</b><b><small>설비</small>${esc(d.companyInfo.equipmentCount||'32대+')}</b><b><small>품질</small>${esc(d.companyInfo.qualityRate||'99.2%')}</b></div></section><section class="m-actions"><button onclick="go('company')">회사소개</button><button onclick="go('products')">제품 보기</button><button onclick="go('facilities')">설비 현황</button></section>${Flow()}<section class="m-card"><div class="m-head"><b>가공분야</b><button onclick="go('fields')">전체</button></div><div class="m-feed">${productCards.slice(0,3).map(([t,desc,img])=>`<article onclick="go('fields')"><img src="${img}"><div><b>${t}</b><p>${desc}</p><span>자세히 보기 →</span></div></article>`).join('')}</div></section></main><button class="m-sticky" onclick="go('company')">회사정보 보기</button>${Bottom('home')}`}
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
  return `<aside class="mobile-detail-backdrop" onclick="mobileCloseDetail()"><section class="mobile-detail-panel" onclick="event.stopPropagation()"><button class="sheet-close" onclick="mobileCloseDetail()">×</button><img src="${esc(d.img||'./public/screens/home.jpg')}" alt="${esc(d.title)}"><div class="mobile-detail-body"><small>DETAIL VIEW</small><b>${esc(d.title)}</b><p>${esc(d.body)}</p><div class="mobile-detail-chips">${chips}</div><div class="mobile-detail-actions"><button onclick="mobileCloseDetail();go('${esc(d.target||'company')}')">${esc(d.primary||'상세 보기')}</button><button class="ghost" onclick="mobileCloseDetail();go('${esc(d.secondaryTarget||'home')}')">${esc(d.secondary||'관련 화면')}</button></div></div></section></aside>`;
}
window.mobileOpenDetail=(kind,id)=>{localStorage.setItem('DKT_MOBILE_DETAIL', JSON.stringify(mobileUxPayload(kind,id))); render();};
window.mobileOpenVisual=(kind,id)=>window.mobileOpenDetail(kind,id);
window.mobileOpenProduct=(id)=>{localStorage.setItem('DKT_MOBILE_PRODUCT',id); localStorage.setItem('DKT_MOBILE_DETAIL', JSON.stringify(mobileUxPayload('product',id))); render();};
window.mobileCloseDetail=()=>{localStorage.removeItem('DKT_MOBILE_DETAIL'); render();};
window.mobileCloseSheet=()=>{localStorage.removeItem('DKT_MOBILE_PRODUCT');localStorage.removeItem('DKT_MOBILE_DETAIL');render()};
function MobileTop(){return `<header class="m-top upgraded"><button onclick="go('home')" aria-label="홈"><img class="m-logo" src="./public/screens/logo-angular-transparent.png" alt="DAE KWANG TECH" /></button><strong>DAE KWANG TECH</strong><button class="m-top-link" onclick="go('company')">회사정보</button></header>`}
function Flow(title='4D 제조 플로우', list=cms().flows.map(f=>f.title)){return `<section class="m-card m-flow-card"><div class="m-head"><b>${title}</b><span>PROCESS</span></div><div class="m-flow">${list.map((s,i)=>`<button onclick="mobileOpenDetail('flow','${i}')"><em>${String(i+1).padStart(2,'0')}</em><b>${esc(s)}</b><small>${i<list.length-1?'→':'✓'}</small></button>`).join('')}</div></section>`}
function MobileHome(){const d=cms();return `${MobileTop()}<main class="mobile-app mux"><section class="m-hero" onclick="mobileOpenDetail('homeHero')"><span>CNC 자동선반 전문 가공업체</span><h1>정밀함이 만드는 차이,<br><mark>제조 경쟁력</mark>입니다.</h1><p>${esc(d.companyInfo.intro)}</p><div class="m-kpi"><button onclick="event.stopPropagation();mobileOpenDetail('quality','q1')"><small>월 생산</small>${esc(d.companyInfo.monthlyCapacity||'120만+')}</button><button onclick="event.stopPropagation();go('facilities')"><small>설비</small>${esc(d.companyInfo.equipmentCount||'32대+')}</button><button onclick="event.stopPropagation();go('quality')"><small>품질</small>${esc(d.companyInfo.qualityRate||'99.2%')}</button></div></section><section class="m-actions"><button onclick="go('company')">회사소개</button><button onclick="go('products')">제품 보기</button><button onclick="go('facilities')">설비 현황</button></section>${Flow()}<section class="m-card"><div class="m-head"><b>가공분야</b><button onclick="go('fields')">전체</button></div><div class="m-feed">${productCards.slice(0,3).map(([t,desc,img])=>`<article onclick="mobileOpenDetail('field','${esc(t)}')"><img src="${img}" alt="${esc(t)}"><div><b>${t}</b><p>${desc}</p><span>자세히 보기 →</span></div></article>`).join('')}</div></section></main>${mobileDetailOverlay()}<button class="m-sticky" onclick="go('company')">회사정보 보기</button>${Bottom('home')}`}
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
    company:{hero:['회사소개 핵심 비주얼','대광테크의 정밀가공 신뢰성과 회사 역량을 확인합니다.','company.jpg','company'],left:['회사 개요','회사 정보, 사업분야, 주요 고객사, 품질 신뢰 항목을 확인합니다.','company.jpg','company'],right:['인증 및 신뢰','품질 운영 원칙과 인증/추천 정보를 확인합니다.','quality.jpg','quality'],process:['회사 운영 4D 프로세스','협의 과정 대신 회사 운영 흐름 중심으로 공정 체계를 확인합니다.','company.jpg','fields'],bottom:['핵심 경쟁력','정밀성, 일관성, 납기 준수 등 회사 운영 원칙을 확인합니다.','fields.jpg','fields']},
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
    ${routeKey==='products'?`<div class="screen-mask product-action-clean-mask" aria-hidden="true"></div><button class="screen-mask product-detail-clean-btn" onclick="openFullDesktopDetail('products','right')">제품 상세 보기 →</button><div class="screen-mask product-bottom-action-mask" aria-hidden="true"></div>`:''}
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
  return `<aside class="mobile-detail-backdrop upgraded" onclick="mobileCloseDetail()"><section class="mobile-detail-panel upgraded" onclick="event.stopPropagation()"><button class="sheet-close" onclick="mobileCloseDetail()">×</button><div class="sheet-grip"></div><img src="${esc(d.img||'./public/screens/home.jpg')}" onclick="mobileZoomImage('${esc((d.img||'./public/screens/home.jpg').replace('./public/screens/',''))}','${esc(d.title||'상세 이미지')}')" alt="${esc(d.title)}"><div class="mobile-detail-body"><small>DETAIL VIEW · TAP IMAGE TO ZOOM</small><b>${esc(d.title)}</b><p>${esc(d.body)}</p><div class="mobile-detail-chips">${chips}</div><div class="mobile-detail-actions"><button onclick="mobileCloseDetail();go('${esc(d.target||'company')}')">${esc(d.primary||'상세 보기')}</button><button class="ghost" onclick="mobileCloseDetail();go('${esc(d.secondaryTarget||'home')}')">${esc(d.secondary||'관련 화면')}</button></div></div></section></aside>`;
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
function MobileHome(){const d=cms();return `${MobileTop()}<main class="mobile-app mux fullux"><section class="m-hero clickable" onclick="mobileOpenDetail('homeHero')"><span>CNC 자동선반 전문 가공업체</span><h1>정밀함이 만드는 차이,<br><mark>제조 경쟁력</mark>입니다.</h1><p>${esc(d.companyInfo.intro)}</p><div class="m-kpi"><button onclick="event.stopPropagation();mobileOpenDetail('quality','q1')"><small>월 생산</small>${esc(d.companyInfo.monthlyCapacity||'120만+')}</button><button onclick="event.stopPropagation();mobileOpenDetail('facilitiesHero')"><small>설비</small>${esc(d.companyInfo.equipmentCount||'32대+')}</button><button onclick="event.stopPropagation();mobileOpenDetail('quality','q3')"><small>품질</small>${esc(d.companyInfo.qualityRate||'99.2%')}</button></div><span class="tap-cue">화면 상세 보기 →</span></section><section class="m-actions full"><button onclick="go('company')">회사소개</button><button onclick="go('products')">제품 보기</button><button onclick="go('facilities')">설비 현황</button></section>${Flow()}<section class="m-card"><div class="m-head"><b>가공분야</b><button onclick="go('fields')">전체</button></div><div class="m-feed">${productCards.slice(0,3).map(([t,desc,img])=>`<article onclick="mobileOpenDetail('field','${esc(t)}')"><img src="${img}" alt="${esc(t)}"><div><b>${t}</b><p>${desc}</p><span>자세히 보기 →</span></div></article>`).join('')}</div></section></main>${mobileDetailOverlay()}${mobileImageZoom()}<button class="m-sticky full" onclick="go('${ctaTargetFor('home')}')">${ctaLabelFor('home')}</button>${Bottom('home')}`}
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


/* CT-LIVE-QA1~QA8 LIVE URL DESKTOP+MOBILE FUNCTION AUDIT PATCH
   Purpose: live quality route audit response, restore all clickable UX across desktop/mobile/admin. */
const CT_LIVE_QA_PATCH = 'CT-LIVE-QA1~QA8 desktop/mobile/admin full interaction audit applied';
function uxRouteLabel(key){ return routes[key]?.label || '회사소개'; }
function uxOpenRoute(key){ localStorage.removeItem('DKT_MOBILE_DETAIL'); localStorage.removeItem('DKT_MOBILE_PRODUCT'); localStorage.removeItem('DKT_FULL_DETAIL'); localStorage.removeItem('DKT_IMAGE_LIGHTBOX'); go(key); }
function uxDetailFromElement(el){
  const routeKey=current();
  const title=el?.dataset?.uxTitle || el?.getAttribute?.('aria-label') || uxRouteLabel(routeKey);
  const target=el?.dataset?.uxTarget || (routeKey==='home'?'company':routeKey);
  const img=el?.dataset?.uxImg || ({home:'home.jpg',company:'company.jpg',fields:'fields.jpg',products:'products.jpg',facilities:'facilities.jpg',quality:'quality.jpg'}[routeKey]||'home.jpg');
  const body=el?.dataset?.uxBody || '대광테크의 정밀가공 역량, 설비, 품질 체계를 상세 화면으로 확인합니다.';
  return {title, body, img, target, routeKey, zone: el?.dataset?.uxZone || 'live'};
}
window.openUxDetail=(payload={})=>{ localStorage.setItem('DKT_FULL_DETAIL', JSON.stringify(payload)); render(); };
window.openMobileUxDetail=(payload={})=>{ localStorage.setItem('DKT_MOBILE_DETAIL', JSON.stringify(payload)); render(); };
function addDesktopLiveHotspots(routeKey){
  const items=[
    ['hero','화면 핵심 정보','현재 화면의 핵심 회사소개 정보를 확인합니다.'],
    ['left','주요 사진/카드','사진과 카드 영역의 상세 내용을 확인합니다.'],
    ['right','우측 상세 패널','우측 패널의 세부 정보를 확인합니다.'],
    ['process','4D 공정 흐름','공정과 품질 흐름을 단계별로 확인합니다.'],
    ['bottom','하단 정보 패널','하단 연결 정보와 관련 화면으로 이동합니다.']
  ];
  const routeImg=({home:'home.jpg',company:'company.jpg',fields:'fields.jpg',products:'products.jpg',facilities:'facilities.jpg',quality:'quality.jpg'}[routeKey]||'home.jpg');
  return items.map(([zone,title,body])=>`<button class="live-ux-hot live-${zone}" data-ux-zone="${zone}" data-ux-title="${esc(title)}" data-ux-body="${esc(body)}" data-ux-img="${routeImg}" data-ux-target="${routeKey==='home'?'company':routeKey}" onclick="openFullDesktopDetail('${routeKey}','${zone}')" aria-label="${esc(title)} 상세"></button>`).join('');
}
const __livePrevDesktopScreen = desktopScreen;
desktopScreen = function(routeKey){
  const html = __livePrevDesktopScreen(routeKey);
  return html.replace('</main>', `${addDesktopLiveHotspots(routeKey)}<div class="screen-mask live-click-guide" onclick="openFullDesktopDetail('${routeKey}','hero')">사진·패널 클릭 가능</div></main>`);
};
function mScreenImgFor(kind,id){
  if(kind==='product'){
    const p=cms().products.find(x=>x.id===id); return p?.image || './public/screens/products.jpg';
  }
  if(kind==='facility'){
    const f=cms().facilities.find(x=>x.id===id); return f?.image || './public/screens/facilities.jpg';
  }
  if(kind==='field'){
    const f=productCards.find(x=>x[0]===id); return f?.[2] || './public/screens/fields.jpg';
  }
  return ({homeHero:'./public/screens/home.jpg',companyHero:'./public/screens/company.jpg',fieldsHero:'./public/screens/fields.jpg',productsHero:'./public/screens/products.jpg',facilitiesHero:'./public/screens/facilities.jpg',qualityHero:'./public/screens/quality.jpg'}[kind]||'./public/screens/home.jpg');
}
const __livePrevMobileOpenDetail = window.mobileOpenDetail;
window.mobileOpenDetail=(kind,id)=>{
  let payload = typeof mobileUxPayload==='function' ? mobileUxPayload(kind,id) : null;
  if(!payload || !payload.title){ payload={title:'상세 정보', body:'대광테크의 정밀가공 정보를 확인합니다.', img:mScreenImgFor(kind,id), target:'company'}; }
  payload.img = payload.img || mScreenImgFor(kind,id);
  payload.chips = payload.chips || ['터치 상세','회사소개형','대광테크'];
  payload.primary = payload.primary || '관련 화면 보기';
  payload.secondary = payload.secondary || '회사정보 보기';
  payload.secondaryTarget = payload.secondaryTarget || 'company';
  localStorage.setItem('DKT_MOBILE_DETAIL', JSON.stringify(payload));
  render();
};
function enhanceMobileClickability(){
  if(!document.body.classList.contains('qa-enhanced')) document.body.classList.add('qa-enhanced');
  if(window.__DKT_LIVE_QA_DELEGATE) return;
  window.__DKT_LIVE_QA_DELEGATE = true;
  document.addEventListener('click',(e)=>{
    if(!isMobile()) return;
    const target=e.target;
    if(target.closest('.mobile-detail-panel,.mobile-sheet,.mobile-zoom,.m-bottom,.m-top,button')) return;
    const article=target.closest('.m-feed article');
    if(article){
      const txt=article.querySelector('b')?.textContent?.trim() || '상세 정보';
      const img=article.querySelector('img')?.getAttribute('src') || './public/screens/home.jpg';
      openMobileUxDetail({title:txt, body:'사진과 카드 정보를 상세 패널로 확인합니다. 관련 화면으로 이어서 이동할 수 있습니다.', img, chips:['사진 상세','터치 가능','관련 화면'], primary:'관련 화면 보기', target:current(), secondary:'회사정보 보기', secondaryTarget:'company'});
      return;
    }
    const visual=target.closest('.m-card.visual,.m-hero,.m-title');
    if(visual){
      const txt=visual.querySelector('b,h1')?.textContent?.trim() || uxRouteLabel(current());
      const img=visual.querySelector('img')?.getAttribute('src') || mScreenImgFor(current()+'Hero');
      openMobileUxDetail({title:txt, body:'이 영역은 상세 정보와 관련 화면 이동이 가능한 앱형 패널입니다.', img, chips:['상세 보기','앱 UI','대광테크'], primary:'현재 화면 보기', target:current(), secondary:'회사정보 보기', secondaryTarget:'company'});
    }
  }, false);
}
const __livePrevRender = render;
render=function(){ __livePrevRender(); enhanceMobileClickability(); };
function LiveQaNotice(){ return `<div class="live-qa-marker" aria-hidden="true">CT-LIVE-QA FULL UX ACTIVE</div>`; }
try{render();}catch(e){console.error('CT-LIVE-QA render fail',e)}

/* CT-DIRECT-USE-AUDIT-POLISH
   File was opened and checked directly. Patch keeps all UX functions alive while removing dirty helper UI and fixing product tap flow.
*/
window.mobileOpenProduct=(id)=>{
  localStorage.setItem('DKT_MOBILE_PRODUCT', id);
  localStorage.removeItem('DKT_MOBILE_DETAIL');
  localStorage.removeItem('DKT_MOBILE_ZOOM');
  render();
};
const __directAuditPrevEnhance = enhanceMobileClickability;
enhanceMobileClickability = function(){
  __directAuditPrevEnhance();
  if(window.__DKT_DIRECT_AUDIT_DELEGATE) return;
  window.__DKT_DIRECT_AUDIT_DELEGATE = true;
  document.addEventListener('click',(e)=>{
    if(!isMobile()) return;
    const explicitProduct = e.target.closest?.('.m-feed.products article');
    if(explicitProduct) return; // product cards use bottom-sheet flow first; image inside sheet opens detail/zoom
  }, true);
};
const __directAuditPrevMobileCloseSheet = window.mobileCloseSheet;
window.mobileCloseSheet=()=>{localStorage.removeItem('DKT_MOBILE_PRODUCT');localStorage.removeItem('DKT_MOBILE_DETAIL');localStorage.removeItem('DKT_MOBILE_ZOOM');render();};
try{ render(); }catch(e){ console.error('CT-DIRECT-USE-AUDIT polish render failed', e); }


/* CT-HUMAN1~HUMAN5 HUMAN-FINISH POLISH PATCH
   Purpose: reduce AI/prototype feel with concrete manufacturing copy, quieter actions, and customer-ready wording while preserving every UX function. */
const CT_HUMAN_POLISH_VERSION = 'CT-HUMAN1~HUMAN5 human finish polish 2026-07-07';
const humanCompanyCopy = {
  name:'대광테크 / DAE KWANG TECH',
  ceo:'이원근 이사',
  phone:'055-323-7157',
  mobile:'010-9256-7475',
  email:'ndh7157@hanmail.net',
  address:'경남 김해시 한림면 신천리 984',
  hours:'평일 08:30 - 17:30',
  intro:'김해 한림면에서 CNC 자동선반 기반 소형 정밀 금속부품을 가공하며, 자동차·유압·전자 부품의 반복 생산과 출하 전 검사를 함께 관리합니다.',
  founded:'2005년',
  businessArea:'CNC 자동선반 소형 정밀부품 가공 / 자동차·유압·전자부품 양산 대응',
  monthlyCapacity:'120만개+',
  equipmentCount:'32대+',
  qualityRate:'99.2%',
  principle1:'치수 안정성',
  principle2:'반복 생산성',
  principle3:'출하 전 검사'
};
const humanProducts = [
  {id:'AUTO-2024-0001', title:'자동차 변속기용 밸브 바디', category:'자동차부품', material:'SCM415', process:'CNC 자동선반 + 복합가공', tolerance:'±0.005 mm', status:'공개', image:'./public/screens/products.jpg', description:'자동차 구동계에 사용되는 소형 정밀 부품으로, 반복 생산 시 치수 편차와 표면 상태를 함께 관리하는 가공 사례입니다.'},
  {id:'HYD-2024-0015', title:'유압 카트리지 연결 부품', category:'유압부품', material:'SUS304', process:'선삭/복합가공', tolerance:'Ra 0.4 μm', status:'공개', image:'./public/screens/fields.jpg', description:'고압 유압 라인에 적용되는 연결 부품으로, 내구성·나사부 정밀도·가공면 품질을 기준으로 관리합니다.'},
  {id:'ELEC-2024-0008', title:'전자 커넥터 하우징', category:'전자부품', material:'AL6061', process:'소형 정밀가공', tolerance:'±0.004 mm', status:'공개', image:'./public/screens/home.jpg', description:'전자 장치 조립용 소형 하우징 부품으로, 얇은 형상과 반복 치수 안정성이 필요한 가공 사례입니다.'},
  {id:'PREC-2024-0021', title:'SUS 정밀 샤프트', category:'정밀 양산가공', material:'SUS316', process:'선반/밀링 연계', tolerance:'±0.003 mm', status:'공개', image:'./public/screens/quality.jpg', description:'정밀 축류 부품의 반복 생산 사례입니다. 외경·동심도·표면 상태를 출하 전 검사 기준으로 관리합니다.'}
];
const humanFacilities = [
  {id:'EQ-01', name:'CNC 자동선반 생산 라인', type:'가공', status:'가동', spec:'소형 금속 부품 반복 생산을 위한 자동선반 가공 라인', image:'./public/screens/facilities.jpg'},
  {id:'EQ-02', name:'치수·형상 측정 장비', type:'검사', status:'가동', spec:'핵심 치수, 형상, 공차 확인을 위한 출하 전 검사 장비', image:'./public/screens/quality.jpg'},
  {id:'EQ-03', name:'세척·포장 후공정 구역', type:'후공정', status:'가동', spec:'가공 후 세척, 육안 확인, 포장, 출하 상태 관리', image:'./public/screens/facilities.jpg'}
];
const humanQuality = [
  {id:'q1', label:'월간 출하 합격률', value:'99.2%', note:'출하 전 검사 기준'},
  {id:'q2', label:'핵심 치수 관리', value:'±0.005', note:'대표 가공품 기준'},
  {id:'q3', label:'납기 준수율', value:'99%+', note:'월간 출하 기준'},
  {id:'q4', label:'검사 기록 관리', value:'LOT', note:'반복 생산 이력 관리'}
];
const humanFlows = [
  {id:'f1', title:'사양 확인', body:'제품 용도, 소재, 수량, 기준 치수를 먼저 확인합니다.'},
  {id:'f2', title:'도면 검토', body:'가공 가능 형상, 공차, 표면 요구사항을 검토합니다.'},
  {id:'f3', title:'공정 설계', body:'자동선반 가공 순서와 검사 기준을 정리합니다.'},
  {id:'f4', title:'정밀 가공', body:'CNC 자동선반 중심으로 반복 생산을 진행합니다.'},
  {id:'f5', title:'출하 검사', body:'핵심 치수와 외관 상태를 확인합니다.'},
  {id:'f6', title:'세척·포장', body:'세척, 포장, 라벨링 후 출하 상태를 정리합니다.'}
];
function isGenericText(v){ return !v || /정밀함|제조 경쟁력|최상의 제품|정밀 금속 부품 제조 전문|신규 등록 제품 설명|대표 가공 사례|대광테크의 정밀가공 정보/.test(String(v)); }
function applyHumanPolishData(){
  try{
    if(localStorage.getItem('DKT_HUMAN_POLISH_V1')==='applied') return;
    const d = cms();
    d.companyInfo = {...d.companyInfo};
    for(const [k,v] of Object.entries(humanCompanyCopy)){
      if(k==='intro' || k==='businessArea' || k==='principle1' || k==='principle2' || k==='principle3'){
        if(isGenericText(d.companyInfo[k])) d.companyInfo[k]=v;
      } else if(!d.companyInfo[k]) d.companyInfo[k]=v;
    }
    if(!Array.isArray(d.products) || d.products.length<3 || d.products.some(p=>isGenericText(p.description))){ d.products = humanProducts.map(x=>({...x})); }
    if(!Array.isArray(d.facilities) || d.facilities.length<3 || d.facilities.some(f=>isGenericText(f.spec))){ d.facilities = humanFacilities.map(x=>({...x})); }
    if(!Array.isArray(d.quality) || d.quality.length<4 || d.quality.some(q=>String(q.label||'').includes('FTQ'))){ d.quality = humanQuality.map(x=>({...x})); }
    if(!Array.isArray(d.flows) || d.flows.length<5 || d.flows.some(f=>String(f.title||'').includes('요구 확인'))){ d.flows = humanFlows.map(x=>({...x})); }
    d.audit = [{time:new Date().toLocaleString('ko-KR'), action:'CT-HUMAN 실제 업종 문구/제품 정보 마감 적용', actor:'system'}, ...(d.audit||[])].slice(0,30);
    localStorage.setItem('DKT_COMPANY_CMS_V1', JSON.stringify(d));
    localStorage.setItem('DKT_HUMAN_POLISH_V1','applied');
  }catch(e){ console.warn('CT-HUMAN data polish skipped',e); }
}
try{
  seedCms.companyInfo = {...seedCms.companyInfo, ...humanCompanyCopy};
  seedCms.products = humanProducts.map(x=>({...x}));
  seedCms.facilities = humanFacilities.map(x=>({...x}));
  seedCms.quality = humanQuality.map(x=>({...x}));
  seedCms.flows = humanFlows.map(x=>({...x}));
  productCards[0] = ['자동차부품','변속기·구동계 소형 정밀부품','./public/screens/products.jpg'];
  productCards[1] = ['유압부품','고압 라인 연결부·카트리지류','./public/screens/fields.jpg'];
  productCards[2] = ['전자부품','커넥터·하우징 소형 부품','./public/screens/home.jpg'];
  productCards[3] = ['정밀 양산가공','샤프트·부싱류 반복 생산','./public/screens/quality.jpg'];
}catch(e){}
Object.assign(desktopDetails.home[0], {title:'자동차 구동계 부품', body:'SCM 계열 소재의 밸브 바디·샤프트류처럼 반복 치수 안정성이 필요한 자동차 부품 가공 영역입니다.'});
Object.assign(desktopDetails.home[1], {title:'유압 연결 부품', body:'SUS 계열 소재와 나사부 정밀도가 중요한 유압 카트리지·연결 부품 가공 영역입니다.'});
Object.assign(desktopDetails.home[2], {title:'전자 커넥터 부품', body:'AL 계열 소형 하우징과 커넥터류처럼 얇은 형상과 조립 안정성이 필요한 부품을 다룹니다.'});
Object.assign(desktopDetails.home[3], {title:'정밀 양산 대응', body:'소량 샘플보다 반복 생산에서 치수 편차, 표면 상태, 출하 검사 기준을 관리하는 생산 흐름입니다.'});
Object.assign(desktopDetails.products[0], {title:'제품 사진 갤러리', body:'사진을 선택하면 실제 소재, 공정, 공차, 적용 분야를 확인할 수 있습니다. 장식용 갤러리가 아니라 제품 정보 진입점입니다.'});
Object.assign(desktopDetails.facilities[0], {title:'CNC 자동선반 라인', body:'소형 정밀 금속부품 반복 생산을 위한 자동선반 중심의 생산 환경입니다.'});
Object.assign(desktopDetails.quality[0], {title:'출하 전 품질 기준', body:'합격률, 핵심 치수, 납기, 검사 기록을 기준으로 제품별 출하 상태를 관리합니다.'});
mobileUxMap.homeHero = {title:'김해 CNC 자동선반 정밀가공', body:'대광테크는 김해 한림면에서 자동차·유압·전자부품용 소형 금속부품을 반복 생산하고, 출하 전 검사 기준으로 품질을 관리합니다.', img:'./public/screens/home.jpg', primary:'회사소개 보기', target:'company', secondary:'제품사례 보기', secondaryTarget:'products'};
mobileUxMap.fieldsHero = {title:'가공분야', body:'자동차 구동계, 유압 연결부품, 전자 커넥터 하우징, SUS 샤프트류까지 소재와 형상 기준으로 가공 범위를 구분합니다.', img:'./public/screens/fields.jpg', primary:'제품사례 보기', target:'products', secondary:'설비현황 보기', secondaryTarget:'facilities'};
mobileUxMap.productsHero = {title:'제품·가공사례', body:'제품 사진을 선택하면 소재, 공정, 치수 기준, 반복 생산 대응 정보를 상세 패널로 확인할 수 있습니다.', img:'./public/screens/products.jpg', primary:'설비현황 보기', target:'facilities', secondary:'품질관리 보기', secondaryTarget:'quality'};
mobileUxMap.facilitiesHero = {title:'설비현황', body:'CNC 자동선반, 검사 장비, 세척·포장 후공정이 제품 출하 흐름과 연결됩니다.', img:'./public/screens/facilities.jpg', primary:'품질관리 보기', target:'quality', secondary:'가공분야 보기', secondaryTarget:'fields'};
mobileUxMap.qualityHero = {title:'품질관리', body:'핵심 치수와 외관 상태를 출하 전 확인하고, 반복 생산 이력 기준으로 관리합니다.', img:'./public/screens/quality.jpg', primary:'설비현황 보기', target:'facilities', secondary:'회사소개 보기', secondaryTarget:'company'};
function Flow(title='4D 생산 흐름', list=cms().flows.map(f=>f.title)){
  return `<section class="m-card m-flow-card human-flow"><div class="m-head"><b>${title}</b><span>PROCESS</span></div><div class="m-flow">${list.map((s,i)=>`<button onclick="mobileOpenDetail('flow','${i}')"><em>${String(i+1).padStart(2,'0')}</em><b>${esc(s)}</b><small>${i<list.length-1?'→':'✓'}</small></button>`).join('')}</div></section>`;
}
function MobileHome(){const d=cms();return `${MobileTop()}<main class="mobile-app mux fullux human-copy"><section class="m-hero clickable" onclick="mobileOpenDetail('homeHero')"><span>김해 CNC 자동선반 정밀가공</span><h1>소형 금속부품을<br><mark>반복 생산 기준</mark>으로 관리합니다.</h1><p>${esc(d.companyInfo.intro)}</p><div class="m-kpi"><button onclick="event.stopPropagation();mobileOpenDetail('quality','q1')"><small>월 생산</small>${esc(d.companyInfo.monthlyCapacity||'120만개+')}</button><button onclick="event.stopPropagation();mobileOpenDetail('facilitiesHero')"><small>설비</small>${esc(d.companyInfo.equipmentCount||'32대+')}</button><button onclick="event.stopPropagation();mobileOpenDetail('quality','q3')"><small>품질</small>${esc(d.companyInfo.qualityRate||'99.2%')}</button></div><span class="tap-cue">회사 역량 보기 →</span></section><section class="m-actions full"><button onclick="go('company')">회사소개</button><button onclick="go('products')">제품사례</button><button onclick="go('facilities')">설비현황</button></section>${Flow('생산 운영 흐름')}<section class="m-card"><div class="m-head"><b>가공분야</b><button onclick="go('fields')">전체</button></div><div class="m-feed">${productCards.slice(0,3).map(([t,desc,img])=>`<article onclick="mobileOpenDetail('field','${esc(t)}')"><img src="${img}" alt="${esc(t)}"><div><b>${t}</b><p>${desc}</p><span>분야 상세 보기 →</span></div></article>`).join('')}</div></section></main>${mobileDetailOverlay()}${mobileImageZoom()}<button class="m-sticky full" onclick="go('${ctaTargetFor('home')}')">${ctaLabelFor('home')}</button>${Bottom('home')}`}
function MobileCompany(){const d=cms();const c=d.companyInfo;return `${MobileTop()}<main class="mobile-app mux fullux human-copy"><section class="m-title clickable" onclick="mobileOpenDetail('companyHero')"><span>COMPANY PROFILE</span><h1>김해 기반<br><mark>CNC 자동선반 가공</mark> 전문</h1><p>${esc(c.intro)}</p><span class="tap-cue">회사 상세 보기 →</span></section><section class="m-card clickable" onclick="mobileOpenDetail('companyHero')"><div class="m-head"><b>회사 개요</b><span>PROFILE</span></div><ul class="m-info-list"><li><b>회사명</b><span>${esc(c.name)}</span></li><li><b>사업분야</b><span>${esc(c.businessArea||'CNC 자동선반 가공')}</span></li><li><b>설립연도</b><span>${esc(c.founded||'-')}</span></li><li><b>주소</b><span>${esc(c.address)}</span></li></ul></section><section class="m-card"><div class="m-head"><b>운영 기준</b><span>CAPABILITY</span></div><div class="m-kpi quality interactive"><button onclick="mobileOpenDetail('quality','q1')"><small>월 생산</small>${esc(c.monthlyCapacity||'-')}</button><button onclick="mobileOpenDetail('facilitiesHero')"><small>설비</small>${esc(c.equipmentCount||'-')}</button><button onclick="mobileOpenDetail('quality','q3')"><small>품질</small>${esc(c.qualityRate||'-')}</button><button onclick="mobileOpenDetail('flow','0')"><small>원칙</small>${esc(c.principle1||'치수 안정성')}</button></div></section>${Flow('회사 운영 흐름')}</main>${mobileDetailOverlay()}${mobileImageZoom()}<button class="m-sticky full" onclick="go('${ctaTargetFor('company')}')">${ctaLabelFor('company')}</button>${Bottom('home')}`}
function MobileFields(){const active=localStorage.getItem('DKT_FIELD_SEG')||'자동차부품';const [title,desc,img]=productCards.find(p=>p[0]===active)||productCards[0];return `${MobileTop()}<main class="mobile-app mux fullux human-copy"><section class="m-title clickable" onclick="mobileOpenDetail('fieldsHero')"><span>MACHINING FIELDS</span><h1>소재와 형상에 맞춘<br>가공분야 구분</h1><span class="tap-cue">가공분야 상세 보기 →</span></section><div class="m-segments">${productCards.map(([t])=>`<button class="${active===t?'on':''}" onclick="mobileSetField('${t}')">${t.replace('부품','')}</button>`).join('')}</div><section class="m-card visual clickable" onclick="mobileOpenDetail('field','${esc(active)}')"><img src="${img}" alt="${esc(title)}"><b>${title} 가공</b><p>${desc}. 적용 소재, 형상, 치수 기준에 따라 공정 순서를 설계합니다.</p><span class="m-card-link">사진/패널 상세 보기 →</span></section>${Flow('가공 대응 흐름',['사양 확인','소재 검토','공정 설계','정밀 가공','출하 검사'])}</main>${mobileDetailOverlay()}${mobileImageZoom()}<button class="m-sticky full" onclick="go('${ctaTargetFor('fields')}')">${ctaLabelFor('fields')}</button>${Bottom('fields')}`}
function mobileUxPayload(kind, id){
  const d=cms();
  if(kind==='product'){
    const p=d.products.find(x=>x.id===id) || d.products[0];
    if(!p) return mobileUxMap.productsHero;
    return {title:p.title, body:`${p.material} · ${p.process} · ${p.tolerance}. ${p.description||'제품별 가공 기준을 확인합니다.'}`, img:p.image, chips:[p.category,p.material,p.status], primary:'관련 설비 보기', target:'facilities', secondary:'품질 기준 보기', secondaryTarget:'quality'};
  }
  if(kind==='field'){
    const f=productCards.find(x=>x[0]===id) || productCards[0];
    return {title:`${f[0]} 가공`, body:`${f[1]}. 제품 사진과 설비 흐름을 함께 확인해 실제 생산 범위를 판단할 수 있습니다.`, img:f[2], chips:['가공분야','소재/형상','반복생산'], primary:'제품사례 보기', target:'products', secondary:'설비현황 보기', secondaryTarget:'facilities'};
  }
  if(kind==='facility'){
    const f=d.facilities.find(x=>x.id===id) || d.facilities[0];
    return {title:f.name, body:`${f.spec}. 제품별 가공 공정과 출하 전 검사 흐름 안에서 운용되는 설비입니다.`, img:f.image, chips:[f.type,f.status,'설비'], primary:'품질관리 보기', target:'quality', secondary:'가공분야 보기', secondaryTarget:'fields'};
  }
  if(kind==='quality'){
    const q=d.quality.find(x=>x.id===id) || d.quality[0];
    return {title:q.label, body:`기준값 ${q.value}. ${q.note||'제품별 출하 기준으로 관리합니다.'}`, img:'./public/screens/quality.jpg', chips:['품질관리',q.value,q.note||'출하 기준'], primary:'설비현황 보기', target:'facilities', secondary:'회사소개 보기', secondaryTarget:'company'};
  }
  if(kind==='flow'){
    const f=d.flows[Number(id)] || {title:id,body:'생산 흐름 단계'};
    return {title:`생산 흐름 · ${f.title}`, body:f.body||'단계별 생산 흐름을 확인합니다.', img:'./public/screens/home.jpg', chips:['4D','생산흐름','공정'], primary:'가공분야 보기', target:'fields', secondary:'품질관리 보기', secondaryTarget:'quality'};
  }
  return mobileUxMap[kind] || mobileUxMap.homeHero;
}
function desktopHumanHint(){ return `<div class="human-polish-marker" aria-hidden="true">CT-HUMAN POLISH ACTIVE</div>`; }
const __humanPrevDesktopScreen = desktopScreen;
desktopScreen = function(routeKey){
  const html = __humanPrevDesktopScreen(routeKey);
  return html.replace('</main>', `${desktopHumanHint()}</main>`);
};
applyHumanPolishData();
try{ render(); }catch(e){ console.error('CT-HUMAN polish render failed', e); }

/* CT-FINAL-FUNC-LOCK: logo/header cleanup + whole-screen click delegate + product/detail action reliability */
const CT_FINAL_FUNC_LOCK = 'CT-FINAL-FUNC-LOCK logo/header/product/photo/detail functions repaired';
function cleanHeader(routeKey){
  const labels = nav.map(key=>`<button class="clean-nav-btn ${key===routeKey?'on':''}" onclick="go('${key}')">${esc(routes[key].label)}</button>`).join('');
  return `<header class="screen-mask clean-live-header final-clean-header" aria-label="대광테크 회사소개 네비게이션">
    <button class="clean-brand final-clean-brand" onclick="go('home')" aria-label="대광테크 홈"><img src="./public/screens/logo-angular-transparent.png" alt="DAE KWANG TECH"></button>
    <nav>${labels}</nav>
    <button class="clean-header-cta" onclick="go('company')">회사소개 보기 →</button>
  </header>`;
}
function openRouteDetailByZone(routeKey, zone){
  if(typeof openFullDesktopDetail === 'function') return openFullDesktopDetail(routeKey, zone || 'hero');
  const list = desktopDetails[routeKey] || [];
  const idx = zone==='right'?1:zone==='process'?2:0;
  return openDesktopDetail(routeKey, Math.min(idx, Math.max(0, list.length-1)));
}
function desktopZoneFromPoint(routeKey, x, y){
  if(y < .075) return 'nav';
  if(routeKey==='products'){
    if(y < .28) return 'hero';
    if(y < .67) return x < .46 ? 'left' : 'right';
    if(y < .84) return 'bottom';
    return 'bottom';
  }
  if(routeKey==='home'){
    if(y < .34) return 'hero';
    if(y < .55) return x < .49 ? 'left' : 'right';
    if(y < .73) return 'process';
    return 'bottom';
  }
  if(routeKey==='company'){
    if(y < .39) return 'hero';
    if(y < .56) return 'left';
    if(y < .78) return x < .33 ? 'left' : x < .77 ? 'process' : 'right';
    return 'bottom';
  }
  if(routeKey==='fields'){
    if(y < .33) return 'hero';
    if(y < .52) return 'left';
    if(y < .75) return 'process';
    return 'bottom';
  }
  if(routeKey==='facilities'){
    if(y < .37) return 'hero';
    if(y < .58) return 'left';
    if(y < .74) return 'process';
    return 'bottom';
  }
  if(routeKey==='quality'){
    if(y < .28) return 'hero';
    if(x > .68 && y < .82) return 'right';
    if(y < .50) return 'left';
    if(y < .72) return 'process';
    return 'bottom';
  }
  return 'hero';
}
if(!window.__DKT_FINAL_DESKTOP_DELEGATE){
  window.__DKT_FINAL_DESKTOP_DELEGATE = true;
  document.addEventListener('click',(e)=>{
    if(isMobile()) return;
    const key = current();
    if(key.startsWith('admin')) return;
    if(e.target.closest('.full-detail-modal,.desktop-detail-modal,.image-lightbox,.clean-live-header,button,a,input,textarea,select')) return;
    const wrap = e.target.closest('.screen-wrap');
    if(!wrap) return;
    const rect = wrap.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    const zone = desktopZoneFromPoint(key, x, y);
    if(zone==='nav') return;
    openRouteDetailByZone(key, zone);
  }, true);
}
const __finalFuncPrevOpenFull = window.openFullDesktopDetail;
window.openFullDesktopDetail=(routeKey,zone)=>{
  let payload = typeof fullUxPayload === 'function' ? fullUxPayload(routeKey,zone) : null;
  const img = ({home:'home.jpg',company:'company.jpg',fields:'fields.jpg',products:'products.jpg',facilities:'facilities.jpg',quality:'quality.jpg'}[routeKey]||'home.jpg');
  if(!payload || !payload.title){ payload = {routeKey, zone, title:'상세 정보', body:'대광테크 회사소개형 상세 정보를 확인합니다.', img, target:routeKey}; }
  payload.img = payload.img || img;
  payload.primary = payload.primary || '관련 화면 보기';
  payload.target = payload.target || routeKey;
  localStorage.setItem('DKT_FULL_DETAIL', JSON.stringify(payload));
  localStorage.removeItem('DKT_DESKTOP_DETAIL');
  render();
};
const __finalFuncPrevRender = render;
render = function(){ __finalFuncPrevRender(); document.body.classList.add('final-function-lock'); };
try{ document.body.classList.add('final-function-lock'); }catch(e){}
try{ render(); }catch(e){ console.warn('CT-FINAL-FUNC-LOCK render skipped', e); }

/* CT-CLICK-LOCK1~6 COMPLETE CLICK FUNCTION LOCK PATCH
   Purpose: every visible desktop/mobile photo, card, panel, CTA and detail area must respond.
   This patch fixes pointer-event conflicts from exact-image overlays by adding a coordinate-based desktop click bridge
   and a capture-phase mobile tap bridge while preserving company-only/no-contact policy.
*/
function dktNormalizedPoint(e, wrap){
  const rect = wrap.getBoundingClientRect();
  return { x: ((e.clientX - rect.left) / Math.max(rect.width,1)) * 100, y: ((e.clientY - rect.top) / Math.max(rect.height,1)) * 100 };
}
function dktHeaderRouteFromPoint(x){
  if(x < 20) return 'home';
  if(x >= 24 && x < 31) return 'home';
  if(x >= 31 && x < 39) return 'company';
  if(x >= 39 && x < 47) return 'fields';
  if(x >= 47 && x < 58) return 'products';
  if(x >= 58 && x < 66) return 'facilities';
  if(x >= 66 && x < 76) return 'quality';
  if(x >= 82) return 'company';
  return null;
}
function dktDesktopZoneFromPoint(routeKey,x,y){
  if(y <= 7.2){ const headerRoute=dktHeaderRouteFromPoint(x); return headerRoute ? {type:'route', target:headerRoute} : null; }
  if(routeKey === 'products'){
    if(y < 29) return {type:'detail', zone:'hero'};
    if(y >= 29 && y < 67){ return {type:'detail', zone:x < 50 ? 'left':'right'}; }
    if(y >= 67 && y < 86) return {type:'detail', zone:'bottom'};
    return {type:'route', target:'company'};
  }
  if(routeKey === 'home'){
    if(y < 35.5) return {type:'detail', zone:'hero'};
    if(y < 55.5) return {type:'detail', zone:x < 58 ? 'left':'right'};
    if(y < 74.5) return {type:'detail', zone:x < 58 ? 'process':'right'};
    if(y < 89.5) return {type:'detail', zone:'bottom'};
    return {type:'route', target:'company'};
  }
  if(routeKey === 'company'){
    if(y < 37) return {type:'detail', zone:'hero'};
    if(y < 58) return {type:'detail', zone:x < 72 ? 'left':'right'};
    if(y < 79) return {type:'detail', zone:x < 44 ? 'left': x < 82 ? 'process':'right'};
    return {type:'detail', zone:'bottom'};
  }
  if(routeKey === 'fields'){
    if(y < 31) return {type:'detail', zone:'hero'};
    if(y < 52) return {type:'detail', zone:x < 52 ? 'left':'right'};
    if(y < 75) return {type:'detail', zone:'process'};
    return {type:'detail', zone:'bottom'};
  }
  if(routeKey === 'facilities'){
    if(y < 36) return {type:'detail', zone:'hero'};
    if(y < 60) return {type:'detail', zone:'left'};
    if(y < 74) return {type:'detail', zone:'process'};
    return {type:'detail', zone:'bottom'};
  }
  if(routeKey === 'quality'){
    if(y < 26) return {type:'detail', zone:'hero'};
    if(y < 52) return {type:'detail', zone:x < 71 ? 'left':'right'};
    if(y < 76) return {type:'detail', zone:x < 71 ? 'process':'right'};
    return {type:'detail', zone:'bottom'};
  }
  return {type:'detail', zone:'hero'};
}
function dktOpenDesktopByPoint(routeKey,x,y){
  const action=dktDesktopZoneFromPoint(routeKey,x,y);
  if(!action) return false;
  if(action.type==='route'){ go(action.target); return true; }
  if(action.type==='detail'){ openFullDesktopDetail(routeKey, action.zone || 'hero'); return true; }
  return false;
}
function dktInstallDesktopClickLock(){
  if(window.__DKT_CLICK_LOCK_DESKTOP__) return;
  window.__DKT_CLICK_LOCK_DESKTOP__=true;
  document.addEventListener('click',(e)=>{
    if(isMobile()) return;
    const key=current();
    if(key.startsWith('admin')) return;
    if(e.target.closest('.full-detail-modal,.desktop-detail-modal,.image-lightbox,.cmd-palette,.cmd-backdrop,.admin-live')) return;
    const clickable=e.target.closest('button,a,input,select,textarea,label');
    if(clickable && !clickable.classList.contains('exact-screen')) return;
    const wrap=e.target.closest('.company-only-screen');
    if(!wrap) return;
    const p=dktNormalizedPoint(e,wrap);
    const handled=dktOpenDesktopByPoint(key,p.x,p.y);
    if(handled){ e.preventDefault(); e.stopPropagation(); }
  }, true);
}
function dktOpenMobileDetailByElement(el, fallbackKind='homeHero'){
  if(!el) return false;
  const img=el.querySelector('img')?.getAttribute('src') || mScreenImgFor(fallbackKind);
  const title=(el.querySelector('b,h1')?.textContent || uxRouteLabel(current()) || '대광테크 상세').trim();
  const body=(el.querySelector('p')?.textContent || '사진, 패널, 품질·설비 정보를 앱형 상세 화면으로 확인합니다.').trim();
  openMobileUxDetail({title, body, img, chips:['터치 상세','사진/패널','기능 활성'], primary:'현재 화면 보기', target:current(), secondary:'회사정보 보기', secondaryTarget:'company'});
  return true;
}
function dktInstallMobileClickLock(){
  if(window.__DKT_CLICK_LOCK_MOBILE__) return;
  window.__DKT_CLICK_LOCK_MOBILE__=true;
  document.addEventListener('click',(e)=>{
    if(!isMobile()) return;
    if(e.target.closest('.mobile-detail-panel,.mobile-zoom,.m-bottom,.m-top,.cmd-palette,.cmd-backdrop')) return;
    const productSheet=e.target.closest('.mobile-sheet.pro');
    if(productSheet){
      const img=e.target.closest('img');
      if(img){ e.preventDefault(); e.stopPropagation(); mobileOpenDetail('product', localStorage.getItem('DKT_MOBILE_PRODUCT')||''); return; }
      return;
    }
    const flow=e.target.closest('.m-flow button');
    if(flow){ return; }
    const kpi=e.target.closest('.m-kpi button');
    if(kpi){ return; }
    const productArticle=e.target.closest('.m-feed.products article');
    if(productArticle){ return; }
    const article=e.target.closest('.m-feed article');
    if(article){ e.preventDefault(); e.stopPropagation(); dktOpenMobileDetailByElement(article,'fieldsHero'); return; }
    const card=e.target.closest('.m-card.visual,.m-hero,.m-title,.m-card.clickable');
    if(card){ e.preventDefault(); e.stopPropagation(); dktOpenMobileDetailByElement(card,current()+'Hero'); return; }
  }, true);
}
const __clickLockPrevRender = render;
render = function(){
  __clickLockPrevRender();
  dktInstallDesktopClickLock();
  dktInstallMobileClickLock();
  document.body.classList.add('click-function-lock');
};
try{ render(); }catch(e){ console.error('CT-CLICK-LOCK render failed', e); }

/* CT-FIX1~FIX8 FINAL REPAIR: inquiry-out, facilities click, all-panel click lock, product image cleanup, no floating public chips, clean header, strict verify-ready */
(function(){
  const CT_FIX_FINAL='CT-FIX1~FIX8 FINAL PUBLIC REPAIR LOCK';
  const publicNavFinal=['home','company','fields','products','facilities','quality'];
  const routeImgFinal={home:'home.jpg',company:'company.jpg',fields:'fields.jpg',products:'products.jpg',facilities:'facilities.jpg',quality:'quality.jpg'};
  const bottomCopyFinal={
    home:['대광테크 회사소개','CNC 자동선반 기반 정밀가공 역량, 제품사례, 설비, 품질 체계를 확인하세요.','회사소개 보기','company','제품사례 보기','products'],
    company:['회사 핵심 역량','회사 개요, 가공분야, 설비 환경, 품질 운영 기준을 확인하세요.','가공분야 보기','fields','품질관리 보기','quality'],
    fields:['가공분야 대응 역량','자동차·유압·전자·정밀 양산가공 범위를 제품 사례와 함께 확인하세요.','제품사례 보기','products','설비현황 보기','facilities'],
    products:['제품·가공사례 상세','제품 사진과 패널을 눌러 소재, 공정, 반복 생산 대응 정보를 확인하세요.','설비현황 보기','facilities','품질관리 보기','quality'],
    facilities:['설비 기반 생산 환경','자동선반 라인, 측정/검사, 세척/포장 설비의 운영 흐름을 확인하세요.','품질관리 보기','quality','가공분야 보기','fields'],
    quality:['품질관리 체계','검사 프로세스와 품질 KPI, 측정 장비 기준을 확인하세요.','설비현황 보기','facilities','회사소개 보기','company']
  };
  const finalProductImages=['product-01.jpg','product-02.jpg','product-03.jpg','product-04.jpg'].map(n=>'./public/products/'+n);
  function finalRouteFromHeaderPercent(x){
    if(x < 19.5) return 'home';
    if(x >= 19.5 && x < 30.5) return 'home';
    if(x >= 30.5 && x < 40.5) return 'company';
    if(x >= 40.5 && x < 50.5) return 'fields';
    if(x >= 50.5 && x < 61.0) return 'products';
    if(x >= 61.0 && x < 70.5) return 'facilities';
    if(x >= 70.5 && x < 81.5) return 'quality';
    if(x >= 82.0) return 'company';
    return null;
  }
  window.dktFinalPublicNav = publicNavFinal.slice();
  cleanHeader = function(routeKey){
    const labels=publicNavFinal.map(key=>`<button type="button" class="clean-nav-btn ${key===routeKey?'on':''}" data-route="${key}" onclick="go('${key}')">${esc(routes[key].label)}</button>`).join('');
    return `<header class="screen-mask clean-live-header final-clean-header ct-fix-header" aria-label="대광테크 회사소개 네비게이션">
      <button type="button" class="clean-brand final-clean-brand" data-route="home" onclick="go('home')" aria-label="대광테크 홈"><img src="./public/screens/logo-angular-transparent.png" alt="DAE KWANG TECH"></button>
      <nav>${labels}</nav>
      <button type="button" class="clean-header-cta" data-route="company" onclick="go('company')">회사소개 보기 →</button>
    </header>`;
  };
  cleanBottomPanel = function(routeKey){
    const c=bottomCopyFinal[routeKey]||bottomCopyFinal.home;
    return `<section class="screen-mask clean-bottom-panel ct-fix-bottom" aria-label="회사소개형 탐색 패널">
      <div><b>${esc(c[0])}</b><span>${esc(c[1])}</span></div>
      <button type="button" onclick="go('${c[3]}')">${esc(c[2])} →</button>
      <button type="button" class="ghost" onclick="go('${c[5]}')">${esc(c[4])} →</button>
    </section>`;
  };
  function productRepairOverlay(){
    const imgs=finalProductImages.slice(1,4);
    const titles=['샤프트 부품','커넥터 하우징','정밀 피팅'];
    return `<section class="screen-mask ct-product-clean-row" aria-label="제품 이미지 정리 영역">
      ${imgs.map((img,i)=>`<button type="button" onclick="openFullDesktopDetail('products','left')"><img src="${img}" alt="${titles[i]}"><span>${titles[i]}</span></button>`).join('')}
    </section>`;
  }
  function finalFullModal(){ return (typeof FullDetailModal==='function'?FullDetailModal():'') + (typeof ImageLightbox==='function'?ImageLightbox():''); }
  desktopScreen = function(routeKey){
    const r=routes[routeKey]||routes.home;
    return `<main class="screen-wrap company-only-screen ct-fix-final route-${routeKey}" data-route="${routeKey}">
      <img class="exact-screen" src="./public/screens/${routeImgFinal[routeKey]||r.img}" alt="${esc(r.label)} exact screen" />
      ${cleanHeader(routeKey)}
      ${routeKey==='products'?productRepairOverlay():''}
      ${cleanBottomPanel(routeKey)}
      ${typeof desktopUniversalHotspots==='function'?desktopUniversalHotspots(routeKey):''}
      ${typeof detailHotspots==='function'?detailHotspots(routeKey):''}
      <button type="button" class="screen-mask ct-screen-hit ct-hit-hero" onclick="openFullDesktopDetail('${routeKey}','hero')" aria-label="${esc(r.label)} 핵심 상세"></button>
      <button type="button" class="screen-mask ct-screen-hit ct-hit-left" onclick="openFullDesktopDetail('${routeKey}','left')" aria-label="${esc(r.label)} 좌측 패널 상세"></button>
      <button type="button" class="screen-mask ct-screen-hit ct-hit-right" onclick="openFullDesktopDetail('${routeKey}','right')" aria-label="${esc(r.label)} 우측 패널 상세"></button>
      <button type="button" class="screen-mask ct-screen-hit ct-hit-process" onclick="openFullDesktopDetail('${routeKey}','process')" aria-label="${esc(r.label)} 공정 상세"></button>
      ${finalFullModal()}
    </main>`;
  };
  function finalMigrateData(){
    try{
      const d=cms();
      d.products=(d.products||[]).map((p,i)=>({...p,image:finalProductImages[i%finalProductImages.length]}));
      seedCms.products=(seedCms.products||[]).map((p,i)=>({...p,image:finalProductImages[i%finalProductImages.length]}));
      if(Array.isArray(humanProducts)) humanProducts.forEach((p,i)=>{p.image=finalProductImages[i%finalProductImages.length];});
      d.audit=[{time:new Date().toLocaleString('ko-KR'), action:CT_FIX_FINAL+' 제품 이미지/회사소개 정책 마이그레이션', actor:'system'}, ...(d.audit||[])].slice(0,50);
      localStorage.setItem('DKT_COMPANY_CMS_V1', JSON.stringify(d));
      localStorage.setItem('DKT_CT_FIX_FINAL','applied');
    }catch(e){ console.warn('CT-FIX final data migration skipped',e); }
  }
  function finalRender(){
    const key=current();
    app.innerHTML = key.startsWith('admin') ? adminApp(key) : (isMobile() ? mobileApp(key) : desktopScreen(key));
    document.body.classList.add('ct-fix1-8-lock');
  }
  render = finalRender;
  if(!window.__DKT_CT_FIX_HEADER_CAPTURE__){
    window.__DKT_CT_FIX_HEADER_CAPTURE__=true;
    document.addEventListener('click',(e)=>{
      const key=current();
      if(isMobile() || key.startsWith('admin')) return;
      const wrap=e.target.closest('.company-only-screen');
      if(!wrap) return;
      const rect=wrap.getBoundingClientRect();
      const x=((e.clientX-rect.left)/Math.max(rect.width,1))*100;
      const y=((e.clientY-rect.top)/Math.max(rect.height,1))*100;
      const direct=e.target.closest('[data-route]')?.dataset?.route;
      const target=direct || (y <= 8.4 ? finalRouteFromHeaderPercent(x) : null);
      if(target){ e.preventDefault(); e.stopPropagation(); go(target); return; }
      if(e.target.closest('.clean-live-header,.clean-bottom-panel,.full-detail-modal,.image-lightbox,button,a,input,select,textarea')) return;
      if(y > 8.4){
        const action=dktDesktopZoneFromPoint ? dktDesktopZoneFromPoint(key,x,y) : {type:'detail', zone:'hero'};
        if(action?.type==='route') go(action.target);
        else openFullDesktopDetail(key, action?.zone || 'hero');
        e.preventDefault(); e.stopPropagation();
      }
    }, true);
  }
  finalMigrateData();
  try{ render(); }catch(e){ console.error('CT-FIX1~FIX8 final render failed', e); }
})();

/* CT-CTA-ATOM1~ATOM8 CTA ATOMIC FUNCTION CONTROL PLANE
   One late authority layer for all existing public/mobile/admin actions: trace, focus, press state, keyboard parity, mobile state normalize, and admin transaction safety. */
(function(){
  const CTA_ATOM_VERSION = 'CT-CTA-ATOM1~ATOM8 atomic CTA control plane';
  const CTA_LOG_KEY = 'DKT_CTA_AUDIT_LOG';
  const CTA_SELECTOR = [
    '[data-cta-id]',
    'button',
    'a[href]',
    '[onclick]',
    '.ct-screen-hit',
    '.live-ux-hot',
    '.detail-hot',
    '.u-hot',
    '.m-feed article',
    '.m-card.clickable',
    '.m-card.visual',
    '.m-hero',
    '.m-title'
  ].join(',');
  const ctaRoutes = ['home','company','fields','products','facilities','quality'];
  function dktAtomicCtaId(el){
    if(!el) return 'unknown';
    if(el.dataset?.ctaId) return el.dataset.ctaId;
    const explicit = el.dataset?.route || el.dataset?.uxZone || el.dataset?.uxTarget;
    const cls = String(el.className || '').trim().split(/\s+/).filter(Boolean).slice(0,3).join('.');
    const txt = (el.textContent || el.getAttribute?.('aria-label') || el.getAttribute?.('title') || '').replace(/\s+/g,' ').trim().slice(0,42);
    return [current(), el.tagName?.toLowerCase() || 'node', explicit || cls || 'cta', txt || 'icon'].join(':');
  }
  function dktCtaTrace(el, eventType='click'){
    try{
      const item = {
        id:dktAtomicCtaId(el),
        type:eventType,
        route:current(),
        layer:current().startsWith('admin') ? 'admin' : (isMobile() ? 'mobile' : 'desktop'),
        at:new Date().toISOString()
      };
      const prev = JSON.parse(localStorage.getItem(CTA_LOG_KEY) || '[]');
      localStorage.setItem(CTA_LOG_KEY, JSON.stringify([item, ...prev].slice(0,80)));
    }catch(e){}
  }
  function dktAtomicCta(el){
    if(!el || el.dataset?.ctaAtomic === '1') return;
    el.dataset.ctaAtomic = '1';
    el.dataset.ctaId = dktAtomicCtaId(el);
    if(!el.getAttribute('aria-label')){
      const label = (el.textContent || '').replace(/\s+/g,' ').trim();
      if(!label && !['input','select','textarea'].includes(el.tagName.toLowerCase())) el.setAttribute('aria-label', el.dataset.ctaId);
    }
    const tag = el.tagName.toLowerCase();
    const native = ['button','a','input','select','textarea','summary'].includes(tag);
    if(tag === 'button' && !el.getAttribute('type')) el.setAttribute('type','button');
    if(!native && !el.getAttribute('tabindex')) el.setAttribute('tabindex','0');
    if(!native && !el.getAttribute('role')) el.setAttribute('role','button');
  }
  function dktInstallAtomicCtas(){
    document.querySelectorAll(CTA_SELECTOR).forEach(dktAtomicCta);
    document.body.classList.add('cta-atom-lock');
    document.body.dataset.ctaAtomVersion = CTA_ATOM_VERSION;
  }
  function dktSetPressed(el, on){
    if(!el) return;
    if(on) el.dataset.ctaPressed = '1';
    else delete el.dataset.ctaPressed;
  }
  function dktNormalizeFieldSegment(){
    const known = productCards.map(p=>p[0]);
    const active = localStorage.getItem('DKT_FIELD_SEG');
    if(active && !known.includes(active)) localStorage.setItem('DKT_FIELD_SEG', known[0] || '자동차부품');
  }
  function dktNormalizeProductSegment(){
    const d = cms();
    const allowed = ['전체','자동차부품','유압부품','전자부품','정밀 양산가공'];
    const active = localStorage.getItem('DKT_PRODUCT_SEG') || '전체';
    if(!allowed.includes(active)) localStorage.setItem('DKT_PRODUCT_SEG','전체');
    const next = localStorage.getItem('DKT_PRODUCT_SEG') || '전체';
    if(next !== '전체' && !d.products.some(p=>p.category === next)) localStorage.setItem('DKT_PRODUCT_SEG','전체');
  }
  function dktBackupEntry(label, payload){
    return {id:'BK-ATOM-'+Date.now(), time:new Date().toLocaleString('ko-KR'), label, payload:snapshotSlim(payload)};
  }
  const oldSaveCmsAtom = saveCms;
  saveCms = function(data, action='CMS 저장', options={}){
    const normalized = normalizeCms(data);
    if(options && options.backup === false){
      normalized.audit = [{time:new Date().toLocaleString('ko-KR'), action, actor:'admin'}, ...(normalized.audit||[])].slice(0,50);
      normalized.ops = {...(normalized.ops||{}), lastSavedAt:new Date().toLocaleString('ko-KR'), lastAction:action};
      localStorage.setItem('DKT_COMPANY_CMS_V1', JSON.stringify(normalized));
      toast(action);
      render();
      return;
    }
    return oldSaveCmsAtom(normalized, action);
  };
  adminCreateBackup = window.adminCreateBackup = function(){
    const d = cms();
    d.backups = [dktBackupEntry('수동 백업', d), ...(d.backups||[])].slice(0,8);
    saveCms(d, '수동 백업 생성', {backup:false});
  };
  adminRestoreBackup = window.adminRestoreBackup = function(id){
    const currentData = cms();
    const b = (currentData.backups||[]).find(x=>x.id===id);
    if(!b || !b.payload){ toast('복구할 백업 없음'); return; }
    const restored = normalizeCms(b.payload);
    restored.backups = [dktBackupEntry('복구 전 자동 백업', currentData), ...(currentData.backups||[])].slice(0,8);
    restored.audit = [{time:new Date().toLocaleString('ko-KR'), action:`백업 복구: ${b.label || b.id}`, actor:'admin'}, ...(currentData.audit||[])].slice(0,50);
    saveCms(restored, '백업 복구 완료', {backup:false});
  };
  adminUndo = window.adminUndo = function(){
    const d = cms();
    const b = (d.backups||[])[0];
    if(!b){ toast('복구할 백업 없음'); return; }
    window.adminRestoreBackup(b.id);
  };
  adminDelete = window.adminDelete = function(type,id){
    if(!confirm('삭제하면 현재 상태 백업 1개를 남긴 뒤 처리합니다. 계속할까요?')) return;
    if(!confirm('정말 삭제할까요?')) return;
    const d = cms();
    const before = clone(d);
    d[type] = (d[type]||[]).filter(x=>x.id!==id);
    d.backups = [dktBackupEntry(`${type} 삭제 전 백업: ${id}`, before), ...(d.backups||[])].slice(0,8);
    saveCms(d, `${type} 삭제: ${id}`, {backup:false});
  };
  adminBulkStatus = window.adminBulkStatus = function(status){
    const d = cms();
    const q = (localStorage.getItem('DKT_PRODUCT_QUERY') || '').trim().toLowerCase();
    const s = localStorage.getItem('DKT_PRODUCT_STATUS') || '전체';
    const scope = d.products.filter(p => (s === '전체' || p.status === s) && [p.title,p.id,p.category,p.material,p.process].join(' ').toLowerCase().includes(q));
    if(!scope.length){ toast('일괄 처리 대상 없음'); return; }
    if(!confirm(`${scope.length}개 제품을 ${status} 상태로 변경할까요?`)) return;
    const ids = new Set(scope.map(p=>p.id));
    d.products = d.products.map(p => ids.has(p.id) ? {...p,status} : p);
    saveCms(d, `필터 대상 ${scope.length}개 ${status} 처리`);
  };
  adminFilterProducts = window.adminFilterProducts = function(value){
    localStorage.setItem('DKT_PRODUCT_QUERY', String(value || '').trim().toLowerCase());
    render();
  };
  const oldAdminSelectProduct = window.adminSelectProduct;
  adminSelectProduct = window.adminSelectProduct = function(id){
    localStorage.setItem('DKT_SELECTED_PRODUCT', id);
    if(typeof oldAdminSelectProduct === 'function') oldAdminSelectProduct(id);
    else render();
  };
  const oldMobileSetField = window.mobileSetField;
  mobileSetField = window.mobileSetField = function(value){
    const known = productCards.map(p=>p[0]);
    localStorage.setItem('DKT_FIELD_SEG', known.includes(value) ? value : (known[0] || '자동차부품'));
    if(typeof oldMobileSetField === 'function') oldMobileSetField(localStorage.getItem('DKT_FIELD_SEG'));
    else render();
  };
  const oldMobileSetProductFilter = window.mobileSetProductFilter;
  mobileSetProductFilter = window.mobileSetProductFilter = function(value){
    const allowed = ['전체','자동차부품','유압부품','전자부품','정밀 양산가공'];
    localStorage.setItem('DKT_PRODUCT_SEG', allowed.includes(value) ? value : '전체');
    localStorage.removeItem('DKT_MOBILE_PRODUCT');
    if(typeof oldMobileSetProductFilter === 'function') oldMobileSetProductFilter(localStorage.getItem('DKT_PRODUCT_SEG'));
    else render();
  };
  const prevMobileProductsAtom = MobileProducts;
  MobileProducts = function(){
    dktNormalizeProductSegment();
    const html = prevMobileProductsAtom();
    if(!html.includes('<section class="m-feed products"></section>')) return html;
    return html.replace('<section class="m-feed products"></section>', '<section class="m-feed products empty"><article class="m-empty-state"><div><b>표시할 제품이 없습니다</b><p>필터를 전체로 되돌려 제품 사례를 확인하세요.</p><span>전체 보기</span></div></article></section>');
  };
  const prevMobileFieldsAtom = MobileFields;
  MobileFields = function(){ dktNormalizeFieldSegment(); return prevMobileFieldsAtom(); };
  const prevMobileCompanyAtom = MobileCompany;
  MobileCompany = function(){ return prevMobileCompanyAtom().replace("${Bottom('home')}", "${Bottom('company')}").replace(Bottom('home'), Bottom('company')); };
  const commandItems = [
    ['home','홈','public'],
    ['company','회사소개','public'],
    ['fields','가공분야','public'],
    ['products','제품·가공사례','public'],
    ['facilities','설비현황','public'],
    ['quality','품질관리','public'],
    ['admin/dashboard','Admin 대시보드','admin'],
    ['admin/ops','운영고도화','admin'],
    ['admin/products','제품관리','admin'],
    ['admin/settings','설정','admin']
  ];
  window.dktCommandQuery = window.dktCommandQuery || '';
  CommandPalette = function(){
    if(localStorage.getItem('DKT_COMMAND_OPEN')!=='1') return '';
    const q = (localStorage.getItem('DKT_COMMAND_QUERY') || '').trim().toLowerCase();
    const items = commandItems.filter(([,label,group]) => `${label} ${group}`.toLowerCase().includes(q));
    return `<aside class="cmd-backdrop" onclick="closeCommandPalette()"><section class="cmd-palette cta-command" onclick="event.stopPropagation()"><div><b>기능 검색</b><button type="button" onclick="closeCommandPalette()" aria-label="기능 검색 닫기">×</button></div><input class="cmd-search" value="${esc(q)}" placeholder="화면 또는 기능명 검색" oninput="localStorage.setItem('DKT_COMMAND_QUERY',this.value);render()" autofocus><p>Ctrl+K / Esc / Enter 실행</p>${items.map(([k,l,g],i)=>`<button type="button" class="${i===0?'on':''}" data-command-route="${esc(k)}" onclick="closeCommandPalette();go('${k}')"><span>${esc(l)}</span><small>${esc(g)} · #/${esc(k)}</small></button>`).join('') || '<small class="cmd-empty">검색 결과 없음</small>'}</section></aside>`;
  };
  window.openCommandPalette = openCommandPalette = function(){
    localStorage.setItem('DKT_COMMAND_OPEN','1');
    localStorage.removeItem('DKT_COMMAND_QUERY');
    render();
    setTimeout(()=>document.querySelector('.cmd-search')?.focus(),0);
  };
  window.closeCommandPalette = closeCommandPalette = function(){
    localStorage.removeItem('DKT_COMMAND_OPEN');
    localStorage.removeItem('DKT_COMMAND_QUERY');
    render();
  };
  const prevRenderAtom = render;
  render = function(){
    dktNormalizeFieldSegment();
    dktNormalizeProductSegment();
    prevRenderAtom();
    if(typeof ensureGlobalUX === 'function') ensureGlobalUX();
    if(typeof enhanceMobileClickability === 'function') enhanceMobileClickability();
    if(typeof dktInstallDesktopClickLock === 'function') dktInstallDesktopClickLock();
    if(typeof dktInstallMobileClickLock === 'function') dktInstallMobileClickLock();
    dktInstallAtomicCtas();
  };
  document.addEventListener('pointerdown',(e)=>{ const el=e.target.closest(CTA_SELECTOR); if(el){ dktAtomicCta(el); dktSetPressed(el,true); dktCtaTrace(el,'pointerdown'); } }, true);
  document.addEventListener('pointerup',(e)=>{ const el=e.target.closest(CTA_SELECTOR); if(el){ dktSetPressed(el,false); } }, true);
  document.addEventListener('pointercancel',(e)=>{ const el=e.target.closest(CTA_SELECTOR); if(el){ dktSetPressed(el,false); } }, true);
  document.addEventListener('click',(e)=>{ const el=e.target.closest(CTA_SELECTOR); if(el){ dktAtomicCta(el); dktCtaTrace(el,'click'); } }, true);
  document.addEventListener('keydown',(e)=>{
    if(localStorage.getItem('DKT_COMMAND_OPEN')==='1' && e.key === 'Enter'){
      const first = document.querySelector('.cmd-palette [data-command-route]');
      if(first){ e.preventDefault(); closeCommandPalette(); go(first.dataset.commandRoute); return; }
    }
    if(e.key !== 'Enter' && e.key !== ' ') return;
    const el = e.target.closest(CTA_SELECTOR);
    if(!el || ['BUTTON','A','INPUT','SELECT','TEXTAREA'].includes(el.tagName)) return;
    e.preventDefault();
    dktCtaTrace(el,'keyboard');
    el.click();
  }, true);
  window.dktAtomicCta = dktAtomicCta;
  window.dktCtaTrace = dktCtaTrace;
  window.dktInstallAtomicCtas = dktInstallAtomicCtas;
  localStorage.setItem('DKT_CTA_ATOM_VERSION', CTA_ATOM_VERSION);
  try{ render(); }catch(e){ console.error('CT-CTA-ATOM render failed', e); }
})();
