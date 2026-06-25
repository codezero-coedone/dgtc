import React from "react";
import { AdminIcon } from "./AdminIcons.jsx";

const menuGroups = [
  {
    label: "콘텐츠 관리",
    items: [
      ["Image", "이미지 관리", true],
      ["Megaphone", "공지사항 관리"],
      ["File", "페이지 관리"],
      ["Popup", "팝업 관리"],
    ],
  },
  {
    label: "사이트 관리",
    items: [
      ["Menu", "메뉴 관리"],
      ["Footer", "푸터 관리"],
      ["Settings", "기본 설정"],
      ["Seo", "SEO 설정"],
    ],
  },
  {
    label: "시스템 관리",
    items: [
      ["Users", "사용자 관리"],
      ["Log", "로그 관리"],
      ["Backup", "백업 관리"],
    ],
  },
];

export function AdminSidebar() {
  return (
    <aside className="dk-sidebar" aria-label="관리자 사이드바">
      <div className="dk-sidebar-brand">
        <div className="dk-logo-mark">
          <AdminIcon name="LogoD" size={25} />
        </div>
        <div>
          <strong>DAEKWANG TECH</strong>
          <span>대광테크</span>
        </div>
      </div>

      <nav className="dk-sidebar-nav" aria-label="관리 메뉴">
        <button className="dk-nav-home is-active" type="button">
          <AdminIcon name="Home" />
          <span>대시보드</span>
        </button>
        {menuGroups.map((group) => (
          <div className="dk-menu-group" key={group.label}>
            <p>{group.label}</p>
            {group.items.map(([icon, label, active]) => (
              <button className={active ? "is-active" : ""} key={label} type="button">
                <AdminIcon name={icon} />
                <span>{label}</span>
              </button>
            ))}
          </div>
        ))}
      </nav>

      <div className="dk-sidebar-footer">
        <span>Console v1.0.0</span>
        <button type="button" aria-label="사이드바 접기">
          <AdminIcon name="Chevron" size={17} />
        </button>
      </div>
    </aside>
  );
}
