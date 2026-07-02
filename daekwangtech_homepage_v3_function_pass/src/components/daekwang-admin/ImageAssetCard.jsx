import React from "react";
import { AdminIcon } from "./AdminIcons.jsx";

export function ImageAssetCard({ asset, selected, onSelect, onPreview, onReplace, onDelete, onImageError }) {
  return (
    <article className={selected ? "dk-image-card is-selected" : "dk-image-card"} onClick={onSelect}>
      <div className="dk-thumb">
        <img src={asset.imageUrl} alt={`${asset.title} 썸네일`} onError={() => onImageError?.(asset)} />
        <span className="dk-order-badge">#{asset.order}</span>
      </div>
      <div className="dk-image-meta">
        <div>
          <strong>{asset.title}</strong>
          <span>{asset.resolution}</span>
        </div>
        <i className={asset.status === "active" ? "dk-status-badge active" : "dk-status-badge"}>{asset.status === "active" ? "사용중" : "대기"}</i>
      </div>
      <div className="dk-image-actions" onClick={(event) => event.stopPropagation()}>
        <button type="button" onClick={onPreview}>
          <AdminIcon name="Eye" size={15} />
          미리보기
        </button>
        <button type="button" onClick={onReplace}>
          <AdminIcon name="Refresh" size={15} />
          교체
        </button>
        <button className="danger" type="button" onClick={onDelete}>
          <AdminIcon name="Trash" size={15} />
          삭제
        </button>
      </div>
    </article>
  );
}
