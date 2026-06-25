import { defaultAdminContent, normalizeContent } from "../daekwangtech_homepage_v3_function_pass/src/adminContentSeed.js";

const CONTENT_KEY = "published-site-content";
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
  return String(name || "upload")
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 96) || "upload";
}

async function ensureSchema(env) {
  if (schemaReady || !env.DB) return;
  const existing = await env.DB.prepare("SELECT name FROM sqlite_master WHERE type = 'table' AND name = 'site_content'").first();
  if (!existing) {
    await env.DB.batch([
      env.DB.prepare("CREATE TABLE IF NOT EXISTS site_content (id TEXT PRIMARY KEY, status TEXT NOT NULL, content_json TEXT NOT NULL, revision INTEGER NOT NULL DEFAULT 1, updated_at TEXT NOT NULL, updated_by TEXT)"),
      env.DB.prepare("CREATE TABLE IF NOT EXISTS content_revisions (revision_id INTEGER PRIMARY KEY AUTOINCREMENT, status TEXT NOT NULL, content_json TEXT NOT NULL, created_at TEXT NOT NULL, created_by TEXT, note TEXT)"),
      env.DB.prepare("CREATE TABLE IF NOT EXISTS media_assets (id TEXT PRIMARY KEY, object_key TEXT, src TEXT NOT NULL, label TEXT, alt TEXT, usage TEXT, content_type TEXT, size INTEGER, status TEXT NOT NULL DEFAULT 'active', created_at TEXT NOT NULL, updated_at TEXT NOT NULL)"),
    ]);
  }
  schemaReady = true;
}

async function getContentRow(env, status) {
  await ensureSchema(env);
  const row = await env.DB.prepare("SELECT content_json, revision, updated_at FROM site_content WHERE id = ?")
    .bind(status)
    .first();
  if (!row) return null;
  return {
    content: normalizeContent(JSON.parse(row.content_json)),
    revision: row.revision,
    updatedAt: row.updated_at,
  };
}

async function saveContent(env, status, content, actor, note) {
  await ensureSchema(env);
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
  `).bind(status, status, contentJson, revision, timestamp, actor).run();
  await env.DB.prepare(`
    INSERT INTO content_revisions (status, content_json, created_at, created_by, note)
    VALUES (?, ?, ?, ?, ?)
  `).bind(status, contentJson, timestamp, actor, note ?? "").run();
  return { content: normalized, meta: { status, revision, updatedAt: timestamp } };
}

async function auth(request, env) {
  const expected = env.ADMIN_TOKEN;
  if (!expected) return false;
  const header = request.headers.get("authorization") || "";
  const token = header.startsWith("Bearer ") ? header.slice(7).trim() : request.headers.get("x-admin-token") || "";
  return token && token === expected;
}

async function requireAuth(request, env) {
  if (await auth(request, env)) return;
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

async function uploadMedia(request, env) {
  if (!env.MEDIA_BUCKET) return json({ error: "R2 bucket binding is missing." }, { status: 503 });
  const form = await request.formData();
  const file = form.get("file");
  if (!(file instanceof File)) return json({ error: "업로드 파일이 없습니다." }, { status: 400 });
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
  await env.DB.prepare(`
    INSERT INTO media_assets (id, object_key, src, label, alt, usage, content_type, size, status, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).bind(media.id, key, media.src, media.label, media.alt, media.usage, media.contentType, media.size, media.status, now(), now()).run();
  return json({ media });
}

async function serveMedia(pathname, env) {
  if (!env.MEDIA_BUCKET) return json({ error: "R2 bucket binding is missing." }, { status: 503 });
  const key = decodeURIComponent(pathname.replace("/api/cms/media/", ""));
  const object = await env.MEDIA_BUCKET.get(key);
  if (!object) return json({ error: "이미지를 찾을 수 없습니다." }, { status: 404 });
  const headers = new Headers();
  object.writeHttpMetadata(headers);
  headers.set("etag", object.httpEtag);
  headers.set("cache-control", "public, max-age=31536000, immutable");
  return new Response(object.body, { headers });
}

async function handleApi(request, env) {
  const url = new URL(request.url);
  if (request.method === "OPTIONS") return new Response(null, { status: 204 });
  try {
    if (url.pathname === "/api/cms/content" && request.method === "GET") return json(await publicContent(env));
    if (url.pathname === "/api/cms/admin/content" && request.method === "GET") {
      await requireAuth(request, env);
      return json(await adminContent(env));
    }
    if (url.pathname === "/api/cms/admin/content" && request.method === "PUT") {
      await requireAuth(request, env);
      const body = await request.json();
      return json(await saveContent(env, "draft", body.content, "admin", "draft save"));
    }
    if (url.pathname === "/api/cms/admin/publish" && request.method === "POST") {
      await requireAuth(request, env);
      const body = await request.json();
      const saved = await saveContent(env, "published", body.content, "admin", "publish");
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

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname.startsWith("/api/cms/")) return handleApi(request, env);
    return env.ASSETS.fetch(request);
  },
};
