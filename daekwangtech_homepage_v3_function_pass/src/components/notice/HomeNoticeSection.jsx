import React, { useEffect, useState } from "react";
import { DaekwangLogoMark } from "../brand/DaekwangLogoMark.jsx";
import { getNoticeHref, getNoticeListHref, hasLocalAdminNoticeState, loadPublicNoticeData, loadServerPublicNoticeData, subscribeNoticePublicData } from "../../utils/noticePublicData.js";

function excerpt(content) {
  return String(content || "").replace(/\s+/g, " ").slice(0, 86);
}

export function NoticeCtaBlock({ settings }) {
  if (!settings?.enabled) return null;
  return (
    <aside className={`notice-cta ${settings.style || "navyOutline"}`}>
      <DaekwangLogoMark size={40} tone={settings.style === "primary" ? "dark" : "light"} />
      <div>
        <strong>{settings.title}</strong>
        <p>{settings.description}</p>
      </div>
      <a href={settings.buttonUrl || getNoticeListHref()}>{settings.buttonLabel || "전체 공지사항 보기"}</a>
    </aside>
  );
}

export function HomeNoticeSection() {
  const [data, setData] = useState(() => loadPublicNoticeData());
  useEffect(() => {
    const unsubscribe = subscribeNoticePublicData(setData);
    if (!hasLocalAdminNoticeState()) {
      loadServerPublicNoticeData().then(setData).catch(() => null);
    }
    return unsubscribe;
  }, []);
  const latest = [...data.visibleNotices].sort((a, b) => Number(b.isPinned) - Number(a.isPinned)).slice(0, 4);
  if (!latest.length) return null;

  return (
    <section className="home-notice-section wrap">
      <div className="home-notice-head">
        <div className="section-intro">
          <p className="section-kicker">NOTICE</p>
          <h2>대광테크 소식</h2>
          <p>주요 공지와 기업 소식을 빠르게 확인하세요.</p>
        </div>
        <a className="detail-link" href={getNoticeListHref()}>전체 공지사항 보기 →</a>
      </div>
      <div className="home-notice-grid">
        {latest.map((notice) => (
          <a className="home-notice-card" href={getNoticeHref(notice.id)} key={notice.id}>
            <div className="home-notice-meta">
              <span>{notice.category}</span>
              {notice.isPinned ? <em>중요</em> : null}
            </div>
            <h3>{notice.title}</h3>
            <p>{excerpt(notice.content)}</p>
            <time>{notice.publishDate}</time>
          </a>
        ))}
      </div>
      <NoticeCtaBlock settings={data.noticeCtaSettings} />
    </section>
  );
}
