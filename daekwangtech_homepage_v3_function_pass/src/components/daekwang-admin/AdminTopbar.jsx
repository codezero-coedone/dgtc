import React from "react";
import { DaekwangLogoMark } from "../brand/DaekwangLogoMark.jsx";
import { AdminIcon } from "./AdminIcons.jsx";

export function AdminTopbar({
  authSession,
  onLogout,
  onSearchChange = () => {},
  onSelectSearchResult = () => {},
  searchResults = [],
  searchValue = "",
}) {
  const hasSearch = searchValue.trim().length > 0;

  return (
    <header className="dk-topbar">
      <div className="dk-topbar-title">
        <div className="dk-topbar-brandline">
          <DaekwangLogoMark size={34} />
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
          <span>시스템 정상</span>
        </div>
        <button className="dk-bell" type="button" aria-label="알림">
          <AdminIcon name="Bell" size={20} />
          <span>3</span>
        </button>
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
