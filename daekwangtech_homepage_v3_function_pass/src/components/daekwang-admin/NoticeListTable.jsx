import React, { useMemo, useState } from "react";
import { AdminIcon } from "./AdminIcons.jsx";

const categories = ["all", "공지", "인증", "설비", "휴무", "기타"];

export function NoticeListTable({ notices, onEditNotice, onDeleteNotice, onToggleNotice, onPreviewNotice, onOpenPublicNotice }) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [category, setCategory] = useState("all");
  const [pinned, setPinned] = useState("all");
  const [sort, setSort] = useState("new");
  const filteredNotices = useMemo(
    () => {
      const rows = notices.filter((notice) => {
        const queryMatch = notice.title.toLowerCase().includes(query.toLowerCase());
        const statusMatch = status === "all" || notice.status === status;
        const categoryMatch = category === "all" || notice.category === category;
        const pinnedMatch = pinned === "all" || (pinned === "pinned" ? notice.isPinned : !notice.isPinned);
        return queryMatch && statusMatch && categoryMatch && pinnedMatch;
      });
      return rows.sort((a, b) => {
        if (sort === "pinned" && a.isPinned !== b.isPinned) return a.isPinned ? -1 : 1;
        if (sort === "old") return String(a.publishDate).localeCompare(String(b.publishDate));
        return String(b.publishDate).localeCompare(String(a.publishDate));
      });
    },
    [category, notices, pinned, query, sort, status],
  );

  return (
    <section className="dk-panel dk-notice-list">
      <div className="dk-panel-head">
        <h2 className="dk-section-title">공지사항 목록</h2>
        <div className="dk-table-tools">
          <label>
            <AdminIcon name="Search" size={16} />
            <input value={query} placeholder="제목 검색" onChange={(event) => setQuery(event.target.value)} />
          </label>
          <select value={status} onChange={(event) => setStatus(event.target.value)} aria-label="공지 상태 필터">
            <option value="all">전체 상태</option>
            <option value="visible">노출</option>
            <option value="hidden">비노출</option>
          </select>
          <select value={category} onChange={(event) => setCategory(event.target.value)} aria-label="공지 카테고리 필터">
            {categories.map((item) => <option key={item} value={item}>{item === "all" ? "전체 분류" : item}</option>)}
          </select>
          <select value={pinned} onChange={(event) => setPinned(event.target.value)} aria-label="중요 공지 필터">
            <option value="all">전체 중요도</option>
            <option value="pinned">중요 공지</option>
            <option value="normal">일반 공지</option>
          </select>
          <select value={sort} onChange={(event) => setSort(event.target.value)} aria-label="공지 정렬">
            <option value="new">최신순</option>
            <option value="old">오래된순</option>
            <option value="pinned">중요 공지 우선</option>
          </select>
        </div>
      </div>

      <div className="dk-table-scroll">
        <table>
          <thead>
            <tr>
              <th>번호</th>
              <th>분류</th>
              <th>제목</th>
              <th>상태</th>
              <th>게시일</th>
              <th>작성일</th>
              <th>수정</th>
            </tr>
          </thead>
          <tbody>
            {filteredNotices.map((notice) => (
              <tr key={notice.id}>
                <td>{notice.id}</td>
                <td>{notice.category || "공지"}</td>
                <td>{notice.title}</td>
                <td>
                  <button className="dk-status-button" type="button" onClick={() => onToggleNotice?.(notice)}>
                    <span className={notice.status === "visible" ? "dk-notice-status visible" : "dk-notice-status"}>
                      {notice.status === "visible" ? "노출" : "비노출"}
                    </span>
                  </button>
                </td>
                <td>{notice.publishDate}</td>
                <td>{notice.createdAt}</td>
                <td>
                  <div className="dk-row-actions">
                    <button type="button" aria-label={`${notice.title} 미리보기`} onClick={() => onPreviewNotice?.(notice)}>
                      <AdminIcon name="Eye" size={16} />
                    </button>
                    <button type="button" aria-label={`${notice.title} 공개 보기`} onClick={() => onOpenPublicNotice?.(notice)}>
                      <AdminIcon name="Seo" size={16} />
                    </button>
                    <button type="button" aria-label={`${notice.title} 수정`} onClick={() => onEditNotice(notice)}>
                      <AdminIcon name="Edit" size={16} />
                    </button>
                    <button className="danger" type="button" aria-label={`${notice.title} 삭제`} onClick={() => onDeleteNotice?.(notice)}>
                      <AdminIcon name="Trash" size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {!filteredNotices.length ? (
              <tr>
                <td colSpan="7" className="dk-empty-table">
                  검색 조건에 맞는 공지사항이 없습니다.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>

      <div className="dk-pagination">
        <button type="button" disabled>
          Prev
        </button>
        <button className="is-active" type="button">
          1
        </button>
        <button type="button">2</button>
        <button type="button">3</button>
        <button type="button">Next</button>
        <select defaultValue="10" aria-label="페이지당 표시 개수">
          <option value="10">10 / 페이지</option>
          <option value="20">20 / 페이지</option>
        </select>
      </div>
    </section>
  );
}
