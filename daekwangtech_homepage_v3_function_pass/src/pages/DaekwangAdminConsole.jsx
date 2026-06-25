import React, { useEffect, useMemo, useState } from "react";
import {
  activityLogs as initialActivityLogs,
  adminSectionOptions,
  imageAssets as initialImageAssets,
  initialNoticeDraft,
  notices as initialNotices,
  summaryCards,
} from "../data/daekwangAdminData.js";
import { AdminSidebar } from "../components/daekwang-admin/AdminSidebar.jsx";
import { AdminSectionRenderer } from "../components/daekwang-admin/AdminSectionRenderer.jsx";
import { AdminTopbar } from "../components/daekwang-admin/AdminTopbar.jsx";

function formatBytes(bytes) {
  if (!bytes) return "0KB";
  const units = ["B", "KB", "MB", "GB"];
  const index = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  return `${(bytes / 1024 ** index).toFixed(index ? 1 : 0)}${units[index]}`;
}

function today() {
  return new Date().toISOString().slice(0, 10);
}

function currentTime() {
  return new Date().toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit", hour12: false });
}

function createActivity(type, title, description) {
  return {
    id: `${type}-${Date.now()}`,
    type,
    title,
    description,
    time: currentTime(),
    user: "관리자",
  };
}

function createImageFromFile(file, category, order) {
  const name = file.name.replace(/\.[^.]+$/, "");
  return {
    id: `image-${Date.now()}`,
    category,
    title: name || "업로드 이미지",
    fileName: file.name,
    fileSize: formatBytes(file.size),
    resolution: "업로드 이미지",
    uploadDate: today(),
    status: "active",
    imageUrl: URL.createObjectURL(file),
    order,
  };
}

export function DaekwangAdminConsole() {
  const [activeSection, setActiveSection] = useState("dashboard");
  const [activeCategory, setActiveCategory] = useState("mainBanner");
  const [imageAssets, setImageAssets] = useState(initialImageAssets);
  const [selectedImageId, setSelectedImageId] = useState(initialImageAssets[0]?.id ?? "");
  const [notices, setNotices] = useState(initialNotices);
  const [activityLogs, setActivityLogs] = useState(initialActivityLogs);
  const [noticeDraft, setNoticeDraft] = useState(initialNoticeDraft);
  const [noticeError, setNoticeError] = useState("");
  const [editingNoticeId, setEditingNoticeId] = useState(null);
  const [sortReverse, setSortReverse] = useState(false);

  useEffect(() => {
    document.title = "대광테크 관리자 콘솔 | DAEKWANG TECH";
  }, []);

  const selectedImage = useMemo(
    () => imageAssets.find((asset) => asset.id === selectedImageId) ?? imageAssets.find((asset) => asset.category === activeCategory) ?? null,
    [activeCategory, imageAssets, selectedImageId],
  );

  const orderedAssets = useMemo(() => {
    const sorted = [...imageAssets].sort((a, b) => (sortReverse ? b.order - a.order : a.order - b.order));
    return sorted;
  }, [imageAssets, sortReverse]);

  const addActivity = (activity) => {
    setActivityLogs((current) => [activity, ...current].slice(0, 8));
  };

  const uploadImage = (file) => {
    const order = imageAssets.filter((asset) => asset.category === activeCategory).length + 1;
    const asset = createImageFromFile(file, activeCategory, order);
    setImageAssets((current) => [asset, ...current]);
    setSelectedImageId(asset.id);
    addActivity(createActivity("imageUpload", "이미지 업로드", `${asset.title} 이미지가 업로드 되었습니다.`));
  };

  const replaceImage = (assetId, file) => {
    let replacedTitle = "";
    setImageAssets((current) =>
      current.map((asset) => {
        if (asset.id !== assetId) return asset;
        replacedTitle = asset.title;
        return {
          ...asset,
          fileName: file.name,
          fileSize: formatBytes(file.size),
          imageUrl: URL.createObjectURL(file),
          uploadDate: today(),
          status: "active",
        };
      }),
    );
    setSelectedImageId(assetId);
    addActivity(createActivity("imageReplace", "이미지 교체", `${replacedTitle || "선택 이미지"}가 교체되었습니다.`));
  };

  const deleteImage = (assetId) => {
    const target = imageAssets.find((asset) => asset.id === assetId);
    if (!target) return;
    if (!window.confirm(`${target.title} 이미지를 삭제할까요?`)) return;
    const nextAssets = imageAssets.filter((asset) => asset.id !== assetId);
    setImageAssets(nextAssets);
    setSelectedImageId(nextAssets.find((asset) => asset.category === activeCategory)?.id ?? nextAssets[0]?.id ?? "");
    addActivity(createActivity("imageReplace", "이미지 삭제", `${target.title} 이미지가 삭제되었습니다.`));
  };

  const submitNotice = (event) => {
    event.preventDefault();
    if (!noticeDraft.title.trim() || !noticeDraft.content.trim()) {
      setNoticeError("제목과 내용을 입력하세요.");
      return;
    }
    setNoticeError("");

    if (editingNoticeId) {
      setNotices((current) =>
        current.map((notice) =>
          notice.id === editingNoticeId
            ? {
                ...notice,
                title: noticeDraft.title.trim(),
                status: noticeDraft.visible ? "visible" : "hidden",
                publishDate: noticeDraft.publishDate,
                content: noticeDraft.content.trim(),
              }
            : notice,
        ),
      );
      addActivity(createActivity("noticeEdit", "공지사항 수정", `공지 '${noticeDraft.title.trim()}'가 수정되었습니다.`));
    } else {
      const nextId = Math.max(...notices.map((notice) => notice.id), 0) + 1;
      const notice = {
        id: nextId,
        title: noticeDraft.title.trim(),
        status: noticeDraft.visible ? "visible" : "hidden",
        publishDate: noticeDraft.publishDate,
        createdAt: `${today()} ${currentTime()}`,
        content: noticeDraft.content.trim(),
      };
      setNotices((current) => [notice, ...current]);
      addActivity(createActivity("noticeCreate", "공지사항 등록", `새 공지 '${notice.title}'가 등록되었습니다.`));
    }

    setEditingNoticeId(null);
    setNoticeDraft(initialNoticeDraft);
  };

  const saveNoticeDraft = () => {
    addActivity(createActivity("draftSave", "공지사항 임시저장", "작성 중인 공지사항이 임시저장되었습니다."));
  };

  const editNotice = (notice) => {
    setEditingNoticeId(notice.id);
    setNoticeDraft({
      title: notice.title,
      publishDate: notice.publishDate,
      visible: notice.status === "visible",
      content: notice.content ?? "",
    });
    setNoticeError("");
    addActivity(createActivity("noticeEdit", "공지사항 수정", `공지 '${notice.title}' 편집을 시작했습니다.`));
  };

  const changeCategory = (category) => {
    setActiveCategory(category);
    const firstAsset = imageAssets.find((asset) => asset.category === category);
    if (firstAsset) setSelectedImageId(firstAsset.id);
  };

  const imageManagerProps = {
    activeCategory,
    assets: orderedAssets,
    selectedImage,
    selectedImageId,
    onCategoryChange: changeCategory,
    onSelectImage: setSelectedImageId,
    onUploadImage: uploadImage,
    onReplaceImage: replaceImage,
    onDeleteImage: deleteImage,
    onSortToggle: () => setSortReverse((value) => !value),
  };

  const noticeCreateProps = {
    draft: noticeDraft,
    error: noticeError,
    editingNoticeId,
    onChange: setNoticeDraft,
    onSubmit: submitNotice,
    onSaveDraft: saveNoticeDraft,
  };

  return (
    <div className="dk-admin-page">
      <AdminSidebar activeSection={activeSection} onSelectSection={setActiveSection} />
      <main className="dk-main">
        <AdminTopbar />
        <div className="dk-content">
          <label className="dk-mobile-section-select">
            <span>관리 섹션</span>
            <select value={activeSection} onChange={(event) => setActiveSection(event.target.value)}>
              {adminSectionOptions.map((section) => (
                <option key={section.key} value={section.key}>
                  {section.label}
                </option>
              ))}
            </select>
          </label>
          <AdminSectionRenderer
            activeSection={activeSection}
            activityLogs={activityLogs}
            imageManagerProps={imageManagerProps}
            noticeCreateProps={noticeCreateProps}
            notices={notices}
            summaryCards={summaryCards}
            onAddActivity={(type, title, description) => addActivity(createActivity(type, title, description))}
            onEditNotice={editNotice}
          />
        </div>
      </main>
    </div>
  );
}
