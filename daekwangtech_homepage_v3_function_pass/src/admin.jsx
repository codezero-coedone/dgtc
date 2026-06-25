import React, { useEffect, useId, useMemo, useReducer, useState } from "react";
import "./admin-tokens.css";
import { cloneContent, defaultAdminContent, loadStoredContent, saveStoredContent } from "./adminContentSeed.js";
import { getStoredAdminToken, loadAdminContent, publishAdminContent, saveAdminContent, setStoredAdminToken, uploadAdminMedia } from "./cmsClient.js";
import { initialPanelState, panelReducer } from "./panelState.js";

const panels = [
  ["dashboard", "대시보드"],
  ["homepage", "홈 화면"],
  ["pages", "페이지"],
  ["notices", "공지사항"],
  ["posts", "게시글"],
  ["media", "이미지"],
];

const statusLabels = {
  published: "공개",
  draft: "임시저장",
  hidden: "숨김",
  active: "사용 중",
};

function statusLabel(value) {
  return statusLabels[value] ?? value;
}

const saveStateLabels = {
  local: "대기",
  ready: "준비됨",
  synced: "불러옴",
  saved: "저장됨",
  published: "발행됨",
  uploaded: "업로드됨",
  error: "확인 필요",
};

const workStateLabels = {
  booting: "준비 중",
  ready: "준비됨",
  editing: "수정 중",
  dirty: "수정됨",
  previewing: "미리보기",
  imported: "불러옴",
  exported: "내보냄",
  saved: "저장됨",
  error: "확인 필요",
};

function saveStateLabel(value) {
  return saveStateLabels[value] ?? "대기";
}

function workStateLabel(value) {
  return workStateLabels[value] ?? "준비됨";
}

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
      <Field label="화면 주소" value={page.href} onChange={set("href")} />
      <Field label="검색 제목" value={page.seoTitle} onChange={set("seoTitle")} full />
      <Field label="검색 설명" value={page.description} onChange={set("description")} textarea full />
      <Field label="상단 작은 문구" value={page.eyebrow} onChange={set("eyebrow")} />
      <Field label="대표 화면명" value={page.title} onChange={set("title")} />
      <Field label="대표 제목" value={page.headline} onChange={set("headline")} textarea full />
      <Field label="본문 요약" value={page.summary} onChange={set("summary")} textarea full />
      <Field label="대표 이미지 주소" value={page.heroImage} onChange={set("heroImage")} full />
      <div className="admin-field">
        <label>상태</label>
        <select value={page.status} onChange={(event) => set("status")(event.target.value)}>
          <option value="published">공개</option>
          <option value="draft">임시저장</option>
          <option value="hidden">숨김</option>
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
          <option value="draft">임시저장</option>
          <option value="published">공개</option>
          <option value="hidden">숨김</option>
        </select>
      </div>
      <div className="admin-field">
        <label>상단 고정</label>
        <select value={post.pinned ? "yes" : "no"} onChange={(event) => set("pinned")(event.target.value === "yes")}>
          <option value="yes">고정</option>
          <option value="no">일반</option>
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
      <Field label="이미지 주소" value={media.src} onChange={set("src")} full />
      <Field label="대체 텍스트" value={media.alt} onChange={set("alt")} full />
      <div className="admin-field">
        <label>상태</label>
        <select value={media.status} onChange={(event) => set("status")(event.target.value)}>
          <option value="active">사용 중</option>
          <option value="draft">임시저장</option>
          <option value="hidden">숨김</option>
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
        <p className="admin-muted">관리 비밀번호가 있어야 사이트에 이미지를 올릴 수 있습니다.</p>
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

function EditorWindow({ title, children, onClose }) {
  return (
    <div className="admin-modal-backdrop" role="dialog" aria-modal="true" aria-label={title}>
      <div className="admin-modal">
        <div className="admin-modal-head">
          <div>
            <span>빠른 수정</span>
            <h2>{title}</h2>
          </div>
          <button className="admin-icon-button" type="button" aria-label="편집창 닫기" onClick={onClose}>
            ×
          </button>
        </div>
        <div className="admin-modal-body">{children}</div>
        <div className="admin-modal-foot">
          <button className="admin-button primary" type="button" onClick={onClose}>
            완료
          </button>
        </div>
      </div>
    </div>
  );
}

export function AdminApp({ content: controlledContent, onContentChange } = {}) {
  const [machine, dispatch] = useReducer(panelReducer, initialPanelState);
  const [localContent, setLocalContent] = useState(() => loadStoredContent());
  const content = controlledContent ?? localContent;
  const setContent = onContentChange ?? setLocalContent;
  const [adminToken, setAdminToken] = useState(() => getStoredAdminToken());
  const [cloud, setCloud] = useState({ status: "local", message: "사이트 저장 대기 중" });
  const [busy, setBusy] = useState("");
  const [editor, setEditor] = useState(null);

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
  const editorPage = editor?.type === "page" ? content.pages.find((page) => page.id === editor.id) : null;
  const editorPost = editor?.type === "post" || editor?.type === "notice" ? content.posts.find((post) => post.id === editor.id) : null;
  const editorMedia = editor?.type === "media" ? content.media.find((media) => media.id === editor.id) : null;

  const openPageEditor = (pageId) => {
    dispatch({ type: "SELECT_PAGE", pageId });
    setEditor({ type: "page", id: pageId });
  };

  const openNoticeEditor = (postId) => {
    dispatch({ type: "SELECT_NOTICE", postId });
    setEditor({ type: "notice", id: postId });
  };

  const openPostEditor = (postId) => {
    dispatch({ type: "SELECT_POST", postId });
    setEditor({ type: "post", id: postId });
  };

  const openMediaEditor = (mediaId) => {
    dispatch({ type: "SELECT_MEDIA", mediaId });
    setEditor({ type: "media", id: mediaId });
  };

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
    setEditor({ type: "post", id });
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
    setEditor({ type: "notice", id });
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
    setEditor({ type: "media", id });
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
    dispatch({ type: "RESET" });
  };

  const setCloudError = (error) => {
    const message = error instanceof Error ? error.message : "사이트 저장 작업 실패";
    setCloud({ status: "error", message });
    dispatch({ type: "ERROR", error: message });
  };

  const updateToken = (value) => {
    setAdminToken(value);
    setStoredAdminToken(value);
    setCloud({ status: value ? "ready" : "local", message: value ? "관리 비밀번호 입력됨" : "사이트 저장 대기 중" });
  };

  const requireToken = () => {
    if (!adminToken) {
      const error = new Error("관리 비밀번호를 먼저 입력하세요.");
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
      setCloud({ status: "synced", message: "사이트에 저장된 내용을 불러왔습니다." });
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
      setCloud({ status: "saved", message: "사이트에 저장했습니다." });
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
      setCloud({ status: "published", message: "방문자에게 보이도록 발행했습니다." });
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
      setCloud({ status: "uploaded", message: "이미지를 사이트에 올렸습니다." });
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
            </button>
          ))}
        </nav>
        <div className="admin-side-note">
          홈페이지 문구, 공지사항, 게시글, 이미지를 관리하는 화면입니다. 수정 후 저장하고 발행하면 방문자 화면에 반영됩니다.
        </div>
      </aside>

      <main className="admin-main">
        <div className="admin-topbar">
          <div>
            <h1>{activeLabel}</h1>
            <p>수정할 영역을 선택하면 편집창이 열립니다. 작업이 끝나면 저장 후 발행하세요.</p>
          </div>
          <div className="admin-actions">
            <button className="admin-button" type="button" onClick={preview}>
              사이트 보기
            </button>
            <button className="admin-button" type="button" disabled={busy === "sync"} onClick={syncFromCloud}>
              사이트 내용 불러오기
            </button>
            <button className="admin-button" type="button" disabled={busy === "save"} onClick={saveCloud}>
              사이트에 저장
            </button>
            <button className="admin-button publish" type="button" disabled={busy === "publish"} onClick={publishCloud}>
              발행
            </button>
            <button className="admin-button primary" type="button" onClick={save}>
              임시 저장
            </button>
          </div>
        </div>

        <div className="admin-grid">
          <section className="admin-panel">
            {machine.activePanel === "dashboard" ? (
              <>
                <h2>대시보드</h2>
                <p>자주 수정하는 영역을 바로 선택하세요. 카드나 이미지를 누르면 해당 편집창이 열립니다.</p>
                <div className="admin-dashboard-grid">
                  <button className="admin-dashboard-card wide" type="button" onClick={() => openPageEditor(homePage.id)}>
                    <span>홈 화면</span>
                    <strong>{homePage.headline}</strong>
                    <small>{homePage.summary}</small>
                  </button>
                  <button className="admin-dashboard-card" type="button" onClick={() => dispatch({ type: "SELECT_PANEL", panel: "notices", label: "공지사항" })}>
                    <span>공지사항</span>
                    <strong>{notices.length}개</strong>
                    <small>새 공지 등록과 수정</small>
                  </button>
                  <button className="admin-dashboard-card" type="button" onClick={() => dispatch({ type: "SELECT_PANEL", panel: "posts", label: "게시글" })}>
                    <span>게시글</span>
                    <strong>{content.posts.length}개</strong>
                    <small>소식과 안내글 관리</small>
                  </button>
                  <button className="admin-dashboard-card" type="button" onClick={() => dispatch({ type: "SELECT_PANEL", panel: "pages", label: "페이지" })}>
                    <span>페이지</span>
                    <strong>{content.pages.length}개</strong>
                    <small>회사 소개 화면 관리</small>
                  </button>
                  <button className="admin-dashboard-card" type="button" onClick={() => dispatch({ type: "SELECT_PANEL", panel: "media", label: "이미지" })}>
                    <span>이미지</span>
                    <strong>{content.media.length}개</strong>
                    <small>대표 이미지와 업로드 관리</small>
                  </button>
                </div>

                <h2 style={{ marginTop: 28 }}>섹션 바로 수정</h2>
                <div className="admin-section-picker">
                  {content.pages.map((page) => (
                    <button key={page.id} type="button" onClick={() => openPageEditor(page.id)}>
                      <img src={page.heroImage} alt="" />
                      <span>{page.label}</span>
                      <small>{statusLabel(page.status)}</small>
                    </button>
                  ))}
                </div>

                <h2 style={{ marginTop: 28 }}>이미지 바로 수정</h2>
                <div className="admin-section-picker image-picker">
                  {content.media.map((media) => (
                    <button key={media.id} type="button" onClick={() => openMediaEditor(media.id)}>
                      <img src={media.src} alt="" />
                      <span>{media.label}</span>
                      <small>{media.usage}</small>
                    </button>
                  ))}
                </div>
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
                      onClick={() => openPageEditor(page.id)}
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
                        onClick={() => openPostEditor(post.id)}
                      >
                        <strong>{post.title}</strong>
                        <small>
                          {post.category} · {statusLabel(post.status)}
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
                        onClick={() => openNoticeEditor(post.id)}
                      >
                        <strong>{post.title}</strong>
                        <small>
                          {post.publishedAt} · {statusLabel(post.status)}
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
                        onClick={() => openMediaEditor(media.id)}
                      >
                        <img src={media.src} alt="" />
                        <strong>{media.label}</strong>
                        <small>
                          {media.usage} · {statusLabel(media.status)}
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

          </section>

          <aside className="admin-status">
            <div className="admin-card">
              <h2>사이트 저장</h2>
              <div className="admin-field">
                <label>관리 비밀번호</label>
                <input
                  type="password"
                  value={adminToken}
                  placeholder="관리 비밀번호 입력"
                  onChange={(event) => updateToken(event.target.value)}
                />
              </div>
              <div className="admin-state cloud-state" data-status={cloud.status}>
                <span>{cloud.message}</span>
                <strong>{saveStateLabel(cloud.status)}</strong>
              </div>
            </div>
            <div className="admin-card">
              <h2>작업 상태</h2>
              <div className="admin-state">
                <span>{machine.notice}</span>
                <strong>{workStateLabel(machine.status)}</strong>
              </div>
              {machine.error ? <p style={{ color: "var(--admin-danger)" }}>{machine.error}</p> : null}
            </div>
            <div className="admin-card admin-preview">
              <h2>페이지 미리보기</h2>
              <PreviewCard page={selectedPage} />
              <p className="admin-muted">사이트 보기 버튼을 누르면 선택한 화면으로 이동합니다.</p>
            </div>
            <div className="admin-card">
              <h2>공지/게시글 상태</h2>
              {content.posts.map((post) => (
                <div className="admin-post-row" key={post.id}>
                  <span>{post.title}</span>
                  <small>{statusLabel(post.status)}</small>
                </div>
              ))}
            </div>
          </aside>
        </div>
      </main>

      {editorPage ? (
        <EditorWindow title={`${editorPage.label} 수정`} onClose={() => setEditor(null)}>
          <PageEditor page={editorPage} onChange={updatePage} />
        </EditorWindow>
      ) : null}

      {editorPost ? (
        <EditorWindow title={`${editor?.type === "notice" ? "공지사항" : "게시글"} 수정`} onClose={() => setEditor(null)}>
          <PostEditor
            post={editorPost}
            onChange={updatePost}
            onDelete={() => {
              deletePost(editorPost.id);
              setEditor(null);
            }}
          />
        </EditorWindow>
      ) : null}

      {editorMedia ? (
        <EditorWindow title="이미지 수정" onClose={() => setEditor(null)}>
          <MediaEditor
            media={editorMedia}
            onChange={updateMedia}
            onDelete={() => {
              deleteMedia(editorMedia.id);
              setEditor(null);
            }}
            onUpload={(file) => uploadMedia(editorMedia, file)}
            uploading={busy === "upload"}
          />
        </EditorWindow>
      ) : null}
    </div>
  );
}
