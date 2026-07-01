const API_BASE = "";

async function parseJson(response) {
  const text = await response.text();
  if (!text) return {};
  try {
    return JSON.parse(text);
  } catch {
    return { raw: text };
  }
}

export class AdminApiError extends Error {
  constructor(message, response, body) {
    super(message);
    this.name = "AdminApiError";
    this.status = response?.status || 0;
    this.body = body || {};
    this.code = body?.code || body?.error || "ADMIN_API_ERROR";
  }
}

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    credentials: "include",
    headers: {
      ...(options.body instanceof FormData ? {} : { "content-type": "application/json" }),
      ...(options.headers || {}),
    },
    ...options,
  });
  const body = await parseJson(response);
  if (!response.ok) throw new AdminApiError(body.message || body.error || "관리자 API 요청에 실패했습니다.", response, body);
  return body;
}

export function loginAdmin(userId, password) {
  return request("/api/admin/login", {
    method: "POST",
    body: JSON.stringify({ userId, password }),
  });
}

export function logoutAdmin() {
  return request("/api/admin/logout", { method: "POST" });
}

export function getAdminSession() {
  return request("/api/admin/session");
}

export function listNotices() {
  return request("/api/admin/notices");
}

export function createNotice(notice) {
  return request("/api/admin/notices", {
    method: "POST",
    body: JSON.stringify(notice),
  });
}

export function updateNotice(id, notice) {
  return request(`/api/admin/notices/${id}`, {
    method: "PUT",
    body: JSON.stringify(notice),
  });
}

export function hideNotice(id) {
  return request(`/api/admin/notices/${id}/hide`, { method: "PATCH" });
}

export function deleteOrArchiveNotice(id) {
  return request(`/api/admin/notices/${id}`, { method: "DELETE" });
}

export function listImages() {
  return request("/api/admin/images");
}

export function uploadImage(file, fields = {}) {
  const form = new FormData();
  form.append("file", file);
  Object.entries(fields).forEach(([key, value]) => form.append(key, value));
  return request("/api/admin/images", { method: "POST", body: form });
}

export function deleteImageAsset(id) {
  return request(`/api/admin/images/${encodeURIComponent(id)}`, { method: "DELETE" });
}

export function getAdminState() {
  return request("/api/admin/state");
}

export function saveAdminState(state) {
  return request("/api/admin/state", {
    method: "PUT",
    body: JSON.stringify({ state }),
  });
}

export function updatePopup(id, patch) {
  return request(`/api/admin/popups/${id}`, {
    method: "PUT",
    body: JSON.stringify(patch),
  });
}

export function getPublicContent() {
  return request("/api/public/site");
}

export function getPublicNotices() {
  return request("/api/public/notices");
}
