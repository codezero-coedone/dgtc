import React, { useEffect, useId, useMemo, useReducer, useState } from "react";
import "./admin-tokens.css";
import { cloneContent, defaultAdminContent, loadStoredContent, saveStoredContent } from "./adminContentSeed.js";
import { tokenGroups } from "./designTokens.js";
import { initialPanelState, panelReducer } from "./panelState.js";

const panels = [
  ["dashboard", "상태"],
  ["homepage", "홈페이지"],
  ["pages", "페이지"],
  ["posts", "게시글"],
  ["design", "디자인 토큰"],
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

  useEffect(() => {
    dispatch({ type: "READY" });
  }, []);

  const selectedPage = useMemo(
    () => content.pages.find((page) => page.id === machine.selectedPageId) ?? content.pages[0],
    [content.pages, machine.selectedPageId],
  );
  const homePage = content.pages.find((page) => page.id === "index") ?? content.pages[0];
  const selectedPost = content.posts.find((post) => post.id === machine.selectedPostId) ?? content.posts[0];

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

  const updateToken = (key, value) => {
    markEdit({ ...content, tokens: { ...content.tokens, [key]: value } }, "디자인 토큰을 수정했습니다.");
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

  const deletePost = (id) => {
    markEdit({ ...content, posts: content.posts.filter((post) => post.id !== id) }, "게시글을 삭제했습니다.");
    dispatch({ type: "SELECT_POST", postId: content.posts.find((post) => post.id !== id)?.id ?? null });
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
      setContent(parsed);
      dispatch({ type: "IMPORT" });
    } catch (error) {
      dispatch({ type: "ERROR", error: error instanceof Error ? error.message : "JSON 형식 오류" });
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
            <span>Panel State + Design Tokens</span>
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
          이 콘솔은 React/Vite SPA 내부 관리자입니다. 서버 저장소가 없으므로 저장은 현재 브라우저 초안이며, 공개 반영은 JSON export 후 빌드/배포가 필요합니다.
        </div>
      </aside>

      <main className="admin-main">
        <div className="admin-topbar">
          <div>
            <h1>{activeLabel}</h1>
            <p>홈페이지 문구, 페이지 메타, 게시글 초안, 디자인 토큰을 한 곳에서 관리합니다.</p>
          </div>
          <div className="admin-actions">
            <button className="admin-button" type="button" onClick={preview}>
              미리보기
            </button>
            <button className="admin-button" type="button" onClick={exportJson}>
              JSON 갱신
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
                <p>현재 관리자 UI의 패널 전환, dirty 상태, 저장/미리보기/가져오기 이벤트를 단일 상태머신으로 관리합니다.</p>
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

            {machine.activePanel === "design" ? (
              <>
                <h2>디자인 토큰 시스템</h2>
                <p>현재 v3 공개 사이트의 CSS에서 역추출한 제조업 톤 토큰을 관리자 화면과 공개 초안 미리보기에 같이 사용합니다.</p>
                <div className="admin-token-grid">
                  {Object.entries(content.tokens).map(([key, value]) => (
                    <div className="admin-field" key={key}>
                      <label>{key}</label>
                      <input value={value} onChange={(event) => updateToken(key, event.target.value)} />
                      <div className="admin-token-swatch" style={{ background: key === "radius" ? "#fff" : value, borderRadius: key === "radius" ? value : undefined }} />
                    </div>
                  ))}
                </div>
                <h2 style={{ marginTop: 24 }}>역추출 토큰 기준</h2>
                <div className="admin-token-source-grid">
                  {tokenGroups.map((group) => (
                    <article className="admin-token-source" key={group.title}>
                      <h3>{group.title}</h3>
                      {group.items.map(([label, value]) => (
                        <div key={`${group.title}-${label}`}>
                          <span>{label}</span>
                          <code>{value}</code>
                        </div>
                      ))}
                    </article>
                  ))}
                </div>
              </>
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
              <h2>상태</h2>
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
              <h2>게시글 상태</h2>
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
