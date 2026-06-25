import React, { useEffect, useMemo, useState } from "react";
import { NoticeCtaBlock } from "../components/notice/HomeNoticeSection.jsx";
import { getNoticeHref, getNoticeListHref, loadPublicNoticeData, subscribeNoticePublicData } from "../utils/noticePublicData.js";

const categories = ["전체", "공지", "인증", "설비", "휴무", "기타"];

function excerpt(content) {
  return String(content || "").replace(/\s+/g, " ").slice(0, 118);
}

function NoticeShell({ children, title = "공지사항", description = "대광테크의 주요 안내와 최신 소식을 확인하실 수 있습니다." }) {
  return (
    <main className="notice-page">
      <section className="notice-hero">
        <div className="wrap">
          <nav>홈 &gt; 공지사항</nav>
          <h1>{title}</h1>
          <p>{description}</p>
        </div>
      </section>
      {children}
    </main>
  );
}

export function NoticeListPage() {
  const [data, setData] = useState(() => loadPublicNoticeData());
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("전체");
  const [page, setPage] = useState(1);
  useEffect(() => subscribeNoticePublicData(setData), []);

  const filtered = useMemo(() => {
    return data.visibleNotices.filter((notice) => {
      const q = `${notice.title} ${notice.content}`.toLowerCase().includes(query.toLowerCase());
      const c = category === "전체" || notice.category === category;
      return q && c;
    });
  }, [category, data.visibleNotices, query]);

  const pageSize = 10;
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const visible = filtered.slice((page - 1) * pageSize, page * pageSize);
  const recent = data.visibleNotices[0]?.publishDate || "-";

  return (
    <NoticeShell>
      <section className="notice-list-wrap wrap">
        {data.noticeCtaSettings.position === "top" ? <NoticeCtaBlock settings={data.noticeCtaSettings} /> : null}
        <div className="notice-toolbar">
          <div className="notice-stats"><strong>{filtered.length}</strong><span>전체 공지</span><i>최근 등록일 {recent}</i></div>
          <label><input value={query} placeholder="제목 또는 내용을 검색하세요" onChange={(event) => { setQuery(event.target.value); setPage(1); }} /></label>
          <select value={category} onChange={(event) => { setCategory(event.target.value); setPage(1); }}>
            {categories.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
        </div>
        <div className="notice-list">
          {visible.map((notice) => (
            <a className={notice.isPinned ? "notice-row pinned" : "notice-row"} href={getNoticeHref(notice.id)} key={notice.id}>
              <span>{notice.category}</span>
              <div><h2>{notice.isPinned ? "[고정] " : ""}{notice.title}</h2><p>{excerpt(notice.content)}</p></div>
              <time>{notice.publishDate}</time>
              <b>자세히 보기</b>
            </a>
          ))}
          {!visible.length ? <div className="notice-empty"><strong>검색 결과가 없습니다.</strong><a href={getNoticeListHref()} onClick={() => { setQuery(""); setCategory("전체"); }}>전체 공지 보기</a></div> : null}
        </div>
        <div className="notice-pagination">
          <button disabled={page === 1} type="button" onClick={() => setPage((value) => Math.max(1, value - 1))}>이전</button>
          <span>{page} / {totalPages}</span>
          <button disabled={page === totalPages} type="button" onClick={() => setPage((value) => Math.min(totalPages, value + 1))}>다음</button>
        </div>
        {data.noticeCtaSettings.position !== "top" ? <NoticeCtaBlock settings={data.noticeCtaSettings} /> : null}
      </section>
    </NoticeShell>
  );
}

export function NoticeDetailPage({ noticeId }) {
  const [data, setData] = useState(() => loadPublicNoticeData());
  useEffect(() => subscribeNoticePublicData(setData), []);
  const notice = data.visibleNotices.find((item) => String(item.id) === String(noticeId));
  const index = data.visibleNotices.findIndex((item) => String(item.id) === String(noticeId));
  const prev = index > 0 ? data.visibleNotices[index - 1] : null;
  const next = index >= 0 && index < data.visibleNotices.length - 1 ? data.visibleNotices[index + 1] : null;

  if (!notice) {
    return (
      <NoticeShell title="공지사항을 찾을 수 없습니다" description="비노출되었거나 삭제된 공지사항입니다.">
        <section className="notice-detail-wrap wrap">
          <div className="notice-empty detail"><strong>공지사항을 찾을 수 없습니다.</strong><a href={getNoticeListHref()}>목록으로 돌아가기</a></div>
        </section>
      </NoticeShell>
    );
  }

  return (
    <NoticeShell title="공지사항" description="대광테크의 주요 안내와 최신 소식입니다.">
      <article className="notice-detail-wrap wrap">
        <header className="notice-detail-head">
          <span>{notice.category}</span>
          <h1>{notice.title}</h1>
          <div><time>{notice.publishDate}</time><i>{notice.author || "대광테크"}</i><i>조회 {notice.viewCount || 0}</i></div>
        </header>
        <div className="notice-detail-body">{String(notice.content || "").split("\n").map((line, index) => <p key={`${line}-${index}`}>{line || "\u00A0"}</p>)}</div>
        <footer className="notice-detail-foot">
          <a href={getNoticeListHref()}>목록으로 돌아가기</a>
          <button type="button" onClick={() => window.print()}>인쇄</button>
        </footer>
        <div className="notice-neighbor">
          {prev ? <a href={getNoticeHref(prev.id)}>이전글 · {prev.title}</a> : <span>이전글 없음</span>}
          {next ? <a href={getNoticeHref(next.id)}>다음글 · {next.title}</a> : <span>다음글 없음</span>}
        </div>
      </article>
    </NoticeShell>
  );
}
