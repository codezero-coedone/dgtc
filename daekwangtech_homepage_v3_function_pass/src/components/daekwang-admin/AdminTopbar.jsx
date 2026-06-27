import React, { useMemo, useState } from "react";
import { DaekwangLogoLockup } from "../brand/DaekwangLogoLockup.jsx";
import { AdminIcon } from "./AdminIcons.jsx";

export function AdminTopbar({
  authSession,
  notifications = [],
  onLogout,
  onSearchChange = () => {},
  onSelectSearchResult = () => {},
  searchResults = [],
  searchValue = "",
}) {
  const [notificationOpen, setNotificationOpen] = useState(false);
  const hasSearch = searchValue.trim().length > 0;
  const isDemoMode = authSession?.serverAuth === false || String(authSession?.mode || "").includes("fallback");
  const notificationItems = useMemo(() => {
    const operational = isDemoMode
      ? [{
          id: "server-auth-hold",
          title: "Demo admin mode",
          description: "서버 인증이 구성되지 않아 데모 fallback으로 접속 중입니다.",
          time: "HOLD",
        }]
      : [];
    return [...operational, ...notifications].slice(0, 5);
  }, [isDemoMode, notifications]);
  const notificationCount = notificationItems.length;

  return (
    <header className="dk-topbar">
      <div className="dk-topbar-title">
        <div className="dk-topbar-brandline">
          <DaekwangLogoLockup size="sm" tone="dark" />
          <h1>대광테크 관리자 콘솔</h1>
        </div>
        <p>웹사이트 콘텐츠 및 공지사항을 효율적으로 관리하세요.</p>
      </div>

      <div className="dk-topbar-tools">
        <label className="dk-search">
          <AdminIcon name="Search" size={18} />
          <input type="search" placeholder="검색 (메뉴, 공지, 이미지)" value={searchValue} onChange={(event) => onSearchChange(event.target.value)} />
          <span>⌘ + K</span>
          {hasSearch ? (
            <div className="dk-search-results">
              {searchResults.length ? (
                searchResults.map((result) => (
                  <button key={`${result.kind}-${result.id}`} type="button" onClick={() => onSelectSearchResult(result)}>
                    <strong>{result.label}</strong>
                    <span>{result.kind} · {result.meta}</span>
                  </button>
                ))
              ) : (
                <p>검색 결과가 없습니다.</p>
              )}
            </div>
          ) : null}
        </label>
        <div className="dk-system-state">
          <i />
          <span>{isDemoMode ? "Demo admin mode" : "시스템 정상"}</span>
        </div>
        <div className="dk-notification-wrap">
          <button
            aria-expanded={notificationOpen ? "true" : "false"}
            className="dk-bell"
            type="button"
            aria-label={`알림 ${notificationCount}건`}
            onClick={() => setNotificationOpen((value) => !value)}
          >
            <AdminIcon name="Bell" size={20} />
            {notificationCount ? <span>{notificationCount}</span> : null}
          </button>
          {notificationOpen ? (
            <div className="dk-notification-panel" role="status">
              <div>
                <strong>관리자 알림</strong>
                <small>{notificationCount}건</small>
              </div>
              {notificationItems.length ? (
                notificationItems.map((item) => (
                  <article key={item.id}>
                    <b>{item.title}</b>
                    <p>{item.description}</p>
                    <time>{item.time}</time>
                  </article>
                ))
              ) : (
                <p className="dk-notification-empty">확인할 알림이 없습니다.</p>
              )}
            </div>
          ) : null}
        </div>
        <div className="dk-admin-profile">
          <div>관</div>
          <p>
            <strong>관리자</strong>
            <span>{authSession?.userId || "admin"} · admin@daekwang.co.kr</span>
          </p>
        </div>
        <button className="dk-logout-btn" type="button" onClick={onLogout}>로그아웃</button>
      </div>
    </header>
  );
}
