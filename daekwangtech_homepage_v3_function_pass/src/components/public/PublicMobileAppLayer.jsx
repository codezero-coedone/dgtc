import React, { useEffect, useMemo, useState } from "react";
import { DaekwangLogoMark } from "../brand/DaekwangLogoMark.jsx";
import { getNoticeHref, getNoticeListHref, hasLocalAdminNoticeState, loadPublicNoticeData, loadServerPublicNoticeData, subscribeNoticePublicData } from "../../utils/noticePublicData.js";

function shortText(value, size = 70) {
  const text = String(value || "").replace(/\s+/g, " ").trim();
  return text.length > size ? `${text.slice(0, size)}...` : text;
}

function MobileMetric({ value, label }) {
  return (
    <article className="pm-metric">
      <strong>{value}</strong>
      <span>{label}</span>
    </article>
  );
}

function MobileImageCard({ title, desc, image, href, tag }) {
  return (
    <a className="pm-image-card" href={href}>
      <img alt={title} decoding="async" loading="lazy" src={image} />
      <span>{tag}</span>
      <strong>{title}</strong>
      <p>{shortText(desc, 58)}</p>
    </a>
  );
}

export function PublicMobileBottomNav({ active = "index" }) {
  const items = [
    ["index", "#/", "홈"],
    ["company", "#/company", "회사"],
    ["products", "#/products", "사업"],
    ["projects", "#mobile-projects", "프로젝트"],
    ["notice", getNoticeListHref(), "소식"],
  ];

  return (
    <nav className="public-mobile-bottom-nav" aria-label="모바일 주요 메뉴">
      {items.map(([id, href, label]) => (
        <a key={id} className={active === id ? "is-active" : ""} href={href}>
          <i aria-hidden="true" />
          <span>{label}</span>
        </a>
      ))}
    </nav>
  );
}

export function PublicMobileAppLayer({ company, facilityCards, homeProducts, pageContent }) {
  const [noticeData, setNoticeData] = useState(() => loadPublicNoticeData());

  useEffect(() => {
    const unsubscribe = subscribeNoticePublicData(setNoticeData);
    if (!hasLocalAdminNoticeState()) {
      loadServerPublicNoticeData().then(setNoticeData).catch(() => null);
    }
    return unsubscribe;
  }, []);

  const latestNotices = useMemo(() => noticeData.visibleNotices.slice(0, 3), [noticeData.visibleNotices]);
  const companyCards = pageContent.company.cards.slice(0, 4);
  const businessCards = homeProducts.slice(0, 4);
  const projectCards = facilityCards.slice(0, 3);
  const metrics = pageContent.company.metrics.slice(0, 4);

  return (
    <section className="public-mobile-app-layer" aria-label="대광테크 모바일 앱형 홈">
      <div className="pm-phone-shell">
        <div className="pm-hero-card">
          <div className="pm-hero-mark">
            <DaekwangLogoMark size={42} tone="dark" />
            <span>DAE KWANG TECH</span>
          </div>
          <p className="pm-eyebrow">PRECISION MANUFACTURING</p>
          <h2>정밀 제조 역량을<br />한 화면에서 확인합니다</h2>
          <p>{shortText(company.summary || "대광테크는 정밀가공 기술과 품질 중심의 제조 역량을 소개하는 기업 홈페이지입니다.", 86)}</p>
          <div className="pm-quick-grid">
            <a href="#/company">회사소개</a>
            <a href="#/products">사업영역</a>
            <a href="#mobile-projects">수행영역</a>
            <a href={getNoticeListHref()}>공지사항</a>
          </div>
        </div>

        <div className="pm-metric-grid">
          {metrics.map(([value, label]) => (
            <MobileMetric key={`${value}-${label}`} value={value} label={label} />
          ))}
        </div>

        <div className="pm-section-card">
          <div className="pm-section-head">
            <span>COMPANY</span>
            <h3>회사 개요</h3>
          </div>
          <div className="pm-strength-grid">
            {companyCards.map(([title, desc]) => (
              <article key={title}>
                <strong>{title}</strong>
                <p>{shortText(desc, 52)}</p>
              </article>
            ))}
          </div>
        </div>

        <div className="pm-section-card">
          <div className="pm-section-head">
            <span>BUSINESS</span>
            <h3>사업영역</h3>
          </div>
          <div className="pm-card-list">
            {businessCards.map(([title, desc, image]) => (
              <MobileImageCard key={title} title={title} desc={desc} image={image} href="#/products" tag="Business" />
            ))}
          </div>
        </div>

        <div className="pm-section-card" id="mobile-projects">
          <div className="pm-section-head">
            <span>PROJECTS</span>
            <h3>대표 수행 영역</h3>
          </div>
          <div className="pm-project-strip">
            {projectCards.map(([title, desc, image]) => (
              <MobileImageCard key={title} title={title} desc={desc} image={image} href="#/facility" tag="Infra" />
            ))}
          </div>
        </div>

        <div className="pm-section-card">
          <div className="pm-section-head inline">
            <div>
              <span>NOTICE</span>
              <h3>대광테크 소식</h3>
            </div>
            <a href={getNoticeListHref()}>전체</a>
          </div>
          <div className="pm-notice-list">
            {latestNotices.length ? (
              latestNotices.map((notice) => (
                <a href={getNoticeHref(notice.id)} key={notice.id}>
                  <span>{notice.category}</span>
                  <strong>{notice.title}</strong>
                  <time>{notice.publishDate}</time>
                </a>
              ))
            ) : (
              <p className="pm-empty">등록된 공지사항이 없습니다.</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
