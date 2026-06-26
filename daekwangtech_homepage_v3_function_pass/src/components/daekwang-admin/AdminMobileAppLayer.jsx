import React from "react";
import { DaekwangLogoMark } from "../brand/DaekwangLogoMark.jsx";

function modeLabel(mode) {
  if (!mode) return "demo fallback";
  if (mode.includes("server")) return "server session";
  if (mode.includes("fallback")) return "demo fallback";
  return mode;
}

export function AdminMobileAppLayer({ activeSection, authSession, imageCount, noticeCount, recentLogs, onLogout, onNavigate }) {
  const navItems = [
    ["dashboard", "홈"],
    ["notices", "공지"],
    ["images", "이미지"],
    ["settings", "설정"],
    ["logs", "로그"],
  ];

  return (
    <>
      <section className="dk-admin-mobile-layer" aria-label="대광테크 관리자 모바일 앱 레이어">
        <div className="dk-admin-mobile-hero">
          <div className="dk-admin-mobile-brand">
            <DaekwangLogoMark size={38} tone="dark" />
            <div>
              <span>DAE KWANG TECH</span>
              <strong>관리자 앱</strong>
            </div>
          </div>
          <button className="dk-admin-mobile-logout" type="button" onClick={onLogout}>로그아웃</button>
        </div>

        <div className="dk-admin-mobile-status">
          <article>
            <span>Auth</span>
            <strong>{modeLabel(authSession?.mode)}</strong>
          </article>
          <article>
            <span>Notices</span>
            <strong>{noticeCount}건</strong>
          </article>
          <article>
            <span>Images</span>
            <strong>{imageCount}개</strong>
          </article>
        </div>

        <div className="dk-admin-mobile-actions">
          <button type="button" onClick={() => onNavigate("notices")}>공지 작성</button>
          <button type="button" onClick={() => onNavigate("images")}>이미지 관리</button>
          <button type="button" onClick={() => onNavigate("backups")}>백업</button>
        </div>

        <div className="dk-admin-mobile-recent">
          <div>
            <span>RECENT</span>
            <strong>최근 작업</strong>
          </div>
          {recentLogs.length ? (
            recentLogs.slice(0, 2).map((log) => (
              <p key={log.id}>
                <b>{log.title}</b>
                <small>{log.time || log.description}</small>
              </p>
            ))
          ) : (
            <p><b>작업 기록 없음</b><small>관리자 작업이 발생하면 표시됩니다.</small></p>
          )}
        </div>
      </section>

      <nav className="dk-admin-mobile-dock" aria-label="관리자 모바일 주요 메뉴">
        {navItems.map(([key, label]) => (
          <button key={key} className={activeSection === key ? "is-active" : ""} type="button" onClick={() => onNavigate(key)}>
            <i aria-hidden="true" />
            <span>{label}</span>
          </button>
        ))}
      </nav>
    </>
  );
}
