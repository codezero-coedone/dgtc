import React from "react";
import { adminSectionOptions } from "../../data/daekwangAdminData.js";
import { AdminIcon } from "./AdminIcons.jsx";

const menuGroups = ["콘텐츠 관리", "사이트 관리", "시스템 관리"].map((group) => ({
  label: group,
  items: adminSectionOptions.filter((section) => section.group === group),
}));

export function AdminSidebar({ activeSection = "dashboard", onSelectSection = () => {} }) {
  const dashboard = adminSectionOptions.find((section) => section.key === "dashboard");

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
        <button
          aria-current={activeSection === "dashboard" ? "page" : undefined}
          className={activeSection === "dashboard" ? "dk-nav-home is-active" : "dk-nav-home"}
          type="button"
          onClick={() => onSelectSection("dashboard")}
        >
          <AdminIcon name={dashboard?.icon ?? "Home"} />
          <span>{dashboard?.label ?? "대시보드"}</span>
        </button>
        {menuGroups.map((group) => (
          <div className="dk-menu-group" key={group.label}>
            <p>{group.label}</p>
            {group.items.map((item) => (
              <button
                aria-current={activeSection === item.key ? "page" : undefined}
                className={activeSection === item.key ? "is-active" : ""}
                key={item.key}
                type="button"
                onClick={() => onSelectSection(item.key)}
              >
                <AdminIcon name={item.icon} />
                <span>{item.label}</span>
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
