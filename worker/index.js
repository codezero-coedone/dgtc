import { defaultAdminContent, normalizeContent } from "../daekwangtech_homepage_v3_function_pass/src/adminContentSeed.js";
import { notices as defaultNotices, noticeCtaSettings as defaultNoticeCtaSettings } from "../daekwangtech_homepage_v3_function_pass/src/data/daekwangAdminData.js";

const CONTENT_KEY = "published-site-content";
const ADMIN_SESSION_COOKIE = "dk_admin_session";
const ADMIN_SESSION_TTL_SECONDS = 60 * 60 * 8;
const ALLOWED_IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);
const MAX_IMAGE_BYTES = 10 * 1024 * 1024;
const LOGIN_FAIL_LIMIT = 8;
const LOGIN_FAIL_WINDOW_SECONDS = 10 * 60;
const PUBLIC_IMAGE_SLOT_KEYS = ["homeHeroImage", "processHeroImage", "qualityVisualImage", "facilityVisualImage"];
const PUBLIC_IMAGE_SLOT_ALT = {
  homeHeroImage: "대광테크 정밀 가공 대표 이미지",
  processHeroImage: "대광테크 생산 공정 대표 이미지",
  qualityVisualImage: "대광테크 품질 관리 대표 이미지",
  facilityVisualImage: "대광테크 설비 대표 이미지",
  productsGalleryImages: "대광테크 제품 이미지",
};
const PUBLIC_IMAGE_SLOT_FALLBACKS = {
  homeHeroImage: { src: "assets/real-hero-batch-components.jpg", alt: PUBLIC_IMAGE_SLOT_ALT.homeHeroImage, source: "fallback" },
  processHeroImage: { src: "assets/real-process-shaft-detail.jpg", alt: PUBLIC_IMAGE_SLOT_ALT.processHeroImage, source: "fallback" },
  qualityVisualImage: { src: "assets/real-precision-threaded-pair.jpg", alt: PUBLIC_IMAGE_SLOT_ALT.qualityVisualImage, source: "fallback" },
  facilityVisualImage: { src: "assets/real-hero-batch-components.jpg", alt: PUBLIC_IMAGE_SLOT_ALT.facilityVisualImage, source: "fallback" },
  productsGalleryImages: [
    { src: "assets/real-black-valve-core.jpg", alt: "대광테크 유압 피팅 제품 이미지", source: "fallback" },
    { src: "assets/real-silver-valve-core.jpg", alt: "대광테크 밸브 컴포넌트 제품 이미지", source: "fallback" },
    { src: "assets/real-stepped-shaft-vertical.jpg", alt: "대광테크 정밀 부품 제품 이미지", source: "fallback" },
  ],
};

const jsonHeaders = {
  "content-type": "application/json; charset=utf-8",
  "cache-control": "no-store",
};

let schemaReady = false;

function json(data, init = {}) {
  return new Response(JSON.stringify(data), {
    ...init,
    headers: { ...jsonHeaders, ...(init.headers ?? {}) },
  });
}

function now() {
  return new Date().toISOString();
}

function safeName(name) {
  return (
    String(name || "upload")
      .toLowerCase()
      .replace(/[^a-z0-9._-]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 96) || "upload"
  );
}

function clonePublicFallbackSlots() {
  return {
    homeHeroImage: { ...PUBLIC_IMAGE_SLOT_FALLBACKS.homeHeroImage },
    processHeroImage: { ...PUBLIC_IMAGE_SLOT_FALLBACKS.processHeroImage },
    qualityVisualImage: { ...PUBLIC_IMAGE_SLOT_FALLBACKS.qualityVisualImage },
    facilityVisualImage: { ...PUBLIC_IMAGE_SLOT_FALLBACKS.facilityVisualImage },
    productsGalleryImages: PUBLIC_IMAGE_SLOT_FALLBACKS.productsGalleryImages.map((item) => ({ ...item })),
  };
}

function isSafePublicImageSrc(value, origin = "") {
  if (typeof value !== "string") return false;
  const src = value.trim();
  if (!src) return false;
  const lower = src.toLowerCase();
  if (lower.startsWith("javascript:") || lower.startsWith("data:")) return false;
  if (src.startsWith("assets/") || src.startsWith("/assets/") || src.startsWith("/api/cms/media/")) return true;
  if (/^https?:\/\//i.test(src)) {
    try {
      const parsed = new URL(src);
      return origin ? parsed.origin === origin : false;
    } catch {
      return false;
    }
  }
  return false;
}

function pickImageSrc(value) {
  if (typeof value === "string") return value;
  if (!value || typeof value !== "object") return "";
  return value.src || value.imageUrl || value.url || value.path || "";
}

function normalizePublicImageSlot(value, slotKey, source, origin) {
  const src = pickImageSrc(value).trim();
  if (!isSafePublicImageSrc(src, origin)) return null;
  const alt = typeof value === "object" && value
    ? String(value.alt || value.title || PUBLIC_IMAGE_SLOT_ALT[slotKey] || PUBLIC_IMAGE_SLOT_ALT.productsGalleryImages).trim()
    : PUBLIC_IMAGE_SLOT_ALT[slotKey] || PUBLIC_IMAGE_SLOT_ALT.productsGalleryImages;
  return {
    src,
    alt: alt.slice(0, 120) || PUBLIC_IMAGE_SLOT_ALT[slotKey] || PUBLIC_IMAGE_SLOT_ALT.productsGalleryImages,
    source,
  };
}

function parseCookies(cookieHeader = "") {
  return Object.fromEntries(
    cookieHeader
      .split(";")
      .map((part) => part.trim())
      .filter(Boolean)
      .map((part) => {
        const index = part.indexOf("=");
        if (index < 0) return [part, ""];
        return [part.slice(0, index), decodeURIComponent(part.slice(index + 1))];
      }),
  );
}

function sessionKey(token) {
  return `admin-session:${token}`;
}

function loginAttemptKey(request, userId) {
  const forwarded = request.headers.get("cf-connecting-ip") || request.headers.get("x-forwarded-for") || "unknown-ip";
  return `admin-login-fail:${forwarded}:${String(userId || "unknown").trim()}`;
}

function sessionCookie(request, token, maxAge) {
  const secure = new URL(request.url).protocol === "https:" ? "; Secure" : "";
  return `${ADMIN_SESSION_COOKIE}=${encodeURIComponent(token)}; HttpOnly; SameSite=Lax; Path=/; Max-Age=${maxAge}${secure}`;
}

function clearSessionCookie(request) {
  return sessionCookie(request, "", 0);
}

async function sha256Hex(value) {
  const input = new TextEncoder().encode(value);
  const hash = await crypto.subtle.digest("SHA-256", input);
  return [...new Uint8Array(hash)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

function configuredAdminAuth(env) {
  const adminId = String(env.ADMIN_ID || "").trim();
  const password = String(env.ADMIN_PASSWORD || "");
  const passwordHash = String(env.ADMIN_PASSWORD_SHA256 || "").trim().toLowerCase();
  return {
    adminId,
    password,
    passwordHash,
    ready: Boolean(adminId && (password || passwordHash)),
  };
}

async function verifyAdminPassword(inputPassword, env) {
  const configured = configuredAdminAuth(env);
  if (!configured.ready) return false;
  if (configured.passwordHash) return (await sha256Hex(inputPassword)) === configured.passwordHash;
  if (configured.password && inputPassword === configured.password) return true;
  return false;
}

async function readLoginFailures(request, env, userId) {
  if (env.DB) {
    await ensureSchema(env);
    const row = await env.DB.prepare("SELECT count, expires_at FROM admin_login_attempts WHERE id = ?")
      .bind(loginAttemptKey(request, userId))
      .first();
    if (!row || new Date(row.expires_at).getTime() <= Date.now()) return 0;
    return Number(row.count || 0);
  }
  if (!env.CONTENT_CACHE) return 0;
  const value = await env.CONTENT_CACHE.get(loginAttemptKey(request, userId));
  return Number(value || 0);
}

async function recordLoginFailure(request, env, userId) {
  if (env.DB) {
    await ensureSchema(env);
    const key = loginAttemptKey(request, userId);
    const count = (await readLoginFailures(request, env, userId)) + 1;
    const expiresAt = new Date(Date.now() + LOGIN_FAIL_WINDOW_SECONDS * 1000).toISOString();
    await env.DB.prepare(`
      INSERT INTO admin_login_attempts (id, count, expires_at, updated_at)
      VALUES (?, ?, ?, ?)
      ON CONFLICT(id) DO UPDATE SET
        count = excluded.count,
        expires_at = excluded.expires_at,
        updated_at = excluded.updated_at
    `)
      .bind(key, count, expiresAt, now())
      .run();
    return;
  }
  if (!env.CONTENT_CACHE) return;
  const key = loginAttemptKey(request, userId);
  const count = (await readLoginFailures(request, env, userId)) + 1;
  await env.CONTENT_CACHE.put(key, String(count), { expirationTtl: LOGIN_FAIL_WINDOW_SECONDS });
}

async function clearLoginFailures(request, env, userId) {
  if (env.DB) {
    await ensureSchema(env);
    await env.DB.prepare("DELETE FROM admin_login_attempts WHERE id = ?").bind(loginAttemptKey(request, userId)).run();
    return;
  }
  if (!env.CONTENT_CACHE) return;
  await env.CONTENT_CACHE.delete(loginAttemptKey(request, userId));
}

async function ensureSchema(env) {
  if (schemaReady || !env.DB) return;
  await env.DB.batch([
    env.DB.prepare(
      "CREATE TABLE IF NOT EXISTS site_content (id TEXT PRIMARY KEY, status TEXT NOT NULL, content_json TEXT NOT NULL, revision INTEGER NOT NULL DEFAULT 1, updated_at TEXT NOT NULL, updated_by TEXT)",
    ),
    env.DB.prepare(
      "CREATE TABLE IF NOT EXISTS content_revisions (revision_id INTEGER PRIMARY KEY AUTOINCREMENT, status TEXT NOT NULL, content_json TEXT NOT NULL, created_at TEXT NOT NULL, created_by TEXT, note TEXT)",
    ),
    env.DB.prepare(
      "CREATE TABLE IF NOT EXISTS media_assets (id TEXT PRIMARY KEY, object_key TEXT, src TEXT NOT NULL, label TEXT, alt TEXT, usage TEXT, content_type TEXT, size INTEGER, status TEXT NOT NULL DEFAULT 'active', created_at TEXT NOT NULL, updated_at TEXT NOT NULL)",
    ),
    env.DB.prepare(
      "CREATE TABLE IF NOT EXISTS admin_sessions (id TEXT PRIMARY KEY, user_id TEXT NOT NULL, created_at TEXT NOT NULL, expires_at TEXT NOT NULL, revoked_at TEXT)",
    ),
    env.DB.prepare(
      "CREATE TABLE IF NOT EXISTS admin_audit_logs (id TEXT PRIMARY KEY, actor TEXT, action TEXT NOT NULL, target TEXT, status TEXT NOT NULL, detail TEXT, created_at TEXT NOT NULL)",
    ),
    env.DB.prepare(
      "CREATE TABLE IF NOT EXISTS notices (id INTEGER PRIMARY KEY, title TEXT NOT NULL, status TEXT NOT NULL, publish_date TEXT NOT NULL, created_at TEXT NOT NULL, updated_at TEXT NOT NULL, category TEXT, is_pinned INTEGER NOT NULL DEFAULT 0, author TEXT, view_count INTEGER NOT NULL DEFAULT 0, content TEXT)",
    ),
    env.DB.prepare(
      "CREATE TABLE IF NOT EXISTS admin_state (id TEXT PRIMARY KEY, content_json TEXT NOT NULL, updated_at TEXT NOT NULL, updated_by TEXT)",
    ),
    env.DB.prepare(
      "CREATE TABLE IF NOT EXISTS admin_login_attempts (id TEXT PRIMARY KEY, count INTEGER NOT NULL DEFAULT 0, expires_at TEXT NOT NULL, updated_at TEXT NOT NULL)",
    ),
  ]);
  schemaReady = true;
}

async function recordAudit(env, { actor = "system", action, target = "", status = "success", detail = "" }) {
  if (!env.DB) return;
  try {
    await ensureSchema(env);
    await env.DB.prepare(
      "INSERT INTO admin_audit_logs (id, actor, action, target, status, detail, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)",
    )
      .bind(`audit-${Date.now()}-${crypto.randomUUID()}`, actor, action, target, status, detail, now())
      .run();
  } catch {
    // Audit failure must not break the user-facing admin flow.
  }
}

async function createAdminSession(request, env, userId) {
  await ensureSchema(env);
  const token = crypto.randomUUID();
  const createdAt = now();
  const expiresAt = new Date(Date.now() + ADMIN_SESSION_TTL_SECONDS * 1000).toISOString();
  const payload = { authenticated: true, userId, mode: "server-session", createdAt, expiresAt };
  if (env.CONTENT_CACHE) {
    await env.CONTENT_CACHE.put(sessionKey(token), JSON.stringify(payload), { expirationTtl: ADMIN_SESSION_TTL_SECONDS });
  }
  if (env.DB) {
    await env.DB.prepare("INSERT INTO admin_sessions (id, user_id, created_at, expires_at, revoked_at) VALUES (?, ?, ?, ?, NULL)")
      .bind(token, userId, createdAt, expiresAt)
      .run();
  }
  await recordAudit(env, { actor: userId, action: "admin.login", target: "session", detail: "server session issued" });
  return { token, payload, cookie: sessionCookie(request, token, ADMIN_SESSION_TTL_SECONDS) };
}

async function readAdminSession(request, env) {
  const token = parseCookies(request.headers.get("cookie") || "")[ADMIN_SESSION_COOKIE];
  if (!token) return null;
  if (env.DB) {
    await ensureSchema(env);
    const row = await env.DB.prepare("SELECT id, user_id, created_at, expires_at, revoked_at FROM admin_sessions WHERE id = ?").bind(token).first();
    if (!row || row.revoked_at || new Date(row.expires_at).getTime() <= Date.now()) return null;
    return {
      token,
      authenticated: true,
      userId: row.user_id,
      mode: "server-session",
      createdAt: row.created_at,
      expiresAt: row.expires_at,
    };
  }
  if (env.CONTENT_CACHE) {
    const cached = await env.CONTENT_CACHE.get(sessionKey(token), { type: "json" });
    if (cached?.authenticated && new Date(cached.expiresAt).getTime() > Date.now()) return { token, ...cached };
  }
  return null;
}

async function revokeAdminSession(request, env) {
  const token = parseCookies(request.headers.get("cookie") || "")[ADMIN_SESSION_COOKIE];
  if (!token) return;
  if (env.CONTENT_CACHE) await env.CONTENT_CACHE.delete(sessionKey(token));
  if (env.DB) {
    await ensureSchema(env);
    await env.DB.prepare("UPDATE admin_sessions SET revoked_at = ? WHERE id = ?").bind(now(), token).run();
  }
}

async function getContentRow(env, status) {
  await ensureSchema(env);
  if (!env.DB) return null;
  const row = await env.DB.prepare("SELECT content_json, revision, updated_at FROM site_content WHERE id = ?").bind(status).first();
  if (!row) return null;
  return {
    content: normalizeContent(JSON.parse(row.content_json)),
    revision: row.revision,
    updatedAt: row.updated_at,
  };
}

async function saveContent(env, status, content, actor, note) {
  await ensureSchema(env);
  if (!env.DB) throw new Error("D1 binding is missing.");
  const normalized = normalizeContent(content);
  const contentJson = JSON.stringify(normalized);
  const existing = await env.DB.prepare("SELECT revision FROM site_content WHERE id = ?").bind(status).first();
  const revision = Number(existing?.revision ?? 0) + 1;
  const timestamp = now();
  await env.DB.prepare(`
    INSERT INTO site_content (id, status, content_json, revision, updated_at, updated_by)
    VALUES (?, ?, ?, ?, ?, ?)
    ON CONFLICT(id) DO UPDATE SET
      status = excluded.status,
      content_json = excluded.content_json,
      revision = excluded.revision,
      updated_at = excluded.updated_at,
      updated_by = excluded.updated_by
  `)
    .bind(status, status, contentJson, revision, timestamp, actor)
    .run();
  await env.DB.prepare(`
    INSERT INTO content_revisions (status, content_json, created_at, created_by, note)
    VALUES (?, ?, ?, ?, ?)
  `)
    .bind(status, contentJson, timestamp, actor, note ?? "")
    .run();
  return { content: normalized, meta: { status, revision, updatedAt: timestamp } };
}

async function auth(request, env) {
  const expected = env.ADMIN_TOKEN;
  const header = request.headers.get("authorization") || "";
  const token = header.startsWith("Bearer ") ? header.slice(7).trim() : request.headers.get("x-admin-token") || "";
  if (expected && token && token === expected) return { actor: "token-admin", mode: "admin-token" };
  const session = await readAdminSession(request, env);
  return session ? { actor: session.userId, mode: session.mode, session } : null;
}

async function requireAuth(request, env) {
  const session = await auth(request, env);
  if (session) return session;
  throw json({ error: "관리자 인증이 필요합니다." }, { status: 401 });
}

async function publicContent(env) {
  await ensureSchema(env);
  const cached = await env.CONTENT_CACHE?.get(CONTENT_KEY, { type: "json" });
  if (cached?.content) return { content: normalizeContent(cached.content), meta: { source: "KV" } };
  const published = await getContentRow(env, "published");
  if (published) {
    await env.CONTENT_CACHE?.put(CONTENT_KEY, JSON.stringify({ content: published.content, cachedAt: now() }));
    return { content: published.content, meta: { source: "D1", revision: published.revision } };
  }
  return { content: normalizeContent(defaultAdminContent), meta: { source: "default" } };
}

async function adminContent(env) {
  const draft = await getContentRow(env, "draft");
  if (draft) return { content: draft.content, meta: { source: "D1:draft", revision: draft.revision, updatedAt: draft.updatedAt } };
  const published = await getContentRow(env, "published");
  if (published) return { content: published.content, meta: { source: "D1:published", revision: published.revision, updatedAt: published.updatedAt } };
  return { content: normalizeContent(defaultAdminContent), meta: { source: "default" } };
}

function normalizeNoticeRecord(notice) {
  const title = notice.title || "제목 없는 공지사항";
  return {
    id: Number(notice.id),
    title,
    status: notice.status === "hidden" ? "hidden" : "visible",
    publishDate: notice.publishDate || notice.publish_date || now().slice(0, 10),
    createdAt: notice.createdAt || notice.created_at || now(),
    updatedAt: notice.updatedAt || notice.updated_at || notice.createdAt || notice.created_at || now(),
    category: notice.category || "공지",
    isPinned: Boolean(notice.isPinned ?? notice.is_pinned),
    author: notice.author || "대광테크",
    viewCount: Number(notice.viewCount ?? notice.view_count ?? 0),
    content:
      notice.content ||
      `${title}\n\n대광테크에서 안내드리는 공지사항입니다. 세부 내용은 관리자 콘솔에서 보강할 수 있습니다.`,
  };
}

async function seedNotices(env) {
  if (!env.DB) return;
  await ensureSchema(env);
  const count = await env.DB.prepare("SELECT COUNT(*) AS count FROM notices").first();
  if (Number(count?.count || 0) > 0) return;
  for (const notice of defaultNotices.map(normalizeNoticeRecord)) {
    await env.DB.prepare(`
      INSERT INTO notices (id, title, status, publish_date, created_at, updated_at, category, is_pinned, author, view_count, content)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `)
      .bind(
        notice.id,
        notice.title,
        notice.status,
        notice.publishDate,
        notice.createdAt,
        notice.updatedAt,
        notice.category,
        notice.isPinned ? 1 : 0,
        notice.author,
        notice.viewCount,
        notice.content,
      )
      .run();
  }
}

async function listNoticeRows(env, { includeHidden = false } = {}) {
  if (!env.DB) {
    const rows = defaultNotices.map(normalizeNoticeRecord).filter((notice) => includeHidden || notice.status === "visible");
    return { notices: rows, meta: { source: "default", persistence: "fallback-no-d1" } };
  }
  await ensureSchema(env);
  await seedNotices(env);
  const condition = includeHidden ? "" : "WHERE status = 'visible'";
  const result = await env.DB.prepare(`
    SELECT id, title, status, publish_date, created_at, updated_at, category, is_pinned, author, view_count, content
    FROM notices
    ${condition}
    ORDER BY is_pinned DESC, publish_date DESC, id DESC
  `).all();
  return { notices: (result.results || []).map(normalizeNoticeRecord), meta: { source: "D1:notices" } };
}

async function createNotice(request, env, actor) {
  if (!env.DB) return json({ error: "D1 binding is missing." }, { status: 503 });
  await ensureSchema(env);
  const body = await request.json();
  const maxRow = await env.DB.prepare("SELECT MAX(id) AS max_id FROM notices").first();
  const id = Number(maxRow?.max_id || 0) + 1;
  const notice = normalizeNoticeRecord({ ...body, id, createdAt: now(), updatedAt: now() });
  await env.DB.prepare(`
    INSERT INTO notices (id, title, status, publish_date, created_at, updated_at, category, is_pinned, author, view_count, content)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `)
    .bind(
      notice.id,
      notice.title,
      notice.status,
      notice.publishDate,
      notice.createdAt,
      notice.updatedAt,
      notice.category,
      notice.isPinned ? 1 : 0,
      notice.author,
      notice.viewCount,
      notice.content,
    )
    .run();
  await recordAudit(env, { actor, action: "notice.create", target: notice.title });
  return json({ notice, meta: { source: "D1:notices" } });
}

async function updateNotice(request, env, actor, id, patch = null) {
  if (!env.DB) return json({ error: "D1 binding is missing." }, { status: 503 });
  await ensureSchema(env);
  const existing = await env.DB.prepare("SELECT * FROM notices WHERE id = ?").bind(id).first();
  if (!existing) return json({ error: "공지사항을 찾을 수 없습니다." }, { status: 404 });
  const body = patch ?? (await request.json());
  const notice = normalizeNoticeRecord({ ...normalizeNoticeRecord(existing), ...body, id: Number(id), updatedAt: now() });
  await env.DB.prepare(`
    UPDATE notices
    SET title = ?, status = ?, publish_date = ?, updated_at = ?, category = ?, is_pinned = ?, author = ?, view_count = ?, content = ?
    WHERE id = ?
  `)
    .bind(
      notice.title,
      notice.status,
      notice.publishDate,
      notice.updatedAt,
      notice.category,
      notice.isPinned ? 1 : 0,
      notice.author,
      notice.viewCount,
      notice.content,
      Number(id),
    )
    .run();
  await recordAudit(env, { actor, action: "notice.update", target: notice.title });
  return json({ notice, meta: { source: "D1:notices" } });
}

async function deleteNotice(env, actor, id) {
  if (!env.DB) return json({ error: "D1 binding is missing." }, { status: 503 });
  await ensureSchema(env);
  const existing = await env.DB.prepare("SELECT title FROM notices WHERE id = ?").bind(id).first();
  if (!existing) return json({ error: "공지사항을 찾을 수 없습니다." }, { status: 404 });
  await env.DB.prepare("DELETE FROM notices WHERE id = ?").bind(id).run();
  await recordAudit(env, { actor, action: "notice.delete", target: existing.title });
  return json({ ok: true, id: Number(id), meta: { source: "D1:notices" } });
}

async function uploadMedia(request, env) {
  if (!env.MEDIA_BUCKET) return json({ error: "R2 bucket binding is missing." }, { status: 503 });
  const form = await request.formData();
  const file = form.get("file");
  if (!(file instanceof File)) return json({ error: "업로드 파일이 없습니다." }, { status: 400 });
  if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
    return json({ error: "JPG, PNG, WEBP 파일만 업로드할 수 있습니다.", code: "UNSUPPORTED_MEDIA_TYPE" }, { status: 400 });
  }
  if (file.size > MAX_IMAGE_BYTES) {
    return json({ error: "이미지는 최대 10MB까지 업로드할 수 있습니다.", code: "MEDIA_TOO_LARGE" }, { status: 400 });
  }
  const key = `uploads/${Date.now()}-${crypto.randomUUID()}-${safeName(file.name)}`;
  await env.MEDIA_BUCKET.put(key, file.stream(), {
    httpMetadata: { contentType: file.type || "application/octet-stream" },
    customMetadata: {
      label: String(form.get("label") ?? file.name),
      alt: String(form.get("alt") ?? ""),
      usage: String(form.get("usage") ?? "관리자 업로드"),
    },
  });
  const media = {
    id: `media-${Date.now()}`,
    key,
    label: String(form.get("label") ?? file.name),
    src: `/api/cms/media/${key}`,
    alt: String(form.get("alt") ?? ""),
    usage: String(form.get("usage") ?? "관리자 업로드"),
    status: "active",
    contentType: file.type || "application/octet-stream",
    size: file.size,
  };
  await ensureSchema(env);
  if (env.DB) {
    await env.DB.prepare(`
      INSERT INTO media_assets (id, object_key, src, label, alt, usage, content_type, size, status, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `)
      .bind(media.id, key, media.src, media.label, media.alt, media.usage, media.contentType, media.size, media.status, now(), now())
      .run();
  }
  return json({ media });
}

async function listMedia(env) {
  if (!env.DB) return json({ media: [], meta: { source: "fallback-no-d1" } });
  await ensureSchema(env);
  const rows = await env.DB.prepare("SELECT id, object_key, src, label, alt, usage, content_type, size, status, created_at, updated_at FROM media_assets ORDER BY created_at DESC").all();
  const activeRows = (rows.results || []).filter((row) => row.status !== "deleted");
  if (!env.MEDIA_BUCKET) {
    return json({ media: activeRows, meta: { source: "D1:media_assets", r2Checked: false } });
  }
  const visibleRows = [];
  const missingRows = [];
  for (const row of activeRows) {
    if (!row.object_key) {
      visibleRows.push(row);
      continue;
    }
    const object = await env.MEDIA_BUCKET.head(row.object_key);
    if (object) {
      visibleRows.push(row);
    } else {
      missingRows.push(row);
    }
  }
  if (missingRows.length) {
    const timestamp = now();
    await Promise.all(
      missingRows.map((row) =>
        env.DB.prepare("UPDATE media_assets SET status = 'deleted', updated_at = ? WHERE id = ?").bind(timestamp, row.id).run(),
      ),
    );
  }
  return json({ media: visibleRows, meta: { source: "D1:media_assets", r2Checked: true, missingExcluded: missingRows.length } });
}

function applyAdminStateImageAssets(slots, imageAssets, origin) {
  if (!Array.isArray(imageAssets)) return false;
  const activeAssets = imageAssets
    .filter((asset) => asset && asset.status !== "inactive")
    .sort((a, b) => (Number(a.order) || 0) - (Number(b.order) || 0));
  let used = false;
  for (const slotKey of PUBLIC_IMAGE_SLOT_KEYS) {
    const asset = activeAssets.find((item) => item.category === slotKey);
    const normalized = normalizePublicImageSlot(asset, slotKey, "admin_state", origin);
    if (normalized) {
      slots[slotKey] = normalized;
      used = true;
    }
  }
  const products = activeAssets
    .filter((item) => item.category === "productsGalleryImages")
    .map((item) => normalizePublicImageSlot(item, "productsGalleryImages", "admin_state", origin))
    .filter(Boolean);
  if (products.length) {
    slots.productsGalleryImages = products;
    used = true;
  }
  return used;
}

function applyMediaAssetSlots(slots, rows, origin) {
  if (!Array.isArray(rows)) return false;
  const activeRows = rows
    .filter((row) => row && row.status !== "deleted")
    .sort((a, b) => String(b.updated_at || b.created_at || "").localeCompare(String(a.updated_at || a.created_at || "")));
  let used = false;
  for (const slotKey of PUBLIC_IMAGE_SLOT_KEYS) {
    if (slots[slotKey]?.source !== "fallback") continue;
    const row = activeRows.find((item) => item.usage === slotKey);
    const normalized = normalizePublicImageSlot(row, slotKey, "media_assets", origin);
    if (normalized) {
      slots[slotKey] = normalized;
      used = true;
    }
  }
  if (slots.productsGalleryImages.every((item) => item.source === "fallback")) {
    const products = activeRows
      .filter((item) => item.usage === "productsGalleryImages")
      .map((item) => normalizePublicImageSlot(item, "productsGalleryImages", "media_assets", origin))
      .filter(Boolean);
    if (products.length) {
      slots.productsGalleryImages = products;
      used = true;
    }
  }
  return used;
}

function publicImageSource(slots) {
  const sources = [
    ...PUBLIC_IMAGE_SLOT_KEYS.map((slotKey) => slots[slotKey]?.source || "fallback"),
    ...(Array.isArray(slots.productsGalleryImages) ? slots.productsGalleryImages.map((item) => item.source || "fallback") : ["fallback"]),
  ];
  const unique = [...new Set(sources)];
  if (unique.length === 1) {
    if (unique[0] === "fallback") return "static_fallback";
    return unique[0];
  }
  return "mixed";
}

async function publicImageSlots(request, env) {
  const fallback = clonePublicFallbackSlots();
  const origin = new URL(request.url).origin;
  if (!env.DB) {
    return json({ ok: true, source: "static_fallback", slots: fallback, updatedAt: null, stale: true });
  }
  try {
    await ensureSchema(env);
    const slots = clonePublicFallbackSlots();
    let updatedAt = null;
    const stateRow = await env.DB.prepare("SELECT content_json, updated_at FROM admin_state WHERE id = 'primary'").first();
    if (stateRow?.content_json) {
      try {
        const state = JSON.parse(stateRow.content_json);
        if (applyAdminStateImageAssets(slots, state?.imageAssets, origin)) updatedAt = stateRow.updated_at || updatedAt;
      } catch {
        // A bad admin snapshot must not break the public page.
      }
    }
    const rows = await env.DB.prepare("SELECT src, label, alt, usage, status, created_at, updated_at FROM media_assets WHERE status != 'deleted' ORDER BY updated_at DESC").all();
    if (applyMediaAssetSlots(slots, rows.results || [], origin) && !updatedAt) {
      updatedAt = (rows.results || [])[0]?.updated_at || null;
    }
    return json({ ok: true, source: publicImageSource(slots), slots, updatedAt, stale: false });
  } catch {
    return json({ ok: true, source: "static_fallback", slots: fallback, updatedAt: null, stale: true });
  }
}

async function deleteMedia(env, actor, id) {
  if (!env.DB || !env.MEDIA_BUCKET) return json({ error: "D1/R2 binding is missing." }, { status: 503 });
  await ensureSchema(env);
  const row = await env.DB.prepare("SELECT id, object_key, label FROM media_assets WHERE id = ?").bind(id).first();
  if (!row) return json({ error: "이미지를 찾을 수 없습니다." }, { status: 404 });
  if (row.object_key) await env.MEDIA_BUCKET.delete(row.object_key);
  await env.DB.prepare("UPDATE media_assets SET status = 'deleted', updated_at = ? WHERE id = ?").bind(now(), id).run();
  await recordAudit(env, { actor, action: "media.delete", target: row.label || id, detail: row.object_key || "" });
  return json({ ok: true, id, meta: { source: "R2+D1:media_assets" } });
}

async function readAdminState(env) {
  if (!env.DB) return json({ state: null, meta: { source: "fallback-no-d1" } });
  await ensureSchema(env);
  const row = await env.DB.prepare("SELECT content_json, updated_at, updated_by FROM admin_state WHERE id = 'primary'").first();
  if (!row) return json({ state: null, meta: { source: "D1:admin_state", empty: true } });
  return json({ state: JSON.parse(row.content_json), meta: { source: "D1:admin_state", updatedAt: row.updated_at, updatedBy: row.updated_by } });
}

async function saveAdminStateSnapshot(request, env, actor) {
  if (!env.DB) return json({ error: "D1 binding is missing." }, { status: 503 });
  await ensureSchema(env);
  const body = await request.json();
  const state = body.state || {};
  const contentJson = JSON.stringify(state);
  const timestamp = now();
  await env.DB.prepare(`
    INSERT INTO admin_state (id, content_json, updated_at, updated_by)
    VALUES ('primary', ?, ?, ?)
    ON CONFLICT(id) DO UPDATE SET
      content_json = excluded.content_json,
      updated_at = excluded.updated_at,
      updated_by = excluded.updated_by
  `)
    .bind(contentJson, timestamp, actor)
    .run();
  await recordAudit(env, { actor, action: "admin_state.save", target: "primary", detail: "admin settings snapshot persisted" });
  return json({ ok: true, meta: { source: "D1:admin_state", updatedAt: timestamp } });
}

async function serveMedia(pathname, env) {
  if (!env.MEDIA_BUCKET) return json({ error: "R2 bucket binding is missing." }, { status: 503 });
  const key = decodeURIComponent(pathname.replace("/api/cms/media/", "").replace("/api/admin/media/", ""));
  const object = await env.MEDIA_BUCKET.get(key);
  if (!object) return json({ error: "이미지를 찾을 수 없습니다." }, { status: 404 });
  const headers = new Headers();
  object.writeHttpMetadata(headers);
  headers.set("etag", object.httpEtag);
  headers.set("cache-control", "public, max-age=31536000, immutable");
  return new Response(object.body, { headers });
}

async function handleAdminAuth(request, env) {
  const url = new URL(request.url);
  if (url.pathname === "/api/admin/login" && request.method === "POST") {
    const configured = configuredAdminAuth(env);
    if (!configured.ready) {
      return json(
        {
          error: "SERVER_AUTH_NOT_CONFIGURED",
          code: "SERVER_AUTH_NOT_CONFIGURED",
          hold: true,
          message: "Cloudflare ADMIN_ID and ADMIN_PASSWORD or ADMIN_PASSWORD_SHA256 secrets are not configured.",
        },
        { status: 503 },
      );
    }
    const body = await request.json();
    const userId = String(body.userId || body.id || "").trim();
    const password = String(body.password || "");
    if ((await readLoginFailures(request, env, userId)) >= LOGIN_FAIL_LIMIT) {
      await recordAudit(env, { actor: userId || "unknown", action: "admin.login", target: "session", status: "fail", detail: "rate limited" });
      return json({ error: "로그인 시도가 너무 많습니다. 잠시 후 다시 시도하세요.", code: "ADMIN_LOGIN_RATE_LIMITED" }, { status: 429 });
    }
    if (userId !== configured.adminId || !(await verifyAdminPassword(password, env))) {
      await recordLoginFailure(request, env, userId);
      await recordAudit(env, { actor: userId || "unknown", action: "admin.login", target: "session", status: "fail", detail: "invalid credential" });
      return json({ error: "아이디 또는 비밀번호가 올바르지 않습니다." }, { status: 401 });
    }
    await clearLoginFailures(request, env, userId);
    const session = await createAdminSession(request, env, userId);
    return json({ authenticated: true, userId, mode: "server-session", expiresAt: session.payload.expiresAt }, { headers: { "set-cookie": session.cookie } });
  }

  if (url.pathname === "/api/admin/logout" && request.method === "POST") {
    const session = await readAdminSession(request, env);
    await revokeAdminSession(request, env);
    await recordAudit(env, { actor: session?.userId || "unknown", action: "admin.logout", target: "session" });
    return json({ ok: true }, { headers: { "set-cookie": clearSessionCookie(request) } });
  }

  if (url.pathname === "/api/admin/session" && request.method === "GET") {
    const session = await readAdminSession(request, env);
    if (!session) return json({ authenticated: false, mode: "anonymous" });
    return json({ authenticated: true, userId: session.userId, mode: session.mode, expiresAt: session.expiresAt });
  }

  return null;
}

async function handleApi(request, env) {
  const url = new URL(request.url);
  if (request.method === "OPTIONS") return new Response(null, { status: 204 });
  try {
    const authResponse = await handleAdminAuth(request, env);
    if (authResponse) return authResponse;

    if (url.pathname === "/api/public/site" && request.method === "GET") return json(await publicContent(env));
    if (url.pathname === "/api/public/image-slots" && request.method === "GET") return publicImageSlots(request, env);
    if (url.pathname === "/api/public/notices" && request.method === "GET") {
      const payload = await listNoticeRows(env, { includeHidden: false });
      return json({ ...payload, noticeCtaSettings: defaultNoticeCtaSettings });
    }

    if (url.pathname === "/api/admin/notices" && request.method === "GET") {
      await requireAuth(request, env);
      return json(await listNoticeRows(env, { includeHidden: true }));
    }
    if (url.pathname === "/api/admin/notices" && request.method === "POST") {
      const session = await requireAuth(request, env);
      return createNotice(request, env, session.actor);
    }
    const noticeMatch = url.pathname.match(/^\/api\/admin\/notices\/(\d+)$/);
    if (noticeMatch && request.method === "PUT") {
      const session = await requireAuth(request, env);
      return updateNotice(request, env, session.actor, noticeMatch[1]);
    }
    if (noticeMatch && request.method === "DELETE") {
      const session = await requireAuth(request, env);
      return deleteNotice(env, session.actor, noticeMatch[1]);
    }
    const noticeHideMatch = url.pathname.match(/^\/api\/admin\/notices\/(\d+)\/hide$/);
    if (noticeHideMatch && request.method === "PATCH") {
      const session = await requireAuth(request, env);
      return updateNotice(request, env, session.actor, noticeHideMatch[1], { status: "hidden" });
    }

    if (url.pathname === "/api/admin/images" && request.method === "GET") {
      await requireAuth(request, env);
      return listMedia(env);
    }
    if (url.pathname === "/api/admin/images" && request.method === "POST") {
      await requireAuth(request, env);
      return uploadMedia(request, env);
    }
    const mediaMatch = url.pathname.match(/^\/api\/admin\/images\/([^/]+)$/);
    if (mediaMatch && request.method === "DELETE") {
      const session = await requireAuth(request, env);
      return deleteMedia(env, session.actor, decodeURIComponent(mediaMatch[1]));
    }
    if (url.pathname.startsWith("/api/admin/media/") && request.method === "GET") return serveMedia(url.pathname, env);

    if (url.pathname === "/api/admin/state" && request.method === "GET") {
      await requireAuth(request, env);
      return readAdminState(env);
    }
    if (url.pathname === "/api/admin/state" && request.method === "PUT") {
      const session = await requireAuth(request, env);
      return saveAdminStateSnapshot(request, env, session.actor);
    }

    if (url.pathname.startsWith("/api/admin/popups") && ["POST", "PUT", "PATCH", "DELETE"].includes(request.method)) {
      await requireAuth(request, env);
      return json({ error: "POPUP_SERVER_PERSISTENCE_SCAFFOLD_ONLY", hold: true }, { status: 501 });
    }

    if (url.pathname === "/api/cms/content" && request.method === "GET") return json(await publicContent(env));
    if (url.pathname === "/api/cms/admin/content" && request.method === "GET") {
      await requireAuth(request, env);
      return json(await adminContent(env));
    }
    if (url.pathname === "/api/cms/admin/content" && request.method === "PUT") {
      const session = await requireAuth(request, env);
      const body = await request.json();
      return json(await saveContent(env, "draft", body.content, session.actor, "draft save"));
    }
    if (url.pathname === "/api/cms/admin/publish" && request.method === "POST") {
      const session = await requireAuth(request, env);
      const body = await request.json();
      const saved = await saveContent(env, "published", body.content, session.actor, "publish");
      await env.CONTENT_CACHE?.put(CONTENT_KEY, JSON.stringify({ content: saved.content, cachedAt: now() }));
      return json(saved);
    }
    if (url.pathname === "/api/cms/admin/media" && request.method === "POST") {
      await requireAuth(request, env);
      return uploadMedia(request, env);
    }
    if (url.pathname.startsWith("/api/cms/media/") && request.method === "GET") return serveMedia(url.pathname, env);

    return json({ error: "API route not found" }, { status: 404 });
  } catch (error) {
    if (error instanceof Response) return error;
    return json({ error: error instanceof Error ? error.message : "API error" }, { status: 500 });
  }
}

async function serveStaticAsset(request, env) {
  const url = new URL(request.url);
  const response = await env.ASSETS.fetch(request);
  const headers = new Headers(response.headers);

  if (url.pathname === "/daekwang-sw.js") {
    headers.set("cache-control", "no-store, no-cache, must-revalidate");
  } else if (request.mode === "navigate" || headers.get("content-type")?.includes("text/html")) {
    headers.set("cache-control", "no-cache, must-revalidate");
  }

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname.startsWith("/api/")) return handleApi(request, env);
    return serveStaticAsset(request, env);
  },
};
