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

  return (
    <div className="dk-modal-layer" role="presentation">
      <section className="dk-modal dk-preview-modal" role="dialog" aria-modal="true" aria-labelledby="dk-preview-title">
        <button className="dk-modal-close" type="button" onClick={onClose} aria-label="미리보기 닫기">
          ×
        </button>
        <p className="dk-modal-kicker">{preview.kind || "PREVIEW"}</p>
        <h2 id="dk-preview-title">{preview.title}</h2>
        {preview.imageUrl ? (
          <div className="dk-modal-image">
            <img src={preview.imageUrl} alt={`${preview.title} 미리보기`} />
          </div>
        ) : null}
        {preview.description ? <p className="dk-modal-description">{preview.description}</p> : null}
        {preview.content ? <div className="dk-modal-content">{preview.content}</div> : null}
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
