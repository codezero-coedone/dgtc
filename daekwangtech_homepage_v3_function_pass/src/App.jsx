import React, { useEffect, useMemo, useState } from "react";
import { AdminApp } from "./admin.jsx";
import { loadStoredContent } from "./adminContentSeed.js";
import { DaekwangLogoLockup } from "./components/brand/DaekwangLogoLockup.jsx";
import { HomeNoticeSection } from "./components/notice/HomeNoticeSection.jsx";
import { NoticeDetailPage, NoticeListPage } from "./pages/NoticePages.jsx";
import { facilityCards, homeProducts, imageFallback, navItems, pageContent, processSteps, qualityCards, routeAlias } from "./siteData.js";

const manufacturingProcessSteps = [
  ["요구사항 확인", "제작 목적과 사용 조건, 납품 기준을 먼저 정리합니다."],
  ["도면·치수 검토", "도면과 공차 기준을 확인하고 가공 리스크를 사전에 점검합니다."],
  ["자재 준비", "소재 상태와 투입 조건을 확인해 공정 시작 기준을 맞춥니다."],
  ["정밀 가공", "설정된 조건에 따라 장비와 작업 기준을 일관되게 운용합니다."],
  ["조립·용접", "후가공과 조립이 필요한 항목은 별도 기준으로 확인합니다."],
  ["품질 확인", "치수, 형상, 표면 상태를 확인하고 검사 결과를 기록합니다."],
  ["납품·현장 대응", "포장, 출하, 현장 대응까지 추적 가능한 흐름으로 관리합니다."],
];

const qualityCheckpoints = [
  ["입고 확인", "자재와 도면 기준을 대조해 작업 전 조건을 정리합니다."],
  ["가공 정밀도", "가공 중 주요 치수와 공차를 단계별로 확인합니다."],
  ["조립·용접 검수", "조립 상태와 후가공 품질을 항목별로 점검합니다."],
  ["출고 전 확인", "최종 검사 결과와 출하 상태를 기록으로 남깁니다."],
];

function normalizeRoute() {
  const hash = window.location.hash.replace(/^#\/?/, "");
  const path = window.location.pathname.split("/").pop() ?? "";
  if (hash === "notice" || hash.startsWith("notice/")) return hash;
  const routeKey = hash || path || "index";
  return routeAlias[routeKey] ?? "not-found";
}

function routeHref(id) {
  return id === "index" ? "#/" : `#/${id}`;
}

function useRoute() {
  const [route, setRoute] = useState(() => normalizeRoute());
  useEffect(() => {
    const update = () => setRoute(normalizeRoute());
    window.addEventListener("hashchange", update);
    window.addEventListener("popstate", update);
    update();
    return () => {
      window.removeEventListener("hashchange", update);
      window.removeEventListener("popstate", update);
    };
  }, []);
  return route;
}

function useContent() {
  const [content, setContent] = useState(() => loadStoredContent());
  useEffect(() => {
    const onStorage = () => setContent(loadStoredContent());
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);
  return [content, setContent];
}

function applySeo(page) {
  document.title = page.seoTitle;
  const setMeta = (selector, attr, value) => {
    const node = document.querySelector(selector);
    if (node) node.setAttribute(attr, value);
  };
  setMeta('meta[name="description"]', "content", page.description);
  setMeta('meta[property="og:title"]', "content", page.seoTitle);
  setMeta('meta[property="og:description"]', "content", page.description);
  setMeta('meta[property="og:image"]', "content", page.heroImage);
}

function Header({ active, menuOpen = false, onMenu }) {
  const publicNavItems = [...navItems, { id: "notice", label: "공지사항" }];
  return (
    <header className={menuOpen ? "site-header nav-open" : "site-header"}>
      <a aria-label="DAE KWANG TECH home" className="brand" href="#/">
        <DaekwangLogoLockup className="header-mark-crop" tone="dark" size="sm" />
      </a>
      <nav className="desktop-nav">
        {publicNavItems.map((item) => (
          <a key={item.id} aria-current={active === item.id ? "page" : undefined} className={active === item.id ? "nav-link active" : "nav-link"} href={routeHref(item.id)}>
            {item.label}
          </a>
        ))}
      </nav>
      <div className="header-right">
        <button aria-controls="mobile-menu" aria-expanded={menuOpen ? "true" : "false"} aria-label="메뉴 열기" className="menu-button" type="button" onClick={onMenu}>☰</button>
      </div>
    </header>
  );
}

function MobilePanel({ active, open, onClose }) {
  const publicNavItems = [...navItems, { id: "notice", label: "공지사항" }];
  return (
    <div aria-hidden={!open} className="mobile-panel" id="mobile-menu" data-open={open ? "true" : undefined}>
      {publicNavItems.map((item) => (
        <a key={item.id} aria-current={active === item.id ? "page" : undefined} className={active === item.id ? "nav-link active" : "nav-link"} href={routeHref(item.id)} onClick={onClose}>{item.label}</a>
      ))}
    </div>
  );
}

function Hero({ page, active, menuOpen, setMenuOpen }) {
  return (
    <section className="hero">
      <div className="hero-bg">
        <img alt={`${page.label} 대표 이미지`} data-fallback-src={imageFallback} decoding="async" fetchPriority="high" loading="eager" src={page.heroImage} />
      </div>
      <div className="hero-blueprint" />
      <Header active={active} menuOpen={menuOpen} onMenu={() => setMenuOpen((value) => !value)} />
      <MobilePanel active={active} open={menuOpen} onClose={() => setMenuOpen(false)} />
      <div className="hero-content">
        <p className="eyebrow">{page.eyebrow}</p>
        <h1>{page.title}</h1>
        <h2>{page.headline.split("\n").map((line) => <React.Fragment key={line}>{line}<br /></React.Fragment>)}</h2>
        <p className="hero-copy">{page.summary}</p>
        <div className="hero-progress"><span>01</span><i></i><span>03</span></div>
      </div>
    </section>
  );
}

function FeatureRail({ items }) {
  return (
    <section className="feature-rail wrap" id="main-content">
      {items.map(([icon, title, body]) => (
        <article className="rail-item" key={`${title}-${body}`}>
          <div className="rail-icon">{icon}</div>
          <div><strong>{title}</strong><span>{body}</span></div>
        </article>
      ))}
    </section>
  );
}

function CardGrid({ cards, className = "sub-card-grid" }) {
  const [lightbox, setLightbox] = useState(null);
  return (
    <>
      <div className={className}>
        {cards.map(([title, desc, image]) => (
          <article className="product-card deep-card" key={title}>
            <img alt={title} className="js-lightbox-img" decoding="async" loading="lazy" role="button" src={image} tabIndex="0" onClick={() => setLightbox({ title, desc, image })} />
            <div className="card-body"><h3>{title}</h3><p>{desc}</p></div>
          </article>
        ))}
      </div>
      {lightbox ? (
        <div className="lightbox is-open" role="dialog" aria-modal="true">
          <div className="lightbox__dialog">
            <button className="lightbox__close" type="button" onClick={() => setLightbox(null)}>×</button>
            <img className="lightbox__image" src={lightbox.image} alt={lightbox.title} />
            <div className="lightbox__caption"><div><h3>{lightbox.title}</h3><p>{lightbox.desc}</p></div></div>
          </div>
        </div>
      ) : null}
    </>
  );
}

function MetricRow({ items }) {
  return (
    <section className="metric-row wrap">
      {items.map(([value, label]) => <article className="metric" key={`${value}-${label}`}><strong>{value}</strong><span>{label}</span></article>)}
    </section>
  );
}

function CompactClosingPanel({ page, items }) {
  const mapHref = "https://map.kakao.com/link/search/%EA%B2%BD%EA%B8%B0%EB%8F%84%20%ED%99%94%EC%84%B1%EC%8B%9C%20%EB%A7%88%EB%8F%84%EB%A9%B4%20%EC%B2%AD%EC%9B%90%EC%82%B0%EB%8B%A85%EA%B8%B8%2060-26";
  if (page.id === "company") {
    return (
      <section className="company-location-panel wrap" aria-label="대광테크 오시는 길">
        <div className="company-location-copy">
          <span>LOCATION</span>
          <strong>오시는 길</strong>
          <p>방문 전 주소와 연락처를 확인하실 수 있습니다. 지도는 카카오맵 검색 결과로 연결됩니다.</p>
        </div>
        <dl className="company-location-list">
          <div><dt>주소</dt><dd>경기도 화성시 마도면 청원산단5길 60-26</dd></div>
          <div><dt>전화</dt><dd>031-355-5400</dd></div>
          <div><dt>팩스</dt><dd>031-355-5402</dd></div>
          <div><dt>이메일</dt><dd>dgtc@daekwangtech.co.kr</dd></div>
        </dl>
        <div className="company-location-action" aria-label="대광테크 지도 연결">
          <div className="company-map-card" aria-hidden="true">
            <i />
            <b>DAEKWANG TECH</b>
            <small>청원산단5길 60-26</small>
          </div>
          <a className="kakao-map-link" href={mapHref} target="_blank" rel="noreferrer noopener" aria-label="카카오맵에서 대광테크 위치 보기">
            카카오맵에서 위치 보기
            <span>↗</span>
          </a>
        </div>
      </section>
    );
  }
  const copy = page.id === "technology"
    ? ["기술력 운영 기준", "가공 정밀도, 소재 대응, 도면 검토 기준을 한 화면 안에서 간결하게 정리합니다."]
    : ["회사 운영 기준", "신뢰, 정밀, 혁신, 상생을 중심으로 회사 소개 흐름을 무겁지 않게 마감합니다."];
  return (
    <section className={`sub-close-panel wrap sub-close-${page.id}`} aria-label={`${page.label} 핵심 요약`}>
      <div>
        <span>{copy[0]}</span>
        <strong>{copy[1]}</strong>
      </div>
      <ul>
        {items.map(([value, label]) => (
          <li key={`${page.id}-${value}-${label}`}>
            <b>{value}</b>
            <em>{label}</em>
          </li>
        ))}
      </ul>
    </section>
  );
}

function ProcessBand() {
  return (
    <section className="process-band">
      <div className="wrap process-layout">
        <div className="section-intro invert">
          <p className="section-kicker">제조 프로세스</p>
          <h2>체계적인 프로세스로<br />일관된 품질을 약속합니다</h2>
          <a className="detail-link" href="#/process">프로세스 자세히 보기 →</a>
        </div>
        <div className="step-row">
          {processSteps.map((step, index) => (
            <article className="step" key={step}><span>{String(index + 1).padStart(2, "0")}</span><div className="step-icon">⌁</div><h3>{step}</h3><p>단계별 기준과 기록 관리</p></article>
          ))}
        </div>
      </div>
    </section>
  );
}

function ProcessPageSection() {
  return (
    <section className="process-page-section">
      <div className="process-page-head">
        <p className="section-kicker">MANUFACTURING FLOW</p>
        <h3>요구사항 확인부터 현장 대응까지 같은 기준으로 움직입니다</h3>
        <p>도면 검토, 자재 준비, 정밀 가공, 품질 확인을 하나의 흐름으로 묶어 공정별 책임과 검증 기준을 분명하게 관리합니다.</p>
      </div>
      <div className="process-page-steps">
        {manufacturingProcessSteps.map(([step, desc], index) => (
          <article className="process-page-step" key={step}>
            <span>{String(index + 1).padStart(2, "0")}</span>
            <h4>{step}</h4>
            <p>{desc}</p>
          </article>
        ))}
      </div>
      <div className="process-page-principles">
        <article><strong>기준 관리</strong><p>공정별 체크 포인트를 정리해 반복 품질을 유지합니다.</p></article>
        <article><strong>검사 연계</strong><p>생산 단계와 품질 검증을 분리하지 않고 흐름 안에서 관리합니다.</p></article>
        <article><strong>기록 기반</strong><p>작업 이력과 결과를 남겨 다음 생산의 기준으로 활용합니다.</p></article>
      </div>
    </section>
  );
}

function QualityControlPanel() {
  return (
    <section className="quality-control-panel wrap">
      <div className="quality-control-copy">
        <p className="section-kicker">QUALITY CHECKPOINT</p>
        <h3>검사 기준을 공정 안에 묶어 품질을 확인합니다</h3>
        <p>대광테크의 품질 관리는 별도 장식 패널이 아니라 작업 흐름 안에서 반복되는 확인 기준입니다. 입고, 가공, 조립, 출고 단계마다 필요한 항목을 정리해 안정적인 결과를 만듭니다.</p>
      </div>
      <div className="quality-check-grid">
        {qualityCheckpoints.map(([title, desc], index) => (
          <article key={title}>
            <span>{String(index + 1).padStart(2, "0")}</span>
            <strong>{title}</strong>
            <p>{desc}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function ProductsPreview() {
  return (
    <section className="split-section wrap home-products-section">
      <div className="section-intro"><p className="section-kicker">제품/서비스</p><h2>정밀 기술로 완성하는<br />최고의 솔루션</h2><p>다양한 산업의 요구를 충족하는 고정밀 부품 및 금속 가공 솔루션을 제공합니다.</p><a className="detail-link" href="#/products">자세히 보기 →</a></div>
      <CardGrid cards={homeProducts} className="product-grid" />
    </section>
  );
}

function QualityPreview() {
  return (
    <section className="split-section wrap quality-home home-quality-section">
      <div className="section-intro"><p className="section-kicker">품질 관리</p><h2>정밀한 검증이<br />신뢰를 만듭니다</h2><p>품질 관리 시스템과 측정 장비로 안정적인 품질을 보장합니다.</p><a className="detail-link" href="#/quality">품질 관리 자세히 보기 →</a></div>
      <CardGrid cards={qualityCards} className="quality-grid" />
    </section>
  );
}

function FacilityPreview() {
  return (
    <section className="split-section wrap home-facility-section">
      <div className="section-intro"><p className="section-kicker">설비 / 시설</p><h2>최첨단 설비와<br />강력한 생산 인프라</h2><p>고품질 가공을 위한 설비와 생산 시스템을 구축하고 있습니다.</p><a className="detail-link" href="#/facility">설비 현황 자세히 보기 →</a></div>
      <CardGrid cards={facilityCards} className="facility-grid" />
    </section>
  );
}

function TrustPreview({ posts }) {
  const visiblePosts = posts.filter((post) => post.status === "published" || post.pinned);
  return (
    <>
      <section className="trust-section wrap">
        <div className="section-intro"><p className="section-kicker">회사 소개</p><h2>신뢰와 도전으로<br />미래를 만듭니다</h2><p>고객과 함께 성장하는 기업, 대광테크입니다.</p><a className="detail-link" href="#/company">회사 소개 자세히 보기 →</a></div>
        <div className="trust-grid">
          <article className="stat-card"><strong>1998</strong><span>대광테크 설립</span><p>정밀 가공 전문 기업으로 시작</p></article>
          <article className="stat-card"><strong>200+</strong><span>협력 파트너</span><p>다양한 산업의 신뢰받는 파트너</p></article>
          <article className="stat-card"><strong>1,000+</strong><span>프로젝트 수행</span><p>풍부한 경험과 노하우 축적</p></article>
          <article className="map-card"><h3>글로벌 산업 지원</h3><p>자동차, 항공우주, 반도체, 의료, 산업기계 등 다양한 산업 분야 지원</p><img alt="global map" src="assets/map.jpg" /></article>
        </div>
      </section>
      {visiblePosts.length ? (
        <section className="admin-managed-posts wrap">
          <div className="section-intro"><p className="section-kicker">NEWS</p><h2>공지사항</h2><p>대광테크의 주요 안내와 기업 소식을 전합니다.</p></div>
          <div className="admin-post-grid">{visiblePosts.map((post) => <article className="admin-post-card" key={post.id}><span>{post.category}</span><h3>{post.title}</h3><p>{post.summary}</p><small>{post.publishedAt}</small></article>)}</div>
        </section>
      ) : null}
    </>
  );
}

function SubPage({ page, detail }) {
  const isProcessPage = page.id === "process";
  const isQualityPage = page.id === "quality";
  const isCompactClosingPage = page.id === "technology" || page.id === "company";
  return (
    <>
      <section className="sub-main wrap">
        <div className="section-intro">
          <p className="section-kicker">{page.eyebrow}</p>
          <h2>{page.headline.split("\n").map((line) => <React.Fragment key={line}>{line}<br /></React.Fragment>)}</h2>
          <p>{page.summary}</p>
        </div>
        {detail.cards ? <CardGrid cards={detail.cards} /> : isProcessPage ? <ProcessPageSection /> : <ProcessBand />}
      </section>
      {isQualityPage ? <QualityControlPanel /> : isCompactClosingPage && detail.metrics ? <CompactClosingPanel page={page} items={detail.metrics} /> : detail.metrics ? <MetricRow items={detail.metrics} /> : null}
    </>
  );
}

function Footer({ company }) {
  return (
    <footer className="site-footer">
      <div className="footer-brand"><DaekwangLogoLockup tone="dark" size="sm" /></div>
      <p>{company.address}</p><p>T. {company.tel}</p><p>F. {company.fax}</p><p className="copyright">© DAE KWANG TECH All rights reserved.</p>
      <div className="footer-links"><a href="#/company">회사 소개</a><a href="#/quality">품질 관리</a><a href="#/notice">공지사항</a></div>
    </footer>
  );
}

function NotFoundPage({ company, menuOpen, setMenuOpen }) {
  return (
    <div className="site-shell route-not-found">
      <a className="skip-link" href="#main-content">본문 바로가기</a>
      <Header active="" menuOpen={menuOpen} onMenu={() => setMenuOpen((value) => !value)} />
      <MobilePanel active="" open={menuOpen} onClose={() => setMenuOpen(false)} />
      <main className="not-found-page wrap" id="main-content">
        <section className="not-found-panel" aria-labelledby="not-found-title">
          <p className="section-kicker">PAGE NOT FOUND</p>
          <h1 id="not-found-title">페이지를 찾을 수 없습니다</h1>
          <p>요청하신 주소가 변경되었거나 존재하지 않습니다. 대광테크 주요 페이지로 다시 이동해 주세요.</p>
          <div className="not-found-actions">
            <a className="detail-link" href="#/">홈으로 이동</a>
            <a className="detail-link" href="#/notice">공지사항 보기</a>
          </div>
        </section>
      </main>
      <Footer company={company} />
    </div>
  );
}

function SiteApp({ content, setContent, route }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const page = useMemo(() => content.pages.find((item) => item.id === route) ?? content.pages[0], [content.pages, route]);
  const detail = pageContent[page.id] ?? pageContent.index;

  useEffect(() => {
    if (route === "admin") return;
    if (route === "not-found") {
      document.title = "페이지를 찾을 수 없습니다 | 대광테크";
      const node = document.querySelector('meta[name="description"]');
      if (node) node.setAttribute("content", "요청하신 대광테크 페이지를 찾을 수 없습니다.");
    } else
    if (route === "notice" || route.startsWith("notice/")) {
      document.title = "공지사항 | 대광테크";
      const node = document.querySelector('meta[name="description"]');
      if (node) node.setAttribute("content", "대광테크의 주요 안내와 최신 소식을 확인하실 수 있습니다.");
    } else {
      applySeo(page);
    }
    document.body.classList.toggle("nav-open", menuOpen);
    return () => document.body.classList.remove("nav-open");
  }, [page, menuOpen, route]);

  useEffect(() => {
    setMenuOpen(false);
  }, [route]);

  if (route === "admin") return <AdminApp content={content} onContentChange={setContent} />;
  if (route === "not-found") return <NotFoundPage company={content.company} menuOpen={menuOpen} setMenuOpen={setMenuOpen} />;
  if (route === "notice" || route.startsWith("notice/")) {
    const noticeId = route.startsWith("notice/") ? route.split("/")[1] : null;
    return (
      <div className="site-shell route-notice">
        <a className="skip-link" href="#main-content">본문 바로가기</a>
        <Header active="notice" menuOpen={menuOpen} onMenu={() => setMenuOpen((value) => !value)} />
        <MobilePanel active="notice" open={menuOpen} onClose={() => setMenuOpen(false)} />
        {noticeId ? <NoticeDetailPage noticeId={noticeId} /> : <NoticeListPage />}
        <Footer company={content.company} />
      </div>
    );
  }

  return (
    <div className={`site-shell route-${page.id}`}>
      <a className="skip-link" href="#main-content">본문 바로가기</a>
      {page.id === "index" ? (
        <>
          <Hero page={page} active={page.id} menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
          <FeatureRail items={detail.rail} />
          <ProductsPreview />
          <ProcessBand />
          <QualityPreview />
          <FacilityPreview />
          <HomeNoticeSection />
          <TrustPreview posts={content.posts} />
          <Footer company={content.company} />
        </>
      ) : (
        <>
          <Hero page={page} active={page.id} menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
          <FeatureRail items={detail.rail} />
          <SubPage page={page} detail={detail} />
          <Footer company={content.company} />
        </>
      )}
    </div>
  );
}

export default function App() {
  const route = useRoute();
  const [content, setContent] = useContent();
  return <SiteApp content={content} setContent={setContent} route={route} />;
}
