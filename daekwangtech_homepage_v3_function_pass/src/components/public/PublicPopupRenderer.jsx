import React from "react";

function normalizeHref(value) {
  const href = String(value || "").trim();
  if (!href) return "";
  if (/^https?:\/\//i.test(href)) return href;
  if (href.startsWith("#/")) return href;
  if (href.startsWith("/")) return `#${href}`;
  return `#/${href.replace(/^#?\/?/, "")}`;
}

export function PublicPopupRenderer({
  popup,
  mode = "desktop",
  preview = false,
  onClose,
}) {
  const title = popup?.title?.trim() || "팝업 제목";
  const content = popup?.content?.trim() || "팝업 내용을 입력하면 공개 화면에 표시될 문구를 확인할 수 있습니다.";
  const linkUrl = normalizeHref(popup?.linkUrl);
  const imageUrl = popup?.imageUrl || popup?.image || "";
  const placement = popup?.placement || "메인";
  const startDate = popup?.startDate || "-";
  const endDate = popup?.endDate || "-";
  const isActive = popup?.status !== "inactive";

  return (
    <div className={`public-popup-renderer is-${mode} ${preview ? "is-preview" : "is-live"}`} data-popup-placement={placement}>
      <article className="public-popup-card" role={preview ? undefined : "dialog"} aria-label={title}>
        <button className="public-popup-close" type="button" onClick={onClose} aria-label="팝업 닫기">×</button>
        <div className="public-popup-media">
          {imageUrl ? (
            <img src={imageUrl} alt={`${title} 팝업 이미지`} />
          ) : (
            <div className="public-popup-image-empty">
              <span>팝업 이미지 없음</span>
            </div>
          )}
        </div>
        <div className="public-popup-body">
          <div className="public-popup-kicker">
            <span>{placement}</span>
            <em>{isActive ? "노출" : "비노출"}</em>
          </div>
          <h3>{title}</h3>
          <p>{content}</p>
          {linkUrl ? (
            <a className="public-popup-cta" href={linkUrl} target={/^https?:\/\//i.test(linkUrl) ? "_blank" : undefined} rel={/^https?:\/\//i.test(linkUrl) ? "noreferrer" : undefined}>
              자세히 보기
            </a>
          ) : null}
          <small className="public-popup-period">{startDate} ~ {endDate}</small>
        </div>
      </article>
    </div>
  );
}
