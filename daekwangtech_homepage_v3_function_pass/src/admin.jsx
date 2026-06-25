import React, { useEffect, useId, useMemo, useReducer, useState } from "react";
import "./admin-tokens.css";
import { cloneContent, defaultAdminContent, loadStoredContent, saveStoredContent } from "./adminContentSeed.js";
import { getStoredAdminToken, loadAdminContent, publishAdminContent, saveAdminContent, setStoredAdminToken, uploadAdminMedia } from "./cmsClient.js";
import { initialPanelState, panelReducer } from "./panelState.js";

const panels = [
  ["dashboard", "상태"],
  ["homepage", "홈페이지"],
  ["pages", "페이지"],
  ["notices", "공지사항"],
  ["posts", "게시글"],
  ["media", "이미지"],
  ["export", "JSON"],
];

function Field({ label, value, onChange, textarea = false, full = false, type = "text" }) {
  const id = useId();
  const Input = textarea ? "textarea" : "input";
  return (
    <div className={full ? "admin-field full" : "admin-field"}>
      <label htmlFor={id}>{label}</label>
      <Input id={id} type={type} value={value ?? ""} onChange={(event) => onChange(event.target.value)} />
    </div>
  );
}

function PageEditor({ page, onChange }) {
  if (!page) return null;
  const set = (key) => (value) => onChange({ ...page, [key]: value });
  return (
    <div className="admin-field-grid">
      <Field label="메뉴명" value={page.label} onChange={set("label")} />
      <Field label="페이지 경로" value={page.href} onChange={set("href")} />
      <Field label="SEO 제목" value={page.seoTitle} onChange={set("seoTitle")} full />
      <Field label="SEO 설명" value={page.description} onChange={set("description")} textarea full />
      <Field label="Eyebrow" value={page.eyebrow} onChange={set("eyebrow")} />
      <Field label="히어로 제목" value={page.title} onChange={set("title")} />
      <Field label="히어로 헤드라인" value={page.headline} onChange={set("headline")} textarea full />
      <Field label="본문 요약" value={page.summary} onChange={set("summary")} textarea full />
      <Field label="히어로 이미지 경로" value={page.heroImage} onChange={set("heroImage")} full />
      <div className="admin-field">
        <label>상태</label>
        <select value={page.status} onChange={(event) => set("status")(event.target.value)}>
          <option value="published">published</option>
          <option value="draft">draft</option>
          <option value="hidden">hidden</option>
        </select>
      </div>
    </div>
  );
}

function PostEditor({ post, onChange, onDelete }) {
  if (!post) return <p className="admin-muted">왼쪽에서 게시글을 선택하거나 새 게시글을 추가하세요.</p>;
  const set = (key) => (value) => onChange({ ...post, [key]: value });
  return (
    <div className="admin-field-grid">
      <Field label="카테고리" value={post.category} onChange={set("category")} />
      <Field label="발행일" value={post.publishedAt} onChange={set("publishedAt")} />
      <Field label="제목" value={post.title} onChange={set("title")} full />
      <Field label="요약" value={post.summary} onChange={set("summary")} textarea full />
      <Field label="본문" value={post.body} onChange={set("body")} textarea full />
      <div className="admin-field">
        <label>상태</label>
        <select value={post.status} onChange={(event) => set("status")(event.target.value)}>
          <option value="draft">draft</option>
          <option value="published">published</option>
          <option value="hidden">hidden</option>
        </select>
      </div>
      <div className="admin-field">
        <label>고정 표시</label>
        <select value={post.pinned ? "yes" : "no"} onChange={(event) => set("pinned")(event.target.value === "yes")}>
          <option value="yes">yes</option>
          <option value="no">no</option>
        </select>
      </div>
      <div className="admin-field full">
        <button className="admin-button danger" type="button" onClick={onDelete}>
          게시글 삭제
        </button>
      </div>
    </div>
  );
}

function MediaEditor({ media, onChange, onDelete, onUpload, uploading }) {
  const uploadId = useId();
  if (!media) return <p className="admin-muted">왼쪽에서 이미지를 선택하거나 새 이미지를 추가하세요.</p>;
  const set = (key) => (value) => onChange({ ...media, [key]: value });
  return (
    <div className="admin-field-grid">
      <Field label="이미지명" value={media.label} onChange={set("label")} />
      <Field label="사용 위치" value={media.usage} onChange={set("usage")} />
      <Field label="파일 경로" value={media.src} onChange={set("src")} full />
      <Field label="대체 텍스트" value={media.alt} onChange={set("alt")} full />
      <div className="admin-field">
        <label>상태</label>
        <select value={media.status} onChange={(event) => set("status")(event.target.value)}>
          <option value="active">active</option>
          <option value="draft">draft</option>
          <option value="hidden">hidden</option>
        </select>
      </div>
      <div className="admin-field full">
        <div className="admin-media-preview">
          <img src={media.src} alt={media.alt || media.label} />
          <div>
            <strong>{media.label}</strong>
            <span>{media.src}</span>
          </div>
        </div>
      </div>
      <div className="admin-field full">
        <label htmlFor={uploadId}>이미지 업로드</label>
        <input
          id={uploadId}
          type="file"
          accept="image/*"
          disabled={uploading}
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (file) onUpload(file);
            event.target.value = "";
          }}
        />
        <p className="admin-muted">운영 토큰이 있어야 R2 저장소로 업로드됩니다.</p>
      </div>
      <div className="admin-field full">
        <button className="admin-button danger" type="button" onClick={onDelete}>
          이미지 항목 삭제
        </button>
      </div>
    </div>
  );
}

function PreviewCard({ page }) {
  return (
    <div className="admin-preview-card">
      <div className="admin-preview-hero">
        <span>{page?.eyebrow}</span>
        <h3>{page?.headline}</h3>
        <p>{page?.summary}</p>
      </div>
    </div>
  );
}

export function AdminApp({ content: controlledContent, onContentChange } = {}) {
  const [machine, dispatch] = useReducer(panelReducer, initialPanelState);
  const [localContent, setLocalContent] = useState(() => loadStoredContent());
  const content = controlledContent ?? localContent;
  const setContent = onContentChange ?? setLocalContent;
  const [jsonText, setJsonText] = useState("");
  const [adminToken, setAdminToken] = useState(() => getStoredAdminToken());
  const [cloud, setCloud] = useState({ status: "local", message: "운영 저장소 미연결" });
  const [busy, setBusy] = useState("");

  useEffect(() => {
    dispatch({ type: "READY" });
  }, []);

  const selectedPage = useMemo(
    () => content.pages.find((page) => page.id === machine.selectedPageId) ?? content.pages[0],
    [content.pages, machine.selectedPageId],
  );
  const homePage = content.pages.find((page) => page.id === "index") ?? content.pages[0];
  const selectedPost = content.posts.find((post) => post.id === machine.selectedPostId) ?? content.posts[0];
  const notices = useMemo(() => content.posts.filter((post) => post.category === "공지" || post.category === "공지사항"), [content.posts]);
  const selectedNotice = notices.find((post) => post.id === machine.selectedNoticeId) ?? notices[0];
  const selectedMedia = content.media.find((media) => media.id === machine.selectedMediaId) ?? content.media[0];

  const markEdit = (next, notice) => {
    setContent(next);
    dispatch({ type: "EDIT", notice });
  };

  const updatePage = (page) => {
    markEdit(
      {
        ...content,
        pages: content.pages.map((item) => (item.id === page.id ? page : item)),
      },
      "페이지 콘텐츠를 수정했습니다.",
    );
  };

  const updateCompany = (key, value) => {
    markEdit({ ...content, company: { ...content.company, [key]: value } }, "회사 정보를 수정했습니다.");
  };

  const updatePost = (post) => {
    markEdit(
      {
        ...content,
        posts: content.posts.map((item) => (item.id === post.id ? post : item)),
      },
      "게시글을 수정했습니다.",
    );
  };

  const updateMedia = (media) => {
    markEdit(
      {
        ...content,
        media: content.media.map((item) => (item.id === media.id ? media : item)),
      },
      "이미지 정보를 수정했습니다.",
    );
  };

  const addPost = () => {
    const id = `post-${Date.now()}`;
    const post = {
      id,
      status: "draft",
      pinned: false,
      category: "공지",
      title: "새 게시글",
      summary: "",
      body: "",
      publishedAt: new Date().toISOString().slice(0, 10),
    };
    markEdit({ ...content, posts: [post, ...content.posts] }, "새 게시글을 추가했습니다.");
    dispatch({ type: "SELECT_POST", postId: id });
  };

  const addNotice = () => {
    const id = `notice-${Date.now()}`;
    const post = {
      id,
      status: "draft",
      pinned: true,
      category: "공지",
      title: "새 공지사항",
      summary: "",
      body: "",
      publishedAt: new Date().toISOString().slice(0, 10),
    };
    markEdit({ ...content, posts: [post, ...content.posts] }, "새 공지사항을 추가했습니다.");
    dispatch({ type: "SELECT_NOTICE", postId: id });
  };

  const addMedia = () => {
    const id = `media-${Date.now()}`;
    const media = {
      id,
      label: "새 이미지",
      src: "assets/image-fallback.svg",
      alt: "",
      usage: "미지정",
      status: "draft",
    };
    markEdit({ ...content, media: [media, ...content.media] }, "새 이미지 항목을 추가했습니다.");
    dispatch({ type: "SELECT_MEDIA", mediaId: id });
  };

  const deletePost = (id) => {
    markEdit({ ...content, posts: content.posts.filter((post) => post.id !== id) }, "게시글을 삭제했습니다.");
    dispatch({ type: "SELECT_POST", postId: content.posts.find((post) => post.id !== id)?.id ?? null });
  };

  const deleteNotice = (id) => {
    markEdit({ ...content, posts: content.posts.filter((post) => post.id !== id) }, "공지사항을 삭제했습니다.");
    dispatch({ type: "SELECT_NOTICE", postId: notices.find((post) => post.id !== id)?.id ?? null });
  };

  const deleteMedia = (id) => {
    markEdit({ ...content, media: content.media.filter((media) => media.id !== id) }, "이미지 항목을 삭제했습니다.");
    dispatch({ type: "SELECT_MEDIA", mediaId: content.media.find((media) => media.id !== id)?.id ?? null });
  };

  const save = () => {
    const saved = saveStoredContent(content);
    setContent(saved);
    setJsonText(JSON.stringify(saved, null, 2));
    dispatch({ type: "SAVE" });
  };

  const preview = () => {
    const saved = saveStoredContent(content);
    setContent(saved);
    dispatch({ type: "PREVIEW" });
    window.location.hash = selectedPage?.id === "index" ? "#/" : `#/${selectedPage?.id ?? ""}`;
  };

  const reset = () => {
    const next = cloneContent(defaultAdminContent);
    setContent(next);
    window.localStorage.removeItem("daekwang.admin.content.v1");
    setJsonText(JSON.stringify(next, null, 2));
    dispatch({ type: "RESET" });
  };

  const exportJson = () => {
    setJsonText(JSON.stringify(content, null, 2));
    dispatch({ type: "EXPORT" });
  };

  const importJson = () => {
    try {
      const parsed = JSON.parse(jsonText);
      if (!Array.isArray(parsed.pages) || !Array.isArray(parsed.posts)) throw new Error("pages/posts 배열이 필요합니다.");
      const imported = saveStoredContent(parsed);
      setContent(imported);
      setJsonText(JSON.stringify(imported, null, 2));
      dispatch({ type: "IMPORT" });
    } catch (error) {
      dispatch({ type: "ERROR", error: error instanceof Error ? error.message : "JSON 형식 오류" });
    }
  };

  const setCloudError = (error) => {
    const message = error instanceof Error ? error.message : "운영 저장소 작업 실패";
    setCloud({ status: "error", message });
    dispatch({ type: "ERROR", error: message });
  };

  const updateToken = (value) => {
    setAdminToken(value);
    setStoredAdminToken(value);
    setCloud({ status: value ? "ready" : "local", message: value ? "운영 토큰 입력됨" : "운영 저장소 미연결" });
  };

  const requireToken = () => {
    if (!adminToken) {
      const error = new Error("운영 토큰을 먼저 입력하세요.");
      setCloudError(error);
      throw error;
    }
    return adminToken;
  };

  const syncFromCloud = async () => {
    try {
      setBusy("sync");
      const token = requireToken();
      const result = await loadAdminContent(token);
      setContent(result.content);
      saveStoredContent(result.content);
      setJsonText(JSON.stringify(result.content, null, 2));
      setCloud({ status: "synced", message: `운영 저장소에서 불러옴 · ${result.meta.source ?? "D1"}` });
      dispatch({ type: "SYNC_REMOTE" });
    } catch (error) {
      setCloudError(error);
    } finally {
      setBusy("");
    }
  };

  const saveCloud = async () => {
    try {
      setBusy("save");
      const token = requireToken();
      const localSaved = saveStoredContent(content);
      const result = await saveAdminContent(token, localSaved);
      setContent(result.content);
      setJsonText(JSON.stringify(result.content, null, 2));
      setCloud({ status: "saved", message: "D1 draft 저장 완료" });
      dispatch({ type: "SAVE_REMOTE" });
    } catch (error) {
      setCloudError(error);
    } finally {
      setBusy("");
    }
  };

  const publishCloud = async () => {
    try {
      setBusy("publish");
      const token = requireToken();
      const result = await publishAdminContent(token, content);
      setContent(result.content);
      saveStoredContent(result.content);
      setJsonText(JSON.stringify(result.content, null, 2));
      setCloud({ status: "published", message: "D1 published + KV cache 발행 완료" });
      dispatch({ type: "PUBLISH_REMOTE" });
    } catch (error) {
      setCloudError(error);
    } finally {
      setBusy("");
    }
  };

  const uploadMedia = async (media, file) => {
    try {
      setBusy("upload");
      const token = requireToken();
      const uploaded = await uploadAdminMedia(token, file, media);
      const nextMedia = { ...media, ...uploaded, status: "active" };
      updateMedia(nextMedia);
      setCloud({ status: "uploaded", message: "R2 이미지 업로드 완료" });
    } catch (error) {
      setCloudError(error);
    } finally {
      setBusy("");
    }
  };

  const activeLabel = panels.find(([id]) => id === machine.activePanel)?.[1] ?? "상태";

  return (
    <div
      className="admin-shell"
      style={{
        "--admin-bg": content.tokens.background,
        "--admin-surface": content.tokens.surface,
        "--admin-text": content.tokens.text,
        "--admin-muted": content.tokens.muted,
        "--admin-deep": content.tokens.deep,
        "--admin-accent": content.tokens.accent,
        "--admin-line": content.tokens.line,
        "--admin-radius": content.tokens.radius,
      }}
    >
      <aside className="admin-sidebar">
        <div className="admin-brand">
          <img src="assets/dk-logo.svg" alt="DAEKWANG TECH 로고" />
          <div>
            <strong>관리자 콘솔</strong>
            <span>홈페이지 · 공지 · 이미지 관리</span>
          </div>
        </div>
        <nav className="admin-nav" aria-label="관리자 패널">
          {panels.map(([id, label]) => (
            <button
              key={id}
              type="button"
              data-active={machine.activePanel === id ? "true" : undefined}
              onClick={() => dispatch({ type: "SELECT_PANEL", panel: id, label })}
            >
              <span>{label}</span>
              <small>{id}</small>
            </button>
          ))}
        </nav>
        <div className="admin-side-note">
          이 콘솔은 회사 관리자가 홈페이지 문구, 공지사항, 게시글, 이미지 항목을 관리하는 화면입니다. 현재 저장은 브라우저 초안이며, 운영 저장소 연결 전까지 공개 반영은 JSON export 후 빌드/배포가 필요합니다.
        </div>
      </aside>

      <main className="admin-main">
        <div className="admin-topbar">
          <div>
            <h1>{activeLabel}</h1>
            <p>홈페이지 문구, 페이지 메타, 공지사항, 게시글, 이미지 항목을 한 곳에서 관리합니다.</p>
          </div>
          <div className="admin-actions">
            <button className="admin-button" type="button" onClick={preview}>
              미리보기
            </button>
            <button className="admin-button" type="button" disabled={busy === "sync"} onClick={syncFromCloud}>
              운영 불러오기
            </button>
            <button className="admin-button" type="button" onClick={exportJson}>
              JSON 갱신
            </button>
            <button className="admin-button" type="button" disabled={busy === "save"} onClick={saveCloud}>
              운영 저장
            </button>
            <button className="admin-button publish" type="button" disabled={busy === "publish"} onClick={publishCloud}>
              발행
            </button>
            <button className="admin-button primary" type="button" onClick={save}>
              초안 저장
            </button>
          </div>
        </div>

        <div className="admin-grid">
          <section className="admin-panel">
            {machine.activePanel === "dashboard" ? (
              <>
                <h2>패널 상태머신</h2>
                <p>현재 관리자 UI의 패널 전환, 수정 상태, 저장/미리보기/가져오기 이벤트를 단일 상태머신으로 관리합니다.</p>
                <div className="admin-field-grid">
                  <div className="admin-state">
                    <span>status</span>
                    <strong>{machine.status}</strong>
                  </div>
                  <div className="admin-state">
                    <span>last event</span>
                    <strong>{machine.lastEvent}</strong>
                  </div>
                  <div className="admin-state">
                    <span>dirty</span>
                    <strong>{machine.dirty ? "true" : "false"}</strong>
                  </div>
                  <div className="admin-state">
                    <span>pages / posts</span>
                    <strong>
                      {content.pages.length} / {content.posts.length}
                    </strong>
                  </div>
                  <div className="admin-state">
                    <span>notices / images</span>
                    <strong>
                      {notices.length} / {content.media.length}
                    </strong>
                  </div>
                </div>
                <div className="admin-footnote">PUBLISH HOLD: 서버 API, DB, 인증이 없으므로 배포된 전체 방문자에게 즉시 반영하는 기능은 아직 없습니다.</div>
              </>
            ) : null}

            {machine.activePanel === "homepage" ? (
              <>
                <h2>홈페이지 수정</h2>
                <PageEditor page={homePage} onChange={updatePage} />
                <h2 style={{ marginTop: 24 }}>회사 기본 정보</h2>
                <div className="admin-field-grid">
                  <Field label="회사명" value={content.company.nameKo} onChange={(value) => updateCompany("nameKo", value)} />
                  <Field label="영문명" value={content.company.nameEn} onChange={(value) => updateCompany("nameEn", value)} />
                  <Field label="주소" value={content.company.address} onChange={(value) => updateCompany("address", value)} full />
                  <Field label="전화" value={content.company.tel} onChange={(value) => updateCompany("tel", value)} />
                  <Field label="팩스" value={content.company.fax} onChange={(value) => updateCompany("fax", value)} />
                </div>
              </>
            ) : null}

            {machine.activePanel === "pages" ? (
              <div className="admin-split">
                <div className="admin-list">
                  {content.pages.map((page) => (
                    <button
                      key={page.id}
                      type="button"
                      data-active={selectedPage?.id === page.id ? "true" : undefined}
                      onClick={() => dispatch({ type: "SELECT_PAGE", pageId: page.id })}
                    >
                      <strong>{page.label}</strong>
                      <small>{page.href}</small>
                    </button>
                  ))}
                </div>
                <div>
                  <h2>페이지 콘텐츠</h2>
                  <PageEditor page={selectedPage} onChange={updatePage} />
                </div>
              </div>
            ) : null}

            {machine.activePanel === "posts" ? (
              <div className="admin-split">
                <div>
                  <button className="admin-button primary" type="button" onClick={addPost}>
                    새 게시글
                  </button>
                  <div className="admin-list" style={{ marginTop: 12 }}>
                    {content.posts.map((post) => (
                      <button
                        key={post.id}
                        type="button"
                        data-active={selectedPost?.id === post.id ? "true" : undefined}
                        onClick={() => dispatch({ type: "SELECT_POST", postId: post.id })}
                      >
                        <strong>{post.title}</strong>
                        <small>
                          {post.category} · {post.status}
                        </small>
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <h2>게시글 수정</h2>
                  <PostEditor post={selectedPost} onChange={updatePost} onDelete={() => selectedPost && deletePost(selectedPost.id)} />
                </div>
              </div>
            ) : null}

            {machine.activePanel === "notices" ? (
              <div className="admin-split">
                <div>
                  <button className="admin-button primary" type="button" onClick={addNotice}>
                    새 공지사항
                  </button>
                  <div className="admin-list" style={{ marginTop: 12 }}>
                    {notices.map((post) => (
                      <button
                        key={post.id}
                        type="button"
                        data-active={selectedNotice?.id === post.id ? "true" : undefined}
                        onClick={() => dispatch({ type: "SELECT_NOTICE", postId: post.id })}
                      >
                        <strong>{post.title}</strong>
                        <small>
                          {post.publishedAt} · {post.status}
                        </small>
                      </button>
                    ))}
                    {!notices.length ? <p className="admin-muted">등록된 공지사항이 없습니다.</p> : null}
                  </div>
                </div>
                <div>
                  <h2>공지사항 수정</h2>
                  <PostEditor post={selectedNotice} onChange={updatePost} onDelete={() => selectedNotice && deleteNotice(selectedNotice.id)} />
                </div>
              </div>
            ) : null}

            {machine.activePanel === "media" ? (
              <div className="admin-split">
                <div>
                  <button className="admin-button primary" type="button" onClick={addMedia}>
                    새 이미지 항목
                  </button>
                  <div className="admin-list admin-media-list" style={{ marginTop: 12 }}>
                    {content.media.map((media) => (
                      <button
                        key={media.id}
                        type="button"
                        data-active={selectedMedia?.id === media.id ? "true" : undefined}
                        onClick={() => dispatch({ type: "SELECT_MEDIA", mediaId: media.id })}
                      >
                        <img src={media.src} alt="" />
                        <strong>{media.label}</strong>
                        <small>
                          {media.usage} · {media.status}
                        </small>
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <h2>이미지 항목 수정</h2>
                  <MediaEditor
                    media={selectedMedia}
                    onChange={updateMedia}
                    onDelete={() => selectedMedia && deleteMedia(selectedMedia.id)}
                    onUpload={(file) => selectedMedia && uploadMedia(selectedMedia, file)}
                    uploading={busy === "upload"}
                  />
                </div>
              </div>
            ) : null}

            {machine.activePanel === "export" ? (
              <>
                <h2>JSON 가져오기 / 내보내기</h2>
                <textarea className="admin-json" value={jsonText || JSON.stringify(content, null, 2)} onChange={(event) => setJsonText(event.target.value)} />
                <div className="admin-actions" style={{ justifyContent: "flex-start", marginTop: 12 }}>
                  <button className="admin-button" type="button" onClick={exportJson}>
                    현재 초안으로 갱신
                  </button>
                  <button className="admin-button primary" type="button" onClick={importJson}>
                    JSON 가져오기
                  </button>
                  <button className="admin-button danger" type="button" onClick={reset}>
                    기본값으로 초기화
                  </button>
                </div>
              </>
            ) : null}
          </section>

          <aside className="admin-status">
            <div className="admin-card">
              <h2>운영 저장소</h2>
              <div className="admin-field">
                <label>관리자 토큰</label>
                <input
                  type="password"
                  value={adminToken}
                  placeholder="운영 토큰 입력"
                  onChange={(event) => updateToken(event.target.value)}
                />
              </div>
              <div className="admin-state cloud-state" data-status={cloud.status}>
                <span>{cloud.message}</span>
                <strong>{cloud.status}</strong>
              </div>
            </div>
            <div className="admin-card">
              <h2>상태머신</h2>
              <div className="admin-state">
                <span>{machine.notice}</span>
                <strong>{machine.status}</strong>
              </div>
              {machine.error ? <p style={{ color: "var(--admin-danger)" }}>{machine.error}</p> : null}
            </div>
            <div className="admin-card admin-preview">
              <h2>페이지 미리보기</h2>
              <PreviewCard page={selectedPage} />
              <p className="admin-muted">미리보기 버튼은 초안을 저장한 뒤 같은 React 라우트로 이동합니다.</p>
            </div>
            <div className="admin-card">
              <h2>공지/게시글 상태</h2>
              {content.posts.map((post) => (
                <div className="admin-post-row" key={post.id}>
                  <span>{post.title}</span>
                  <small>{post.status}</small>
                </div>
              ))}
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
