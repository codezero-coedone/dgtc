import { useEffect, useMemo, useRef, useState, type MouseEvent } from "react";
import { Building2, Cpu, Factory, MapPin, Menu, Mouse, ShieldCheck, UsersRound, X } from "lucide-react";
import {
  assets,
  businessAreas,
  capabilities,
  companyInfo,
  companyOverview,
  facilities,
  hero,
  heroStats,
  liveProducts,
  locationInfo,
  mobileQuickNav,
  navItems,
  processSteps,
  qualityItems,
  timeline,
  values,
  type FeatureItem,
  type HeroStat,
  type SectionId,
} from "../data/daekwangContent";
import { useHomeSeo } from "../hooks/usePageSeo";

const sectionIds: SectionId[] = ["home", "company", "business", "technology", "process-quality", "facilities", "location"];

function useActiveSection(ids: SectionId[]) {
  const [active, setActive] = useState<SectionId>("home");
  const suppressObserverUntil = useRef(0);

  useEffect(() => {
    const elements = ids.map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[];
    if (!elements.length) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        if (Date.now() < suppressObserverUntil.current) return;
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => Math.abs(a.boundingClientRect.top) - Math.abs(b.boundingClientRect.top))[0];
        if (visible?.target.id) setActive(visible.target.id as SectionId);
      },
      { rootMargin: "-28% 0px -58% 0px", threshold: [0.1, 0.3, 0.6] },
    );

    const onProgrammaticChange = (event: Event) => {
      const detail = (event as CustomEvent<SectionId>).detail;
      if (ids.includes(detail)) {
        suppressObserverUntil.current = Date.now() + 950;
        setActive(detail);
      }
    };

    window.addEventListener("daekwang-section-change", onProgrammaticChange);
    elements.forEach((element) => observer.observe(element));
    return () => {
      window.removeEventListener("daekwang-section-change", onProgrammaticChange);
      observer.disconnect();
    };
  }, [ids]);

  return active;
}

function LogoLockup({ light = false }: { light?: boolean }) {
  return (
    <span className="dk-logo" aria-label={`${companyInfo.nameKo} ${companyInfo.nameEn}`}>
      <span className={light ? "dk-logo-mark dk-logo-mark--light" : "dk-logo-mark"}>{companyInfo.logoText}</span>
      <span className="dk-logo-wordmark">{companyInfo.nameEn}</span>
    </span>
  );
}

function iconForStat(icon: HeroStat["icon"]) {
  if (icon === "building") return Building2;
  if (icon === "machine") return Factory;
  if (icon === "partner") return UsersRound;
  return ShieldCheck;
}

function scrollToHash(href: string, close?: () => void) {
  const target = document.querySelector<HTMLElement>(href);
  if (!target) return;
  target.scrollIntoView({ behavior: "smooth", block: "start" });
  window.history.pushState(null, "", href);
  window.dispatchEvent(new CustomEvent("daekwang-section-change", { detail: href.replace("#", "") }));
  close?.();
}

function Header({ active }: { active: SectionId }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const onNav = (event: MouseEvent<HTMLAnchorElement>, href: string) => {
    event.preventDefault();
    scrollToHash(href, () => setOpen(false));
  };

  return (
    <header className="dk-header">
      <div className="dk-header-inner">
        <a className="dk-brand" href="#home" onClick={(event) => onNav(event, "#home")}>
          <LogoLockup />
        </a>
        <nav className="dk-desktop-nav" aria-label="대광테크 주요 섹션">
          {navItems.map((item) => (
            <a key={item.id} href={item.href} data-active={active === item.id ? "true" : undefined} onClick={(event) => onNav(event, item.href)}>
              {item.label}
            </a>
          ))}
        </nav>
        <div className="dk-header-right">
          <span>KO</span>
          <span>EN</span>
          <button className="dk-menu-button" type="button" aria-label="모바일 메뉴 열기" aria-controls="dk-mobile-menu" aria-expanded={open} onClick={() => setOpen(true)}>
            <Menu size={20} strokeWidth={1.8} />
          </button>
        </div>
      </div>
      <div className="dk-mobile-menu" data-open={open ? "true" : undefined} id="dk-mobile-menu">
        <div className="dk-mobile-menu-panel">
          <div className="dk-mobile-menu-top">
            <LogoLockup />
            <button type="button" aria-label="모바일 메뉴 닫기" onClick={() => setOpen(false)}>
              <X size={22} strokeWidth={1.8} />
            </button>
          </div>
          <nav aria-label="모바일 섹션 이동">
            {navItems.map((item) => (
              <a key={item.id} href={item.href} data-active={active === item.id ? "true" : undefined} onClick={(event) => onNav(event, item.href)}>
                <span>{item.label}</span>
                <small>{item.href}</small>
              </a>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}

function PhoneMockup() {
  return (
    <aside className="dk-phone-mockup" aria-label="대광테크 모바일 화면 미리보기">
      <div className="dk-phone-frame">
        <div className="dk-phone-notch" />
        <div className="dk-phone-screen">
          <img src={assets.heroCompany} alt="대광테크 모바일 메인 이미지" />
          <div className="dk-phone-copy">
            <span>{companyInfo.nameEn}</span>
            <strong>정밀가공 기업 소개</strong>
            <p>{companyInfo.summary}</p>
          </div>
          <div className="dk-phone-grid">
            {mobileQuickNav.map((item) => (
              <a key={item.href} href={item.href}>
                {item.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}

function StatBar() {
  return (
    <div className="dk-stat-bar" aria-label="대광테크 주요 지표">
      {heroStats.map((stat) => {
        const Icon = iconForStat(stat.icon);
        return (
          <div key={stat.label} className="dk-stat-item">
            <Icon size={25} strokeWidth={1.45} aria-hidden="true" />
            <strong>{stat.value}</strong>
            <span>{stat.label}</span>
            <small>{stat.caption}</small>
          </div>
        );
      })}
    </div>
  );
}

function HomeHero() {
  return (
    <section className="dk-hero" id="home">
      <div className="dk-hero-main">
        <div className="dk-hero-copy">
          <p className="dk-eyebrow">{hero.eyebrow}</p>
          <h1>
            {hero.title.split("\n").map((line) => (
              <span key={line}>{line}</span>
            ))}
          </h1>
          <p className="dk-hero-description">
            {hero.description.split("\n").map((line) => (
              <span key={line}>{line}</span>
            ))}
          </p>
          <div className="dk-mobile-quick-grid" aria-label="모바일 빠른 섹션 이동">
            {mobileQuickNav.map((item) => (
              <a key={item.href} href={item.href} onClick={(event) => {
                event.preventDefault();
                scrollToHash(item.href);
              }}>
                {item.label}
              </a>
            ))}
          </div>
          <a className="dk-scroll-hint" href="#business" onClick={(event) => {
            event.preventDefault();
            scrollToHash("#business");
          }}>
            <Mouse size={18} strokeWidth={1.5} aria-hidden="true" />
            <span>{hero.scrollHint}</span>
          </a>
        </div>
        <div className="dk-hero-visual">
          <figure className="dk-hero-photo">
            <img src={assets.heroCompany} alt="대광테크 회사 메인 비주얼" />
            <figcaption>{companyInfo.note}</figcaption>
          </figure>
          <PhoneMockup />
        </div>
      </div>
      <StatBar />
    </section>
  );
}

function SectionHeading({ eyebrow, title, body }: { eyebrow: string; title: string; body?: string }) {
  return (
    <div className="dk-section-heading">
      <p>{eyebrow}</p>
      <h2>{title}</h2>
      {body ? <span>{body}</span> : null}
    </div>
  );
}

function InfoTable({ rows }: { rows: string[][] }) {
  return (
    <dl className="dk-info-table">
      {rows.map(([label, value]) => (
        <div key={label}>
          <dt>{label}</dt>
          <dd>{value || "자료 확인 중"}</dd>
        </div>
      ))}
    </dl>
  );
}

function FeatureGrid({ items }: { items: FeatureItem[] }) {
  return (
    <div className="dk-feature-grid">
      {items.map((item, index) => (
        <article key={item.title}>
          <span>{item.meta ?? String(index + 1).padStart(2, "0")}</span>
          <h3>{item.title}</h3>
          <p>{item.body}</p>
        </article>
      ))}
    </div>
  );
}

function BusinessSection() {
  return (
    <section className="dk-section dk-business" id="business">
      <div className="dk-section-inner dk-business-layout">
        <div className="dk-business-intro">
          <SectionHeading eyebrow="BUSINESS AREAS" title="사업영역" body="정밀가공과 산업 부품 제작 흐름을 실제 제품 이미지 중심으로 정리했습니다." />
          <a className="dk-inline-link" href="#technology" onClick={(event) => {
            event.preventDefault();
            scrollToHash("#technology");
          }}>
            자세히 보기
          </a>
        </div>
        <div className="dk-business-card-grid">
          {businessAreas.map((area) => (
            <a className="dk-business-card" href="#business-detail" key={area.title}>
              <img src={area.image} alt={area.alt} />
              <span>{area.title}</span>
            </a>
          ))}
        </div>
      </div>
      <div className="dk-section-inner dk-product-zone" id="business-detail">
        <SectionHeading eyebrow="PRODUCTS" title="제품 카탈로그" body="live source에서 확인한 제품명과 설명을 중심으로 구성했습니다." />
        <div className="dk-product-grid">
          {liveProducts.map((product) => (
            <article key={`${product.title}-${product.image}`}>
              <img src={product.image} alt={product.alt} />
              <div>
                <small>{companyInfo.nameEn}</small>
                <h3>{product.title}</h3>
                <p>{product.description}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function CompanySection() {
  return (
    <section className="dk-section dk-company" id="company">
      <div className="dk-section-inner dk-two-column">
        <div>
          <SectionHeading eyebrow="COMPANY" title="기술과 신뢰 중심의 제조 파트너" body="대광테크는 CNC 자동선반 기반의 제조 흐름으로 자동차·유압·전자부품에 필요한 소형 정밀 가공 부품을 대응합니다." />
          <div className="dk-company-image">
            <img src={assets.heroCompany} alt="대광테크 경남 김해 사업장 이미지" />
            <span>{companyInfo.note}</span>
          </div>
        </div>
        <div className="dk-company-stack">
          <InfoTable rows={companyOverview} />
          <FeatureGrid items={values} />
        </div>
      </div>
      <div className="dk-section-inner dk-timeline">
        {timeline.map(([year, title, body]) => (
          <article key={`${year}-${title}`}>
            <span>{year}</span>
            <strong>{title}</strong>
            <p>{body}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function TechnologySection() {
  return (
    <section className="dk-section dk-alt" id="technology">
      <div className="dk-section-inner dk-two-column">
        <div>
          <SectionHeading eyebrow="TECHNOLOGY" title="도면과 소재 조건을 읽는 정밀가공 역량" body="정밀 선반 가공, 복합 형상 대응, 도면 기반 사양 검토를 중심으로 제조 가능 범위를 검토합니다." />
          <img className="dk-section-photo" src={assets.technologyHero} alt="대광테크 기술역량 이미지" />
        </div>
        <FeatureGrid items={capabilities} />
      </div>
    </section>
  );
}

function ProcessQualitySection() {
  return (
    <section className="dk-section" id="process-quality">
      <div className="dk-section-inner">
        <SectionHeading eyebrow="PROCESS & QUALITY" title="체계적인 공정과 신뢰할 수 있는 품질 관리" body="사양 확인부터 가공, 세척, 검사, 출하까지 이어지는 제조 흐름을 정돈해 관리합니다." />
        <ol className="dk-process-flow">
          {processSteps.map((step, index) => (
            <li key={step}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <strong>{step}</strong>
            </li>
          ))}
        </ol>
        <FeatureGrid items={qualityItems} />
      </div>
    </section>
  );
}

function FacilitiesSection() {
  return (
    <section className="dk-section dk-alt" id="facilities">
      <div className="dk-section-inner">
        <SectionHeading eyebrow="FACILITIES" title="정밀 제조를 지탱하는 생산 인프라" body="CNC 자동선반 기반 가공 역량과 제품별 공정 흐름을 안정적으로 운영합니다." />
        <div className="dk-facility-grid">
          {facilities.map((facility) => (
            <article key={facility.title}>
              <img src={facility.image} alt={facility.alt} />
              <div>
                <h3>{facility.title}</h3>
                <p>{facility.description}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function LocationSection() {
  return (
    <section className="dk-section dk-location" id="location">
      <div className="dk-section-inner dk-location-layout">
        <div className="dk-location-map" aria-label="대광테크 위치 정보">
          <MapPin size={44} strokeWidth={1.45} aria-hidden="true" />
          <strong>{companyInfo.nameKo}</strong>
          <span>{companyInfo.address}</span>
        </div>
        <div>
          <SectionHeading eyebrow="LOCATION" title="대광테크 본사·공장 위치 안내" body="확인된 주소와 연락처를 기준으로 방문 정보를 안내합니다." />
          <InfoTable rows={locationInfo} />
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="dk-footer">
      <div className="dk-footer-inner">
        <div>
          <LogoLockup light />
          <p>{companyInfo.summary}</p>
        </div>
        <address>
          <span>{companyInfo.address}</span>
          <span>TEL {companyInfo.tel}</span>
          <span>FAX {companyInfo.fax}</span>
          <span>Mobile {companyInfo.mobile}</span>
          <span>{companyInfo.email}</span>
        </address>
        <nav aria-label="푸터 섹션">
          {navItems.map((item) => (
            <a key={item.href} href={item.href} onClick={(event) => {
              event.preventDefault();
              scrollToHash(item.href);
            }}>
              {item.label}
            </a>
          ))}
        </nav>
      </div>
      <div className="dk-footer-bottom">
        <span>Copyright DAE KWANG TECH. All rights reserved.</span>
        <span>개인정보처리방침</span>
      </div>
    </footer>
  );
}

export function HomePage() {
  useHomeSeo();
  const active = useActiveSection(useMemo(() => sectionIds, []));

  useEffect(() => {
    const hash = window.location.hash;
    if (!hash) return;
    window.setTimeout(() => scrollToHash(hash), 120);
  }, []);

  return (
    <div className="dk-site-shell">
      <Header active={active} />
      <main>
        <HomeHero />
        <BusinessSection />
        <CompanySection />
        <TechnologySection />
        <ProcessQualitySection />
        <FacilitiesSection />
        <LocationSection />
      </main>
      <Footer />
    </div>
  );
}
