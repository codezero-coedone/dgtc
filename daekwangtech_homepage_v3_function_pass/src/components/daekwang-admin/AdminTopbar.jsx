import React from "react";
import { AdminIcon } from "./AdminIcons.jsx";

export function AdminTopbar() {
  return (
    <header className="dk-topbar">
      <div className="dk-topbar-title">
        <h1>대광테크 관리자 콘솔</h1>
        <p>웹사이트 콘텐츠 및 공지사항을 효율적으로 관리하세요.</p>
      </div>

      <div className="dk-topbar-tools">
        <label className="dk-search">
          <AdminIcon name="Search" size={18} />
          <input type="search" placeholder="검색 (메뉴, 공지, 이미지)" />
          <span>⌘ + K</span>
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
            <span>admin@daekwang.co.kr</span>
          </p>
        </div>
      </div>
    </header>
  );
}
