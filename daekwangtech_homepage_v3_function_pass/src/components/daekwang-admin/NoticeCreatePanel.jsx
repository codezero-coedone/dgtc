import React from "react";
import { AdminIcon } from "./AdminIcons.jsx";

export function NoticeCreatePanel({ draft, error, editingNoticeId, onChange, onSubmit, onSaveDraft }) {
  return (
    <section className="dk-panel dk-notice-create">
      <h2 className="dk-section-title">공지사항 등록</h2>
      <form onSubmit={onSubmit}>
        <label>
          제목 *
          <input
            value={draft.title}
            placeholder="공지사항 제목을 입력하세요."
            onChange={(event) => onChange({ ...draft, title: event.target.value })}
          />
        </label>
        <div className="dk-form-row">
          <label>
            게시일 *
            <input
              type="date"
              value={draft.publishDate}
              onChange={(event) => onChange({ ...draft, publishDate: event.target.value })}
            />
          </label>
          <label>
            노출 여부
            <select
              value={draft.visible ? "visible" : "hidden"}
              onChange={(event) => onChange({ ...draft, visible: event.target.value === "visible" })}
            >
              <option value="visible">노출</option>
              <option value="hidden">비노출</option>
            </select>
          </label>
        </div>
        <label>
          내용 *
          <div className="dk-editor-toolbar" aria-label="본문 편집 도구">
            <select aria-label="문단 스타일" defaultValue="body">
              <option value="body">본문</option>
              <option value="heading">제목</option>
            </select>
            <button type="button">B</button>
            <button type="button">I</button>
            <button type="button">U</button>
            <button type="button">
              <AdminIcon name="Menu" size={15} />
            </button>
            <button type="button">
              <AdminIcon name="Seo" size={15} />
            </button>
            <button type="button">
              <AdminIcon name="Image" size={15} />
            </button>
          </div>
          <textarea
            value={draft.content}
            placeholder="공지사항 내용을 입력하세요."
            onChange={(event) => onChange({ ...draft, content: event.target.value })}
          />
        </label>
        {error ? <p className="dk-form-error">{error}</p> : null}
        <div className="dk-form-actions">
          <button className="dk-secondary-btn" type="button" onClick={onSaveDraft}>
            임시저장
          </button>
          <button className="dk-primary-btn" type="submit">
            {editingNoticeId ? "수정 반영" : "공지 등록"}
          </button>
        </div>
      </form>
    </section>
  );
}
