import React from "react";
import { AdminIcon } from "./AdminIcons.jsx";

const noticeCategories = ["공지", "인증", "설비", "휴무", "기타"];
const templates = {
  blank: "",
  operation: "안녕하세요. 대광테크입니다.\n\n운영 일정과 관련해 아래와 같이 안내드립니다.\n\n- 대상:\n- 기간:\n- 참고 사항:\n\n정확한 일정 확인 후 업무에 참고해 주시기 바랍니다.",
  facility: "대광테크 생산 인프라와 관련된 안내입니다.\n\n이번 변경 사항은 안정적인 품질과 생산 대응력을 높이기 위한 조치입니다.\n\n주요 내용:\n- 설비/공정:\n- 적용 일정:\n- 기대 효과:",
  quality: "대광테크 품질 운영 기준과 관련해 안내드립니다.\n\n품질 관리 체계 고도화를 위해 아래 사항을 적용합니다.\n\n- 적용 범위:\n- 관리 기준:\n- 시행 일정:",
};

export function NoticeCreatePanel({ draft, error, editingNoticeId, onChange, onSubmit, onSaveDraft, onCancelEdit, onPreview, onOpenPublic }) {
  return (
    <section className="dk-panel dk-notice-create">
      <div className="dk-panel-head">
        <h2 className="dk-section-title">{editingNoticeId ? "공지사항 수정" : "공지사항 등록"}</h2>
        <div className="dk-panel-controls">
          <button type="button" onClick={onPreview}>
            <AdminIcon name="Eye" size={16} />
            미리보기
          </button>
          <button type="button" onClick={onOpenPublic}>
            공개 페이지
          </button>
        </div>
      </div>
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
            템플릿
            <select
              defaultValue="blank"
              onChange={(event) => {
                const content = templates[event.target.value];
                if (content) onChange({ ...draft, content });
              }}
            >
              <option value="blank">템플릿 선택</option>
              <option value="operation">운영 안내</option>
              <option value="facility">설비 안내</option>
              <option value="quality">품질 안내</option>
            </select>
          </label>
          <label>
            카테고리
            <select value={draft.category || "공지"} onChange={(event) => onChange({ ...draft, category: event.target.value })}>
              {noticeCategories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </label>
          <label>
            상단 고정
            <select
              value={draft.isPinned ? "pinned" : "normal"}
              onChange={(event) => onChange({ ...draft, isPinned: event.target.value === "pinned" })}
            >
              <option value="normal">일반</option>
              <option value="pinned">상단 고정</option>
            </select>
          </label>
        </div>
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
            {editingNoticeId ? "수정 완료" : "공지 등록"}
          </button>
        </div>
        {editingNoticeId ? (
          <button className="dk-text-btn" type="button" onClick={onCancelEdit}>
            수정 취소
          </button>
        ) : null}
      </form>
    </section>
  );
}
