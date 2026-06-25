import { notices as defaultNotices, noticeCtaSettings as defaultNoticeCtaSettings } from "../data/daekwangAdminData.js";
import { ADMIN_STORAGE_KEY, ADMIN_STORE_EVENT, normalizeNotice } from "./adminStorage.js";

export function getNoticeHref(id) {
  return `#/notice/${id}`;
}

export function getNoticeListHref() {
  return "#/notice";
}

export function loadPublicNoticeData() {
  let adminState = null;
  if (typeof window !== "undefined") {
    try {
      const raw = window.localStorage.getItem(ADMIN_STORAGE_KEY);
      adminState = raw ? JSON.parse(raw) : null;
    } catch {
      adminState = null;
    }
  }
  const notices = (Array.isArray(adminState?.notices) ? adminState.notices : defaultNotices).map(normalizeNotice);
  const visibleNotices = notices
    .filter((notice) => notice.status === "visible")
    .sort((a, b) => {
      if (a.isPinned !== b.isPinned) return a.isPinned ? -1 : 1;
      return String(b.publishDate).localeCompare(String(a.publishDate));
    });
  return {
    notices,
    visibleNotices,
    noticeCtaSettings: { ...defaultNoticeCtaSettings, ...(adminState?.noticeCtaSettings || {}) },
  };
}

export function subscribeNoticePublicData(callback) {
  if (typeof window === "undefined") return () => {};
  const update = () => callback(loadPublicNoticeData());
  window.addEventListener("storage", update);
  window.addEventListener(ADMIN_STORE_EVENT, update);
  return () => {
    window.removeEventListener("storage", update);
    window.removeEventListener(ADMIN_STORE_EVENT, update);
  };
}
