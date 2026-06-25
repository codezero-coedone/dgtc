import React from "react";
import { AdminIcon } from "./AdminIcons.jsx";

export function ImagePreviewPanel({ image }) {
  if (!image) {
    return (
      <aside className="dk-preview-panel">
        <h3>선택 이미지 미리보기</h3>
        <div className="dk-empty-preview">이미지를 선택하면 상세 정보가 표시됩니다.</div>
      </aside>
    );
  }

  return (
    <aside className="dk-preview-panel">
      <h3>선택 이미지 미리보기</h3>
      <div className="dk-preview-frame">
        <img src={image.imageUrl} alt={`${image.title} 미리보기`} />
      </div>
      <dl className="dk-file-details">
        <div>
          <dt>파일명</dt>
          <dd>{image.fileName}</dd>
        </div>
        <div>
          <dt>파일크기</dt>
          <dd>{image.fileSize}</dd>
        </div>
        <div>
          <dt>해상도</dt>
          <dd>{image.resolution}</dd>
        </div>
        <div>
          <dt>업로드일</dt>
          <dd>{image.uploadDate}</dd>
        </div>
        <div>
          <dt>사용여부</dt>
          <dd>
            <span className={image.status === "active" ? "dk-status-badge active" : "dk-status-badge"}>
              {image.status === "active" ? "사용중" : "대기"}
            </span>
          </dd>
        </div>
      </dl>
      <a className="dk-download-btn" href={image.imageUrl} download={image.fileName}>
        <AdminIcon name="Download" size={17} />
        원본 파일 다운로드
      </a>
    </aside>
  );
}
