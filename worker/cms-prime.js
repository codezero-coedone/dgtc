const JSON_HEADERS = {
  'content-type': 'application/json; charset=utf-8',
  'cache-control': 'no-store',
  'x-content-type-options': 'nosniff',
};

const MAX_ORIGINAL_BYTES = 12 * 1024 * 1024;
const MAX_PROCESSED_BYTES = 5 * 1024 * 1024;
const ALLOWED_MIME = new Set(['image/jpeg', 'image/png', 'image/webp']);
const NOTICE_STATUS = new Set(['draft', 'scheduled', 'published', 'hidden', 'deleted']);
const IMAGE_PRESET = new Set(['natural', 'product', 'bright']);
let accessKeyCache = { expiresAt: 0, keys: [] };

export async function handleCmsPrime(request, env, ctx) {
  try {
    return await routeRequest(request, env, ctx);
  } catch (error) {
    console.error('DGTC_CMS_UNHANDLED', error?.stack || error);
    return json({ ok: false, error: 'INTERNAL_ERROR', message: '처리 중 오류가 발생했습니다.' }, 500);
  }
}

async function routeRequest(request, env, ctx) {
  const url = new URL(request.url);
  const path = url.pathname.replace(/\/+$/, '') || '/';

  if (request.method === 'OPTIONS') return new Response(null, { status: 204 });
  if (path === '/api/cms/health') {
    return json({ ok: true, service: 'DGTC_CMS', version: '1.0.0', time: new Date().toISOString() });
  }
  if (path === '/api/cms/public/bootstrap' && request.method === 'GET') return publicBootstrap(env);
  if (path === '/api/cms/public/notices' && request.method === 'GET') return publicNotices(url, env);
  if (path.startsWith('/api/cms/public/notices/') && request.method === 'GET') {
    return publicNotice(path.split('/').pop(), env);
  }
  if (path.startsWith('/api/cms/media/') && request.method === 'GET') {
    const key = decodeURIComponent(path.slice('/api/cms/media/'.length));
    return serveMedia(key, env, request);
  }

  if (path.startsWith('/api/cms/admin/')) {
    const auth = await requireAdmin(request, env);
    if (!auth.ok) return auth.response;
    const actor = auth.actor;

    if (path === '/api/cms/admin/dashboard' && request.method === 'GET') return adminDashboard(env);
    if (path === '/api/cms/admin/slots' && request.method === 'GET') return adminSlots(env);
    if (/^\/api\/cms\/admin\/slots\/[^/]+\/upload$/.test(path) && request.method === 'POST') {
      const slotId = decodeURIComponent(path.split('/')[5]);
      return uploadImageVersion(request, env, actor, slotId);
    }
    if (/^\/api\/cms\/admin\/versions\/[^/]+\/publish$/.test(path) && request.method === 'POST') {
      const versionId = decodeURIComponent(path.split('/')[5]);
      return publishImageVersion(env, actor, versionId);
    }
    if (/^\/api\/cms\/admin\/versions\/[^/]+\/delete$/.test(path) && request.method === 'POST') {
      const versionId = decodeURIComponent(path.split('/')[5]);
      return deleteImageVersion(env, actor, versionId);
    }
    if (/^\/api\/cms\/admin\/slots\/[^/]+\/rollback$/.test(path) && request.method === 'POST') {
      const slotId = decodeURIComponent(path.split('/')[5]);
      return rollbackImageSlot(env, actor, slotId);
    }

    if (path === '/api/cms/admin/notices' && request.method === 'GET') return adminNotices(env);
    if (path === '/api/cms/admin/notices' && request.method === 'POST') return createNotice(request, env, actor);
    if (/^\/api\/cms\/admin\/notices\/\d+$/.test(path) && request.method === 'PUT') {
      return updateNotice(request, env, actor, Number(path.split('/').pop()));
    }
    if (/^\/api\/cms\/admin\/notices\/\d+\/cover$/.test(path) && request.method === 'POST') {
      return uploadNoticeCover(request, env, actor, Number(path.split('/')[5]));
    }
    if (/^\/api\/cms\/admin\/notices\/\d+\/publish$/.test(path) && request.method === 'POST') {
      return setNoticeStatus(env, actor, Number(path.split('/')[5]), 'published');
    }
    if (/^\/api\/cms\/admin\/notices\/\d+\/hide$/.test(path) && request.method === 'POST') {
      return setNoticeStatus(env, actor, Number(path.split('/')[5]), 'hidden');
    }
    if (/^\/api\/cms\/admin\/notices\/\d+\/delete$/.test(path) && request.method === 'POST') {
      return setNoticeStatus(env, actor, Number(path.split('/')[5]), 'deleted');
    }
    if (/^\/api\/cms\/admin\/notices\/\d+\/restore$/.test(path) && request.method === 'POST') {
      return setNoticeStatus(env, actor, Number(path.split('/')[5]), 'draft');
    }
  }

  if (env.ASSETS) {
    if ((env.ADMIN_HOST && url.hostname.toLowerCase() === String(env.ADMIN_HOST).toLowerCase()) || path === '/admin-cms' || path === '/admin-cms/' || path === '/admin.css' || path === '/admin.js') {
      const assetPath = (path === '/' || path === '/admin-cms' || path === '/admin-cms/') ? '/public/admin-cms/index.html'
        : path === '/admin.css' ? '/public/admin-cms/admin.css'
        : path === '/admin.js' ? '/public/admin-cms/admin.js'
        : path;
      const assetUrl = new URL(request.url);
      assetUrl.pathname = assetPath;
      return env.ASSETS.fetch(new Request(assetUrl, request));
    }
  }
  return json({ ok: false, error: 'NOT_FOUND' }, 404);
}

async function publicBootstrap(env) {
  const now = new Date().toISOString();
  const [slotsResult, noticesResult] = await Promise.all([
    env.DB.prepare(`
      SELECT s.slot_id, s.page, s.label, s.x, s.y, s.w, s.h, s.aspect_ratio,
             v.version_id, v.processed_key, v.focal_x, v.focal_y, v.width, v.height
      FROM image_slots s
      LEFT JOIN image_versions v ON v.version_id = s.active_version_id AND v.status = 'published'
      ORDER BY s.page, s.slot_id
    `).all(),
    env.DB.prepare(`
      SELECT id, slug, title, published_at, is_pinned
      FROM cms_prime_notices
      WHERE (status = 'published' OR (status = 'scheduled' AND publish_at <= ?))
      ORDER BY is_pinned DESC, published_at DESC, id DESC
      LIMIT 3
    `).bind(now).all(),
  ]);
  const slots = (slotsResult.results || []).map((row) => ({
    ...row,
    media_url: row.processed_key ? `/api/cms/media/${encodeURIComponent(row.processed_key)}` : null,
  }));
  return json({ ok: true, slots, notices: noticesResult.results || [], generated_at: now }, 200, 60);
}

async function publicNotices(url, env) {
  const limit = clampNumber(url.searchParams.get('limit'), 1, 50, 20);
  const offset = clampNumber(url.searchParams.get('offset'), 0, 10000, 0);
  const now = new Date().toISOString();
  const result = await env.DB.prepare(`
    SELECT id, slug, title, substr(body, 1, 180) AS excerpt, published_at, is_pinned,
           CASE WHEN cover_key IS NULL THEN NULL ELSE '/api/cms/media/' || cover_key END AS cover_url
    FROM cms_prime_notices
    WHERE (status = 'published' OR (status = 'scheduled' AND publish_at <= ?))
    ORDER BY is_pinned DESC, published_at DESC, id DESC
    LIMIT ? OFFSET ?
  `).bind(now, limit, offset).all();
  return json({ ok: true, notices: result.results || [], limit, offset }, 200, 60);
}

async function publicNotice(idOrSlug, env) {
  const result = await env.DB.prepare(`
    SELECT id, slug, title, body, published_at, is_pinned,
           CASE WHEN cover_key IS NULL THEN NULL ELSE '/api/cms/media/' || cover_key END AS cover_url
    FROM cms_prime_notices
    WHERE (CAST(id AS TEXT) = ? OR slug = ?)
      AND (status = 'published' OR (status = 'scheduled' AND publish_at <= ?))
    LIMIT 1
  `).bind(String(idOrSlug), String(idOrSlug), new Date().toISOString()).first();
  if (!result) return json({ ok: false, error: 'NOTICE_NOT_FOUND' }, 404);
  return json({ ok: true, notice: result }, 200, 60);
}

async function serveMedia(key, env, request) {
  if (!key || key.includes('..') || key.startsWith('/')) return json({ ok: false, error: 'INVALID_MEDIA_KEY' }, 400);
  const object = await env.MEDIA_BUCKET.get(key);
  if (!object) return json({ ok: false, error: 'MEDIA_NOT_FOUND' }, 404);
  const headers = new Headers();
  object.writeHttpMetadata(headers);
  headers.set('etag', object.httpEtag);
  headers.set('cache-control', 'public, max-age=31536000, immutable');
  headers.set('x-content-type-options', 'nosniff');
  if (request.headers.get('if-none-match') === object.httpEtag) return new Response(null, { status: 304, headers });
  return new Response(object.body, { headers });
}

async function adminDashboard(env) {
  const [slots, drafts, notices, published] = await Promise.all([
    env.DB.prepare('SELECT count(*) AS c FROM image_slots').first('c'),
    env.DB.prepare("SELECT count(*) AS c FROM image_versions WHERE status='draft'").first('c'),
    env.DB.prepare("SELECT count(*) AS c FROM cms_prime_notices WHERE status != 'deleted'").first('c'),
    env.DB.prepare("SELECT count(*) AS c FROM cms_prime_notices WHERE status='published'").first('c'),
  ]);
  return json({ ok: true, counts: { slots: Number(slots || 0), image_drafts: Number(drafts || 0), notices: Number(notices || 0), published_notices: Number(published || 0) } });
}

async function adminSlots(env) {
  const slotRows = await env.DB.prepare(`
    SELECT s.*, v.processed_key AS active_processed_key, v.created_at AS active_created_at
    FROM image_slots s
    LEFT JOIN image_versions v ON v.version_id = s.active_version_id
    ORDER BY s.page, s.slot_id
  `).all();
  const versions = await env.DB.prepare(`
    SELECT version_id, slot_id, preset, focal_x, focal_y, width, height, mime, bytes,
           status, created_by, created_at, published_at, processed_key
    FROM image_versions
    WHERE status != 'deleted'
    ORDER BY created_at DESC
  `).all();
  const grouped = new Map();
  for (const v of versions.results || []) {
    v.media_url = `/api/cms/media/${encodeURIComponent(v.processed_key)}`;
    if (!grouped.has(v.slot_id)) grouped.set(v.slot_id, []);
    if (grouped.get(v.slot_id).length < 12) grouped.get(v.slot_id).push(v);
  }
  const slots = (slotRows.results || []).map((s) => ({
    ...s,
    active_media_url: s.active_processed_key ? `/api/cms/media/${encodeURIComponent(s.active_processed_key)}` : null,
    versions: grouped.get(s.slot_id) || [],
  }));
  return json({ ok: true, slots });
}

async function uploadImageVersion(request, env, actor, slotId) {
  const slot = await env.DB.prepare('SELECT * FROM image_slots WHERE slot_id = ?').bind(slotId).first();
  if (!slot) return json({ ok: false, error: 'SLOT_NOT_FOUND' }, 404);

  const form = await request.formData();
  const original = form.get('original');
  const processed = form.get('processed');
  if (!(original instanceof File) || !(processed instanceof File)) return json({ ok: false, error: 'IMAGE_FILES_REQUIRED' }, 400);
  if (original.size > MAX_ORIGINAL_BYTES || processed.size > MAX_PROCESSED_BYTES) return json({ ok: false, error: 'IMAGE_TOO_LARGE' }, 413);

  const originalBytes = new Uint8Array(await original.arrayBuffer());
  const processedBytes = new Uint8Array(await processed.arrayBuffer());
  if (!isSupportedImage(original.type, originalBytes) || !isSupportedImage(processed.type, processedBytes)) {
    return json({ ok: false, error: 'UNSUPPORTED_IMAGE' }, 415);
  }

  const preset = String(form.get('preset') || 'natural');
  const focalX = clampNumber(form.get('focal_x'), 0, 1, 0.5);
  const focalY = clampNumber(form.get('focal_y'), 0, 1, 0.5);
  const originalDimensions = readImageDimensions(original.type, originalBytes);
  const processedDimensions = readImageDimensions(processed.type, processedBytes);
  if (!IMAGE_PRESET.has(preset) || !originalDimensions || !processedDimensions) return json({ ok: false, error: 'INVALID_IMAGE_METADATA' }, 400);
  if (Math.max(originalDimensions.width, originalDimensions.height) < slot.min_width) {
    return json({ ok: false, error: 'IMAGE_WIDTH_TOO_SMALL', min_width: slot.min_width }, 422);
  }
  const width = processedDimensions.width;
  const height = processedDimensions.height;
  const ratioError = Math.abs((width / height) - Number(slot.aspect_ratio)) / Number(slot.aspect_ratio);
  if (ratioError > 0.05) return json({ ok: false, error: 'IMAGE_ASPECT_MISMATCH', expected: slot.aspect_ratio }, 422);

  const versionId = crypto.randomUUID();
  const safeSlot = slotId.replace(/[^a-zA-Z0-9._-]/g, '_');
  const extOriginal = mimeExtension(original.type);
  const extProcessed = mimeExtension(processed.type);
  const originalKey = `images/${safeSlot}/${versionId}/original.${extOriginal}`;
  const processedKey = `images/${safeSlot}/${versionId}/published.${extProcessed}`;

  await Promise.all([
    env.MEDIA_BUCKET.put(originalKey, originalBytes, { httpMetadata: { contentType: original.type, cacheControl: 'private, max-age=0' }, customMetadata: { slotId, versionId, kind: 'original' } }),
    env.MEDIA_BUCKET.put(processedKey, processedBytes, { httpMetadata: { contentType: processed.type, cacheControl: 'public, max-age=31536000, immutable' }, customMetadata: { slotId, versionId, kind: 'processed', preset } }),
  ]);

  try {
    await env.DB.batch([
      env.DB.prepare(`
        INSERT INTO image_versions
        (version_id, slot_id, original_key, processed_key, preset, focal_x, focal_y, width, height, mime, bytes, status, created_by)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'draft', ?)
      `).bind(versionId, slotId, originalKey, processedKey, preset, focalX, focalY, width, height, processed.type, processed.size, actor),
      auditStatement(env, actor, 'IMAGE_UPLOAD', 'image_version', versionId, { slot_id: slotId, preset, width, height, bytes: processed.size }),
    ]);
  } catch (error) {
    await Promise.allSettled([env.MEDIA_BUCKET.delete(originalKey), env.MEDIA_BUCKET.delete(processedKey)]);
    throw error;
  }

  return json({ ok: true, version: { version_id: versionId, slot_id: slotId, preset, status: 'draft', media_url: `/api/cms/media/${encodeURIComponent(processedKey)}` } }, 201);
}

async function publishImageVersion(env, actor, versionId) {
  const version = await env.DB.prepare('SELECT * FROM image_versions WHERE version_id = ? AND status != ?').bind(versionId, 'deleted').first();
  if (!version) return json({ ok: false, error: 'VERSION_NOT_FOUND' }, 404);
  const now = new Date().toISOString();
  await env.DB.batch([
    env.DB.prepare("UPDATE image_versions SET status='archived' WHERE slot_id=? AND status='published'").bind(version.slot_id),
    env.DB.prepare("UPDATE image_versions SET status='published', published_at=? WHERE version_id=?").bind(now, versionId),
    env.DB.prepare('UPDATE image_slots SET active_version_id=?, updated_at=? WHERE slot_id=?').bind(versionId, now, version.slot_id),
    auditStatement(env, actor, 'IMAGE_PUBLISH', 'image_version', versionId, { slot_id: version.slot_id }),
  ]);
  return json({ ok: true, slot_id: version.slot_id, active_version_id: versionId });
}

async function deleteImageVersion(env, actor, versionId) {
  const version = await env.DB.prepare('SELECT * FROM image_versions WHERE version_id = ?').bind(versionId).first();
  if (!version) return json({ ok: false, error: 'VERSION_NOT_FOUND' }, 404);
  if (version.status === 'published') return json({ ok: false, error: 'ACTIVE_VERSION_CANNOT_DELETE' }, 409);
  await env.DB.batch([
    env.DB.prepare("UPDATE image_versions SET status='deleted' WHERE version_id=?").bind(versionId),
    auditStatement(env, actor, 'IMAGE_DELETE', 'image_version', versionId, { slot_id: version.slot_id }),
  ]);
  return json({ ok: true });
}

async function rollbackImageSlot(env, actor, slotId) {
  const current = await env.DB.prepare('SELECT active_version_id FROM image_slots WHERE slot_id=?').bind(slotId).first();
  if (!current) return json({ ok: false, error: 'SLOT_NOT_FOUND' }, 404);
  const previous = await env.DB.prepare(`
    SELECT version_id FROM image_versions
    WHERE slot_id=? AND status='archived' AND version_id != ?
    ORDER BY published_at DESC, created_at DESC LIMIT 1
  `).bind(slotId, current.active_version_id || '').first();
  if (!previous) return json({ ok: false, error: 'NO_ROLLBACK_VERSION' }, 409);
  const now = new Date().toISOString();
  await env.DB.batch([
    env.DB.prepare("UPDATE image_versions SET status='archived' WHERE version_id=?").bind(current.active_version_id),
    env.DB.prepare("UPDATE image_versions SET status='published', published_at=? WHERE version_id=?").bind(now, previous.version_id),
    env.DB.prepare('UPDATE image_slots SET active_version_id=?, updated_at=? WHERE slot_id=?').bind(previous.version_id, now, slotId),
    auditStatement(env, actor, 'IMAGE_ROLLBACK', 'image_slot', slotId, { from: current.active_version_id, to: previous.version_id }),
  ]);
  return json({ ok: true, active_version_id: previous.version_id });
}

async function adminNotices(env) {
  const rows = await env.DB.prepare(`
    SELECT id, slug, title, body, status, is_pinned, cover_key, publish_at, published_at,
           created_by, updated_by, created_at, updated_at
    FROM cms_prime_notices ORDER BY updated_at DESC, id DESC
  `).all();
  return json({ ok: true, notices: (rows.results || []).map((n) => ({ ...n, cover_url: n.cover_key ? `/api/cms/media/${encodeURIComponent(n.cover_key)}` : null })) });
}

async function createNotice(request, env, actor) {
  const input = sanitizeNoticeInput(await request.json());
  if (!input.ok) return json({ ok: false, error: input.error, message: input.message }, 400);
  const slug = `${slugify(input.value.title)}-${Date.now().toString(36)}`;
  const now = new Date().toISOString();
  const status = normalizeNoticeStatus(input.value.status, input.value.publish_at);
  const publishedAt = status === 'published' ? now : null;
  const result = await env.DB.prepare(`
    INSERT INTO cms_prime_notices (slug,title,body,status,is_pinned,publish_at,published_at,created_by,updated_by,created_at,updated_at)
    VALUES (?,?,?,?,?,?,?,?,?,?,?) RETURNING id
  `).bind(slug, input.value.title, input.value.body, status, input.value.is_pinned ? 1 : 0, input.value.publish_at, publishedAt, actor, actor, now, now).first();
  await env.DB.batch([
    saveRevisionStatement(env, result.id, input.value.title, input.value.body, status, input.value.is_pinned ? 1 : 0, null, input.value.publish_at, actor),
    auditStatement(env, actor, 'NOTICE_CREATE', 'notice', String(result.id), { status }),
  ]);
  return json({ ok: true, id: result.id, slug, status }, 201);
}

async function updateNotice(request, env, actor, id) {
  const existing = await env.DB.prepare('SELECT * FROM cms_prime_notices WHERE id=?').bind(id).first();
  if (!existing) return json({ ok: false, error: 'NOTICE_NOT_FOUND' }, 404);
  const input = sanitizeNoticeInput(await request.json());
  if (!input.ok) return json({ ok: false, error: input.error, message: input.message }, 400);
  const status = normalizeNoticeStatus(input.value.status, input.value.publish_at);
  const now = new Date().toISOString();
  const publishedAt = status === 'published' ? (existing.published_at || now) : existing.published_at;
  await env.DB.batch([
    env.DB.prepare(`
      UPDATE cms_prime_notices SET title=?, body=?, status=?, is_pinned=?, publish_at=?, published_at=?, updated_by=?, updated_at=?,
        deleted_at=CASE WHEN ?='deleted' THEN ? ELSE NULL END
      WHERE id=?
    `).bind(input.value.title, input.value.body, status, input.value.is_pinned ? 1 : 0, input.value.publish_at, publishedAt, actor, now, status, now, id),
    saveRevisionStatement(env, id, input.value.title, input.value.body, status, input.value.is_pinned ? 1 : 0, existing.cover_key, input.value.publish_at, actor),
    auditStatement(env, actor, 'NOTICE_UPDATE', 'notice', String(id), { status }),
  ]);
  return json({ ok: true, id, status });
}

async function uploadNoticeCover(request, env, actor, id) {
  const notice = await env.DB.prepare('SELECT * FROM cms_prime_notices WHERE id=?').bind(id).first();
  if (!notice) return json({ ok: false, error: 'NOTICE_NOT_FOUND' }, 404);
  const form = await request.formData();
  const original = form.get('original');
  const processed = form.get('processed');
  if (!(original instanceof File) || !(processed instanceof File)) return json({ ok: false, error: 'IMAGE_FILES_REQUIRED' }, 400);
  if (original.size > MAX_ORIGINAL_BYTES || processed.size > MAX_PROCESSED_BYTES) return json({ ok: false, error: 'IMAGE_TOO_LARGE' }, 413);
  const originalBytes = new Uint8Array(await original.arrayBuffer());
  const processedBytes = new Uint8Array(await processed.arrayBuffer());
  const originalDimensions = readImageDimensions(original.type, originalBytes);
  const processedDimensions = readImageDimensions(processed.type, processedBytes);
  if (!originalDimensions || !processedDimensions) return json({ ok: false, error: 'UNSUPPORTED_IMAGE' }, 415);
  if (Math.max(originalDimensions.width, originalDimensions.height) < 800) return json({ ok: false, error: 'IMAGE_WIDTH_TOO_SMALL', min_width: 800 }, 422);
  const ratioError = Math.abs((processedDimensions.width / processedDimensions.height) - (16 / 9)) / (16 / 9);
  if (ratioError > 0.08) return json({ ok: false, error: 'IMAGE_ASPECT_MISMATCH', expected: 16 / 9 }, 422);
  const versionId = crypto.randomUUID();
  const originalKey = `notices/${id}/${versionId}/original.${mimeExtension(original.type)}`;
  const coverKey = `notices/${id}/${versionId}/cover.${mimeExtension(processed.type)}`;
  await Promise.all([
    env.MEDIA_BUCKET.put(originalKey, originalBytes, { httpMetadata: { contentType: original.type, cacheControl: 'private, max-age=0' }, customMetadata: { noticeId: String(id), versionId, kind: 'original' } }),
    env.MEDIA_BUCKET.put(coverKey, processedBytes, { httpMetadata: { contentType: processed.type, cacheControl: 'public, max-age=31536000, immutable' }, customMetadata: { noticeId: String(id), versionId, kind: 'cover' } }),
  ]);
  const now = new Date().toISOString();
  try {
    await env.DB.batch([
      env.DB.prepare('UPDATE cms_prime_notices SET cover_key=?, updated_by=?, updated_at=? WHERE id=?').bind(coverKey, actor, now, id),
      saveRevisionStatement(env, id, notice.title, notice.body, notice.status, notice.is_pinned, coverKey, notice.publish_at, actor),
      auditStatement(env, actor, 'NOTICE_COVER_UPLOAD', 'notice', String(id), { cover_key: coverKey, width: processedDimensions.width, height: processedDimensions.height }),
    ]);
  } catch (error) {
    await Promise.allSettled([env.MEDIA_BUCKET.delete(originalKey), env.MEDIA_BUCKET.delete(coverKey)]);
    throw error;
  }
  return json({ ok: true, id, cover_url: `/api/cms/media/${encodeURIComponent(coverKey)}` });
}

async function setNoticeStatus(env, actor, id, requestedStatus) {
  if (!NOTICE_STATUS.has(requestedStatus)) return json({ ok: false, error: 'INVALID_NOTICE_STATUS' }, 400);
  const notice = await env.DB.prepare('SELECT * FROM cms_prime_notices WHERE id=?').bind(id).first();
  if (!notice) return json({ ok: false, error: 'NOTICE_NOT_FOUND' }, 404);
  const now = new Date().toISOString();
  const publishedAt = requestedStatus === 'published' ? (notice.published_at || now) : notice.published_at;
  await env.DB.batch([
    env.DB.prepare(`
      UPDATE cms_prime_notices SET status=?, published_at=?, updated_by=?, updated_at=?,
        deleted_at=CASE WHEN ?='deleted' THEN ? ELSE NULL END
      WHERE id=?
    `).bind(requestedStatus, publishedAt, actor, now, requestedStatus, now, id),
    saveRevisionStatement(env, id, notice.title, notice.body, requestedStatus, notice.is_pinned, notice.cover_key, notice.publish_at, actor),
    auditStatement(env, actor, `NOTICE_${requestedStatus.toUpperCase()}`, 'notice', String(id), {}),
  ]);
  return json({ ok: true, id, status: requestedStatus });
}

export function sanitizeNoticeInput(raw) {
  const title = String(raw?.title || '').replace(/[\u0000-\u001f\u007f]/g, ' ').replace(/\s+/g, ' ').trim();
  const body = String(raw?.body || '').replace(/\r\n/g, '\n').replace(/\u0000/g, '').trim();
  const status = String(raw?.status || 'draft');
  const publishAt = raw?.publish_at ? new Date(raw.publish_at) : null;
  if (!title || title.length > 120) return { ok: false, error: 'INVALID_TITLE', message: '제목은 1~120자로 입력해 주세요.' };
  if (!body || body.length > 20000) return { ok: false, error: 'INVALID_BODY', message: '본문은 1~20,000자로 입력해 주세요.' };
  if (!NOTICE_STATUS.has(status)) return { ok: false, error: 'INVALID_STATUS', message: '공지 상태가 올바르지 않습니다.' };
  if (publishAt && Number.isNaN(publishAt.getTime())) return { ok: false, error: 'INVALID_PUBLISH_AT', message: '예약 시간이 올바르지 않습니다.' };
  return { ok: true, value: { title, body, status, is_pinned: Boolean(raw?.is_pinned), publish_at: publishAt ? publishAt.toISOString() : null } };
}

function normalizeNoticeStatus(status, publishAt) {
  if (publishAt && new Date(publishAt).getTime() > Date.now() && status === 'published') return 'scheduled';
  return status;
}

export function slugify(value) {
  const normalized = String(value || '').normalize('NFKC').toLowerCase().replace(/[^a-z0-9가-힣]+/g, '-').replace(/^-+|-+$/g, '');
  return normalized.slice(0, 60) || 'notice';
}

export function isSupportedImage(mime, bytes) {
  if (!ALLOWED_MIME.has(mime) || !(bytes instanceof Uint8Array) || bytes.length < 12) return false;
  if (mime === 'image/jpeg') return bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
  if (mime === 'image/png') return bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47;
  if (mime === 'image/webp') return ascii(bytes, 0, 4) === 'RIFF' && ascii(bytes, 8, 12) === 'WEBP';
  return false;
}


export function readImageDimensions(mime, bytes) {
  if (!isSupportedImage(mime, bytes)) return null;
  if (mime === 'image/png' && bytes.length >= 24) {
    return { width: readU32BE(bytes, 16), height: readU32BE(bytes, 20) };
  }
  if (mime === 'image/jpeg') {
    let offset = 2;
    const sof = new Set([0xc0,0xc1,0xc2,0xc3,0xc5,0xc6,0xc7,0xc9,0xca,0xcb,0xcd,0xce,0xcf]);
    while (offset + 9 < bytes.length) {
      if (bytes[offset] !== 0xff) { offset += 1; continue; }
      const marker = bytes[offset + 1];
      if (sof.has(marker)) {
        const height = (bytes[offset + 5] << 8) | bytes[offset + 6];
        const width = (bytes[offset + 7] << 8) | bytes[offset + 8];
        return width > 0 && height > 0 ? { width, height } : null;
      }
      if (marker === 0xd8 || marker === 0xd9) { offset += 2; continue; }
      const length = (bytes[offset + 2] << 8) | bytes[offset + 3];
      if (length < 2) return null;
      offset += 2 + length;
    }
    return null;
  }
  if (mime === 'image/webp' && bytes.length >= 30) {
    const type = ascii(bytes, 12, 16);
    if (type === 'VP8X') return { width: 1 + readU24LE(bytes, 24), height: 1 + readU24LE(bytes, 27) };
    if (type === 'VP8 ' && bytes.length >= 30 && bytes[23] === 0x9d && bytes[24] === 0x01 && bytes[25] === 0x2a) {
      return { width: (bytes[26] | (bytes[27] << 8)) & 0x3fff, height: (bytes[28] | (bytes[29] << 8)) & 0x3fff };
    }
    if (type === 'VP8L' && bytes.length >= 25 && bytes[20] === 0x2f) {
      const b1=bytes[21], b2=bytes[22], b3=bytes[23], b4=bytes[24];
      return { width: 1 + (((b2 & 0x3f) << 8) | b1), height: 1 + (((b4 & 0x0f) << 10) | (b3 << 2) | ((b2 & 0xc0) >> 6)) };
    }
  }
  return null;
}

function readU32BE(bytes, offset) { return ((bytes[offset] << 24) | (bytes[offset+1] << 16) | (bytes[offset+2] << 8) | bytes[offset+3]) >>> 0; }
function readU24LE(bytes, offset) { return bytes[offset] | (bytes[offset+1] << 8) | (bytes[offset+2] << 16); }

function ascii(bytes, start, end) { return String.fromCharCode(...bytes.slice(start, end)); }
function mimeExtension(mime) { return mime === 'image/png' ? 'png' : mime === 'image/webp' ? 'webp' : 'jpg'; }
function clampNumber(value, min, max, fallback) { const n = Number(value); return Number.isFinite(n) ? Math.min(max, Math.max(min, n)) : fallback; }
function auditStatement(env, actor, action, entityType, entityId, detail) {
  return env.DB.prepare('INSERT INTO audit_logs (audit_id,actor,action,entity_type,entity_id,detail_json) VALUES (?,?,?,?,?,?)')
    .bind(crypto.randomUUID(), actor, action, entityType, entityId, JSON.stringify(detail || {}));
}
function saveRevisionStatement(env, id, title, body, status, isPinned, coverKey, publishAt, actor) {
  return env.DB.prepare(`
    INSERT INTO notice_revisions (revision_id,notice_id,title,body,status,is_pinned,cover_key,publish_at,changed_by)
    VALUES (?,?,?,?,?,?,?,?,?)
  `).bind(crypto.randomUUID(), id, title, body, status, isPinned, coverKey, publishAt, actor);
}

function json(payload, status = 200, publicMaxAge = 0) {
  const headers = new Headers(JSON_HEADERS);
  if (publicMaxAge > 0) headers.set('cache-control', `public, max-age=${publicMaxAge}, stale-while-revalidate=300`);
  return new Response(JSON.stringify(payload), { status, headers });
}

async function requireAdmin(request, env) {
  const devToken = request.headers.get('x-dgtc-dev-admin');
  if (env.DGTC_DEV_ADMIN_TOKEN && devToken && timingSafeEqual(devToken, env.DGTC_DEV_ADMIN_TOKEN)) {
    return { ok: true, actor: 'local-dev@dgtc' };
  }
  const jwt = request.headers.get('cf-access-jwt-assertion');
  if (!jwt) return { ok: false, response: json({ ok: false, error: 'ADMIN_AUTH_REQUIRED' }, 401) };
  try {
    const payload = await verifyAccessJwt(jwt, env);
    return { ok: true, actor: payload.email || payload.sub || 'cloudflare-access-user' };
  } catch (error) {
    console.warn('DGTC_ACCESS_DENY', error?.message || error);
    return { ok: false, response: json({ ok: false, error: 'ADMIN_AUTH_INVALID' }, 403) };
  }
}

export async function verifyAccessJwt(jwt, env, fetchImpl = fetch) {
  if (!env.CF_ACCESS_TEAM_DOMAIN || !env.CF_ACCESS_AUD) throw new Error('Access environment is not configured');
  const parts = String(jwt).split('.');
  if (parts.length !== 3) throw new Error('Malformed JWT');
  const header = JSON.parse(new TextDecoder().decode(base64UrlDecode(parts[0])));
  const payload = JSON.parse(new TextDecoder().decode(base64UrlDecode(parts[1])));
  const teamDomain = String(env.CF_ACCESS_TEAM_DOMAIN).replace(/^https?:\/\//, '').replace(/\/$/, '');
  if (payload.iss !== `https://${teamDomain}`) throw new Error('Invalid issuer');
  if (!payload.exp || payload.exp * 1000 <= Date.now()) throw new Error('Expired JWT');
  if (payload.nbf && payload.nbf * 1000 > Date.now()) throw new Error('JWT not active');
  const audiences = Array.isArray(payload.aud) ? payload.aud : [payload.aud];
  if (!audiences.includes(env.CF_ACCESS_AUD)) throw new Error('Invalid audience');
  const keys = await loadAccessKeys(teamDomain, fetchImpl);
  const jwk = keys.find((key) => key.kid === header.kid);
  if (!jwk) throw new Error('Unknown signing key');
  const publicKey = await crypto.subtle.importKey('jwk', jwk, { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' }, false, ['verify']);
  const signed = new TextEncoder().encode(`${parts[0]}.${parts[1]}`);
  const valid = await crypto.subtle.verify('RSASSA-PKCS1-v1_5', publicKey, base64UrlDecode(parts[2]), signed);
  if (!valid) throw new Error('Invalid signature');
  return payload;
}

async function loadAccessKeys(teamDomain, fetchImpl) {
  if (accessKeyCache.expiresAt > Date.now() && accessKeyCache.keys.length) return accessKeyCache.keys;
  const domain = String(teamDomain).replace(/^https?:\/\//, '').replace(/\/$/, '');
  const response = await fetchImpl(`https://${domain}/cdn-cgi/access/certs`);
  if (!response.ok) throw new Error('Unable to load Access keys');
  const data = await response.json();
  accessKeyCache = { expiresAt: Date.now() + 60 * 60 * 1000, keys: data.keys || [] };
  return accessKeyCache.keys;
}

function base64UrlDecode(value) {
  const normalized = value.replace(/-/g, '+').replace(/_/g, '/').padEnd(Math.ceil(value.length / 4) * 4, '=');
  const binary = atob(normalized);
  return Uint8Array.from(binary, (c) => c.charCodeAt(0));
}

function timingSafeEqual(a, b) {
  const left = new TextEncoder().encode(String(a));
  const right = new TextEncoder().encode(String(b));
  if (left.length !== right.length) return false;
  let diff = 0;
  for (let i = 0; i < left.length; i += 1) diff |= left[i] ^ right[i];
  return diff === 0;
}