import React, { useEffect, useMemo, useState } from "react";
import { adminSectionOptions, initialNoticeDraft } from "../data/daekwangAdminData.js";
import { useAdminStore } from "../hooks/useAdminStore.js";
import { AdminConfirmModal } from "../components/daekwang-admin/AdminConfirmModal.jsx";
import { AdminPreviewModal } from "../components/daekwang-admin/AdminPreviewModal.jsx";
import { AdminSectionRenderer } from "../components/daekwang-admin/AdminSectionRenderer.jsx";
import { AdminSidebar } from "../components/daekwang-admin/AdminSidebar.jsx";
import { AdminLoginGate, clearAdminAuthSession, readAdminAuthSession } from "../components/daekwang-admin/AdminLoginGate.jsx";
import { AdminMobileAppLayer } from "../components/daekwang-admin/AdminMobileAppLayer.jsx";
import { AdminToast } from "../components/daekwang-admin/AdminToast.jsx";
import { AdminTopbar } from "../components/daekwang-admin/AdminTopbar.jsx";
import { logoutAdmin } from "../services/adminApiClient.js";
import { fileSizeLabel, isImageFile, isUnderImageLimit, readFileAsDataUrl } from "../utils/adminValidation.js";
import { nowStamp } from "../utils/adminStorage.js";

function today() {
  return new Date().toISOString().slice(0, 10);
}

function timeOnly() {
  return new Date().toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit", hour12: false });
}

function normalizeNoticeDraft(draft = {}) {
  return {
    ...initialNoticeDraft,
    ...draft,
    visible: draft.visible ?? draft.status !== "hidden",
    category: draft.category || "공지",
    isPinned: Boolean(draft.isPinned),
  };
}

function nextNumberId(items) {
  return Math.max(0, ...items.map((item) => Number(item.id) || 0)) + 1;
}

function imagePreviewPayload(image) {
  return {
    kind: "IMAGE PREVIEW",
    title: image.title,
    imageUrl: image.imageUrl,
    rows: [
      ["파일명", image.fileName],
      ["파일크기", image.fileSize],
      ["해상도", image.resolution],
      ["업로드일", image.uploadDate],
      ["상태", image.status === "active" ? "사용중" : "대기"],
    ],
  };
}

function noticePreviewPayload(notice) {
  return {
    kind: "NOTICE PREVIEW",
    title: notice.title || "공지사항 미리보기",
    description: `${notice.category || "공지"} · ${notice.publishDate || today()} · ${notice.visible === false || notice.status === "hidden" ? "비노출" : "노출"}`,
    content: notice.content || "공지사항 내용을 입력하세요.",
  };
}

export function DaekwangAdminConsole() {
  const { state, actions } = useAdminStore();
  const [authSession, setAuthSession] = useState(() => readAdminAuthSession());
  const [activeSection, setActiveSectionState] = useState(state.uiPreferences.activeSection || "dashboard");
  const [activeCategory, setActiveCategoryState] = useState(state.uiPreferences.activeCategory || "mainBanner");
  const [selectedImageId, setSelectedImageId] = useState(state.imageAssets[0]?.id ?? "");
  const [noticeDraft, setNoticeDraft] = useState(() => normalizeNoticeDraft(state.uiPreferences.noticeDraft));
  const [noticeError, setNoticeError] = useState("");
  const [editingNoticeId, setEditingNoticeId] = useState(null);
  const [globalQuery, setGlobalQuery] = useState("");
  const [sortReverse, setSortReverse] = useState(false);
  const [toast, setToast] = useState(null);
  const [confirm, setConfirm] = useState(null);
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    document.title = "대광테크 관리자 콘솔 | DAE KWANG TECH";
  }, []);

  useEffect(() => {
    if (!state.imageAssets.some((asset) => asset.id === selectedImageId)) {
      const first = state.imageAssets.find((asset) => asset.category === activeCategory) ?? state.imageAssets[0];
      setSelectedImageId(first?.id ?? "");
    }
  }, [activeCategory, selectedImageId, state.imageAssets]);

  const notify = (title, message = "", type = "success") => setToast({ title, message, type });

  const setActiveSection = (section) => {
    setActiveSectionState(section);
    actions.updateUiPreferences((prefs) => ({ ...prefs, activeSection: section }));
  };

  const setActiveCategory = (category) => {
    setActiveCategoryState(category);
    actions.updateUiPreferences((prefs) => ({ ...prefs, activeCategory: category }));
    const firstAsset = state.imageAssets.find((asset) => asset.category === category);
    if (firstAsset) setSelectedImageId(firstAsset.id);
  };

  const adminSearchResults = useMemo(() => {
    const query = globalQuery.trim().toLowerCase();
    if (!query) return [];
    const rows = [
      ...adminSectionOptions.map((section) => ({
        id: `section-${section.key}`,
        label: section.label,
        meta: `${section.group} 메뉴`,
        section: section.key,
        kind: "관리 메뉴",
      })),
      ...state.notices.map((notice) => ({
        id: `notice-${notice.id}`,
        label: notice.title,
        meta: `${notice.category || "공지"} · ${notice.publishDate}`,
        section: "notices",
        kind: "공지사항",
      })),
      ...state.imageAssets.map((asset) => ({
        id: asset.id,
        label: asset.title,
        meta: `${asset.fileName} · ${asset.category}`,
        section: "images",
        category: asset.category,
        kind: "이미지",
      })),
      ...state.adminUsers.map((user) => ({
        id: user.id,
        label: user.name,
        meta: `${user.email} · ${user.role}`,
        section: "users",
        kind: "사용자",
      })),
      ...state.auditLogs.slice(0, 30).map((log) => ({
        id: log.id,
        label: log.action,
        meta: `${log.target} · ${log.timestamp}`,
        section: "logs",
        kind: "로그",
      })),
    ];
    return rows.filter((row) => `${row.label} ${row.meta} ${row.kind}`.toLowerCase().includes(query)).slice(0, 9);
  }, [globalQuery, state.adminUsers, state.auditLogs, state.imageAssets, state.notices]);

  const adminNotifications = useMemo(
    () => state.activityLogs.slice(0, 4).map((log) => ({
      id: log.id,
      title: log.title,
      description: log.description,
      time: log.time,
    })),
    [state.activityLogs],
  );

  const handleSearchSelect = (result) => {
    setActiveSection(result.section);
    if (result.section === "images") {
      if (result.category) setActiveCategory(result.category);
      setSelectedImageId(result.id);
    }
    setGlobalQuery("");
    notify("검색 결과로 이동", `${result.kind}: ${result.label}`);
  };

  const openConfirm = (nextConfirm) => {
    setConfirm({
      tone: "danger",
      ...nextConfirm,
      onConfirm: () => {
        nextConfirm.onConfirm();
        setConfirm(null);
      },
    });
  };

  const orderedAssets = useMemo(() => {
    return [...state.imageAssets].sort((a, b) => (sortReverse ? b.order - a.order : a.order - b.order));
  }, [sortReverse, state.imageAssets]);

  const selectedImage = useMemo(
    () => state.imageAssets.find((asset) => asset.id === selectedImageId) ?? state.imageAssets.find((asset) => asset.category === activeCategory) ?? null,
    [activeCategory, selectedImageId, state.imageAssets],
  );

  const dashboardCards = useMemo(
    () => [
      {
        id: "images",
        label: "총 이미지",
        value: String(state.imageAssets.length),
        unit: "개",
        description: "전체 이미지 파일 수",
        icon: "image",
        color: "blue",
        targetSection: "images",
      },
      {
        id: "banners",
        label: "활성 배너",
        value: String(state.imageAssets.filter((asset) => asset.category === "mainBanner" && asset.status === "active").length),
        unit: "개",
        description: "사용 중인 메인 배너",
        icon: "banner",
        color: "green",
        targetSection: "images",
      },
      {
        id: "notices",
        label: "공지사항",
        value: String(state.notices.length),
        unit: "건",
        description: "전체 공지사항 수",
        icon: "notice",
        color: "purple",
        targetSection: "notices",
      },
      {
        id: "recent",
        label: "최근 수정",
        value: String(state.activityLogs.length),
        unit: "건",
        description: "관리자 작업 로그",
        icon: "clock",
        color: "orange",
        targetSection: "logs",
      },
    ],
    [state.activityLogs.length, state.imageAssets, state.notices.length],
  );

  const createImageAsset = async (file, category, order) => {
    const imageUrl = await readFileAsDataUrl(file);
    const title = file.name.replace(/\.[^.]+$/, "") || "업로드 이미지";
    return {
      id: `image-${Date.now()}`,
      category,
      title,
      fileName: file.name,
      fileSize: fileSizeLabel(file.size),
      resolution: "업로드 이미지",
      uploadDate: today(),
      status: "active",
      imageUrl,
      order,
    };
  };

  const uploadImage = async (file) => {
    if (!isImageFile(file)) {
      notify("업로드 실패", "JPG, PNG, WEBP 파일만 등록할 수 있습니다.", "error");
      actions.addActivity("imageUploadFail", "이미지 업로드 실패", "허용되지 않는 파일 형식입니다.", file?.name || "unknown", "fail");
      return;
    }
    if (!isUnderImageLimit(file)) {
      notify("업로드 실패", "이미지는 최대 10MB까지 등록할 수 있습니다.", "error");
      actions.addActivity("imageUploadFail", "이미지 업로드 실패", "10MB 초과 파일입니다.", file.name, "fail");
      return;
    }
    const order = state.imageAssets.filter((asset) => asset.category === activeCategory).length + 1;
    const asset = await createImageAsset(file, activeCategory, order);
    actions.updateImages((current) => [asset, ...current], {
      type: "imageUpload",
      title: "이미지 업로드",
      description: `${asset.title} 이미지가 업로드되었습니다.`,
      target: asset.fileName,
    });
    setSelectedImageId(asset.id);
    notify("이미지 업로드 완료", asset.fileName);
  };

  const replaceImage = async (assetId, file) => {
    if (!isImageFile(file) || !isUnderImageLimit(file)) {
      notify("교체 실패", "JPG, PNG, WEBP / 10MB 이하 파일만 사용할 수 있습니다.", "error");
      return;
    }
    const imageUrl = await readFileAsDataUrl(file);
    const target = state.imageAssets.find((asset) => asset.id === assetId);
    actions.updateImages(
      (current) =>
        current.map((asset) =>
          asset.id === assetId
            ? { ...asset, fileName: file.name, fileSize: fileSizeLabel(file.size), imageUrl, uploadDate: today(), status: "active" }
            : asset,
        ),
      {
        type: "imageReplace",
        title: "이미지 교체",
        description: `${target?.title || "선택 이미지"}가 교체되었습니다.`,
        target: file.name,
      },
    );
    setSelectedImageId(assetId);
    notify("이미지 교체 완료", file.name);
  };

  const deleteImage = (assetId) => {
    const target = state.imageAssets.find((asset) => asset.id === assetId);
    if (!target) return;
    openConfirm({
      title: "이미지 삭제",
      message: `${target.title} 이미지를 삭제할까요?`,
      onConfirm: () => {
        const nextAssets = state.imageAssets.filter((asset) => asset.id !== assetId);
        actions.updateImages(nextAssets, {
          type: "imageDelete",
          title: "이미지 삭제",
          description: `${target.title} 이미지가 삭제되었습니다.`,
          target: target.fileName,
        });
        setSelectedImageId(nextAssets.find((asset) => asset.category === activeCategory)?.id ?? nextAssets[0]?.id ?? "");
        notify("이미지 삭제 완료", target.title);
      },
    });
  };

  const updateImage = (assetId, patch) => {
    const target = state.imageAssets.find((asset) => asset.id === assetId);
    actions.updateImages(
      (current) => current.map((asset) => (asset.id === assetId ? { ...asset, ...patch } : asset)),
      {
        type: "imageEdit",
        title: "이미지 정보 수정",
        description: `${target?.title || "이미지"} 정보가 수정되었습니다.`,
        target: target?.fileName || assetId,
      },
    );
    notify("이미지 정보 저장", target?.title || "선택 이미지");
  };

  const moveImage = (assetId, direction) => {
    const target = state.imageAssets.find((asset) => asset.id === assetId);
    if (!target) return;
    const siblings = state.imageAssets.filter((asset) => asset.category === target.category).sort((a, b) => a.order - b.order);
    const index = siblings.findIndex((asset) => asset.id === assetId);
    const nextIndex = index + direction;
    if (nextIndex < 0 || nextIndex >= siblings.length) return;
    [siblings[index], siblings[nextIndex]] = [siblings[nextIndex], siblings[index]];
    const orderMap = new Map(siblings.map((asset, orderIndex) => [asset.id, orderIndex + 1]));
    actions.updateImages(
      (current) => current.map((asset) => (orderMap.has(asset.id) ? { ...asset, order: orderMap.get(asset.id) } : asset)),
      {
        type: "imageSort",
        title: "이미지 순서 변경",
        description: `${target.title} 이미지 노출 순서가 변경되었습니다.`,
        target: target.title,
      },
    );
  };

  const submitNotice = (event) => {
    event.preventDefault();
    if (!noticeDraft.title.trim() || !noticeDraft.content.trim() || !noticeDraft.publishDate) {
      setNoticeError("제목, 게시일, 내용을 입력하세요.");
      notify("공지 저장 실패", "필수 입력값을 확인하세요.", "error");
      return;
    }
    setNoticeError("");
    if (editingNoticeId) {
      actions.updateNotices(
        (current) =>
          current.map((notice) =>
            notice.id === editingNoticeId
              ? {
                  ...notice,
                  title: noticeDraft.title.trim(),
                  status: noticeDraft.visible ? "visible" : "hidden",
                  publishDate: noticeDraft.publishDate,
                  category: noticeDraft.category || "공지",
                  isPinned: Boolean(noticeDraft.isPinned),
                  content: noticeDraft.content.trim(),
                  updatedAt: nowStamp(),
                }
              : notice,
          ),
        {
          type: "noticeEdit",
          title: "공지사항 수정",
          description: `공지 '${noticeDraft.title.trim()}'가 수정되었습니다.`,
          target: noticeDraft.title.trim(),
        },
      );
      notify("공지사항 수정 완료", noticeDraft.title.trim());
    } else {
      const nextId = nextNumberId(state.notices);
      const notice = {
        id: nextId,
        title: noticeDraft.title.trim(),
        status: noticeDraft.visible ? "visible" : "hidden",
        publishDate: noticeDraft.publishDate,
        createdAt: `${today()} ${timeOnly()}`,
        updatedAt: `${today()} ${timeOnly()}`,
        category: noticeDraft.category || "공지",
        isPinned: Boolean(noticeDraft.isPinned),
        author: "대광테크",
        viewCount: 0,
        content: noticeDraft.content.trim(),
      };
      actions.updateNotices((current) => [notice, ...current], {
        type: "noticeCreate",
        title: "공지사항 등록",
        description: `새 공지 '${notice.title}'가 등록되었습니다.`,
        target: notice.title,
      });
      notify("공지사항 등록 완료", notice.title);
    }
    setEditingNoticeId(null);
    setNoticeDraft(normalizeNoticeDraft(initialNoticeDraft));
    actions.updateUiPreferences((prefs) => ({ ...prefs, noticeDraft: normalizeNoticeDraft(initialNoticeDraft) }));
  };

  const saveNoticeDraft = () => {
    actions.updateUiPreferences((prefs) => ({ ...prefs, noticeDraft }));
    actions.addActivity("draftSave", "공지사항 임시저장", "작성 중인 공지사항이 임시저장되었습니다.", "noticeDraft");
    notify("임시저장 완료", "새로고침 후에도 공지 초안이 유지됩니다.");
  };

  const editNotice = (notice) => {
    setActiveSection("notices");
    setEditingNoticeId(notice.id);
    setNoticeDraft(normalizeNoticeDraft({ ...notice, visible: notice.status === "visible" }));
    setNoticeError("");
  };

  const cancelNoticeEdit = () => {
    setEditingNoticeId(null);
    setNoticeDraft(normalizeNoticeDraft(state.uiPreferences.noticeDraft));
    setNoticeError("");
  };

  const deleteNotice = (notice) => {
    openConfirm({
      title: "공지사항 삭제",
      message: `${notice.title} 공지를 삭제할까요? 공개 페이지에서도 제거됩니다.`,
      onConfirm: () => {
        actions.updateNotices((current) => current.filter((item) => item.id !== notice.id), {
          type: "noticeDelete",
          title: "공지사항 삭제",
          description: `${notice.title} 공지가 삭제되었습니다.`,
          target: notice.title,
        });
        notify("공지사항 삭제 완료", notice.title);
      },
    });
  };

  const toggleNotice = (notice) => {
    const nextStatus = notice.status === "visible" ? "hidden" : "visible";
    actions.updateNotices(
      (current) => current.map((item) => (item.id === notice.id ? { ...item, status: nextStatus, updatedAt: nowStamp() } : item)),
      {
        type: "noticeStatus",
        title: "공지 노출 변경",
        description: `${notice.title} 공지가 ${nextStatus === "visible" ? "노출" : "비노출"} 처리되었습니다.`,
        target: notice.title,
      },
    );
    notify("공지 노출 상태 변경", nextStatus === "visible" ? "공개 페이지에 표시됩니다." : "공개 페이지에서 숨겨집니다.");
  };

  const openPublicNotice = (notice) => {
    if (notice.status !== "visible") {
      notify("공개 보기 불가", "비노출 공지는 공개 페이지에서 볼 수 없습니다.", "error");
      return;
    }
    window.location.hash = `#/notice/${notice.id}`;
  };

  const openPublicNoticeList = () => {
    window.location.hash = "#/notice";
  };

  const resetAdminData = () => {
    openConfirm({
      title: "기본값으로 초기화",
      message: "관리자 콘솔의 localStorage 데이터를 기본값으로 되돌릴까요?",
      onConfirm: () => {
        actions.resetAdminData();
        setActiveSectionState("dashboard");
        setActiveCategoryState("mainBanner");
        setSelectedImageId("");
        setNoticeDraft(normalizeNoticeDraft(initialNoticeDraft));
        setEditingNoticeId(null);
        notify("초기화 완료", "기본 데이터가 다시 로드되었습니다.");
      },
    });
  };

  const handleAuthenticated = (session) => {
    setAuthSession(session);
    actions.addActivity("login", "관리자 로그인", `${session.userId} 계정으로 로그인했습니다.`, session.userId);
    notify("로그인 완료", "관리자 콘솔을 사용할 수 있습니다.");
  };

  const requestLogout = () => {
    openConfirm({
      title: "관리자 로그아웃",
      message: "관리자 콘솔에서 로그아웃하시겠습니까?",
      onConfirm: async () => {
        if (authSession?.serverAuth === true) {
          await logoutAdmin().catch(() => null);
        }
        clearAdminAuthSession();
        actions.addActivity("logout", "관리자 로그아웃", "관리자가 콘솔에서 로그아웃했습니다.", authSession?.userId || "admin");
        setAuthSession(null);
        notify("로그아웃 완료", "관리자 콘솔이 잠겼습니다.");
      },
    });
  };

  const imageManagerProps = {
    activeCategory,
    assets: orderedAssets,
    selectedImage,
    selectedImageId,
    onCategoryChange: setActiveCategory,
    onSelectImage: setSelectedImageId,
    onUploadImage: uploadImage,
    onReplaceImage: replaceImage,
    onDeleteImage: deleteImage,
    onSortToggle: () => setSortReverse((value) => !value),
    onUpdateImage: updateImage,
    onMoveImage: moveImage,
    onPreviewImage: (image) => setPreview(imagePreviewPayload(image)),
  };

  const noticeCreateProps = {
    draft: noticeDraft,
    error: noticeError,
    editingNoticeId,
    onChange: setNoticeDraft,
    onSubmit: submitNotice,
    onSaveDraft: saveNoticeDraft,
    onCancelEdit: cancelNoticeEdit,
    onPreview: () => setPreview(noticePreviewPayload(noticeDraft)),
    onOpenPublic: openPublicNoticeList,
  };

  const renderAdminContent = (className = "", options = {}) => (
    <div className={`dk-content ${className}`.trim()}>
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
        actions={actions}
        activityLogs={state.activityLogs}
        auditLogs={state.auditLogs}
        imageManagerProps={imageManagerProps}
        noticeCreateProps={noticeCreateProps}
        notices={state.notices}
        state={state}
        summaryCards={dashboardCards}
        onAddActivity={actions.addActivity}
        onDeleteNotice={deleteNotice}
        onEditNotice={editNotice}
        onNavigate={setActiveSection}
        onOpenPublicNotice={openPublicNotice}
        onOpenPublicNoticeList={openPublicNoticeList}
        onPreview={(payload) => setPreview(payload)}
        onReset={resetAdminData}
        onToast={notify}
        onToggleNotice={toggleNotice}
        onConfirm={openConfirm}
        compactDashboard={Boolean(options.compactDashboard)}
      />
    </div>
  );

  if (!authSession?.authenticated) {
    return <AdminLoginGate onAuthenticated={handleAuthenticated} />;
  }

  return (
    <div className="dk-admin-page">
      <div className="desktop-admin-shell">
        <AdminSidebar activeSection={activeSection} onSelectSection={setActiveSection} />
        <main className="dk-main">
          <AdminTopbar
            authSession={authSession}
            notifications={adminNotifications}
            onLogout={requestLogout}
            onSearchChange={setGlobalQuery}
            onSelectSearchResult={handleSearchSelect}
            searchResults={adminSearchResults}
            searchValue={globalQuery}
          />
          {renderAdminContent("dk-content--desktop")}
        </main>
      </div>
      <div className="responsive-admin-app-shell">
        <AdminMobileAppLayer
          activeSection={activeSection}
          authSession={authSession}
          imageCount={state.imageAssets.length}
          noticeCount={state.notices.length}
          recentLogs={state.activityLogs}
          onLogout={requestLogout}
          onNavigate={setActiveSection}
        />
        {renderAdminContent("dk-content--mobile", { compactDashboard: true })}
      </div>
      <AdminToast toast={toast} onClose={() => setToast(null)} />
      <AdminConfirmModal confirm={confirm} onCancel={() => setConfirm(null)} />
      <AdminPreviewModal preview={preview} onClose={() => setPreview(null)} />
    </div>
  );
}
