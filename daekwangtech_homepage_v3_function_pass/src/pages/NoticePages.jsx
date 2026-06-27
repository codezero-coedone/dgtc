import React, { useEffect, useMemo, useState } from "react";
import { DaekwangBrandBadge } from "../components/brand/DaekwangBrandBadge.jsx";
import { DaekwangLogoLockup } from "../components/brand/DaekwangLogoLockup.jsx";
import { NoticeCtaBlock } from "../components/notice/HomeNoticeSection.jsx";
import { getNoticeHref, getNoticeListHref, hasLocalAdminNoticeState, loadPublicNoticeData, loadServerPublicNoticeData, subscribeNoticePublicData } from "../utils/noticePublicData.js";

const categories = ["전체", "공지", "인증", "설비", "휴무", "기타"];
const sortOptions = [
  ["new", "최신순"],
  ["old", "오래된순"],
  ["pinned", "중요 공지 우선"],
];

function excerpt(content) {
  return String(content || "").replace(/\s+/g, " ").slice(0, 118);
}

function NoticeShell({ children, title = "공지사항", description = "대광테크의 주요 안내와 최신 소식을 확인하실 수 있습니다.", summary }) {
  return (
    <main className="notice-page">
      <section className="notice-hero">
        <div className="wrap notice-hero-grid">
          <div className="notice-hero-copy">
            <DaekwangBrandBadge label="NOTICE" />
            <nav>홈 &gt; 공지사항</nav>
            <h1>{title}</h1>
            <p>{description}</p>
          </div>
          <div className="notice-hero-card">
            <DaekwangLogoLockup size="md" tone="dark" />
            {summary || <p>정밀 제조 기업의 주요 안내를 공식 문서 톤으로 정리합니다.</p>}
          </div>
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
  const [sort, setSort] = useState("pinned");
  const [page, setPage] = useState(1);
  useEffect(() => {
    const unsubscribe = subscribeNoticePublicData(setData);
    if (!hasLocalAdminNoticeState()) {
      loadServerPublicNoticeData().then(setData).catch(() => null);
    }
    return unsubscribe;
  }, []);

  const filtered = useMemo(() => {
    const rows = data.visibleNotices.filter((notice) => {
      const q = `${notice.title} ${notice.content}`.toLowerCase().includes(query.toLowerCase());
      const c = category === "전체" || notice.category === category;
      return q && c;
    });
    return rows.sort((a, b) => {
      if (sort === "pinned" && a.isPinned !== b.isPinned) return a.isPinned ? -1 : 1;
      if (sort === "old") return String(a.publishDate).localeCompare(String(b.publishDate));
      return String(b.publishDate).localeCompare(String(a.publishDate));
    });
  }, [category, data.visibleNotices, query, sort]);

  const pageSize = 10;
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const visible = filtered.slice((page - 1) * pageSize, page * pageSize);
  const recent = data.visibleNotices[0]?.publishDate || "-";
  const pinned = filtered.filter((notice) => notice.isPinned).slice(0, 2);
  const summary = (
    <div className="notice-hero-metrics">
      <strong>{data.visibleNotices.length}</strong><small>공개 공지</small>
      <strong>{recent}</strong><small>최근 등록일</small>
      <strong>{data.visibleNotices.filter((item) => item.isPinned).length}</strong><small>중요 공지</small>
    </div>
  );

  return (
    <NoticeShell summary={summary}>
      <section className="notice-list-wrap wrap">
        {data.noticeCtaSettings.position === "top" ? <NoticeCtaBlock settings={data.noticeCtaSettings} /> : null}
        <div className="notice-toolbar premium">
          <div className="notice-stats"><strong>{filtered.length}</strong><span>검색 결과</span><i>최근 등록일 {recent}</i></div>
          <label className="notice-search"><span>검색</span><input value={query} placeholder="제목 또는 내용을 검색하세요" onChange={(event) => { setQuery(event.target.value); setPage(1); }} /></label>
          <select value={sort} onChange={(event) => { setSort(event.target.value); setPage(1); }}>
            {sortOptions.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
          </select>
        </div>
        <div className="notice-chip-row" aria-label="공지 카테고리">
          {categories.map((item) => (
            <button className={category === item ? "is-active" : ""} key={item} type="button" onClick={() => { setCategory(item); setPage(1); }}>
              {item}
            </button>
          ))}
        </div>
        {pinned.length ? (
          <div className="notice-pinned-grid">
            {pinned.map((notice) => (
              <a className="notice-pinned-card" href={getNoticeHref(notice.id)} key={notice.id}>
                <span>중요</span>
                <h2>{notice.title}</h2>
                <p>{excerpt(notice.content)}</p>
                <time>{notice.publishDate}</time>
              </a>
            ))}
          </div>
        ) : null}
        <div className="notice-list">
          {visible.map((notice) => (
            <a className={notice.isPinned ? "notice-row pinned" : "notice-row"} href={getNoticeHref(notice.id)} key={notice.id}>
              <span className="notice-category">{notice.category}</span>
              <div>
                <h2>{notice.isPinned ? <em>중요</em> : null}{notice.title}</h2>
                <p>{excerpt(notice.content)}</p>
              </div>
              <time>{notice.publishDate}</time>
              <b>자세히 보기</b>
            </a>
          ))}
          {!visible.length ? <NoticeEmpty onReset={() => { setQuery(""); setCategory("전체"); setSort("pinned"); }} /> : null}
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

function NoticeEmpty({ onReset }) {
  return (
    <div className="notice-empty">
      <DaekwangLogoLockup size="sm" tone="dark" />
      <strong>검색 결과가 없습니다.</strong>
      <p>조건을 조정하거나 전체 공지 목록을 다시 확인하세요.</p>
      <button type="button" onClick={onReset}>전체 공지 보기</button>
    </div>
  );
}

export function NoticeDetailPage({ noticeId }) {
  const [data, setData] = useState(() => loadPublicNoticeData());
  useEffect(() => {
    const unsubscribe = subscribeNoticePublicData(setData);
    if (!hasLocalAdminNoticeState()) {
      loadServerPublicNoticeData().then(setData).catch(() => null);
    }
    return unsubscribe;
  }, []);
  const notice = data.visibleNotices.find((item) => String(item.id) === String(noticeId));
  const index = data.visibleNotices.findIndex((item) => String(item.id) === String(noticeId));
  const prev = index > 0 ? data.visibleNotices[index - 1] : null;
  const next = index >= 0 && index < data.visibleNotices.length - 1 ? data.visibleNotices[index + 1] : null;

  if (!notice) {
      return (
      <NoticeShell title="공지사항을 찾을 수 없습니다" description="비노출되었거나 삭제된 공지사항입니다.">
        <section className="notice-detail-wrap wrap">
          <div className="notice-empty detail">
            <DaekwangLogoLockup size="sm" tone="dark" />
            <strong>공지사항을 찾을 수 없습니다.</strong>
            <p>비노출되었거나 삭제된 공지사항입니다.</p>
            <a href={getNoticeListHref()}>목록으로 돌아가기</a>
          </div>
        </section>
      </NoticeShell>
    );
  }

  return (
    <NoticeShell title="공지사항" description="대광테크의 주요 안내와 최신 소식입니다.">
      <article className="notice-detail-wrap wrap">
        <header className="notice-detail-head">
          <div className="notice-detail-brand"><DaekwangBrandBadge label="OFFICIAL NOTICE" /></div>
          <span>{notice.category}</span>
          {notice.isPinned ? <b>중요 공지</b> : null}
          <h1>{notice.title}</h1>
          <div><time>{notice.publishDate}</time><i>{notice.author || "대광테크"}</i><i>조회 {notice.viewCount || 0}</i></div>
          <div className="notice-detail-tools">
            <button type="button" onClick={() => navigator.clipboard?.writeText(window.location.href)}>공유</button>
            <button type="button" onClick={() => window.print()}>인쇄</button>
          </div>
        </header>
        <div className="notice-detail-body">{String(notice.content || "").split("\n").map((line, index) => <p key={`${line}-${index}`}>{line || "\u00A0"}</p>)}</div>
        <footer className="notice-detail-foot">
          <a href={getNoticeListHref()}>목록으로 돌아가기</a>
          <a href="#/">홈으로 이동</a>
        </footer>
        <div className="notice-neighbor">
          {prev ? <a href={getNoticeHref(prev.id)}>이전글 · {prev.title}</a> : <span>이전글 없음</span>}
          {next ? <a href={getNoticeHref(next.id)}>다음글 · {next.title}</a> : <span>다음글 없음</span>}
        </div>
      </article>
    </NoticeShell>
  );
}
