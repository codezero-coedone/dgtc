import React, { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import approvedBrandMarkUrl from "../assets/daekwang-approved-mark.svg";
import { AdminApp } from "./admin.jsx";
import { loadStoredContent } from "./adminContentSeed.js";
import { HomeNoticeSection } from "./components/notice/HomeNoticeSection.jsx";
import { NoticeDetailPage, NoticeListPage } from "./pages/NoticePages.jsx";
import { facilityCards, homeProducts, imageFallback, navItems, pageContent, qualityCards, routeAlias } from "./siteData.js";
import { publicImageSlots } from "./data/daekwangAdminData.js";
import { ADMIN_STORAGE_KEY, ADMIN_STORE_EVENT } from "./utils/adminStorage.js";

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

const premiumProcessSteps = [
  {
    num: "01",
    title: "고객 요구 분석",
    body: "고객의 요구사항과 사용 조건을 면밀히 분석해 사양과 기준을 정리합니다.",
    image: "assets/real-precision-threaded-pair.jpg",
    icon: "⌕",
  },
  {
    num: "02",
    title: "설계 & 엔지니어링",
    body: "정밀 설계와 공정 검토를 통해 성능과 제조 효율을 함께 확인합니다.",
    image: "assets/real-process-shaft-detail.jpg",
    icon: "◇",
  },
  {
    num: "03",
    title: "정밀 가공",
    body: "설비 조건과 작업 기준을 안정적으로 맞춰 고정밀 부품을 가공합니다.",
    image: "assets/real-black-valve-core.jpg",
    icon: "⚙",
  },
  {
    num: "04",
    title: "표면 처리 / 열처리",
    body: "내구성과 기능 향상을 위해 소재 특성에 맞는 후처리 공정을 수행합니다.",
    image: "assets/real-silver-valve-core.jpg",
    icon: "◱",
  },
  {
    num: "05",
    title: "검사 & 품질 검증",
    body: "측정 기준과 검사 기록을 기반으로 치수, 형상, 표면 품질을 검증합니다.",
    image: "assets/inspection-cmm.jpg",
    icon: "◎",
  },
  {
    num: "06",
    title: "조립 / 포장 / 출하",
    body: "조립 상태와 포장 조건을 확인해 안정적인 출하 흐름으로 마감합니다.",
    image: "assets/real-stepped-shaft-vertical.jpg",
    icon: "▥",
  },
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

function BrandLockup({ tone = "dark", variant = "header", className = "" }) {
  const classes = ["brand-lockup", `brand-lockup--${tone}`, `brand-lockup--${variant}`, className].filter(Boolean).join(" ");

  return (
    <span className={classes} role="img" aria-label="DAE KWANG TECH">
      <img className="brand-lockup__mark" src={approvedBrandMarkUrl} alt="" aria-hidden="true" decoding="async" />
      {variant === "route" ? null : (
        <span className="brand-lockup__text" aria-hidden="true">
          <span className="brand-lockup__name">DAE KWANG</span>
          <span className="brand-lockup__tech">TECH</span>
        </span>
      )}
    </span>
  );
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
        <BrandLockup tone="dark" variant="header" />
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

const mobileDockItems = [
  ["index", "홈", "home"],
  ["products", "제품", "box"],
  ["technology", "기술", "gear"],
  ["notice", "소식", "news"],
];

const mobileMenuItems = [
  ["index", "홈"],
  ["company", "회사소개"],
  ["process", "공정소개"],
  ["quality", "품질관리"],
  ["facility", "설비현황"],
  ["products", "제품소개"],
  ["notice", "공지사항"],
];

const mobileCapabilities = [
  ["precision", "정밀 가공", "최신 설비와 기술력으로 정밀한 제품을 생산"],
  ["quality", "품질 관리", "공정별 검증과 관리로 최고의 품질 보장"],
  ["innovation", "기술 혁신", "지속적인 연구개발로 기술 경쟁력 강화"],
  ["customer", "고객 중심", "고객 만족을 최우선으로 신뢰를 구축"],
];

const mobileProofImages = [
  ["생산 로트", "assets/real-hero-batch-components.jpg"],
  ["나사산 검증", "assets/real-precision-threaded-pair.jpg"],
  ["정밀 부품", "assets/real-black-valve-core.jpg"],
];

const mobileProcessCards = premiumProcessSteps.map(({ num, title, body, image }) => [num, title, body, image]);

const mobileProductCards = [
  ["유압 피팅", "Hydraulic Fitting", "고압 환경에서도 안정적인 성능을 확보하는 유압 피팅 제품군", "assets/real-black-valve-core.jpg"],
  ["밸브 컴포넌트", "Valve Component", "정밀한 가공 기술로 제작된 각종 밸브 구성 부품", "assets/real-silver-valve-core.jpg"],
  ["정밀 샤프트", "Precision Shaft", "자동차, 반도체, 의료기기 등 다양한 산업용 정밀 샤프트", "assets/real-stepped-shaft-vertical.jpg"],
  ["연결 부품", "Connection Part", "견고한 체결력과 내구성을 갖춘 연결 부품", "assets/real-process-shaft-detail.jpg"],
  ["특수 부품", "Custom Part", "고객 맞춤형 특수 사양 제품 및 가공 부품", "assets/real-precision-threaded-pair.jpg"],
];

const imageSlotFallbacks = Object.fromEntries(publicImageSlots.map((slot) => [slot.key, slot.fallback]));

function isUsablePublicImage(src) {
  if (typeof src !== "string") return false;
  const value = src.trim();
  if (!value) return false;
  const lower = value.toLowerCase();
  return !lower.startsWith("data:") && !lower.startsWith("javascript:");
}

function getStaticPublicImageSlots() {
  return {
    homeHeroImage: imageSlotFallbacks.homeHeroImage,
    processHeroImage: imageSlotFallbacks.processHeroImage,
    qualityVisualImage: imageSlotFallbacks.qualityVisualImage,
    facilityVisualImage: imageSlotFallbacks.facilityVisualImage,
    productsGalleryImages: [imageSlotFallbacks.productsGalleryImages].filter(Boolean),
  };
}

function pickPublicImageSrc(value) {
  if (typeof value === "string") return value;
  if (!value || typeof value !== "object") return "";
  return value.src || value.imageUrl || value.url || value.path || "";
}

function normalizePublicImageSlotPayload(payload) {
  const fallback = getStaticPublicImageSlots();
  if (!payload?.ok || !payload.slots || typeof payload.slots !== "object") return null;
  const slot = (key) => {
    const src = pickPublicImageSrc(payload.slots[key]);
    return isUsablePublicImage(src) ? src : fallback[key];
  };
  const products = Array.isArray(payload.slots.productsGalleryImages)
    ? payload.slots.productsGalleryImages.map(pickPublicImageSrc).filter(isUsablePublicImage)
    : [pickPublicImageSrc(payload.slots.productsGalleryImages)].filter(isUsablePublicImage);
  return {
    homeHeroImage: slot("homeHeroImage"),
    processHeroImage: slot("processHeroImage"),
    qualityVisualImage: slot("qualityVisualImage"),
    facilityVisualImage: slot("facilityVisualImage"),
    productsGalleryImages: products.length ? products : fallback.productsGalleryImages,
  };
}

function loadLocalPublicImageSlotOverrides() {
  const fallback = getStaticPublicImageSlots();
  if (typeof window === "undefined") return fallback;
  try {
    const parsed = JSON.parse(window.localStorage.getItem(ADMIN_STORAGE_KEY) || "{}");
    const assets = Array.isArray(parsed.imageAssets) ? parsed.imageAssets : [];
    const activeAssets = assets
      .filter((asset) => asset?.status !== "inactive" && isUsablePublicImage(asset?.imageUrl))
      .sort((a, b) => (Number(a.order) || 0) - (Number(b.order) || 0));
    const pick = (key) => activeAssets.find((asset) => asset.category === key)?.imageUrl || fallback[key];
    const products = activeAssets.filter((asset) => asset.category === "productsGalleryImages").map((asset) => asset.imageUrl);
    return {
      homeHeroImage: pick("homeHeroImage"),
      processHeroImage: pick("processHeroImage"),
      qualityVisualImage: pick("qualityVisualImage"),
      facilityVisualImage: pick("facilityVisualImage"),
      productsGalleryImages: products.length ? products : fallback.productsGalleryImages,
    };
  } catch {
    return fallback;
  }
}

function loadPublicImageSlotOverrides() {
  return getStaticPublicImageSlots();
}

function withFirstImage(cards, image) {
  if (!image || !cards.length) return cards;
  return cards.map((card, index) => (index === 0 ? [card[0], card[1], image] : card));
}

function withGalleryImages(cards, images = []) {
  if (!images.length) return cards;
  return cards.map((card, index) => {
    const next = [...card];
    next[next.length - 1] = images[index % images.length] || card[card.length - 1];
    return next;
  });
}

function withMobileProductImages(cards, images = []) {
  return images.length > 1 ? withGalleryImages(cards, images) : cards;
}

function mobileActiveTab(route, pageId) {
  const key = route.startsWith("notice") ? "notice" : pageId;
  if (key === "products") return "products";
  if (["technology", "process", "quality", "facility"].includes(key)) return "technology";
  if (key === "notice") return "notice";
  return "index";
}

function MobileTopBar({ title, tone = "light", menuOpen, setMenuOpen }) {
  const isHome = !title;
  return (
    <header className={`mobile-app-topbar mobile-app-topbar--${tone} ${isHome ? "mobile-app-topbar--home" : "mobile-app-topbar--route"}`}>
      {isHome ? (
        <a className="mobile-app-brand" href="#/" aria-label="대광테크 홈"><BrandLockup tone="dark" variant="mobile" /></a>
      ) : (
        <a className="mobile-app-back" href="#/" aria-label="이전 화면">‹</a>
      )}
      {title ? <strong><BrandLockup tone="light" variant="route" /><span>{title}</span></strong> : null}
      <button type="button" aria-label="메뉴 열기" aria-expanded={menuOpen ? "true" : "false"} onClick={() => setMenuOpen((value) => !value)}>
        <span />
        <span />
        <span />
      </button>
    </header>
  );
}

function MobileMenu({ active, open, onClose }) {
  if (!open) return null;
  return (
    <aside className="mobile-app-menu" aria-label="모바일 전체 메뉴">
      <div><strong>DAEKWANG TECH</strong><span>Precision Makes Value</span></div>
      {mobileMenuItems.map(([id, label]) => <a key={id} href={routeHref(id)} className={active === id ? "is-active" : ""} onClick={onClose}>{label}</a>)}
    </aside>
  );
}

function MobileBottomTabs({ active }) {
  return (
    <nav className="mobile-app-dock" aria-label="모바일 하단 내비게이션">
      {mobileDockItems.map(([id, label, icon]) => (
        <a key={id} href={routeHref(id)} className={active === id ? "is-active" : ""}>
          <i className={`mobile-tab-icon mobile-tab-icon--${icon}`} aria-hidden="true" />
          <b>{label}</b>
        </a>
      ))}
    </nav>
  );
}

function MobileSectionHead({ title, href }) {
  return (
    <div className="mobile-app-section-head">
      <h2>{title}</h2>
      {href ? <a href={href} data-mobile-section-more={title}>더보기</a> : null}
    </div>
  );
}

function MobileDarkHero({ image, title, body, className = "" }) {
  return (
    <section className={`mobile-app-dark-hero ${className}`.trim()}>
      <img src={image} alt="" aria-hidden="true" />
      <div>
        <h1>{title}</h1>
        <p>{body}</p>
      </div>
    </section>
  );
}

function ProductDetailModal({ product, onClose }) {
  const closeButtonRef = useRef(null);
  useEffect(() => {
    if (!product) return undefined;
    document.body.classList.add("product-modal-open");
    const onKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    window.requestAnimationFrame(() => closeButtonRef.current?.focus());
    return () => {
      document.body.classList.remove("product-modal-open");
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [product, onClose]);

  if (!product) return null;
  const [title, subtitle, body, image] = product;
  return createPortal(
    <div className="product-detail-modal" role="dialog" aria-modal="true" aria-labelledby="product-detail-modal-title" onMouseDown={(event) => {
      if (event.target === event.currentTarget) onClose();
    }}>
      <div className="product-detail-modal__dialog">
        <button ref={closeButtonRef} className="product-detail-modal__x" type="button" aria-label="제품 정보 닫기" onClick={onClose}>×</button>
        <figure><img src={image} alt={title} loading="lazy" decoding="async" /></figure>
        <div className="product-detail-modal__body">
          <span>{subtitle}</span>
          <h3 id="product-detail-modal-title">{title}</h3>
          <p>{body}</p>
          <dl>
            <div><dt>제품명</dt><dd>{title}</dd></div>
            <div><dt>제품군</dt><dd>{subtitle}</dd></div>
            <div><dt>설명</dt><dd>{body}</dd></div>
          </dl>
          <button className="product-detail-modal__close" type="button" onClick={onClose}>닫기</button>
        </div>
      </div>
    </div>,
    document.body
  );
}

function MobileProductList({ products, selectedProduct, onSelectProduct }) {
  return (
    <div className="mobile-products-list">
      {products.map((product) => {
        const [title, subtitle, body, image] = product;
        const isSelected = selectedProduct?.[0] === title;
        return (
          <article className={`mobile-product-row ${isSelected ? "is-selected" : ""}`} key={title}>
            <figure><img src={image} alt={title} loading="lazy" decoding="async" /></figure>
            <div>
              <h3>{title}</h3>
              <p>{body}</p>
              <button type="button" onClick={() => onSelectProduct(product)} aria-haspopup="dialog" aria-expanded={isSelected ? "true" : "false"}>자세히 보기 →</button>
            </div>
          </article>
        );
      })}
    </div>
  );
}

function MobileHomeScreen({ content, imageSlots }) {
  const noticeItems = (content.posts || []).filter((post) => post.status === "published" || post.pinned).slice(0, 3);
  const products = withMobileProductImages(mobileProductCards, imageSlots.productsGalleryImages).slice(0, 3);
  return (
    <>
      <section className="mobile-home-hero">
        <img src={imageSlots.homeHeroImage} alt="" aria-hidden="true" />
        <div className="mobile-home-hero-copy">
          <h1>정밀함이<br />가치를 만듭니다</h1>
          <p>대광테크는 정밀 가공 기술로<br />최고의 품질을 제공합니다.</p>
        </div>
      </section>
      <section className="mobile-app-section">
        <MobileSectionHead title="핵심 역량" />
        <div className="mobile-capability-grid">
          {mobileCapabilities.map(([icon, title, body]) => (
            <article className={`mobile-capability-card mobile-capability-card--${icon}`} key={title}>
              <i className="mobile-capability-icon" aria-hidden="true" />
              <h3>{title}</h3>
              <p>{body}</p>
            </article>
          ))}
        </div>
      </section>
      <section className="mobile-app-section">
        <MobileSectionHead title="주요 제품" href="#/products" />
        <div className="mobile-product-strip">
          {products.map(([title, subtitle, body, image]) => (
            <a href="#/products" key={title} data-mobile-product-card={title} aria-label={`${title} 제품 보기`}>
              <figure><img src={image} alt={title} loading="eager" decoding="async" /></figure>
              <strong>{title}</strong>
              <span>{subtitle || "Precision Part"}</span>
            </a>
          ))}
        </div>
      </section>
      <section className="mobile-dark-panel mobile-quality-flow">
        <h2>품질 프로세스</h2>
        <p>체계적인 품질 관리 시스템</p>
        <div>
          {["현장재 검사", "공정 관리", "검사 및 측정", "최종 검수"].map((item, index) => (
            <article key={item}><i>{String(index + 1).padStart(2, "0")}</i><strong>{item}</strong></article>
          ))}
        </div>
      </section>
      <section className="mobile-app-section">
        <MobileSectionHead title="최신 소식" href="#/notice" />
        <div className="mobile-news-list">
          {noticeItems.length ? noticeItems.map((post) => (
            <a href="#/notice" key={post.id}>
              <time>{post.publishedAt}</time>
              <strong>{post.title}</strong>
            </a>
          )) : <a href="#/notice"><time>최근 공지</time><strong>대광테크 소식을 확인하실 수 있습니다.</strong></a>}
        </div>
      </section>
      <section className="mobile-dark-panel mobile-brand-card">
        <h2>정밀한 기술로<br />더 나은 미래를 만듭니다</h2>
        <p>대광테크와 함께 최고의 가치를 만들어가세요.</p>
        <a href="#/technology">기술 보기</a>
      </section>
    </>
  );
}

function MobileProductsScreen({ imageSlots }) {
  const products = withMobileProductImages(mobileProductCards, imageSlots.productsGalleryImages);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const openProduct = (product) => {
    setSelectedProduct(product);
  };
  return (
    <>
      <MobileDarkHero
        image={imageSlots.productsGalleryImages[0]}
        title="정밀한 기술로 완성된 최고 품질의 제품"
        body="다양한 산업 분야에 최고의 솔루션을 제공합니다."
      />
      <div className="mobile-chip-row" aria-label="제품 분류">
        {["전체", "유압 부품", "밸브 부품", "일반 부품"].map((label, index) => <button className={index === 0 ? "is-active" : ""} key={label} type="button">{label}</button>)}
      </div>
      <MobileProductList products={products} selectedProduct={selectedProduct} onSelectProduct={openProduct} />
      <ProductDetailModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />
      <section className="mobile-dark-panel mobile-bottom-card">
        <h2>원하는 제품을 찾지 못하셨나요?</h2>
        <p>맞춤 제작 및 요건을 통해 최적의 솔루션을 제공합니다.</p>
        <a href="#/products">제품 정보</a>
      </section>
    </>
  );
}

function MobileTechnologyScreen({ imageSlots }) {
  const processRows = [
    ["01", "설계 및 제안", "고객 요구사항 분석 및 최적의 설계 솔루션 제공"],
    ["02", "원자재 검사", "엄격한 입고 검사를 통한 품질 기준 충족 확인"],
    ["03", "정밀 가공", "최신 CNC 설비를 활용한 정밀 가공 작업"],
    ["04", "품질 검사", "3차원 측정기 및 다양한 검사 장비로 품질 검증"],
    ["05", "표면 처리", "내구성 및 내식성 향상을 위한 표면 처리 공정"],
    ["06", "최종 검사 및 출하", "최종 품질 검사 후 안전한 포장 및 출하"],
  ];
  const facilityItems = withFirstImage(facilityCards.slice(0, 4), imageSlots.facilityVisualImage);
  return (
    <>
      <MobileDarkHero
        image={imageSlots.processHeroImage}
        title="최신 설비와 축적된 기술력으로 최고의 품질을 실현합니다"
        body="끊임없는 기술 혁신으로 고객에게 최상의 가치를 제공합니다."
      />
      <section className="mobile-app-section">
        <MobileSectionHead title="생산 프로세스" />
        <div className="mobile-process-list">
          {processRows.map(([num, title, body]) => (
            <article key={title}>
              <i>{num}</i>
              <div><h3>{title}</h3><p>{body}</p></div>
            </article>
          ))}
        </div>
      </section>
      <section className="mobile-dark-panel mobile-stat-panel">
        <h2>기술 경쟁력</h2>
        <div>
          {[
            ["20+", "보유 설비"],
            ["15+", "전문 기술진"],
            ["99.8%", "품질 신뢰도"],
            ["100+", "파트너사"],
          ].map(([value, label]) => <article key={label}><strong>{value}</strong><span>{label}</span></article>)}
        </div>
      </section>
      <section className="mobile-app-section">
        <MobileSectionHead title="보유 설비" href="#/facility" />
        <div className="mobile-facility-grid">
          {facilityItems.map(([title, body, image]) => (
            <article key={title}>
              <figure><img src={image} alt={title} loading="lazy" decoding="async" /></figure>
              <strong>{title}</strong>
            </article>
          ))}
        </div>
      </section>
      <section className="mobile-dark-panel mobile-bottom-card">
        <h2>기술 기준</h2>
        <p>기술력과 운영 기준을 한 화면에서 확인하세요.</p>
        <a href="#/technology">기술 보기</a>
      </section>
    </>
  );
}

function MobileQualityScreen({ imageSlots }) {
  const qualityItems = withFirstImage(qualityCards.slice(0, 4), imageSlots.qualityVisualImage);
  return (
    <>
      <MobileDarkHero
        image={imageSlots.qualityVisualImage}
        title="측정 기준과 품질 기록으로 신뢰를 완성합니다"
        body="입고부터 출하까지 정돈된 검사 기준으로 제조 품질을 확인합니다."
      />
      <section className="mobile-app-section">
        <MobileSectionHead title="품질 관리" />
        <div className="mobile-facility-grid mobile-quality-card-grid">
          {qualityItems.map(([title, body, image]) => (
            <article key={title}>
              <figure><img src={image} alt={title} loading="lazy" decoding="async" /></figure>
              <strong>{title}</strong>
              <p>{body}</p>
            </article>
          ))}
        </div>
      </section>
      <section className="mobile-dark-panel mobile-stat-panel mobile-quality-panel">
        <h2>품질 기준</h2>
        <div>
          {["입고", "공정", "측정", "출하"].map((label, index) => (
            <article key={label}><strong>{String(index + 1).padStart(2, "0")}</strong><span>{label}</span></article>
          ))}
        </div>
      </section>
    </>
  );
}

function MobileCompanyScreen({ content, imageSlots }) {
  const companyRows = [
    ["회사명", content.company.nameKo],
    ["대표전화", content.company.tel],
    ["팩스", content.company.fax],
    ["주소", content.company.address],
  ].filter(([, value]) => value);
  return (
    <>
      <MobileDarkHero
        image={imageSlots.facilityVisualImage}
        title="정밀한 기술로 신뢰를 만드는 기업"
        body="대광테크는 고객의 성공을 기술력과 품질로 함께합니다."
      />
      <section className="mobile-info-card">
        <h2>회사 개요</h2>
        <p>대광테크는 정밀 가공 기술을 바탕으로 다양한 산업 분야에 고품질 제품을 공급하고 있습니다.</p>
        <dl>
          {companyRows.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}
        </dl>
      </section>
    </>
  );
}

function MobileNoticeScreen({ content }) {
  const noticeItems = (content.posts || []).filter((post) => post.status === "published" || post.pinned).slice(0, 8);
  return (
    <>
      <div className="mobile-chip-row mobile-chip-row--notice" aria-label="공지 분류">
        {["전체", "공지", "뉴스", "행사"].map((label, index) => <button className={index === 0 ? "is-active" : ""} key={label} type="button">{label}</button>)}
      </div>
      <div className="mobile-notice-list">
        {noticeItems.length ? noticeItems.map((post) => (
          <a href="#/notice" key={post.id}>
            <time>{post.publishedAt}</time>
            <strong>{post.title}</strong>
          </a>
        )) : <a href="#/notice"><time>최근 공지</time><strong>대광테크 소식을 확인하실 수 있습니다.</strong></a>}
      </div>
    </>
  );
}

function MobileInfoScreen({ page, detail, imageSlots, content }) {
  if (page.id === "facility") {
    const facilityItems = withFirstImage((detail.cards || facilityCards).slice(0, 4), imageSlots.facilityVisualImage);
    return (
      <>
        <MobileDarkHero image={imageSlots.facilityVisualImage} title="생산 인프라를 안정적으로 관리합니다" body="설비와 검사 환경을 정돈된 기준으로 운영합니다." />
        <section className="mobile-app-section">
          <MobileSectionHead title="보유 설비" />
          <div className="mobile-facility-grid">
            {facilityItems.map(([title, body, image]) => (
              <article key={title}><figure><img src={image} alt={title} loading="lazy" decoding="async" /></figure><strong>{title}</strong></article>
            ))}
          </div>
        </section>
      </>
    );
  }
  if (page.id === "quality") {
    return <MobileQualityScreen imageSlots={imageSlots} />;
  }
  return <MobileCompanyScreen content={content} imageSlots={imageSlots} />;
}

function MobilePublicShell({ route, page, detail, content, imageSlots, menuOpen, setMenuOpen }) {
  const routeKey = route.startsWith("notice") ? "notice" : page.id;
  const active = mobileActiveTab(route, page.id);
  const titleMap = { products: "제품", technology: "기술력", process: "기술력", quality: "품질 관리", company: "회사 소개", notice: "공지사항", facility: "보유 설비" };
  const isHome = active === "index" && routeKey === "index";
  const renderScreen = () => {
    if (routeKey === "products") return <MobileProductsScreen imageSlots={imageSlots} />;
    if (["technology", "process"].includes(routeKey)) return <MobileTechnologyScreen imageSlots={imageSlots} />;
    if (routeKey === "company") return <MobileCompanyScreen content={content} imageSlots={imageSlots} />;
    if (routeKey === "notice") return <MobileNoticeScreen content={content} />;
    if (["facility", "quality"].includes(routeKey)) return <MobileInfoScreen page={page} detail={detail} imageSlots={imageSlots} content={content} />;
    return <MobileHomeScreen content={content} imageSlots={imageSlots} />;
  };
  return (
    <div className={`mobile-app-public-shell route-${routeKey}`} aria-label="대광테크 모바일 웹">
      <MobileTopBar title={isHome ? "" : titleMap[routeKey] || page.label} tone={isHome ? "dark" : "light"} menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      <MobileMenu active={routeKey} open={menuOpen} onClose={() => setMenuOpen(false)} />
      <main className="mobile-app-main" id="main-content">
        {renderScreen()}
      </main>
      <MobileBottomTabs active={active} />
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

function CardGrid({ cards, className = "sub-card-grid", showDetailButton = false }) {
  const [lightbox, setLightbox] = useState(null);
  useEffect(() => {
    if (!lightbox) return undefined;
    document.body.classList.add("lightbox-open");
    const onKeyDown = (event) => {
      if (event.key === "Escape") setLightbox(null);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.classList.remove("lightbox-open");
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [lightbox]);
  return (
    <>
      <div className={className}>
        {cards.map(([title, desc, image]) => (
          <article className="product-card deep-card" key={title}>
            <img alt={title} className="js-lightbox-img" decoding="async" loading="lazy" role="button" src={image} tabIndex="0" onClick={() => setLightbox({ title, desc, image })} />
            <div className="card-body">
              <h3>{title}</h3>
              <p>{desc}</p>
              {showDetailButton ? <button className="product-detail-button" type="button" onClick={() => setLightbox({ title, desc, image })}>자세히 보기 →</button> : null}
            </div>
          </article>
        ))}
      </div>
      {lightbox ? (
        <div className="lightbox is-open" role="dialog" aria-modal="true" onMouseDown={(event) => {
          if (event.target === event.currentTarget) setLightbox(null);
        }}>
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

function ProcessBand({ imageSlots = loadPublicImageSlotOverrides() }) {
  return (
    <section className="process-band" aria-label="대광테크 제조 프로세스">
      <div className="wrap process-layout process-premium-layout">
        <div className="section-intro invert process-editorial">
          <p className="section-kicker">제조 프로세스 / DAEKWANG TECH PROCESS</p>
          <h2>체계적인 프로세스로<br />일관된 품질을 약속합니다</h2>
          <p className="process-editorial-copy">요구 분석부터 출하까지 하나의 기준으로 연결해 정밀 가공 품질과 생산 흐름을 안정적으로 관리합니다.</p>
          <a className="detail-link process-detail-link" href="#/process">프로세스 자세히 보기</a>
          <figure className="process-proof-card">
            <img src={imageSlots.processHeroImage} alt="대광테크 정밀 가공 부품 디테일" />
            <figcaption>
              <span>PROCESS PROOF</span>
              <strong>가공 기준과 검사 흐름을 함께 묶은 제조 관리</strong>
            </figcaption>
          </figure>
        </div>
        <div className="process-card-grid" aria-label="6단계 제조 프로세스">
          {premiumProcessSteps.map((step) => (
            <article className="process-step-card" key={step.num}>
              <div className="process-step-card__body">
                <div className="process-step-card__meta">
                  <span>{step.num}</span>
                  <i aria-hidden="true">{step.icon}</i>
                </div>
                <h3>{step.title}</h3>
                <p>{step.body}</p>
              </div>
              <figure className="process-step-card__image">
                <img src={step.image} alt="" aria-hidden="true" loading="lazy" decoding="async" />
              </figure>
            </article>
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

function ProductsPreview({ imageSlots }) {
  const cards = withGalleryImages(homeProducts, imageSlots.productsGalleryImages);
  return (
    <section className="split-section wrap home-products-section">
      <div className="section-intro"><p className="section-kicker">제품/서비스</p><h2>정밀 기술로 완성하는<br />최고의 솔루션</h2><p>다양한 산업의 요구를 충족하는 고정밀 부품 및 금속 가공 솔루션을 제공합니다.</p><a className="detail-link" href="#/products">자세히 보기 →</a></div>
      <CardGrid cards={cards} className="product-grid" />
    </section>
  );
}

function QualityPreview({ imageSlots }) {
  const cards = withFirstImage(qualityCards, imageSlots.qualityVisualImage);
  return (
    <section className="split-section wrap quality-home home-quality-section">
      <div className="section-intro"><p className="section-kicker">품질 관리</p><h2>정밀한 검증이<br />신뢰를 만듭니다</h2><p>품질 관리 시스템과 측정 장비로 안정적인 품질을 보장합니다.</p><a className="detail-link" href="#/quality">품질 관리 자세히 보기 →</a></div>
      <CardGrid cards={cards} className="quality-grid" />
    </section>
  );
}

function FacilityPreview({ imageSlots }) {
  const cards = withFirstImage(facilityCards, imageSlots.facilityVisualImage);
  return (
    <section className="split-section wrap home-facility-section">
      <div className="section-intro"><p className="section-kicker">설비 / 시설</p><h2>최첨단 설비와<br />강력한 생산 인프라</h2><p>고품질 가공을 위한 설비와 생산 시스템을 구축하고 있습니다.</p><a className="detail-link" href="#/facility">설비 현황 자세히 보기 →</a></div>
      <CardGrid cards={cards} className="facility-grid" />
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

function SubPage({ page, detail, imageSlots }) {
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
        {detail.cards ? <CardGrid showDetailButton={page.id === "products"} cards={page.id === "products" ? withGalleryImages(detail.cards, imageSlots.productsGalleryImages) : page.id === "quality" ? withFirstImage(detail.cards, imageSlots.qualityVisualImage) : page.id === "facility" ? withFirstImage(detail.cards, imageSlots.facilityVisualImage) : detail.cards} /> : isProcessPage ? <ProcessPageSection /> : <ProcessBand imageSlots={imageSlots} />}
      </section>
      {isQualityPage ? <QualityControlPanel /> : isCompactClosingPage && detail.metrics ? <CompactClosingPanel page={page} items={detail.metrics} /> : detail.metrics ? <MetricRow items={detail.metrics} /> : null}
    </>
  );
}

function Footer({ company }) {
  return (
    <footer className="site-footer">
      <div className="footer-brand"><BrandLockup tone="dark" variant="footer" /></div>
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
  const [imageSlots, setImageSlots] = useState(() => loadPublicImageSlotOverrides());
  const serverImageSlotsReady = useRef(false);
  const page = useMemo(() => {
    const sourcePage = content.pages.find((item) => item.id === route) ?? content.pages[0];
    const slotByPage = {
      index: imageSlots.homeHeroImage,
      process: imageSlots.processHeroImage,
      quality: imageSlots.qualityVisualImage,
      facility: imageSlots.facilityVisualImage,
      products: imageSlots.productsGalleryImages[0],
    };
    return slotByPage[sourcePage.id] ? { ...sourcePage, heroImage: slotByPage[sourcePage.id] } : sourcePage;
  }, [content.pages, imageSlots, route]);
  const detail = pageContent[page.id] ?? pageContent.index;

  useEffect(() => {
    let active = true;
    fetch("/api/public/image-slots", { cache: "no-store" })
      .then((response) => (response.ok ? response.json() : Promise.reject(new Error("PUBLIC_IMAGE_SLOTS_UNAVAILABLE"))))
      .then((payload) => {
        const normalized = normalizePublicImageSlotPayload(payload);
        if (!active || !normalized) return;
        serverImageSlotsReady.current = true;
        setImageSlots(normalized);
      })
      .catch(() => {
        if (!active) return;
        serverImageSlotsReady.current = false;
        setImageSlots(loadLocalPublicImageSlotOverrides());
      });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    const refresh = () => {
      if (serverImageSlotsReady.current) return;
      setImageSlots(loadLocalPublicImageSlotOverrides());
    };
    window.addEventListener("storage", refresh);
    window.addEventListener(ADMIN_STORE_EVENT, refresh);
    return () => {
      window.removeEventListener("storage", refresh);
      window.removeEventListener(ADMIN_STORE_EVENT, refresh);
    };
  }, []);

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
        <MobilePublicShell route={route} page={page} detail={detail} content={content} imageSlots={imageSlots} menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
        <div className="desktop-public-render">
          <Header active="notice" menuOpen={menuOpen} onMenu={() => setMenuOpen((value) => !value)} />
          <MobilePanel active="notice" open={menuOpen} onClose={() => setMenuOpen(false)} />
          {noticeId ? <NoticeDetailPage noticeId={noticeId} /> : <NoticeListPage />}
          <Footer company={content.company} />
        </div>
      </div>
    );
  }

  return (
    <div className={`site-shell route-${page.id}`}>
      <a className="skip-link" href="#main-content">본문 바로가기</a>
      <MobilePublicShell route={route} page={page} detail={detail} content={content} imageSlots={imageSlots} menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      <div className="desktop-public-render">
        {page.id === "index" ? (
          <>
          <Hero page={page} active={page.id} menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
          <FeatureRail items={detail.rail} />
          <ProductsPreview imageSlots={imageSlots} />
          <ProcessBand imageSlots={imageSlots} />
          <QualityPreview imageSlots={imageSlots} />
          <FacilityPreview imageSlots={imageSlots} />
          <HomeNoticeSection />
          <TrustPreview posts={content.posts} />
          <Footer company={content.company} />
          </>
        ) : (
          <>
          <Hero page={page} active={page.id} menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
          <FeatureRail items={detail.rail} />
          <SubPage page={page} detail={detail} imageSlots={imageSlots} />
          <Footer company={content.company} />
          </>
        )}
      </div>
    </div>
  );
}

export default function App() {
  const route = useRoute();
  const [content, setContent] = useContent();
  return <SiteApp content={content} setContent={setContent} route={route} />;
}
