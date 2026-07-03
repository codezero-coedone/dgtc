import React, { useRef, useState } from "react";
import { categoryLabels, publicImageSlots } from "../../data/daekwangAdminData.js";
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
  onUpdateImage,
  onMoveImage,
  onPreviewImage,
  onImageError,
}) {
  const uploadRef = useRef(null);
  const replaceRef = useRef(null);
  const [replaceTargetId, setReplaceTargetId] = useState("");
  const filteredAssets = assets.filter((asset) => asset.category === activeCategory);
  const activeSlot = publicImageSlots.find((slot) => slot.key === activeCategory) ?? publicImageSlots[0];

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
        {publicImageSlots.map(({ key, label }) => (
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

      <div className="dk-image-slot-map" aria-label="공개 홈페이지 이미지 슬롯">
        <div>
          <span>PUBLIC SLOT</span>
          <strong>{activeSlot.label}</strong>
          <p>{activeSlot.description}</p>
        </div>
        <dl>
          <div><dt>공개 위치</dt><dd>{activeSlot.publicSection}</dd></div>
          <div><dt>저장 키</dt><dd>{activeSlot.key}</dd></div>
          <div><dt>Fallback</dt><dd>{activeSlot.fallback}</dd></div>
          <div><dt>반영 상태</dt><dd>현재 브라우저 즉시 반영 / 서버 동기화 시 저장</dd></div>
        </dl>
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
                  onPreview={() => onPreviewImage?.(asset)}
                  onReplace={() => {
                    setReplaceTargetId(asset.id);
                    replaceRef.current?.click();
                  }}
                  onDelete={() => onDeleteImage(asset.id)}
                  onImageError={onImageError}
                />
              ))}
            </div>
          ) : (
            <div className="dk-empty-state">등록된 이미지가 없습니다.</div>
          )}
        </div>

        <ImagePreviewPanel image={selectedImage} onImageError={onImageError} />
      </div>
      {selectedImage && onUpdateImage ? (
        <div className="dk-image-edit-panel">
          <h3>이미지 정보 수정</h3>
          <div className="dk-image-edit-grid">
            <label>
              제목
              <input value={selectedImage.title} onChange={(event) => onUpdateImage(selectedImage.id, { title: event.target.value })} />
            </label>
            <label>
              분류
              <select value={selectedImage.category} onChange={(event) => onUpdateImage(selectedImage.id, { category: event.target.value })}>
                {Object.entries(categoryLabels).map(([key, label]) => (
                  <option key={key} value={key}>
                    {label}
                  </option>
                ))}
              </select>
            </label>
            <label>
              상태
              <select value={selectedImage.status} onChange={(event) => onUpdateImage(selectedImage.id, { status: event.target.value })}>
                <option value="active">사용중</option>
                <option value="inactive">대기</option>
              </select>
            </label>
            <div className="dk-image-order-actions">
              <button type="button" onClick={() => onMoveImage?.(selectedImage.id, -1)}>
                위로
              </button>
              <button type="button" onClick={() => onMoveImage?.(selectedImage.id, 1)}>
                아래로
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}
