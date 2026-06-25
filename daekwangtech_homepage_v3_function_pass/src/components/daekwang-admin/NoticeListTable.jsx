import React, { useMemo, useState } from "react";
import { AdminIcon } from "./AdminIcons.jsx";

export function NoticeListTable({ notices, onEditNotice }) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const filteredNotices = useMemo(
    () =>
      notices.filter((notice) => {
        const queryMatch = notice.title.toLowerCase().includes(query.toLowerCase());
        const statusMatch = status === "all" || notice.status === status;
        return queryMatch && statusMatch;
      }),
    [notices, query, status],
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
        </div>
      </div>

      <div className="dk-table-scroll">
        <table>
          <thead>
            <tr>
              <th>번호</th>
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
                <td>{notice.title}</td>
                <td>
                  <span className={notice.status === "visible" ? "dk-notice-status visible" : "dk-notice-status"}>
                    {notice.status === "visible" ? "노출" : "비노출"}
                  </span>
                </td>
                <td>{notice.publishDate}</td>
                <td>{notice.createdAt}</td>
                <td>
                  <div className="dk-row-actions">
                    <button type="button" aria-label={`${notice.title} 수정`} onClick={() => onEditNotice(notice)}>
                      <AdminIcon name="Edit" size={16} />
                    </button>
                    <button type="button" aria-label={`${notice.title} 더보기`}>
                      <AdminIcon name="More" size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {!filteredNotices.length ? (
              <tr>
                <td colSpan="6" className="dk-empty-table">
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
