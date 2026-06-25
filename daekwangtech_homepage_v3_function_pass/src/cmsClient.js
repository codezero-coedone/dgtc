import { normalizeContent } from "./adminContentSeed.js";

const ADMIN_TOKEN_KEY = "dgtc.admin.sessionToken";

async function readJson(response) {
  const text = await response.text();
  try {
    return text ? JSON.parse(text) : {};
  } catch {
    throw new Error("운영 API 응답 형식이 JSON이 아닙니다.");
  }
}

async function requestJson(path, options = {}) {
  const response = await fetch(path, {
    ...options,
    cache: "no-store",
    headers: {
      Accept: "application/json",
      ...(options.body instanceof FormData ? {} : { "Content-Type": "application/json" }),
      ...(options.headers ?? {}),
    },
  });
  const data = await readJson(response);
  if (!response.ok) throw new Error(data.error ?? `운영 API 오류 ${response.status}`);
  return data;
}

function authHeaders(token) {
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export function getStoredAdminToken() {
  if (typeof window === "undefined") return "";
  return window.sessionStorage.getItem(ADMIN_TOKEN_KEY) ?? "";
}

export function setStoredAdminToken(token) {
  if (typeof window === "undefined") return;
  if (token) window.sessionStorage.setItem(ADMIN_TOKEN_KEY, token);
  else window.sessionStorage.removeItem(ADMIN_TOKEN_KEY);
}

export async function loadPublishedContent() {
  const data = await requestJson("/api/cms/content");
  return normalizeContent(data.content);
}

export async function loadAdminContent(token) {
  const data = await requestJson("/api/cms/admin/content", {
    headers: authHeaders(token),
  });
  return {
    content: normalizeContent(data.content),
    meta: data.meta ?? {},
  };
}

export async function saveAdminContent(token, content) {
  const data = await requestJson("/api/cms/admin/content", {
    method: "PUT",
    headers: authHeaders(token),
    body: JSON.stringify({ content: normalizeContent(content) }),
  });
  return {
    content: normalizeContent(data.content),
    meta: data.meta ?? {},
  };
}

export async function publishAdminContent(token, content) {
  const data = await requestJson("/api/cms/admin/publish", {
    method: "POST",
    headers: authHeaders(token),
    body: JSON.stringify({ content: normalizeContent(content) }),
  });
  return {
    content: normalizeContent(data.content),
    meta: data.meta ?? {},
  };
}

export async function uploadAdminMedia(token, file, metadata = {}) {
  const body = new FormData();
  body.set("file", file);
  body.set("label", metadata.label ?? file.name);
  body.set("alt", metadata.alt ?? "");
  body.set("usage", metadata.usage ?? "관리자 업로드");
  const data = await requestJson("/api/cms/admin/media", {
    method: "POST",
    headers: authHeaders(token),
    body,
  });
  return data.media;
}
