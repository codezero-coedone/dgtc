
'use strict';

/* DAE KWANG TECH — SSS single-source application
   CT-S1 source circuit consolidation
   CT-S4 single authoritative CTA map
   No legacy patch stacking, no duplicate render/router/modal implementations.
*/

const APP_VERSION = 'DGTC_DESKTOP_PROOF_BREAKOUT_20260714_V3';
const screenAsset = name => `./public/screens/${name}?v=${APP_VERSION}`;
const precisionAsset = name => `./public/precision-assets/${name}?v=${APP_VERSION}`;
const PUBLIC_ROUTES = ['home','company','fields','products','facilities','quality'];
const ROUTES = {
  home:{label:'홈', image:'home.jpg'},
  company:{label:'회사소개', image:'company.jpg'},
  fields:{label:'가공분야', image:'fields.jpg'},
  products:{label:'제품·가공사례', image:'products.jpg'},
  facilities:{label:'설비현황', image:'facilities.jpg'},
  quality:{label:'품질관리', image:'quality.jpg'}
};
const ADMIN_ROUTES = [
  ['admin/dashboard','대시보드'],
  ['admin/image-library','이미지 라이브러리'],
  ['admin/image-add','이미지 추가'],
  ['admin/collections','컬렉션'],
  ['admin/page-map','페이지 반영'],
  ['admin/settings','설정']
];

const DETAIL_CATALOG = {
  automotive:{
    title:'자동차부품 정밀가공',
    headline:'반복 생산의 치수 안정성과 조립 신뢰성을 관리합니다.',
    body:'샤프트, 슬리브, 하우징, 체결 부품처럼 치수 편차가 조립 품질로 바로 이어지는 금속 부품을 중심으로 가공 흐름을 구성합니다.',
    image:'products.jpg',
    spec:{
      '대표 품목':'샤프트, 슬리브, 부싱, 센서 주변 금속 부품',
      '주요 공정':'외경·내경, 단차, 홈, 나사부, 면취',
      '관리 항목':'동심도, 외경·내경 공차, 표면 조도, 버',
      '대응 소재':'SCM/S45C, SUS, AL6061, BRASS',
      '품질 확인':'초도품, LOT별 치수, 외관·찍힘·버',
      '적용 분야':'구동·제동·센서 주변 조립 부품'
    },
    points:['공정 조건과 검사 기준을 고정해 반복 생산의 치수 산포를 줄입니다.','체결면·나사부·모서리 버를 조립 품질 관점에서 확인합니다.','LOT별 생산·검사 기록으로 납품 이력을 관리합니다.'],
    chips:['자동차','반복생산','LOT검사','고신뢰성'],
    target:'fields'
  },
  hydraulic:{
    title:'유압부품 정밀가공',
    headline:'누유 방지와 고압 내구를 고려한 유압 계통 부품입니다.',
    body:'밸브 바디, 매니폴드, 피팅, 카트리지류는 작은 버나 접촉면 흠집도 누유·오염·성능 저하로 이어질 수 있어 씰링면과 유로 품질을 집중 관리합니다.',
    image:'fields.jpg',
    spec:{
      '대표 품목':'밸브 바디, 매니폴드, 피팅, 카트리지',
      '주요 공정':'포트, 내·외경, 나사부, O-ring 홈, 면취',
      '관리 항목':'씰링면 조도, 유로 모서리, 포트 위치',
      '대응 소재':'SCM415, S45C, SUS304/316, 황동',
      '품질 확인':'버 제거, 접촉면 흠집, 치수, 청정도',
      '적용 분야':'유압 밸브, 산업기계 유체 제어'
    },
    points:['O-ring 접촉면과 씰링면의 표면 품질을 우선 확인합니다.','유로 내부 버와 이물은 작동 불량 원인이므로 후처리를 관리합니다.','고압 반복 사용을 고려해 소재·치수·표면 결함을 함께 봅니다.'],
    chips:['유압','고압내구','씰링면','포트가공'],
    target:'fields'
  },
  electronic:{
    title:'전자부품 정밀가공',
    headline:'소형 조립성과 접촉 안정성을 고려합니다.',
    body:'커넥터 하우징, 단자 핀, 센서 금속 부품, 소형 케이스는 미세 버·휨·접촉면 상태가 조립성과 전기 접촉 품질을 좌우합니다.',
    image:'products.jpg',
    spec:{
      '대표 품목':'커넥터 하우징, 접점 핀, 단자, 센서 부품',
      '주요 공정':'미세 선삭, 얇은 벽, 단차, 홈, 면취',
      '관리 항목':'조립 공차, 미세 버, 표면 조도',
      '대응 소재':'BRASS, 동합금, AL6061, SUS',
      '품질 확인':'핀 휨, 흠집, 미세 버, 외관, 치수',
      '적용 분야':'전자·전기기기, 센서, 커넥터'
    },
    points:['아주 작은 버나 휨도 조립 불량으로 이어질 수 있습니다.','도금·후처리 예정 부품은 접촉면과 표면 흠집을 관리합니다.','외관 검사와 치수 검사를 함께 운영합니다.'],
    chips:['전자','커넥터','미세가공','BRASS'],
    target:'fields'
  },
  mass:{
    title:'정밀 양산가공',
    headline:'자동선반 기반으로 같은 품질을 반복 생산합니다.',
    body:'초도 세팅, 공구 마모, 치수 산포, 검사 주기, 세척·포장 흐름을 표준화해 소형·복합 형상 부품의 생산 안정성을 관리합니다.',
    image:'home.jpg',
    spec:{
      '대표 품목':'샤프트, 슬리브, 부싱, 노즐, 피팅',
      '주요 공정':'자동 소재 공급, 복합 선삭, 드릴·탭',
      '관리 항목':'초도 세팅, 공구 마모, 치수 산포',
      '대응 소재':'SCM, SUS, AL, BRASS, 지정 소재',
      '품질 확인':'공정 중 검사, LOT 샘플링, 출하검사',
      '적용 분야':'자동차, 유압, 전자, 산업기계'
    },
    points:['한 번의 정밀도보다 반복 생산의 일관성이 핵심입니다.','공구 마모와 소재 편차를 고려해 검사 주기를 고정합니다.','세척·포장·출하까지 연결해 납품 품질을 관리합니다.'],
    chips:['양산','자동선반','공정표준','LOT추적'],
    target:'fields'
  },
  products:{
    title:'제품·가공사례 상세',
    headline:'실제 가공품의 소재·공정·품질 포인트를 확인합니다.',
    body:'제품 사진은 제조 가능 범위를 보여주는 증거입니다. 소재, 형상, 가공 공정, 검사 기준, 반복 생산 대응 정보를 함께 제공합니다.',
    image:'products.jpg',
    spec:{
      '대표 제품':'샤프트, 피팅, 플랜지, 하우징, 커넥터',
      '대응 소재':'SCM, SUS, AL6061, BRASS, CAPROLON',
      '주요 공정':'CNC 자동선반, 드릴, 탭, 홈, 면취',
      '공차·조도':'고객 도면과 승인 기준에 따라 관리',
      '생산 형태':'시제품 검토 후 반복 생산·양산',
      '확인 항목':'소재, 형상, 공정, 검사, 적용 산업'
    },
    points:['제품 이미지는 실제 가공품 중심으로 관리합니다.','가공 가능성과 검사 체계를 함께 보여줍니다.','회사 로고·명함·웹캡처는 제품 갤러리에서 제외합니다.'],
    chips:['제품사례','소재','공정','품질증거'],
    target:'products'
  },
  facilities:{
    title:'설비현황 상세',
    headline:'가공·검사·세척·포장이 연결된 생산 환경입니다.',
    body:'자동선반 라인과 측정·검사 장비, 세척·포장 설비가 어떤 공정과 제품군에 연결되는지 확인합니다.',
    image:'facilities.jpg',
    spec:{
      '설비 역할':'가공, 측정, 검사, 세척, 포장',
      '가공 범위':'소형 정밀·복합 형상·반복 생산',
      '연계 공정':'소재 공급, 선삭, 드릴·탭, 검사',
      '연계 제품군':'자동차, 유압, 전자, 양산 부품',
      '운영 장점':'공정 분리, 검사 연계, 납기 대응',
      '관리 항목':'설비 상태, 공정 조건, LOT'
    },
    points:['설비 사진은 생산 가능 범위와 납기 대응력을 보여줍니다.','가공 설비와 검사 설비를 함께 연결합니다.','설비별 역할과 관리 기준을 명확히 표시합니다.'],
    chips:['자동선반','검사장비','세척포장','생산환경'],
    target:'facilities'
  },
  quality:{
    title:'품질관리 상세',
    headline:'검사항목·방법·빈도·기록을 기준으로 관리합니다.',
    body:'수입검사, 공정검사, 자주검사, 최종검사, 출하검사로 이어지는 흐름과 기록 기준을 확인합니다.',
    image:'quality.jpg',
    spec:{
      '검사항목':'외관, 치수, 재질, 형상, 공차, 기능',
      '검사방법':'육안, 버니어, 마이크로미터, 게이지',
      '검사기준':'도면, 검사 기준서, 고객 승인 기준',
      '검사빈도':'초도, 공정 중, LOT별, 출하 전',
      '기록보관':'LOT별 검사 기록과 출하 이력',
      '불량 방지':'초도 승인, 샘플링, 출하 재확인'
    },
    points:['검사 수치보다 검사 기준과 기록 체계를 우선합니다.','측정 장비와 검사 흐름을 시각 증거로 연결합니다.','실제 KPI 수치는 회사 자료 확인 후 확정합니다.'],
    chips:['검사체계','LOT기록','출하검사','품질'],
    target:'quality'
  },
  process:{
    title:'제조 공정 상세',
    headline:'요구 확인부터 출하까지 단계별로 관리합니다.',
    body:'도면 검토, 공정 설계, CNC 정밀 가공, 측정·검사, 세척·포장, 출하 관리가 하나의 생산 흐름으로 연결됩니다.',
    image:'home.jpg',
    spec:{
      '요구 확인':'용도, 수량, 소재, 도면 조건',
      '도면 검토':'가공성, 공차, 표면, 검사 기준',
      '공정 설계':'공구, 치공구, 순서, 검사 주기',
      '정밀 가공':'자동선반 기반 반복 생산',
      '측정·검사':'초도·공정·최종 검사 기록',
      '출하 관리':'세척, 포장, 출하 전 확인'
    },
    points:['공정 단계별 확인 기준을 고정합니다.','검사와 포장을 가공 뒤에 연결합니다.','반복 생산에서 품질 편차와 납기 위험을 줄입니다.'],
    chips:['도면검토','공정설계','검사','출하관리'],
    target:'fields'
  },
  company:{
    title:'회사소개 상세',
    headline:'정밀가공 역량과 생산·품질 운영 원칙을 확인합니다.',
    body:'대광테크의 회사 정보, 주요 가공 분야, 설비 환경, 품질 운영 체계를 한 화면에서 확인합니다.',
    image:'company.jpg',
    spec:{
      '업종':'CNC 자동선반 기반 정밀가공',
      '주요 분야':'자동차, 유압, 전자, 정밀 양산',
      '생산 흐름':'도면 검토, 가공, 검사, 세척·포장',
      '품질 운영':'초도·공정·최종 검사와 LOT 기록',
      '회사 위치':'경남 김해시 한림면',
      '수치 상태':'실제 회사 자료 확인 후 확정'
    },
    points:['회사 정보는 실제 사업자·설비·품질 자료를 기준으로 확정합니다.','과장된 KPI와 미검증 수치는 공개판에서 사용하지 않습니다.','제품 사진과 설비 사진으로 제조 역량을 설명합니다.'],
    chips:['회사소개','정밀가공','김해','품질운영'],
    target:'company'
  }
};

const CTA_MAP = {
  home:[
    ['automotive','자동차부품 상세',1.5,36,14.5,18.4,'detail:automotive'],
    ['hydraulic','유압부품 상세',16,36,14.5,18.4,'detail:hydraulic'],
    ['electronic','전자부품 상세',30.5,36,14.7,18.4,'detail:electronic'],
    ['mass','정밀 양산가공 상세',45.2,36,14.8,18.4,'detail:mass'],
    ['products','제품·가공사례 이동',61,36,37,18.4,'route:products'],
    ['process','제조 공정 상세',1.5,55.3,56.5,17.5,'detail:process'],
    ['facilities','설비현황 이동',59.4,55.3,38.2,17.5,'route:facilities'],
    ['quality','품질관리 이동',1.5,73,63.2,13.8,'route:quality']
  ],
  company:[
    ['overview','회사소개 상세',2,31,35,28,'detail:company'],
    ['profile','회사 프로필',39,31,28,28,'detail:company'],
    ['trust','품질 운영',68,31,30,28,'detail:quality'],
    ['process','운영 공정',2,60,96,16,'detail:process']
  ],
  fields:[
    ['automotive','자동차부품 상세',2,36,21.5,15.5,'detail:automotive'],
    ['hydraulic','유압부품 상세',24,36,22,15.5,'detail:hydraulic'],
    ['electronic','전자부품 상세',46.5,36,22,15.5,'detail:electronic'],
    ['mass','정밀 양산가공 상세',69,36,27,15.5,'detail:mass'],
    ['field','가공분야 상세',2,53,96,14,'detail:automotive'],
    ['process','대응 공정 상세',2,68,96,11,'detail:process'],
    ['samples','가공 샘플 이동',2,79,96,10,'route:products']
  ],
  products:[
    ['auto','자동차부품 상세',13,21.5,14,4.5,'detail:automotive'],
    ['hyd','유압부품 상세',27.5,21.5,14,4.5,'detail:hydraulic'],
    ['elec','전자부품 상세',42,21.5,14,4.5,'detail:electronic'],
    ['mass','정밀 양산가공 상세',56.5,21.5,16.5,4.5,'detail:mass'],
    ['grid1','제품 사진 상세',2,27,18,15,'detail:products'],
    ['grid2','제품 사진 상세',20.5,27,18,15,'detail:products'],
    ['grid3','제품 사진 상세',39,27,18,15,'detail:products'],
    ['grid4','제품 사진 상세',2,43,18,15,'detail:products'],
    ['grid5','제품 사진 상세',20.5,43,18,15,'detail:products'],
    ['grid6','제품 사진 상세',39,43,18,15,'detail:products'],
    ['detail','대표 제품 상세',60,26,36,30,'detail:products'],
    ['materials','대응 소재',2,73.5,38,10,'detail:products'],
    ['shapes','대응 형상',41,73.5,31,10,'detail:products'],
    ['mass-prod','반복 생산',73,73.5,25,10,'detail:mass']
  ],
  facilities:[
    ['cap1','자동선반 상세',3.2,24.8,9.5,9.7,'detail:facilities'],
    ['cap2','측정·검사 상세',13.5,24.8,9.6,9.7,'detail:quality'],
    ['cap3','양산 대응',23.6,24.8,9.5,9.7,'detail:mass'],
    ['cap4','세척·포장',33.8,24.8,9.5,9.7,'detail:process'],
    ['eq1','자동선반 라인',19.8,37.2,15.8,19.7,'detail:facilities'],
    ['eq2','검사 장비',36.1,37.2,16,19.7,'detail:quality'],
    ['eq3','치공구',52.8,37.2,14.8,19.7,'detail:facilities'],
    ['eq4','세척 설비',68.2,37.2,14.8,19.7,'detail:process'],
    ['eq5','포장 설비',83.6,37.2,14.7,19.7,'detail:process'],
    ['process','공정·설비 연계',19.5,58.9,78.8,6.5,'detail:process'],
    ['strength','설비 운영 강점',19.5,67,78.8,10,'detail:facilities']
  ],
  quality:[
    ['kpi','품질 KPI 설명',2,35,33,18,'detail:quality'],
    ['table','검사항목·검사체계',36,35,42,18,'detail:quality'],
    ['equipment','측정 장비',79,32,19,24,'detail:quality'],
    ['process','품질 검사 공정',2,57,75,13,'detail:process'],
    ['point1','품질 관리 포인트',2,71,23,13,'detail:quality'],
    ['point2','정밀 측정 장비',26,71,23,13,'detail:quality'],
    ['point3','전문 인력 운영',50,71,23,13,'detail:quality'],
    ['point4','지속적 개선',74,71,24,13,'detail:quality']
  ]
};

const ADMIN_SEED = [
  ['IMG-001','gear_assembly_03.jpg','기어 어셈블리','제품/가공','승인 완료',['기어','정밀가공'],['제품·가공사례']],
  ['IMG-002','cnc_process_02.jpg','CNC 가공 공정','공정','승인 완료',['CNC','공정'],['홈','가공분야']],
  ['IMG-003','shaft_component_01.jpg','샤프트 부품','제품/가공','승인 완료',['샤프트','양산'],['제품·가공사례']],
  ['IMG-004','quality_inspection_04.jpg','품질 검사 장비','품질/검사','보류',['검사','측정'],['품질관리']],
  ['IMG-005','factory_line_05.jpg','자동선반 생산 라인','설비/현장','승인 완료',['설비','생산라인'],['회사소개','설비현황']],
  ['IMG-006','coupling_parts_06.jpg','커플링 부품','제품/가공','승인 완료',['커플링','부품'],['제품·가공사례']],
  ['IMG-007','valve_block_07.jpg','밸브 블록','제품/가공','승인 완료',['유압','밸브'],['가공분야','제품·가공사례']],
  ['IMG-008','inspection_05.jpg','정밀 측정 공정','품질/검사','승인 완료',['검사','측정'],['품질관리']],
  ['IMG-009','product_case_10.jpg','정밀 양산 부품','제품/가공','승인 완료',['양산','자동선반'],['가공분야']]
].map(x=>({
  id:x[0], file:x[1], title:x[2], category:x[3], status:x[4], tags:x[5], usage:x[6],
  src:`./public/admin-assets/${x[1]}`, storage:'bundle', size:'샘플', alt:`${x[2]} 이미지`,
  description:`${x[2]} 관련 public 반영 이미지입니다.`
}));

const state = {
  modal:null,
  lightbox:null,
  adminFilter:{q:'',category:'전체',status:'전체'},
  selectedId:null,
  uploadQueue:[]
};
const app = document.getElementById('app');
const routeImageCache = new Map();
let navigationToken = 0;

function esc(v=''){return String(v).replace(/[&<>"']/g,s=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[s]));}
function route(){
  const raw=(location.hash.replace(/^#\/?/,'')||'home').replace(/^\/+/,'');
  if(raw==='admin') return 'admin/dashboard';
  return raw;
}
function isMobile(){return matchMedia('(max-width:899px)').matches && !route().startsWith('admin');}
function preloadDesktopRoute(path){
  if(!PUBLIC_ROUTES.includes(path))return Promise.resolve(true);
  const src=path==='quality'?precisionAsset('threaded-pair.jpg'):screenAsset(ROUTES[path].image);
  const cached=routeImageCache.get(src);
  if(cached)return cached.promise;
  const img=new Image();
  const entry={img,promise:null};
  entry.promise=new Promise(resolve=>{
    let settled=false;
    const finish=ok=>{
      if(settled)return;
      settled=true;
      if(ok&&img.decode)img.decode().catch(()=>{});
      resolve(ok&&img.naturalWidth>0);
    };
    img.addEventListener('load',()=>finish(true),{once:true});
    img.addEventListener('error',()=>finish(false),{once:true});
    setTimeout(()=>finish(img.complete&&img.naturalWidth>0),15000);
    img.decoding='async';
    img.src=src;
  });
  routeImageCache.set(src,entry);
  return entry.promise;
}
async function go(path){
  state.modal=null; state.lightbox=null;
  const token=++navigationToken;
  const next=`#/${path}`;
  const holdCurrentScreen=!isMobile()&&PUBLIC_ROUTES.includes(path)&&location.hash!==next;
  if(holdCurrentScreen){
    app.setAttribute('aria-busy','true');
    await preloadDesktopRoute(path);
    if(token!==navigationToken)return;
  }
  if(typeof history!=='undefined'&&history.pushState){
    if(location.hash!==next)history.pushState(null,'',next);
  }else location.hash=next;
  render();
  app.removeAttribute('aria-busy');
}
function detail(key){
  const d=DETAIL_CATALOG[key];
  if(d){state.modal={key,...d};render();}
}
function closeModal(){state.modal=null;render();}
function toast(msg){
  const old=document.querySelector('.toast'); if(old) old.remove();
  const el=document.createElement('div'); el.className='toast'; el.textContent=msg; document.body.appendChild(el);
  requestAnimationFrame(()=>el.classList.add('on')); setTimeout(()=>el.remove(),1800);
}

function header(active){
  const primary=active==='company'?{action:'route:products',label:'제품사례 보기 →'}:{action:'route:company',label:'회사소개 보기 →'};
  return `<header class="public-header">
    <button class="brand" data-action="route:home" aria-label="대광테크 홈"><img src="./public/screens/logo-angular-transparent.png" alt="DAE KWANG TECH"></button>
    <nav aria-label="주요 메뉴">${PUBLIC_ROUTES.map(k=>`<button class="${active===k?'on':''}" data-action="route:${k}">${ROUTES[k].label}</button>`).join('')}</nav>
    <button class="header-company" data-action="${primary.action}">${primary.label}</button>
  </header>`;
}
function hotspots(active){
  return (CTA_MAP[active]||[]).map(a=>`<button class="hotspot" style="left:${a[2]}%;top:${a[3]}%;width:${a[4]}%;height:${a[5]}%" data-action="${a[6]}" aria-label="${esc(a[1])}"></button>`).join('');
}
function croppedHotspots(active,cropHeight,excluded=[]){
  const canvasHeight=1086;
  return (CTA_MAP[active]||[]).filter(a=>!excluded.includes(a[0])).map(a=>{
    const top=a[3]*canvasHeight/100;
    const bottom=Math.min(cropHeight,(a[3]+a[5])*canvasHeight/100);
    if(top>=cropHeight||bottom<=top)return '';
    return `<button class="hotspot" style="left:${a[2]}%;top:${top/cropHeight*100}%;width:${a[4]}%;height:${(bottom-top)/cropHeight*100}%" data-action="${a[6]}" aria-label="${esc(a[1])}"></button>`;
  }).join('');
}
function companyFooter(){
  return `<footer class="company-footer">
    <div class="footer-brand"><img src="./public/screens/logo-angular-transparent.png" alt="DAE KWANG TECH"><span>대광테크<br><small>CNC 자동선반 전문 정밀가공</small></span></div>
    <dl><dt>담당자</dt><dd>이원근 이사</dd><dt>주소</dt><dd>경남 김해시 한림면 신천산단로 52</dd></dl>
    <dl><dt>TEL</dt><dd>055-323-7157</dd><dt>FAX</dt><dd>055-314-5430</dd><dt>E-mail</dt><dd>ndh7157@hanmail.net</dd></dl>
    <nav aria-label="푸터 메뉴"><button data-action="route:company">회사소개</button><button data-action="route:products">제품사례</button><button data-action="route:facilities">설비현황</button><button data-action="route:quality">품질관리</button></nav>
    <small class="footer-copy">© 2024 DAEKWANG TECH.</small>
  </footer>`;
}
function desktopHome(){
  const cropHeight=786;
  return `<main class="desktop-composed route-home" data-desktop-authority="hybrid">
    <section class="raster-crop home-raster" style="--crop-height:${cropHeight}">
      <img class="raster-source" src="${esc(screenAsset(ROUTES.home.image))}" alt="대광테크 홈 상단 화면">
      ${header('home')}${croppedHotspots('home',cropHeight)}
    </section>
    <section class="home-proof-band" aria-label="품질관리와 대응 소재">
      <article class="home-quality-proof">
        <div><small>QUALITY CONTROL</small><h2>품질관리</h2><p>공정별 확인 기준과 측정 기록을 연결해 반복 생산의 품질을 관리합니다.</p><ul><li>초도품과 공정 중 검사</li><li>LOT별 측정 기록</li><li>최종 검수와 출하 확인</li></ul><button data-action="route:quality">품질관리 보기 →</button></div>
        <img src="${esc(precisionAsset('precision-shaft.jpg'))}" alt="대광테크 정밀 가공 샤프트">
      </article>
      <article class="home-material-proof">
        <small>MATERIAL RANGE</small><h2>적용 소재</h2><p>도면과 제품 용도에 맞춰 소재 특성과 가공 조건을 검토합니다.</p>
        <div class="material-matrix"><span><b>STS</b>스테인리스</span><span><b>SCM</b>합금강</span><span><b>AL</b>알루미늄</span><span><b>BRASS</b>황동</span></div>
        <button data-action="route:fields">가공분야 보기 →</button>
      </article>
    </section>
    ${companyFooter()}${modal()}${lightbox()}
  </main>`;
}
function desktopFacilities(){
  const cropHeight=720;
  return `<main class="desktop-composed route-facilities" data-desktop-authority="hybrid">
    <section class="raster-crop facilities-raster" style="--crop-height:${cropHeight}">
      <img class="raster-source" src="${esc(screenAsset(ROUTES.facilities.image))}" alt="대광테크 설비현황 상단 화면">
      ${header('facilities')}${croppedHotspots('facilities',cropHeight,['process','strength'])}
      <button class="hotspot facility-process-hotspot" data-action="detail:process" aria-label="공정·설비 연계 상세"></button>
    </section>
    <section class="facility-strength-band" aria-label="설비 운영의 강점">
      <header><small>FACILITY OPERATION</small><h2>안정적인 생산을 위한 설비 운영</h2><p>가공부터 검사, 세척과 포장까지 역할을 분리하고 공정 기준으로 연결합니다.</p></header>
      <button data-action="detail:facilities"><b>생산 유연성</b><span>소형 정밀 부품과 반복 생산에 유연하게 대응</span></button>
      <button data-action="detail:quality"><b>정밀도 대응</b><span>공정 내 측정과 최종 검사 기준 연계</span></button>
      <button data-action="detail:facilities"><b>작업 안정성</b><span>설비 상태와 공정 조건을 기준으로 관리</span></button>
      <button data-action="detail:quality"><b>품질 일관성</b><span>공정·검사·관리 체계를 통한 품질 유지</span></button>
    </section>
    ${companyFooter()}${modal()}${lightbox()}
  </main>`;
}
function qualityProcess(){
  return [['01','현장재 검사','소재와 외관 상태 확인','detail:quality'],['02','공정 확인','가공 중 주요 치수 확인','detail:process'],['03','측정·검사','도면 기준에 따른 측정','detail:quality'],['04','최종 검수','출하 전 치수와 외관 확인','detail:quality'],['05','기록 관리','LOT별 검사 기록 관리','detail:quality']].map(x=>`<button class="quality-step" data-action="${x[3]}"><strong>${x[0]}</strong><span><b>${x[1]}</b><small>${x[2]}</small></span></button>`).join('');
}
function desktopQuality(){
  return `<main class="desktop-quality route-quality" data-desktop-authority="dom">
    ${header('quality')}
    <section class="quality-dom-hero">
      <img src="${esc(precisionAsset('threaded-pair.jpg'))}" alt="대광테크 정밀 가공 나사 부품">
      <div class="quality-hero-shade"></div>
      <div class="quality-hero-copy"><small>QUALITY MANAGEMENT</small><h1>정밀한 검사와<br>체계적인 관리</h1><p>검사항목·방법·빈도·기록을 기준으로 품질 흐름을 관리합니다.</p></div>
    </section>
    <section class="quality-principles" aria-label="품질 관리 원칙">
      <article><b>정밀 검사</b><span>도면과 승인 기준 확인</span></article><article><b>공정 관리</b><span>공정별 검사 기준 운영</span></article><article><b>추적성 확보</b><span>LOT별 검사 기록 관리</span></article><article><b>지속적 개선</b><span>검사 결과의 공정 반영</span></article>
    </section>
    <section class="quality-process-band"><header><small>INSPECTION FLOW</small><h2>품질 검사 프로세스</h2><p>입고부터 출하까지 단계별 확인 기준을 연결합니다.</p></header><div>${qualityProcess()}</div></section>
    <section class="quality-evidence-grid">
      <div class="quality-table-wrap"><small>INSPECTION STANDARD</small><h2>검사항목과 검사체계</h2><table><thead><tr><th>검사 구분</th><th>확인 항목</th><th>검사 방법</th><th>검사 시점</th></tr></thead><tbody><tr><td>현장재 검사</td><td>소재, 외관, 치수</td><td>육안, 측정기</td><td>입고 시</td></tr><tr><td>공정 검사</td><td>주요 치수, 형상</td><td>게이지, 측정기</td><td>공정 중</td></tr><tr><td>최종 검사</td><td>치수, 외관, 기능</td><td>도면 기준 확인</td><td>출하 전</td></tr><tr><td>기록 관리</td><td>검사 결과, 출하 이력</td><td>LOT별 기록</td><td>검사 완료 후</td></tr></tbody></table></div>
      <aside><small>QUALITY RECORD</small><h2>검사 기록 기준</h2><p>검사 결과를 생산 LOT와 연결해 공정 확인과 출하 이력을 관리합니다.</p><dl><dt>초도 확인</dt><dd>초기 세팅과 기준 치수 확인</dd><dt>공정 확인</dt><dd>공구 마모와 치수 변화 확인</dd><dt>최종 검수</dt><dd>도면 기준과 외관 상태 확인</dd><dt>기록 보관</dt><dd>검사 결과와 출하 이력 연결</dd></dl><button data-action="detail:quality">품질관리 상세 보기 →</button></aside>
    </section>
    <section class="quality-photo-proof"><header><small>REAL PRODUCT PROOF</small><h2>실제 가공품 기반 품질 확인</h2><p>제품 형상과 가공면을 기준으로 치수, 외관, 버와 조립 품질을 확인합니다.</p></header><figure><img src="${esc(precisionAsset('precision-shaft.jpg'))}" alt="정밀 가공 샤프트"><figcaption>샤프트 형상 및 가공면 확인</figcaption></figure><figure><img src="${esc(precisionAsset('valve-sleeve.jpg'))}" alt="정밀 가공 밸브 슬리브"><figcaption>홈과 외경 가공 상태 확인</figcaption></figure><figure><img src="${esc(precisionAsset('threaded-pair.jpg'))}" alt="정밀 가공 나사 부품"><figcaption>나사부와 체결면 상태 확인</figcaption></figure></section>
    ${companyFooter()}${modal()}${lightbox()}
  </main>`;
}
function modal(){
  const d=state.modal; if(!d) return '';
  return `<div class="modal-backdrop" role="presentation">
    <section class="detail-modal" role="dialog" aria-modal="true" aria-labelledby="detail-title">
      <button class="modal-close" data-action="modal:close" aria-label="상세 닫기">×</button>
      <div class="modal-visual"><img src="${esc(screenAsset(d.image))}" alt="${esc(d.title)}"><button data-action="lightbox:${esc(d.image)}">이미지 크게 보기</button></div>
      <div class="modal-copy"><small>DAEKWANG TECH DETAIL</small><h2 id="detail-title">${esc(d.title)}</h2><h3>${esc(d.headline)}</h3><p>${esc(d.body)}</p>
      <div class="spec-grid">${Object.entries(d.spec).map(([k,v])=>`<article><small>${esc(k)}</small><b>${esc(v)}</b></article>`).join('')}</div>
      <ul class="point-list">${d.points.map(p=>`<li>${esc(p)}</li>`).join('')}</ul>
      <div class="chips">${d.chips.map(c=>`<span>${esc(c)}</span>`).join('')}</div>
      <div class="modal-actions"><button data-action="route:${esc(d.target)}">관련 화면으로 이동 →</button><button class="ghost" data-action="modal:close">닫기</button></div>
      </div>
    </section>
  </div>`;
}
function lightbox(){
  if(!state.lightbox) return '';
  return `<div class="lightbox" role="dialog" aria-modal="true"><button data-action="lightbox:close" aria-label="이미지 닫기">×</button><img src="${esc(screenAsset(state.lightbox))}" alt="확대 이미지"></div>`;
}
function desktopPage(active){
  if(active==='home')return desktopHome();
  if(active==='facilities')return desktopFacilities();
  if(active==='quality')return desktopQuality();
  const r=ROUTES[active]||ROUTES.home;
  return `<main class="exact-shell route-${active}">
    <img class="exact-screen" src="${esc(screenAsset(r.image))}" alt="${esc(r.label)} 화면">
    ${header(active)}
    ${hotspots(active)}
    ${modal()}${lightbox()}
  </main>`;
}

function mobileTop(active){const target=active==='company'?['products','제품사례']:['company','회사정보'];return `<header class="m-top"><button data-action="route:home"><img src="./public/screens/logo-angular-transparent.png" alt="DAE KWANG TECH"></button><strong>${ROUTES[active]?.label||'DAE KWANG TECH'}</strong><button data-action="route:${target[0]}">${target[1]}</button></header>`;}
function mobileBottom(active){return `<nav class="m-bottom">${[['home','홈'],['fields','가공'],['products','제품'],['facilities','설비'],['quality','품질']].map(([k,l])=>`<button class="${active===k?'on':''}" data-action="route:${k}"><i>${{home:'⌂',fields:'◆',products:'▦',facilities:'▣',quality:'✓'}[k]}</i><span>${l}</span></button>`).join('')}</nav>`;}
function mCard(key,title,img,copy){return `<button class="m-card" data-action="detail:${key}"><img src="${img}" alt="${esc(title)}"><span><b>${esc(title)}</b><p>${esc(copy)}</p><em>상세 보기 →</em></span></button>`;}
function mobilePage(active){
  const cards={
    home:[['automotive','자동차부품','./public/admin-assets/shaft_component_01.jpg','반복 생산의 치수 안정성과 조립 신뢰성'],['hydraulic','유압부품','./public/admin-assets/valve_block_07.jpg','씰링면·포트·버 관리 중심'],['electronic','전자부품','./public/admin-assets/coupling_parts_06.jpg','소형 조립성과 미세 버 관리']],
    fields:[['automotive','자동차부품','./public/admin-assets/shaft_component_01.jpg','샤프트·슬리브·하우징'],['hydraulic','유압부품','./public/admin-assets/valve_block_07.jpg','밸브·피팅·카트리지'],['electronic','전자부품','./public/admin-assets/coupling_parts_06.jpg','커넥터·핀·센서 부품'],['mass','정밀 양산가공','./public/admin-assets/product_case_10.jpg','자동선반 반복 생산']],
    products:[['products','제품·가공사례','./public/admin-assets/gear_assembly_03.jpg','소재·공정·검사 기준'],['products','샤프트 부품','./public/admin-assets/shaft_component_01.jpg','정밀 선삭 가공 사례'],['hydraulic','밸브 블록','./public/admin-assets/valve_block_07.jpg','유압 계통 가공 사례']],
    facilities:[['facilities','자동선반 생산 라인','./public/admin-assets/factory_line_05.jpg','반복 생산 대응 환경'],['facilities','공장 설비 전경','./public/admin-assets/factory_plant_02.jpg','가공·검사·출하 연계']],
    quality:[['quality','정밀 측정 공정','./public/admin-assets/inspection_05.jpg','검사항목·방법·기록'],['quality','품질 검사 장비','./public/admin-assets/quality_inspection_04.jpg','측정 장비와 검사 흐름']],
    company:[['company','대광테크 회사소개','./public/admin-assets/factory_line_05.jpg','정밀가공·설비·품질 운영'],['process','제조 운영 공정','./public/admin-assets/cnc_process_02.jpg','도면 검토부터 출하까지']]
  }[active]||[];
  return `${mobileTop(active)}<main class="mobile-main"><section class="m-hero"><small>CNC AUTOMATIC LATHE</small><h1>${esc(ROUTES[active]?.label||'대광테크')}</h1><p>정밀가공 역량과 실제 생산·검사 흐름을 확인하세요.</p></section><section class="m-list">${cards.map(c=>mCard(...c)).join('')}</section></main>${mobileModal()}${mobileBottom(active)}`;
}
function mobileModal(){
  const d=state.modal; if(!d) return '';
  return `<div class="m-modal-backdrop"><section class="m-sheet" role="dialog" aria-modal="true" aria-labelledby="m-detail-title"><button class="modal-close" data-action="modal:close">×</button><img src="${esc(screenAsset(d.image))}" alt="${esc(d.title)}"><div><small>DETAIL VIEW</small><h2 id="m-detail-title">${esc(d.title)}</h2><h3>${esc(d.headline)}</h3><p>${esc(d.body)}</p><div class="m-spec">${Object.entries(d.spec).slice(0,4).map(([k,v])=>`<article><small>${esc(k)}</small><b>${esc(v)}</b></article>`).join('')}</div><ul>${d.points.slice(0,3).map(p=>`<li>${esc(p)}</li>`).join('')}</ul><button data-action="route:${esc(d.target)}">관련 화면으로 이동 →</button></div></section></div>`;
}

/* Admin image console — metadata in localStorage, image blobs in IndexedDB */
const META_KEY='DKT_IMAGE_META_V2';
const LOGIN_KEY='DKT_ADMIN_SESSION_V2';
const DB_NAME='DKTImageDB';
const DB_STORE='files';

function seedMeta(){
  const old=localStorage.getItem(META_KEY);
  if(old){try{return JSON.parse(old);}catch{}}
  localStorage.setItem(META_KEY,JSON.stringify(ADMIN_SEED));
  return structuredClone(ADMIN_SEED);
}
function meta(){try{return JSON.parse(localStorage.getItem(META_KEY))||seedMeta();}catch{return seedMeta();}}
function saveMeta(items){localStorage.setItem(META_KEY,JSON.stringify(items));}
function selected(){const items=meta(); const id=state.selectedId||items[0]?.id; return items.find(x=>x.id===id)||items[0];}
function openDB(){
  return new Promise((resolve,reject)=>{
    const req=indexedDB.open(DB_NAME,1);
    req.onupgradeneeded=()=>{if(!req.result.objectStoreNames.contains(DB_STORE))req.result.createObjectStore(DB_STORE);};
    req.onsuccess=()=>resolve(req.result); req.onerror=()=>reject(req.error);
  });
}
async function putBlob(id,blob){const db=await openDB();return new Promise((resolve,reject)=>{const tx=db.transaction(DB_STORE,'readwrite');tx.objectStore(DB_STORE).put(blob,id);tx.oncomplete=resolve;tx.onerror=()=>reject(tx.error);});}
async function getBlob(id){const db=await openDB();return new Promise((resolve,reject)=>{const req=db.transaction(DB_STORE).objectStore(DB_STORE).get(id);req.onsuccess=()=>resolve(req.result);req.onerror=()=>reject(req.error);});}
async function deleteBlob(id){const db=await openDB();return new Promise((resolve,reject)=>{const tx=db.transaction(DB_STORE,'readwrite');tx.objectStore(DB_STORE).delete(id);tx.oncomplete=resolve;tx.onerror=()=>reject(tx.error);});}
async function hydrateIDB(){
  const nodes=[...document.querySelectorAll('img[data-idb]')];
  for(const img of nodes){const blob=await getBlob(img.dataset.idb);if(blob){const url=URL.createObjectURL(blob);img.src=url;img.onload=()=>URL.revokeObjectURL(url);}}
}
function adminGuard(){return localStorage.getItem(LOGIN_KEY)==='1';}
function adminNav(active){return `<aside class="a-side"><div class="a-logo"><img src="./public/screens/logo-angular-transparent.png"><b>IMAGE CMS</b></div><nav>${ADMIN_ROUTES.map(([k,l])=>`<button class="${active===k?'on':''}" data-action="route:${k}">${l}</button>`).join('')}</nav><button data-action="admin:logout">로그아웃</button></aside>`;}
function adminLayout(active,title,body){return `<main class="admin-shell">${adminNav(active)}<section class="a-main"><header><div><small>DAE KWANG TECH</small><h1>${esc(title)}</h1></div><button data-action="route:admin/image-add">＋ 이미지 추가</button></header>${body}</section></main>`;}
function adminLogin(){return `<main class="login"><section><img src="./public/screens/logo-angular-transparent.png"><h1>이미지 관리 시스템</h1><label>아이디<input id="login-id" value="admin@daekwang.co.kr"></label><label>비밀번호<input id="login-pw" type="password" value="demo1234"></label><button data-action="admin:login">로그인</button><button class="ghost" data-action="route:home">사이트로 돌아가기</button></section></main>`;}
function assetImg(x,cls=''){return x.storage==='idb'?`<img class="${cls}" data-idb="${esc(x.id)}" alt="${esc(x.alt)}">`:`<img class="${cls}" src="${esc(x.src)}" alt="${esc(x.alt)}">`;}
function assetCard(x){return `<button class="asset-card ${selected()?.id===x.id?'on':''}" data-action="admin:select:${esc(x.id)}">${assetImg(x)}<b>${esc(x.title)}</b><small>${esc(x.category)} · ${esc(x.status)}</small><div>${x.tags.map(t=>`<span>${esc(t)}</span>`).join('')}</div></button>`;}
function filterAssets(){
  const f=state.adminFilter; const q=f.q.toLowerCase();
  return meta().filter(x=>(f.category==='전체'||x.category===f.category)&&(f.status==='전체'||x.status===f.status)&&`${x.title} ${x.file} ${x.tags.join(' ')}`.toLowerCase().includes(q));
}
function filters(){return `<div class="filters"><input data-field="admin-search" placeholder="이미지 검색" value="${esc(state.adminFilter.q)}"><select data-field="admin-category">${['전체','제품/가공','공정','설비/현장','품질/검사'].map(v=>`<option ${state.adminFilter.category===v?'selected':''}>${v}</option>`).join('')}</select><select data-field="admin-status">${['전체','승인 완료','보류','미승인'].map(v=>`<option ${state.adminFilter.status===v?'selected':''}>${v}</option>`).join('')}</select></div>`;}
function detailPanel(){
  const x=selected(); if(!x)return '';
  return `<aside class="asset-detail">${assetImg(x,'preview')}<h2>${esc(x.title)}</h2><span>${esc(x.status)}</span><dl><dt>파일명</dt><dd>${esc(x.file)}</dd><dt>카테고리</dt><dd>${esc(x.category)}</dd><dt>저장 방식</dt><dd>${x.storage==='idb'?'IndexedDB 원본 저장':'패키지 기본 자산'}</dd><dt>사용 위치</dt><dd>${esc(x.usage.join(' · ')||'미지정')}</dd><dt>설명</dt><dd>${esc(x.description)}</dd><dt>대체 텍스트</dt><dd>${esc(x.alt)}</dd></dl><div class="tags">${x.tags.map(t=>`<span>${esc(t)}</span>`).join('')}</div><div class="asset-actions"><button data-action="route:admin/page-map">페이지 반영</button><button class="ghost" data-action="admin:toggle-status:${esc(x.id)}">상태 변경</button>${x.storage==='idb'?`<button class="danger" data-action="admin:delete:${esc(x.id)}">삭제</button>`:''}</div></aside>`;
}
function dashboard(){
  const items=meta(); const k=[['전체 이미지',items.length],['승인 완료',items.filter(x=>x.status==='승인 완료').length],['보류',items.filter(x=>x.status==='보류').length],['업로드 저장',items.filter(x=>x.storage==='idb').length]];
  return adminLayout('admin/dashboard','이미지 대시보드',`<section class="kpis">${k.map(x=>`<article><small>${x[0]}</small><b>${x[1]}</b></article>`).join('')}</section><section class="library-layout"><div><h2>최근 이미지</h2><div class="asset-grid">${items.slice(0,8).map(assetCard).join('')}</div></div>${detailPanel()}</section>`);
}
function library(){
  return adminLayout('admin/image-library','이미지 라이브러리',`${filters()}<section class="library-layout"><div><div class="asset-grid">${filterAssets().map(assetCard).join('')}</div></div>${detailPanel()}</section>`);
}
function imageAdd(){
  return adminLayout('admin/image-add','이미지 추가',`<section class="upload-panel"><div class="dropzone" data-action="admin:file-dialog"><input id="image-file" type="file" accept="image/*" multiple hidden><b>이미지를 끌어놓거나 클릭하세요</b><p>한 번에 최대 10개 · 파일당 최대 8MB · JPG/PNG/WebP</p></div><div class="queue">${state.uploadQueue.length?state.uploadQueue.map((x,i)=>`<article><b>${esc(x.name)}</b><span>${(x.size/1024/1024).toFixed(2)} MB</span><button data-action="admin:queue-remove:${i}">×</button></article>`).join(''):'<p>업로드 대기 파일이 없습니다.</p>'}</div><div class="upload-actions"><button data-action="admin:upload">IndexedDB에 저장</button><button class="ghost" data-action="admin:queue-clear">대기열 비우기</button></div></section>`);
}
function collections(){
  const items=meta(); const cats=['제품/가공','공정','설비/현장','품질/검사'];
  return adminLayout('admin/collections','컬렉션',`<section class="collection-grid">${cats.map(c=>`<button data-action="admin:filter-category:${c}"><b>${c}</b><strong>${items.filter(x=>x.category===c).length}</strong><span>이미지 보기 →</span></button>`).join('')}</section>`);
}
function pageMap(){
  const x=selected(); if(!x)return adminLayout('admin/page-map','페이지 반영','<p>이미지가 없습니다.</p>');
  return adminLayout('admin/page-map','페이지 반영',`<section class="page-map"><div class="map-preview">${assetImg(x)}<h2>${esc(x.title)}</h2></div><form id="meta-form"><label>제목<input name="title" value="${esc(x.title)}"></label><label>카테고리<select name="category">${['제품/가공','공정','설비/현장','품질/검사'].map(v=>`<option ${x.category===v?'selected':''}>${v}</option>`).join('')}</select></label><label>설명<textarea name="description">${esc(x.description)}</textarea></label><label>대체 텍스트<input name="alt" value="${esc(x.alt)}"></label><fieldset><legend>사용 위치</legend>${PUBLIC_ROUTES.map(k=>`<label><input type="checkbox" name="usage" value="${ROUTES[k].label}" ${x.usage.includes(ROUTES[k].label)?'checked':''}>${ROUTES[k].label}</label>`).join('')}</fieldset><button type="button" data-action="admin:save-meta">정보 저장</button></form></section>`);
}
function settings(){
  return adminLayout('admin/settings','설정',`<section class="settings"><article><h2>저장 정책</h2><p>이미지 원본은 브라우저 IndexedDB에 저장하고, 제목·태그·사용 위치 같은 메타데이터만 localStorage에 저장합니다.</p><ul><li>배치 최대 10개</li><li>파일당 최대 8MB</li><li>실제 운영 배포 시 R2/D1 및 인증 연동 필요</li></ul></article><article><h2>사실성 정책</h2><p>공차, 조도, KPI, 생산능력 수치는 회사 확인 자료가 없으면 공개 확정값으로 사용하지 않습니다.</p></article><button class="danger" data-action="admin:reset">샘플 데이터 초기화</button></section>`);
}
function adminPage(active){
  if(active==='admin/login')return adminLogin();
  if(!adminGuard())return adminLogin();
  return { 'admin/dashboard':dashboard,'admin/image-library':library,'admin/image-add':imageAdd,'admin/collections':collections,'admin/page-map':pageMap,'admin/settings':settings }[active]?.()||dashboard();
}

function render(){
  const r=route();
  if(r.startsWith('admin')) app.innerHTML=adminPage(r);
  else app.innerHTML=isMobile()?mobilePage(PUBLIC_ROUTES.includes(r)?r:'home'):desktopPage(PUBLIC_ROUTES.includes(r)?r:'home');
  hydrateIDB().catch(()=>{});
  queueMicrotask(focusModal);
}
function focusModal(){
  const dlg=document.querySelector('[role="dialog"]');
  if(dlg){const btn=dlg.querySelector('button'); if(btn) btn.focus();}
}
function runAction(action){
  if(!action)return;
  const [type,...rest]=action.split(':');
  if(type==='route') return go(rest.join(':'));
  if(type==='detail') return detail(rest[0]);
  if(type==='modal'&&rest[0]==='close')return closeModal();
  if(type==='lightbox'){
    if(rest[0]==='close'){state.lightbox=null;return render();}
    state.lightbox=rest.join(':');return render();
  }
  if(type==='admin') return adminAction(rest);
}
async function adminAction(parts){
  const cmd=parts[0], arg=parts.slice(1).join(':');
  if(cmd==='login'){
    const id=document.getElementById('login-id')?.value; const pw=document.getElementById('login-pw')?.value;
    if(id==='admin@daekwang.co.kr'&&pw==='demo1234'){localStorage.setItem(LOGIN_KEY,'1');go('admin/dashboard');}else toast('로그인 정보를 확인하세요.');
  } else if(cmd==='logout'){localStorage.removeItem(LOGIN_KEY);go('admin/login');
  } else if(cmd==='select'){state.selectedId=arg;render();
  } else if(cmd==='file-dialog'){document.getElementById('image-file')?.click();
  } else if(cmd==='queue-remove'){state.uploadQueue.splice(Number(arg),1);render();
  } else if(cmd==='queue-clear'){state.uploadQueue=[];render();
  } else if(cmd==='upload'){await uploadQueue();
  } else if(cmd==='toggle-status'){
    const items=meta(),x=items.find(i=>i.id===arg);if(x){x.status=x.status==='승인 완료'?'보류':'승인 완료';saveMeta(items);render();}
  } else if(cmd==='delete'){
    const items=meta(),x=items.find(i=>i.id===arg);if(x&&confirm('이 이미지를 삭제할까요?')){saveMeta(items.filter(i=>i.id!==arg));await deleteBlob(arg);state.selectedId=null;render();}
  } else if(cmd==='filter-category'){state.adminFilter.category=arg;go('admin/image-library');
  } else if(cmd==='save-meta'){saveSelectedMeta();
  } else if(cmd==='reset'){localStorage.removeItem(META_KEY);state.selectedId=null;render();}
}
async function uploadQueue(){
  if(!state.uploadQueue.length)return toast('업로드할 파일을 선택하세요.');
  const items=meta();
  for(const file of state.uploadQueue){
    if(file.size>8*1024*1024)continue;
    const id=`IMG-${Date.now()}-${Math.random().toString(36).slice(2,7)}`;
    await putBlob(id,file);
    items.unshift({id,file:file.name,title:file.name.replace(/\.[^.]+$/,''),category:'제품/가공',status:'미승인',tags:['신규업로드'],usage:[],storage:'idb',size:`${(file.size/1024/1024).toFixed(2)} MB`,alt:`${file.name} 이미지`,description:'새로 업로드한 이미지입니다.'});
  }
  saveMeta(items);state.uploadQueue=[];toast('이미지를 IndexedDB에 저장했습니다.');go('admin/image-library');
}
function saveSelectedMeta(){
  const x=selected(),form=document.getElementById('meta-form');if(!x||!form)return;
  const fd=new FormData(form);x.title=String(fd.get('title')||x.title);x.category=String(fd.get('category')||x.category);x.description=String(fd.get('description')||'');x.alt=String(fd.get('alt')||'');x.usage=fd.getAll('usage').map(String);
  const items=meta().map(i=>i.id===x.id?x:i);saveMeta(items);toast('이미지 정보를 저장했습니다.');render();
}

document.addEventListener('click',e=>{
  const btn=e.target.closest('[data-action]');
  if(btn){e.preventDefault();e.stopPropagation();runAction(btn.dataset.action);}
  else if(e.target.classList.contains('modal-backdrop')||e.target.classList.contains('m-modal-backdrop'))closeModal();
});
document.addEventListener('change',e=>{
  if(e.target.id==='image-file'){
    state.uploadQueue=[...e.target.files].filter(f=>f.type.startsWith('image/')&&f.size<=8*1024*1024).slice(0,10);render();
  }
  if(e.target.dataset.field==='admin-category'){state.adminFilter.category=e.target.value;render();}
  if(e.target.dataset.field==='admin-status'){state.adminFilter.status=e.target.value;render();}
});
document.addEventListener('input',e=>{if(e.target.dataset.field==='admin-search'){state.adminFilter.q=e.target.value;render();}});
document.addEventListener('dragover',e=>{if(e.target.closest('.dropzone')){e.preventDefault();e.target.closest('.dropzone').classList.add('drag');}});
document.addEventListener('dragleave',e=>{if(e.target.closest('.dropzone'))e.target.closest('.dropzone').classList.remove('drag');});
document.addEventListener('drop',e=>{const dz=e.target.closest('.dropzone');if(dz){e.preventDefault();dz.classList.remove('drag');state.uploadQueue=[...e.dataTransfer.files].filter(f=>f.type.startsWith('image/')&&f.size<=8*1024*1024).slice(0,10);render();}});
document.addEventListener('keydown',e=>{if(e.key==='Escape'){if(state.lightbox){state.lightbox=null;render();}else if(state.modal)closeModal();}});
let renderScheduled=false;
function scheduleRender(){
  if(renderScheduled)return;
  renderScheduled=true;
  queueMicrotask(async()=>{
    renderScheduled=false;
    const target=route();
    const token=++navigationToken;
    if(!isMobile()&&PUBLIC_ROUTES.includes(target)){
      app.setAttribute('aria-busy','true');
      await preloadDesktopRoute(target);
      if(token!==navigationToken)return;
    }
    if(route()===target)render();
    app.removeAttribute('aria-busy');
  });
}
window.addEventListener('hashchange',scheduleRender);
window.addEventListener('popstate',scheduleRender);
window.addEventListener('resize',render);

/* In-page real-browser hit-test mode.
   Open ?qa=1#/home; the result is printed in #qa-result and data-qa-status. */
async function mobileBrowserQa(){
  const report=[];let ok=true;
  if(Math.abs(window.innerWidth-390)>1){ok=false;report.push(`M_VIEWPORT ${window.innerWidth}/390`);}
  const waitForImages=()=>Promise.all([...document.images].map(img=>img.complete?Promise.resolve(img):new Promise(resolve=>{
    const done=()=>resolve(img);img.addEventListener('load',done,{once:true});img.addEventListener('error',done,{once:true});setTimeout(done,10000);
  })));
  for(const r of PUBLIC_ROUTES){
    await go(r);
    const images=await waitForImages();
    const top=document.querySelector('.m-top'),main=document.querySelector('.mobile-main'),bottom=document.querySelector('.m-bottom');
    if(route()!==r){ok=false;report.push(`M_ROUTE_FAIL ${r}`);}
    if(!top||!main||!bottom){ok=false;report.push(`M_SHELL_FAIL ${r}`);continue;}
    if(images.some(img=>img.naturalWidth===0)){ok=false;report.push(`M_IMAGE_FAIL ${r}`);}
    if(document.querySelector('.m-modal-backdrop,.modal-backdrop')){ok=false;report.push(`M_BASE_OVERLAY_FAIL ${r}`);}
    if(document.documentElement.scrollWidth>window.innerWidth+1){ok=false;report.push(`M_HORIZONTAL_OVERFLOW ${r}`);}
    const bottomStyle=getComputedStyle(bottom),mainStyle=getComputedStyle(main);
    if(bottomStyle.position!=='fixed'||Math.abs(bottom.getBoundingClientRect().bottom-window.innerHeight)>1){ok=false;report.push(`M_BOTTOM_NAV_POSITION ${r}`);}
    if(parseFloat(mainStyle.paddingBottom)<bottom.getBoundingClientRect().height+20){ok=false;report.push(`M_BOTTOM_SAFE_SPACE ${r}`);}
    const cards=[...document.querySelectorAll('.m-card')];
    if(!cards.length){ok=false;report.push(`M_CARD_MISSING ${r}`);}
    window.scrollTo(0,document.documentElement.scrollHeight);
    const last=cards.at(-1)?.getBoundingClientRect();
    if(last&&last.bottom>bottom.getBoundingClientRect().top+1){ok=false;report.push(`M_CARD_NAV_OVERLAP ${r}`);}
    const primary=top.querySelector('button:last-child')?.dataset.action;
    if(primary===`route:${r}`){ok=false;report.push(`M_SELF_CTA ${r}`);}
  }
  await go('home');detail('automotive');
  const modalImages=await waitForImages();
  const backdrop=document.querySelector('.m-modal-backdrop'),sheet=document.querySelector('.m-sheet');
  if(!backdrop||!sheet||document.querySelectorAll('.m-modal-backdrop,[role="dialog"]').length!==2){ok=false;report.push('M_MODAL_SINGLETON_FAIL');}
  if(modalImages.some(img=>img.naturalWidth===0)){ok=false;report.push('M_MODAL_IMAGE_FAIL');}
  if(backdrop&&getComputedStyle(backdrop).position!=='fixed'){ok=false;report.push('M_MODAL_POSITION_FAIL');}
  if(sheet){
    const rect=sheet.getBoundingClientRect();
    if(rect.width>window.innerWidth+1){ok=false;report.push('M_MODAL_WIDTH_FAIL');}
    if(rect.top<0||rect.bottom>window.innerHeight+1){ok=false;report.push('M_MODAL_VIEWPORT_FAIL');}
  }
  const modalNav=document.querySelector('.m-bottom');
  if(backdrop&&modalNav&&Number(getComputedStyle(backdrop).zIndex)<=Number(getComputedStyle(modalNav).zIndex)){ok=false;report.push('M_MODAL_STACK_FAIL');}
  closeModal();
  if(document.querySelector('.m-modal-backdrop,.modal-backdrop,[role="dialog"]')){ok=false;report.push('M_MODAL_CLOSE_FAIL');}
  await go('home');window.scrollTo(0,0);
  const pre=document.createElement('pre');pre.id='qa-result';pre.hidden=true;pre.dataset.qaStatus=ok?'PASS':'HOLD';pre.textContent=`${ok?'PASS':'HOLD'}\n${report.join('\n')||'mobile shell, cards, bottom nav, and sheet boundaries valid'}`;document.body.appendChild(pre);
}
async function browserQa(){
  const qaMode=new URLSearchParams(location.search).get('qa');
  if(!qaMode)return;
  if(qaMode==='mobile')return mobileBrowserQa();
  const report=[];let ok=true;
  const waitForImages=async()=>{
    const images=[...document.images];
    await Promise.all(images.map(img=>img.complete?Promise.resolve():new Promise(resolve=>{
      const done=()=>resolve();
      img.addEventListener('load',done,{once:true});
      img.addEventListener('error',done,{once:true});
      setTimeout(done,15000);
    })));
    return images;
  };
  const expectedHotspots={home:7,company:4,fields:7,products:14,facilities:10,quality:0};
  const assertSectionBeforeFooter=(routeName,sectionSelector)=>{
    const section=document.querySelector(sectionSelector),footer=document.querySelector('.company-footer');
    if(!section||!footer){ok=false;report.push(`DOM_SECTION_MISSING ${routeName}`);return;}
    const sectionRect=section.getBoundingClientRect(),footerRect=footer.getBoundingClientRect();
    if(footerRect.top<sectionRect.bottom-1){ok=false;report.push(`FOOTER_COLLISION ${routeName} ${footerRect.top.toFixed(1)}/${sectionRect.bottom.toFixed(1)}`);}
  };
  for(const r of PUBLIC_ROUTES){
    await go(r);
    const images=await waitForImages();
    if(route()!==r){ok=false;report.push(`ROUTE_FAIL ${r}`);}
    if(images.some(img=>img.naturalWidth===0)){ok=false;report.push(`IMAGE_FAIL ${r}`);}
    const exact=document.querySelector('.exact-screen'),authority=document.querySelector('[data-desktop-authority]')?.dataset.desktopAuthority;
    if(['company','fields','products'].includes(r)&&(!exact||exact.naturalWidth!==1448||exact.naturalHeight!==1086)){ok=false;report.push(`SCREEN_IMAGE_FAIL ${r} ${exact?.naturalWidth||0}x${exact?.naturalHeight||0}`);}
    if(['home','facilities'].includes(r)&&authority!=='hybrid'){ok=false;report.push(`HYBRID_AUTHORITY_FAIL ${r}`);}
    if(r==='quality'&&authority!=='dom'){ok=false;report.push('QUALITY_DOM_AUTHORITY_FAIL');}
    if(document.querySelector('.modal-backdrop,.m-modal-backdrop')){ok=false;report.push(`BASE_OVERLAY_FAIL ${r}`);}
    if(document.documentElement.scrollWidth>window.innerWidth+1){ok=false;report.push(`HORIZONTAL_OVERFLOW ${r}`);}
    const items=CTA_MAP[r]||[];
    const buttons=[...document.querySelectorAll('.hotspot')];
    if(buttons.length!==expectedHotspots[r]){ok=false;report.push(`HOTSPOT_COUNT ${r} ${buttons.length}/${expectedHotspots[r]}`);}
    buttons.forEach((btn,i)=>{
      const style=getComputedStyle(btn);
      const label=btn.getAttribute('aria-label')||i;
      if(style.backgroundColor!=='rgba(0, 0, 0, 0)'||style.boxShadow!=='none'){ok=false;report.push(`VISIBLE_HOTSPOT ${r}:${label}`);}
      btn.scrollIntoView({block:'center',inline:'center'});
      const rect=btn.getBoundingClientRect();
      const x=rect.left+rect.width/2,y=rect.top+rect.height/2;
      const hit=document.elementFromPoint(x,y);
      if(!hit || hit.closest('[data-action]')!==btn){ok=false;report.push(`HIT_TEST_FAIL ${r}:${label}`);}
    });
    for(let i=0;i<buttons.length;i++)for(let j=i+1;j<buttons.length;j++){
      const a=buttons[i].getBoundingClientRect(),b=buttons[j].getBoundingClientRect();
      if(Math.min(a.right,b.right)-Math.max(a.left,b.left)>1&&Math.min(a.bottom,b.bottom)-Math.max(a.top,b.top)>1){ok=false;report.push(`HOTSPOT_OVERLAP ${r}:${i}/${j}`);}
    }
    for(const a of items){
      const x=a[2]+a[4]/2,y=a[3]+a[5]/2;
      if(x<0||x>100||y<0||y>100){ok=false;report.push(`OUTSIDE ${r}:${a[0]}`);}
      if(!a[6]){ok=false;report.push(`NO_ACTION ${r}:${a[0]}`);}
    }
    if(r==='home'){
      assertSectionBeforeFooter(r,'.home-proof-band');
      if(document.querySelectorAll('.material-matrix span').length!==4) {ok=false;report.push('HOME_MATERIAL_MATRIX_FAIL');}
    }
    if(r==='facilities'){
      assertSectionBeforeFooter(r,'.facility-strength-band');
      if(document.querySelectorAll('.facility-strength-band>button').length!==4) {ok=false;report.push('FACILITY_STRENGTH_DUPLICATE');}
    }
    if(r==='quality'){
      assertSectionBeforeFooter(r,'.quality-photo-proof');
      const title=document.querySelector('.quality-hero-copy h1');
      if(exact||!title||parseFloat(getComputedStyle(title).fontSize)<40){ok=false;report.push('QUALITY_RASTER_OR_TYPE_FAIL');}
      if(document.querySelectorAll('.quality-step').length!==5||document.querySelectorAll('.quality-photo-proof figure').length!==3){ok=false;report.push('QUALITY_PROOF_STRUCTURE_FAIL');}
    }
  }
  for(const r of PUBLIC_ROUTES){await go(r);if(route()!==r){ok=false;report.push(`NAV_ROUTE_FAIL ${r}`);}}
  detail('hydraulic');if(!state.modal||document.querySelectorAll('.modal-backdrop,[role="dialog"]').length!==2){ok=false;report.push('MODAL_FAIL hydraulic');}closeModal();
  if(document.querySelector('.modal-backdrop,.m-modal-backdrop,[role="dialog"]')){ok=false;report.push('MODAL_CLOSE_FAIL hydraulic');}
  detail('quality');if(!state.modal||document.querySelectorAll('.modal-backdrop,[role="dialog"]').length!==2){ok=false;report.push('MODAL_FAIL quality');}closeModal();
  if(document.querySelector('.modal-backdrop,.m-modal-backdrop,[role="dialog"]')){ok=false;report.push('MODAL_CLOSE_FAIL quality');}
  await go('home');
  const pre=document.createElement('pre');pre.id='qa-result';pre.hidden=true;pre.dataset.qaStatus=ok?'PASS':'HOLD';pre.textContent=`${ok?'PASS':'HOLD'}\n${report.join('\n')||'routes, CTA hit-test, modal actions valid'}`;document.body.appendChild(pre);
}
render();setTimeout(()=>browserQa(),50);
window.DGTC_TEST={route,go,detail,closeModal,CTA_MAP,DETAIL_CATALOG,browserQa,version:APP_VERSION};
