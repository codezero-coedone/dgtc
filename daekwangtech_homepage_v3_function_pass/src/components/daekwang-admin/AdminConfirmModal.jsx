import React from "react";

export function AdminConfirmModal({ confirm, onCancel }) {
  if (!confirm) return null;

  return (
    <div className="dk-modal-layer" role="presentation">
      <section className="dk-modal dk-confirm-modal" role="dialog" aria-modal="true" aria-labelledby="dk-confirm-title">
        <div>
          <span className={confirm.tone === "danger" ? "dk-modal-mark danger" : "dk-modal-mark"}>{confirm.tone === "danger" ? "!" : "?"}</span>
          <h2 id="dk-confirm-title">{confirm.title}</h2>
          <p>{confirm.message}</p>
        </div>
        <div className="dk-modal-actions">
          <button className="dk-secondary-btn" type="button" onClick={onCancel}>
            취소
          </button>
          <button className={confirm.tone === "danger" ? "dk-danger-btn" : "dk-primary-btn"} type="button" onClick={confirm.onConfirm}>
            확인
          </button>
        </div>
      </section>
    </div>
  );
}
