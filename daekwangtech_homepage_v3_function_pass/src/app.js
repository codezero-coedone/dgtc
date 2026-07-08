const CT_SSS_FINAL = 'CT-SSS0~SSS8_PUBLIC_AUTHORITY_FINAL';

const root = document.getElementById('app');
const media = {
  hero: 'public/site-assets/hero-components.jpg',
  process: 'public/site-assets/process-shaft-detail.jpg',
  facility: 'public/site-assets/equipment-hanwha-xdi32.jpg',
  facilityLabel: 'public/site-assets/equipment-hanwha-xdi32-label.jpg',
  quality: 'public/site-assets/inspection-cmm.jpg',
  map: 'public/site-assets/map.jpg',
  products: [
    'public/products/product-01.jpg',
    'public/products/product-02.jpg',
    'public/products/product-03.jpg',
    'public/products/product-04.jpg',
    'public/products/product-05.jpg',
    'public/products/product-06.jpg'
  ]
};

const routes = {
  home: { label: '홈', title: '정밀한 기술로 최고의 품질을 만듭니다.' },
  company: { label: '회사소개', title: '김해 한림면 CNC 자동선반 정밀가공 기업' },
  fields: { label: '가공분야', title: '자동차·유압·전자 부품 가공 대응' },
  products: { label: '제품사례', title: '소형 정밀 금속부품 제품사례' },
  facilities: { label: '설비현황', title: '한화 XDI26/32 CNC 자동선반 기반' },
  quality: { label: '품질관리', title: '입고부터 출하 전 검사까지 이어지는 품질 흐름' }
};

const proofSteps = [
  { key: 'drawing', title: '도면 검토', body: '가공 기준과 관리 항목을 먼저 확인해 공정 기준을 세웁니다.', route: 'fields' },
  { key: 'plan', title: '공정 설계', body: '소재·형상·측정 기준에 맞춰 CNC 자동선반 가공 흐름을 정리합니다.', route: 'fields' },
  { key: 'cnc', title: 'CNC 가공', body: '한화 XDI26/32 기반의 Swiss Turning Lathe로 소형 정밀 금속부품을 가공합니다.', route: 'facilities' },
  { key: 'measure', title: '측정/검사', body: '현장재 검사, 공정 확인, 최종 검수를 분리해 품질 기준을 확인합니다.', route: 'quality' },
  { key: 'clean', title: '세척/포장', body: '출하 전 제품 상태를 정리하고 식별 가능한 단위로 관리합니다.', route: 'quality' },
  { key: 'ship', title: '출하', body: '자동차·유압·전자 부품 분야 납품 흐름에 맞춰 정리합니다.', route: 'company' }
];

const cards = [
  { key: 'fields-auto', route: 'fields', title: '자동차부품', kicker: '가공분야', body: '소형 정밀 금속부품 중심의 반복 생산 대응.', img: media.products[0] },
  { key: 'fields-hyd', route: 'fields', title: '유압부품', kicker: '가공분야', body: '피팅, 밸브 계열 부품에 맞춘 형상 관리.', img: media.products[1] },
  { key: 'fields-elec', route: 'fields', title: '전자부품', kicker: '가공분야', body: '정밀 체결·연결 부품에 필요한 가공 흐름.', img: media.products[2] },
  { key: 'products-case', route: 'products', title: '제품·가공사례', kicker: '제품사례', body: '실제 가공품 사진 중심으로 제품 사례를 확인합니다.', img: media.products[3] },
  { key: 'facility-xdi', route: 'facilities', title: '한화 XDI26/32', kicker: '설비현황', body: 'CNC Swiss Turning Lathe 기반 설비 정보와 모델 라벨을 함께 제공합니다.', img: media.facility },
  { key: 'quality-loop', route: 'quality', title: '품질관리 흐름', kicker: '품질관리', body: '현장재 검사, 공정 관리, 측정, 최종 검수를 단계로 분리합니다.', img: media.quality }
];

const companyRows = [
  ['상호', '대광테크 / DAE KWANG TECH'],
  ['업종', 'CNC 자동선반 전문 가공업체'],
  ['담당', '이원근 이사'],
  ['주소', '경남 김해시 한림면 신천산단로 52'],
  ['지번', '경남 김해시 한림면 신천리 984'],
  ['TEL', '055-323-7157'],
  ['FAX', '055-314-5430'],
  ['Mobile', '010-9256-7475'],
  ['E-mail', 'ndh7157@hanmail.net']
];

const routeOrder = ['home', 'company', 'fields', 'products', 'facilities', 'quality'];
const bottomOrder = ['home', 'fields', 'products', 'facilities', 'quality'];

function getRoute(){
  const raw = (location.hash || '#/home').replace(/^#\/?/, '');
  const key = raw.split('/')[0] || 'home';
  return routes[key] ? key : 'home';
}

function go(route){
  if(!routes[route]) return;
  location.hash = '#/' + route;
}

function esc(value){
  return String(value).replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
}

function image(src, alt){
  return `<img src="${esc(src)}" alt="${esc(alt)}" decoding="async">`;
}

function header(active){
  return `
    <header class="site-header" data-ct="${CT_SSS_FINAL}">
      <button class="brand" type="button" data-route="home" aria-label="대광테크 홈">
        <span class="brand-mark">DK</span><span class="brand-name">DAE KWANG TECH</span>
      </button>
      <nav class="desktop-nav" aria-label="주요 화면">
        ${routeOrder.map(key => `<button type="button" class="${active === key ? 'active' : ''}" data-route="${key}">${routes[key].label}</button>`).join('')}
      </nav>
      <div class="header-tel">TEL 055-323-7157</div>
    </header>
  `;
}

function hero(){
  return `
    <section class="hero-section">
      <div class="hero-copy">
        <p class="eyebrow">김해 CNC 자동선반 정밀가공</p>
        <h1>정밀한 기술로<br>최고의 품질을<br>만듭니다.</h1>
        <p class="hero-lead">대광테크는 CNC 자동선반 전문 가공업체로<br>자동차부품, 유압부품, 전자부품 분야의<br>소형 정밀 금속부품 가공을 수행합니다.</p>
        <div class="cta-row">
          <button type="button" class="primary" data-route="fields">가공분야 보기</button>
          <button type="button" class="secondary" data-route="products">제품사례 보기</button>
          <button type="button" class="secondary" data-route="facilities">설비현황 보기</button>
          <button type="button" class="secondary" data-route="company">회사정보 보기</button>
        </div>
      </div>
      <div class="hero-visual">
        ${image(media.hero, '정밀 가공 금속 부품')}
      </div>
    </section>
  `;
}

function proofLoop(){
  return `
    <section class="section proof-section" id="process-flow">
      <div class="section-head">
        <p class="eyebrow">4D Proof Loop</p>
        <h2>도면부터 출하까지 끊기지 않는 공정 흐름</h2>
      </div>
      <div class="proof-loop" data-proof-loop="true">
        ${proofSteps.map((step, idx) => `
          <button type="button" class="proof-step" data-detail="proof:${step.key}" data-route-target="${step.route}">
            <span>${String(idx + 1).padStart(2, '0')}</span>
            <strong>${step.title}</strong>
            <em>${step.body}</em>
          </button>
        `).join('')}
      </div>
    </section>
  `;
}

function cardGrid(title = '핵심 화면'){
  return `
    <section class="section">
      <div class="section-head">
        <p class="eyebrow">Public Navigation</p>
        <h2>${title}</h2>
      </div>
      <div class="card-grid">
        ${cards.map(card => `
          <article class="info-card">
            <button type="button" class="card-hit" data-detail="card:${card.key}" aria-label="${esc(card.title)} 상세">
              <figure>${image(card.img, card.title)}</figure>
              <div>
                <p>${card.kicker}</p>
                <h3>${card.title}</h3>
                <span>${card.body}</span>
                <b>자세히 보기</b>
              </div>
            </button>
          </article>
        `).join('')}
      </div>
    </section>
  `;
}

function companyPage(){
  return `
    <section class="page-hero compact">
      <p class="eyebrow">Company</p>
      <h1>${routes.company.title}</h1>
      <p>김해 한림면 신천산단로에서 CNC 자동선반 기반 정밀 금속부품 가공을 수행합니다.</p>
    </section>
    <section class="section two-col">
      <div class="data-panel">
        <h2>회사 개요</h2>
        <dl>${companyRows.map(([k,v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join('')}</dl>
      </div>
      <div class="data-panel map-panel">
        ${image(media.map, '대광테크 위치 지도')}
        <h2>오시는 길</h2>
        <p>경남 김해시 한림면 신천산단로 52</p>
        <button type="button" class="primary" data-map="kakao">카카오맵에서 보기</button>
      </div>
    </section>
  `;
}

function fieldsPage(){
  const rows = [
    ['자동차부품', '소형 정밀 금속부품', '반복 생산 기준의 형상 관리'],
    ['유압부품', '피팅·밸브 계열', '체결부와 유로 형상 관리'],
    ['전자부품', '체결·연결 부품', '소형 부품의 치수 안정성 관리']
  ];
  return `
    <section class="page-hero compact">
      <p class="eyebrow">Machining Fields</p>
      <h1>${routes.fields.title}</h1>
      <p>가공분야는 사진, 대응품목, 공정 흐름이 같은 기준으로 연결됩니다.</p>
    </section>
    <section class="section">
      <div class="square-table">
        ${rows.map(row => `<button type="button" data-detail="field:${row[0]}"><strong>${row[0]}</strong><span>${row[1]}</span><em>${row[2]}</em></button>`).join('')}
      </div>
    </section>
    ${cardGrid('가공분야와 연결된 제품·설비·품질')}
  `;
}

function productsPage(){
  return `
    <section class="page-hero compact">
      <p class="eyebrow">Product Cases</p>
      <h1>${routes.products.title}</h1>
      <p>명함, 로고, 관리자 화면이 아닌 실제 가공품 이미지 중심으로 정리했습니다.</p>
    </section>
    <section class="section product-gallery">
      ${media.products.map((src, idx) => `
        <button type="button" class="product-tile" data-detail="product:${idx + 1}">
          ${image(src, `제품사례 ${idx + 1}`)}
          <span>제품사례 ${String(idx + 1).padStart(2, '0')}</span>
        </button>
      `).join('')}
    </section>
  `;
}

function facilitiesPage(){
  return `
    <section class="page-hero compact">
      <p class="eyebrow">Facilities</p>
      <h1>한화 XDI26/32 CNC 자동선반<br>기반</h1>
      <p>보유 설비 모델 정보와 실제 라벨 증거를 분리해 배치했습니다.</p>
    </section>
    <section class="facility-layout">
      <figure class="facility-photo">${image(media.facility, '한화 XDI26/32 CNC 자동선반')}<figcaption>대표 장비 이미지 · 모델 정보용</figcaption></figure>
      <div class="facility-info">
        <h2>한화 XDI26/32 CNC 자동선반</h2>
        <dl>
          <div><dt>장비 구분</dt><dd>CNC 자동선반</dd></div>
          <div><dt>모델</dt><dd>한화 XDI26/32</dd></div>
          <div><dt>가공 방식</dt><dd>CNC Swiss Turning Lathe</dd></div>
          <div><dt>대응 품목</dt><dd>자동차부품 / 유압부품 / 전자부품</dd></div>
          <div><dt>적용 분야</dt><dd>소형 정밀 금속 부품</dd></div>
        </dl>
        <button type="button" class="secondary" data-route="quality">품질관리 보기</button>
      </div>
      <figure class="facility-label">
        ${image(media.facilityLabel, '한화 XDI32 설비 모델 라벨')}
        <figcaption>모델 라벨 확대 증거</figcaption>
      </figure>
    </section>
  `;
}

function qualityPage(){
  const rows = [
    ['현장재 검사', '입고 소재와 기준 항목 확인'],
    ['공정 관리', '가공 중 핵심 치수와 상태 확인'],
    ['검사 및 측정', '측정 장비 기반의 품질 확인'],
    ['최종 검수', '출하 전 상태와 식별 기준 확인']
  ];
  return `
    <section class="page-hero compact">
      <p class="eyebrow">Quality</p>
      <h1>${routes.quality.title}</h1>
      <p>품질관리는 공정 흐름 안에서 단계별 증거로 작동합니다.</p>
    </section>
    <section class="section">
      <div class="quality-grid">
        ${rows.map((row, idx) => `
          <button type="button" class="quality-card" data-detail="quality:${row[0]}">
            <span>${String(idx + 1).padStart(2, '0')}</span>
            <strong>${row[0]}</strong>
            <em>${row[1]}</em>
          </button>
        `).join('')}
      </div>
    </section>
    ${proofLoop()}
  `;
}

function homePage(){
  return `${hero()}${proofLoop()}${cardGrid('회사 이해를 위한 핵심 화면')}`;
}

function pageFor(route){
  if(route === 'company') return companyPage();
  if(route === 'fields') return fieldsPage();
  if(route === 'products') return productsPage();
  if(route === 'facilities') return facilitiesPage();
  if(route === 'quality') return qualityPage();
  return homePage();
}

function bottomNav(active){
  return `
    <nav class="mobile-bottom" aria-label="모바일 주요 화면">
      ${bottomOrder.map(key => `<button type="button" class="${active === key ? 'active' : ''}" data-route="${key}"><span>${routes[key].label}</span></button>`).join('')}
    </nav>
  `;
}

function adminLogin(){
  root.className = 'admin-root';
  root.innerHTML = `
    <main class="admin-login">
      <div class="admin-card">
        <div class="footer-brand dark"><span class="brand-mark">DK</span><span class="brand-name">DAE KWANG TECH</span></div>
        <h1>Admin Login</h1>
        <label>ID<input type="text" autocomplete="username"></label>
        <label>PW<input type="password" autocomplete="current-password"></label>
        <button type="button">Login</button>
      </div>
    </main>
  `;
}

function render(){
  const route = getRoute();
  if(route === 'admin' || location.hash.startsWith('#/admin')){
    adminLogin();
    return;
  }
  root.className = 'public-root';
  root.innerHTML = `
    ${header(route)}
    <main class="public-shell" data-public-authority="${CT_SSS_FINAL}">
      ${pageFor(route)}
    </main>
    <footer class="site-footer">
      <div class="footer-brand"><span class="brand-mark">DK</span><span class="brand-name">DAE KWANG TECH</span></div>
      <p>대광테크 · CNC 자동선반 전문 가공업체 · 경남 김해시 한림면 신천산단로 52</p>
      <p>TEL 055-323-7157 · FAX 055-314-5430 · ndh7157@hanmail.net</p>
    </footer>
    ${bottomNav(route)}
    <div id="detailMount"></div>
  `;
}

function findDetail(ref){
  const [type, key] = String(ref || '').split(':');
  if(type === 'proof'){
    const step = proofSteps.find(item => item.key === key);
    return step && { title: step.title, body: step.body, route: step.route, media: media.process };
  }
  if(type === 'card'){
    const card = cards.find(item => item.key === key);
    return card && { title: card.title, body: card.body, route: card.route, media: card.img };
  }
  if(type === 'field') return { title: key, body: `${key} 대응 품목과 공정 기준을 확인합니다.`, route: 'products', media: media.products[0] };
  if(type === 'product') return { title: `제품사례 ${key}`, body: '실제 가공품 이미지 기반의 제품사례입니다.', route: 'facilities', media: media.products[(Number(key) - 1) % media.products.length] };
  if(type === 'quality') return { title: key, body: `${key} 단계는 품질 흐름 안에서 별도 기준으로 확인됩니다.`, route: 'quality', media: media.quality };
  return null;
}

function openDetail(ref){
  const detail = findDetail(ref);
  if(!detail) return;
  const mount = document.getElementById('detailMount');
  mount.innerHTML = `
    <div class="detail-backdrop" data-close-detail></div>
    <aside class="detail-panel" role="dialog" aria-modal="true" aria-label="${esc(detail.title)}">
      <button type="button" class="detail-close" data-close-detail aria-label="닫기">×</button>
      <figure>${image(detail.media, detail.title)}</figure>
      <div class="detail-body">
        <p class="eyebrow">Detail</p>
        <h2>${detail.title}</h2>
        <p>${detail.body}</p>
        <button type="button" class="primary" data-route="${detail.route}">${routes[detail.route].label} 보기</button>
      </div>
    </aside>
  `;
  document.body.classList.add('detail-open');
}

function closeDetail(){
  const mount = document.getElementById('detailMount');
  if(mount) mount.innerHTML = '';
  document.body.classList.remove('detail-open');
}

document.addEventListener('click', event => {
  const routeButton = event.target.closest('[data-route]');
  if(routeButton){
    event.preventDefault();
    closeDetail();
    go(routeButton.dataset.route);
    return;
  }
  const detailButton = event.target.closest('[data-detail]');
  if(detailButton){
    event.preventDefault();
    openDetail(detailButton.dataset.detail);
    return;
  }
  if(event.target.closest('[data-close-detail]')){
    event.preventDefault();
    closeDetail();
    return;
  }
  if(event.target.closest('[data-map]')){
    event.preventDefault();
    window.open('https://map.kakao.com/?q=%EB%8C%80%EA%B4%91%ED%85%8C%ED%81%AC%20%EA%B2%BD%EB%82%A8%20%EA%B9%80%ED%95%B4%EC%8B%9C%20%ED%95%9C%EB%A6%BC%EB%A9%B4%20%EC%8B%A0%EC%B2%9C%EC%82%B0%EB%8B%A8%EB%A1%9C%2052', '_blank', 'noopener');
  }
});

document.addEventListener('keydown', event => {
  if(event.key === 'Escape') closeDetail();
});

window.addEventListener('hashchange', render);
render();
