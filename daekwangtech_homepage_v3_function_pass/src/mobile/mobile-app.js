(function mobileAppAuthority(global){
  'use strict';

  const ASSET='/public/mobile/assets';
  const ICON='/public/mobile/icons';
  const LOGO='/public/screens/logo-angular-transparent.png';
  const MAP_URL='https://map.kakao.com/?q=%EB%8C%80%EA%B4%91%ED%85%8C%ED%81%AC%20%EA%B2%BD%EB%82%A8%20%EA%B9%80%ED%95%B4%EC%8B%9C%20%ED%95%9C%EB%A6%BC%EB%A9%B4%20%EC%8B%A0%EC%B2%9C%EC%82%B0%EB%8B%A8%EB%A1%9C%2052';
  const FIELD_KEYS=['automotive','hydraulic','electronic','precision'];
  const FIELD_DATA={
    automotive:{label:'자동차',title:'자동차부품 정밀가공',image:`${ASSET}/products/product-cnc-precision-shaft-01.jpg`,description:'반복 생산의 치수 안정성과 조립 신뢰성을 중심으로 정밀 부품을 가공합니다.',features:['샤프트·슬리브 계열 정밀가공','외경·내경과 단차 가공','공정 중 측정과 최종 검수','반복 생산 품질 관리'],parts:['샤프트','슬리브','부싱','체결 부품']},
    hydraulic:{label:'유압',title:'유압부품 정밀가공',image:`${ASSET}/products/product-hydraulic-cartridge-valve.jpg`,description:'유압 계통에 적용되는 밸브, 피팅, 슬리브 계열의 가공 품질을 관리합니다.',features:['밸브·피팅 계열 정밀가공','내·외경과 나사부 가공','접촉면과 버 상태 확인','세척과 최종 검수'],parts:['카트리지 밸브','유압 피팅','밸브 슬리브','밸브 스풀']},
    electronic:{label:'전자',title:'전자부품 정밀가공',image:`${ASSET}/products/product-precision-sleeve.jpg`,description:'소형 금속 부품의 조립성과 표면 상태를 고려한 자동선반 가공을 수행합니다.',features:['소형 정밀 금속 부품 가공','얇은 벽과 미세 형상 대응','외관과 미세 버 확인','조립성 중심 최종 검수'],parts:['정밀 슬리브','소형 샤프트','단차 부품','체결 부품']},
    precision:{label:'정밀가공',title:'정밀 양산가공',image:`${ASSET}/products/product-cnc-precision-shaft-02.jpg`,description:'CNC 자동선반 기반의 반복 생산 흐름으로 정밀 금속 부품을 가공합니다.',features:['CNC 자동선반 기반 가공','공정 조건과 검사 기준 관리','반복 생산 품질 유지','세척·포장·출하 연계'],parts:['정밀 샤프트','나사 부품','슬리브','소형 정밀 부품']}
  };
  const PRODUCTS=[
    {id:'shaft-a',name:'정밀 샤프트',category:'automotive',categoryLabel:'자동차부품',image:`${ASSET}/products/product-cnc-precision-shaft-01.jpg`},
    {id:'shaft-b',name:'나사 샤프트',category:'precision',categoryLabel:'정밀 양산가공',image:`${ASSET}/products/product-cnc-precision-shaft-02.jpg`},
    {id:'cartridge',name:'카트리지 밸브',category:'hydraulic',categoryLabel:'유압부품',image:`${ASSET}/products/product-hydraulic-cartridge-valve.jpg`},
    {id:'fitting',name:'유압 피팅',category:'hydraulic',categoryLabel:'유압부품',image:`${ASSET}/products/product-hydraulic-fitting-adapter.jpg`},
    {id:'sleeve',name:'밸브 슬리브',category:'hydraulic',categoryLabel:'유압부품',image:`${ASSET}/products/product-hydraulic-valve-sleeve.jpg`},
    {id:'spool-a',name:'밸브 스풀 A',category:'hydraulic',categoryLabel:'유압부품',image:`${ASSET}/products/product-hydraulic-valve-spool-01.jpg`},
    {id:'spool-b',name:'밸브 스풀 B',category:'hydraulic',categoryLabel:'유압부품',image:`${ASSET}/products/product-hydraulic-valve-spool-02.jpg`},
    {id:'precision-sleeve',name:'정밀 슬리브',category:'precision',categoryLabel:'정밀 양산가공',image:`${ASSET}/products/product-precision-sleeve.jpg`}
  ];
  const FACILITIES=[
    {name:'CNC 자동선반',copy:'정밀 금속 부품의 반복 가공',image:`${ASSET}/facility/cnc-line.jpg`},
    {name:'정밀 측정·검사',copy:'공정 중 측정과 최종 검수',image:`${ASSET}/facility/inspection.jpg`},
    {name:'공구·치공구 관리',copy:'가공 조건과 작업 기준 관리',image:`${ASSET}/facility/jig.jpg`},
    {name:'세척·포장 공정',copy:'가공 후 세척과 안전 포장',image:`${ASSET}/facility/cleaning.jpg`}
  ];
  const NAV=[
    ['home','홈','home','home'],
    ['fields','가공분야','workflow','fields'],
    ['products','제품','package','products'],
    ['facilities','설비·품질','badge-check','facilities'],
    ['company','더보기','ellipsis','company']
  ];
  const state={route:'home',field:'automotive',filter:'all',search:'',productId:null,facilityTab:'facility',drawer:false,viewer:null,viewerIndex:0,info:null,touchX:null};
  let context=null;
  let lastDialog='';

  function esc(value=''){
    return String(value).replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  }
  function icon(name,className=''){
    return `<span class="mb-icon ${className}" style="--mb-icon:url('${ICON}/${name}.svg')" aria-hidden="true"></span>`;
  }
  function image(src,alt,className='',eager=false){
    return `<img class="${className}" src="${esc(src)}" alt="${esc(alt)}" ${eager?'fetchpriority="high"':'loading="lazy"'} decoding="async">`;
  }
  function sectionHead(title,action,label='전체 보기'){
    return `<div class="mb-section-head"><h2>${esc(title)}</h2>${action?`<button type="button" data-action="mobile:${action}">${esc(label)} ${icon('chevron-right')}</button>`:''}</div>`;
  }
  function appBar(title,{home=false,back=false}={}){
    return `<header class="mb-appbar ${home?'mb-appbar-home':''}">
      ${back?`<button class="mb-icon-button" type="button" data-action="mobile:back" aria-label="뒤로가기">${icon('arrow-left')}</button>`:`<button class="mb-brand" type="button" data-action="mobile:route:home" aria-label="대광테크 홈"><img src="${LOGO}" alt="대광테크"></button>`}
      ${title?`<strong>${esc(title)}</strong>`:'<span></span>'}
      <button class="mb-icon-button" type="button" data-action="mobile:drawer-open" aria-label="전체 메뉴 열기">${icon('menu')}</button>
    </header>`;
  }
  function bottomNav(active){
    return `<nav class="mb-bottom-nav" aria-label="모바일 주요 메뉴">${NAV.map(([route,label,iconName,key])=>`<button type="button" class="${active===key?'is-active':''}" data-action="mobile:route:${route}" ${active===key?'aria-current="page"':''}>${icon(iconName)}<span>${label}</span></button>`).join('')}</nav>`;
  }
  function shell(active,content,{title='',home=false}={}){
    return `<div class="mobile-exact-shell" data-mobile-screen="${esc(active)}">
      ${appBar(title,{home,back:!home})}
      <main class="mb-content ${home?'mb-content-home':''}">${content}</main>
      ${bottomNav(active)}
      ${renderOverlays()}
    </div>`;
  }
  function homePage(){
    const capabilities=[['settings-2','정밀 가공','자동선반 가공 기술'],['repeat-2','반복 생산','공정 기준 관리'],['scan-line','측정·검사','공정·최종 검수'],['truck','납기 관리','세척·포장 연계']];
    const fieldCards=FIELD_KEYS.map(key=>{const item=FIELD_DATA[key];return `<button type="button" class="mb-mini-card" data-action="mobile:field-route:${key}">${image(item.image,item.title)}<span>${esc(item.label)}</span></button>`;}).join('');
    const productCards=PRODUCTS.slice(0,4).map(product=>`<button type="button" class="mb-mini-card" data-action="mobile:product:${product.id}">${image(product.image,product.name)}<span>${esc(product.name)}</span></button>`).join('');
    return shell('home',`<section class="mb-home-hero" style="--mb-hero:url('${ASSET}/hero-cnc.jpg')">
        <div class="mb-hero-copy"><p>CNC AUTOMATIC LATHE</p><h1>정밀을 만드는 기술<br>신뢰로 완성하는 품질</h1><span>대광테크는 CNC 자동선반 기반의<br>정밀 금속 부품 가공업체입니다.</span><button type="button" data-action="mobile:route:products">제품 보기 ${icon('chevron-right')}</button></div>
        <div class="mb-hero-dots" aria-hidden="true"><i></i><i></i><i></i><i></i></div>
      </section>
      <section class="mb-section mb-capability-section">${sectionHead('핵심 역량')}<div class="mb-capability-grid">${capabilities.map(([i,t,c])=>`<article>${icon(i)}<b>${t}</b><span>${c}</span></article>`).join('')}</div></section>
      <section class="mb-section">${sectionHead('가공 분야','route:fields')}<div class="mb-horizontal-grid">${fieldCards}</div></section>
      <section class="mb-section">${sectionHead('대표 제품','route:products')}<div class="mb-horizontal-grid">${productCards}</div></section>
      <section class="mb-section">${sectionHead('설비·품질 현황','route:facilities')}<div class="mb-home-proof-grid">${FACILITIES.slice(0,2).map(item=>`<button type="button" data-action="mobile:route:facilities">${image(item.image,item.name)}<span><b>${esc(item.name)}</b><small>${esc(item.copy)}</small></span></button>`).join('')}</div></section>`,{home:true});
  }
  function fieldsPage(){
    const current=FIELD_DATA[state.field]||FIELD_DATA.automotive;
    const samples=PRODUCTS.filter(product=>product.category===state.field);
    const shown=[...samples,...PRODUCTS.filter(product=>!samples.some(sample=>sample.id===product.id))].slice(0,6);
    return shell('fields',`<section class="mb-tabs" aria-label="가공 분야 선택">${FIELD_KEYS.map(key=>`<button type="button" class="${state.field===key?'is-active':''}" data-action="mobile:field:${key}">${FIELD_DATA[key].label}</button>`).join('')}</section>
      <section class="mb-field-visual">${image(current.image,current.title,'',true)}</section>
      <section class="mb-feature-card"><div><h2>가공 특성</h2><ul>${current.features.map(item=>`<li>${icon('circle-check')}<span>${esc(item)}</span></li>`).join('')}</ul></div>${image(PRODUCTS.find(p=>p.category===state.field)?.image||current.image,current.title)}</section>
      <section class="mb-section mb-section-inset">${sectionHead('적용 부품 예시')}<div class="mb-tag-list">${current.parts.map(item=>`<span>${esc(item)}</span>`).join('')}</div></section>
      <section class="mb-section mb-section-inset">${sectionHead('가공 샘플','route:products')}<div class="mb-sample-grid">${shown.map(product=>`<button type="button" data-action="mobile:product:${product.id}">${image(product.image,product.name)}<span>${esc(product.name)}</span></button>`).join('')}</div></section>`,{title:'가공분야'});
  }
  function filteredProducts(){
    const query=state.search.trim().toLowerCase();
    return PRODUCTS.filter(item=>(state.filter==='all'||item.category===state.filter)&&(!query||`${item.name} ${item.categoryLabel}`.toLowerCase().includes(query)));
  }
  function productsPage(){
    const products=filteredProducts();
    const filters=[['all','전체'],...FIELD_KEYS.map(key=>[key,FIELD_DATA[key].label])];
    return shell('products',`<section class="mb-product-tools"><label>${icon('search')}<span class="mb-sr-only">제품명 검색</span><input data-mobile-search type="search" value="${esc(state.search)}" placeholder="제품명 검색" autocomplete="off">${state.search?`<button class="mb-search-clear" type="button" data-action="mobile:search-clear" aria-label="검색어 지우기"><img src="${ICON}/png/x.png" alt="" aria-hidden="true"></button>`:''}</label><div class="mb-filter-row">${filters.map(([key,label])=>`<button type="button" class="${state.filter===key?'is-active':''}" data-action="mobile:filter:${key}">${esc(label)}</button>`).join('')}</div></section>
      <section class="mb-product-grid" aria-live="polite">${products.length?products.map(product=>`<button type="button" class="mb-product-card" data-action="mobile:product:${product.id}">${image(product.image,product.name)}<span><b>${esc(product.name)}</b><small>${esc(product.categoryLabel)}</small></span></button>`).join(''):'<p class="mb-empty">일치하는 제품이 없습니다.</p>'}</section>`,{title:'제품'});
  }
  function facilityPage(){
    const facility=state.facilityTab==='facility';
    const flow=[['building-2','소재 확인'],['settings-2','가공'],['scan-line','검사'],['clipboard-check','세척'],['package','포장·출하']];
    return shell('facilities',`<section class="mb-segment" aria-label="설비 품질 보기"><button type="button" class="${facility?'is-active':''}" data-action="mobile:segment:facility">설비</button><button type="button" class="${!facility?'is-active':''}" data-action="mobile:segment:quality">품질</button></section>
      ${facility?`<section class="mb-section mb-section-inset">${sectionHead('주요 설비')}<div class="mb-facility-grid">${FACILITIES.slice(0,2).map(item=>`<article>${image(item.image,item.name)}<div><b>${esc(item.name)}</b><span>${esc(item.copy)}</span></div></article>`).join('')}</div></section>
      `:''}
      <section class="mb-section mb-section-inset">${sectionHead('공정 흐름')}<div class="mb-process-flow">${flow.map(([i,t],index)=>`<article>${icon(i)}<span>${esc(t)}</span>${index<flow.length-1?icon('chevron-right','mb-flow-arrow'):''}</article>`).join('')}</div></section>
      <section class="mb-section mb-section-inset">${sectionHead('품질 관리')}<div class="mb-quality-list">${[['scan-line','검사 프로세스','공정 기준에 따른 측정과 확인'],['ruler','측정 장비 관리','측정 장비 상태와 사용 기준 관리'],['clipboard-check','기록·추적 관리','검사 기록과 생산 이력 관리'],['shield-check','품질 관리 원칙','공정·검사·최종 검수 연계']].map(([i,t,c])=>`<article>${icon(i)}<div><b>${t}</b><span>${c}</span></div>${icon('chevron-right')}</article>`).join('')}</div></section>`,{title:'설비·품질'});
  }
  function morePage(){
    const entries=[['company','회사소개'],['contact','연락처'],['directions','오시는 길'],['privacy','개인정보 처리방침']];
    return shell('company',`<section class="mb-more-list">${entries.map(([key,label])=>`<button type="button" data-action="mobile:info:${key}"><span>${esc(label)}</span>${icon('chevron-right')}</button>`).join('')}</section>
      <section class="mb-contact-card"><a href="tel:0553237157">${icon('phone')}<span><small>전화</small><b>055-323-7157</b></span></a><a href="mailto:ndh7157@hanmail.net">${icon('mail')}<span><small>이메일</small><b>ndh7157@hanmail.net</b></span></a><a href="${MAP_URL}" target="_blank" rel="noopener noreferrer">${icon('map-pin')}<span><small>주소</small><b>경남 김해시 한림면 신천산단로 52</b></span></a></section>`,{title:'더보기'});
  }
  function page(active){
    const routeChanged=state.route!==active;
    if(routeChanged){
      state.productId=null;
      state.viewer=null;
      state.drawer=false;
      state.info=null;
      if(global.history?.state?.dgtcMobileOverlay)global.history.replaceState(null,'',global.location.href);
    }
    state.route=active;
    if(active==='home')return homePage();
    if(active==='fields')return fieldsPage();
    if(active==='products')return productsPage();
    if(active==='facilities'||active==='quality'){
      if(active==='quality')state.facilityTab='quality';
      return facilityPage();
    }
    return morePage();
  }
  function productDetail(){
    const product=PRODUCTS.find(item=>item.id===state.productId);
    if(!product)return '';
    const gallery=[product,...PRODUCTS.filter(item=>item.id!==product.id).slice(0,4)];
    return `<section class="mb-fullscreen mb-product-detail" role="dialog" aria-modal="true" aria-labelledby="mb-product-title" data-mobile-dialog="product">
      <header><button class="mb-icon-button" type="button" data-action="mobile:product-close" aria-label="제품 상세 닫기">${icon('x')}</button><strong>제품 상세</strong><button class="mb-icon-button" type="button" data-action="mobile:viewer-open:${product.id}:0" aria-label="이미지 크게 보기">${icon('maximize-2')}</button></header>
      <div class="mb-detail-scroll"><button type="button" class="mb-detail-image" data-action="mobile:viewer-open:${product.id}:0">${image(product.image,product.name,'',true)}<span>${icon('maximize-2')} 크게 보기</span></button><div class="mb-detail-dots" aria-label="이미지 1 / ${gallery.length}"><i class="is-active"></i>${gallery.slice(1).map(()=>'<i></i>').join('')}</div>
      <section class="mb-detail-copy"><small>${esc(product.categoryLabel)}</small><h1 id="mb-product-title">${esc(product.name)}</h1><dl><div><dt>분류</dt><dd>${esc(product.categoryLabel)}</dd></div><div><dt>가공 방식</dt><dd>CNC 자동선반 정밀가공</dd></div><div><dt>공정</dt><dd>가공 · 측정 · 검사 · 세척</dd></div><div><dt>검사</dt><dd>공정 중 측정 및 최종 검수</dd></div></dl></section>
      <section class="mb-detail-gallery">${sectionHead('상세 이미지')}<div>${gallery.map((item,index)=>`<button type="button" data-action="mobile:viewer-open:${product.id}:${index}">${image(item.image,item.name)}</button>`).join('')}</div></section></div>
    </section>`;
  }
  function drawer(){
    if(!state.drawer)return '';
    return `<div class="mb-drawer-backdrop" data-mobile-dialog="drawer"><aside class="mb-drawer" role="dialog" aria-modal="true" aria-labelledby="mb-drawer-title"><header><img src="${LOGO}" alt="대광테크"><button class="mb-icon-button" type="button" data-action="mobile:drawer-close" aria-label="전체 메뉴 닫기"><img class="mb-drawer-svg" src="${ICON}/png/x.png" alt="" aria-hidden="true"></button></header><h2 id="mb-drawer-title" class="mb-sr-only">전체 메뉴</h2><nav>${NAV.map(([route,label,,key])=>`<button type="button" class="${state.route===key?'is-active':''}" data-action="mobile:drawer-route:${route}">${esc(label)}</button>`).join('')}</nav><div class="mb-drawer-actions"><a href="tel:0553237157"><img class="mb-drawer-svg" src="${ICON}/png/phone.png" alt="" aria-hidden="true"><span>전화하기</span></a><a href="mailto:ndh7157@hanmail.net"><img class="mb-drawer-svg" src="${ICON}/png/mail.png" alt="" aria-hidden="true"><span>이메일</span></a><a href="${MAP_URL}" target="_blank" rel="noopener noreferrer"><img class="mb-drawer-svg" src="${ICON}/png/map-pin.png" alt="" aria-hidden="true"><span>오시는 길</span></a></div></aside></div>`;
  }
  function viewer(){
    if(!state.viewer)return '';
    const gallery=[state.viewer,...PRODUCTS.filter(item=>item.id!==state.viewer.id).slice(0,5)];
    const index=Math.max(0,Math.min(state.viewerIndex,gallery.length-1));
    const current=gallery[index];
    return `<section class="mb-fullscreen mb-viewer" role="dialog" aria-modal="true" aria-label="제품 이미지 뷰어" data-mobile-dialog="viewer"><header><span>${index+1} / ${gallery.length}</span><button class="mb-icon-button" type="button" data-action="mobile:viewer-close" aria-label="이미지 뷰어 닫기">${icon('x')}</button></header><div class="mb-viewer-stage" data-mobile-viewer-stage>${image(current.image,current.name,'',true)}</div><div class="mb-viewer-thumbs">${gallery.map((item,i)=>`<button type="button" class="${i===index?'is-active':''}" data-action="mobile:viewer-index:${i}" aria-label="이미지 ${i+1}">${image(item.image,item.name)}</button>`).join('')}</div></section>`;
  }
  function infoPanel(){
    if(!state.info)return '';
    const data={
      company:['회사소개','대광테크는 CNC 자동선반을 기반으로 자동차부품, 유압부품, 전자부품 분야의 정밀 금속 부품을 가공합니다.'],
      contact:['연락처','TEL 055-323-7157\nFAX 055-314-5430\nE-mail ndh7157@hanmail.net'],
      directions:['오시는 길','경남 김해시 한림면 신천산단로 52'],
      privacy:['개인정보 처리방침','대광테크 공개 홈페이지는 별도의 개인정보 입력 양식이나 파일 업로드 기능을 제공하지 않습니다.']
    }[state.info];
    if(!data)return '';
    return `<section class="mb-fullscreen mb-info-panel" role="dialog" aria-modal="true" aria-labelledby="mb-info-title" data-mobile-dialog="info"><header><button class="mb-icon-button" type="button" data-action="mobile:info-close" aria-label="닫기">${icon('arrow-left')}</button><strong id="mb-info-title">${esc(data[0])}</strong><span></span></header><div>${state.info==='directions'?image(`${ASSET}/company-front.jpg`,'대광테크 회사 전경'):''}<p>${esc(data[1]).replace(/\n/g,'<br>')}</p>${state.info==='directions'?`<a href="${MAP_URL}" target="_blank" rel="noopener noreferrer">${icon('map-pin')} 카카오맵에서 보기</a>`:''}</div></section>`;
  }
  function renderOverlays(){
    return `${state.viewer?'':productDetail()}${drawer()}${viewer()}${infoPanel()}`;
  }
  function hasOverlay(){return Boolean(state.viewer||state.drawer||state.info||state.productId);}
  function overlayType(){return state.viewer?'viewer':state.drawer?'drawer':state.info?'info':state.productId?'product':'';}
  function pushOverlay(type){
    if(global.history?.pushState)global.history.pushState({dgtcMobileOverlay:type},'',global.location.href);
  }
  function clearTopOverlay(){
    if(state.viewer){state.viewer=null;state.viewerIndex=0;}
    else if(state.drawer)state.drawer=false;
    else if(state.info)state.info=null;
    else state.productId=null;
  }
  function closeOverlay(){
    if(global.history?.state?.dgtcMobileOverlay)global.history.back();
    else{clearTopOverlay();context?.render();}
  }
  function navigate(path){
    state.drawer=false;state.viewer=null;state.productId=null;state.info=null;
    if(global.history?.state?.dgtcMobileOverlay)global.history.replaceState(null,'',global.location.href);
    if(path==='quality'){state.facilityTab='quality';path='facilities';}
    context?.go(path);
  }
  function action(command){
    const [type,...parts]=String(command||'').split(':');
    const arg=parts.join(':');
    if(type==='route')return navigate(arg);
    if(type==='back')return global.history.length>1?global.history.back():navigate('home');
    if(type==='field-route'){state.field=arg;return navigate('fields');}
    if(type==='field'){if(FIELD_DATA[arg])state.field=arg;return context?.render();}
    if(type==='filter'){state.filter=arg;return context?.render();}
    if(type==='search-clear'){state.search='';return context?.render();}
    if(type==='segment'){state.facilityTab=arg;return context?.render();}
    if(type==='product'){
      if(!PRODUCTS.some(item=>item.id===arg))return;
      state.productId=arg;pushOverlay('product');return context?.render();
    }
    if(type==='product-close'||type==='drawer-close'||type==='viewer-close'||type==='info-close')return closeOverlay();
    if(type==='drawer-open'){state.drawer=true;pushOverlay('drawer');return context?.render();}
    if(type==='drawer-route')return navigate(arg);
    if(type==='viewer-open'){
      const product=PRODUCTS.find(item=>item.id===parts[0]);if(!product)return;
      state.viewer=product;state.viewerIndex=Number(parts[1]||0);pushOverlay('viewer');return context?.render();
    }
    if(type==='viewer-index'){state.viewerIndex=Number(arg)||0;return context?.render();}
    if(type==='viewer-next'||type==='viewer-prev'){
      const count=Math.min(PRODUCTS.length,6);const step=type==='viewer-next'?1:-1;
      state.viewerIndex=(state.viewerIndex+step+count)%count;return context?.render();
    }
    if(type==='info'){state.info=arg;pushOverlay('info');return context?.render();}
  }
  function afterRender(){
    const type=overlayType();
    document.body.classList.toggle('mb-scroll-lock',hasOverlay());
    if(type&&type!==lastDialog){queueMicrotask(()=>document.querySelector('[data-mobile-dialog] button, [data-mobile-dialog] a')?.focus());}
    lastDialog=type;
  }
  function init(nextContext){
    context=nextContext;
    document.addEventListener('input',event=>{
      if(!event.target.matches('[data-mobile-search]'))return;
      state.search=event.target.value;
      const selection=event.target.selectionStart;
      context?.render();
      queueMicrotask(()=>{const input=document.querySelector('[data-mobile-search]');if(input){input.focus();input.setSelectionRange(selection,selection);}});
    });
    document.addEventListener('touchstart',event=>{if(event.target.closest('[data-mobile-viewer-stage]'))state.touchX=event.touches[0]?.clientX??null;},{passive:true});
    document.addEventListener('touchend',event=>{
      if(state.touchX===null||!event.target.closest('[data-mobile-viewer-stage]'))return;
      const delta=(event.changedTouches[0]?.clientX??state.touchX)-state.touchX;state.touchX=null;
      if(Math.abs(delta)>44)action(delta<0?'viewer-next':'viewer-prev');
    },{passive:true});
    document.addEventListener('click',event=>{
      if(event.target.classList.contains('mb-drawer-backdrop'))closeOverlay();
    });
    document.addEventListener('keydown',event=>{
      if(!hasOverlay())return;
      if(event.key==='Escape'){event.preventDefault();closeOverlay();return;}
      if(state.viewer&&(event.key==='ArrowRight'||event.key==='ArrowLeft')){event.preventDefault();action(event.key==='ArrowRight'?'viewer-next':'viewer-prev');return;}
      if(event.key==='Tab'){
        const dialog=document.querySelector('[data-mobile-dialog]');
        const focusable=[...(dialog?.querySelectorAll('button:not([disabled]),a[href],input:not([disabled])')||[])];
        if(!focusable.length)return;
        const first=focusable[0],last=focusable.at(-1);
        if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus();}
        else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus();}
      }
    });
    global.addEventListener('popstate',()=>{
      if(hasOverlay()){clearTopOverlay();context?.render();}
    });
  }

  global.DGTCMobile={render:page,action,afterRender,init,data:{PRODUCTS,FIELD_DATA,FACILITIES},state};
})(window);
