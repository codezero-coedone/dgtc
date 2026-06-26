import { notices as defaultNotices, noticeCtaSettings as defaultNoticeCtaSettings } from "../data/daekwangAdminData.js";
import { getPublicNotices } from "../services/adminApiClient.js";
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
    meta: { source: adminState?.notices ? "localStorage-admin-store" : "default" },
  };
}

export function hasLocalAdminNoticeState() {
  if (typeof window === "undefined") return false;
  try {
    const raw = window.localStorage.getItem(ADMIN_STORAGE_KEY);
    if (!raw) return false;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed?.notices);
  } catch {
    return false;
  }
}

export async function loadServerPublicNoticeData() {
  const response = await getPublicNotices();
  const notices = (Array.isArray(response.notices) ? response.notices : defaultNotices).map(normalizeNotice);
  const visibleNotices = notices
    .filter((notice) => notice.status === "visible")
    .sort((a, b) => {
      if (a.isPinned !== b.isPinned) return a.isPinned ? -1 : 1;
      return String(b.publishDate).localeCompare(String(a.publishDate));
    });
  return {
    notices,
    visibleNotices,
    noticeCtaSettings: { ...defaultNoticeCtaSettings, ...(response.noticeCtaSettings || {}) },
    meta: response.meta || { source: "server" },
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
