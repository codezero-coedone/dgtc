import React from "react";
import { AdminIcon } from "./AdminIcons.jsx";

const activityIcons = {
  imageUpload: "Upload",
  noticeCreate: "Megaphone",
  noticeEdit: "Edit",
  imageReplace: "Refresh",
  login: "Shield",
  draftSave: "File",
};

export function RecentActivityPanel({ logs }) {
  return (
    <aside className="dk-panel dk-activity-panel">
      <div className="dk-activity-head">
        <h2 className="dk-section-title">최근 활동</h2>
        <button type="button">전체 보기 &gt;</button>
      </div>
      <div className="dk-activity-list">
        {logs.map((log) => (
          <article key={log.id}>
            <div className="dk-activity-icon">
              <AdminIcon name={activityIcons[log.type] ?? "Clock"} size={17} />
            </div>
            <div>
              <strong>{log.title}</strong>
              <p>{log.description}</p>
              <span>{log.user}</span>
            </div>
            <time>{log.time}</time>
          </article>
        ))}
      </div>
    </aside>
  );
}
