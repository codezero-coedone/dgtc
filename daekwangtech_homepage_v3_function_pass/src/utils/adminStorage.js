import {
  activityLogs,
  adminUsers,
  backupItems,
  footerInfo,
  imageAssets,
  initialNoticeDraft,
  logItems,
  menuItems,
  normalizeAdminSectionKey,
  noticeCtaSettings,
  notices,
  pageItems,
  popupItems,
  seoSettings,
  siteSettings,
} from "../data/daekwangAdminData.js";

export const ADMIN_STORAGE_KEY = "daekwang.admin.v1";
export const ADMIN_STORE_EVENT = "daekwang-admin-store-updated";

export function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

export function nowStamp() {
  const now = new Date();
  const date = now.toISOString().slice(0, 10);
  const time = now.toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit", hour12: false });
  return `${date} ${time}`;
}

export function normalizeNotice(notice) {
  const id = Number(notice.id);
  const title = notice.title || "제목 없는 공지사항";
  return {
    id,
    title,
    status: notice.status === "hidden" ? "hidden" : "visible",
    publishDate: notice.publishDate || new Date().toISOString().slice(0, 10),
    createdAt: notice.createdAt || nowStamp(),
    updatedAt: notice.updatedAt || notice.createdAt || nowStamp(),
    category: notice.category || "공지",
    isPinned: Boolean(notice.isPinned),
    author: notice.author || "대광테크",
    viewCount: Number(notice.viewCount || 0),
    content:
      notice.content ||
      `${title}\n\n대광테크에서 안내드리는 공지사항입니다. 세부 내용은 관리자 콘솔에서 보강할 수 있습니다.`,
  };
}

export function createDefaultAdminState(extraAudit = []) {
  return {
    imageAssets: clone(imageAssets),
    notices: clone(notices).map(normalizeNotice),
    pages: clone(pageItems),
    popups: clone(popupItems),
    menus: clone(menuItems),
    footerInfo: clone(footerInfo),
    siteSettings: clone(siteSettings),
    seoSettings: clone(seoSettings),
    noticeCtaSettings: clone(noticeCtaSettings),
    adminUsers: clone(adminUsers),
    activityLogs: clone(activityLogs),
    auditLogs: [
      ...extraAudit,
      ...clone(logItems).map((row) => ({
        id: row.id,
        timestamp: row.time.includes("-") ? row.time : `2026-06-26 ${row.time}`,
        user: row.user,
        action: row.action,
        target: row.target,
        status: row.status,
        type: row.type,
        detail: row.target,
      })),
    ],
    backupItems: clone(backupItems),
    uiPreferences: {
      activeSection: "dashboard",
      activeCategory: "homeHeroImage",
      noticeDraft: clone(initialNoticeDraft),
      autoBackup: true,
    },
  };
}

export function normalizeAdminState(value) {
  const base = createDefaultAdminState();
  const merged = {
    ...base,
    ...(value && typeof value === "object" ? value : {}),
  };
  const uiPreferences = { ...base.uiPreferences, ...(merged.uiPreferences || {}) };
  uiPreferences.activeSection = normalizeAdminSectionKey(uiPreferences.activeSection);
  if (!imageAssets.some((asset) => asset.category === uiPreferences.activeCategory)) {
    uiPreferences.activeCategory = "homeHeroImage";
  }

  return {
    ...merged,
    imageAssets: Array.isArray(merged.imageAssets) ? merged.imageAssets : base.imageAssets,
    notices: Array.isArray(merged.notices) ? merged.notices.map(normalizeNotice) : base.notices,
    pages: Array.isArray(merged.pages) ? merged.pages : base.pages,
    popups: Array.isArray(merged.popups) ? merged.popups : base.popups,
    menus: Array.isArray(merged.menus) ? merged.menus : base.menus,
    footerInfo: { ...base.footerInfo, ...(merged.footerInfo || {}) },
    siteSettings: { ...base.siteSettings, ...(merged.siteSettings || {}) },
    seoSettings: { ...base.seoSettings, ...(merged.seoSettings || {}) },
    noticeCtaSettings: { ...base.noticeCtaSettings, ...(merged.noticeCtaSettings || {}) },
    adminUsers: Array.isArray(merged.adminUsers) ? merged.adminUsers : base.adminUsers,
    activityLogs: Array.isArray(merged.activityLogs) ? merged.activityLogs : base.activityLogs,
    auditLogs: Array.isArray(merged.auditLogs) ? merged.auditLogs : base.auditLogs,
    backupItems: Array.isArray(merged.backupItems) ? merged.backupItems : base.backupItems,
    uiPreferences,
  };
}

export function loadAdminState() {
  if (typeof window === "undefined") return createDefaultAdminState();
  try {
    const raw = window.localStorage.getItem(ADMIN_STORAGE_KEY);
    if (!raw) return createDefaultAdminState();
    return normalizeAdminState(JSON.parse(raw));
  } catch {
    return createDefaultAdminState([
      {
        id: `storage-recovery-${Date.now()}`,
        timestamp: nowStamp(),
        user: "시스템",
        action: "저장소 복구",
        target: "localStorage",
        status: "success",
        type: "storageRecovery",
        detail: "저장 데이터 파싱 실패로 기본값을 불러왔습니다.",
      },
    ]);
  }
}

export function saveAdminState(state) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(normalizeAdminState(state)));
  window.dispatchEvent(new CustomEvent(ADMIN_STORE_EVENT, { detail: { key: ADMIN_STORAGE_KEY } }));
}

export function resetAdminStorage() {
  if (typeof window !== "undefined") {
    window.localStorage.removeItem(ADMIN_STORAGE_KEY);
    window.dispatchEvent(new CustomEvent(ADMIN_STORE_EVENT, { detail: { key: ADMIN_STORAGE_KEY } }));
  }
  return createDefaultAdminState();
}
