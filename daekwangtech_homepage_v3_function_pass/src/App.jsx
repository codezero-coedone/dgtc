import React, { useEffect, useMemo, useState } from "react";
import { AdminApp } from "./admin.jsx";
import { loadStoredContent } from "./adminContentSeed.js";
import { DaekwangLogoLockup } from "./components/brand/DaekwangLogoLockup.jsx";
import { HomeNoticeSection } from "./components/notice/HomeNoticeSection.jsx";
import { NoticeDetailPage, NoticeListPage } from "./pages/NoticePages.jsx";
import { facilityCards, homeProducts, imageFallback, navItems, pageContent, processSteps, qualityCards, routeAlias } from "./siteData.js";

function normalizeRoute() {
  const hash = window.location.hash.replace(/^#\/?/, "");
  const path = window.location.pathname.split("/").pop() ?? "";
  if (hash === "notice" || hash.startsWith("notice/")) return hash;
  return routeAlias[hash || path || "index"] ?? "index";
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

function Header({ active, onMenu }) {
  const publicNavItems = [...navItems, { id: "notice", label: "공지사항" }];
  return (
    <header className="site-header">
      <a aria-label="DAE KWANG TECH home" className="brand" href="#/">
        <DaekwangLogoLockup tone="dark" size="sm" />
      </a>
      <nav className="desktop-nav">
        {publicNavItems.map((item) => (
          <a key={item.id} aria-current={active === item.id ? "page" : undefined} className={active === item.id ? "nav-link active" : "nav-link"} href={routeHref(item.id)}>
            {item.label}
          </a>
        ))}
      </nav>
      <div className="header-right">
        <button aria-label="현재 언어: 한국어" className="lang" title="현재 한국어 페이지입니다" type="button">KR <span>⌄</span></button>
        <a className="admin-mini-link" href="#/admin">ADMIN</a>
        <button aria-controls="mobile-menu" aria-expanded="false" aria-label="메뉴 열기" className="menu-button" type="button" onClick={onMenu}>☰</button>
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
      <a className="nav-link" href="#/admin" onClick={onClose}>관리자</a>
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
      <Header active={active} onMenu={() => setMenuOpen((value) => !value)} />
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

function ProductsPreview() {
  return (
    <section className="split-section wrap">
      <div className="section-intro"><p className="section-kicker">제품/서비스</p><h2>정밀 기술로 완성하는<br />최고의 솔루션</h2><p>다양한 산업의 요구를 충족하는 고정밀 부품 및 금속 가공 솔루션을 제공합니다.</p><a className="detail-link" href="#/products">자세히 보기 →</a></div>
      <CardGrid cards={homeProducts} className="product-grid" />
    </section>
  );
}

function QualityPreview() {
  return (
    <section className="split-section wrap quality-home">
      <div className="section-intro"><p className="section-kicker">품질 관리</p><h2>정밀한 검증이<br />신뢰를 만듭니다</h2><p>품질 관리 시스템과 측정 장비로 안정적인 품질을 보장합니다.</p><a className="detail-link" href="#/quality">품질 관리 자세히 보기 →</a></div>
      <CardGrid cards={qualityCards} className="quality-grid" />
    </section>
  );
}

function FacilityPreview() {
  return (
    <section className="split-section wrap">
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
          <div className="section-intro"><p className="section-kicker">NEWS</p><h2>공지사항</h2><p>운영 관리자가 발행한 대광테크 소식입니다.</p></div>
          <div className="admin-post-grid">{visiblePosts.map((post) => <article className="admin-post-card" key={post.id}><span>{post.category}</span><h3>{post.title}</h3><p>{post.summary}</p><small>{post.publishedAt}</small></article>)}</div>
        </section>
      ) : null}
    </>
  );
}

function SubPage({ page, detail }) {
  return (
    <>
      <section className="sub-main wrap">
        <div className="section-intro"><p className="section-kicker">{page.eyebrow}</p><h2>{page.headline}</h2><p>{page.summary}</p></div>
        {detail.cards ? <CardGrid cards={detail.cards} /> : <ProcessBand />}
      </section>
      {detail.metrics ? <MetricRow items={detail.metrics} /> : null}
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

function SiteApp({ content, setContent, route }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const page = useMemo(() => content.pages.find((item) => item.id === route) ?? content.pages[0], [content.pages, route]);
  const detail = pageContent[page.id] ?? pageContent.index;

  useEffect(() => {
    if (route === "admin") return;
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

  if (route === "admin") return <AdminApp content={content} onContentChange={setContent} />;
  if (route === "notice" || route.startsWith("notice/")) {
    const noticeId = route.startsWith("notice/") ? route.split("/")[1] : null;
    return (
      <>
        <a className="skip-link" href="#main-content">본문 바로가기</a>
        <Header active="notice" onMenu={() => setMenuOpen((value) => !value)} />
        <MobilePanel active="notice" open={menuOpen} onClose={() => setMenuOpen(false)} />
        {noticeId ? <NoticeDetailPage noticeId={noticeId} /> : <NoticeListPage />}
        <Footer company={content.company} />
      </>
    );
  }

  return (
    <>
      <a className="skip-link" href="#main-content">본문 바로가기</a>
      <Hero page={page} active={page.id} menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      <FeatureRail items={detail.rail} />
      {page.id === "index" ? <><ProductsPreview /><ProcessBand /><QualityPreview /><FacilityPreview /><HomeNoticeSection /><TrustPreview posts={content.posts} /></> : <SubPage page={page} detail={detail} />}
      <Footer company={content.company} />
    </>
  );
}

export default function App() {
  const route = useRoute();
  const [content, setContent] = useContent();
  return <SiteApp content={content} setContent={setContent} route={route} />;
}
