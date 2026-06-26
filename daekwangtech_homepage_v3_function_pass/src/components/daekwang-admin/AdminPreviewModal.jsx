import React from "react";

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

export function AdminPreviewModal({ preview, onClose }) {
  if (!preview) return null;

  const kind = preview.kind || "PREVIEW";
  const isNotice = kind.includes("NOTICE");
  const category = preview.category || preview.description?.split("·")?.[0]?.trim() || "공지";
  const date = preview.publishDate || preview.description?.split("·")?.[1]?.trim() || "게시일 확인";
  const body = preview.content || preview.description || "미리보기할 본문 정보가 없습니다.";

  return (
    <div className="dk-modal-layer" role="presentation">
      <section className="dk-modal dk-preview-modal" role="dialog" aria-modal="true" aria-labelledby="dk-preview-title">
        <button className="dk-modal-close" type="button" onClick={onClose} aria-label="미리보기 닫기">
          ×
        </button>
        <p className="dk-modal-kicker">{kind}</p>
        <h2 id="dk-preview-title">{preview.title}</h2>
        {isNotice ? (
          <div className="dk-public-preview-frame" aria-label="공개 화면 예상 미리보기">
            <div className="dk-public-preview-top">
              <span>PUBLIC NOTICE PREVIEW</span>
              <b>미리보기</b>
            </div>
            <article className="dk-public-notice-mock">
              <div className="dk-public-notice-meta">
                <span>{category}</span>
                <time>{date}</time>
                {preview.status ? <em>{preview.status === "hidden" ? "비노출" : "노출"}</em> : null}
              </div>
              <h3>{preview.title}</h3>
              <p>{body}</p>
            </article>
          </div>
        ) : null}
        {preview.imageUrl ? (
          <div className="dk-modal-image">
            <img src={preview.imageUrl} alt={`${preview.title} 미리보기`} />
          </div>
        ) : null}
        {!isNotice && preview.description ? <p className="dk-modal-description">{preview.description}</p> : null}
        {!isNotice && preview.content ? <div className="dk-modal-content">{preview.content}</div> : null}
        {preview.rows?.length ? <DetailRows rows={preview.rows} /> : null}
        <div className="dk-modal-actions">
          <button className="dk-primary-btn" type="button" onClick={onClose}>
            확인
          </button>
        </div>
      </section>
    </div>
  );
}
