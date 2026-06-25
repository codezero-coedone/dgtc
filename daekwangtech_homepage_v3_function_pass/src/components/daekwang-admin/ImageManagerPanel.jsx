import React, { useRef, useState } from "react";
import { categoryLabels } from "../../data/daekwangAdminData.js";
import { AdminIcon } from "./AdminIcons.jsx";
import { ImageAssetCard } from "./ImageAssetCard.jsx";
import { ImagePreviewPanel } from "./ImagePreviewPanel.jsx";

export function ImageManagerPanel({
  activeCategory,
  assets,
  selectedImage,
  selectedImageId,
  onCategoryChange,
  onSelectImage,
  onUploadImage,
  onReplaceImage,
  onDeleteImage,
  onSortToggle,
}) {
  const uploadRef = useRef(null);
  const replaceRef = useRef(null);
  const [replaceTargetId, setReplaceTargetId] = useState("");
  const filteredAssets = assets.filter((asset) => asset.category === activeCategory);

  const handleFile = (event) => {
    const file = event.target.files?.[0];
    if (file) onUploadImage(file);
    event.target.value = "";
  };

  const handleReplace = (event) => {
    const file = event.target.files?.[0];
    if (file && replaceTargetId) onReplaceImage(replaceTargetId, file);
    event.target.value = "";
    setReplaceTargetId("");
  };

  return (
    <section className="dk-panel dk-image-manager">
      <div className="dk-panel-head">
        <h2 className="dk-section-title">이미지 관리</h2>
        <div className="dk-panel-controls">
          <button type="button" onClick={onSortToggle}>
            <AdminIcon name="Refresh" size={16} />
            정렬 변경
          </button>
          <select aria-label="이미지 정렬 방식" defaultValue="latest">
            <option value="latest">최신순</option>
            <option value="order">노출순</option>
          </select>
        </div>
      </div>

      <div className="dk-image-tabs" role="tablist" aria-label="이미지 분류">
        {Object.entries(categoryLabels).map(([key, label]) => (
          <button
            aria-selected={activeCategory === key}
            className={activeCategory === key ? "is-active" : ""}
            key={key}
            role="tab"
            type="button"
            onClick={() => onCategoryChange(key)}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="dk-image-layout">
        <div className="dk-image-work">
          <button className="dk-upload-zone" type="button" onClick={() => uploadRef.current?.click()}>
            <span>
              <AdminIcon name="Upload" size={24} />
            </span>
            <strong>이미지 업로드 / 드래그 앤 드롭</strong>
            <small>JPG, PNG, WEBP 파일 (최대 10MB)</small>
          </button>
          <input ref={uploadRef} className="dk-hidden-input" type="file" accept="image/*" onChange={handleFile} />
          <input ref={replaceRef} className="dk-hidden-input" type="file" accept="image/*" onChange={handleReplace} />

          {filteredAssets.length ? (
            <div className="dk-image-grid">
              {filteredAssets.map((asset) => (
                <ImageAssetCard
                  asset={asset}
                  key={asset.id}
                  selected={asset.id === selectedImageId}
                  onSelect={() => onSelectImage(asset.id)}
                  onPreview={() => onSelectImage(asset.id)}
                  onReplace={() => {
                    setReplaceTargetId(asset.id);
                    replaceRef.current?.click();
                  }}
                  onDelete={() => onDeleteImage(asset.id)}
                />
              ))}
            </div>
          ) : (
            <div className="dk-empty-state">등록된 이미지가 없습니다.</div>
          )}
        </div>

        <ImagePreviewPanel image={selectedImage} />
      </div>
    </section>
  );
}
