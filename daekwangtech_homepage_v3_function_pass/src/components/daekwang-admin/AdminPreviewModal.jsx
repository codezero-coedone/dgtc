import React, { useState } from "react";
import { DaekwangLogoLockup } from "../brand/DaekwangLogoLockup.jsx";
import { PublicPopupRenderer } from "../public/PublicPopupRenderer.jsx";

function DetailRows({ rows }) {
  return (
    <dl className="dk-preview-details">
      {rows.map(([label, value]) => (
        <div key={label}>
          <dt>{label}</dt>
          <dd>{value}</dd>
        </div>
      ))}
    </dl>
  );
}

function FullHomepagePreview({ preview, mode, popup }) {
  const isImage = (preview.kind || "").includes("IMAGE");
  const isNotice = (preview.kind || "").includes("NOTICE");
  const heroImage = isImage && preview.imageCategory === "mainBanner" ? preview.imageUrl : "assets/hero-machine.jpg";
  const businessImage = isImage && ["product", "company"].includes(preview.imageCategory) ? preview.imageUrl : "assets/product-1.jpg";
  const facilityImage = isImage && preview.imageCategory === "facility" ? preview.imageUrl : "assets/facility-cnc.jpg";
  const noticeCategory = preview.category || preview.description?.split("·")?.[0]?.trim() || "공지";
  const noticeDate = preview.publishDate || preview.description?.split("·")?.[1]?.trim() || "게시일 확인";
  const noticeBody = preview.content || preview.description || "공지사항 내용을 입력하세요.";
  const badge = isNotice ? "공지 draft 반영" : isImage ? "이미지 변경 반영" : "팝업 변경 반영";

  return (
    <div className={`dk-fullpage-preview-shell is-${mode}`}>
      <div className="dk-fullpage-browserbar">
        <span />
        <strong>https://dgtc.ejdzm90.workers.dev/#/</strong>
      </div>
      <div className="dk-fullpage-viewport">
        <header className="dk-fullpage-header">
          <DaekwangLogoLockup tone="dark" size="sm" />
          <nav><span>회사소개</span><span>기술력</span><span>공지사항</span></nav>
        </header>
        <main className="dk-fullpage-home">
          <section className="dk-fullpage-hero">
            <div>
              <em>PRECISION MANUFACTURING</em>
              <h3>정밀한 기술로<br />내일의 가치를 만듭니다</h3>
              <p>대광테크는 정밀가공 기술과 품질 중심의 제조 역량을 소개하는 기업 홈페이지입니다.</p>
              <b>{badge}</b>
            </div>
            <img src={heroImage} alt="공개 홈페이지 히어로 미리보기" />
          </section>
          <section className="dk-fullpage-stats">
            <span><b>1998</b><small>Since</small></span>
            <span><b>120+</b><small>Facilities</small></span>
            <span><b>100%</b><small>Quality</small></span>
          </section>
          <section className="dk-fullpage-section">
            <div className="dk-fullpage-section-head"><small>BUSINESS</small><strong>사업영역</strong></div>
            <div className="dk-fullpage-card-grid">
              <article className={isImage && ["product", "company"].includes(preview.imageCategory) ? "is-reflected" : ""}>
                <img src={businessImage} alt="사업영역 이미지 미리보기" />
                <strong>정밀 가공 부품</strong>
                <p>고정밀 CNC 가공으로 완성하는 핵심 부품</p>
              </article>
              <article className={isImage && preview.imageCategory === "facility" ? "is-reflected" : ""}>
                <img src={facilityImage} alt="설비 이미지 미리보기" />
                <strong>생산 인프라</strong>
                <p>품질과 납기를 안정적으로 관리하는 설비 체계</p>
              </article>
            </div>
          </section>
          <section className="dk-fullpage-process">
            <small>PROCESS</small>
            <strong>제조 프로세스</strong>
            <div><span>도면 검토</span><i /><span>정밀 가공</span><i /><span>품질 확인</span></div>
          </section>
          <section className="dk-fullpage-notice">
            <small>NOTICE</small>
            <strong>대광테크 소식</strong>
            <article className={isNotice ? "dk-fullpage-notice-card is-reflected" : "dk-fullpage-notice-card"}>
              <div>
                <span>{noticeCategory}</span>
                <time>{noticeDate}</time>
                {preview.status ? <em>{preview.status === "hidden" ? "비노출" : "노출"}</em> : null}
              </div>
              <h4>{isNotice ? preview.title : "홈페이지 리뉴얼 안내"}</h4>
              <p>{isNotice ? noticeBody : "대광테크의 주요 안내와 기업 소식을 확인하실 수 있습니다."}</p>
            </article>
          </section>
          {isNotice ? (
            <section className="dk-fullpage-notice-article">
              <small>PUBLIC NOTICE DETAIL</small>
              <h3>{preview.title}</h3>
              <div><span>{noticeCategory}</span><time>{noticeDate}</time></div>
              <p>{noticeBody}</p>
              <b>대광테크 공지사항</b>
            </section>
          ) : null}
        </main>
        {popup ? (
          <div className="dk-fullpage-popup-overlay">
            <PublicPopupRenderer popup={popup} mode={mode === "mobile" ? "mobile" : "desktop"} preview />
          </div>
        ) : null}
      </div>
    </div>
  );
}

export function AdminPreviewModal({ preview, onClose }) {
  const [popupMode, setPopupMode] = useState("desktop");
  if (!preview) return null;

  const kind = preview.kind || "PREVIEW";
  const isNotice = kind.includes("NOTICE");
  const isPopup = kind.includes("POPUP");
  const isImage = kind.includes("IMAGE");
  const isFullHomepage = isPopup || isImage || isNotice;
  const category = preview.category || preview.description?.split("·")?.[0]?.trim() || "공지";
  const date = preview.publishDate || preview.description?.split("·")?.[1]?.trim() || "게시일 확인";
  const popup = preview.popup || null;

  return (
    <div className="dk-modal-layer" role="presentation">
      <section className="dk-modal dk-preview-modal" role="dialog" aria-modal="true" aria-labelledby="dk-preview-title">
        <button className="dk-modal-close" type="button" onClick={onClose} aria-label="미리보기 닫기">
          ×
        </button>
        <p className="dk-modal-kicker">{kind}</p>
        <h2 id="dk-preview-title">{isFullHomepage ? "공개 홈페이지 전체 미리보기" : preview.title}</h2>
        {isFullHomepage ? <p className="dk-modal-helper">관리자에서 선택한 변경사항이 공개 홈페이지/공지 페이지 전체 화면 안에 반영되는 기준으로 확인합니다.</p> : null}
        {isFullHomepage ? (
          <div className="dk-popup-preview-frame" aria-label="공개 팝업 예상 미리보기">
            <div className="dk-popup-preview-toolbar">
              <span>PUBLIC HOMEPAGE FULL PAGE PREVIEW</span>
              <div role="group" aria-label="팝업 미리보기 화면 크기">
                <button className={popupMode === "desktop" ? "is-active" : ""} type="button" onClick={() => setPopupMode("desktop")}>Desktop</button>
                <button className={popupMode === "mobile" ? "is-active" : ""} type="button" onClick={() => setPopupMode("mobile")}>Mobile</button>
              </div>
            </div>
            <div className={`dk-popup-preview-canvas is-${popupMode}`}>
              <FullHomepagePreview preview={preview} mode={popupMode} popup={popup} />
            </div>
            {preview.rows?.length ? <DetailRows rows={preview.rows} /> : null}
          </div>
        ) : null}
        {isNotice && isFullHomepage ? (
          <p className="dk-preview-inline-note">
            현재 draft: {category} · {date} · {preview.status === "hidden" ? "비노출" : "노출"} 상태로 전체 public preview 안에 반영됩니다.
          </p>
        ) : null}
        {!isFullHomepage && preview.imageUrl ? (
          <div className="dk-modal-image">
            <img src={preview.imageUrl} alt={`${preview.title} 미리보기`} />
          </div>
        ) : null}
        {!isNotice && !isFullHomepage && preview.description ? <p className="dk-modal-description">{preview.description}</p> : null}
        {!isNotice && !isFullHomepage && preview.content ? <div className="dk-modal-content">{preview.content}</div> : null}
        {!isFullHomepage && preview.rows?.length ? <DetailRows rows={preview.rows} /> : null}
        <div className="dk-modal-actions">
          <button className="dk-primary-btn" type="button" onClick={onClose}>
            확인
          </button>
        </div>
      </section>
    </div>
  );
}
