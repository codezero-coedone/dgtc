import React, { useEffect, useState } from "react";
import { getNoticeHref, getNoticeListHref, loadPublicNoticeData, subscribeNoticePublicData } from "../../utils/noticePublicData.js";

function excerpt(content) {
  return String(content || "").replace(/\s+/g, " ").slice(0, 86);
}

export function NoticeCtaBlock({ settings }) {
  if (!settings?.enabled) return null;
  return (
    <aside className={`notice-cta ${settings.style || "navyOutline"}`}>
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
  useEffect(() => subscribeNoticePublicData(setData), []);
  const latest = data.visibleNotices.slice(0, 4);
  if (!latest.length) return null;

  return (
    <section className="home-notice-section wrap">
      <div className="section-intro">
        <p className="section-kicker">NOTICE</p>
        <h2>대광테크 소식</h2>
        <p>주요 공지와 기업 소식을 빠르게 확인하세요.</p>
        <a className="detail-link" href={getNoticeListHref()}>전체 공지사항 보기 →</a>
      </div>
      <div className="home-notice-grid">
        {latest.map((notice) => (
          <a className="home-notice-card" href={getNoticeHref(notice.id)} key={notice.id}>
            <span>{notice.category}</span>
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
